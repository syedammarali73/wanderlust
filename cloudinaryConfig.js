const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv");

// if(process.env.NODE_ENV != "production"){
// }
dotenv.config({
  path: "./.env",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// import {v2 as cloudinary} from 'cloudinary';


console.log(process.env.CLOUDINARY_API_SECRET);
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
    folder: 'wanderlust_DEV',
    //   format: async (req, file) => 'png', // supports promises as well
    allowedFormats: async (req, file) => ["png", "jpeg", "jpg", "avif"], // supports promises as well
    // public_id: (req, file) => 'computed-filename-using-request',
    },
});

module.exports = {
    cloudinary,
    storage
}