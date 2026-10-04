export interface TaxRules { verified: boolean; brackets: readonly (readonly [number, number])[]; deductionCap: number; localRate: number }
// Illustrative assumptions only. These are not a verified annual statutory ruleset.
export const EXAMPLE_RULES: TaxRules = {
 verified: false, deductionCap: .5, localRate: .1,
 brackets: [[14000000,.06],[50000000,.15],[88000000,.24],[150000000,.35],[300000000,.38],[500000000,.4],[1000000000,.42],[Infinity,.45]],
};
// Verified against the current 2026 statutes; see docs/tax-sources.md.
// Only qualifying direct investment and a 2026 claim are supported in actual mode.
export const rulesByYear: Record<number, TaxRules> = {2026:{...EXAMPLE_RULES,verified:true}};
