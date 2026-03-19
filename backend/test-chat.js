const axios = require('axios');

async function testApi() {
    try {
        const res = await axios.post('http://localhost:8000/api/chat', {
            message: "is this working?"
        });
        console.log("Chat Response:", res.data);
    } catch (e) {
        console.error("Test failed", e.message);
    }
}

testApi();
