#!/usr/bin/env node

// Importing necessary modules
const { program } = require('commander');
const askQuestion = require('./init'); // Function to initialize questions

// Setting up the CLI tool with commander
program
  .version('1.0.0')
  .description('A CLI tool to create a folder structure for Node.js projects')
  .option('-m, --mongo', 'SetUp Initializing For MongoDB')
  .option('-s, --seque', 'SetUp Initializing For Sequelize')
  .option('-y, --yes', 'Create default structure')
  .option('-e, --express', 'SetUp Initializing For express js')
  .option('-f, --fastify', 'SetUp Initializing For fastify js')
  .action((options) => {
    // Ensure that exactly one of --express or --fastify is chosen
    if (!options.express && !options.fastify) {
      console.error('Please choose one of the following options: --express or --fastify');
      process.exit(1);
    }
    if (options.express && options.fastify) {
      console.error('Please choose only one option: either --express or --fastify, not both.');
      process.exit(1);
    }

    // Existing conditions for mongo/seque options and default structure (--yes)
    if (options.yes) {
      if (!options.mongo && !options.seque) {
        console.log('Please choose one of the following options with -y --mongo or --seque');
        process.exit(1);
      } else {
        console.log('Creating default structure...');
        askQuestion(9, options); // Start asking initial questions with default structure
      }
    } else if (!options.seque && !options.mongo) {
      console.log('Please choose one of the following options: --mongo or --seque');
      process.exit(1);
    } else {
      askQuestion(0, options); // Start asking initial questions
    }
  });

// Parse command line arguments
program.parse(process.argv);

