const fs = require('fs');

const create = async (folderPath) => {
    try {
        await new Promise((resolve, reject) => {
            fs.stat(folderPath, (err, stats) => {
                if (err) {
                    fs.mkdir(folderPath, { recursive: true }, (err) => {
                        if (err) {
                            reject({error: 'Error creating folder.'})
                        } else {
                            resolve({successful: 'Folder created successfully.'})
                        }
                    });
                } else {
                    if (stats.isDirectory()) {
                        resolve({successful: 'Folder exists.'})
                    } else {
                        fs.mkdir(folderPath, { recursive: true }, (err) => {
                            if (err) {
                                reject({error: 'Error creating folder.'})
                            } else {
                                resolve({successful: 'Folder created successfully.'})
                            }
                        });
                    }
                }
            });
        });
    } catch (e) {
        console.log("Error creating folder :- ", e );
    }
}

module.exports = { create }