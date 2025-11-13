import type { Response } from "express";
import path from "path";
import db from "../db";
import { supabase } from "../supabaseClient";

const AVATAR_BUCKET = process.env.SUPABASE_AVATAR_BUCKET || "avatars";

export const uploadProfileImage = async (req: any, res: Response) => {
  const userId = res.locals.userId;
  if (!userId) {
    return res.status(401).json({ err: "Unauthorized" });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({ err: "No file uploaded" });
  }

  try {
    const ext =
      path.extname(file.originalname).toLowerCase() ||
      (file.mimetype === "image/png"
        ? ".png"
        : file.mimetype === "image/webp"
        ? ".webp"
        : ".jpg");

    const filePath = `avatars/${userId}-${Date.now()}${ext}`;

    const { error } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return res.status(500).json({ err: "Failed to upload image" });
    }

    const { data: publicData } = supabase.storage
      .from(AVATAR_BUCKET)
      .getPublicUrl(filePath);

    const profileImageUrl = publicData.publicUrl;

    const q = `
      UPDATE public.users
      SET profile_image_url = $1
      WHERE id = $2
      RETURNING id, username, profile_image_url;
    `;
    const r = await db.query(q, [profileImageUrl, userId]);

    if (r.rowCount === 0) {
      return res.status(404).json({ err: "User not found" });
    }

    return res.status(200).json({
      user: r.rows[0],
      profileImageUrl,
    });
  } catch (e: any) {
    console.error("Profile image upload failed:", e?.message || e);
    return res
      .status(500)
      .json({ err: e?.message || "Internal server error" });
  }
};