/**
 * Deepchq → Google Drive + Google Sheets backup
 *
 * Setup: see docs/GOOGLE-BACKUP.md
 *
 * Deploy: Extensions → Apps Script → Deploy → New deployment → Web app
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * Set BACKUP_SECRET below, then paste the Web app URL into Render as DATABASE_BACKUP_URL
 */

const BACKUP_SECRET = "PASTE_SAME_AS_DATABASE_BACKUP_SECRET";
const DRIVE_FOLDER_NAME = "Deepchq Backups";
const SPREADSHEET_NAME = "Deepchq Data";

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    if (payload.backupSecret !== BACKUP_SECRET) {
      return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
    }

    const db = payload.database;
    if (!db) {
      return jsonResponse({ ok: false, error: "Missing database" }, 400);
    }

    const exportedAt = payload.exportedAt || new Date().toISOString();
    const folder = getOrCreateFolder(DRIVE_FOLDER_NAME);
    const filename = payload.filename || "deepchq-backup.json";

    // 1) Save JSON snapshot to Drive
    const file = folder.createFile(
      filename,
      JSON.stringify(db, null, 2),
      MimeType.PLAIN_TEXT,
    );

    // Keep last 60 JSON backups in folder
    pruneOldDriveFiles(folder, 60);

    // 2) Sync readable rows to Google Sheets
    const ss = getOrCreateSpreadsheet(SPREADSHEET_NAME);
    syncUsersSheet(ss, db.users || []);
    syncLeadsSheet(ss, db.funnelSessions || []);
    syncSearchesSheet(ss, db.searches || []);
    syncSubscriptionsSheet(ss, db.subscriptions || [], db.users || []);

    return jsonResponse({
      ok: true,
      exportedAt,
      driveFileId: file.getId(),
      spreadsheetUrl: ss.getUrl(),
      stats: payload.stats || {},
    });
  } catch (err) {
    return jsonResponse(
      { ok: false, error: err && err.message ? err.message : String(err) },
      500,
    );
  }
}

function getOrCreateFolder(name) {
  const folders = DriveApp.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(name);
}

function getOrCreateSpreadsheet(name) {
  const files = DriveApp.getFilesByName(name);
  while (files.hasNext()) {
    const f = files.next();
    if (f.getMimeType() === MimeType.GOOGLE_SHEETS) {
      return SpreadsheetApp.open(f);
    }
  }
  const ss = SpreadsheetApp.create(name);
  const file = DriveApp.getFileById(ss.getId());
  getOrCreateFolder(DRIVE_FOLDER_NAME).addFile(file);
  DriveApp.getRootFolder().removeFile(file);
  return ss;
}

function syncUsersSheet(ss, users) {
  const sheet = getOrCreateTab(ss, "Users", [
    "id",
    "email",
    "planTier",
    "authProvider",
    "createdAt",
  ]);
  const rows = users.map(function (u) {
    return [u.id, u.email, u.planTier, u.authProvider || "", u.createdAt || ""];
  });
  writeSheet(sheet, rows);
}

function syncLeadsSheet(ss, sessions) {
  const sheet = getOrCreateTab(ss, "Funnel Leads", [
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
  const rows = sessions.map(function (s) {
    var utm = {};
    try {
      utm = s.utmJson ? JSON.parse(s.utmJson) : {};
    } catch (e) {}
    return [
      s.id,
      s.email || "",
      s.fullName || "",
      s.platform || "",
      s.step,
      utm.utm_campaign || "",
      s.gclid || "",
      s.fbclid || "",
      s.createdAt || "",
    ];
  });
  writeSheet(sheet, rows);
}

function syncSearchesSheet(ss, searches) {
  const sheet = getOrCreateTab(ss, "Searches", [
    "id",
    "queryName",
    "queryEmail",
    "status",
    "mode",
    "userId",
    "platform",
    "createdAt",
    "completedAt",
  ]);
  const rows = searches.map(function (s) {
    return [
      s.id,
      s.queryName,
      s.queryEmail || "",
      s.status,
      s.mode,
      s.userId || "",
      s.funnelSessionId || "",
      s.createdAt || "",
      s.completedAt || "",
    ];
  });
  writeSheet(sheet, rows);
}

function syncSubscriptionsSheet(ss, subs, users) {
  const emailByUserId = {};
  users.forEach(function (u) {
    emailByUserId[u.id] = u.email;
  });

  const sheet = getOrCreateTab(ss, "Subscriptions", [
    "id",
    "userEmail",
    "plan",
    "interval",
    "status",
    "razorpayId",
    "currentPeriodEnd",
    "createdAt",
  ]);
  const rows = subs.map(function (s) {
    return [
      s.id,
      emailByUserId[s.userId] || s.userId,
      s.plan,
      s.interval,
      s.status,
      s.stripeSubscriptionId || "",
      s.currentPeriodEnd || "",
      s.createdAt || "",
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
  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
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

function jsonResponse(obj, code) {
  var out = ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
  return out;
}
