const fs = require('fs'); // File system module for file operations
const readline = require('readline'); // Module for reading line input from the console
const path = require('path'); // Module for handling file paths
const Mongo = require('./structures/mongo'); // MongoDB structure configuration
const Seque = require('./structures/sequelize'); // Sequelize structure configuration
const { exec } = require('child_process');
const mkdirp = require('mkdirp');
// Variables to hold folder and file structures and commands
let folders;
let files;
let cmd;
// Get the current directory name
const currentDirectoryName = path.basename(process.cwd()); // Stores the name of the current working directory

// Regular expressions for validation
const semverRegex = /^(\d+\.)?(\d+\.)?(\*|\d+)$/; // Regex to validate semantic versioning
const gitRepoRegex = /^(https?:\/\/|git@)([^:/]+)[:/]([^:/]+)\/([^:/]+)(\.git)?$/; // Regex to validate Git repository URLs
const jsFileRegex = /^[a-zA-Z0-9-_]+\.js$/; // Regex to validate JavaScript file names
const licenses = ['MIT', 'ISC', 'Apache-2.0', 'GPL-3.0']; // List of valid licenses

const rl = readline.createInterface({
  input: process.stdin, // Standard input stream
  output: process.stdout // Standard output stream
});

const questions = [ // Array of questions for user input
  `Package name: (${currentDirectoryName}) `,
  "Version: (1.0.0) ",
  "Description: ",
  "Entry point: (index.js) ",
  "Test command: ",
  "Git repository: ",
  "Keywords: ",
  "Author: ",
  `License: (ISC) [${licenses.join(', ')}] `
];

const defaultValues = [ // Default values for each question if no input is provided
  currentDirectoryName,
  "1.0.0",
  "",
  "index.js",
  "echo \"Error: no test specified\" && exit 1",
  "",
  "",
  "",
  "ISC"
];

const answers = []; // Array to store user responses

const validateAnswer = (index, answer) => { // Function to validate user input based on question index
  switch (index) {
    case 1:
      if (answer && !semverRegex.test(answer)) {
        console.log("Invalid version format. Please use semantic versioning (e.g., 1.0.0).");
        return false;
      }
      break;
    case 3:
      if (answer && !jsFileRegex.test(answer)) {
        console.log("Invalid entry point. The file name must end with .js and contain only alphanumeric characters, dashes, or underscores.");
        return false;
      }
      break;
    case 5:
      if (answer && !gitRepoRegex.test(answer)) {
        console.log("Invalid Git repository URL.");
        return false;
      }
      break;
    case 8:
      if (answer && !licenses.includes(answer)) {
        console.log(`Invalid license. Choose one from: ${licenses.join(', ')}.`);
        return false;
      }
      break;
  }
  return true;
};

const askQuestion = (index,options) => { // Recursive function to ask each question to the user
  if (index === questions.length) { // Check if all questions have been asked
    const packageJson = { // Object to store the package.json data
      name: answers[0] || defaultValues[0],
      version: answers[1] || defaultValues[1],
      description: answers[2] || defaultValues[2],
      main: answers[3] || defaultValues[3],
      scripts: {
        start: `node ${answers[3] || defaultValues[3]}`,
        dev: `nodemon ${answers[3] || defaultValues[3]}`,
        test: answers[4] || defaultValues[4]
      },
      repository: answers[5] ? { type: "git", url: answers[5] } : undefined,
      keywords: answers[6] ? answers[6].split(',').map(keyword => keyword.trim()) : [],
      author: answers[7] || defaultValues[7],
      license: answers[8] || defaultValues[8]
    };

    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2)); // Write the package.json file
    console.log("package.json file has been generated");

    rl.close();
     // Determine which database setup to initialize based on user input
     if(options.seque){
        folders = Seque.folders; // Folders from Sequelize configuration
        files = Seque.files(answers[3] || defaultValues[3],answers[0] || defaultValues[0]); // Files from Sequelize configuration
        cmd = Seque.cmd; // Command to execute from Sequelize configuration
    } else if(options.mongo) {
        folders = Mongo.folders; // Folders from MongoDB configuration
        files = Mongo.files(answers[3] || defaultValues[3],answers[0] || defaultValues[0]); // Files from MongoDB configuration
        cmd = Mongo.cmd; // Command to execute from MongoDB configuration
    } else {
        console.log('Please choose one of the following options: --mongo or --seque');
        process.exit(1); // Exit if no valid option is provided
    }
    const rootPath = path.join(process.cwd()); // Root path of the project
    // Create directories as specified in folders array
    folders.forEach(folder => {
        mkdirp.sync(path.join(rootPath, folder)); // Create directory synchronously
        console.log(`Folder "${folder}" created successfully.`);
    });

    // Create files as specified in files array
    files.forEach(file => {
        const filePath = file.folder ? path.join(rootPath, file.folder, file.name) : path.join(rootPath, file.name);
        fs.writeFileSync(filePath, file.content); // Write file synchronously
        console.log(`File "${file.name}" created successfully.`);
    });

    // Execute command to install required packages
    console.log('Installing required packages...');
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error installing packages: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`Packages installed successfully: ${stdout}`);
    }); // Close the readline interface
    return;
  }

  rl.question(questions[index], (answer) => { // Ask the next question
    answer = answer.trim(); // Trim whitespace from the input
    if (validateAnswer(index, answer)) { // Validate the input
      answers.push(answer); // Store valid input
      askQuestion(index + 1,options); // Ask the next question
    } else {
      askQuestion(index,options); // Re-ask the same question if validation fails
    }
  });
};

module.exports = askQuestion // Export the askQuestion function
