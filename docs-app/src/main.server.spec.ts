describe('main.server bootstrap', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('calls bootstrapApplication with server config and context', async () => {
    const bootstrapApplication = vi.fn().mockResolvedValue(undefined);
    vi.doMock('@angular/platform-browser', async (importOriginal) => {
      const actual = await importOriginal<typeof import('@angular/platform-browser')>();
      return {
        ...actual,
        bootstrapApplication,
      };
    });

    const { default: bootstrap } = await import('./main.server');
    const context = {} as any;

    await bootstrap(context);

    expect(bootstrapApplication).toHaveBeenCalledTimes(1);
    expect(bootstrapApplication.mock.calls[0][2]).toBe(context);
  });
});
