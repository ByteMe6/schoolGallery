document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    let isAnimating = false;
    
    function slideImage(direction) {
        if (isAnimating) return;
        
        const items = document.querySelectorAll('.item');
        const currentItem = items[0];
        const nextItem = direction === 'next' ? items[1] : items[items.length - 1];
        
        isAnimating = true;

        // Устанавливаем начальные позиции
        if (direction === 'next') {
            nextItem.style.transform = 'translate(100%)';
            nextItem.style.opacity = '0';
            currentItem.style.transform = 'translate(0)';
            currentItem.style.opacity = '1';
        } else {
            nextItem.style.transform = 'translate(-100%)';
            nextItem.style.opacity = '0';
            currentItem.style.transform = 'translate(0)';
            currentItem.style.opacity = '1';
        }

        // Добавляем класс для анимации
        currentItem.classList.add('sliding');
        nextItem.classList.add('sliding');
        
        // Запускаем анимацию
        requestAnimationFrame(() => {
            // Анимация выхода текущего слайда
            currentItem.style.transform = direction === 'next' ? 'translate(-100%)' : 'translate(100%)';
            currentItem.style.opacity = '0';
            currentItem.style.filter = 'blur(5px)';

            // Анимация входа следующего слайда
            nextItem.style.transform = 'translate(0)';
            nextItem.style.opacity = '1';
            nextItem.style.filter = 'blur(0)';

            // Перемещаем слайды после завершения анимации
            setTimeout(() => {
                if (direction === 'next') {
                    slider.append(currentItem);
                } else {
                    slider.prepend(nextItem);
                }

                // Очищаем стили после анимации
                [currentItem, nextItem].forEach(item => {
                    item.classList.remove('sliding');
                    item.style.transform = '';
                    item.style.opacity = '';
                    item.style.filter = '';
                });

                isAnimating = false;
            }, 800);
        });
    }

    // Обработчики кликов
    document.querySelector('.next').addEventListener('click', () => slideImage('next'));
    document.querySelector('.prev').addEventListener('click', () => slideImage('prev'));

    // Поддержка свайпов для мобильных устройств
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                slideImage('next');
            } else {
                slideImage('prev');
            }
        }
    }

    // Поддержка клавиатуры
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') {
            slideImage('next');
        } else if (e.key === 'ArrowLeft') {
            slideImage('prev');
        }
    });

    // Добавляем класс для начальной анимации первого слайда
    const firstSlide = slider.querySelector('.item');
    if (firstSlide) {
        firstSlide.style.opacity = '0';
        requestAnimationFrame(() => {
            firstSlide.style.transition = 'opacity 0.8s ease-in-out';
            firstSlide.style.opacity = '1';
        });
    }
});

