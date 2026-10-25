// ====== Генерация фона (животные и сердечки) ======
const bgContainer = document.getElementById('background-elements');
const bgEmojis = ['🐱', '🐰', '🐶', '🐼', '❤️', '💖', '💕', '🌸'];

function createBackgroundItem() {
  const el = document.createElement('div');
  el.classList.add('floating-emoji');
  el.innerText = bgEmojis[Math.floor(Math.random() * bgEmojis.length)];
  
  // Случайная позиция
  el.style.left = Math.random() * 100 + 'vw';
  el.style.top = Math.random() * 100 + 'vh';
  
  // Случайная скорость и задержка для анимации
  const duration = 4 + Math.random() * 6; // от 4 до 10 секунд
  el.style.animationDuration = duration + 's';
  el.style.animationDelay = (Math.random() * 5) + 's';
  
  // Случайный размер
  el.style.fontSize = (20 + Math.random() * 30) + 'px';

  bgContainer.appendChild(el);
}

// Создаем 25 элементов на фоне
for (let i = 0; i < 25; i++) {
  createBackgroundItem();
}


// ====== Слайд 1: Убегающая кнопка и Взрыв сердец ======
const noBtn = document.getElementById('noBtn');
const slide1 = document.getElementById('slide1');
const yesBtn = document.getElementById('yesBtn');
const explosionContainer = document.getElementById('heart-explosion');

let noAttempts = 0; // Счетчик нажатий на "Нет"

// Плавное убегание кнопки
function dodge() {
  noAttempts++;
  
  const slideRect = slide1.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  // Координаты, чтобы кнопка осталась внутри карточки
  const maxX = slideRect.width - btnRect.width - 40;
  const maxY = slideRect.height - btnRect.height - 60;

  // Генерируем новые координаты
  const newX = Math.random() * maxX + 20;
  const newY = Math.random() * maxY + 20;

  // Перемещаем (плавность задана в CSS через transition)
  noBtn.style.left = newX + 'px';
  noBtn.style.top = newY + 'px';
  
  // Уменьшаем кнопку при каждой попытке
  const newScale = Math.max(0.2, 1 - (noAttempts * 0.15));
  noBtn.style.transform = `scale(${newScale})`;
  
  // Меняем текст для смеха
  const texts = ["Нет", "Точно нет?", "Уверена?", "Подумай!", "Не убежишь!", "Давай 'Да'!", "Ну пожалуйста 🥺"];
  noBtn.innerText = texts[Math.min(noAttempts, texts.length - 1)];
}

// Отслеживание курсора мыши (для ПК)
document.addEventListener('mousemove', (e) => {
  if (!slide1.classList.contains('active')) return;
  
  const btnRect = noBtn.getBoundingClientRect();
  const distance = Math.hypot(
    e.clientX - (btnRect.left + btnRect.width / 2),
    e.clientY - (btnRect.top + btnRect.height / 2)
  );

  // Если курсор ближе 80 пикселей — убегаем
  if (distance < 80) {
    dodge();
  }
});

// Отслеживание касания (для телефонов)
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault(); // Блокируем клик
  dodge();
}, { passive: false });

// На случай если умудрились кликнуть
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  dodge();
});


// Взрыв сердец при нажатии на "Да"
yesBtn.addEventListener('click', () => {
  // Создаем 50 сердец
  for (let i = 0; i < 50; i++) {
    const heart = document.createElement('div');
    heart.classList.add('exploding-heart');
    heart.innerText = Math.random() > 0.5 ? '❤️' : '💖';
    
    // Задаем случайное направление разлета
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 300;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    heart.style.setProperty('--x', `${x}px`);
    heart.style.setProperty('--y', `${y}px`);
    
    // Случайный размер
    heart.style.fontSize = (15 + Math.random() * 25) + 'px';
    
    explosionContainer.appendChild(heart);
    
    // Удаляем через секунду, чтобы не засорять страницу
    setTimeout(() => heart.remove(), 1000);
  }

  // Переключаем слайд с небольшой задержкой
  setTimeout(() => {
    showSlide('slide2');
  }, 600);
});


// ====== Универсальная навигация ======
function showSlide(id) {
  document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Кнопки «Далее»
document.querySelectorAll('.next-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = btn.dataset.next;
    if (next === 'slide5') {
      buildReminder();
    }
    showSlide(next);
  });
});

// ====== Слайд 5: Напоминание ======
function buildReminder() {
  const dateVal = document.getElementById('datePicker').value;
  const timeVal = document.getElementById('timePicker').value;

  let dateStr = 'дату ты ещё не выбрала';
  if (dateVal) {
    const d = new Date(dateVal + 'T00:00:00');
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    dateStr = d.toLocaleDateString('ru-RU', options);
  }

  let timeStr = timeVal ? timeVal : 'время уточним';

  const checked = document.querySelectorAll('.food-card input:checked');
  let foodStr = '';
  if (checked.length > 0) {
    const foods = Array.from(checked).map(c => c.value);
    foodStr = 'Кухня: ' + foods.join(', ') + '.';
  } else {
    foodStr = 'Еду выберем вместе.';
  }

  const text = `📅 ${dateStr}\n⏰ ${timeStr}\n🍽 ${foodStr}\n\nБудь готова, я заеду за тобой.`;
  document.getElementById('reminderText').innerText = text;
}
