import mongoose from "mongoose";
import { TGenericResponseError } from "../interface/error";

const handleMongooseValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericResponseError => {
  const errorSource = Object.values(err.errors).map((val) => {
    return {
      path: val.path,
      message: val.message,
    };
  });
  return {
    statusCode: 400,
    message: "Validation error",
    errorSource,
  };
};

export default handleMongooseValidationError;
