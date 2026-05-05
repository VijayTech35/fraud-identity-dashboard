import { render, screen } from "@testing-library/react";
import VerificationPage from "./page";

test("renders verification history and profile", () => {
  render(<VerificationPage />);
  expect(screen.getByText("Verification History")).toBeInTheDocument();
  expect(screen.getByText("Extracted Profile")).toBeInTheDocument();
});
