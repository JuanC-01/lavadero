import React from 'react';
import { Modal } from 'antd';

const ModalCerrarSesion = ({ visible, handleOk, handleCancel }) => {
  return (
    <Modal
      title="Confirmar Cierre de Sesión"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>¿Estás seguro de que deseas cerrar la sesión?</p>
    </Modal>
  );
};

export default ModalCerrarSesion;
