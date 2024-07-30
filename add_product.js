document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product_new');

    // Загружаем данные о продуктах из файла JSON
    fetch('products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(products => {
            products.forEach(product => {
                // Создаем элемент карточки
                const card = document.createElement('div');
                card.className = 'card';

                // Создаем верхнюю часть карточки
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

                // Создаем нижнюю часть карточки
                const cardBottom = document.createElement('div');
                cardBottom.className = 'card__bottom';
                const productTitle = document.createElement('div');
                productTitle.className = 'product_title';
                productTitle.textContent = product.title;
                const addButton = document.createElement('button');
                addButton.className = 'card__add';
                addButton.textContent = 'В корзину';
                const inputOrder = document.createElement('input');
                inputOrder.type = 'text';
                inputOrder.className = 'input__order';
                inputOrder.placeholder = 'Введите кол-во';
                inputOrder.inputMode = 'numeric';
                inputOrder.style.display = 'none';

                // Добавляем создаваемые элементы в карточку
                cardBottom.appendChild(productTitle);
                cardBottom.appendChild(addButton);
                cardBottom.appendChild(inputOrder);
                card.appendChild(cardTop);
                card.appendChild(cardBottom);

                // Добавляем карточку в контейнер
                productContainer.appendChild(card);

                // Добавляем обработчик события для кнопки "В корзину"
                addButton.addEventListener('click', () => {
                    addButton.style.display = 'none';
                    inputOrder.style.display = 'block';
                });
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});
