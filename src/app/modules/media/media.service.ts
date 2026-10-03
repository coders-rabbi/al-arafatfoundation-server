import { IMedia, TMediaType } from "./media.interface";
import { Media } from "./media.model";
import { getYouTubeId, getYouTubeThumbnail } from "./media.utils";

const createMediaIntoDB = async (payload: IMedia) => {
  const data: IMedia = { ...payload };

  // video hole YouTube thumbnail nije theke banai
  if (payload.type === "video") {
    const id = getYouTubeId(payload.url);
    if (id) data.thumbnail = getYouTubeThumbnail(id);
  }

  const result = await Media.create(data);
  return result;
};

const getAllMediaFromDB = async (type?: TMediaType) => {
  const filter = type ? { type } : {};
  const result = await Media.find(filter).sort({ createdAt: -1 });
  return result;
};

const getSingleMediaFromDB = async (id: string) => {
  const result = await Media.findById(id);
  return result;
};

const updateMediaInDB = async (id: string, payload: Pick<IMedia, "title">) => {
  const result = await Media.findByIdAndUpdate(
    id,
    { title: payload.title },
    { new: true },
  );
  return result;
};

const deleteMediaFromDB = async (id: string) => {
  // TODO: image hole publicId diye Cloudinary theke-o delete korbo
  const result = await Media.findByIdAndDelete(id);
  return result;
};

const bulkDeleteMediaFromDB = async (ids: string[]) => {
  // TODO: image gulo-r publicId diye Cloudinary theke-o delete korbo
  const result = await Media.deleteMany({ _id: { $in: ids } });
  return { deletedCount: result.deletedCount };
};

export const MediaServices = {
  createMediaIntoDB,
  getAllMediaFromDB,
  getSingleMediaFromDB,
  updateMediaInDB,
  deleteMediaFromDB,
  bulkDeleteMediaFromDB,
};
