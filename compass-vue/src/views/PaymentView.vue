<template>
  <div class="payment-container">
    <h1>💳 Thanh Toán</h1>
    
    <div class="content">
      <div class="payment-form-section">
        <h2>Nhập Thẻ Thanh Toán</h2>
        
        <form @submit.prevent="processPayment" class="payment-form">
          <!-- Card Number -->
          <div class="form-group">
            <label for="cardNumber">Số Thẻ</label>
            <input
              v-model="form.cardNumber"
              type="text"
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              @blur="validateCardNumber"
              @input="formatCardNumber"
              maxlength="19"
              required
            />
            <span v-if="cardErrors" class="error">{{ cardErrors }}</span>
          </div>

          <!-- Cardholder Name -->
          <div class="form-group">
            <label for="cardholderName">Tên Chủ Thẻ</label>
            <input
              v-model="form.cardholderName"
              type="text"
              id="cardholderName"
              placeholder="John Doe"
              required
            />
          </div>

          <!-- Expiry and CVV -->
          <div class="form-row">
            <div class="form-group">
              <label for="expiry">Hết Hạn (MM/YY)</label>
              <input
                v-model="form.expiry"
                type="text"
                id="expiry"
                placeholder="MM/YY"
                @input="formatExpiry"
                maxlength="5"
                required
              />
            </div>
            <div class="form-group">
              <label for="cvv">CVV</label>
              <input
                v-model="form.cvv"
                type="password"
                id="cvv"
                placeholder="123"
                maxlength="4"
                required
              />
            </div>
          </div>

          <!-- Amount -->
          <div class="form-group">
            <label for="amount">Số Tiền (VND)</label>
            <input
              v-model.number="form.amount"
              type="number"
              id="amount"
              placeholder="100000"
              min="1000"
              step="1000"
              required
            />
          </div>

          <!-- Payment Method -->
          <div class="form-group">
            <label for="method">Phương Thức</label>
            <select v-model="form.method" id="method" required>
              <option value="credit_card">Thẻ Tín Dụng</option>
              <option value="debit_card">Thẻ Ghi Nợ</option>
              <option value="prepaid">Thẻ Trả Trước</option>
            </select>
          </div>

          <!-- Checkbox -->
          <div class="form-group checkbox">
            <input
              v-model="form.saveCard"
              type="checkbox"
              id="saveCard"
            />
            <label for="saveCard">Lưu thẻ này cho lần sau</label>
          </div>

          <button type="submit" class="btn-primary" @click="capturePaymentAttempt">
            Thanh Toán {{ formatCurrency(form.amount) }}
          </button>
        </form>

        <div v-if="paymentMessage" :class="['message', paymentMessage.type]">
          {{ paymentMessage.text }}
        </div>
      </div>

      <!-- Order Summary -->
      <div class="order-summary">
        <h2>Tóm Tắt Đơn Hàng</h2>
        <div class="summary-item">
          <span>Sản phẩm</span>
          <span>{{ formatCurrency(form.amount * 0.85) }}</span>
        </div>
        <div class="summary-item">
          <span>VAT (10%)</span>
          <span>{{ formatCurrency(form.amount * 0.1) }}</span>
        </div>
        <div class="summary-item">
          <span>Phí vận chuyển</span>
          <span>{{ formatCurrency(form.amount * 0.05) }}</span>
        </div>
        <div class="summary-total">
          <span>Tổng Cộng</span>
          <span>{{ formatCurrency(form.amount) }}</span>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="nav-links">
      <router-link to="/" class="link">← Trang Chủ</router-link>
      <router-link to="/billing" class="link">Hóa Đơn →</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { usePosthog } from "../composables/useLeanbaseCompass";

const { posthog } = usePosthog();

const form = ref({
  cardNumber: "",
  cardholderName: "",
  expiry: "",
  cvv: "",
  amount: 50000,
  method: "credit_card",
  saveCard: false,
});

const paymentMessage = ref(null);
const cardErrors = ref("");

function formatCardNumber(e) {
  let value = e.target.value.replace(/\s/g, "");
  let formatted = value.replace(/(\d{4})/g, "$1 ").trim();
  form.value.cardNumber = formatted.slice(0, 19);
}

function formatExpiry(e) {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length >= 2) {
    value = value.slice(0, 2) + "/" + value.slice(2, 4);
  }
  form.value.expiry = value;
}

function validateCardNumber() {
  const cardNumber = form.value.cardNumber.replace(/\s/g, "");
  if (cardNumber.length === 16) {
    cardErrors.value = "";
  } else if (cardNumber.length > 0) {
    cardErrors.value = "Số thẻ phải có 16 chữ số";
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function capturePaymentAttempt() {
  posthog.capture("qe_payment_attempt", {
    amount: form.value.amount,
    method: form.value.method,
    save_card: form.value.saveCard,
    from: "vue",
  });
}

function processPayment() {
  // Validate
  if (!form.value.cardNumber.replace(/\s/g, "") || form.value.cardNumber.replace(/\s/g, "").length !== 16) {
    cardErrors.value = "Vui lòng nhập số thẻ hợp lệ";
    return;
  }

  if (!form.value.expiry || form.value.expiry.length !== 5) {
    paymentMessage.value = { type: "error", text: "Hết hạn không hợp lệ" };
    return;
  }

  if (!form.value.cvv || form.value.cvv.length < 3) {
    paymentMessage.value = { type: "error", text: "CVV không hợp lệ" };
    return;
  }

  // Simulate payment success
  posthog.capture("qe_payment_success", {
    amount: form.value.amount,
    method: form.value.method,
    card_last_4: form.value.cardNumber.slice(-4),
    from: "vue",
  });

  paymentMessage.value = {
    type: "success",
    text: `✅ Thanh toán ${formatCurrency(form.value.amount)} thành công!`,
  };

  // Reset form after 2 seconds
  setTimeout(() => {
    form.value = {
      cardNumber: "",
      cardholderName: "",
      expiry: "",
      cvv: "",
      amount: 50000,
      method: "credit_card",
      saveCard: false,
    };
    paymentMessage.value = null;
  }, 2000);
}
</script>

<style scoped>
.payment-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #42b883;
}

h2 {
  margin-bottom: 20px;
  font-size: 1.5em;
  color: #333;
}

.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.payment-form-section {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 4px rgba(66, 184, 131, 0.3);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.checkbox {
  flex-direction: row;
  align-items: center;
}

.checkbox input {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  cursor: pointer;
}

.checkbox label {
  margin: 0;
  cursor: pointer;
}

.error {
  color: #e74c3c;
  font-size: 0.9em;
  margin-top: 5px;
}

.btn-primary {
  padding: 12px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #359268;
}

.btn-primary:active {
  transform: scale(0.98);
}

.message {
  padding: 12px;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.order-summary {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.summary-item,
.summary-total {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.summary-total {
  border-bottom: none;
  border-top: 2px solid #333;
  margin-top: 10px;
  padding-top: 15px;
  font-weight: 700;
  font-size: 1.1em;
  color: #42b883;
}

.nav-links {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 30px;
}

.link {
  flex: 1;
  padding: 12px;
  text-align: center;
  background: #e8f5e9;
  color: #42b883;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.3s;
}

.link:hover {
  background: #42b883;
  color: white;
}

@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .nav-links {
    flex-direction: column;
  }
}
</style>
