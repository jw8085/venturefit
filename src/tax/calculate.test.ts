import { describe, it, expect } from 'vitest';
import { calculate, progressiveTax, salaryIncome, deductionFor } from './calculate';
import { EXAMPLE_RULES } from './rules';
const base = { incomeType: 'salary' as const, mode: 'detailed' as const, income: 80000000, existingDeductions: 0, taxBase: 60000000, comprehensiveIncome: 80000000, investment: 30000000, method: 'direct' as const, investmentYear: 2026, claimYear: 2026, scenario: 'example' as const };
describe('explicit illustrative model', () => {
 it('refuses actual estimates with unverified law', () => expect(() => calculate({...base,investmentYear:2025,claimYear:2025, scenario:'actual'})).toThrow('공식'));
 it('calculates the independent 60m to 30m tax-base example', () => {
 const r=calculate(base); expect(r.beforeTax).toBe(8640000); expect(r.afterTax).toBe(3240000); expect(r.saving).toBe(5940000); expect(r.appliedDeduction).toBe(30000000);
 });
 it.each([[0,0],[30000000,30000000],[40000000,37000000],[50000000,44000000],[60000000,47000000]])('deduction segments %i', (v,expected) => expect(deductionFor(v,'direct',EXAMPLE_RULES)).toBe(expected));
 it('caps at comprehensive income rather than tax base', () => { const r=calculate({...base,taxBase:15000000,comprehensiveIncome:20000000}); expect(r.appliedDeduction).toBe(10000000); });
 it('caps deduction at remaining tax base', () => expect(calculate({...base,taxBase:1000000}).appliedDeduction).toBe(1000000));
 it('returns no savings for zero investment', () => expect(calculate({...base,investment:0}).saving).toBe(0));
 it('keeps a fund example separate', () => expect(calculate({...base,method:'fund'}).eligibleDeduction).toBe(3000000));
 it('converts salary to income before other deductions', () => { const r=calculate({...base,mode:'simple',existingDeductions:1500000}); expect(r.comprehensiveIncome).toBe(salaryIncome(80000000)); expect(r.taxBase).toBe(64750000); });
 it('uses net business income without a salary deduction', () => { const r=calculate({...base,incomeType:'business',mode:'simple',income:80000000,existingDeductions:5000000}); expect(r.taxBase).toBe(75000000); });
 it.each([-1,NaN,Infinity,1e13])('rejects invalid amounts %s', income => expect(()=>calculate({...base,income})).toThrow());
 it('rejects tax base above comprehensive income', () => expect(()=>calculate({...base,comprehensiveIncome:50000000})).toThrow());
 it.each([2025,2029])('rejects ineligible claim year %s', claimYear => expect(()=>calculate({...base,claimYear})).toThrow());
 it('accepts only one of the three eligible claim years', () => expect(calculate({...base,claimYear:2028}).claimYear).toBe(2028));
 it('does not present future law as verified', () => expect(calculate({...base,investmentYear:2028,claimYear:2028}).isExample).toBe(true));
 it.each([0,14000000,50000000,88000000,150000000,300000000,500000000,1000000000])('tax remains continuous at %i', v => { expect(progressiveTax(v+1,EXAMPLE_RULES)-progressiveTax(v,EXAMPLE_RULES)).toBeLessThanOrEqual(1); });
 it('keeps savings below pre-investment combined tax at high investment', () => { const r=calculate({...base,investment:1e9}); expect(r.saving).toBeLessThanOrEqual(r.beforeTax*1.1+1); });
});

describe('verified 2026 statutory scope',()=>{
 const actual={...base,scenario:'actual' as const,eligibilityConfirmed:true};
 it('opens verified 2026 direct investment',()=>{const r=calculate(actual);expect(r.isExample).toBe(false);expect(r.saving).toBe(5940000)});
 it('requires confirmation of qualifying investment',()=>expect(()=>calculate({...actual,eligibilityConfirmed:false})).toThrow('요건'));
 it('blocks future claim-year rules',()=>expect(()=>calculate({...actual,claimYear:2027})).toThrow('2026'));
 it('does not silently apply simplified fund rules',()=>expect(()=>calculate({...actual,method:'fund'})).toThrow('직접투자'));
});
describe('business minimum tax (single business income, no other tax benefits)',()=>{
 it('prevents confirmed actual business estimates dropping below the statutory minimum',()=>{
 const r=calculate({...base,scenario:'actual',eligibilityConfirmed:true,incomeType:'business',taxBase:8000000,comprehensiveIncome:16000000,investment:8000000});
 expect(r.beforeTax).toBe(480000);expect(r.afterTax).toBe(168000);expect(r.saving).toBe(343200);
 });
});
