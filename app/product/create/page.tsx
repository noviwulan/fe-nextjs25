'use client';

import Layout from '@/components/ui/Layout';
import { serviceStore, service } from '@/services/services';
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { ProductCategoryType } from '@/services/data-types/product-category-type';

export default function ProductCreate() {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState<Record<string, boolean>>({});
    // State ini harusnya menyimpan CATEGORY, bukan product (untuk dropdown pilihan category)
    const [categories, setCategories] = useState<ProductCategoryType[]>([]);

    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            // Ambil data category untuk isi Dropdown
            const response = await service('category-product');
            // PERBAIKAN: Akses response.data.data karena API kamu membungkus array di dalam object
            if (!response.error && response.data?.data) {
                setCategories(response.data.data);
            } else {
                setCategories([]); // Fallback ke array kosong jika gagal
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const name = e.target.name as string;
        setIsError((prevError) => ({ ...prevError, [name]: false }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const submitData = new FormData(e.currentTarget);

            const response = await serviceStore('product', submitData);
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
                toast.success('Product created successfully');
                router.refresh();
                router.push('/product');
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Something went wrong';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <h1 className="text-black text-2xl font-bold">Product Create</h1>
            <form onSubmit={handleSubmit} className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    
                    {/* PERBAIKAN: Hapus spasi pada name=" name" */}
                    <TextField
                        error={isError.name}
                        onChange={handleChange}
                        name="name"
                        id="name"
                        label="Product Name"
                        variant="standard"
                        fullWidth
                    />

                    <TextField
                        error={isError.price}
                        onChange={handleChange}
                        name="price"
                        id="price"
                        label="Price"
                        variant="standard"
                        type="number"
                        fullWidth
                    />

                    <FormControl variant="standard" fullWidth error={isError.category_product_id}>
                        <InputLabel id="category_product_id-label">Category</InputLabel>
                        <Select
                            labelId="category_product_id-label"
                            id="category_product_id"
                            name="category_product_id"
                            label="Category"
                            defaultValue=""
                        >
                            {/* PERBAIKAN: map dari state categories yang sudah fix array-nya */}
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {isError.category_product_id && (
                            <FormHelperText>Category is required</FormHelperText>
                        )}
                    </FormControl>
                
                </div>
                <div className="flex justify-end gap-2">
                    <Button onClick={() => router.back()} color="inherit">Cancel</Button>
                    <Button type="submit" variant="contained" loading={isLoading}>
                        Submit
                    </Button>
                </div>
            </form>
        </Layout>
    );
}