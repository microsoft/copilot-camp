import { Context, HttpRequest } from "@azure/functions";
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// Define a Response interface.
interface Response {
  headers?: { [header: string]: string };
  status: number;
  body: any;
}

/**
 * This function handles the HTTP request and returns the file
 *
 * @param {Context} context - The Azure Functions context object.
 * @param {HttpRequest} req - The HTTP request.
 * @returns {Promise<Response>} - A promise that resolves with the HTTP response containing the file
 */
export default async function run(context: Context, req: HttpRequest): Promise<Response> {

  // Initialize response.

  const res: Response = {
    status: 200,
    body: {},
  };

  try {

    const fileName = req.params?.name;
    const filePath = path.resolve(`${__dirname}/assets`, fileName);
    let fileContent;
    let contentType;
    const fileExtension = path.extname(fileName).toLowerCase();
    console.log(`Received request for file ${fileName}`);

    if (fileExtension === '.yml') {
      contentType = 'application/yaml';
      fileContent = readYamlFile(filePath);
    } else if (fileExtension === '.png') {
      contentType = 'image/png';
      fileContent = readImageFile(filePath);
    } else { //all cases not added
      contentType = 'application/json';
      fileContent = fs.readFileSync(filePath);
    }

    res.body = fileContent;
    res.headers = { 'Content-Type': contentType };

    console.log(`Responding successfully with file ${fileName} (${fileContent.length} bytes) and content type ${contentType}`);
    return res;
  }

  catch (error) {
    const status = error.status || error.response?.status || 500;
    console.log(`Responding with error status code ${status.status}: ${error.message}`);

    res.status = status;
    res.body = error.message;
    return res;
  }
  //move to utilities

  function readYamlFile(filePath) {
    const yamlFileContent = fs.readFileSync(filePath, 'utf8');
    return yaml.load(yamlFileContent);
  }

  function readImageFile(filePath) {
    return fs.readFileSync(filePath);
  }
}
