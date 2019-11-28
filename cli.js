#!/usr/bin/env node

const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const inquirer = require("inquirer");
const createProject  = require("./main");

clear();
console.log(
  chalk.yellow(figlet.textSync("NodeBoiler", { horizontalLayout: "full" }))
);

async function promptForMissingOptions() {
  const defaultTemplate = "NodeJs with Mongoose";
  const questions = [];
  questions.push({
    type: "list",
    name: "template",
    message: "Please choose which project template to use",
    choices: ["NodeJs with Mongoose"],
    // choices: ["NodeJs with Mongoose", "NodeJs with default Mongo Client"],
    default: defaultTemplate
  });

  const answers = await inquirer.prompt(questions);
  return {
    template: answers.template,
    projectName: process.argv[2] || 'myapp'
  };
}

async function init() {
  options = await promptForMissingOptions();
  await createProject(options);
}

init();
