# Letter 053 engineering-calculation preflight

## Executive summary

The numerical controls used in the upgraded app pass 14/14 deterministic arithmetic checks. This is not approval of the underlying Primavera P6 models or a certification of contractual entitlement. The principal issue controls are:

- 117 calendar days is verified as the submitted Batch No. 2 Project Finish movement, but remains partially verified as a claim result pending native P6, causation, concurrency and adjustment review.
- STR-104 records the primary Event 2 Project Finish result as 76 days, while the later `02 − 01` workbook/PDF pair records 71 days. Both are preserved as a version discrepancy requiring native-file reconciliation.
- The 28-day and 25-day reductions are correct arithmetic differences between the 43/37 actual-duration case and the 15/12 Engineer assessment. The causes of those reductions are not demonstrated.
- The 2-day difference between 37 and 35 is arithmetic only. It is not an isolated effect of the 24 relationship changes because the source comparisons use different before dates.
- Seven approval-activity mappings are directly evidenced and one B04 STR-046 row is a disclosed paired-package mapping. The mapping supports an input challenge, not an automatic revised EOT.
- ACEPM Letter 055 was not found as a complete verified letter and is excluded from reliance. The STR-055 Rev.2 drawing reply is a different record.

## Document and calculation inventory

- Verified correspondence: Engineer Letter 050 dated 19 August 2026; SAMCO STR-104 dated 31 August 2026; Engineer Letter 053 dated 7 September 2026.
- Contract evidence: executed Overall Contract pages 7, 12–14, 20–21 and 30–31, covering Appendix Item 20 and the relevant amendments to Sub-Clauses 1.8, 1.9, 3.1, 3.5, 8.3, 8.4, 20.1 and 20.2.
- Schedule evidence: five IFC comparison PDFs; `IFC sch movement.xlsx`; claim/baseline XER signature review; 24-relationship registers.
- Date evidence: `ifc dates.xlsx`; STR-044 Rev.3, STR-046 Rev.2, STR-054 Rev.2 and STR-055 Rev.2 reply evidence.
- New relationship evidence: `Relationsthat removed or changed that have direct or similair dirrection to apply on rev01 bl from ACEPM.xlsx`, Sheet1, eight relationship rows plus header.
- Letter 053 coverage: 23 points grouped into six families and individually mapped.
- Arithmetic package: `letter53_calculations.json`, 14 calculations; `letter53_calculation_results.json`, 14 passed, zero unsupported.
- Connected Readwise check: no case-specific AACE/FIDIC/P6 material was returned and nothing from Readwise is relied upon.

## Findings

1. **Major — version reconciliation required.** STR-104 gives 78/76, while the later 02−01 workbook/PDF gives a 71-day Project Finish movement. The app now shows both and demands file/version/settings reconciliation.
2. **Major — causal bridge absent.** The arithmetic reductions 43→15 = 28 and 37→12 = 25 are verified; the activity/relationship causes remain undisclosed.
3. **Major — two-day claim withdrawn.** The 37-day and 35-day movements use different before models (6 July and 22 June 2027). Their two-day difference cannot quantify the effect of removing the 24 relationships.
4. **Major — actual-date provenance required.** The mapped ACEPM approval dates differ from the reply evidence; the B04 STR-046 mapping is qualified rather than presented as direct proof.
5. **Major — relationship durations require row-specific support.** The new workbook strengthens the purpose or method of rows 6, 7, 8, 9, 14, 15, 18 and 24 but does not prove every exact lag. Strength-related rows require structural and temporary-works evidence.
6. **Observation — Letter 055 excluded.** No complete verified ACEPM Letter 055 was located. No statement or conclusion is attributed to it.
7. **Observation — inspection-record count unverified.** The possible population of approximately 83 inspection records is not used as fact because no complete indexed count was established.

## Unit and dimensional audit

All reported schedule differences are calendar-day counts. The deterministic checker represents them as dimensionless counts because its unit library has no calendar-day unit; locations explicitly state the calendar-day basis. Relationship and point totals are counts. No incompatible dimensions are combined. Calendar conventions, activity calendars and working-day/calendar-day conversions still require native P6 review.

## Assumption and dependency gaps

- Native XER file identity, file hash, data date, calendars, constraints, progress override, out-of-sequence setting and longest-path settings for each stated result.
- A matched P6 sensitivity changing only the 24 relationships under identical settings.
- Direct evidence for the B04 STR-046 reply mapping.
- Row-specific method statements, formwork/shoring design, member/span data, loads, temperature, cube/strength results and release approvals for strength-related lags.
- Complete delivery-note and mitigation chronology for Event 1 and a demonstrated concurrency analysis.
- Exact procedural notice calendar and issue date for any dispute reference under amended Sub-Clause 20.2.
- Indexed inspection/IR register if the project team wishes to rely on a stated count.

## Citation ledger

| ID | Source | Locator | Claim supported | Control |
|---|---|---|---|---|
| C-01 | STR-104 | pp3–4, 9 | 117; 78/76; 43/37; 15/12 | Source text verified; native result partial |
| C-02 | Letter 050 | determination and planning attachment | Critical-path acceptance; 15/12; relationship-change rationale | Verified as stated; method disputed |
| C-03 | Letter 053 | pp1–3, points 1–23 | Engineer principles and response characterization | Complete 23-point mapping |
| C-04 | IFC sch movement.xlsx | Sheet1 A1:H5 | 71, 37, 35 and 12 movements; different before date for 05−04 | Workbook reproduced |
| C-05 | Date-control workbook/replies | eight P6 approval rows | −12, −4, −84, −31 mapped variances | Seven direct, one paired mapping |
| C-06 | Overall Contract | pp7, 12–14, 20–21, 30–31 | Verified project-specific amendments | Signed Contract controls |
| C-07 | 24-link registers/XER signature review | REL-01…REL-24 | Pre-event presence; 18 resets and six deletions | Effect HOLD |
| C-08 | New ACEPM baseline-comment workbook | rows 2–9 | Purpose/method support for eight disputed rows | Exact lag often not prescribed |

## Items requiring licensed-engineer judgment

- Whether each strength/shoring release control and duration is adequate for the actual member, span, loading, reshoring system, achieved concrete strength and site conditions.
- Whether any replaced relationship creates or removes a physically achievable and contract-permitted sequence.
- Whether IFC/shop-drawing dates are correctly mapped to the controlling P6 activity and revision.
- Whether each delay result is reproduced correctly in native Primavera P6 and whether the controlling/longest path is causal.
- Contract-manager and legal review of entitlement, notice, monetary recovery, dispute procedure and the seven-day administrative demand.

## Sign-off checklist

- [x] All 23 Letter 053 points mapped.
- [x] All 24 relationships represented in the linked register.
- [x] 14/14 arithmetic controls passed.
- [x] 71/76 version discrepancy disclosed.
- [x] 37/35 causal attribution placed on HOLD.
- [x] Letter 055 excluded from reliance.
- [x] Executed Contract clauses used in the draft were checked at source pages.
- [ ] Native P6 models and calculation settings reproduced.
- [ ] Relationship-only matched sensitivity completed.
- [ ] Structural/temporary-works engineer validates strength-release controls.
- [ ] Contracts/counsel confirms issue wording, deadline and amended Sub-Clause 20.2 procedural calendar.

This preflight is a technical support review only. It is not engineering approval, certification, sealing, code-compliance approval or legal advice.
