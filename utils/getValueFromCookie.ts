export default function getValueFromCookie(cookie: string, key: string): string | undefined {
  return cookie.match(`(^|;)\\s*${key}\\s*=\\s*([^;]+)`)?.pop();
}
