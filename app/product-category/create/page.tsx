'use client';

import Layout from '@/components/ui/Layout';
import { serviceStore } from '@/services/services';
import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify'; // jalan / install terlebih dahulu: npm install react-toastify, tambahkan <ToastContainer /> pada app/layout.tsx
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function ProductCategoryCreate() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<Record<string, boolean>>({});

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIsError((prevError) => ({ ...prevError, [name]: false }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const submitData = new FormData(e.currentTarget);

      const response = await serviceStore('category-product', submitData);
      if (response.error) {
        if (response.message == 'Token has expired') {
          Cookies.remove('token');
          router.push('/');
        } else if (response.message) {
          if (typeof response.message === 'object') {
            Object.entries(response.message).forEach(([key, value]) => {
              if (Array.isArray(value)) {
                setIsError((prevError) => ({ ...prevError, [key]: true }));
                toast.error(value[0]);
              }
            });
          } else {
            toast.error(response.message);
          }
        }
      } else {
        toast.success(response.data.message || 'Kategori berhasil dibuat');
        router.refresh();
        router.push('/product-category');
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-black text-2xl font-bold">Product Category Create</h1>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <TextField
            error={isError.name}
            onChange={handleChange}
            name="name"
            id="name"
            label="Name"
            variant="standard"
          />
      
        </div>
        <div className="flex justify-end">
          <Button type="submit" variant="contained" loading={isLoading}>
            Submit
          </Button>
        </div>
      </form>
    </Layout>
  );
}