import os
import json
from pydub import AudioSegment
import numpy as np

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

def process_multiple_audio_files(audio_files):
    json_dir = './json'
    if not os.path.exists(json_dir):
        os.makedirs(json_dir)

    for audio_file in audio_files:
        audio_path = os.path.join('./audio', audio_file)
        json_file = audio_file.replace('.mp3', '.json')
        json_path = os.path.join(json_dir, json_file)
        process_audio(audio_path, json_path)

    metadata = {'audio_files': [f.replace('.mp3', '.json') for f in audio_files]}
    with open('./json/metadata.json', 'w') as f:
        json.dump(metadata, f)

if __name__ == "__main__":
    audio_files = [f for f in os.listdir('./audio') if f.endswith('.mp3')]
    process_multiple_audio_files(audio_files)
