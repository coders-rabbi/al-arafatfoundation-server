import { ZodError, ZodIssue } from "zod";
import { TGenericResponseError } from "../interface/error";
import { StatusCodes } from "http-status-codes";

const handleZodError = (err: ZodError): TGenericResponseError => {
  const errorSource = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue.path.join(".") || "",
      message: issue.message,
    };
  });
  return {
    statusCode: StatusCodes.BAD_REQUEST,
    message: "Validation error",
    errorSource,
  };
};

export default handleZodError;
