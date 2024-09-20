import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import validation from './validacionR';
import '../../login.css';
import axios from 'axios';
import Reserva from '../../class/reserva';
import ctg_tpser from '../../class/ctg_tpservi';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const defaultTheme = createTheme();

export default function Rreserva() {
    const [reserva, setReserva] = useState(new Reserva('', '', '', null, null));
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
    const [availabilityMessage, setAvailabilityMessage] = useState('');
    const currentDate = dayjs();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedHour, setSelectedHour] = useState('');
    const [validHours, setValidHours] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [clients, setClients] = useState([]);
    const [selectedVehiculo, setSelectedVehiculo] = useState(null);
    const [vehiculos, setVehiculos] = useState([]);
    const [selectedEmplea, setSelectedEmplea] = useState(null);
    const [emplea, setEmplea] = useState([]);
    const [selectedTpser, setSelectedTpser] = useState(null);
    const [tpser, setTpser] = useState([]);
    const [precio, setPrecio] = useState('');
    const [ctservicio, setCtservicio] = useState(new ctg_tpser());
    const [searchTerm, setSearchTerm] = useState('');

    const maxiDate = currentDate.add(30, 'day');
    //const miniDate = currentDate.startOf('year');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const handleCloseNotification = () => {
        setOpenNotification(false);
    };

    const handleHourChange = (event) => {
        setSelectedHour(event.target.value);
        setReserva(prevReserva => ({
            ...prevReserva,
            hora_reserva: event.target.value
        }));
    };

    // Obtener vehículos asociados al cliente seleccionado
    const handleClientChange = async (event, newValue) => {
        setSelectedClient(newValue);
        if (newValue) {
            setReserva(prevReserva => ({
                ...prevReserva,
                fk_id_cliente: newValue.value
            }));
            console.log("Valor seleccionado en cliente:", newValue.value);
            try {
                const response = await axios.get(`http://localhost:8081/rreserva/cliente/${newValue.value}/vehiculos`);
                setVehiculos(response.data);
            } catch (error) {
                console.error('Error al obtener vehículos del cliente:', error);
            }
        }
    };

    //ClienteVehiculo
    const handleVehiculoChange = async (event, newValue) => {
        setSelectedVehiculo(newValue);
        if (newValue) {
            setReserva(prevReserva => ({
                ...prevReserva,
                fk_id_vehiculo: newValue.value
            }));
            console.log("Valor seleccionado en vehículo:", newValue.value);
            try {
                const response = await axios.get(`http://localhost:8081/rreserva/tpservi/${newValue.value}/consulta`);
                setTpser(response.data);
            } catch (error) {
                console.error('Error al obtener tipos de servicio del vehículo:', error);
            }
        }
    };
    const handleTpserv = async (event, newValue) => {
        setSelectedTpser(newValue);        
        if (newValue && selectedVehiculo) {
            try {
                const responseVehiculo = await axios.get(`http://localhost:8081/rreserva/id-categoria/${selectedVehiculo.value}`);
                const idCategoriaVehiculo = responseVehiculo.data.id_catvehiculo;
                console.log("ID de la categoría del vehículo:", idCategoriaVehiculo);
                console.log("id tpservicio",newValue.value);
                const responsePrecio = await axios.get(`http://localhost:8081/rreserva/precio-servicio/${newValue.value}/${idCategoriaVehiculo}/consulta`);
                const { precio } = responsePrecio.data;
                setPrecio(precio); 
                setCtservicio(new ctg_tpser(idCategoriaVehiculo, newValue.value));
            } catch (error) {
                console.error('Error al calcular el precio del servicio:', error);
            }
        }
    };
    

    //seleccionar empleados
    const handleEmpleaChange = (event, newValue) => {
        setSelectedEmplea(newValue);
        if (newValue) {
            setReserva(prevReserva => ({
                ...prevReserva,
                fk_id_empleado: newValue.value
            }));
            console.log("Valor seleccionado en empleado:", newValue.value);
        }
    };

    //clientes
    const handleClientInputChange = (event, value) => {
        setSearchTerm(value);
    };

    useEffect(() => {
        const fetchClients = async (searchTerm) => {
            try {
                const response = await axios.get(`http://localhost:8081/rvehiculo/cliente?search=${searchTerm}`);
                setClients(response.data);
            } catch (error) {
                console.error('Error al obtener clientes:', error);
            }
        };

        if (searchTerm) {
            fetchClients(searchTerm);
        } else {
            setClients([]);  // Clear the clients list if search term is empty
        }
    }, [searchTerm]);


    //empleados
    useEffect(() => {
        const fetchEmplea = async () => {
            try {
                const response = await axios.get('http://localhost:8081/rreserva/empleado');
                setEmplea(response.data);
            } catch (error) {
                console.error('Error al obtener empleados:', error);
            }
        };

        fetchEmplea();
    }, []);

    useEffect(() => {
        if (submitted) {
            const errors = validation(reserva, selectedDate, selectedClient, selectedVehiculo, selectedEmplea, selectedTpser );
            setErrors(errors);
        }
    }, [reserva, selectedDate, selectedClient, selectedVehiculo, selectedEmplea, selectedTpser, submitted]);
    
    const handleDateChange = (date) => {
        setSelectedDate(date);
        setReserva(prevReserva => ({
            ...prevReserva,
            fecha_reserva: date
        }));

        // Calcular la Hora
        const currentHour = dayjs().hour();
        const availableHours = [];
        for (let i = 8; i <= 17; i++) {
            if (date.isSame(dayjs(), 'day') && i <= currentHour) {
                continue;
            }
            availableHours.push(i);
        }
        setValidHours(availableHours);
        setSelectedHour('');
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitted(true);
    
        try {
            const response = await axios.post('http://localhost:8081/rreserva/verificar', {
                fk_id_empleado: selectedEmplea.value,
                fecha_reserva: selectedDate,
                hora_reserva: selectedHour
            });
    
            const { message } = response.data;
    
            if (message === "Empleado disponible") {
                const noHayErrores = Object.keys(errors).length === 0;
    
                if (noHayErrores) {
                    const formattedDate = reserva.fecha_reserva ? reserva.fecha_reserva.toISOString().split('T')[0] : null;
                    const reservaToSend = { 
                        ...reserva,
                        fecha_reserva: formattedDate,
                        fk_id_catevehiculo: ctservicio.fk_id_catvehiculo, 
                        fk_id_tiposer: ctservicio.fk_id_tiposer 
                    };
                    const res = await axios.post('http://localhost:8081/rreserva/registro', reservaToSend);
                    const message = res.data.message;
    
                    if (message === "Registro de reserva exitoso") {
                        setOpenNotification(true);
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    } else {
                        console.error("Error en la respuesta del servidor:", message);
                    }
                } else {
                    console.error("No se puede enviar la solicitud debido a errores en la validación del formulario.");
                }
            } else {
                // Si el empleado no está disponible, muestra un mensaje de error
                setAvailabilityMessage(message);
            }
        } catch (error) {
            console.error("Error al verificar disponibilidad:", error);
        }
    };
    
    return (
        <div className="logo-background">
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className="form-container">
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                            <EditCalendarIcon />
                        </Avatar>
                        <Typography component="h2" variant="h7">
                            REGISTRAR RESERVA
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <Grid container spacing={1}>
                                <Grid item xs={4}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            inputFormat="YYYY/MM/DD"
                                            label="Fecha Reserva"
                                            selected={selectedDate}
                                            onChange={handleDateChange}
                                            maxDate={maxiDate}
                                            minDate={currentDate}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={4}>
                                    <Autocomplete
                                        value={selectedClient}
                                        onChange={(event, newValue) => handleClientChange(event, newValue)}
                                        inputValue={searchTerm}
                                        onInputChange={handleClientInputChange}
                                        options={clients}
                                        getOptionLabel={(option) => option.name || `${option.cc_persona} ${option.nombre} ${option.apellido}`}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                required
                                                label="Cliente"
                                                variant="outlined"
                                                error={!!errors.selectedClient}
                                                helperText={errors.selectedClient}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <Autocomplete
                                        value={selectedVehiculo}
                                        onChange={(event, newValue) => handleVehiculoChange(event, newValue)}
                                        options={vehiculos}
                                        //(solo placa)getOptionLabel={(option) => option.placa} 
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Vehículo"
                                                variant="outlined"
                                                error={!!errors.selectedVehiculo}
                                                helperText={errors.selectedVehiculo}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        select
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="hora_reserva"
                                        label="Hora"
                                        value={selectedHour}
                                        onChange={handleHourChange}
                                        id="hora_reserva"
                                        autoComplete="hora_reserva"
                                        error={!!errors.hora_reserva}
                                        helperText={errors.hora_reserva}
                                    >
                                        {validHours.map((hour) => (
                                            <MenuItem key={hour} value={hour}>
                                                {hour === 12 ? "12 PM" : hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={4}>
                                    <Autocomplete
                                        value={selectedEmplea}
                                        onChange={(event, newValue) => handleEmpleaChange(event, newValue)}
                                        options={emplea}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                required
                                                label="Empleado"
                                                variant="outlined"
                                                error={!!errors.selectedEmplea}
                                                helperText={errors.selectedEmplea}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <Autocomplete
                                        value={selectedTpser}
                                        onChange={(event, newValue) => handleTpserv(event, newValue)}
                                        options={tpser}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                required
                                                label="Servicio"
                                                variant="outlined"
                                                error={!!errors.selectedTpser}
                                                helperText={errors.selectedTpser}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        label="Precio $"
                                        variant="outlined"
                                        value={precio}
                                        disabled
                                    />
                                </Grid>

                            </Grid>
                            <Grid item xs={4}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Registrar
                                </Button>
                                <Snackbar open={openNotification || !!availabilityMessage || (submitted && !selectedDate)} autoHideDuration={6000} onClose={handleCloseNotification}>
                                    <MuiAlert onClose={handleCloseNotification} severity={openNotification ? "success" : "error"} sx={{ width: '10000%' }}>
                                        {openNotification ? "Registro exitoso" : availabilityMessage ? availabilityMessage : "¡Debes seleccionar una fecha!"}
                                    </MuiAlert>
                                </Snackbar>

                            </Grid>
                        </Box>
                    </div>
                </Container>
            </ThemeProvider>
        </div >
    );
}