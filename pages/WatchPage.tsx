

import React from 'react';
import { Video } from '../types';
import { LikeIcon, DislikeIcon, ShareIcon } from '../components/icons';
import { MOCK_VIDEOS } from '../constants';
import VideoPlayer from '../components/VideoPlayer';


interface WatchPageProps {
    video: Video;
    onVideoSelect: (video: Video) => void;
}

const WatchPage: React.FC<WatchPageProps> = ({ video, onVideoSelect }) => {
    const nextVideos = MOCK_VIDEOS.filter(v => v.id !== video.id && !v.isShort);

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-8">
            {/* Main Content */}
            <div className="flex-grow">
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

            {/* Watch Next Sidebar */}
            <div className="w-full lg:w-96 lg:min-w-[24rem] space-y-4">
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
    );
};

export default WatchPage;