#!/usr/bin/env node

// Importing necessary modules
const { program } = require('commander');
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
const Mongo = require('./structures/mongo'); // MongoDB structure configuration
const Seque = require('./structures/sequelize'); // Sequelize structure configuration
const { exec } = require('child_process');
const askQuestion = require('./init'); // Function to initialize questions

// Variables to hold folder and file structures and commands
let folders;
let files;
let cmd;

// Setting up the CLI tool with commander
program
    .version('1.0.0')
    .description('A CLI tool to create a folder structure for Node.js projects')
    .option('-m, --mongo', 'SetUp Initializing For MongoDB')
    .option('-s, --seque', 'SetUp Initializing For Sequelize')
    .action((options) => {
        const rootPath = path.join(process.cwd()); // Root path of the project
        askQuestion(0); // Start asking initial question

        // Determine which database setup to initialize based on user input
        if(options.seque){
            folders = Seque.folders; // Folders from Sequelize configuration
            files = Seque.files; // Files from Sequelize configuration
            cmd = Seque.cmd; // Command to execute from Sequelize configuration
        } else if(options.mongo) {
            folders = Mongo.folders; // Folders from MongoDB configuration
            files = Mongo.files; // Files from MongoDB configuration
            cmd = Mongo.cmd; // Command to execute from MongoDB configuration
        } else {
            console.log('Please choose one of the following options: --mongo or --seque');
            process.exit(1); // Exit if no valid option is provided
        }

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
        });
    });

// Parse command line arguments
program.parse(process.argv);
