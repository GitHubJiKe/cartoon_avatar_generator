
import React from 'react';

interface GeneratedImageViewerProps {
  generatedImage: string | null;
  isLoading: boolean;
}

const ImageIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);


const GeneratedImageViewer: React.FC<GeneratedImageViewerProps> = ({ generatedImage, isLoading }) => {
  return (
    <div className="w-full aspect-square bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center animate-pulse">
            <ImageIcon />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Generating your avatar...</p>
        </div>
      ) : generatedImage ? (
        <img src={generatedImage} alt="Generated Avatar" className="w-full h-full object-cover" />
      ) : (
         <div className="flex flex-col items-center justify-center text-center p-4">
            <ImageIcon />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Your generated avatar will appear here</p>
         </div>
      )}
    </div>
  );
};

export default GeneratedImageViewer;
