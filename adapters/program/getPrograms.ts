import { API_ROUTES } from "~/constants/api_routes";
import { ApiException } from "~/interfaces/error";
import { Program } from "~/interfaces/program";
import isApiException from "~/utils/isApiException";

type GetProgramsJsonResponse = { id: number; name: string; createdAt: string; updatedAt: string }[];

// SSR usage only
export default async function getPrograms(sid: string): Promise<Program[]> {
  const res = await fetch(API_ROUTES.PROGRAMS(), { method: "GET", headers: { cookie: `connect.sid=${sid}` } });
  if (!res.ok) {
    const exception = (await res.json()) as ApiException;
    if (isApiException(exception)) throw exception;
  }
  const data = (await res.json()) as GetProgramsJsonResponse;
  return (data || [])?.map((program) => ({ ...program }));
}
