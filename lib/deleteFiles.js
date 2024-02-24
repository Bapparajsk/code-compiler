const fs = require('fs').promises;

const deleteFile = async (filePath) => {
    try {
        let deleted = false;
        const stats = await fs.stat(filePath);

        if (stats.isDirectory()) {
            await fs.rm(filePath, { recursive: true });
            console.log('Directory deleted successfully.');
            deleted = true;
        } else {
            await fs.rm(filePath, { force: true });
            console.log('File deleted successfully.');
            deleted = true;
        }

        if (!deleted) {
            throw new Error('Failed to delete file/directory after multiple attempts.');
        }

        return "File/directory deleted successfully";
    } catch (error) {
        console.error("Error while deleting file/directory:", error);
        return "Error while deleting file/directory";
    }
};

module.exports = { deleteFile };
