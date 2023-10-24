let currentAudioIndex = 0;
let audioFiles = [];

async function loadMetadata() {
    const response = await fetch('./json/metadata.json');
    const metadata = await response.json();
    audioFiles = metadata.audio_files;

    // Update the metadataContainer div
    const metadataContainer = document.getElementById("metadataContainer");
    metadataContainer.innerHTML = "<h3>Metadata</h3>";
    for (const key in metadata) {
        if (metadata.hasOwnProperty(key)) {
            metadataContainer.innerHTML += `<p><strong>${key}:</strong> ${metadata[key]}</p>`;
        }
    }
}

async function loadAndRenderGraph(jsonFile, containerId) {
    const response = await fetch(`./json/${jsonFile}`);
    let amplitudes = await response.json();

    const maxAmplitude = Math.max(...amplitudes);
    amplitudes = amplitudes.map(amp => amp / maxAmplitude);

    const svg = document.getElementById(containerId);
    svg.innerHTML = "";

    const numberOfShapes = amplitudes.length;
    const shapeWidth = 500 / numberOfShapes;

    amplitudes.forEach((amp, index) => {
        const x = index * shapeWidth;
        const y = 500 - amp * 500;
        let hue = 100 * (10 - amp);
        let shapeElement;

        // Draw different shapes based on index
        switch (index % 4) {
            case 0:  // Bar (Rectangle)
                shapeElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                shapeElement.setAttribute("x", x);
                shapeElement.setAttribute("y", y);
                shapeElement.setAttribute("width", shapeWidth);
                shapeElement.setAttribute("height", amp * 500);
                break;
            case 1:  // Circle
                shapeElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                shapeElement.setAttribute("cx", x + shapeWidth / 2);
                shapeElement.setAttribute("cy", y);
                shapeElement.setAttribute("r", shapeWidth / 2);
                break;
            case 2:  // Triangle (Polygon)
                shapeElement = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                const points = `${x},${y} ${x + shapeWidth},${y} ${x + shapeWidth / 2},${y - amp * 500}`;
                shapeElement.setAttribute("points", points);
                break;
            case 3:  // Oval (Ellipse)
                shapeElement = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
                shapeElement.setAttribute("cx", x + shapeWidth / 2);
                shapeElement.setAttribute("cy", y);
                shapeElement.setAttribute("rx", shapeWidth / 3);
                shapeElement.setAttribute("ry", amp * 500 / 3);
                break;
        }

        shapeElement.setAttribute("fill", `hsl(${hue}, 100%, 50%)`);
        svg.appendChild(shapeElement);
        
        
        
    });
}




async function loadGraph() {
    const jsonFile = audioFiles[currentAudioIndex];
    await loadAndRenderGraph(jsonFile, "audioContainer");

    // Fetch and display metadata for the current JSON file
    const metadataResponse = await fetch(`./json/metadata/${jsonFile}`);
    const currentMetadata = await metadataResponse.json();
    
    const metadataContainer = document.getElementById("metadataContainer");
    metadataContainer.innerHTML = `<h3>Metadata for ${jsonFile}</h3>`;
    for (const key in currentMetadata) {
        if (currentMetadata.hasOwnProperty(key)) {
            metadataContainer.innerHTML += `<p><strong>${key}:</strong> ${currentMetadata[key]}</p>`;
        }
    }

    // Update the div to show the current JSON file
    const currentAudioFileNameDiv = document.getElementById("currentAudioFileName");
    currentAudioFileNameDiv.textContent = `Currently loaded: ${jsonFile}`;
}


function nextAudio() {
    if (currentAudioIndex < audioFiles.length - 1) {
        currentAudioIndex++;
        loadGraph();
    }
}

function prevAudio() {
    if (currentAudioIndex > 0) {
        currentAudioIndex--;
        loadGraph();
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    await loadMetadata();
    loadGraph();

    document.getElementById("nextButton").addEventListener("click", nextAudio);
    document.getElementById("prevButton").addEventListener("click", prevAudio);

    
});
