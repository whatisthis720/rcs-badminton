import fs from 'node:fs';
import path from 'node:path';

export const PROJECT_ROOT = path.resolve(process.cwd());

/**
 * Recursively find all files matching an extension in a directory.
 */
export function getAllFiles(dirPath, extensions = ['.jsx', '.js', '.css', '.html', '.sql']) {
  let results = [];
  if (!fs.existsSync(dirPath)) return results;
  const list = fs.readdirSync(dirPath);
  list.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== '.agents') {
        results = results.concat(getAllFiles(fullPath, extensions));
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

/**
 * Read contents of a file safely relative to project root.
 */
export function readProjectFile(relativePath) {
  const absolutePath = path.resolve(PROJECT_ROOT, relativePath);
  if (!fs.existsSync(absolutePath)) return null;
  return fs.readFileSync(absolutePath, 'utf8');
}

/**
 * Scan directory files for matching pattern or string.
 */
export function searchInFiles(dirPath, pattern, extensions = ['.jsx', '.js', '.css', '.html', '.sql']) {
  const files = getAllFiles(dirPath, extensions);
  const matches = [];
  const regex = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;

  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    if (regex.test(content)) {
      matches.push(path.relative(PROJECT_ROOT, file));
    }
  });

  return matches;
}

/**
 * Count total occurrences of a pattern in specified file or directory.
 */
export function countOccurrencesInFile(filePath, pattern) {
  const content = readProjectFile(filePath);
  if (!content) return 0;
  const regex = typeof pattern === 'string' ? new RegExp(pattern, 'g') : new RegExp(pattern.source, 'g');
  const matches = content.match(regex);
  return matches ? matches.length : 0;
}
