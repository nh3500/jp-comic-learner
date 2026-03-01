import request from 'supertest';
import { app, tokenizerReady } from '../index';

beforeAll(async () => {
  await tokenizerReady;
}, 30000);

describe('POST /tokenize', () => {
  test('tokenizes Japanese sentence', async () => {
    const res = await request(app)
      .post('/tokenize')
      .send({ text: '今日はいい天気ですね' });

    expect(res.status).toBe(200);
    expect(res.body.tokens).toBeInstanceOf(Array);
    expect(res.body.tokens.length).toBeGreaterThan(0);
    expect(res.body.tokens[0]).toHaveProperty('surface');
    expect(res.body.tokens[0]).toHaveProperty('reading');
    expect(res.body.tokens[0]).toHaveProperty('pos');
    expect(res.body.tokens[0]).toHaveProperty('basic');
  });

  test('returns 400 for missing text', async () => {
    const res = await request(app).post('/tokenize').send({});
    expect(res.status).toBe(400);
  });

  test('tokenizes manga dialogue', async () => {
    const res = await request(app)
      .post('/tokenize')
      .send({ text: '俺は海賊王になる' });

    expect(res.status).toBe(200);
    const surfaces = res.body.tokens.map((t: any) => t.surface);
    expect(surfaces.join('')).toBe('俺は海賊王になる');
  });
});

describe('GET /health', () => {
  test('returns health status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ready');
  });
});
