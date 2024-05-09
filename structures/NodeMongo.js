module.exports = {
    folders: ['Controllers', 'Routes', 'Models', 'uploads', 'Utils'],
    files: [
        {
            folder: 'Controllers',
            name: 'health.Controller.js',
            content:
                `const { StatusEnum } = require("../Utils/constant");
const { errorHandler } = require("../Utils/error");
    
module.exports ={
    // Health check endpoint
    Health : (req , res, next) => {
        try {
            // Attempt to send a success response
            res.status(StatusEnum.SUCCESS).json({
                status: StatusEnum.SUCCESS, // HTTP status code
                data: "ok", // Data payload
                message: StatusMessages.SUCCESS, // Success message
            });
            return;
        } catch (error) {
            // Handle any errors that occur during the process
            res.status(StatusEnum.INTERNAL_SERVER_ERROR).json(errorHandler(error));
            next(error); // Pass the error to the next middleware
        }
    }
}` },
        {
            folder: 'Routes',
            name: 'health.Route.js',
            content:
                `const express = require("express");
const router = express.Router();

const HealthController = require("../Controllers/health.Controller")

router.get("/" ,HealthController.Health);


module.exports = router;` },
        {
            folder: 'Models',
            name: 'user.Model.js',
            content:
                `const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
username: {
    type: String,
    require : true
},
}, { timestamps: true });
const Users = mongoose.model("Users", userSchema);
module.exports = Users;
        ` },
        { folder: 'uploads', name: 'dummy', content: '// Dummy file' },
        {
            folder: 'Utils', name: 'constant.js', content:
                `
const StatusEnum = {
    SUCCESS: 200,                  
    NO_CONTENT: 204,                
    ALREADY_EXIST: 409,            
    NOT_FOUND: 404,                
    INTERNAL_SERVER_ERROR: 500,    
    TOKEN_EXP: 401,                
    PATTERN_NOT_MATCH: 422,         
  }
  
  const StatusMessages = {
    SUCCESS: 'Success',
    NO_CONTENT: 'No Content',
    ALREADY_EXIST: 'Already Exist',
    NOT_FOUND: 'Not Found',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    PATTERN_NOT_MATCH: 'Pattern Not Match',
    TOKEN_EXP: "Your token has expired, please login again",
    NO_TOKEN: "Access denied. No token provided.",
    INVALID_TOKEN: "Invalid token.",
  }
  module.exports = {
    StatusEnum,
    StatusMessages,
  }`
        },
        {
            folder : 'Utils', name : 'validations.js', content :
            `
// Validate Email
function validateEmail(email) {
    // Simple email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate Phone Number
function validatePhone(phone) {
    // Custom phone number validation logic
    // This is a simple example, you may need to adapt it to your specific requirements
    const phoneRegex = /^(?:\+\d{1,4}\s*)?\d{10}$/;// Assumes a 10-digit phone number
    return phoneRegex.test(phone);
}

// Validate Required Field
function validateRequiredField(value) {
    return !!value.trim(); // Checks if the value is not empty after trimming whitespace
}

module.exports = {
    validateEmail,
    validatePhone,
    validateRequiredField,
};
            `
        },
        {
            folder : 'Utils', name : 'jwtToken.js', content :
            `'use strict'
const jwt = require('jsonwebtoken');
const Constant = require("./constant")
const ENUM = Constant.StatusEnum;
const MESSAGES = Constant.StatusMessages;

// Generates a new JWT token
module.exports.generateToken = (payload, sKey) => {
    return jwt.sign(payload, sKey);
}

// Verifies a JWT token
module.exports.verifyToken = (req, res, next) => {
  let token;
  let getToken = req.header('Authorization');

  if (getToken) {
    token = req.header('Authorization').split(' ')[1];
  } else {
    return res.status(ENUM.TOKEN_EXP).json({ status: ENUM.TOKEN_EXP, message: MESSAGES.NO_TOKEN });
  }

  try {
    let decodedToken = jwt.verify(token, exports.secretKey());
    let expirationTimeMs = decodedToken.exp * 1000;
    req.user = decodedToken;
    console.log("requested user " + JSON.stringify(req.user));
    if (Date.now() > expirationTimeMs) {
      return res.status(ENUM.TOKEN_EXP).json({ status: ENUM.TOKEN_EXP, message: MESSAGES.TOKEN_EXP });
    }
    next();
  } catch (error) {
    return res.status(ENUM.TOKEN_EXP).json({ status: ENUM.TOKEN_EXP, message: MESSAGES.INVALID_TOKEN });
  }
}

//seceret key
module.exports.secretKey = () => {
    return "abcdefghijklmnopqrstuvwxyz1234567890";
}
            `
        },
        {
            folder: 'Utils', name: 'error.js', content:
                `
const Constant = require("./constant")
const ENUM = Constant.StatusEnum;


const errorHandler = (err) => {
    console.error("Error at driver route: " + err.message);
    return { status: ENUM.INTERNAL_SERVER_ERROR, message: err.message };
};
module.exports={ errorHandler}` },
        {
            folder: '', name: 'app.js', content:
                `const express = require("express");
const createError = require("http-errors");
const dotenv = require("dotenv").config();
const cors = require('cors')
const bodyParser = require("body-parser");
const app = express();

const fs = require('fs');
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const apiV1Router = express.Router();

// Initialize DB
require("./initDB")();


apiV1Router.use('/uploads', express.static('uploads'));

//Routes


// Routes files
const RoutesHealth = require("./Routes/health.Route");

// Api V1 Routes
apiV1Router.use("/health", RoutesHealth);



// Middleware to handle 404 Not Found error for API v1 routes
apiV1Router.use((req, res, next) => {
    next(createError(404, "Not found"));
});

// Custom error handler middleware for API v1 routes
apiV1Router.use((err, req, res, next) => {
    // Set the response status code to the error status or default to 500 if not specified
    res.status(err.status || 500);
    // Send a JSON response containing the error status and message
    res.send({
        error: {
            status: err.status || 500, // Use the error's status or default to 500
            message: err.message, // Include the error message
        },
    });
});


app.use("/api/v1" , apiV1Router);


const http = require("https");
const PORT = process.env.PORT || 8096;
// Check if HTTPS is enabled via environment variable
if (process.env.IS_HTTPS == "true") {
    // Read private key and certificate from specified environment variable paths
    const privateKey = fs.readFileSync(process.env.KEYPATH, 'utf8');
    const certificate = fs.readFileSync(process.env.CARTPATH, 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    
    // Create HTTPS server with the provided credentials and express app
    let server = http.createServer(credentials, app);
    server.listen(PORT, () => {
        console.log('HTTPS Server started on port:' ,PORT);
    });
} else {
    // Start HTTP server if HTTPS is not enabled
    app.listen(PORT, () => {
        console.log('HTTP Server started on port:' ,PORT);
    });
}` },
        {
            folder: '', name: 'initDB.js',
            content:
                `const mongoose = require('mongoose');

module.exports = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
      user: process.env.DB_USER,
      pass: process.env.DB_PASS,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Mongodb connected....')
    })
    .catch(err => console.log(err.message));

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db...');
  });

  mongoose.connection.on('error', err => {
    console.log(err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected...');
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log(
        'Mongoose connection is disconnected due to app termination...'
      );
      process.exit(0);
    });
  });
};` },
        {
            folder: '', name: '.env', content:
                `PORT=3000
                MONGODB_URI=mongodb://localhost:27017/
                DB_NAME=test
                DB_USER=
                DB_PASS=
                IS_HTTPS=false
                KEYPATH=
                CARTPATH=` } // Empty .env file
    ],
    cmd : 'npm install body-parser cors dotenv express fs http http-errors https jsonwebtoken mongoose multer node-cron'
}