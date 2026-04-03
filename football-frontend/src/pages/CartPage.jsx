import { useCart } from '../context/CartContext';

const CartPage = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
  } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    alert('Order placed successfully!');
    clearCart();
  };

  const handleQuantityChange = (id, delta) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQty);
    }
  };

  return (
    <div className="page cart-page">
      <h1>Your Cart</h1>
      {items.length === 0 ? (
        <p className="page-subtitle">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="cart-item-image"
                  />
                )}
                <div className="cart-item-info">
                  <h2 className="cart-item-title">{item.name}</h2>
                  <p className="cart-item-price">Price: {item.price}</p>
                  <div className="cart-item-quantity">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-summary-row">
              <span>Total:</span>
              <span>{totalPrice.toFixed(2)}</span>
            </div>
            <button
              type="button"
              className="button-primary cart-checkout-button"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;