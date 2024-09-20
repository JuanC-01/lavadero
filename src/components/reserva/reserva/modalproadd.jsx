import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import Autocomplete from '@mui/material/Autocomplete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { DataGrid } from '@mui/x-data-grid';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

// Importa 'columns' aquí
const columns = [
    { field: 'idServicio', headerName: 'ID Servicio', width: 70, headerClassName: 'custom-header' },
    { field: 'nombre_productoadd', headerName: 'Producto', width: 130, headerClassName: 'custom-header' },
    { field: 'precio_productoadd', headerName: 'Precio Unidad', width: 130, headerClassName: 'custom-header' },
    { field: 'descripcion_productoadd', headerName: 'Descripcion', width: 130, headerClassName: 'custom-header' },
    { field: 'cantidad_servproadd', headerName: 'Cantidad', width: 130, headerClassName: 'custom-header' },
    { field: 'costo_servproadd', headerName: 'Costo Total', width: 130, headerClassName: 'custom-header' },
    {
        field: 'acciones', headerName: 'Acciones', width: 130, headerClassName: 'custom-header',
        renderCell: (params) => (
            <div>
                {(
                    <>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteForeverIcon />}
                            //onClick={() => handleEditMot(params.row.id_servicio)}
                            style={{ marginRight: 8 }}
                        >
                            ELIMINAR
                        </Button>
                    </>
                )}
            </div>
        ),
    },
];

export default function ModalProdAdd({
    open, onClose, onSave, onCancel, handleProAddChange, prodAdd, selectedproAdd, handleIncrement, handleDecrement, quantity, costo_servproadd, rows2
}) {
    const [pageSize, setPageSize] = useState(25);

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
                                value={selectedproAdd}
                                onChange={handleProAddChange}
                                options={prodAdd || []}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        label="Producto"
                                        variant="outlined"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button onClick={handleDecrement} size="small"><RemoveIcon /></Button>
                                <TextField
                                    id="quantity"
                                    label="Cantidad"
                                    type="number"
                                    value={quantity}
                                    variant="outlined"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <Button onClick={handleIncrement} size="small"><AddIcon /></Button>
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Precio $"
                                variant="outlined"
                                value={costo_servproadd !== null ? costo_servproadd : ''}
                                disabled
                            />
                        </Grid>

                    </Grid>




                    <div style={{ height: 500, width: '100%' }}>
                   
                        <DataGrid
                        rows={rows2}
                        columns={columns}
                        pageSize={pageSize}
                        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                        pageSizeOptions={[25, 50, 100]}
                        //getRowId={(row) => row.idServicio}
                    />

                    </div>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onSave}
                        >
                            Agregar
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<CancelIcon />}
                            onClick={() => {
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
