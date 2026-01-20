'use client';

import Layout from "@/components/ui/Layout";
import { service } from "@/services/services";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, IconButton } from "@mui/material";
import { toast } from "react-toastify";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ConfirmDelete from "@/components/ui/ConfirmDelete";
import Link from "next/link";
import { ProductType } from "@/services/data-types/product-type";

export default function Page() {
    const [isLoading, setIsLoading] = useState(false);
    const [rows, setRows] = useState<ProductType[]>([]);
    const apiEndpoint = "product";

    // State for deletion
    const [open, setOpen] = useState(false);
    const [selectedDelete, setSelectedDelete] = useState({
        id: "",
        category_product_id: 0,
        name: "",
        price: 0,
    });

    const handleClickOpen = (id: string, category_product_id: number, name: string, price: number) => {
        setSelectedDelete({ id: String(id), category_product_id, name, price });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedDelete({ 
            id: "", 
            category_product_id: 0, 
            name: "", 
            price: 0 
        });
    };

    // PERBAIKAN: Membungkus dengan useCallback dan memperbaiki syntax bracket yang double
    const getData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await service(`${apiEndpoint}?t=${new Date().getTime()}`);
            
            // Log untuk memastikan struktur
            console.log("Raw Response:", response);
    
            // SESUAI LOG ANDA: response.data.data adalah Array
            if (!response.error && Array.isArray(response.data?.data)) {
                const actualData = response.data.data;
    
                const rowsWithId = actualData.map((item: any, index: number) => ({
                    ...item,
                    // Pastikan id diambil dari item.id, jika tidak ada pakai index
                    id: item.id || index, 
                }));
    
                setRows(rowsWithId);
            } else {
                setRows([]);
            }
        } catch (error) {
            toast.error("Gagal memuat data produk");
        } finally {
            setIsLoading(false);
        }
    }, [apiEndpoint]);

    useEffect(() => {
        getData();
    }, [getData]);

    const columns: GridColDef[] = useMemo(
        () => [
            { field: "name", headerName: "Product Name", width: 250 },
            { 
                field: "price", 
                headerName: "Price", 
                width: 150,
                valueFormatter: (value) => {
                    if (!value) return "Rp 0";
                    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
                }
            },
            
                { 
                    field: "category_product", 
                    headerName: "Category", 
                    width: 180,
                    valueGetter: (value, row) => {
                      // 1. Cek apakah Laravel mengirimkan object relasi 'category_product'
                      if (row?.category_product?.name) {
                        return row.category_product.name;
                      }
                      // 2. Jika Laravel mengirimkan nama langsung di 'category_name' (tergantung query Anda)
                      if (row?.category_name) {
                        return row.category_name;
                      }
                      // 3. Jika hanya ada ID, tampilkan ID-nya daripada tulisan "No Category"
                      if (row?.category_product_id) {
                        return `ID: ${row.category_product_id}`;
                      }
                      return "No Category";
                    }
                  },
            {
                field: "action",
                headerName: "Action",
                width: 150,
                sortable: false,
                renderCell: (params) => (
                    <div className="flex gap-2">
                        <Link href={`/product/edit/${params.row.id}`}>
                            <IconButton size="small" color="primary">
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Link>
                        <IconButton
                            size="small"
                            onClick={() => handleClickOpen(
                                params.row.id, 
                                params.row.category_product_id, 
                                params.row.name, 
                                params.row.price || 0
                            )}
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
                <h1 className="text-black text-2xl font-bold">Products</h1>
                <Link href="/product/create">
                    <Button variant="contained">Add New</Button>
                </Link>
            </div>

            <div style={{ width: "100%" }}>
                <div className="flex justify-end mb-2">
                    <IconButton
                        onClick={getData}
                        disabled={isLoading}
                        aria-label="refresh"
                    >
                        <RefreshIcon className={isLoading ? "animate-spin" : ""} />
                    </IconButton>
                </div>
                <DataGrid
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
                    sx={{
                        bgcolor: 'white',
                        boxShadow: 1,
                        borderRadius: 2,
                        '& .MuiDataGrid-cell:focus': { outline: 'none' },
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