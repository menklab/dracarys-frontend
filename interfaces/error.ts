import { ErrorType } from "~/enums/error";

export interface ApiException {
  type: ErrorType;
  errors: Error[];
  data?: any;
}

export interface Error {
  message: string;
  code?: string;
  path?: string;
}
