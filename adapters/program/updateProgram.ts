import { API_ROUTES } from "~/constants/api_routes";
import { ApiException } from "~/interfaces/error";
import isApiException from "~/utils/isApiException";

interface UpdateProgramBody {
  name: string;
}

// FE usage only
export default async function updateProgram(programId: number, body: UpdateProgramBody): Promise<void> {
  const res = await fetch(API_ROUTES.PROGRAM(programId), {
    body: JSON.stringify(body),
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) {
    const exception = (await res.json()) as ApiException;
    if (isApiException(exception)) throw exception;
  }
}
