import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendreponse";
import catchAsync from "../../utils/catchAsync";
import { ProjectServices } from "./project.service";

const createProjectController = catchAsync(async (req, res) => {
  const result = await ProjectServices.createProjectIntoDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Project created successfully",
    data: result,
  });
});

const getAllProjectsController = catchAsync(async (req, res) => {
  const result = await ProjectServices.getAllProjectsFromDB(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All projects are successfully retrieved from the database",
    data: result,
  });
});

const getSingleProjectController = catchAsync(async (req, res) => {
  const result = await ProjectServices.getSingleProjectFromDB(
    req.params.projectId as string,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Project is successfully retrieved from the database",
    data: result,
  });
});

const updateProjectController = catchAsync(async (req, res) => {
  const result = await ProjectServices.updateProjectInDB(
    req.params.projectId as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Project is successfully updated",
    data: result,
  });
});

const deleteProjectController = catchAsync(async (req, res) => {
  const result = await ProjectServices.deleteProjectFromDB(
    req.params.projectId as string,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Project is successfully deleted",
    data: result,
  });
});

export const ProjectControllers = {
  createProjectController,
  getAllProjectsController,
  getSingleProjectController,
  updateProjectController,
  deleteProjectController,
};
