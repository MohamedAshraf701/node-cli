module.exports = {
    folders: ['config', 'Controllers' , 'Routes', 'Models', 'uploads', 'Middleware' , 'Utils'],
    files: (index,Projectname) =>{return [
        {
            folder: 'Controllers',
            name: 'health.Controller.ts',
            content:
                `
  // Importing HTTP status codes and messages from utilities
  import { Codes, Messages } from '../Utils/httpCodesAndMessages';
  // Importing the response handler utility for managing API responses
  import ResponseHandler from '../Utils/responseHandler';
  import { Request, Response, NextFunction } from 'express';

  export default {
      // Health check endpoint
    Health: (req: Request, res: Response, next: NextFunction): void => {
        try {            
            // Send a success response indicating the health status
            ResponseHandler.sendSuccess(res, "health Status", Codes.OK, Messages.OK);
            return;
        } catch (error: any) {
            // Handle errors by sending an error response
            ResponseHandler.sendError(
                res,
                error,
                Codes.INTERNAL_SERVER_ERROR,
                Messages.INTERNAL_SERVER_ERROR
            );
            return;
        }
    },
  }
                ` },
        {
            folder: 'Routes',
            name: 'health.Route.ts',
            content:
                `
// Importing the express module to create router instances and handle the routing
import express from 'express'
// Creating a router instance from express to define route handlers
const router = express.Router();

// Importing the HealthController from the Controllers directory
import HealthController from '../Controllers/Health.Controller';

// Defining a GET route on the root path which uses the Health method from HealthController to handle requests
router.get("/" ,HealthController.Health);

// Exporting the router instance to be used in other parts of the application
export default router;                
                ` },
                {
                    folder: 'Middleware', name: 'fileUpload.ts',
                    content:
                        `
/**
 * @fileoverview This module sets up and exports a configured Multer instance 
 * for handling file uploads in a Node.js application. It includes:
 * - Storage configuration for saving uploaded files.
 * - File filtering to allow only image uploads.
 * - File size limit enforcement.
 */

import multer from 'multer';
import { Request } from 'express';
import fs from 'fs';
import path from 'path';

type CustomFileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

// Define the upload directory
const uploadDir = path.join(__dirname, '..', 'uploads');
console.log(uploadDir);

// Ensure the uploads directory exists; if not, create it.
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage settings for multer
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, uploadDir); // Set upload destination folder
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    cb(null, Date.now() + "-" + file.originalname); // Rename file with timestamp to avoid conflicts
  },
});

// Define a filter to allow only image files
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: CustomFileFilterCallback,
) => {
  if (file.mimetype.startsWith("image/")) {
    callback(null, true); // Accept the file
  } else {
    callback(new Error("Only images are allowed!"), false); // Reject non-image files
  }
};

// Configure multer with storage, file filtering, and size limits
const upload = multer({
  storage, // Use defined storage settings
  fileFilter, // Apply file type filter
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
});

export default upload;

                ` },
        {
            folder: 'Models',
            name: 'example.Model.ts',
            content:
                `
const { DataTypes } = require('sequelize'); // Importing DataTypes from sequelize for defining model attributes
const { sequelize } = require('../config/dbConfig'); // Importing sequelize instance from dbConfig

// Defining the example model with its structure and rules
const example = sequelize.define('example', {
  username: {
    type: DataTypes.STRING, // Specifies the data type of username as string
    allowNull: false, // Makes the username field non-nullable
  },
  email: {
    type: DataTypes.STRING, // Specifies the data type of email as string
    allowNull: false, // Makes the email field non-nullable
    unique: true, // Ensures email values are unique across the table
  },
  password: {
    type: DataTypes.STRING, // Specifies the data type of password as string
    allowNull: false, // Makes the password field non-nullable
  },
}, {
  // options - Additional model configuration options can be specified here
});

module.exports = example; // Exporting the example model for use in other parts of the application
                
                
        ` },
        { folder: 'uploads', name: 'dummy', content: '// Dummy file' },
        {
            folder: 'Utils', name: 'httpCodesAndMessages.ts', content:
                `
// HTTP Status Codes
// This object maps standard HTTP status codes to their numeric values.
export const Codes: Record<string, number> = {
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
export const Messages: Record<string, string> = {
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
  INTERNAL_SERVER_ERROR: "Internal server error occurred.",
  DATA_RETRIEVED_SUCCESS: "Data retrieved successfully",
  DATA_CREATED_SUCCESS: "Data created successfully",
  DATA_UPDATED_SUCCESS: "Data updated successfully",
  DATA_DELETED_SUCCESS: "Data deleted successfully",
};

const httpCodesAndMessages = { Codes, Messages };

export default httpCodesAndMessages;
                         
                `
        },
        {
            folder : 'Utils', name : 'validations.ts', content :
            `
// Validation.js
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 international phone number format

/**
 * Validate if a value is a valid email.
 * @param email - The email string to validate.
 * @returns A boolean indicating whether the email is valid.
 */
export function isValidEmail(email: string): boolean {
  return emailRegex.test(email);
}

/**
 * Validate if a value is a valid phone number.
 * @param phoneNumber - The phone number string to validate.
 * @returns A boolean indicating whether the phone number is valid.
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  return phoneRegex.test(phoneNumber);
}

/**
 * Validate if a value is an empty string.
 * @param str - The string to validate.
 * @returns A boolean indicating whether the string is empty.
 */
export function isEmptyString(str: string): boolean {
  return typeof str === 'string' && str.trim().length === 0;
}

/**
 * Validate if a value is an empty array.
 * @param arr - The array to validate.
 * @returns A boolean indicating whether the array is empty.
 */
export function isEmptyArray(arr: any[]): boolean {
  return Array.isArray(arr) && arr.length === 0;
}

/**
 * Validate if a value is not null or undefined.
 * @param value - The value to validate.
 * @returns A boolean indicating whether the value is neither null nor undefined.
 */
export function isNotNullOrUndefined(value: unknown): boolean {
  return value !== null && value !== undefined;
}

/**
 * Validate if an object has all required fields.
 * @param obj - The object to validate.
 * @param requiredFields - An array of required field names.
 * @returns A boolean indicating whether the object has all required fields.
 */
export function hasRequiredFields(
  obj: Record<string, any>,
  requiredFields: string[]
): boolean {
  return requiredFields.every(
    (field) => Object.prototype.hasOwnProperty.call(obj, field) && isNotNullOrUndefined(obj[field])
  );
}
            
            `
        },
        {
            folder: 'Utils', name: 'responseHandler.ts', content:
                `
import { Response } from 'express';
import { Codes, Messages } from './httpCodesAndMessages';

class ResponseHandler {
  static sendSuccess(
    res: Response,
    data: any,
    statusCode: number = Codes.OK,
    message: string = Messages.OK
  ): void {
    res.status(statusCode).json({
      success: true,
      status: statusCode,
      message: message,
      data: data,
    });
  }

  static sendError(
    res: Response,
    error: any,
    statusCode: number = Codes.INTERNAL_SERVER_ERROR,
    message: string = Messages.INTERNAL_SERVER_ERROR
  ): void {
    res.status(statusCode).json({
      success: false,
      status: statusCode,
      message: message,
      error: error.message || error,
    });
  }
}

export default ResponseHandler;

                
` },
        {
            folder: '', name: index, content:
                `
// Importing necessary modules

import express, { NextFunction, Response, Request } from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from "body-parser";
import { connectDB } from "../config/dbConfig";
import { initModels } from "../config/initModels";
import fs from 'fs'
import createHttpError from "http-errors";

const app = express();

dotenv.config({ path: '.env.example' });

app.use(cors()); // Using CORS middleware in the app
app.use(express.json()); // Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const apiV1Router = express.Router(); // Creating a new router for API version 1

// Database initialization
connectDB(); // Connecting to the database

// Model initialization
initModels(); // Initializing models

// Middleware to log request details after response is sent
app.use((req: Request, res: Response, next: NextFunction) => {
    res.on("finish", () => {
        console.log(req.method + " - " + req.originalUrl + " - " + res.statusCode);
    });
    next();
});

apiV1Router.use('/uploads', express.static('uploads')); // Serving static files from 'uploads' directory

// Importing route for health checks
import RouterHealth from './routes/health.Route'

// Registering health check route with API v1 router
apiV1Router.use("/health", RouterHealth);

// Middleware to handle 404 Not Found error for API v1 routes
apiV1Router.use((req, res, next) => {
    next(createHttpError(404, "Not found"));
});

// Custom error handler middleware for API v1 routes
apiV1Router.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500); // Setting the response status code
    res.send({
        error: {
            status: err.status || 500, // Error status code
            message: err.message, // Error message
        },
    });
});

app.use("/api/v1", apiV1Router); // Mounting API v1 router at '/api/v1'

import https from 'https' // Importing HTTPS module
const PORT = process.env.PORT || 8096; // Setting port from environment variable or default to 8096
// Check if HTTPS is enabled via environment variable
if (process.env.IS_HTTPS == "true") {
    if (!process.env.KEYPATH || !process.env.CARTPATH) {
        throw new Error('HTTPS certificate paths are not configured');
    }
    const privateKey = fs.readFileSync(process.env.KEYPATH, 'utf8'); // Reading private key for HTTPS
    const certificate = fs.readFileSync(process.env.CARTPATH, 'utf8'); // Reading certificate for HTTPS
    const credentials = { key: privateKey, cert: certificate }; // Creating credentials object

    // Creating and starting HTTPS server
    let server = https.createServer(credentials, app);
    server.listen(PORT, () => {
        console.log('HTTPS Server started on port :', PORT);
    });
} else {
    // Starting HTTP server if HTTPS is not enabled
    app.listen(PORT, () => {
        console.log('HTTP Server started on port :', PORT);
    });
}

                ` },
        {
            folder: 'config', name: 'dbConfig.ts',
            content:
                `
import { Sequelize } from "sequelize";

// Initialize Sequelize with MySQL connection using environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST as string,
    dialect: "mysql",
    logging: false, // Disable logging for cleaner output (optional)
  }
);

// Asynchronous function to establish and test the database connection
const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate(); // Test database connection
    await sequelize.sync({ alter: false }); // Synchronize models without altering tables
    console.log("✅ Database connection established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

// Exporting the sequelize instance and connectDB function
export { sequelize, connectDB };

                
                ` },{ folder: 'config', name: 'initModels.ts',
                content:`
const initModels = (): void => {
    // Associate models here if necessary
    // e.g., User.hasMany(Posts);
};

export { initModels };
                `},
        {
            folder: '', name: '.env.example', content:
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
    folder: '', name: 'tsconfig.json', content:
        `
{
"compilerOptions": {
"module": "commonjs",
"esModuleInterop": true,
"target": "es6",
"noImplicitAny": true,
"moduleResolution": "node",
"sourceMap": true,
"outDir": "dist",
"baseUrl": ".",
"paths": {
"*": ["node_modules/*", "types/*"]
}
},
"include": ["*"]
}

` 
} ,
  {
    folder: '', name: '.gitignore', content:
        `
node_modules
dist
package-lock.json

` 
} ,
{
    folder: '', name: 'README.md', content:
        `# **${Projectname}**

This project was generated using [node-initdb](https://www.npmjs.com/package/node-initdb), a CLI tool for initializing database configurations and folder structures in Node.js projects.

## Features

- Preconfigured folders and files for seamless project setup.
- Supports MongoDB (via Mongoose) and Sequelize (MySQL) integrations.
- Automatically installs required dependencies for your database.

## Folder Structure

The following structure was generated:

---
- config/
- Controllers/
- Routes/
- Models/
- uploads/
- Middleware/
- Utils/
---

## Getting Started

### **Setup Project**

Use the  \`node-initdb\` command to create the project:

\`\`\`bash
node-initdb [-m / --mongo] [-s / --seque]
\`\`\`

For example:

\`\`\`bash
node-initdb -m
\`\`\`

### **Adding a Module**

Use the  \`node-add\` command to add new modules to this project:

\`\`\`bash
node-add <moduleName> [-m / --mongo] [-s / --seque]
\`\`\`

For example:

\`\`\`bash
node-add user -m
\`\`\`

## About Node-initdb

**node-initdb** is developed to simplify database-driven project setup. For more information, visit:
- GitHub: [@MohamedAshraf701](https://github.com/MohamedAshraf701)

---

If you encounter issues, feel free to reach out at ashrafchauhan567@gmail.com or open an issue on GitHub.

        ` }
    ]},
    cmd : 'npm install @types/bcryptjs @types/config @types/cors body-parser typescript cors dotenv express fs http-errors https jsonwebtoken sequelize @types/sequelize mysql2 multer @types/express @types/gravatar @types/jsonwebtoken @types/multer @types/node concurrently @types/http-errors'
}    
