import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';

export default function ModalTPservicio({ open, onClose, onSave, onCancel, editedFields, setEditedFields, errors }) {


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
                                label="Nombre"
                                value={editedFields.nombre_tiposer || ''}
                                onChange={(e) => setEditedFields({ ...editedFields, nombre_tiposer: e.target.value.toUpperCase() })}
                                fullWidth

                                error={!!errors.nombre_tiposer}
                                helperText={errors.nombre_tiposer}

                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Precio"
                                value={editedFields.valor_tiposer || ''}
                                onChange={(e) => setEditedFields({ ...editedFields, valor_tiposer: e.target.value.toUpperCase() })}
                                fullWidth

                                error={!!errors.valor_tiposer}
                                helperText={errors.valor_tiposer}

                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                select
                                label="Estado"
                                value={editedFields.estado_tiposer || ''}
                                onChange={(e) => {
                                    const newState = e.target.value === "AUTOMOVIL" ? "V" : "M";
                                    setEditedFields({ ...editedFields, estado_tiposer: e.target.value, estadoTPservicio: newState });
                                }}
                                fullWidth
                            >
                                <MenuItem value="AUTOMOVIL">AUTOMOVIL</MenuItem>
                                <MenuItem value="MOTOCICLETA">MOTOCICLETA</MenuItem>
                            </TextField>

                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Descripcion"
                                value={editedFields.descripcion_tiposer || ''}
                                onChange={(e) => setEditedFields({ ...editedFields, descripcion_tiposer: e.target.value.toUpperCase() })}
                                fullWidth

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