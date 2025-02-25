#!/usr/bin/env node
const { program } = require('commander');
const mkdirp = require('mkdirp');
const fs = require('fs'); // File system module for file operations
const path = require('path'); // Module for handling file paths

function capitalizeFirstChar(str) {
    if (!str) return str; // Return the string if it's empty or null
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
// Setting up the CLI tool with commander
program
    .version('1.0.0')
    .description('A CLI tool to create a folder structure for Node.js projects')
    .arguments('<name>')
    .option('-m, --mongo', 'SetUp Initializing For MongoDB')
    .option('-s, --seque', 'SetUp Initializing For Sequelize')
    .option('-e, --express', 'SetUp Initializing For express js')
    .option('-f, --fastify', 'SetUp Initializing For fastify js')
    .option('-j, --javascript', 'SetUp Initializing For javascript')
    .option('-t, --typescript', 'SetUp Initializing For typescript')
  
    .action((name, options) => {
        // 'name' will be the first argument after the command
         const capitalizeAndValidateFilename=(str)=> {
            // Validate input
            if (typeof str !== 'string' || !str) {
                console.log("Input must be a non-empty string");
                process.exit(1); 
            }
          
            // Define invalid characters for filenames
            const invalidChars = /[<>:"\/\\|?*\x00-\x1F]/;
          
            // Check for invalid characters
            if (invalidChars.test(str)) {
                console.log("String contains invalid characters for a filename");
                process.exit(1); 
            }
          
            // Capitalize the first character
            const capitalizedStr = str.charAt(0).toUpperCase() + str.slice(1);
          
            return capitalizedStr;
          }
             // Ensure that exactly one of --express or --fastify is chosen
    if (!options.express && !options.fastify) {
        console.error('Please choose one of the following options: --express or --fastify');
        process.exit(1);
      }
      if (options.express && options.fastify) {
        console.error('Please choose only one option: either --express or --fastify, not both.');
        process.exit(1);
      }
    if (!options.javascript && !options.typescript) {
        console.error('Please choose one of the following options: --javascript or --typescript');
        process.exit(1);
      }
      if (options.javascript && options.typescript) {
        console.error('Please choose only one option: either --javascript or --typescript, not both.');
        process.exit(1);
      }
        if (!name) {
            console.log('Please provide a project name as an argument.');
            process.exit(1); // Exit if project name is not provided
        } else if (!options.seque && !options.mongo) {
            console.log('Please choose one of the following options: --mongo or --seque');
            process.exit(1); // Exit if no valid option is provided
        } else {
            let moduleName =capitalizeAndValidateFilename(name);
            const rootPath = path.join(process.cwd()); // Root path of the project

            if(options.fastify){
                if(options.javascript){
                    const { folders, sfiles, mfiles } = require('./structures/JS/fastify/module-fastify');
                }
                    const { folders, sfiles, mfiles } = require('./structures/TS/fastify/module-fastify');
            }
            else{
                if(options.javascript){
                    const { folders, sfiles, mfiles } = require('./structures/JS/express/module-express');
                }
                    const { folders, sfiles, mfiles } = require('./structures/TS/express/module-express');
            }
            // Create directories as specified in folders array
            folders.forEach(folder => {
                mkdirp.sync(path.join(rootPath, folder)); // Create directory synchronously
                console.log(`Folder "${folder}" created successfully.`);
            });
            let files;
            if (options.seque) {
                files = sfiles(moduleName);
            } else {
                files = mfiles(moduleName);
            }
            // Create files as specified in files array
            files.forEach(file => {
                const filePath = file.folder ? path.join(rootPath, file.folder, file.name) : path.join(rootPath, file.name);
                fs.writeFileSync(filePath, file.content); // Write file synchronously
                console.log(`File "${file.name}" created successfully.`);
            });

            if (options.fastify) {
                if(options.javascript){
                    console.log(`
                        Add This Code Into Your Project Main file 

                        // Importing route 
                        const Routes${moduleName} = require("./Routes/${moduleName}.Route");
                        
                        // Registering route with API v1 router
                        fastify.register(Routes${moduleName} ,{prefix : "/api/v1/${moduleName}"});
                        
                        `);
                }
                    console.log(`
                        Add This Code Into Your Project Main file 

                        // Importing route 
                        import Routes${moduleName} = './Routes/${moduleName}.Route';

                        // Registering route with API v1 router
                        server.register(Routes${moduleName} ,{prefix : "/api/v1/${moduleName}"});

                        `);

                } else{
                // Execute command to install required packages
                    if(options.javascript){
                        console.log(`
                            Add This Code Into Your Project Main file 
                            
                            // Importing route 
                            const Routes${moduleName} = require("./Routes/${moduleName}.Route");
                            
                            // Registering route with API v1 router
                            apiV1Router.use("/${moduleName}", Routes${moduleName});
                        
                            `);
                    }
                    console.log(`
                        Add This Code Into Your Project Main file 
                        
                        // Importing route 
                        import Router${moduleName} from './Routes/${moduleName}.Route'
                        
                        // Registering route with API v1 router
                        apiV1Router.use("/${moduleName}", Router${moduleName});

                        `);
            }

        }
    });

// Parse command line arguments
program.parse(process.argv);