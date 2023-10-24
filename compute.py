import os
from pydub import AudioSegment
import numpy as np
import matplotlib.pyplot as plt

# Function to process a single audio file
def process_audio(audio_path, image_path):
    # Load audio file
    audio = AudioSegment.from_file(audio_path, format="mp3")
    
    # Number of chunks to split the audio into
    num_chunks = 128
    
    # Length of each chunk
    chunk_length = len(audio) // num_chunks
    
    # List to store amplitude of each chunk
    amplitudes = []
    
    for i in range(num_chunks):
        # Extract chunk
        start = i * chunk_length
        end = (i + 1) * chunk_length
        chunk = audio[start:end]
        
        # Convert to numpy array and calculate amplitude
        samples = np.array(chunk.get_array_of_samples())
        amplitude = np.mean(np.abs(samples))
        
        # Add to the list of amplitudes
        amplitudes.append(amplitude)
    
    # Generate a bar graph
    plt.bar(range(len(amplitudes)), amplitudes)
    plt.xlabel('Chunk')
    plt.ylabel('Amplitude')
    plt.title(f'Amplitude of each chunk in {os.path.basename(audio_path)}')
    
    # Save the image
    plt.savefig(image_path)
    plt.close()

# Create 'images/' directory if it doesn't exist
images_dir = './images'
if not os.path.exists(images_dir):
    os.makedirs(images_dir)

# Loop through each audio file in the 'audio/' directory
audio_dir = './audio'
for audio_file in os.listdir(audio_dir):
    if audio_file.endswith('.mp3'):
        audio_path = os.path.join(audio_dir, audio_file)
        
        # Create an image path based on the audio file name
        image_file = audio_file.replace('.mp3', '.png')
        image_path = os.path.join(images_dir, image_file)
        
        # Process the audio file and save the graph
        process_audio(audio_path, image_path)