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

    const numberOfBars = amplitudes.length;
    const barWidth = 500 / numberOfBars;

    amplitudes.forEach((amp, index) => {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", index * barWidth);
        rect.setAttribute("y", 500 - amp * 500);
        rect.setAttribute("width", barWidth + 5);
        rect.setAttribute("height", amp * 500 / 2);

        const hue = 100 * (10 - amp);
        rect.setAttribute("fill", `hsl(${hue}, 100%, 50%)`);

        svg.appendChild(rect);
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
