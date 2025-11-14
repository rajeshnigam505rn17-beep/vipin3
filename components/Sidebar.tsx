import React from 'react';
import { HomeIcon, ShortsIcon, SubscriptionsIcon, GamingIcon, BookmarkIcon } from './icons';
import { Channel } from '../types';
import { MOCK_CHANNELS } from '../constants';

interface SidebarProps {
    onNavigate: (page: 'home' | 'shorts', category?: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
    return (
        <aside className="fixed top-16 left-0 h-full w-64 bg-dark-1 p-4 border-r border-dark-3 hidden md:block">
            <nav className="flex flex-col gap-2">
                <SidebarButton icon={<HomeIcon />} label="Home" onClick={() => onNavigate('home', 'All')} />
                <SidebarButton icon={<ShortsIcon />} label="Shorts" onClick={() => onNavigate('shorts')} />
                <SidebarButton icon={<GamingIcon />} label="Gaming" onClick={() => onNavigate('home', 'Gaming')} />
                <SidebarButton icon={<SubscriptionsIcon />} label="Subscriptions" onClick={() => onNavigate('home', 'Subscriptions')} />
                <SidebarButton icon={<BookmarkIcon />} label="Watch Later" onClick={() => onNavigate('home', 'Watch Later')} />
            </nav>
            <hr className="my-4 border-dark-3"/>
            <h3 className="text-gray-text uppercase text-sm font-semibold mb-2">Subscriptions</h3>
            <div className="flex flex-col gap-1">
                {MOCK_CHANNELS.slice(0, 4).map(channel => (
                    <SubscriptionItem key={channel.id} channel={channel} />
                ))}
            </div>
        </aside>
    );
};

interface SidebarButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center gap-4 px-3 py-2 text-white text-sm rounded-lg hover:bg-dark-2 transition-colors"
    >
        {icon}
        <span>{label}</span>
    </button>
);


interface SubscriptionItemProps {
    channel: Channel;
}

const SubscriptionItem: React.FC<SubscriptionItemProps> = ({ channel }) => (
    <button className="w-full flex items-center gap-4 px-3 py-2 text-white text-sm rounded-lg hover:bg-dark-2 transition-colors">
        <img src={channel.avatar} alt={channel.name} className="w-6 h-6 rounded-full"/>
        <span className="truncate">{channel.name}</span>
    </button>
);


export default Sidebar;