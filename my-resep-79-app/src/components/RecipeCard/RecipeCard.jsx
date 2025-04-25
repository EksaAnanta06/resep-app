import React from "react";
import { useNavigate } from "react-router-dom";
const RecipeCard = ({ recipe, onEdit, onDelete, onToggleFavorite }) => {
    const navigate = useNavigate();

    return (
        <div className={`bg-white shadow-lg rounded-lg w-[85%] md:w-[250px] ${onDelete === undefined ? 'h-[276px]' : ''}`}>
            {recipe.image_url ? (
                <img
                    className="h-[142px] w-full object-cover rounded"
                    src={recipe.image_url}
                    alt={recipe.title}
                />
            ) : (
                <div className="h-[142px] w-full md:w-[250px] bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-bold">
                    {recipe.title?.length > 20 ? `${recipe.title.slice(0, 20)}...` : recipe.title}
                </div>
            )}
            <div className="p-2">
                <div className="flex flex-col">
                    <span className="text-sm text-[#01BFBF]">{recipe.category}</span>
                    <h2 className=" text-lg font-bold text-gray-800">
                        {recipe.title?.length > 20 ? `${recipe.title.slice(0, 20)}...` : recipe.title}</h2>
                </div>
                <div className="flex justify-between mt-1">
                    <div className="flex gap-1">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM11.72 7H11.78C12.18 7 12.5 7.32 12.5 7.72V12.26L16.37 14.56C16.72 14.76 16.83 15.21 16.62 15.55C16.42 15.89 15.98 15.99 15.64 15.79L11.49 13.3C11.18 13.12 11 12.79 11 12.44V7.72C11 7.32 11.32 7 11.72 7Z" fill="#01BFBF" />
                        </svg>
                        <span className="text-sm text-[#01BFBF]">{recipe.duration} Menit</span>
                    </div>
                    <div className="mr-4 md:mr-0">
                        <button className="text-teal-500 flex items-center"
                            onClick={() => onToggleFavorite(recipe.id)}>
                            {recipe.isFavorite ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.0003 17.5196L16.1503 20.0296C16.9103 20.4896 17.8403 19.8096 17.6403 18.9496L16.5403 14.2296L20.2103 11.0496C20.8803 10.4696 20.5203 9.36958 19.6403 9.29958L14.8103 8.88958L12.9203 4.42958C12.5803 3.61958 11.4203 3.61958 11.0803 4.42958L9.19032 8.87958L4.36032 9.28958C3.48032 9.35958 3.12032 10.4596 3.79032 11.0396L7.46032 14.2196L6.36032 18.9396C6.16032 19.7996 7.09032 20.4796 7.85032 20.0196L12.0003 17.5196Z" fill="#01BFBF" />
                            </svg> :
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M14.8084 8.87461L19.6484 9.29461C20.5284 9.36461 20.8784 10.4646 20.2084 11.0446L16.5384 14.2246L17.6384 18.9546C17.8384 19.8146 16.9084 20.4946 16.1484 20.0346L11.9984 17.5246L7.84836 20.0246C7.08836 20.4846 6.15836 19.8046 6.35836 18.9446L7.45836 14.2246L3.78836 11.0446C3.11836 10.4646 3.47836 9.36461 4.35836 9.29461L9.18836 8.88461L11.0784 4.42461C11.4184 3.61461 12.5784 3.61461 12.9184 4.42461L14.8084 8.87461ZM8.23836 17.9246L11.9984 15.6546L15.7684 17.9346L14.7684 13.6546L18.0884 10.7746L13.7084 10.3946L11.9984 6.35461L10.2984 10.3846L5.91836 10.7646L9.23836 13.6446L8.23836 17.9246Z" fill="#01BFBF" />
                                </svg>
                            }
                            Favorite
                        </button>
                    </div>
                </div>
                <div className="flex items-center mt-3">
                    <button onClick={() => navigate(`/resep/${recipe.id}`)}
                        className="text-[#01BFBF]">
                        Lihat Detail Resep
                    </button>
                </div>

                {onDelete === undefined ? null :
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={() => onEdit(recipe.id)}
                            className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500 text-sm md:text-base"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(recipe.id)}
                            className="bg-red-400 px-3 py-1 rounded hover:bg-red-500 text-white text-sm md:text-base"
                        >
                            Hapus
                        </button>
                    </div>}

            </div>
        </div>
    );
};

export default RecipeCard;