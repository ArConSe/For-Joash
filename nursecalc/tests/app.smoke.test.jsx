/**
 * Smoke tests: navigation (search-first home + bottom tabs) plus every
 * screen taking input and rendering a result through the shared shell
 * (ResultCard + WorkedSolution + banners).
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import App from "../src/App.jsx";

afterEach(cleanup);

const type = (label, value) =>
  fireEvent.change(screen.getByLabelText(new RegExp(label, "i")), { target: { value } });

// Navigation helpers for the home-grid + bottom-tab model.
const goCalculators = () =>
  fireEvent.click(screen.getByRole("button", { name: /^Calculators$/i }));
const openDrugGuide = () =>
  fireEvent.click(screen.getByRole("button", { name: /^Drug Guide$/i }));
const openTool = (re) => {
  goCalculators();
  fireEvent.click(screen.getByRole("button", { name: re }));
};

describe("App", () => {
  it("defaults to a search-first home grid and shows the disclaimer", () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/Search calculators/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /IV Drip Rate/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Titration/i })).toBeTruthy();
    expect(screen.getByText(/Reference & learning tool/i)).toBeTruthy();
  });

  it("home search filters calculators and deep-links a drug into the guide", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Search calculators and drugs/i), {
      target: { value: "dopamine" },
    });
    // dopamine is a Titration keyword → calculator surfaces; drug surfaces too
    expect(screen.getByRole("button", { name: /Titration/i })).toBeTruthy();
    const drugResult = screen.getByRole("button", { name: /dopamine.*inotrope/i });
    fireEvent.click(drugResult);
    // lands in the Drug Guide with the card open
    expect(screen.getByText(/Nursing Considerations — dopamine/i)).toBeTruthy();
  });

  it("tapping the Drug Guide tab resets a deep-linked card back to the full list", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Search calculators and drugs/i), {
      target: { value: "dopamine" },
    });
    fireEvent.click(screen.getByRole("button", { name: /dopamine.*inotrope/i }));
    expect(screen.getByText(/Nursing Considerations — dopamine/i)).toBeTruthy();
    // bottom Drug Guide tab clears the focus → full alphabetical list, card closed
    openDrugGuide();
    expect(screen.queryByText(/Nursing Considerations — dopamine/i)).toBeNull();
    expect(screen.getByText(/norepinephrine/i)).toBeTruthy();
  });

  it("opens a tool then backs out to the grid", () => {
    render(<App />);
    openTool(/IV Drip Rate/i);
    expect(screen.getByRole("heading", { name: /IV Drip Rate/i })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /^Back$/i }));
    expect(screen.getByPlaceholderText(/Search calculators/i)).toBeTruthy();
  });

  it("drip rate end-to-end: 1000 mL / 8 hr / 15 gtt = 31 gtt/min", () => {
    render(<App />);
    openTool(/IV Drip Rate/i);
    type("Total volume", "1000");
    type("Infusion time", "8");
    expect(screen.getByText("31 gtt/min")).toBeTruthy();
    expect(screen.getAllByText(/Worked Solution/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Dimensional Analysis/i)).toBeTruthy();
  });

  it("weight-based with lb conversion shows kg in solution", () => {
    render(<App />);
    openTool(/Weight-Based/i);
    type("Ordered dose", "5");
    type("Patient weight", "154");
    fireEvent.click(screen.getByRole("button", { name: /^lb$/i }));
    expect(screen.getByText("350 mg")).toBeTruthy();
    expect(screen.getByText(/154 lb ÷ 2.2 = 70 kg/i)).toBeTruthy();
  });

  it("titration: dopamine preset fires high-alert banner and computes rate", () => {
    render(<App />);
    openTool(/Titration/i);
    expect(screen.getAllByText(/HIGH ALERT/i).length).toBeGreaterThan(0);
    type("Ordered dose", "5");
    type("Patient weight", "86");
    expect(screen.getByText("16.1 mL/hr")).toBeTruthy();
    expect(screen.getByText(/Nursing Considerations — dopamine/i)).toBeTruthy();
  });

  it("titration reverse: rate → dose", () => {
    render(<App />);
    openTool(/Titration/i);
    fireEvent.click(screen.getByRole("button", { name: /mL\/hr → Dose/i }));
    type("Current pump rate", "16.1");
    type("Patient weight", "86");
    expect(screen.getAllByText(/(4\.99|5) mcg\/kg\/min/).length).toBeGreaterThan(0);
  });

  it("blocking validation suppresses the result", () => {
    render(<App />);
    openTool(/IV Drip Rate/i);
    type("Total volume", "1000");
    expect(screen.getByText(/Cannot calculate/i)).toBeTruthy();
    expect(screen.queryByText(/gtt\/min$/)).toBeNull();
  });

  it("zero time blocks with a clear error instead of failing silently", () => {
    render(<App />);
    openTool(/IV Drip Rate/i);
    type("Total volume", "1000");
    type("Infusion time", "0");
    expect(screen.getByText(/Infusion time must be greater than zero/i)).toBeTruthy();
    expect(screen.queryByText(/gtt\/min$/)).toBeNull();
  });

  it("BSA optional mg/m² dose renders inside the printable area", () => {
    render(<App />);
    openTool(/Body Surface Area/i);
    type("Height", "165");
    type("Patient weight", "70");
    type("Ordered dose per m", "75");
    expect(screen.getByText("134.25 mg")).toBeTruthy();
    expect(screen.getByText("134.25 mg").closest(".print-area")).toBeTruthy();
  });

  it("drug guide: searches and opens a drip card", () => {
    render(<App />);
    openDrugGuide();
    expect(screen.getByText(/norepinephrine/i)).toBeTruthy();
    expect(screen.getByText(/salbutamol/i)).toBeTruthy();
    fireEvent.change(screen.getByLabelText(/Search drugs/i), { target: { value: "heparin" } });
    expect(screen.queryByText(/norepinephrine/i)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /^heparin/i }));
    expect(screen.getAllByText(/HIGH ALERT/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Nursing Considerations — heparin/i)).toBeTruthy();
    expect(screen.getByText(/Protamine sulfate/i)).toBeTruthy();
    expect(screen.getByText(/25,000 units \/ 250 mL/i)).toBeTruthy();
  });

  it("drug guide: ward medication card shows dose summary and antidote", () => {
    render(<App />);
    openDrugGuide();
    fireEvent.change(screen.getByLabelText(/Search drugs/i), { target: { value: "paracetamol" } });
    fireEvent.click(screen.getByRole("button", { name: /paracetamol/i }));
    expect(screen.getByText(/Typical adult dosing/i)).toBeTruthy();
    expect(screen.getByText(/N-acetylcysteine/i)).toBeTruthy();
    expect(screen.getByText(/Nursing Considerations — paracetamol/i)).toBeTruthy();
  });

  it("every remaining calculator mounts without crashing", () => {
    render(<App />);
    const tools = [
      [/Oral \/ Tablet/i, /Oral \/ Tablet Dose/i],
      [/Liquid \/ Injectable/i, /Liquid \/ Injectable Dose/i],
      [/IV Pump Rate/i, /IV Pump Rate/i],
      [/Infusion Time/i, /Infusion Time/i],
      [/Reconstitution/i, /Reconstitution/i],
      [/Safe Dose Range/i, /Safe Dose Range/i],
    ];
    for (const [card, heading] of tools) {
      openTool(card);
      expect(screen.getByRole("heading", { name: heading })).toBeTruthy();
    }
  });
});
