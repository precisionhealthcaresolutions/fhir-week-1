const fs = require('fs-extra');
const path = require('path');

async function concatFilesInDirectory(directoryPath, outputFilePath) {
  try {
    const files = await fs.readdir(directoryPath);
    let concatenatedContent = '';

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      if (path.extname(file) === '.js') {
        const fileContent = await fs.readFile(filePath, 'utf8');
        concatenatedContent += fileContent + '\n';
      }
    }

    await fs.writeFile(outputFilePath, concatenatedContent, 'utf8');
    console.log(`All files have been concatenated into ${outputFilePath}`);
  } catch (error) {
    console.error('Error concatenating files:', error);
  }
}

const directoryPath = './dist/fhir-week-1/'; // Replace with your directory path
const outputFilePath = './dist/fhir-week-1/fhir-week-1.js'; // Replace with your desired output file path

concatFilesInDirectory(directoryPath, outputFilePath);
