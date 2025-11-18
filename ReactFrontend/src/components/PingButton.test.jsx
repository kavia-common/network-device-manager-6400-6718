import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { resetMocks } from "../mocks/handlers";

describe("Ping flow", () => {
  beforeEach(() => {
    resetMocks();
  });

  test("clicking Ping shows success status from MSW", async () => {
    render(<App />);
    const pingButtons = await screen.findAllByRole("button", { name: /ping/i });
    await userEvent.click(pingButtons[0]);

    // Expect status message to include OK (uppercase) and details
    expect(await screen.findByText(/Ping .*: OK \(icmp_ok\)/i)).toBeInTheDocument();
  });
});
