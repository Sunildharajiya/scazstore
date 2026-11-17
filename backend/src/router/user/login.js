
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

import { User } from '../../db/models/users.model.js';

// Initialize authentication router
export const loginUserRouter = express.Router();

/**
 * Generate a SHA-256 hash of a refresh token.
 *
 * We store the hash instead of the original refresh token
 * in the database. This reduces the impact of a database leak.
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
 * Authenticate an existing user and generate authentication tokens.
 *
 * Request body:
 * {
 *   "identifier": "@username or email@example.com",
 *   "password": "user-password"
 * }
 *
 * Successful response:
 * {
 *   "message": "Login successful",
 *   "token": "access-jwt",
 *   "user": { ... }
 * }
 *
 * Refresh token:
 * Stored in an HttpOnly cookie, not exposed in JSON.
 */
loginUserRouter.post('/', async (req, res) => {
  try {

    // --------------------------------------------------
    // 1. Extract and validate login credentials
    // --------------------------------------------------

    const { identifier, password } = req.body;

    if (
      typeof identifier !== 'string' ||
      typeof password !== 'string' ||
      !identifier.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'Identifier and password are required'
      });
    }

    // Normalize the identifier to avoid whitespace-related
    // login failures.
    const normalizedIdentifier = identifier.trim();

    // --------------------------------------------------
    // 2. Find the user using username or email
    // --------------------------------------------------

    let user;

    if (normalizedIdentifier.startsWith('@')) {

      // Username login
      user = await User.findOne({
        userName: normalizedIdentifier
      });

    } else if (
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedIdentifier)
    ) {

      // Email login
      user = await User.findOne({
        email: normalizedIdentifier.toLowerCase()
      });

    } else {

      return res.status(400).json({
        success: false,
        message: 'Invalid identifier format'
      });

    }

    // Avoid revealing whether a username or email exists.
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // --------------------------------------------------
    // 3. Verify the user's password
    // --------------------------------------------------

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // --------------------------------------------------
    // 4. Validate JWT configuration
    // --------------------------------------------------

    if (!process.env.AXE_TOKEN || !process.env.REF_TOKEN) {
      throw new Error('JWT environment configuration missing');
    }

    // --------------------------------------------------
    // 5. Generate a refresh token
    // --------------------------------------------------

    // Refresh tokens have a longer lifetime and are used
    // to obtain new access tokens after expiration.
    const refToken = jwt.sign(
      {
        userId: user._id
      },
      process.env.REF_TOKEN,
      {
        expiresIn: '1d'
      }
    );

    // Store only the SHA-256 hash of the refresh token.
    // The refresh endpoint must compare this hash before
    // issuing another access token.
    user.refreshTokenHash = hashToken(refToken);

    await user.save();

    // --------------------------------------------------
    // 6. Generate an access token
    // --------------------------------------------------

    // Access tokens contain the claims required by the
    // authentication middleware and have a shorter lifetime.
    const accessToken = jwt.sign(
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
    // 7. Set the refresh token as an HttpOnly cookie
    // --------------------------------------------------

    // HttpOnly prevents frontend JavaScript from reading
    // the refresh token directly.
    res.cookie('ref_token', refToken, {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    // --------------------------------------------------
    // 8. Return successful authentication response
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      message: 'Login successful',

      // Access token is returned to the client.
      token: accessToken,

      // Return only the user information needed by the frontend.
      user: {
        profilePicture: user.profilePicture,
        userName: user.userName,
        email: user.email,
        mobile: user.mobile,
        deliveryAddress: user.deliveryAddress
      }
    });

  } catch (error) {

    // Log detailed errors on the server, not in the API response.
    console.error('[AUTH:LOGIN]', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });

  }
});
