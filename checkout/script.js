/* ==================== Checkout logic ==================== */
const WHATSAPP_NUMBER = "201551839053";

/* ⚠️ تحذير: التوكن مكشوف في الواجهة الأمامية. يُنصح بنقله إلى سيرفر. */
const TELEGRAM_BOT_TOKEN = '8504476481:AAEEPI5g0ON7dPvHaAXV1W38shqPF8pnD2w';
const TELEGRAM_CHAT_ID = '6891429238';

const currentProduct = {
    id: 14,
    title: "بيتزا إيطالية",
    author: "ماركو الإيطالي",
    price: 250,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
};

let selectedShipping = 10;
let shippingName = "Fast & Safe Shipping";

document.addEventListener('DOMContentLoaded', function () {
    setupShippingOptions();
    updateOrderSummary();
    document.getElementById('submitOrderBtn').addEventListener('click', submitOrder);
});

function setupShippingOptions() {
    const shippingOptions = document.querySelectorAll('.shipping-option');
    shippingOptions.forEach(option => {
        option.addEventListener('click', function () {
            shippingOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedShipping = parseFloat(this.dataset.price);
            shippingName = this.dataset.name;
            updateOrderSummary();
        });
    });
}

function updateOrderSummary() {
    const subtotal = currentProduct.price;
    const shipping = selectedShipping;
    const total = subtotal + shipping;

    document.getElementById('summarySubtotal').textContent = `${subtotal} جنيه`;
    document.getElementById('summaryShipping').textContent =
        shipping === 0 ? 'مجاناً' : `${shipping}.00 جنيه`;
    document.getElementById('summaryTotal').textContent = `${total} جنيه`;
}

async function submitOrder() {
    const contact = document.getElementById('modalContact').value.trim();
    const firstName = document.getElementById('modalFirstName').value.trim();
    const lastName = document.getElementById('modalLastName').value.trim();
    const address = document.getElementById('modalAddress').value.trim();
    const city = document.getElementById('modalCity').value.trim();
    const phone = document.getElementById('modalPhone').value.trim();
    const country = document.getElementById('modalCountry').value;
    const governorate = document.getElementById('modalGovernorate').value;

    const errorAlert = document.getElementById('modalErrorAlert');

    if (!contact || !firstName || !lastName || !address || !city || !phone) {
        errorAlert.textContent = 'يرجى ملء جميع الحقول المطلوبة';
        errorAlert.style.display = 'block';
        setTimeout(() => { errorAlert.style.display = 'none'; }, 3000);
        return;
    }

    const phoneRegex = /^01[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        errorAlert.textContent = 'يرجى إدخال رقم هاتف مصري صحيح (11 رقم)';
        errorAlert.style.display = 'block';
        setTimeout(() => { errorAlert.style.display = 'none'; }, 3000);
        return;
    }

    const successAlert = document.getElementById('modalSuccessAlert');
    successAlert.style.display = 'block';

    const total = currentProduct.price + selectedShipping;

    const message = `🛍️ *طلب شراء جديد* 🛍️

━━━━━━━━━━━━━━━━━━━
📋 *بيانات المنتج*
━━━━━━━━━━━━━━━━━━━
🖼️ المنتج: ${currentProduct.title}
🆔 رقم المنتج: #${currentProduct.id}
📸 المصور: ${currentProduct.author}
💰 سعر المنتج: ${currentProduct.price} جنيه
🚚 تكلفة الشحن: ${selectedShipping === 0 ? 'مجاناً' : selectedShipping + ' جنيه'}
💵 الإجمالي: ${total} جنيه

━━━━━━━━━━━━━━━━━━━
👤 *بيانات العميل*
━━━━━━━━━━━━━━━━━━━
👤 الاسم: ${firstName} ${lastName}
📧 البريد/الهاتف: ${contact}
📞 رقم الهاتف: ${phone}
🌍 الدولة: ${country}
🏙️ المدينة: ${city}
📍 المحافظة: ${governorate}
🏠 العنوان: ${address}

━━━━━━━━━━━━━━━━━━━
🚚 *معلومات الشحن*
━━━━━━━━━━━━━━━━━━━
📦 طريقة الشحن: ${shippingName}
⏰ *تم إرسال الطلب في*: ${new Date().toLocaleString('ar-EG')}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
    } catch (error) {
        console.log("Telegram Error:", error);
    }

    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        setTimeout(() => { successAlert.style.display = 'none'; }, 2000);
    }, 1500);
}