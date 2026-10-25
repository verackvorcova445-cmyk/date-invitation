// ====== Слайд 1: Убегающая кнопка «Нет» ======
const noBtn = document.getElementById('noBtn');
const slide1 = document.getElementById('slide1');
const yesBtn = document.getElementById('yesBtn');

// Функция «убегания» — работает и для мыши, и для пальца
function dodge() {
  const slideRect = slide1.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  // Максимальные координаты, чтобы кнопка осталась в пределах слайда
  const maxX = slideRect.width - btnRect.width - 20;
  const maxY = slideRect.height - btnRect.height - 20;

  // Случайная новая позиция (отступ 20px от краёв)
  const newX = Math.random() * maxX + 10;
  const newY = Math.random() * maxY + 10;

  // Переводим в абсолютное позиционирование внутри слайда
  noBtn.style.position = 'absolute';
  noBtn.style.left = newX + 'px';
  noBtn.style.top = newY + 'px';
}

// Для компьютера: убегает при наведении курсора
noBtn.addEventListener('mouseenter', dodge);

// Для телефона: убегает при попытке касания (touchstart срабатывает раньше click)
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault(); // блокируем клик
  dodge();
}, { passive: false });

// Дополнительная страховка: если каким-то чудом кликнули — тоже убегает
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  dodge();
});

// Кнопка «Да» в сердечке — переход на слайд 2
yesBtn.addEventListener('click', () => {
  showSlide('slide2');
});

// ====== Универсальная навигация между слайдами ======
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

// ====== Слайд 5: Формирование напоминания ======
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

  // Собираем выбранную еду
  const checked = document.querySelectorAll('.food-options input:checked');
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