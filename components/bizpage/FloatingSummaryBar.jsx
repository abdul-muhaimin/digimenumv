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
        className="fixed bottom-0 left-0 right-0 bg-lightBrandOrange dark:bg-brandOrange text-brandBlack dark:text-brandWhite p-4 shadow-lg flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center">
          <FaShoppingCart className="mr-2" />
          <div>
            <p>
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </p>
            <p>{totalWithGST.toFixed(2)} Rf</p>
          </div>
        </div>
        <div>
          <button
            className="bg-brandBlack dark:bg-brandWhite text-white dark:text-black px-4 py-2 rounded"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            View Selection
          </button>
        </div>
      </div>

      <Cart isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default FloatingSummaryBar;
