import { EXAMPLE_RULES, rulesByYear, type TaxRules } from './rules';
export type InvestmentMethod = 'direct' | 'fund';
export interface SimulationInput {
 incomeType: 'salary' | 'business'; mode: 'simple' | 'detailed'; income: number; existingDeductions: number;
 taxBase: number; comprehensiveIncome: number; investment: number; method: InvestmentMethod;
 investmentYear: number; claimYear: number; scenario: 'example' | 'actual'; eligibilityConfirmed?: boolean;
}
export interface SimulationResult {
 isExample: boolean; taxBase: number; comprehensiveIncome: number; eligibleDeduction: number; appliedDeduction: number;
 deductionLimit: number; unusedDeduction: number; afterTaxBase: number; beforeTax: number; afterTax: number;
 saving: number; minimumTax: number; localSaving: number; burden: number; claimYear: number;
}
export function salaryIncome(gross: number): number {
 let deduction: number;
 if(gross<=5000000) deduction=gross*.7;
 else if(gross<=15000000) deduction=3500000+(gross-5000000)*.4;
 else if(gross<=45000000) deduction=7500000+(gross-15000000)*.15;
 else if(gross<=100000000) deduction=12000000+(gross-45000000)*.05;
 else deduction=14750000+(gross-100000000)*.02;
 return Math.max(0,gross-Math.min(20000000,deduction));
}
export function progressiveTax(base: number,rules: TaxRules): number {
 let previous=0,total=0;
 for(const [limit,rate] of rules.brackets){ total+=Math.max(0,Math.min(base,limit)-previous)*rate; if(base<=limit) break; previous=limit; }
 return Math.floor(total);
}
export function deductionFor(investment: number,method: InvestmentMethod,_rules: TaxRules): number {
 if(method==='fund') return Math.floor(investment*.1);
 return Math.floor(Math.min(investment,30000000)+Math.min(Math.max(0,investment-30000000),20000000)*.7+Math.max(0,investment-50000000)*.3);
}
export function calculate(input: SimulationInput): SimulationResult {
 const rules=input.scenario==='example'?EXAMPLE_RULES:rulesByYear[input.investmentYear];
 if(!rules || (input.scenario==='actual'&&!rules.verified)) throw new Error('공식 세법 확인 전입니다. 실제 세금 계산은 제공하지 않습니다.');
 if(input.scenario==='actual'){
  if(input.claimYear!==2026) throw new Error('세법 기준 계산은 2026년 공제만 지원합니다. 미래 연도는 예시 모드로 비교해 주세요.');
  if(input.method!=='direct') throw new Error('세법 기준 계산은 공제 대상 직접투자만 지원합니다. 조합 출자·투자신탁은 별도 한도 확인이 필요합니다.');
  if(!input.eligibilityConfirmed) throw new Error('공제 대상 투자 요건과 금액을 확인한 뒤 체크해 주세요.');
 }
 for(const v of [input.income,input.existingDeductions,input.taxBase,input.comprehensiveIncome,input.investment]) if(!Number.isFinite(v)||v<0||v>1e12) throw new Error('금액은 0원 이상 1조원 이하로 입력해 주세요.');
 if(!Number.isInteger(input.investmentYear)||input.investmentYear<2024||input.investmentYear>2030) throw new Error('예시 투자 연도는 2024~2030년입니다.');
 if(!Number.isInteger(input.claimYear)||input.claimYear<input.investmentYear||input.claimYear>input.investmentYear+2) throw new Error('예시 공제 연도는 투자 연도부터 2년 후까지 선택해 주세요.');
 const comprehensiveIncome=input.mode==='detailed'?input.comprehensiveIncome:input.incomeType==='salary'?salaryIncome(input.income):input.income;
 const taxBase=input.mode==='detailed'?input.taxBase:Math.max(0,comprehensiveIncome-input.existingDeductions);
 if(taxBase>comprehensiveIncome) throw new Error('과세표준은 종합소득금액보다 클 수 없습니다.');
 const eligibleDeduction=deductionFor(input.investment,input.method,rules);
 const deductionLimit=Math.floor(comprehensiveIncome*rules.deductionCap);
 const appliedDeduction=Math.min(eligibleDeduction,deductionLimit,taxBase);
 const afterTaxBase=taxBase-appliedDeduction;
 const beforeTax=progressiveTax(taxBase,rules);
 const minimumTax=input.scenario==='actual'&&input.incomeType==='business'?Math.floor(Math.min(beforeTax,30000000)*.35+Math.max(0,beforeTax-30000000)*.45):0;
 const afterTax=Math.max(progressiveTax(afterTaxBase,rules),minimumTax);
 const localSaving=Math.floor((beforeTax-afterTax)*rules.localRate),saving=beforeTax-afterTax+localSaving;
 return {isExample:input.scenario==='example',taxBase,comprehensiveIncome,eligibleDeduction,appliedDeduction,deductionLimit,unusedDeduction:eligibleDeduction-appliedDeduction,afterTaxBase,beforeTax,afterTax,minimumTax,localSaving,saving,burden:input.investment-saving,claimYear:input.claimYear};
}
