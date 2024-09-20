import React from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
    const handleCancel = () => {
        onClose();
    };

    const handleDelete = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal open={isOpen} onClose={handleCancel}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
                <h2>Confirmar Eliminación</h2>
                <p>¿Estás seguro de que deseas eliminar?</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <Button variant="contained" onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>Eliminar</Button>
                    <Button variant="contained" onClick={handleCancel}>Cancelar</Button>
                </div>
            </div>
        </Modal>
    );
}
