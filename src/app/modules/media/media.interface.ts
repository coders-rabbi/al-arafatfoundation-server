import { MEDIA_TYPES } from "./media.constant";

export type TMediaType = (typeof MEDIA_TYPES)[number];

export interface IMedia {
  title: string;
  type: TMediaType;
  url: string; // image hole Cloudinary url, video hole YouTube link
  publicId?: string; // shudhu image er jonno (Cloudinary delete er somoy lagbe)
  thumbnail?: string; // shudhu video er jonno (YouTube thumbnail)
}
