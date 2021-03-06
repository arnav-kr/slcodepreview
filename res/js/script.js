var manifest = {
    "theme_color": "#1BA68C",
    "background_color": "#ffffff",
    "display": "standalone",
    "scope": "https://arnav-kr.github.io/slcodepreview/",
    "start_url": "https://arnav-kr.github.io/slcodepreview/",
    "orientation": "portrait",
    "name": "SoloLearn Code Previewer and Downloader",
    "short_name": "SL Code Previewer",
    "lang": "en",
    "dir": "ltr",
    "categories": [
        "utilities",
        "devtools"
    ],
    "description": "SoloLearn Code Previewer and downloader is a tool for previewing and downloading the sololearn codes. You just have to Enter The URL of your code.",
    "icons": [
        {
            "src": "../images/maskable/icon_192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
        },
        {
            "src": "../images/maskable/icon_512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
        },
        {
            "src": "../images/maskable/icon_384.png",
            "sizes": "384x384",
            "type": "image/png",
            "purpose": "maskable"
        },
        {
            "src": "../images/maskable/icon_128.png",
            "sizes": "128x128",
            "type": "image/png",
            "purpose": "maskable"
        },
        {
            "src": "../images/maskable/icon.png",
            "sizes": "800x800",
            "type": "image/png",
            "purpose": "maskable"
        },
        {
            "src": "../images/maskable/icon_96.png",
            "sizes": "96x96",
            "type": "image/png",
            "purpose": "maskable"
        },
        {
            "src": "../images/maskable/icon_72.png",
            "sizes": "72x72",
            "type": "image/png",
            "purpose": "maskable"
        },
        {
            "src": "../images/maskable/icon_48.png",
            "sizes": "48x48",
            "type": "image/png",
            "purpose": "maskable"
        },
        {
            "src": "../images/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
        },
        {
            "src": "../images/icon-256x256.png",
            "sizes": "256x256",
            "type": "image/png",
            "purpose": "any"
        },
        {
            "src": "../images/icon-384x384.png",
            "sizes": "384x384",
            "type": "image/png",
            "purpose": "any"
        },
        {
            "src": "../images/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
        }
    ]
};

window.addEventListener("load", _);
function GetCode(id, c) {
  fetch("https://api2.sololearn.com/v2/codeplayground/usercodes/" + id)
    .then((response) => { return response.json(); })
    .then((data) => { c(data.data) })
    .catch(e => {
      Toast("Please Enter A Valid URL", "red");
      id("frame-loader").classList.add("hide");
    });
}
function Code(ev) {
  ev.preventDefault();
  if (!navigator.onLine) {
    Toast("No Internet!","red");
  }
  else {
    id("code-box").value = "";
    id("frame-loader").classList.remove("hide");
    var validated = true;
    var url = ev.target.url.value || " ";
    url = url.endsWith("/?ref=app") ? url.substr(0, url.length - 9) : url;
    url = url.includes("https://code.sololearn.com/") ? url.split("https://code.sololearn.com/")[1] : url;
    url.split("").includes(/[\/|\.|\?|=]/) || url.trim().length == 0 ? validated = false : void 0
    if (!validated) {
      Toast("Please Enter a Valid Code URL!", "red");
      id("frame-loader").classList.add("hide");
    }
    else {
      GetCode(url, data => {
        id("frame-loader").classList.add("hide");
        if (data == null) {
          Toast("Please Enter A Valid URL!", "red");
          id("frame-loader").classList.add("hide");
          return false;
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
          document.title = name;
          id("main-frame").srcdoc = source;
          id("code-box").value = source;
          var dataURI = 'data:text/html,' + encodeURIComponent(source);
          id("launch-in-browser").href = "https://code.sololearn.com/" + publicId;
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
          });
        }
        else {
          Toast("Not a web Code!", "red");
          id("frame-loader").classList.add("hide");
        }
        // console.log(JSON.stringify(data))
      });
    }
  }
}
function id(i) { return document.getElementById(i); }

function _() {
  if (window.location.search && window.location) {
    let query = new URLSearchParams(window.location.search);
    if (query.has("q")) {
      id("url").value = query.get("q");
      id("go").click();
if (query.has("nav")){
      var navBool = query.get("nav");
      if (navBool == false || navBool == 0){
         id("nav").classList.add("hide");
         id("main").style.top = 0;
         id("main").style.height = "100vh";
         id("frame-loader").style.top = 0;
         id("frame-loader").style.height = "100vh";
         id("main-frame").style.top = 0;
         id("main-frame").style.height = "100vh";
      }
      else{
         id("nav").classList.remove("hide");
         id("main").style.top = "3.5rem";
         id("main").style.height = "calc(100vh - 3.5rem)";
         id("frame-loader").style.top = "3.5rem";
         id("frame-loader").style.height = "calc(100vh - 3.5rem)";
         id("main-frame").style.top = "3.5rem";
         id("main-frame").style.height = "calc(100vh - 3.5rem)";
      }
    }
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
  if (!navigator.onLine) {
    Toast("No Internet!","red");
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
