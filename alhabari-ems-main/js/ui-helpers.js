/* UI_HELPERS_SPLIT_V5_3_9
   Shared UI cleanup, navigation, modal, toast, date, site, and lightweight employee helper functions.
   Loaded after permissions.js and before the main EMS script so existing globals stay available. */

/* === UI_MOJIBAKE_CLEAN_V2 === */
let uiMojibakeObserver = null;
let uiMojibakeCleaning = false;
function hasMojibakeText(value){
  return /[\u00f0\u0178\u00e2\u00c3\u00c2\u00ef]/.test(String(value == null ? "" : value));
}
function cleanMojibakeText(value){
  let s = String(value == null ? "" : value);
  return s
    .replace(/\u00f0\u0178[^\s<>&"'`]{0,10}/g, "")
    .replace(/\u00e2[^\s<>&"'`]{0,10}/g, "")
    .replace(/\u00c3[^\s<>&"'`]{0,10}/g, "")
    .replace(/\u00ef[^\s<>&"'`]{0,8}/g, "")
    .replace(/\u00c2/g, "")
    .replace(/[ ]{2,}/g, " ");
}
/* === UI_MOJIBAKE_PREINSERT_CLEAN_V1 === */
function cleanMojibakeHtml(value){
  let s = String(value == null ? "" : value);
  return s
    .replace(/\u00f0\u0178[^\s<>&"'`]{0,10}/g, "")
    .replace(/\u00e2[^\s<>&"'`]{0,10}/g, "")
    .replace(/\u00c3[^\s<>&"'`]{0,10}/g, "")
    .replace(/\u00ef[^\s<>&"'`]{0,8}/g, "")
    .replace(/\u00c2/g, "");
}
function installMojibakePreinsertCleaner(){
  try{
    if(typeof window === "undefined" || typeof Element === "undefined") return;
    if(window.__mojibakePreinsertCleanerInstalled) return;
    const desc = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
    if(!desc || !desc.set || !desc.get) return;
    Object.defineProperty(Element.prototype, "innerHTML", {
      configurable: true,
      enumerable: desc.enumerable,
      get(){ return desc.get.call(this); },
      set(value){
        const text = String(value == null ? "" : value);
        desc.set.call(this, hasMojibakeText(text) ? cleanMojibakeHtml(text) : value);
      }
    });
    window.__mojibakePreinsertCleanerInstalled = true;
  }catch(e){ console.warn("UI pre-insert cleanup skipped:", e.message || e); }
}
installMojibakePreinsertCleaner();
/* === END UI_MOJIBAKE_PREINSERT_CLEAN_V1 === */
function sanitizeUiAttributes(root){
  root = root || document.body;
  if(!root || !root.querySelectorAll) return;
  const attrs = ["title","placeholder","aria-label","value"];
  root.querySelectorAll("*").forEach(el => {
    attrs.forEach(attr => {
      if(!el.hasAttribute || !el.hasAttribute(attr)) return;
      const oldVal = el.getAttribute(attr);
      if(hasMojibakeText(oldVal)) el.setAttribute(attr, cleanMojibakeText(oldVal).trim());
    });
  });
}
function sanitizeVisibleText(root){
  try{
    root = root || document.body;
    if(!root) return;
    uiMojibakeCleaning = true;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node){
        const p = node.parentElement;
        if(!p || ["SCRIPT","STYLE","TEXTAREA","INPUT","CODE","PRE"].includes(p.tagName)) return NodeFilter.FILTER_REJECT;
        return hasMojibakeText(node.nodeValue || "") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    const nodes = [];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
      const cleaned = cleanMojibakeText(n.nodeValue);
      if(cleaned !== n.nodeValue) n.nodeValue = cleaned;
    });
    sanitizeUiAttributes(root);
    if(document.title && hasMojibakeText(document.title)) document.title = cleanMojibakeText(document.title).trim();
  }catch(e){ console.warn("UI text cleanup skipped:", e.message || e); }
  finally{ uiMojibakeCleaning = false; }
}
function scheduleUiTextSanitize(){
  setTimeout(() => sanitizeVisibleText(document.body), 0);
  setTimeout(() => sanitizeVisibleText(document.body), 180);
}
function startUiMojibakeObserver(){
  if(typeof MutationObserver === "undefined" || uiMojibakeObserver || !document.body) return;
  uiMojibakeObserver = new MutationObserver((mutations) => {
    if(uiMojibakeCleaning) return;
    const needsClean = mutations.some(m => {
      if(m.type === "characterData") return hasMojibakeText(m.target && m.target.nodeValue);
      if(m.type === "attributes") return hasMojibakeText(m.target && m.target.getAttribute && m.target.getAttribute(m.attributeName));
      return Array.from(m.addedNodes || []).some(n => hasMojibakeText(n.textContent || ""));
    });
    if(needsClean) scheduleUiTextSanitize();
  });
  uiMojibakeObserver.observe(document.body, {subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:["title","placeholder","aria-label","value"]});
}
if(typeof document !== "undefined") document.addEventListener("DOMContentLoaded", () => {
  scheduleUiTextSanitize();
  startUiMojibakeObserver();
});
/* === END UI_MOJIBAKE_CLEAN_V2 === */
/* STRICT_USER_PERMISSIONS_V5_3_8
   Role presets are assignment templates only. Once a user has a saved perms array,
   module access must come only from that array so admins can remove individual modules. */
function hasPerm(p){
  if(!session) return false;
  if(Array.isArray(session.perms)) return session.perms.includes(p);
  const preset = ROLE_PRESETS[session.role];
  return !!(preset && (preset.perms||[]).includes(p));
}
function ini(n){return(n||"").split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();}
function avCls(i){return`av${i%5}`;}
function siteKey(s){
  return String(s || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s*-\s*/g, "-")
    .toUpperCase();
}
function canonicalSiteName(site){
  const raw = String(site || "").trim();
  if(!raw) return "";
  const key = siteKey(raw);
  const exact = (SITES || []).find(s => siteKey(s.name) === key);
  if(exact) return exact.name;
  const epd = key.match(/\bEPD-?(\d{2,3})\b/);
  if(epd){
    const code = "EPD-" + epd[1];
    const match = (SITES || []).find(s => siteKey(s.name) === code);
    return match ? match.name : code;
  }
  if(key === "EPD-COMMON" || key.includes("EPD-COMMON")){
    const common = (SITES || []).find(s => siteKey(s.name) === "EPD-COMMON");
    return common ? common.name : "EPD-COMMON";
  }
  return raw.replace(/\s*-\s*/g, "-");
}
function siteMatches(a,b){
  if(!b) return true;
  return siteKey(canonicalSiteName(a)) === siteKey(canonicalSiteName(b));
}
function siteColor(s){const key=siteKey(canonicalSiteName(s));const f=SITES.find(x=>siteKey(x.name)===key);return f?f.color:"#888";}
let EMP_LATEST_TS_CACHE=null;
let EMP_SEARCH_CACHE=null;

function invalidateEmployeeListCaches(){
  EMP_LATEST_TS_CACHE=null;
  EMP_SEARCH_CACHE=null;
}
function timesheetLatestSortKey(t){
  return `${t && t.date || ""} ${t && (t.editedAt || t.createdAt || t.sourceSyncedAt) || ""}`;
}
function cacheLatestTimesheet(map, key, t){
  if(!key || !t || !t.date) return;
  const old=map.get(key);
  if(!old || timesheetLatestSortKey(t).localeCompare(timesheetLatestSortKey(old))>0) map.set(key,t);
}
function buildLatestTimesheetCache(){
  const map=new Map();
  (TIMESHEETS||[]).forEach(t=>{
    if(!t || !t.date) return;
    if(t.empId!==undefined && t.empId!==null && t.empId!=="") cacheLatestTimesheet(map,`id:${t.empId}`,t);
    const code=String(t.empCode||t.employee_id||"").trim().toLowerCase();
    if(code) cacheLatestTimesheet(map,`code:${code}`,t);
  });
  EMP_LATEST_TS_CACHE=map;
  return map;
}
function latestTimesheetForEmployee(emp){
  if(!emp) return null;
  const map=EMP_LATEST_TS_CACHE||buildLatestTimesheetCache();
  const byId=map.get(`id:${emp.id}`);
  if(byId) return byId;
  const empCode=String(emp.empId||emp.empCode||"").trim().toLowerCase();
  return empCode ? (map.get(`code:${empCode}`)||null) : null;
}
function employeeCurrentSite(emp){
  const t = latestTimesheetForEmployee(emp);
  return canonicalSiteName((t && t.site) || (emp && (emp.currentSite || emp.site)) || "");
}
function refreshEmployeeCurrentSitesFromTimesheets(){
  (EMPLOYEES || []).forEach(emp => {
    const t = latestTimesheetForEmployee(emp);
    if(t && t.site){
      emp.currentSite = canonicalSiteName(t.site);
      emp.currentSiteDate = t.date || "";
    } else {
      emp.currentSite = emp.site || "";
      emp.currentSiteDate = "";
    }
  });
}
if(typeof window !== "undefined" && !window._empSiteRefreshTimer){
  window._empSiteRefreshTimer = setInterval(refreshEmployeeCurrentSitesFromTimesheets, 30 * 60 * 1000);
}

// â”€â”€ Smart Date Input helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Renders a date picker PLUS a text shorthand input for fast typing.
// Text accepts: "DDMM" (current year), "DDMMYY", "DD/MM/YY", "DD/MM/YYYY"
// The two inputs stay in sync. Use dateInputVal(id) to read the ISO value.
function dateInput(id, value, opts){
  opts = opts || {};
  const style = opts.style || "";
  const req   = opts.required ? "required" : "";
  const label = opts.label || "";
  const display = value ? fmt(value) : "";          // DD/MM/YYYY display
  return `<div class="smart-date-wrap" style="display:flex;gap:4px;align-items:center;${style}">
    <input type="date" id="${id}" value="${value||""}" ${req}
      onchange="document.getElementById('${id}-txt').value=_isoToShort(this.value)"
      style="flex:1;min-width:0;padding:6px 8px;font-size:13px;border:1px solid var(--border);border-radius:var(--radius)">
    <input type="text" id="${id}-txt" value="${display?display:""}" placeholder="DD/MM/YY"
      maxlength="10" autocomplete="off"
      oninput="_parseShortDate(this,'${id}')"
      style="width:82px;padding:6px 6px;font-size:12px;border:1px solid var(--border);border-radius:var(--radius);text-align:center;color:var(--brand);font-weight:600"
      title="Type: DD, DDMM, DDMMYY, DD/MM/YY">
  </div>`;
}
function _isoToShort(iso){
  if(!iso) return "";
  const [y,m,d] = iso.split("-");
  return `${d}/${m}/${y.slice(2)}`;
}
function _parseShortDate(el, targetId){
  const raw = el.value.replace(/[^0-9\/]/g,"");
  const picker = document.getElementById(targetId);
  if(!picker) return;
  let iso = "";
  const cyear = new Date().getFullYear();
  const digits = raw.replace(/\//g,"");
  if(digits.length === 2){ // DD &#8594; current month/year
    const d=digits, m=String(new Date().getMonth()+1).padStart(2,"0"), y=cyear;
    iso=`${y}-${m}-${d}`;
  } else if(digits.length === 4){ // DDMM &#8594; current year
    const d=digits.slice(0,2),m=digits.slice(2,4),y=cyear;
    iso=`${y}-${m}-${d}`;
  } else if(digits.length === 6){ // DDMMYY
    const d=digits.slice(0,2),m=digits.slice(2,4),y="20"+digits.slice(4,6);
    iso=`${y}-${m}-${d}`;
  } else if(digits.length === 8){ // DDMMYYYY
    const d=digits.slice(0,2),m=digits.slice(2,4),y=digits.slice(4,8);
    iso=`${y}-${m}-${d}`;
  }
  if(iso && iso.match(/^\d{4}-\d{2}-\d{2}$/)){
    picker.value = iso;
    el.style.color = "var(--green)";
  } else {
    el.style.color = iso.length>0?"var(--red)":"var(--text)";
  }
}
// Read value from a smart date input (returns ISO or "")
function dateInputVal(id){
  const el = document.getElementById(id);
  return el ? el.value : "";
}
// â”€â”€ END Smart Date Input â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function esc(s){ if(s==null)return""; return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"); }
function daysUntil(d){if(!d)return 999;return Math.ceil((new Date(d)-today)/(864e5));}
function expiryBadge(d){const n=daysUntil(d);if(n<0)return`<span class="badge b-red">Expired</span>`;if(n<=60)return`<span class="badge b-amber">${n}d left</span>`;return`<span class="badge b-green">Valid</span>`;}
function expiryText(d){if(!d)return"";const n=daysUntil(d);if(n<0)return`<span style="font-size:11px;color:var(--red)">Exp ${Math.abs(n)}d ago</span>`;if(n<=60)return`<span style="font-size:11px;color:var(--amber)">Exp in ${n}d</span>`;return`<span style="font-size:11px;color:var(--green)">Exp: ${d}</span>`;}

// â•â•â• MEDICAL RECORDS HELPERS â•â•â•
// Each employee now supports MULTIPLE medical certs (QE Offshore + Oryx + NOC, etc.)
// Data shape:
//   NEW: emp.medical = { records: [{id, medicalType, issued, expiry, doc}, ...], cert: "legacy" }
//   OLD: emp.medical = { medicalType, cert, issued, expiry, doc }
// Helpers handle BOTH shapes â€” auto-migrate old single-cert into records[0].
let _nextMedRecID = Date.now();

function getMedicalRecords(emp){
  if(!emp || !emp.medical) return [];
  // New shape
  if(Array.isArray(emp.medical.records)) return emp.medical.records;
  // Old shape: single record stored on `medical` object directly
  if(emp.medical.medicalType || emp.medical.expiry || emp.medical.doc){
    return [{
      id: _nextMedRecID++,
      medicalType: emp.medical.medicalType || "",
      issued: emp.medical.issued || "",
      expiry: emp.medical.expiry || "",
      doc: emp.medical.doc || null
    }];
  }
  return [];
}

// Move legacy single-record onto records[] (one-time migration on edit)
function _ensureMedicalArray(emp){
  if(!emp.medical) emp.medical = {records:[], cert:""};
  if(!Array.isArray(emp.medical.records)){
    const oldCert = emp.medical.cert || "";
    const oldRec = (emp.medical.medicalType || emp.medical.expiry || emp.medical.doc) ? {
      id: _nextMedRecID++,
      medicalType: emp.medical.medicalType || "",
      issued: emp.medical.issued || "",
      expiry: emp.medical.expiry || "",
      doc: emp.medical.doc || null
    } : null;
    emp.medical = {records: oldRec ? [oldRec] : [], cert: oldCert};
  }
}

function addMedicalRecord(emp, record){
  _ensureMedicalArray(emp);
  if(!record.id) record.id = _nextMedRecID++;
  emp.medical.records.push(record);
}

function updateMedicalRecord(emp, recordId, patch){
  _ensureMedicalArray(emp);
  const r = emp.medical.records.find(x => x.id === recordId);
  if(r) Object.assign(r, patch);
  return r;
}

function deleteMedicalRecord(emp, recordId){
  _ensureMedicalArray(emp);
  emp.medical.records = emp.medical.records.filter(x => x.id !== recordId);
}

// Get the "primary" medical for legacy displays â€” soonest-to-expire still-active record
function getPrimaryMedical(emp){
  const recs = getMedicalRecords(emp);
  if(!recs.length) return null;
  // Sort: not-yet-expired first (by expiry asc), then expired last (by expiry desc)
  const today = todayStr();
  const valid = recs.filter(r => r.expiry && r.expiry >= today).sort((a,b) => a.expiry.localeCompare(b.expiry));
  if(valid.length) return valid[0];
  return recs.slice().sort((a,b) => (b.expiry||"").localeCompare(a.expiry||""))[0];
}
function fmt(d){if(!d)return"â€”";try{const p=d.split("-");return`${p[2]}/${p[1]}/${p[0]}`;}catch(e){return d;}}
function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById("pg-"+id).classList.add("active");
  document.querySelectorAll(".pg-logo").forEach(img=>img.src=LOGO);
  window.scrollTo(0,0);
  renderGlobalMobileNav(id);
  // Show PPE request notifications on home/PPE pages
  if(session&&(id==="home"||id==="ppe"||id==="requests")){
    setTimeout(checkPendingNotifications,400);
  }
  if(session&&(id==="home"||id==="leaveflow")){
    setTimeout(checkLeaveNotificationsV2,900);
  }
  // Show gate pass expiry notifications on home page
  if(session&&id==="home"){
    setTimeout(checkGatePassNotifications,800);
    setTimeout(checkPMVNotifications,1200);
  }
  // Update signup notification bell on every page change (admin only)
  scheduleUiTextSanitize();
  if(session && typeof updateSignupBell === "function"){
    setTimeout(updateSignupBell, 100);
  }
}

function showGlobalLoading(title, detail){
  let el=document.getElementById("global-loading-overlay");
  if(!el){
    el=document.createElement("div");
    el.id="global-loading-overlay";
    el.style.cssText="position:fixed;inset:0;background:rgba(247,246,243,.78);backdrop-filter:blur(3px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:18px";
    el.innerHTML=`<div style="width:min(360px,92vw);background:var(--surface);border:1px solid var(--border);border-radius:12px;box-shadow:var(--shadow-lg);padding:18px">
      <div style="height:10px;width:46%;background:linear-gradient(90deg,#eee,#ddd,#eee);border-radius:8px;margin-bottom:12px;animation:pulse 1.2s infinite"></div>
      <div id="global-loading-title" style="font-weight:800;color:var(--brand);font-size:15px;margin-bottom:5px"></div>
      <div id="global-loading-detail" style="font-size:12px;color:var(--text2);line-height:1.45"></div>
      <div style="height:8px;background:#eee;border-radius:8px;overflow:hidden;margin-top:14px"><div style="width:42%;height:100%;background:var(--brand);border-radius:8px;animation:pulse 1.2s infinite"></div></div>
    </div>`;
    document.body.appendChild(el);
  }
  const t=document.getElementById("global-loading-title");
  const d=document.getElementById("global-loading-detail");
  if(t) t.textContent=title||"Loading";
  if(d) d.textContent=detail||"Please wait...";
  el.style.display="flex";
}
function hideGlobalLoading(){
  const el=document.getElementById("global-loading-overlay");
  if(el) el.style.display="none";
}

function renderGlobalMobileNav(currentPage){
  const nav=document.getElementById("global-bottom-nav");
  if(!session||currentPage==="login"||!isMobile()){
    nav.style.display="none";
    document.body.style.paddingBottom="";
    return;
  }
  // Build quick-access icons based on user's permissions
  const items=[];
  items.push({id:"home",icon:"&#127968;",label:"Home",fn:"navHome()"});
  if(hasPerm("employees")) items.push({id:"employee",icon:"&#128119;",label:"Employees",fn:"openEmployee()"});
  if(hasPerm("training")) items.push({id:"training",icon:"&#128203;",label:"Training",fn:"openTraining()"});
  if(hasPerm("gatepass_edit")) items.push({id:"gatepass",icon:"&#128682;",label:"Gate Pass",fn:"openGatePassAdmin()"});
  if(hasPerm("site_admin")) items.push({id:"siteadmin",icon:"&#128205;",label:"Site",fn:"openSiteAdmin()"});
  if(hasPerm("timekeeper")) items.push({id:"timekeeper",icon:"&#9201;&#65039;",label:"Time",fn:"openTimeKeeper()"});
  if(hasPerm("ppe")) items.push({id:"ppe",icon:"&#129466;",label:"PPE",fn:"openPPE()"});
  if(hasPerm("equipment")) items.push({id:"equipment",icon:"&#128295;",label:"Tools",fn:"openEquipment()"});
  if(hasPerm("procurement")||hasPerm("settings")) items.push({id:"procurement",icon:"&#128722;",label:"Procure",fn:"openProcurement()"});
  if(hasPerm("site_admin")||hasPerm("storekeeper")||hasPerm("procurement")||hasPerm("settings")) items.push({id:"requests",icon:"&#128203;",label:"Requests",fn:"openRequests()"});
  if(hasPerm("planner_view")||hasPerm("management_view")) items.push({id:"planner",icon:"&#128197;",label:"Planner",fn:"openPlanner()"});
  if(hasPerm("site_admin")||hasPerm("management_view")||hasPerm("timekeeper")||hasPerm("settings")) items.push({id:"leaveflow",icon:"&#128197;&#9989;",label:"Leave",fn:"openLeaveWorkflowModule()"});
  if(hasPerm("gm_view")||hasPerm("settings")) items.push({id:"gm",icon:"&#128101;",label:"GM",fn:"openGMDashboard()"});
  if(hasPerm("settings")||hasPerm("timekeeper")) items.push({id:"settings",icon:"&#9881;&#65039;",label:"Settings",fn:"openSettings()"});
  // Limit to 5 items max (standard mobile app pattern)
  const visible=items.slice(0,5);
  nav.innerHTML=visible.map(it=>`<button class="bnav-item${currentPage===it.id?" active":""}" onclick="${it.fn}">
    <span class="bnav-icon">${it.icon}</span>
    <span class="bnav-label">${it.label}</span>
  </button>`).join("");
  nav.style.display="flex";
  nav.classList.add("visible");
  document.body.style.paddingBottom="calc(var(--bottom-h) + env(safe-area-inset-bottom, 0px))";
}
function openModal(id){document.getElementById(id).classList.add("show");}
function closeModal(id){
  document.getElementById(id).classList.remove("show");
  if(id==="modal-popup" && window._defaultGoToPPERequests){
    window.goToPPERequests = window._defaultGoToPPERequests;
    const b=document.querySelector("#modal-popup .btn-brand");
    if(b) b.textContent = "Review Now";
  }
}
function toast(msg){const t=document.getElementById("toast-el");t.textContent=(typeof cleanMojibakeText==="function"?cleanMojibakeText(msg):msg);t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2500);}
function setMsg(id,msg,ok){const el=document.getElementById(id);if(el){el.textContent=msg;el.style.color=ok?"var(--green)":"var(--red)";}}

// Refresh the 3 global auto-suggest <datalist>s from current data.
// Called on login, after employee add/edit, and on settings open.
function refreshAutoSuggestDatalists(){
  const roles = [...new Set(getActiveEmployees().map(e => e.role).filter(Boolean))].sort();
  const depts = [...new Set(getActiveEmployees().map(e => e.dept).filter(Boolean))].sort();
  // Mix existing + master list; keep unique, existing first
  const existingNats = [...new Set(getActiveEmployees().map(e => e.nat).filter(Boolean))];
  const allNats = [...new Set([...existingNats, ...NATIONALITIES])];
  // Vehicle types from existing vehicles + a starter list
  const existingTypes = [...new Set(VEHICLES.map(v => v.vehicleType).filter(Boolean))];
  const STARTER_VEH_TYPES = ["Pickup Truck","Van","Car","SUV","Bus","Truck","Crane","Forklift","Excavator","Bulldozer","Loader","Trailer","Generator","Compressor","Welding Machine","Boom Lift","Scissor Lift","Telehandler","Concrete Mixer","Water Tanker","Fuel Tanker"];
  const allVehTypes = [...new Set([...existingTypes, ...STARTER_VEH_TYPES])];
  const dlRole = document.getElementById("dl-role");
  const dlDept = document.getElementById("dl-dept");
  const dlNat  = document.getElementById("dl-nationality");
  const dlVehType = document.getElementById("dl-vehicle-type");
  if(dlRole) dlRole.innerHTML = roles.map(r => `<option value="${r.replace(/"/g,"&quot;")}">`).join("");
  if(dlDept) dlDept.innerHTML = depts.map(d => `<option value="${d.replace(/"/g,"&quot;")}">`).join("");
  if(dlNat)  dlNat.innerHTML  = allNats.map(n => `<option value="${n.replace(/"/g,"&quot;")}">`).join("");
  if(dlVehType) dlVehType.innerHTML = allVehTypes.map(t => `<option value="${t.replace(/"/g,"&quot;")}">`).join("");
}
function todayStr(){return new Date().toISOString().split("T")[0];}


