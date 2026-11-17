
import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

import { User } from '../../db/models/users.model.js';

// Initialize refresh-token router
export const newAxcToken = express.Router();

/**
 * Generate a SHA-256 hash of a refresh token.
 *
 * The database stores only the hash instead of the original token.
 * This prevents the original refresh token from being exposed
 * if the database is compromised.
 */
const hashToken = (token) => {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};

/**
 * POST /
 *
 * Refresh an expired access token using a valid refresh token.
 *
 * Authentication flow:
 * 1. Read refresh token from the HttpOnly cookie.
 * 2. Verify its signature and expiration.
 * 3. Retrieve the associated user.
 * 4. Compare the token hash against the stored database hash.
 * 5. Generate a new access token.
 * 6. Rotate the refresh token.
 * 7. Update the stored refresh-token hash.
 * 8. Return the new access token.
 *
 * Successful response:
 * {
 *   "success": true,
 *   "message": "Token refreshed successfully",
 *   "token": "new-access-token"
 * }
 */
newAxcToken.post('/', async (req, res) => {
  try {

    // --------------------------------------------------
    // 1. Extract refresh token from HttpOnly cookie
    // --------------------------------------------------

    // cookie-parser middleware must be registered
    // in the main Express application.
    const refToken = req.cookies?.ref_token;

    if (!refToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token missing'
      });
    }

    // --------------------------------------------------
    // 2. Verify refresh token
    // --------------------------------------------------

    // Verify using the dedicated refresh-token secret.
    // jwt.verify() also checks token expiration.
    const decoded = jwt.verify(
      refToken,
      process.env.REF_TOKEN
    );

    // Ensure the token contains the required user identifier.
    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // --------------------------------------------------
    // 3. Retrieve the associated user
    // --------------------------------------------------

    const user = await User.findById(decoded.userId);

    // A missing user or missing stored refresh-token hash
    // means that the session is no longer valid.
    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session'
      });
    }

    // --------------------------------------------------
    // 4. Validate the refresh-token session
    // --------------------------------------------------

    // Hash the supplied refresh token and compare it with
    // the hash currently stored in the user's document.
    const currentHash = hashToken(refToken);

    if (currentHash !== user.refreshTokenHash) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token revoked or invalid'
      });
    }

    // --------------------------------------------------
    // 5. Generate a new access token
    // --------------------------------------------------

    // The access token is short-lived and contains the
    // information required by authentication middleware.
    const newAccessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        userName: user.userName
      },
      process.env.AXE_TOKEN,
      {
        expiresIn: '15m'
      }
    );

    // --------------------------------------------------
    // 6. Rotate the refresh token
    // --------------------------------------------------

    // Generate a completely new refresh token.
    // The previous refresh token must no longer be accepted.
    const newRefToken = jwt.sign(
      {
        userId: user._id
      },
      process.env.REF_TOKEN,
      {
        expiresIn: '1d'
      }
    );

    // --------------------------------------------------
    // 7. Update the stored refresh-token hash
    // --------------------------------------------------

    // Replace the old session hash with the new token hash.
    user.refreshTokenHash = hashToken(newRefToken);

    await user.save();

    // --------------------------------------------------
    // 8. Set the new refresh-token cookie
    // --------------------------------------------------

    // Keep the refresh token inaccessible to frontend JavaScript.
    res.cookie('ref_token', newRefToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    // --------------------------------------------------
    // 9. Return the new access token
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      token: newAccessToken
    });

  } catch (error) {

    // Log detailed errors on the server for debugging.
    // Never expose internal JWT or database errors to clients.
    console.error('[AUTH:REFRESH]', error);

    return res.status(401).json({
      success: false,
      message: 'Refresh session expired or invalid'
    });

  }
});
