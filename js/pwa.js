/* PWA_SERVICE_WORKER_V5_3_8 */
(function(){
  if(!("serviceWorker" in navigator)) return;
  window.addEventListener("load", function(){
    navigator.serviceWorker.register("/sw.js")
      .then(function(reg){ console.warn("[PWA] Service worker registered:", reg.scope); })
      .catch(function(err){ console.warn("[PWA] SW registration failed:", err.message); });
  });
})();
