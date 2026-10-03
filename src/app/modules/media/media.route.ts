import express from "express";
// import authValidation from "../../middleware/authValidation";
import validateRequest from "../../middleware/validateRequest";
import { MediaControllers } from "./media.controller";
import { mediaValidations } from "./media.validation";
const router = express.Router();

router.post(
  "/create-media",
  // authValidation(ADMIN_ROLE.SUPER_ADMIN, ADMIN_ROLE.ADMIN, ADMIN_ROLE.EDITOR),
  validateRequest(mediaValidations.createMediaValidationSchema),
  MediaControllers.createMediaController,
);

router.get("/", MediaControllers.getAllMediaController);

router.post(
  "/bulk-delete",
  // authValidation(ADMIN_ROLE.SUPER_ADMIN, ADMIN_ROLE.ADMIN, ADMIN_ROLE.EDITOR),
  validateRequest(mediaValidations.bulkDeleteMediaValidationSchema),
  MediaControllers.bulkDeleteMediaController,
);

router.get("/:mediaId", MediaControllers.getSingleMediaController);

router.patch(
  "/:mediaId",
  // authValidation(ADMIN_ROLE.SUPER_ADMIN, ADMIN_ROLE.ADMIN, ADMIN_ROLE.EDITOR),
  validateRequest(mediaValidations.updateMediaValidationSchema),
  MediaControllers.updateMediaController,
);

router.delete(
  "/:mediaId",
  // authValidation(ADMIN_ROLE.SUPER_ADMIN, ADMIN_ROLE.ADMIN, ADMIN_ROLE.EDITOR),
  MediaControllers.deleteMediaController,
);

export const MediaRouter = router;
