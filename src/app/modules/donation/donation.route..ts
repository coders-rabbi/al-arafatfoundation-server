import express from "express";
// import authValidation from "../../middleware/authValidation";
import validateRequest from "../../middleware/validateRequest";
// import { ADMIN_ROLE } from "../admin/admin.constant";
import { DonationControllers } from "./donation.controller";
import { donationValidations } from "./donation.validation";

const router = express.Router();

// পাবলিক: যে কেউ দান জমা দিতে পারবে
router.post(
  "/create-donation",
  validateRequest(donationValidations.createDonationValidationSchema),
  DonationControllers.createDonationController,
);

// অ্যাডমিন: সব দান দেখা (?status=pending)
router.get(
  "/",
  // authValidation(ADMIN_ROLE.SUPER_ADMIN, ADMIN_ROLE.ADMIN),
  DonationControllers.getAllDonationsController,
);

// অ্যাডমিন: TrxID যাচাই করে verified / rejected করা
router.patch(
  "/:donationId/status",
  // authValidation(ADMIN_ROLE.SUPER_ADMIN, ADMIN_ROLE.ADMIN),
  validateRequest(donationValidations.updateDonationStatusValidationSchema),
  DonationControllers.updateDonationStatusController,
);

export const DonationRouter = router;
