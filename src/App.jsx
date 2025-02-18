import React, { useState } from 'react';
import FlappyBirdGame from './components/FlappyBirdGame';
import BirdColorModal from './components/BirdColorModal';

export default function App() {
  const [birdColor, setBirdColor] = useState("#FFD700");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleColorChange = (newColor) => {
    setBirdColor(newColor);
  };

  return (
    <div className="min-h-screen h-full flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Flappy Bird Remastered</h1>
      <p className="mb-2">Tap to make the bird fly. Avoid pipes and score as high as possible!</p>
      <div className="w-full max-w-md bg-white rounded shadow-lg p-4 relative">
        <FlappyBirdGame birdColor={birdColor} />
        <button 
          onClick={openModal} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer" 
          disabled={isModalOpen}
        >
          Change Bird Color
        </button>
      </div>
      {isModalOpen && (
        <BirdColorModal
          currentColor={birdColor}
          onColorChange={handleColorChange}
          onClose={closeModal}
        />
      )}
      <div className="mt-4">
        <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 cursor-pointer">
          Made on ZAPT
        </a>
      </div>
    </div>
  );
}