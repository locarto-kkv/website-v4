const orderData = { amount, currency: "INR", receipt: "receipt#1", notes: {} };

// Send orderData to backend to create-order, and get response:order back

// Open Razorpay Checkout
const options = {
  key: "rzp_test_Y2wy8t1wD1AFaA", // Replace with your Razorpay key_id
  amount: order.amount,
  currency: order.currency,
  name: "Your Company Name",
  description: "Test Transaction",
  order_id: order.id, // This is the order_id created in the backend
  callback_url: "http://localhost:3000/payment-success", // Your success URL
  prefill: {
    name: "Your Name",
    email: "your.email@example.com",
    contact: "9999999999",
  },
  theme: {
    color: "#F37254",
  },
  handler: function (response) {
    fetch("/verify-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          window.location.href = "/payment-success";
        } else {
          alert("Payment verification failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error verifying payment");
      });
  },
};

const rzp = new Razorpay(options);
rzp.open();
