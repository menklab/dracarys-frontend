import { API_ROUTES } from "~/constants/api_routes";
import { ApiException } from "~/interfaces/error";
import isApiException from "~/utils/isApiException";

interface CreateProgramBody {
  name: string;
}

// FE usage only
export default async function createProgram(body: CreateProgramBody): Promise<void> {
  const res = await fetch(API_ROUTES.PROGRAMS(), {
    body: JSON.stringify(body),
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) {
    const exception = (await res.json()) as ApiException;
    if (isApiException(exception)) throw exception;
  }
}
