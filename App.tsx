import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import GeneratedImageViewer from './components/GeneratedImageViewer';
import SampleGallery from './components/SampleGallery';
import { generateCartoonAvatar } from './services/geminiService';
import { SAMPLE_IMAGES } from './constants';

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);


const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [sourceImagePreview, setSourceImagePreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve({ base64, mimeType: file.type });
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = useCallback((file: File | null) => {
    setSourceImage(file);
    setGeneratedImage(null);
    setError(null);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSourceImagePreview(previewUrl);
    } else {
      setSourceImagePreview(null);
    }
  }, []);

  const handleSelectSample = async (imageUrl: string) => {
    try {
      setGeneratedImage(null);
      setError(null);
      setIsLoading(true);
      setSourceImage(null); // Clear file input
      setSourceImagePreview(imageUrl); // Show sample in uploader
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "sample.jpg", { type: blob.type });
      setSourceImage(file);
    } catch (e) {
       setError('Failed to load sample image. Please try again.');
       console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!sourceImage) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const { base64, mimeType } = await fileToBase64(sourceImage);
      const cartoonImageBase64 = await generateCartoonAvatar(base64, mimeType);
      if (cartoonImageBase64) {
        setGeneratedImage(`data:image/png;base64,${cartoonImageBase64}`);
      } else {
        throw new Error('The model did not return an image. Please try a different photo.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate avatar. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'cartoon-avatar.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">
            卡通头像生成器
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Cartoon Avatar Generator</p>
        </header>

        <main className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] md:gap-8 items-center">
            <div className="w-full h-full">
              <ImageUploader onImageUpload={handleImageUpload} imagePreview={sourceImagePreview} />
            </div>

            <div className="flex flex-col items-center justify-center my-6 md:my-0">
               <button
                  onClick={handleGenerate}
                  disabled={isLoading || !sourceImage}
                  className="relative group w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full shadow-lg text-white flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-primary/50"
                  aria-label="Generate Avatar"
                >
                  <span className={`transition-transform duration-500 ${isLoading ? 'animate-spin' : 'rotate-90 md:rotate-0 group-hover:rotate-135 md:group-hover:rotate-45'}`}>
                    {isLoading ? 
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8v0a8 8 0 018 8v0a8 8 0 01-8 8v0a8 8 0 01-8-8v0z" />
                      </svg>
                     : <ArrowRightIcon />
                    }
                  </span>
                </button>
            </div>

            <div className="w-full h-full flex flex-col items-center gap-4">
              <GeneratedImageViewer generatedImage={generatedImage} isLoading={isLoading} />
              {generatedImage && !isLoading && (
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-hover transition-transform transform hover:scale-105"
                  aria-label="Download Generated Avatar"
                >
                  <DownloadIcon />
                  Download
                </button>
              )}
            </div>
          </div>
           {error && (
            <div className="mt-6 text-center bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
          )}
        </main>
        
        <footer className="mt-8">
          <SampleGallery samples={SAMPLE_IMAGES} onSelectSample={handleSelectSample} />
        </footer>
      </div>
    </div>
  );
};

export default App;