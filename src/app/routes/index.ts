import { Router } from "express";
import { uploadhRoutes } from "../modules/upload/upload.route";
import { PostRouter } from "../modules/post/post.route";
import { BlogRouter } from "../modules/blog/blog.route";
import { MediaRouter } from "../modules/media/media.route";
import { DonationRouter } from "../modules/donation/donation.route.";
import { adminRouters } from "../modules/admin/admin.route";

const router = Router();

const modulesRoutes = [
  {
    path: "/activities",
    route: PostRouter,
  },
  {
    path: "/blogs",
    route: BlogRouter,
  },
  {
    path: "/media",
    route: MediaRouter,
  },
  {
    path: "/upload",
    route: uploadhRoutes,
  },
  {
    path: "/donations",
    route: DonationRouter,
  },
  {
    path: "/admin",
    route: adminRouters,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
