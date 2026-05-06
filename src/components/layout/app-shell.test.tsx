import { render, screen } from "@testing-library/react";
import { AppShell } from "./app-shell";

jest.mock("next/navigation", () => ({ usePathname: () => "/fraud" }));
jest.mock("next-themes", () => ({ useTheme: () => ({ theme: "light", setTheme: jest.fn() }) }));

test("renders dashboard navigation", () => {
  render(
    <AppShell>
      <div>test</div>
    </AppShell>,
  );

  const navLinks = screen.getAllByText("Ad Fraud Detection");
  expect(navLinks.length).toBeGreaterThanOrEqual(1);
  expect(screen.getByText("Identity Verification")).toBeInTheDocument();
});
