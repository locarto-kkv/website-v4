import axios from "axios";
import { env } from "../lib/env.js";

const DELHIVERY_BASE_URL = "https://track.delhivery.com";
const DELHIVERY_TOKEN = env.DELHIVERY_API_KEY;

/**
 * Generic Delhivery Request Helper
 * - Automatically selects correct Content-Type (json | form)
 */
async function delhiveryRequest({
  url,
  method = "GET",
  params,
  data,
  contentType = "json",
}) {
  const headers =
    contentType === "form"
      ? {
          Authorization: `Token ${DELHIVERY_TOKEN}`,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        }
      : {
          Authorization: `Token ${DELHIVERY_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        };

  return axios({
    url: `${DELHIVERY_BASE_URL}${url}`,
    method,
    headers,
    params,
    data,
  });
}

/* --------------------------------------
 * 1️⃣ Check Serviceability
 * ------------------------------------*/
export async function checkServiceability(pincode) {
  return delhiveryRequest({
    url: "/c/api/pin-codes/json/",
    params: { filter_codes: pincode },
    contentType: "json",
  });
}

/* --------------------------------------
 * 2️⃣ Get Expected TAT
 * ------------------------------------*/
export async function getExpectedTAT(
  originPin,
  destinationPin,
  expectedPickupDate
) {
  return delhiveryRequest({
    url: "/api/dc/expected_tat",
    params: {
      origin_pin: originPin,
      destination_pin: destinationPin,
      mot: "S",
      pdt: "B2C",
      expected_pickup_date: expectedPickupDate,
    },
    contentType: "json",
  });
}

/* --------------------------------------
 * 3️⃣ Fetch Waybill Numbers
 * ------------------------------------*/
export async function fetchWaybill(count = 5) {
  return delhiveryRequest({
    url: "/waybill/api/bulk/json/",
    params: { token: DELHIVERY_TOKEN, count },
    contentType: "json",
  });
}

/* --------------------------------------
 * 4️⃣ Calculate Shipping Cost
 * ------------------------------------*/
export async function calculateShippingCost(
  originPin,
  destinationPin,
  weight,
  paymentType = "Pre-paid"
) {
  return delhiveryRequest({
    url: "/api/kinko/v1/invoice/charges/.json",
    params: {
      md: "E",
      ss: "Delivered",
      d_pin: destinationPin,
      o_pin: originPin,
      cgm: weight,
      pt: paymentType,
    },
    contentType: "json",
  });
}

/* --------------------------------------
 * 5️⃣ Create Warehouse
 * ------------------------------------*/
export async function createWarehouse(data) {
  return delhiveryRequest({
    url: "/api/backend/clientwarehouse/create/",
    method: "POST",
    data,
    contentType: "json",
  });
}

/* --------------------------------------
 * 6️⃣ Update Warehouse
 * ------------------------------------*/
export async function updateWarehouse(data) {
  return delhiveryRequest({
    url: "/api/backend/clientwarehouse/edit/",
    method: "POST",
    data,
    contentType: "json",
  });
}

/* --------------------------------------
 * 7️⃣ Create Shipment  (FORM REQUIRED)
 * ------------------------------------*/
export async function createShipment(payload) {
  const { pickup_location, ...shipment } = payload;

  const body = `format=json&data=${encodeURIComponent(
    JSON.stringify({
      shipments: [shipment],
      pickup_location: { name: pickup_location },
    })
  )}`;

  const res = await delhiveryRequest({
    url: "/api/cmu/create.json",
    method: "POST",
    data: body,
    contentType: "form",
  });

  return res.data;
}

/* --------------------------------------
 * 8️⃣ Track Shipment
 * ------------------------------------*/
export async function trackShipment(waybill) {
  return delhiveryRequest({
    url: "/api/v1/packages/json/",
    params: { waybill },
    contentType: "json",
  });
}
/* --------------------------------------
 * 9️⃣ Edit Shipment
 * ------------------------------------*/
export async function updateShipment(data) {
  return delhiveryRequest({
    url: "/api/p/edit",
    method: "POST",
    data,
    contentType: "json",
  });
}

/* --------------------------------------
 * 🔟 Cancel Shipment
 * ------------------------------------*/
export async function cancelShipment(waybill) {
  return delhiveryRequest({
    url: "/api/p/edit",
    method: "POST",
    data: { waybill, cancellation: "true" },
    contentType: "json",
  });
}

/* --------------------------------------
 * 1️⃣1️⃣ Generate Shipping Label (PDF)
 * ------------------------------------*/
export async function generateShippingLabel(waybill, pdfSize = "4R") {
  return delhiveryRequest({
    url: "/api/p/packing_slip",
    params: { wbns: waybill, pdf: "true", pdf_size: pdfSize },
    contentType: "json",
  });
}

/* --------------------------------------
 * 1️⃣2️⃣ Create Pickup Request
 * ------------------------------------*/
export async function createPickupRequest({
  pickup_date,
  pickup_time,
  pickup_location,
  expected_package_count = 1,
}) {
  return delhiveryRequest({
    url: "/fm/request/new/",
    method: "POST",
    data: {
      pickup_date,
      pickup_time,
      pickup_location,
      expected_package_count,
    },
    contentType: "json",
  });
}
