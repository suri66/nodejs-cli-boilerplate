const chalk = require("chalk");
const fs = require("fs");
const ncp = require("ncp");
const path = require("path");
const util = require("util");
const cliProgress = require("cli-progress");
const access = util.promisify(fs.access);
const copy = util.promisify(ncp);
const clear = require("clear");
const figlet = require("figlet");
var treeify = require("treeify");

const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false
  });
}

async function createProject(options) {
  console.log(" We are creating your project. Please hold on.\n");
  bar1.start(100, 0);
  options = {
    ...options,
    targetDirectory:
      (options.targetDirectory || process.cwd()) + "/" + options.projectName
  };
  bar1.update(20);

  const templateDir = path.resolve(
    __dirname,
    "./templates",
    options.template.toLowerCase() === "nodejs with mongoose"
      ? "mongoose"
      : "mongoclient"
  );

  bar1.update(40);

  options.templateDirectory = templateDir;

  try {
    await access(templateDir, fs.constants.R_OK);
    bar1.update(60);
  } catch (err) {
    bar1.update(0);
    console.error("%s Invalid template name", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  await copyTemplateFiles(options);
  bar1.update(100);

  clear();
  console.log(
    chalk.yellow(figlet.textSync("NodeBoiler", { horizontalLayout: "full" }))
  );

  bar1.stop();

  console.log(
    treeify.asTree(
      {
        [options.projectName]: "",
        myapp: {
          bin: { www: "" },
          lib: {
            config: {
              "development.js": "",
              "test.js": "",
              "production.js": "",
              "index.js": ""
            },
            db: {
              "db.js": "",
              "seed.js": ""
            },
            logger: {
              "logger.js": ""
            },
            middleware: {
              "middleware.js": ""
            }
          },
          logs: {
            "capturelog.log": ""
          },
          public: {
            images: "",
            javascripts: "",
            stylesheets: ""
          },
          routes: {
            users: {
              "users.js": "",
              "users.model.js": ""
            },
            "configre.js": "",
            "index.js": ""
          },
          views: {
            "error.jade": "",
            "index.jade": "",
            "layout.jade": ""
          },
          ".env": "",
          ".gitignore": "",
          "app.js": "",
          author: "",
          "package.json": "",
          "readme.md": ""
        }
      },
      false
    )
  );
  console.log(" %s", chalk.green.bold("Your project is created successfully!"));
  console.log("\n");
  console.log(` $ cd ${options.projectName}`);
  console.log(` $ npm install`);
  console.log(` $ npm start or node bin/www`);

 
  return true;
}

module.exports = createProject;
