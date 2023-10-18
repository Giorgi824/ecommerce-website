import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [itemAmount, setItemAmount] = useState(0);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (cart) {
      const { amount, totalPrice = 0 } = cart.reduce((acc, curr) => {
        return {
          amount: acc + curr.amount,
          totalPrice: acc + curr.amount * curr.price,
        };
      }, 0);
      console.log(totalPrice);
      setTotal(parseFloat(totalPrice).toFixed(2));
      setItemAmount(amount);
    }
  }, [cart]);
  // add to cart
  function addToCart(product, id) {
    const newItem = { ...product, amount: 1 };
    // check if the item is already in the cart
    const cartItem = cart.find((item) => {
      return item.id === id;
    });
    // if cart item is alreaty in the list
    if (cartItem) {
      const newCart = cart.map((item) => {
        if (item.id === id) {
          return { ...item, amount: cartItem.amount + 1 };
        } else {
          return item;
        }
      });
      setCart(() => newCart);
    } else {
      setCart((prev) => [...prev, newItem]);
    }
  }
  //remove from cart
  function removeFromCart(id) {
    const newCart = cart.filter((item) => {
      return item.id !== id;
    });
    setCart(newCart);
  }
  // clear cart
  function clearCart() {
    setCart(() => []);
  }
  // increase amount
  function increaseAmount(id) {
    const cartItem = cart.find((item) => item.id === id);
    addToCart(cartItem, id);
  }
  // decrease amount
  function decreaseAmount(id) {
    const cartItem = cart.find((item) => item.id === id);
    if (cartItem) {
      const newCart = cart.map((item) => {
        if (item.id === id) {
          return { ...item, amount: cartItem.amount - 1 };
        } else {
          return item;
        }
      });
      setCart(newCart);
    }
    if (cartItem.amount < 2) {
      removeFromCart(id);
    }
  }
  return (
    <CartContext.Provider
      value={{
        addToCart,
        cart,
        removeFromCart,
        clearCart,
        increaseAmount,
        decreaseAmount,
        itemAmount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
