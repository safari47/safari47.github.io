async function fetchOrders() {
    const selectedDate = document.getElementById('order-date').value;
    const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: selectedDate }),
    });

    const data = await response.json();
    const ordersContainer = document.getElementById('orders-container');
    const noOrdersElement = document.getElementById('no-orders');
    ordersContainer.innerHTML = '';

    if (data.orders.length > 0) {
        noOrdersElement.style.display = 'none';
        data.orders.forEach(order => {
            const orderBlock = document.createElement('div');
            orderBlock.classList.add('order-block');

            const orderHeader = document.createElement('div');
            orderHeader.classList.add('order-header');
            orderHeader.innerHTML = `<span class="order-number">Заявка №${order.id}</span><span class="organization-name">${order.organizationName}</span>`;
            orderBlock.appendChild(orderHeader);

            const orderDetails = document.createElement('div');
            orderDetails.classList.add('order-details');

            Object.keys(order.categories).forEach(categoryName => {
                const category = order.categories[categoryName];

                const categoryElement = document.createElement('div');
                categoryElement.classList.add('category', categoryName);
                categoryElement.textContent = categoryName;
                orderDetails.appendChild(categoryElement);

                category.forEach(product => {
                    const productInfo = document.createElement('div');
                    productInfo.classList.add('product-info');
                    productInfo.innerHTML = `<span class="product-name">${product.productName}</span><span class="product-quantity">${product.quantity} ${product.unit}</span>`;
                    orderDetails.appendChild(productInfo);
                });
            });

            orderBlock.appendChild(orderDetails);
            ordersContainer.appendChild(orderBlock);
        });
    } else {
        noOrdersElement.style.display = 'block';
    }
}
