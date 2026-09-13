(()=>{
'use strict';

const POINTS53=[
 {n:1,f:1,p:'Recognition of Employer steel delay and EOT principle',loc:'Letter 053 p1, lines 24–28',s:'Accepted',a:'Relied upon for entitlement in principle; quantum remains to be determined.'},
 {n:2,f:2,p:'Batch No. 3 remained ongoing',loc:'p1, lines 29–31',s:'Accepted',a:'Agreed; it is kept separate from completed Batch No. 2.'},
 {n:3,f:2,p:'EOT submission described as interim',loc:'p1, lines 31–32',s:'Accepted in part',a:'Interim status does not answer the completed-component determination requested.'},
 {n:4,f:2,p:'Final overall impact not established',loc:'p1, lines 33–35',s:'Different question',a:'SAMCO requested determination of completed Batch No. 2, not closure of all steel impacts.'},
 {n:5,f:2,p:'Future assessment requires causation, criticality and concurrency review',loc:'p1, lines 36–39',s:'Accepted in principle',a:'Apply those tests to the disclosed Batch No. 2 model and determine the supported portion.'},
 {n:6,f:3,p:'Engineer rejects SAMCO’s characterization of programme changes',loc:'p1, lines 40–42',s:'Unsupported',a:'No relationship-specific rebuttal or sensitivity result is given.'},
 {n:7,f:3,p:'Critical-path movement alone is not manipulation',loc:'p1, lines 43–45',s:'Accepted but non-responsive',a:'STR-104 relied on the identified 24 changes, not path movement alone.'},
 {n:8,f:3,p:'Schedule validation and reliable data are required',loc:'p1 line 46–p2 line 10',s:'Accepted',a:'The disclosed actual-date conflicts and model/version gaps must therefore be corrected.'},
 {n:9,f:3,p:'SVP2.3 requires update-chain, date and path checks',loc:'p2, lines 11–16',s:'Accepted',a:'Provide the update chain, native files and longest-path outputs used.'},
 {n:10,f:3,p:'Nature, basis, purpose and objective necessity of changes control',loc:'p2, lines 17–20',s:'Accepted',a:'Those particulars are still required for each of the 24 changes.'},
 {n:11,f:4,p:'Objectively justified anomaly may be corrected',loc:'p2, lines 21–25',s:'Accepted in principle',a:'A demonstrated anomaly is required; preferred logic is insufficient.'},
 {n:12,f:4,p:'Actual dates may be corrected',loc:'p2, lines 26–28',s:'Accepted',a:'Correct against verified replies; STR-054’s ACEPM date predates submission.'},
 {n:13,f:4,p:'Logic may be corrected',loc:'p2, line 29',s:'Accepted conditionally',a:'Identify defect, evidence, replacement and isolated effect for each change.'},
 {n:14,f:4,p:'Scope may be corrected',loc:'p2, line 30',s:'Not demonstrated here',a:'No scope defect is identified for any disputed relationship.'},
 {n:15,f:4,p:'Missing activities may be inserted',loc:'p2, line 31',s:'Not demonstrated here',a:'No missing activity supporting the 25-day Project Finish reduction is disclosed.'},
 {n:16,f:4,p:'Revisions and fragnets may be reconstructed',loc:'p2, lines 32–33',s:'Accepted conditionally',a:'Keep fragnet logic distinct from pre-event network corrections.'},
 {n:17,f:4,p:'Activities may be split for correlation',loc:'p2, lines 34–35',s:'Not demonstrated here',a:'No split and isolated effect are disclosed.'},
 {n:18,f:4,p:'A correction may shift the critical path',loc:'p2, lines 36–39',s:'Accepted but non-responsive',a:'The dispute is the undisclosed basis and inconsistent application, not path movement alone.'},
 {n:19,f:5,p:'Corrections require balance, consistency and contemporaneous support',loc:'p2, lines 40–44',s:'Accepted and invoked',a:'Selective event-by-event network treatment cannot satisfy this without a frozen protocol.'},
 {n:20,f:5,p:'Modification must be distinguished from legitimate correction',loc:'p2, lines 45–48',s:'Already addressed',a:'STR-104 requested separate Sub-Clause 8.3 review and an isolated sensitivity calculation.'},
 {n:21,f:6,p:'SAMCO allegedly did not identify the adjustment, basis or effect',loc:'p2 line 49–p3 line 11',s:'Cannot be reconciled',a:'STR-104 identifies 24 links by predecessor, successor, type and lag and requests their quantified effect.'},
 {n:22,f:6,p:'Different model/path does not itself confer EOT',loc:'p3, lines 12–14',s:'Accepted',a:'SAMCO relies on event causation plus controlled model evidence, not difference alone.'},
 {n:23,f:6,p:'Entitlement needs reliable data, records and cause-and-effect proof',loc:'p3, lines 15–17',s:'Accepted and invoked',a:'That standard requires verified dates, native models and reproducible deductions.'}
];

const QUESTION_REGISTER=[
 ['Q1','Why can the completed Batch No. 2 component not be determined separately while Batch No. 3 remains open?','STR-104 pp3,9','Absent','Letter 053 addresses final overall impact, not the completed component.','Issue a reasoned interim determination.'],
 ['Q2','What is the isolated time effect of changing the 24 pre-existing relationships?','STR-104 pp5–6,9','Absent','No matched before/after sensitivity is disclosed.','Provide native matched run and output.'],
 ['Q3','For each relationship, what exact anomaly, record and replacement logic justified the change?','STR-104 pp5–6','Absent','Letter 053 lists permissible correction categories only.','Answer all 24 rows individually.'],
 ['Q4','Why was pre-event approved logic described as relationships initially applied in the impact analysis?','Letter 050 planning attachment; STR-104 p5','Absent','The signatures pre-date the Event 2 fragnet.','Reconcile wording to version history.'],
 ['Q5','What deductions reconcile 43/37 with 15/12?','STR-104 pp2,4,9','Absent','The reductions are 28 days at Ground Works and 25 days at Project Finish.','Provide activity/relationship bridge.'],
 ['Q6','Which evidence supports every IFC/shop-drawing actual date used?','STR-104 actual-duration schedule; date register','Partial / conflicted','Four package dates conflict; one B04 row is a paired-package mapping.','Issue documented actual-date change log.'],
 ['Q7','Which native files, calendars, constraints and calculation settings produced each result?','STR-104 pp5,9','Absent','No complete reproducibility package is disclosed.','Provide the electronic model set.'],
 ['Q8','Why are the 24 links removed in the claim model but present in the later Engineer-returned progress model?','Approved baseline/XER signature comparison','Absent','The record shows inconsistent use; the time effect is not isolated.','Adopt one frozen protocol or justify every exception.']
];

const CONTRADICTIONS=[
 ['Letter 050','19 Aug 2026','“detailed examination of the Project’s longest path” identified relationships “deemed illogical” and ACEPM removed all inter-building soft logic and FS lags.','A relationship class was altered after consultation.','Letter 053, 7 Sep 2026: SAMCO allegedly made only a general critical-path reference and did not identify specific adjustments.','STR-104, 31 Aug 2026, had already listed 24 exact links and requested sensitivity.'],
 ['Letter 050','19 Aug 2026','Revised IFC and clarification period “affected activities on the critical path” and 15/12 days were awarded.','Event causation and criticality were accepted.','Letter 053 emphasizes that a changed critical path does not itself establish entitlement.','Correct as a general proposition, but it does not answer the numerical bridge from 43/37 to 15/12.'],
 ['Approved baseline / claim / progress files','Pre-event through 3 Sep 2026','All 24 signatures existed in the approved baseline and were retained in SAMCO’s claim models.','They were not created by the Event 2 fragnet.','Letter 050 removed them for the claim assessment; later Engineer-returned progress model retained all 24.','This requires version control and a consistent rule; exact time effect remains HOLD pending matched native runs.']
];

const ACTIONS=[
 ['A','A formal determination for the completed Batch No. 2 portion of Event 1.'],
 ['B','Complete Event 1 and Event 2 schedule calculations in native/electronic form.'],
 ['C','The exact programme files used for every before and after assessment.'],
 ['D','A full reconciliation of 78/76, 43/37 and 15/12, including the later 71-day workbook variant.'],
 ['E','A relationship-by-relationship reconciliation of all 24 logic changes.'],
 ['F','A documented explanation and source record for every actual-date change.'],
 ['G','Verified IFC/shop-drawing dates and the evidence relied upon.'],
 ['H','A direct response to every unanswered SAMCO question in the verified 050 → 104 → 053 sequence.'],
 ['I','Identification and reconciliation of every longest-path/critical-path statement in verified correspondence.'],
 ['J','Confirmation of the programme/version and logic constituting the controlled analytical basis.'],
 ['K','Confirmation that no further logic modification will be introduced without identification, proof, impact testing and disclosure.'],
 ['L','Confirmation that ACEPM Letter 055 has not been relied upon unless the complete verified document is disclosed and incorporated into the record.']
];

const LETTER_SECTIONS=[
 ['1. Subject','Delay Event Nos. 1 and 2 — demand for completed-component determination, reconciliation of analytical inconsistencies, disclosure of the native schedule basis, and preservation of SAMCO’s rights.'],
 ['2. References','(i) Engineer Letter 050 dated 19 August 2026; (ii) SAMCO Letter BD-CW-SAMCO-ACE-LET-STR-104 dated 31 August 2026; (iii) Engineer Letter 053 dated 7 September 2026; (iv) the executed Contract and Particular Conditions; (v) approved/contemporaneous programmes, claim XERs, drawing replies, RFIs and the controlled date and relationship registers. ACEPM Letter 055 is excluded: no complete verified copy was found. The STR-055 drawing reply is a different document and is not ACEPM Letter 055.'],
 ['3. Purpose and status of this notice','This letter requires express resolution of matters left unanswered in the verified correspondence. It is issued without prejudice and without waiver. SAMCO’s discussion of the Engineer’s figures does not accept those figures, their methodology or their contractual effect.'],
 ['4. Executive contractual position','The executed Contract places 70% of the 25% advance in Employer-supplied steel according to the approved Programme. The verified amendments also require evidence-based delay assessment, critical-path proof, mitigation review and a reasoned Engineer decision. The signed Contract and Particular Conditions control; AACE guidance informs methodology only and creates no entitlement.'],
 ['5. Failure to answer SAMCO’s previous questions','Letter 053 repeats general forensic principles but does not answer the completed Batch No. 2 question, the 24-row sensitivity request, the relationship-specific anomaly basis, the actual-date provenance, or the quantitative bridge from 43/37 to 15/12. Recharacterizing a documented question as a general allegation is not a substantive response.'],
 ['6. Contradictions across Letters 050 / 104 / 053','Letter 050 says ACEPM performed a detailed longest-path review and changed identified relationship classes. STR-104 then identified the exact 24 links and requested a controlled before/after test. Letter 053 nevertheless states that the adjustment, basis and effect were not identified. That sequence cannot be reconciled without a point-by-point response and the underlying native calculations.'],
 ['7. Event No. 1 — completed Batch No. 2','The submitted Batch No. 2 model moves Ground Works Finish from 26 May to 29 September 2026 (126 calendar days) and Project Finish from 12 May to 6 September 2027 (117 calendar days). This is submitted schedule evidence, not an unquestionable final entitlement. It remains subject to native-model verification, causation, demonstrated concurrency and justified adjustments. None of those controls requires ACEPM to leave a completed, measurable component wholly undetermined merely because Batch No. 3 continues. SAMCO requires a reasoned interim determination of the supported portion, with Batch No. 3 and cumulative effects expressly reserved.'],
 ['8. Event No. 2 — quantitative inconsistencies','STR-104 records the primary like-for-like prospective case as 78 days to Ground Works Finish and 76 days to Project Finish; the actual-duration case retaining the original relationships as 43/37; and the Engineer’s result as 15/12. The reductions are therefore 28 days and 25 days. A later supplied workbook records 71 rather than 76 days for its prospective Project Finish pair (6 July to 15 September 2027). SAMCO does not conceal that version discrepancy: ACEPM must identify which native file, data date and settings control and reconcile both results.'],
 ['9. Incorrect or unsupported IFC actual dates','The controlled comparison identifies eight paired P6 approval activities across four packages whose ACEPM-used dates do not match the mapped Consultant replies. Seven rows are directly supported; the B04 STR-046 row is a paired-package mapping and is labelled accordingly. STR-054 is especially material: 9 March 2026 was used although the known submission was 20 May and verified reply 1 June. The affected calculation cannot be treated as reliable until the native model is recalculated with verified contemporaneous dates and a disclosed change log.'],
 ['10. Longest-path and critical-path contradictions','ACEPM accepted that Event 2 affected the approved Programme’s critical path, later relied on a detailed longest-path investigation to alter logic, then answered STR-104 as though it relied on path movement alone. SAMCO does not contend that every path change proves impropriety. It contends that the disclosed 24 changes, their inconsistent use and their unquantified effect require direct reconciliation.'],
 ['11. The 24-relationship issue','The 24 signatures pre-date the Event 2 fragnet; 18 lags were reset and six relationships deleted. The new baseline-comment workbook supports the purpose of rows 6, 7, 8, 9, 14, 15, 18 and 24, while expressly not proving every exact lag. Seven strength-related rows encode waiting controls after pouring or curing, but the proper duration depends on method statement, member/span, shores and reshores, loads, temperature, tests and achieved strength. SAMCO therefore does not demand blind restoration of every original lag: ACEPM must prove any defect row by row, preserve the required engineering release control, and show the isolated schedule effect.'],
 ['12. Improper selective modification of programme logic','An accepted contemporaneous programme has evidential value. A demonstrated anomaly may be corrected, but preferred logic is not enough. A correction must be identified, technically demonstrated, contemporaneously supported, disclosed, consistently applied, version controlled and impact tested separately from the event fragnet. Removing logic for one claim analysis while retaining it in another operational model, without reconciliation, is a material forensic scheduling concern.'],
 ['13. Required frozen analytical basis','Before any further assessment, ACEPM shall disclose and freeze: source programme and revision; data date; calendars; longest-path settings; retained logic; progress override; constraints; open ends; out-of-sequence treatment; all removed, modified and added relationships; all lag and actual-date changes; fragnet logic; and every calculation setting. Any later departure must identify a demonstrated anomaly in writing and include its isolated impact.'],
 ['14. Required Engineer actions',ACTIONS.map(x=>'<b>'+x[0]+'.</b> '+x[1]).join('<br><br>')],
 ['15. Deadline for a substantive response','Given that these matters are already outstanding, SAMCO requires a complete substantive response and the native analytical package within seven calendar days of the issued letter date, without prejudice to any shorter or longer period governing a formal contractual notice or dispute step. If ACEPM requires a different administrative date, it must state the contractual basis immediately.'],
 ['16. Contractual reservation of rights','SAMCO expressly reserves all rights and remedies under the Contract and applicable law concerning delayed or inadequate determination, Event 1 and Event 2 EOT, further steel delay and Batch No. 3, cumulative impacts, demonstrated concurrency, prolongation and recoverable costs, financing and disruption consequences where contractually available, and referral of unresolved matters under amended Sub-Clause 20.2 and the governing dispute route. No silence, participation in analysis, mitigation effort, progress update, discussion of figures or interim request constitutes acceptance, election, waiver, accord or abandonment.']
];

const FIGURE_CONTROL=[
 ['117 days','Event 1 · Batch No. 2 Project Finish movement','STR-104 schedule table · EV-001','Partially verified','Submitted schedule result only; not admitted as final contractual entitlement. Native settings, causation, concurrency and justified adjustments remain to be determined.'],
 ['126 days','Event 1 · Batch No. 2 Ground Works movement','STR-104 schedule table · EV-002','Partially verified','Corroborating submitted milestone movement; protected on the same basis as the 117-day figure.'],
 ['78 / 76 days','Event 2 · primary like-for-like Ground Works / Project Finish','STR-104 · EV-003','Partially verified','SAMCO submission position; no acceptance that either value is final until the native model and contractual tests are reproduced.'],
 ['71 days','Event 2 · later prospective Project Finish workbook variant','02 − 01 workbook/XER pair · EV-004','Disputed version','Must be reconciled with the 76-day submitted result; neither figure silently replaces the other.'],
 ['43 / 37 days','Event 2 · actual-duration case retaining original logic','STR-104 and comparison workbook · EV-005','Partially verified','A calibrated analytical case, not an agreed cap or final quantum.'],
 ['15 / 12 days','Event 2 · Engineer assessment','Letter 050 · EV-006','Verified as stated / method disputed','Recorded without acceptance of the calculation, methodology, factual inputs or contractual effect.'],
 ['28 / 25 days','Event 2 · arithmetic reduction from 43/37 to 15/12','EV-007 / EV-008','Arithmetic verified / cause HOLD','Defines the unexplained bridge only. It is not an admission that the deductions are valid.'],
 ['Approximately 2 days','Cross-model 37/35 comparison concerning the 24 changes','EV-009','HOLD — not isolated','Different before models prevent attribution to the 24 changes. It must not be alleged as a proven logic-removal effect.']
];

const PROTECTION_SECTIONS=[
 ['1. Overriding status and non-acceptance','This communication supplements and protects SAMCO’s existing notices, submissions and correspondence. It does not replace, narrow, settle or compromise any earlier position. It is issued strictly without prejudice, without waiver and without acceptance of any ACEPM or Engineer conclusion. Reference to any day value, schedule result, date, logic treatment or determination is for identification, audit and reconciliation only and shall not be construed as agreement with its correctness, methodology, causation, quantum or contractual effect.'],
 ['2. Event No. 1 — completed Batch No. 2 protected position','The Engineer has recognized the Employer-side steel event and the potential EOT principle. SAMCO maintains that the completed and measurable Batch No. 2 component must be determined on its own evidence and must not remain unresolved merely because Batch No. 3 or later cumulative effects remain open. The submitted 126-day Ground Works and 117-day Project Finish movements are preserved as schedule evidence [EV-001, EV-002], not asserted here as automatically established entitlement. SAMCO reserves the right to rely on the supported result after native P6 verification, causation, mitigation and demonstrated concurrency review, while separately reserving Batch No. 3 and cumulative effects.'],
 ['3. Event No. 2 — no acceptance of any analytical ceiling','SAMCO preserves the primary 78/76 case [EV-003], the actual-duration 43/37 case retaining the original logic [EV-005], and its challenge to the Engineer’s 15/12 assessment [EV-006]. None is accepted as a ceiling, settlement or final quantum. ACEPM must reconcile the 28-day Ground Works and 25-day Project Finish reductions [EV-007, EV-008] activity by activity, relationship by relationship and factual-date change by factual-date change. The later 71-day variant [EV-004] must be version-controlled and reconciled with 76 days before either is relied upon.'],
 ['4. IFC and actual-date protection','A date appearing in an analysis is not self-proving. Every IFC, shop-drawing, inspection and progress date used to calculate Event No. 2 must trace to the controlled transmittal, submission, reply, revision or inspection record. The identified conflicts, including the STR-054 sequence [EV-010], require correction and a native rerun. Until ACEPM discloses the source and change log for each actual date, the affected result cannot constitute a technically reliable basis for determination. This challenge preserves SAMCO’s position but does not itself quantify additional entitlement.'],
 ['5. Longest-path and critical-path protection','ACEPM’s verified positions concerning event criticality, detailed longest-path review and later characterization of SAMCO’s objection must be reconciled chronologically [EV-013, EV-015]. SAMCO does not allege that every path movement proves impropriety. SAMCO’s protected objection is that material path conclusions cannot rest on undisclosed, inconsistently applied or unreproducible model changes. ACEPM must identify the exact native path output and calculation settings supporting each conclusion.'],
 ['6. The 24 relationships — controlled position','All 24 registered signatures pre-date the Event No. 2 fragnet [EV-014]. Eighteen lags were reset and six relationships deleted. Their presence does not prove that every original lag duration was correct, and an alternative preferred sequence does not prove a demonstrated anomaly. Each change requires its own technical basis, contemporaneous support, replacement control and isolated native effect. The approximately two-day 37/35 cross-model observation remains HOLD [EV-009] because the source pairs do not share an identical before model; SAMCO neither adopts nor waives any position on the true effect pending a matched P6 sensitivity run.'],
 ['7. Unanswered matters remain expressly open','The outstanding questions Q1–Q8 remain live. Repetition of a conclusion, restatement of SAMCO’s position or citation of a general forensic principle is not a substantive answer. No unanswered point may be treated as agreed through silence, continued progress, participation in meetings, mitigation, submission of updates or use of an interim figure. ACEPM and the Engineer are required to respond directly with the identified source record, native calculation and contractual reasoning.'],
 ['8. Frozen analytical basis and change control','Before further reliance, ACEPM shall identify and freeze the official source programme, revision, data date, calendars, constraints, longest-path settings, retained-logic and progress-override settings, open ends, out-of-sequence treatment, fragnet logic, every added/removed/modified relationship, every lag change, every actual-date correction and every calculation option. Any later departure must be notified in writing before reliance, linked to a specifically demonstrated anomaly, technically supported, version controlled and tested both in isolation and cumulatively. Selective event-by-event alteration without this audit trail is not acceptable.'],
 ['9. Contractual and legal rights preserved','SAMCO reserves all rights and remedies under the executed Contract, its Particular Conditions and applicable law, including rights concerning Event Nos. 1 and 2, Batch No. 2, continuing Batch No. 3, further Employer/Engineer-controlled events, EOT, prolongation and other recoverable cost consequences, financing and disruption where contractually available, cumulative effects, and concurrency only where demonstrated. SAMCO also reserves all notice, determination, dissatisfaction, dispute and referral rights, including the amended Sub-Clause 20.2 route and any DAB/DAAB, arbitration or other competent forum. Contract and counsel shall confirm the live procedural calendar before issue.'],
 ['10. No waiver by conduct or discussion','No act or omission by SAMCO—including progress, mitigation, resequencing, attendance at meetings, provision of information, submission of an updated programme, request for an interim decision, discussion of a figure, payment application, failure to repeat a reservation on every occasion, or continued performance—shall be interpreted as acceptance, waiver, election, estoppel, accord, satisfaction or abandonment of any right. No partial determination or payment shall settle the balance unless SAMCO expressly agrees in a duly authorized written instrument.'],
 ['11. Required determination and record production','SAMCO requires the outputs A–L in the controlled action register, including the completed Batch No. 2 determination; all native before/after files; the full 78/76, 71, 43/37 and 15/12 reconciliation; the relationship-by-relationship 24-row analysis; actual-date provenance; direct answers to Q1–Q8; and a signed frozen analytical protocol. Any response that omits the native calculation trail or answers only at a general level will leave the relevant issue unresolved.'],
 ['12. Closing reservation','SAMCO requests a complete substantive response within seven calendar days of the issued letter date, subject to verification of any governing contractual deadline. Pending that response, every disputed factual, technical, quantum and contractual issue remains open. SAMCO expressly reserves the right to amend, supplement or particularize its position as further native files, records, expert analysis or continuing-event evidence become available. Nothing in this tab or the associated draft shall prejudice any existing or future entitlement.']
];

const EVIDENCE_FIELDS=['Item No.','Issue / Assertion','Delay Event','Source Document / Record','Document Number','Document Date','Revision / Programme Version','Page / Paragraph / Activity ID / Relationship ID','Exact Quotation or Data Point','Evidence Type','Verification Status','Responsible Party / Author','Analytical Significance','Contractual Significance','Related Letter Section','Required Action / Clarification','Outstanding Information','Notes'];
const ev=(no,issue,event,source,doc,date,version,locator,data,type,status,party,analysis,contract,section,action,outstanding,notes)=>({no,issue,event,source,doc,date,version,locator,data,type,status,party,analysis,contract,section,action,outstanding,notes});
const EVIDENCE=[
 ev('EV-001','Batch No. 2 Project Finish movement','Event 1','STR-104 schedule table','BD-CW-SAMCO-ACE-LET-STR-104','31 Aug 2026','Submitted Batch No. 2 model; native hash not disclosed','p3','12-May-2027 → 06-Sep-2027 = 117 calendar days','Schedule result','Partially verified','SAMCO','Quantified submitted impact; not final entitlement','Supports completed-component determination subject to Contract','§7','Native verification and reasoned determination','Native XER settings, path report, concurrency test','Arithmetic verified; causation/entitlement remains controlled.'),
 ev('EV-002','Batch No. 2 Ground Works movement','Event 1','STR-104 schedule table','STR-104','31 Aug 2026','Same model as EV-001','p3','26-May-2026 → 29-Sep-2026 = 126 calendar days','Schedule result','Partially verified','SAMCO','Corroborating milestone movement','Same reservation as EV-001','§7','Disclose model and determine supported portion','Native outputs','Arithmetic verified.'),
 ev('EV-003','Primary Event 2 case','Event 2','STR-104','STR-104','31 Aug 2026','Prospective TIA; data date 17 Mar 2026','pp2,4,9','78 days Ground Works / 76 days Project Finish','Schedule result','Partially verified','SAMCO','Primary like-for-like submission','Quantum remains subject to contractual causation tests','§8','Reproduce from native file','Native XER, settings, calendars','Source text verified; native recalculation pending.'),
 ev('EV-004','Later prospective Project Finish variant','Event 2','IFC sch movement.xlsx + PDF 02/01','02 − 01','Not stated','Supplied workbook/PDF pair','Sheet1 A2:H2','06-Jul-2027 → 15-Sep-2027 = 71 days','Schedule comparison','Disputed version','Working-file author not stated','Conflicts with STR-104’s 76-day result','Must not silently replace the submitted case','§8','Reconcile 71 and 76 by native version','File identities, data date, settings','Both values disclosed; neither treated as interchangeable.'),
 ev('EV-005','Actual-duration case retaining logic','Event 2','STR-104 + comparison workbook','03 − 01','31 Aug 2026 / workbook undated','Actual durations, original 24 retained','STR-104 p4; workbook Sheet1 row3','43 days Ground Works / 37 days Project Finish','Schedule result','Partially verified','SAMCO','Calibrated counterfactual used for deduction bridge','Supports request for transparent assessment','§8','Reproduce and disclose native files','Full settings and path output','37-day Project Finish arithmetic verified.'),
 ev('EV-006','Engineer assessment','Event 2','Letter 050','BD-ACEPM-SAMCO-LET-050','19 Aug 2026','Engineer’s assessed model','determination + planning attachment','15 days Ground Works / 12 days Project Finish','Determination','Verified as stated; method disputed','Engineer / ACEPM','Controls current awarded milestones','Subject to amended Contract determination/dispute provisions','§8','Provide full calculation bridge','Native before/after and change log','Recording the result is not acceptance.'),
 ev('EV-007','Ground Works reduction','Event 2','Derived from EV-005 and EV-006','—','—','Comparison of stated results','43 − 15','28 calendar days','Arithmetic','Verified arithmetic / cause HOLD','Audit calculation','Defines unexplained deduction','Requires supporting particulars','§8','Explain activity by activity','Causal allocation','No entitlement inferred from subtraction alone.'),
 ev('EV-008','Project Finish reduction','Event 2','Derived from EV-005 and EV-006','—','—','Comparison of stated results','37 − 12','25 calendar days','Arithmetic','Verified arithmetic / cause HOLD','Audit calculation','Defines unexplained deduction','Requires supporting particulars','§8','Explain relationship by relationship','Causal allocation','No entitlement inferred from subtraction alone.'),
 ev('EV-009','Reported 37 versus 35 difference','Event 2','IFC sch movement.xlsx','03 − 01 vs 05 − 04','Not stated','Different before models','Sheet1 rows3–4','37 − 35 = 2 days, but before dates are 06-Jul and 22-Jun 2027','Cross-model arithmetic','HOLD — not an isolated effect','Working-file audit','Cannot quantify the 24 changes because bases differ','Unsafe for entitlement allegation','§11','Run matched native sensitivity','Identical base, settings and only 24 changes varied','Never describe this as “the removals caused only two days”.'),
 ev('EV-010','Actual approval dates','Event 2','IFC date-control workbook + Consultant reply sheets','STR-044/046/054/055 drawing packages','May–Jun 2026','Latest mapped revisions','8 P6 approval activities','ACEPM variances −12, −4, −84 and −31 days by package','Contemporaneous records','7 direct + 1 paired mapping','Consultant / document control','Inputs require reconciliation before rerun','Supports reliability challenge, not automatic EOT','§9','Issue actual-date provenance log','B04 STR-046 direct reply attribution','STR-055 drawing reply is not ACEPM Letter 055.'),
 ev('EV-011','Employer steel supply allocation','Event 1','Executed Overall Contract','Appendix to Tender Item 20 / 14.2','Executed Contract','Signed/overall contract','Contract p7','70% steel supplied by Employer according to approved Programme','Contract','Verified','Employer / Parties','Allocates free-issue steel supply','Primary contractual allocation','§4, §7','Apply to Batch No. 2 determination','Delivery-note reconciliation','Signed Contract controls over generic FIDIC wording.'),
 ev('EV-012','Engineer decision/dispute route','Both','Executed Overall Contract','Amended 20.2','Executed Contract','Particular Conditions','Contract p30','42-day decision; 28-day dissatisfaction period recorded in amendment','Contract','Verified','Parties','Sets procedural handling of disagreement','Preserves referral and notice rights','§16','Contracts team to confirm issue dates and serve any notice','Current procedural calendar','Legal/contract-manager sign-off required.'),
 ev('EV-013','Critical-path acceptance','Event 2','Letter 050','BD-ACEPM-SAMCO-LET-050','19 Aug 2026','Engineer determination','p4 / OCR lines 31–36','Revised IFC and clarification affected activities on the approved Programme’s critical path','Correspondence','Verified','Engineer / ACEPM','Accepts event causation and criticality in principle','Supports EOT determination subject to quantum','§10','Reconcile with later response','Native path report','Exact source checked.'),
 ev('EV-014','24 relationships pre-date fragnet','Event 2','Approved baseline and claim XER signature review','24-link register','Pre-event / claim dates','Approved baseline + 11 claim XERs','REL-01…REL-24','All 24 signatures present before Event 2 fragnet','Schedule provenance','Verified presence / effect HOLD','Schedule-file audit','Establishes they were not fragnet-created','Raises justification burden for retrospective change','§11–13','Disclose row-by-row change basis','Matched impact run','Presence does not prove every lag duration.'),
 ev('EV-015','Letter 053 23-point response coverage','Both','Letter 053','BD-ACEPM-SAMCO-LET-053','7 Sep 2026','Verified complete 3-page letter','points 1–23','Twenty-three substantive statements mapped to six families','Correspondence audit','Verified','Engineer / ACEPM','Separates accepted principles from unanswered application','Supports demand for particulars','§5–6','Answer POINTS53 register','Native/evidential particulars','Complete coverage, no selective omission.'),
 ev('EV-016','ACEPM Letter 055','Both','No complete verified document found','ACEPM Letter 055','Unknown','Unavailable','—','Excluded — not relied upon','Excluded evidence','Excluded — not relied upon','Unknown','No inference permitted','No contractual reliance permitted','§2, Action L','Confirm non-reliance or disclose complete verified copy','Complete authentic letter and attachments','Do not confuse with STR-055 Rev.2 drawing reply.'),
 ev('EV-017','Approximately 83 inspection records','Event 2','User-identified possible population','IR / inspection records','Various','Not inventoried','—','Exact count not verified','Potential contemporaneous evidence','Unverified','Project teams','May assist actual-progress dating','Cannot be alleged until inventoried','§9','Produce indexed IR register','Exact count, dates, linkage','The number 83 is not used as fact.'),
 ev('EV-018','Readwise source check','Both','Connected Readwise library search','—','13 Sep 2026','Current search','AACE/FIDIC/P6 topics','No case-specific project material returned','Research control','Checked — no reliance','Readwise account','No project fact added','No contractual effect','Register','Continue only if specific source is supplied','Case-specific saved materials','Generic Reader FAQ was excluded from substantive reliance.')
];

const REL_BASELINE_ROWS=new Set([6,7,8,9,14,15,18,24]);
const REL_EVIDENCE=REL.map(r=>{
 const [pred,succ]=r.sig.split(' → '); const lag=r.lag.replace(/^\w+\s*\+/,'');
 const support=REL_BASELINE_ROWS.has(r.no)?'ACEPM baseline comment supports purpose/method; exact lag not always prescribed':r.strength?'Engineering release control is plausible; exact duration requires structural/temporary-works evidence':'Pre-event signature verified; construction basis requires row evidence';
 return {no:'REL-'+String(r.no).padStart(2,'0'),pred,succ,rel:r.lag.split(' ')[0],lag,source:'Approved baseline / pre-event update; exact file ID to be disclosed',original:'Present before Event 2 fragnet',reason:r.chg+' under Letter 050 generalized soft/dummy-lag rationale',evidence:support,float:'HOLD — no matched single-variable run',e1:'HOLD',e2:'HOLD',finish:'HOLD',status:REL_BASELINE_ROWS.has(r.no)?'Partially verified':'Presence verified / effect HOLD'};
});

function statusHtml(status){const c=/excluded/i.test(status)?'status-excluded':/disputed/i.test(status)?'status-disputed':/verified/i.test(status)&&!/partial|hold/i.test(status)?'status-verified':'status-hold';return '<span class="'+c+'"><b>'+status+'</b></span>';}
function makeTable(headers,rows,min='1000px'){return tbl(headers.map(h=>({h})),rows,min);}

PANES.l_points=()=>{
 const f=document.createDocumentFragment();
 f.appendChild(el('h2','t','Letter 053 — complete 23-point register'));
 f.appendChild(el('p','lede','Every substantive point in the verified three-page letter is mapped below. Agreement with a general principle is separated from disagreement with its application.'));
 f.appendChild(makeTable(['Point','Family','Engineer position','Source locator','Status','SAMCO controlled answer'],POINTS53.map(x=>[x.n,x.f,x.p,x.loc,statusHtml(x.s),x.a]),'1180px'));
 return f;
};

PANES.l_questions=()=>{
 const f=document.createDocumentFragment();
 f.appendChild(el('h2','t','050 → 104 → 053 question-and-answer control'));
 f.appendChild(el('p','lede','A conclusion, repetition or recharacterization is not counted as an answer unless it resolves the underlying technical question.'));
 f.appendChild(makeTable(['ID','SAMCO question','Source / locator','Answer status','What the verified response does','Required final answer'],QUESTION_REGISTER.map(x=>[x[0],x[1],x[2],statusHtml(x[3]),x[4],x[5]]),'1200px'));
 f.appendChild(el('h3','s','Longest-path / critical-path contradiction matrix'));
 f.appendChild(makeTable(['Source','Date','Verified position','Meaning','Later position / record','Technical significance'],CONTRADICTIONS,'1280px'));
 return f;
};

PANES.l_draft=()=>{
 const f=document.createDocumentFragment();
 f.appendChild(el('h2','t','SAMCO formal response — controlled issue draft'));
 f.appendChild(el('div','control-banner hold','<b>Issue control:</b> technically complete draft for management, contracts and counsel review. Insert the issued letter date, final addressee/reference and verify the live contractual notice calendar before signature. No unsupported reliance on ACEPM Letter 055 is permitted.'));
 const wrap=el('div','letter-control');
 wrap.appendChild(el('div','letter-addressee','<b>To:</b> ACEPM / The Engineer<br><b>From:</b> SAMCO National Construction<br><b>Project:</b> The Big Business District · Phase 02 · Buildings B1–B4<br><b>Claim:</b> Extension of Time — Claim No. 1'));
 LETTER_SECTIONS.forEach(s=>{const d=el('section','letter-section');d.appendChild(el('h3',null,s[0]));d.appendChild(el('p',null,s[1]));wrap.appendChild(d);});
 f.appendChild(wrap);
 return f;
};

PANES.ask_controlled=()=>{
 const f=document.createDocumentFragment();
 f.appendChild(el('h2','t','Required actions A–L and acceptance gates'));
 f.appendChild(el('p','lede','Each demand is converted into a concrete record, owner and acceptance gate so a generic response cannot close it.'));
 const owners=['Engineer / Contracts','ACEPM Planning','ACEPM Planning','ACEPM Planning + SAMCO','ACEPM Planning','ACEPM Planning + Document Control','Engineer + Consultant','Engineer / Contracts','ACEPM Planning','Engineer / ACEPM','Engineer / ACEPM','Engineer / Contracts'];
 const gates=['Reasoned written determination and supported day value','Reproducible native calculations','All before/after files open and match stated results','Signed reconciliation table and native rerun','24-row cause/effect register','Actual-date provenance log','Reply/transmittal evidence linked to each P6 activity','Every Q-register row marked complete with particulars','Chronological quotation and path-output reconciliation','Frozen protocol document with file hash/version','Written change-control undertaking','Non-reliance confirmation or complete verified Letter 055'];
 f.appendChild(makeTable(['Action','Required output','Responsible party','Acceptance gate'],ACTIONS.map((x,i)=>[x[0],x[1],owners[i],gates[i]]),'1080px'));
 f.appendChild(el('h3','s','Frozen analytical protocol'));
 f.appendChild(el('p',null,'The protocol must state the official source programme, revision/date, data date, calendar, longest-path settings, retained logic, progress override, constraints, open ends, out-of-sequence treatment, every removed/modified/added relationship, every lag and actual-date change, all fragnet logic and all calculation settings. The basis remains frozen unless a demonstrated anomaly is identified and justified in writing with its isolated effect.'));
 return f;
};

PANES.evidence_register=()=>{
 const f=document.createDocumentFragment();
 f.appendChild(el('h2','t','Evidence and Verification Register'));
 f.appendChild(el('p','lede','Issue-control register for every material numerical, factual, contractual and analytical assertion used in the formal Letter 053 response. Status controls determine whether a statement is safe to issue, must be qualified, or is excluded.'));
 f.appendChild(el('div','control-banner','<b>Register control:</b> '+EVIDENCE.length+' principal assertions + '+REL_EVIDENCE.length+' relationship records. Letter 055 is expressly excluded. The 2-day 37/35 comparison is HOLD because the source pairs have different before dates.'));
 const toolbar=el('div','register-toolbar'); const q=document.createElement('input');q.type='search';q.placeholder='Filter evidence, source, status or action';q.setAttribute('aria-label','Filter evidence register');const count=el('span','register-count');toolbar.append(q,count);f.appendChild(toolbar);
 const wrap=el('div','evidence-register');
 const rows=EVIDENCE.map(x=>[x.no,x.issue,x.event,x.source,x.doc,x.date,x.version,x.locator,x.data,x.type,statusHtml(x.status),x.party,x.analysis,x.contract,x.section,x.action,x.outstanding,x.notes]);
 const table=makeTable(EVIDENCE_FIELDS,rows,'2900px');wrap.appendChild(table);f.appendChild(wrap);
 const update=()=>{const term=q.value.trim().toLowerCase();let shown=0;[...table.querySelectorAll('tbody tr')].forEach(tr=>{const on=!term||tr.textContent.toLowerCase().includes(term);tr.hidden=!on;if(on)shown++;});count.textContent=shown+' of '+EVIDENCE.length+' assertions shown';};q.addEventListener('input',update);update();
 f.appendChild(el('h3','s','Linked 24-relationship verification sub-register'));
 f.appendChild(el('p',null,'No float or milestone effect is attributed to an individual relationship without a matched native run. The new baseline-comment workbook supports eight relationship purposes or methods, but does not prove every exact lag duration.'));
 f.appendChild(makeTable(['Record','Predecessor ID','Successor ID','Type','Lag','Source programme','Original status','ACEPM change / stated reason','Supporting or contradicting evidence','Float / path effect','Event 1 effect','Event 2 effect','Project Finish effect','Verification status'],REL_EVIDENCE.map(x=>[x.no,x.pred,x.succ,x.rel,x.lag,x.source,x.original,x.reason,x.evidence,x.float,x.e1,x.e2,x.finish,statusHtml(x.status)]),'2450px'));
 return f;
};

PANES.contractual_protection=()=>{
 const f=document.createDocumentFragment();
 f.appendChild(el('h2','t','SAMCO Contractual Protection'));
 f.appendChild(el('p','lede','A consolidated defensive record protecting Delay Event Nos. 1 and 2, all existing and future entitlements, and SAMCO’s right to challenge unsupported dates, logic changes, methodology and quantum.'));
 f.appendChild(el('div','control-banner hold','<b>Issue status — protected draft:</b> this layer is evidence-controlled and rights-reserving. It is not an admission, settlement, waiver or acceptance of any Engineer figure. Final issue date, addressee, notice route and live contractual deadlines require Contracts and legal review before signature.'));
 const guard=el('div','protection-guard');
 [
  ['No acceptance','Every numerical result is identified for reconciliation only.'],
  ['No waiver','Silence, mitigation, progress or discussion cannot surrender SAMCO’s rights.'],
  ['Frozen methodology','Any later model change requires prior identification, proof, version control and impact testing.'],
  ['Future rights preserved','Batch No. 3, cumulative effects, EOT, recoverable cost and formal dispute routes remain open.']
 ].forEach(x=>{const d=el('article','protection-card');d.append(el('h3',null,x[0]),el('p',null,x[1]));guard.appendChild(d);});
 f.appendChild(guard);
 f.appendChild(el('h3','s','Numerical non-acceptance and verification control'));
 f.appendChild(el('p',null,'The figures below are preserved without adoption. Their status controls what SAMCO may safely say and prevents a cited result from being mischaracterized later as an agreed quantum or analytical ceiling.'));
 f.appendChild(makeTable(['Figure','Issue / analytical case','Evidence control','Verification status','Protected SAMCO position'],FIGURE_CONTROL.map(x=>[x[0],x[1],x[2],statusHtml(x[3]),x[4]]),'1300px'));
 f.appendChild(el('h3','s','Rights-reserving defensive letter'));
 const wrap=el('div','letter-control protection-letter');
 wrap.appendChild(el('div','letter-addressee','<b>To:</b> ACEPM / The Engineer<br><b>From:</b> SAMCO National Construction<br><b>Project:</b> The Big Business District · Phase 02 · Buildings B1–B4<br><b>Subject:</b> Delay Event Nos. 1 and 2 — consolidated protection of entitlement, demand for auditable determination and reservation of all rights'));
 PROTECTION_SECTIONS.forEach(s=>{const d=el('section','letter-section');d.appendChild(el('h3',null,s[0]));d.appendChild(el('p',null,s[1]));wrap.appendChild(d);});
 f.appendChild(wrap);
 f.appendChild(el('h3','s','Unanswered issues preserved against deemed acceptance'));
 f.appendChild(makeTable(['ID','Outstanding question','Source / locator','Current answer status','Why it remains open','Required closure record'],QUESTION_REGISTER.map(x=>[x[0],x[1],x[2],statusHtml(x[3]),x[4],x[5]]),'1280px'));
 f.appendChild(el('h3','s','Mandatory outputs and closure gates'));
 f.appendChild(makeTable(['Action','Required Engineer / ACEPM output','Protection effect'],ACTIONS.map(x=>[x[0],x[1],x[0]==='A'?'No deferral of completed Batch No. 2':x[0]==='J'||x[0]==='K'?'Prevents undisclosed future methodology changes':'Issue remains open until the disclosed record is complete']),'1150px'));
 f.appendChild(el('div','control-banner','<b>Evidence linkage:</b> every protected position above is controlled by EV-001…EV-018 and REL-01…REL-24 in the Evidence and Verification Register. ACEPM Letter 055 remains “Excluded — not relied upon” unless a complete verified copy is disclosed.'));
 return f;
};

function appendSubtab(sectionIndex,label,paneKey){
 const sec=hostEl.children[sectionIndex]; let sb=sec.querySelector('.subbar'); let panes;
 if(!sb){
  const existing=sec.querySelector('.pane'); sb=el('div','subbar');sb.setAttribute('role','tablist');panes=el('div');
  const first=el('button','sb');first.type='button';first.setAttribute('role','tab');first.setAttribute('aria-selected','true');first.textContent=SECTIONS[sectionIndex].subs[0][0];
  sec.innerHTML='';panes.appendChild(existing);sb.appendChild(first);sec.append(sb,panes);
  first.addEventListener('click',()=>{[...sb.children].forEach(x=>x.setAttribute('aria-selected',x===first?'true':'false'));[...panes.children].forEach(x=>x.hidden=x!==existing);});
 }else panes=sb.nextElementSibling;
 const button=el('button','sb');button.type='button';button.setAttribute('role','tab');button.setAttribute('aria-selected','false');button.textContent=label;
 const pane=el('div','pane');pane.hidden=true;pane.appendChild(PANES[paneKey]());panes.appendChild(pane);sb.appendChild(button);
 button.addEventListener('click',()=>{[...sb.children].forEach(x=>x.setAttribute('aria-selected',x===button?'true':'false'));[...panes.children].forEach(x=>x.hidden=x!==pane);pane.style.animation='none';void pane.offsetWidth;pane.style.animation='';window.scrollTo({top:tabbar.offsetTop-2,behavior:'smooth'});});
}
appendSubtab(6,'23-point register','l_points');
appendSubtab(6,'Question register','l_questions');
appendSubtab(6,'Formal response','l_draft');
appendSubtab(7,'Actions A–L','ask_controlled');

const protectionTab=el('button','tb');protectionTab.type='button';protectionTab.setAttribute('role','tab');protectionTab.setAttribute('aria-selected','false');protectionTab.textContent='SAMCO Contractual Protection';
const protectionSec=el('section','sec contractual-protection-sec');protectionSec.hidden=true;const protectionPane=el('div','pane');protectionPane.appendChild(PANES.contractual_protection());protectionSec.appendChild(protectionPane);const protectionIndex=hostEl.children.length;tabbar.appendChild(protectionTab);hostEl.appendChild(protectionSec);
protectionTab.addEventListener('click',()=>pick(protectionIndex));

const evidenceTab=el('button','tb');evidenceTab.type='button';evidenceTab.setAttribute('role','tab');evidenceTab.setAttribute('aria-selected','false');evidenceTab.textContent='Evidence and Verification Register';
const evidenceSec=el('section','sec');evidenceSec.hidden=true;const evidencePane=el('div','pane');evidencePane.appendChild(PANES.evidence_register());evidenceSec.appendChild(evidencePane);const evidenceIndex=hostEl.children.length;tabbar.appendChild(evidenceTab);hostEl.appendChild(evidenceSec);
evidenceTab.addEventListener('click',()=>pick(evidenceIndex));

const primaveraTab=el('button','tb');primaveraTab.type='button';primaveraTab.setAttribute('role','tab');primaveraTab.setAttribute('aria-selected','false');primaveraTab.textContent='Primavera Analyzer';
const primaveraSec=el('section','sec primavera-analyzer-sec');primaveraSec.hidden=true;
 const primaveraFrame=document.createElement('iframe');primaveraFrame.className='primavera-analyzer-frame';primaveraFrame.src='primavera-xer-analyzer.html';primaveraFrame.title='Primavera Analyzer — embedded and imported XER comparison';primaveraFrame.loading='lazy';primaveraFrame.scrolling='no';
 const fitPrimavera=()=>{try{const doc=primaveraFrame.contentDocument;if(!doc)return;const height=Math.max(760,doc.documentElement.scrollHeight,doc.body?.scrollHeight||0);primaveraFrame.style.height=height+'px';}catch(_){}};
 primaveraFrame.addEventListener('load',()=>{fitPrimavera();try{const doc=primaveraFrame.contentDocument;if(doc&&window.ResizeObserver){const observer=new ResizeObserver(fitPrimavera);observer.observe(doc.documentElement);if(doc.body)observer.observe(doc.body);primaveraFrame._fitObserver=observer;}}catch(_){}setTimeout(fitPrimavera,500);setTimeout(fitPrimavera,1800);});
const primaveraIndex=hostEl.children.length;primaveraSec.appendChild(primaveraFrame);tabbar.appendChild(primaveraTab);hostEl.appendChild(primaveraSec);
primaveraTab.addEventListener('click',()=>pick(primaveraIndex));

Object.assign(window,{LETTER53_POINTS:POINTS53,LETTER53_QUESTIONS:QUESTION_REGISTER,LETTER53_ACTIONS:ACTIONS,LETTER53_EVIDENCE:EVIDENCE,LETTER53_REL_EVIDENCE:REL_EVIDENCE,LETTER53_SECTIONS:LETTER_SECTIONS,SAMCO_FIGURE_CONTROL:FIGURE_CONTROL,SAMCO_PROTECTION_SECTIONS:PROTECTION_SECTIONS});
})();
