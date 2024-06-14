const fs = require('fs-extra');
const configFilePath = './.localConfigs';
const path = require('path');
let configData = fs.readFileSync(configFilePath, 'utf8');
const domainUrl = getConfigValue(configData, 'OPENAPI_SERVER_URL');
const domain=getDomainFromUrl(domainUrl);
const yaml = require('js-yaml');


// Define the source and destination directories
const sourceDir = './pluginPackage';
const destinationDir = './pluginPackage-Local';

// Read the list of JSON files from the source directory
fs.readdir(sourceDir, async (err, files) => {
    if (err) {
        console.error('Error reading source directory:', err);
        return;
    }

    // Filter out only JSON files
    const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');  
    const yamlFiles = files.filter(file => path.extname(file).toLowerCase() === '.yml');  
    
    // Iterate over each JSON file
    jsonFiles.forEach(file => {
        // Read the JSON file
        const filePath = path.join(sourceDir, file);
        let jsonData = fs.readFileSync(filePath, 'utf8');

        // Parse JSON string into an object
        let jsonObject = JSON.parse(jsonData);

        // Replace all occurrences of {{DOMAIN}} with the value from config
        recursiveReplace(jsonObject, "{{DOMAIN}}", domain);

        // Write the updated JSON to the destination directory with the same filename
        const destinationFilePath = path.join(destinationDir, file);
        //create file and direcotry if not exit
        fs.ensureFileSync(destinationFilePath);
        fs.writeFileSync(destinationFilePath, JSON.stringify(jsonObject, null, 2));
        //copy png files from source to destination
        
        console.log(`Domain value replaced and file copied successfully: ${file}`);
    });
    // Iterate over each YAML file
        yamlFiles.forEach(file => {
            // Read the YAML file
            const filePath = path.join(sourceDir, file);
            let yamlData = fs.readFileSync(filePath, 'utf8');

            // Parse YAML string into an object
            let yamlObject = yaml.load(yamlData);

            // Replace all occurrences of {{DOMAIN}} with the value from config
            recursiveReplace(yamlObject, "{{DOMAIN}}", domain);

            // Write the updated YAML to the destination directory with the same filename
            const destinationFilePath = path.join(destinationDir, file);
            
            // Create file and directory if not exist
            fs.ensureFileSync(destinationFilePath);
            fs.writeFileSync(destinationFilePath, yaml.dump(yamlObject, { indent: 2, noCompatMode: true }));

            console.log(`Domain value replaced and file copied successfully: ${file}`);
        });
   
});

copyPngFiles();

// Function to recursively replace value in JSON object
function recursiveReplace(obj, searchValue, replaceValue) {
    for (let key in obj) {
        if (typeof obj[key] === 'string') {
            obj[key] = obj[key].replace(new RegExp(searchValue, 'g'), replaceValue);
        } else if (typeof obj[key] === 'object') {
            recursiveReplace(obj[key], searchValue, replaceValue);
        }
    }
}

// Function to get value from config string
function getConfigValue(configString, key) {
    const regex = new RegExp(`${key}=(.*)`, 'gm');
    const match = regex.exec(configString);
    return match ? match[1] : null;
}

// Ensure both folders exist
if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
}

// Function to copy .png files from source to destination
function copyPngFiles() {
    fs.readdir(sourceDir, (err, files) => {
        if (err) {
            console.error('Error reading source folder:', err);
            return;
        }

        files.forEach(file => {
            const sourceFilePath = path.join(sourceDir, file);
            const destinationFilePath = path.join(destinationDir, file);
            
            // Check if the file is a .png file
            if (path.extname(file).toLowerCase() === '.png') {
                // Copy the file
                fs.copyFile(sourceFilePath, destinationFilePath, err => {
                    if (err) {
                        console.error(`Error copying file ${file}:`, err);
                    } else {
                        console.log(`Successfully copied ${file} to ${destinationDir}`);
                    }
                });
            }
        });
    });
}

//get domain from a url 
function getDomainFromUrl(url) {
    let domain;
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    } 
    return domain;
}




