import { owner, parentSuite } from 'allure-js-commons';

export type AllureLayer = 'UI' | 'API';

export interface AllureMetadata {
  layer: AllureLayer;
  owner: string;
}

/** Applies Allure labels for Suites (layer → describe) and owner. */
export async function allureMetadata(meta: AllureMetadata): Promise<void> {
  await parentSuite(meta.layer);
  await owner(meta.owner);
}

/** TestRail / traceability — use in test title or call in test body */
export function tmsLink(id: string): string {
  return `@TmsLink:${id}`;
}

/** Allure owner label helper */
export const Owner = {
  Bookstore: 'bookstore-qa',
} as const;
