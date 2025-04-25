import React from 'react'
import { Link } from 'react-router-dom'

const RecipeControls = ({ search, setSearch }) => {
    return (
        <div className="flex flex-col md:flex-row justify-center items-center mb-6 gap-5">
            <Link to="/addRecipes">
                <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 mb-4 md:mb-0">
                    + Tambah Resep
                </button>
            </Link>
            <div className="flex space-x-4 w-full md:w-[60%]">
                <div className="w-full flex items-center border border-gray-300 bg-white rounded px-2">
                    <button>
                        {/* icon */}
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_6144_223)">
                                <path fillRule="evenodd" clipRule="evenodd" d="M19.56 17.44L14.62 12.5C15.49 11.21 16 9.67 16 8C16 3.58 12.42 0 8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C9.67 16 11.21 15.49 12.5 14.62L17.44 19.56C17.71 19.83 18.09 20 18.5 20C19.33 20 20 19.33 20 18.5C20 18.09 19.83 17.71 19.56 17.44ZM8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C11.31 2 14 4.69 14 8C14 11.31 11.31 14 8 14Z" fill="#B4B4BB" />
                            </g>
                            <defs>
                                <clipPath id="clip0_6144_223">
                                    <rect width="20" height="20" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                    <input
                        type="text"
                        value={search}
                        placeholder="Cari Resep"
                        className="border-none outline-none p-2 w-full"
                        onChange={(e) => setSearch(e.target.value)} // update ke parent
                    />
                </div>
            </div>
        </div>

    );
};

export default RecipeControls