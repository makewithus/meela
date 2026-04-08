import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("meelaCart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart:", e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("meelaCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const openBuyModal = () => setIsBuyModalOpen(true);
  const closeBuyModal = () => setIsBuyModalOpen(false);

  const openCheckout = () => {
    setIsCheckoutOpen(true);
    closeBuyModal(); // Close buy modal when opening checkout
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + (product.qty || 1) }
            : item,
        );
      }
      return [...prev, { ...product, qty: product.qty || 1 }];
    });
  };

  const updateQty = (productId, qty) => {
    if (qty < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          // For meela-hair-oil, adjust price based on quantity
          if (item.id === "meela-hair-oil") {
            // 1 bottle = AED 55, 2 bottles = AED 47.50 each, 3 bottles = AED 41.67 each
            const newPrice = qty === 1 ? 55 : qty === 2 ? 47.5 : 41.67;
            return { ...item, qty: Math.max(1, qty), price: newPrice };
          }
          return { ...item, qty: Math.max(1, qty) };
        }
        return item;
      }),
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCartItems([]);

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.qty, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  return (
    <CartContext.Provider
      value={{
        isBuyModalOpen,
        openBuyModal,
        closeBuyModal,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        cartItems,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
