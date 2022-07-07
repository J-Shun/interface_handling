const api_path = "shun11023/";
const url = "https://livejs-api.hexschool.io/api/livejs/v1/customer/shun11023/";

// button
const productList = document.querySelector(".productWrap");
const clearAllBtn = document.querySelector(".discardAllBtn");
const sendBtn = document.querySelector(".orderInfo-btn");

// display
const productDisplay = document.querySelector(".productWrap");
const cartDisplay = document.querySelector(".shoppingCart-table tbody");

// data
let itemList = [];
let cart;
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0,
});

function init() {
  axios
    .get(url + `products`)
    .then((res) => {
      itemList = res.data.products;
      renderItem();
      initCart();
    })
    .catch((err) => {
      console.log(err.message);
    });
}

function initCart() {
  axios
    .get(url + "carts")
    .then((res) => {
      cart = res.data;
      renderCart();
    })
    .catch((err) => {
      console.log(err);
    });
}

function renderItem() {
  let allContent = "";
  itemList.forEach((item) => {
    allContent += `
    <li class="productCard">
      <h4 class="productType">新品</h4>
      <img
        src=${item.images}
        alt=""
      />
      <a href="#" class="addCardBtn" data-id=${item.id}>加入購物車</a>
      <h3>${item.title}</h3>
      <del class="originPrice">${currencyFormatter.format(
        item.origin_price
      )}</del>
      <p class="nowPrice">${currencyFormatter.format(item.price)}</p>
    </li>`;
  });
  productDisplay.innerHTML = allContent;
}

function renderCart() {
  const cartList = cart.carts;
  let allContent = "";

  if (cart.carts.length < 1) {
    cartDisplay.innerHTML = "<p>目前購物車無商品</p>";
    return;
  }

  allContent += `
  <tr>
    <th width="40%">品項</th>
    <th width="15%">單價</th>
    <th width="15%">數量</th>
    <th width="15%">金額</th>
    <th width="15%"></th>
  </tr>`;

  cartList.forEach((item) => {
    allContent += `
    <tr>
      <td>
        <div class="cardItem-title">
          <img src=${item.product.images} alt="" />
          <p>${item.product.title}</p>
        </div>
      </td>
      <td>${currencyFormatter.format(item.product.price)}</td>
      <td>${item.quantity}</td>
      <td>${currencyFormatter.format(item.product.price * item.quantity)}</td>
      <td class="discardBtn">
        <a href="#" class="material-icons" data-id=${item.id}> clear </a>
      </td>
    </tr>`;
  });

  allContent += `
  <tr>
    <td>
      <a href="#" class="discardAllBtn">刪除所有品項</a>
    </td>
    <td></td>
    <td></td>
    <td>
      <p>總金額</p>
    </td>
    <td>${currencyFormatter.format(cart.finalTotal)}</td>
  </tr>`;
  cartDisplay.innerHTML = allContent;
}

function addItem(e) {
  if (!e.target.classList.contains("addCardBtn")) return;
  e.preventDefault();
  const itemId = e.target.getAttribute("data-id");
  const carList = cart.carts;
  obj = { data: {} };
  const isList = carList.filter((item) => item.product.id === itemId);

  if (isList.length > 0) {
    obj.data.productId = itemId;
    obj.data.quantity = isList[0].quantity + 1;
  } else {
    obj.data.productId = itemId;
    obj.data.quantity = 1;
  }

  axios
    .post(url + "carts", obj)
    .then((res) => {
      cart = res.data;
      renderCart();
    })
    .catch((err) => {
      console.log(err);
    });
}

function clearAll(e) {
  if (!e.target.classList.contains("discardAllBtn")) return;
  e.preventDefault();

  if (cart.carts.length === 0) return;
  axios
    .delete(url + "carts")
    .then((res) => {
      cart = res.data;
      renderCart();
    })
    .catch((err) => {
      console.log(err);
    });
}

function deleteItem(e) {
  if (!e.target.classList.contains("material-icons")) return;
  e.preventDefault();

  const cartId = e.target.getAttribute("data-id");

  axios
    .delete(url + "carts/" + cartId)
    .then((res) => {
      cart = res.data;
      renderCart();
    })
    .catch((err) => {
      console.log(err);
    });
}

function sendOrder(e) {
  e.preventDefault();

  const name = document.querySelector("#customerName").value;
  const phone = document.querySelector("#customerPhone").value;
  const mail = document.querySelector("#customerEmail").value;
  const address = document.querySelector("#customerAddress").value;
  const payment = document.querySelector("#tradeWay").value;

  if (
    name.length < 1 ||
    phone.length < 1 ||
    mail.length < 1 ||
    address.length < 1
  ) {
    alert("請填寫完整資料");
    return;
  } else {
    const obj = { data: { user: {} } };
    obj.data.user.name = name;
    obj.data.user.tel = phone;
    obj.data.user.email = mail;
    obj.data.user.address = address;
    obj.data.user.payment = payment;
    axios
      .post(url + "orders", obj)
      .then((res) => {
        alert("下訂成功");
        location.reload();
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  }
}

productList.addEventListener("click", addItem);
cartDisplay.addEventListener("click", clearAll);
cartDisplay.addEventListener("click", deleteItem);
sendBtn.addEventListener("click", sendOrder);

init();
