
import React, { useState } from 'react';
import { generateVideoMetadata } from '../services/geminiService';

interface UploadModalProps {
    onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose }) => {
    const [prompt, setPrompt] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt) {
            setError('Please enter a video idea or prompt.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const metadata = await generateVideoMetadata(prompt);
            setTitle(metadata.title);
            setDescription(metadata.description);
        } catch (err) {
            setError('Failed to generate metadata. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-2 rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
                <div className="p-6 border-b border-dark-3 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Upload Video</h2>
                    <button onClick={onClose} className="text-gray-text hover:text-white">&times;</button>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label htmlFor="video-file" className="block text-sm font-medium text-gray-text mb-2">Video File</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dark-3 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-text" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-400">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-dark-2 rounded-md font-medium text-brand-red hover:text-red-400 focus-within:outline-none">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">MP4, WEBM, MOV up to 10GB</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                           ✨ AI Content Assistant
                        </h3>
                        <p className="text-sm text-gray-text mb-3">Describe your video idea, and our AI will generate a title and description for you.</p>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., A cinematic travel vlog about exploring the Swiss Alps in winter"
                            className="w-full bg-dark-1 border border-dark-3 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-brand-red"
                            rows={3}
                        />
                         <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="mt-2 w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-dark-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Generating...' : 'Generate with AI'}
                        </button>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-text">Title</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full bg-dark-1 border border-dark-3 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-red sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-text">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={5}
                                className="mt-1 block w-full bg-dark-1 border border-dark-3 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-red sm:text-sm"
                            />
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-dark-1 rounded-b-lg border-t border-dark-3 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md hover:bg-dark-3">Cancel</button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-brand-red rounded-md hover:bg-red-700">Publish</button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
