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

     
  
      // Add gradient background to SVG
      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      const linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
      linearGradient.setAttribute("id", "gradient");
      linearGradient.setAttribute("x1", "0%");
      linearGradient.setAttribute("y1", "100%");
      linearGradient.setAttribute("x2", "0%");
      linearGradient.setAttribute("y2", "0%");
  
      const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop1.setAttribute("offset", "0%");
      stop1.setAttribute("style", "stop-color:rgb(0,0,0);stop-opacity:1");
      const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop2.setAttribute("offset", "100%");
      stop2.setAttribute("style", "stop-color:rgb(0,0,300);stop-opacity:1");
  
      linearGradient.appendChild(stop1);
      linearGradient.appendChild(stop2);
      defs.appendChild(linearGradient);
      svg.appendChild(defs);
  
      const backgroundRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      backgroundRect.setAttribute("x", 0);
      backgroundRect.setAttribute("y", 0);
      backgroundRect.setAttribute("width", 500);
      backgroundRect.setAttribute("height", 500);
      backgroundRect.setAttribute("fill", "url(#gradient)");
      svg.appendChild(backgroundRect);
  
      // Add random stars
      const numberOfStars = 200;
      for (let i = 0; i < numberOfStars; i++) {
          const star = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          const x = Math.random() * 500;
          const y = Math.random() * 500;
          const r = Math.random() * 1;
  
          star.setAttribute("cx", x);
          star.setAttribute("cy", y);
          star.setAttribute("r", r);
          star.setAttribute("fill", "blue");
          star.setAttribute("opacity", Math.random());
  
          svg.appendChild(star);
      }

    const numberOfShapes = amplitudes.length;
    const shapeWidth = 500 / numberOfShapes;

    amplitudes.forEach((amp, index) => {
        
        
        const x = index * shapeWidth;
        const y = 500 - amp * 500;
        let hue = 100 * (10 - amp);
        let shapeElement;

        // Draw different shapes based on index
        switch (index % 3) {
            case 0:  // Bar (Rectangle)
                shapeElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                shapeElement.setAttribute("x", x);
                shapeElement.setAttribute("y", y);
                shapeElement.setAttribute("width", shapeWidth+1);
                shapeElement.setAttribute("height", amp*500);

                
                break;
            case 1:  // Circle
                shapeElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                shapeElement.setAttribute("cx", x);
                shapeElement.setAttribute("cy", y);
                shapeElement.setAttribute("r", shapeWidth+1);
                break;
            case 2:  // Triangle (Polygon)
                shapeElement = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                const points = `${x},${y} ${x + shapeWidth+1},${y} ${x + shapeWidth},${y - amp + 500}`;
                shapeElement.setAttribute("points", points);
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
