/**
 * @file Defines the user model.
 * @module models/UserModel
 * @author Mats Loock
 * @version 3.0.0
 */

import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import validator from 'validator'
import { BASE_SCHEMA } from './baseSchema.js'

const { isEmail } = validator

// Create a schema.
const schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required.'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required.'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email address is required.'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [isEmail, 'Please provide a valid email address.']
  },
  username: {
    type: String,
    required: [true, 'Username is required.'],
    unique: true,
    // - A valid username should start with an alphabet so, [A-Za-z].
    // - All other characters can be alphabets, numbers or an underscore so, [A-Za-z0-9_-].
    // - Since length constraint is 3-256 and we had already fixed the first character, so we give {2, 255}.
    // - We use ^ and $ to specify the beginning and end of matching.
    match: [/^[A-Za-z][A-Za-z0-9_-]{2,255}$/, 'Please provide a valid username.']
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minLength: [10, 'The password must be of minimum length 10 characters.'],
    maxLength: [256, 'The password must be of maximum length 256 characters.']
  },
  permissionLevel: {
    type: Number,
    required: [true, 'Permission level is required.'],
    default: 1,
    enum: [
      1, // read
      2, // create
      3, // read and create
      4, // update
      5, // read and update
      6, // create and update
      8, // delete
      9, // read and delete
      10, // create and delete
      12, // update and delete
      15] // read, create, update and delete
  }
})

schema.add(BASE_SCHEMA)

// Salts and hashes password before save.
schema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

/**
 * Authenticates a user.
 *
 * @param {string} username - The username.
 * @param {string} password - The password.
 * @returns {Promise<UserModel>} A promise that resolves with the user if authentication was successful.
 */
schema.statics.authenticate = async function (username, password) {
  const userDocument = await this.findOne({ username })

  // If no user found or password is wrong, throw an error.
  if (!userDocument || !(await bcrypt.compare(password, userDocument?.password))) {
    throw new Error('Invalid credentials.')
  }

  // User found and password correct, return the user.
  return userDocument
}

// Create a model using the schema.
export const UserModel = mongoose.model('User', schema)
