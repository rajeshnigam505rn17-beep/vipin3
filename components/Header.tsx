
import React from 'react';
import { UploadIcon, SearchIcon } from './icons';

interface HeaderProps {
    onUploadClick: () => void;
    onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onUploadClick, onLogoClick }) => {
    return (
        <header className="fixed top-0 left-0 right-0 bg-dark-1 h-16 flex items-center justify-between px-4 z-50 border-b border-dark-3">
            <div className="flex items-center gap-4">
                <button onClick={onLogoClick} className="flex items-center gap-2 text-2xl font-bold text-white">
                    <span className="bg-brand-red p-1 rounded-md">
                        <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.582,6.186 C21.232,4.922 20.368,3.922 19.242,3.486 C17.342,2.78 12,2.78 12,2.78 C12,2.78 6.658,2.78 4.758,3.486 C3.632,3.922 2.768,4.922 2.418,6.186 C1.742,8.196 1.742,12.000 1.742,12.000 C1.742,12.000 1.742,15.804 2.418,17.814 C2.768,19.078 3.632,20.078 4.758,20.514 C6.658,21.220 12,21.220 12,21.220 C12,21.220 17.342,21.220 19.242,20.514 C20.368,20.078 21.232,19.078 21.582,17.814 C22.258,15.804 22.258,12.000 22.258,12.000 C22.258,12.000 22.258,8.196 21.582,6.186 Z M10,15.464 L10,8.536 L15.167,12.000 L10,15.464 Z"></path></svg>
                    </span>
                    ViserTube
                </button>
            </div>

            <div className="flex-1 max-w-xl hidden sm:flex items-center">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-dark-2 border border-dark-3 rounded-l-full px-4 py-2 text-gray-text focus:outline-none focus:ring-1 focus:ring-brand-red"
                />
                <button className="bg-dark-2 border-y border-r border-dark-3 rounded-r-full px-4 py-2 hover:bg-dark-3">
                    <SearchIcon className="text-gray-text"/>
                </button>
            </div>

            <div className="flex items-center gap-4">
                <button onClick={onUploadClick} className="p-2 rounded-full hover:bg-dark-2 transition-colors">
                    <UploadIcon />
                </button>
                <img
                    src="https://picsum.photos/seed/user/40/40"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full cursor-pointer"
                />
            </div>
        </header>
    );
};

export default Header;
