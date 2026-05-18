import { owner, feature } from 'allure-js-commons';

/** Allure metadata — single entry point (replaces deprecated `allure` from allure-playwright) */
export const allure = { owner, feature };

/** TestRail / traceability — use in test title or call in test body */
export function tmsLink(id: string): string {
  return `@TmsLink:${id}`;
}

/** Allure owner label helper */
export const Owner = {
  Bookstore: 'bookstore-qa',
} as const;
