import cloudinary from '../config/cloudinary.js';

export const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) return next();

    const fileBase64 = req.file.buffer.toString('base64');

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${fileBase64}`,
      {
        folder: 'lost_found_posts'
      }
    );
    console.log("CLOUDINARY RESULT:", result);

    req.fileUrl = result.secure_url; // attach URL
    req.publicId = result.public_id;
    console.log("FILE RECEIVED:", req.file);

    next();

  }  catch (error) {
  console.error("CLOUDINARY ERROR:", error);
  res.status(500).json({
    message: 'Cloudinary upload failed',
    error: error.message
  });
}
};