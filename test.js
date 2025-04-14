const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const crypto = require('crypto');

// OKX API Credentials
const OKX_API_KEY = '6f27386c-6b13-46a3-8176-a23f84fc4d03';
const OKX_SECRET_KEY = '0D8CCD068DC957C08BB86494864A72CB';
const OKX_PASSPHRASE = 'Sixp@666';

// Function to generate the OK-ACCESS-SIGN header
function generateSignature(timestamp, method, requestPath, body) {
    const prehash = timestamp + method + requestPath + (body ? JSON.stringify(body) : '');
    return crypto.createHmac('sha256', OKX_SECRET_KEY).update(prehash).digest('base64');
}

// Function to fetch token price from OKX API
async function fetchTokenPrice(chainIndex, tokenAddress) {
    const url = '/api/v5/wallet/token/real-time-price'; // OKX API Path
    const baseUrl = 'https://www.okx.com';

    const requestBody = [
        {
            chainIndex: chainIndex,
            tokenAddress: tokenAddress
        }
    ];

    const timestamp = new Date().toISOString();
    const signature = generateSignature(timestamp, 'POST', url, requestBody);

    const headers = {
        'Content-Type': 'application/json',
        'OK-ACCESS-KEY': OKX_API_KEY,
        'OK-ACCESS-SIGN': signature,
        'OK-ACCESS-TIMESTAMP': timestamp,
        'OK-ACCESS-PASSPHRASE': OKX_PASSPHRASE
    };

    try {
        const response = await axios.post(baseUrl + url, requestBody, { headers });
        console.log('response', response.data)   
        if (response.data.code === '0') {
            const priceData = response.data.data[0];
            return parseFloat(priceData.price);
        } else {
            console.error('Error:', response.data.msg);
            return null;
        }
    } catch (error) {
        console.error('Request Error:', error.response?.data || error.message);
        return null;
    }
}

// Function to start polling
function startPolling() {
    setInterval(async () => {
        // Fetch the token price from OKX
        const currentPrice = await fetchTokenPrice(56, '0xf117DFCB241c0003d5e2FC72F288755C17a46980'); 
        console.log('hsdasdsd' , currentPrice)
    }, 1100); // Poll every 1 second (adjust as needed)
}


startPolling()