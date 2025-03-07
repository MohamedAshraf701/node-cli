#!/usr/bin/env node

// Importing necessary modules
const { program } = require('commander');
const askQuestion = require('./init'); // Function to initialize questions
const { default: chalk } = require('chalk');
const { default: inquirer } = require('inquirer');

async function Language(options) {
  if (!options.javascript && !options.typescript) {
    const answers = await inquirer.prompt({
      name: "language",
      type: "list",
      message: "Choose a language:\n",
      choices: [
        { name: chalk.yellow("JavaScript"), value: "javascript" },
        { name: chalk.blue("TypeScript"), value: "typescript" }
      ]
    });

    options[answers.language] = true;
  }
}

async function DB(options) {
  if (!options.mongo && !options.seque) {
    const answers = await inquirer.prompt({
      name: "database",
      type: "list",
      message: "Choose a database:\n",
      choices: [
        { name: chalk.green("MongoDB"), value: "mongo" },
        { name: chalk.red("Sequelize"), value: "seque" }
      ]
    });

    options[answers.database] = true;
  }
}

async function FrameWork(options) {
  if (!options.express && !options.fastify && !options.elysia) {
    const answers = await inquirer.prompt({
      name: "framework",
      type: "list",
      message: "Choose a framework:\n",
      choices: [
        { name: chalk.cyan("Express"), value: "express" },
        { name: chalk.magenta("Fastify"), value: "fastify" },
        { name: chalk.white("Elysia"), value: "elysia" }
      ]
    });

    options[answers.framework] = true;
  }
}

// Setting up the CLI tool with commander
program
  .version('1.0.0')
  .description('A CLI tool to create a folder structure for Node.js projects')
  .option('-m, --mongo', 'SetUp Initializing For MongoDB')
  .option('-s, --seque', 'SetUp Initializing For Sequelize')
  .option('-y, --yes', 'Create default structure')
  .option('-e, --express', 'SetUp Initializing For express js')
  .option('-f, --fastify', 'SetUp Initializing For fastify js')
  .option('-el, --elysia', 'SetUp Initializing For elysia js')
  .option('-j, --javascript', 'SetUp Initializing For javascript')
  .option('-t, --typescript', 'SetUp Initializing For typescript')
  .action( async (options) => {
    
    // Ask for missing selections
    await Language(options);
    await DB(options);
    await FrameWork(options);

    if (options.express && options.fastify && options.elysia) {
      console.error('Please choose only one option: either --express or --fastify or --elysia, not all.');
      process.exit(1);
    }
    if (options.javascript && options.typescript) {
      console.error('Please choose only one option: either --javascript or --typescript, not both.');
      process.exit(1);
    }

    // Existing conditions for mongo/seque options and default structure (--yes)
    if (options.yes) {
        console.log('Creating default structure...');
        askQuestion(9, options); // Start asking initial questions with default structure
    } else {
      askQuestion(0, options); // Start asking initial questions
    }
  });

// Parse command line arguments
program.parse(process.argv);

