const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for all routes

app.get('/list-tracks', (req, res) => {
  const mp3Dir = path.join(__dirname, 'audio');
  const thumbnailDir = path.join(__dirname, 'thumbnails');

  const mp3Files = fs.readdirSync(mp3Dir).filter(file => file.endsWith('.mp3'));
  const thumbnailFiles = fs.readdirSync(thumbnailDir).filter(file => file.endsWith('.jpg'));

  const tracks = mp3Files.map((mp3File, index) => {
    return {
      mp3: `audio/${mp3File}`,
      thumbnail: `thumbnails/${thumbnailFiles[index] || 'default.jpg'}`
    };
  });

  res.json(tracks);
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
