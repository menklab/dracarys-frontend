export const API_ROUTES = {
  REQUEST_MESSAGE: () => `${process.env.NEXT_PUBLIC_NEST_HOST}/api/auth/requestMessage`,
  VALIDATE_MESSAGE: () => `${process.env.NEXT_PUBLIC_NEST_HOST}/api/auth/validateMessage`,
  PROGRAMS: () => `${process.env.NEXT_PUBLIC_NEST_HOST}/api/program`,
  PROGRAM: (programId: number) => `${process.env.NEXT_PUBLIC_NEST_HOST}/api/program/${programId}`,
  ACCOUNTS_LIST: (programId: number) => `${process.env.NEXT_PUBLIC_NEST_HOST}/api/account?programId=${programId}`,
  ACCOUNTS: () => `${process.env.NEXT_PUBLIC_NEST_HOST}/api/account`,
  ACCOUNT: (accountId: number) => `${process.env.NEXT_PUBLIC_NEST_HOST}/api/account/${accountId}`,
} as const;
