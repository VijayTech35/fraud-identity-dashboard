import { render, screen } from "@testing-library/react";
import { AppShell } from "./app-shell";

jest.mock("next/navigation", () => ({ usePathname: () => "/verification" }));
jest.mock("next-themes", () => ({ useTheme: () => ({ theme: "light", setTheme: jest.fn() }) }));

test("renders dashboard navigation", () => {
  render(
    <AppShell>
      <div>test</div>
    </AppShell>,
  );

  const verLinks = screen.getAllByText("Verification");
  expect(verLinks.length).toBeGreaterThanOrEqual(1);
  expect(screen.getByText("Dashboard")).toBeInTheDocument();
});
