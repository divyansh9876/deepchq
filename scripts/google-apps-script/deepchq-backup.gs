/**
 * Deepchq → Google Drive + Google Sheets backup
 *
 * Setup: see docs/GOOGLE-BACKUP.md
 *
 * Deploy: Deploy → New deployment → Web app
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * Set BACKUP_SECRET below, then paste the Web app URL into Render as DATABASE_BACKUP_URL
 */

const BACKUP_SECRET = "PASTE_SAME_AS_DATABASE_BACKUP_SECRET";
const DRIVE_FOLDER_NAME = "Deepchq Backups";
const SPREADSHEET_NAME = "Deepchq Data";

function doPost(e) {
  var sheetErrors = [];
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: "Empty request body" });
    }

    var payload = JSON.parse(e.postData.contents);
    if (payload.backupSecret !== BACKUP_SECRET) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }

    var db = payload.database;
    if (!db) {
      return jsonResponse({ ok: false, error: "Missing database" });
    }

    var exportedAt = payload.exportedAt || new Date().toISOString();
    var folder = getOrCreateFolder(DRIVE_FOLDER_NAME);
    var filename = payload.filename || "deepchq-backup.json";

    // 1) Save JSON snapshot to Drive
    var file = folder.createFile(
      filename,
      JSON.stringify(db, null, 2),
      MimeType.PLAIN_TEXT,
    );
    pruneOldDriveFiles(folder, 60);

    // 2) Sync readable rows to Google Sheets (errors here won't block JSON backup)
    var ss;
    var spreadsheetUrl = "";
    try {
      ss = getOrCreateSpreadsheet(folder, SPREADSHEET_NAME);
      spreadsheetUrl = ss.getUrl();
      sheetErrors = syncAllSheets(ss, db);
    } catch (sheetErr) {
      sheetErrors.push(
        sheetErr && sheetErr.message ? sheetErr.message : String(sheetErr),
      );
    }

    return jsonResponse({
      ok: sheetErrors.length === 0,
      exportedAt: exportedAt,
      driveFileId: file.getId(),
      spreadsheetUrl: spreadsheetUrl,
      stats: payload.stats || {},
      sheetErrors: sheetErrors,
    });
  } catch (err) {
    return jsonResponse({
      ok: false,
      error: err && err.message ? err.message : String(err),
      sheetErrors: sheetErrors,
    });
  }
}

/** Manual test: Run → testBackup in Apps Script editor */
function testBackup() {
  var fakeDb = {
    users: [
      {
        id: "usr_test",
        email: "test@example.com",
        planTier: "free",
        authProvider: "email",
        createdAt: new Date().toISOString(),
      },
    ],
    funnelSessions: [],
    searches: [],
    subscriptions: [],
  };
  var e = {
    postData: {
      contents: JSON.stringify({
        backupSecret: BACKUP_SECRET,
        exportedAt: new Date().toISOString(),
        filename: "deepchq-test.json",
        database: fakeDb,
      }),
    },
  };
  var result = doPost(e);
  Logger.log(result.getContent());
}

function syncAllSheets(ss, db) {
  var errors = [];
  var jobs = [
    function () {
      syncUsersSheet(ss, db.users || []);
    },
    function () {
      syncLeadsSheet(ss, db.funnelSessions || []);
    },
    function () {
      syncSearchesSheet(ss, db.searches || []);
    },
    function () {
      syncSubscriptionsSheet(ss, db.subscriptions || [], db.users || []);
    },
  ];

  for (var i = 0; i < jobs.length; i++) {
    try {
      jobs[i]();
    } catch (err) {
      errors.push(err && err.message ? err.message : String(err));
    }
  }

  // Remove default empty "Sheet1" if we created real tabs
  var defaultSheet = ss.getSheetByName("Sheet1");
  if (defaultSheet && ss.getSheets().length > 1) {
    try {
      ss.deleteSheet(defaultSheet);
    } catch (ignore) {}
  }

  return errors;
}

function getOrCreateFolder(name) {
  var folders = DriveApp.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(name);
}

function getOrCreateSpreadsheet(folder, name) {
  var files = folder.getFilesByName(name);
  while (files.hasNext()) {
    var f = files.next();
    if (f.getMimeType() === MimeType.GOOGLE_SHEETS) {
      return SpreadsheetApp.open(f);
    }
  }

  var ss = SpreadsheetApp.create(name);
  var file = DriveApp.getFileById(ss.getId());
  folder.addFile(file);
  try {
    DriveApp.getRootFolder().removeFile(file);
  } catch (ignore) {}

  return ss;
}

function syncUsersSheet(ss, users) {
  var sheet = getOrCreateTab(ss, "Users", [
    "id",
    "email",
    "planTier",
    "authProvider",
    "createdAt",
  ]);
  var rows = users.map(function (u) {
    return [
      cell(u.id),
      cell(u.email),
      cell(u.planTier),
      cell(u.authProvider),
      cell(u.createdAt),
    ];
  });
  writeSheet(sheet, rows);
}

function syncLeadsSheet(ss, sessions) {
  var sheet = getOrCreateTab(ss, "Funnel Leads", [
    "id",
    "email",
    "fullName",
    "platform",
    "step",
    "utm_campaign",
    "gclid",
    "fbclid",
    "createdAt",
  ]);
  var rows = sessions.map(function (s) {
    var utm = {};
    try {
      utm = s.utmJson ? JSON.parse(s.utmJson) : {};
    } catch (e) {}
    return [
      cell(s.id),
      cell(s.email),
      cell(s.fullName),
      cell(s.platform),
      cell(s.step),
      cell(utm.utm_campaign),
      cell(s.gclid),
      cell(s.fbclid),
      cell(s.createdAt),
    ];
  });
  writeSheet(sheet, rows);
}

function syncSearchesSheet(ss, searches) {
  var sheet = getOrCreateTab(ss, "Searches", [
    "id",
    "queryName",
    "queryEmail",
    "status",
    "mode",
    "userId",
    "funnelSessionId",
    "createdAt",
    "completedAt",
  ]);
  var rows = searches.map(function (s) {
    return [
      cell(s.id),
      cell(s.queryName),
      cell(s.queryEmail),
      cell(s.status),
      cell(s.mode),
      cell(s.userId),
      cell(s.funnelSessionId),
      cell(s.createdAt),
      cell(s.completedAt),
    ];
  });
  writeSheet(sheet, rows);
}

function syncSubscriptionsSheet(ss, subs, users) {
  var emailByUserId = {};
  users.forEach(function (u) {
    emailByUserId[u.id] = u.email;
  });

  var sheet = getOrCreateTab(ss, "Subscriptions", [
    "id",
    "userEmail",
    "plan",
    "interval",
    "status",
    "razorpayId",
    "currentPeriodEnd",
    "createdAt",
  ]);
  var rows = subs.map(function (s) {
    return [
      cell(s.id),
      cell(emailByUserId[s.userId] || s.userId),
      cell(s.plan),
      cell(s.interval),
      cell(s.status),
      cell(s.stripeSubscriptionId),
      cell(s.currentPeriodEnd),
      cell(s.createdAt),
    ];
  });
  writeSheet(sheet, rows);
}

function getOrCreateTab(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  sheet.setFrozenRows(1);
  return sheet;
}

function writeSheet(sheet, rows) {
  if (!rows.length) return;
  var numRows = rows.length;
  var numCols = rows[0].length;
  // endRow must be startRow + numRows - 1 (row 2 is first data row)
  sheet.getRange(2, 1, numRows + 1, numCols).setValues(rows);
}

function cell(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function pruneOldDriveFiles(folder, keep) {
  var files = [];
  var it = folder.getFiles();
  while (it.hasNext()) {
    var f = it.next();
    if (f.getName().indexOf("deepchq") === 0) {
      files.push(f);
    }
  }
  files.sort(function (a, b) {
    return b.getDateCreated() - a.getDateCreated();
  });
  for (var i = keep; i < files.length; i++) {
    files[i].setTrashed(true);
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
