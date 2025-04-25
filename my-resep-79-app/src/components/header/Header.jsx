import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();
    const username = localStorage.getItem('user') || 'User';

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <header className="bg-[#F49881] sticky top-0 z-50 shadow-md">
            <div className="container mx-auto px-4 md:px-[200px] h-[80px] flex justify-between items-center border-b-2 border-[gray-200] md:border-none">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <img src="/pngwing 1.png" alt="resep-79" className="h-10" />
                    <h1 className="text-white text-xl md:text-2xl font-medium">Buku Resep 79</h1>
                </div>

                {/* Hamburger (mobile only) */}
                <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? (
                        // Ikon X (close)
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        // Ikon hamburger (menu)
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>

                {/* Navigation */}
                <nav className={`absolute md:static top-[80px] left-0 w-full md:w-auto bg-[#F49881] md:bg-transparent px-4 md:px-0 transition-all duration-300 ease-in-out 
        ${menuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'} md:opacity-100 md:translate-y-0 md:visible md:flex`}>
                    <ul className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 py-4 md:py-0 md:text-red-500 font-serif ">
                        <li>
                            <NavLink to='/' className={({ isActive }) => isActive ? 'text-[#01BFBF]' : 'text-white'}>
                                Daftar Resep Masakan
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/resepSaya' className={({ isActive }) => isActive ? 'text-[#01BFBF]' : 'text-white'}>
                                Resep Saya
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/resepFavorite' className={({ isActive }) => isActive ? 'text-[#01BFBF]' : 'text-white'}>
                                Resep Favorit
                            </NavLink>
                        </li>
                        <li className='absolute md:static right-0 top-0 mt-2 mr-[12px]'>
                            <div
                                className="relative cursor-pointer font-extralight"
                                onMouseEnter={() => window.innerWidth >= 768 && setShowUserMenu(true)} // hover buat PC
                                onMouseLeave={() => window.innerWidth >= 768 && setShowUserMenu(false)} // hover buat PC
                                onClick={() => window.innerWidth < 768 && setShowUserMenu((prev) => !prev)} // click buat mobile
                            >
                                <svg width="42" height="42" viewBox="0 0 48 48" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 10C27.32 10 30 12.68 30 16C30 19.32 27.32 22 24 22C20.68 22 18 19.32 18 16C18 12.68 20.68 10 24 10ZM12 31.96C14.58 35.84 19 38.4 24 38.4C29 38.4 33.42 35.84 36 31.96C35.94 27.98 27.98 25.8 24 25.8C20 25.8 12.06 27.98 12 31.96Z" fill="white" />
                                </svg>

                                {showUserMenu && (
                                    <div className="absolute  right-0 mt-2 bg-green-300 shadow-md rounded p-2 text-black font-sans md:font-serif">
                                        <p>{username}</p>
                                    </div>
                                )}
                            </div>
                        </li>
                        <li >
                            <button onClick={handleLogout} 
                            className="text-white bg-red-500 px-3 py-1 rounded-md font-serif md:mt-2 mt-5 " >
                                Log-out
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header;
