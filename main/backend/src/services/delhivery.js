import axios from "axios";

const DELHIVERY_BASE_URL = "https://staging-express.delhivery.com";
const DELHIVERY_TRACK_URL = "https://track.delhivery.com";
const DELHIVERY_DEV_URL = "https://express-dev-test.delhivery.com";
const DELHIVERY_TOKEN = "YOUR_API_TOKEN"; // Replace with your token

const headers = {
  Authorization: `Token ${DELHIVERY_TOKEN}`,
  Accept: "application/json",
  "Content-Type": "application/json",
};

// 1️⃣ Check Serviceability
export async function checkServiceability(pincode) {
  return axios.get(`${DELHIVERY_BASE_URL}/c/api/pin-codes/json/`, {
    params: { filter_codes: pincode },
    headers,
  });
}

// 2️⃣ Get Expected TAT (delivery time)
export async function getExpectedTAT(
  originPin,
  destinationPin,
  expectedPickupDate
) {
  return axios.get(`${DELHIVERY_DEV_URL}/api/dc/expected_tat`, {
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

// 3️⃣ Fetch Waybill numbers
export async function fetchWaybill(count = 5) {
  return axios.get(`${DELHIVERY_BASE_URL}/waybill/api/bulk/json/`, {
    params: { token: DELHIVERY_TOKEN, count },
    headers,
  });
}

// 4️⃣ Create Shipment
export async function createShipment(payload) {
  const formattedData = `format=json&data=${JSON.stringify(payload)}`;
  return axios.post(
    `${DELHIVERY_BASE_URL}/api/cmu/create.json`,
    formattedData,
    { headers }
  );
}

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

// 7️⃣ Update E-waybill
export async function updateEwaybill(waybill, invoiceNo, ewaybillNo) {
  return axios.put(
    `${DELHIVERY_TRACK_URL}/api/rest/ewaybill/${waybill}/`,
    {
      data: [{ dcn: invoiceNo, ewbn: ewaybillNo }],
    },
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
