// JavaScript kodlari | Online Shop Magazine

// Barcha tugmalarni topish
const purchaseButtons = document.querySelectorAll("button")

// Har bir tugmaga bosilganda xabar chiqarish
purchaseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    alert(
      "Rahmat! Siz mahsulotni tanladingiz. Iltimos, buyurtma uchun Telegram sahifamizga yozing: @MarjonaMardonovna"
    )
  })
})

// Savatcha uchun massiv
let cart = []

// Elementlarni olish
document.addEventListener("DOMContentLoaded", () => {
  const addToCartBtns = document.querySelectorAll(".add-to-cart")
  const cartBtn = document.getElementById("cart-btn")
  const cartModal = document.getElementById("cart-modal")
  const closeCartBtn = document.getElementById("close-cart")
  const cartItemsDiv = document.getElementById("cart-items")
  const cartTotalSpan = document.getElementById("cart-total")
  const cartCountSpan = document.getElementById("cart-count")
  const checkoutBtn = document.getElementById("checkout-btn")
  const userNameInput = document.getElementById("user-name")
  const userPhoneInput = document.getElementById("user-phone")

  // Mahsulotni savatchaga qo'shish
  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation()
      const title = btn.getAttribute("data-title")
      const price = parseFloat(btn.getAttribute("data-price"))
      const img = btn.getAttribute("data-img")
      // Savatchada borligini tekshirish
      const existing = cart.find(
        (item) =>
          item.title === title && item.price === price && item.img === img
      )
      if (existing) {
        existing.qty += 1
      } else {
        cart.push({ title, price, img, qty: 1 })
      }
      updateCartUI()
    })
  })

  // Savatchani ochish
  cartBtn.addEventListener("click", () => {
    cartModal.classList.remove("hidden")
    updateCartUI()
  })

  // Savatchani yopish
  closeCartBtn.addEventListener("click", () => {
    cartModal.classList.add("hidden")
  })

  // Savatchani yangilash
  function updateCartUI() {
    cartItemsDiv.innerHTML = ""
    let total = 0
    let count = 0
    cart.forEach((item) => {
      total += item.price * item.qty
      count += item.qty
      const div = document.createElement("div")
      div.className = "flex items-center justify-between mb-2"
      div.innerHTML = `
        <div class="flex items-center gap-2">
          <img src="${item.img}" alt="${item.title}" class="w-10 h-10 rounded" />
          <span class="text-amber-950">${item.title}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-amber-950">${item.price}$ x ${item.qty}</span>
          <button class="remove-item text-red-500" data-title="${item.title}" data-price="${item.price}" data-img="${item.img}">&times;</button>
        </div>
      `
      cartItemsDiv.appendChild(div)
    })
    cartTotalSpan.textContent = `$${total}`
    cartCountSpan.textContent = count
    // Remove item
    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const title = btn.getAttribute("data-title")
        const price = parseFloat(btn.getAttribute("data-price"))
        const img = btn.getAttribute("data-img")
        cart = cart.filter(
          (item) =>
            !(item.title === title && item.price === price && item.img === img)
        )
        updateCartUI()
      })
    })
  }

  // Rasmiylashtirish (Telegramga yuborish)
  checkoutBtn.addEventListener("click", async () => {
    if (cart.length === 0) {
      alert("Savatcha bo'sh!")
      return
    }
    const userName = userNameInput.value.trim()
    const userPhone = userPhoneInput.value.trim()
    if (!userName || !userPhone) {
      alert("Iltimos, ismingiz va telefon raqamingizni kiriting!")
      return
    }
    // Buyurtma matni
    let orderText = "Yangi buyurtma!%0A"
    orderText += `Ism: ${userName}%0ATel: ${userPhone}%0A`
    cart.forEach((item) => {
      orderText += `${item.title} - ${item.price}$ x ${item.qty} = ${
        item.price * item.qty
      }$%0A`
    })
    orderText += `Jami: $${cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    )}`

    // Telegram botga yuborish (token va chat_id ni o'zgartiring!)
    const botToken = "7813533326:AAHRTaTaq9RmfIrbu0lZ8zR4zuD0x6u4U6E" // <-- o'zgartiring
    const chatId = "6475861105" // <-- o'zgartiring
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${orderText}`
    try {
      await fetch(url)
      alert("Buyurtmangiz yuborildi! Tez orada siz bilan bog'lanamiz.")
      cart = []
      userNameInput.value = ""
      userPhoneInput.value = ""
      updateCartUI()
      cartModal.classList.add("hidden")
    } catch (e) {
      alert("Xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.")
    }
  })
})
