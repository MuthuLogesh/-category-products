import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductsByCategory, clearProducts } from '../store/productsSlice';
import './ProductsPage.css';

const ProductsPage = () => {
    const { categoryId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: products, status } = useSelector(state => state.products);
    console.log({ products });


    useEffect(() => {
        dispatch(fetchProductsByCategory(categoryId));
        return () => {
            dispatch(clearProducts());
        };
    }, [categoryId, dispatch]);

    if (status === 'loading') {
        return <div className="loading">Loading products...</div>;
    }

    if (status === 'failed') {
        navigate('/404');
        return null;
    }

    return (
        <div className="products-container">
            <button onClick={() => navigate(-1)} className="back-button">← Back</button>
            <h1>Products</h1>
            <div className="products-grid">
                {products.map(product => (
                    <div
                        key={product.product_id}
                        className="product-card"
                        onClick={() => navigate(`/product/${product.product_id}`)}
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            className="product-image"
                            loading="lazy"
                        />
                        <h3>{product.descriptions[1].name}</h3>
                        <p style={{ color: "#ff0000" }} >${product.calculated_price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsPage;