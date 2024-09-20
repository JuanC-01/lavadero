import React, {useEffect} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';

export default function ModalProdAdd({ open, onClose, onSave, onCancel, editedFields, setEditedFields, errors, }) {
    useEffect(() => {
        if (open) {
            // Cuando el modal se abre, establece la cantidad_productoadd en 0
            setEditedFields({ ...editedFields, cantidad_productoadd: 0 });
        }
    }, [open]);

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
                                value={editedFields.nombre_productoadd || ''}
                                onChange={(e) => setEditedFields({ ...editedFields, nombre_productoadd: e.target.value.toUpperCase() })}
                                fullWidth

                                error={!!errors.nombre_productoadd}
                                helperText={errors.nombre_productoadd}

                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Precio"
                                value={editedFields.valor_productoadd || ''}
                                onChange={(e) => setEditedFields({ ...editedFields, valor_productoadd: e.target.value.toUpperCase() })}
                                fullWidth

                                error={!!errors.valor_productoadd}
                                helperText={errors.valor_productoadd}

                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                type='number'
                                label="Cantidad"
                                value={editedFields.cantidad_productoadd}
                                onChange={(e) => setEditedFields({ ...editedFields, cantidad_productoadd: parseInt(e.target.value) })}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                label="Descripcion"
                                value={editedFields.descripcion_productoadd || ''}
                                onChange={(e) => setEditedFields({ ...editedFields, descripcion_productoadd: e.target.value.toUpperCase() })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                select
                                label="Estado"
                                value={editedFields.estado_productoadd || ''}
                                onChange={(e) => {
                                    const newState = e.target.value === "ACTIVO" ? "A" : "I";
                                    setEditedFields({ ...editedFields, estado_productoadd: e.target.value, estadoTPservicio: newState });
                                }}
                                fullWidth
                            >
                                <MenuItem value="ACTIVO">ACTIVO</MenuItem>
                                <MenuItem value="INACTIVO">INACTIVO</MenuItem>
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