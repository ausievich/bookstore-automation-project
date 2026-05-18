/**
 * Base helpers for UI and API test suites.
 * Extend via fixtures in fixtures.ts rather than inheritance when possible.
 */
export abstract class AbstractTest {
  protected static readonly domain = 'Online Bookstore';
}
