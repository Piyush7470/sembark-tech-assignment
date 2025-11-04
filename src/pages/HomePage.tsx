import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Product } from '../types/Product';
import { getProducts } from '../api/api';
import { useStore } from '../utils/useStore';

const HomePage: React.FC = observer(() => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isFiltering, setIsFiltering] = useState<boolean>(false);
    const [cartLoading, setCartLoading] = useState<boolean>(false);
    const [showCart, setShowCart] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [categories, setCategories] = useState<string[]>([]);
    const { cartStore } = useStore();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
                setFilteredProducts(data);
                const uniqueCategories = Array.from(new Set(data.map(product => product.category)));
                setCategories(uniqueCategories);
            } catch (err) {
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = (product: Product) => {
        cartStore.addToCart(product);
    };

    useEffect(() => {
        const filterProducts = async () => {
            setIsFiltering(true);
            await new Promise(resolve => setTimeout(resolve, 300));
            let filtered = products;
            if (searchTerm) {
                filtered = filtered.filter(product =>
                    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            if (selectedCategory) {
                filtered = filtered.filter(product => product.category === selectedCategory);
            }
            setFilteredProducts(filtered);
            setIsFiltering(false);
        };
        filterProducts();
    }, [searchTerm, selectedCategory, products]);

    React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            .product-card { transition: transform 0.3s ease, box-shadow 0.3s ease !important; }
            .product-card:hover { transform: translateY(-5px) !important; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important; }
        `;
        document.head.appendChild(style);
        return () => { document.head.removeChild(style); };
    }, []);

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <h2 style={styles.loadingText}>Loading Products...</h2>
                <p style={styles.loadingSubtext}>Please wait while we fetch the products</p>
                <div style={styles.skeletonGrid}>
                    {[...Array(6)].map((_, index) => (
                        <div key={index} style={styles.skeletonCard}>
                            <div style={styles.skeletonImage} className="loading-shimmer"></div>
                            <div style={styles.skeletonTitle} className="loading-shimmer"></div>
                            <div style={styles.skeletonPrice} className="loading-shimmer"></div>
                            <div style={styles.skeletonButton} className="loading-shimmer"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorIcon}>⚠️</div>
                <h2 style={styles.errorTitle}>Oops! Something went wrong</h2>
                <p style={styles.errorText}>{error}</p>
                <button onClick={() => window.location.reload()} style={styles.retryButton}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <>
            {cartLoading && (
                <div style={styles.pageLoadingOverlay}>
                    <div style={styles.pageLoadingSpinner}></div>
                </div>
            )}
            <div style={styles.mainContainer}>
                <div style={styles.container}>
                    <h1 style={styles.title}>Product Listing</h1>

                    <div style={styles.filterContainer}>
                        <div style={styles.searchBox}>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>
                        <div style={styles.categoryFilter}>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                style={styles.categorySelect}
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {(searchTerm || selectedCategory) && (
                            <button
                                onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
                                style={styles.clearButton}
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>

                    <div style={styles.resultsCount}>
                        {isFiltering ? (
                            <span style={styles.filteringText}>🔍 Filtering products...</span>
                        ) : (
                            `Showing ${filteredProducts.length} of ${products.length} products`
                        )}
                    </div>

                    <div style={styles.grid}>
                        {isFiltering && (
                            <div style={styles.filteringOverlay}>
                                <div style={styles.filteringSpinner}></div>
                            </div>
                        )}
                        {filteredProducts.map((product, index) => (
                            <div
                                key={product.id}
                                style={{
                                    ...styles.productCard,
                                    animation: 'fadeIn 0.6s ease-in-out',
                                    animationDelay: `${index * 0.1}s`,
                                }}
                                className="product-card"
                                data-testid="product-card"
                            >
                                <img src={product.image} alt={product.title} style={styles.productImage} />
                                <div style={styles.productInfo}>
                                    <h2 style={styles.productTitle}>{product.title}</h2>
                                    <p style={styles.productPrice}>${product.price.toFixed(2)}</p>
                                    <div style={styles.buttonContainer}>
                                        <Link to={`/product/${product.id}/details`} style={styles.viewButton}>
                                            View Details
                                        </Link>
                                        <button
                                            onClick={async () => {
                                                setCartLoading(true);
                                                await new Promise(resolve => setTimeout(resolve, 300));
                                                handleAddToCart(product);
                                                setCartLoading(false);
                                            }}
                                            style={styles.addToCartButton}
                                            disabled={cartLoading}
                                        >
                                            {cartLoading ? 'Adding...' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && !isFiltering && (
                        <div style={styles.noResults}>
                            <h3>No products found matching your criteria</h3>
                            <p>Try adjusting your search or filter settings</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setShowCart(!showCart)}
                    style={styles.cartToggleButton}
                >
                    🛒
                    {cartStore.cartCount > 0 && (
                        <span style={styles.cartCountBadge}>{cartStore.cartCount}</span>
                    )}
                </button>

                <div
                    style={{
                        ...styles.cartSidebar,
                        transform: showCart ? 'translateX(0)' : 'translateX(100%)',
                    }}
                >
                    <div style={styles.cartHeader}>
                        <h3>My Cart</h3>
                        <button onClick={() => setShowCart(false)} style={styles.closeButton}>×</button>
                    </div>
                    <div style={styles.cartItems}>
                        {cartStore.cartItems.length === 0 ? (
                            <p style={styles.emptyCart}>Your cart is empty</p>
                        ) : (
                            cartStore.cartItems.map((item) => (
                                <div key={item.product.id} style={styles.cartItem}>
                                    <img src={item.product.image} alt={item.product.title} style={styles.cartItemImage} />
                                    <div style={styles.cartItemDetails}>
                                        <h4 style={styles.cartItemTitle}>{item.product.title}</h4>
                                        <p style={styles.cartItemPrice}>
                                            ${item.product.price.toFixed(2)} x {item.quantity}
                                        </p>
                                        <div style={styles.quantityControl}>
                                            <button onClick={() => cartStore.decrementQuantity(item.product.id)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => cartStore.incrementQuantity(item.product.id)}>+</button>
                                        </div>
                                        <p style={styles.cartItemTotal}>
                                            Total: ${(item.product.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => cartStore.removeFromCart(item.product.id)}
                                        style={styles.removeButton}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    {cartStore.cartItems.length > 0 && (
                        <div style={styles.cartFooter}>
                            <div style={styles.cartTotal}>
                                <strong>Total: ${cartStore.cartTotal.toFixed(2)}</strong>
                            </div>
                            <Link to="/cart" style={styles.checkoutButton}>
                                Go to Checkout
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
});

const styles = {
    mainContainer: {
        position: 'relative' as const,
        minHeight: '100vh',
    },
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        paddingRight: '80px',
    },
    title: {
        textAlign: 'center' as const,
        marginBottom: '30px',
        color: '#333',
    },
    filterContainer: {
        display: 'flex',
        gap: '15px',
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        alignItems: 'center',
        flexWrap: 'wrap' as const,
    },
    searchBox: {
        flex: 1,
        minWidth: '250px',
    },
    searchInput: {
        width: '100%',
        padding: '10px 15px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
    },
    categoryFilter: {
        minWidth: '200px',
    },
    categorySelect: {
        width: '100%',
        padding: '10px 15px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
        backgroundColor: '#fff',
    },
    clearButton: {
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    resultsCount: {
        textAlign: 'center' as const,
        marginBottom: '20px',
        color: '#666',
        fontSize: '14px',
    },
    noResults: {
        textAlign: 'center' as const,
        padding: '50px',
        color: '#666',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        position: 'relative' as const,
    },
    productCard: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        textAlign: 'center' as const,
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    productImage: {
        width: '100%',
        height: '200px',
        objectFit: 'contain' as const,
        marginBottom: '10px',
    },
    productInfo: {
        marginTop: '10px',
    },
    productTitle: {
        fontSize: '16px',
        marginBottom: '5px',
        color: '#333',
        height: '40px',
        overflow: 'hidden',
        textOverflow: 'ellipsis' as const,
    },
    productPrice: {
        fontSize: '18px',
        fontWeight: 'bold' as const,
        color: '#007bff',
        marginBottom: '10px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px',
    },
    viewButton: {
        padding: '8px 12px',
        backgroundColor: '#007bff',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '4px',
        fontSize: '14px',
    },
    addToCartButton: {
        padding: '8px 12px',
        backgroundColor: '#ff9800',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '14px',
        cursor: 'pointer',
    },
    cartToggleButton: {
        position: 'fixed' as const,
        top: '20px',
        right: '20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        zIndex: 1000,
    },
    cartCountBadge: {
        position: 'absolute' as const,
        top: '0px',
        right: '0px',
        backgroundColor: '#dc3545',
        color: 'white',
        borderRadius: '50%',
        padding: '2px 6px',
        fontSize: '12px',
        fontWeight: 'bold' as const,
        border: '2px solid white',
    },
    cartSidebar: {
        position: 'fixed' as const,
        top: 0,
        right: 0,
        width: '350px',
        height: '100vh',
        backgroundColor: '#fff',
        boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
        zIndex: 1001,
        transition: 'transform 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column' as const,
    },
    cartHeader: {
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#6c757d',
    },
    cartItems: {
        flex: 1,
        overflowY: 'auto' as const,
        padding: '20px',
    },
    emptyCart: {
        textAlign: 'center' as const,
        color: '#6c757d',
        marginTop: '50px',
    },
    cartItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '15px 0',
        borderBottom: '1px solid #eee',
    },
    cartItemImage: {
        width: '50px',
        height: '50px',
        objectFit: 'contain' as const,
        marginRight: '15px',
    },
    cartItemDetails: {
        flex: 1,
    },
    cartItemTitle: {
        fontSize: '14px',
        margin: '0 0 5px 0',
        color: '#333',
    },
    cartItemPrice: {
        fontSize: '12px',
        color: '#666',
        margin: '0 0 2px 0',
    },
    cartItemTotal: {
        fontSize: '12px',
        color: '#007bff',
        fontWeight: 'bold' as const,
        margin: 0,
    },
    quantityControl: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    },
    removeButton: {
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '5px 10px',
        fontSize: '12px',
        cursor: 'pointer',
    },
    cartFooter: {
        padding: '20px',
        borderTop: '1px solid #dee2e6',
        backgroundColor: '#f8f9fa',
    },
    cartTotal: {
        textAlign: 'center' as const,
        marginBottom: '15px',
        fontSize: '18px',
        color: '#333',
    },
    checkoutButton: {
        display: 'block',
        width: '100%',
        padding: '12px',
        backgroundColor: '#28a745',
        color: '#fff',
        textAlign: 'center' as const,
        textDecoration: 'none',
        borderRadius: '4px',
        fontSize: '16px',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
    },
    loadingSpinner: {
        width: '60px',
        height: '60px',
        border: '6px solid #f3f3f3',
        borderTop: '6px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px',
    },
    loadingText: {
        fontSize: '24px',
        color: '#333',
        marginBottom: '10px',
        fontWeight: '600',
    },
    loadingSubtext: {
        fontSize: '16px',
        color: '#666',
        marginBottom: '20px',
    },
    skeletonGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        width: '100%',
        padding: '0 20px',
        maxWidth: '1200px',
        margin: '20px auto',
    },
    skeletonCard: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    skeletonImage: {
        width: '100%',
        height: '180px',
        marginBottom: '15px',
        borderRadius: '4px',
    },
    skeletonTitle: {
        width: '80%',
        height: '24px',
        marginBottom: '10px',
        borderRadius: '4px',
    },
    skeletonPrice: {
        width: '40%',
        height: '20px',
        marginBottom: '15px',
        borderRadius: '4px',
    },
    skeletonButton: {
        width: '100%',
        height: '38px',
        borderRadius: '4px',
    },
    errorContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#fff5f5',
        padding: '20px',
    },
    errorIcon: {
        fontSize: '64px',
        marginBottom: '20px',
        color: '#e74c3c',
    },
    errorTitle: {
        fontSize: '24px',
        color: '#c0392b',
        marginBottom: '10px',
        fontWeight: '600',
    },
    errorText: {
        fontSize: '16px',
        color: '#e74c3c',
        marginBottom: '20px',
        textAlign: 'center' as const,
        maxWidth: '400px',
    },
    retryButton: {
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '6px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        fontWeight: '600',
    },
    filteringText: {
        color: '#3498db',
        fontWeight: '500',
    },
    filteringOverlay: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        borderRadius: '8px',
    },
    filteringSpinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    pageLoadingOverlay: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
    pageLoadingSpinner: {
        width: '50px',
        height: '50px',
        border: '5px solid rgba(255, 255, 255, 0.3)',
        borderTop: '5px solid #ffffff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    loading: {
        textAlign: 'center' as const,
        fontSize: '20px',
        marginTop: '50px',
    },
    error: {
        textAlign: 'center' as const,
        fontSize: '20px',
        color: 'red',
        marginTop: '50px',
    },
} as const;

export default HomePage;
