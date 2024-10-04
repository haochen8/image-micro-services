/**
 * @file Authentication and authorization middlewares.
 * @module middlewares/auth
 * @author Mats Loock
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken'
import { publicKey } from '../config/rsaKeys.js'

/**
 * Authenticates a JSON Web Token.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
export function authenticateToken (req, res, next) {
  // Extract the token from the request's authorization header
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  // Check if the token is present
  if (token == null) {
    return res.status(401).json({ message: 'No token provided' })
  }

  // Verify the token
  jwt.verify(token, publicKey, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' })
    }
    req.user = { id: decodedToken.sub }
    next()
  })
}
