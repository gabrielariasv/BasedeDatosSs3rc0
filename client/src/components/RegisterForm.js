// src/components/RegisterForm.js
import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;
const SuccessMessage = styled.p`
  color: green;
  margin-top: 10px;
`;


const RegisterForm = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [permission, setPermission] = useState(0); // Por defecto, Lectura (0)
    const [successMessage, setSuccessMessage] = useState(''); // Estado para el mensaje de éxito

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/register', { username, password, permission });
            setSuccessMessage('Usuario registrado con éxito');
            setUsername('');
            setPassword('');
            setPermission(0); // Resetear a Lectura (0)
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error(error);
            alert('Hubo un error al registrar el usuario');
        }
    };

    return (
        <FormContainer>
            <Form onSubmit={handleSubmit}>
                <Label>Nombre de usuario</Label>
                <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <Label>Contraseña</Label>
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Label>Permiso</Label>
                <Select
                    value={permission}
                    onChange={(e) => setPermission(Number(e.target.value))}
                    required
                >
                    <option value={0}>Lectura</option>
                    <option value={1}>Modificar</option>
                    <option value={2}>Administrador</option>
                </Select>
                <Button type="submit">Registrar</Button>
            </Form>
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>} {/* Mostrar el mensaje si existe */}
        </FormContainer>
    );
};

export default RegisterForm;
