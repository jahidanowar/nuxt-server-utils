import { H3Error, H3Event, createError } from "h3";

class Authorizer {
  /**
   * Gate
   * @param event
   * @param fn
   * @param error
   * @returns
   */
  allows(
    event: H3Event,
    fn: () => boolean,
    error:
      | string
      | (Partial<H3Error> & {
          status?: number;
          statusText?: string;
        }) = {
      status: 403,
      statusText: "Forbidden",
    }
  ) {
    if (!fn()) {
      throw createError(error);
    }
    return;
  }
}

export default new Authorizer();
