// import express from "express";
// import { adminController } from "./admin.controller";
// import validateRequest from "../../middleware/validateRequest";
// import { AdminValidation } from "./admin.validation";
// // import authValidation from "../../middleware/authValidation";
// import { ADMIN_ROLE } from "./admin.constant";

// const router = express.Router();

// router.post(
//   "/create-admin",
//   authValidation(ADMIN_ROLE.SUPER_ADMIN),
//   validateRequest(AdminValidation.createAdminValidationSchema),
//   adminController.createAdminController,
// );
// router.get(
//   "/",
//   authValidation(ADMIN_ROLE.SUPER_ADMIN),
//   adminController.getAdminController,
// );

// router.get("/:id", adminController.getSingleAdminUser)
// router.patch(
//   "/:id",
//   authValidation(ADMIN_ROLE.ADMIN, ADMIN_ROLE.EDITOR, ADMIN_ROLE.SUPER_ADMIN),
//   adminController.updateAdminInfoController,
// );

// router.patch(
//   "/:id/delete",
//   authValidation(ADMIN_ROLE.SUPER_ADMIN),
//   adminController.deleteAdminUserController,
// );

// export const adminRouters = router;
