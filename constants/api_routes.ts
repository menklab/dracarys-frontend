export const API_ROUTES = {
  REQUEST_MESSAGE: () => `${process.env.NEST_HOST}/api/auth/requestMessage`,
  VALIDATE_MESSAGE: () => `${process.env.NEST_HOST}/api/auth/validateMessage`,
  PROGRAM: (programId: number) => `${process.env.NEST_HOST}/api/program/${programId}`,
  PROGRAMS: () => `${process.env.NEST_HOST}/api/program`,
} as const;
