import express from "express";
// import authValidation from "../../middleware/authValidation";
// import { ADMIN_ROLE } from "../admin/admin.constant";
import validateRequest from "../../middleware/validateRequest";
import { ProjectControllers } from "./project.controller";
import { projectValidations } from "./project.validation";

const router = express.Router();

router.post(
  "/create-project",
  // authValidation(ADMIN_ROLE.SUPER_ADMIN, ADMIN_ROLE.ADMIN, ADMIN_ROLE.EDITOR),
  validateRequest(projectValidations.createProjectValidationSchema),
  ProjectControllers.createProjectController,
);

router.get("/", ProjectControllers.getAllProjectsController);

router.get("/:projectId", ProjectControllers.getSingleProjectController);

router.patch(
  "/:projectId",
  // authValidation(ADMIN_ROLE.SUPER_ADMIN, ADMIN_ROLE.ADMIN, ADMIN_ROLE.EDITOR),
  validateRequest(projectValidations.updateProjectValidationSchema),
  ProjectControllers.updateProjectController,
);

router.patch("/:projectId/delete", ProjectControllers.deleteProjectController);

export const ProjectRouter = router;
