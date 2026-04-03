import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'cart';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + (product.quantity || 1),
        };
        return updated;
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    const q = Math.max(1, Number(quantity) || 1);
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: q } : p))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);