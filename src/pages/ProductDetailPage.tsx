import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Product } from '../types/Product';
import { getProductById } from '../api/api';
import { useStore } from '../utils/useStore';

const ProductDetailPage: React.FC = observer(() => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { cartStore } = useStore();

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (err) {
                setError('Failed to fetch product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            cartStore.addToCart(product);
        }
    };

    const handleGoBack = () => {
        navigate('/');
    };

    if (loading) return <div style={styles.loading}>Loading...</div>;
    if (error) return <div style={styles.error}>{error}</div>;
    if (!product) return <div style={styles.error}>Product not found</div>;

    return (
        <div style={styles.container}>
            <button onClick={handleGoBack} style={styles.backButton}>Back to Home</button>
            <div style={styles.productContainer}>
                <img src={product.image} alt={product.title} style={styles.productImage} />
                <div style={styles.productDetails}>
                    <h1 style={styles.productTitle}>{product.title}</h1>
                    <p style={styles.productCategory}>Category: {product.category}</p>
                    <p style={styles.productPrice}>${product.price.toFixed(2)}</p>
                    <p style={styles.productDescription}>{product.description}</p>
                    <button onClick={handleAddToCart} style={styles.addToCartButton}>
                        Add to MyCart
                    </button>
                </div>
            </div>
        </div>
    );
});

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    backButton: {
        padding: '10px 15px',
        backgroundColor: '#6c757d',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '20px',
    },
    productContainer: {
        display: 'flex',
        flexDirection: 'row' as const,
        gap: '30px',
        alignItems: 'flex-start',
    },
    productImage: {
        width: '300px',
        height: '300px',
        objectFit: 'contain' as const,
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '10px',
    },
    productDetails: {
        flex: 1,
    },
    productTitle: {
        fontSize: '24px',
        marginBottom: '10px',
        color: '#333',
    },
    productCategory: {
        fontSize: '16px',
        color: '#666',
        marginBottom: '10px',
    },
    productPrice: {
        fontSize: '22px',
        fontWeight: 'bold' as const,
        color: '#007bff',
        marginBottom: '15px',
    },
    productDescription: {
        fontSize: '16px',
        lineHeight: '1.5',
        color: '#555',
        marginBottom: '20px',
    },
    addToCartButton: {
        padding: '12px 20px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
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
};

export default ProductDetailPage;