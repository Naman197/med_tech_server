const retailOrderData = {
    medicineName: "Paracetamol 500mg",
    orderFormId: "ORDER789456",
    category: "Pain Reliever",
    batchNo: "BATCH001",
    expiryDate: new Date(2025, 11, 31), // December 31, 2025
    mrp: 50.00,
    buyingPrice: 35.00,
    orderStatus: "Delivered",
    distributor: "60d5f5f7b65f1e23a1b2c3d4", // Replace with actual ObjectId
    totalQuantity: 100,
    returnedItems: [
      {
        quantity: 10,
        returnReason: "Expired upon delivery",
        returnDate: new Date(2024, 7, 15) // August 15, 2024
      },
      {
        quantity: 5,
        returnReason: "Damaged packaging",
        returnDate: new Date(2024, 7, 20) // August 20, 2024
      }
    ],
    refundStatus: "Partial",
    feedback: "60d5f5f7b65f1e23a1b2c3d5", // Replace with actual ObjectId
    orderDate: new Date(2024, 7, 1), // August 1, 2024
    refundDate: new Date(2024, 7, 21), // August 21, 2024
    retailUser: "60d5f5f7b65f1e23a1b2c3d6", // Replace with actual ObjectId
    paymentStatus: "Completed" // Example payment status
  };
  