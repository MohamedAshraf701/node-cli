module.exports = {
    folders: ['config','Controllers', 'Routes', 'Models', 'uploads', 'Utils'],
    files: [
        {
            folder: 'Controllers',
            name: 'health.Controller.js',
            content:
                `
  // Importing HTTP status codes and messages from utilities
  const { Codes, Messages } = require("../Utils/httpCodesAndMessages");
  // Importing the response handler utility for managing API responses
  const ResponseHandler = require("../Utils/responseHandler");
  
  module.exports = {
      // Health check endpoint
      Health: (req, res, next) => {
          try {
              // Attempt to send a success response indicating the health status
              ResponseHandler.sendSuccess(res, "health Status", Codes.OK, Messages.OK);
              return;
          } catch (error) {
              // Handle any errors that occur during the process by sending an error response
              ResponseHandler.sendError(res, error, Codes.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR);
              next(error); // Pass the error to the next middleware for further handling
          }
      }
  }
                ` },
        {
            folder: 'Routes',
            name: 'health.Route.js',
            content:
                `
// Importing the express module to create router instances and handle the routing
const express = require("express");
// Creating a router instance from express to define route handlers
const router = express.Router();

// Importing the HealthController from the Controllers directory
const HealthController = require("../Controllers/health.Controller")

// Defining a GET route on the root path which uses the Health method from HealthController to handle requests
router.get("/" ,HealthController.Health);

// Exporting the router instance to be used in other parts of the application
module.exports = router;
                ` },
        {
            folder: 'Models',
            name: 'user.Model.js',
            content:
                `
  // Load mongoose module for MongoDB interactions
  const mongoose = require("mongoose");
  
  // Retrieve the Schema constructor from the mongoose object
  const Schema = mongoose.Schema;
  
  // Define the schema for a user with specific fields and validation rules
  const userSchema = new Schema({
      // Define a 'username' field which is of type String and is required
      username: {
          type: String,
          require: true
      },
  }, { timestamps: true }); // Enable automatic creation of createdAt and updatedAt timestamps
  
  // Create a model from the schema to interface with the database
  const Users = mongoose.model("Users", userSchema);
  
  // Export the Users model to be used in other parts of the application
  module.exports = Users;
                
        ` },
        { folder: 'uploads', name: 'dummy', content: '// Dummy file' },
        {
            folder: 'Utils', name: 'httpCodesAndMessages.js', content:
                `
  // HTTP Status Codes
  // This object maps standard HTTP status codes to their numeric values.
  const Codes = {
    CONTINUE: 100,
    SWITCHING_PROTOCOLS: 101,
    PROCESSING: 102,
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NON_AUTHORITATIVE_INFORMATION: 203,
    NO_CONTENT: 204,
    RESET_CONTENT: 205,
    PARTIAL_CONTENT: 206,
    MULTIPLE_CHOICES: 300,
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    SEE_OTHER: 303,
    NOT_MODIFIED: 304,
    TEMPORARY_REDIRECT: 307,
    PERMANENT_REDIRECT: 308,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    PROXY_AUTHENTICATION_REQUIRED: 407,
    REQUEST_TIMEOUT: 408,
    CONFLICT: 409,
    GONE: 410,
    LENGTH_REQUIRED: 411,
    PRECONDITION_FAILED: 412,
    PAYLOAD_TOO_LARGE: 413,
    URI_TOO_LONG: 414,
    UNSUPPORTED_MEDIA_TYPE: 415,
    RANGE_NOT_SATISFIABLE: 416,
    EXPECTATION_FAILED: 417,
    IM_A_TEAPOT: 418,
    MISDIRECTED_REQUEST: 421,
    UNPROCESSABLE_ENTITY: 422,
    LOCKED: 423,
    FAILED_DEPENDENCY: 424,
    TOO_EARLY: 425,
    UPGRADE_REQUIRED: 426,
    PRECONDITION_REQUIRED: 428,
    TOO_MANY_REQUESTS: 429,
    REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
    UNAVAILABLE_FOR_LEGAL_REASONS: 451,
    INTERNAL_SERVER_ERROR: 500,
  };
  // HTTP Status Messages
  // This object maps standard HTTP status codes to their default message strings.
  const Messages = {
    CONTINUE: 'Continue',
    SWITCHING_PROTOCOLS: 'Switching Protocols',
    PROCESSING: 'Processing',
    OK: 'The request has succeeded',
    CREATED: 'The request has been fulfilled, resulting in the creation of a new resource',
    ACCEPTED: 'The request has been accepted for processing, but the processing has not been completed',
    NON_AUTHORITATIVE_INFORMATION: 'The server is a transforming proxy that received a 200 OK from its origin but is returning a modified version of the origin\'s response',
    NO_CONTENT: 'The server successfully processed the request and is not returning any content',
    RESET_CONTENT: 'The server successfully processed the request, asks that the requester reset its document view, and is not returning any content',
    PARTIAL_CONTENT: 'The server is delivering only part of the resource due to a range header sent by the client',
    MULTIPLE_CHOICES: 'The request has more than one possible response',
    MOVED_PERMANENTLY: 'The URL of the requested resource has been changed permanently',
    FOUND: 'The URL of the requested resource has been changed temporarily',
    SEE_OTHER: 'The server sent this response to direct the client to get the requested resource at another URI with a GET request',
    NOT_MODIFIED: 'Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match',
    TEMPORARY_REDIRECT: 'The server is currently responding to the request with a different URI but the client should continue to use the original URI for future requests',
    PERMANENT_REDIRECT: 'The server is currently responding to the request with a different URI, and the client should use the new URI for future requests',
    BAD_REQUEST: 'The server could not understand the request due to invalid syntax',
    UNAUTHORIZED: 'The client must authenticate itself to get the requested response',
    PAYMENT_REQUIRED: 'This response code is reserved for future use',
    FORBIDDEN: 'The client does not have access rights to the content',
    NOT_FOUND: 'The server can not find the requested resource',
    METHOD_NOT_ALLOWED: 'The request method is known by the server but is not supported by the target resource',
    NOT_ACCEPTABLE: 'The server cannot produce a response matching the list of acceptable values defined in the request\'s proactive content negotiation headers',
    PROXY_AUTHENTICATION_REQUIRED: 'The client must first authenticate itself with the proxy',
    REQUEST_TIMEOUT: 'The server would like to shut down this unused connection',
    CONFLICT: 'This response is sent when a request conflicts with the current state of the server',
    GONE: 'This response is sent when the requested content has been permanently deleted from the server, with no forwarding address',
    LENGTH_REQUIRED: 'The server rejects the request because the Content-Length header field is not defined and the server requires it',
    PRECONDITION_FAILED: 'The client has indicated preconditions in its headers which the server does not meet',
    PAYLOAD_TOO_LARGE: 'The request entity is larger than limits defined by server',
    URI_TOO_LONG: 'The URI requested by the client is longer than the server is willing to interpret',
    UNSUPPORTED_MEDIA_TYPE: 'The media format of the requested data is not supported by the server',
    RANGE_NOT_SATISFIABLE: 'The range specified by the Range header field in the request can\'t be fulfilled',
    EXPECTATION_FAILED: 'This response code means the expectation indicated by the Expect request-header field can\'t be met by the server',
    IM_A_TEAPOT: 'The server refuses the attempt to brew coffee with a teapot',
    MISDIRECTED_REQUEST: 'The request was directed at a server that is not able to produce a response',
    UNPROCESSABLE_ENTITY: 'The request was well-formed but was unable to be followed due to semantic errors',
    LOCKED: 'The resource that is being accessed is locked',
    FAILED_DEPENDENCY: 'The request failed due to failure of a previous request',
    TOO_EARLY: 'Indicates that the server is unwilling to risk processing a request that might be replayed',
    UPGRADE_REQUIRED: 'The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol',
    PRECONDITION_REQUIRED: 'The origin server requires the request to be conditional',
    TOO_MANY_REQUESTS: 'The user has sent too many requests in a given amount of time ("rate limiting")',
    REQUEST_HEADER_FIELDS_TOO_LARGE: 'The server is unwilling to process the request because its header fields are too large',
    UNAVAILABLE_FOR_LEGAL_REASONS: 'The server is denying access to the resource as a consequence of a legal demand',
    INTERNAL_SERVER_ERROR: 'Internal server error occurred.'
  };
  
  module.exports = { Codes, Messages };
                `
        },
        {
            folder : 'Utils', name : 'validations.js', content :
            `
// Validation.js
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 international phone number format

/**
 * Validate if a value is a valid email.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    return emailRegex.test(email);
}

/**
 * Validate if a value is a valid phone number.
 * @param {string} phoneNumber
 * @returns {boolean}
 */
function isValidPhoneNumber(phoneNumber) {
    return phoneRegex.test(phoneNumber);
}

/**
 * Validate if a value is an empty string.
 * @param {string} str
 * @returns {boolean}
 */
function isEmptyString(str) {
    return typeof str === 'string' && str.trim().length === 0;
}

/**
 * Validate if a value is an empty array.
 * @param {Array} arr
 * @returns {boolean}
 */
function isEmptyArray(arr) {
    return Array.isArray(arr) && arr.length === 0;
}

/**
 * Validate if a value is not null or undefined.
 * @param {*} value
 * @returns {boolean}
 */
function isNotNullOrUndefined(value) {
    return value !== null && value !== undefined;
}

/**
 * Validate if an object has all required fields.
 * @param {Object} obj
 * @param {Array} requiredFields
 * @returns {boolean}
 */
function hasRequiredFields(obj, requiredFields) {
    return requiredFields.every(field => obj.hasOwnProperty(field) && isNotNullOrUndefined(obj[field]));
}

module.exports = {
    isValidEmail,
    isValidPhoneNumber,
    isEmptyString,
    isEmptyArray,
    isNotNullOrUndefined,
    hasRequiredFields
};
            
            `
        },
        {
            folder : 'Utils', name : 'jwtToken.js', content :
            `'use strict'
// jwtHelper.js
const jwt = require('jsonwebtoken');
const ResponseHandler = require('./responseHandler');
const { Codes, Messages } = require('./httpCodesAndMessages');

// Secret key for signing tokens
const SECRET_KEY = process.env.JWT_SECRET || 'X~7W@**TsZ=@}XT/"Z<bo7oDY8gtD(';

class JWTHelper {
    /**
     * Create a new JWT token
     * @param {Object} payload - The payload to include in the token
     * @param {Object} options - Options for token creation, such as 'expiresIn'
     * @returns {String} - The created JWT token
     */
    static createToken(payload, options = {}) {
        const tokenOptions = {};
        if (options.expiresIn) {
            tokenOptions.expiresIn = options.expiresIn;
        }
        return jwt.sign(payload, SECRET_KEY, tokenOptions);
    }

    /**
     * Validate a JWT token
     * @param {String} token - The token to validate
     * @returns {Object} - The decoded token if valid, or an error if invalid
     */
    static validateToken(token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            return { valid: true, decoded };
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return { valid: false, error: 'Token has expired' };
            }
            return { valid: false, error: error.message };
        }
    }

    /**
     * Middleware to validate JWT token in requests
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @param {Function} next - The next middleware function
     */
    static tokenMiddleware(req, res, next) {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return ResponseHandler.sendError(res, 'No token provided', Codes.UNAUTHORIZED, Messages.UNAUTHORIZED);
        }

        const { valid, decoded, error } = JWTHelper.validateToken(token);
        if (valid) {
            req.user = decoded; // Attach the decoded payload to the request object
            next();
        } else {
            if (error === 'Token has expired') {
                return ResponseHandler.sendError(res, 'Token has expired', Codes.UNAUTHORIZED, Messages.UNAUTHORIZED);
            }
            return ResponseHandler.sendError(res, 'Invalid token', Codes.UNAUTHORIZED, Messages.UNAUTHORIZED);
        }
    }
}

module.exports = JWTHelper;
            
            `
        },
        {
            folder: 'Utils', name: 'responseHandler.js', content:
                `
const { Codes, Messages } = require('./httpCodesAndMessages');
class ResponseHandler {
    static sendSuccess(res, data, statusCode = Codes.OK , message = Messages.OK) {
        res.status(statusCode).json({
            success: true,
            status: statusCode,
            message: message,
            data: data,
        });
    }

    static sendError(res, error, statusCode = Codes.INTERNAL_SERVER_ERROR , message = Messages.INTERNAL_SERVER_ERROR) {
        res.status(statusCode).json({
            success: false,
            status: statusCode,
            message: message,
            error: error.message || error,
        });
    }
}

module.exports = ResponseHandler;
                
` },
        {
            folder: '', name: 'index.js', content:
                `
const express = require("express"); // Importing express module for server operations
const createError = require("http-errors"); // Importing module to create HTTP errors
const dotenv = require("dotenv").config(); // Loading environment variables from .env file
const cors = require('cors'); // Importing CORS middleware to enable cross-origin requests
const bodyParser = require("body-parser"); // Importing body-parser middleware to parse request bodies
const app = express(); // Creating an instance of express

const fs = require('fs'); // Importing file system module for file operations
app.use(cors()); // Using CORS middleware in the app
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(bodyParser.json()); // Middleware to parse JSON bodies using body-parser

const apiV1Router = express.Router(); // Creating a new router for API version 1

// Initialize DB
require("./config/dbConfig")(); // Importing and executing the database configuration

// Middleware to log request details after response is sent
app.use((req, res, next) => {
  res.on("finish", () => {
      console.log(req.method + " - " + req.originalUrl + " - " + res.statusCode);
  });
  next();
});

apiV1Router.use('/uploads', express.static('uploads')); // Serving static files from 'uploads' directory

// Importing route for health checks
const RoutesHealth = require("./Routes/health.Route");

// Registering health check route with API v1 router
apiV1Router.use("/health", RoutesHealth);

// Middleware to handle 404 Not Found error for API v1 routes
apiV1Router.use((req, res, next) => {
    next(createError(404, "Not found"));
});

// Custom error handler middleware for API v1 routes
apiV1Router.use((err, req, res, next) => {
    res.status(err.status || 500); // Setting the response status code
    res.send({
        error: {
            status: err.status || 500, // Error status code
            message: err.message, // Error message
        },
    });
});

app.use("/api/v1" , apiV1Router); // Mounting API v1 router at '/api/v1'

const http = require("https"); // Importing HTTPS module
const PORT = process.env.PORT || 8096; // Setting port from environment variable or default to 8096
// Check if HTTPS is enabled via environment variable
if (process.env.IS_HTTPS == "true") {
    const privateKey = fs.readFileSync(process.env.KEYPATH, 'utf8'); // Reading private key for HTTPS
    const certificate = fs.readFileSync(process.env.CARTPATH, 'utf8'); // Reading certificate for HTTPS
    const credentials = { key: privateKey, cert: certificate }; // Creating credentials object
    
    // Creating and starting HTTPS server
    let server = http.createServer(credentials, app);
    server.listen(PORT, () => {
        console.log('HTTPS Server started on port :' ,PORT);
    });
} else {
    // Starting HTTP server if HTTPS is not enabled
    app.listen(PORT, () => {
        console.log('HTTP Server started on port :' ,PORT);
    });
}
                ` },
        {
            folder: 'config', name: 'dbConfig.js',
            content:
                `
const mongoose = require('mongoose');

// This module exports a function that sets up the MongoDB connection using Mongoose.
module.exports = () => {
  // Connect to MongoDB using the connection string and credentials from environment variables.
  mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME, // Name of the database to connect to.
      user: process.env.DB_USER,   // Database user's name.
      pass: process.env.DB_PASS,   // Database user's password.
      useNewUrlParser: true,       // Use the new URL parser for MongoDB connection strings.
      useUnifiedTopology: true,    // Use the new engine for MongoDB driver's topology management.
    })
    .then(() => {
      console.log('Mongodb connected....') // Log on successful connection.
    })
    .catch(err => console.log(err.message)); // Log any errors that occur during connection.

  // Event listener for successful connection to the database.
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db...');
  });

  // Event listener for any connection errors.
  mongoose.connection.on('error', err => {
    console.log(err.message); // Log the error message.
  });

  // Event listener for when the connection is disconnected.
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected...');
  });

  // Event listener for SIGINT signal (typically sent from the terminal).
  // This is used to handle graceful shutdown of the application.
  process.on('SIGINT', () => {
    mongoose.connection.close(() => { // Close the MongoDB connection.
      console.log(
        'Mongoose connection is disconnected due to app termination...'
      );
      process.exit(0); // Exit the process after the connection is closed.
    });
  });
};
                ` },
        {
            folder: '', name: '.env', content:
                `PORT=3000
MONGODB_URI=mongodb://localhost:27017/
DB_NAME=test
DB_USER=
DB_PASS=
IS_HTTPS=false
KEYPATH=
CARTPATH=
JWT_SECRET=` } // Empty .env file
    ],
    cmd : 'npm install body-parser cors dotenv express fs http-errors https jsonwebtoken mongoose multer'
}