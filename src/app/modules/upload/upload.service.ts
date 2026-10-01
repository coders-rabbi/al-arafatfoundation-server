import cloudinary from "../../config/cloudinary";
import { UploadModel, IUpload, TUploadType } from "./upload.model";
import { UploadApiResponse } from "cloudinary";

type TUploadFileInput = {
  buffer: Buffer;
  mimetype: string;
  uploadedBy?: string;
};

const uploadBufferToCloudinary = (
  buffer: Buffer,
  resourceType: "image" | "video",
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "news",
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve(result);
      },
    );
    stream.end(buffer);
  });
};

export const uploadFile = async ({
  buffer,
  mimetype,
  uploadedBy,
}: TUploadFileInput): Promise<IUpload> => {
  const resourceType: TUploadType = mimetype.startsWith("video")
    ? "video"
    : "image";

  const result = await uploadBufferToCloudinary(buffer, resourceType);

  const record = await UploadModel.create({
    url: result.secure_url,
    publicId: result.public_id,
    type: resourceType,
    format: result.format,
    size: result.bytes,
    ...(uploadedBy ? { uploadedBy: uploadedBy as string } : {}),
  });

  return record;
};
