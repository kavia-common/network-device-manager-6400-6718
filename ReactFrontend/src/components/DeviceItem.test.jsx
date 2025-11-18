import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { resetMocks } from "../mocks/handlers";

describe("Edit and Delete flows", () => {
  beforeEach(() => {
    resetMocks();
  });

  test("edit flow updates device via PUT and shows updated values", async () => {
    render(<App />);
    // Wait for initial devices
    await screen.findByText("r1");

    // Click Edit for r1
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    await userEvent.click(editButtons[0]);

    // Form should be in editing mode; name input disabled; update fields and Save Changes
    const ipInput = screen.getByLabelText(/device ip/i);
    const typeSelect = screen.getByLabelText(/device type/i);
    const locationInput = screen.getByLabelText(/device location/i);
    const saveBtn = screen.getByRole("button", { name: /save changes/i });

    // Clear and type new values
    await userEvent.clear(ipInput);
    await userEvent.type(ipInput, "10.0.0.100");
    await userEvent.selectOptions(typeSelect, "Server");
    await userEvent.clear(locationInput);
    await userEvent.type(locationInput, "colo");

    await userEvent.click(saveBtn);

    // Assert status and updated row content
    expect(await screen.findByText(/device updated\./i)).toBeInTheDocument();
    expect(await screen.findByText("10.0.0.100")).toBeInTheDocument();
    expect(screen.getByText("colo")).toBeInTheDocument();
    // Badge for type exists (text Server)
    expect(screen.getAllByText("Server").length).toBeGreaterThanOrEqual(1);
  });

  test("delete flow removes item after confirmation", async () => {
    render(<App />);

    await screen.findByText("s1");

    // Stub window.confirm to auto-accept
    const originalConfirm = window.confirm;
    window.confirm = () => true;

    try {
      const delButtons = screen.getAllByRole("button", { name: /delete/i });
      // Assume second button corresponds to s1 given initial order
      await userEvent.click(delButtons[1]);

      expect(await screen.findByText(/device deleted\./i)).toBeInTheDocument();
      // s1 should be removed
      expect(screen.queryByText("s1")).not.toBeInTheDocument();
    } finally {
      window.confirm = originalConfirm;
    }
  });
});
