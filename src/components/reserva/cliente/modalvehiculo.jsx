import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';

export default function ModalVehiculo({ open, onClose, onSave, onCancel, selectedVehicle, setSelectedVehicle, cvehi, errors }) {
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
                            <Autocomplete
                                value={selectedVehicle}
                                onChange={(event, newValue) => {
                                    setSelectedVehicle(newValue);
                                    console.log("Vehículo seleccionado:", newValue); 
                                }}
                                options={cvehi || []}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                    <TextField {...params}
                                        label="Vehiculo"
                                        variant="outlined"
                                    />
                                )}
                            />
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
