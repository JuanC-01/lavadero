import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';


export default function ModalReserva({
    open, onClose, onSave, onCancel, editedReserva, selectedDateNew, handleDateNew,
    editedFields, setEditedFields, selectedTservicio, setSelectedTservicio, cvehi, handleTservicioChange,
    precioServicio, setPrecioServicio, handleEmpleaChange, emplea, selectedEmplea, validHours, selectedHour, handleHourChange, errors
}) {
    const currentDate = dayjs();
    const maxiDate = currentDate.add(30, 'day');

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
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    inputFormat="YYYY/MM/DD"
                                    label="Fecha "
                                    selected={selectedDateNew || editedReserva?.fecha_reserva}
                                    onChange={handleDateNew}
                                    maxDate={maxiDate}
                                    minDate={currentDate}
                                />
                            </LocalizationProvider>

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
                            >
                                {validHours.map((hour) => (
                                    <MenuItem key={hour} value={hour}>
                                        {hour === 12 ? "12 PM" : hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                label="Estado"
                                value={editedFields.estado_reserva || ''}
                                //onChange={(e) => setEditedFields({ ...editedFields, estado_reserva: e.target.value })}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Vehiculo"
                                value={editedFields.placaVehi || ''}
                                //onChange={(e) => setEditedFields({ ...editedFields, placaVehi: e.target.value })}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Categoria Vehiculo"
                                value={editedFields.nombre_catvehiculo || ''}
                                //onChange={(e) => setEditedFields({ ...editedFields, nombre_catvehiculo: e.target.value })}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Autocomplete
                                value={selectedEmplea}
                                onChange={handleEmpleaChange}
                                options={emplea || []}
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
                            <TextField
                                label="Cliente"
                                value={editedFields.nombre_cliente || ''}
                                //onChange={(e) => setEditedFields({ ...editedFields, nombre_cliente: e.target.value })}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Autocomplete
                                value={selectedTservicio}
                                onChange={(event, newValue) => {
                                    handleTservicioChange(event, newValue, editedReserva?.fk_id_catvehiculo);
                                    setSelectedTservicio(newValue);
                                }}
                                options={cvehi || []}
                                getOptionLabel={(option) => option && option.label ? option.label : ''}
                                renderInput={(params) => (
                                    <TextField {...params}
                                        label="Servicio"
                                        variant="outlined"
                                        error={!!errors.selectedTservicio}
                                        helperText={errors.selectedTservicio}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Valor($)"
                                value={precioServicio}
                                onChange={(e) => setPrecioServicio(e.target.value)}
                                fullWidth
                                disabled
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onSave}
                        >
                            Actualizar
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


/*
<Grid item xs={4}>
                            <Autocomplete
                                value={selectedVehicle}
                                onChange={(event, newValue) => {
                                    setSelectedVehicle(newValue);
                                    console.log("Vehículo seleccionado:", newValue);
                                }}
                                options={cvehi || []}
                                getOptionLabel={(option) => option.placa || ''}
                                isOptionEqualToValue={(option, value) => option.placa === value.placa}
                                renderInput={(params) => (
                                    <TextField {...params}
                                        label="Placa Vehiculo"
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
*/