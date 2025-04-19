const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to delete the .next directory
function deleteNextDir() {
  console.log('Cleaning .next directory...');
  try {
    if (fs.existsSync('.next')) {
      fs.rmSync('.next', { recursive: true, force: true });
    }
    console.log('Successfully cleaned .next directory');
  } catch (err) {
    console.error('Error cleaning .next directory:', err);
  }
}

// Function to run the build command
function runBuild() {
  console.log('Running Next.js build...');
  try {
    execSync('npm run build:next', { stdio: 'inherit' });
    console.log('Build completed successfully');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

// Main function
function main() {
  console.log('Starting custom build process...');
  
  // Delete .next directory
  deleteNextDir();
  
  // Run the build
  runBuild();
  
  console.log('Custom build process completed');
}

// Run the main function
main();
