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
import ProAdd from '../../class/productoadd';
import { Textarea } from '../textarea';

const defaultTheme = createTheme();

export default function ProductoAdd() {
  const [prodadd, setProdadd] = useState(new ProAdd());
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [openErrorNotification, setOpenErrorNotification] = useState(false);


  const handleCloseNotification = () => {
    setOpenNotification(false);
  };
  const handleCloseErrorNotification = () => {
    setOpenErrorNotification(false);
  };

  useEffect(() => {
    if (submitted) {
      setErrors(validation(prodadd));
    }
  }, [prodadd, submitted]);



  const handleInput = (event) => {
    setProdadd(prevprodadd => ({
      ...prevprodadd,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    const noHayErrores = Object.keys(errors).length !== 0;

    if (noHayErrores) {
      console.log("Datos a enviar:", prodadd);
      axios.post('http://localhost:8081/productoadd/registro', prodadd)
        .then(res => {
          const message = res.data.message;
          if (message === "Registro de producto adicional exitoso") {
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
              REGISTRAR PRODUCTO ADICIONAL
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="nombre_productoadd"
                    label="Tipo Servicio"
                    onChange={handleInput}
                    id="nombre_productoadd"
                    autoComplete="nombre_productoadd "
                    error={!!errors.nombre_productoadd}
                    helperText={errors.nombre_productoadd}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    required
                    margin="normal"
                    fullWidth
                    name="precio_productoadd"
                    type="number"
                    label="Valor($)"
                    onChange={handleInput}
                    id="precio_productoadd"
                    autoComplete="precio_productoadd"
                    error={!!errors.precio_productoadd}
                    helperText={errors.precio_productoadd}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    required
                    margin="normal"
                    fullWidth
                    name="cantidad_productoadd"
                    type="number"
                    label="Stock"
                    onChange={handleInput}
                    id="cantidad_productoadd"
                    autoComplete="cantidad_productoadd"
                    error={!!errors.cantidad_productoadd}
                    helperText={errors.cantidad_productoadd}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Textarea
                    required
                    name="descripcion_productoadd"
                    label="descripcion_productoadd"
                    placeholder="Descripcion"
                    onChange={handleInput}
                    id="descripcion_productoadd"
                    autoComplete="descripcion_productoadd"
                    maxLength={130}
                    error={!!errors.descripcion_productoadd}
                    helperText={errors.descripcion_productoadd}
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
