import { fireEvent, render, screen } from "@testing-library/react";
import FraudPage from "./page";

test("filters incidents by campaign", () => {
  render(<FraudPage />);
  fireEvent.change(screen.getByLabelText("Campaign filter"), { target: { value: "Summer" } });
  expect(screen.getByText("INC-3021")).toBeInTheDocument();
});
