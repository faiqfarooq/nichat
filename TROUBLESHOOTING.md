# Troubleshooting Guide for NiChat

This document provides solutions for common issues you might encounter while running the NiChat application.

## Webpack Cache Errors

### Error: ENOENT: no such file or directory, rename '.next/cache/webpack/...'

This error occurs when the webpack cache becomes corrupted. To fix it:

1. Stop the development server (Ctrl+C in the terminal).
2. Delete the `.next` directory:
   ```powershell
   # In PowerShell
   Remove-Item -Recurse -Force .next
   
   # In Command Prompt
   rmdir /s /q .next
   
   # In Git Bash or Linux/Mac terminal
   rm -rf .next
   ```
3. Restart the development server:
   ```
   npm run dev
   ```

## Port Already in Use

### Error: Port 3000 is in use

If you see a message like "Port 3000 is in use trying 3001 instead", it means another application is already using port 3000. Next.js will automatically try to use the next available port.

If you want to specify a different port:

```
npm run dev -- -p 3002
```

## Environment Variables

### Error: Environment variables not loading

If your environment variables aren't being loaded correctly:

1. Make sure your `.env.local` file is in the root directory of your project.
2. Restart the development server after making changes to environment variables.
3. For client-side environment variables, make sure they start with `NEXT_PUBLIC_`.

## Cloudinary Issues

### Error: Failed to upload image

If you see an error like `Failed to upload image` when trying to upload a profile picture:

1. Check that your Cloudinary credentials in `.env.local` are correct.
2. Make sure your internet connection is working.
3. Check the browser console and server logs for more detailed error information.
4. Verify that the Cloudinary API is accessible from your server.

**Note**: We've updated the application to use a server-side approach for image uploads. The image is now sent to our API endpoint (`/api/upload/image`), which then uploads it directly to Cloudinary using the Cloudinary SDK. This approach is more secure and reliable than client-side uploads. In development mode, if Cloudinary credentials are not set, the server will generate a mock URL without actually uploading the image.

### Error: A Cloudinary API Key is required for signed requests

If you see an error like `Uncaught Error: A Cloudinary API Key is required for signed requests`:

1. Make sure you have set the following environment variables in your `.env.local` file:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
2. Restart the development server after updating the environment variables.
3. If you're in development mode and don't have Cloudinary credentials yet, the app will fall back to using unsigned uploads with the demo cloud.

### Error: Failed to get upload signature

If you encounter issues with the Cloudinary signature endpoint:

1. Check that your Cloudinary API key and secret are correct.
2. Make sure the API endpoint is accessible.
3. Check the server logs for more detailed error information.
4. In development, you can use unsigned uploads by not setting the CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET environment variables.

## Authentication Issues

### Error: NextAuth.js errors

If you encounter issues with authentication:

1. Make sure your NextAuth.js configuration is correct.
2. Check that your OAuth providers (if used) are properly configured.
3. Verify that your database connection is working.

## Database Connection Issues

### Error: MongoDB connection errors

If you have issues connecting to MongoDB:

1. Check that your MongoDB URI in `.env.local` is correct.
2. Make sure your MongoDB instance is running.
3. Check if your IP address is whitelisted in MongoDB Atlas (if using Atlas).
4. Verify that your database user has the correct permissions.

## Socket.IO Issues

### Error: Socket.IO connection errors

If real-time features aren't working:

1. Make sure the Socket.IO server is running.
2. Check that the client is connecting to the correct Socket.IO server URL.
3. Verify that the Socket.IO version on the client matches the server.

## Build Errors

### Error: Build fails

If your build fails:

1. Check the error message for specific issues.
2. Make sure all dependencies are installed:
   ```
   npm install
   ```
3. Clear the Next.js cache:
   ```powershell
   Remove-Item -Recurse -Force .next
   ```
4. Try building again:
   ```
   npm run build
   ```

## Deployment Issues

### Error: Deployment fails

If you have issues deploying to a hosting platform:

1. Check the platform's documentation for specific requirements.
2. Make sure all environment variables are set in the hosting platform.
3. Verify that the build command and output directory are correctly configured.

## Still Having Issues?

If you're still experiencing problems:

1. Check the console for error messages.
2. Look at the server logs for more detailed information.
3. Search for the error message online to see if others have encountered the same issue.
4. Consider opening an issue on the project's GitHub repository.
