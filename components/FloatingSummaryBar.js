// FloatingSummaryBar.js
import { useCart } from '@/context/cartContext';
import { useState } from 'react';
import Cart from './Cart';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { FaShoppingCart } from 'react-icons/fa';

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
    <div className="fixed bottom-16 right-4 bg-white dark:bg-gray-900 p-4 shadow-lg rounded-full flex items-center cursor-pointer" onClick={() => setOpen(true)}>
      <FaShoppingCart className="mr-2" />
      <div>
        <p>{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
        <p>{totalWithGST.toFixed(2)} Rf</p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cart</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <Cart />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FloatingSummaryBar;
