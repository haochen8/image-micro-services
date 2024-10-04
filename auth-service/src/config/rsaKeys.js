/**
 * @file Provides the RSA private key used to sign JWTs.
 * @module config/rsaKeys
 * @author Hao Chen
 * @version 1.0.0
 */
import fs from 'fs'
import path from 'path'

// Load the RSA private key from the file system.
const privateKeyPath = path.join(process.env.PRIVATE_KEY_PATH)
const privateKey = fs.readFileSync(privateKeyPath, 'utf8')

export { privateKey }
