# Execution ledger — venture-tax-plan
Approved spec and implementation plan. Working in the existing isolated cloud workspace and separate project directory; no worktree needed.
Pre-flight: Task 2 consumes calculate and rulesByYear from Task 1, consistent.
Ruling: Official websites return proxy CONNECT 403. Actual tax mode stays blocked; an explicitly labeled illustrative model demonstrates the UI and calculation pipeline without claiming verified law. Cost: live tax estimates unavailable until official rules verified.
Ruling: npm default cache is outside writable roots. Use /tmp/venture-npm-cache. No security verification disabled.
Task 1: Test-first suite initially failed on absent calculation engine. Two fixture errors diagnosed: tax base exceeded income in the cap fixture; 80m salary income is 66.25m, not 66.75m under the illustrative formula. Corrected independent fixtures, not production to match bad assertions.
Task 1: official connectivity restored after draft network update. Retrieved Article 16 (effective 2026-09-18), Income Tax Act Articles 47 and 55 and their tables, Local Tax Act Article 92 and its table, and Article 132-2. Verified direct-investment rates and exemption from the 25m combined cap. Added 4 test-first scope checks and enabled only 2026 qualifying direct investment with 2026 claim. Other years/routes stay explicitly illustrative or blocked.
Task 2: income comparison browser test failed because the toggle was absent, then passed after adding the toggle and income-axis graph. Input unit wrapping fixed after screenshot inspection.
Task 1: complete — 36/36 unit tests; 2026 verified scope and business minimum-tax test observed RED then GREEN.
Task 2: complete — 7/7 Chromium tests including salary/business, simple/detailed, validation, actual eligibility, unsupported year, zero/blank, income axis, mobile, high inputs and future unavailable rows.
Final review: independent reviewer found high-input graph crash, future-year copied actual estimates, silent excess deductions, and two minor improvements. Fixed the three important findings with browser reproductions RED→GREEN. Clamped comparison axes to accepted 1e12 maximum, replaced future values with unavailable labels, added explanatory status. Whole 36-unit + 7-browser suite and build green.
Final: minor (deferred): selected-state aria attributes for mode/scenario/chart toggles.
Final: minor (deferred): chart's current marker snaps to nearest sampled point; result cards remain exact.
Task 3: complete — locked dependency reinstall succeeded, page functional request and real browser readiness verified; source/desktop/mobile screenshots and static bundle retained. Deployment not performed.
Configuration: install_script and start_skill saved with confirmed draft status, network destinations saved earlier. Current instance validated, environment publication/new-task restore not performed.
Production bundle smoke: HTTP 200, verified detailed statutory example 594만원, no browser errors.
