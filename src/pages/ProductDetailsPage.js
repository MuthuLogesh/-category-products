import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductDetails, clearProductDetails } from '../store/productDetailsSlice';
import './ProductDetailsPage.css';

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { product, status } = useSelector(state => state.productDetails);
    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        dispatch(fetchProductDetails(productId));
        return () => {
            dispatch(clearProductDetails());
        };
    }, [productId, dispatch]);

    useEffect(() => {
        if (product) {
            setMainImage(product.image);
        }
    }, [product]);

    const getDescriptionImages = () => {
        const html = product?.descriptions?.[1]?.meta_description ||
            product?.description || '';

        if (!html) return [];

        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        const matches = [];
        let match;

        while ((match = imgRegex.exec(html)) !== null) {
            matches.push(match[1]);
        }

        return matches;
    };

    const descriptionImages = product ? getDescriptionImages() : [];

    const handleThumbnailClick = (imageSrc) => {
        setMainImage(imageSrc);
    };

    if (status === 'loading') {
        return <div className="loading">Loading product details...</div>;
    }

    if (status === 'failed') {
        navigate('/404');
        return null;
    }

    if (!product) {
        return null;
    }

    const allThumbnails = [
        ...(product.images || []).filter(img => img.image !== mainImage),
        ...descriptionImages.filter(img => img !== mainImage).map(img => ({ image: img }))
    ];

    return (
        <div className="product-details-container">
            <button onClick={() => navigate(-1)} className="back-button">← Back</button>
            <div className="product-details">
                <div className="product-image-container">
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="product-detail-image"
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/500?text=Image+Not+Available';
                        }}
                    />

                    {allThumbnails.length > 0 && (
                        <div className="image-gallery">
                            <h3>More Images</h3>
                            <div className="gallery-grid">
                                {allThumbnails.map((img, index) => (
                                    <img
                                        key={`thumb-${index}`}
                                        src={img.image}
                                        alt={`${product.name} - ${index + 1}`}
                                        className={`gallery-thumbnail ${img.image === mainImage ? 'active' : ''}`}
                                        loading="lazy"
                                        onClick={() => handleThumbnailClick(img.image)}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Available';
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="product-info">
                    <h1>{product.name}</h1>

                    <div className="price-section">
                        <p className="price">${product.calculated_price}</p>
                        {product.base_price && product.base_price !== product.calculated_price && (
                            <p className="original-price">${product.base_price}</p>
                        )}
                        {product.cost && (
                            <p className="cost">Manufacturer cost: {product.cost}</p>
                        )}
                    </div>

                    {product.options?.length > 0 && (
                        <div className="options-section">
                            <h3>Options</h3>
                            {product.options.map((option) => (
                                <div key={option.product_option_id} className="product-option">
                                    <h4>{option.names[1]?.name || 'Option'}</h4>
                                    <div className="option-values">
                                        {option.product_option_value.map((value) => (
                                            <div key={value.product_option_value_id} className="option-value">
                                                <input
                                                    type="radio"
                                                    id={`opt-${value.product_option_value_id}`}
                                                    name={`option-${option.product_option_id}`}
                                                    value={value.option_value_id}
                                                />
                                                <label htmlFor={`opt-${value.product_option_value_id}`}>
                                                    {value.names[1]?.name || 'Option value'}
                                                    {value.price > 0 && ` (+$${value.price})`}
                                                </label>
                                                {value.image && (
                                                    <img
                                                        src={value.image}
                                                        alt={value.names[1]?.name || ''}
                                                        className="option-image"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/50?text=Image+Not+Available';
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="stock-section">
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            min="1"
                            max={product.quantity}
                            defaultValue="1"
                        />
                        <p className="stock-status">
                            {product.quantity > 0
                                ? `${product.quantity} available in stock`
                                : 'Out of stock'}
                        </p>
                    </div>

                    <div className="description-section">
                        <h3>Description</h3>
                        <div className="product-description">
                            <p>{product.descriptions?.[1]?.meta_description}</p>
                        </div>
                    </div>

                    <div className="meta-section">
                        <h3>Product Details</h3>
                        <ul>
                            <li><strong>Model:</strong> {product.sku || product.model}</li>
                            <li><strong>Rating:</strong> {product.rating || 'Not rated yet'}</li>
                            <li><strong>Reviews:</strong> {product.reviews || '0'}</li>
                            {product.meta_keyword && (
                                <li><strong>Keywords:</strong> {product.meta_keyword}</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;