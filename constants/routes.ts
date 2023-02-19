export const ROUTES = {
  HOME: () => "/",
  LOGIN: () => "/login",
  TERMS: () => "/terms",
  PRIVACY: () => "/privacy",
  PROGRAMS: () => "/programs",
  ACCOUNTS: (programId: number) => `/programs/${programId}/accounts`,
  ACCOUNT: (programId: number, accountId: number) => `/programs/${programId}/account/${accountId}`,
  INSTRUCTIONS: (programId: number) => `/programs/${programId}/instructions`,
  INSTRUCTION: (programId: number, instructionId: number) => `/programs/${programId}/instruction/${instructionId}`,
} as const;
