import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import dogRoutes from '../routes/dogRoutes';
import { getDogImage } from '../controllers/dogController';

vi.mock('../controllers/dogController', () => ({
  getDogImage: vi.fn(),
}));

const app = express();
app.use('/api/dogs', dogRoutes);

describe('dogRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET returns 200', async () => {
    const image = 'https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg';

    vi.mocked(getDogImage).mockImplementation(async (_req, res) => {
      res.json({
        success: true,
        data: { imageUrl: image, status: 'success' },
      });
    });

    const response = await request(app).get('/api/dogs/random');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.imageUrl).toContain(image);
    expect(getDogImage).toHaveBeenCalledOnce();
  });


  it('GET returns 500 on fail', async () => {
    vi.mocked(getDogImage).mockImplementation(async (_req, res) => {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dog image: Network error',
      });
    });

    const response = await request(app).get('/api/dogs/random');

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeDefined();
    expect(response.body.error).toBe('Failed to fetch dog image: Network error');
  });
});