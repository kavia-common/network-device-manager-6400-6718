import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("App theme toggle", () => {
  test("toggles theme and updates aria label", () => {
    render(<App />);
    const btn = screen.getByRole("button", { name: /switch to dark mode/i });
    expect(btn).toBeInTheDocument();

    // initial theme light on document
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    // click to dark
    fireEvent.click(btn);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    // aria label should now say switch to light mode
    const btn2 = screen.getByRole("button", { name: /switch to light mode/i });
    expect(btn2).toBeInTheDocument();
  });
});
