import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import validation from './loginva';
import axios from 'axios';
import './login.css';

const defaultTheme = createTheme();

export default function Login() {
    const [values, setValues] = useState({
        usuario_credenciales: '',
        contrasena_credenciales: ''
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
    const [availabilityMessage, setAvailabilityMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (submitted) {
            setErrors(validation(values));
        }
    }, [values, submitted]);

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleCloseNotification = () => {
        setOpenNotification(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
    
        if (!errors.usuario_credenciales && !errors.contrasena_credenciales) {
            axios.post('http://localhost:8081/login/', {
                usuario_credenciales: values.usuario_credenciales,
                contrasena_credenciales: values.contrasena_credenciales
            })
                .then(res => {
                    const message = res.data.message;
                    if (message === "Inicio Exitoso") {
                        // Almacena el token en el almacenamiento local
                        localStorage.setItem('token', res.data.token);
                        navigate('/home');
                    } else if (message === "Credenciales no activas" || message === "Usuario o Contraseña Incorrectos") {
                        setOpenNotification(true);
                        setAvailabilityMessage(message);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };
    
    return (
        <div className="login-background">
            <div className="login-container">
                <ThemeProvider theme={defaultTheme}>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <Box
                            className="login-container"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Iniciar Sesión
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="usuario_credenciales"
                                    label="Usuario"
                                    name="usuario_credenciales"
                                    autoComplete="usuario_credenciales"
                                    autoFocus
                                    onChange={handleInput}
                                    error={!!errors.usuario_credenciales}
                                    helperText={errors.usuario_credenciales}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="contrasena_credenciales"
                                    label="Contraseña"
                                    onChange={handleInput}
                                    type="password"
                                    id="contrasena_credenciales"
                                    autoComplete="contrasena_credenciales"
                                    error={!!errors.contrasena_credenciales}
                                    helperText={errors.contrasena_credenciales}
                                />
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Recordarme"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Iniciar Sesión
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                </ThemeProvider>
            </div>
            <Snackbar open={openNotification} autoHideDuration={6000} onClose={handleCloseNotification}>
                <MuiAlert onClose={handleCloseNotification} severity="error" sx={{ width: '10000%' }}>
                    {availabilityMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
}
