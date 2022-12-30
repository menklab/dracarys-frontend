export const ROUTES = {
  HOME: () => "/",
  LOGIN: () => "/login",
  PROGRAMS: () => "/programs",
  PROGRAM: (programId: number) => `/programs/${programId}`,
} as const;
