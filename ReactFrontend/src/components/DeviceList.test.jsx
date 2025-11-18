import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { resetMocks } from "../mocks/handlers";

describe("Device list rendering", () => {
  beforeEach(() => {
    resetMocks();
  });

  test("renders initial list from GET /devices and shows rows", async () => {
    render(<App />);
    // Status may show Loading... initially, then empty or rows
    // Wait for at least one known device from seed
    const rowR1 = await screen.findByRole("row", { name: /r1/i });
    expect(rowR1).toBeInTheDocument();

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    // header row + 2 device rows
    expect(rows.length).toBeGreaterThanOrEqual(3);

    // Ensure key columns appear
    expect(screen.getByText("r1")).toBeInTheDocument();
    expect(screen.getByText("s1")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /ping/i }).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByRole("button", { name: /edit/i }).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByRole("button", { name: /delete/i }).length).toBeGreaterThanOrEqual(2);
  });

  test("ping button shows status message from GET /ping/:name", async () => {
    render(<App />);
    const pingButtons = await screen.findAllByRole("button", { name: /ping/i });
    await userEvent.click(pingButtons[0]);
    const statusRegion = screen.getByRole("status");
    // From MSW we return success with details icmp_ok
    expect(await screen.findByText(/Ping .*: OK \(icmp_ok\)/i)).toBeInTheDocument();
    expect(statusRegion).toBeInTheDocument();
  });
});
