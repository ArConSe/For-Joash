import React from 'react';
export function Card({ children, elevation='sm', padding='md', accent=false, style={}, ...rest }) {
  const pad    = {none:0,sm:16,md:20,lg:28}[padding]??20;
  const shadow = {flat:'none',sm:'var(--shadow-sm)',md:'var(--shadow-md)',lg:'var(--shadow-lg)'}[elevation]||'var(--shadow-sm)';
  return (
    <div style={{ background:'var(--surface-card)',border:'1px solid var(--nc-border)',
      borderRadius:'var(--radius-lg)',boxShadow:shadow,padding:pad,
      position:'relative',overflow:'hidden',...style }} {...rest}>
      {accent&&<div style={{position:'absolute',top:0,left:0,right:0,height:4,background:'var(--nc-grad-signature)'}}/>}
      {children}
    </div>
  );
}
