import { Router } from "express";
import { uploadhRoutes } from "../modules/upload/upload.route";
import { PostRouter } from "../modules/post/post.route";
import { BlogRouter } from "../modules/blog/blog.route";
import { MediaRouter } from "../modules/media/media.route";

const router = Router();

const modulesRoutes = [
  {
    path: "/posts",
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
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
