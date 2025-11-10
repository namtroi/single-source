import { useSelector } from 'react-redux';
import LinkItem from './LinkItem.tsx';
import type { RootState } from '../app/store';

// This component renders the list of all user links from the Redux store
export default function LinkList() {
  const items = useSelector((s: RootState) => s.links.items);

   // If there are no links, show a placeholder message
  if (!items.length) return <p className="text-sm text-gray-500">No links yet.</p>;

    // Render a list of LinkItem components
  return (
    <ul className="space-y-2">
      {items.map((l) => (
        <LinkItem key={l.id} link={l} />
      ))}
    </ul>
  );
}
