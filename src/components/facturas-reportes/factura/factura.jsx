import React, { useState, useEffect } from 'react';
import { Typography, TextField, TableContainer, Table, TableHead, TableBody, TableCell, TableRow, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import PagoModal from './modalPago';
import metodopago from '../../class/metodopago';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Factura = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [customer, setCustomer] = useState({});
    const [services, setServices] = useState([]);
    const [additionalProducts, setAdditionalProducts] = useState([]);
    const [totalFactura, setTotalFactura] = useState(0);
    const [idFactura, setIdFactura] = useState(null);
    const [isPagoModalOpen, setPagoModalOpen] = useState(false);
    const [selectedmetoPago, setSelectedmetoPago] = useState(null);
    const [metoPago, setMetodoP] = useState([]);
    const [rmetodopago, setRMetodopago] = useState(new metodopago(null, null));
    const [notificationSeverity, setNotificationSeverity] = useState('success');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [openNotification, setOpenNotification] = useState(false);
    let timer;

    const handleDateChange = (date) => {
        setSelectedDate(date);
        fetchReservations(date, searchText);
    };

    const handleCloseNotification = () => {
        setOpenNotification(false);
    };

    const delayedSearch = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fetchReservations(selectedDate, searchText);
        }, 500); 
    };

    useEffect(() => {
        if (searchText) {
            delayedSearch();
        } else {
            setIdFactura(null);
            setCustomer({});
            setServices([]);
            setAdditionalProducts([]);
            setTotalFactura(0);
        }
    }, [searchText, selectedDate]);

    const handlePagoModalOpen = () => {
        setRMetodopago(prevmetodopa => ({
            ...prevmetodopa,
            fk_id_facturaser: idFactura
        }));
        console.log("ID de la factura:", idFactura);
        setPagoModalOpen(true);
    };
    
    const handlePagoModalClose = () => {
        setPagoModalOpen(false);
    };

    useEffect(() => {
        const fetchMetodopago = async () => {
            try {
                const response = await axios.get('http://localhost:8081/factura/tp-metodopago');
                setMetodoP(response.data);
            } catch (error) {
                console.error('Error al obtener empleados:', error);
            }
        };
        fetchMetodopago();
    }, []);

    const handleMetodoP = (event, newValue) => {
        setSelectedmetoPago(newValue);
        if (newValue) {
            setRMetodopago(prevmetodopa => ({
                ...prevmetodopa,
                fk_id_tipometodopago: newValue.value
            }));
            console.log("Valor seleccionado metodopago:", newValue.value);
        }
    };

    const handleSave = async () => {
        try {
            const response = await axios.post('http://localhost:8081/factura/registrar-metodopago', {
                fk_id_tipometodopago: rmetodopago.fk_id_tipometodopago,
                fk_id_facturaser: idFactura,
            });
            const message = response.data.message;
            if (message === "Registro metodopago exitoso") {
                setOpenNotification(true);
                setNotificationSeverity('success');
                setNotificationMessage('Método de pago registrado');
                delayedSearch();
            } else {
                console.error("Error en la respuesta del servidor:", message);
            }
        } catch (error) {
            console.error('Error al registrar método de pago:', error);
        }
    };

    const fetchReservations = (date, placaVehiculo) => {
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(date.getTime() - offset)).toISOString().split('T')[0];
        axios.get(`http://localhost:8081/factura/buscar-datos/${localISOTime}/${placaVehiculo}`)
            .then(response => {
                const data = response.data;
                setIdFactura(data.idFactura);
                setCustomer(data.cliente);
                setServices(data.servicios);
                setAdditionalProducts(data.productosAdicionales);
                setTotalFactura(data.totalFactura);
            })
            .catch(error => {
                console.error('Error al obtener los datos de las reservas:', error);
            });
    };
    return (
        <div className="table-consulta">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label="Fecha Reserva"
                    value={selectedDate}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} style={{ marginBottom: 16 }} />}
                />
            </LocalizationProvider>
            <TextField
                label="Placa Vehiculo"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <SearchIcon style={{ marginRight: 8, color: 'rgba(0, 0, 0, 0.60)' }} />
                    ),
                }}
                style={{ marginRight: '16px', marginBottom: '16px' }}
            />

            <Typography component="h1" variant="h6">
                FACTURA N° {idFactura}
            </Typography>

            <div className="table-container" style={{ marginTop: '100px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', marginBottom: '8px' }}>
                        <Typography variant="subtitle1" gutterBottom style={{ marginRight: '16px' }}>
                            Cliente: {customer.NOMBRES_CLIENTE} {customer.APELLIDOS_CLIENTE}
                        </Typography>
                    </div>
                    <div style={{ display: 'flex', marginBottom: '15px' }}>
                        <Typography variant="subtitle1" gutterBottom style={{ marginRight: '400px' }}>
                            Vehículo: {customer.PLACA_VEHICULO}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom style={{ marginRight: '400px' }}>
                            Tipo de vehículo: {customer.NOMBRE_TIPOVEHI}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom style={{ marginRight: '200px' }}>
                            Categoría de vehículo: {customer.NOMBRE_CATVEHICULO}
                        </Typography>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <Typography variant="subtitle1" gutterBottom style={{ marginRight: '16px' }}>
                            Empleado servicio: {customer.NOMBRES_EMPLEADO} {customer.APELLIDOS_EMPLEADO}
                        </Typography>
                    </div>
                </div>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Producto/Servicio</TableCell>
                                <TableCell align="right">Precio Unitario</TableCell>
                                <TableCell align="right">Cantidad</TableCell>
                                <TableCell align="right">Precio Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {services.map((service, index) => (
                                <TableRow key={index}>
                                    <TableCell>{service.NOMBRE_TIPOSERVICIO}</TableCell>
                                    <TableCell align="right">{service.VALOR_SERVICIO}</TableCell>
                                    <TableCell align="right">1</TableCell>
                                    <TableCell align="right">{service.VALOR_SERVICIO}</TableCell>
                                </TableRow>
                            ))}
                            {additionalProducts.map((product, index) => (
                                <TableRow key={index}>
                                    <TableCell>{product.NOMBRE_PRODUCTOADD}</TableCell>
                                    <TableCell align="right">{product.PRECIO_PRODUCTOADD}</TableCell>
                                    <TableCell align="right">{product.CANTIDAD_SERVPROADD}</TableCell>
                                    <TableCell align="right">{product.COSTO_SERVPROADD}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                    Total a Pagar: ${totalFactura}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePagoModalOpen}
                    style={{ marginTop: '20px' }}
                >
                    Pagar
                </Button>
                <PagoModal
                    isOpen={isPagoModalOpen}
                    onClose={handlePagoModalClose}
                    onSave={handleSave}
                    handleMetodoP={handleMetodoP}
                    selectedmetoPago={selectedmetoPago}
                    metoPago={metoPago}
                    totalFactura={totalFactura}
                />
            </div>
            <Snackbar open={openNotification} autoHideDuration={6000} onClose={handleCloseNotification}>
                <MuiAlert onClose={handleCloseNotification} severity={notificationSeverity} sx={{ width: '100%' }}>
                    {notificationMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};

export default Factura;
