import { Button, Card, Input, Segmented, Switch, Badge, StatePill, ResultStat } from "../nursecalc-ds/components/index.js";
import { useState } from "react";
import Icon from "../components/Icon.jsx";
import logoMark from "../nursecalc-ds/assets/logo-mark.png";

/* Small labeled swatch tile. */
function Swatch({ name, value, fg = "#1f3d4d" }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div style={{ background: value, height: 56 }} />
      <div className="px-2 py-1.5" style={{ color: fg }}>
        <div className="text-xs font-bold">{name}</div>
        <div className="text-[11px] text-slate-500">{value}</div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="space-y-3">
      <h3 className="section-label">{title}</h3>
      {children}
    </section>
  );
}

const BRAND = [
  ["--nc-blue", "#76C3E1"],
  ["--nc-mint", "#5FD6C4"],
  ["--nc-sun", "#FFC861"],
  ["--nc-blue-deep", "#5FB4DD"],
  ["--nc-mint-deep", "#43CDB8"],
  ["--nc-ink", "#1F3D4D"],
  ["--nc-wash", "#EDF8FB"],
  ["--nc-blue-soft", "#E4F4FA"],
  ["--nc-mint-soft", "#E1F8F3"],
  ["--nc-sun-soft", "#FFF3DA"],
  ["--nc-border", "#D9EAF1"],
  ["--nc-muted", "#6A8A98"],
];

const STATES = [
  ["safe", "Safe", "#E2F7F1", "#1EA58C"],
  ["verify", "Verify", "#FFF3DA", "#D9941F"],
  ["alert", "Alert", "#FFEAEA", "#E85C5C"],
  ["info", "Info", "#EAF6FB", "#3691BD"],
];

/**
 * Living style guide: the entire NurseCalc design language on one page —
 * brand mark, palette, type, and every component in its states. Reached
 * via the "#design" URL hash so it never clutters the clinical app.
 */
export default function DesignShowcase({ onClose }) {
  const [seg, setSeg] = useState("mg");
  const [sw, setSw] = useState(true);

  return (
    <div className="space-y-8 pb-10">
      <header className="space-y-3">
        <button type="button" onClick={onClose} className="flex items-center gap-1 text-sm font-semibold text-teal-700">
          <Icon name="chevronLeft" size={18} /> Back to the app
        </button>
        <div className="flex items-center gap-3">
          <img src={logoMark} alt="" style={{ height: 48 }} />
          <div>
            <h2 className="text-2xl font-bold">NurseCalc Design System</h2>
            <p className="text-sm text-slate-500">Every color, font, and component in one place.</p>
          </div>
        </div>
      </header>

      <Section title="Brand palette">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {BRAND.map(([n, v]) => (
            <Swatch key={n} name={n.replace("--nc-", "")} value={v} />
          ))}
        </div>
      </Section>

      <Section title="Clinical states">
        <div className="flex flex-wrap gap-2">
          {STATES.map(([s, label]) => (
            <StatePill key={s} state={s}>
              {label}
            </StatePill>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {STATES.map(([s, label, bg, fg]) => (
            <Swatch key={s} name={label} value={bg} fg={fg} />
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <Card padding="md" elevation="sm" className="space-y-2">
          <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: 800 }}>
            Baloo 2 — display & headings
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)" }}>
            Nunito — body copy, labels, and buttons. Calm and highly legible at a glance.
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-lg)", color: "var(--nc-blue-deep)", fontWeight: 600 }}>
            JetBrains Mono — 16.1 mL/hr · 31 gtt/min
          </p>
        </Card>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
        <Button block iconLeft={<Icon name="droplet" size={18} />}>
          Full-width with icon
        </Button>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge tone="neutral">Neutral</Badge>
          <Badge tone="mint">Mint</Badge>
          <Badge tone="sun">Sun</Badge>
          <Badge tone="ink">Ink</Badge>
          <Badge tone="outline">Outline</Badge>
        </div>
      </Section>

      <Section title="Inputs">
        <Card accent padding="md" elevation="md" className="space-y-4">
          <Input label="Standard field" placeholder="Type here…" />
          <Input label="Numeric with unit" numeric unit="mL" placeholder="1000" defaultValue="1000" />
          <Input label="With a hint" hint="Helper text sits quietly below." placeholder="optional" />
          <Input label="Error state" error="This value is required." placeholder="missing" />
        </Card>
      </Section>

      <Section title="Segmented & Switch">
        <div className="flex flex-wrap items-center gap-4">
          <Segmented options={[{ value: "mg", label: "mg" }, { value: "mcg", label: "mcg" }]} value={seg} onChange={setSeg} />
          <Switch checked={sw} onChange={setSw} label="High-alert reminder" />
        </div>
      </Section>

      <Section title="Result readout">
        <ResultStat label="Pump rate" value="16.1" unit="mL/hr" state="verify" stateLabel="Double-check">
          High-alert drug — verify the rate against the order.
        </ResultStat>
      </Section>

      <p className="border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
        This page is for reference only. Tap “Back to the app” to return to the calculators.
      </p>
    </div>
  );
}
