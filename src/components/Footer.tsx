import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.footerContent}>
                <span>© 2024 Sembarks. All rights reserved.</span>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#343a40',
        color: '#fff',
        padding: '15px 20px',
        textAlign: 'center' as const,
        position: 'fixed' as const,
        bottom: 0,
        left: 0,
        right: 0,
    },
    footerContent: {
        maxWidth: '1200px',
        margin: '0 auto',
    },
};

export default Footer;