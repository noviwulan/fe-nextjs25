'use client';

import Layout from '@/components/ui/Layout';
import { serviceShow, serviceUpdate, service } from '@/services/services';
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, FormHelperText, SelectChangeEvent } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useParams, useRouter } from 'next/navigation';
import { ProductType } from '@/services/data-types/product-type';

export default function ProductVariantEdit() {
    const [isLoading, setIsLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [isError, setIsError] = useState<Record<string, boolean>>({});
    
    // PERBAIKAN: Gunakan ProductType untuk daftar dropdown produk induk
    const [products, setProducts] = useState<ProductType[]>([]);
    
    const [formValues, setFormValues] = useState({
        name: '',
        product_id: '',
        price: '',
        stock: '',
    });

    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    // Fetch daftar produk induk untuk dropdown
    useEffect(() => {
        const fetchProducts = async () => {
            const response = await service('product');
            const actualData = response?.data?.data || response?.data;
            if (!response.error && Array.isArray(actualData)) {
                setProducts(actualData);
            }
        };
        fetchProducts();
    }, []);

    const getProductVariant = useCallback(async () => {
        setFetching(true);
        const response = await serviceShow('product-variant', id);
        
        // Sesuaikan dengan struktur data API (biasanya response.data atau response.data.data)
        const data = response?.data?.data || response?.data;

        if (!response.error && data) {
            setFormValues({
                name: data.name || '',
                product_id: data.product_id || '',
                price: data.price || '',
                stock: data.stock || '',
            });
        } else {
            toast.error("Gagal memuat data varian");
        }
        setFetching(false);
    }, [id]);

    useEffect(() => {
        getProductVariant();
    }, [getProductVariant]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setIsError((prev) => ({ ...prev, [name]: false }));
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setIsError((prev) => ({ ...prev, [name as string]: false }));
        setFormValues((prev) => ({ ...prev, [name as string]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = {
                name: formValues.name,
                product_id: Number(formValues.product_id),
                price: Number(formValues.price),
                stock: Number(formValues.stock),
                _method: 'PUT' 
            };

            const response = await serviceUpdate('product-variant', payload as any, id);
            
            if (!response.error) {
                toast.success('Varian berhasil diperbarui');
                router.push('/product-variant');
            } else {
                toast.error(response.message || 'Gagal memperbarui');
            }
        } catch (error) {
            toast.error('Terjadi kesalahan sistem');
        } finally {
            setIsLoading(false);
        }
    };

    if (fetching) return <Layout><p className="p-10 text-center">Loading...</p></Layout>;

    return (
        <Layout>
            <h1 className="text-black text-2xl font-bold mb-4">Edit Product Variant</h1>
            <form onSubmit={handleSubmit} className="w-full bg-white p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <FormControl variant="standard" fullWidth error={!!isError.product_id}>
                        <InputLabel shrink>Produk Induk</InputLabel>
                        <Select
                            name="product_id"
                            value={String(formValues.product_id)}
                            onChange={handleSelectChange}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>-- Pilih Produk --</MenuItem>
                            {products.map((p) => (
                                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        name="name"
                        label="Nama Varian"
                        variant="standard"
                        fullWidth
                        value={formValues.name}
                        onChange={handleChange}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />

                    <TextField
                        name="price"
                        label="Harga"
                        type="number"
                        variant="standard"
                        fullWidth
                        value={formValues.price}
                        onChange={handleChange}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />

                    <TextField
                        name="stock"
                        label="Stok"
                        type="number"
                        variant="standard"
                        fullWidth
                        value={formValues.stock}
                        onChange={handleChange}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                </div>

                <div className="flex justify-end gap-2 mt-8">
                    <Button variant="outlined" onClick={() => router.push('/product-variant')}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={isLoading}>
                        {isLoading ? 'Updating...' : 'Update Variant'}
                    </Button>
                </div>
            </form>
        </Layout>
    );
}