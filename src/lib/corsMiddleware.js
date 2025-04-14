/**
 * CORS middleware for API routes
 * This middleware adds CORS headers to API responses
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object with CORS headers
 */
export function corsMiddleware(req, res) {
  // Get the origin from the request headers
  const origin = req.headers.origin || '*';
  
  // Set CORS headers
  res.headers.set('Access-Control-Allow-Origin', origin);
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: res.headers });
  }
  
  return res;
}
