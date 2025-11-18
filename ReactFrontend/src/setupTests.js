/* Global Jest setup for React Testing Library and MSW. */
import "@testing-library/jest-dom";
import "whatwg-fetch";
import { setupServer } from "msw/node";
import { handlers } from "./mocks/handlers";

// Initialize a shared MSW server instance for all tests
const server = setupServer(...handlers);

// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// Reset any request handlers that are declared as a part of our tests
// (i.e. for testing error states) so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

// Expose for tests that may want to register temporary handlers
// eslint-disable-next-line no-undef
global.__MSW_SERVER__ = server;
