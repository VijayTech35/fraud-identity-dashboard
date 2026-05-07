import { render, screen } from "@testing-library/react";
import VerificationPage from "./page";

test("renders verification profile info and success rate graph", () => {
  render(<VerificationPage />);
  expect(screen.getByText("User Profile Information")).toBeInTheDocument();
  expect(screen.getByText("Verification Success Rate")).toBeInTheDocument();
  expect(screen.getByText("Verification History")).toBeInTheDocument();
});
