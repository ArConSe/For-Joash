import React from 'react';
import { StatePill } from './StatePill.jsx';
export function ResultStat({ value, unit='', label='Result', state=null, stateLabel=null, children=null, style={}, ...rest }) {
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10,padding:'24px 20px',
      background:'var(--nc-blue-soft)',border:'1px solid var(--nc-border)',
      borderRadius:'var(--radius-lg)',textAlign:'center',...style}} {...rest}>
      <span style={{fontFamily:'var(--font-body)',fontWeight:700,fontSize:'var(--text-xs)',
        letterSpacing:'var(--tracking-wide)',textTransform:'uppercase',color:'var(--nc-muted)'}}>{label}</span>
      <div style={{display:'flex',alignItems:'baseline',gap:8,flexWrap:'wrap',justifyContent:'center'}}>
        <span style={{fontFamily:'var(--font-mono)',fontWeight:700,fontSize:'var(--text-4xl)',
          lineHeight:1,color:'var(--nc-blue-deep)',fontVariantNumeric:'tabular-nums'}}>{value}</span>
        {unit&&<span style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:'var(--text-xl)',color:'var(--nc-ink)'}}>{unit}</span>}
      </div>
      {state&&<StatePill state={state}>{stateLabel}</StatePill>}
      {children&&<div style={{fontFamily:'var(--font-body)',fontSize:'var(--text-sm)',color:'var(--text-body)'}}>{children}</div>}
    </div>
  );
}
