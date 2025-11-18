import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { resetMocks } from "../mocks/handlers";

describe("Device form create flow", () => {
  beforeEach(() => {
    resetMocks();
  });

  test("validates required fields and creates device via POST, then refreshes list", async () => {
    render(<App />);

    // Initially two rows exist (r1, s1)
    await screen.findByText("r1");

    const nameInput = screen.getByLabelText(/device name/i);
    const ipInput = screen.getByLabelText(/device ip/i);
    const typeSelect = screen.getByLabelText(/device type/i);
    const locationInput = screen.getByLabelText(/device location/i);
    const submit = screen.getByRole("button", { name: /add device/i });

    // Try invalid submit (empty)
    await userEvent.click(submit);
    expect(await screen.findByText(/all fields are required/i)).toBeInTheDocument();

    await userEvent.type(nameInput, "n1");
    await userEvent.type(ipInput, "192.168.5.5");
    await userEvent.selectOptions(typeSelect, "Server");
    await userEvent.type(locationInput, "rack-9");

    await userEvent.click(submit);

    // Success message then table includes new device
    expect(await screen.findByText(/device created\./i)).toBeInTheDocument();
    expect(await screen.findByText("n1")).toBeInTheDocument();
    expect(screen.getByText("192.168.5.5")).toBeInTheDocument();
    expect(screen.getByText("rack-9")).toBeInTheDocument();
  });
});
