import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { SID_COOKIE_NAME } from "~/constants/cookies";

export default function getSidCookie(req: IncomingMessage & { cookies: NextApiRequestCookies }) {
  return req?.cookies[SID_COOKIE_NAME]!;
}
