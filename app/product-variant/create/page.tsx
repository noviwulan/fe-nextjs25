'use client';

import Layout from '@/components/ui/Layout';
import { serviceStore, service } from '@/services/services';
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { SelectChangeEvent } from '@mui/material/Select';
import { ProductType } from "@/services/data-types/product-type";

export default function ProductVariantCreate() {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState<Record<string, boolean>>({});
    
    // PERBAIKAN: State ini untuk menampung daftar PRODUK (induk), bukan variant
    const [products, setProducts] = useState<ProductType[]>([]);

    const [formValues, setFormValues] = useState({
        product_id: '',
        name: '',
        price: '',
        stock: ''
    });

    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            // Ambil data dari endpoint 'product' untuk mengisi dropdown
            const response = await service('product');
            
            // PERBAIKAN: Pastikan mengakses response.data.data sesuai struktur API Anda
            const actualData = response?.data?.data || response?.data;
            
            if (!response.error && Array.isArray(actualData)) {
                setProducts(actualData);
            } else {
                setProducts([]); // Fallback ke array kosong agar .map tidak error
                toast.error("Gagal mengambil daftar produk");
            }
        };
        fetchProducts();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setIsError((prev) => ({ ...prev, [name]: false }));
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const name = e.target.name as string;
        const value = e.target.value;
        setIsError((prev) => ({ ...prev, [name]: false }));
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('product_id', String(formValues.product_id));
            formData.append('name', formValues.name);
            formData.append('price', String(formValues.price));
            formData.append('stock', String(formValues.stock));
    
            const response = await serviceStore('product-variant', formData);
            
            if (response.error) {
                if (response.message === 'Token has expired') {
                    Cookies.remove('token');
                    router.push('/');
                } else if (typeof response.message === 'object') {
                    Object.entries(response.message).forEach(([key, value]) => {
                        setIsError((prev) => ({ ...prev, [key]: true }));
                        if (Array.isArray(value)) toast.error(value[0]);
                    });
                } else {
                    toast.error(response.message);
                }
            } else {
                toast.success('Varian produk berhasil dibuat');
                router.push('/product-variant');
            }
        } catch (error) {
            toast.error('Terjadi kesalahan sistem');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <h1 className="text-black text-2xl font-bold mb-6">Create Product Variant</h1>
            <form onSubmit={handleSubmit} className="w-full bg-white p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                    
                    {/* SELECT PRODUCT (INDUK) */}
                    <FormControl variant="standard" fullWidth error={!!isError.product_id}>
                        <InputLabel id="product_id-label" shrink>Pilih Produk Induk</InputLabel>
                        <Select
                            labelId="product_id-label"
                            name="product_id"
                            value={formValues.product_id}
                            onChange={handleSelectChange}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>-- Pilih Produk --</MenuItem>
                            {/* PERBAIKAN: Gunakan optional chaining dan pastikan products adalah array */}
                            {products?.map((product) => (
                                <MenuItem key={product.id} value={product.id}>
                                    {product.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {isError.product_id && <FormHelperText>Produk wajib dipilih</FormHelperText>}
                    </FormControl>

                    <TextField
                        error={!!isError.name}
                        onChange={handleChange}
                        name="name"
                        label="Variant Name (e.g. Tablet, Sirup)"
                        variant="standard"
                        value={formValues.name}
                        fullWidth
                    />

                    <TextField
                        error={!!isError.price}
                        onChange={handleChange}
                        name="price"
                        label="Price"
                        variant="standard"
                        type="number"
                        value={formValues.price}
                        fullWidth
                    />

                    <TextField
                        error={!!isError.stock}
                        onChange={handleChange}
                        name="stock"
                        label="Stock"
                        variant="standard"
                        type="number"
                        value={formValues.stock}
                        fullWidth
                    />
                </div>

                <div className="flex justify-end mt-8 gap-2">
                    <Button variant="outlined" onClick={() => router.push('/product-variant')}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Submit Variant'}
                    </Button>
                </div>
            </form>
        </Layout>
    );
}