import { API_ROUTES } from "~/constants/api_routes";
import { GenericType } from "~/interfaces/genericType";

// SSR usage only
export default async function getGenericTypes(sid: string, programId: number): Promise<GenericType> {
  const res = await fetch(API_ROUTES.GENERIC_TYPES(programId), {
    method: "GET",
    headers: { cookie: `connect.sid=${sid}` },
  });

  if (!res.ok) throw await res.json();
  const data = await res.json();
  delete data.customOptions;
  return data || {};
}
