export const Environment = {
  baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
  apiUrl: process.env.API_URL ?? process.env.BASE_URL ?? 'http://localhost:3000',
} as const;
