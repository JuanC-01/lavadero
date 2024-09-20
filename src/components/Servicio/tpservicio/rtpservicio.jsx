import React, { useState, useEffect } from 'react';
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
import validation from '../validacionP';
import axios from 'axios';
import '../../login.css';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Tpserv from '../../class/tpservicio';
import { Textarea } from '../textarea';
import Autocomplete from '@mui/material/Autocomplete';

const defaultTheme = createTheme();

export default function Tpservicio() {
  const [tpservi, setTservi] = useState(new Tpserv());
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [openErrorNotification, setOpenErrorNotification] = useState(false);
  const [Tvehi, setTvehi] = useState([]);
  const [selectedTvehi, setSelectedTvehi] = useState(null);


  const handleCloseNotification = () => {
    setOpenNotification(false);
  };
  const handleCloseErrorNotification = () => {
    setOpenErrorNotification(false);
  };

  useEffect(() => {
    if (submitted) {
      setErrors(validation(tpservi, selectedTvehi));
    }
  }, [tpservi, selectedTvehi, submitted]);

  useEffect(() => {
    const fetchTvehi = async () => {
      try {
        const response = await axios.get('http://localhost:8081/tpservicio/ctpvehiculo');
        setTvehi(response.data);
      } catch (error) {
        console.error('Error al obtener Tipo de Vehiculo:', error);
      }
    };
    fetchTvehi();
  }, []);

  const handleTvehi = (event, newValue) => {
    setSelectedTvehi(newValue);
    if (newValue) {
      const tipoVehiculo = newValue.value;
      setTservi(prevTpservi => ({
        ...prevTpservi,
        tipo_vehiculo: tipoVehiculo,
        estado_tiposer: tipoVehiculo === 1 ? 'V' : tipoVehiculo === 2 ? 'M' : prevTpservi.estado 
      }));
      console.log("Valor seleccionado en tipo_vehiculo:", tipoVehiculo);
    }
  };
  

  const handleInput = (event) => {
    setTservi(prevTpservi => ({
      ...prevTpservi,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    const noHayErrores = Object.keys(errors).length !== 0;

    if (noHayErrores) {
      console.log("Datos a enviar:", tpservi);
      axios.post('http://localhost:8081/tpservicio/registro', tpservi)
        .then(res => {
          const message = res.data.message;
          if (message === "Registro tpservico exitoso") {
            setOpenNotification(true);
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            console.error("Error en la respuesta del servidor:", message);
          }
        })
        .catch(err => {
          setOpenErrorNotification(true);
          console.error("Error en la solicitud:", err);
        });
    } else {
      console.error("No se puede enviar la solicitud debido a errores en la validación del formulario.");
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
              REGISTRAR NUEVO TIPO SERVICIO
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="nombre_tiposer"
                    label="Tipo Servicio"
                    onChange={handleInput}
                    id="nombre_tiposer"
                    autoComplete="nombre_tiposer "
                    error={!!errors.nombre_tiposer}
                    helperText={errors.nombre_tiposer}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    required
                    margin="normal"
                    fullWidth
                    name="valor_tiposer"
                    type="number"
                    label="Valor($)"
                    onChange={handleInput}
                    id="valor_tiposer"
                    autoComplete="valor_tiposer"
                    error={!!errors.valor_tiposer}
                    helperText={errors.valor_tiposer}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Textarea
                    required
                    name="descripcion_tiposer"
                    label="descripcion_tiposer"
                    placeholder="Descripcion"
                    onChange={handleInput}
                    id="descripcion_tiposer"
                    autoComplete="descripcion_tiposer"
                    maxLength={100}
                    error={!!errors.descripcion_tiposer}
                    helperText={errors.descripcion_tiposer}
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
                <Snackbar open={openErrorNotification} autoHideDuration={6000} onClose={handleCloseErrorNotification}>
                  <MuiAlert onClose={handleCloseErrorNotification} severity="error" sx={{ width: '10000%' }}>
                    Error, Faltan Datos
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
