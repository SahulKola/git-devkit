import { appConfig } from './app.config';

describe('appConfig', () => {
  it('registers browser error listeners, router, and hydration providers', () => {
    expect(appConfig.providers).toBeDefined();
    expect(Array.isArray(appConfig.providers)).toBe(true);
    expect(appConfig.providers?.length).toBe(3);
    expect(appConfig.providers?.every((provider) => provider)).toBe(true);
  });
});
