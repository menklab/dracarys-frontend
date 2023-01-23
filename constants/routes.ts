export const ROUTES = {
  HOME: () => "/",
  LOGIN: () => "/login",
  PROGRAMS: () => "/programs",
  ACCOUNTS: (programId: number) => `/programs/${programId}/accounts`,
  ACCOUNT: (programId: number, accountId: number) => `/programs/${programId}/account/${accountId}`,
  INSTRUCTIONS: (programId: number) => `/programs/${programId}/instructions`,
} as const;
