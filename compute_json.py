import os
import json
from pydub import AudioSegment
import numpy as np

# Function to process a single audio file
def process_audio(audio_path, json_path):
    audio = AudioSegment.from_file(audio_path, format="mp3")
    num_chunks = 128
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

# Create 'json/' directory if it doesn't exist
json_dir = './json'
if not os.path.exists(json_dir):
    os.makedirs(json_dir)

# Loop through each audio file in the 'audio/' directory
audio_dir = './audio'
for audio_file in os.listdir(audio_dir):
    if audio_file.endswith('.mp3'):
        audio_path = os.path.join(audio_dir, audio_file)
        json_file = audio_file.replace('.mp3', '.json')
        json_path = os.path.join(json_dir, json_file)
        process_audio(audio_path, json_path)
