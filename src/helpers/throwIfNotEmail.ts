import { ResponseError } from "../errors/http.errors";

export default function throwIfNotEmail(value: any, message: string, statusCode: number = 400) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (typeof value !== "string" || !emailRegex.test(value)) {
    throw new ResponseError(statusCode, message);
  }
}
