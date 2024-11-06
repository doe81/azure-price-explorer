const fetch = require('node-fetch');

module.exports = async function (context, req) {
    try {
        // Get query parameters from the request
        const { currency = 'SEK', region = 'swedencentral', skip = '0', top = '100' } = req.query;

        // Build the Azure Pricing API URL
        const baseUrl = 'https://prices.azure.com/api/retail/prices';
        const params = new URLSearchParams({
            'currencyCode': currency,
            '$top': top,
            '$skip': skip
        });

        // Add region filter if provided
        if (region) {
            params.append('$filter', `armRegionName eq '${region}'`);
        }

        const apiUrl = `${baseUrl}?${params.toString()}`;

        // Make the request to Azure Pricing API
        const response = await fetch(apiUrl);
        const data = await response.json();

        context.res = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: data
        };
    } catch (error) {
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: { error: error.message }
        };
    }
};