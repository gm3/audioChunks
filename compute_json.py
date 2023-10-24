import os
import json
from pydub import AudioSegment
import numpy as np

def create_metadata_json(json_file, audio_file):
    base_name = os.path.splitext(json_file)[0]  # Get the name without the .json extension
    metadata = {
        "name": f"BoomBox #{base_name}",
        "created_by": "Boomboxhead",
        "external_url": "https://twitter.com/boomboxheads",
        "description": "BoomBoxes are special edition multi-format NFT project featuring powerpack of collectibles containing a VRM, a BoomBoxcar, a BoomBot pet, and a Beat! All including posed 3d GLB collectibles.",
        "vrm_url": "ipfs://changethis",
        "pet_url": "ipfs://changethis",
        "car_url": "ipfs://changethis",
        "audio_url": f"ipfs://{audio_file}",
        "animation_url": "ipfs://changethis",
        "image": "ipfs://changethis",
        "background_color": "0000FF",
        "attributes": [
            {"trait_type": "Track Title", "value": "Instrumental Beat #1"},
            {"trait_type": "Genre", "value": "Trap"},
            {"trait_type": "BPM", "value": "Arrow"},
            {"trait_type": "Class", "value": "Bot"},
            {"trait_type": "Pose", "value": "Wave"},
            {"trait_type": "Head", "value": "Blue"},
            {"trait_type": "Body", "value": "Gold"}
        ]
    }

    metadata_json_path = os.path.join('./json/metadata', json_file)
    with open(metadata_json_path, 'w') as f:
        json.dump(metadata, f, indent=4)  # Added indent for better readability of output JSON

def create_audio_file_list_json(audio_files):
    audio_file_paths = [os.path.join('./audio', audio_file) for audio_file in audio_files]
    with open('./json/audio_file_list.json', 'w') as f:
        json.dump(audio_file_paths, f)

def process_audio(audio_path, json_path):
    audio = AudioSegment.from_file(audio_path, format="mp3")
    num_chunks = 1024
    chunk_length = len(audio) // num_chunks
    amplitudes = []

    for i in range(num_chunks):
        start = i * chunk_length
        end = (i + 1) * chunk_length
        chunk = audio[start:end]
        samples = np.array(chunk.get_array_of_samples())
        amplitude = np.mean(np.abs(samples))
        amplitudes.append(amplitude)

    with open(json_path, 'w') as f:
        json.dump(amplitudes, f)

         # Create metadata JSON
    audio_file = os.path.basename(audio_path)
    json_file = os.path.basename(json_path)
    create_metadata_json(json_file, audio_file)

def process_multiple_audio_files(audio_files):
    json_dir = './json'
    metadata_dir = './json/metadata'
    if not os.path.exists(json_dir):
        os.makedirs(json_dir)
    if not os.path.exists(metadata_dir):
        os.makedirs(metadata_dir)

    for audio_file in audio_files:
        audio_path = os.path.join('./audio', audio_file)
        json_file = audio_file.replace('.mp3', '.json')
        json_path = os.path.join(json_dir, json_file)
        process_audio(audio_path, json_path)

    metadata = {'audio_files': [f.replace('.mp3', '.json') for f in audio_files]}
    with open('./json/metadata.json', 'w') as f:
        json.dump(metadata, f)

    create_audio_file_list_json(audio_files)    

if __name__ == "__main__":
    audio_files = [f for f in os.listdir('./audio') if f.endswith('.mp3')]
    process_multiple_audio_files(audio_files)
