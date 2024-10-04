/**
 * @file Defines the ImageController class.
 * @module controllers/ImageController
 * @author Hao Chen
 * @version 3.1.0
 */

import axios from 'axios'
import { logger } from '../../config/winston.js'
import { ImageModel } from '../../models/ImageModel.js'

/**
 * Encapsulates a controller.
 */
export class ImageController {
  /**
   * Provide req.doc to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the image to load.
   */
  async loadImageDocument (req, res, next, id) {
    try {
      logger.silly('Loading Image document', { id })

      const imageDocument = await ImageModel.findById(id)
      if (!imageDocument) {
        const error = new Error('The Image you requested does not exist.')
        error.status = 404
        throw error
      }

      req.doc = imageDocument

      logger.silly('Loaded Image document', { id })

      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing a image.
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

  /**
   * Sends a JSON response containing all images.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      logger.silly('Loading all Image documents')

      const images = await ImageModel.find()

      // Convert the Mongoose document to a plain JavaScript object.
      const changedImages = images.map(image => ({
        imageUrl: image.url,
        description: image.description,
        location: image.location,
        createdAt: image.createdAt.toISOString(),
        updatedAt: image.updatedAt.toISOString(),
        id: image._id
      }))

      logger.silly('Loaded all Image documents')

      res.json(changedImages)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a new image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>}
   */
  async create (req, res, next) {
    try {
      logger.silly('Creating new image document', { body: req.body })

      // Check if user is authenticated
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized: User ID is missing from request' })
      }

      // Extract the data from the request body.
      const { data, contentType, description, location } = req.body

      // Send a POST request to the image service.
      const imageServiceResponse = await axios.post(
        'https://courselab.lnu.se/picture-it/images/api/v1/images',
        {
          data,
          contentType
        },
        {
          headers: {
            'X-API-Private-Token': process.env.ACCESS_TOKEN_SECRET,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        })

      // Check if the request was successful.
      if (imageServiceResponse.status === 201) {
        // Extract response data from the image service.
        const { data: { id, imageUrl, contentType, createdAt, updatedAt } } = imageServiceResponse

        // Create a new image document using the ImageModel.
        const imageDocument = await ImageModel.create({
          url: imageUrl,
          description,
          location,
          user: req.user.id,
          imageId: id,
          contentType,
          createdAt,
          updatedAt
        })

        logger.silly('Created new image document')

        // Send a response to the client.
        res
          .status(201)
          .json({
            url: imageDocument.url,
            contentType: imageDocument.contentType,
            createdAt: imageDocument.createdAt.toISOString(),
            updatedAt: imageDocument.updatedAt.toISOString(),
            id: imageDocument._id
          })
      } else {
      // Error cases handling
        logger.error('Image Service failed to create the image', { status: imageServiceResponse.status, data: imageServiceResponse.data })
        res.status(imageServiceResponse.status).json(imageServiceResponse.data)
      }
    } catch (error) {
      logger.error('Error:', error)
      next(error)
    }
  }

  /**
   * Updates a specific image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>}
   */
  async update (req, res, next) {
    try {
      logger.silly('Updating image document', { id: req.params.id })

      // Check if the user is the owner of the image
      if (req.doc.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You can only modify or delete your own images.' })
      }

      // Extract the data from the request body.
      const { data, contentType, description, location } = req.body

      const imageId = req.doc.url.split('/').pop()
      // Send a PUT request to the image service.
      const imageServiceResponse = await axios.put(
        `https://courselab.lnu.se/picture-it/images/api/v1/images/${imageId}`,
        {
          data,
          contentType
        },
        {
          headers: {
            'X-API-Private-Token': process.env.ACCESS_TOKEN_SECRET,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        })
      // Check if the request was successful.
      if (imageServiceResponse.status === 204) {
        // Extract response data from the image service.
        const { data: { imageUrl, contentType, createdAt, updatedAt } } = imageServiceResponse

        // Update the image document using the ImageModel.
        const imageDocument = await ImageModel.findByIdAndUpdate(req.params.id, {
          url: imageUrl,
          description,
          location,
          contentType,
          createdAt,
          updatedAt
        },
        { new: true, runValidators: true })

        logger.silly('Updated image document', { id: req.params.id })

        // Send a response to the client.
        res
          .status(204)
          .json({
            url: imageDocument.url,
            contentType: imageDocument.contentType,
            createdAt: imageDocument.createdAt.toISOString(),
            updatedAt: imageDocument.updatedAt.toISOString(),
            id: imageDocument._id
          })
      }
      logger.silly('Updated image document', { id: req.params.id })
    } catch (error) {
      console.error('Error:', error)
      next(error)
    }
  }

  /**
   * Partially updates the specified image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>}
   */
  async partialUpdate (req, res, next) {
    try {
      logger.silly('Partially updating image document', { id: req.params.id })

      // Check if the user is the owner of the image
      if (req.doc.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You can only modify or delete your own images.' })
      }
      // Find the image document by id
      const imageDocument = await ImageModel.findById(req.params.id)
      if (!imageDocument) {
        const error = new Error('The Image you requested does not exist.')
        error.status = 404
        throw error
      }

      let isChanged = false

      // Check if the request contains description
      if (req.body.description && imageDocument.description !== req.body.description) {
        imageDocument.description = req.body.description
        isChanged = true
      }

      // Check if the request contains location
      if (req.body.location && imageDocument.location !== req.body.location) {
        imageDocument.location = req.body.location
        isChanged = true
      }

      // Check if the request contains contentType
      if (req.body.contentType && imageDocument.contentType !== req.body.contentType) {
        imageDocument.contentType = req.body.contentType
        isChanged = true
      }

      const imageId = req.doc.url.split('/').pop()

      // Check if the request contains data and contentType
      if (req.body.data) {
        // Decode the base64 data

        const buffer = Buffer.from(req.body.data, 'base64')
        // Send a PATCH request to the image service.
        await axios.patch(
          `https://courselab.lnu.se/picture-it/images/api/v1/images/${imageId}`,
          { data: buffer },
          {
            headers: {
              'X-API-Private-Token': process.env.ACCESS_TOKEN_SECRET,
              'Content-Type': 'application/json',
              Accept: 'application/json'
            }
          }
        )
        // Check if the request to external service was successful.
        // Update local imageDocument with the data
        imageDocument.data = buffer
        isChanged = true
      }

      // Save the document only if a change occurred
      if (isChanged) {
        await imageDocument.save()
      }
      // Send a response to the client.
      res
        .status(204)
        .end()
    } catch (error) {
      console.error('Error:', error)
      next(error)
    }
  }

  /**
   * Deletes the specified image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>}
   */
  async delete (req, res, next) {
    try {
      logger.silly('Deleting image document', { id: req.params.id })

      // Check if the user is the owner of the image
      if (req.doc.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You can only modify or delete your own images.' })
      }

      const imageDocument = await ImageModel.findByIdAndDelete(req.params.id)
      if (!imageDocument) {
        const error = new Error('The Image you requested does not exist.')
        error.status = 404
        throw error
      }

      logger.silly('Deleted image document', { id: req.doc.id })

      res
        .status(204)
        .end()
    } catch (error) {
      next(error)
    }
  }
}
