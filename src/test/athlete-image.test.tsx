import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { athletes } from '../data';
import AthleteImage from '../components/athletes/AthleteImage';

describe('athlete images', () => {
  it('loads a new source after the previous athlete image failed', () => {
    const { rerender } = render(<AthleteImage athlete={athletes[0]} variant="compare" />);
    fireEvent.error(screen.getByRole('img'));
    expect(screen.queryByRole('img')).toBeNull();
    rerender(<AthleteImage athlete={athletes[1]} variant="compare" />);
    expect(screen.getByRole('img').getAttribute('src')).toBe(athletes[1].image?.src);
  });
});
