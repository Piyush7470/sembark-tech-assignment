import { makeAutoObservable, reaction } from 'mobx';
import { Product } from '../types/Product';

interface CartItem {
    product: Product;
    quantity: number;
}

class CartStore {
    cartItems: CartItem[] = [];

    constructor() {
        makeAutoObservable(this);
        const savedCart = sessionStorage.getItem('cart');
        if (savedCart) {
            this.cartItems = JSON.parse(savedCart);
        }

        reaction(
            () => this.cartItems.slice(),
            (items) => {
                sessionStorage.setItem('cart', JSON.stringify(items));
            }
        );
    }

    addToCart(product: Product) {
        const existingItem = this.cartItems.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cartItems.push({ product, quantity: 1 });
        }
    }

    removeFromCart(productId: number) {
        this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    }

    updateQuantity(productId: number, quantity: number) {
        const item = this.cartItems.find(item => item.product.id === productId);
        if (item) {
            if (quantity > 0) {
                item.quantity = quantity;
            } else {
                this.removeFromCart(productId);
            }
        }
    }

    incrementQuantity(productId: number) {
        const item = this.cartItems.find(item => item.product.id === productId);
        if (item) {
            item.quantity += 1;
        }
    }

    decrementQuantity(productId: number) {
        const item = this.cartItems.find(item => item.product.id === productId);
        if (item && item.quantity > 1) {
            item.quantity -= 1;
        } else if (item && item.quantity === 1) {
            this.removeFromCart(productId);
        }
    }

    get cartCount() {
        return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    }

    get cartTotal() {
        return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }
}

const cartStore = new CartStore();
export default cartStore;