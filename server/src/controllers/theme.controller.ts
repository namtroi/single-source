import type { Response } from "express";
import db from "../db";
// simple validation (no zod)
const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const RGB =
  /^rgb\(\s*(2[0-4]\d|25[0-5]|1?\d?\d)\s*,\s*(2[0-4]\d|25[0-5]|1?\d?\d)\s*,\s*(2[0-4]\d|25[0-5]|1?\d?\d)\s*\)$/i;

export const updateTheme = async (req: any, res: Response) => {
  const userId = res.locals.userId;
  if (!userId) return res.status(401).json({ err: "Unauthorized" });

  const { theme } = req.body;
  if (!theme || typeof theme !== "string" || !theme.trim()) {
    return res.status(400).json({ err: "Theme value required" });
  }
  console.log("🧠 DEBUG updateTheme", {
    userId: res.locals.userId,
    body: req.body,
  });
  try {
    const q = `
      UPDATE users
      SET theme_preference = to_jsonb($1::text)
      WHERE id = $2
      RETURNING id, theme_preference;
    `;
    const r = await db.query(q, [theme.trim(), userId]);

    if (r.rowCount === 0) {
      return res.status(404).json({ err: "User not found" });
    }

    return res.status(200).json(r.rows[0]);
  } catch (e: any) {
    console.error("Theme update failed:", e?.message || e);
    return res.status(500).json({ err: e?.message || "Internal server error" });
  }
};
