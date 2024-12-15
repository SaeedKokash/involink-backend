const fs = require('fs');
const path = require('path');

// Define the directory containing the .js files
const directoryPath = path.join(__dirname, 'models'); // Replace 'your-folder-name' with your target folder

// Define the output file path
const outputFile = path.join(directoryPath, 'models.js');

// Read all files in the directory
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.error(`Unable to scan directory: ${err}`);
    }

    // Filter out only .js files, excluding the output file if it already exists
    const jsFiles = files.filter(file => {
        return path.extname(file) === '.js' && file !== 'models.js';
    });

    if (jsFiles.length === 0) {
        return console.log('No .js files found to concatenate.');
    }

    // Initialize an array to hold the contents
    let concatenatedData = '';

    // Function to read files sequentially using Promises
    const readFilesSequentially = (files) => {
        return files.reduce((promise, file) => {
            return promise.then(data => {
                return new Promise((resolve, reject) => {
                    const filePath = path.join(directoryPath, file);
                    fs.readFile(filePath, 'utf8', (err, content) => {
                        if (err) {
                            reject(`Error reading file ${file}: ${err}`);
                        } else {
                            // Optionally, add a comment indicating the file name
                            data += `\n// ----- ${file} -----\n` + content + '\n';
                            resolve(data);
                        }
                    });
                });
            });
        }, Promise.resolve(''));
    };

    // Read all files and concatenate their contents
    readFilesSequentially(jsFiles)
        .then(result => {
            concatenatedData = result;
            // Write the concatenated data to models.js
            fs.writeFile(outputFile, concatenatedData, 'utf8', (err) => {
                if (err) {
                    return console.error(`Error writing to ${outputFile}: ${err}`);
                }
                console.log(`All .js files have been concatenated into ${outputFile}`);
            });
        })
        .catch(error => {
            console.error(error);
        });
});
