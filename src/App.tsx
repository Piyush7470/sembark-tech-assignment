import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { storeContext } from './store';
import cartStore from './store/CartStore';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import Footer from './components/Footer';

const App: React.FC = () => {
    return (
        <storeContext.Provider value={{ cartStore }}>
            <Router>
                <div style={{ paddingBottom: '60px' }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/product/:id/details" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                    </Routes>
                </div>
                <Footer />
            </Router>
        </storeContext.Provider>
    );
};

export default App;
