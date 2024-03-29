export const API_ROUTES = {
  REQUEST_MESSAGE: () => `${process.env.NEST_HOST}/api/auth/requestMessage`,
  VALIDATE_MESSAGE: () => `${process.env.NEST_HOST}/api/auth/validateMessage`,
  LOGOUT: () => `${process.env.NEST_HOST}/api/auth/logout`,
  PROGRAM: (programId: number) => `${process.env.NEST_HOST}/api/program/${programId}`,
  GENERATE_CODE_ACCOUNT: () => `${process.env.NEST_HOST}/api/account/generate-code`,
  GENERATE_CODE_INSTRUCTION: () => `${process.env.NEST_HOST}/api/instruction/generate-code`,
  PROGRAMS: () => `${process.env.NEST_HOST}/api/program`,
  ACCOUNTS: () => `${process.env.NEST_HOST}/api/account`,
  ACCOUNTS_LINKS: () => `${process.env.NEST_HOST}/api/account/links`,
  ACCOUNTS_ELEMENTS: () => `${process.env.NEST_HOST}/api/account-element`,
  GENERIC_TYPES: (programId: number) =>
    `${process.env.NEST_HOST}/api/instruction-element/generic-types?programId=${programId}`,
  INSTRUCTION: () => `${process.env.NEST_HOST}/api/instruction`,
  INSTRUCTION_ELEMENT: () => `${process.env.NEST_HOST}/api/instruction-element`,
} as const;
