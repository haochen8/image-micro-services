/**
 * @file Defines the image router.
 * @module routes/imageRouter
 * @author Hao Chen
 * @version 3.1.0
 */

import express from 'express'
import { ImageController } from '../../../controllers/api/ImageController.js'
import { authenticateToken } from '../../../middlewares/authToken.js'

export const router = express.Router()

const controller = new ImageController()

// Map HTTP verbs and route paths to controller actions.

// Provide req.image to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => controller.loadImageDocument(req, res, next, id))

// GET images, list all images
router.get('/', authenticateToken, (req, res, next) => controller.findAll(req, res, next)
)

// GET images/:id, get a single image
router.get('/:id', authenticateToken, (req, res, next) => controller.find(req, res, next)
)

// POST images, create a new image
router.post('/', authenticateToken, (req, res, next) => controller.create(req, res, next)
)

// PUT images/:id, update an image
router.put('/:id', authenticateToken, (req, res, next) => controller.update(req, res, next)
)

// PATCH images/:id, partially update an image
router.patch('/:id', authenticateToken, (req, res, next) => controller.partialUpdate(req, res, next))

// DELETE images/:id
router.delete('/:id', authenticateToken, (req, res, next) => controller.delete(req, res, next))
