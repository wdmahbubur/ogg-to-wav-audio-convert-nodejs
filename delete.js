const fs = require('fs');
const path = require('path');

const directoryPath = './audio/voice/';

// Use fs.readdir to get a list of all files in the directory
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    // Loop through the files and delete each one
    files.forEach((file) => {
        const filePath = path.join(directoryPath, file);

        // Use fs.unlink to delete the file
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
                console.error('Error deleting file:', unlinkErr);
            } else {
                console.log(`Deleted file: ${file}`);
            }
        });
    });
});
