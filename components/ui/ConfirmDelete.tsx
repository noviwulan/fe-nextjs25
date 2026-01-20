'use client';

import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function ConfirmDelete({ isOpen, onClose, hrefDelete, id, name, refresh }: any) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!id) {
      toast.error("ID tidak ditemukan!");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Cara ambil token paling simpel di Client Side
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      // 2. Susun URL (Sesuaikan dengan route Laravel kamu)
      // Jika route-mu tidak pakai /api/v1, hapus bagian itu
      const fullUrl = `${baseUrl}/api/v1/${hrefDelete}/${id}`;

      console.log("Menghapus ke:", fullUrl);

      const response = await axios.delete(fullUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200 || response.status === 204) {
        toast.success(`Berhasil menghapus ${name}`);
        if (refresh) refresh(); 
        onClose();
      }
    } catch (error: any) {
      console.error("Detail Error:", error.response);
      const pesan = error.response?.data?.message || "Gagal menghapus data.";
      toast.error(pesan);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Konfirmasi Hapus</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Yakin ingin hapus <b>{name}</b>? <br/>
          <small className="text-gray-400">ID: {id}</small>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>Batal</Button>
        <Button 
          onClick={handleDelete} 
          color="error" 
          variant="contained" 
          disabled={isLoading}
        >
          {isLoading ? "Proses..." : "Ya, Hapus"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}