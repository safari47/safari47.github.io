let cart = {};
const cartButton = document.querySelector('.cart-button');
const modal = document.getElementById('cartModal');
const closeBtn = document.getElementsByClassName('close')[0];
const checkoutButton = document.getElementById('checkoutButton');

// Функция для создания карточек товаров из JSON
function createProductCards(products) {
    const peeledGrid = document.getElementById('peeledGrid');
    const unpeeledGrid = document.getElementById('unpeeledGrid');

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.category = product.category; // Добавляем категорию в data-атрибут
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.description}" class="product-image">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <button class="add-to-cart">В корзину</button>
            </div>
        `;

        const addToCartButton = productCard.querySelector('.add-to-cart');
        addToCartButton.addEventListener('click', (event) => handleAddToCart(event, product));

        if (product.category === 'peeled') {
            peeledGrid.appendChild(productCard);
        } else {
            unpeeledGrid.appendChild(productCard);
        }
    });
}

// Функция для загрузки данных из JSON файла
async function loadProductsFromJSON() {
    try {
        const response = await fetch("/static/product/products.json");
        const products = await response.json();
        createProductCards(products);
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
}

// Вызываем функцию загрузки данных при загрузке страницы
window.addEventListener('load', loadProductsFromJSON);

function handleAddToCart(event, product) {
    const productCard = event.target.closest('.product-card');
    const productName = product.name;
    const productCategory = product.category;
    const productKey = `${productName}-${productCategory}`; // Уникальный ключ
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.value = '1';
    input.className = 'quantity-input';

    event.target.replaceWith(input);

    function updateCart() {
        const quantity = parseInt(input.value, 10);
        if (quantity > 0) {
            cart[productKey] = {
                quantity,
                image: product.image,
                category: product.category,
                name: productName
            };
            updateProductCard(productKey, quantity);
        } else {
            delete cart[productKey];
        }
        updateCartButton();
    }

    input.addEventListener('change', function () {
        if (this.value > 0) {
            input.blur();  // Скрываем клавиатуру на мобильных устройствах
        }
        if (this.value === '0' || this.value === '') {
            const newButton = document.createElement('button');
            newButton.textContent = 'В корзину';
            newButton.className = 'add-to-cart';
            this.replaceWith(newButton);
            newButton.addEventListener('click', (event) => handleAddToCart(event, product));
            delete cart[productKey];
        } else {
            updateCart();
        }
        updateCartButton();
    });

    input.addEventListener('blur', function () {
        if (this.value === '0' || this.value === '') {
            const newButton = document.createElement('button');
            newButton.textContent = 'В корзину';
            newButton.className = 'add-to-cart';
            this.replaceWith(newButton);
            newButton.addEventListener('click', (event) => handleAddToCart(event, product));
            delete cart[productKey];
        }
        updateCartButton();
    });

    updateCart();
}

function updateCartButton() {

    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 0) {
        cartButton.style.display = 'block';
        cartButton.textContent = `Корзина (${totalItems})`;
    } else {
        cartButton.style.display = 'none';
    }
}

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', handleAddToCart);
});

cartButton.onclick = function () {
    modal.style.display = "block";
    updateCartModal();
}

closeBtn.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';

    const categories = {
        peeled: { name: 'Чищенные овощи', items: [] },
        unpeeled: { name: 'Нечищенные овощи', items: [] }
    };

    for (const [productKey, item] of Object.entries(cart)) {
        categories[item.category].items.push(`
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <input type="number" class="cart-quantity-input" value="${item.quantity}" min="0" onchange="updateQuantity('${productKey}', this.value)">
                </div>
            </div>
        `);
    }

    for (const category of Object.values(categories)) {
        if (category.items.length > 0) {
            cartItems.innerHTML += `
                <div class="cart-category">
                    <h3>${category.name}</h3>
                    ${category.items.join('')}
                </div>
            `;
        }
    }

    checkoutButton.style.display = Object.keys(cart).length > 0 ? 'block' : 'none';
}

function updateQuantity(productKey, newQuantity) {
    newQuantity = parseInt(newQuantity, 10);
    if (newQuantity > 0) {
        cart[productKey].quantity = newQuantity;
        updateProductCard(productKey, newQuantity);
    } else {
        delete cart[productKey];
        updateProductCard(productKey, 0);
    }
    updateCartButton();
    updateCartModal();
}

function updateProductCard(productKey, quantity) {
    const productCards = document.querySelectorAll('.product-card');
    for (let card of productCards) {
        const cardKey = `${card.querySelector('.product-name').textContent}-${card.dataset.category}`;
        if (cardKey === productKey) {
            const quantityInput = card.querySelector('.quantity-input');
            if (quantityInput) {
                if (quantity > 0) {
                    quantityInput.value = quantity;
                } else {
                    const newButton = document.createElement('button');
                    newButton.textContent = 'В корзину';
                    newButton.className = 'add-to-cart';
                    quantityInput.replaceWith(newButton);
                    newButton.addEventListener('click', (event) => handleAddToCart(event, cart[productKey]));
                }
            } else if (quantity > 0) {
                const addToCartButton = card.querySelector('.add-to-cart');
                if (addToCartButton) {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.min = '0';
                    input.value = quantity;
                    input.className = 'quantity-input';
                    addToCartButton.replaceWith(input);
                    input.addEventListener('change', function () {
                        updateQuantity(productKey, this.value);
                    });
                }
            }
            break;
        }
    }
}

async function success_order() {
    const order_date = document.getElementById('date_order').value;
    const name_organization = document.getElementById('organization_name').value;
    try {
        const response = await fetch('/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                products: cart, 
                date: order_date,
                organization: name_organization
            })
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Order success:', responseData);
            alert(`Ваш заказ доставлен: ${responseData.message}`)
        } else {
            console.error('Order failed:', response.status, response.statusText);
            alert('При отправке заказа произошла ошибка. Пожалуйста, попробуйте позже.');
        }
    } catch (error) {
        console.error('Ошибка при отправке заказа:', error);
        alert('При отправке заказа произошла ошибка. Пожалуйста, попробуйте позже.')
    }
}


// Обработчик для ссылки "История заказов"
document.getElementById('orderHistoryLink').addEventListener('click', function (e) {
    e.preventDefault();
    alert('Здесь будет отображаться история заказов пользователя.');
});

