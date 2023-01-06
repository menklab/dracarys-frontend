import { API_ROUTES } from "~/constants/api_routes";
import { ApiException } from "~/interfaces/error";
import isApiException from "~/utils/isApiException";

// FE usage only
export default async function deleteProgram(programId: number): Promise<void> {
  const res = await fetch(API_ROUTES.PROGRAM(programId), { method: "DELETE", credentials: "include" });
  if (!res.ok) {
    const exception = (await res.json()) as ApiException;
    if (isApiException(exception)) throw exception;
  }
}
