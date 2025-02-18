import React, { useState } from 'react';

export default function BirdColorModal({ currentColor, onColorChange, onClose }) {
  const [color, setColor] = useState(currentColor);

  const handleChange = (e) => {
    setColor(e.target.value);
    onColorChange(e.target.value);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Select Bird Color</h2>
        <input
          type="color"
          value={color}
          onChange={handleChange}
          className="box-border w-16 h-16 mb-4"
        />
        <div className="flex justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}