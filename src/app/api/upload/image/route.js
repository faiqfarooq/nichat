import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/lib/mongodb/models/User';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload an image to Cloudinary and update the user's profile
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
    
    // Get the image data from the request
    const formData = await request.formData();
    const file = formData.get('file');
    
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
      
      // Connect to database
      await connectDB();
      
      // Update user with mock avatar URL
      const user = await User.findById(session.user.id);
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      // Generate a mock Cloudinary URL
      const mockUrl = `https://res.cloudinary.com/demo/image/upload/v1/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      
      // Update user
      user.avatar = mockUrl;
      await user.save();
      
      return NextResponse.json({
        url: mockUrl,
        message: 'Development mode: Image URL mocked (Cloudinary credentials not set)'
      });
    }
    
    // Upload the image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'nichat',
          resource_type: 'image',
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
    
    // Connect to database
    await connectDB();
    
    // Update user with avatar URL
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update user
    user.avatar = uploadResult.secure_url;
    await user.save();
    
    return NextResponse.json({
      url: uploadResult.secure_url,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', message: error.message },
      { status: 500 }
    );
  }
}
