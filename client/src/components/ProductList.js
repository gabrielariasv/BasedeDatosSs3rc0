// src/components/ProductList.js
import React, { useState } from 'react';
import styled from 'styled-components';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #007bff;
  color: white;
`;

const TableHeaderCell = styled.th`
  padding: 10px;
  border: 1px solid #ddd;
`;

const TableBody = styled.tbody`
  background-color: #fff;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  margin: 0 5px;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0;
`;

const PaginationButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  margin: 0 5px;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
  }
`;

const ProductList = ({
  products,
  currentPage,
  setCurrentPage,
  totalPages,
  updateProductUnits,
  handleAddUnits,
  handleDeleteProduct,
  permission
}) => {
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  const confirmDelete = (id) => {
    setProductIdToDelete(id);
  };

  const cancelDelete = () => {
    setProductIdToDelete(null);
  };

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>ID</TableHeaderCell>
            <TableHeaderCell>Nombre</TableHeaderCell>
            <TableHeaderCell>Unidades</TableHeaderCell>
            <TableHeaderCell>Precios</TableHeaderCell>
            {permission > 0 && <TableHeaderCell>Acciones</TableHeaderCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map(product => (
            <TableRow key={product._id}>
              <TableCell>{product.id_producto}</TableCell>
              <TableCell>{product.Nombre}</TableCell>
              <TableCell>{product.unidades}</TableCell>
              <TableCell>{product.Precio}</TableCell>
              {permission > 0 && (
                <TableCell>
                  <Button onClick={() => updateProductUnits(product._id, -1)} disabled={product.unidades <= 0}>-</Button>
                  <Button onClick={() => updateProductUnits(product._id, 1)}>+</Button>
                  <input
                    type="number"
                    placeholder="Añadir/Eliminar Unidades"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddUnits(product._id, Number(e.target.value));
                        e.target.value = '';
                      }
                    }}
                  />
                  {permission === 2 && (
                    <>
                      <Button onClick={() => confirmDelete(product._id)}>Eliminar</Button>
                      {productIdToDelete === product._id && (
                        <div>
                          <p>¿Estás seguro de que quieres eliminar este producto?</p>
                          <Button onClick={() => handleDeleteProduct(product._id)}>Sí</Button>
                          <Button onClick={cancelDelete}>No</Button>
                        </div>
                      )}
                    </>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination>
        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationButton key={i + 1} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </PaginationButton>
        ))}
      </Pagination>
    </div>
  );
};

export default ProductList;
