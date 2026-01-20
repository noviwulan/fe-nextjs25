'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { signUpService } from '@/services/data-types/auth-service-type';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [token, setToken] = useState(Cookies.get('token') || '');
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push('/');
    }
  }, [token, router]);
  

  const [isError, setIsError] = useState<Record<string, boolean>>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIsError((prevError) => ({ ...prevError, [name]: false }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const submitData = new FormData(e.currentTarget);

      const response = await signUpService(submitData);
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
        toast.success(response.message);
        router.push('/login');
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
    <Box className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-8">
      <Card className="w-full max-w-lg bg-gray-800 text-white shadow-2xl border border-gray-700">
        <CardContent className="p-8">
          <Box className="flex flex-col items-center mb-8">
            <div className="bg-emerald-600 p-3 rounded-xl mb-4 shadow-lg shadow-emerald-500/20">
              <Person className="text-white text-3xl" />
            </div>
            <Typography
              variant="h4"
              className="font-bold text-white mb-2 text-center"
            >
              Create Account
            </Typography>
            <Typography variant="body2" className="text-gray-400 text-center">
              Join us to manage your product catalog efficiently
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                error={isError.name}
                onChange={handleChange}
                fullWidth
                label="Full Name"
                name="name"
                variant="standard"
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person className="text-gray-500" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiInput-root': {
                    color: 'white',
                    fontFamily: 'inherit',
                    '&:before': { borderBottomColor: '#374151' },
                    '&:hover:not(.Mui-disabled):before': {
                      borderBottomColor: '#10b981',
                    },
                    '&:after': { borderBottomColor: '#10b981' },
                  },
                  '& .MuiInput-input': {
                    color: 'black',
                  },
                  '& .MuiInputLabel-root': { color: '#9ca3af' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' },
                }}
              />

              <TextField
                error={isError.email}
                onChange={handleChange}
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                variant="standard"
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email className="text-gray-500" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiInput-root': {
                    color: 'white',
                    fontFamily: 'inherit',
                    '&:before': { borderBottomColor: '#374151' },
                    '&:hover:not(.Mui-disabled):before': {
                      borderBottomColor: '#10b981',
                    },
                    '&:after': { borderBottomColor: '#10b981' },
                  },
                  '& .MuiInput-input': {
                    color: 'black',
                  },
                  '& .MuiInputLabel-root': { color: '#9ca3af' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' },
                }}
              />

              <TextField
                error={isError.password}
                onChange={handleChange}
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                variant="standard"
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock className="text-gray-500" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                          className="text-gray-500"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiInput-root': {
                    color: 'white',
                    fontFamily: 'inherit',
                    '&:before': { borderBottomColor: '#374151' },
                    '&:hover:not(.Mui-disabled):before': {
                      borderBottomColor: '#10b981',
                    },
                    '&:after': { borderBottomColor: '#10b981' },
                  },
                  '& .MuiInput-input': {
                    color: 'black',
                  },
                  '& .MuiInputLabel-root': { color: '#9ca3af' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' },
                }}
              />

              <TextField
                error={isError.password_confirmation}
                onChange={handleChange}
                fullWidth
                label="Confirm Password"
                name="password_confirmation"
                type={showPassword ? 'text' : 'password'}
                variant="standard"
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock className="text-gray-500" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiInput-root': {
                    color: 'white',
                    fontFamily: 'inherit',
                    '&:before': { borderBottomColor: '#374151' },
                    '&:hover:not(.Mui-disabled):before': {
                      borderBottomColor: '#10b981',
                    },
                    '&:after': { borderBottomColor: '#10b981' },
                  },
                  '& .MuiInput-input': {
                    color: 'black',
                  },
                  '& .MuiInputLabel-root': { color: '#9ca3af' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' },
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                loading={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 py-3 text-lg font-bold shadow-lg shadow-emerald-500/30 normal-case rounded-xl transition-all duration-300 mt-4"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </Stack>
          </form>

          <Box className="mt-8 pt-6 border-t border-gray-700 text-center">
            <Typography variant="body2" className="text-gray-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}