#!/usr/bin/env node

const { program } = require('commander');
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
const { folders, files, cmd } = require('./structures/NodeMongo');
const { exec } = require('child_process');


program
    .version('1.0.0')
    .description('A CLI tool to create a folder structure for Node.js and MongoDB projects')
    .arguments('<name>')
    .action((name) => {
        const rootPath = path.join(process.cwd());


        folders.forEach(folder => {
            mkdirp.sync(path.join(rootPath, folder)); // Using mkdirp.sync to create directories synchronously
            console.log(`Folder "${folder}" created successfully.`);
        });

        files.forEach(file => {
            const filePath = file.folder ? path.join(rootPath, file.folder, file.name) : path.join(rootPath, file.name);
            fs.writeFileSync(filePath, file.content); // Using fs.writeFileSync to write files synchronously
            console.log(`File "${file.name}" created successfully.`);
        });
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

program.parse(process.argv);
