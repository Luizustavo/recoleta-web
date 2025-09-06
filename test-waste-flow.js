// Test script to verify the waste form data flow
const testData = {
  wasteType: "ELECTRONICS",
  weight: 5.5,
  quantity: 2,
  unit: "KG",
  condition: "USED",
  hasPackaging: true,
  discardDate: "2024-12-18T10:30:00.000Z",
  additionalDescription: "Old laptop and monitor",
  street: "Rua das Flores",
  number: "123",
  complement: "Apt 45",
  neighborhood: "Centro",
  city: "São Paulo",
  state: "SP",
  zipCode: "01234-567",
  reference: "Próximo ao mercado",
  main: true
};

async function testWasteAPI() {
  try {
    console.log('🧪 Testing waste API endpoint...');
    console.log('📤 Sending data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/waste', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'recoleta_access_token=your_token_here' // You'll need to replace this
      },
      body: JSON.stringify(testData)
    });

    const result = await response.text();
    console.log('📥 Response status:', response.status);
    console.log('📥 Response:', result);

  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

// Only run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testWasteAPI();
}
