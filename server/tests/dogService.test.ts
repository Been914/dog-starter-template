import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getRandomDogImage } from '../services/dogService';

const IMAGE = 'https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg';

describe('dogService', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('return image and statksus from dog API', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ message: IMAGE, status: 'success' }),
    });

    const result = await getRandomDogImage();

    expect(result.imageUrl).toBe(IMAGE);
    expect(result.status).toBe('success');
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  
  it('throws when the API gives 500', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 });

    const promise = getRandomDogImage();

    await expect(promise).rejects.toThrow(/^Failed to fetch dog image/);
  });
});