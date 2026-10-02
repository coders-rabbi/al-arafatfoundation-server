import { Router } from "express";
import { uploadhRoutes } from "../modules/upload/upload.route";
import { PostRouter } from "../modules/post/post.route";

const router = Router();

const modulesRoutes = [
  {
    path: "/posts",
    route: PostRouter,
  },

  {
    path: "/upload",
    route: uploadhRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;


