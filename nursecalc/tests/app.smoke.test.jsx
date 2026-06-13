/**
 * Smoke tests: every screen mounts, takes input, and renders a result
 * through the shared shell (ResultCard + WorkedSolution + banners).
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import App from "../src/App.jsx";

afterEach(cleanup);

const type = (label, value) =>
  fireEvent.change(screen.getByLabelText(new RegExp(label, "i")), { target: { value } });

describe("App", () => {
  it("renders nav, defaults to IV Drip Rate, shows disclaimer", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /IV Drip Rate/i })).toBeTruthy();
    expect(screen.getByText(/Reference & learning tool/i)).toBeTruthy();
  });

  it("drip rate end-to-end: 1000 mL / 8 hr / 15 gtt = 31 gtt/min", () => {
    render(<App />);
    type("Total volume", "1000");
    type("Infusion time", "8");
    expect(screen.getByText("31 gtt/min")).toBeTruthy();
    expect(screen.getAllByText(/Worked Solution/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Dimensional Analysis/i)).toBeTruthy();
  });

  it("weight-based with lb conversion shows kg in solution", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Weight-Based Dose/i }));
    type("Ordered dose", "5");
    type("Patient weight", "154");
    fireEvent.click(screen.getByRole("button", { name: /^lb$/i }));
    expect(screen.getByText("350 mg")).toBeTruthy();
    expect(screen.getByText(/154 lb ÷ 2.2 = 70 kg/i)).toBeTruthy();
  });

  it("titration: dopamine preset fires high-alert banner and computes rate", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Titration/i }));
    expect(screen.getAllByText(/HIGH ALERT/i).length).toBeGreaterThan(0);
    type("Ordered dose", "5");
    type("Patient weight", "86");
    // dopamine 400/250 @ 5 mcg/kg/min, 86 kg → 16.1 mL/hr (reference example)
    expect(screen.getByText("16.1 mL/hr")).toBeTruthy();
    expect(screen.getByText(/Nursing Considerations — dopamine/i)).toBeTruthy();
  });

  it("titration reverse: rate → dose", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Titration/i }));
    fireEvent.click(screen.getByRole("button", { name: /mL\/hr → Dose/i }));
    type("Current pump rate", "16.1");
    type("Patient weight", "86");
    expect(screen.getAllByText(/(4\.99|5) mcg\/kg\/min/).length).toBeGreaterThan(0);
  });

  it("blocking validation suppresses the result", () => {
    render(<App />);
    type("Total volume", "1000");
    // time left empty → blocking error, no result card
    expect(screen.getByText(/Cannot calculate/i)).toBeTruthy();
    expect(screen.queryByText(/gtt\/min$/)).toBeNull();
  });

  it("zero time blocks with a clear error instead of failing silently", () => {
    render(<App />);
    type("Total volume", "1000");
    type("Infusion time", "0");
    expect(screen.getByText(/Infusion time must be greater than zero/i)).toBeTruthy();
    expect(screen.queryByText(/gtt\/min$/)).toBeNull();
  });

  it("BSA optional mg/m² dose renders inside the printable area", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /BSA/i }));
    type("Height", "165");
    type("Patient weight", "70");
    type("Ordered dose per m", "75");
    // BSA 1.79 m² × 75 mg/m² = 134.25 mg, shown via the shell's print slot
    expect(screen.getByText("134.25 mg")).toBeTruthy();
    expect(screen.getByText("134.25 mg").closest(".print-area")).toBeTruthy();
  });

  it("drug guide: searches and opens a drip card", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Drug Guide/i }));
    // both libraries listed initially
    expect(screen.getByText(/norepinephrine/i)).toBeTruthy();
    expect(screen.getByText(/salbutamol/i)).toBeTruthy();
    // search narrows
    fireEvent.change(screen.getByLabelText(/Search drugs/i), { target: { value: "heparin" } });
    expect(screen.queryByText(/norepinephrine/i)).toBeNull();
    // expanding shows banners + nursing card + concentrations
    fireEvent.click(screen.getByRole("button", { name: /^heparin/i }));
    expect(screen.getAllByText(/HIGH ALERT/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Nursing Considerations — heparin/i)).toBeTruthy();
    expect(screen.getByText(/Protamine sulfate/i)).toBeTruthy();
    expect(screen.getByText(/25,000 units \/ 250 mL/i)).toBeTruthy();
  });

  it("drug guide: ward medication card shows dose summary and antidote", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Drug Guide/i }));
    fireEvent.change(screen.getByLabelText(/Search drugs/i), { target: { value: "paracetamol" } });
    fireEvent.click(screen.getByRole("button", { name: /paracetamol/i }));
    expect(screen.getByText(/Typical adult dosing/i)).toBeTruthy();
    expect(screen.getByText(/N-acetylcysteine/i)).toBeTruthy();
    expect(screen.getByText(/Nursing Considerations — paracetamol/i)).toBeTruthy();
  });

  it("every remaining screen mounts without crashing", () => {
    render(<App />);
    for (const name of [
      /Oral \/ Tablet/i,
      /Liquid \/ Injectable/i,
      /IV Pump Rate/i,
      /Infusion Time/i,
      /Reconstitution/i,
      /Safe Dose Range/i,
      /BSA/i,
    ]) {
      fireEvent.click(screen.getByRole("button", { name }));
    }
    expect(screen.getByRole("heading", { name: /Body Surface Area/i })).toBeTruthy();
  });
});
