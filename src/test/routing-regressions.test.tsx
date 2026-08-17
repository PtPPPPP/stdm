import { act } from 'react';
import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router-dom';
import AthleteDetailPage from '../pages/AthleteDetailPage';
import ComparePage from '../pages/ComparePage';

function getInlineScript(filePath: string, scriptId: string): string {
  const html = readFileSync(filePath, 'utf-8');
  const match = html.match(
    new RegExp(`<script id="${scriptId}">([\\s\\S]*?)<\\/script>`)
  );

  if (!match) {
    throw new Error(`Script ${scriptId} not found in ${filePath}`);
  }

  return match[1];
}

function createStorage(initialValues: Record<string, string> = {}) {
  const values = new Map(Object.entries(initialValues));

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

describe('routing regressions', () => {
  it('supports valid → invalid → valid athlete routes without changing Hook order', async () => {
    const router = createMemoryRouter(
      [{ path: '/athletes/:id', element: <AthleteDetailPage /> }],
      { initialEntries: ['/athletes/noah-lyles'] }
    );

    render(<RouterProvider router={router} />);

    expect(await screen.findByText('技术风格画像')).toBeDefined();

    await act(async () => {
      await router.navigate('/athletes/not-a-real-athlete');
    });
    expect(screen.getByRole('heading', { name: '运动员未找到' })).toBeDefined();

    await act(async () => {
      await router.navigate('/athletes/noah-lyles');
    });
    expect(await screen.findByText('技术风格画像')).toBeDefined();
  });

  it('uses the deployment base path for Compare page internal navigation', () => {
    render(
      <MemoryRouter basename="/stdm" initialEntries={['/stdm/compare']}>
        <ComparePage />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: '运动员图鉴' }).getAttribute('href')).toBe(
      '/stdm/athletes'
    );
  });

  it('preserves a Pages route, query, and hash through the 404 fallback', () => {
    const script = getInlineScript('public/404.html', 'github-pages-route-fallback');
    const storage = createStorage();
    const replace = vi.fn();
    const windowStub = {
      location: {
        pathname: '/stdm/athletes/noah-lyles',
        search: '?tab=results',
        hash: '#season-best',
        replace,
      },
    };

    new Function('window', 'sessionStorage', script)(windowStub, storage);

    expect(storage.getItem('stdm:redirect-path')).toBe(
      '/stdm/athletes/noah-lyles?tab=results#season-best'
    );
    expect(replace).toHaveBeenCalledWith('/stdm/');
  });

  it('does not turn missing asset requests into SPA routes', () => {
    const script = getInlineScript('public/404.html', 'github-pages-route-fallback');
    const storage = createStorage();
    const replace = vi.fn();
    const windowStub = {
      location: {
        pathname: '/stdm/assets/missing.js',
        search: '',
        hash: '',
        replace,
      },
    };

    new Function('window', 'sessionStorage', script)(windowStub, storage);

    expect(storage.getItem('stdm:redirect-path')).toBeNull();
    expect(replace).not.toHaveBeenCalled();
  });

  it('restores the saved Pages route before React Router initializes', () => {
    const script = getInlineScript('index.html', 'github-pages-route-restore');
    const storage = createStorage({
      'stdm:redirect-path': '/stdm/compare?from=404#selectors',
    });
    const replaceState = vi.fn();
    const windowStub = { history: { replaceState } };

    new Function('window', 'sessionStorage', script)(windowStub, storage);

    expect(storage.getItem('stdm:redirect-path')).toBeNull();
    expect(replaceState).toHaveBeenCalledWith(
      null,
      '',
      '/stdm/compare?from=404#selectors'
    );
  });
});
