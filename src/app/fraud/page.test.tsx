import { render, screen } from "@testing-library/react";
import FraudPage from "./page";

test("renders fraud metrics and incident table", () => {
  render(<FraudPage />);
  expect(screen.getAllByText("Fraud Rate")).toHaveLength(2);
  expect(screen.getByText("Recent Fraud Incidents")).toBeInTheDocument();
});
