
import React from 'react';

interface SampleGalleryProps {
  samples: string[];
  onSelectSample: (imageUrl: string) => void;
}

const SampleGallery: React.FC<SampleGalleryProps> = ({ samples, onSelectSample }) => {
  return (
    <div className="w-full">
      <h3 className="text-center text-xl font-bold mb-4 text-gray-700 dark:text-gray-300">Or try one of our samples</h3>
      <div className="flex space-x-4 p-4 overflow-x-auto bg-white dark:bg-gray-800/50 rounded-xl shadow-lg">
        {samples.map((src, index) => (
          <div key={index} className="flex-shrink-0">
            <img
              src={src}
              alt={`Sample ${index + 1}`}
              className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              onClick={() => onSelectSample(src)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SampleGallery;
