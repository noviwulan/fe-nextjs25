'use client';

import Layout from "@/components/ui/Layout";
import { service } from "@/services/services";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, IconButton, Chip, Box } from "@mui/material";
import { toast } from "react-toastify";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ConfirmDelete from "@/components/ui/ConfirmDelete";
import Link from "next/link";

export default function ProductVariantPage() {
    // Gunakan any[] agar tidak error di setRows
    const [isLoading, setIsLoading] = useState(false);
    const [rows, setRows] = useState<any[]>([]);
    const apiEndpoint = "product-variant";

    // State untuk modal hapus
    const [open, setOpen] = useState(false);
    const [selectedDelete, setSelectedDelete] = useState({ id: "", name: "" });

    // Fungsi buka modal (Memastikan ID ada)
    const handleClickOpen = (id: any, name: string) => {
        if (!id) {
            toast.error("Data tidak memiliki ID valid!");
            return;
        }
        setSelectedDelete({ id: String(id), name });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedDelete({ id: "", name: "" });
    };

    const getData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Kita paksa tipe response-nya any agar bisa akses .data.data
            const response: any = await service(`${apiEndpoint}?t=${new Date().getTime()}`);
            
            // Ambil data array dari response
            const actualData = response?.data?.data || response?.data;

            if (actualData && Array.isArray(actualData)) {
                setRows(actualData);
            } else {
                setRows([]);
            }
        } catch (error) {
            toast.error("Gagal mengambil data varian");
        } finally {
            setIsLoading(false);
        }
    }, [apiEndpoint]);

    useEffect(() => {
        getData();
    }, [getData]);

    // Konfigurasi Kolom Sesuai Data Anda
    const columns: GridColDef[] = useMemo(
        () => [
            { 
                field: "product", 
                headerName: "Main Product", 
                width: 200,
                // Mengambil nama produk dari relasi (product.name)
                valueGetter: (value, row) => row?.product?.name || "-"
            },
            { 
                field: "name", 
                headerName: "Variant Name", 
                width: 150,
                renderCell: (params) => (
                    <Chip label={params.value} size="small" variant="outlined" color="primary" />
                )
            },
            {
                field: "price",
                headerName: "Price",
                width: 150,
                renderCell: (params) => (
                    <span className="font-medium">
                        {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                        }).format(params.value || 0)}
                    </span>
                )
            },
            { 
                field: "stock", 
                headerName: "Stock", 
                width: 100,
                renderCell: (params) => (
                    <span className={params.value < 5 ? "text-red-500 font-bold" : ""}>
                        {params.value} pcs
                    </span>
                )
            },
            {
                field: "action",
                headerName: "Action",
                width: 120,
                sortable: false,
                renderCell: (params) => (
                    <div className="flex gap-1">
                        <Link href={`/product-variant/edit/${params.row.id}`}>
                            <IconButton size="small" color="primary">
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Link>
                        <IconButton
                            size="small"
                            onClick={() => handleClickOpen(params.row.id, params.row.name)}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 4 }}>
                <h1 className="text-black text-2xl font-bold">Product Variants</h1>
                <Link href="/product-variant/create">
                    <Button variant="contained">Add New Variant</Button>
                </Link>
            </Box>

            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-end mb-4">
                    <IconButton onClick={getData} disabled={isLoading}>
                        <RefreshIcon className={isLoading ? "animate-spin" : ""} />
                    </IconButton>
                </div>
                
                <DataGrid
                    loading={isLoading}
                    rows={rows}
                    columns={columns}
                    autoHeight
                    disableRowSelectionOnClick
                    // Jika kolom ID di DB bukan bernama 'id', tambahkan baris di bawah ini:
                    // getRowId={(row) => row.id} 
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