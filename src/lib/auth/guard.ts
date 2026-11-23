import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { HttpError } from "@/lib/http";

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new HttpError(401, "Please log in.");
  return user;
}

export async function requireBrand(id: string) {
  const user = await requireUser();
  const brand = db.brands.get(id);
  if (!brand || brand.userId !== user.id) throw new HttpError(404, "Brand not found.");
  return { user, brand };
}
