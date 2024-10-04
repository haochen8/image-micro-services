/**
 * @file API version 1 router.
 * @module routes/router
 * @author Hao Chen
 * @version 3.0.0
 */

import express from 'express'
import { router as imageRouter } from './imageRouter.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to version 1 of this very simple RESTful API!' }))
router.use('/images', imageRouter)
