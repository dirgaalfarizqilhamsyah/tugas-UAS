const paragraph = document.getElementById('deskripsi');
const button = document.getElementById('toggleButton');
let cartTotal = 0;

function toggleText() {
  paragraph.classList.toggle('line-clamp-2');
  button.textContent = paragraph.classList.contains('line-clamp-2') ? 'Baca Selengkapnya' : 'Lihat Detailnya';
}

function scrollToRegister() {
  const registrationSection = document.getElementById('pendaftaran');
  registrationSection.scrollIntoView({ behavior: 'smooth' });
}

let cartItems = [];
const cartSection = document.getElementById('keranjang-belanja');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
}

function addToCart(name, price) {
  const existingItem = cartItems.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({ name, price, quantity: 1 });
  }
  renderCart();
}

function removeFromCart(name) {
  const itemIndex = cartItems.findIndex(item => item.name === name);
  if (itemIndex > -1) {
    cartItems[itemIndex].quantity--;
    if (cartItems[itemIndex].quantity === 0) {
      cartItems.splice(itemIndex, 1);
    }
  }
  renderCart();
}

function renderCart() {
  if (cartItems.length > 0) {
    cartSection.style.display = 'block';
  } else {
    cartSection.style.display = 'none';
    return;
  }

  cartItemsContainer.innerHTML = '';
  let total = 0;

  cartItems.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItemElement = document.createElement('div');
    cartItemElement.className = 'flex justify-between items-center bg-white p-4 rounded-lg shadow';
    cartItemElement.innerHTML = `
      <div>
        <h4 class="font-bold text-[#3f51d2]">${item.name}</h4>
        <p class="text-gray-600 text-sm">${formatRupiah(item.price)} x ${item.quantity}</p>
      </div>
      <div class="flex items-center">
        <p class="font-bold text-lg mr-6">${formatRupiah(itemTotal)}</p>
        <button onclick="removeFromCart('${item.name}')" class="bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition flex items-center justify-center">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal = total;
  cartTotalElement.textContent = formatRupiah(total);
}

function showInstallmentCalculator() {
  const installmentCalculatorSection = document.getElementById('kalkulator-cicilan');
  installmentCalculatorSection.style.display = 'block';
  document.getElementById('total-harga').value = formatRupiah(cartTotal);
  installmentCalculatorSection.scrollIntoView({ behavior: 'smooth' });
}

function calculateInstallment() {
  const totalHarga = cartTotal;
  const uangMuka = parseFloat(document.getElementById('uang-muka').value) || 0;
  const tenor = parseInt(document.getElementById('tenor').value);

  if (uangMuka >= totalHarga) {
    alert("Uang muka tidak boleh lebih besar atau sama dengan total harga.");
    return;
  }

  const sisaHutang = totalHarga - uangMuka;
  const cicilan = sisaHutang / tenor;

  document.getElementById('cicilan-per-bulan').textContent = formatRupiah(cicilan);
  document.getElementById('hasil-cicilan').style.display = 'block';
}

function handleRegistration(event) {
  event.preventDefault();
  if (cartItems.length === 0) {
    alert("Keranjang belanja Anda kosong. Silakan pilih mobil terlebih dahulu.");
    return;
  }
  showInstallmentCalculator();
}
