import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Ambil token dari cookies
  const token = request.cookies.get('token')?.value;

  // 2. Tentukan halaman mana saja yang butuh proteksi login
  const protectedPaths = [
    '/product-category',
    '/product',
    '/product-variant',
  ];

  // 3. Cek apakah user sedang mencoba mengakses halaman terproteksi
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // 4. Jika mencoba masuk ke halaman terproteksi TANPA token, lempar ke Login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika punya token atau bukan halaman terproteksi, izinkan lewat
  return NextResponse.next();
}

// 5. Konfigurasi agar middleware hanya berjalan di rute tertentu
export const config = {
  matcher: [
    '/product-category/:path*',
    '/product/:path*',
    '/product-variant/:path*',
  ],
};