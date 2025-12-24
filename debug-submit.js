// using native fetch

async function debugSubmit() {
    const url = 'http://localhost:5000/api/applications';

    // payload simulating what we think is being sent
    const payload = {
        applicantName: 'Test User',
        contactEmail: 'test@example.com',
        contactPhone: '1234567890',
        propertyType: 'Residential',
        propertyAddress: '123 Test St',
        buildingArea: 1000,
        floorCount: 2,
        fireSafetyFeatures: [],
        additionalNotes: 'Test note',
        // userId: 1, // Simulate missing ID
    };

    try {
        console.log('Sending payload:', JSON.stringify(payload, null, 2));
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log('Status Code:', response.status);
        console.log('Response Body:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

debugSubmit();
