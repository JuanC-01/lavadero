import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import UpdateIcon from '@mui/icons-material/Update';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import validation from './validacionEditPad';
import Typography from '@mui/material/Typography';
import '../../login.css';
import ModalProdAdd from './modalproadd';

export default function DataTable() {
    const [rows, setRows] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [pageSize, setPageSize] = useState(25);
    const [openNotification, setOpenNotification] = useState(false);
    const [cancelEdit, setCancelEdit] = useState(false);
    const [notificationSeverity, setNotificationSeverity] = useState('success');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editedProadd, setEditedEmployee] = useState(null);
    const [errors, setErrors] = useState({});

    const openEditModal = (proadd) => {
        setEditedEmployee(proadd);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setEditedEmployee(null);
    };
    const handleCloseNotification = () => {
        setOpenNotification(false);
    };
    //Mostrar en la Tbla
    useEffect(() => {
        axios.get('http://localhost:8081/productoadd/productos-add')
            .then(response => {
                setRows(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los datos de los tiposservicios:', error);
            });
    }, []);
    //Filtro de Busqueda
    const filteredRows = useMemo(() => {
        if (!searchText) return rows;
        const searchTerm = searchText.toLowerCase();
        return rows.filter(row => {
            const nombreCompleto = `${row.nombre_tiposer}`.toLowerCase();
            return nombreCompleto.includes(searchTerm) || row.cc_persona.toString().includes(searchText);
        });
    }, [rows, searchText]);
    //ELIMINAR
 
    //Modificar
    const [isEditing, setIsEditing] = useState(false);
    const [editedFields, setEditedFields] = useState({});

    const handleEdit = (id) => {
        const tpser = rows.find(row => row.id === id);
        if (tpser) {
            openEditModal(tpser);
            setEditedFields({ ...tpser });
            setIsEditing(true);
        }
    };
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedFields({});
        setOpenNotification(true);
        setNotificationSeverity('info');
        setNotificationMessage('Actualización de Datos Cancelada');
    };
    useEffect(() => {
        if (cancelEdit) {
            setOpenNotification(true);
            setCancelEdit(false);
        }
    }, [cancelEdit]);
    //Guardar
    const handleSave = () => {
        const errors = validation(editedFields);
        setErrors(errors);
        const noHayErrores = Object.keys(errors).length !== 0;
        if (noHayErrores) {
            axios.post('http://localhost:8081/productoadd/actualizar-proadd', {
                id_productoadd: editedProadd.id,
                datosPadd: editedFields
            })
                .then(res => {
                    const message = res.data.message;
                    if (message === "producto adicional actualizado exitosamente") {
                        setOpenNotification(true);
                        setNotificationSeverity('success');
                        setNotificationMessage('Datos Empleados Actualizados');
                        setTimeout(() => {
                            axios.get('http://localhost:8081/productoadd/productos-add')
                                .then(response => {
                                    setRows(response.data);
                                });
                        }, 500);
                    } else {
                        console.error("Error en la respuesta del servidor:", message);
                    }
                })
                .catch(error => {
                    console.error('Error al actualizar tpservicios:', error);
                });
            setIsEditing(false);
        }
    };

    //Tabla
    const columns = [
        { field: 'id', headerName: 'ID.Producto Add', width: 70, headerClassName: 'custom-header' },
        { field: 'nombre_productoadd', headerName: 'Nombre', width: 130, headerClassName: 'custom-header' },
        { field: 'valor_productoadd', headerName: 'Precio Unidad', width: 130, headerClassName: 'custom-header' },
        { field: 'cantidad_productoadd', headerName: 'Cantidad Dispo', width: 130, headerClassName: 'custom-header' },
        { field: 'descripcion_productoadd', headerName: 'Descripcion', width: 130, headerClassName: 'custom-header' },
        { field: 'estado_productoadd', headerName: 'Estado Producto', width: 130, headerClassName: 'custom-header' },
        {
            field: 'acciones', headerName: 'Acciones', width: 150, headerClassName: 'custom-header',
            renderCell: (params) => (
                <div>
                    {isEditing && editedProadd && editedProadd.id_tiposer === params.row.id ? (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<UpdateIcon />}
                            onClick={handleSave}
                        >
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={() => handleEdit(params.row.id)}
                            >
                            </Button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="table-consulta">
            <Typography component="h1" variant="h8">
                EMPLEADOS
            </Typography>
            <ModalProdAdd
                open={editModalOpen}
                onClose={closeEditModal}
                onSave={handleSave}
                onCancel={handleCancelEdit}
                editedProadd={editedProadd}
                editedFields={editedFields}
                setEditedFields={setEditedFields}
                errors={errors}
            />
            <div className="table-container">
                <TextField
                    label="Buscar Nombre TipoServicio"
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <SearchIcon style={{ marginRight: 8, color: 'rgba(0, 0, 0, 0.60)' }} />
                        ),
                    }}
                    style={{ marginBottom: 16 }}
                />
                <div style={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={filteredRows}
                        columns={columns}
                        pageSize={pageSize}
                        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                        pageSizeOptions={[25, 50, 100]}
                    />
                </div>
                <Snackbar open={openNotification} autoHideDuration={6000} onClose={handleCloseNotification}>
                    <MuiAlert onClose={handleCloseNotification} severity={notificationSeverity} sx={{ width: '100%' }}>
                        {notificationMessage}
                    </MuiAlert>
                </Snackbar>
            </div>
        </div >
    );
}