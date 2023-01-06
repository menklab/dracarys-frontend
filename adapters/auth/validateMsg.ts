import { API_ROUTES } from "~/constants/api_routes";
import { ApiException } from "~/interfaces/error";
import isApiException from "~/utils/isApiException";

interface validateMsgBody {
  pubKey: string;
  message: string;
  signature: string;
}

export default async function validateMsg(body: validateMsgBody): Promise<boolean> {
  const res = await fetch(API_ROUTES.VALIDATE_MESSAGE(), {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) {
    const exception = (await res.json()) as ApiException;
    if (isApiException(exception)) throw exception;
  }
  return await res.json();
}
