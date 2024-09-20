import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import EditIcon from '@mui/icons-material/Edit';
import UpdateIcon from '@mui/icons-material/Update';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ModalReserva from './modalreserva';
import CancelModal from './modalcancel';
import ModalProducAdd from './modalproadd';
import validation from './validacionRE';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { green } from '@mui/material/colors';
import { grey } from '@mui/material/colors';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import dayjs from 'dayjs';
import '../../login.css';
import Multa from '../../class/multa';
import Servproadd from '../../class/servproadd';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

export default function DataTable() {
    const [rows, setRows] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedFields, setEditedFields] = useState({});
    const [searchText, setSearchText] = useState('');
    const [pageSize, setPageSize] = useState(25);
    const [openNotification, setOpenNotification] = useState(false);
    const [cancelEdit, setCancelEdit] = useState(false);
    const [notificationSeverity, setNotificationSeverity] = useState('success');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [paddModalOpen, setPaddModalOpen] = useState(false);
    const [editedReserva, setEditedReserva] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDateNew, setSelectedDateNew] = useState(new Date());
    const [errors, setErrors] = useState({});
    const [validHours, setValidHours] = useState([]);
    const [selectedHour, setSelectedHour] = useState('');
    const [selectedPlacaV, setSelectedPlacaV] = useState(null);
    const [precioServicio, setPrecioServicio] = useState('');
    const [selectedTservicio, setSelectedTservicio] = useState(null);
    const [Cvehi, setCvehi] = useState([]);
    const [selectedEmplea, setSelectedEmplea] = useState(null);
    const [emplea, setEmplea] = useState([]);
    const [selectedMotivm, setSelectedMotivm] = useState(null);
    const [motivoM, setMotivom] = useState([]);
    const [multa, setMulta] = useState(new Multa(null, null));
    const [valor_multa, setValorMulta] = useState('');
    const [idReserva, setIdReserva] = useState([]);
    const [selectedproAdd, setSelectedProdAdd] = useState(null);
    const [prodAdd, setProdAdd] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [maxQuantity, setMaxQuantity] = useState(1);
    const [costo_servproadd, setCosto_servpadd] = useState('');
    const [rservproadd, setRServproadd] = useState(new Servproadd(null, null));
    const [idServicio, setIdServicio] = useState([]);
    const [rows2, setRows2] = useState([]);
    const accent = green['A700'];
    const accent2 = grey['800'];

    const openEditModal = (reserva) => {
        const placaVehi = reserva.placaVehi;
        setEditedReserva(reserva);
        setSelectedPlacaV(placaVehi);
        setEditModalOpen(true);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        fetchReservations(date);
    };

    const handleHourChange = (event) => {
        setSelectedHour(event.target.value);
        setEditedFields({ ...editedFields, hora_reserva: event.target.value });
    };


    const handleDateNew = (datenew) => {
        setSelectedDateNew(datenew);
        setEditedFields({ ...editedFields, fecha_reserva: datenew });

        const currentHour = dayjs().hour();
        const availableHours = [];
        for (let i = 8; i <= 17; i++) {
            if (datenew.isSame(dayjs(), 'day') && i <= currentHour) {
                continue;
            }
            availableHours.push(i);
        }
        setValidHours(availableHours);
        setSelectedHour('');
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        handleHourChange({ target: { value: '' } });
        setEditedReserva(null);
    };

    const handleCloseNotification = () => {
        setOpenNotification(false);
    };

    const openProaddModal = (reserva) => {
        const idReserva = reserva.id_reserva;
        setIdReserva(idReserva);
        console.log('id reserva', idReserva);

        const idServicio = reserva.id_servicio;
        setIdServicio(idServicio);
        console.log('id servicio', idServicio);
        setPaddModalOpen(true);
        fetchBProdadd();
    };
    const closeProaddModal = () => {
        setPaddModalOpen(false);
        setCosto_servpadd('');
    };

    const openCancelModal = (reserva) => {
        const idReserva = reserva.id_reserva;
        setIdReserva(idReserva);
        console.log('id reserva', idReserva);
        setCancelModalOpen(true);
        setMulta(prevMulta => ({
            ...prevMulta,
            fk_id_reserva: idReserva
        }));
    };

    const closeCancelModal = () => {
        setCancelModalOpen(false);
        setValorMulta('');
        setSelectedMotivm(null);
    };



    const fetchReservations = (date) => {
        const offset = date.getTimezoneOffset() * 60000; // Zona Horaria Colombia
        const localISOTime = (new Date(date.getTime() - offset)).toISOString().split('T')[0];
        //console.log('Fecha formateada:', localISOTime);
        axios.get(`http://localhost:8081/rreserva/servicios/${localISOTime}`)
            .then(response => {
                setRows(response.data);
                if (response.data.length === 0) {
                    setNotificationMessage('No se encontraron servicios para la fecha proporcionada');
                    setNotificationSeverity('info');
                    setOpenNotification(true);
                }
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    setRows([]);
                    setNotificationMessage('No se encontraron reservas para la fecha proporcionada');
                    setNotificationSeverity('warning');
                    setOpenNotification(true);
                } else {
                    console.error('Error al obtener los datos de las reservas:', error);
                }
            });
    };

    useEffect(() => {
        fetchReservations(selectedDate);
    }, []);
    //ModalResrvaEdit
    const filteredRows = useMemo(() => {
        if (!searchText) return rows;
        const searchTerm = searchText.toLowerCase();
        return rows.filter(row => {
            return row.placaVehi.toLowerCase().includes(searchTerm);
        });
    }, [rows, searchText]);

    const fetchCvehi = async (selectedPlacaV) => {
        try {
            const response = await axios.get(`http://localhost:8081/rreserva/tpservi/${selectedPlacaV}/consulta`);
            setCvehi(response.data);
        } catch (error) {
            console.error('Error al obtener categorías de vehículos:', error);
        }
    };

    useEffect(() => {
        if (selectedPlacaV) {
            fetchCvehi(selectedPlacaV);
        }
    }, [selectedPlacaV]);

    const handleTservicioChange = async (event, newValue, id_catvehiculo) => {
        setSelectedTservicio(newValue);
        if (newValue !== null) {
            setEditedFields(editedFields => ({ ...editedFields, fk_id_tiposer: newValue.value }));
            if (id_catvehiculo) {
                try {
                    const responsePrecio = await axios.get(`http://localhost:8081/rreserva/precio-servicio/${newValue.value}/${id_catvehiculo}/consulta`);
                    const { precio } = responsePrecio.data;
                    setPrecioServicio(precio);
                } catch (error) {
                    console.error('Error al obtener el precio del servicio:', error);
                }
            }
        }
    };

    const handleEmpleaChange = (event, newValue) => {
        if (newValue) {
            setSelectedEmplea(newValue);
            setEditedFields(editedFields => ({ ...editedFields, fk_id_empleado: newValue.value }));
        }
    };

    useEffect(() => {
        const fetchEmplea = async () => {
            try {
                const response = await axios.get('http://localhost:8081/rreserva/empleado');
                setEmplea(response.data);
            } catch (error) {
                console.error('Error al obtener empleados:', error);
            }
        };
        fetchEmplea();
    }, []);

    //ModalProductoAdd
    useEffect(() => {
        const fetchProdAdd = async () => {
            try {
                const response = await axios.get('http://localhost:8081/rreserva/producto-adicional');
                setProdAdd(response.data);
            } catch (error) {
                console.error('Error al obtener empleados:', error);
            }
        };
        fetchProdAdd();
    }, []);

    const handleProAddChange = async (event, newValue) => {
        if (newValue) {
            setSelectedProdAdd(newValue);
            setMaxQuantity(newValue.cantidadDisponible);
            setQuantity(1);
            console.log('Producto:', newValue.value);
            console.log("Cantidad Producto:", newValue.cantidadDisponible);
            console.log("Cantidad:", quantity);
            try {
                const response = await axios.get(`http://localhost:8081/rreserva/precio-prodadd/${newValue.value}/${quantity}/consulta`);
                const { costo_servproadd } = response.data;
                setCosto_servpadd(costo_servproadd);
                setRServproadd(prevServPadd => ({
                    ...prevServPadd,
                    fk_id_servicio: newValue.value,
                    cantidad_servproadd: quantity,
                    costo_servproadd: costo_servproadd
                }));
                console.log('Costo:', costo_servproadd);
            } catch (error) {
                console.error('Error al obtener el costo del producto adicional:', error);
            }
        }
    };


    const handleProdAdd = (id_servicio) => {
        const reserva = rows.find(row => row.id_servicio === id_servicio);
        if (reserva) {
            openProaddModal(reserva);
        }
    };

    useEffect(() => {
        if (selectedproAdd) {
            setMaxQuantity(selectedproAdd.cantidadDisponible);
            setQuantity(1);
        }
    }, [selectedproAdd]);

    const handleIncrement = async () => {
        if (quantity < maxQuantity) {
            const newQuantity = quantity + 1;
            setQuantity(newQuantity);
            console.log("Cantidad seleccionada:", newQuantity);
            try {
                const response = await axios.get(`http://localhost:8081/rreserva/precio-prodadd/${selectedproAdd.value}/${newQuantity}/consulta`);
                const { costo_servproadd } = response.data;
                console.log('Costo:', costo_servproadd);
                setCosto_servpadd(costo_servproadd);
                setRServproadd(prevServPadd => ({
                    ...prevServPadd,
                    cantidad_servproadd: newQuantity,
                    costo_servproadd: costo_servproadd
                }));
            } catch (error) {
                console.error('Error al obtener el costo del producto adicional:', error);
            }
        }
    };

    const handleDecrement = async () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            console.log("Cantidad seleccionada:", newQuantity);

            try {
                const response = await axios.get(`http://localhost:8081/rreserva/precio-prodadd/${selectedproAdd.value}/${newQuantity}/consulta`);
                const { costo_servproadd } = response.data;
                console.log('Costo:', costo_servproadd);
                setCosto_servpadd(costo_servproadd);
                setRServproadd(prevServPadd => ({
                    ...prevServPadd,
                    cantidad_servproadd: newQuantity,
                    costo_servproadd: costo_servproadd
                }));
            } catch (error) {
                console.error('Error al obtener el costo del producto adicional:', error);
            }
        }
    };

    const handleSaveSPadd = () => {
        axios.post('http://localhost:8081/rreserva/registro-servproadd', {
            fk_id_servicio: idServicio,
            fk_id_producto: selectedproAdd.value,
            cantidad_servproadd: rservproadd.cantidad_servproadd,
            costo_servproadd: rservproadd.costo_servproadd
        })
        .then(res => {
            const message = res.data.message;
            if (message === "Registro de servproadd exitoso") {
                setOpenNotification(true);
                setNotificationSeverity('success');
                setNotificationMessage('Producto Adicional Añadido');
                fetchBProdadd(); // Aquí deberías actualizar el estado rows2
                fetchReservations(selectedDate);
            } else {
                console.error("Error en la respuesta del servidor:", message);
            }
        })
        .catch(error => {
            console.error('Error al registrar servproadd:', error);
        });
        setIsEditing(false);
    };
    
    const fetchBProdadd = () => {
        axios.get(`http://localhost:8081/rreserva/consulta-servp/${idServicio}`)
            .then(response => {
                setRows2(response.data); // Actualiza rows2 con los datos obtenidos del servidor
                console.log("datos", response.data);
            })
            .catch(error => {
                console.error('Error al obtener los datos de servprod:', error);
            });
    };
    

    useEffect(() => {
        fetchBProdadd(idServicio);
    }, [idServicio]);



    //ModalCancelacion
    const handleMotivomChange = async (event, newValue) => {
        if (newValue && idReserva) {
            setSelectedMotivm(newValue);
            setMulta(prevMulta => ({
                ...prevMulta,
                fk_id_motivom: newValue.value
            }));
            console.log("Valor seleccionado en motivo:", newValue.value);
            try {
                const response = await axios.get(`http://localhost:8081/rreserva/multa-servicio/${idReserva}/${newValue.value}/consulta`);
                const { valor_multa } = response.data;
                console.log('multa', valor_multa);
                setValorMulta(valor_multa);
                setMulta(prevMulta => ({
                    ...prevMulta,
                    valor_multa: valor_multa
                }));
            } catch (error) {
                console.error('Error al obtener el valor de la multa:', error);
            }
        }
    };

    useEffect(() => {
        const fetchMotivom = async () => {
            try {
                const response = await axios.get('http://localhost:8081/rreserva/motivom');
                setMotivom(response.data);
            } catch (error) {
                console.error('Error al obtener empleados:', error);
            }
        };
        fetchMotivom();
    }, []);

    const handleEditMot = (id_servicio) => {
        const reserva = rows.find(row => row.id_servicio === id_servicio);
        if (reserva) {
            openCancelModal(reserva);
        }
    };
    //Reserva
    const handleUpdateEstadoReserva = (idReserva) => {
        axios.put(`http://localhost:8081/rreserva/actualizar-estado/${idReserva}`)
            .then(response => {
                //console.log(response.data); // Puedes mostrar un mensaje de éxito u otra acción
                fetchReservations(selectedDate);

                // Llamada para registrar la factura
                axios.post('http://localhost:8081/factura/registrar-factura', { fk_id_servicio: idReserva })
                    .then(response => {
                        console.log("se registro la factura");
                        console.log(response.data); // Puedes mostrar un mensaje de éxito u otra acción
                    })
                    .catch(error => {
                        console.error('Error al registrar la factura:', error);
                    });
            })
            .catch(error => {
                console.error('Error al actualizar el estado de la reserva:', error);
            });
    };


    //GuardarMulta
    const handleConfirmCancel = () => {
        console.log("Datos enviados para registrar la multa:", {
            fk_id_motivom: selectedMotivm.value,
            valor_multa: valor_multa,
            fk_id_reserva: idReserva
        });

        axios.post('http://localhost:8081/rreserva/registro-multa', {
            fk_id_motivom: selectedMotivm.value,
            valor_multa: valor_multa,
            fk_id_reserva: idReserva
        })
            .then(res => {
                console.log(res.data.message);
                fetchReservations(selectedDate);
            })
            .catch(error => {
                console.error('Error al registrar multa:', error);
            });
    };



    const handleEdit = (id_servicio) => {
        const reserva = rows.find(row => row.id_servicio === id_servicio);
        if (reserva) {
            openEditModal(reserva);
            setEditedFields({ ...reserva });
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
    //ReservaEdit
    const handleSave = () => {
        const errors = validation(editedFields);
        setErrors(errors);
        const noHayErrores = Object.keys(errors).length !== 0;
        if (noHayErrores) {
            axios.post('http://localhost:8081/rreserva/actualizar', {
                id_servicio: editedReserva.id_servicio,
                datosReserva: editedFields
            })
                .then(res => {
                    const message = res.data.message;
                    if (message === "Reserva actualizada exitosamente") {
                        setOpenNotification(true);
                        setNotificationSeverity('success');
                        setNotificationMessage('Datos Reserva Actualizados');
                        fetchReservations(selectedDate);
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

    // Tabla
    const columns = [
        { field: 'id_servicio', headerName: 'ID Servicio', width: 70, headerClassName: 'custom-header' },
        {
            field: 'fecha_reserva', headerName: 'Fecha', width: 130, headerClassName: 'custom-header',
            renderCell: (params) => {
                const fechaReserva = params.value ? new Date(params.value).toLocaleDateString() : '';
                return (
                    <div>{fechaReserva}</div>
                );
            }
        },
        { field: 'hora_reserva', headerName: 'Hora', width: 75, headerClassName: 'custom-header' },
        { field: 'estado_reserva', headerName: 'Estado', width: 75, headerClassName: 'custom-header' },
        { field: 'placaVehi', headerName: 'P.Vehiculo', width: 130, headerClassName: 'custom-header' },
        { field: 'nombre_catvehiculo', headerName: 'Vehiculo', width: 130, headerClassName: 'custom-header' },
        { field: 'nombre_empleado', headerName: 'Empleado', width: 130, headerClassName: 'custom-header' },
        { field: 'nombre_cliente', headerName: 'Cliente', width: 130, headerClassName: 'custom-header' },
        { field: 'nombre_tiposer', headerName: 'Servicio', width: 130, headerClassName: 'custom-header' },
        { field: 'valor_ctgtpservicio', headerName: 'Valor Servicio', width: 130, headerClassName: 'custom-header' },
        { field: 'valor_multa', headerName: 'Valor Multa', width: 130, headerClassName: 'custom-header' },
        { field: 'costo_servproadd', headerName: 'Producto Add', width: 130, headerClassName: 'custom-header' },
        {
            field: 'acciones', headerName: 'Acciones', width: 275, headerClassName: 'custom-header',
            renderCell: (params) => (
                <div>
                    {isEditing && editedReserva && editedReserva.id_servicio === params.row.id_servicio ? (
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
                                onClick={() => handleEdit(params.row.id_servicio)}
                                disabled={params.row.estado_reserva === 'C' || params.row.estado_reserva === 'F'}
                            >
                            </Button>
                            <Button
                                variant="contained"
                                style={{ backgroundColor: accent2, color: '#fff' }}
                                startIcon={<AddShoppingCartIcon />}
                                onClick={() => handleProdAdd(params.row.id_servicio)}
                                disabled={params.row.estado_reserva === 'C' || params.row.estado_reserva === 'F'}
                            >
                            </Button>
                            <Button
                                variant="contained"
                                style={{ backgroundColor: accent, color: '#fff' }}
                                startIcon={<CheckBoxIcon />}
                                onClick={() => handleUpdateEstadoReserva(params.row.id_servicio)}
                                disabled={params.row.estado_reserva === 'C' || params.row.estado_reserva === 'F'}
                            >
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<DisabledByDefaultIcon />}
                                onClick={() => handleEditMot(params.row.id_servicio)}
                                style={{ marginRight: 8 }}
                                disabled={params.row.estado_reserva === 'C' || params.row.estado_reserva === 'F'}
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
            <Typography component="h1" variant="h6">
                RESERVAS
            </Typography>
            <ModalReserva
                open={editModalOpen}
                onClose={closeEditModal}
                onSave={handleSave}
                onCancel={handleCancelEdit}
                editedReserva={editedReserva}
                selectedDateNew={selectedDateNew}
                handleDateNew={handleDateNew}
                editedFields={editedFields}
                setEditedFields={setEditedFields}
                handleHourChange={handleHourChange}
                setSelectedTservicio={setSelectedTservicio}
                handleTservicioChange={handleTservicioChange}
                precioServicio={precioServicio}
                handleEmpleaChange={handleEmpleaChange}
                selectedEmplea={selectedEmplea}
                selectedTservicio={selectedTservicio}
                emplea={emplea}
                cvehi={Cvehi}
                selectedHour={selectedHour}
                validHours={validHours}
                errors={errors}
            />
            <ModalProducAdd
                open={paddModalOpen}
                onSave={handleSaveSPadd}
                onClose={closeProaddModal}
                handleProAddChange={handleProAddChange}
                prodAdd={prodAdd}
                quantity={quantity}
                handleIncrement={handleIncrement}
                handleDecrement={handleDecrement}
                maxQuantity={maxQuantity}
                costo_servproadd={costo_servproadd}
                idServicio={idServicio}
                rows2={rows2}
            />
            <CancelModal
                isOpen={cancelModalOpen}
                onClose={closeCancelModal}
                onConfirm={handleConfirmCancel}
                handleMotivomChange={handleMotivomChange}
                motivoM={motivoM}
                selectedMotivm={selectedMotivm}
                valor_multa={valor_multa}
            />
            <div className="table-container">
                <TextField
                    label="Buscar por Placa Vehiculo"
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <SearchIcon style={{ marginRight: 8, color: 'rgba(0, 0, 0, 0.60)' }} />
                        ),
                    }}
                    style={{ marginBottom: 16 }}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Buscar por Fecha"
                        value={selectedDate}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} style={{ marginBottom: 16 }} />}
                    />
                </LocalizationProvider>
                <div style={{ height: 700, width: '100%' }}>
                    <DataGrid
                        rows={filteredRows}
                        columns={columns}
                        pageSize={pageSize}
                        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                        pageSizeOptions={[25, 50, 100]}
                        getRowId={(row) => row.id_servicio}
                    />
                </div>
                <Snackbar open={openNotification} autoHideDuration={6000} onClose={handleCloseNotification}>
                    <MuiAlert onClose={handleCloseNotification} severity={notificationSeverity} sx={{ width: '100%' }}>
                        {notificationMessage}
                    </MuiAlert>
                </Snackbar>
            </div>
        </div>
    );
}

