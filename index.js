const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
const express = require('express');
const bodyParser = require('body-parser');
const sharp = require('sharp');
const app = express();

app.use(bodyParser.json());

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Listening on port', port);
});

app.post('/', async (req, res) => {
    try {
        const file = decodeBase64Json(req.body.message.data);
        await downloadFile(file.bucket, file.name);

        const fileNameWithoutExtension = file.name.replace(/\.\w+$/g, "");
        const size = [512, 256, 128];

        const sharpFile = sharp('/tmp/' + file.name);
        size.forEach(async i => {
            const newFileName = `/tmp/${fileNameWithoutExtension}-${i}.webp`
            await sharpFile
                .resize({width: i})
                .webp({
                    quality: 85
                })
                .toFile(newFileName);

            uploadFile(process.env.BUCKET, newFileName);
        })

        deleteFile(file.bucket, file.name);
    } catch (ex) {
        console.log(`Error: ${ex}`);
    }

    res.set('Content-Type', 'text/plain');
    res.send('OK');
})

function decodeBase64Json(data) {
    return JSON.parse(Buffer.from(data, 'base64').toString());
}

async function downloadFile(bucketName, fileName) {
    const options = {destination: `/tmp/${fileName}`};
    await storage.bucket(bucketName).file(fileName).download(options);
}

async function deleteFile(bucketName, fileName) {
    await storage.bucket(bucketName).file(fileName).delete();
}

async function uploadFile(bucketName, fileName) {
    await storage.bucket(bucketName).upload(fileName);
}