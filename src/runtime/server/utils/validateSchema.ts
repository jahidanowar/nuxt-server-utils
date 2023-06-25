import { ZodSchema } from "zod";
import { createError } from "h3";
/**
 * @deprecated since version 0.0.6
 *  Validate the request body
 * @param data any - the request body
 * @param schema ZodSchema - The schema to validate against
 * @param data any - the request body
 * @returns void
 */
export function validateSchema(schema: ZodSchema, data: any): void {
  try {
    schema.parse(data);
  } catch (e: any) {
    const errorObj: any = {};

    for (const error of e.issues) {
      if (error.path.length === 1) {
        errorObj[error.path[0]] = error.message;
      }
      if (error.path.length === 2) {
        errorObj[error.path[1]] = error;
      }
      if (error.path.length === 3) {
        errorObj[error.path[1] + "." + error.path[2]] = error;
      }
    }

    throw createError({
      statusCode: 400,
      statusMessage: "Validation Error",
      data: errorObj,
    });
  }
}
