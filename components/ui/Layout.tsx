'use client'; // Pastikan ada directive ini karena kita pakai hooks

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation'; // Untuk pindah halaman
import { Cookies } from 'react-cookie'; // Pastikan sudah install: npm install react-cookie

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const cookies = new Cookies();

  useEffect(() => {
    // 1. Ambil token dari cookie
    const token = cookies.get('token');

    // 2. Jika tidak ada token, tendang ke login
    if (!token) {
      router.push('/login');
    } else {
      // Jika ada, izinkan konten tampil
      setAuthorized(true);
    }
  }, [router]);

  // Jika belum authorized, jangan tampilkan apa-apa (blank) agar data tidak berkedip
  if (!authorized) {
    return <div className="min-h-screen bg-white" />; 
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans bg-white">
      <main className="flex min-h-screen w-full flex-col items-center py-8 px-16 bg-white sm:items-start">
        <Navbar />
        {children}
      </main>
      {/* Tambahkan ToastContainer di sini agar notifikasi muncul secara global */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}