import { test as base } from '@playwright/test';

/** TestRail / traceability — use in test title or call in test body */
export function tmsLink(id: string): string {
  return `@TmsLink:${id}`;
}

/** Allure owner label helper */
export const Owner = {
  Bookstore: 'bookstore-qa',
} as const;

export const test = base.extend({
  tms: async ({}, use, testInfo) => {
    const match = testInfo.title.match(/@TmsLink:(\w+)/);
    if (match) {
      testInfo.annotations.push({ type: 'tms', description: match[1] });
    }
    await use(undefined);
  },
});
