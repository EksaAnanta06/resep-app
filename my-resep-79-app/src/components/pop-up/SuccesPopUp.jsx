import { useState, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuccessPopup = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true);

    // Otomatis hilangkan popup setelah 5 detik
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            navigate('/login');
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    const closePopup = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 mx-4 max-w-sm w-full animate-fadeIn">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                        <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">Registrasi Berhasil</h3>
                    </div>
                    <button
                        onClick={() => {
                            closePopup();
                            navigate('/login');
                        }}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-gray-500">
                        Selamat! Akun Anda telah berhasil terdaftar. Silakan kembali ke halaman login.
                    </p>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={() => {
                            closePopup();
                            navigate('/login');
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200 text-sm font-medium"
                    >
                        Mengerti
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessPopup;