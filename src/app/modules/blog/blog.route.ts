import express from "express";
import { BlogControllers } from "./blog.controller";
import validateRequest from "../../middleware/validateRequest";
import { blogValidations } from "./blog.validation";
// import authValidation from "../../middleware/authValidation";
const router = express.Router();

router.post(
  "/create-blog",
  // authValidation(ADMIN_ROLE.SUPER_ADMIN, ADMIN_ROLE.ADMIN, ADMIN_ROLE.EDITOR),
  validateRequest(blogValidations.createBlogValidationSchema),
  BlogControllers.createBlogController,
);

router.get("/", BlogControllers.getAllBlogsController);

router.get("/:blogId", BlogControllers.getSingleBlogController);

router.patch(
  "/:blogId",
  // authValidation(ADMIN_ROLE.SUPER_ADMIN, ADMIN_ROLE.ADMIN, ADMIN_ROLE.EDITOR),
  validateRequest(blogValidations.updateBlogValidationSchema),
  BlogControllers.updateBlogController,
);

router.delete(
  "/:blogId",
  // authValidation(ADMIN_ROLE.SUPER_ADMIN, ADMIN_ROLE.ADMIN),
  BlogControllers.deleteBlogController,
);

export const BlogRouter = router;
