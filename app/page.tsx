"use client";

import Layout from "@/components/ui/Layout";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { JWTPayloadTypes } from '@/services/data-types/jwt-payload-type';
import { jwtDecode } from 'jwt-decode'; // install terlebih dahulu: npm install jwt-decode
import { UserType } from '@/services/data-types/user-type';



export default function Home() {
  const [token, setToken] = useState(Cookies.get('token') || '');
  const router = useRouter();

  useEffect(() => {
    if (token) {
      const jwtToken = atob(token);
      const payload: JWTPayloadTypes = jwtDecode(jwtToken);

      const userPayload: UserType = payload.user;
      console.log(userPayload);
    } else {
      router.push('/login');
    }
  }, [router, token]);

  return (
    <Layout>
      <h1 className="text-black">
        Home
      </h1>
    </Layout>
  );
}
