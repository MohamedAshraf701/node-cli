module.exports = {
    folders: ['config','Controllers', 'Routes', 'Models', 'uploads', 'Middleware' , 'Utils'],
    files: (index,Projectname) =>{return [
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
    Health: (req, res, done) => {
        try {
            // Attempt to send a success response indicating the health status
            ResponseHandler.sendSuccess(res, "health Status", Codes.OK, Messages.OK);
            return;
        } catch (error) {
            // Handle any errors that occur during the process by sending an error response
            ResponseHandler.sendError(res, error, Codes.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR);
            return; // Pass the error to the next middleware for further handling
        }
    }
}
                              
                ` },
        {
            folder: 'Routes',
            name: 'health.Route.js',
            content:
                `
// Routes/health.Route.js
/**
 * This module exports a function that defines routes for health checks.
 * It imports the HealthController and sets up a GET route for the health check endpoint.
 */

const HealthController = require("../Controllers/health.Controller");

/**
 * This function is used to define routes for the Fastify server.
 * It sets up a GET route for the health check endpoint.
 * 
 * @param {Fastify} fastify - The Fastify server instance.
 * @param {Object} options - Options for the route.
 */
async function routes(fastify, options) {
    fastify.get("/", HealthController.Health);
}

module.exports = routes;
                ` },
                {
                    folder: 'Middleware', name: 'fileUpload.js',
                    content:
                        `
/**
 * This module exports a middleware function for handling file uploads.
 * It uses the 'fs' and 'path' modules to write the uploaded file to a directory.
 * The middleware function is designed to work with Fastify and its multipart plugin.
 * It handles file uploads by writing the file to a specified directory and storing
 * the file details in the request object.
 */

const fs = require("fs");
const path = require("path");

/**
 * The uploadMiddleware function handles file uploads.
 * It attempts to read the file from the request, writes it to a directory,
 * and stores the file details in the request object.
 * 
 * @param {NextFunction} req - The Fastify request object.
 * @param {Reply} reply - The Fastify reply object.
 */
const uploadMiddleware = async (req, reply) => {
    try {
        //postman key name should be 'file'
        const data = await req.file();
        if (!data) {
            return reply.status(400).send({ error: "No file uploaded" });
        }
        const uniqueFilename = Date.now() +'_'+data.filename;

        // Define the file upload path
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true }); // Create uploads folder if not exists
        }
    
        const filePath = path.join(uploadDir, uniqueFilename);
    
        await fs.promises.writeFile(filePath, await data.toBuffer());
       
        req.uploadedFile = {
            filename: data.filename,
            mimetype: data.mimetype,
            size: data.file.size
        };

    } catch (err) {
        reply.status(500).send({ error: "File upload failed", details: err.message });
    }
};

module.exports = uploadMiddleware;           
                ` },
                {
                  folder: 'Models',
                  name: 'Example.Model.js',
                  content:
                      `
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); // Update the path as necessary

const ExampleModel = sequelize.define('ExampleModel', {
    // String field with required validation, minimum length, maximum length, and default value
    stringField: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'String field is required' },
            len: {
                args: [5, 50],
                msg: 'String field must be between 5 and 50 characters long'
            }
        },
        defaultValue: 'Default String'
    },
    // Number field with required validation, minimum value, maximum value, and default value
    numberField: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: 'Number field is required' },
            min: {
                args: [0],
                msg: 'Number field must be at least 0'
            },
            max: {
                args: [100],
                msg: 'Number field must be less than or equal to 100'
            }
        },
        defaultValue: 42
    },
    // Date field with default value set to current date and time
    dateField: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    // Buffer field for storing binary data (no specific validation or default value provided here)
    bufferField: {
        type: DataTypes.BLOB
    },
    // Boolean field with default value
    booleanField: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    // Mixed field that can hold any type of value, with an empty object as default (using JSON type)
    mixedField: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    // ObjectId field for referencing another document (self-referencing for ${Projectname})
    objectIdField: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    // Array field containing strings, with default values
    arrayField: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: ['defaultItem1', 'defaultItem2']
    },
    // Decimal128 field for high-precision decimal values
    decimal128Field: {
        type: DataTypes.DECIMAL(38, 16),
        defaultValue: 0.0
    },
    // Map field for storing key-value pairs of strings (using JSON type)
    mapField: {
        type: DataTypes.JSON,
        defaultValue: { key1: 'value1', key2: 'value2' }
    },
    // Nested object with fields containing default values (using JSON type)
    nestedObject: {
        type: DataTypes.JSON,
        defaultValue: { nestedString: 'Nested Default String', nestedNumber: 10 }
    },
    // List of lists containing nested arrays of numbers with default values
    listOfLists: {
        type: DataTypes.JSON,
        defaultValue: [[1, 2, 3], [4, 5, 6]]
    },
    // List of objects with subfields and default values
    listOfObjects: {
        type: DataTypes.JSON,
        defaultValue: [
            { subField1: 'Default1', subField2: 100 },
            { subField1: 'Default2', subField2: 200 }
        ]
    },
    // Email field with validation for format, uniqueness, and trimming
    emailField: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
            this.setDataValue('emailField', value.trim().toLowerCase());
        },
        validate: {
            notNull: { msg: 'Email is required' },
            isEmail: { msg: 'Invalid email address' }
        }
    }
}, {
    tableName: 'example_models',
    timestamps: true
});

module.exports = ExampleModel;
                      
                      
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
  CONTINUE: "Continue",
  SWITCHING_PROTOCOLS: "Switching Protocols",
  PROCESSING: "Processing",
  OK: "The request has succeeded",
  CREATED: "The request has been fulfilled, resulting in the creation of a new resource",
  ACCEPTED: "The request has been accepted for processing, but the processing has not been completed",
  NON_AUTHORITATIVE_INFORMATION: "The server is a transforming proxy that received a 200 OK from its origin but is returning a modified version of the origin's response",
  NO_CONTENT: "The server successfully processed the request and is not returning any content",
  RESET_CONTENT: "The server successfully processed the request, asks that the requester reset its document view, and is not returning any content",
  PARTIAL_CONTENT: "The server is delivering only part of the resource due to a range header sent by the client",
  MULTIPLE_CHOICES: "The request has more than one possible response",
  MOVED_PERMANENTLY: "The URL of the requested resource has been changed permanently",
  FOUND: "The URL of the requested resource has been changed temporarily",
  SEE_OTHER: "The server sent this response to direct the client to get the requested resource at another URI with a GET request",
  NOT_MODIFIED: "Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match",
  TEMPORARY_REDIRECT: "The server is currently responding to the request with a different URI but the client should continue to use the original URI for future requests",
  PERMANENT_REDIRECT: "The server is currently responding to the request with a different URI, and the client should use the new URI for future requests",
  BAD_REQUEST: "The server could not understand the request due to invalid syntax",
  UNAUTHORIZED: "The client must authenticate itself to get the requested response",
  PAYMENT_REQUIRED: "This response code is reserved for future use",
  FORBIDDEN: "The client does not have access rights to the content",
  NOT_FOUND: "The server can not find the requested resource",
  METHOD_NOT_ALLOWED: "The request method is known by the server but is not supported by the target resource",
  NOT_ACCEPTABLE: "The server cannot produce a response matching the list of acceptable values defined in the request's proactive content negotiation headers",
  PROXY_AUTHENTICATION_REQUIRED: "The client must first authenticate itself with the proxy",
  REQUEST_TIMEOUT: "The server would like to shut down this unused connection",
  CONFLICT: "This response is sent when a request conflicts with the current state of the server",
  GONE: "This response is sent when the requested content has been permanently deleted from the server, with no forwarding address",
  LENGTH_REQUIRED: "The server rejects the request because the Content-Length header field is not defined and the server requires it",
  PRECONDITION_FAILED: "The client has indicated preconditions in its headers which the server does not meet",
  PAYLOAD_TOO_LARGE: "The request entity is larger than limits defined by server",
  URI_TOO_LONG: "The URI requested by the client is longer than the server is willing to interpret",
  UNSUPPORTED_MEDIA_TYPE: "The media format of the requested data is not supported by the server",
  RANGE_NOT_SATISFIABLE: "The range specified by the Range header field in the request can't be fulfilled",
  EXPECTATION_FAILED: "This response code means the expectation indicated by the Expect request-header field can't be met by the server",
  IM_A_TEAPOT: "The server refuses the attempt to brew coffee with a teapot",
  MISDIRECTED_REQUEST: "The request was directed at a server that is not able to produce a response",
  UNPROCESSABLE_ENTITY: "The request was well-formed but was unable to be followed due to semantic errors",
  LOCKED: "The resource that is being accessed is locked",
  FAILED_DEPENDENCY: "The request failed due to failure of a previous request",
  TOO_EARLY: "Indicates that the server is unwilling to risk processing a request that might be replayed",
  UPGRADE_REQUIRED: "The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol",
  PRECONDITION_REQUIRED: "The origin server requires the request to be conditional",
  TOO_MANY_REQUESTS: "The user has sent too many requests in a given amount of time ('rate limiting')",
  REQUEST_HEADER_FIELDS_TOO_LARGE: "The server is unwilling to process the request because its header fields are too large",
  UNAVAILABLE_FOR_LEGAL_REASONS: "The server is denying access to the resource as a consequence of a legal demand",
  INTERNAL_SERVER_ERROR: "Internal server error occurred."
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
            folder : 'Middleware', name : 'jwtToken.js', content :
            `'use strict'
// jwtHelper.js
/**
 * Creates a JWT token based on the provided payload.
 * 
 * @param {Request} req - The Fastify request object.
 * @param {Object} payload - The payload to be signed into the token.
 * @returns {Promise<string>} A promise that resolves to the created token.
 */
const createToken = async (req, payload) => {
    try {
        const token = await req.server.jwt.sign(payload);
        return token;
    } catch (error) {
        throw new Error('Error creating token: ' + error.message);
    }
};

/**
 * Verifies a JWT token and returns its decoded payload.
 * 
 * @param {Request} req - The Fastify request object.
 * @param {string} token - The token to be verified.
 * @returns {Promise<Object>} A promise that resolves to the decoded token payload.
 */
const verifyToken = async (req, token) => {
    try {
        const decoded = await req.server.jwt.verify(token);
        return decoded;
    } catch (error) {
        throw new Error('Error verifying token: ' + error.message);
    }
};

/**
 * Middleware function for JWT authentication.
 * 
 * @param {Request} req - The Fastify request object.
 * @param {Reply} reply - The Fastify reply object.
 */
const authenticateMiddleware = async (req, reply) => {
    try {
        await req.jwtVerify();
    } catch (err) {
        reply.status(401).send({ error: "Unauthorized" });
    }
};

module.exports = {
    createToken,
    verifyToken,
    authenticateMiddleware
};     
            `
        },
        {
            folder: 'Utils', name: 'responseHandler.js', content:
                `
/**
 * This module provides a utility class for handling HTTP responses in a standardized way.
 * It includes methods for sending success and error responses with customizable status codes and messages.
 * 
 * @module ResponseHandler
 */

const { Codes, Messages } = require("./httpCodesAndMessages");

/**
 * Represents a utility class for handling HTTP responses.
 * 
 * @class ResponseHandler
 */
class ResponseHandler {
 /**
     * Sends a successful HTTP response.
     * 
     * @param {Response} res - The Express response object.
     * @param {*} data - The data to be sent in the response.
     * @param {number} [statusCode=Codes.OK] - The HTTP status code for the response.
     * @param {string} [message=Messages.OK] - The message to be sent in the response.
     */
  static sendSuccess(res, data, statusCode = Codes.OK, message = Messages.OK) {
    if(res.sent) return;

    return res.code(statusCode).send({
      success: true,
      status: statusCode,
      message: message,
      data: data,
    });
  }
  /**
   * Method to send error response.
   * @param {Object} res - The response object.
   * @param {Object} error - The error object.
   * @param {number} statusCode - The status code of the response. Default is 500.
   * @param {string} message - The message of the response. Default is 'Internal Server Error'.
   * @returns {Object} The error response.
   */
  static sendError(
    res,
    error,
    statusCode = Codes.INTERNAL_SERVER_ERROR,
    message = Messages.INTERNAL_SERVER_ERROR
  ) {
    if(res.sent) return;

    res.code(statusCode).send({
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
            folder: '', name: index, content:
                `
/**
 * Initializes the Fastify server with logging enabled.
 * Loads environment variables from a .env file.
 * Registers necessary plugins for CORS, form body parsing, JWT authentication, multipart file uploads, and static file serving.
 * Sets up a custom authentication decorator for JWT verification.
 * Configures the database connection.
 * Registers routes for health checks and sets up error handlers for not found and general errors.
 * Starts the server on a specified port, using HTTPS if enabled.
 */
const fastify = require('fastify')({ logger: true }); 
const dotenv = require("dotenv").config();
const fs = require('fs');

// Import JWT functions
const {  authenticateMiddleware } = require('./Middleware/jwtToken');

// Registering plugins for CORS, form body parsing, JWT authentication, multipart file uploads, and static file serving
fastify.register(require('@fastify/cors'));
fastify.register(require('@fastify/formbody'));
fastify.register(require("@fastify/multipart"));

fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET  || 'X~7W@**TsZ=@}XT/"Z<bo7oDY8gtD('
});

// Custom decorator for JWT authentication
fastify.decorate("authenticate", authenticateMiddleware);

// Database initialization
const { connectDB } = require("./config/dbConfig"); // Importing DB connection function
connectDB(); // Connecting to the database

// Registering routes for static file serving
fastify.register(require('@fastify/static'), {
  root: __dirname + '/uploads',
  prefix: '/api/v1/uploads/'
});

// Registering routes for health checks
const RoutesHealth = require("./Routes/health.Route");
fastify.register(RoutesHealth ,{prefix : "/api/v1/health"});

// Setting up error handler for not found routes
fastify.setNotFoundHandler((request, reply) => {
  reply.code(404).send({
    error: {
      status: 404,
      message: "Not found"
    }
  });
});

// Setting up general error handler
fastify.setErrorHandler((error, request, reply) => {
  reply.code(error.statusCode || 500).send({
    error: {
      status: error.statusCode || 500,
      message: error.message
    }
  });
});

// Setting up server port
const PORT = process.env.PORT || 8096;

// Function to start the server
const startServer = async () => {
  try {
    // Determining if HTTPS should be used
    if (process.env.IS_HTTPS == "true") {
      fastify.server.cert = fs.readFileSync(process.env.CARTPATH);
      fastify.server.key = fs.readFileSync(process.env.KEYPATH);
      
      await fastify.listen({ port: PORT });
      console.log('HTTPS Server started on port:', PORT);
    } else {
      await fastify.listen({ port: PORT });
      console.log('HTTP Server started on port:', PORT);
    }
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Starting the server
startServer();
                ` },
        {
            folder: 'config', name: 'dbConfig.js',
            content:
                `
// Importing Sequelize constructor from the sequelize package.
const { Sequelize } = require('sequelize');

// Creating an instance of Sequelize to connect to our MySQL database using environment variables.
let sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST, // Database host URL
  dialect: 'mysql', // Database dialect
});

// Asynchronous function to establish a connection to the database and synchronize the models.
const connectDB = async () => {
  try {
    // Synchronizes all defined models to the database.
    // 'alter: false' ensures the database should not be altered.
    await sequelize.sync({ alter: false });
    console.log('Connection has been established successfully.'); // Success message
  } catch (error) {
    console.error('Unable to connect to the database:', error); // Error handling
  }
};

// Exporting the sequelize instance and connectDB function to be used in other parts of the application.
module.exports = { sequelize, connectDB };
                
                ` },{ folder: 'config', name: 'initModels.js',
                content:`
const initModels = () => {
    // Associate models here if necessary
    // e.g., User.hasMany(Posts);
};

module.exports = { initModels };
                `},
        {
            folder: '', name: '.env', content:
                `PORT=3000
DB_HOST=localhost
DB_NAME=test
DB_USER=
DB_PASS=
IS_HTTPS=false
KEYPATH=
CARTPATH=
JWT_SECRET=` }, // Empty .env file
{
    folder: '', name: '.gitignore', content:
        `
node_modules
package-lock.json
.env
  ` 
  } ,
{
    folder: '', name: 'README.md', content:
        `
# *${Projectname}*

This project was generated using node-initdb, a CLI tool for initializing database configurations, web framework setups, and project structures in Node.js projects. *This setup requires you to choose one option from each category: a database, a web framework, and a language.*

## Features

- Preconfigured folder structure for streamlined project development.
- *Database Support:* Choose between MongoDB (via Mongoose) or Sequelize (MySQL).
- *Web Framework:* Set up with Express or Fastify.
- *Language Choice:* Develop in JavaScript or TypeScript.
- Integrated file upload functionality.
- Pre-configured JWT-based authentication.
- Automatically installs required dependencies based on your selected configuration.

## Folder Structure

The following structure was generated:


- config/
- Controllers/
- Routes/
- Models/
- Middleware/
- uploads/
- Utils/


## Getting Started

### Setup Project

Use the 'node-initdb' command to create the project. *You must select one option from each category:*

- *Database:*
  - MongoDB: '-m' or '--mongo'
  - Sequelize: '-s' or '--seque'
- *Web Framework:*
  - Express: '-e' or '--express'
  - Fastify: '-f' or '--fastify'
- *Language:*
  - JavaScript: '-j' or '--javascript'
  - TypeScript: '-t' or '--typescript'

Optionally, add '-y' or '--yes' to skip interactive prompts and use default values.

For example, to set up a project with MongoDB, Express, and TypeScript:

bash
node-initdb -m -e -t


### Adding a Module

To add a new module to your project, use the 'node-add' command with the same required options:

bash
node-add <moduleName> [-m / --mongo] [-s / --seque] [-e / --express] [-f / --fastify] [-j / --javascript] [-t / --typescript]


For example, to add a "user" module for MongoDB, Express, and TypeScript:

bash
node-add user -m -e -t


## About node-initdb

node-initdb is designed to simplify the setup of database-driven projects by generating a preconfigured folder structure and installing required dependencies based on your chosen database, web framework, and language.

For more information, visit:
- GitHub: @MohamedAshraf701

---

If you encounter any issues, feel free to reach out at ashrafchauhan567@gmail.com or open an issue on GitHub.

        ` }
    ]},
    cmd : '@fastify/formbody @fastify/cors @fastify/multipart @fastify/static dotenv fastify fastify-jwt fs @fastify/jwt sequelize mysql2 bun'
}