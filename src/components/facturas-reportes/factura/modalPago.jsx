import React from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function PagoModal({ isOpen, onSave, onClose, onConfirm, handleMetodoP, metoPago = [], selectedmetoPago = null, totalFactura  }) {


    return (
        <Modal open={isOpen} onClose={onClose}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '5px', width: '420px' }}>
                <h2>Confirmar Pago Factura</h2>
                <Grid container spacing={1} style={{ marginTop: '20px' }}>
                    <Grid item xs={10}>
                        <Autocomplete
                            value={selectedmetoPago}
                            onChange={(event, newValue) => handleMetodoP(event, newValue)}
                            options={metoPago}
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    required
                                    label="Metodo Pago"
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Multa $"
                            variant="outlined"
                            value={totalFactura}
                            disabled
                        />
                    </Grid>
                </Grid>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <Button variant="contained" onClick={onSave} style={{ backgroundColor: 'red', color: 'white' }}>PagarF</Button>
                </div>
            </div>
        </Modal>
    );
}
