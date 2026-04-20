const tg = window.Telegram.WebApp;
tg.expand();

let cart = {};

// Добавление товара
function add(item) {
  if (!cart[item]) {
    cart[item] = 1;
  } else {
    cart[item]++;
  }

  tg.HapticFeedback.impactOccurred('light');
  updateCart();
}

// Удаление одного товара
function removeItem(item) {
  if (cart[item]) {
    cart[item]--;

    if (cart[item] <= 0) {
      delete cart[item];
    }
  }

  updateCart();
}

// Очистка корзины
function clearCart() {
  cart = {};
  updateCart();
}

// Обновление UI корзины
function updateCart() {
  const cartDiv = document.getElementById("cart");

  let html = "<h3>Coșul tău</h3>";

  let hasItems = false;

  for (let item in cart) {
    hasItems = true;

    html += `
      <div>
        ${item} x${cart[item]}
        <button onclick="removeItem('${item}')" style="width:auto;padding:5px 8px;margin-left:10px;">
          -
        </button>
      </div>
    `;
  }

  if (!hasItems) {
    html += "<div>Coșul este gol</div>";
  } else {
    html += `
      <button onclick="checkout()">Comandă</button>
      <button onclick="clearCart()" style="margin-top:8px;background:#333;color:white;">
        Golește coșul
      </button>
    `;
  }

  cartDiv.innerHTML = html;
}

// Оформление заказа
function checkout() {
  const order = {
    type: "order",
    user: tg.initDataUnsafe?.user || null,
    cart: cart,
    time: new Date().toISOString()
  };

  tg.sendData(JSON.stringify(order));

  tg.HapticFeedback.notificationOccurred('success');

  tg.close();
}

// стартовое обновление
updateCart();