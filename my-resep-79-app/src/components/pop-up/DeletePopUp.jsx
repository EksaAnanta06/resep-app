import { useState } from 'react';

 const DeleteConfirmationPopup = () => {
    const [isVisible, setIsVisible] = useState(true);

    const closePopup = () => {
        setIsVisible(false);
    };

    const handleDelete = () => {
        // Di sini Anda bisa menambahkan logika untuk menghapus data
        console.log("Data berhasil dihapus");
        setIsVisible(false);
        // Tambahkan fungsi callback untuk menghapus data jika diperlukan
    };

    // Demo button untuk memunculkan popup (dalam aplikasi sesungguhnya, ini tidak diperlukan)
    const showPopup = () => {
        setIsVisible(true);
    };

    if (!isVisible) {
        return (
            <button
                onClick={showPopup}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Tampilkan Popup Hapus
            </button>
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 mx-4 max-w-sm w-full">
                <div className="flex items-center justify-center mb-4">
                    <div className="rounded-full bg-red-100 p-3">
                        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                </div>

                <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Konfirmasi Hapus Data</h3>

                <div className="mb-6">
                    <p className="text-sm text-center text-gray-500">
                        Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan dan data yang dihapus tidak dapat dikembalikan.
                    </p>
                </div>

                <div className="flex justify-center space-x-4">
                    <button
                        onClick={closePopup}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                    >
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmationPopup;