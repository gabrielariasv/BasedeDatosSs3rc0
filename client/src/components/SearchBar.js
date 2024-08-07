// src/components/SearchBar.js
import React from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
`;

const ToggleButton = styled.button`
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
`;

const SearchBar = ({ toggleSearch, setToggleSearch, searchByName, setSearchByName, searchByCode, setSearchByCode, fetchProducts }) => {
    return (
        <SearchContainer>
            {toggleSearch === 'name' ? (
                <>
                    <Input
                        type="text"
                        placeholder="Buscar por Nombre"
                        value={searchByName}
                        onChange={(e) => setSearchByName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
                    />
                    <ToggleButton onClick={() => setToggleSearch('code')}>Buscar por código</ToggleButton>
                </>
            ) : (
                <>
                    <Input
                        type="text"
                        placeholder="Buscar por código"
                        value={searchByCode}
                        onChange={(e) => setSearchByCode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
                    />
                    <ToggleButton onClick={() => setToggleSearch('name')}>Buscar por Nombre</ToggleButton>
                </>
            )}
        </SearchContainer>
    );
};

export default SearchBar;
