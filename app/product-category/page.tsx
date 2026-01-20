'use client';

import Layout from '@/components/ui/Layout';
import { service } from '@/services/services';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid'; // Pastikan @mui/x-data-grid terinstal
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';
import { Button, IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ConfirmDelete from '@/components/ui/ConfirmDelete';
import { ProductCategoryType } from '@/services/data-types/product-category-type';
import Link from 'next/link';

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState<ProductCategoryType[]>([]);
  const apiEndpoint = 'category-product';

  // State for deletion
  const [open, setOpen] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState({
    id: '',
    name: '',
  });

  const handleClickOpen = (id: string, name: string) => {
    setSelectedDelete({ id, name });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDelete({ id: '', name: '' });
  };

  // Gunakan useCallback agar fungsi stabil dan bisa dipakai di dependency useEffect
  const getData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Ditambahkan timestamp agar tidak terkena cache browser
      const response = await service(`${apiEndpoint}?t=${new Date().getTime()}`);
      
      console.log("Cek Response API:", response); 

      // Sesuai hasil log kamu: response.data.data
      if (!response.error && response.data && response.data.data) {
        const actualData = response.data.data; 

        // Mapping untuk memastikan setiap baris memiliki properti 'id' yang unik
        const rowsWithId = actualData.map((item: any, index: number) => ({
          ...item,
          id: item.id || index, 
        }));

        setRows(rowsWithId);
      } else {
        setRows([]); // Set kosong jika tidak ada data
      }
    } catch (error) {
      toast.error("Gagal memuat data ke tabel");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint]);

  useEffect(() => {
    getData();
  }, [getData]);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: 'Product Name', width: 200 },
      {
        field: 'action',
        headerName: 'Action',
        width: 150,
        renderCell: (params) => (
          <div className="flex gap-2">
            <Link href={`/product-category/edit/${params.row.id}`}>
              <IconButton size="small" color="primary">
                <EditIcon fontSize="small" />
              </IconButton>
            </Link>
            <IconButton
              size="small"
              onClick={() => handleClickOpen(params.row.id.toString(), params.row.name)}
            >
              <DeleteOutlineIcon fontSize="small" color="error" />
            </IconButton>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <Layout>
      <div className="flex w-full justify-between items-center my-4">
        <h1 className="text-black text-2xl font-bold">Product Category</h1>
        <Link href="/product-category/create">
          <Button variant="contained">Add New</Button>
        </Link>
      </div>

      <div style={{ width: '100%' }}>
        <div className="flex justify-end mb-2">
          <IconButton
            onClick={getData}
            disabled={isLoading}
            aria-label="refresh"
          >
            <RefreshIcon className={isLoading ? 'animate-spin' : ''} />
          </IconButton>
        </div>
        <MuiDataGrid
          loading={isLoading}
          rows={rows}
          columns={columns}
          autoHeight
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
        />
      </div>

      <ConfirmDelete
        isOpen={open}
        onClose={handleClose}
        hrefDelete={apiEndpoint}
        id={selectedDelete.id}
        name={selectedDelete.name}
        refresh={getData}
      />
    </Layout>
  );
}