import { useCart } from "@/context/cartContext";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import Cart from "./Cart";

const FloatingSummaryBar = () => {
  const { cart } = useCart();
  const [open, setOpen] = useState(false);

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateGST = (total) => {
    return total * 0.08; // GST at 8%
  };

  const total = getTotalPrice();
  const gst = calculateGST(total);
  const totalWithGST = total + gst;
  const totalItems = getTotalItems();

  if (cart.length === 0) {
    return null; // Do not render the floating summary bar if the cart is empty
  }

  return (
    <>
      <div
        className="fixed bottom-16 right-4 bg-lightBrandOrange dark:bg-brandOrange text-brandBlack dark:text-brandWhite p-4 shadow-lg rounded-full flex items-center cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <FaShoppingCart className="mr-2" />
        <div>
          <p>
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </p>
          <p>{totalWithGST.toFixed(2)} Rf</p>
        </div>
      </div>

      <Cart isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default FloatingSummaryBar;
