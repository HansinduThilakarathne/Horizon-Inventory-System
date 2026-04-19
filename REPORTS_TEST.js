// Test script to verify Reports CSV generation
// Run this in browser console on Reports page

const testCSVGeneration = () => {
  const issuedItems = [
    {
      id: 'ISS001',
      itemCode: 'PEN-001',
      itemName: 'Ballpoint Pens',
      numberOfItems: 50,
      issueDepartment: 'Admin',
      receiverName: 'John Doe',
      receiverStudentStaffId: 'S12345',
      description: 'Pens for office use',
      createdAt: new Date().toISOString()
    }
  ];

  const returnedItems = [
    {
      id: 'RET001',
      itemCode: 'PEN-001',
      itemName: 'Ballpoint Pens',
      numberOfItems: 20,
      returnedBy: 'John Doe',
      returnedById: 'S12345',
      condition: 'Good',
      createdAt: new Date().toISOString()
    }
  ];

  const requests = [
    {
      id: 'REQ001',
      itemCode: 'NOTE-001',
      itemName: 'Notepads',
      quantity: 25,
      requestedBy: 'Jane Smith',
      requestedById: 'S12346',
      reason: 'Office supplies',
      createdAt: new Date().toISOString()
    }
  ];

  let csv = 'HORIZON CAMPUS - INVENTORY TRANSACTION REPORT\n';
  csv += `Generated: ${new Date().toLocaleString()}\n`;
  csv += 'Period: 1 Month\n\n';

  // Issued Items
  csv += 'ISSUED ITEMS\n';
  csv += 'Item Code,Item Name,Quantity,Issue Department,Receiver Name,Receiver ID,Description,Date\n';
  issuedItems.forEach(item => {
    csv += `"${item.itemCode}","${item.itemName}",${item.numberOfItems},"${item.issueDepartment}","${item.receiverName}","${item.receiverStudentStaffId}","${item.description}","${new Date(item.createdAt).toLocaleString()}"\n`;
  });

  csv += '\n\nRETURNED ITEMS\n';
  csv += 'Item Code,Item Name,Quantity,Returned By,Returned ID,Condition,Date\n';
  returnedItems.forEach(item => {
    csv += `"${item.itemCode}","${item.itemName}",${item.numberOfItems},"${item.returnedBy}","${item.returnedById}","${item.condition}","${new Date(item.createdAt).toLocaleString()}"\n`;
  });

  csv += '\n\nAPPROVED REQUESTS\n';
  csv += 'Item Code,Item Name,Quantity,Requested By,Requested ID,Reason,Date\n';
  requests.forEach(req => {
    csv += `"${req.itemCode}","${req.itemName}",${req.quantity},"${req.requestedBy}","${req.requestedById}","${req.reason}","${new Date(req.createdAt).toLocaleString()}"\n`;
  });

  csv += '\n\nSUMMARY\n';
  csv += `Total Items Issued,${issuedItems.reduce((sum, item) => sum + item.numberOfItems, 0)}\n`;
  csv += `Total Items Returned,${returnedItems.reduce((sum, item) => sum + item.numberOfItems, 0)}\n`;
  csv += `Total Approved Requests,${requests.length}\n`;
  csv += `Total Requested Quantity,${requests.reduce((sum, req) => sum + req.quantity, 0)}\n`;

  console.log('CSV Generated:');
  console.log(csv);
  
  return csv;
};

// Run the test
testCSVGeneration();
