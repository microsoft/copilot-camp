// require modules
const fs = require('fs-extra');
const archiver = require('archiver');
const { globSync } = require('glob');
const argv = require('minimist')(process.argv.slice(2));

if(argv.env === undefined) {
  return; 
}

// Constants
const targetFolderName = './appPackage/build';
const sourceFolderName = 'appPackage';
const archiveName =  `appPackage.${argv.env}`;

const output = fs.createWriteStream(`${targetFolderName}/${archiveName}.zip`);

const archive = archiver('zip', {
  zlib: { level: 9 }, // Sets the compression level.
});

// pipe archive data to the file
archive.pipe(output);

// Archives all files from the manifest folder
archive.glob(`**`, {
  cwd: sourceFolderName,
  ignore: ['manifest.json', 'build/**']
});

// Process the generated manifest file
const files = globSync(`**/manifest.${argv.env}.json`, { cwd: targetFolderName });

if(files.length === 0) {
  console.log('No manifest file found');
} else {
  // Append the processed manifest file to the archive
  const manifestFile = fs.createReadStream(`${targetFolderName}/${files[0]}`);
  archive.append(manifestFile, {
    name: 'manifest.json'
  });
}

archive.finalize();