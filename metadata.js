async function loadMetadata() {
    const response = await fetch('./json/metadata.json');
    const metadata = await response.json();
    audioFiles = metadata.audio_files;

    const metadataContainer = document.getElementById("metadataContainer");
    metadataContainer.innerHTML = "<h3>Metadata</h3>";
    for (const key in metadata) {
        if (metadata.hasOwnProperty(key)) {
            metadataContainer.innerHTML += `<p><strong>${key}:</strong> ${metadata[key]}</p>`;
        }
    }
}
