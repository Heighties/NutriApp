import React, { createContext, useState, useContext } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [fridge, setFridge] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);

  const addToFridge = (product) => {
    setFridge((prev) => [...prev, product]);
  };

  const addToShoppingList = (product) => {
    setShoppingList((prev) => [...prev, { ...product, checked: false }]);
  };

  const toggleCheck = (code) => {
    setShoppingList((prev) => {
      const updated = prev.map((item) =>
        item.code === code ? { ...item, checked: !item.checked } : item
      );
      const justChecked = updated.find((item) => item.code === code && item.checked);
      if (justChecked) {
        addToFridge(justChecked);
      }
      return updated.filter((item) => !(item.code === code && item.checked));
    });
  };

  return (
    <ProductContext.Provider
      value={{ fridge, shoppingList, addToFridge, addToShoppingList, toggleCheck }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
