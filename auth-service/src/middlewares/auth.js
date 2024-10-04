/**
 * @file Authentication and authorization middlewares.
 * @module middlewares/auth
 * @author Mats Loock
 * @version 1.0.0
 */

import http from 'node:http'
import { JsonWebToken } from '../lib/JsonWebToken.js'

/**
 * Permission levels.
 *
 * @enum {number}
 */
export const PermissionLevels = Object.freeze({
  READ: 1,
  CREATE: 2,
  UPDATE: 4,
  DELETE: 8
})

/**
 * Checks if the user has the required permission level.
 *
 * This middleware compares the user's permission level against the required permission level.
 * If the user has the required permission level, the next middleware is called.
 * Otherwise, an unauthorized response with a 403 Forbidden status code is sent.
 *
 * @param {number} permissionLevel - Required permission level.
 * @returns {Function} Express middleware function.
 */
export const hasPermission = (permissionLevel) => {
  return (req, res, next) => {
    if (req.user?.permissionLevel & permissionLevel) {
      next()
      return
    }

    // Authorization failed.
    const httpStatusCode = 403
    const err = new Error(http.STATUS_CODES[httpStatusCode])
    err.status = httpStatusCode

    next(err)
  }
}
/**
 * Authenticates a request based on a JSON Web Token (JWT).
 *
 * This middleware checks the authorization header of the request, verifies the authentication scheme,
 * decodes the JWT using the provided secret key, and attaches the decoded user object to the `req.user` property.
 * If the authentication fails, an unauthorized response with a 401 Unauthorized status code is sent.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const authenticateJWT = async (req, res, next) => {
  try {
    const [authenticationScheme, token] = req.headers.authorization?.split(' ')

    if (authenticationScheme !== 'Bearer') {
      throw new Error('Invalid authentication scheme.')
    }

    req.user = await JsonWebToken.decodeUser(token, process.env.ACCESS_TOKEN_SECRET)

    next()
  } catch (error) {
    // Authentication failed.
    const statusCode = 401
    const err = new Error(http.STATUS_CODES[statusCode])
    err.status = statusCode
    err.cause = error

    next(err)
  }
}
