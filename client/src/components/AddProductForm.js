// src/components/AddProductForm.js
import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  margin-top: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const AddProductForm = ({ onAddProduct }) => {
    const [newProduct, setNewProduct] = useState({
        id_producto: '',
        Nombre: '',
        unidades: '',
        Precio: '',
    });

    const handleChange = (e) => {
        setNewProduct({
            ...newProduct,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddProduct(newProduct);
        setNewProduct({ id_producto: '', Nombre: '', unidades: '', Precio: '' });
    };

    return (
        <FormContainer>
            <h3>Añadir Nuevo Producto</h3>
            <Form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    name="id_producto"
                    placeholder="ID de Producto"
                    value={newProduct.id_producto}
                    onChange={handleChange}
                />
                <Input
                    type="text"
                    name="Nombre"
                    placeholder="Nombre de Producto"
                    value={newProduct.Nombre}
                    onChange={handleChange}
                />
                <Input
                    type="number"
                    name="unidades"
                    placeholder="Unidades"
                    value={newProduct.unidades}
                    onChange={handleChange}
                />
                <Input
                    type="number"
                    name="Precio"
                    placeholder="Precio"
                    value={newProduct.Precio}
                    onChange={handleChange}
                />
                <Button type="submit">Añadir Producto</Button>
            </Form>
        </FormContainer>
    );
};

export default AddProductForm;
