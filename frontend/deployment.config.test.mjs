import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deploymentConfig } from './deployment.config.mjs';
test('local development stays unchanged', () => assert.deepEqual(deploymentConfig({}), {}));
test('hosted builds reject local or insecure API URLs', () => {
  for (const value of ['http://localhost:5000/', 'http://127.0.0.1:5000/', 'https://localhost/', 'http://api.akoode.com/']) {
    assert.throws(() => deploymentConfig({ VERCEL: '1', NEXT_PUBLIC_API_URL: value }));
  }
});
test('hosted URLs have consistent trailing slashes and HTTPS defaults', () => {
  const config = deploymentConfig({ VERCEL: '1', NEXT_PUBLIC_API_URL: 'https://akoode-chatbot.vercel.app/backend-api' });
  assert.equal(config.NEXT_PUBLIC_API_URL, 'https://akoode-chatbot.vercel.app/backend-api/');
  assert.equal(config.NEXT_PUBLIC_FRONTEND_API_URL, 'https://api.akoode.com/frontend/');
});
