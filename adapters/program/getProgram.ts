import { API_ROUTES } from "~/constants/api_routes";
import { ApiException } from "~/interfaces/error";
import { Program } from "~/interfaces/program";
import isApiException from "~/utils/isApiException";

type GetProgramJsonResponse = { id: number; name: string; createdAt: string; updatedAt: string };

// SSR usage only
export default async function getProgram(sid: string, programId: number): Promise<Program> {
  const res = await fetch(API_ROUTES.PROGRAM(programId), { method: "GET", headers: { cookie: `connect.sid=${sid}` } });
  if (!res.ok) {
    const exception = (await res.json()) as ApiException;
    if (isApiException(exception)) throw exception;
  }
  return { ...((await res.json()) as GetProgramJsonResponse) };
}
