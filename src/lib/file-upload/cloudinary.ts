import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from "cloudinary";

// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_SECRET as string,
});

export const cloudinaryUploadToImage = async (
  imagePath: string
): Promise<UploadApiResponse> => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options: UploadApiOptions = {
    use_filename: false,
    unique_filename: true,
    overwrite: true,
  };

  return await cloudinary.uploader.upload(imagePath, options);
};