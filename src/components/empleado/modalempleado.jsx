import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';

export default function ModalEmpleado({ open, onClose, onSave, onCancel, editedEmployee, selectedDate, handleDateChange, editedFields, setEditedFields, errors }) {
    const minDate = dayjs('1960-01-01');
    const currentYear = dayjs().year();
    const maxDate = dayjs(`${currentYear}-12-31`);

    return (
        <div>
             <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 900,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <TextField
                                select
                                label="Estado"
                                value={editedFields.estado_empleado || ''}
                                onChange={(e) => {
                                    console.log("Nuevo estado seleccionado:", e.target.value);
                                    setEditedFields({ ...editedFields, estado_empleado: e.target.value });
                                }}
                                fullWidth
                            >
                                <MenuItem value="Activo">Activo</MenuItem>
                                <MenuItem value="Inactivo">Inactivo</MenuItem>
                            </TextField>

                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Nombres"
                                value={editedFields.nombres_persona || ''}
                                onChange={(e) => setEditedFields({ ...editedFields, nombres_persona: e.target.value.toUpperCase() })}
                                fullWidth

                                error={!!errors.nombres_persona}
                                helperText={errors.nombres_persona}

                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Apellidos"
                                value={editedFields.apellidos_persona || ''}
                                onChange={(e) => setEditedFields({ ...editedFields, apellidos_persona: e.target.value.toUpperCase() })}
                                fullWidth

                                error={!!errors.apellidos_persona}
                                helperText={errors.apellidos_persona}

                            />
                        </Grid>
                        <Grid item xs={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    inputFormat="YYYY/MM/DD"
                                    label="Fecha Nacimiento"
                                    selected={selectedDate || editedEmployee?.fechanto_persona}
                                    onChange={handleDateChange}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                />
                            </LocalizationProvider>

                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Teléfono"
                                value={editedFields.telefono_persona || ''}
                                onChange={(e) => setEditedFields({ ...editedFields, telefono_persona: e.target.value })}
                                fullWidth
                                error={!!errors.telefono_persona}
                                helperText={errors.telefono_persona}

                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Correo"
                                value={editedFields.correo_persona || ''}
                                onChange={(e) => setEditedFields({ ...editedFields, correo_persona: e.target.value.toUpperCase() })}
                                fullWidth
                                error={!!errors.correo_persona}
                                helperText={errors.correo_persona}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Dirección"
                                value={editedFields.direccion_persona || ''}
                                onChange={(e) => setEditedFields({ ...editedFields, direccion_persona: e.target.value.toUpperCase() })}
                                fullWidth
                                error={!!errors.direccion_persona}
                                helperText={errors.direccion_persona}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Usuario"
                                value={editedFields.usuario_credenciales || ''}
                                onChange={(e) => setEditedFields({ ...editedFields, usuario_credenciales: e.target.value.toUpperCase() })}
                                fullWidth
                                error={!!errors.usuario_credenciales}
                                helperText={errors.usuario_credenciales}
                                disabled={editedFields.cargo_empleado === 'LAVADOR'}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Contraseña"
                                value={editedFields.contrasena_credenciales || ''}
                                onChange={(e) => setEditedFields({ ...editedFields, contrasena_credenciales: e.target.value })}
                                fullWidth
                                error={!!errors.contrasena_credenciales}
                                helperText={errors.contrasena_credenciales}
                                disabled={editedFields.cargo_empleado === 'LAVADOR'}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                select
                                label="Cargo"
                                value={editedFields.cargo_empleado || ''}
                                onChange={(e) => setEditedFields({ ...editedFields, cargo_empleado: e.target.value })}
                                fullWidth
                            >
                                <MenuItem value="ADMINISTRADOR">Administrador</MenuItem>
                                <MenuItem value="RECEPCION">Recepcionista</MenuItem>
                                <MenuItem value="LAVADOR">Lavador</MenuItem>
                            </TextField>
                        </Grid>


                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                onSave();
                            }}
                        >
                            Guardar
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<CancelIcon />}
                            onClick={() => {
                                onCancel();
                                onClose();
                            }}
                        >
                            Cancelar
                        </Button>
                    </Box>
                </Box>
            </Modal>


        </div>
    );
}