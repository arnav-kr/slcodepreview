window.addEventListener("load", _);
function GetCode(id, c) {
  fetch("https://api2.sololearn.com/v2/codeplayground/usercodes/" + id)
    .then((response) => { return response.json(); })
    .then((data) => { c(data.data) })
    .catch(e => { Toast("Please Enter A Valid URL", "red") })
}
function Code(ev) {
  ev.preventDefault();
  id("code-box").value = "";
  var validated = true;
  var url = ev.target.url.value || " ";
  url = url.endsWith("/?ref=app") ? url.substr(0, url.length - 9) : url;
  url = url.includes("https://code.sololearn.com/") ? url.split("https://code.sololearn.com/")[1] : url;
  url.split("").includes(/[\/|\.|\?|=]/) || url.trim().length == 0 ? validated = false : void 0
  if (!validated) { Toast("Please Enter a Valid Code URL!", "red") }
  else {
    GetCode(url, data => {
      if (data == null) {
        Toast("Please Enter A Valid URL!", "red")
      }
      var html = data.sourceCode;
      var css = data.cssCode;
      var js = data.jsCode;
      var lang = data.language;
      var source;
      var name = data.name;
      var publicId = data.publicId;
      var jsScript = document.createElement("script");
      jsScript.type = "text/javascript";
      jsScript.textContent = js;
      jsScript.id = "script-from-editor";
      var cssStyle = document.createElement("style");
      cssStyle.textContent = css;
      cssStyle.id = "style-from-editor"
      if (lang == "web") {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        doc.head.appendChild(cssStyle);
        doc.head.appendChild(jsScript);
        source = doc.documentElement.outerHTML;
        id("main-frame").srcdoc = source;
        id("code-box").value = source;
        var dataURI = 'data:text/html,' + encodeURIComponent(source);
        id("launch-in-browser").href = ev.target.url.value;
        id("download").addEventListener("click", e => {
          download(source, name, "text/html");
        });
        id("copy").addEventListener("click", e => {
          try {
            var copyText = id("code-box")
            copyText.select();
            copyText.setSelectionRange(0, 99999999999999999999999);
            document.execCommand("copy");
            Toast("Copied to Clipboard!", 'mediumseagreen');
          }
          catch (e) {
            Toast("Couldn't Copy!", 'red');
          }
        });
        id("share").addEventListener("click", e => {
          navigator.share({
            title: name,
            url: window.location.pathname + "?q=" + publicId
          }).then(() => {
            Toast('Thanks for sharing!', "mediumseagreen");
          })
          Toast('An Error Occured!', "red");
        });
      }
      else {

      }
      // console.log(JSON.stringify(data))
    });
  }
}
function id(i) { return document.getElementById(i); }

function _() {
  if (window.location.search && window.location) {
    let query = new URLSearchParams(window.location.search);
    if (query.has("q")) {
      id("url").value = query.get("q");
      id("go").click();
    }
  }
  if (!navigator.share) {
    id("share").classList.add("hide");
  }
  let testA = document.createElement('a');
  if (typeof testA.download == "undefined") {
    id("download").classList.add("hide");
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js');
    console.log("Service Worker Registered!");
  }
}

/* 
 * DOMParser HTML extension 
 * 2012-02-02 
 * 
 * By Eli Grey, http://eligrey.com 
 * Public domain. 
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK. 
 */

/*! @source https://gist.github.com/1129031 */
/*global document, DOMParser*/

(function (DOMParser) {
  "use strict";
  var DOMParser_proto = DOMParser.prototype
    , real_parseFromString = DOMParser_proto.parseFromString;

  // Firefox/Opera/IE throw errors on unsupported types  
  try {
    // WebKit returns null on unsupported types  
    if ((new DOMParser).parseFromString("", "text/html")) {
      // text/html parsing is natively supported  
      return;
    }
  } catch (ex) { }

  DOMParser_proto.parseFromString = function (markup, type) {
    if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
      var doc = document.implementation.createHTMLDocument("")
        , doc_elt = doc.documentElement
        , first_elt;

      doc_elt.innerHTML = markup;
      first_elt = doc_elt.firstElementChild;

      if (doc_elt.childElementCount === 1
        && first_elt.localName.toLowerCase() === "html") {
        doc.replaceChild(first_elt, doc_elt);
      }

      return doc;
    } else {
      return real_parseFromString.apply(this, arguments);
    }
  };
}(DOMParser));
//download.js v4.2, by dandavis; 2008-2016. [CCBY2] see http://danml.com/download.html for tests/usage
// v1 landed a FF+Chrome compat way of downloading strings to local un-named files, upgraded to use a hidden frame and optional mime
// v2 added named files via a[download], msSaveBlob, IE (10+) support, and window.URL support for larger+faster saves than dataURLs
// v3 added dataURL and Blob Input, bind-toggle arity, and legacy dataURL fallback was improved with force-download mime and base64 support. 3.1 improved safari handling.
// v4 adds AMD/UMD, commonJS, and plain browser support
// v4.1 adds url download capability via solo URL argument (same domain/CORS only)
// v4.2 adds semantic variable names, long (over 2MB) dataURL support, and hidden by default temp anchors
// https://github.com/rndme/download

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.download = factory();
  }
}(this, function () {

  return function download(data, strFileName, strMimeType) {

    var self = window, // this script is only for browsers anyway...
      defaultMime = "application/octet-stream", // this default mime also triggers iframe downloads
      mimeType = strMimeType || defaultMime,
      payload = data,
      url = !strFileName && !strMimeType && payload,
      anchor = document.createElement("a"),
      toString = function (a) { return String(a); },
      myBlob = (self.Blob || self.MozBlob || self.WebKitBlob || toString),
      fileName = strFileName || "download",
      blob,
      reader;
    myBlob = myBlob.call ? myBlob.bind(self) : Blob;

    if (String(this) === "true") { //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
      payload = [payload, mimeType];
      mimeType = payload[0];
      payload = payload[1];
    }


    if (url && url.length < 2048) { // if no filename and no mime, assume a url was passed as the only argument
      fileName = url.split("/").pop().split("?")[0];
      anchor.href = url; // assign href prop to temp anchor
      if (anchor.href.indexOf(url) !== -1) { // if the browser determines that it's a potentially valid url path:
        var ajax = new XMLHttpRequest();
        ajax.open("GET", url, true);
        ajax.responseType = 'blob';
        ajax.onload = function (e) {
          download(e.target.response, fileName, defaultMime);
        };
        setTimeout(function () { ajax.send(); }, 0); // allows setting custom ajax headers using the return:
        return ajax;
      } // end if valid url?
    } // end if url?


    //go ahead and download dataURLs right away
    if (/^data\:[\w+\-]+\/[\w+\-]+[,;]/.test(payload)) {

      if (payload.length > (1024 * 1024 * 1.999) && myBlob !== toString) {
        payload = dataUrlToBlob(payload);
        mimeType = payload.type || defaultMime;
      } else {
        return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
          navigator.msSaveBlob(dataUrlToBlob(payload), fileName) :
          saver(payload); // everyone else can save dataURLs un-processed
      }

    }//end if dataURL passed?

    blob = payload instanceof myBlob ?
      payload :
      new myBlob([payload], { type: mimeType });


    function dataUrlToBlob(strUrl) {
      var parts = strUrl.split(/[:;,]/),
        type = parts[1],
        decoder = parts[2] == "base64" ? atob : decodeURIComponent,
        binData = decoder(parts.pop()),
        mx = binData.length,
        i = 0,
        uiArr = new Uint8Array(mx);

      for (i; i < mx; ++i) uiArr[i] = binData.charCodeAt(i);

      return new myBlob([uiArr], { type: type });
    }

    function saver(url, winMode) {

      if ('download' in anchor) { //html5 A[download]
        anchor.href = url;
        anchor.setAttribute("download", fileName);
        anchor.className = "download-js-link";
        anchor.innerHTML = "downloading...";
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        setTimeout(function () {
          anchor.click();
          document.body.removeChild(anchor);
          if (winMode === true) { setTimeout(function () { self.URL.revokeObjectURL(anchor.href); }, 250); }
        }, 66);
        return true;
      }

      // handle non-a[download] safari as best we can:
      if (/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
        url = url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
        if (!window.open(url)) { // popup blocked, offer direct download:
          if (confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")) { location.href = url; }
        }
        return true;
      }

      //do iframe dataURL download (old ch+FF):
      var f = document.createElement("iframe");
      document.body.appendChild(f);

      if (!winMode) { // force a mime that will download:
        url = "data:" + url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
      }
      f.src = url;
      setTimeout(function () { document.body.removeChild(f); }, 333);

    }//end saver




    if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
      return navigator.msSaveBlob(blob, fileName);
    }

    if (self.URL) { // simple fast and modern way using Blob and URL:
      saver(self.URL.createObjectURL(blob), true);
    } else {
      // handle non-Blob()+non-URL browsers:
      if (typeof blob === "string" || blob.constructor === toString) {
        try {
          return saver("data:" + mimeType + ";base64," + self.btoa(blob));
        } catch (y) {
          return saver("data:" + mimeType + "," + encodeURIComponent(blob));
        }
      }

      // Blob but not URL support:
      reader = new FileReader();
      reader.onload = function (e) {
        saver(this.result);
      };
      reader.readAsDataURL(blob);
    }
    return true;
  }; /* end download() */
}));
