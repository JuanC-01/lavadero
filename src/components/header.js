import React, { useState } from 'react';
import {  TruckOutlined, TeamOutlined, HomeOutlined, UserAddOutlined, CalendarOutlined, SearchOutlined, FileSearchOutlined,
  ContactsOutlined, ProfileOutlined, IdcardOutlined, CarOutlined, AppstoreOutlined, PlusOutlined, ShoppingOutlined, RiseOutlined, ReconciliationOutlined,
  FileDoneOutlined
} from '@ant-design/icons';
import { Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import ModalCerrarSesion from './modalcerrars';

const { SubMenu } = Menu;

const Header = () => {
  const onClick = (e) => {
    console.log('click ', e);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Menu
        onClick={onClick}
        style={{
          width: 256,
        }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
      >
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to="/home">Home</Link>
        </Menu.Item>
        <SubMenu key="sub1" icon={<TruckOutlined />} title="Servicios Lavado">
          <SubMenu key="g1" icon={<ProfileOutlined />} title="Clientes">
            <Menu.Item key="2" icon={<UserAddOutlined />} ><Link to="/Rcliente">Registrar Cliente</Link></Menu.Item>
            <Menu.Item key="3" icon={<CarOutlined />} ><Link to="/Rvehiculo">Registrar Vehiculo</Link></Menu.Item>
            <Menu.Item key="4" icon={<SearchOutlined />} ><Link to="/Ccliente">Consultar Cliente</Link></Menu.Item>
          </SubMenu>
          <SubMenu key="g2" icon={<CalendarOutlined />} title="Reserva">
            <Menu.Item key="5" icon={<ContactsOutlined />} ><Link to="/Rreserva">Registrar Reserva</Link></Menu.Item>
            <Menu.Item key="6" icon={<FileSearchOutlined />} ><Link to="/Creserva">Consultar Reserva</Link></Menu.Item>
          </SubMenu>
        </SubMenu>
        <SubMenu key="sub2" icon={<ReconciliationOutlined />} title="Facturas-Reportes">
          <SubMenu key="g3" icon={<ProfileOutlined />} title="Facturas">
            <Menu.Item key="7" icon={<FileDoneOutlined />} ><Link to="/Factura">Pagar Factura</Link></Menu.Item>
            <Menu.Item key="8" icon={<RiseOutlined />} ><Link to="/DatosFacturas">Consultar Datos Facturas</Link></Menu.Item>
          </SubMenu>
          <SubMenu key="g4" icon={<CalendarOutlined />} title="Reportes">
            <Menu.Item key="9" icon={<ContactsOutlined />} ><Link to="/ReportEmpleado">Salario Empleado</Link></Menu.Item>
          </SubMenu>
        </SubMenu>
        <Menu.Divider />
        <SubMenu key="sub3" icon={<TeamOutlined />} title="Empleados">
          <Menu.Item key="10" icon={<IdcardOutlined />} ><Link to="/Rempleado">Registrar Empleado</Link></Menu.Item>
          <Menu.Item key="11" icon={<SearchOutlined />} ><Link to="/Cempleado">Consultar Empleado</Link></Menu.Item>
        </SubMenu>
        <SubMenu key="sub4" icon={<AppstoreOutlined />} title="Servicios">
          <SubMenu key="g5" icon={<ProfileOutlined />} title="Tipos de Servisios">
            <Menu.Item key="12" icon={<PlusOutlined />} ><Link to="/Tpservicio">Registrar</Link></Menu.Item>
            <Menu.Item key="13" icon={<SearchOutlined />} ><Link to="/Ctpservicio">Consultar</Link></Menu.Item>
          </SubMenu>
          <SubMenu key="g6" icon={<ShoppingOutlined />} title="S. Adicionales">
            <Menu.Item key="14" icon={<PlusOutlined />} ><Link to="/ProductoAdd">Registrar</Link></Menu.Item>
            <Menu.Item key="15" icon={<FileSearchOutlined />}><Link to="/CprodAdd">Consultar</Link></Menu.Item>
          </SubMenu>
        </SubMenu>
      </Menu>
      <Button type="primary" danger onClick={showModal}>
        Cerrar Sesión
      </Button>
      <ModalCerrarSesion
        visible={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default Header;
