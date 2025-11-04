import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../utils/useStore';
import { Link } from 'react-router-dom';

const CartPage: React.FC = observer(() => {
  const { cartStore } = useStore();

  const handleRemoveFromCart = (productId: number) => {
    cartStore.removeFromCart(productId);
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      cartStore.removeFromCart(productId);
    } else {
      cartStore.updateQuantity(productId, quantity);
    }
  };

  if (cartStore.cartItems.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Your Cart is Empty</h2>
        <p>Start shopping to add items to your cart!</p>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Shopping Cart</h2>
      <div style={{ marginTop: '20px' }}>
        {cartStore.cartItems.map((item) => (
          <div key={item.product.id} style={styles.cartItem}>
            <img 
              src={item.product.image} 
              alt={item.product.title}
              style={styles.productImage}
            />
            <div style={styles.itemDetails}>
              <h3 style={styles.productTitle}>{item.product.title}</h3>
              <p style={styles.productPrice}>${item.product.price.toFixed(2)}</p>
              <div style={styles.quantityControls}>
                <button
                  onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                  style={styles.quantityButton}
                >
                  -
                </button>
                <input
                  type="text"
                  value={item.quantity}
                  style={styles.quantity}
                  data-testid="quantity-input"
                  readOnly
                />
                <button
                  onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                  style={styles.quantityButton}
                  data-testid="update-quantity"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemoveFromCart(item.product.id)}
                style={styles.removeButton}
                data-testid="remove-item"
              >
                Remove
              </button>
            </div>
            <div style={styles.itemTotal}>
              ${(item.product.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div style={styles.cartSummary}>
        <h3>Order Summary</h3>
        <div style={styles.summaryRow}>
          <span>Items ({cartStore.cartCount}):</span>
          <span>${cartStore.cartTotal.toFixed(2)}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div style={{...styles.summaryRow, ...styles.totalRow}}>
          <span>Total:</span>
          <span style={styles.totalAmount}>${cartStore.cartTotal.toFixed(2)}</span>
        </div>
        <button style={styles.checkoutButton}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
});

const styles = {
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
  productImage: {
    width: '80px',
    height: '80px',
    objectFit: 'contain' as const,
    marginRight: '15px',
  },
  itemDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  productTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'bold',
  },
  productPrice: {
    margin: 0,
    color: '#666',
    fontSize: '14px',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  quantityButton: {
    width: '30px',
    height: '30px',
    border: '1px solid #ddd',
    backgroundColor: '#f8f9fa',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '16px',
  },
  quantity: {
    fontWeight: 'bold',
    minWidth: '20px',
    textAlign: 'center' as const,
  },
  removeButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    alignSelf: 'flex-start',
  },
  itemTotal: {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#28a745',
    minWidth: '80px',
    textAlign: 'right' as const,
  },
  cartSummary: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    fontSize: '14px',
  },
  totalRow: {
    fontSize: '18px',
    fontWeight: 'bold',
    borderTop: '2px solid #333',
    paddingTop: '10px',
    marginTop: '10px',
  },
  totalAmount: {
    color: '#28a745',
  },
  checkoutButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '15px',
  },
};

export default CartPage;