async function loadMetadata() {
    const response = await fetch('./json/metadata.json');
    const metadata = await response.json();
    audioFiles = metadata.audio_files;

    const metadataContainer = document.getElementById("metadataContainer");
    //metadataContainer.innerHTML = "<h3>Metadata</h3>";

    for (const key in metadata) {
        if (metadata.hasOwnProperty(key)) {
            let displayValue;

            if (Array.isArray(metadata[key])) {
                // Assuming each object in the array has 'trait_type' and 'value'
                displayValue = metadata[key].map(obj => {
                    return `${obj.trait_type}: ${obj.value}`;
                }).join(', ');
            } else if (typeof metadata[key] === 'object') {
                displayValue = JSON.stringify(metadata[key], null, 2);
            } else {
                displayValue = metadata[key];
            }

            metadataContainer.innerHTML += `<p><strong>${key}:</strong> ${displayValue}</p>`;
        }
    }
}
