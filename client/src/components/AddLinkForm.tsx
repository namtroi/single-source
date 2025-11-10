import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addLink } from '../features/links/linksSlice';

// This component renders a form to add new links to the dashboard
export default function AddLinkForm() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ title: '', url: '' });
  const [err, setErr] = useState('');

   // Handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload
    if (!form.title || !form.url) return setErr('Both fields are required.');
    setErr('');
    // @ts-ignore
    await dispatch(addLink(form)); // dispatch async thunk to add a link
    setForm({ title: '', url: '' }); // reset form after submission
  };

// Render the form inputs and submit button
  return (
    <form onSubmit={onSubmit} className="space-y-2">
      {err && <div className="text-sm text-red-600">{err}</div>}
      <input
        className="border p-2 rounded w-full"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
      />
      <input
        className="border p-2 rounded w-full"
        placeholder="https://example.com"
        value={form.url}
        onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
      />
      <button className="bg-blue-600 text-white rounded px-3 py-2">
        Add Link
      </button>
    </form>
  );
}