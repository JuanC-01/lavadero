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

const defaultTheme = createTheme();

export default function EmpleadoReport() {
    const [tpservi, setTservi] = useState({ precioHora: '' });
    const [openNotification, setOpenNotification] = useState(false);
    const [openErrorNotification, setOpenErrorNotification] = useState(false);
    const [reservas, setReservas] = useState([]);
    const [selectedDateIni, setSelectedDateIni] = useState(null);
    const [selectedDateFin, setSelectedDateFin] = useState(null);

    const handleCloseNotification = () => {
        setOpenNotification(false);
    };
    const handleCloseErrorNotification = () => {
        setOpenErrorNotification(false);
        setReservas([]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Formatear fechas a formato YYYY-MM-DD
        const formattedStartDate = selectedDateIni.format('YYYY-MM-DD');
        const formattedEndDate = selectedDateFin.format('YYYY-MM-DD');
        if (!selectedDateIni || !selectedDateFin || !tpservi.precioHora) {
            console.error('Por favor seleccione las fechas y/o ingrese el precio por hora.');
            setOpenNotification(true);
            setReservas([]);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8081/factura/buscar-empleados/${formattedStartDate}/${formattedEndDate}/${tpservi.precioHora}`);
            setReservas(response.data.reserva);
        } catch (error) {
            console.error('Error al obtener el reporte de empleados:', error);
            setOpenErrorNotification(true);
        }
    };

    return (
        <div className="logo-background">
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className="form-container">
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                            <AppRegistrationIcon />
                        </Avatar>
                        <Typography component="h1" variant="h6">
                            REPORTE EMPLEADO
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
                                <Grid item xs={4}>
                                    <TextField
                                        type='number'
                                        label="Precio Hora"
                                        variant="outlined"
                                        onChange={(event) => setTservi({ ...tpservi, precioHora: event.target.value })}
                                    />
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
                                                <TableCell>Empleado</TableCell>
                                                <TableCell align="right">Cantidad Reservas</TableCell>
                                                <TableCell align="right">Valor semanal</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {reservas.map((reserva, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{reserva.Nombres_Empleado} {reserva.Apellidos_Empleado}</TableCell>
                                                    <TableCell align="right">{reserva.Cantidad_Reservas} </TableCell>
                                                    <TableCell align="right">{reserva.Valor_Semanal} </TableCell>
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
                                    No hay datos en las fechas seleccionada
                                </MuiAlert>
                            </Snackbar>
                        </Box>
                    </div>
                </Container>
            </ThemeProvider>
        </div >
    );
}
