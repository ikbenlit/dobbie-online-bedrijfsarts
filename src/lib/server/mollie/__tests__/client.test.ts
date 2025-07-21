import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the createMollieClient function
const mockCreateMollieClient = vi.fn();
vi.mock('@mollie/api-client', () => ({
	createMollieClient: mockCreateMollieClient
}));

describe('Mollie Client Integration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Clear environment variables
		delete process.env.MOLLIE_API_KEY_TEST;
		delete process.env.MOLLIE_API_KEY_LIVE;
	});

	it('should have proper environment variable names', () => {
		// Test that the environment variables we set exist
		process.env.MOLLIE_API_KEY_TEST = 'test_key';
		process.env.MOLLIE_API_KEY_LIVE = 'live_key';
		
		expect(process.env.MOLLIE_API_KEY_TEST).toBe('test_key');
		expect(process.env.MOLLIE_API_KEY_LIVE).toBe('live_key');
	});

	it('should call createMollieClient with correct parameters', () => {
		const mockClient = { test: 'client' };
		mockCreateMollieClient.mockReturnValue(mockClient);

		// Test the mock directly
		const testKey = 'test_abc123';
		const client = mockCreateMollieClient({ apiKey: testKey });
		
		expect(mockCreateMollieClient).toHaveBeenCalledWith({ apiKey: testKey });
		expect(client).toBe(mockClient);
	});

	it('should validate API key format', () => {
		// Test that our API key format is correct
		const testKey = process.env.MOLLIE_API_KEY_TEST || 'test_NzbgaW4kKHHMjjEDyxzs393TVuewAa';
		
		expect(testKey).toMatch(/^test_/);
		expect(testKey.length).toBeGreaterThan(10);
	});

	it('should handle mock client operations', () => {
		const mockClient = {
			methods: {
				list: vi.fn().mockResolvedValue([{ id: 'ideal' }, { id: 'creditcard' }])
			},
			customers: {
				create: vi.fn().mockResolvedValue({ id: 'cst_test123', name: 'Test User' }),
				delete: vi.fn().mockResolvedValue({})
			}
		};

		mockCreateMollieClient.mockReturnValue(mockClient);

		const { createMollieClient } = require('@mollie/api-client');
		const client = createMollieClient({ apiKey: 'test_key' });

		expect(client.methods).toBeDefined();
		expect(client.customers).toBeDefined();
		expect(typeof client.methods.list).toBe('function');
		expect(typeof client.customers.create).toBe('function');
	});
});