// ====== Генерация фона (маленькие эмодзи и сердечки) ======
const bgContainer = document.getElementById('background-elements');
const bgEmojis = ['❤️', '💖', '💕', '🌸', '✨'];

function createBackgroundItem() {
  const el = document.createElement('div');
  el.classList.add('floating-emoji');
  el.innerText = bgEmojis[Math.floor(Math.random() * bgEmojis.length)];
  
  el.style.left = Math.random() * 100 + 'vw';
  el.style.top = Math.random() * 100 + 'vh';
  
  const duration = 4 + Math.random() * 6;
  el.style.animationDuration = duration + 's';
  el.style.animationDelay = (Math.random() * 5) + 's';
  el.style.fontSize = (15 + Math.random() * 25) + 'px';

  bgContainer.appendChild(el);
}

for (let i = 0; i < 20; i++) {
  createBackgroundItem();
}

// ====== Слайд 1: Убегающая кнопка и Взрыв сердец ======
const noBtn = document.getElementById('noBtn');
const slide1 = document.getElementById('slide1');
const yesBtn = document.getElementById('yesBtn');
const explosionContainer = document.getElementById('heart-explosion');

let noAttempts = 0;

function dodge() {
  noAttempts++;
  
  const slideRect = slide1.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const maxX = slideRect.width - btnRect.width - 40;
  const maxY = slideRect.height - btnRect.height - 60;

  const newX = Math.random() * maxX + 20;
  const newY = Math.random() * maxY + 20;

  noBtn.style.left = newX + 'px';
  noBtn.style.top = newY + 'px';
  
  const texts = ["Нет", "Точно нет?", "Уверена?", "Подумай!", "Не убежишь!", "Давай 'Да'!", "Ну пожалуйста 🥺"];
  noBtn.innerText = texts[Math.min(noAttempts, texts.length - 1)];
}

document.addEventListener('mousemove', (e) => {
  if (!slide1.classList.contains('active')) return;
  
  const btnRect = noBtn.getBoundingClientRect();
  const distance = Math.hypot(
    e.clientX - (btnRect.left + btnRect.width / 2),
    e.clientY - (btnRect.top + btnRect.height / 2)
  );

  if (distance < 80) {
    dodge();
  }
});

noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  dodge();
}, { passive: false });

noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  dodge();
});

// Взрыв сердец
yesBtn.addEventListener('click', () => {
  for (let i = 0; i < 50; i++) {
    const heart = document.createElement('div');
    heart.classList.add('exploding-heart');
    heart.innerText = Math.random() > 0.5 ? '❤️' : '💖';
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 300;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    heart.style.setProperty('--x', `${x}px`);
    heart.style.setProperty('--y', `${y}px`);
    heart.style.fontSize = (15 + Math.random() * 25) + 'px';
    
    explosionContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
  }

  setTimeout(() => {
    showSlide('slide2');
  }, 600);
});

// ====== Универсальная навигация ======
function showSlide(id) {
  document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

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
