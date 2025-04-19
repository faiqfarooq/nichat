import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// This config is needed for routes that use dynamic features like request.url
export const dynamic = 'force-dynamic';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Generate a Cloudinary signature for secure uploads
 * This endpoint is used by the Cloudinary widget to authenticate uploads
 */
export async function GET(request) {
  try {
    // Check if required environment variables are set
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.warn('Cloudinary API key or secret is not set. Using unsigned upload.');
      return NextResponse.json(
        { 
          error: 'Cloudinary API key or secret is not set',
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo',
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default',
        },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timestamp = Math.round(new Date().getTime() / 1000);
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default';
    
    // Generate the signature
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        upload_preset: uploadPreset,
      },
      process.env.CLOUDINARY_API_SECRET
    );
    
    // Return the signature and other required parameters
    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo',
      apiKey: process.env.CLOUDINARY_API_KEY,
      uploadPreset,
    });
  } catch (error) {
    console.error('Error generating Cloudinary signature:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate signature',
        message: error.message,
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo',
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default',
      },
      { status: 500 }
    );
  }
}
