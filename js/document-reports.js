/* === DOCUMENT_REPORTS_AND_TEXT_CLEAN_V5_3_3 === */
(function(){
  if(window.__docReportsTextCleanV533) return;
  window.__docReportsTextCleanV533 = true;

  function esc533(v){
    if(typeof v1Safe === "function") return v1Safe(v == null ? "" : v);
    return String(v == null ? "" : v).replace(/[&<>"']/g, function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }
  window.stripMojibakeTextV533 = function stripMojibakeTextV533(value){
    var s = String(value == null ? "" : value);
    if(!/[\u00a2\u0192\u00c3\u00c2\u00e2\u00f0\u00ef\ufffd\u201a\u201e\u2026\u2020\u2021\u02c6\u2030\u0160\u2039\u0152\u017d\u0161\u0153\u017e\u0178]|Ãƒâ€šÃ‚Â¢Ãƒâ€ Ã¢â‚¬â„¢/.test(s)) return s;
    s = s.replace(/PMV\s+[\u00a2\u0192\u00c3\u00c2\u00e2\u00f0\u00ef\ufffd\u201a\u201e\u2026\u2020\u2021\u02c6\u2030\u0160\u2039\u0152\u017d\u0161\u0153\u017e\u0178Ãƒâ€šÃ‚Â¢Ãƒâ€ Ã¢â‚¬â„¢\-\s]+Vehicles/g, "PMV - Vehicles");
    s = s.replace(/[\u00a2\u0192\u00c3\u00c2\u00e2\u00f0\u00ef\ufffd\u201a\u201e\u2026\u2020\u2021\u02c6\u2030\u0160\u2039\u0152\u017d\u0161\u0153\u017e\u0178]+[^\s<>{}\[\]()"']*/g, " ");
    s = s.replace(/Ãƒâ€šÃ‚Â¢Ãƒâ€ Ã¢â‚¬â„¢/g, " ");
    s = s.replace(/\s+([,.:;])/g, "$1").replace(/\s*-\s*/g, " - ").replace(/\s{2,}/g, " ").trim();
    s = s.replace(/^[-|]+\s*/, "").replace(/\s*[-|]+$/, "").trim();
    s = s.replace(/^PMV\s+Vehicles$/i, "PMV - Vehicles");
    return s;
  };
  window.cleanVisibleTextV533 = function cleanVisibleTextV533(root){
    root = root || document.body;
    if(!root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node){
        var p = node.parentElement;
        if(!p || /^(SCRIPT|STYLE|TEXTAREA|INPUT|OPTION|CODE|PRE)$/i.test(p.tagName)) return NodeFilter.FILTER_REJECT;
        return /[\u00a2\u0192\u00c3\u00c2\u00e2\u00f0\u00ef\ufffd\u201a\u201e\u2026\u2020\u2021\u02c6\u2030\u0160\u2039\u0152\u017d\u0161\u0153\u017e\u0178]|Ãƒâ€šÃ‚Â¢Ãƒâ€ Ã¢â‚¬â„¢/.test(node.nodeValue||"") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    var nodes = [];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function(n){ n.nodeValue = stripMojibakeTextV533(n.nodeValue); });
    root.querySelectorAll("[title],[placeholder],[aria-label]").forEach(function(el){
      ["title","placeholder","aria-label"].forEach(function(a){
        var v = el.getAttribute(a);
        if(v && /[\u00a2\u0192\u00c3\u00c2\u00e2\u00f0\u00ef\ufffd\u201a\u201e\u2026\u2020\u2021\u02c6\u2030\u0160\u2039\u0152\u017d\u0161\u0153\u017e\u0178]|Ãƒâ€šÃ‚Â¢Ãƒâ€ Ã¢â‚¬â„¢/.test(v)) el.setAttribute(a, stripMojibakeTextV533(v));
      });
    });
  };
  function cleanSoonV533(root){ setTimeout(function(){ cleanVisibleTextV533(root || document.body); }, 20); }

  window.addPopupTopCloseV533 = function addPopupTopCloseV533(){
    var body = document.getElementById("modal-popup-body");
    var modal = document.getElementById("modal-popup-list");
    if(!body || !modal || !modal.classList.contains("show")) return;
    if(body.querySelector(".modal-top-close-v533")) return;
    body.insertAdjacentHTML("afterbegin", '<div class="modal-top-close-v533" style="position:sticky;top:0;z-index:5;background:var(--surface);display:flex;justify-content:flex-end;padding:0 0 8px;margin-bottom:8px;border-bottom:1px solid var(--border)"><button class="btn btn-sm" onclick="closeModal(\'modal-popup-list\')" style="padding:6px 14px">Close</button></div>');
  };

  function wrapRenderV533(name){
    var fn = window[name];
    if(typeof fn !== "function" || fn.__cleanV533) return;
    var wrapped = function(){
      var out = fn.apply(this, arguments);
      cleanSoonV533(document.querySelector(".page.active") || document.body);
      return out;
    };
    wrapped.__cleanV533 = true;
    window[name] = wrapped;
    try{ eval(name + " = window[name]"); }catch(e){}
  }
  ["renderHomeContent","renderTimeKeeper","renderSettingsView","renderPMVView","renderEquipView","renderSiteAdmin","renderTraining","renderTrainView","renderGatePassAdmin","renderManagementDashboard","renderLiftingGears"].forEach(wrapRenderV533);
  if(typeof openModal === "function" && !openModal.__cleanV533){
    var oldOpenModalV533 = openModal;
    window.openModal = openModal = function(id){
      var out = oldOpenModalV533.apply(this, arguments);
      setTimeout(function(){ if(id === "modal-popup-list") addPopupTopCloseV533(); cleanVisibleTextV533(document.getElementById(id) || document.body); }, 10);
      return out;
    };
    openModal.__cleanV533 = true;
  }

  var DOC_REPORTS_TAB_V533 = "tpc";
  window.DOC_REPORTS_SEARCH_V533 = window.DOC_REPORTS_SEARCH_V533 || "";
  window.docReportDocMapV533 = {};
  window.docReportsCanV533 = function docReportsCanV533(type){
    if(typeof hasPerm !== "function") return false;
    if(hasPerm("settings") || hasPerm("documents_report_view")) return true;
    if(type === "tpc") return hasPerm("tpc_report_view");
    if(type === "pmv") return hasPerm("pmv_report_view");
    if(type === "lifting") return hasPerm("lifting_gears_view");
    return false;
  };
  function docReportsAnyV533(){
    return docReportsCanV533("tpc") || docReportsCanV533("pmv") || docReportsCanV533("lifting");
  }
  function docReportStatusV533(expiry){
    if(!expiry) return {label:"No expiry", cls:"b-gray"};
    var d = typeof daysUntil === "function" ? daysUntil(expiry) : 999;
    if(d < 0) return {label:"Expired", cls:"b-red"};
    if(d <= 30) return {label:"Expiring soon", cls:"b-amber"};
    return {label:"Active", cls:"b-green"};
  }
  function docReportMatchesV533(row){
    var q = (window.DOC_REPORTS_SEARCH_V533 || "").toLowerCase().trim();
    if(!q) return !!window.__DOC_REPORTS_LIST_ALL_V533;
    return String(row.search || "").toLowerCase().includes(q);
  }
  function docLabelV533(doc){ return doc && (doc.name || doc.path) ? (doc.name || String(doc.path).split("/").pop()) : ""; }
  window.docReportTpcRowsV533 = function docReportTpcRowsV533(){
    var rows = [];
    try{
      (EQUIPMENT || []).forEach(function(eq){
        (eq.docs || []).forEach(function(doc, idx){
          rows.push({
            kind:"tpc", source:"TPC / Calibration", title:(doc.type || "TPC") + " - " + (eq.assetNo || eq.name || ""),
            assetNo:eq.assetNo || "", serialNo:doc.serialNo || eq.serialNo || "", item:eq.name || "", family:eq.family || eq.category || "",
            expiry:doc.expiry || "", status:docReportStatusV533(doc.expiry), doc:doc.file || doc.doc || null,
            fileName:docLabelV533(doc.file || doc.doc), remarks:doc.remarks || "",
            search:[eq.assetNo, eq.serialNo, eq.name, eq.family, eq.category, doc.serialNo, doc.type, doc.remarks, docLabelV533(doc.file || doc.doc)].join(" ")
          });
        });
      });
    }catch(e){}
    return rows.filter(docReportMatchesV533);
  };
  window.docReportPmvRowsV533 = function docReportPmvRowsV533(){
    var rows = [];
    var defs = [["Istimara","istimaraNo","istimaraExpiry","istimaraDoc"],["Insurance","insuranceNo","insuranceExpiry","insuranceDoc"],["TPC","tpcNo","tpcExpiry","tpcDoc"]];
    try{
      (VEHICLES || []).forEach(function(v){
        defs.forEach(function(d){
          var doc = v[d[3]];
          if(!doc) return;
          rows.push({
            kind:"pmv", source:"PMV " + d[0], title:d[0] + " - " + (v.plateNo || v.vehicleType || ""),
            plateNo:v.plateNo || "", item:[v.vehicleType, v.make, v.model].filter(Boolean).join(" "), site:v.site || "",
            docNo:v[d[1]] || "", expiry:v[d[2]] || "", status:docReportStatusV533(v[d[2]]), doc:doc,
            fileName:docLabelV533(doc), remarks:v.notes || "",
            search:[v.plateNo, v.vehicleType, v.make, v.model, v.driverName, v.site, d[0], v[d[1]], v[d[2]], docLabelV533(doc)].join(" ")
          });
        });
      });
    }catch(e){}
    return rows.filter(docReportMatchesV533);
  };
  window.docReportLiftingRowsV533 = function docReportLiftingRowsV533(){
    var rows = [];
    try{
      (window.LIFTING_GEARS || []).forEach(function(g){
        if(!g.tpcDoc) return;
        rows.push({
          kind:"lifting", source:"Lifting Gear TPC", title:"Lifting TPC - " + (g.gearId || ""),
          gearId:g.gearId || "", category:g.category || "", swl:g.swl || "", cert:g.certificateNo || "", site:g.site || "",
          expiry:g.expiryDate || "", status:docReportStatusV533(g.expiryDate), doc:g.tpcDoc,
          fileName:docLabelV533(g.tpcDoc), remarks:g.remarks || "",
          search:[g.gearId, g.category, g.swl, g.certificateNo, g.site, g.expiryDate, docLabelV533(g.tpcDoc)].join(" ")
        });
      });
    }catch(e){}
    return rows.filter(docReportMatchesV533);
  };
  async function docLoadLiftingV533(){
    if((window.LIFTING_GEARS || []).length) return;
    if(!(typeof SB_ENABLED !== "undefined" && SB_ENABLED && typeof sbFetchAll === "function")) return;
    try{
      var rows = await sbFetchAll("lifting_gears","gear_id",true);
      if(Array.isArray(rows)){
        window.LIFTING_GEARS = rows.map(function(r){
          return {id:r.id, gearId:r.gear_id || r.gearId || "", category:r.category || "", swl:r.swl || "", certificateNo:r.certificate_no || r.certificateNo || "", expiryDate:r.expiry_date || r.expiryDate || "", qeApproved:!!(r.qe_approved ?? r.qeApproved), site:r.site || "Warehouse", status:r.status || "available", issuedTo:r.issued_to || r.issuedTo || "", tpcDoc:r.tpc_doc || r.tpcDoc || null, remarks:r.remarks || ""};
        });
      }
    }catch(e){ console.warn("Document report lifting load failed", e); }
  }
  function docRowsV533(){
    if(DOC_REPORTS_TAB_V533 === "pmv") return docReportPmvRowsV533();
    if(DOC_REPORTS_TAB_V533 === "lifting") return docReportLiftingRowsV533();
    return docReportTpcRowsV533();
  }
  window.setDocReportsTabV533 = async function setDocReportsTabV533(tab){
    DOC_REPORTS_TAB_V533 = tab || "tpc";
    if(tab === "lifting") await docLoadLiftingV533();
    renderDocumentReports();
  };
  window.docReportsSearchInputV533 = function docReportsSearchInputV533(el){
    window.DOC_REPORTS_SEARCH_V533 = el ? el.value : "";
    clearTimeout(window._docReportsSearchTimerV533);
    window._docReportsSearchTimerV533 = setTimeout(function(){
      var cur = el && typeof el.selectionStart === "number" ? el.selectionStart : null;
      renderDocumentReports();
      var input = document.getElementById("docreports-search-input-v533");
      if(input){ input.focus(); if(cur !== null){ try{ input.setSelectionRange(cur, cur); }catch(e){} } }
    }, 180);
  };
  window.renderDocumentReports = function renderDocumentReports(){
    var target = document.getElementById("docreports-content");
    if(!target) return;
    if(!docReportsAnyV533()){ target.innerHTML = '<div class="empty-state">No report access assigned.</div>'; return; }
    if(!docReportsCanV533(DOC_REPORTS_TAB_V533)){
      DOC_REPORTS_TAB_V533 = docReportsCanV533("tpc") ? "tpc" : (docReportsCanV533("pmv") ? "pmv" : "lifting");
    }
    window.docReportDocMapV533 = {};
    var searchText = (window.DOC_REPORTS_SEARCH_V533 || "").trim();
    window.__DOC_REPORTS_LIST_ALL_V533 = true;
    var allRows = docRowsV533();
    window.__DOC_REPORTS_LIST_ALL_V533 = false;
    var rows = searchText ? allRows.filter(docReportMatchesV533) : [];
    var listId = "docreports-search-list-v533";
    var buttons = [
      ["tpc","TPC / Calibration Report",docReportsCanV533("tpc")],
      ["pmv","PMV Report",docReportsCanV533("pmv")],
      ["lifting","Lifting Gears Report",docReportsCanV533("lifting")]
    ].filter(function(x){ return x[2]; }).map(function(x){ return '<button class="pill'+(DOC_REPORTS_TAB_V533===x[0]?' active':'')+'" onclick="setDocReportsTabV533(\''+x[0]+'\')">'+x[1]+'</button>'; }).join("");
    var suggestions = allRows.slice(0,300).map(function(r){
      return '<option value="'+esc533(r.assetNo || r.serialNo || r.plateNo || r.gearId || r.item || r.title || "")+'"></option>';
    }).join("");
    var html = '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px"><div><div style="font-size:20px;font-weight:900;color:var(--brand)">Document Reports</div><div style="font-size:12px;color:var(--text2)">View-only search for TPC/calibration, PMV and lifting gear documents.</div></div><button class="btn btn-sm" onclick="openHome()">Back</button></div><div class="tabs-bar">'+buttons+'</div><div class="card" style="margin-bottom:12px"><div class="form-row" style="margin-bottom:0"><label>Search and select</label><input list="'+listId+'" id="docreports-search-input-v533" value="'+esc533(window.DOC_REPORTS_SEARCH_V533)+'" placeholder="Type asset, serial, vehicle plate or lifting gear ID..." oninput="docReportsSearchInputV533(this)"><datalist id="'+listId+'">'+suggestions+'</datalist></div></div>';
    html += '<div class="table-wrap"><table style="font-size:12px"><tr>';
    if(DOC_REPORTS_TAB_V533 === "pmv") html += '<th>SL</th><th>Document</th><th>Plate / Item</th><th>Site</th><th>No.</th><th>Expiry</th><th>Status</th><th>File</th><th>Action</th>';
    else if(DOC_REPORTS_TAB_V533 === "lifting") html += '<th>SL</th><th>ID No</th><th>Category</th><th>SWL</th><th>Certificate</th><th>Site</th><th>Expiry</th><th>Status</th><th>File</th><th>Action</th>';
    else html += '<th>SL</th><th>Asset No</th><th>Serial No</th><th>Item</th><th>Family</th><th>Type</th><th>Expiry</th><th>Status</th><th>File</th><th>Action</th>';
    html += '</tr>';
    if(!rows.length){
      html += '<tr><td colspan="10" style="text-align:center;padding:18px;color:var(--text2)">Type in the search box to show matching documents.</td></tr>';
    } else {
      rows.forEach(function(r,i){
        var key = "dr-"+DOC_REPORTS_TAB_V533+"-"+i;
        window.docReportDocMapV533[key] = {doc:r.doc,title:r.title};
        var action = r.doc ? '<button class="btn btn-sm" onclick="docReportViewDocV533(\''+key+'\')">View</button> <button class="btn btn-sm" onclick="docReportPrintDocV533(\''+key+'\')">Print</button>' : '<span style="color:var(--text3)">No file</span>';
        if(DOC_REPORTS_TAB_V533 === "pmv") html += '<tr><td>'+(i+1)+'</td><td style="font-weight:800">'+esc533(r.source)+'</td><td>'+esc533((r.plateNo||"")+" "+(r.item||""))+'</td><td>'+esc533(r.site||"")+'</td><td>'+esc533(r.docNo||"")+'</td><td>'+(r.expiry && typeof fmt==="function"?fmt(r.expiry):esc533(r.expiry||""))+'</td><td><span class="badge '+r.status.cls+'">'+r.status.label+'</span></td><td>'+esc533(r.fileName||"")+'</td><td>'+action+'</td></tr>';
        else if(DOC_REPORTS_TAB_V533 === "lifting") html += '<tr><td>'+(i+1)+'</td><td style="font-weight:800">'+esc533(r.gearId||"")+'</td><td>'+esc533(r.category||"")+'</td><td>'+esc533(r.swl||"")+'</td><td>'+esc533(r.cert||"")+'</td><td>'+esc533(r.site||"")+'</td><td>'+(r.expiry && typeof fmt==="function"?fmt(r.expiry):esc533(r.expiry||""))+'</td><td><span class="badge '+r.status.cls+'">'+r.status.label+'</span></td><td>'+esc533(r.fileName||"")+'</td><td>'+action+'</td></tr>';
        else html += '<tr><td>'+(i+1)+'</td><td style="font-weight:800">'+esc533(r.assetNo||"")+'</td><td>'+esc533(r.serialNo||"")+'</td><td>'+esc533(r.item||"")+'</td><td>'+esc533(r.family||"")+'</td><td>'+esc533(r.source||"")+'</td><td>'+(r.expiry && typeof fmt==="function"?fmt(r.expiry):esc533(r.expiry||""))+'</td><td><span class="badge '+r.status.cls+'">'+r.status.label+'</span></td><td>'+esc533(r.fileName||"")+'</td><td>'+action+'</td></tr>';
      });
    }
    html += '</table></div>';
    target.innerHTML = html;
    cleanVisibleTextV533(target);
  };
  window.docReportViewDocV533 = async function docReportViewDocV533(key){
    var item = window.docReportDocMapV533[key];
    if(!item || !item.doc) return toast("Document not found");
    if(typeof openDoc === "function") return openDoc(item.doc, item.title || "Document");
    if(typeof viewDoc === "function") return viewDoc(item.doc);
    var url = typeof docResolveUrl === "function" ? await docResolveUrl(item.doc) : null;
    if(url) window.open(url, "_blank"); else toast("Document URL not available");
  };
  window.docReportPrintDocV533 = async function docReportPrintDocV533(key){
    var item = window.docReportDocMapV533[key];
    if(!item || !item.doc) return toast("Document not found");
    var url = typeof docResolveUrl === "function" ? await docResolveUrl(item.doc) : null;
    if(!url) return toast("Document URL not available");
    if(!/^https?:\/\//i.test(url) && !/^data:image\//i.test(url) && !/^blob:/i.test(url)){
      return toast("Document URL not available");
    }
    var safeUrl = url.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    var isImg = String(item.doc.type || item.doc.name || "").toLowerCase().match(/\.(png|jpg|jpeg|webp)$|image\//);
    var w = window.open("", "_blank");
    if(!w) return toast("Popup blocked. Allow popups to print.");
    w.document.write('<!doctype html><html><head><title>'+esc533(item.title||"Document")+'</title><style>html,body{margin:0;height:100%;font-family:Arial}iframe{border:0;width:100%;height:100vh}img{max-width:100%;display:block;margin:0 auto}</style></head><body>'+(isImg?'<img src="'+safeUrl+'" onload="setTimeout(function(){print()},300)">':'<iframe src="'+safeUrl+'" onload="setTimeout(function(){print()},700)"></iframe>')+'</body></html>');
    w.document.close();
  };
  function ensureDocReportsPageV533(){
    /* DEDUP_V5_4_15: reuse the existing pg-documents page + #docreports-content from index.html; creating a duplicate caused the blank second tile. */
    return;
  }
  window.openDocumentReports = async function openDocumentReports(){
    /* DEDUP_V5_4_15: open the canonical pg-documents page from index.html. */
    if(DOC_REPORTS_TAB_V533 === "lifting") await docLoadLiftingV533();
    if(typeof showPage === "function") showPage("documents");
    renderDocumentReports();
  };
  function docReportsCardV533(){
    return '<div class="module-card" data-module-id="docreports" onclick="openModule(\'docreports\')"><div class="module-icon" style="background:#eef6ff;color:#1d4ed8;font-weight:900">ðŸ“„</div><div class="module-name">Document Reports</div><div class="module-desc">Search, view and print TPC, PMV and lifting gear documents</div></div>';
  }
  function addDocReportsHomeCardV533(){
    /* DEDUP_V5_4_15: index.html already provides the "documents" Document Reports tile; do not add a duplicate. */
    return;
  }
  if(typeof renderHomeContent === "function" && !renderHomeContent.__docReportsV533){
    var oldHomeV533 = renderHomeContent;
    window.renderHomeContent = renderHomeContent = function(){
      oldHomeV533.apply(this, arguments);
      addDocReportsHomeCardV533();
      cleanSoonV533(document.getElementById("home-content"));
    };
    renderHomeContent.__docReportsV533 = true;
  }
  if(typeof openModule === "function" && !openModule.__docReportsV533){
    var oldOpenModuleV533 = openModule;
    window.openModule = openModule = function(id){
      if(id === "docreports") return openDocumentReports();
      return oldOpenModuleV533.apply(this, arguments);
    };
    openModule.__docReportsV533 = true;
  }
  if(window.ALL_PERMS){
    ALL_PERMS.documents_report_view = ALL_PERMS.documents_report_view || {label:"Document Reports - View and Print",icon:"DOC"};
    ALL_PERMS.tpc_report_view = ALL_PERMS.tpc_report_view || {label:"TPC / Calibration Report - View",icon:"TPC"};
    ALL_PERMS.pmv_report_view = ALL_PERMS.pmv_report_view || {label:"PMV Documents Report - View",icon:"PMV"};
    ALL_PERMS.lifting_gears_view = ALL_PERMS.lifting_gears_view || {label:"Lifting Gears Report - View",icon:"LG"};
  }
  if(typeof lgCanView === "function" && !lgCanView.__docReportsV533){
    var oldLgCanViewV533 = lgCanView;
    window.lgCanView = lgCanView = function(){ return oldLgCanViewV533.apply(this, arguments) || (typeof hasPerm === "function" && hasPerm("lifting_gears_view")); };
    lgCanView.__docReportsV533 = true;
  }
  document.addEventListener("DOMContentLoaded", function(){
    ensureDocReportsPageV533();
    addDocReportsHomeCardV533();
    cleanSoonV533(document.body);
  });
  ensureDocReportsPageV533();
  cleanSoonV533(document.body);
})();

/* === DOC_REPORTS_CLEAN_LATENCY_FIX_V5_3_4 === */
(function(){
  if(window.__docReportsCleanLatencyV534) return;
  window.__docReportsCleanLatencyV534 = true;

  window.openHome = window.openHome || function openHome(){
    if(typeof renderHomeContent === "function") renderHomeContent();
    if(typeof showPage === "function") showPage("home");
  };

  var badTextReV534 = /[\u00a2\u0192\u00c3\u00c2\u00e2\u00f0\u00ef\ufffd\u201a\u201e\u2026\u2020\u2021\u02c6\u2030\u0160\u2039\u0152\u017d\u0161\u0153\u017e\u0178]|ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢/;
  function stripUiTextV534(value){
    if(typeof stripMojibakeTextV533 === "function") return stripMojibakeTextV533(value);
    return String(value == null ? "" : value).replace(/[\u00a2\u0192\u00c3\u00c2\u00e2\u00f0\u00ef\ufffd]+[^\s<>{}\[\]()"']*/g, " ").replace(/\s{2,}/g, " ").trim();
  }
  // Extend the full TreeWalker-based cleaner rather than replacing it
  var _prevCleanV533 = window.cleanVisibleTextV533;
  window.cleanVisibleTextV533 = function cleanVisibleTextV533(root){
    root = root || document.body;
    if(!root) return;
    // Run the full TreeWalker pass first to catch all text nodes (td, span, div, p, etc.)
    if(typeof _prevCleanV533 === "function") _prevCleanV533(root);
    // Then clean attributes on named UI elements
    var selector = ".topbar-title,.module-name,.module-desc,.module-icon,.section-title,.tab-btn,.pill,.btn,.lbl,.badge,label,summary,h1,h2,h3,h4,th,caption,.empty-state,.info-box,.stat-mini div,.form-row div,.modal-title,.modal-header,#modal-popup-title,#popup-title";
    var list = [];
    if(root.matches && root.matches(selector)) list.push(root);
    if(root.querySelectorAll) list = list.concat(Array.from(root.querySelectorAll(selector)));
    list.slice(0,900).forEach(function(el){
      ["title","placeholder","aria-label"].forEach(function(a){
        var v = el.getAttribute && el.getAttribute(a);
        if(v && badTextReV534.test(v)) el.setAttribute(a, stripUiTextV534(v));
      });
    });
  };
})();
/* === END DOC_REPORTS_CLEAN_LATENCY_FIX_V5_3_4 === */
/* === GLOBAL_MOJIBAKE_CLEANUP_V5_3_5 === */
(function(){
  if(window.__globalMojibakeCleanupV535) return;
  window.__globalMojibakeCleanupV535 = true;

  function cleanNowV535(root){
    if(typeof cleanVisibleTextV533 === "function"){
      cleanVisibleTextV533(root || document.querySelector(".page.active") || document.body);
    }
  }
  function cleanSoonV535(root){
    clearTimeout(window.__cleanSoonTimerV535);
    window.__cleanSoonTimerV535 = setTimeout(function(){ cleanNowV535(root); }, 25);
  }
  function wrapCleanV535(name){
    var fn = window[name];
    if(typeof fn !== "function" || fn.__cleanV535) return;
    var wrapped = function(){
      var out = fn.apply(this, arguments);
      cleanSoonV535(document.querySelector(".page.active") || document.body);
      return out;
    };
    wrapped.__cleanV535 = true;
    window[name] = wrapped;
    try{ eval(name + " = window[name]"); }catch(e){}
  }

  [
    "showPage",
    "renderEmpView","renderEmpList","renderEmpProfile","renderEmpAdd","openEditEmployee",
    "renderTrainingSummary","renderMedicalSummary","renderGatePassSummary","renderTrainView","renderTrainSearch","renderMedicalSearch","renderTmScheduleMatrix",
    "renderGatePassAdmin",
    "renderSiteAdmin","renderProjectMatrix","renderDailySheet",
    "renderSiteAdminDashboard","renderRequestsView","renderPPEView",
    "renderReqActiveQueue","renderReqMyList","renderReqHistory","renderReqReports","renderPPEStock","renderPPEDashboard","renderPPEHistory","renderEmpPPEList","renderPPERequests",
    "renderEquipView","renderEquipList","renderEquipDocsSheet","renderEquipSummary",
    "renderPMVView","renderPmvRentalsTab","renderPmvRateSheet","renderPmvTimesheetTab","renderPmvReportsTab",
    "renderPlannerView","renderManagementDashboard","renderGMDashboard",
    "renderSettingsView","renderManageUsers","renderActiveUsers","renderAuditLog",
    "renderLeaveRecordsModuleV4","renderLeaveWorkflowPanel","renderLiftingGears","renderDocumentReports"
  ].forEach(wrapCleanV535);


  /* TOAST_MOJIBAKE_WRAP_V5_3_5 */
  if(typeof window.toast === "function" && !window.toast.__cleanV535){
    var oldToastV535 = window.toast;
    window.toast = function(msg){
      if(typeof stripMojibakeTextV533 === "function") msg = stripMojibakeTextV533(String(msg || ""));
      return oldToastV535.apply(this, [msg].concat(Array.prototype.slice.call(arguments, 1)));
    };
    window.toast.__cleanV535 = true;
    try{ toast = window.toast; }catch(e){}
  }
  document.addEventListener("DOMContentLoaded", function(){ cleanSoonV535(document.body); });
  setTimeout(function(){ cleanSoonV535(document.body); }, 100);
})();
/* === END GLOBAL_MOJIBAKE_CLEANUP_V5_3_5 === */
/* === END DOCUMENT_REPORTS_AND_TEXT_CLEAN_V5_3_3 === */
