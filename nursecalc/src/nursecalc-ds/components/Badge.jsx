import React from 'react';
export function Badge({ children, tone='neutral', style={}, ...rest }) {
  const tones={neutral:{bg:'var(--nc-blue-soft)',fg:'var(--nc-blue-deep)'},mint:{bg:'var(--nc-mint-soft)',fg:'var(--nc-safe)'},
    sun:{bg:'var(--nc-sun-soft)',fg:'var(--nc-verify)'},ink:{bg:'var(--nc-ink)',fg:'var(--nc-white)'},
    outline:{bg:'transparent',fg:'var(--nc-muted)',border:'1px solid var(--nc-border)'}};
  const t=tones[tone]||tones.neutral;
  return <span style={{display:'inline-flex',alignItems:'center',height:22,padding:'0 9px',
    background:t.bg,color:t.fg,border:t.border||'1px solid transparent',borderRadius:'var(--radius-pill)',
    fontFamily:'var(--font-body)',fontWeight:700,fontSize:'var(--text-2xs)',
    letterSpacing:'0.01em',lineHeight:1,whiteSpace:'nowrap',...style}} {...rest}>{children}</span>;
}
