import React, { useState, useEffect } from 'react';
import { Video } from '../types';
import { SparklesIcon, BookmarkIcon } from './icons';
import { generateVideoThumbnail } from '../services/geminiService';

const getSavedVideos = (): string[] => {
    return JSON.parse(localStorage.getItem('savedVideos') || '[]');
};

interface VideoCardProps {
    video: Video;
    onVideoSelect: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onVideoSelect }) => {
    const [currentThumbnail, setCurrentThumbnail] = useState(video.thumbnail);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setIsSaved(getSavedVideos().includes(video.id));
    }, [video.id]);

    const formatViews = (views: string) => {
        return `${views} views`;
    };

    const handleGenerateThumbnail = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsGenerating(true);
        try {
            const prompt = `Title: ${video.title}\nDescription: ${video.description}`;
            const newThumbnailUrl = await generateVideoThumbnail(prompt);
            setCurrentThumbnail(newThumbnailUrl);
        } catch (error) {
            console.error("Failed to generate thumbnail:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const savedVideos = getSavedVideos();
        let updatedSavedVideos;
        if (savedVideos.includes(video.id)) {
            updatedSavedVideos = savedVideos.filter(id => id !== video.id);
            setIsSaved(false);
        } else {
            updatedSavedVideos = [...savedVideos, video.id];
            setIsSaved(true);
        }
        localStorage.setItem('savedVideos', JSON.stringify(updatedSavedVideos));
        window.dispatchEvent(new CustomEvent('storageUpdated'));
    };

    return (
        <div className="flex flex-col cursor-pointer group" onClick={() => onVideoSelect(video)}>
            <div className="relative">
                <img 
                    src={currentThumbnail} 
                    alt={video.title} 
                    className="w-full h-auto object-cover rounded-xl group-hover:rounded-none transition-all duration-200" 
                />
                <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                </span>

                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={handleSaveClick}
                        className="p-2 bg-black bg-opacity-60 rounded-full text-white hover:bg-opacity-80"
                        title={isSaved ? "Remove from Watch Later" : "Save to Watch Later"}
                    >
                        <BookmarkIcon className="w-5 h-5" filled={isSaved} />
                    </button>
                    <button
                        onClick={handleGenerateThumbnail}
                        disabled={isGenerating}
                        className="p-2 bg-black bg-opacity-60 rounded-full text-white hover:bg-opacity-80 disabled:cursor-not-allowed disabled:bg-opacity-40"
                        title="Generate AI Thumbnail"
                    >
                        {isGenerating ? (
                           <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                        ) : (
                            <SparklesIcon className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
            <div className="flex items-start mt-3">
                <img src={video.channel.avatar} alt={video.channel.name} className="w-9 h-9 rounded-full mr-3" />
                <div className="flex-1">
                    <h3 className="text-white font-semibold text-base leading-snug">{video.title}</h3>
                    <p className="text-gray-text text-sm mt-1">{video.channel.name}</p>
                    <p className="text-gray-text text-sm">{formatViews(video.views)} &bull; {video.uploadedAt}</p>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;