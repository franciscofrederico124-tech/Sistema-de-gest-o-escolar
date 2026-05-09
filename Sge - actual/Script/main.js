const exit = document.querySelector('.exit');
const menu = document.getElementById('menu');
const nav = document.getElementById('nav');
const items = document.getElementById('items')

menu.addEventListener('click', () => {
  nav.style.display = 'grid';
  
  setTimeout(() => {
    nav.style.background = 'rgba(6, 21, 4, 0.29)';
    items.style.transform = 'translateX(0%)';
  }, 10)
})

exit.addEventListener('click', () => {
  items.style.transform = 'translateX(-100%)';
  
  nav.style.background = 'transpared';
  setTimeout(() => {
    nav.style.display = 'none';
  }, 100)
})