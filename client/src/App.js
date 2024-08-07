import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import axios from './axiosConfig';
import ProductList from './components/ProductList';
import SearchBar from './components/SearchBar';
import AddProductForm from './components/AddProductForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { useNavigate, Route, Routes, Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f9;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
`;

const AppContainer = styled.div`
  width: 90%;
  max-width: 800px;
  margin: auto;
  background: #fff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
`;

const LogoutButton = styled.button`
  align-self: flex-end;
  padding: 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background-color: #c82333;
  }
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const NavLink = styled(Link)`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  margin-bottom: 20px;
  &:hover {
    background-color: #0056b3;
  }
`;

const App = () => {
    const [products, setProducts] = useState([]);
    const [searchByName, setSearchByName] = useState('');
    const [searchByCode, setSearchByCode] = useState('');
    const [toggleSearch, setToggleSearch] = useState('name');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [permission, setPermission] = useState(null);
    const navigate = useNavigate(); // Usar useNavigate

    const handleLogout = () => {
        localStorage.removeItem('token');
        setPermission(null);
        navigate('/login');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setPermission(decodedToken.permission);
        }
    }, []);

    useEffect(() => {
        if (permission !== null) {
            fetchProducts(currentPage);
        }
    }, [searchByName, searchByCode, currentPage, permission]);

    const fetchProducts = async (page = 1) => {
        const params = {
            page,
            limit: 10,
            nombre: toggleSearch === 'name' ? searchByName : undefined,
            id_producto: toggleSearch === 'code' ? searchByCode : undefined,
        };
        try {
            const response = await axios.get('/products', { params, headers: { Authorization: localStorage.getItem('token') } });
            setProducts(response.data.products);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
        } catch (error) {
            console.error(error);
        }
    };

    const updateProductUnits = async (id, change) => {
        const product = products.find(p => p._id === id);
        if (!product) return;

        const newUnits = product.unidades + change;
        if (newUnits < 0) return;

        try {
            await axios.patch(`/products/${id}/unidades`, { unidades: change }, { headers: { Authorization: localStorage.getItem('token') } });
            setProducts(products.map(p => p._id === id ? { ...p, unidades: newUnits } : p));
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddUnits = async (id, units) => {
        try {
            await axios.patch(`/products/${id}/unidades`, { unidades: units }, { headers: { Authorization: localStorage.getItem('token') } });
            fetchProducts(currentPage);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddProduct = async (newProduct) => {
        try {
            await axios.post('/products', newProduct, { headers: { Authorization: localStorage.getItem('token') } });
            fetchProducts(currentPage);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`/products/${id}`, { headers: { Authorization: localStorage.getItem('token') } });
            fetchProducts(currentPage);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogin = (permission) => {
        setPermission(permission);
    };

    if (permission === null) {
        return <LoginForm onLogin={handleLogin} />;
    }

    return (
        <>
            <GlobalStyle />
            <AppContainer>
                <NavBar>
                    <LogoutButton onClick={handleLogout}>Salir</LogoutButton>
                    {permission === 2 && <NavLink to="/register">Registrar Usuario</NavLink>}
                </NavBar>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <Title>Inventario de Productos Soserco</Title>
                                <SearchBar
                                    toggleSearch={toggleSearch}
                                    setToggleSearch={setToggleSearch}
                                    searchByName={searchByName}
                                    setSearchByName={setSearchByName}
                                    searchByCode={searchByCode}
                                    setSearchByCode={setSearchByCode}
                                    fetchProducts={fetchProducts}
                                />
                                <ProductList
                                    products={products}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    totalPages={totalPages}
                                    updateProductUnits={updateProductUnits}
                                    handleAddUnits={handleAddUnits}
                                    handleDeleteProduct={handleDeleteProduct}
                                    permission={permission} // Pasar permisos a ProductList
                                />
                                {permission === 2 && <AddProductForm onAddProduct={handleAddProduct} />}
                            </>
                        }
                    />
                    {permission === 2 && (
                        <Route path="/register" element={<RegisterForm />} />
                    )}
                </Routes>
            </AppContainer>
        </>
    );
};

export default App;
