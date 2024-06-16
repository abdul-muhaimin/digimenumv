// Cart.js
import { useState } from 'react';
import { useCart } from '@/context/cartContext';
import { FaTrash, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

const Cart = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateGST = (total) => {
    return total * 0.08; // GST at 8%
  };

  const total = getTotalPrice();
  const gst = calculateGST(total);
  const totalWithGST = total + gst;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end">
      <div className="bg-white dark:bg-gray-900 p-4 shadow-lg text-black dark:text-white rounded-t-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Your Cart</h2>
          <FaTimes className="cursor-pointer text-2xl" onClick={onClose} />
        </div>
        <div className="mb-4 p-4 bg-blue-100 dark:bg-blue-900 text-black dark:text-white rounded-md">
          <p className="text-sm">Here you can see your selected items. Use this to help you in the ordering process.</p>
        </div>
        {cart.length === 0 ? (
          <p className="text-center">Your cart is empty</p>
        ) : (
          <div className="overflow-y-auto max-h-96">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-4 border-b pb-2">
                <div>
                  <h3 className="text-md">{item.name}</h3>
                  <p className="text-sm">{item.price} Rf x {item.quantity}</p>
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" className="p-1" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button variant="ghost" className="p-1" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                  <FaTrash onClick={() => removeFromCart(item.id)} className="ml-4 cursor-pointer text-red-600" />
                </div>
              </div>
            ))}
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between">
                <p>Total:</p>
                <p>{total} Rf</p>
              </div>
              <div className="flex justify-between">
                <p>GST (8%):</p>
                <p>{gst.toFixed(2)} Rf</p>
              </div>
              <div className="flex justify-between font-bold">
                <p>Total with GST:</p>
                <p>{totalWithGST.toFixed(2)} Rf</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
