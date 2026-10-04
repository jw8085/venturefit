import { test, expect } from '@playwright/test';
test('interactive example and explicit actual-mode block', async ({page}) => {
 await page.goto('http://127.0.0.1:5173');
 await expect(page.getByRole('heading',{name:'투자의 가능성, 절세까지 한눈에.'})).toBeVisible();
 await expect(page.getByText('예시 계산 · 실제 세금 산정용이 아닙니다')).toBeVisible();
 const before=await page.getByTestId('saving-value').textContent();
 await page.getByLabel('투자 금액', {exact:true}).fill('5000');
 await expect(page.getByTestId('saving-value')).not.toHaveText(before!);
 await page.getByRole('button',{name:'개인사업자'}).click();
 await expect(page.getByText('매출이 아닌, 필요경비를 뺀 사업소득을 입력해 주세요.')).toBeVisible();
 await page.getByRole('button',{name:'상세 입력'}).click();
 await page.getByLabel('투자 공제 전 과세표준').fill('9000');
 await page.getByLabel('종합소득금액').fill('8000');
 await expect(page.getByRole('alert')).toContainText('과세표준');
 await page.getByLabel('투자 공제 전 과세표준').fill('6000');
 await page.getByRole('button',{name:'실제 세법 적용'}).click();
 await expect(page.getByRole('alert')).toContainText('요건');
 await expect(page.getByTestId('saving-value')).toHaveCount(0);
});
test('zero, blank input and mobile layout',async({page})=>{
 await page.setViewportSize({width:390,height:844}); await page.goto('http://127.0.0.1:5173');
 await page.getByLabel('투자 금액', {exact:true}).fill('0');
 await expect(page.getByTestId('saving-value')).toContainText('0');
 await page.getByLabel('투자 금액', {exact:true}).fill('');
 await expect(page.getByRole('alert')).toContainText('입력');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
test('compares savings across income levels',async({page})=>{
 await page.goto('http://127.0.0.1:5173');
 await page.getByRole('button',{name:'소득별 비교',exact:true}).click();
 await expect(page.getByRole('heading',{name:'소득이 달라지면, 절세는 얼마나?'})).toBeVisible();
 await expect(page.getByRole('img',{name:'소득별 예시 절세액 그래프. 동일한 투자 조건을 사용합니다.'})).toBeVisible();
});

test('verified 2026 direct mode requires eligibility and blocks unsupported years',async({page})=>{
 await page.goto('http://127.0.0.1:5173');
 await page.getByRole('button',{name:'실제 세법 적용'}).click();
 await page.getByLabel('공제 요건 충족과 대상 투자금액을 확인했습니다.').check();
 await expect(page.getByTestId('saving-value')).toBeVisible();
 await expect(page.getByText('세법 기준 · 실제 환급액과 다를 수 있습니다')).toBeVisible();
 await page.getByLabel('투자 연도',{exact:true}).selectOption('2025');
 await expect(page.getByRole('alert')).toContainText('공식');
});
test('large valid inputs do not crash the charts',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5173');
 await page.getByLabel('투자 금액',{exact:true}).fill('100000000');
 await expect(page.getByTestId('saving-value')).toBeVisible();
 await page.getByRole('button',{name:'소득별 비교',exact:true}).click();
 await page.getByLabel('연간 총급여',{exact:true}).fill('100000000');
 await expect(page.getByTestId('saving-value')).toBeVisible();
 expect(errors).toEqual([]);
});
test('actual future years show no unverified amounts',async({page})=>{
 await page.goto('http://127.0.0.1:5173');await page.getByRole('button',{name:'실제 세법 적용'}).click();await page.getByLabel('공제 요건 충족과 대상 투자금액을 확인했습니다.').check();
 const future=page.getByRole('button').filter({hasText:'2027년'});await expect(future).toContainText('미확인');await expect(future).not.toContainText('641');
});
test('explains deductions exceeding income',async({page})=>{
 await page.goto('http://127.0.0.1:5173');await page.getByLabel('연간 총급여',{exact:true}).fill('100');await page.getByLabel('기존 소득공제 합계',{exact:true}).fill('10000');
 await expect(page.getByRole('status')).toContainText('공제액이 종합소득금액보다');
});
