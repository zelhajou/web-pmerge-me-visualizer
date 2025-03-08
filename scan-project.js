const fs = require('fs');
const path = require('path');

// Function to read all code files in the project
function scanProjectFiles(rootDir) {
  const projectMap = {};
  
  // Directories to ignore
  const ignoreDirs = ['node_modules', '.next', 'dist', 'build', '.git'];
  
  // Files to ignore
  const ignoreFiles = [
    'scan-project.js',
    'project-source-code.json',
    'package-lock.json',
    'yarn.lock',
    'README.md',
    'LICENSE',
    '.gitignore',
    '.env',
    '.DS_Store',
    'favicon.ico',
    'logo192.png',
    'logo512.png',
    'manifest.json',
    'robots.txt',
    'reportWebVitals.js',
    'setupTests.js'
  ];
  
  // File extensions to include
  const includeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss'];
  
  function processDirectory(dirPath, relativePath = '') {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      // Skip ignored files
      if (ignoreFiles.includes(item)) continue;
      
      const fullPath = path.join(dirPath, item);
      const itemRelativePath = path.join(relativePath, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        // Skip ignored directories
        if (ignoreDirs.includes(item)) continue;
        
        processDirectory(fullPath, itemRelativePath);
      } else {
        // Only process code files with specific extensions
        const ext = path.extname(item).toLowerCase();
        if (includeExtensions.includes(ext)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            projectMap[itemRelativePath] = content;
          } catch (err) {
            console.error(`Error reading file ${fullPath}:`, err);
            projectMap[itemRelativePath] = `Error reading file: ${err.message}`;
          }
        }
      }
    }
  }
  
  processDirectory(rootDir);
  return projectMap;
}

// Execute the scan in the current directory
const projectRoot = process.cwd();
const projectFiles = scanProjectFiles(projectRoot);

// Write the result to a JSON file
fs.writeFileSync(
  'project-source-code.json', 
  JSON.stringify(projectFiles, null, 2),
  'utf8'
);

console.log('Project source code has been saved to project-source-code.json');