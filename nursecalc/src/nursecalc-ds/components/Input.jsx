import React from 'react';
export function Input({ label, unit=null, hint=null, error=null, numeric=false, id, style={}, ...rest }) {
  const fid = id||(label?`nc-${String(label).toLowerCase().replace(/\s+/g,'-')}`:undefined);
  const [focused,setFocused] = React.useState(false);
  const bc = error?'var(--nc-high)':focused?'var(--nc-blue)':'var(--nc-border)';
  return (
    <div style={{display:'flex',flexDirection:'column',gap:6,...style}}>
      {label&&<label htmlFor={fid} style={{fontFamily:'var(--font-body)',fontWeight:700,fontSize:'var(--text-sm)',color:'var(--nc-ink)'}}>{label}</label>}
      <div style={{display:'flex',alignItems:'center',height:'var(--control-md)',background:'var(--nc-white)',
        border:`1.5px solid ${bc}`,borderRadius:'var(--radius-md)',
        boxShadow:focused?'var(--focus-shadow)':'none',overflow:'hidden',
        transition:'border-color var(--dur-base),box-shadow var(--dur-base)'}}>
        <input id={fid} inputMode={numeric?'decimal':undefined}
          onFocus={e=>{setFocused(true);rest.onFocus&&rest.onFocus(e);}}
          onBlur={e=>{setFocused(false);rest.onBlur&&rest.onBlur(e);}}
          {...rest}
          style={{flex:1,minWidth:0,height:'100%',border:'none',outline:'none',background:'transparent',
            padding:'0 14px',fontFamily:numeric?'var(--font-mono)':'var(--font-body)',
            fontWeight:numeric?600:500,fontSize:'var(--text-base)',color:'var(--nc-ink)'}}/>
        {unit&&<span style={{padding:'0 14px',height:'100%',display:'flex',alignItems:'center',
          background:'var(--nc-wash)',borderLeft:'1px solid var(--nc-border)',
          fontFamily:'var(--font-body)',fontWeight:700,fontSize:'var(--text-sm)',color:'var(--nc-muted)',whiteSpace:'nowrap'}}>{unit}</span>}
      </div>
      {(hint||error)&&<span style={{fontFamily:'var(--font-body)',fontWeight:600,fontSize:'var(--text-xs)',color:error?'var(--nc-high)':'var(--nc-muted)'}}>{error||hint}</span>}
    </div>
  );
}
