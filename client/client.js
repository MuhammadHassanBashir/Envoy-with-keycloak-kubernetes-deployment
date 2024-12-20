const axios = require('axios');
const oauth = require('axios-oauth-client');
const tokenProvider = require('axios-token-interceptor');
require('dotenv').config(); // Ensure environment variables are loaded

// Keycloak token endpoint URL
const KEYCLOAK_TOKEN_URL = `http://34.135.41.24:${process.env.KEYCLOAK_PUBLISHED_PORT}/realms/Envoy-Keycloak-POC/protocol/openid-connect/token`;

// OAuth Client Credentials Grant Flow
const getClientCredentials = oauth.client(axios.create(), {
    url: KEYCLOAK_TOKEN_URL,
    grant_type: 'client_credentials',
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
});

// Axios client to call the Envoy-protected endpoint
const client = axios.create();

// Use the OAuth token interceptor
client.interceptors.request.use(
    tokenProvider({
        getToken: getClientCredentials,
        headerFormatter: (token) => `Bearer ${token.access_token}`, // Explicitly format token header
    })
);

// Call the protected server endpoint
client.get(`http://34.58.150.119:${process.env.ENVOY_PUBLISHED_PORT}/`)
    .then((response) => {
        console.log('Response:', response.data);
    })
    .catch((error) => {
        console.error('Error:', error.response ? error.response.data : error.message);
    });