
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import ShortsPage from './pages/ShortsPage';
import UploadModal from './components/UploadModal';
import WatchModal from './components/WatchModal';
import { MOCK_VIDEOS } from './constants';
import { Page, Video } from './types';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const body = document.body;
        if (selectedVideo || isUploadModalOpen) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = 'auto';
        }
        return () => {
            body.style.overflow = 'auto';
        };
    }, [selectedVideo, isUploadModalOpen]);

    const handleVideoSelect = (video: Video) => {
        setSelectedVideo(video);
    };

    const handleCloseWatchModal = () => {
        setSelectedVideo(null);
    };

    const handleNavigate = (page: Page, category: string = 'All') => {
        setSelectedVideo(null);
        setCurrentPage(page);
        setSelectedCategory(category);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'shorts':
                return <ShortsPage videos={MOCK_VIDEOS} />;
            case 'home':
            default:
                return <HomePage videos={MOCK_VIDEOS} onVideoSelect={handleVideoSelect} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />;
        }
    };

    return (
        <div className="min-h-screen bg-dark-1 text-white">
            <Header 
                onUploadClick={() => setIsUploadModalOpen(true)}
                onLogoClick={() => handleNavigate('home')}
            />
            <div className="flex">
                <Sidebar onNavigate={(page, category) => handleNavigate(page as Page, category)} />
                <main className="flex-1 pt-16 md:pl-64">
                    {renderPage()}
                </main>
            </div>
            {isUploadModalOpen && <UploadModal onClose={() => setIsUploadModalOpen(false)} />}
            {selectedVideo && <WatchModal video={selectedVideo} onVideoSelect={handleVideoSelect} onClose={handleCloseWatchModal} />}
        </div>
    );
};

export default App;
