import React, { useEffect, useState } from 'react';
import { productList } from '../../const/product-list';

const Products = () => {
    const [cartItems, setCartItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const addToCart = (item, count) => {
        const existingItem = cartItems.find(cartItem => cartItem.name === item.name);

        if (existingItem) {
            if (existingItem.count + count <= 0) {
                setCartItems(cartItems.filter(cartItem => cartItem.name !== item.name));
            } else {
                setCartItems(cartItems.map(cartItem =>
                    cartItem.name === item.name
                        ? { ...cartItem, count: cartItem.count + count }
                        : cartItem
                ));
            }
        } else if (count > 0) {
            // Add new item to the cart if count is greater than 0
            setCartItems([...cartItems, { ...item, count }]);
        }
    };

    const removeFromCart = (name) => {
        setCartItems(cartItems.filter(cartItem => cartItem.name !== name));
    };

    const getTotal = () => {
        return cartItems.reduce((acc, item) => acc + item.price * item.count, 0).toFixed(2);
    };

    const handleConfirmOrder = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCartItems([]); // Clear the cart after confirming the order
    };

    return (
        <div className="container">
            <div className="product-list">
                <h1>Desserts</h1>
                <div className="grid">
                    {productList.map((item, index) => {
                        const cartItem = cartItems.find(cartItem => cartItem.name === item.name);
                        return (
                            <Card
                                key={index}
                                item={item}
                                count={cartItem ? cartItem.count : 0}
                                addToCart={addToCart}
                            />
                        )
                    })}
                </div>
            </div>
            <Cart
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                getTotal={getTotal}
                onConfirmOrder={handleConfirmOrder}
            />

            {isModalOpen && (
                <OrderConfirmationModal
                    cartItems={cartItems}
                    total={getTotal()}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

const Card = ({ item, count, addToCart }) => {
    const [localCount, setLocalCount] = useState(count);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        setLocalCount(count);
    }, [count]);

    const handleAdd = () => {
        setLocalCount(localCount + 1);
        addToCart(item, 1);
    };

    const handleSubtract = () => {
        if (localCount > 0) {
            setLocalCount(localCount - 1);
            addToCart(item, -1);
        }
    };

    return (
        <div
            className="card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img
                src={item.image.desktop}
                alt={item.name}
                className={`card-image ${localCount > 0 ? 'bordered' : ''}`}
            />
            <div className="card-content">
                <h4>{item.category}</h4>
                <h3>{item.name}</h3>
                <p>${item.price}</p>
            </div>

            {isHovered || localCount > 0 ? (
                <div className="hover-buttons">
                    <button onClick={handleSubtract} className="subtract-button"><img src='./assets/images/icon-decrement-quantity.svg' alt='decrement-icon' /></button>
                    <span className="item-count">{localCount}</span>
                    <button onClick={handleAdd} className="add-button"><img src='./assets/images/icon-increment-quantity.svg' alt='increment-icon' /></button>
                </div>
            ) : (
                <button className="add-to-cart-button" onClick={handleAdd}>
                    <img src='./assets/images/icon-add-to-cart.svg' alt='add-cart' />Add to Cart
                </button>
            )}
        </div>
    );
};

const Cart = ({ cartItems, removeFromCart, getTotal, onConfirmOrder }) => {
    const handleRemove = (item) => {
        removeFromCart(item.name);
        // Reset the count in the respective card
        const cardElement = document.getElementById(`card-${item.name}`);
        if (cardElement) {
            cardElement.querySelector('.item-count').textContent = 0;
            cardElement.querySelector('.card-image').classList.remove('bordered');
        }
    };
    return (
        <div className="cart">
            <div className='cart-container'>
                <h2>Your Cart ({cartItems.length})</h2>
                {cartItems.length ? <div>
                    <ul>
                        {cartItems.map((item, index) => (
                            <li key={index}>
                                <div>
                                    <span>{item.name}</span>
                                    <div className='cart-items-priceList'>
                                        <span className='cart-item-count'>{item.count}x</span>
                                        <span>@ ${(item.price)}</span>
                                        <span>${(item.price * item.count).toFixed(2)}</span>
                                    </div>
                                </div>
                                <button onClick={() => handleRemove(item)}><img src='./assets/images/icon-remove-item.svg' alt='close-icon' /></button>
                            </li>
                        ))}
                    </ul>
                    <div className="total">
                        <h3>Order Total</h3>
                        <p>${cartItems.reduce((acc, item) => acc + item.price * item.count, 0).toFixed(2)}</p>
                    </div>
                    <div className='label-ad'>
                        <p><img src='./assets/images/icon-carbon-neutral.svg' alt='icon' />This is a <span>carbon-neutral</span> delivery</p>
                    </div>
                    <button className="confirm-button" onClick={onConfirmOrder}>Confirm Order</button>
                </div> :
                    <div className='empty-cart'>
                        <img src='./assets/images/illustration-empty-cart.svg' alt='empty-cart' />
                        <p>your added items will appear here</p>
                    </div>
                }
            </div>
        </div>
    );
};

const OrderConfirmationModal = ({ cartItems, total, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <img src='./assets/images/icon-order-confirmed.svg' alt='order-confirm' />
                    <h2>Order Confirmed</h2>
                    <p>We hope you enjoy your food!</p>
                </div>
                <div className="modal-body">
                    <ul>
                        {cartItems.map((item, index) => (
                            <li key={index} className="modal-item">
                                <div className="item-details">
                                    <span>{item.name}</span>
                                    <span>{item.count}x @ ${item.price}</span>
                                </div>
                                <span>${(item.price * item.count).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="modal-footer">
                    <div className="order-total">
                        <h3>Order Total</h3>
                        <p>${total}</p>
                    </div>
                    <button className="start-new-order-button" onClick={onClose}>Start New Order</button>
                </div>
            </div>
        </div>
    );
};

export default Products;