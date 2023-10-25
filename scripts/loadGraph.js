let currentAudioIndex = 0;
let audioFiles = [];  // This will be populated by loadMetadata

// Additional variables to hold elements and their animation state
let animatedElements = [];
let animationDirections = [];

async function loadGraph() {
    const jsonFile = audioFiles[currentAudioIndex];
    await loadAndRenderGraph(jsonFile, "audioContainer");

    // Fetch and display metadata for the current JSON file
    const metadataResponse = await fetch(`./json/metadata/${jsonFile}`);
    const currentMetadata = await metadataResponse.json();
    
    const metadataContainer = document.getElementById("metadataContainer");
    
    // Convert entire metadata object to JSON string with indentation
    const formattedJsonString = JSON.stringify(currentMetadata, null, 2);
    
    // Using <pre> tag to maintain JSON formatting
    metadataContainer.innerHTML = `<pre>${formattedJsonString}</pre>`;
    
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
