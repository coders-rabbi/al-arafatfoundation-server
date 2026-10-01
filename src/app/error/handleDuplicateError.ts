import { StatusCodes } from "http-status-codes";

const handleDuplicateError = (err: any) => {
  const match = err.message.match(/\{\s*([^:]+):\s*"?([^"}]+)"?\s*\}/);
  const field = match?.[1] || "field";
  const value = match?.[2] || "value";

  const errorSource = [
    {
      path: field,
      message: `${field} "${value}" already exists.`,
    },
  ];

  return {
    statusCode: StatusCodes.CONFLICT,
    message: "Duplicate key error",
    errorSource,
  };
};

export default handleDuplicateError;
