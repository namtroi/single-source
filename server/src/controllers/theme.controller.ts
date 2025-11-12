import type { Response } from "express";
import db from "../db";

// simple validation (no zod)
const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const RGB =
  /^rgb\(\s*(2[0-4]\d|25[0-5]|1?\d?\d)\s*,\s*(2[0-4]\d|25[0-5]|1?\d?\d)\s*,\s*(2[0-4]\d|25[0-5]|1?\d?\d)\s*\)$/i;
const isColor = (v: string) => HEX.test(v) || RGB.test(v);

function validateTheme(body: any): { ok: boolean; err?: string } {
  if (!body || typeof body !== "object")
    return { ok: false, err: "Theme must be an object" };
  if (!body.name || typeof body.name !== "string" || !body.name.trim())
    return { ok: false, err: "Theme name required" };
  return { ok: true };
}

// PUT /api/users/theme  (auth required)
export const updateTheme = async (req: any, res: Response) => {
  const userId = res.locals.userId;
  if (!userId) return res.status(401).json({ err: "Unauthorized" });
  const v = validateTheme(req.body);
  if (!v.ok) return res.status(400).json({ err: v.err });

  // define the object BEFORE using it
  const theme_preference = {
    name: String(req.body.name).trim(),
  };

  try {
    const q = `
  UPDATE public.users
  SET theme_preference = COALESCE(theme_preference, '{}'::jsonb) || $1::jsonb
  WHERE id = $2
  RETURNING id, theme_preference;
`;
    const r = await db.query(q, [JSON.stringify(theme_preference), userId]);

    if (r.rowCount === 0)
      return res.status(404).json({ err: "User not found" });
    return res.status(200).json(r.rows[0]);
  } catch (e: any) {
    console.error("Theme update failed:", e?.message || e);
    return res.status(500).json({ err: e?.message || "Internal server error" });
  }
};
