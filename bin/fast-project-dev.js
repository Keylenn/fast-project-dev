#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();

const fs = require("fs");
const path = require("path");

const commandDir = path.join(__dirname, "../src/command");

fs.readdir(commandDir, (err, files) => {
  if (err) return;

  files
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => {
      const filePath = path.join(commandDir, file);
      try {
        const command = require(filePath);
        command(program);
      } catch (error) {
        console.error(`command "${file}" execution error:`, error);
      }
    });

  program.parse(process.argv);
});
