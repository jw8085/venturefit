import { useId } from 'react';
export interface Point {investment:number;saving:number}
export const compact=(amount:number)=> new Intl.NumberFormat('ko-KR',{maximumFractionDigits:1}).format(amount/10000);
export default function ComparisonChart({points,current,axis,xLabel,isExample}:{points:Point[];current:number;axis:"income"|"investment";xLabel:string;isExample:boolean}){
 const id=useId(); const maxX=Math.max(...points.map(p=>p.investment),1); const maxY=Math.max(...points.map(p=>p.saving),10000)*1.18;
 const x=(v:number)=>56+v/maxX*574, y=(v:number)=>224-v/maxY*178;
 const path=points.map((p,i)=>`${i?'L':'M'} ${x(p.investment)} ${y(p.saving)}`).join(' ');
 const selected=points.reduce((a,b)=>Math.abs(b.investment-current)<Math.abs(a.investment-current)?b:a);
 return <><svg viewBox="0 0 670 276" className="chart" role="img" aria-label={`${axis==="income"?"소득":"투자금"}별 ${isExample?"예시":"예상"} 절세액 그래프. 동일한 ${axis==="income"?"투자":"소득과 공제"} 조건을 사용합니다.`}>
 <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#15a394" stopOpacity=".2"/><stop offset="100%" stopColor="#15a394" stopOpacity="0"/></linearGradient></defs>
 {[0,.25,.5,.75,1].map(t=><g key={t}><line x1="56" x2="630" y1={y(t*maxY)} y2={y(t*maxY)} stroke="#e9efee" strokeDasharray={t?'4 5':'0'}/><text x="43" y={y(t*maxY)+4} textAnchor="end">{compact(t*maxY)}</text></g>)}
 <text x="56" y="20">절세액 (만원)</text><path d={`${path} L 630 224 L 56 224 Z`} fill={`url(#${id})`}/><path d={path} fill="none" stroke="#0c9788" strokeWidth="3" strokeLinejoin="round"/>
 {[0,.25,.5,.75,1].map(t=><text key={t} x={x(t*maxX)} y="248" textAnchor="middle">{compact(t*maxX)}</text>)}
 <line x1={x(selected.investment)} x2={x(selected.investment)} y1={y(selected.saving)} y2="224" stroke="#0c9788" strokeDasharray="4 5"/>
 <circle cx={x(selected.investment)} cy={y(selected.saving)} r="6" fill="#0c9788" stroke="white" strokeWidth="3"/>
 <text x="630" y="271" textAnchor="end">{xLabel} (만원)</text></svg>
 <details className="data-details"><summary>그래프 수치표 보기</summary><div className="table-wrap"><table><thead><tr><th>{xLabel}</th><th>{isExample?'예시':'예상'} 절세액</th></tr></thead><tbody>{points.filter((_,i)=>i%4===0).map(p=><tr key={p.investment}><td>{compact(p.investment)}만원</td><td>{compact(p.saving)}만원</td></tr>)}</tbody></table></div></details></>;
}
