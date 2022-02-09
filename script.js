/*hammerhead|script|start*/if (typeof window !== 'undefined' && window){window['hammerhead|process-dom-method'] && window['hammerhead|process-dom-method']();if (window.__get$ && typeof __get$ === 'undefined')var __get$Loc = window.__get$Loc,__set$Loc = window.__set$Loc,__set$ = window.__set$,__get$ = window.__get$,__call$ = window.__call$,__get$Eval = window.__get$Eval,__proc$Script = window.__proc$Script,__proc$Html = window.__proc$Html,__get$PostMessage = window.__get$PostMessage,__get$ProxyUrl = window.__get$ProxyUrl,__rest$Array = window.__rest$Array,__rest$Object = window.__rest$Object,__arrayFrom$ = window.__arrayFrom$;} else {if (typeof __get$ === 'undefined')var __get$Loc = function(l){return l},__set$Loc = function(l,v){return l = v},__set$ = function(o,p,v){return o[p] = v},__get$ = function(o,p){return o[p]},__call$ = function(o,p,a){return o[p].apply(o,a)},__get$Eval = function(e){return e},__proc$Script = function(s){return s},__proc$Html = function(h){return h},__get$PostMessage = function(w,p){return arguments.length===1?w.postMessage:p},__get$ProxyUrl = function(u,d){return u},__rest$Array = function(a,i){return Array.prototype.slice.call(a, i)},__rest$Object = function(o,p){var k=Object.keys(o),n={};for(var i=0;i<k.length;++i)if(p.indexOf(k[i])<0)n[k[i]]=o[k[i]];return n},__arrayFrom$ = function(r){if(!r)return r;return!Array.isArray(r)&&"function"==typeof r[Symbol.iterator]?Array.from(r):r};if (typeof importScripts !== "undefined" && /\[native code]/g.test(importScripts.toString()))importScripts((location.origin || (location.protocol + "//" + location.host)) + "/worker-hammerhead.js");}/*hammerhead|script|processing-header-end*/
(function () {
    function setError(err) {
        var element = document.getElementById('error-text');
        if (err) {
            element.style.display = 'block';
            element.textContent = 'An error occurred: ' + err;
        } else {
            element.style.display = 'none';
            element.textContent = '';
        }
    }
    function getPassword() {
        var element = document.getElementById('session-password');
        return element ? element.value : '';
    }
    function get(url, callback, shush = false) {
        var pwd = getPassword();
        if (pwd) {
            // really cheap way of adding a query parameter
            if (url.includes('?')) {
                url += '&pwd=' + pwd;
            } else {
                url += '?pwd=' + pwd;
            }
        }

        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.send();

        request.onerror = function () {
            if (!shush) setError('Cannot communicate with the server');
        };
        request.onload = function () {
            if (request.status === 200) {
                callback(request.responseText);
            } else {
                if (!shush)
                    setError(
                        'unexpected server response to not match "200". Server says "' + request.responseText + '"'
                    );
            }
        };
    }

    var api = {
        newsession(callback) {
            get('/newsession', callback);
        },
        editsession(id, httpProxy, callback) {
            get(
                '/editsession?id=' +
                    encodeURIComponent(id) +
                    (httpProxy ? '&httpProxy=' + encodeURIComponent(httpProxy) : ''),
                function (res) {
                    if (res !== 'Success') return setError('unexpected response from server. received ' + res);
                    callback();
                }
            );
        },
        sessionexists(id, callback) {
            get('/sessionexists?id=' + encodeURIComponent(id), function (res) {
                if (res === 'exists') return callback(true);
                if (res === 'not found') return callback(false);
                setError('unexpected response from server. received' + res);
            });
        },
        deletesession(id, callback) {
            api.sessionexists(id, function (exists) {
                if (exists) {
                    get('/deletesession?id=' + id, function (res) {
                        if (res !== 'Success' && res !== 'not found')
                            return setError('unexpected response from server. received ' + res);
                        callback();
                    });
                } else {
                    callback();
                }
            });
        }
    };

    var localStorageKey = 'rammerhead_sessionids';
    var localStorageKeyDefault = 'rammerhead_default_sessionid';
    var sessionIdsStore = {
        get() {
            var rawData = localStorage.getItem(localStorageKey);
            if (!rawData) return [];
            try {
                var data = JSON.parse(rawData);
                if (!Array.isArray(data)) throw 'getout';
                return data;
            } catch (e) {
                return [];
            }
        },
        set(data) {
            if (!data || !Array.isArray(data)) throw new TypeError('must be array');
            localStorage.setItem(localStorageKey, JSON.stringify(data));
        },
        getDefault() {
            var sessionId = localStorage.getItem(localStorageKeyDefault);
            if (sessionId) {
                var data = sessionIdsStore.get();
                data.filter(function (e) {
                    return e.id === sessionId;
                });
                if (data.length) return data[0];
            }
            return null;
        },
        setDefault(id) {
            localStorage.setItem(localStorageKeyDefault, id);
        }
    };

    function renderSessionTable(data) {
        var tbody = document.querySelector('tbody');
        while (tbody.firstChild && !tbody.firstChild.remove());
        for (var i = 0; i < data.length; i++) {
            var tr = document.createElement('tr');
            appendIntoTr( __get$(data,i) .id);
            appendIntoTr( __get$(data,i) .createdOn);

            var fillInBtn = document.createElement('button');
            fillInBtn.textContent = 'Fill in existing session ID';
            fillInBtn.className = 'btn btn-outline-primary';
            fillInBtn.onclick = index(i, function (idx) {
                setError();
                sessionIdsStore.setDefault( __get$(data,idx) .id);
                loadSettings( __get$(data,idx) );
            });
            appendIntoTr(fillInBtn);

            var deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'btn btn-outline-danger';
            deleteBtn.onclick = index(i, function (idx) {
                setError();
                api.deletesession( __get$(data,idx) .id, function () {
                    data.splice(idx, 1)[0];
                    sessionIdsStore.set(data);
                    renderSessionTable(data);
                });
            });
            appendIntoTr(deleteBtn);

            tbody.appendChild(tr);
        }
        function appendIntoTr(stuff) {
            var td = document.createElement('td');
            if (typeof stuff === 'object') {
                td.appendChild(stuff);
            } else {
                td.textContent = stuff;
            }
            tr.appendChild(td);
        }
        function index(i, func) {
            return func.bind(null, i);
        }
    }
    function loadSettings(session) {
        document.getElementById('session-id').value = session.id;
        document.getElementById('session-httpproxy').value = session.httpproxy || '';
    }
    function loadSessions() {
        var sessions = sessionIdsStore.get();
        var defaultSession = sessionIdsStore.getDefault();
        if (defaultSession) loadSettings(defaultSession);
        renderSessionTable(sessions);
    }
    function addSession(id) {
        var data = sessionIdsStore.get();
        data.unshift({ id: id, createdOn: new Date().toLocaleString() });
        sessionIdsStore.set(data);
        renderSessionTable(data);
    }
    function editSession(id, httpproxy) {
        var data = sessionIdsStore.get();
        for (var i = 0; i < data.length; i++) {
            if ( __get$(data,i) .id === id) {
                 __get$(data,i) .httpproxy = httpproxy;
                sessionIdsStore.set(data);
                return;
            }
        }
        throw new TypeError('cannot find ' + id);
    }

    get('/mainport', function (data) {
        var defaultPort =  __get$(window,"location") .protocol === 'https:' ? 443 : 80;
        var currentPort =  __get$(window,"location") .port || defaultPort;
        var mainPort = data || defaultPort;
        if (currentPort != mainPort)  __get$(window,"location") .port = mainPort;
    });

    window.addEventListener('load', function () {
        loadSessions();

        var showingAdvancedOptions = false;
        document.getElementById('session-advanced-toggle').onclick = function () {
            // eslint-disable-next-line no-cond-assign
            document.getElementById('session-advanced-container').style.display = (showingAdvancedOptions =
                !showingAdvancedOptions)
                ? 'block'
                : 'none';
        };

        document.getElementById('session-create-btn').onclick = function () {
            setError();
            api.newsession(function (id) {
                addSession(id);
                document.getElementById('session-id').value = id;
                document.getElementById('session-httpproxy').value = '';
            });
        };
        function go() {
            setError();
            var id = document.getElementById('session-id').value;
            var httpproxy = document.getElementById('session-httpproxy').value;
            var url = document.getElementById('session-url').value || 'https://www.google.com/';
            if (!id) return setError('must generate a session id first');
            api.sessionexists(id, function (value) {
                if (!value) return setError('session does not exist. try deleting or generating a new session');
                api.editsession(id, httpproxy, function () {
                    editSession(id, httpproxy);
                     __set$(__get$(window,"location"),"href",'/'+id+'/'+url) ;
                });
            });
        }
        document.getElementById('session-go').onclick = go;
        document.getElementById('session-url').onkeydown = function (event) {
            if (event.key === 'Enter') go();
        };
    });
})();

/*hammerhead|script|end*/