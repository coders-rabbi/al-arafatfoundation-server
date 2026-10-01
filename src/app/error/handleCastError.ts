import mongoose from "mongoose";
import { TErrorSource, TGenericResponseError } from "../interface/error";
import { StatusCodes } from "http-status-codes";

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericResponseError => {
  const errorSource: TErrorSource = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  return {
    statusCode: StatusCodes.BAD_REQUEST,
    message: "Something is given Invalid",
    errorSource,
  };
};

export default handleCastError;
