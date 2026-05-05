import { appConfig } from './app.config';
import { config } from './app.config.server';

describe('server config', () => {
  it('merges application and server providers', () => {
    const appProviders = appConfig.providers ?? [];
    const serverProviders = config.providers ?? [];

    expect(serverProviders.length).toBeGreaterThan(appProviders.length);
    expect(serverProviders.length).toBe(appProviders.length + 1);
  });
});
