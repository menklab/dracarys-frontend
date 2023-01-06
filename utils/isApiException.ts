import { ErrorType } from "~/enums/error";
import { Error } from "~/interfaces/error";

export default function isApiException(object: any): boolean {
  if (!("type" in object && "errors" in object)) return false;
  if (!Object.values(ErrorType).includes(object.type)) return false;
  if (!Array.isArray(object.errors)) return false;
  if (!object.errors.every((error: Error) => "message" in error)) return false;
  return true;
}
