import React from 'react';
export function Switch({ checked=false, onChange, disabled=false, label=null, style={}, ...rest }) {
  const toggle=()=>{if(!disabled&&onChange)onChange(!checked);};
  const track=<span role="switch" aria-checked={checked} tabIndex={disabled?-1:0}
    onClick={toggle} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}}}
    style={{position:'relative',width:48,height:28,flex:'none',borderRadius:'var(--radius-pill)',
      background:checked?'var(--nc-grad-button)':'var(--nc-border)',
      cursor:disabled?'not-allowed':'pointer',opacity:disabled?0.5:1,
      transition:'background var(--dur-base)',boxShadow:checked?'var(--shadow-blue)':'var(--shadow-inset)'}} {...rest}>
    <span style={{position:'absolute',top:3,left:checked?23:3,width:22,height:22,
      borderRadius:'50%',background:'var(--nc-white)',boxShadow:'var(--shadow-sm)',
      transition:'left var(--dur-base) var(--ease-spring)'}}/>
  </span>;
  if(!label)return track;
  return <label style={{display:'inline-flex',alignItems:'center',gap:12,cursor:disabled?'not-allowed':'pointer',...style}}>
    {track}<span style={{fontFamily:'var(--font-body)',fontWeight:600,fontSize:'var(--text-base)',color:'var(--nc-ink)'}}>{label}</span>
  </label>;
}
