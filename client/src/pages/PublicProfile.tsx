import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../api/apiService";
import ChangeTheme from "../components/changeTheme";
// Define link and profile DTO types for the public profile page
type PublicLink = { title?: string; url: string };
type PublicProfileDTO = {
  username: string;
  links: PublicLink[];
  profile_image_url?: string;
};

// Local component state shape for loading/error/notFound/profile
type ProfileState = {
  loading: boolean;
  notFound: boolean;
  error: string | null;
  profile: PublicProfileDTO | null;
};

// This component renders a public-facing profile page for a given username
export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  // uploading states
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("/avatar.jpg");
  const [state, setState] = useState<ProfileState>({
    loading: true,
    notFound: false,
    error: null,
    profile: null,
  });

  // tiny helper so updates are concise
  const patch = (partial: Partial<ProfileState>) =>
    setState((prev) => ({ ...prev, ...partial }));

  // Fetch the public profile when the username changes (or on first mount)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!username) return;
      patch({ loading: true, error: null, notFound: false });

      try {
        const data = await apiService.getUserByUsername(username);
        if (!cancelled) {
          patch({ profile: data, loading: false });
          // Load the profile picture from the database
          if (data.profile_image_url) {
            setAvatarUrl(data.profile_image_url);
          }
        }
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : "Failed to load profile.";
        if (/not\s*found/i.test(msg)) patch({ notFound: true, loading: false });
        else patch({ error: msg, loading: false });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [username]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file");
      return;
    }

    // Validate file size (2MB max, matching your backend)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image must be less than 2MB");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const response = await apiService.uploadProfilePicture(file);
      console.log("Backend response:", response); // ADD THIS LINE
      setAvatarUrl(response.profileImageUrl); // Update the displayed image
      console.log("✅ Upload successful:", response.avatarUrl);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const { loading, notFound, error, profile } = state;

  // Render loading state
  if (loading) {
    return (
      <div className="max-w-xl mx-auto">
        <p className="opacity-70">Loading profile…</p>
      </div>
    );
  }

  // Render not-found state with a back/home action
  if (notFound) {
    return (
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">User not found</h1>
        <p className="mb-4">
          We couldn't find <strong>@{username}</strong>. Double-check the URL or
          try another username.
        </p>
        <button
          onClick={() => navigate("/", { replace: true })}
          className="border rounded px-3 py-2">
          Go home
        </button>
      </div>
    );
  }

  // Render generic error state
  if (error) {
    return (
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const { username: profileUsername, links = [] } = profile ?? {};

  const displayName = profileUsername || `@${username}`;

  console.log("profile", profile);

  // Render the public profile with avatar and link list
  return (
    <div className="max-w-xl mx-auto">
      <ChangeTheme />

      <div className="flex flex-col items-center mb-4">
        <img
          src={avatarUrl}
          width={100}
          height={100}
          className="rounded-full mb-2"
          alt="Profile"
        />

        <input
          id="fileInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
          disabled={uploading}
        />

        <label
          htmlFor="fileInput"
          className={`bg-blue-100 dark:bg-blue-900 calm:bg-calm-primary
            p-2 rounded cursor-pointer 
            hover:bg-blue-200 dark:hover:bg-blue-800 calm:hover:bg-calm-primary-hover
            transition-colors
            ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
          {uploading ? "Uploading..." : "Upload Profile Picture"}
        </label>

        {uploadError && (
          <p className="text-red-600 dark:text-red-400 calm:text-calm-danger text-sm mt-2">
            {uploadError}
          </p>
        )}
      </div>

      <h1
        className="flex justify-center text-3xl font-bold mb-4 
        text-gray-900 dark:text-gray-100 calm:text-calm-text">
        @{displayName}
      </h1>

      {/* FIX: Correct conditional list rendering structure */}
      {links.length === 0 ? (
        <p
          className="flex justify-center opacity-70 
          text-gray-700 dark:text-gray-300 calm:text-calm-text-muted">
          No links yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {links.map((link, i) => (
            <li key={`${link.url}-${i}`}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-gray-300 dark:border-gray-700 calm:border-calm-border
                  rounded p-3 
                  bg-white dark:bg-gray-800 calm:bg-calm-surface
                  hover:opacity-90
                  transition-colors">
                <div className="font-medium text-gray-900 dark:text-gray-100 calm:text-calm-text">
                  {link.title || link.url}
                </div>
                <div className="text-sm opacity-70 truncate text-gray-600 dark:text-gray-400 calm:text-calm-text-muted">
                  {link.url}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
