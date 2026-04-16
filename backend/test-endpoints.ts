/**
 * Script de test des endpoints pour diagnostiquer les erreurs 500
 */

import { CategoryController } from './controllers/categoryController';
import { ProviderController } from './controllers/providerController';

// Mock Express request/response
const mockRequest = (query: any = {}, params: any = {}) => ({
  query,
  params,
});

const mockResponse = () => {
  const res: any = {};
  res.status = function(code: number) {
    console.log(`Status: ${code}`);
    return res;
  };
  res.json = function(data: any) {
    console.log('Response:', JSON.stringify(data, null, 2));
    return res;
  };
  return res;
};

// Test des catégories
console.log('🧪 Test de CategoryController.getAll...');
const req1 = mockRequest();
const res1 = mockResponse();
CategoryController.getAll(req1 as any, res1 as any).catch(console.error);

console.log('\n🧪 Test de ProviderController.getAll...');
const req2 = mockRequest({ limit: '5' });
const res2 = mockResponse();
ProviderController.getAll(req2 as any, res2 as any).catch(console.error);

console.log('\n🧪 Test de ProviderController.getProvidersForMap...');
const req3 = mockRequest();
const res3 = mockResponse();
ProviderController.getProvidersForMap(req3 as any, res3 as any).catch(console.error);