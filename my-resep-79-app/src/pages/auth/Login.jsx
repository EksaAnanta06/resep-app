import { Link } from "react-router-dom";
import Input from "../../components/form/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
    const navigate = useNavigate();
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const loginFormSchema = z.object({
        username: z.string().min(3, { message: 'Username minimal 3 karakter' }),
        password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
    });

    const form = useForm({
        resolver: zodResolver(loginFormSchema),
    });

    const handleLoginUser = async (value) => {
        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: value.username,
                    password: value.password,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                setErrorMessage(data.message || 'Login gagal');
                setShowErrorPopup(true);
                return;
            }
            localStorage.setItem('token', data?.token);
            localStorage.setItem('user', data?.user.username);
            navigate('/')
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(error.message || 'Terjadi kesalahan saat login');
            setShowErrorPopup(true);
        }
    };

    // Komponen Popup Error
    const ErrorPopup = () => {
        if (!showErrorPopup) return null;

        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 mx-4 max-w-sm w-full">
                    <div className="flex items-center justify-center mb-4">
                        <div className="rounded-full bg-red-100 p-3">
                            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>

                    <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Login Gagal</h3>

                    <div className="mb-6">
                        <p className="text-sm text-center text-gray-500">
                            {errorMessage}
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={() => setShowErrorPopup(false)}
                            className="bg-[#F49881] text-white px-4 py-2 rounded hover:bg-[#f3876c] transition-colors duration-200 text-sm font-medium"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className='w-full min-h-screen flex flex-col justify-center items-center gap-10 pt-10 pb-20 px-4'>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <h1 className="font-medium text-[14px]">Buku Resep 79</h1>
                    <img
                        className="w-[48px] h-[48px]"
                        src="/pngwing 1.png" alt="Logo resep 79" />
                </div>
                <div className='w-full max-w-[600px] min-h-[480px] shadow-xl flex flex-col'>
                    <nav className='bg-[#F49881] w-full h-[52px] flex items-center justify-center'>
                        <h1 className='text-white text-[22px]'>Login</h1>
                    </nav>
                    <div className='w-full flex justify-center items-center p-6'>
                        <form onSubmit={form.handleSubmit(handleLoginUser)}
                            className='w-full sm:w-[400px] flex flex-col gap-[20px]'>
                            <Input
                                handle={{ ...form.register('username') }}
                                type={'text'}
                                classNameLabel={'w-full text-gray-500'}
                                labelText={"Username"}
                                className={'p-[8px] w-full rounded border border-[#B4B4BB] border-solid relative'}
                                placeholder={'Username'}
                                erorMessage={form.formState.errors.username?.message} >
                            </Input>
                            <Input
                                handle={{ ...form.register('password') }}
                                type={'password'}
                                classNameLabel={'w-full text-gray-500'}
                                labelText={"Password"}
                                className={'p-[8px] w-full rounded border border-[#B4B4BB] border-solid relative'}
                                placeholder={'Password'}
                                erorMessage={form.formState.errors.password?.message} >
                            </Input>
                            <button type="submit"
                                className='bg-[#01BFBF] text-white p-[8px] rounded'>Login</button>
                            <div className='w-full flex justify-center items-center'>
                                <div className='w-full sm:w-[247px] text-center'>
                                    <span>
                                        Belum Punya Akun?{' '}
                                        <Link to={'/register'} className='text-[#F49881] cursor-pointer'>Daftar di sini</Link>
                                    </span>
                                    <div className='w-full flex justify-between mt-2 text-sm'>
                                        <p className='text-[#F49881] cursor-pointer'>About</p>
                                        <p className='text-[#F49881] cursor-pointer'>Contact</p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ErrorPopup />
        </>
    )
}

export default Login;