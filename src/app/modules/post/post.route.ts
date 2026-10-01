import express from "express";
// import authValidation from "../../middleware/authValidation";
import { PostControllers } from "./post.controller";
import { ADMIN_ROLE } from "../admin/admin.constant";
import validateRequest from "../../middleware/validateRequest";
import { postValidations } from "./post.validation";
const router = express.Router();

router.post(
  "/create-post",
  // authValidation(ADMIN_ROLE.SUPER_ADMIN, ADMIN_ROLE.ADMIN, ADMIN_ROLE.EDITOR),
  validateRequest(postValidations.createPostValidationSchema),
  PostControllers.createPostController,
);

router.get("/", PostControllers.getAllPostsController);
// router.get("/recent-news", PostControllers.recentPostsController);
// router.get("/featured-news", PostControllers.featuredPostsController);

router.get("/:postId", PostControllers.getSinglePostController);
router.patch(
  "/:postId",
  // authValidation(ADMIN_ROLE.SUPER_ADMIN, ADMIN_ROLE.ADMIN, ADMIN_ROLE.EDITOR),
  PostControllers.updatePostController
);


export const PostRouter = router;
