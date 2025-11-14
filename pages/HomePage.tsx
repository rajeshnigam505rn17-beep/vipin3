import React, { useEffect, useReducer } from 'react';
import { Video } from '../types';
import VideoCard from '../components/VideoCard';
import { CATEGORIES, SUBSCRIBED_CHANNELS_IDS } from '../constants';

interface HomePageProps {
    videos: Video[];
    onVideoSelect: (video: Video) => void;
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ videos, onVideoSelect, selectedCategory, onSelectCategory }) => {
    // A simple way to force a re-render when local storage changes
    const [_, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        const handleStorageUpdate = () => {
            forceUpdate();
        };
        window.addEventListener('storageUpdated', handleStorageUpdate);
        return () => {
            window.removeEventListener('storageUpdated', handleStorageUpdate);
        };
    }, []);
    
    const filteredVideos = videos.filter(video => {
        if (selectedCategory === 'Shorts') {
            return video.isShort;
        }

        if (video.isShort) return false;
        
        if (selectedCategory === 'All') return true;
        if (selectedCategory === 'Subscriptions') {
            return SUBSCRIBED_CHANNELS_IDS.includes(video.channel.id);
        }
        if (selectedCategory === 'Watch Later') {
            const savedVideoIds = JSON.parse(localStorage.getItem('savedVideos') || '[]');
            return savedVideoIds.includes(video.id);
        }
        return video.category === selectedCategory;
    });

    return (
        <div>
            <nav className="sticky top-16 bg-dark-1 z-10 border-b border-dark-3">
                <div className="flex space-x-3 overflow-x-auto p-4 sm:px-6 lg:px-8 custom-scrollbar">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => onSelectCategory(category)}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                                selectedCategory === category
                                    ? 'bg-white text-black'
                                    : 'bg-dark-2 text-white hover:bg-dark-3'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </nav>
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                    {filteredVideos.length > 0 ? (
                      filteredVideos.map(video => (
                          <VideoCard key={video.id} video={video} onVideoSelect={onVideoSelect} />
                      ))
                    ) : (
                      <div className="col-span-full text-center text-gray-text py-16">
                          <p className="text-lg">No videos found in this category.</p>
                      </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;