import type { Context } from "hono";

type ValidationResult =
  | { success: true }
  | {
      success: false;
      error: {
        issues: Array<{
          path: PropertyKey[];
          message: string;
        }>;
      };
    };

export const validationError = (message: string) => {
  return (result: ValidationResult, c: Context) => {
    if (result.success) {
      return;
    }

    return c.json(
      {
        error: "validation_error",
        message,
        issues: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      400,
    );
  };
};
