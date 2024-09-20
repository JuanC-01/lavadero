import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './header';
import Home from './home';
import Rcliente from './reserva/cliente/rcliente';
import Ccliente from './reserva/cliente/ccliente'
import Rempleado from './empleado/rempleado';
import Cempleado from './empleado/cempleado';
import Rreserva from './reserva/reserva/rreserva';
import Creserva from './reserva/reserva/creserva';
import Rvehiculo from './reserva/cliente/rvehiculo';
import Tpservicio from './Servicio/tpservicio/rtpservicio';
import Ctpservicio from './Servicio/tpservicio/ctpservicio';
import ProductoAdd from './Servicio/addservicio/productoadd';
import CprodAdd from './Servicio/addservicio/cproductoadd';
import Factura from './facturas-reportes/factura/factura';
import ReportEmpleado from './facturas-reportes/reportes/empleadoRep';
import DatosFacturas from './facturas-reportes/factura/datosfacturas';

const Conteiner = () => {
  const location = useLocation();

  useEffect(() => {
    const loggedIn = localStorage.getItem('token');
    if (!loggedIn && location.pathname !== '/login') {
      // Redirige a la página de inicio de sesión si no hay sesión iniciada
      window.location.href = '/login';
    }
  }, [location]);

  const getComponent = () => {
    switch (location.pathname) {
      case '/home':
        return <Home />;
      case '/Rcliente':
        return <Rcliente />;
      case '/Ccliente':
        return <Ccliente />;
      case '/Rreserva':
        return <Rreserva />;
      case '/Creserva':
        return <Creserva />;
      case '/Rvehiculo':
        return <Rvehiculo />;
      case '/Rempleado':
        return <Rempleado />;
      case '/Cempleado':
        return <Cempleado />;
      case '/Tpservicio':
        return <Tpservicio />;
      case '/Ctpservicio':
        return <Ctpservicio />;
      case '/ProductoAdd':
        return <ProductoAdd />;
      case '/CprodAdd':
        return <CprodAdd />;
      case '/Factura':
        return <Factura />;
      case '/ReportEmpleado':
        return <ReportEmpleado />;
      case '/DatosFacturas':
        return <DatosFacturas />;
      default:
        return <Home />;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Header />
      <div style={{ flex: 1, padding: '20px' }}>
        {getComponent()}
      </div>
    </div>
  );
};

export default Conteiner;
