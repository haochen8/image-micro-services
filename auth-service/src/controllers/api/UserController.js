/**
 * @file Defines the UserController class.
 * @module controllers/UserController
 * @author Mats Loock
 * @version 3.1.0
 */

import { logger } from '../../config/winston.js'
import { UserModel } from '../../models/UserModel.js'

/**
 * Encapsulates a controller.
 */
export class UserController {
  /**
   * Provide req.user to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the user to load.
   */
  async loadUserDocument (req, res, next, id) {
    try {
      logger.silly('Loading user document', { id })

      const userDocument = await UserModel.findById(id)

      if (!userDocument) {
        const error = new Error('User not found.')
        error.status = 404
        throw error
      }

      req.doc = userDocument

      logger.silly('Loaded user document', { id })

      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    try {
      res.json(req.doc)
    } catch (error) {
      next(error)
    }
  }
}
