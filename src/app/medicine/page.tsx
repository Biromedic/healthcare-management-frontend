"use client";

import { useState, useEffect } from 'react';
import { TextField, Container, Typography, Box, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import { apiClient } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';


type Medicine = {
    id: number;
    name: string;
    price: number;
  };
  
  export default function MedicineSearch() {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    useEffect(() => {
        const searchMedicines = async () => {
            if (searchTerm.length < 2) return;
            
            try {
                setLoading(true);
                setError('');
                const response = await apiClient.get(`/medicines/v1/search?query=${searchTerm}`);
                setMedicines(response.data);
            } catch (err) {
                setError('Failed to fetch medicine data');
            } finally {
                setLoading(false);
            }
        };
  
        const debounceTimer = setTimeout(searchMedicines, 500);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    return (
        <>
        <Navbar />
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Medicine Search
            </Typography>

            <TextField
                fullWidth
                variant="outlined"
                label="Search by medicine name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
            />

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'primary.main' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white' }}>Medicine Name</TableCell>
                                <TableCell sx={{ color: 'white' }}>Price ($)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {medicines.map((medicine) => (
                                <TableRow key={medicine.id}>
                                    <TableCell>{medicine.name}</TableCell>
                                    <TableCell>${medicine.price.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {medicines.length === 0 && !loading && (
                <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
                    {searchTerm ? 'No results found' : 'Enter at least 2 characters to search'}
                </Typography>
            )}
        </Container>
        </>
    );
}