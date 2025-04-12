import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a file (document, audio, video) to Cloudinary
 * @param {Request} request - The request object
 * @returns {Promise<Response>} - The response object
 */
export async function POST(request) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the file data from the request
    const formData = await request.formData();
    const file = formData.get('file');
    const resourceType = formData.get('resourceType') || 'auto'; // 'image', 'video', 'audio', 'auto'
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Convert the file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Check if Cloudinary credentials are set
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      // For development, return a mock response
      console.warn('Cloudinary credentials not set. Using mock response.');
      
      // Generate a mock Cloudinary URL
      const mockUrl = `https://res.cloudinary.com/demo/${resourceType}/upload/v1/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      
      return NextResponse.json({
        url: mockUrl,
        fileName: file.name,
        fileSize: buffer.length,
        message: 'Development mode: File URL mocked (Cloudinary credentials not set)'
      });
    }
    
    // Upload the file to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'nichat',
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      
      // Write the buffer to the upload stream
      uploadStream.write(buffer);
      uploadStream.end();
    });
    
    return NextResponse.json({
      url: uploadResult.secure_url,
      fileName: file.name,
      fileSize: buffer.length,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', message: error.message },
      { status: 500 }
    );
  }
}
