import React from 'react';
export function Button({ children, variant='primary', size='md', block=false,
  disabled=false, iconLeft=null, iconRight=null, style={}, ...rest }) {
  const sizes = {
    sm:{height:36,padding:'0 16px',fontSize:'var(--text-sm)',radius:'var(--radius-sm)',gap:6},
    md:{height:48,padding:'0 22px',fontSize:'var(--text-base)',radius:'var(--radius-md)',gap:8},
    lg:{height:56,padding:'0 28px',fontSize:'var(--text-md)',radius:'var(--radius-lg)',gap:10},
  };
  const s = sizes[size]||sizes.md;
  const base = { display:'inline-flex',alignItems:'center',justifyContent:'center',
    gap:s.gap, height:s.height, padding:s.padding, width:block?'100%':'auto',
    fontFamily:'var(--font-display)',fontWeight:700,fontSize:s.fontSize,lineHeight:1,
    borderRadius:s.radius,border:'1px solid transparent',
    cursor:disabled?'not-allowed':'pointer',opacity:disabled?0.5:1,
    transition:'transform var(--dur-fast) var(--ease-out)',whiteSpace:'nowrap',userSelect:'none' };
  const variants = {
    primary:  {background:'var(--nc-grad-button)',color:'var(--nc-white)',boxShadow:'var(--shadow-blue)'},
    secondary:{background:'var(--nc-blue-soft)',color:'var(--nc-blue-deep)',border:'1px solid var(--nc-border)'},
    ghost:    {background:'transparent',color:'var(--nc-ink)'},
    danger:   {background:'var(--nc-high-bg)',color:'var(--nc-high)',border:'1px solid #F6CDCD'},
  };
  return (
    <button type="button" disabled={disabled}
      style={{...base,...(variants[variant]||variants.primary),...style}}
      onMouseDown={e=>{if(!disabled)e.currentTarget.style.transform='scale(0.97)'}}
      onMouseUp={e=>{e.currentTarget.style.transform='scale(1)'}}
      onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)'}}
      {...rest}>
      {iconLeft}{children}{iconRight}
    </button>
  );
}
