// Cart.js
import { useCart } from '@/context/cartContext';
import { FaTrash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

const Cart = () => {
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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 p-4 shadow-lg text-black dark:text-white">
      <h2 className="text-xl mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-md">{item.name}</h3>
                <p className="text-sm">{item.price} MVR x {item.quantity}</p>
              </div>
              <div className="flex items-center">
                <Button variant="ghost" className="p-1" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                <span className="mx-2">{item.quantity}</span>
                <Button variant="ghost" className="p-1" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                <FaTrash onClick={() => removeFromCart(item.id)} className="ml-4 cursor-pointer text-red-600" />
              </div>
            </div>
          ))}
          <div className="text-right">
            <p>Total: {total} MVR</p>
            <p>GST (8%): {gst.toFixed(2)} MVR</p>
            <p>Total with GST: {totalWithGST.toFixed(2)} MVR</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
