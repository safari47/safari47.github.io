// Ждем загрузки всего контента на странице
document.addEventListener('DOMContentLoaded', () => {
    // Находим все кнопки "В корзину"
    const addButtons = document.querySelectorAll('.card__add');
    
    // Для каждой кнопки добавляем обработчик события click
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Находим родительский элемент карточки товара
            const card = button.closest('.card');
            // Находим поле ввода внутри этой карточки
            const inputField = card.querySelector('.input__order');

            // Скрываем кнопку "В корзину"
            button.style.display = 'none';
            // Показываем поле ввода
            inputField.style.display = 'block';
            // Устанавливаем значение 1 в поле ввода
            inputField.value = 1;
        });
    });
});
