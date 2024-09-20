import React from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function CancelModal({ isOpen, onClose, onConfirm, handleMotivomChange, motivoM = [], selectedMotivm = null, valor_multa  }) {

    const handleCancel = () => {
        onClose();
    };

    const handleDelete = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal open={isOpen} onClose={handleCancel}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '5px', width: '420px' }}>
                <h2>Confirmar Cancelación Reserva</h2>
                <Grid container spacing={1} style={{ marginTop: '20px' }}>
                    <Grid item xs={10}>
                        <Autocomplete
                            value={selectedMotivm}
                            onChange={(event, newValue) => handleMotivomChange(event, newValue)}
                            options={motivoM}
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    required
                                    label="Motivo"
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Multa $"
                            variant="outlined"
                            value={valor_multa !== null ? valor_multa : ''}
                            disabled
                        />
                    </Grid>
                </Grid>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <Button variant="contained" onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>Confirmar</Button>
                </div>
            </div>
        </Modal>
    );
}
