document.addEventListener("DOMContentLoaded", function() {
    const loader = document.getElementById('loader');
    const cardsSection = document.querySelector('.cards');
    
    window.addEventListener('load', function() {
        loader.style.display = 'none';
        cardsSection.style.display = 'block';
    });
});
// Пример использования функции addToOrder
document.addEventListener('DOMContentLoaded', (event) => {
    updateOrderHeaders()
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                const cardsContainer = product.category === 1 ? document.getElementById('product_new') : document.getElementById('product_old');
                const card = document.createElement('div');
                card.className = 'card';

                const cardTop = document.createElement('div');
                cardTop.className = 'card__top';
                const cardImageLink = document.createElement('a');
                cardImageLink.className = 'card__image';
                const cardImage = document.createElement('img');
                cardImage.src = product.imageUrl;
                cardImage.alt = product.title;
                cardImageLink.appendChild(cardImage);
                cardTop.appendChild(cardImageLink);

                const cardBottom = document.createElement('div');
                cardBottom.className = 'card__bottom';
                const productTitle = document.createElement('div');
                productTitle.className = 'product_title';
                productTitle.textContent = product.title;

                productTitle.id = product.category;
                const addButton = document.createElement('button');
                addButton.className = 'card__add';
                addButton.textContent = 'В корзину';
                const inputOrder = document.createElement('input');
                inputOrder.type = 'text';
                inputOrder.className = 'input__order';
                inputOrder.placeholder = 'Введите кол-во';
                inputOrder.inputMode = 'text';
                inputOrder.style.display = 'none';

                cardBottom.appendChild(productTitle);
                cardBottom.appendChild(addButton);
                cardBottom.appendChild(inputOrder);
                card.appendChild(cardTop);
                card.appendChild(cardBottom);

                cardsContainer.appendChild(card);

                addButton.addEventListener('click', () => {
                    addButton.style.display = 'none';
                    inputOrder.style.display = 'block';
                    inputOrder.value = 1; // Устанавливаем значение 1 в поле ввода
                    addToOrder(product, 1, inputOrder);
                });

                inputOrder.addEventListener('input', () => {
                const quantity = parseInt(inputOrder.value.trim(), 10);
                if (!isNaN(quantity)) {
                    if (quantity === 0) {
                        removeOrderItem(product.title); // Предполагаем, что `product.title` содержит название продукта
                        inputOrder.style.display = 'none';
                        const addButton = inputOrder.parentElement.querySelector('.card__add');
                        if (addButton) addButton.style.display = 'block';
                    } else {
                        addToOrder(product, quantity, inputOrder);
                    }
                    }
                });
            });
        })
        .catch(error => console.error('Ошибка при загрузке продуктов:', error));
});

function updateOrderHeaders() {
    const cleanedOrderList = document.getElementById('cleaned_order');
    const uncleanedOrderList = document.getElementById('uncleaned_order');
    const cleanedOrderHeader = document.getElementById('cleaned_order_header');
    const uncleanedOrderHeader = document.getElementById('uncleaned_order_header');

    // Проверяем количество элементов с классом 'order-item'
    cleanedOrderHeader.style.display = cleanedOrderList.querySelectorAll('.order-item').length === 0 ? 'none' : 'block';
    uncleanedOrderHeader.style.display = uncleanedOrderList.querySelectorAll('.order-item').length === 0 ? 'none' : 'block';
}

function addToOrder(product, quantity, inputOrder) {
    const cleanedOrderList = document.getElementById('cleaned_order');
    const uncleanedOrderList = document.getElementById('uncleaned_order');

    // Определяем нужный контейнер для заказа 
    const targetOrderList = product.category === 1 ? cleanedOrderList : uncleanedOrderList;

    // Находим существующий элемент в списке заказов
    let existingItem = Array.from(targetOrderList.getElementsByClassName('order-item')).find(item =>
        item.querySelector('.item-name').textContent === product.title
    );

    if (existingItem) {
        existingItem.querySelector('.quantity__order').value = quantity;
    } else {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';

        const orderItemImage = document.createElement('img');
        orderItemImage.src = product.imageUrl;
        orderItemImage.alt = product.title;
    
        const itemDetails = document.createElement('div');
        itemDetails.className = 'item-details';
        
        const itemName = document.createElement('div');
        itemName.className = 'item-name';
        itemName.textContent = product.title;
        
        const itemQuantity = document.createElement('input');
        itemQuantity.type = 'text';
        itemQuantity.className = 'quantity__order';
        itemQuantity.value = quantity;
        itemQuantity.inputMode = 'numeric';

        itemQuantity.addEventListener('input', () => {
            const quantityVal = itemQuantity.value.trim();
            if (quantityVal === '0') {
                orderItem.remove();
                inputOrder.style.display = 'none';
                const addButton = inputOrder.parentElement.querySelector('.card__add');
                if (addButton) addButton.style.display = 'block';
                updateOrderHeaders(); // Обновляем заголовки после удаления элемента
            } else if (quantityVal !== '') {
                inputOrder.value = itemQuantity.value;
                inputOrder.dispatchEvent(new Event('input'));
            }
        });

        itemDetails.appendChild(itemName);
        orderItem.appendChild(orderItemImage);
        orderItem.appendChild(itemDetails);
        orderItem.appendChild(itemQuantity);

        targetOrderList.appendChild(orderItem);
    }

    updateOrderHeaders(); // Обновляем заголовки после добавления элемента
}


function removeOrderItem(productTitle) {
    const orderLists = [document.getElementById('cleaned_order'), document.getElementById('uncleaned_order')];
    
    orderLists.forEach(orderList => {
        const itemToRemove = Array.from(orderList.getElementsByClassName('order-item')).find(item => 
            item.querySelector('.item-name').textContent === productTitle
        );
        
        if (itemToRemove) {
            orderList.removeChild(itemToRemove);
        }
        updateOrderHeaders()
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const stickyButton = document.querySelector('.sticky-button');
    const containerHidden = document.querySelector('.container_hiden');
    const containerOrder = document.querySelector('.container__order');

    stickyButton.addEventListener('click', () => {
        containerHidden.style.display = 'none';
        containerOrder.style.display = 'block';
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("orderForm");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        function getOrderData(containerId) {
            const container = document.getElementById(containerId);
            const items = container.querySelectorAll('.order-item');
            const orderData = [];

            items.forEach(item => {
                const name = item.querySelector('.item-name').textContent;
                const quantity = item.querySelector('.quantity__order').value;
                orderData.push({ name, quantity });
            });

            return orderData;
        }

        const cleanedOrder = getOrderData('cleaned_order');
        const uncleanedOrder = getOrderData('uncleaned_order');

        document.getElementById('cleaned_order_data').value = JSON.stringify(cleanedOrder);

        document.getElementById('uncleaned_order_data').value = JSON.stringify(uncleanedOrder);

        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                // Редирект на нужную HTML страницу
                window.location.href = '/sucess_order/sucess.html';
            } else {
                // Обработка ошибки
                console.error('Error:', response.status, response.statusText);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
