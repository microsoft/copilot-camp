// require modules
const fs = require('fs-extra');
const archiver = require('archiver');

// Constants
const targetFolderName = './pluginPackage-Local/build';
const sourceFolderName = './pluginPackage-Local';
const archiveName = 'pluginPackage';

// Cleans the build folder
fs.rmSync(targetFolderName, { recursive: true, force: true });

// create a file to stream archive data to.
ensureFolder(targetFolderName);
const output = fs.createWriteStream(`${targetFolderName}/${archiveName}.zip`);
const archive = archiver('zip', {
  zlib: { level: 9 }, // Sets the compression level.
});

// pipe archive data to the file
archive.pipe(output);

archive.directory(sourceFolderName, false);

archive.finalize();

/**
 * Ensure that a folder exists
 * @param {string} folderPath
 */
async function ensureFolder(folderPath) {
  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  } catch (e) {}
}