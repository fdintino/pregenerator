var globals = [];

function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(() => {
  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  for (var k in iframe.contentWindow) {
    if (Object.prototype.hasOwnProperty.call(iframe.contentWindow, k)) {
      globals.push(k);
    }
  }

  document.body.removeChild(iframe);
});

export default globals;
