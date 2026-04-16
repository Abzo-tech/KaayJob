/**
 * Script de test des endpoints pour diagnostiquer les erreurs 500
 */

import { CategoryController } from './controllers/categoryController.js';
import { ProviderController } from './controllers/providerController.js';

// Mock Express request/response
const mockRequest = (query = {}, params = {}) => ({
  query,
  params,
});

const mockResponse = () => {
  const res = {};
  res.status = function(code) {
    console.log(`Status: ${code}`);
    return res;
  };
  res.json = function(data) {
    console.log('Response:', JSON.stringify(data, null, 2));
    return res;
  };
  return res;
};

// Test des catégories
console.log('🧪 Test de CategoryController.getAll...');
const req1 = mockRequest();
const res1 = mockResponse();
await CategoryController.getAll(req1 as any, res1 as any);

console.log('\n🧪 Test de ProviderController.getAll...');
const req2 = mockRequest({ limit: '5' });
const res2 = mockResponse();
await ProviderController.getAll(req2 as any, res2 as any);

console.log('\n🧪 Test de ProviderController.getProvidersForMap...');
const req3 = mockRequest();
const res3 = mockResponse();
await ProviderController.getProvidersForMap(req3 as any, res3 as any);