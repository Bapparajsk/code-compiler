const fs = require("fs");
const path = require("path");
const tempDir = path.join(__dirname, '..', 'temp');

const createFiles = async (code, codeDir, userName, fileName) => {
    const nestedFolderPath = path.join(__dirname, '..', `temp/${userName}/${codeDir}`);

    await new Promise((resolve, reject) => {
        fs.mkdir(nestedFolderPath, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating nested folder:', err);
                reject(err);
                return;
            }
            fs.writeFile(`${tempDir}/${userName}/${codeDir}/${fileName}`, code, (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                    reject(err);
                    return;
                }
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
            fs.writeFile(`${tempDir}/${codeDir}/${fileName}`, code, (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                    reject(err);
                    return;
                }
                resolve();
            });

        });
    });
}

module.exports = { createFiles, jsFileCreate };
