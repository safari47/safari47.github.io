document.addEventListener('DOMContentLoaded', () => {
    const newProductContainer = document.getElementById('product_new');
    const oldProductContainer = document.getElementById('product_old');
    const popupProductList = document.getElementById('popup_product_list');

    fetch('products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(products => {
            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'card';

                const cardTop = document.createElement('div');
                cardTop.className = 'card__top';
                const cardImageLink = document.createElement('a');
                cardImageLink.href = "#";
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
                inputOrder.inputMode = 'numeric';
                inputOrder.style.display = 'none';

                cardBottom.appendChild(productTitle);
                cardBottom.appendChild(addButton);
                cardBottom.appendChild(inputOrder);
                card.appendChild(cardTop);
                card.appendChild(cardBottom);

                if (product.category === 1) {
                    newProductContainer.appendChild(card);
                } else if (product.category === 2) {
                    oldProductContainer.appendChild(card);
                }

                addButton.addEventListener('click', () => {
                    addButton.style.display = 'none';
                    inputOrder.style.display = 'block';
                    inputOrder.value = 1; // Устанавливаем значение 1 в поле ввода

                    inputOrder.addEventListener('input', () => {
                        const inputVal = inputOrder.value.trim();
                        if (inputVal === '0') {
                            removeOrderItem(product.title);
                        } else if (inputVal !== '') {
                            updateOrderItem(product, inputVal);
                        }
                    });

                    addToOrder(product, inputOrder.value, inputOrder);
                });
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});

function addToOrder(product, quantity, inputOrder) {
    const popupProductList = document.getElementById('popup_product_list');
    
    let existingItem = Array.from(popupProductList.getElementsByClassName('order-item')).find(item => 
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
            } else if (quantityVal !== '') {
                inputOrder.value = itemQuantity.value;
                inputOrder.dispatchEvent(new Event('input'));
            }
        });
    
        itemDetails.appendChild(itemName);
        orderItem.appendChild(orderItemImage);
        orderItem.appendChild(itemDetails);
        orderItem.appendChild(itemQuantity);

        popupProductList.appendChild(orderItem);
    }
}

function updateOrderItem(product, quantity) {
    const popupProductList = document.getElementById('popup_product_list');
    let existingItem = Array.from(popupProductList.getElementsByClassName('order-item')).find(item => 
        item.querySelector('.item-name').textContent === product.title
    );

    if (existingItem) {
        existingItem.querySelector('.quantity__order').value = quantity;
    }
}

function removeOrderItem(productTitle) {
    const popupProductList = document.getElementById('popup_product_list');
    let existingItem = Array.from(popupProductList.getElementsByClassName('order-item')).find(item => 
        item.querySelector('.item-name').textContent === productTitle
    );

    if (existingItem) {
        existingItem.remove();
    }

    const productCard = Array.from(document.getElementsByClassName('card')).find(card => 
        card.querySelector('.product_title').textContent === productTitle
    );

    if (productCard) {
        const addButton = productCard.querySelector('.card__add');
        const inputOrder = productCard.querySelector('.input__order');
        if (addButton) addButton.style.display = 'block';
        if (inputOrder) inputOrder.style.display = 'none';
    }
}
