import React from 'react';
const ST = {
  safe:  {fg:'var(--nc-safe)',  bg:'var(--nc-safe-bg)',  dot:'var(--nc-safe-dot)',  label:'Safe'},
  verify:{fg:'var(--nc-verify)',bg:'var(--nc-verify-bg)',dot:'var(--nc-verify-dot)',label:'Verify'},
  alert: {fg:'var(--nc-high)',  bg:'var(--nc-high-bg)',  dot:'var(--nc-high-dot)', label:'High-alert'},
  info:  {fg:'var(--nc-info)',  bg:'var(--nc-info-bg)',  dot:'var(--nc-info-dot)', label:'Info'},
};
export function StatePill({ state='safe', children, size='md', style={}, ...rest }) {
  const s=ST[state]||ST.safe;
  const z={sm:{h:24,px:10,fs:'var(--text-2xs)',dot:7},md:{h:30,px:12,fs:'var(--text-sm)',dot:9},lg:{h:38,px:16,fs:'var(--text-base)',dot:11}}[size]||{h:30,px:12,fs:'var(--text-sm)',dot:9};
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:7,height:z.h,padding:`0 ${z.px}px`,
      background:s.bg,color:s.fg,borderRadius:'var(--radius-pill)',
      fontFamily:'var(--font-body)',fontWeight:700,fontSize:z.fs,lineHeight:1,whiteSpace:'nowrap',...style}} {...rest}>
      <span style={{width:z.dot,height:z.dot,borderRadius:'50%',background:s.dot,flex:'none'}}/>
      {children||s.label}
    </span>
  );
}
