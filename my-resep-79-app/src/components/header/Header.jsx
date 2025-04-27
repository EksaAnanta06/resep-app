import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

export const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const username = localStorage.getItem('user') || 'User';

    // Handle scroll effect for glass morphism
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/80 backdrop-blur-md shadow-lg'
                : 'bg-gradient-to-r from-[#F49881] to-[#F47A81]'
            }`}>
            <div className="container mx-auto px-4 lg:px-8 h-16 md:h-20 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center gap-3 transition-transform duration-300 hover:scale-105">
                    <img
                        src="/pngwing 1.png"
                        alt="resep-79"
                        className="h-8 md:h-10 drop-shadow-md"
                    />
                    <h1 className={`text-xl md:text-2xl font-bold ${scrolled ? 'text-[#F47A81]' : 'text-white'}`}>
                        Buku Resep 79
                    </h1>
                </div>

                {/* Hamburger (mobile only) */}
                <button
                    className="md:hidden text-white p-2 rounded-lg transition-all duration-200  active:scale-95"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                >
                    <div className="w-6 h-6 relative">
                        <span className={`absolute h-0.5 w-full bg-red-700 rounded-lg transform transition-all duration-300 ${menuOpen ? 'rotate-45 top-3' : 'rotate-0 top-1'
                            }`}></span>
                        <span className={`absolute h-0.5 bg-red-700 rounded-lg transform transition-all duration-300 ${menuOpen ? 'w-0 opacity-0 left-1/2' : 'w-full opacity-100 top-3'
                            }`}></span>
                        <span className={`absolute h-0.5 w-full bg-red-700 rounded-lg transform transition-all duration-300 ${menuOpen ? '-rotate-45 top-3' : 'rotate-0 top-5'
                            }`}></span>
                    </div>
                </button>

                {/* Navigation */}
                <nav className={`absolute md:static top-16 md:top-auto left-0 w-full md:w-auto ${scrolled ? 'bg-white/80 backdrop-blur-md md:bg-transparent' : 'bg-[#F49881]/95 md:bg-transparent'
                    } md:flex transition-all duration-300 ease-in-out 
                    ${menuOpen ? 'max-h-[300px] opacity-100 shadow-lg' : 'max-h-0 md:max-h-full opacity-0 md:opacity-100 overflow-hidden'}`}>
                    <ul className="flex flex-col md:flex-row md:items-center gap-1 md:gap-6 py-2 md:py-0 px-4 md:px-0">
                        {[
                            { to: '/', label: 'Daftar Resep Masakan' },
                            { to: '/resepSaya', label: 'Resep Saya' },
                            { to: '/resepFavorite', label: 'Resep Favorit' }
                        ].map((item) => (
                            <li key={item.to} className="py-2 md:py-0">
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `relative px-3 py-2 rounded-lg transition-all duration-200 flex items-center
                                        ${isActive
                                            ? 'text-[#01BFBF] font-medium'
                                            : `${scrolled ? 'text-gray-700 hover:text-[#F47A81]' : 'text-white hover:text-[#01BFBF]'}`
                                        } ${isActive ? 'after:content-[""] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#01BFBF] after:rounded-full' : ''}`
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                        <div className="md:ml-4 flex flex-col md:flex-row md:items-center gap-3">
                            <div
                                className="relative cursor-pointer py-2 md:py-0"
                                onMouseEnter={() => window.innerWidth >= 768 && setShowUserMenu(true)}
                                onMouseLeave={() => window.innerWidth >= 768 && setShowUserMenu(false)}
                                onClick={() => window.innerWidth < 768 && setShowUserMenu((prev) => !prev)}
                            >
                                <div className="flex justify-center items-center gap-2">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${scrolled ? 'bg-[#F49881]/20' : 'bg-white/20'
                                        } backdrop-blur-sm transition-all duration-300`}>
                                        <svg width="30" height="30" viewBox="0 0 48 48" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 10C27.32 10 30 12.68 30 16C30 19.32 27.32 22 24 22C20.68 22 18 19.32 18 16C18 12.68 20.68 10 24 10ZM12 31.96C14.58 35.84 19 38.4 24 38.4C29 38.4 33.42 35.84 36 31.96C35.94 27.98 27.98 25.8 24 25.8C20 25.8 12.06 27.98 12 31.96Z" fill={scrolled ? "#F47A81" : "white"} />
                                        </svg>
                                    </div>
                                    <span className={`text-sm font-medium ${scrolled ? 'text-gray-700' : 'text-white'} hidden md:block`}>
                                        {username}
                                    </span>
                                </div>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-3 text-gray-700 border border-gray-100 z-50 transform origin-top-right transition-all duration-200 animate-fadeIn">
                                        <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-100">
                                            <div className="bg-[#F49881]/20 p-2 rounded-full">
                                                <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 10C27.32 10 30 12.68 30 16C30 19.32 27.32 22 24 22C20.68 22 18 19.32 18 16C18 12.68 20.68 10 24 10ZM12 31.96C14.58 35.84 19 38.4 24 38.4C29 38.4 33.42 35.84 36 31.96C35.94 27.98 27.98 25.8 24 25.8C20 25.8 12.06 27.98 12 31.96Z" fill="#F47A81" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium">{username}</p>
                                                <p className="text-xs text-gray-500">Member</p>
                                            </div>
                                        </div>
                                        <div className="py-1">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-red-50 text-red-500 transition-colors duration-200 flex items-center gap-2"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor" />
                                                </svg>
                                                Log out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleLogout}
                                className={`md:hidden text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 mb-3 md:mb-0 flex items-center gap-2`}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor" />
                                </svg>
                                Log out
                            </button>
                        </div>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;