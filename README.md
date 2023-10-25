# Audio Amplitude Visualization and Metadata Generation
![image](https://github.com/gm3/audioChunks/assets/7612104/de6139ab-ad7e-4e34-b828-d99c61ec3076)

## Overview

This project consists of two primary components:

1. A Python script that processes audio files to generate amplitude data and metadata in JSON format.
2. A web interface for visualizing the amplitude data and displaying metadata.

### Python Script

The Python script performs several tasks:

- **Audio Processing**: Reads MP3 audio files and converts them into chunks. The average amplitude for each chunk is calculated and stored in a JSON file.
- **Metadata Generation**: Creates metadata JSON files containing information like the creator, external URL, and attributes such as genre, BPM, etc.
- **Audio File List Generation**: Creates a list of processed audio files in JSON format.

#### Dependencies

- `os`
- `json`
- `pydub`
- `numpy`

### Web Interface

The web interface uses vanilla JavaScript to visualize the amplitude data and display metadata.

- **SVG Visualization**: The amplitude data is visualized as SVG elements with varying heights and colors.
- **Metadata Display**: Metadata for each audio file is displayed below the visualization.
- **Navigation**: Users can navigate through different audio files using "Previous" and "Next" buttons.

#### Dependencies

- HTML5
- CSS
- JavaScript

## How to Use

### Python Script

1. Place your audio files in a folder named `./audio`.
2. Run the Python script.

### Web Interface

1. Open the HTML file in a web browser.
2. Click the "Previous" and "Next" buttons to navigate through different audio files.
