export const ROUTES = {
  HOME: () => "/",
  LOGIN: () => "/login",
  PROGRAMS: () => "/programs",
  ACCOUNTS: (programId: number) => `/programs/${programId}/accounts`,
  INSTRUCTIONS: (programId: number) => `/programs/${programId}/instructions`,
} as const;
