// Sentry error tracking only. Replace the placeholder with your Sentry DSN to enable.
// No session replay, no performance tracing, no user/request/breadcrumb data.
window.ALHABARI_SENTRY_DSN = "https://2dd456664751c3267f30f2c73be2152f@o4511409761746944.ingest.us.sentry.io/4511462180716544";
(function(){
  var dsn = String(window.ALHABARI_SENTRY_DSN || "").trim();
  if(!dsn || dsn.indexOf("PASTE_YOUR") >= 0) return;

  var script = document.createElement("script");
  script.src = "https://browser.sentry-cdn.com/8.55.0/bundle.min.js";
  script.crossOrigin = "anonymous";
  script.onload = function(){
    if(!window.Sentry) return;
    window.Sentry.init({
      dsn: dsn,
      tracesSampleRate: 0,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
      sendDefaultPii: false,
      beforeSend: function(event){
        delete event.user;
        delete event.request;
        delete event.breadcrumbs;
        delete event.contexts;
        delete event.extra;
        delete event.tags;
        return event;
      }
    });
  };
  document.head.appendChild(script);
})();

