<template>
  <div class="billing-container">
    <h1>📋 Hóa Đơn & Lịch Sử</h1>

    <div class="content">
      <!-- Billing Info Section -->
      <div class="billing-info">
        <h2>Thông Tin Thanh Toán</h2>
        
        <div class="info-card">
          <div class="info-item">
            <label>Khách Hàng</label>
            <p>{{ billingInfo.customer }}</p>
          </div>
          <div class="info-item">
            <label>Email</label>
            <p>{{ billingInfo.email }}</p>
          </div>
          <div class="info-item">
            <label>Số Điện Thoại</label>
            <p>{{ billingInfo.phone }}</p>
          </div>
          <div class="info-item">
            <label>Địa Chỉ</label>
            <p>{{ billingInfo.address }}</p>
          </div>
        </div>

        <button @click="editBillingInfo" class="btn-edit">✏️ Chỉnh Sửa</button>
      </div>

      <!-- Current Bill -->
      <div class="current-bill">
        <h2>Hóa Đơn Hiện Tại</h2>
        
        <div class="bill-card">
          <div class="bill-date">
            <strong>Kỳ:</strong> {{ currentBill.period }}
          </div>
          <div class="bill-items">
            <div class="bill-item">
              <span>Dịch Vụ Basic</span>
              <span>{{ formatCurrency(currentBill.serviceBasic) }}</span>
            </div>
            <div class="bill-item">
              <span>Add-on Premium</span>
              <span>{{ formatCurrency(currentBill.addons) }}</span>
            </div>
            <div class="bill-item">
              <span>Sử Dụng Quá</span>
              <span>{{ formatCurrency(currentBill.overage) }}</span>
            </div>
          </div>

          <div class="bill-summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>{{ formatCurrency(currentBill.subtotal) }}</span>
            </div>
            <div class="summary-row">
              <span>Thuế (10%):</span>
              <span>{{ formatCurrency(currentBill.tax) }}</span>
            </div>
            <div class="summary-row total">
              <span>Tổng Cộng:</span>
              <span>{{ formatCurrency(currentBill.total) }}</span>
            </div>
          </div>

          <div class="bill-actions">
            <button @click="downloadInvoice" class="btn-secondary">⬇️ Tải PDF</button>
            <button @click="payNow" class="btn-primary">💳 Thanh Toán Ngay</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Invoice History -->
    <div class="invoice-history">
      <h2>Lịch Sử Hóa Đơn</h2>
      
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Kỳ</th>
            <th>Số Tiền</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in invoiceHistory" :key="invoice.id">
            <td>{{ invoice.date }}</td>
            <td>{{ invoice.period }}</td>
            <td>{{ formatCurrency(invoice.amount) }}</td>
            <td>
              <span :class="['status', invoice.status]">
                {{ getStatusLabel(invoice.status) }}
              </span>
            </td>
            <td>
              <button @click="viewInvoice(invoice.id)" class="btn-link">Xem</button>
              <button @click="downloadInvoice(invoice.id)" class="btn-link">Tải</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Payment Methods -->
    <div class="payment-methods">
      <h2>Phương Thức Thanh Toán</h2>
      
      <div class="methods-grid">
        <div v-for="method in paymentMethods" :key="method.id" 
             class="method-card"
             @click="selectPaymentMethod(method)"
             :class="{ selected: selectedPaymentMethod === method.id }">
          <div class="method-icon">{{ method.icon }}</div>
          <div class="method-info">
            <p class="method-name">{{ method.name }}</p>
            <p class="method-detail">{{ method.detail }}</p>
          </div>
          <input v-if="selectedPaymentMethod === method.id" type="checkbox" checked class="checkbox" />
        </div>
      </div>

      <button @click="updatePaymentMethod" class="btn-primary" style="margin-top: 15px;">
        💾 Cập Nhật Phương Thức
      </button>
    </div>

    <!-- Navigation -->
    <div class="nav-links">
      <router-link to="/" class="link">← Trang Chủ</router-link>
      <router-link to="/payment" class="link">Thanh Toán →</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { usePosthog } from "../composables/useLeanbaseCompass";

const router = useRouter();
const { posthog } = usePosthog();

const billingInfo = ref({
  customer: "Nguyễn Văn A",
  email: "customer@example.com",
  phone: "0123 456 789",
  address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
});

const currentBill = ref({
  period: "Jan 2026",
  serviceBasic: 299000,
  addons: 99000,
  overage: 50000,
  subtotal: 448000,
  tax: 44800,
  total: 492800,
});

const invoiceHistory = ref([
  {
    id: "INV-2026-001",
    date: "2026-01-15",
    period: "Dec 2025",
    amount: 492800,
    status: "paid",
  },
  {
    id: "INV-2025-012",
    date: "2025-12-15",
    period: "Nov 2025",
    amount: 399000,
    status: "paid",
  },
  {
    id: "INV-2025-011",
    date: "2025-11-15",
    period: "Oct 2025",
    amount: 399000,
    status: "paid",
  },
  {
    id: "INV-2025-010",
    date: "2025-10-15",
    period: "Sep 2025",
    amount: 349000,
    status: "paid",
  },
  {
    id: "INV-2025-009",
    date: "2025-09-15",
    period: "Aug 2025",
    amount: 349000,
    status: "pending",
  },
]);

const paymentMethods = ref([
  {
    id: "card_1",
    icon: "💳",
    name: "Thẻ Tín Dụng",
    detail: "•••• •••• •••• 4242",
  },
  {
    id: "card_2",
    icon: "💳",
    name: "Thẻ Ghi Nợ",
    detail: "•••• •••• •••• 8888",
  },
  {
    id: "bank_1",
    icon: "🏦",
    name: "Chuyển Khoản Ngân Hàng",
    detail: "Vietcombank - 123 456 789",
  },
  {
    id: "wallet_1",
    icon: "👛",
    name: "Ví Điện Tử",
    detail: "Momo, ZaloPay",
  },
]);

const selectedPaymentMethod = ref("card_1");

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function getStatusLabel(status) {
  const labels = {
    paid: "✅ Đã Thanh Toán",
    pending: "⏳ Chờ Thanh Toán",
    overdue: "❌ Quá Hạn",
  };
  return labels[status] || status;
}

function editBillingInfo() {
  posthog.capture("qe_billing_edit_clicked", { from: "vue" });
  alert("Chỉnh sửa thông tin thanh toán");
}

function downloadInvoice(invoiceId = null) {
  const id = invoiceId || "current";
  posthog.capture("qe_invoice_download", { invoice_id: id, from: "vue" });
  alert(`Đang tải hóa đơn: ${id}`);
}

function viewInvoice(invoiceId) {
  posthog.capture("qe_invoice_view", { invoice_id: invoiceId, from: "vue" });
  alert(`Xem hóa đơn: ${invoiceId}`);
}

function payNow() {
  posthog.capture("qe_billing_pay_now", {
    amount: currentBill.value.total,
    from: "vue",
  });
  router.push("/payment");
}

function selectPaymentMethod(method) {
  selectedPaymentMethod.value = method.id;
}

function updatePaymentMethod() {
  posthog.capture("qe_payment_method_updated", {
    method: selectedPaymentMethod.value,
    from: "vue",
  });
  alert(`Cập nhật phương thức thanh toán: ${selectedPaymentMethod.value}`);
}
</script>

<style scoped>
.billing-container {
  max-width: 1200px;
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
  font-size: 1.3em;
  color: #333;
}

.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.info-card,
.bill-card {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.info-item {
  margin-bottom: 15px;
}

.info-item label {
  display: block;
  font-weight: 600;
  color: #666;
  margin-bottom: 5px;
  font-size: 0.9em;
}

.info-item p {
  margin: 0;
  color: #333;
  font-size: 1em;
}

.bill-date {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.bill-items {
  margin-bottom: 20px;
}

.bill-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  color: #555;
}

.bill-summary {
  background: #e8f5e9;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #333;
}

.summary-row.total {
  border-top: 2px solid #42b883;
  padding-top: 8px;
  margin-top: 8px;
  font-weight: 700;
  font-size: 1.1em;
  color: #42b883;
}

.bill-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.bill-actions button {
  flex: 1;
}

.btn-primary,
.btn-secondary,
.btn-edit {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  font-size: 0.95em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #42b883;
  color: white;
}

.btn-primary:hover {
  background: #359268;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-edit {
  width: 100%;
  background: #e8f5e9;
  color: #42b883;
  border: 1px solid #42b883;
}

.btn-edit:hover {
  background: #42b883;
  color: white;
}

.btn-link {
  background: none;
  border: none;
  color: #42b883;
  cursor: pointer;
  font-weight: 500;
  padding: 0 5px;
  text-decoration: underline;
}

.btn-link:hover {
  color: #359268;
}

.invoice-history {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.invoice-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.invoice-table thead {
  background: #f9f9f9;
}

.invoice-table th,
.invoice-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.invoice-table th {
  font-weight: 600;
  color: #333;
}

.status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: 500;
}

.status.paid {
  background: #d4edda;
  color: #155724;
}

.status.pending {
  background: #fff3cd;
  color: #856404;
}

.status.overdue {
  background: #f8d7da;
  color: #721c24;
}

.payment-methods {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.method-card {
  background: white;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s;
}

.method-card:hover {
  border-color: #42b883;
  box-shadow: 0 2px 8px rgba(66, 184, 131, 0.2);
}

.method-card.selected {
  border-color: #42b883;
  background: #e8f5e9;
}

.method-icon {
  font-size: 1.8em;
  flex-shrink: 0;
}

.method-info {
  flex: 1;
}

.method-name {
  margin: 0;
  font-weight: 600;
  color: #333;
}

.method-detail {
  margin: 3px 0 0;
  color: #999;
  font-size: 0.85em;
}

.checkbox {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  accent-color: #42b883;
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

  .methods-grid {
    grid-template-columns: 1fr;
  }

  .invoice-table {
    font-size: 0.85em;
  }

  .invoice-table th,
  .invoice-table td {
    padding: 8px;
  }

  .nav-links {
    flex-direction: column;
  }
}
</style>
