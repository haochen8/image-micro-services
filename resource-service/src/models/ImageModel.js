/**
 * @file Defines the image model.
 * @module models/ImageModel
 * @author Hao Chen
 * @version 3.0.0
 */

import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

// Create a schema.
const schema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true
  },
  contentType: {
    type: String,
    required: true,
    enum: ['image/jpeg', 'image/png', 'image/gif']
  },
  description: {
    type: String,
    required: false,
    trim: true,
    minlength: 1
  },
  location: {
    type: String,
    required: false,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    String,
    ref: 'user',
    required: true
  },
  data: {
    type: Buffer,
    required: false
  }
},
{ timestamps: true })

schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const ImageModel = mongoose.model('Image', schema)
