import React from 'react';
export function Segmented({ options=[], value, onChange, size='md', style={}, ...rest }) {
  const h = size==='sm'?34:42;
  return (
    <div role="tablist" style={{display:'inline-flex',padding:4,gap:4,
      background:'var(--nc-wash)',border:'1px solid var(--nc-border)',
      borderRadius:'var(--radius-pill)',...style}} {...rest}>
      {options.map(opt=>{
        const val=typeof opt==='string'?opt:opt.value;
        const lab=typeof opt==='string'?opt:opt.label;
        const active=val===value;
        return <button key={val} type="button" role="tab" aria-selected={active}
          onClick={()=>onChange&&onChange(val)}
          style={{height:h,padding:'0 18px',border:'none',cursor:'pointer',borderRadius:'var(--radius-pill)',
            background:active?'var(--nc-white)':'transparent',boxShadow:active?'var(--shadow-sm)':'none',
            color:active?'var(--nc-blue-deep)':'var(--nc-muted)',fontFamily:'var(--font-display)',
            fontWeight:700,fontSize:size==='sm'?'var(--text-sm)':'var(--text-base)',
            transition:'background var(--dur-base),color var(--dur-base)'}}>{lab}</button>;
      })}
    </div>
  );
}
