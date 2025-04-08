# Cloudinary Setup for NiChat

This document provides instructions on how to set up Cloudinary for image uploads in the NiChat application.

## What is Cloudinary?

Cloudinary is a cloud-based service that provides an end-to-end image and video management solution including uploads, storage, manipulations, optimizations and delivery.

## Why Cloudinary?

- **Efficient Storage**: Cloudinary stores images in the cloud, reducing the load on your server.
- **Image Transformations**: Easily resize, crop, and transform images on-the-fly.
- **Fast Delivery**: Images are delivered through a CDN for fast loading times.
- **Responsive Images**: Automatically generate responsive images for different devices.

## Setup Instructions

### 1. Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/) and sign up for a free account.
2. After signing up, you'll be taken to your dashboard.

### 2. Get Your Cloudinary Credentials

From your Cloudinary dashboard, note down the following:

- **Cloud Name**: Your unique cloud name (e.g., `dxgbzgpqn`)
- **API Key**: Your API key
- **API Secret**: Your API secret

### 3. Create an Upload Preset

1. In your Cloudinary dashboard, go to **Settings** > **Upload** > **Upload presets**.
2. Click **Add upload preset**.
3. Set a name for your preset (e.g., `nichat_uploads`).
4. Configure the following settings:
   - **Signing Mode**: Choose "Signed" for secure uploads.
   - **Folder**: Optionally specify a folder where uploads will be stored (e.g., `nichat`).
   - **Access Mode**: Set to "public" for public access to uploaded images.
5. Save the preset.

### 4. Update Environment Variables

Update your `.env.local` file with the following variables:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Replace the placeholder values with your actual Cloudinary credentials.

### 5. Restart Your Development Server

After updating the environment variables, restart your development server for the changes to take effect:

```bash
npm run dev
```

## Usage

The application is now configured to use Cloudinary for image uploads. When users upload profile pictures or other images, they will be stored in your Cloudinary account.

### How Image Uploads Work

1. When a user selects an image file, it is sent to our server-side API endpoint (`/api/upload/image`)
2. The server uploads the image directly to Cloudinary using the Cloudinary SDK
3. Cloudinary returns a secure URL for the uploaded image
4. The server saves this URL to the user's profile in the database
5. The image is displayed using the Cloudinary URL

### Development Mode Fallback

If you don't have Cloudinary credentials set up yet, the application will still work in development mode:

1. The server will generate a mock Cloudinary URL
2. This URL will be saved to the user's profile
3. The image won't actually be uploaded to Cloudinary
4. The mock URL will point to a non-existent image

To use the full Cloudinary functionality with permanent storage, follow the setup instructions above.

### Testing the Setup

1. Go to your profile page.
2. Click on the edit icon on your profile picture.
3. Select an image to upload.
4. The image should be uploaded to Cloudinary and displayed as your profile picture.

## Troubleshooting

### Upload Preset Not Found

If you see an error like `{"error":{"message":"Upload preset not found"}}`, check the following:

1. Verify that the upload preset name in your `.env.local` file matches exactly with the one you created in Cloudinary.
2. Make sure the upload preset is active in your Cloudinary dashboard.
3. Check if the upload preset is configured for signed uploads if you're using the signature endpoint.

### API Key or Secret Issues

If you encounter authentication errors:

1. Double-check your API key and secret in the `.env.local` file.
2. Ensure there are no extra spaces or characters in your credentials.
3. Verify that your Cloudinary account is active and not restricted.

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Next Cloudinary Package](https://next-cloudinary.spacejelly.dev/)
- [Cloudinary Upload Widget](https://cloudinary.com/documentation/upload_widget)
