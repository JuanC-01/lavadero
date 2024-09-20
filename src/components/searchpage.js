import React from 'react'

const searchpage = () => {
  return (
    <div>searchpage</div>
  )
}

export default searchpage


import React from 'react';
import { Button, DatePicker, Form, Select, Input } from 'antd';

const { Option } = Select;
const formItemLayout = {
    labelCol: {
        xs: { span: 250 },
        sm: { span: 250 },
    },
    wrapperCol: {
        xs: { span: 250 },
        sm: { span: 250 },
    },
};

const Rreserva = () => {
    const disabledDate = current => {
        const today = new Date();
        return current && current < today.setHours(0, 0, 0, 0);
    };

    return (
        <div className="logo-background">
            <div className="form-container">
                <h1>Reserva</h1>
                <Form
                    {...formItemLayout}
                    variant="filled"
                    style={{
                        maxWidth: 1000,
                        display: 'grid',
                        gridTemplateColumns: ' repeat(3, 1fr)',
                        gap: '20px',
                        margin: 'auto',
                    }}
                >
                    <Form.Item
                        label="Fecha"
                        id="fecha_reserva"
                        name="Fecha"
                        rules={[
                            {
                                required: true,
                                message: '¡Campo requerido!',
                            },
                        ]}
                    >
                        <DatePicker disabledDate={disabledDate} />
                    </Form.Item>

                    <Form.Item
                        label="Hora"
                        id="hora_reserva"
                        name="Hora"
                        rules={[
                            {
                                required: true,
                                message: '¡Campo requerido!',
                            },
                        ]}
                    >
                        <Select>
                            {[...Array(9).keys()].map(hour => {
                                const displayHour = hour + 9 >= 12 ? `${hour + 9 === 12 ? 12 : hour - 3}:00 P.M` : `${hour + 9}:00 A.M`;
                                return <Option key={hour} value={displayHour}>{displayHour}</Option>;
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Estado"
                        id="estado_reserva"
                        name="Estado"
                        rules={[
                            {
                                required: true,
                                message: '¡Campo requerido!',
                            },
                        ]}
                        validateStatus="success"
                        help=""
                    >
                        <Input defaultValue="A" disabled />
                    </Form.Item>

                    <Form.Item
                        label="Cliente"
                        id="fk_id_cliente"
                        name="Cliente"
                        rules={[
                            {
                                required: true,
                                message: '¡Campo requerido!',
                            },
                        ]}
                    >
                        <Select>
                            <Option value="demo1">Demo 1</Option>
                            <Option value="demo2">Demo 2</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Vehículo"
                        id="fk_id_vehiculo"
                        name="Vehiculo"
                        rules={[
                            {
                                required: true,
                                message: '¡Campo requerido!',
                            },
                        ]}
                    >
                        <Select>
                            <Option value="demo1">Demo 1</Option>
                            <Option value="demo2">Demo 2</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Empleado"
                        id="fk_id_empleado"
                        name="Empleado"
                        rules={[
                            {
                                required: true,
                                message: '¡Campo requerido!',
                            },
                        ]}
                    >
                        <Select>
                            <Option value="demo1">Demo 1</Option>
                            <Option value="demo2">Demo 2</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 6,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Registrar
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Rreserva;
