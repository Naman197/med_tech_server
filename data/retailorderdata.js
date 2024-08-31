const retailOrderData = [
    {
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
        retailUser: "66d230fb9dee0454e21b26d7", // Replace with actual ObjectId
        paymentStatus: "Completed" // Example payment status
    },
    {
        medicineName: "Ibuprofen 200mg",
        orderFormId: "ORDER789457",
        category: "Anti-inflammatory",
        batchNo: "BATCH002",
        expiryDate: new Date(2026, 5, 30), // June 30, 2026
        mrp: 30.00,
        buyingPrice: 20.00,
        orderStatus: "Processing",
        distributor: "60d5f5f7b65f1e23a1b2c3d4", // Same distributor for consistency
        totalQuantity: 200,
        returnedItems: [],
        refundStatus: "None",
        feedback: "60d5f5f7b65f1e23a1b2c3d7", // Replace with actual ObjectId
        orderDate: new Date(2024, 7, 10), // August 10, 2024
        refundDate: null, // No refund for this order
        retailUser: "60d5f5f7b65f1e23a1b2c3d8", // Different retail user
        paymentStatus: "Pending" // Example payment status
    },
    {
        medicineName: "Amoxicillin 500mg",
        orderFormId: "ORDER789458",
        category: "Antibiotic",
        batchNo: "BATCH003",
        expiryDate: new Date(2025, 3, 31), // March 31, 2025
        mrp: 70.00,
        buyingPrice: 55.00,
        orderStatus: "Shipped",
        distributor: "60d5f5f7b65f1e23a1b2c3d4", // Same distributor
        totalQuantity: 150,
        returnedItems: [
            {
                quantity: 20,
                returnReason: "Incorrect batch",
                returnDate: new Date(2024, 8, 1) // September 1, 2024
            }
        ],
        refundStatus: "Full",
        feedback: "60d5f5f7b65f1e23a1b2c3d9", // Replace with actual ObjectId
        orderDate: new Date(2024, 7, 15), // August 15, 2024
        refundDate: new Date(2024, 8, 5), // September 5, 2024
        retailUser: "66d321798f95d3f489db56e0", // Another different retail user
        paymentStatus: "Completed" // Example payment status
    }
];

module.exports = retailOrderData;
