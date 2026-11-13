import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

describe("ICSE Compass foundation", () => {
  it("renders the public academic workspace overview", () => {
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: /find your direction/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /explore the materials library/i })).toBeTruthy();
  });

  it("clearly states the independent relationship with CISCE", () => {
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(screen.getByText(/not affiliated with CISCE/i)).toBeTruthy();
  });
});