import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../store/categoriesSlice';
import { useNavigate } from 'react-router-dom';
import './CategoriesPage.css';

const CategoriesPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: categories, status } = useSelector(state => state.categories);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    if (status === 'loading') {
        return <div className="loading">Loading categories...</div>;
    }

    if (status === 'failed') {
        navigate('/404');
        return null;
    }

    return (
        <div className="categories-container">
            <h1>Categories</h1>
            <div className="categories-grid">
                {categories.map(category => (
                    <div
                        key={category.category_id}
                        className="category-card"
                        onClick={() => navigate(`/category/${category.category_id}`)}
                    >
                        <img
                            src={category.image}
                            alt={category.name}
                            className="category-image"
                            loading="lazy"
                        />
                        <h3>{category.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesPage;