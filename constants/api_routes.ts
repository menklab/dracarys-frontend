export const API_ROUTES = {
  REQUEST_MESSAGE: () => `${process.env.NEST_HOST}/api/auth/requestMessage`,
  VALIDATE_MESSAGE: () => `${process.env.NEST_HOST}/api/auth/validateMessage`,
  PROGRAM: (programId: number) => `${process.env.NEST_HOST}/api/program/${programId}`,
  PROGRAMS: () => `${process.env.NEST_HOST}/api/program`,
  ACCOUNTS: () => `${process.env.NEST_HOST}/api/account`,
  ACCOUNTS_ELEMENTS: () => `${process.env.NEST_HOST}/api/account-element`,
  INSTRUCTION: () => `${process.env.NEST_HOST}/api/instruction`,
  INSTRUCTION_ELEMENT: () => `${process.env.NEST_HOST}/api/instruction-element`,
} as const;
