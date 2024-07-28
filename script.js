// Ждем загрузки всего контента на странице
document.addEventListener('DOMContentLoaded', () => {
    // Находим все кнопки "Редактировать"
    const editButtons = document.querySelectorAll('.card__add');
    
    // Для каждой кнопки добавляем обработчик события click
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Находим родительский элемент карточки товара
            const card = button.parentElement;
            // Находим поле ввода внутри этой карточки
            const inputField = card.querySelector('.input__order');

            // Скрываем кнопку "Редактировать"
            button.style.display = 'none';
            // Показываем поле ввода
            inputField.style.display = 'block';
            // Устанавливаем фокус на поле ввода
            
        });
    });
});