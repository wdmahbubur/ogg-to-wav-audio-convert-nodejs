const ffmpeg = require('fluent-ffmpeg');
const https = require('https');
const fs = require('fs');
const puppeteer = require('puppeteer');

async function convertToWav(url, downloadFileLocation, outputFilePath) {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'load' });

        // Extract the redirected URL from the request
        const redirectedUrl = page.url();

        await browser.close();

        if (!redirectedUrl) {
            console.error('Failed to extract the redirected URL.');
            return;
        }

        console.log('Extracted URL:', redirectedUrl);

        const fileStream = fs.createWriteStream(downloadFileLocation);

        await new Promise((resolve, reject) => {
            https.get(redirectedUrl, (response) => {
                response.pipe(fileStream);
                fileStream.on('finish', () => {
                    console.log('Success downloading file:', downloadFileLocation);
                    fileStream.close();
                    resolve();
                });
                response.on('error', (err) => {
                    console.error('Error downloading file:', err);
                    reject(err);
                });
            });
        });

        await new Promise((resolve, reject) => {
            ffmpeg()
                .input(downloadFileLocation)
                .toFormat('wav')
                .on('end', () => {
                    console.log('Conversion finished.');
                    resolve();
                })
                .on('error', (err) => {
                    console.error('Error converting file:', err);
                    reject(err);
                })
                .save(outputFilePath);
        });
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }

}


// Input and output file paths
const url = 'https://api.twilio.com/2010-04-01/Accounts/AC504ab07d66d9014af06f7fbfd43f54b4/Messages/MMf5f05e3d7cebe8f825c3ac4742b9d650/Media/ME4f4d1c55e6066acc5a648b9ad3d6b7e4'; // Replace with the path to your OGG file
const downloadFileLocation = './audio/voice/output.ogg'; // Replace with the desired download location
const outputFilePath = './audio/voice/output.wav'; // Replace with the desired WAV output path

convertToWav(url, downloadFileLocation, outputFilePath)





