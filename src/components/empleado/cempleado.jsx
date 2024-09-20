import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UpdateIcon from '@mui/icons-material/Update';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ModalEmpleado from './modalempleado';
import DeleteConfirmationModal from '../modal';
import validation from '../validacionEdit';
import Typography from '@mui/material/Typography';
import '../login.css';

export default function DataTable() {
    const [rows, setRows] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [pageSize, setPageSize] = useState(25);
    const [openNotification, setOpenNotification] = useState(false);
    const [cancelEdit, setCancelEdit] = useState(false);
    const [notificationSeverity, setNotificationSeverity] = useState('success');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editedEmployee, setEditedEmployee] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [errors, setErrors] = useState({});

    const openEditModal = (employee) => {
        setEditedEmployee(employee);
        setEditModalOpen(true);
    };
    const handleDateChange = (date) => {
        setSelectedDate(date);
        setEditedFields(editedFields => ({
            ...editedFields,
            fechanto_persona: date
        }));
    };
    const closeEditModal = () => {
        setEditModalOpen(false);
        setEditedEmployee(null);
    };
    const handleCloseNotification = () => {
        setOpenNotification(false);
    };
    const openDeleteModal = () => {
        setDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
    };
    //Mostrar en la Tbla
    useEffect(() => {
        axios.get('http://localhost:8081/rempleado/consultar')
            .then(response => {
                setRows(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los datos de los empleados:', error);
            });
    }, []);
    //Filtro de Busqueda
    const filteredRows = useMemo(() => {
        if (!searchText) return rows;
        const searchTerm = searchText.toLowerCase();
        return rows.filter(row => {
            const nombreCompleto = `${row.nombre1_persona} ${row.apellido1_persona}`.toLowerCase();
            return nombreCompleto.includes(searchTerm) || row.cc_persona.toString().includes(searchText);
        });
    }, [rows, searchText]);
    //ELIMINAR
    const handleConfirmDelete = () => {
        axios.post('http://localhost:8081/rempleado/eliminar', { idEmpleado: editedEmployee })
            .then(res => {
                const message = res.data.message;
                if (message === "Empleado eliminado exitosamente") {
                    setOpenNotification(true);
                    setNotificationSeverity('success');
                    setNotificationMessage('Empleado eliminado exitosamente');
                    axios.get('http://localhost:8081/rempleado/consultar')
                        .then(response => {
                            setRows(response.data);
                        })
                        .catch(error => {
                            console.error('Error al obtener los datos de los empleados:', error);
                        });
                } else {
                    console.error("Error en la respuesta del servidor:", message);
                }
            })
            .catch(error => {
                console.error('Error al eliminar empleado:', error);
            });
        closeDeleteModal();
    };
    //Modificar
    const [isEditing, setIsEditing] = useState(false);
    //const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [editedFields, setEditedFields] = useState({});

    const handleEdit = (id) => {
        const employee = rows.find(row => row.id === id);
        if (employee) {
            openEditModal(employee);
            // setSelectedEmployee(employee);
            setEditedFields({ ...employee });
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
            axios.post('http://localhost:8081/rempleado/actualizar', {
                idEmpleado: editedEmployee.id,
                datosEmpleado: editedFields
            })
                .then(res => {
                    const message = res.data.message;
                    if (message === "Empleado actualizado exitosamente") {
                        setOpenNotification(true);
                        setNotificationSeverity('success');
                        setNotificationMessage('Datos Empleados Actualizados');
                        setTimeout(() => {
                            axios.get('http://localhost:8081/rempleado/consultar')
                                .then(response => {
                                    setRows(response.data);
                                });
                        }, 500);
                    } else {
                        console.error("Error en la respuesta del servidor:", message);
                    }
                })
                .catch(error => {
                    console.error('Error al actualizar empleado:', error);
                });
            setIsEditing(false);
        }
    };

    //Tabla
    const columns = [
        { field: 'id', headerName: 'ID.Emp.', width: 70, headerClassName: 'custom-header' },
        { field: 'cc_persona', headerName: 'Cedula', width: 130, headerClassName: 'custom-header' },
        { field: 'estado_empleado', headerName: 'Estado', width: 130, headerClassName: 'custom-header' },
        { field: 'nombres_persona', headerName: 'Nombres', width: 130, headerClassName: 'custom-header' },
        { field: 'apellidos_persona', headerName: 'Apellidos', width: 130, headerClassName: 'custom-header' },
        {
            field: 'fechanto_persona', headerName: 'F.Nacimiento', width: 130, headerClassName: 'custom-header',
            renderCell: (params) => {
                const fechaNacimiento = params.value ? new Date(params.value).toLocaleDateString() : '';
                return (
                    <div>{fechaNacimiento}</div>
                );
            }
        },
        { field: 'edad_persona', headerName: 'Edad', width: 80, headerClassName: 'custom-header' },
        { field: 'telefono_persona', headerName: 'Teléfono', width: 130, headerClassName: 'custom-header' },
        { field: 'correo_persona', headerName: 'Correo', width: 180, headerClassName: 'custom-header' },
        { field: 'direccion_persona', headerName: 'Dirección', width: 130, headerClassName: 'custom-header' },
        { field: 'usuario_credenciales', headerName: 'Usuario', width: 130, headerClassName: 'custom-header' },
        { field: 'contrasena_credenciales', headerName: 'Contraseña', width: 130, headerClassName: 'custom-header' },
        { field: 'cargo_empleado', headerName: 'Cargo', width: 130, headerClassName: 'custom-header' },
        {
            field: 'acciones', headerName: 'Acciones', width: 150, headerClassName: 'custom-header',
            renderCell: (params) => (
                <div>
                    {isEditing && editedEmployee && editedEmployee.id === params.row.id ? (
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
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => {
                                    setEditedEmployee(params.row.id);
                                    openDeleteModal();
                                }}
                                style={{ marginRight: 8 }}
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
            <ModalEmpleado
                open={editModalOpen}
                onClose={closeEditModal}
                onSave={handleSave}
                onCancel={handleCancelEdit}
                editedEmployee={editedEmployee}
                selectedDate={selectedDate}
                handleDateChange={handleDateChange}
                editedFields={editedFields}
                setEditedFields={setEditedFields}
                errors={errors}
            />
            <div className="table-container">
                <TextField
                    label="Buscar por P.Nombre y P.Apellido o CC Persona"
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
                <DeleteConfirmationModal
                    isOpen={deleteModalOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleConfirmDelete}
                />
            </div>
        </div >
    );
}