'use client';

import Layout from '@/components/ui/Layout';
import { serviceShow, serviceUpdate, service } from '@/services/services';
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, FormHelperText, Box } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useParams, useRouter } from 'next/navigation';
import { ProductCategoryType } from '@/services/data-types/product-category-type';

export default function ProductEdit() {
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<ProductCategoryType[]>([]);
  const [isError, setIsError] = useState<Record<string, boolean>>({});
  
  const [formValues, setFormValues] = useState({
    category_product_id: '', 
    name: '',
    price: '',              
  });

  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // 1. Ambil Daftar Kategori untuk Dropdown
  const getCategories = useCallback(async () => {
    try {
      const response = await service('category-product');
      if (!response.error && response.data?.data) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Gagal memuat kategori:", error);
    }
  }, []);

  // 2. Ambil Detail Produk yang akan diedit
  const getProduct = useCallback(async () => {
    setFetching(true);
    try {
      const response = await serviceShow('product', id);
      const actualData = response?.data?.data || response?.data;

      if (!response.error && actualData) {
        setFormValues({
          name: actualData.name || '',
          category_product_id: actualData.category_product_id || '',
          price: actualData.price || ''
        });
      } else {
        toast.error(response.message || "Gagal mengambil data produk");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memuat data");
    } finally {
      setFetching(false);
    }
  }, [id]);

  useEffect(() => {
    getCategories();
    getProduct();
  }, [getCategories, getProduct]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setIsError((prev) => ({ ...prev, [name]: false }));
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Fungsi Submit dengan Perbaikan Payload (Method Spoofing)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      // Menggunakan FormData agar kompatibel dengan middleware Laravel
      const formData = new FormData();
      formData.append('name', formValues.name);
      formData.append('category_product_id', String(formValues.category_product_id));
      formData.append('price', String(formValues.price));
      
      /**
       * PENTING: Laravel terkadang sulit membaca request PUT secara langsung via FormData.
       * Kita mengirim request sebagai POST namun disamarkan menjadi PUT.
       */
      formData.append('_method', 'PUT'); 
  
      const response = await serviceUpdate('product', formData, id);
  
      if (response.error) {
        if (response.message === 'Token has expired') {
          Cookies.remove('token');
          router.push('/');
        } else {
          // Menangani error validasi (jika response.message berupa object dari Laravel)
          if (typeof response.message === 'object') {
            Object.entries(response.message).forEach(([key, value]) => {
              toast.error(Array.isArray(value) ? value[0] : String(value));
              setIsError((prev) => ({ ...prev, [key]: true }));
            });
          } else {
            toast.error(response.message || 'Gagal memperbarui produk');
          }
        }
      } else {
        toast.success('Produk berhasil diperbarui');
        router.push('/product'); 
        // Memaksa refresh agar data di tabel produk terbaru muncul
        setTimeout(() => router.refresh(), 500);
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (fetching) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '400px', gap: 2 }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Memuat data produk...</p>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-black text-2xl font-bold">Edit Product</h1>
        <p className="text-gray-500">Sesuaikan informasi produk dan simpan perubahan.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-4">
          
          <TextField
            error={!!isError.name}
            helperText={isError.name ? "Nama wajib diisi" : ""}
            onChange={handleChange}
            name="name"
            label="Product Name"
            variant="standard"
            fullWidth
            value={formValues.name}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            error={!!isError.price}
            helperText={isError.price ? "Harga harus berupa angka" : ""}
            onChange={handleChange}
            name="price"
            label="Price"
            type="number"
            variant="standard"
            fullWidth
            value={formValues.price}
            InputLabelProps={{ shrink: true }}
          />

          <FormControl variant="standard" fullWidth error={!!isError.category_product_id}>
            <InputLabel id="category-label" shrink>Category</InputLabel>
            <Select
              labelId="category-label"
              name="category_product_id"
              value={formValues.category_product_id}
              onChange={handleChange}
              label="Category"
            >
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled value="">Tidak ada kategori</MenuItem>
              )}
            </Select>
            {isError.category_product_id && <FormHelperText>Pilih kategori terlebih dahulu</FormHelperText>}
          </FormControl>
        </div>

        <div className="flex justify-end gap-3 mt-12">
          <Button 
            variant="outlined" 
            color="inherit" 
            onClick={() => router.push('/product')}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isLoading}
            className="px-8"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </Layout>
  );
}