import {
  checkServiceability,
  getExpectedTAT,
  fetchWaybill,
  calculateShippingCost,
  createShipment,
  updateShipment,
  cancelShipment,
  trackShipment,
  generateShippingLabel,
  createPickupRequest,
  createWarehouse,
  updateWarehouse,
} from "../services/delhivery.service.js";

async function testAll() {
  try {
    console.log("\n==============================");
    console.log("1️⃣ CHECK SERVICEABILITY");
    console.log("==============================");
    const service = await checkServiceability("400701");
    console.log(service.data || service);

    console.log("\n==============================");
    console.log("2️⃣ EXPECTED TAT");
    console.log("==============================");
    const tat = await getExpectedTAT("400701", "400001");
    console.log(tat.data || tat);

    console.log("\n==============================");
    console.log("3️⃣ FETCH WAYBILL");
    console.log("==============================");
    const waybillRes = await fetchWaybill(1);
    const fallbackWB = waybillRes.data;
    console.log(fallbackWB);

    console.log("\n==============================");
    console.log("4️⃣ COST ESTIMATION");
    console.log("==============================");
    // const cost = await calculateShippingCost("400701", "400001", 1000);
    // console.log(cost.data || cost);

    /* ------------------------------------------
     * 5️⃣ CREATE WAREHOUSE (FIRST)
     * ----------------------------------------*/
    console.log("\n==============================");
    console.log("5️⃣ CREATE WAREHOUSE");
    console.log("==============================");
    // const warehouseRes = await createWarehouse({
    //   phone: "9999999999",
    //   city: "Mumbai",
    //   name: "TestWarehouseAuto",
    //   pin: "400001",
    //   address: "123 Warehouse Street",
    //   country: "India",
    //   email: "warehouse@example.com",
    //   registered_name: "Test Registered",
    //   return_address: "123 Return Street",
    //   return_pin: "400001",
    //   return_city: "Mumbai",
    //   return_state: "MH",
    //   return_country: "India",
    // });
    // console.log(warehouseRes.data || warehouseRes);

    /* ------------------------------------------
     * 6️⃣ UPDATE WAREHOUSE
     * ----------------------------------------*/
    console.log("\n==============================");
    console.log("6️⃣ UPDATE WAREHOUSE");
    console.log("==============================");
    // const updatedWarehouse = await updateWarehouse({
    //   name: "TestWarehouseAuto", // cannot change name
    //   city: "Mumbai",
    //   pin: "400002",
    //   address: "Updated Warehouse Address",
    //   phone: "8888888888",
    //   country: "India",
    //   email: "updated@example.com",
    //   registered_name: "Updated Registered",
    //   return_address: "New Return Address",
    //   return_pin: "400002",
    //   return_city: "Mumbai",
    //   return_state: "MH",
    //   return_country: "India",
    // });
    // console.log(updatedWarehouse.data || updatedWarehouse);

    /* ------------------------------------------
     * 7️⃣ CREATE SHIPMENT USING THE NEW WAREHOUSE
     * ----------------------------------------*/
    console.log("\n==============================");
    console.log("7️⃣ CREATE SHIPMENT (Using Warehouse)");
    console.log("==============================");

    const shipmentRes = await createShipment({
      name: "Test Customer",
      add: "123 Test Street",
      phone: "9090909090",
      pin: "400001",
      order: "ORDER123",
      payment_mode: "Prepaid",
      weight: 0.5,
      pickup_location: "TestWarehouseAuto", // ← use warehouse name here
    });
    console.log(shipmentRes);
    return;
    const finalWaybill = shipmentRes.packages?.[0]?.waybill || fallbackWB;

    /* ------------------------------------------
     * 8️⃣ UPDATE SHIPMENT
     * ----------------------------------------*/
    console.log("\n==============================");
    console.log("8️⃣ UPDATE SHIPMENT");
    console.log("==============================");
    const updateRes = await updateShipment({
      waybill: finalWaybill,
      phone: "8080808080",
    });
    console.log(updateRes.data || updateRes);

    /* ------------------------------------------
     * 9️⃣ TRACK SHIPMENT
     * ----------------------------------------*/
    console.log("\n==============================");
    console.log("9️⃣ TRACK SHIPMENT");
    console.log("==============================");
    const track = await trackShipment(finalWaybill);
    console.log(track.data || track);

    /* ------------------------------------------
     * 🔟 CANCEL SHIPMENT
     * ----------------------------------------*/
    console.log("\n==============================");
    console.log("🔟 CANCEL SHIPMENT");
    console.log("==============================");
    const cancelRes = await cancelShipment(finalWaybill);
    console.log(cancelRes.data || cancelRes);

    /* ------------------------------------------
     * 1️⃣1️⃣ LABEL GENERATION
     * ----------------------------------------*/
    console.log("\n==============================");
    console.log("1️⃣1️⃣ GENERATE LABEL");
    console.log("==============================");
    const label = await generateShippingLabel(finalWaybill);
    console.log(label.data || label);

    /* ------------------------------------------
     * 1️⃣2️⃣ PICKUP REQUEST
     * ----------------------------------------*/
    console.log("\n==============================");
    console.log("1️⃣2️⃣ CREATE PICKUP REQUEST");
    console.log("==============================");
    const pickup = await createPickupRequest({
      pickup_date: "2025-01-01",
      pickup_time: "12:00",
      pickup_location: "TestWarehouseAuto",
      expected_package_count: 1,
    });
    console.log(pickup.data || pickup);

    console.log("\n🎉 All tests completed successfully.");
  } catch (err) {
    console.error("\n❌ ERROR:", err.response?.data || err.message);
  }
}

testAll();
