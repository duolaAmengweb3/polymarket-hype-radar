import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { mockMarkets, mockErrorResponse } from './mockData';

// Define request handlers
const handlers = [
  // Mock successful API response
  http.get('https://gamma-api.polymarket.com/markets', ({ request }) => {
    const url = new URL(request.url);
    const closed = url.searchParams.get('closed');
    
    if (closed === 'false') {
      return HttpResponse.json(mockMarkets);
    }
    
    return HttpResponse.json([]);
  }),

  // Mock API error
  http.get('https://gamma-api.polymarket.com/markets-error', () => {
    return HttpResponse.json(mockErrorResponse, { status: 500 });
  }),
];

// Create and export the server
export const server = setupServer(...handlers);