import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PlayIcon, PauseIcon, VolumeHighIcon, VolumeMuteIcon, FullscreenEnterIcon, FullscreenExitIcon, SettingsIcon } from './icons';

interface VideoPlayerProps {
    src: string;
    poster: string;
}

const PLAYBACK_SPEEDS = [0.5, 1, 1.5, 2];

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const controlsTimeoutRef = useRef<number | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState('00:00');
    const [currentTime, setCurrentTime] = useState('00:00');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [areControlsVisible, setAreControlsVisible] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const hideControls = () => {
        if (isPlaying) {
             setAreControlsVisible(false);
        }
    };
    
    const showControls = () => {
        setAreControlsVisible(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = window.setTimeout(hideControls, 3000);
    };

    const handlePlayPause = useCallback(() => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    }, []);
    
    useEffect(() => {
        const video = videoRef.current;
        const container = containerRef.current;

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onTimeUpdate = () => {
            if (video) {
                setProgress((video.currentTime / video.duration) * 100);
                setCurrentTime(formatTime(video.currentTime));
            }
        };
        const onLoadedMetadata = () => {
            if (video) {
                setDuration(formatTime(video.duration));
            }
        };
        const onFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                handlePlayPause();
            }
        }

        if (video) {
            video.addEventListener('play', onPlay);
            video.addEventListener('pause', onPause);
            video.addEventListener('timeupdate', onTimeUpdate);
            video.addEventListener('loadedmetadata', onLoadedMetadata);
        }
        
        container?.addEventListener('fullscreenchange', onFullscreenChange);
        container?.addEventListener('keydown', handleKeyDown);

        return () => {
            if (video) {
                video.removeEventListener('play', onPlay);
                video.removeEventListener('pause', onPause);
                video.removeEventListener('timeupdate', onTimeUpdate);
                video.removeEventListener('loadedmetadata', onLoadedMetadata);
            }
            container?.removeEventListener('fullscreenchange', onFullscreenChange);
            container?.removeEventListener('keydown', handleKeyDown);
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [handlePlayPause]);
    
    useEffect(() => {
        showControls(); // show on initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying]);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if(isMuted) setIsMuted(false);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            videoRef.current.muted = false;
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
            if (!isMuted && volume === 0) {
              setVolume(0.5); // Restore volume if muted at 0
              videoRef.current.volume = 0.5;
            }
        }
    };
    
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current) {
            const seekTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
            videoRef.current.currentTime = seekTime;
        }
    };
    
    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    };
    
    const handlePlaybackRateChange = (rate: number) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = rate;
            setPlaybackRate(rate);
            setIsSettingsOpen(false);
        }
    };

    return (
        <div 
            ref={containerRef} 
            className="w-full h-full relative group bg-black"
            onMouseMove={showControls}
            onMouseLeave={() => { if(isPlaying) setAreControlsVisible(false); }}
            tabIndex={0}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-full object-contain"
                onClick={handlePlayPause}
                autoPlay
            />
            <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent transition-opacity duration-300 ${areControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                {/* Seek Bar */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className="video-range w-full h-1 accent-brand-red cursor-pointer"
                    style={{'--progress': `${progress}%`} as React.CSSProperties}
                />
                
                {/* Controls */}
                <div className="flex items-center justify-between text-white mt-2">
                    <div className="flex items-center gap-4">
                        <button onClick={handlePlayPause}>
                            {isPlaying ? <PauseIcon className="w-7 h-7" /> : <PlayIcon className="w-7 h-7" />}
                        </button>
                        <div className="flex items-center gap-2 group/volume">
                             <button onClick={toggleMute}>
                                {isMuted || volume === 0 ? <VolumeMuteIcon className="w-6 h-6" /> : <VolumeHighIcon className="w-6 h-6" />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="video-range w-0 group-hover/volume:w-20 transition-all duration-300"
                            />
                        </div>
                         <div className="text-sm">
                            <span>{currentTime}</span> / <span>{duration}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 relative">
                        <button onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
                           <SettingsIcon className="w-6 h-6"/>
                        </button>
                        {isSettingsOpen && (
                            <div className="absolute bottom-10 right-0 bg-dark-2 rounded-md p-2 shadow-lg">
                               <p className="text-sm text-gray-text px-2 pb-1">Speed</p>
                               {PLAYBACK_SPEEDS.map(speed => (
                                   <button 
                                     key={speed} 
                                     onClick={() => handlePlaybackRateChange(speed)}
                                     className={`w-full text-left text-sm px-2 py-1 rounded hover:bg-dark-3 ${playbackRate === speed ? 'bg-dark-3' : ''}`}
                                   >
                                     {speed === 1 ? 'Normal' : `${speed}x`}
                                   </button>
                               ))}
                            </div>
                        )}
                        <button onClick={toggleFullscreen}>
                            {isFullscreen ? <FullscreenExitIcon className="w-6 h-6" /> : <FullscreenEnterIcon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;