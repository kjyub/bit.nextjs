import { HTTPError } from "ky";

export const toHttpError = (error: unknown): HTTPError | null => {
  if (error instanceof HTTPError) {
    return error as HTTPError;
  }
  return null;
};
