describe('main bootstrap', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('bootstraps the app', async () => {
    const bootstrapApplication = vi.fn().mockResolvedValue(undefined);
    vi.doMock('@angular/platform-browser', async (importOriginal) => {
      const actual = await importOriginal<typeof import('@angular/platform-browser')>();
      return {
        ...actual,
        bootstrapApplication,
      };
    });

    await import('./main');

    expect(bootstrapApplication).toHaveBeenCalledTimes(1);
  });

  it('logs bootstrap errors', async () => {
    const expected = new Error('bootstrap failed');
    const bootstrapApplication = vi.fn().mockRejectedValue(expected);

    vi.doMock('@angular/platform-browser', async (importOriginal) => {
      const actual = await importOriginal<typeof import('@angular/platform-browser')>();
      return {
        ...actual,
        bootstrapApplication,
      };
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await import('./main');

    await Promise.resolve();

    expect(bootstrapApplication).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(expected);
  });
});
