'use strict';var _typeof='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&'function'==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?'symbol':typeof a};(function(){function a(){function a(a){if(!a)throw new TypeError('timestamp must be defined');if(isNaN(parseInt(a)))throw new TypeError('timestamp must be a number. received'+a);i.rammerhead_synctimestamp=a}function c(){var a=i.rammerhead_synctimestamp,b=parseInt(a);return isNaN(b)?(a&&console.warn('invalid timestamp retrieved from storage: '+a),null):b}function d(){return'/syncLocalStorage?sessionId='+encodeURIComponent(j)+'&origin='+encodeURIComponent(k)}function e(a,c){function e(){if(200!==f.status)throw new Error('server sent a non 200 code. got '+f.status+'. Response: '+f.responseText)}if(!a||'object'!==('undefined'==typeof a?'undefined':_typeof(a)))throw new TypeError('data must be an object');var f=b.createNativeXHR();return f.open('POST',d(),!!c),f.setRequestHeader('content-type','application/json'),f.send(JSON.stringify(a)),c?void(f.onload=function(){e(),c(JSON.parse(f.responseText))}):(e(),JSON.parse(f.responseText))}function f(){if(!l.length)return null;for(var a={},b=0;b<l.length;b++)a[l[b]]=h[l[b]];return l=[],a}var g=!1,h=localStorage,i=h.internal.nativeStorage,j=b.settings._settings.sessionId,k=window.__get$(window,'location').origin,l=[];(function(){function b(a){if(!a||'object'!==('undefined'==typeof a?'undefined':_typeof(a)))throw new TypeError('data must be an object');for(var b in h.clear(),a)h[b]=a[b]}g=!0;var d,f=c();f?(d=e({type:'sync',timestamp:f,data:h}),d.timestamp&&(a(d.timestamp),b(d.data))):(d=e({type:'sync',fetch:!0}),d.timestamp&&(a(d.timestamp),b(d.data))),g=!1})(),h.addChangeEventListener(function(a){g||-1===l.indexOf(a.key)&&l.push(a.key)}),setInterval(function(){var b=f();b&&(e({type:'update',updateData:b},function(b){a(b.timestamp)}),l=[])},5000),document.addEventListener('visibilitychange',function(){if('hidden'===document.visibilityState){var a=f();a&&b.nativeMethods.sendBeacon.call(window.navigator,d(),JSON.stringify({type:'update',updateData:a}))}})}var b=window['%hammerhead%'];if(!b)throw new Error('hammerhead not loaded yet');b.settings._settings.sessionId?a():function(a){var c=b.__proto__.start;b.__proto__.start=function(){c.apply(this,arguments),b.__proto__.start=c,a()}}(a)})();