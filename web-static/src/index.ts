import express from 'express';
import path from 'path';
import mime from 'mime-types';

const app = express();
const port = 9090;

// Middleware to filter out non-jpg requests
app.use('/data', (req, res, next) => {
    const requestedPath = req.path;
    const fullPath = path.join(__dirname, '../data', requestedPath);

    // Check if the requested path is a .jpg file
    if (mime.lookup(fullPath) === 'image/jpeg') {
        next();
    } else {
        res.status(404).send('Not Found');
    }
});

// Static file serving from the data directory
app.use('/data', express.static(path.join(__dirname, '../data')));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/data`);
});
