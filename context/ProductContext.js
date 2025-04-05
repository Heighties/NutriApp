import React, { createContext, useContext, useState } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [fridge, setFridge] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);

  const addToFridge = (product) => {
    setFridge((prev) => {
      const existing = prev.find((p) => p.code === product.code);
      if (existing) {
        return prev.map((p) =>
          p.code === product.code ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeOneFromFridge = (code) => {
    setFridge((prev) => {
      const product = prev.find((p) => p.code === code);
      if (!product) return prev;
      if (product.quantity > 1) {
        return prev.map((p) =>
          p.code === code ? { ...p, quantity: p.quantity - 1 } : p
        );
      } else {
        return prev.filter((p) => p.code !== code);
      }
    });
  };

  const addToShoppingList = (product) => {
    setShoppingList((prev) => {
      const existing = prev.find((p) => p.code === product.code);
      if (existing) {
        return prev.map((p) =>
          p.code === product.code ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const toggleCheck = (code) => {
    setShoppingList((prev) => {
      const updated = prev.map((item) =>
        item.code === code ? { ...item, checked: !item.checked } : item
      );
      const checkedItem = updated.find((item) => item.code === code && item.checked);
      if (checkedItem) {
        addToFridge(checkedItem);
      }
      return updated.filter((item) => !(item.code === code && item.checked));
    });
  };

  return (
    <ProductContext.Provider
      value={{ fridge, shoppingList, addToFridge, removeOneFromFridge, addToShoppingList, toggleCheck }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
