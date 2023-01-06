import { API_ROUTES } from "~/constants/api_routes";
import { ApiException } from "~/interfaces/error";
import isApiException from "~/utils/isApiException";

interface secretMsgBody {
  message: string;
}

export default async function getMsg() {
  const res = await fetch(API_ROUTES.REQUEST_MESSAGE(), {
    credentials: "include",
    method: "GET",
  });
  if (!res.ok) {
    const exception = (await res.json()) as ApiException;
    if (isApiException(exception)) throw exception;
  }

  return (await res.json()) as secretMsgBody;
}
