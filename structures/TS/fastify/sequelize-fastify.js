module.exports = {
    folders: ['config','Controllers', 'Routes', 'Models', 'uploads', 'Middleware' , 'Utils'],
    files: (index,Projectname) =>{return [
        {
            folder: 'Controllers',
            name: 'health.Controller.ts',
            content:
                `
import { FastifyReply, FastifyRequest } from "fastify/fastify";
import { Codes, Messages } from "../Utils/httpCodesAndMessages";
import ResponseHandler from "../Utils/responseHandler";

export const HealthController = {
  // Health check endpoint
  Health: async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
    try {
      const file = req.uploadedFile; // ✅ Get the uploaded file details

      if (!file) {
        return ResponseHandler.sendError(res, 'No file uploaded', Codes.BAD_REQUEST, Messages.BAD_REQUEST);
      }
      // Send a success response indicating the health status
      ResponseHandler.sendSuccess(res, "health Status", Codes.OK, Messages.OK);
    } catch (error: any) {
      // Handle errors by sending an error response
      ResponseHandler.sendError(
        res,
        error,
        Codes.INTERNAL_SERVER_ERROR,
        Messages.INTERNAL_SERVER_ERROR
      );
    }
  }
};                       
                              
                ` },
        {
            folder: 'Routes',
            name: 'health.Route.ts',
            content:
                `
/**
 * This module exports a function that defines routes for health checks.
 * It imports the HealthController and sets up a GET route for the health check endpoint.
 */

import { FastifyInstance } from 'fastify';
import { HealthController } from '../Controllers/health.Controller';
import uploadMiddleware from '../Middleware/fileUpload';

/**
 * This function is used to define routes for the Fastify server.
 * It sets up a GET route for the health check endpoint.
 * 
 * @param {Fastify} fastify - The Fastify server instance.
 * @param {Object} options - Options for the route.
 */
async function healthRoutes(fastify: FastifyInstance) {
    fastify.post("/", { preHandler:uploadMiddleware } ,HealthController.Health);
}

export default healthRoutes;                
            
` },
                {
                    folder: 'Middleware', name: 'fileUpload.ts',
                    content:
                        `
/**
 * This module exports a middleware function for handling file uploads.
 * It uses the 'fs' and 'path' modules to write the uploaded file to a directory.
 * The middleware function is designed to work with Fastify and its multipart plugin.
 * It handles file uploads by writing the file to a specified directory and storing
 * the file details in the request object.
 */

import { FastifyReply, FastifyRequest } from 'fastify';
import fs from 'fs';
import path from 'path';
import '@fastify/multipart';
declare module 'fastify' {
  interface FastifyRequest {
    uploadedFile?: {
      filename: string;
      mimetype: string;
      size: any;
    };
  }
}

const uploadMiddleware = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    // Check if the request is multipart
    if (!req.isMultipart()) {
      return reply.status(400).send({ error: "Request is not multipart" });
    }

    const data = await req.file();
    if (!data) {
      return reply.status(400).send({ error: "No file uploaded" });
    }
    const uniqueFilename = Date.now() +'_'+data.filename;;

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
      size: data.file.bytesRead
    };

  } catch (err) {
    reply.status(500).send({ error: "File upload failed", details: err.message });
  }
};
                
export default uploadMiddleware;           

                ` },
        {
            folder: 'Models',
            name: 'example.Model.ts',
            content:
                `
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfig";

// Define TypeScript interface for model attributes
interface ExampleAttributes {
  id?: string;
  stringField: string;
  numberField: number;
  dateField?: Date;
  bufferField?: Buffer;
  booleanField: boolean;
  mixedField: any;
  objectIdField?: string;
  arrayField: string[];
  decimal128Field: number;
  mapField: Record<string, string>;
  nestedObject: {
    nestedString: string;
    nestedNumber: number;
  };
  listOfLists: number[][];
  listOfObjects: {
    subField1: string;
    subField2: number;
  }[];
  emailField: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define optional attributes for creation
interface ExampleCreationAttributes extends Optional<ExampleAttributes, "id"> {}

// Define the ExampleModel class extending Sequelize Model
class ExampleModel extends Model<ExampleAttributes, ExampleCreationAttributes> implements ExampleAttributes {
  public id!: string;
  public stringField!: string;
  public numberField!: number;
  public dateField!: Date;
  public bufferField!: Buffer;
  public booleanField!: boolean;
  public mixedField!: any;
  public objectIdField!: string;
  public arrayField!: string[];
  public decimal128Field!: number;
  public mapField!: Record<string, string>;
  public nestedObject!: {
    nestedString: string;
    nestedNumber: number;
  };
  public listOfLists!: number[][];
  public listOfObjects!: {
    subField1: string;
    subField2: number;
  }[];
  public emailField!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
ExampleModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    stringField: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "String field is required" },
        len: {
          args: [5, 50],
          msg: "String field must be between 5 and 50 characters long",
        },
      },
      defaultValue: "Default String",
    },
    numberField: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Number field is required" },
        min: {
          args: [0],
          msg: "Number field must be at least 0",
        },
        max: {
          args: [100],
          msg: "Number field must be less than or equal to 100",
        },
      },
      defaultValue: 42,
    },
    dateField: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    bufferField: {
      type: DataTypes.BLOB,
    },
    booleanField: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    mixedField: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    objectIdField: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    arrayField: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: ["defaultItem1", "defaultItem2"],
    },
    decimal128Field: {
      type: DataTypes.DECIMAL(38, 16),
      defaultValue: 0.0,
    },
    mapField: {
      type: DataTypes.JSON,
      defaultValue: { key1: "value1", key2: "value2" },
    },
    nestedObject: {
      type: DataTypes.JSON,
      defaultValue: { nestedString: "Nested Default String", nestedNumber: 10 },
    },
    listOfLists: {
      type: DataTypes.JSON,
      defaultValue: [
        [1, 2, 3],
        [4, 5, 6],
      ],
    },
    listOfObjects: {
      type: DataTypes.JSON,
      defaultValue: [
        { subField1: "Default1", subField2: 100 },
        { subField1: "Default2", subField2: 200 },
      ],
    },
    emailField: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value: string) {
        this.setDataValue("emailField", value.trim().toLowerCase());
      },
      validate: {
        notNull: { msg: "Email is required" },
        isEmail: { msg: "Invalid email address" },
      },
    },
  },
  {
    sequelize,
    tableName: "example_models",
    timestamps: true,
  }
);

export default ExampleModel;
                
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
            folder : 'Middleware', name : 'jwtToken.ts', content :
            `'use strict'
// jwtHelper.ts
import jwt from 'jsonwebtoken';
import ResponseHandler from '../Utils/responseHandler';
import { Codes, Messages } from '../Utils/httpCodesAndMessages';
import { FastifyReply, FastifyRequest } from 'fastify/fastify';

const SECRET_KEY: string =
  process.env.JWT_SECRET || 'X~7W@**TsZ=@}XT/"Z<bo7oDY8gtD(';

interface ValidateTokenResult {
  valid: boolean;
  decoded?: any;
  error?: string;
}

class JWTHelper {
  /**
   * Create a new JWT token
   * @param payload - The payload to include in the token
   * @param options - Options for token creation, such as 'expiresIn'
   * @returns The created JWT token as a string
   */
  static createToken(payload: object, options: any = {}): string {
    const tokenOptions: any = {};
    if (options.expiresIn) {
      tokenOptions.expiresIn = options.expiresIn;
    }
    return jwt.sign(payload, SECRET_KEY, tokenOptions);
  }

  /**
   * Validate a JWT token
   * @param token - The token to validate
   * @returns An object containing a validity flag, and either the decoded token or an error message
   */
  static validateToken(token: string): ValidateTokenResult {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      return { valid: true, decoded };
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        return { valid: false, error: 'Token has expired' };
      }
      return { valid: false, error: error.message };
    }
  }

  /**
   * Middleware to validate JWT token in requests
   * @param req - The Express request object
   * @param res - The Express response object
   * @param next - The next middleware function
   */
  static tokenMiddleware(req: FastifyRequest, res: FastifyReply, done: any ): void {
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : undefined;
    if (!token) {
      ResponseHandler.sendError(
        res,
        'No token provided',
        Codes.UNAUTHORIZED,
        Messages.UNAUTHORIZED
      );
      return;
    }

    const { valid, decoded, error } = JWTHelper.validateToken(token);
    if (valid) {
      // Attach the decoded payload to the request object.
      // If you want to use strong typing for req.user, extend Express.Request interface.
      (req as any).user = decoded;
      done();
    } else {
      if (error === 'Token has expired') {
        ResponseHandler.sendError(
          res,
          'Token has expired',
          Codes.UNAUTHORIZED,
          Messages.UNAUTHORIZED
        );
        return;
      }
      ResponseHandler.sendError(
        res,
        'Invalid token',
        Codes.UNAUTHORIZED,
        Messages.UNAUTHORIZED
      );
      return;
    }
  }
}
export default JWTHelper;

            `
        },
        {
            folder: 'Utils', name: 'responseHandler.ts', content:
                `
/**
 * ResponseHandler class to handle success and error responses.
 * @class
 */
import { Codes, Messages } from './httpCodesAndMessages';
import { FastifyReply } from 'fastify/fastify';

class ResponseHandler {
  static sendSuccess(
    res: FastifyReply,
    data: any,
    statusCode: number = Codes.OK,
    message: string = Messages.OK
  ): void {
    if(res.send) return;

    res.status(statusCode).send({
      success: true,
      status: statusCode,
      message: message,
      data: data,
    });
  }

  static sendError(
    res: FastifyReply,
    error: any,
    statusCode: number = Codes.INTERNAL_SERVER_ERROR,
    message: string = Messages.INTERNAL_SERVER_ERROR
  ): void {
    if(res.send) return;

    res.status(statusCode).send({
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

/**
 * Initializes the Fastify server with logging enabled.
 * Loads environment variables from a .env file.
 * Registers necessary plugins for CORS, form body parsing, JWT authentication, multipart file uploads, and static file serving.
 * Sets up a custom authentication decorator for JWT verification.
 * Configures the database connection.
 * Registers routes for health checks and sets up error handlers for not found and general errors.
 * Starts the server on a specified port, using HTTPS if enabled.
 */
import fastify from 'fastify';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import multipart from '@fastify/multipart';
import fastifyJwt from '@fastify/jwt';
import fastifyStatic from '@fastify/static';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import https from 'https';
import { connectDB } from './config/dbConfig';
import { initModels } from "./config/initModels";

// Load environment variables from .env file
dotenv.config({ path: '.env.example' });

// Import custom JWT middleware function (ensure this is properly typed)
import authenticateMiddleware from './Middleware/jwtToken';

// Import and configure the database connection
// Database initialization
connectDB(); // Connecting to the database

// Model initialization
initModels(); // Initializing models

// Create Fastify instance with logging enabled and https options if enabled
const server: FastifyInstance = fastify({
  logger: true,
  https: process.env.IS_HTTPS === 'true' ? {
    key: fs.readFileSync(process.env.KEYPATH as string),
    cert: fs.readFileSync(process.env.CARTPATH as string)
  } : undefined
});
// Register plugins
server.register(cors);
server.register(formbody);
server.register(multipart);

// Register JWT plugin with secret from environment variables
server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET as string,
});

// Custom decorator for JWT authentication
server.decorate('authenticate', authenticateMiddleware);

// Register static file serving for uploads
server.register(fastifyStatic, {
  root: path.join(__dirname, 'uploads'),
  prefix: '/api/v1/uploads/',
});


// Import routes
import RoutesHealth from './Routes/health.Route';
// Register routes
server.register(RoutesHealth, { prefix: '/api/v1/health' });

// Set up error handler for not found routes
server.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
  reply.code(404).send({
    error: {
      status: 404,
      message: 'Not found',
    },
  });
});

// Set up a general error handler
server.setErrorHandler((error, request, reply) => {
  reply.code(error.statusCode || 500).send({
    error: {
      status: error.statusCode || 500,
      message: error.message,
    },
  });
});

// Define the server port
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8096;

// Function to start the server
const startServer = async (): Promise<void> => {

  // Start HTTPS server
  await server.listen({ port: PORT });
  console.log('HTTPS Server started on port:', PORT);
};

// Start the server
startServer();                

                ` },
        {
            folder: 'config', name: 'dbConfig.ts',
            content:
                `
// Importing Sequelize constructor from the sequelize package.
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
  // e.g., User has many Posts
  // User.hasMany(Post, { foreignKey: "userId" });
};

// Export the function
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
env.example
` 
},
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
    cmd : 'npm install @fastify/formbody @fastify/cors @fastify/multipart @fastify/static bcryptjs config cors mongoose multer typescript @types/cors @types/jsonwebtoken @types/multer @types/node concurrently @types/config @types/bcryptjs jsonwebtoken http-errors @types/sequelize dotenv fastify fastify-jwt fs ts-node @fastify/jwt sequelize mysql2'
}