import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteLink, updateLink } from '../features/links/linksSlice';

// This component renders a single link item with edit and delete functionality
export default function LinkItem({ link }: { link: { id: string; title: string; url: string } }) {
  const dispatch = useDispatch(); // initialize Redux dispatch
  const [editing, setEditing] = useState(false); // track if link is in edit mode
  const [draft, setDraft] = useState({ title: link.title, url: link.url });

  
  // Save updated link to the backend and Redux store
  const onSave = async () => {
    // @ts-ignore
    await dispatch(updateLink(link.id, draft));
    setEditing(false);
  };

    // Delete link from backend and Redux store
  const onDelete = async () => {
    // @ts-ignore
    await dispatch(deleteLink(link.id));
  };

   // Render link item with conditional editing view
  return (
    <li className="border rounded p-3 flex items-start gap-3">
      <div className="flex-1">
        {editing ? (
          <div className="space-y-2">
            <input
              className="border p-2 rounded w-full"
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            />
            <input
              className="border p-2 rounded w-full"
              value={draft.url}
              onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))}
            />
          </div>
        ) : (
          <>
            <a href={link.url} target="_blank" rel="noreferrer" className="font-medium underline">
              {link.title}
            </a>
            <div className="text-xs text-gray-500">{link.url}</div>
          </>
        )}
      </div>

      <div className="flex gap-2">
        {editing ? (
          <>
            <button className="px-3 py-2 rounded bg-black text-white" onClick={onSave}>
              Save
            </button>
            <button className="px-3 py-2 rounded border" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="px-3 py-2 rounded border" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button className="px-3 py-2 rounded bg-red-600 text-white" onClick={onDelete}>
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}