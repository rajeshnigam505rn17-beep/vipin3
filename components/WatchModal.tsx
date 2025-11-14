

import React, { useEffect, useRef } from 'react';
import { Video } from '../types';
import { LikeIcon, DislikeIcon, ShareIcon } from './icons';
import { MOCK_VIDEOS } from '../constants';
import VideoPlayer from './VideoPlayer';

interface WatchModalProps {
    video: Video;
    onVideoSelect: (video: Video) => void;
    onClose: () => void;
}

const WatchModal: React.FC<WatchModalProps> = ({ video, onVideoSelect, onClose }) => {
    const nextVideos = MOCK_VIDEOS.filter(v => v.id !== video.id && !v.isShort);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    }, [onClose]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div 
                ref={modalRef}
                className="bg-dark-1 w-full max-w-7xl h-full max-h-[90vh] rounded-xl flex flex-col lg:flex-row relative"
            >
                <div className="flex-grow flex flex-col overflow-y-auto custom-scrollbar">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <div className="aspect-video bg-black rounded-xl overflow-hidden">
                           <VideoPlayer src={video.videoUrl} poster={video.thumbnail} />
                        </div>
                        <h1 className="text-xl font-bold mt-4">{video.title}</h1>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2">
                            {/* Channel Info */}
                            <div className="flex items-center gap-3">
                                <img src={video.channel.avatar} alt={video.channel.name} className="w-12 h-12 rounded-full" />
                                <div>
                                    <p className="font-semibold">{video.channel.name}</p>
                                    <p className="text-sm text-gray-text">{video.channel.subscribers.toLocaleString()} subscribers</p>
                                </div>
                                <button className="ml-4 bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200">Subscribe</button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 mt-4 sm:mt-0">
                                <div className="flex items-center bg-dark-2 rounded-full">
                                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-dark-3 rounded-l-full">
                                        <LikeIcon className="w-5 h-5"/> <span>{video.likes.toLocaleString()}</span>
                                    </button>
                                    <div className="w-px h-6 bg-dark-3"></div>
                                    <button className="px-4 py-2 hover:bg-dark-3 rounded-r-full">
                                        <DislikeIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 bg-dark-2 rounded-full hover:bg-dark-3">
                                    <ShareIcon className="w-5 h-5"/> <span>Share</span>
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-dark-2 p-4 rounded-xl mt-4">
                            <p className="font-semibold text-sm">{video.views} views &bull; {video.uploadedAt}</p>
                            <p className="text-sm mt-2 whitespace-pre-wrap">{video.description}</p>
                        </div>

                        {/* Comments Section */}
                        <div className="mt-6">
                            <h2 className="text-lg font-bold">{video.comments.length} Comments</h2>
                            {/* ... Comments would be mapped here ... */}
                        </div>
                    </div>
                </div>
                
                {/* Watch Next Sidebar */}
                <div className="w-full lg:w-96 lg:min-w-[24rem] space-y-4 p-4 sm:p-6 lg:p-8 border-l-0 lg:border-l border-dark-3 overflow-y-auto custom-scrollbar flex-shrink-0">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-text hover:text-white text-3xl z-10">&times;</button>
                    <h3 className="text-lg font-bold">Watch Next</h3>
                    {nextVideos.map(nextVideo => (
                        <div key={nextVideo.id} className="flex gap-3 cursor-pointer" onClick={() => onVideoSelect(nextVideo)}>
                            <img src={nextVideo.thumbnail} alt={nextVideo.title} className="w-40 h-24 rounded-lg object-cover"/>
                            <div>
                                <h4 className="text-sm font-semibold leading-tight">{nextVideo.title}</h4>
                                <p className="text-xs text-gray-text mt-1">{nextVideo.channel.name}</p>
                                <p className="text-xs text-gray-text">{nextVideo.views} views</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WatchModal;