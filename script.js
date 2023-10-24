let currentAudioIndex = 0;
let audioFiles = [];

async function loadMetadata() {
    const response = await fetch('./json/metadata.json');
    const metadata = await response.json();
    audioFiles = metadata.audio_files;
}

async function loadAndRenderGraph(jsonFile, containerId) {
    const response = await fetch(`./json/${jsonFile}`);
    let amplitudes = await response.json();

    // Normalize the amplitude values
    const maxAmplitude = Math.max(...amplitudes);
    amplitudes = amplitudes.map(amp => amp / maxAmplitude);

    const container = document.getElementById(containerId);
    container.innerHTML = "";

    const numberOfBars = amplitudes.length;
    const barWidth = 500 / numberOfBars; // 500px is the width of the container

    amplitudes.forEach(amp => {
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = `${amp * 500}px`;  // 500px is the height of the container
        bar.style.width = `${barWidth}px`;
        container.appendChild(bar);
    });
}


function loadGraph() {
    const jsonFile = audioFiles[currentAudioIndex];
    loadAndRenderGraph(jsonFile, "audioContainer");
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
