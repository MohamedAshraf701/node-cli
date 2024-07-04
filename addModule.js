// Importing necessary modules
const { program } = require('commander');
const { folders, file } = require('./structures/module');
const mkdirp = require('mkdirp');
const fs = require('fs'); // File system module for file operations
const path = require('path'); // Module for handling file paths

// Setting up the CLI tool with commander
program
    .version('1.0.0')
    .description('A CLI tool to create a folder structure for Node.js projects')
    .arguments('<name>')
    .action((name, options) => {
        // 'name' will be the first argument after the command
        if (!name) {
            console.log('Please provide a project name as an argument.');
            process.exit(1); // Exit if project name is not provided
        } else {
            const rootPath = path.join(process.cwd(), "/demo"); // Root path of the project
            // Create directories as specified in folders array
            folders.forEach(folder => {
                mkdirp.sync(path.join(rootPath, folder)); // Create directory synchronously
                console.log(`Folder "${folder}" created successfully.`);
            });

            // Create files as specified in files array
            file(name).forEach(file => {
                const filePath = file.folder ? path.join(rootPath, file.folder, file.name) : path.join(rootPath, file.name);
                fs.writeFileSync(filePath, file.content); // Write file synchronously
                console.log(`File "${file.name}" created successfully.`);
            });

            // Execute command to install required packages
            console.log(`
Add This Code Into Your Project Main file 

// Importing route 
const Routes${name} = require("./Routes/${name}.Route");

// Registering route with API v1 router
apiV1Router.use("/${name}", Routes${name});
`);
        }
    });

// Parse command line arguments
program.parse(process.argv);