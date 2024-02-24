const fs = require("fs");
const path = require("path");
const tempDir = path.join(__dirname, '..', 'temp');

const createFiles = async (code, input, codeDir, userName, fileName) => {
    const nestedFolderPath = path.join(__dirname, '..', `temp/${userName}/${codeDir}`);

    await new Promise((resolve, reject) => {
        fs.mkdir(nestedFolderPath, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating nested folder:', err);
                reject(err);
                return;
            }
            console.log('Nested folder created successfully.');
            fs.writeFile(`${tempDir}/${userName}/${codeDir}/${fileName}`, code, (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                    reject(err);
                    return;
                }
                console.log('Data written to file successfully.');
            });

            fs.writeFile(`${tempDir}/${userName}/${codeDir}/input.txt`, input, (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                    reject(err);
                    return;
                }
                console.log('Data written to file successfully.');
                resolve();
            });
        });
    });
}

const jsFileCreate = async (code, codeDir, fileName) => {
    const nestedFolderPath = `${tempDir}/${codeDir}`;
    await new Promise((resolve, reject) => {
        fs.mkdir(nestedFolderPath, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating nested folder:', err);
                reject(err);
                return;
            }
            console.log('Nested folder created successfully.');
            fs.writeFile(`${tempDir}/${codeDir}/${fileName}`, code, (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                    reject(err);
                    return;
                }
                console.log('Data written to file successfully.');
                resolve();
            });

        });
    });
}

module.exports = { createFiles, jsFileCreate };