import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLinks } from '../features/links/linksSlice';
import AddLinkForm from '../components/AddLinkForm';
import LinkList from '../components/LinkList';
import type { RootState } from '../app/store';

// This component renders the user's dashboard with their saved links
export default function Dashboard() {
  // Access Redux dispatch and select state data from the links slice
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((s: RootState) => s.links);

   // Fetch links when the component first mounts
  useEffect(() => {
    // @ts-ignore (using untyped dispatch)
    dispatch(fetchLinks());
  }, [dispatch]);


    // Render dashboard layout, loading/error states, and link list
  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <AddLinkForm />
      {isLoading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}
      <LinkList />
    </div>
  );
}