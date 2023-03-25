#!/usr/bin/env node

const { program } = require("commander");
const { extractContent, generateOutput } = require("./index");

program
  .version("0.1.0")
  .description(
    "A command line tool for extracting content from web development projects."
  )
  .option("-r, --root-path <path>", "Specify the root path of the project", ".")
  .option(
    "-t, --file-types <types>",
    "Specify the file types to process (comma-separated)",
    ""
  )
  .option(
    "-x, --exclude-dirs <dirs>",
    "Specify directories to exclude (comma-separated)",
    ""
  )
  .option(
    "-e, --exclude-files <files>",
    "Specify files to exclude (comma-separated)",
    ""
  )
  .option(
    "-i, --include-files <files>",
    "Specify files to include (comma-separated)",
    ""
  )
  .option(
    "-v, --ignore-vcs [boolean]",
    "Ignore version control system directories (default: true)",
    (val) => val === "true" || val === true
  )
  .option(
    "-o, --output-file-path <path>",
    "Specify the output file path",
    "content_snapshot.txt"
  )
  .option(
    "-m, --minify",
    "Minify the extracted content (default: false)",
    false
  );

program.parse(process.argv);

const options = program.opts();

const config = {
  rootPath: options.rootPath,
  fileTypes: options.fileTypes ? options.fileTypes.split(",") : [],
  excludeDirs: options.excludeDirs ? options.excludeDirs.split(",") : [],
  excludeFiles: options.excludeFiles ? options.excludeFiles.split(",") : [],
  includeFiles: options.includeFiles ? options.includeFiles.split(",") : [],
  ignoreVcs: options.ignoreVcs,
  outputFilePath: options.outputFilePath,
  minify: options.minify,
};

const extractedContent = extractContent(config);
const outputTemplate = ""; // You can add a template string here if needed
generateOutput(
  extractedContent,
  outputTemplate,
  config.outputFilePath,
  config.rootPath,
  config.minify
);
