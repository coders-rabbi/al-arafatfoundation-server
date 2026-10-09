import express from "express";
// import authValidation from "../../middleware/authValidation";
import { ActivitieControllers } from "./post.controller";
import { ADMIN_ROLE } from "../admin/admin.constant";
import validateRequest from "../../middleware/validateRequest";
import { postValidations } from "./post.validation";
const router = express.Router();

router.post(
  "/activitie-post",
  // authValidation(ADMIN_ROLE.SUPER_ADMIN, ADMIN_ROLE.ADMIN, ADMIN_ROLE.EDITOR),
  validateRequest(postValidations.createPostValidationSchema),
  ActivitieControllers.createActivitieController,
);

router.get("/", ActivitieControllers.getAllActivitieController);
// router.get("/recent-news", PostControllers.recentPostsController);
// router.get("/featured-news", PostControllers.featuredPostsController);

router.get("/:activitieId", ActivitieControllers.getSingleActivitieController);
router.patch(
  "/:activitieId",
  // authValidation(ADMIN_ROLE.SUPER_ADMIN, ADMIN_ROLE.ADMIN, ADMIN_ROLE.EDITOR),
  ActivitieControllers.updateActivitieController,
);

router.patch("/:activitieId/delete", ActivitieControllers.deleteActivitieController);

export const PostRouter = router;
