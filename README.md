# ContentExt - Content Extraction Tool

ContentExt is a Node.js tool for extracting content from files in the project folder of a web app or website. It creates a text file as an output with a readable file structure and the content of the included files.

## API Usage:

1. Install ContentExt as a dependency in your project:
   
   ```bash
   npm install contentext
   ```

2. Import ContentExt in your code:
   
   ```javascript
   const contentext = require("contentext");`
   ```

3. Configure the options and call the desired functions:
   
   ```javascript
   const config = {
     rootPath: ".",               // Set the root path of the project
     fileTypes: [],               // Set the file types to process
     excludeDirs: [],             // Set the directories to exclude
     excludeFiles: [],            // Set the files to exclude
     includeFiles: [],            // Set the specific files to include
     ignoreVcs: true,             // Ignore version control system directories
     outputFilePath: "content_snapshot.txt", // Set the output file path
     minify: false,               // Minify the extracted content
   };

   // Extract content and generate output
   const extractedContent = contentext.extractContent(config);
   contentext.generateOutput(extractedContent, "", config.outputFilePath, config.minify);
   ```

## CLI Usage:

1. Install ContentExt globally:
   
   ```bash
   npm install -g contentext
   ```

2. Use the 'contentext' command with the available options:

   contentext [options]

   Options:  
     `-r`, `--root` <path>          Set the root path of the project (default: ".")  
     `-t`, `--types` <list>         Set the file types to process, comma-separated (default: "js,css")  
     `-x`, `--exclude-dirs` <list>  Set the directories to exclude, comma-separated (default: "")  
     `-f`, `--exclude-files` <list> Set the files to exclude, comma-separated (default: "")  
     `-i`, `--include-files` <list> Set the specific files to include, comma-separated (default: "")  
     `-v`, `--no-ignore-vcs`        Include version control system directories (default: ignore)  
     `-o`, `--output` <path>        Set the output file path (default: "content_snapshot.txt")  
     `-m`, `--minify`               Minify the extracted content (default: false)

   Examples:
     ```bash
     contentext -r "./my-project" -t "js,css" -x "node_modules" -o "snapshot.txt" -m
     ```
     ```bash
     contentext -t "html,css" -x "assets,node_modules" -f "main.css" -i "specific.html" -v -o "content_extract.txt"
     ```
