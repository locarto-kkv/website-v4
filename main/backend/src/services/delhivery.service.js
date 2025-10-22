import axios from "axios";
import { env } from "../lib/env.js";

const DELHIVERY_BASE_URL = "https://track.delhivery.com";
const DELHIVERY_TOKEN = env.DELHIVERY_API_KEY;

const headers = {
  Authorization: `Token ${DELHIVERY_TOKEN}`,
  "Content-Type": "application/json",
};

// console.log(headers);

// 1️⃣ Check Serviceability
export async function checkServiceability(pincode) {
  return axios.get(`${DELHIVERY_BASE_URL}/c/api/pin-codes/json/`, {
    params: { filter_codes: pincode },
    headers,
  });
}
// const { data } = await checkServiceability("400701");
// const { cod, pre_paid, cash, pickup, repl, sun_tat, is_oda } =
//   data.delivery_codes[0].postal_code;
// console.log(cod, pre_paid, cash, pickup, repl, sun_tat, is_oda);

// 2️⃣ Get Expected TAT (delivery time)
export async function getExpectedTAT(
  originPin,
  destinationPin,
  expectedPickupDate
) {
  return axios.get(`${DELHIVERY_BASE_URL}/api/dc/expected_tat`, {
    params: {
      origin_pin: originPin,
      destination_pin: destinationPin,
      mot: "S",
      pdt: "B2C",
      expected_pickup_date: expectedPickupDate,
    },
    headers,
  });
}

// const { data } = await getExpectedTAT("400701", "400001");
// console.log(data.data.tat, data.success);

// 3️⃣ Fetch Waybill numbers
export async function fetchWaybill(count = 5) {
  return axios.get(`${DELHIVERY_BASE_URL}/waybill/api/bulk/json/`, {
    params: { token: DELHIVERY_TOKEN, count },
    headers,
  });
}

// const response = await fetchWaybill(1);
// console.log(response.data);

// 9️⃣ Calculate Shipping Cost
export async function calculateShippingCost({
  originPin,
  destinationPin,
  weight,
  paymentType = "Pre-paid",
}) {
  return axios.get(`${DELHIVERY_BASE_URL}/api/kinko/v1/invoice/charges/.json`, {
    params: {
      md: "E",
      ss: "Delivered",
      d_pin: destinationPin,
      o_pin: originPin,
      cgm: weight,
      pt: paymentType,
    },
    headers,
  });
}

// const response = await calculateShippingCost("400701", "400001", "1000");
// console.log(response.data[0].total_amount);

// 4️⃣ Create Shipment
export async function createShipment(payload) {
  const formattedData = `format=json&data=${JSON.stringify(payload)}`;
  return axios.post(
    `${DELHIVERY_BASE_URL}/api/cmu/create.json`,
    formattedData,
    { headers }
  );
}

// const response = await createShipment({
//   name: consumer.name,
//   add: consumer.address,
//   phone: consumer.phone_no,
//   pin: consumer.pincode,
//   payment_mode: order.payment_mode,
//   order: order.id,
// });

// 5️⃣ Edit Shipment
export async function updateShipment(data) {
  return axios.post(`${DELHIVERY_BASE_URL}/api/p/edit`, data, { headers });
}

// 6️⃣ Cancel Shipment
export async function cancelShipment(waybill) {
  return axios.post(
    `${DELHIVERY_BASE_URL}/api/p/edit`,
    { waybill, cancellation: "true" },
    { headers }
  );
}

// 8️⃣ Track Shipment
export async function trackShipment(waybill) {
  return axios.get(`${DELHIVERY_BASE_URL}/api/v1/packages/json/`, {
    params: { waybill },
    headers,
  });
}

// 🔟 Generate Shipping Label
export async function generateShippingLabel(waybill, pdfSize = "4R") {
  return axios.get(`${DELHIVERY_BASE_URL}/api/p/packing_slip`, {
    params: { wbns: waybill, pdf: "true", pdf_size: pdfSize },
    headers,
  });
}

// 1️⃣1️⃣ Pickup Request
export async function createPickupRequest({
  pickup_date,
  pickup_time,
  pickup_location,
  expected_package_count = 1,
}) {
  return axios.post(
    `${DELHIVERY_BASE_URL}/fm/request/new/`,
    {
      pickup_date,
      pickup_time,
      pickup_location,
      expected_package_count,
    },
    { headers }
  );
}

// 1️⃣2️⃣ Create Warehouse
export async function createWarehouse(data) {
  return axios.put(
    `${DELHIVERY_BASE_URL}/api/backend/clientwarehouse/create/`,
    data,
    { headers }
  );
}

// 1️⃣3️⃣ Update Warehouse
export async function updateWarehouse(data) {
  return axios.post(
    `${DELHIVERY_BASE_URL}/api/backend/clientwarehouse/edit/`,
    data,
    { headers }
  );
}
