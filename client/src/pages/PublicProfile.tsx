import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../api/apiService';

type PublicLink = { title?: string; url: string };
type PublicProfileDTO = { username: string; links: PublicLink[] };

type ProfileState = {
  loading: boolean;
  notFound: boolean;
  error: string | null;
  profile: PublicProfileDTO | null;
};

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const [state, setState] = useState<ProfileState>({
    loading: true,
    notFound: false,
    error: null,
    profile: null,
  });

  // tiny helper so updates are concise
  const patch = (partial: Partial<ProfileState>) =>
    setState((prev) => ({ ...prev, ...partial }));

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!username) return;
      patch({ loading: true, error: null, notFound: false });

      try {
        const data = await apiService.getUserByUsername(username);
        if (!cancelled) patch({ profile: data, loading: false });
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : 'Failed to load profile.';
        if (/not\s*found/i.test(msg)) patch({ notFound: true, loading: false });
        else patch({ error: msg, loading: false });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [username]);

  const { loading, notFound, error, profile } = state;

  if (loading) {
    return (
      <div className='max-w-xl mx-auto'>
        <p className='opacity-70'>Loading profile…</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className='max-w-xl mx-auto'>
        <h1 className='text-2xl font-bold mb-2'>User not found</h1>
        <p className='mb-4'>
          We couldn’t find <strong>@{username}</strong>. Double-check the URL or
          try another username.
        </p>
        <button
          onClick={() => navigate('/', { replace: true })}
          className='border rounded px-3 py-2'
        >
          Go home
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-xl mx-auto'>
        <h1 className='text-2xl font-bold mb-2'>Something went wrong</h1>
        <p className='text-red-600'>{error}</p>
      </div>
    );
  }

  const { username: profileUsername, links = [] } = profile ?? {};

  const displayName = profileUsername || `@${username}`;

  console.log('profile', profile);

  return (
    <div className='max-w-xl mx-auto'>
      <img
        src='/avatar.jpg'
        width={100}
        height={100}
        className='rounded-full mx-auto mb-4'
      />
      <h1 className='text-3xl font-bold mb-4 text-center'>@{displayName}</h1>
      {links.length === 0 ? (
        <p className='opacity-70'>No links yet.</p>
      ) : (
        <ul className='space-y-3'>
          {links.map((link, i) => (
            <li key={`${link.url}-${i}`}>
              <a
                href={link.url}
                target='_blank'
                rel='noopener noreferrer'
                className='block border rounded p-3 hover:opacity-90'
              >
                <div className='font-medium'>{link.title || link.url}</div>
                <div className='text-sm opacity-70 truncate'>{link.url}</div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
