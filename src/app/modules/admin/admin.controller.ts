import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendreponse";
import { adminService } from "./admin.service";

const createAdminController = catchAsync(async (req, res) => {
  const response = await adminService.createAdminIntoBd(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Account create successfull",
    data: response,
  });
});

const getSingleAdminUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await adminService.getSingleAdminUserFromDB(id as string);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Update successfull",
    data: response,
  });
});

const getAdminController = catchAsync(async (req, res) => {
  const response = await adminService.getAdminfromBD();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All admin are retrive successfull",
    data: response,
  });
});

const updateAdminInfoController = catchAsync(async (req, res) => {
  const payload = req.body;
  const { id } = req.params;
  const response = await adminService.updateAdminInfoFromDB(
    id as string,
    payload,
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Your info update successfull",
    data: response,
  });
});

const deleteAdminUserController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await adminService.deleteAdminUserFromDB(id as string);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User deleted successful",
    data: response,
  });
});

export const adminController = {
  createAdminController,
  getSingleAdminUser,
  getAdminController,
  updateAdminInfoController,
  deleteAdminUserController,
};
