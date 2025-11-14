
import React, { useState, useRef, useEffect } from 'react';
import { Video } from '../types';
import { LikeIcon, DislikeIcon, ShareIcon } from '../components/icons';

interface ShortsPageProps {
    videos: Video[];
}

const ShortsPlayer: React.FC<{ video: Video, isVisible: boolean }> = ({ video, isVisible }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (isVisible) {
            videoRef.current?.play();
            setIsPlaying(true);
        } else {
            videoRef.current?.pause();
            setIsPlaying(false);
        }
    }, [isVisible]);

    const handleVideoClick = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    return (
        <div className="w-full h-full snap-start flex-shrink-0 relative bg-black">
            <video
                ref={videoRef}
                src={video.videoUrl}
                loop
                className="w-full h-full object-contain"
                onClick={handleVideoClick}
            />
            <div className="absolute bottom-4 left-4 text-white">
                <p>{video.title}</p>
                <div className="flex items-center gap-2 mt-2">
                    <img src={video.channel.avatar} alt={video.channel.name} className="w-8 h-8 rounded-full" />
                    <span>{video.channel.name}</span>
                    <button className="bg-white text-black px-3 py-1 rounded-full text-sm font-semibold ml-2">Subscribe</button>
                </div>
            </div>
            <div className="absolute bottom-4 right-4 flex flex-col items-center gap-4 text-white">
                <button className="flex flex-col items-center">
                    <LikeIcon className="w-8 h-8" />
                    <span className="text-sm">{video.likes.toLocaleString()}</span>
                </button>
                <button className="flex flex-col items-center">
                    <DislikeIcon className="w-8 h-8" />
                    <span className="text-sm">Dislike</span>
                </button>
                 <button className="flex flex-col items-center">
                    <ShareIcon className="w-8 h-8" />
                    <span className="text-sm">Share</span>
                </button>
            </div>
        </div>
    );
}

const ShortsPage: React.FC<ShortsPageProps> = ({ videos }) => {
    const shortVideos = videos.filter(v => v.isShort);
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleIndex, setVisibleIndex] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
                        setVisibleIndex(index);
                    }
                });
            },
            { threshold: 0.5 }
        );

        const elements = containerRef.current?.querySelectorAll('.short-video');
        if (elements) {
            elements.forEach(el => observer.observe(el));
        }

        return () => {
             if (elements) {
                elements.forEach(el => observer.unobserve(el));
            }
        }
    }, [shortVideos]);


    return (
        <div ref={containerRef} className="h-[calc(100vh-4rem)] w-full flex flex-col snap-y snap-mandatory overflow-y-scroll scrollbar-hide">
            {shortVideos.map((video, index) => (
                <div key={video.id} data-index={index} className="short-video h-full w-full flex-shrink-0 snap-start">
                    <ShortsPlayer video={video} isVisible={index === visibleIndex} />
                </div>
            ))}
        </div>
    );
};

export default ShortsPage;
