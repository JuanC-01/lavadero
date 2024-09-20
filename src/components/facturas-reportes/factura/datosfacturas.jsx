import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import '../../login.css';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { TableContainer, Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'; // Importar dayjs

const defaultTheme = createTheme();

export default function DatosFacturas() {
    const [facturasPagadas, setFacturasPagadas] = useState([]);
    const [facturasNoPagadas, setFacturasNoPagadas] = useState([]);
    const [openNotification, setOpenNotification] = useState(false);
    const [openErrorNotification, setOpenErrorNotification] = useState(false);
    const [selectedDateIni, setSelectedDateIni] = useState(null);
    const [selectedDateFin, setSelectedDateFin] = useState(null);

    const handleCloseNotification = () => {
        setOpenNotification(false);
    };
    const handleCloseErrorNotification = () => {
        setOpenErrorNotification(false);
        setFacturasPagadas([]);
        setFacturasNoPagadas([]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Formatear fechas a formato YYYY-MM-DD
        const formattedStartDate = selectedDateIni.format('YYYY-MM-DD');
        const formattedEndDate = selectedDateFin.format('YYYY-MM-DD');
        if (!selectedDateIni || !selectedDateFin) {
            console.error('Por favor seleccione las fechas.');
            setOpenNotification(true);
            setFacturasPagadas([]);
            setFacturasNoPagadas([]);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8081/factura/buscar-facturas/${formattedStartDate}/${formattedEndDate}`);
            setFacturasPagadas(response.data.facturasPagadas);
            setFacturasNoPagadas(response.data.facturasNoPagadas);
        } catch (error) {
            console.error('Error al obtener las facturas:', error);
            setOpenErrorNotification(true);
        }
    };

    return (
        <div className="table-consulta">
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className="table-container" style={{ marginTop: '100px' }}>
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                            <AppRegistrationIcon />
                        </Avatar>
                        <Typography component="h1" variant="h6">
                            REPORTE FACTURAS
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <Grid container spacing={1}>
                                <Grid item xs={4}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            inputFormat="YYYY/MM/DD"
                                            label="Fecha Incio"
                                            value={selectedDateIni}
                                            onChange={(date) => setSelectedDateIni(date)}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={4}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            inputFormat="YYYY/MM/DD"
                                            label="Fecha Fin"
                                            value={selectedDateFin}
                                            onChange={(date) => setSelectedDateFin(date)}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 0, mb: 2 }}
                                    >
                                        GENERERAR
                                    </Button>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} sx={{ marginTop: 4 }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Facturas Pagadas</TableCell>
                                                <TableCell align="right">Total</TableCell>
                                                <TableCell align="right">Método de Pago</TableCell> {/* Nuevo */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {facturasPagadas.map((factura, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{factura.ID_FACTURASER}</TableCell>
                                                    <TableCell align="right">{factura.VALOR_FACTURASER}</TableCell>
                                                    <TableCell align="right">{factura.NOMBRE_TIPOMETODOPAGO}</TableCell> {/* Nuevo */}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </Grid>

                            <Grid item xs={12} sx={{ marginTop: 4 }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Facturas No Pagadas</TableCell>
                                                <TableCell align="right">Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {facturasNoPagadas.map((factura, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{factura.ID_FACTURASER}</TableCell>
                                                    <TableCell align="right">{factura.VALOR_FACTURASER}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>

                            <Snackbar open={openNotification} autoHideDuration={6000} onClose={handleCloseNotification}>
                                <MuiAlert onClose={handleCloseNotification} severity="error" sx={{ width: '10000%' }}>
                                    Error, faltan datos
                                </MuiAlert>
                            </Snackbar>
                            <Snackbar open={openErrorNotification} autoHideDuration={6000} onClose={handleCloseErrorNotification}>
                                <MuiAlert onClose={handleCloseErrorNotification} severity="error" sx={{ width: '10000%' }}>
                                    No hay datos en las fechas seleccionadas
                                </MuiAlert>
                            </Snackbar>
                        </Box>
                    </div>
                </Container>
            </ThemeProvider>
        </div >
    );
}
