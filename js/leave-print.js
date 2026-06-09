/* LEAVE_PRINT_SPLIT_V5_4_0
   Click-time leave application and staff clearance print templates.
   Loaded after the main EMS script so older inline print functions remain as a startup-safe fallback. */

/* === LEAVE_A4_SIGNATURE_PRINT_V6 === */
function leavePrintCssV6(){
  return '<style>'+
    '@page{size:A4;margin:6mm}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:0;background:#fff;font-size:10px;line-height:1.2}'+
    '.sheet{width:198mm;min-height:285mm;margin:0 auto;border:2px solid #111;padding:5mm;background:#fff;overflow:hidden}.top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:3mm}.doc-logo{width:82px;height:auto;object-fit:contain}.ref{text-align:right;font-size:9px;line-height:1.35}.title{border:2px solid #111;text-align:center;font-weight:900;font-size:17px;padding:3px 0;margin:2mm 0 3mm;text-transform:uppercase}.section{border:2px solid #111;margin-bottom:2.2mm;page-break-inside:avoid}.section-title{text-align:center;font-weight:900;text-decoration:underline;border-bottom:2px solid #111;padding:2px;text-transform:uppercase}.row{display:grid;grid-template-columns:1fr 1fr;gap:0}.cell{padding:3px 5px;border-bottom:1px solid #111;min-height:20px}.row .cell:nth-child(odd){border-right:1px solid #111}.cell.full{grid-column:1/-1;border-right:0}.line{display:inline-block;border-bottom:1px solid #111;min-width:105px;padding:0 3px;min-height:13px}.wide{min-width:320px}.check-wrap{display:flex;flex-wrap:wrap;gap:5px 9px;padding:5px}.check-row{display:inline-flex;align-items:center;gap:4px;white-space:nowrap}.box{display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;border:1.5px solid #111;font-size:11px;font-weight:900;line-height:1}.approval-grid{display:grid;grid-template-columns:1fr 1fr;border-top:0}.approval{min-height:54px;border-right:2px solid #111;padding:5px}.approval:last-child{border-right:0}.approval .sig{margin-top:3px}.sig-img{max-height:24px;max-width:115px;display:block;margin:1px 0}.sig-text{display:inline-block;border-bottom:1px solid #111;min-width:115px;min-height:14px;font-weight:700}.tiny-sig .sig-img{max-height:13px;max-width:80px}.tiny-sig .sig-text{min-width:70px;font-size:8px;min-height:11px}.small{font-size:8.2px;line-height:1.22}.policy{border:2px solid #111;padding:4px 6px;margin-top:2mm;page-break-inside:avoid}.signature-line{margin-top:6px;text-align:right}.clear-sheet{padding:4mm}.clear-title{font-size:24px;color:#666;margin:0 0 3mm}.clear-table{width:100%;border-collapse:collapse;font-size:7.8px;line-height:1.08}.clear-table th,.clear-table td{border:1px solid #333;padding:2px 3px;vertical-align:middle;height:17px}.clear-table th{font-size:7.3px;text-transform:uppercase;text-align:center}.clear-table.compact td{height:15px}.muted{color:#777}.site-sign-box{display:flex;justify-content:flex-end;gap:8px;align-items:center;font-size:8px;margin:2mm 0}.sign-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;text-align:center;margin-top:16mm;font-size:8px}.print-actions{display:none}@media print{html,body{width:210mm;height:297mm}.print-actions{display:none}.sheet{break-inside:avoid;page-break-inside:avoid}}'+
  '</style>';
}

function leaveFindHistorySignatureV6(row, actions){
  const list = Array.isArray(actions) ? actions : [actions];
  const h = ((row && row.history) || []).slice().reverse().find(x => list.includes(x.action) && x.signature);
  return h ? h.signature : "";
}

function leavePrintSignatureHtmlV6(signature, fallback, extraClass){
  const sig = String(signature || "").trim();
  const fb = String(fallback || "").trim();
  if(sig && /^data:image\//i.test(sig)){
    return '<span class="'+(extraClass||'')+'"><img class="sig-img" src="'+sig.replace(/"/g,"&quot;")+'" alt="signature"></span>';
  }
  return '<span class="'+(extraClass||'')+'"><span class="sig-text">'+v1Safe(sig || fb || "")+'</span></span>';
}

function leaveApprovalBoxV6(label, checked){
  return '<span class="check-row"><span class="box">'+(checked ? '&#10003;' : '')+'</span>'+v1Safe(label)+'</span>';
}

function leaveRequestByIdV6(id){
  return (LEAVE_REQUESTS||[]).find(x => String(x.id) === String(id)) || (typeof leaveRequests !== "undefined" ? (leaveRequests||[]).find(x => String(x.id) === String(id)) : null);
}

function leaveClearanceByIdOrRequestV6(id){
  return (LEAVE_CLEARANCES||[]).find(x => String(x.id) === String(id)) || (LEAVE_CLEARANCES||[]).find(x => String(x.requestId) === String(id)) || null;
}

function printLeaveApplication(id){
  const r = leaveRequestByIdV6(id);
  if(!r){ alert("Leave request not found."); return; }
  const emp = employeeById(r.empId) || {};
  const leaveType = r.leaveType || "";
  const adminRejected = /refused|rejected/i.test(String(r.adminStatus||r.status||""));
  const adminApproved = !adminRejected && (r.adminStatus === "approved" || r.status === "admin_approved" || r.status === "management_approved" || r.status === "completed");
  const mgmtRejected = /refused|rejected/i.test(String(r.managementStatus||r.status||""));
  const mgmtApproved = !mgmtRejected && (r.managementStatus === "approved" || r.status === "management_approved" || r.status === "completed");
  const adminSig = leaveFindHistorySignatureV6(r, ["admin_approved","admin_rejected"]) || (adminApproved ? (r.adminBy || r.createdBy || "") : "");
  const mgmtSig = leaveFindHistorySignatureV6(r, ["management_approved","management_rejected"]) || (mgmtApproved || mgmtRejected ? (r.managementBy || "") : "");
  const generated = new Date().toLocaleString();
  const html = '<!doctype html><html><head><meta charset="utf-8"><title>Leave Application '+v1Safe(r.token||"")+'</title>'+leavePrintCssV6()+'</head><body><div class="sheet">'+
    '<div class="top">'+leaveLogoImgV4("doc-logo")+'<div class="ref"><b>REF: HR/TCA-SOPF11 Rev.03</b><br>Date: '+v1Safe(fmt(todayStr()))+'<br>Generated: '+v1Safe(generated)+'</div></div>'+
    '<div class="title">Leave Application Form</div>'+
    '<div class="section"><div class="cell full"><b>EMPLOYEE NAME:</b> <span class="line wide">'+v1Safe(r.empName||emp.name||"")+'</span></div><div class="cell full"><b>EMPLOYEE CODE:</b> <span class="line wide">'+v1Safe(r.empCode||emp.empId||"")+'</span></div><div class="cell full"><b>POSITION:</b> <span class="line wide">'+v1Safe(r.designation||emp.designation||emp.role||"")+'</span></div><div class="cell full"><b>DEPARTMENT:</b> <span class="line wide">'+v1Safe(r.department||emp.department||emp.dept||"")+'</span></div></div>'+
    '<div class="section"><div class="section-title">Leave Details (To Be Filled By The Employee)</div>'+
      '<div class="check-wrap">'+
        leaveApprovalBoxV6("ANNUAL", /annual/i.test(leaveType))+leaveApprovalBoxV6("SICK", /sick/i.test(leaveType))+leaveApprovalBoxV6("EMERGENCY", /emergency/i.test(leaveType))+leaveApprovalBoxV6("PILGRIMAGE (HAJJ/UMRAH)", /pilgrim|hajj|umrah/i.test(leaveType))+leaveApprovalBoxV6("BUSINESS/TRAINING", /business|training/i.test(leaveType))+leaveApprovalBoxV6("OTHERS", !/annual|sick|emergency|pilgrim|hajj|umrah|business|training/i.test(leaveType))+
      '</div>'+
      '<div class="row"><div class="cell"><b>LEAVE START DATE:</b> <span class="line">'+v1Safe(fmt(r.startDate||""))+'</span></div><div class="cell"><b>LEAVE END DATE:</b> <span class="line">'+v1Safe(fmt(r.endDate||""))+'</span></div><div class="cell"><b>TOTAL DAYS:</b> <span class="line">'+v1Safe(r.totalDays||"")+'</span></div><div class="cell"><b>DEPARTURE DATE:</b> <span class="line">'+v1Safe(fmt(r.departureDate||""))+'</span></div><div class="cell full"><b>SPECIFY REASON IF EMERGENCY:</b> <span class="line wide">'+v1Safe(r.reason||"")+'</span></div><div class="cell"><b>TIME:</b> <span class="line">'+v1Safe(r.departureTime||"")+'</span></div><div class="cell"><b>AM/PM:</b> <span class="line">'+v1Safe(r.departurePeriod||"")+'</span></div><div class="cell"><b>CONTACTABLE NUMBER DURING LEAVE:</b> <span class="line">'+v1Safe(r.contactNo||emp.mobile||"")+'</span></div><div class="cell"><b>EMAIL ID:</b> <span class="line">'+v1Safe(r.email||emp.email||"")+'</span></div><div class="cell"><b>EMPLOYEE SIGNATURE:</b> <span class="line">'+v1Safe(r.employeeSignature||r.empName||"")+'</span></div><div class="cell"><b>DATE:</b> <span class="line">'+v1Safe(fmt(todayStr()))+'</span></div></div>'+
    '</div>'+
    '<div class="section"><div class="section-title">To Be Filled By The Reporting Line</div><div class="approval-grid">'+
      '<div class="approval"><b>Direct Supervisor:</b> '+leaveApprovalBoxV6("Approved", adminApproved)+' '+leaveApprovalBoxV6("Refused", adminRejected)+'<br><b>Comments:</b> <span class="line">'+v1Safe(r.adminNote||"")+'</span><div class="sig"><b>Signature:</b><br>'+leavePrintSignatureHtmlV6(adminSig, r.adminBy || r.createdBy || "", "")+'<br><span class="muted">'+v1Safe(r.adminBy || r.createdBy || "")+'</span></div></div>'+
      '<div class="approval"><b>HOD/OM:</b> '+leaveApprovalBoxV6("Approved", mgmtApproved)+' '+leaveApprovalBoxV6("Refused", mgmtRejected)+'<br><b>Comments:</b> <span class="line">'+v1Safe(r.managementNote||"")+'</span><div class="sig"><b>Signature:</b><br>'+leavePrintSignatureHtmlV6(mgmtSig, r.managementBy || "", "")+'<br><span class="muted">'+v1Safe(r.managementBy || "")+'</span></div></div>'+
    '</div></div>'+
    '<div class="section"><div class="section-title">For HR Use Only</div><div class="row"><div class="cell"><b>Employee Joining Date:</b> <span class="line">'+v1Safe(fmt(emp.joiningDate||""))+'</span></div><div class="cell"><b>Date of Return from Last Vacation:</b> <span class="line">'+v1Safe(fmt(r.lastVacationReturn||""))+'</span></div><div class="cell"><b>QID Expiry Date:</b> <span class="line">'+v1Safe(fmt(emp.qidExpiry||""))+'</span></div><div class="cell"><b>Passport Expiry Date:</b> <span class="line">'+v1Safe(fmt(emp.passportExpiry||""))+'</span></div><div class="cell"><b>No. of Leave Credits:</b> <span class="line">'+v1Safe(r.leaveCredits||"")+'</span> days</div><div class="cell"><b>Leave Entitled:</b> '+leaveApprovalBoxV6("Paid", /paid/i.test(r.leaveEntitled||""))+' '+leaveApprovalBoxV6("Unpaid", /unpaid/i.test(r.leaveEntitled||""))+'</div><div class="cell"><b>No. of Ticket Credits:</b> <span class="line">'+v1Safe(r.ticketCredits||"")+'</span></div><div class="cell"><b>Ticket Eligibility:</b> '+leaveApprovalBoxV6("Paid", /paid/i.test(r.ticketEligibility||""))+' '+leaveApprovalBoxV6("Unpaid", /unpaid/i.test(r.ticketEligibility||""))+'</div><div class="cell"><b>Validated by:</b> <span class="line">'+v1Safe(r.timekeeperBy||"")+'</span></div><div class="cell"><b>EXIT PERMIT REQUIRED:</b> '+leaveApprovalBoxV6("YES", r.exitPermit==="yes")+' '+leaveApprovalBoxV6("NO", r.exitPermit==="no")+'</div></div>'+
      '<div class="approval-grid" style="grid-template-columns:repeat(3,1fr);border-top:2px solid #111"><div class="approval"><b>HRD APPROVAL:</b><br>COMMENTS: <span class="line"></span><br>SIGNATURE: <span class="line"></span></div><div class="approval"><b>GM APPROVAL:</b><br>COMMENTS: <span class="line"></span><br>SIGNATURE: <span class="line"></span></div><div class="approval"><b>ED/MD APPROVAL:</b><br>COMMENTS: <span class="line"></span><br>SIGNATURE: <span class="line"></span></div></div>'+
    '</div>'+
    '<div class="policy small"><b><u>Read the Below Points & Agreed By the Employee To Abide By The Company Policies & Procedures Related to Leave & Reporting:</u></b><br>'+
    '(a) I am aware that my leave will be approved on the basis of my eligibility only as mentioned in my offer letter. (b) Leave extension will be granted only on emergencies supported by approval of the HOD, HR & the Management. (c) The Company has the right to take appropriate action against me including termination of my employment without any notice/EOS if I have not reported back to duty on-time as per my leave approval. (d) I declare hereby that I am liable to bear all expenses arising for the Company to fulfill job requirements in my absence during my unauthorized leave period. (e) Return ticket eligibility if any will be lapsed on extension of leave without prior approval as above said. (f) The Company will not book return ticket & quarantine stay if any during my return. (g) Rejoining has to be done before 10:00 AM to consider joining on the same day. Until official reporting to HR, joining will not be considered in the system.'+
    '<div class="signature-line">______________________________<br>Employee Signature</div></div>'+
    '</div><script>window.print();<\/script></body></html>';
  const w = window.open("", "_blank");
  if(!w){ alert("Please allow popup to print leave application."); return; }
  w.document.write(html); w.document.close();
}

function printClearanceCertificate(id){
  const c = leaveClearanceByIdOrRequestV6(id);
  const r = c ? leaveRequestByIdV6(c.requestId) : leaveRequestByIdV6(id);
  if(!r && !c){ alert("Clearance record not found."); return; }
  const emp = employeeById((r&&r.empId)||(c&&c.empId)) || {};
  const sourceRows = (c && c.checklist && c.checklist.length ? c.checklist : clearanceDefaultChecklistV1());
  const rows = sourceRows.map(x => '<tr><td>'+v1Safe(x.name||x)+'</td><td style="text-align:center">'+v1Safe((x.state||"").toUpperCase())+'</td><td style="text-align:center">'+(String(x.settled||"").toLowerCase()==="yes"?"&#10003;":"")+'</td><td style="text-align:center">'+(String(x.settled||"").toLowerCase()==="no"?"&#10003;":"")+'</td><td class="tiny-sig">'+leavePrintSignatureHtmlV6(x.signature||"", x.signature||"", "tiny-sig")+'</td><td>'+v1Safe(x.date||"")+'</td><td>'+v1Safe(x.remarks||"")+'</td></tr>').join("");
  const siteSig = (c && (c.siteSignature || c.siteSubmittedBy)) || "";
  const mgmtSig = (c && (c.managementSignature || c.managementBy)) || "";
  const timeSig = (c && (c.timekeeperSignature || c.timekeeperBy)) || "";
  const html = '<!doctype html><html><head><meta charset="utf-8"><title>Staff Clearance '+v1Safe((c&&c.token)||(r&&r.token)||"")+'</title>'+leavePrintCssV6()+'</head><body><div class="sheet clear-sheet">'+
    '<div class="top"><h1 class="clear-title">STAFF CLEARANCE CERTIFICATE</h1>'+leaveLogoImgV4("doc-logo")+'</div>'+
    '<table class="clear-table compact"><tr><td><b>Name:</b> '+v1Safe((r&&r.empName)||(c&&c.empName)||emp.name||"")+'</td><td><b>Designation:</b> '+v1Safe((r&&r.designation)||(c&&c.designation)||emp.designation||emp.role||"")+'</td><td><b>Div:</b> '+v1Safe((r&&r.site)||(c&&c.site)||employeeCurrentSite(emp)||"")+'</td></tr><tr><td><b>QID No:</b> '+v1Safe(emp.qid||"")+'</td><td><b>Travel Date:</b> '+v1Safe(fmt((c&&c.travelDate)||(r&&r.departureDate)||(r&&r.startDate)||""))+'</td><td><b>Travel Time:</b> '+v1Safe((c&&c.travelTime)||(r&&r.departureTime)||"")+'</td></tr></table>'+
    '<table class="clear-table compact" style="margin-top:2mm"><tr><th colspan="5">Reason for Travel (Please tick)</th></tr><tr><td>Annual Leave<br>'+leaveApprovalBoxV6("", /annual/i.test((r&&r.leaveType)||(c&&c.reason)||""))+'</td><td>Emergency Leave<br>'+leaveApprovalBoxV6("", /emergency/i.test((r&&r.leaveType)||(c&&c.reason)||""))+'</td><td>Medical Leave<br>'+leaveApprovalBoxV6("", /medical|sick/i.test((r&&r.leaveType)||(c&&c.reason)||""))+'</td><td>Passport Renewal<br>'+leaveApprovalBoxV6("", /passport/i.test((r&&r.leaveType)||(c&&c.reason)||""))+'</td><td>Official Trip<br>'+leaveApprovalBoxV6("", /official|business/i.test((r&&r.leaveType)||(c&&c.reason)||""))+'</td></tr></table>'+
    '<table class="clear-table"><tr><th>Collectables</th><th>State<br>Yes/No</th><th colspan="2">Handed Over / Settled</th><th>Signature</th><th>Date</th><th>Taken Over By / Remarks</th></tr><tr><th></th><th></th><th>Yes</th><th>No</th><th></th><th></th><th></th></tr>'+rows+'</table>'+
    '<div class="site-sign-box"><b>Site Admin Handover:</b> <span>'+v1Safe((c&&c.siteSubmittedBy)||"")+'</span>'+leavePrintSignatureHtmlV6(siteSig, (c&&c.siteSubmittedBy)||"", "tiny-sig")+'<b>Management:</b> '+leavePrintSignatureHtmlV6(mgmtSig, (c&&c.managementBy)||"", "tiny-sig")+'<b>Time Keeper:</b> '+leavePrintSignatureHtmlV6(timeSig, (c&&c.timekeeperBy)||"", "tiny-sig")+'</div>'+
    '<table class="clear-table compact"><tr><th colspan="5">Office Articles Collected Back</th></tr><tr><td>VEHICLE KEYS<br>'+leaveApprovalBoxV6("", false)+'</td><td>OFFICE KEYS<br>'+leaveApprovalBoxV6("", false)+'</td><td>CABINET KEYS<br>'+leaveApprovalBoxV6("", false)+'</td><td>WAREHOUSE KEYS<br>'+leaveApprovalBoxV6("", false)+'</td><td>REMOTE DEVICES<br>'+leaveApprovalBoxV6("", false)+'</td></tr><tr><th colspan="5">Signatories</th></tr></table>'+
    '<div class="sign-grid"><div>EMPLOYEE</div><div>SUPERVISOR</div><div>FLEET INCHARGE</div><div>DIVISION HEAD</div><div>ACCOUNTS HEAD</div><div>HR-ADMIN MANAGER</div></div>'+
    '</div><script>window.print();<\/script></body></html>';
  const w = window.open("", "_blank");
  if(!w){ alert("Please allow popup to print staff clearance."); return; }
  w.document.write(html); w.document.close();
}
/* === END LEAVE_A4_SIGNATURE_PRINT_V6 === */

