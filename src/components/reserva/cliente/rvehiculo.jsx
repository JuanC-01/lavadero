import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import validation from './validacioncl';
import '../../login.css';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Vehiculo from '../../class/vehiculo';

const defaultTheme = createTheme();

export default function Rvehiculo() {

    const [vehiculo, setVehiculo] = useState(new Vehiculo());
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
    const [openErrorNotification, setOpenErrorNotification] = useState(false);
    const [availabilityEMessage, setAvailabilityEMessage] = useState('');
    const [selectedTvehi, setSelectedTvehi] = useState(null);
    const [Tvehi, setTvehi] = useState([]);
    const [selectedTvehiId, setSelectedTvehiId] = useState(null);
    const [selectedCvehi, setSelectedCvehi] = useState(null);
    const [Cvehi, setCvehi] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleCloseNotification = () => {
        setOpenNotification(false);
    };
    const handleCloseErrorNotification = () => {
        setOpenErrorNotification(false);
    };
    //Tipo y Categoria vehiculo
    const handleTvehi = (event, newValue) => {
        setSelectedTvehi(newValue);
        if (newValue) {
            setSelectedTvehiId(newValue.value);
            console.log("Valor seleccionado en tipo_vehiculo:", newValue.value);
        }
    };

    const handleCvehi = (event, newValue) => {
        setSelectedCvehi(newValue);
        if (newValue) {
            setVehiculo(prevVehiculo => ({
                ...prevVehiculo,
                fk_id_catvehi: newValue.value
            }));
            console.log("Valor seleccionado en categoria vehiculo:", newValue.value);
        }
    };
    //Cliente
    const handleClientChange = (event, newValue) => {
        setSelectedClient(newValue);
        if (newValue) {
            setVehiculo(prevVehiculo => ({
                ...prevVehiculo,
                fk_id_cliente: newValue.value
            }));
            console.log("Valor seleccionado en cliente:", newValue.value);
        }
    };

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

    useEffect(() => {
        if (selectedTvehiId) {
            fetchCvehi(selectedTvehiId);
        }
    }, [selectedTvehiId]);

    useEffect(() => {
        const fetchTvehi = async () => {
            try {
                const response = await axios.get('http://localhost:8081/rvehiculo/ctpvehiculo');
                setTvehi(response.data);
            } catch (error) {
                console.error('Error al obtener Tipo de Vehiculo:', error);
            }
        };
        fetchTvehi();
    }, []);

    const fetchCvehi = async (selectedTvehiId) => {
        try {
            const response = await axios.get(`http://localhost:8081/rvehiculo/catvehiculo/${selectedTvehiId}/tvehiculo`);
            setCvehi(response.data);
        } catch (error) {
            console.error('Error al obtener categorías de vehículos:', error);
        }
    };

    useEffect(() => {
        if (submitted) {
            setErrors(validation(vehiculo, selectedClient, selectedTvehi, selectedCvehi));
        }
    }, [vehiculo, selectedClient, selectedTvehi, selectedCvehi, submitted]);

    const handleInput = (event) => {
        setVehiculo(prevVehiculo => ({
            ...prevVehiculo,
            [event.target.name]: event.target.value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
        const noHayErrores = Object.keys(errors).length !== 0;
        if (noHayErrores) {
            console.log("Datos a enviar:", vehiculo);
            axios.post('http://localhost:8081/rvehiculo/registrar', vehiculo)
                .then(res => {
                    const message = res.data.message;
                    const actions = {
                        "Placa se encuentra Registrada": () => {
                            setAvailabilityEMessage(message);
                            setTimeout(() => {
                                setAvailabilityEMessage('');
                            }, 2000);
                        },
                        "Registro vehiculo exitoso": () => {
                            setOpenNotification(true);
                            setTimeout(() => {
                                window.location.reload();
                            }, 1500);
                        },
                        "default": () => {
                            console.error("Error en la respuesta del servidor:", message);
                        }
                    };

                    const action = actions[message] || actions["default"];
                    action();
                })
                .catch(err => {
                    console.error("Error en la solicitud:", err);
                    setOpenErrorNotification(true);
                });
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
                        <Typography component="h2" variant="h7">
                            DATOS DEL VEHICULO
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <Grid container spacing={1}>
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
                                        value={selectedTvehi}
                                        onChange={(event, newValue) => handleTvehi(event, newValue)}
                                        options={Tvehi}
                                        renderInput={(params) => (
                                            <TextField {...params}
                                                label="Tipo Vehiculo"
                                                variant="outlined"
                                                error={!!errors.selectedTvehi}
                                                helperText={errors.selectedTvehi}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <Autocomplete
                                        value={selectedCvehi}
                                        onChange={(event, newValue) => handleCvehi(event, newValue)}
                                        options={Cvehi || []}
                                        renderInput={(params) => (
                                            <TextField {...params}
                                                label="Categoria Vehiculo"
                                                variant="outlined"
                                                error={!!errors.selectedCvehi}
                                                helperText={errors.selectedCvehi}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="placa_vehiculo"
                                        label="Placa (ABC-000)"
                                        onChange={handleInput}
                                        id="placa_vehiculo"
                                        autoComplete="placa_vehiculo"
                                        error={!!errors.placa_vehiculo}
                                        helperText={errors.placa_vehiculo}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="marca_vehiculo"
                                        label="Marca"
                                        onChange={handleInput}
                                        id="marca_vehiculo"
                                        autoComplete="marca_vehiculo"
                                        error={!!errors.marca_vehiculo}
                                        helperText={errors.marca_vehiculo}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="modelo_vehiculo"
                                        label="Modelo"
                                        onChange={handleInput}
                                        id="modelo_vehiculo"
                                        autoComplete="modelo_vehiculo"
                                        error={!!errors.modelo_vehiculo}
                                        helperText={errors.modelo_vehiculo}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        margin="normal"
                                        fullWidth
                                        name="anio_vehiculo"
                                        label="Año Vehiculo"
                                        onChange={handleInput}
                                        id="anio_vehiculo"
                                        autoComplete="anio_vehiculo"
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        margin="normal"
                                        fullWidth
                                        name="estado_vehiculo"
                                        label="Estado"
                                        onChange={handleInput}
                                        id="estado_vehiculo"
                                        autoComplete="estado_vehiculo"
                                        error={!!errors.estado_vehiculo}
                                        helperText={errors.estado_vehiculo}
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
                                <Snackbar open={openNotification} autoHideDuration={6000} onClose={handleCloseNotification}>
                                    <MuiAlert onClose={handleCloseNotification} severity="success" sx={{ width: '10000%' }}>
                                        Registro exitoso
                                    </MuiAlert>
                                </Snackbar>
                                <Snackbar open={openErrorNotification || !!availabilityEMessage} autoHideDuration={6000} onClose={handleCloseErrorNotification}>
                                    <MuiAlert onClose={handleCloseErrorNotification} severity={openErrorNotification ? "error" : "error"} sx={{ width: '10000%' }}>
                                        {openErrorNotification ? "Error al registrar" : availabilityEMessage ? availabilityEMessage : "Placa se encuentra Registrada"}
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
