import { ResponseError } from "../errors/http.errors"

export default function throwIfMissing(
  object: any,
  message: string,
  statusCode: number = 400,
) {
  if (!object) {
    throw new ResponseError(statusCode, message);
  }
}
