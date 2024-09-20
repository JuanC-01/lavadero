import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Grid, MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import '../login.css';
import validation from '../validacionC';
import Empleado from '../class/empleado';

const defaultTheme = createTheme();

export default function Rempleado() {
  const [empleado, setEmpleado] = useState(new Empleado());
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [openErrorNotification, setOpenErrorNotification] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [availabilityEMessage, setAvailabilityEMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const currentYear = dayjs().year();
  const [cargoEsLavador, setCargoEsLavador] = useState(false);

  const minDate = dayjs('1960-01-01');
  const maxDate = dayjs(`${currentYear}-12-31`);

  const handleCloseNotification = () => {
    setOpenNotification(false);
  };
  const handleCloseErrorNotification = () => {
    setOpenErrorNotification(false);
  };

  const cargos = ['ADMINISTRADOR', 'RECEPCION', 'LAVADOR'];
  const [selectedCargo, setSelectedCargo] = useState('');

  const handleCargoChange = (event) => {
    const cargoSeleccionado = event.target.value;
    setSelectedCargo(cargoSeleccionado);
    setEmpleado((prevEmpleado) => ({
      ...prevEmpleado,
      cargo_empleado: cargoSeleccionado,
    }));
    setCargoEsLavador(cargoSeleccionado === 'LAVADOR');
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setEmpleado(prevEmpleado => ({
      ...prevEmpleado,
      fechanto_persona: date
    }));
  };

  useEffect(() => {
    if (submitted) {
      setErrors(validation(empleado));
    }
  }, [empleado, submitted]);

  const handleInput = (event) => {
    const { name, value } = event.target;
    const upperCaseValue = value.toUpperCase();
    setEmpleado(prevEmpleado => ({
      ...prevEmpleado,
      [name]: upperCaseValue
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    const noHayErrores = Object.keys(errors).length !== 0;

    if (noHayErrores) {
      console.log("Datos a enviar:", empleado);
      axios.post('http://localhost:8081/rempleado/registrar', empleado)
        .then(res => {
          const message = res.data.message;
          const actions = {
            "N° Documento ya se encuentra registrado": () => {
              setAvailabilityEMessage(message);
              setTimeout(() => {
                setAvailabilityEMessage('');
              }, 2000);
            },
            "Registro empleado exitoso": () => {
              setOpenNotification(true);
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            },
            "La persona es menor de 18 años": () => {
              setAvailabilityMessage(message);
              setTimeout(() => {
                setAvailabilityMessage('');
              }, 2000);
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
          <div className="form-containerE">
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <PersonAddIcon />
            </Avatar>
            <Typography component="h2" variant="h7">
              REGISTRAR EMPLEADO
            </Typography>
            <Typography component="h4" variant="h7">
              DATOS PERSONALES
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="cc_persona"
                    label="N° Documento"
                    value={empleado.cc_persona}
                    name="cc_persona"
                    type="number"
                    autoComplete="cc_persona"
                    autoFocus
                    onChange={handleInput}
                    error={!!errors.cc_persona}
                    helperText={errors.cc_persona}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="nombres_persona"
                    label="Nombres"
                    value={empleado.nombres_persona}
                    onChange={handleInput}
                    id="nombres_persona"
                    inputProps={{ maxLength: 40 }}
                    autoComplete="nombres_persona "
                    error={!!errors.nombres_persona}
                    helperText={errors.nombres_persona}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="apellidos_persona"
                    label="Apellidos"
                    value={empleado.apellidos_persona}
                    onChange={handleInput}
                    id="apellidos_persona"
                    inputProps={{ maxLength: 40 }}
                    autoComplete="apellidos_persona"
                    error={!!errors.apellidos_persona}
                    helperText={errors.apellidos_persona}
                  />
                </Grid>
                <Grid item xs={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      inputFormat="YYYY/MM/DD"
                      label="Fecha Nacimiento"
                      selected={selectedDate}
                      onChange={handleDateChange}
                      minDate={minDate}
                      maxDate={maxDate}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="telefono_persona"
                    label="Telefono"
                    type="number"
                    value={empleado.telefono_persona}
                    onChange={handleInput}
                    id="telefono_persona"
                    inputProps={{ maxLength: 10 }}
                    autoComplete="telefono_persona"
                    error={!!errors.telefono_persona}
                    helperText={errors.telefono_persona}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="correo_persona"
                    label="Correo"
                    type="email"
                    value={empleado.correo_persona}
                    onChange={handleInput}
                    id="correo_persona"
                    inputProps={{ maxLength: 45 }}
                    autoComplete="correo_persona"
                    error={!!errors.correo_persona}
                    helperText={errors.correo_persona}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="direccion_persona"
                    label="Dirección"
                    value={empleado.direccion_persona}
                    onChange={handleInput}
                    id="direccion_persona"
                    inputProps={{ maxLength: 45 }}
                    autoComplete="direccion_persona"
                    error={!!errors.direccion_persona}
                    helperText={errors.direccion_persona}
                  />
                </Grid>
              </Grid>
              <Typography component="h4" variant="h7">
                DATOS EMPLEADO
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <TextField
                    select
                    required
                    fullWidth
                    label="Cargo"
                    value={selectedCargo}
                    onChange={handleCargoChange}
                  >
                    {cargos.map((cargo) => (
                      <MenuItem key={cargo} value={cargo}>
                        {cargo}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="usuario_credenciales"
                    label="Usuario"
                    value={empleado.usuario_credenciales}
                    onChange={handleInput}
                    id="usuario_credenciales"
                    autoComplete="usuario_credenciales"
                    disabled={cargoEsLavador}
                    error={!!errors.usuario_credenciales}
                    helperText={errors.usuario_credenciales}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="contrasena_credenciales"
                    label="Contraseña"
                    value={empleado.contrasena_credenciales}
                    onChange={handleInput}
                    id="contrasena_credenciales"
                    autoComplete="contrasena_credenciales"
                    disabled={cargoEsLavador}
                    error={!!errors.contrasena_credenciales}
                    helperText={errors.contrasena_credenciales}
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

                <Snackbar open={openErrorNotification || !!availabilityEMessage} autoHideDuration={6000} onClose={handleCloseErrorNotification}>
                  <MuiAlert onClose={handleCloseErrorNotification} severity={openErrorNotification ? "error" : "error"} sx={{ width: '10000%' }}>
                    {openErrorNotification ? "Error al registrar" : availabilityEMessage ? availabilityEMessage : "La persona ya está registrada"}
                  </MuiAlert>
                </Snackbar>

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
