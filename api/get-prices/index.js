const fetch = require('node-fetch');

module.exports = async function (context, req) {
    try {
        const response = await fetch(
            'https://prices.azure.com/api/retail/prices?api-version=2021-10-01-preview&currencyCode=USD&regionInfo=us-east'
        );
        
        const data = await response.json();
        
        context.res = {
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        };
    } catch (error) {
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: { error: error.message }
        };
    }
};