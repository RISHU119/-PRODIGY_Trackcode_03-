
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { classifyImage } from './services/geminiService';
import { Status, ClassificationResult } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    setStatus(Status.Loading);
    setError(null);
    setResult(null);
    setImagePreview(URL.createObjectURL(file));

    try {
      const classificationResult = await classifyImage(file);
      setResult(classificationResult);
      setStatus(Status.Success);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setStatus(Status.Error);
      setImagePreview(null);
    }
  }, []);

  const handleReset = () => {
    setStatus(Status.Idle);
    setResult(null);
    setError(null);
    setImagePreview(null);
  };

  const renderContent = () => {
    switch (status) {
      case Status.Loading:
        return (
          <div className="text-center p-8">
            <Loader />
            <p className="mt-4 text-lg text-brand-dark font-semibold animate-pulse">Analyzing image...</p>
            <p className="text-sm text-gray-500">The AI is identifying key features to make a classification.</p>
          </div>
        );
      case Status.Success:
        return result && imagePreview && (
          <ResultDisplay 
            imageUrl={imagePreview}
            result={result}
            onReset={handleReset}
          />
        );
      case Status.Error:
        return (
          <div className="text-center p-8 bg-red-50 border-2 border-red-200 rounded-lg">
            <h3 className="text-xl font-bold text-red-700">Classification Failed</h3>
            <p className="mt-2 text-red-600">{error}</p>
            <button
              onClick={handleReset}
              className="mt-6 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
            >
              Try Again
            </button>
          </div>
        );
      case Status.Idle:
      default:
        return (
          <ImageUploader 
            onImageUpload={handleImageUpload} 
            // FIX: The `ImageUploader` is only rendered when status is `Idle`, so `isLoading` should be `false`.
            // The original code `status === Status.Loading` was always false here and caused a type error.
            isLoading={false}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
