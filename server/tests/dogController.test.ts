import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { getDogImage } from '../controllers/dogController';
import { getRandomDogImage } from '../services/dogService';

vi.mock('../services/dogService', () => ({
  getRandomDogImage: vi.fn(),
}));

describe('dogController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('successful data returned by the service', async () => {
    const mockData = {
      imageUrl: 'https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg',
      status: 'success',
    };
    vi.mocked(getRandomDogImage).mockResolvedValue(mockData);

    const req = {} as Request;
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as Response;

    await getDogImage(req, res);
    expect(getRandomDogImage).toHaveBeenCalledOnce();
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockData,
    });
  });
});