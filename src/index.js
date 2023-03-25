const ignore = require("ignore");
const fs = require("fs");
const path = require("path");
const utils = require("./utils");

// Read the .gitignore file and create an ignore object
function readGitignoreFile() {
  const gitignorePath = path.join(process.cwd(), ".gitignore");
  const ig = ignore();
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
    ig.add(gitignoreContent);
  }
  return ig;
}

// Extract content from the files based on the configuration
function extractContent(config) {
  // Destructure configuration options with default values
  const {
    rootPath = ".",
    fileTypes = [],
    excludeDirs = [],
    excludeFiles = [],
    includeFiles = [],
    ignoreVcs = true,
  } = config;

  const gitignore = readGitignoreFile();

  // Determine if the file should be processed based on the configuration
  function shouldProcessFile(file) {
    const ext = path.extname(file).slice(1);
    const relativePath = path.relative(process.cwd(), file);
    return (
      (fileTypes.length === 0 || fileTypes.includes(ext)) &&
      !excludeFiles.includes(file) &&
      !gitignore.ignores(relativePath) &&
      (includeFiles.length === 0 || includeFiles.includes(file))
    );
  }

  // Determine if the directory should be processed based on the configuration
  function shouldProcessDir(dir) {
    const relativePath = path.relative(process.cwd(), dir);
    return (
      !excludeDirs.includes(dir) &&
      !gitignore.ignores(relativePath) &&
      (!ignoreVcs || (dir !== ".git" && dir !== ".svn"))
    );
  }

  // Process the directory and extract the content
  function processDirectory(dir) {
    const extractedContent = [];

    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);

      if (stats.isFile() && shouldProcessFile(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf-8");
        extractedContent.push({ path: fullPath, content });
      } else if (stats.isDirectory() && shouldProcessDir(fullPath)) {
        extractedContent.push(...processDirectory(fullPath));
      }
    });

    return extractedContent;
  }

  return processDirectory(rootPath);
}

// Generate a tree structure of the project
function generateTreeStructure(rootPath, gitignore) {
  let treeStructure = "";

  const pathMap = {};

  // Traverse the directory and build a path map
  function processDirectory(dir, currentMap) {
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      const relativePath = path.relative(rootPath, fullPath);
      const stats = fs.statSync(fullPath);

      if (gitignore.ignores(relativePath)) {
        return;
      }

      if (!currentMap[item]) {
        currentMap[item] = stats.isDirectory() ? {} : null;
      }

      if (stats.isDirectory()) {
        processDirectory(fullPath, currentMap[item]);
      }
    });
  }

  processDirectory(rootPath, pathMap);

  // Build the tree structure from the path map
  function buildTree(tree, depth) {
    const indent = "  ".repeat(depth);
    for (const [key, value] of Object.entries(tree)) {
      treeStructure += `${indent}├── ${key}\n`;
      if (value !== null) {
        buildTree(value, depth + 1);
      }
    }
  }

  buildTree(pathMap, 0);

  return treeStructure;
}

// Generate the output file with the extracted content
function generateOutput(
  extractedContent,
  outputTemplate,
  outputFilePath,
  rootPath,
  minify = false
) {
  let output = "";

  const gitignore = readGitignoreFile();
  const treeStructure = generateTreeStructure(rootPath, gitignore);
  output += "Directory Structure:\n";
  output += "--------------------\n";
  output += treeStructure + "\n";
  output += "--------------------\n\n";

  // Format the file content based on the minify option
  function formatFileContent(fileContent) {
    if (minify) {
      return fileContent.replace(/\s+/g, " ");
    }
    return fileContent;
  }

  // Add each file and its content to the output
  extractedContent.forEach((item) => {
    output += `File: ${item.path}\n`;
    output += "----------------------------\n";
    output += formatFileContent(item.content) + "\n";
    output += "----------------------------\n\n";
  });

  // Replace the content placeholder in the output template, if provided
  if (outputTemplate) {
    output = outputTemplate.replace("{{content}}", output);
  }

  // Write the output to the specified file
  fs.writeFileSync(outputFilePath, output, "utf-8");
  console.log(`Output file generated at: ${outputFilePath}`);
}

module.exports = {
  extractContent,
  generateOutput,
};
