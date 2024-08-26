let userID;
const modal = document.getElementById('cartModal');
const historyModal = document.getElementById('historyModal');
const closeBtn = document.getElementsByClassName('close');
let cart = {};
const cartButton = document.querySelector('.cart-button');
const checkoutButton = document.getElementById('checkoutButton');
const modalsucess = document.getElementById('successMdl');
const orderNumberSpan = document.getElementById('orderNumber');

function fillUserInfo() {
    // Проверяем наличие обязательных объектов и свойств
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
        let tg = window.Telegram.WebApp;
        const userFirstName = tg.initDataUnsafe.user.first_name; // Только имя
        const userAvatar = tg.initDataUnsafe.user.photo_url;
        userID = tg.initDataUnsafe.user.id; // Устанавливаем глобальный userID

        // Находим элементы в DOM
        const userNameElement = document.getElementById('userName');
        const userAvatarElement = document.querySelector('.user-avatar');

        // Проверяем существование элемента перед манипуляцией
        if (userNameElement) {
            userNameElement.textContent = userFirstName;
        } else {
            console.error('Element with id "userName" not found.');
        }

        if (userAvatarElement) {
            userAvatarElement.src = userAvatar;
        } else {
            console.error('Element with class "user-avatar" not found.');
        }
    } else {
        console.error('Telegram WebApp data not available.');
    }
}

document.addEventListener("DOMContentLoaded", function () {
    window.onload = function () {
        const preloader = document.getElementById('preloader');
        const content = document.getElementById('content');

        // Скрываем спиннер
        preloader.style.display = 'none';

        // Показываем контент
        content.style.display = 'block';
    };
    fillUserInfo();
});

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
                <div class="product-name" id=${product.id}>${product.name}</div>
                <span class="product-description">${product.description}</span>
                <button class="add-to-cart">В корзину</button>
            </div>
        `;

        const addToCartButton = productCard.querySelector('.add-to-cart');
        addToCartButton.addEventListener('click', (event) => handleAddToCart(event, product));

        if (product.category === 1) {
            peeledGrid.appendChild(productCard);
        } else {
            unpeeledGrid.appendChild(productCard);
        }
    });
}

// Функция для загрузки данных из JSON файла
async function loadProductsFromAPI() {
    try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error('Network response was not ok');
        const products = await response.json();
        createProductCards(products);
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
}

// Вызываем функцию загрузки данных при загрузке страницы
window.addEventListener('load', loadProductsFromAPI);

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
                id: product.id,
                name: product.name,
                category: product.category,
                quantity,
                image: product.image
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
        1: { name: 'Чищенные овощи', items: [] },
        2: { name: 'Нечищенные овощи', items: [] }
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

function showModal(orderNumber) {
    orderNumberSpan.textContent = orderNumber;
    modal.style.display = "none";
    cartButton.style.display = "none";
    modalsucess.style.display = 'block';
}

function closeModal() {
    tg.close()
}

async function success_order() {
    const orderButton = document.getElementById('checkoutButton');
    const loadingIndicator = document.getElementById('loading-bar-spinner');

    const order_date = document.getElementById('date_order').value;
    const name_organization = String(document.getElementById('organization_name').value).trim();

    // Проверка, если name_organization пустое
    if (!name_organization) {
        alert('Название организации не может быть пустым!');
        return; // Прекращаем выполнение функции, если name_organization пустое
    }

    // Скрываем кнопку и показываем спиннер
    orderButton.style.display = 'none';
    loadingIndicator.style.display = 'block';

    try {
        const response = await fetch('/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                products: cart,
                date: order_date,
                organization: name_organization,
                user_id: userID
            })
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Order success:', responseData);
            orderNumber = responseData.message
            showModal(orderNumber)
        } else {
            console.error('Order failed:', response.status, response.statusText);
            alert(`При отправке заказа произошла ошибка: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Ошибка при отправке заказа:', error);
        alert(`При отправке заказа произошла ошибка: ${error.message}`);
    } finally {
        // Включаем кнопку и скрываем спиннер независимо от результата
        orderButton.style.display = 'block';
        loadingIndicator.style.display = 'none';
    }
}


async function order_history() {
    try {
        const response = await fetch('/api/user_orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id
            })
        });

        if (response.ok) {
            const responseData = await response.json();
            displayHistory(responseData); // Передаем данные из ответа в вашу функцию
        } else {
            console.error('Ошибка загрузки данных истории заказов');
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function displayHistory(data) {
    const historyContent = document.getElementById('historyContent');
    historyContent.innerHTML = '';

    if (data.orders.length === 0) {
        historyContent.textContent = 'Заказы не найдены.';
        return;
    }

    data.orders.forEach((order) => {
        const orderBlock = document.createElement('div');
        orderBlock.className = 'order-block';

        const orderHeader = document.createElement('h3');
        orderHeader.textContent = `Заказ № ${order.id} от ${order.deliveryDate}`;
        orderBlock.appendChild(orderHeader);

        const categoriesList = document.createElement('ul');

        for (const category in order.categories) {
            const categoryHeader = document.createElement('li');
            categoryHeader.className = 'category-header';
            categoryHeader.textContent = category;
            const productsList = document.createElement('ul');

            order.categories[category].forEach((product) => {
                const productItem = document.createElement('li');
                productItem.className = 'product-item';
                productItem.innerHTML = `<span>${product.productName}</span> <span class="product-quantity">${product.quantity} ${product.unit}</span>`;
                productsList.appendChild(productItem);
            });

            categoryHeader.appendChild(productsList);
            categoriesList.appendChild(categoryHeader);
        }

        orderBlock.appendChild(categoriesList);
        historyContent.appendChild(orderBlock);
    });

    const historyModal = document.getElementById('historyModal');
    historyModal.style.display = 'flex';
}

for (let btn of closeBtn) {
    btn.onclick = function () {
        modal.style.display = "none";
        historyModal.style.display = "none";
    };
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == historyModal) {
        historyModal.style.display = "none";
    }
}

