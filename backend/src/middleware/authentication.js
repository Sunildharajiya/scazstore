
import jwt from 'jsonwebtoken';

/**
 * Authentication Middleware
 *
 * Purpose:
 * Verify the access token supplied by the client.
 *
 * Expected request header:
 * Authorization: Bearer <access_token>
 *
 * On successful verification:
 * - Attach decoded user claims to req.user.
 * - Allow the request to continue using next().
 *
 * On failure:
 * - Return HTTP 401 Unauthorized.
 */
export const authenticate = (req, res, next) => {
  try {

    // --------------------------------------------------
    // 1. Extract access token from Authorization header
    // --------------------------------------------------

    const authHeader = req.headers.authorization;

    // Ensure the Authorization header exists.
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header missing'
      });
    }

    // Expected format: Bearer <token>
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization format'
      });
    }

    // --------------------------------------------------
    // 2. Validate JWT configuration
    // --------------------------------------------------

    if (!process.env.AXE_TOKEN) {
      throw new Error('Access token secret is not configured');
    }

    // --------------------------------------------------
    // 3. Verify access token
    // --------------------------------------------------

    const decoded = jwt.verify(
      token,
      process.env.AXE_TOKEN,
      {
        algorithms: ['HS256']
      }
    );

    // Ensure the decoded payload contains a user ID.
    if (
      typeof decoded !== 'object' ||
      !decoded.userId
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid access token payload'
      });
    }

    // --------------------------------------------------
    // 4. Attach authenticated user information
    // --------------------------------------------------

    // Controllers can now access authenticated user claims
    // through req.user without decoding the token again.
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      userName: decoded.userName
    };

    // --------------------------------------------------
    // 5. Allow request to continue
    // --------------------------------------------------

    return next();

  } catch (error) {

    // Handle expired tokens separately.
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access token expired'
      });
    }

    // Log unexpected errors for server-side debugging.
    if (error.name !== 'JsonWebTokenError') {
      console.error('[AUTH:MIDDLEWARE]', error);
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token'
    });
  }
};
