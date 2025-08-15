var COMPILED = !1
  , goog = goog || {};
goog.global = this,
goog.global.CLOSURE_UNCOMPILED_DEFINES,
goog.global.CLOSURE_DEFINES,
goog.isDef = function(e) {
    return void 0 !== e
}
,
goog.exportPath_ = function(e, t, o) {
    var r, i = e.split("."), s = o || goog.global;
    i[0]in s || !s.execScript || s.execScript("var " + i[0]);
    for (; i.length && (r = i.shift()); )
        !i.length && goog.isDef(t) ? s[r] = t : s = s[r] || (s[r] = {})
}
,
goog.define = function(e, t) {
    COMPILED || (goog.global.CLOSURE_UNCOMPILED_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, e) ? t = goog.global.CLOSURE_UNCOMPILED_DEFINES[e] : goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, e) && (t = goog.global.CLOSURE_DEFINES[e])),
    goog.exportPath_(e, t)
}
,
goog.define("goog.DEBUG", !1),
goog.define("goog.LOCALE", "en"),
goog.define("goog.TRUSTED_SITE", !0),
goog.define("goog.STRICT_MODE_COMPATIBLE", !1),
goog.define("goog.DISALLOW_TEST_ONLY_CODE", COMPILED && !goog.DEBUG),
goog.define("goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING", !1),
goog.provide = function(e) {
    if (!COMPILED && goog.isProvided_(e))
        throw Error('Namespace "' + e + '" already declared.');
    goog.constructNamespace_(e)
}
,
goog.constructNamespace_ = function(e, t) {
    if (!COMPILED) {
        delete goog.implicitNamespaces_[e];
        for (var o = e; (o = o.substring(0, o.lastIndexOf("."))) && !goog.getObjectByName(o); )
            goog.implicitNamespaces_[o] = !0
    }
    goog.exportPath_(e, t)
}
,
goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/,
goog.module = function(e) {
    if (!goog.isString(e) || !e || -1 == e.search(goog.VALID_MODULE_RE_))
        throw Error("Invalid module identifier");
    if (!goog.isInModuleLoader_())
        throw Error("Module " + e + " has been loaded incorrectly.");
    if (goog.moduleLoaderState_.moduleName)
        throw Error("goog.module may only be called once per module.");
    if (goog.moduleLoaderState_.moduleName = e,
    !COMPILED) {
        if (goog.isProvided_(e))
            throw Error('Namespace "' + e + '" already declared.');
        delete goog.implicitNamespaces_[e]
    }
}
,
goog.module.get = function(e) {
    return goog.module.getInternal_(e)
}
,
goog.module.getInternal_ = function(e) {
    if (!COMPILED)
        return goog.isProvided_(e) ? e in goog.loadedModules_ ? goog.loadedModules_[e] : goog.getObjectByName(e) : null
}
,
goog.moduleLoaderState_ = null,
goog.isInModuleLoader_ = function() {
    return null != goog.moduleLoaderState_
}
,
goog.module.declareLegacyNamespace = function() {
    if (!COMPILED && !goog.isInModuleLoader_())
        throw new Error("goog.module.declareLegacyNamespace must be called from within a goog.module");
    if (!COMPILED && !goog.moduleLoaderState_.moduleName)
        throw Error("goog.module must be called prior to goog.module.declareLegacyNamespace.");
    goog.moduleLoaderState_.declareLegacyNamespace = !0
}
,
goog.setTestOnly = function(e) {
    if (goog.DISALLOW_TEST_ONLY_CODE)
        throw e = e || "",
        Error("Importing test-only code into non-debug environment" + (e ? ": " + e : "."))
}
,
goog.forwardDeclare = function(e) {}
,
goog.forwardDeclare("Document"),
goog.forwardDeclare("XMLHttpRequest"),
COMPILED || (goog.isProvided_ = function(e) {
    return e in goog.loadedModules_ || !goog.implicitNamespaces_[e] && goog.isDefAndNotNull(goog.getObjectByName(e))
}
,
goog.implicitNamespaces_ = {
    "goog.module": !0
}),
goog.getObjectByName = function(e, t) {
    for (var o, r = e.split("."), i = t || goog.global; o = r.shift(); ) {
        if (!goog.isDefAndNotNull(i[o]))
            return null;
        i = i[o]
    }
    return i
}
,
goog.globalize = function(e, t) {
    var o, r = t || goog.global;
    for (o in e)
        r[o] = e[o]
}
,
goog.addDependency = function(e, t, o, r) {
    if (goog.DEPENDENCIES_ENABLED) {
        for (var i, s, a = e.replace(/\\/g, "/"), g = goog.dependencies_, n = 0; i = t[n]; n++)
            g.nameToPath[i] = a,
            g.pathIsModule[a] = !!r;
        for (var l = 0; s = o[l]; l++)
            a in g.requires || (g.requires[a] = {}),
            g.requires[a][s] = !0
    }
}
,
goog.define("goog.ENABLE_DEBUG_LOADER", !0),
goog.logToConsole_ = function(e) {
    goog.global.console && goog.global.console.error(e)
}
,
goog.require = function(e) {
    if (!COMPILED) {
        if (goog.ENABLE_DEBUG_LOADER && goog.IS_OLD_IE_ && goog.maybeProcessDeferredDep_(e),
        goog.isProvided_(e))
            return goog.isInModuleLoader_() ? goog.module.getInternal_(e) : null;
        if (goog.ENABLE_DEBUG_LOADER) {
            var t = goog.getPathFromDeps_(e);
            if (t)
                return goog.included_[t] = !0,
                goog.writeScripts_(),
                null
        }
        e = "goog.require could not find: " + e;
        throw goog.logToConsole_(e),
        Error(e)
    }
}
,
goog.basePath = "",
goog.global.CLOSURE_BASE_PATH,
goog.global.CLOSURE_NO_DEPS,
goog.global.CLOSURE_IMPORT_SCRIPT,
goog.nullFunction = function() {}
,
goog.abstractMethod = function() {
    throw Error("unimplemented abstract method")
}
,
goog.addSingletonGetter = function(e) {
    e.getInstance = function() {
        return e.instance_ || (goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = e),
        e.instance_ = new e)
    }
}
,
goog.instantiatedSingletons_ = [],
goog.define("goog.LOAD_MODULE_USING_EVAL", !0),
goog.define("goog.SEAL_MODULE_EXPORTS", goog.DEBUG),
goog.loadedModules_ = {},
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER,
goog.DEPENDENCIES_ENABLED && (goog.included_ = {},
goog.dependencies_ = {
    pathIsModule: {},
    nameToPath: {},
    requires: {},
    visited: {},
    written: {},
    deferred: {}
},
goog.inHtmlDocument_ = function() {
    var e = goog.global.document;
    return void 0 !== e && "write"in e
}
,
goog.findBasePath_ = function() {
    if (goog.isDef(goog.global.CLOSURE_BASE_PATH))
        goog.basePath = goog.global.CLOSURE_BASE_PATH;
    else if (goog.inHtmlDocument_())
        for (var e = goog.global.document.getElementsByTagName("SCRIPT"), t = e.length - 1; 0 <= t; --t) {
            var o = e[t].src
              , r = o.lastIndexOf("?")
              , r = -1 == r ? o.length : r;
            if ("base.js" == o.substr(r - 7, 7))
                return void (goog.basePath = o.substr(0, r - 7))
        }
}
,
goog.importScript_ = function(e, t) {
    (goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_)(e, t) && (goog.dependencies_.written[e] = !0)
}
,
goog.IS_OLD_IE_ = !(goog.global.atob || !goog.global.document || !goog.global.document.all),
goog.importModule_ = function(e) {
    goog.importScript_("", 'goog.retrieveAndExecModule_("' + e + '");') && (goog.dependencies_.written[e] = !0)
}
,
goog.queuedModules_ = [],
goog.wrapModule_ = function(e, t) {
    return goog.LOAD_MODULE_USING_EVAL && goog.isDef(goog.global.JSON) ? "goog.loadModule(" + goog.global.JSON.stringify(t + "\n//# sourceURL=" + e + "\n") + ");" : 'goog.loadModule(function(exports) {"use strict";' + t + "\n;return exports});\n//# sourceURL=" + e + "\n"
}
,
goog.loadQueuedModules_ = function() {
    var e = goog.queuedModules_.length;
    if (0 < e) {
        var t = goog.queuedModules_;
        goog.queuedModules_ = [];
        for (var o = 0; o < e; o++) {
            var r = t[o];
            goog.maybeProcessDeferredPath_(r)
        }
    }
}
,
goog.maybeProcessDeferredDep_ = function(e) {
    goog.isDeferredModule_(e) && goog.allDepsAreAvailable_(e) && (e = goog.getPathFromDeps_(e),
    goog.maybeProcessDeferredPath_(goog.basePath + e))
}
,
goog.isDeferredModule_ = function(e) {
    e = goog.getPathFromDeps_(e);
    return !(!e || !goog.dependencies_.pathIsModule[e]) && goog.basePath + e in goog.dependencies_.deferred
}
,
goog.allDepsAreAvailable_ = function(e) {
    e = goog.getPathFromDeps_(e);
    if (e && e in goog.dependencies_.requires)
        for (var t in goog.dependencies_.requires[e])
            if (!goog.isProvided_(t) && !goog.isDeferredModule_(t))
                return !1;
    return !0
}
,
goog.maybeProcessDeferredPath_ = function(e) {
    var t;
    e in goog.dependencies_.deferred && (t = goog.dependencies_.deferred[e],
    delete goog.dependencies_.deferred[e],
    goog.globalEval(t))
}
,
goog.loadModule = function(e) {
    var t, o = goog.moduleLoaderState_;
    try {
        if (goog.moduleLoaderState_ = {
            moduleName: void 0
        },
        goog.isFunction(e))
            t = e.call(goog.global, {});
        else {
            if (!goog.isString(e))
                throw Error("Invalid module definition");
            t = goog.loadModuleFromSource_.call(goog.global, e)
        }
        var r = goog.moduleLoaderState_.moduleName;
        if (!goog.isString(r) || !r)
            throw Error('Invalid module name "' + r + '"');
        goog.moduleLoaderState_.declareLegacyNamespace ? goog.constructNamespace_(r, t) : goog.SEAL_MODULE_EXPORTS && Object.seal && Object.seal(t),
        goog.loadedModules_[r] = t
    } finally {
        goog.moduleLoaderState_ = o
    }
}
,
goog.loadModuleFromSource_ = function() {
    var exports = {};
    return eval(arguments[0]),
    exports
}
,
goog.writeScriptSrcNode_ = function(e) {
    goog.global.document.write('<script type="text/javascript" src="' + e + '"><\/script>')
}
,
goog.appendScriptSrcNode_ = function(e) {
    var t = goog.global.document
      , o = t.createElement("script");
    o.type = "text/javascript",
    o.src = e,
    o.defer = !1,
    o.async = !1,
    t.head.appendChild(o)
}
,
goog.writeScriptTag_ = function(e, t) {
    if (goog.inHtmlDocument_()) {
        var o = goog.global.document;
        if (!goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING && "complete" == o.readyState) {
            if (/\bdeps.js$/.test(e))
                return !1;
            throw Error('Cannot write "' + e + '" after document load')
        }
        var r = goog.IS_OLD_IE_;
        return void 0 === t ? r ? (r = " onreadystatechange='goog.onScriptLoad_(this, " + ++goog.lastNonModuleScriptIndex_ + ")' ",
        o.write('<script type="text/javascript" src="' + e + '"' + r + "><\/script>")) : goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING ? goog.appendScriptSrcNode_(e) : goog.writeScriptSrcNode_(e) : o.write('<script type="text/javascript">' + t + "<\/script>"),
        !0
    }
    return !1
}
,
goog.lastNonModuleScriptIndex_ = 0,
goog.onScriptLoad_ = function(e, t) {
    return "complete" == e.readyState && goog.lastNonModuleScriptIndex_ == t && goog.loadQueuedModules_(),
    !0
}
,
goog.writeScripts_ = function() {
    var r = []
      , i = {}
      , s = goog.dependencies_;
    for (t in goog.included_)
        s.written[t] || !function e(t) {
            if (!(t in s.written))
                if (t in s.visited)
                    t in i || (i[t] = !0,
                    r.push(t));
                else {
                    if (s.visited[t] = !0,
                    t in s.requires)
                        for (var o in s.requires[t])
                            if (!goog.isProvided_(o)) {
                                if (!(o in s.nameToPath))
                                    throw Error("Undefined nameToPath for " + o);
                                e(s.nameToPath[o])
                            }
                    t in i || (i[t] = !0,
                    r.push(t))
                }
        }(t);
    for (var e = 0; e < r.length; e++) {
        var t = r[e];
        goog.dependencies_.written[t] = !0
    }
    var o = goog.moduleLoaderState_;
    goog.moduleLoaderState_ = null;
    for (e = 0; e < r.length; e++) {
        if (!(t = r[e]))
            throw goog.moduleLoaderState_ = o,
            Error("Undefined script input");
        s.pathIsModule[t] ? goog.importModule_(goog.basePath + t) : goog.importScript_(goog.basePath + t)
    }
    goog.moduleLoaderState_ = o
}
,
goog.getPathFromDeps_ = function(e) {
    return e in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[e] : null
}
,
goog.findBasePath_(),
goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js")),
goog.normalizePath_ = function(e) {
    for (var t = e.split("/"), o = 0; o < t.length; )
        "." == t[o] ? t.splice(o, 1) : o && ".." == t[o] && t[o - 1] && ".." != t[o - 1] ? t.splice(--o, 2) : o++;
    return t.join("/")
}
,
goog.loadFileSync_ = function(e) {
    if (goog.global.CLOSURE_LOAD_FILE_SYNC)
        return goog.global.CLOSURE_LOAD_FILE_SYNC(e);
    var t = new goog.global.XMLHttpRequest;
    return t.open("get", e, !1),
    t.send(),
    t.responseText
}
,
goog.retrieveAndExecModule_ = function(e) {
    if (!COMPILED) {
        var t = e;
        e = goog.normalizePath_(e);
        var o = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_
          , r = goog.loadFileSync_(e);
        if (null == r)
            throw new Error("load of " + e + "failed");
        r = goog.wrapModule_(e, r);
        goog.IS_OLD_IE_ ? (goog.dependencies_.deferred[t] = r,
        goog.queuedModules_.push(t)) : o(e, r)
    }
}
,
goog.typeOf = function(e) {
    var t = typeof e;
    if ("object" == t) {
        if (!e)
            return "null";
        if (e instanceof Array)
            return "array";
        if (e instanceof Object)
            return t;
        var o = Object.prototype.toString.call(e);
        if ("[object Window]" == o)
            return "object";
        if ("[object Array]" == o || "number" == typeof e.length && void 0 !== e.splice && void 0 !== e.propertyIsEnumerable && !e.propertyIsEnumerable("splice"))
            return "array";
        if ("[object Function]" == o || void 0 !== e.call && void 0 !== e.propertyIsEnumerable && !e.propertyIsEnumerable("call"))
            return "function"
    } else if ("function" == t && void 0 === e.call)
        return "object";
    return t
}
,
goog.isNull = function(e) {
    return null === e
}
,
goog.isDefAndNotNull = function(e) {
    return null != e
}
,
goog.isArray = function(e) {
    return "array" == goog.typeOf(e)
}
,
goog.isArrayLike = function(e) {
    var t = goog.typeOf(e);
    return "array" == t || "object" == t && "number" == typeof e.length
}
,
goog.isDateLike = function(e) {
    return goog.isObject(e) && "function" == typeof e.getFullYear
}
,
goog.isString = function(e) {
    return "string" == typeof e
}
,
goog.isBoolean = function(e) {
    return "boolean" == typeof e
}
,
goog.isNumber = function(e) {
    return "number" == typeof e
}
,
goog.isFunction = function(e) {
    return "function" == goog.typeOf(e)
}
,
goog.isObject = function(e) {
    var t = typeof e;
    return "object" == t && null != e || "function" == t
}
,
goog.getUid = function(e) {
    return e[goog.UID_PROPERTY_] || (e[goog.UID_PROPERTY_] = ++goog.uidCounter_)
}
,
goog.hasUid = function(e) {
    return !!e[goog.UID_PROPERTY_]
}
,
goog.removeUid = function(e) {
    "removeAttribute"in e && e.removeAttribute(goog.UID_PROPERTY_);
    try {
        delete e[goog.UID_PROPERTY_]
    } catch (e) {}
}
,
goog.UID_PROPERTY_ = "closure_uid_" + (1e9 * Math.random() >>> 0),
goog.uidCounter_ = 0,
goog.getHashCode = goog.getUid,
goog.removeHashCode = goog.removeUid,
goog.cloneObject = function(e) {
    var t = goog.typeOf(e);
    if ("object" != t && "array" != t)
        return e;
    if (e.clone)
        return e.clone();
    var o, r = "array" == t ? [] : {};
    for (o in e)
        r[o] = goog.cloneObject(e[o]);
    return r
}
,
goog.bindNative_ = function(e, t, o) {
    return e.call.apply(e.bind, arguments)
}
,
goog.bindJs_ = function(t, o, e) {
    if (!t)
        throw new Error;
    if (2 < arguments.length) {
        var r = Array.prototype.slice.call(arguments, 2);
        return function() {
            var e = Array.prototype.slice.call(arguments);
            return Array.prototype.unshift.apply(e, r),
            t.apply(o, e)
        }
    }
    return function() {
        return t.apply(o, arguments)
    }
}
,
goog.bind = function(e, t, o) {
    return Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_,
    goog.bind.apply(null, arguments)
}
,
goog.partial = function(t, e) {
    var o = Array.prototype.slice.call(arguments, 1);
    return function() {
        var e = o.slice();
        return e.push.apply(e, arguments),
        t.apply(this, e)
    }
}
,
goog.mixin = function(e, t) {
    for (var o in t)
        e[o] = t[o]
}
,
goog.now = goog.TRUSTED_SITE && Date.now || function() {
    return +new Date
}
,
goog.globalEval = function(e) {
    if (goog.global.execScript)
        goog.global.execScript(e, "JavaScript");
    else {
        if (!goog.global.eval)
            throw Error("goog.globalEval not available");
        if (null == goog.evalWorksForGlobals_)
            if (goog.global.eval("var _evalTest_ = 1;"),
            void 0 !== goog.global._evalTest_) {
                try {
                    delete goog.global._evalTest_
                } catch (e) {}
                goog.evalWorksForGlobals_ = !0
            } else
                goog.evalWorksForGlobals_ = !1;
        var t, o;
        goog.evalWorksForGlobals_ ? goog.global.eval(e) : ((o = (t = goog.global.document).createElement("SCRIPT")).type = "text/javascript",
        o.defer = !1,
        o.appendChild(t.createTextNode(e)),
        t.body.appendChild(o),
        t.body.removeChild(o))
    }
}
,
goog.evalWorksForGlobals_ = null,
goog.cssNameMapping_,
goog.cssNameMappingStyle_,
goog.getCssName = function(e, t) {
    function i(e) {
        return goog.cssNameMapping_[e] || e
    }
    var o = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? i : function(e) {
        for (var t = e.split("-"), o = [], r = 0; r < t.length; r++)
            o.push(i(t[r]));
        return o.join("-")
    }
    : function(e) {
        return e
    }
    ;
    return t ? e + "-" + o(t) : o(e)
}
,
goog.setCssNameMapping = function(e, t) {
    goog.cssNameMapping_ = e,
    goog.cssNameMappingStyle_ = t
}
,
goog.global.CLOSURE_CSS_NAME_MAPPING,
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING),
goog.getMsg = function(e, o) {
    return e = o ? e.replace(/\{\$([^}]+)}/g, function(e, t) {
        return t in o ? o[t] : e
    }) : e
}
,
goog.getMsgWithFallback = function(e, t) {
    return e
}
,
goog.exportSymbol = function(e, t, o) {
    goog.exportPath_(e, t, o)
}
,
goog.exportProperty = function(e, t, o) {
    e[t] = o
}
,
goog.inherits = function(e, s) {
    function t() {}
    t.prototype = s.prototype,
    e.superClass_ = s.prototype,
    e.prototype = new t,
    (e.prototype.constructor = e).base = function(e, t, o) {
        for (var r = new Array(arguments.length - 2), i = 2; i < arguments.length; i++)
            r[i - 2] = arguments[i];
        return s.prototype[t].apply(e, r)
    }
}
,
goog.base = function(e, t, o) {
    var r = arguments.callee.caller;
    if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !r)
        throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
    if (r.superClass_) {
        for (var i = new Array(arguments.length - 1), s = 1; s < arguments.length; s++)
            i[s - 1] = arguments[s];
        return r.superClass_.constructor.apply(e, i)
    }
    for (var a = new Array(arguments.length - 2), s = 2; s < arguments.length; s++)
        a[s - 2] = arguments[s];
    for (var g = !1, n = e.constructor; n; n = n.superClass_ && n.superClass_.constructor)
        if (n.prototype[t] === r)
            g = !0;
        else if (g)
            return n.prototype[t].apply(e, a);
    if (e[t] === r)
        return e.constructor.prototype[t].apply(e, a);
    throw Error("goog.base called from a method of one name to a method of a different name")
}
,
goog.scope = function(e) {
    e.call(goog.global)
}
,
COMPILED || (goog.global.COMPILED = COMPILED),
goog.defineClass = function(e, t) {
    var o = t.constructor
      , r = t.statics;
    o && o != Object.prototype.constructor || (o = function() {
        throw Error("cannot instantiate an interface (no constructor defined).")
    }
    );
    o = goog.defineClass.createSealingConstructor_(o, e);
    return e && goog.inherits(o, e),
    delete t.constructor,
    delete t.statics,
    goog.defineClass.applyProperties_(o.prototype, t),
    null != r && (r instanceof Function ? r(o) : goog.defineClass.applyProperties_(o, r)),
    o
}
,
goog.defineClass.ClassDescriptor,
goog.define("goog.defineClass.SEAL_CLASS_INSTANCES", goog.DEBUG),
goog.defineClass.createSealingConstructor_ = function(t, e) {
    if (goog.defineClass.SEAL_CLASS_INSTANCES && Object.seal instanceof Function) {
        if (e && e.prototype && e.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_])
            return t;
        var o = function() {
            var e = t.apply(this, arguments) || this;
            return e[goog.UID_PROPERTY_] = e[goog.UID_PROPERTY_],
            this.constructor === o && Object.seal(e),
            e
        };
        return o
    }
    return t
}
,
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"],
goog.defineClass.applyProperties_ = function(e, t) {
    for (var o in t)
        Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
    for (var r = 0; r < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; r++)
        o = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[r],
        Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o])
}
,
goog.tagUnsealableClass = function(e) {
    !COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES && (e.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = !0)
}
,
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable",
goog.provide("goog.dom.NodeType"),
goog.dom.NodeType = {
    ELEMENT: 1,
    ATTRIBUTE: 2,
    TEXT: 3,
    CDATA_SECTION: 4,
    ENTITY_REFERENCE: 5,
    ENTITY: 6,
    PROCESSING_INSTRUCTION: 7,
    COMMENT: 8,
    DOCUMENT: 9,
    DOCUMENT_TYPE: 10,
    DOCUMENT_FRAGMENT: 11,
    NOTATION: 12
},
goog.provide("goog.debug.Error"),
goog.debug.Error = function(e) {
    var t;
    Error.captureStackTrace ? Error.captureStackTrace(this, goog.debug.Error) : (t = (new Error).stack) && (this.stack = t),
    e && (this.message = String(e)),
    this.reportErrorToServer = !0
}
,
goog.inherits(goog.debug.Error, Error),
goog.debug.Error.prototype.name = "CustomError",
goog.provide("goog.string"),
goog.provide("goog.string.Unicode"),
goog.define("goog.string.DETECT_DOUBLE_ESCAPING", !1),
goog.define("goog.string.FORCE_NON_DOM_HTML_UNESCAPING", !1),
goog.string.Unicode = {
    NBSP: " "
},
goog.string.startsWith = function(e, t) {
    return 0 == e.lastIndexOf(t, 0)
}
,
goog.string.endsWith = function(e, t) {
    var o = e.length - t.length;
    return 0 <= o && e.indexOf(t, o) == o
}
,
goog.string.caseInsensitiveStartsWith = function(e, t) {
    return 0 == goog.string.caseInsensitiveCompare(t, e.substr(0, t.length))
}
,
goog.string.caseInsensitiveEndsWith = function(e, t) {
    return 0 == goog.string.caseInsensitiveCompare(t, e.substr(e.length - t.length, t.length))
}
,
goog.string.caseInsensitiveEquals = function(e, t) {
    return e.toLowerCase() == t.toLowerCase()
}
,
goog.string.subs = function(e, t) {
    for (var o = e.split("%s"), r = "", i = Array.prototype.slice.call(arguments, 1); i.length && 1 < o.length; )
        r += o.shift() + i.shift();
    return r + o.join("%s")
}
,
goog.string.collapseWhitespace = function(e) {
    return e.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
}
,
goog.string.isEmptyOrWhitespace = function(e) {
    return /^[\s\xa0]*$/.test(e)
}
,
goog.string.isEmptyString = function(e) {
    return 0 == e.length
}
,
goog.string.isEmpty = goog.string.isEmptyOrWhitespace,
goog.string.isEmptyOrWhitespaceSafe = function(e) {
    return goog.string.isEmptyOrWhitespace(goog.string.makeSafe(e))
}
,
goog.string.isEmptySafe = goog.string.isEmptyOrWhitespaceSafe,
goog.string.isBreakingWhitespace = function(e) {
    return !/[^\t\n\r ]/.test(e)
}
,
goog.string.isAlpha = function(e) {
    return !/[^a-zA-Z]/.test(e)
}
,
goog.string.isNumeric = function(e) {
    return !/[^0-9]/.test(e)
}
,
goog.string.isAlphaNumeric = function(e) {
    return !/[^a-zA-Z0-9]/.test(e)
}
,
goog.string.isSpace = function(e) {
    return " " == e
}
,
goog.string.isUnicodeChar = function(e) {
    return 1 == e.length && " " <= e && e <= "~" || "" <= e && e <= "�"
}
,
goog.string.stripNewlines = function(e) {
    return e.replace(/(\r\n|\r|\n)+/g, " ")
}
,
goog.string.canonicalizeNewlines = function(e) {
    return e.replace(/(\r\n|\r|\n)/g, "\n")
}
,
goog.string.normalizeWhitespace = function(e) {
    return e.replace(/\xa0|\s/g, " ")
}
,
goog.string.normalizeSpaces = function(e) {
    return e.replace(/\xa0|[ \t]+/g, " ")
}
,
goog.string.collapseBreakingSpaces = function(e) {
    return e.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
}
,
goog.string.trim = goog.TRUSTED_SITE && String.prototype.trim ? function(e) {
    return e.trim()
}
: function(e) {
    return e.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
}
,
goog.string.trimLeft = function(e) {
    return e.replace(/^[\s\xa0]+/, "")
}
,
goog.string.trimRight = function(e) {
    return e.replace(/[\s\xa0]+$/, "")
}
,
goog.string.caseInsensitiveCompare = function(e, t) {
    e = String(e).toLowerCase(),
    t = String(t).toLowerCase();
    return e < t ? -1 : e == t ? 0 : 1
}
,
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g,
goog.string.numerateCompare = function(e, t) {
    if (e == t)
        return 0;
    if (!e)
        return -1;
    if (!t)
        return 1;
    for (var o = e.toLowerCase().match(goog.string.numerateCompareRegExp_), r = t.toLowerCase().match(goog.string.numerateCompareRegExp_), i = Math.min(o.length, r.length), s = 0; s < i; s++) {
        var a = o[s]
          , g = r[s];
        if (a != g) {
            var n = parseInt(a, 10);
            if (!isNaN(n)) {
                var l = parseInt(g, 10);
                if (!isNaN(l) && n - l)
                    return n - l
            }
            return a < g ? -1 : 1
        }
    }
    return o.length != r.length ? o.length - r.length : e < t ? -1 : 1
}
,
goog.string.urlEncode = function(e) {
    return encodeURIComponent(String(e))
}
,
goog.string.urlDecode = function(e) {
    return decodeURIComponent(e.replace(/\+/g, " "))
}
,
goog.string.newLineToBr = function(e, t) {
    return e.replace(/(\r\n|\r|\n)/g, t ? "<br />" : "<br>")
}
,
goog.string.htmlEscape = function(e, t) {
    return t ? (e = e.replace(goog.string.AMP_RE_, "&amp;").replace(goog.string.LT_RE_, "&lt;").replace(goog.string.GT_RE_, "&gt;").replace(goog.string.QUOT_RE_, "&quot;").replace(goog.string.SINGLE_QUOTE_RE_, "&#39;").replace(goog.string.NULL_RE_, "&#0;"),
    goog.string.DETECT_DOUBLE_ESCAPING ? e.replace(goog.string.E_RE_, "&#101;") : e) : goog.string.ALL_RE_.test(e) ? (-1 != (e = -1 != (e = -1 != (e = -1 != (e = -1 != (e = -1 != e.indexOf("&") ? e.replace(goog.string.AMP_RE_, "&amp;") : e).indexOf("<") ? e.replace(goog.string.LT_RE_, "&lt;") : e).indexOf(">") ? e.replace(goog.string.GT_RE_, "&gt;") : e).indexOf('"') ? e.replace(goog.string.QUOT_RE_, "&quot;") : e).indexOf("'") ? e.replace(goog.string.SINGLE_QUOTE_RE_, "&#39;") : e).indexOf("\0") && (e = e.replace(goog.string.NULL_RE_, "&#0;")),
    goog.string.DETECT_DOUBLE_ESCAPING && -1 != e.indexOf("e") ? e.replace(goog.string.E_RE_, "&#101;") : e) : e
}
,
goog.string.AMP_RE_ = /&/g,
goog.string.LT_RE_ = /</g,
goog.string.GT_RE_ = />/g,
goog.string.QUOT_RE_ = /"/g,
goog.string.SINGLE_QUOTE_RE_ = /'/g,
goog.string.NULL_RE_ = /\x00/g,
goog.string.E_RE_ = /e/g,
goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/,
goog.string.unescapeEntities = function(e) {
    return goog.string.contains(e, "&") ? !goog.string.FORCE_NON_DOM_HTML_UNESCAPING && "document"in goog.global ? goog.string.unescapeEntitiesUsingDom_(e) : goog.string.unescapePureXmlEntities_(e) : e
}
,
goog.string.unescapeEntitiesWithDocument = function(e, t) {
    return goog.string.contains(e, "&") ? goog.string.unescapeEntitiesUsingDom_(e, t) : e
}
,
goog.string.unescapeEntitiesUsingDom_ = function(e, t) {
    var r = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"'
    }
      , i = (t || goog.global.document).createElement("div");
    return e.replace(goog.string.HTML_ENTITY_PATTERN_, function(e, t) {
        var o = r[e];
        return o || ("#" == t.charAt(0) && (t = Number("0" + t.substr(1)),
        isNaN(t) || (o = String.fromCharCode(t))),
        o || (i.innerHTML = e + " ",
        o = i.firstChild.nodeValue.slice(0, -1)),
        r[e] = o)
    })
}
,
goog.string.unescapePureXmlEntities_ = function(e) {
    return e.replace(/&([^;]+);/g, function(e, t) {
        switch (t) {
        case "amp":
            return "&";
        case "lt":
            return "<";
        case "gt":
            return ">";
        case "quot":
            return '"';
        default:
            if ("#" == t.charAt(0)) {
                var o = Number("0" + t.substr(1));
                if (!isNaN(o))
                    return String.fromCharCode(o)
            }
            return e
        }
    })
}
,
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g,
goog.string.whitespaceEscape = function(e, t) {
    return goog.string.newLineToBr(e.replace(/  /g, " &#160;"), t)
}
,
goog.string.preserveSpaces = function(e) {
    return e.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP)
}
,
goog.string.stripQuotes = function(e, t) {
    for (var o = t.length, r = 0; r < o; r++) {
        var i = 1 == o ? t : t.charAt(r);
        if (e.charAt(0) == i && e.charAt(e.length - 1) == i)
            return e.substring(1, e.length - 1)
    }
    return e
}
,
goog.string.truncate = function(e, t, o) {
    return (e = o ? goog.string.unescapeEntities(e) : e).length > t && (e = e.substring(0, t - 3) + "..."),
    e = o ? goog.string.htmlEscape(e) : e
}
,
goog.string.truncateMiddle = function(e, t, o, r) {
    var i;
    return o && (e = goog.string.unescapeEntities(e)),
    r && e.length > t ? (i = e.length - (r = t < r ? t : r),
    e = e.substring(0, t - r) + "..." + e.substring(i)) : e.length > t && (r = Math.floor(t / 2),
    i = e.length - r,
    e = e.substring(0, r += t % 2) + "..." + e.substring(i)),
    e = o ? goog.string.htmlEscape(e) : e
}
,
goog.string.specialEscapeChars_ = {
    "\0": "\\0",
    "\b": "\\b",
    "\f": "\\f",
    "\n": "\\n",
    "\r": "\\r",
    "\t": "\\t",
    "\v": "\\x0B",
    '"': '\\"',
    "\\": "\\\\"
},
goog.string.jsEscapeCache_ = {
    "'": "\\'"
},
goog.string.quote = function(e) {
    if ((e = String(e)).quote)
        return e.quote();
    for (var t = ['"'], o = 0; o < e.length; o++) {
        var r = e.charAt(o)
          , i = r.charCodeAt(0);
        t[o + 1] = goog.string.specialEscapeChars_[r] || (31 < i && i < 127 ? r : goog.string.escapeChar(r))
    }
    return t.push('"'),
    t.join("")
}
,
goog.string.escapeString = function(e) {
    for (var t = [], o = 0; o < e.length; o++)
        t[o] = goog.string.escapeChar(e.charAt(o));
    return t.join("")
}
,
goog.string.escapeChar = function(e) {
    if (e in goog.string.jsEscapeCache_)
        return goog.string.jsEscapeCache_[e];
    if (e in goog.string.specialEscapeChars_)
        return goog.string.jsEscapeCache_[e] = goog.string.specialEscapeChars_[e];
    var t = e
      , o = e.charCodeAt(0);
    return 31 < o && o < 127 ? t = e : (o < 256 ? (t = "\\x",
    (o < 16 || 256 < o) && (t += "0")) : (t = "\\u",
    o < 4096 && (t += "0")),
    t += o.toString(16).toUpperCase()),
    goog.string.jsEscapeCache_[e] = t
}
,
goog.string.contains = function(e, t) {
    return -1 != e.indexOf(t)
}
,
goog.string.caseInsensitiveContains = function(e, t) {
    return goog.string.contains(e.toLowerCase(), t.toLowerCase())
}
,
goog.string.countOf = function(e, t) {
    return e && t ? e.split(t).length - 1 : 0
}
,
goog.string.removeAt = function(e, t, o) {
    var r = e;
    return r = 0 <= t && t < e.length && 0 < o ? e.substr(0, t) + e.substr(t + o, e.length - t - o) : r
}
,
goog.string.remove = function(e, t) {
    t = new RegExp(goog.string.regExpEscape(t),"");
    return e.replace(t, "")
}
,
goog.string.removeAll = function(e, t) {
    t = new RegExp(goog.string.regExpEscape(t),"g");
    return e.replace(t, "")
}
,
goog.string.regExpEscape = function(e) {
    return String(e).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
}
,
goog.string.repeat = function(e, t) {
    return new Array(t + 1).join(e)
}
,
goog.string.padNumber = function(e, t, o) {
    o = goog.isDef(o) ? e.toFixed(o) : String(e),
    e = o.indexOf(".");
    return -1 == e && (e = o.length),
    goog.string.repeat("0", Math.max(0, t - e)) + o
}
,
goog.string.makeSafe = function(e) {
    return null == e ? "" : String(e)
}
,
goog.string.buildString = function(e) {
    return Array.prototype.join.call(arguments, "")
}
,
goog.string.getRandomString = function() {
    var e = 2147483648;
    return Math.floor(Math.random() * e).toString(36) + Math.abs(Math.floor(Math.random() * e) ^ goog.now()).toString(36)
}
,
goog.string.compareVersions = function(e, t) {
    for (var o = 0, r = goog.string.trim(String(e)).split("."), i = goog.string.trim(String(t)).split("."), s = Math.max(r.length, i.length), a = 0; 0 == o && a < s; a++) {
        var g = r[a] || ""
          , n = i[a] || ""
          , l = new RegExp("(\\d*)(\\D*)","g")
          , u = new RegExp("(\\d*)(\\D*)","g");
        do {
            var c = l.exec(g) || ["", "", ""]
              , p = u.exec(n) || ["", "", ""];
            if (0 == c[0].length && 0 == p[0].length)
                break;
            var d = 0 == c[1].length ? 0 : parseInt(c[1], 10)
              , m = 0 == p[1].length ? 0 : parseInt(p[1], 10)
              , o = goog.string.compareElements_(d, m) || goog.string.compareElements_(0 == c[2].length, 0 == p[2].length) || goog.string.compareElements_(c[2], p[2])
        } while (0 == o)
    }
    return o
}
,
goog.string.compareElements_ = function(e, t) {
    return e < t ? -1 : t < e ? 1 : 0
}
,
goog.string.HASHCODE_MAX_ = 4294967296,
goog.string.hashCode = function(e) {
    for (var t = 0, o = 0; o < e.length; ++o)
        t = 31 * t + e.charCodeAt(o),
        t %= goog.string.HASHCODE_MAX_;
    return t
}
,
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0,
goog.string.createUniqueString = function() {
    return "goog_" + goog.string.uniqueStringCounter_++
}
,
goog.string.toNumber = function(e) {
    var t = Number(e);
    return 0 == t && goog.string.isEmptyOrWhitespace(e) ? NaN : t
}
,
goog.string.isLowerCamelCase = function(e) {
    return /^[a-z]+([A-Z][a-z]*)*$/.test(e)
}
,
goog.string.isUpperCamelCase = function(e) {
    return /^([A-Z][a-z]*)+$/.test(e)
}
,
goog.string.toCamelCase = function(e) {
    return String(e).replace(/\-([a-z])/g, function(e, t) {
        return t.toUpperCase()
    })
}
,
goog.string.toSelectorCase = function(e) {
    return String(e).replace(/([A-Z])/g, "-$1").toLowerCase()
}
,
goog.string.toTitleCase = function(e, t) {
    t = (t = goog.isString(t) ? goog.string.regExpEscape(t) : "\\s") ? "|[" + t + "]+" : "",
    t = new RegExp("(^" + t + ")([a-z])","g");
    return e.replace(t, function(e, t, o) {
        return t + o.toUpperCase()
    })
}
,
goog.string.capitalize = function(e) {
    return String(e.charAt(0)).toUpperCase() + String(e.substr(1)).toLowerCase()
}
,
goog.string.parseInt = function(e) {
    return isFinite(e) && (e = String(e)),
    goog.isString(e) ? /^\s*-?0x/i.test(e) ? parseInt(e, 16) : parseInt(e, 10) : NaN
}
,
goog.string.splitLimit = function(e, t, o) {
    for (var r = e.split(t), i = []; 0 < o && r.length; )
        i.push(r.shift()),
        o--;
    return r.length && i.push(r.join(t)),
    i
}
,
goog.string.editDistance = function(e, t) {
    var o = []
      , r = [];
    if (e == t)
        return 0;
    if (!e.length || !t.length)
        return Math.max(e.length, t.length);
    for (var i = 0; i < t.length + 1; i++)
        o[i] = i;
    for (i = 0; i < e.length; i++) {
        r[0] = i + 1;
        for (var s = 0; s < t.length; s++) {
            var a = e[i] != t[s];
            r[s + 1] = Math.min(r[s] + 1, o[s + 1] + 1, o[s] + a)
        }
        for (s = 0; s < o.length; s++)
            o[s] = r[s]
    }
    return r[t.length]
}
,
goog.provide("goog.asserts"),
goog.provide("goog.asserts.AssertionError"),
goog.require("goog.debug.Error"),
goog.require("goog.dom.NodeType"),
goog.require("goog.string"),
goog.define("goog.asserts.ENABLE_ASSERTS", goog.DEBUG),
goog.asserts.AssertionError = function(e, t) {
    t.unshift(e),
    goog.debug.Error.call(this, goog.string.subs.apply(null, t)),
    t.shift(),
    this.messagePattern = e
}
,
goog.inherits(goog.asserts.AssertionError, goog.debug.Error),
goog.asserts.AssertionError.prototype.name = "AssertionError",
goog.asserts.DEFAULT_ERROR_HANDLER = function(e) {
    throw e
}
,
goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER,
goog.asserts.doAssertFailure_ = function(e, t, o, r) {
    var i = "Assertion failed";
    o ? (i += ": " + o,
    s = r) : e && (i += ": " + e,
    s = t);
    var s = new goog.asserts.AssertionError("" + i,s || []);
    goog.asserts.errorHandler_(s)
}
,
goog.asserts.setErrorHandler = function(e) {
    goog.asserts.ENABLE_ASSERTS && (goog.asserts.errorHandler_ = e)
}
,
goog.asserts.assert = function(e, t, o) {
    return goog.asserts.ENABLE_ASSERTS && !e && goog.asserts.doAssertFailure_("", null, t, Array.prototype.slice.call(arguments, 2)),
    e
}
,
goog.asserts.fail = function(e, t) {
    goog.asserts.ENABLE_ASSERTS && goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure" + (e ? ": " + e : ""),Array.prototype.slice.call(arguments, 1)))
}
,
goog.asserts.assertNumber = function(e, t, o) {
    return goog.asserts.ENABLE_ASSERTS && !goog.isNumber(e) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(e), e], t, Array.prototype.slice.call(arguments, 2)),
    e
}
,
goog.asserts.assertString = function(e, t, o) {
    return goog.asserts.ENABLE_ASSERTS && !goog.isString(e) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(e), e], t, Array.prototype.slice.call(arguments, 2)),
    e
}
,
goog.asserts.assertFunction = function(e, t, o) {
    return goog.asserts.ENABLE_ASSERTS && !goog.isFunction(e) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(e), e], t, Array.prototype.slice.call(arguments, 2)),
    e
}
,
goog.asserts.assertObject = function(e, t, o) {
    return goog.asserts.ENABLE_ASSERTS && !goog.isObject(e) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(e), e], t, Array.prototype.slice.call(arguments, 2)),
    e
}
,
goog.asserts.assertArray = function(e, t, o) {
    return goog.asserts.ENABLE_ASSERTS && !goog.isArray(e) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(e), e], t, Array.prototype.slice.call(arguments, 2)),
    e
}
,
goog.asserts.assertBoolean = function(e, t, o) {
    return goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(e) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(e), e], t, Array.prototype.slice.call(arguments, 2)),
    e
}
,
goog.asserts.assertElement = function(e, t, o) {
    return !goog.asserts.ENABLE_ASSERTS || goog.isObject(e) && e.nodeType == goog.dom.NodeType.ELEMENT || goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(e), e], t, Array.prototype.slice.call(arguments, 2)),
    e
}
,
goog.asserts.assertInstanceof = function(e, t, o, r) {
    return !goog.asserts.ENABLE_ASSERTS || e instanceof t || goog.asserts.doAssertFailure_("Expected instanceof %s but got %s.", [goog.asserts.getType_(t), goog.asserts.getType_(e)], o, Array.prototype.slice.call(arguments, 3)),
    e
}
,
goog.asserts.assertObjectPrototypeIsIntact = function() {
    for (var e in Object.prototype)
        goog.asserts.fail(e + " should not be enumerable in Object.prototype.")
}
,
goog.asserts.getType_ = function(e) {
    return e instanceof Function ? e.displayName || e.name || "unknown type name" : e instanceof Object ? e.constructor.displayName || e.constructor.name || Object.prototype.toString.call(e) : null === e ? "null" : typeof e
}
,
goog.provide("goog.object"),
goog.object.forEach = function(e, t, o) {
    for (var r in e)
        t.call(o, e[r], r, e)
}
,
goog.object.filter = function(e, t, o) {
    var r, i = {};
    for (r in e)
        t.call(o, e[r], r, e) && (i[r] = e[r]);
    return i
}
,
goog.object.map = function(e, t, o) {
    var r, i = {};
    for (r in e)
        i[r] = t.call(o, e[r], r, e);
    return i
}
,
goog.object.some = function(e, t, o) {
    for (var r in e)
        if (t.call(o, e[r], r, e))
            return !0;
    return !1
}
,
goog.object.every = function(e, t, o) {
    for (var r in e)
        if (!t.call(o, e[r], r, e))
            return !1;
    return !0
}
,
goog.object.getCount = function(e) {
    var t, o = 0;
    for (t in e)
        o++;
    return o
}
,
goog.object.getAnyKey = function(e) {
    for (var t in e)
        return t
}
,
goog.object.getAnyValue = function(e) {
    for (var t in e)
        return e[t]
}
,
goog.object.contains = function(e, t) {
    return goog.object.containsValue(e, t)
}
,
goog.object.getValues = function(e) {
    var t, o = [], r = 0;
    for (t in e)
        o[r++] = e[t];
    return o
}
,
goog.object.getKeys = function(e) {
    var t, o = [], r = 0;
    for (t in e)
        o[r++] = t;
    return o
}
,
goog.object.getValueByKeys = function(e, t) {
    for (var o = goog.isArrayLike(t), r = o ? t : arguments, i = o ? 0 : 1; i < r.length && (e = e[r[i]],
    goog.isDef(e)); i++)
        ;
    return e
}
,
goog.object.containsKey = function(e, t) {
    return t in e
}
,
goog.object.containsValue = function(e, t) {
    for (var o in e)
        if (e[o] == t)
            return !0;
    return !1
}
,
goog.object.findKey = function(e, t, o) {
    for (var r in e)
        if (t.call(o, e[r], r, e))
            return r
}
,
goog.object.findValue = function(e, t, o) {
    o = goog.object.findKey(e, t, o);
    return o && e[o]
}
,
goog.object.isEmpty = function(e) {
    for (var t in e)
        return !1;
    return !0
}
,
goog.object.clear = function(e) {
    for (var t in e)
        delete e[t]
}
,
goog.object.remove = function(e, t) {
    var o;
    return (o = t in e) && delete e[t],
    o
}
,
goog.object.add = function(e, t, o) {
    if (t in e)
        throw Error('The object already contains the key "' + t + '"');
    goog.object.set(e, t, o)
}
,
goog.object.get = function(e, t, o) {
    return t in e ? e[t] : o
}
,
goog.object.set = function(e, t, o) {
    e[t] = o
}
,
goog.object.setIfUndefined = function(e, t, o) {
    return t in e ? e[t] : e[t] = o
}
,
goog.object.setWithReturnValueIfNotSet = function(e, t, o) {
    if (t in e)
        return e[t];
    o = o();
    return e[t] = o
}
,
goog.object.equals = function(e, t) {
    for (var o in e)
        if (!(o in t) || e[o] !== t[o])
            return !1;
    for (var o in t)
        if (!(o in e))
            return !1;
    return !0
}
,
goog.object.clone = function(e) {
    var t, o = {};
    for (t in e)
        o[t] = e[t];
    return o
}
,
goog.object.unsafeClone = function(e) {
    var t = goog.typeOf(e);
    if ("object" != t && "array" != t)
        return e;
    if (goog.isFunction(e.clone))
        return e.clone();
    var o, r = "array" == t ? [] : {};
    for (o in e)
        r[o] = goog.object.unsafeClone(e[o]);
    return r
}
,
goog.object.transpose = function(e) {
    var t, o = {};
    for (t in e)
        o[e[t]] = t;
    return o
}
,
goog.object.PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"],
goog.object.extend = function(e, t) {
    for (var o, r, i = 1; i < arguments.length; i++) {
        for (o in r = arguments[i])
            e[o] = r[o];
        for (var s = 0; s < goog.object.PROTOTYPE_FIELDS_.length; s++)
            o = goog.object.PROTOTYPE_FIELDS_[s],
            Object.prototype.hasOwnProperty.call(r, o) && (e[o] = r[o])
    }
}
,
goog.object.create = function(e) {
    var t = arguments.length;
    if (1 == t && goog.isArray(e))
        return goog.object.create.apply(null, e);
    if (t % 2)
        throw Error("Uneven number of arguments");
    for (var o = {}, r = 0; r < t; r += 2)
        o[arguments[r]] = arguments[r + 1];
    return o
}
,
goog.object.createSet = function(e) {
    var t = arguments.length;
    if (1 == t && goog.isArray(e))
        return goog.object.createSet.apply(null, e);
    for (var o = {}, r = 0; r < t; r++)
        o[arguments[r]] = !0;
    return o
}
,
goog.object.createImmutableView = function(e) {
    var t = e;
    return Object.isFrozen && !Object.isFrozen(e) && (t = Object.create(e),
    Object.freeze(t)),
    t
}
,
goog.object.isImmutableView = function(e) {
    return !!Object.isFrozen && Object.isFrozen(e)
}
,
goog.provide("goog.array"),
goog.provide("goog.array.ArrayLike"),
goog.require("goog.asserts"),
goog.define("goog.NATIVE_ARRAY_PROTOTYPES", goog.TRUSTED_SITE),
goog.define("goog.array.ASSUME_NATIVE_FUNCTIONS", !1),
goog.array.ArrayLike,
goog.array.peek = function(e) {
    return e[e.length - 1]
}
,
goog.array.last = goog.array.peek,
goog.array.ARRAY_PROTOTYPE_ = Array.prototype,
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.indexOf) ? function(e, t, o) {
    return goog.asserts.assert(null != e.length),
    goog.array.ARRAY_PROTOTYPE_.indexOf.call(e, t, o)
}
: function(e, t, o) {
    o = null == o ? 0 : o < 0 ? Math.max(0, e.length + o) : o;
    if (goog.isString(e))
        return goog.isString(t) && 1 == t.length ? e.indexOf(t, o) : -1;
    for (var r = o; r < e.length; r++)
        if (r in e && e[r] === t)
            return r;
    return -1
}
,
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.lastIndexOf) ? function(e, t, o) {
    goog.asserts.assert(null != e.length);
    o = null == o ? e.length - 1 : o;
    return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(e, t, o)
}
: function(e, t, o) {
    o = null == o ? e.length - 1 : o;
    if (o < 0 && (o = Math.max(0, e.length + o)),
    goog.isString(e))
        return goog.isString(t) && 1 == t.length ? e.lastIndexOf(t, o) : -1;
    for (var r = o; 0 <= r; r--)
        if (r in e && e[r] === t)
            return r;
    return -1
}
,
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.forEach) ? function(e, t, o) {
    goog.asserts.assert(null != e.length),
    goog.array.ARRAY_PROTOTYPE_.forEach.call(e, t, o)
}
: function(e, t, o) {
    for (var r = e.length, i = goog.isString(e) ? e.split("") : e, s = 0; s < r; s++)
        s in i && t.call(o, i[s], s, e)
}
,
goog.array.forEachRight = function(e, t, o) {
    for (var r = e.length, i = goog.isString(e) ? e.split("") : e, s = r - 1; 0 <= s; --s)
        s in i && t.call(o, i[s], s, e)
}
,
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.filter) ? function(e, t, o) {
    return goog.asserts.assert(null != e.length),
    goog.array.ARRAY_PROTOTYPE_.filter.call(e, t, o)
}
: function(e, t, o) {
    for (var r, i = e.length, s = [], a = 0, g = goog.isString(e) ? e.split("") : e, n = 0; n < i; n++)
        n in g && (r = g[n],
        t.call(o, r, n, e) && (s[a++] = r));
    return s
}
,
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.map) ? function(e, t, o) {
    return goog.asserts.assert(null != e.length),
    goog.array.ARRAY_PROTOTYPE_.map.call(e, t, o)
}
: function(e, t, o) {
    for (var r = e.length, i = new Array(r), s = goog.isString(e) ? e.split("") : e, a = 0; a < r; a++)
        a in s && (i[a] = t.call(o, s[a], a, e));
    return i
}
,
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduce) ? function(e, t, o, r) {
    return goog.asserts.assert(null != e.length),
    r && (t = goog.bind(t, r)),
    goog.array.ARRAY_PROTOTYPE_.reduce.call(e, t, o)
}
: function(o, r, e, i) {
    var s = e;
    return goog.array.forEach(o, function(e, t) {
        s = r.call(i, s, e, t, o)
    }),
    s
}
,
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduceRight) ? function(e, t, o, r) {
    return goog.asserts.assert(null != e.length),
    r && (t = goog.bind(t, r)),
    goog.array.ARRAY_PROTOTYPE_.reduceRight.call(e, t, o)
}
: function(o, r, e, i) {
    var s = e;
    return goog.array.forEachRight(o, function(e, t) {
        s = r.call(i, s, e, t, o)
    }),
    s
}
,
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.some) ? function(e, t, o) {
    return goog.asserts.assert(null != e.length),
    goog.array.ARRAY_PROTOTYPE_.some.call(e, t, o)
}
: function(e, t, o) {
    for (var r = e.length, i = goog.isString(e) ? e.split("") : e, s = 0; s < r; s++)
        if (s in i && t.call(o, i[s], s, e))
            return !0;
    return !1
}
,
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.every) ? function(e, t, o) {
    return goog.asserts.assert(null != e.length),
    goog.array.ARRAY_PROTOTYPE_.every.call(e, t, o)
}
: function(e, t, o) {
    for (var r = e.length, i = goog.isString(e) ? e.split("") : e, s = 0; s < r; s++)
        if (s in i && !t.call(o, i[s], s, e))
            return !1;
    return !0
}
,
goog.array.count = function(e, r, i) {
    var s = 0;
    return goog.array.forEach(e, function(e, t, o) {
        r.call(i, e, t, o) && ++s
    }, i),
    s
}
,
goog.array.find = function(e, t, o) {
    o = goog.array.findIndex(e, t, o);
    return o < 0 ? null : goog.isString(e) ? e.charAt(o) : e[o]
}
,
goog.array.findIndex = function(e, t, o) {
    for (var r = e.length, i = goog.isString(e) ? e.split("") : e, s = 0; s < r; s++)
        if (s in i && t.call(o, i[s], s, e))
            return s;
    return -1
}
,
goog.array.findRight = function(e, t, o) {
    o = goog.array.findIndexRight(e, t, o);
    return o < 0 ? null : goog.isString(e) ? e.charAt(o) : e[o]
}
,
goog.array.findIndexRight = function(e, t, o) {
    for (var r = e.length, i = goog.isString(e) ? e.split("") : e, s = r - 1; 0 <= s; s--)
        if (s in i && t.call(o, i[s], s, e))
            return s;
    return -1
}
,
goog.array.contains = function(e, t) {
    return 0 <= goog.array.indexOf(e, t)
}
,
goog.array.isEmpty = function(e) {
    return 0 == e.length
}
,
goog.array.clear = function(e) {
    if (!goog.isArray(e))
        for (var t = e.length - 1; 0 <= t; t--)
            delete e[t];
    e.length = 0
}
,
goog.array.insert = function(e, t) {
    goog.array.contains(e, t) || e.push(t)
}
,
goog.array.insertAt = function(e, t, o) {
    goog.array.splice(e, o, 0, t)
}
,
goog.array.insertArrayAt = function(e, t, o) {
    goog.partial(goog.array.splice, e, o, 0).apply(null, t)
}
,
goog.array.insertBefore = function(e, t, o) {
    var r;
    2 == arguments.length || (r = goog.array.indexOf(e, o)) < 0 ? e.push(t) : goog.array.insertAt(e, t, r)
}
,
goog.array.remove = function(e, t) {
    var o = goog.array.indexOf(e, t);
    return (t = 0 <= o) && goog.array.removeAt(e, o),
    t
}
,
goog.array.removeAt = function(e, t) {
    return goog.asserts.assert(null != e.length),
    1 == goog.array.ARRAY_PROTOTYPE_.splice.call(e, t, 1).length
}
,
goog.array.removeIf = function(e, t, o) {
    o = goog.array.findIndex(e, t, o);
    return 0 <= o && (goog.array.removeAt(e, o),
    !0)
}
,
goog.array.removeAllIf = function(o, r, i) {
    var s = 0;
    return goog.array.forEachRight(o, function(e, t) {
        r.call(i, e, t, o) && goog.array.removeAt(o, t) && s++
    }),
    s
}
,
goog.array.concat = function(e) {
    return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
}
,
goog.array.join = function(e) {
    return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
}
,
goog.array.toArray = function(e) {
    var t = e.length;
    if (0 < t) {
        for (var o = new Array(t), r = 0; r < t; r++)
            o[r] = e[r];
        return o
    }
    return []
}
,
goog.array.clone = goog.array.toArray,
goog.array.extend = function(e, t) {
    for (var o = 1; o < arguments.length; o++) {
        var r = arguments[o];
        if (goog.isArrayLike(r)) {
            var i = e.length || 0
              , s = r.length || 0;
            e.length = i + s;
            for (var a = 0; a < s; a++)
                e[i + a] = r[a]
        } else
            e.push(r)
    }
}
,
goog.array.splice = function(e, t, o, r) {
    return goog.asserts.assert(null != e.length),
    goog.array.ARRAY_PROTOTYPE_.splice.apply(e, goog.array.slice(arguments, 1))
}
,
goog.array.slice = function(e, t, o) {
    return goog.asserts.assert(null != e.length),
    arguments.length <= 2 ? goog.array.ARRAY_PROTOTYPE_.slice.call(e, t) : goog.array.ARRAY_PROTOTYPE_.slice.call(e, t, o)
}
,
goog.array.removeDuplicates = function(e, t, o) {
    for (var r = t || e, i = o || function(e) {
        return goog.isObject(e) ? "o" + goog.getUid(e) : (typeof e).charAt(0) + e
    }
    , s = {}, a = 0, g = 0; g < e.length; ) {
        var n = e[g++]
          , l = i(n);
        Object.prototype.hasOwnProperty.call(s, l) || (s[l] = !0,
        r[a++] = n)
    }
    r.length = a
}
,
goog.array.binarySearch = function(e, t, o) {
    return goog.array.binarySearch_(e, o || goog.array.defaultCompare, !1, t)
}
,
goog.array.binarySelect = function(e, t, o) {
    return goog.array.binarySearch_(e, t, !0, void 0, o)
}
,
goog.array.binarySearch_ = function(e, t, o, r, i) {
    for (var s, a = 0, g = e.length; a < g; ) {
        var n = a + g >> 1
          , l = o ? t.call(i, e[n], n, e) : t(r, e[n]);
        0 < l ? a = 1 + n : (g = n,
        s = !l)
    }
    return s ? a : ~a
}
,
goog.array.sort = function(e, t) {
    e.sort(t || goog.array.defaultCompare)
}
,
goog.array.stableSort = function(e, t) {
    for (var o = 0; o < e.length; o++)
        e[o] = {
            index: o,
            value: e[o]
        };
    var r = t || goog.array.defaultCompare;
    goog.array.sort(e, function(e, t) {
        return r(e.value, t.value) || e.index - t.index
    });
    for (o = 0; o < e.length; o++)
        e[o] = e[o].value
}
,
goog.array.sortByKey = function(e, o, t) {
    var r = t || goog.array.defaultCompare;
    goog.array.sort(e, function(e, t) {
        return r(o(e), o(t))
    })
}
,
goog.array.sortObjectsByKey = function(e, t, o) {
    goog.array.sortByKey(e, function(e) {
        return e[t]
    }, o)
}
,
goog.array.isSorted = function(e, t, o) {
    for (var r = t || goog.array.defaultCompare, i = 1; i < e.length; i++) {
        var s = r(e[i - 1], e[i]);
        if (0 < s || 0 == s && o)
            return !1
    }
    return !0
}
,
goog.array.equals = function(e, t, o) {
    if (!goog.isArrayLike(e) || !goog.isArrayLike(t) || e.length != t.length)
        return !1;
    for (var r = e.length, i = o || goog.array.defaultCompareEquality, s = 0; s < r; s++)
        if (!i(e[s], t[s]))
            return !1;
    return !0
}
,
goog.array.compare3 = function(e, t, o) {
    for (var r = o || goog.array.defaultCompare, i = Math.min(e.length, t.length), s = 0; s < i; s++) {
        var a = r(e[s], t[s]);
        if (0 != a)
            return a
    }
    return goog.array.defaultCompare(e.length, t.length)
}
,
goog.array.defaultCompare = function(e, t) {
    return t < e ? 1 : e < t ? -1 : 0
}
,
goog.array.inverseDefaultCompare = function(e, t) {
    return -goog.array.defaultCompare(e, t)
}
,
goog.array.defaultCompareEquality = function(e, t) {
    return e === t
}
,
goog.array.binaryInsert = function(e, t, o) {
    o = goog.array.binarySearch(e, t, o);
    return o < 0 && (goog.array.insertAt(e, t, -(o + 1)),
    !0)
}
,
goog.array.binaryRemove = function(e, t, o) {
    o = goog.array.binarySearch(e, t, o);
    return 0 <= o && goog.array.removeAt(e, o)
}
,
goog.array.bucket = function(e, t, o) {
    for (var r = {}, i = 0; i < e.length; i++) {
        var s = e[i]
          , a = t.call(o, s, i, e);
        goog.isDef(a) && (r[a] || (r[a] = [])).push(s)
    }
    return r
}
,
goog.array.toObject = function(o, r, i) {
    var s = {};
    return goog.array.forEach(o, function(e, t) {
        s[r.call(i, e, t, o)] = e
    }),
    s
}
,
goog.array.range = function(e, t, o) {
    var r = []
      , i = 0
      , s = e
      , a = o || 1;
    if (void 0 !== t && (i = e,
    s = t),
    a * (s - i) < 0)
        return [];
    if (0 < a)
        for (var g = i; g < s; g += a)
            r.push(g);
    else
        for (g = i; s < g; g += a)
            r.push(g);
    return r
}
,
goog.array.repeat = function(e, t) {
    for (var o = [], r = 0; r < t; r++)
        o[r] = e;
    return o
}
,
goog.array.flatten = function(e) {
    for (var t = [], o = 0; o < arguments.length; o++) {
        var r = arguments[o];
        if (goog.isArray(r))
            for (var i = 0; i < r.length; i += 8192)
                for (var s = goog.array.slice(r, i, i + 8192), a = goog.array.flatten.apply(null, s), g = 0; g < a.length; g++)
                    t.push(a[g]);
        else
            t.push(r)
    }
    return t
}
,
goog.array.rotate = function(e, t) {
    return goog.asserts.assert(null != e.length),
    e.length && (0 < (t %= e.length) ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(e, e.splice(-t, t)) : t < 0 && goog.array.ARRAY_PROTOTYPE_.push.apply(e, e.splice(0, -t))),
    e
}
,
goog.array.moveItem = function(e, t, o) {
    goog.asserts.assert(0 <= t && t < e.length),
    goog.asserts.assert(0 <= o && o < e.length);
    t = goog.array.ARRAY_PROTOTYPE_.splice.call(e, t, 1);
    goog.array.ARRAY_PROTOTYPE_.splice.call(e, o, 0, t[0])
}
,
goog.array.zip = function(e) {
    if (!arguments.length)
        return [];
    for (var t = [], o = 0; ; o++) {
        for (var r = [], i = 0; i < arguments.length; i++) {
            var s = arguments[i];
            if (o >= s.length)
                return t;
            r.push(s[o])
        }
        t.push(r)
    }
}
,
goog.array.shuffle = function(e, t) {
    for (var o = t || Math.random, r = e.length - 1; 0 < r; r--) {
        var i = Math.floor(o() * (r + 1))
          , s = e[r];
        e[r] = e[i],
        e[i] = s
    }
}
,
goog.array.copyByIndex = function(t, e) {
    var o = [];
    return goog.array.forEach(e, function(e) {
        o.push(t[e])
    }),
    o
}
,
goog.provide("goog.math"),
goog.require("goog.array"),
goog.require("goog.asserts"),
goog.math.randomInt = function(e) {
    return Math.floor(Math.random() * e)
}
,
goog.math.uniformRandom = function(e, t) {
    return e + Math.random() * (t - e)
}
,
goog.math.clamp = function(e, t, o) {
    return Math.min(Math.max(e, t), o)
}
,
goog.math.modulo = function(e, t) {
    e %= t;
    return e * t < 0 ? e + t : e
}
,
goog.math.lerp = function(e, t, o) {
    return e + o * (t - e)
}
,
goog.math.nearlyEquals = function(e, t, o) {
    return Math.abs(e - t) <= (o || 1e-6)
}
,
goog.math.standardAngle = function(e) {
    return goog.math.modulo(e, 360)
}
,
goog.math.standardAngleInRadians = function(e) {
    return goog.math.modulo(e, 2 * Math.PI)
}
,
goog.math.toRadians = function(e) {
    return e * Math.PI / 180
}
,
goog.math.toDegrees = function(e) {
    return 180 * e / Math.PI
}
,
goog.math.angleDx = function(e, t) {
    return t * Math.cos(goog.math.toRadians(e))
}
,
goog.math.angleDy = function(e, t) {
    return t * Math.sin(goog.math.toRadians(e))
}
,
goog.math.angle = function(e, t, o, r) {
    return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(r - t, o - e)))
}
,
goog.math.angleDifference = function(e, t) {
    e = goog.math.standardAngle(t) - goog.math.standardAngle(e);
    return 180 < e ? e -= 360 : e <= -180 && (e = 360 + e),
    e
}
,
goog.math.sign = Math.sign || function(e) {
    return 0 < e ? 1 : e < 0 ? -1 : e
}
,
goog.math.longestCommonSubsequence = function(o, e, t, r) {
    for (var i = t || function(e, t) {
        return e == t
    }
    , s = r || function(e, t) {
        return o[e]
    }
    , a = o.length, g = e.length, n = [], l = 0; l < a + 1; l++)
        n[l] = [],
        n[l][0] = 0;
    for (var u = 0; u < g + 1; u++)
        n[0][u] = 0;
    for (l = 1; l <= a; l++)
        for (u = 1; u <= g; u++)
            i(o[l - 1], e[u - 1]) ? n[l][u] = n[l - 1][u - 1] + 1 : n[l][u] = Math.max(n[l - 1][u], n[l][u - 1]);
    for (var c = [], l = a, u = g; 0 < l && 0 < u; )
        i(o[l - 1], e[u - 1]) ? (c.unshift(s(l - 1, u - 1)),
        l--,
        u--) : n[l - 1][u] > n[l][u - 1] ? l-- : u--;
    return c
}
,
goog.math.sum = function(e) {
    return goog.array.reduce(arguments, function(e, t) {
        return e + t
    }, 0)
}
,
goog.math.average = function(e) {
    return goog.math.sum.apply(null, arguments) / arguments.length
}
,
goog.math.sampleVariance = function(e) {
    var t = arguments.length;
    if (t < 2)
        return 0;
    var o = goog.math.average.apply(null, arguments);
    return goog.math.sum.apply(null, goog.array.map(arguments, function(e) {
        return Math.pow(e - o, 2)
    })) / (t - 1)
}
,
goog.math.standardDeviation = function(e) {
    return Math.sqrt(goog.math.sampleVariance.apply(null, arguments))
}
,
goog.math.isInt = function(e) {
    return isFinite(e) && e % 1 == 0
}
,
goog.math.isFiniteNumber = function(e) {
    return isFinite(e) && !isNaN(e)
}
,
goog.math.isNegativeZero = function(e) {
    return 0 == e && 1 / e < 0
}
,
goog.math.log10Floor = function(e) {
    if (0 < e) {
        var t = Math.round(Math.log(e) * Math.LOG10E);
        return t - (parseFloat("1e" + t) > e)
    }
    return 0 == e ? -1 / 0 : NaN
}
,
goog.math.safeFloor = function(e, t) {
    return goog.asserts.assert(!goog.isDef(t) || 0 < t),
    Math.floor(e + (t || 2e-15))
}
,
goog.math.safeCeil = function(e, t) {
    return goog.asserts.assert(!goog.isDef(t) || 0 < t),
    Math.ceil(e - (t || 2e-15))
}
,
goog.provide("goog.math.Coordinate"),
goog.require("goog.math"),
goog.math.Coordinate = function(e, t) {
    this.x = goog.isDef(e) ? e : 0,
    this.y = goog.isDef(t) ? t : 0
}
,
goog.math.Coordinate.prototype.clone = function() {
    return new goog.math.Coordinate(this.x,this.y)
}
,
goog.DEBUG && (goog.math.Coordinate.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ")"
}
),
goog.math.Coordinate.equals = function(e, t) {
    return e == t || !(!e || !t) && (e.x == t.x && e.y == t.y)
}
,
goog.math.Coordinate.distance = function(e, t) {
    var o = e.x - t.x
      , t = e.y - t.y;
    return Math.sqrt(o * o + t * t)
}
,
goog.math.Coordinate.magnitude = function(e) {
    return Math.sqrt(e.x * e.x + e.y * e.y)
}
,
goog.math.Coordinate.azimuth = function(e) {
    return goog.math.angle(0, 0, e.x, e.y)
}
,
goog.math.Coordinate.squaredDistance = function(e, t) {
    var o = e.x - t.x
      , t = e.y - t.y;
    return o * o + t * t
}
,
goog.math.Coordinate.difference = function(e, t) {
    return new goog.math.Coordinate(e.x - t.x,e.y - t.y)
}
,
goog.math.Coordinate.sum = function(e, t) {
    return new goog.math.Coordinate(e.x + t.x,e.y + t.y)
}
,
goog.math.Coordinate.prototype.ceil = function() {
    return this.x = Math.ceil(this.x),
    this.y = Math.ceil(this.y),
    this
}
,
goog.math.Coordinate.prototype.floor = function() {
    return this.x = Math.floor(this.x),
    this.y = Math.floor(this.y),
    this
}
,
goog.math.Coordinate.prototype.round = function() {
    return this.x = Math.round(this.x),
    this.y = Math.round(this.y),
    this
}
,
goog.math.Coordinate.prototype.translate = function(e, t) {
    return e instanceof goog.math.Coordinate ? (this.x += e.x,
    this.y += e.y) : (this.x += e,
    goog.isNumber(t) && (this.y += t)),
    this
}
,
goog.math.Coordinate.prototype.scale = function(e, t) {
    t = goog.isNumber(t) ? t : e;
    return this.x *= e,
    this.y *= t,
    this
}
,
goog.math.Coordinate.prototype.rotateRadians = function(e, t) {
    var o = t || new goog.math.Coordinate(0,0)
      , r = this.x
      , i = this.y
      , t = Math.cos(e)
      , e = Math.sin(e);
    this.x = (r - o.x) * t - (i - o.y) * e + o.x,
    this.y = (r - o.x) * e + (i - o.y) * t + o.y
}
,
goog.math.Coordinate.prototype.rotateDegrees = function(e, t) {
    this.rotateRadians(goog.math.toRadians(e), t)
}
,
goog.provide("goog.math.Box"),
goog.require("goog.math.Coordinate"),
goog.math.Box = function(e, t, o, r) {
    this.top = e,
    this.right = t,
    this.bottom = o,
    this.left = r
}
,
goog.math.Box.boundingBox = function(e) {
    for (var t = new goog.math.Box(e.y,e.x,e.y,e.x), o = 1; o < arguments.length; o++)
        t.expandToIncludeCoordinate(arguments[o]);
    return t
}
,
goog.math.Box.prototype.getWidth = function() {
    return this.right - this.left
}
,
goog.math.Box.prototype.getHeight = function() {
    return this.bottom - this.top
}
,
goog.math.Box.prototype.clone = function() {
    return new goog.math.Box(this.top,this.right,this.bottom,this.left)
}
,
goog.DEBUG && (goog.math.Box.prototype.toString = function() {
    return "(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)"
}
),
goog.math.Box.prototype.contains = function(e) {
    return goog.math.Box.contains(this, e)
}
,
goog.math.Box.prototype.expand = function(e, t, o, r) {
    return goog.isObject(e) ? (this.top -= e.top,
    this.right += e.right,
    this.bottom += e.bottom,
    this.left -= e.left) : (this.top -= e,
    this.right += t,
    this.bottom += o,
    this.left -= r),
    this
}
,
goog.math.Box.prototype.expandToInclude = function(e) {
    this.left = Math.min(this.left, e.left),
    this.top = Math.min(this.top, e.top),
    this.right = Math.max(this.right, e.right),
    this.bottom = Math.max(this.bottom, e.bottom)
}
,
goog.math.Box.prototype.expandToIncludeCoordinate = function(e) {
    this.top = Math.min(this.top, e.y),
    this.right = Math.max(this.right, e.x),
    this.bottom = Math.max(this.bottom, e.y),
    this.left = Math.min(this.left, e.x)
}
,
goog.math.Box.equals = function(e, t) {
    return e == t || !(!e || !t) && (e.top == t.top && e.right == t.right && e.bottom == t.bottom && e.left == t.left)
}
,
goog.math.Box.contains = function(e, t) {
    return !(!e || !t) && (t instanceof goog.math.Box ? t.left >= e.left && t.right <= e.right && t.top >= e.top && t.bottom <= e.bottom : t.x >= e.left && t.x <= e.right && t.y >= e.top && t.y <= e.bottom)
}
,
goog.math.Box.relativePositionX = function(e, t) {
    return t.x < e.left ? t.x - e.left : t.x > e.right ? t.x - e.right : 0
}
,
goog.math.Box.relativePositionY = function(e, t) {
    return t.y < e.top ? t.y - e.top : t.y > e.bottom ? t.y - e.bottom : 0
}
,
goog.math.Box.distance = function(e, t) {
    var o = goog.math.Box.relativePositionX(e, t)
      , t = goog.math.Box.relativePositionY(e, t);
    return Math.sqrt(o * o + t * t)
}
,
goog.math.Box.intersects = function(e, t) {
    return e.left <= t.right && t.left <= e.right && e.top <= t.bottom && t.top <= e.bottom
}
,
goog.math.Box.intersectsWithPadding = function(e, t, o) {
    return e.left <= t.right + o && t.left <= e.right + o && e.top <= t.bottom + o && t.top <= e.bottom + o
}
,
goog.math.Box.prototype.ceil = function() {
    return this.top = Math.ceil(this.top),
    this.right = Math.ceil(this.right),
    this.bottom = Math.ceil(this.bottom),
    this.left = Math.ceil(this.left),
    this
}
,
goog.math.Box.prototype.floor = function() {
    return this.top = Math.floor(this.top),
    this.right = Math.floor(this.right),
    this.bottom = Math.floor(this.bottom),
    this.left = Math.floor(this.left),
    this
}
,
goog.math.Box.prototype.round = function() {
    return this.top = Math.round(this.top),
    this.right = Math.round(this.right),
    this.bottom = Math.round(this.bottom),
    this.left = Math.round(this.left),
    this
}
,
goog.math.Box.prototype.translate = function(e, t) {
    return e instanceof goog.math.Coordinate ? (this.left += e.x,
    this.right += e.x,
    this.top += e.y,
    this.bottom += e.y) : (this.left += e,
    this.right += e,
    goog.isNumber(t) && (this.top += t,
    this.bottom += t)),
    this
}
,
goog.math.Box.prototype.scale = function(e, t) {
    t = goog.isNumber(t) ? t : e;
    return this.left *= e,
    this.right *= e,
    this.top *= t,
    this.bottom *= t,
    this
}
,
goog.provide("goog.dom.TagName"),
goog.dom.TagName = {
    A: "A",
    ABBR: "ABBR",
    ACRONYM: "ACRONYM",
    ADDRESS: "ADDRESS",
    APPLET: "APPLET",
    AREA: "AREA",
    ARTICLE: "ARTICLE",
    ASIDE: "ASIDE",
    AUDIO: "AUDIO",
    B: "B",
    BASE: "BASE",
    BASEFONT: "BASEFONT",
    BDI: "BDI",
    BDO: "BDO",
    BIG: "BIG",
    BLOCKQUOTE: "BLOCKQUOTE",
    BODY: "BODY",
    BR: "BR",
    BUTTON: "BUTTON",
    CANVAS: "CANVAS",
    CAPTION: "CAPTION",
    CENTER: "CENTER",
    CITE: "CITE",
    CODE: "CODE",
    COL: "COL",
    COLGROUP: "COLGROUP",
    COMMAND: "COMMAND",
    DATA: "DATA",
    DATALIST: "DATALIST",
    DD: "DD",
    DEL: "DEL",
    DETAILS: "DETAILS",
    DFN: "DFN",
    DIALOG: "DIALOG",
    DIR: "DIR",
    DIV: "DIV",
    DL: "DL",
    DT: "DT",
    EM: "EM",
    EMBED: "EMBED",
    FIELDSET: "FIELDSET",
    FIGCAPTION: "FIGCAPTION",
    FIGURE: "FIGURE",
    FONT: "FONT",
    FOOTER: "FOOTER",
    FORM: "FORM",
    FRAME: "FRAME",
    FRAMESET: "FRAMESET",
    H1: "H1",
    H2: "H2",
    H3: "H3",
    H4: "H4",
    H5: "H5",
    H6: "H6",
    HEAD: "HEAD",
    HEADER: "HEADER",
    HGROUP: "HGROUP",
    HR: "HR",
    HTML: "HTML",
    I: "I",
    IFRAME: "IFRAME",
    IMG: "IMG",
    INPUT: "INPUT",
    INS: "INS",
    ISINDEX: "ISINDEX",
    KBD: "KBD",
    KEYGEN: "KEYGEN",
    LABEL: "LABEL",
    LEGEND: "LEGEND",
    LI: "LI",
    LINK: "LINK",
    MAP: "MAP",
    MARK: "MARK",
    MATH: "MATH",
    MENU: "MENU",
    META: "META",
    METER: "METER",
    NAV: "NAV",
    NOFRAMES: "NOFRAMES",
    NOSCRIPT: "NOSCRIPT",
    OBJECT: "OBJECT",
    OL: "OL",
    OPTGROUP: "OPTGROUP",
    OPTION: "OPTION",
    OUTPUT: "OUTPUT",
    P: "P",
    PARAM: "PARAM",
    PRE: "PRE",
    PROGRESS: "PROGRESS",
    Q: "Q",
    RP: "RP",
    RT: "RT",
    RUBY: "RUBY",
    S: "S",
    SAMP: "SAMP",
    SCRIPT: "SCRIPT",
    SECTION: "SECTION",
    SELECT: "SELECT",
    SMALL: "SMALL",
    SOURCE: "SOURCE",
    SPAN: "SPAN",
    STRIKE: "STRIKE",
    STRONG: "STRONG",
    STYLE: "STYLE",
    SUB: "SUB",
    SUMMARY: "SUMMARY",
    SUP: "SUP",
    SVG: "SVG",
    TABLE: "TABLE",
    TBODY: "TBODY",
    TD: "TD",
    TEMPLATE: "TEMPLATE",
    TEXTAREA: "TEXTAREA",
    TFOOT: "TFOOT",
    TH: "TH",
    THEAD: "THEAD",
    TIME: "TIME",
    TITLE: "TITLE",
    TR: "TR",
    TRACK: "TRACK",
    TT: "TT",
    U: "U",
    UL: "UL",
    VAR: "VAR",
    VIDEO: "VIDEO",
    WBR: "WBR"
},
goog.provide("goog.labs.userAgent.util"),
goog.require("goog.string"),
goog.labs.userAgent.util.getNativeUserAgentString_ = function() {
    var e = goog.labs.userAgent.util.getNavigator_();
    if (e) {
        e = e.userAgent;
        if (e)
            return e
    }
    return ""
}
,
goog.labs.userAgent.util.getNavigator_ = function() {
    return goog.global.navigator
}
,
goog.labs.userAgent.util.userAgent_ = goog.labs.userAgent.util.getNativeUserAgentString_(),
goog.labs.userAgent.util.setUserAgent = function(e) {
    goog.labs.userAgent.util.userAgent_ = e || goog.labs.userAgent.util.getNativeUserAgentString_()
}
,
goog.labs.userAgent.util.getUserAgent = function() {
    return goog.labs.userAgent.util.userAgent_
}
,
goog.labs.userAgent.util.matchUserAgent = function(e) {
    var t = goog.labs.userAgent.util.getUserAgent();
    return goog.string.contains(t, e)
}
,
goog.labs.userAgent.util.matchUserAgentIgnoreCase = function(e) {
    var t = goog.labs.userAgent.util.getUserAgent();
    return goog.string.caseInsensitiveContains(t, e)
}
,
goog.labs.userAgent.util.extractVersionTuples = function(e) {
    for (var t, o = new RegExp("(\\w[\\w ]+)/([^\\s]+)\\s*(?:\\((.*?)\\))?","g"), r = []; t = o.exec(e); )
        r.push([t[1], t[2], t[3] || void 0]);
    return r
}
,
goog.provide("goog.labs.userAgent.platform"),
goog.require("goog.labs.userAgent.util"),
goog.require("goog.string"),
goog.labs.userAgent.platform.isAndroid = function() {
    return goog.labs.userAgent.util.matchUserAgent("Android")
}
,
goog.labs.userAgent.platform.isIpod = function() {
    return goog.labs.userAgent.util.matchUserAgent("iPod")
}
,
goog.labs.userAgent.platform.isIphone = function() {
    return goog.labs.userAgent.util.matchUserAgent("iPhone") && !goog.labs.userAgent.util.matchUserAgent("iPod") && !goog.labs.userAgent.util.matchUserAgent("iPad")
}
,
goog.labs.userAgent.platform.isIpad = function() {
    return goog.labs.userAgent.util.matchUserAgent("iPad")
}
,
goog.labs.userAgent.platform.isIos = function() {
    return goog.labs.userAgent.platform.isIphone() || goog.labs.userAgent.platform.isIpad() || goog.labs.userAgent.platform.isIpod()
}
,
goog.labs.userAgent.platform.isMacintosh = function() {
    return goog.labs.userAgent.util.matchUserAgent("Macintosh")
}
,
goog.labs.userAgent.platform.isLinux = function() {
    return goog.labs.userAgent.util.matchUserAgent("Linux")
}
,
goog.labs.userAgent.platform.isWindows = function() {
    return goog.labs.userAgent.util.matchUserAgent("Windows")
}
,
goog.labs.userAgent.platform.isChromeOS = function() {
    return goog.labs.userAgent.util.matchUserAgent("CrOS")
}
,
goog.labs.userAgent.platform.getVersion = function() {
    var e, t = goog.labs.userAgent.util.getUserAgent(), o = "";
    return goog.labs.userAgent.platform.isWindows() ? o = (e = /Windows (?:NT|Phone) ([0-9.]+)/.exec(t)) ? e[1] : "0.0" : goog.labs.userAgent.platform.isIos() ? o = (e = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/.exec(t)) && e[1].replace(/_/g, ".") : goog.labs.userAgent.platform.isMacintosh() ? o = (e = /Mac OS X ([0-9_.]+)/.exec(t)) ? e[1].replace(/_/g, ".") : "10" : goog.labs.userAgent.platform.isAndroid() ? o = (e = /Android\s+([^\);]+)(\)|;)/.exec(t)) && e[1] : goog.labs.userAgent.platform.isChromeOS() && (o = (e = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/.exec(t)) && e[1]),
    o || ""
}
,
goog.labs.userAgent.platform.isVersionOrHigher = function(e) {
    return 0 <= goog.string.compareVersions(goog.labs.userAgent.platform.getVersion(), e)
}
,
goog.provide("goog.labs.userAgent.browser"),
goog.require("goog.array"),
goog.require("goog.labs.userAgent.util"),
goog.require("goog.object"),
goog.require("goog.string"),
goog.labs.userAgent.browser.matchOpera_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Opera") || goog.labs.userAgent.util.matchUserAgent("OPR")
}
,
goog.labs.userAgent.browser.matchIE_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE")
}
,
goog.labs.userAgent.browser.matchEdge_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Edge")
}
,
goog.labs.userAgent.browser.matchFirefox_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Firefox")
}
,
goog.labs.userAgent.browser.matchSafari_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Safari") && !(goog.labs.userAgent.browser.matchChrome_() || goog.labs.userAgent.browser.matchCoast_() || goog.labs.userAgent.browser.matchOpera_() || goog.labs.userAgent.browser.matchEdge_() || goog.labs.userAgent.browser.isSilk() || goog.labs.userAgent.util.matchUserAgent("Android"))
}
,
goog.labs.userAgent.browser.matchCoast_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Coast")
}
,
goog.labs.userAgent.browser.matchIosWebview_ = function() {
    return (goog.labs.userAgent.util.matchUserAgent("iPad") || goog.labs.userAgent.util.matchUserAgent("iPhone")) && !goog.labs.userAgent.browser.matchSafari_() && !goog.labs.userAgent.browser.matchChrome_() && !goog.labs.userAgent.browser.matchCoast_() && goog.labs.userAgent.util.matchUserAgent("AppleWebKit")
}
,
goog.labs.userAgent.browser.matchChrome_ = function() {
    return (goog.labs.userAgent.util.matchUserAgent("Chrome") || goog.labs.userAgent.util.matchUserAgent("CriOS")) && !goog.labs.userAgent.browser.matchOpera_() && !goog.labs.userAgent.browser.matchEdge_()
}
,
goog.labs.userAgent.browser.matchAndroidBrowser_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Android") && !(goog.labs.userAgent.browser.isChrome() || goog.labs.userAgent.browser.isFirefox() || goog.labs.userAgent.browser.isOpera() || goog.labs.userAgent.browser.isSilk())
}
,
goog.labs.userAgent.browser.isOpera = goog.labs.userAgent.browser.matchOpera_,
goog.labs.userAgent.browser.isIE = goog.labs.userAgent.browser.matchIE_,
goog.labs.userAgent.browser.isEdge = goog.labs.userAgent.browser.matchEdge_,
goog.labs.userAgent.browser.isFirefox = goog.labs.userAgent.browser.matchFirefox_,
goog.labs.userAgent.browser.isSafari = goog.labs.userAgent.browser.matchSafari_,
goog.labs.userAgent.browser.isCoast = goog.labs.userAgent.browser.matchCoast_,
goog.labs.userAgent.browser.isIosWebview = goog.labs.userAgent.browser.matchIosWebview_,
goog.labs.userAgent.browser.isChrome = goog.labs.userAgent.browser.matchChrome_,
goog.labs.userAgent.browser.isAndroidBrowser = goog.labs.userAgent.browser.matchAndroidBrowser_,
goog.labs.userAgent.browser.isSilk = function() {
    return goog.labs.userAgent.util.matchUserAgent("Silk")
}
,
goog.labs.userAgent.browser.getVersion = function() {
    var e = goog.labs.userAgent.util.getUserAgent();
    if (goog.labs.userAgent.browser.isIE())
        return goog.labs.userAgent.browser.getIEVersion_(e);
    var e = goog.labs.userAgent.util.extractVersionTuples(e)
      , o = {};
    goog.array.forEach(e, function(e) {
        var t = e[0]
          , e = e[1];
        o[t] = e
    });
    var t = goog.partial(goog.object.containsKey, o);
    function r(e) {
        e = goog.array.find(e, t);
        return o[e] || ""
    }
    if (goog.labs.userAgent.browser.isOpera())
        return r(["Version", "Opera", "OPR"]);
    if (goog.labs.userAgent.browser.isEdge())
        return r(["Edge"]);
    if (goog.labs.userAgent.browser.isChrome())
        return r(["Chrome", "CriOS"]);
    e = e[2];
    return e && e[1] || ""
}
,
goog.labs.userAgent.browser.isVersionOrHigher = function(e) {
    return 0 <= goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(), e)
}
,
goog.labs.userAgent.browser.getIEVersion_ = function(e) {
    var t = /rv: *([\d\.]*)/.exec(e);
    if (t && t[1])
        return t[1];
    var o = ""
      , t = /MSIE +([\d\.]+)/.exec(e);
    if (t && t[1]) {
        e = /Trident\/(\d.\d)/.exec(e);
        if ("7.0" == t[1])
            if (e && e[1])
                switch (e[1]) {
                case "4.0":
                    o = "8.0";
                    break;
                case "5.0":
                    o = "9.0";
                    break;
                case "6.0":
                    o = "10.0";
                    break;
                case "7.0":
                    o = "11.0"
                }
            else
                o = "7.0";
        else
            o = t[1]
    }
    return o
}
,
goog.provide("goog.labs.userAgent.engine"),
goog.require("goog.array"),
goog.require("goog.labs.userAgent.util"),
goog.require("goog.string"),
goog.labs.userAgent.engine.isPresto = function() {
    return goog.labs.userAgent.util.matchUserAgent("Presto")
}
,
goog.labs.userAgent.engine.isTrident = function() {
    return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE")
}
,
goog.labs.userAgent.engine.isEdge = function() {
    return goog.labs.userAgent.util.matchUserAgent("Edge")
}
,
goog.labs.userAgent.engine.isWebKit = function() {
    return goog.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit") && !goog.labs.userAgent.engine.isEdge()
}
,
goog.labs.userAgent.engine.isGecko = function() {
    return goog.labs.userAgent.util.matchUserAgent("Gecko") && !goog.labs.userAgent.engine.isWebKit() && !goog.labs.userAgent.engine.isTrident() && !goog.labs.userAgent.engine.isEdge()
}
,
goog.labs.userAgent.engine.getVersion = function() {
    var e = goog.labs.userAgent.util.getUserAgent();
    if (e) {
        var t = goog.labs.userAgent.util.extractVersionTuples(e)
          , e = goog.labs.userAgent.engine.getEngineTuple_(t);
        if (e)
            return "Gecko" == e[0] ? goog.labs.userAgent.engine.getVersionForKey_(t, "Firefox") : e[1];
        t = t[0];
        if (t && (o = t[2])) {
            var o = /Trident\/([^\s;]+)/.exec(o);
            if (o)
                return o[1]
        }
    }
    return ""
}
,
goog.labs.userAgent.engine.getEngineTuple_ = function(e) {
    if (!goog.labs.userAgent.engine.isEdge())
        return e[1];
    for (var t = 0; t < e.length; t++) {
        var o = e[t];
        if ("Edge" == o[0])
            return o
    }
}
,
goog.labs.userAgent.engine.isVersionOrHigher = function(e) {
    return 0 <= goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(), e)
}
,
goog.labs.userAgent.engine.getVersionForKey_ = function(e, t) {
    e = goog.array.find(e, function(e) {
        return t == e[0]
    });
    return e && e[1] || ""
}
,
goog.provide("goog.userAgent"),
goog.require("goog.labs.userAgent.browser"),
goog.require("goog.labs.userAgent.engine"),
goog.require("goog.labs.userAgent.platform"),
goog.require("goog.labs.userAgent.util"),
goog.require("goog.string"),
goog.define("goog.userAgent.ASSUME_IE", !1),
goog.define("goog.userAgent.ASSUME_EDGE", !1),
goog.define("goog.userAgent.ASSUME_GECKO", !1),
goog.define("goog.userAgent.ASSUME_WEBKIT", !1),
goog.define("goog.userAgent.ASSUME_MOBILE_WEBKIT", !1),
goog.define("goog.userAgent.ASSUME_OPERA", !1),
goog.define("goog.userAgent.ASSUME_ANY_VERSION", !1),
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_EDGE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA,
goog.userAgent.getUserAgentString = function() {
    return goog.labs.userAgent.util.getUserAgent()
}
,
goog.userAgent.getNavigator = function() {
    return goog.global.navigator || null
}
,
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.labs.userAgent.browser.isOpera(),
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.labs.userAgent.browser.isIE(),
goog.userAgent.EDGE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_EDGE : goog.labs.userAgent.engine.isEdge(),
goog.userAgent.EDGE_OR_IE = goog.userAgent.EDGE || goog.userAgent.IE,
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.labs.userAgent.engine.isGecko(),
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.labs.userAgent.engine.isWebKit(),
goog.userAgent.isMobile_ = function() {
    return goog.userAgent.WEBKIT && goog.labs.userAgent.util.matchUserAgent("Mobile")
}
,
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.isMobile_(),
goog.userAgent.SAFARI = goog.userAgent.WEBKIT,
goog.userAgent.determinePlatform_ = function() {
    var e = goog.userAgent.getNavigator();
    return e && e.platform || ""
}
,
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_(),
goog.define("goog.userAgent.ASSUME_MAC", !1),
goog.define("goog.userAgent.ASSUME_WINDOWS", !1),
goog.define("goog.userAgent.ASSUME_LINUX", !1),
goog.define("goog.userAgent.ASSUME_X11", !1),
goog.define("goog.userAgent.ASSUME_ANDROID", !1),
goog.define("goog.userAgent.ASSUME_IPHONE", !1),
goog.define("goog.userAgent.ASSUME_IPAD", !1),
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD,
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.labs.userAgent.platform.isMacintosh(),
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.labs.userAgent.platform.isWindows(),
goog.userAgent.isLegacyLinux_ = function() {
    return goog.labs.userAgent.platform.isLinux() || goog.labs.userAgent.platform.isChromeOS()
}
,
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.isLegacyLinux_(),
goog.userAgent.isX11_ = function() {
    var e = goog.userAgent.getNavigator();
    return !!e && goog.string.contains(e.appVersion || "", "X11")
}
,
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.isX11_(),
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.labs.userAgent.platform.isAndroid(),
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.labs.userAgent.platform.isIphone(),
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.labs.userAgent.platform.isIpad(),
goog.userAgent.determineVersion_ = function() {
    if (goog.userAgent.OPERA && goog.global.opera) {
        var e = goog.global.opera.version;
        return goog.isFunction(e) ? e() : e
    }
    var t = ""
      , e = goog.userAgent.getVersionRegexResult_();
    if (e && (t = e ? e[1] : ""),
    goog.userAgent.IE) {
        e = goog.userAgent.getDocumentMode_();
        if (e > parseFloat(t))
            return String(e)
    }
    return t
}
,
goog.userAgent.getVersionRegexResult_ = function() {
    var e = goog.userAgent.getUserAgentString();
    return goog.userAgent.GECKO ? /rv:([^\);]+)(\)|;)/.exec(e) : goog.userAgent.EDGE ? /Edge\/([\d\.]+)/.exec(e) : goog.userAgent.IE ? /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(e) : goog.userAgent.WEBKIT ? /WebKit\/(\S+)/.exec(e) : void 0
}
,
goog.userAgent.getDocumentMode_ = function() {
    var e = goog.global.document;
    return e ? e.documentMode : void 0
}
,
goog.userAgent.VERSION = goog.userAgent.determineVersion_(),
goog.userAgent.compare = function(e, t) {
    return goog.string.compareVersions(e, t)
}
,
goog.userAgent.isVersionOrHigherCache_ = {},
goog.userAgent.isVersionOrHigher = function(e) {
    return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionOrHigherCache_[e] || (goog.userAgent.isVersionOrHigherCache_[e] = 0 <= goog.string.compareVersions(goog.userAgent.VERSION, e))
}
,
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher,
goog.userAgent.isDocumentModeOrHigher = function(e) {
    return goog.userAgent.DOCUMENT_MODE >= e
}
,
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher,
goog.userAgent.DOCUMENT_MODE = function() {
    var e = goog.global.document
      , t = goog.userAgent.getDocumentMode_();
    if (e && goog.userAgent.IE)
        return t || ("CSS1Compat" == e.compatMode ? parseInt(goog.userAgent.VERSION, 10) : 5)
}(),
goog.provide("goog.math.Size"),
goog.math.Size = function(e, t) {
    this.width = e,
    this.height = t
}
,
goog.math.Size.equals = function(e, t) {
    return e == t || !(!e || !t) && (e.width == t.width && e.height == t.height)
}
,
goog.math.Size.prototype.clone = function() {
    return new goog.math.Size(this.width,this.height)
}
,
goog.DEBUG && (goog.math.Size.prototype.toString = function() {
    return "(" + this.width + " x " + this.height + ")"
}
),
goog.math.Size.prototype.getLongest = function() {
    return Math.max(this.width, this.height)
}
,
goog.math.Size.prototype.getShortest = function() {
    return Math.min(this.width, this.height)
}
,
goog.math.Size.prototype.area = function() {
    return this.width * this.height
}
,
goog.math.Size.prototype.perimeter = function() {
    return 2 * (this.width + this.height)
}
,
goog.math.Size.prototype.aspectRatio = function() {
    return this.width / this.height
}
,
goog.math.Size.prototype.isEmpty = function() {
    return !this.area()
}
,
goog.math.Size.prototype.ceil = function() {
    return this.width = Math.ceil(this.width),
    this.height = Math.ceil(this.height),
    this
}
,
goog.math.Size.prototype.fitsInside = function(e) {
    return this.width <= e.width && this.height <= e.height
}
,
goog.math.Size.prototype.floor = function() {
    return this.width = Math.floor(this.width),
    this.height = Math.floor(this.height),
    this
}
,
goog.math.Size.prototype.round = function() {
    return this.width = Math.round(this.width),
    this.height = Math.round(this.height),
    this
}
,
goog.math.Size.prototype.scale = function(e, t) {
    t = goog.isNumber(t) ? t : e;
    return this.width *= e,
    this.height *= t,
    this
}
,
goog.math.Size.prototype.scaleToCover = function(e) {
    e = this.aspectRatio() <= e.aspectRatio() ? e.width / this.width : e.height / this.height;
    return this.scale(e)
}
,
goog.math.Size.prototype.scaleToFit = function(e) {
    e = this.aspectRatio() > e.aspectRatio() ? e.width / this.width : e.height / this.height;
    return this.scale(e)
}
,
goog.provide("goog.math.Rect"),
goog.require("goog.math.Box"),
goog.require("goog.math.Coordinate"),
goog.require("goog.math.Size"),
goog.math.Rect = function(e, t, o, r) {
    this.left = e,
    this.top = t,
    this.width = o,
    this.height = r
}
,
goog.math.Rect.prototype.clone = function() {
    return new goog.math.Rect(this.left,this.top,this.width,this.height)
}
,
goog.math.Rect.prototype.toBox = function() {
    var e = this.left + this.width
      , t = this.top + this.height;
    return new goog.math.Box(this.top,e,t,this.left)
}
,
goog.math.Rect.createFromPositionAndSize = function(e, t) {
    return new goog.math.Rect(e.x,e.y,t.width,t.height)
}
,
goog.math.Rect.createFromBox = function(e) {
    return new goog.math.Rect(e.left,e.top,e.right - e.left,e.bottom - e.top)
}
,
goog.DEBUG && (goog.math.Rect.prototype.toString = function() {
    return "(" + this.left + ", " + this.top + " - " + this.width + "w x " + this.height + "h)"
}
),
goog.math.Rect.equals = function(e, t) {
    return e == t || !(!e || !t) && (e.left == t.left && e.width == t.width && e.top == t.top && e.height == t.height)
}
,
goog.math.Rect.prototype.intersection = function(e) {
    var t = Math.max(this.left, e.left)
      , o = Math.min(this.left + this.width, e.left + e.width);
    if (t <= o) {
        var r = Math.max(this.top, e.top)
          , e = Math.min(this.top + this.height, e.top + e.height);
        if (r <= e)
            return this.left = t,
            this.top = r,
            this.width = o - t,
            this.height = e - r,
            !0
    }
    return !1
}
,
goog.math.Rect.intersection = function(e, t) {
    var o = Math.max(e.left, t.left)
      , r = Math.min(e.left + e.width, t.left + t.width);
    if (o <= r) {
        var i = Math.max(e.top, t.top)
          , t = Math.min(e.top + e.height, t.top + t.height);
        if (i <= t)
            return new goog.math.Rect(o,i,r - o,t - i)
    }
    return null
}
,
goog.math.Rect.intersects = function(e, t) {
    return e.left <= t.left + t.width && t.left <= e.left + e.width && e.top <= t.top + t.height && t.top <= e.top + e.height
}
,
goog.math.Rect.prototype.intersects = function(e) {
    return goog.math.Rect.intersects(this, e)
}
,
goog.math.Rect.difference = function(e, t) {
    var o = goog.math.Rect.intersection(e, t);
    if (!o || !o.height || !o.width)
        return [e.clone()];
    var r = []
      , i = e.top
      , s = e.height
      , a = e.left + e.width
      , g = e.top + e.height
      , n = t.left + t.width
      , o = t.top + t.height;
    return t.top > e.top && (r.push(new goog.math.Rect(e.left,e.top,e.width,t.top - e.top)),
    i = t.top,
    s -= t.top - e.top),
    o < g && (r.push(new goog.math.Rect(e.left,o,e.width,g - o)),
    s = o - i),
    t.left > e.left && r.push(new goog.math.Rect(e.left,i,t.left - e.left,s)),
    n < a && r.push(new goog.math.Rect(n,i,a - n,s)),
    r
}
,
goog.math.Rect.prototype.difference = function(e) {
    return goog.math.Rect.difference(this, e)
}
,
goog.math.Rect.prototype.boundingRect = function(e) {
    var t = Math.max(this.left + this.width, e.left + e.width)
      , o = Math.max(this.top + this.height, e.top + e.height);
    this.left = Math.min(this.left, e.left),
    this.top = Math.min(this.top, e.top),
    this.width = t - this.left,
    this.height = o - this.top
}
,
goog.math.Rect.boundingRect = function(e, t) {
    if (!e || !t)
        return null;
    e = e.clone();
    return e.boundingRect(t),
    e
}
,
goog.math.Rect.prototype.contains = function(e) {
    return e instanceof goog.math.Rect ? this.left <= e.left && this.left + this.width >= e.left + e.width && this.top <= e.top && this.top + this.height >= e.top + e.height : e.x >= this.left && e.x <= this.left + this.width && e.y >= this.top && e.y <= this.top + this.height
}
,
goog.math.Rect.prototype.squaredDistance = function(e) {
    var t = e.x < this.left ? this.left - e.x : Math.max(e.x - (this.left + this.width), 0)
      , e = e.y < this.top ? this.top - e.y : Math.max(e.y - (this.top + this.height), 0);
    return t * t + e * e
}
,
goog.math.Rect.prototype.distance = function(e) {
    return Math.sqrt(this.squaredDistance(e))
}
,
goog.math.Rect.prototype.getSize = function() {
    return new goog.math.Size(this.width,this.height)
}
,
goog.math.Rect.prototype.getTopLeft = function() {
    return new goog.math.Coordinate(this.left,this.top)
}
,
goog.math.Rect.prototype.getCenter = function() {
    return new goog.math.Coordinate(this.left + this.width / 2,this.top + this.height / 2)
}
,
goog.math.Rect.prototype.getBottomRight = function() {
    return new goog.math.Coordinate(this.left + this.width,this.top + this.height)
}
,
goog.math.Rect.prototype.ceil = function() {
    return this.left = Math.ceil(this.left),
    this.top = Math.ceil(this.top),
    this.width = Math.ceil(this.width),
    this.height = Math.ceil(this.height),
    this
}
,
goog.math.Rect.prototype.floor = function() {
    return this.left = Math.floor(this.left),
    this.top = Math.floor(this.top),
    this.width = Math.floor(this.width),
    this.height = Math.floor(this.height),
    this
}
,
goog.math.Rect.prototype.round = function() {
    return this.left = Math.round(this.left),
    this.top = Math.round(this.top),
    this.width = Math.round(this.width),
    this.height = Math.round(this.height),
    this
}
,
goog.math.Rect.prototype.translate = function(e, t) {
    return e instanceof goog.math.Coordinate ? (this.left += e.x,
    this.top += e.y) : (this.left += e,
    goog.isNumber(t) && (this.top += t)),
    this
}
,
goog.math.Rect.prototype.scale = function(e, t) {
    t = goog.isNumber(t) ? t : e;
    return this.left *= e,
    this.width *= e,
    this.top *= t,
    this.height *= t,
    this
}
,
goog.provide("goog.dom.vendor"),
goog.require("goog.string"),
goog.require("goog.userAgent"),
goog.dom.vendor.getVendorJsPrefix = function() {
    return goog.userAgent.WEBKIT ? "Webkit" : goog.userAgent.GECKO ? "Moz" : goog.userAgent.IE ? "ms" : goog.userAgent.OPERA ? "O" : null
}
,
goog.dom.vendor.getVendorPrefix = function() {
    return goog.userAgent.WEBKIT ? "-webkit" : goog.userAgent.GECKO ? "-moz" : goog.userAgent.IE ? "-ms" : goog.userAgent.OPERA ? "-o" : null
}
,
goog.dom.vendor.getPrefixedPropertyName = function(e, t) {
    if (t && e in t)
        return e;
    if (o = goog.dom.vendor.getVendorJsPrefix()) {
        var o, e = (o = o.toLowerCase()) + goog.string.toTitleCase(e);
        return !goog.isDef(t) || e in t ? e : null
    }
    return null
}
,
goog.dom.vendor.getPrefixedEventType = function(e) {
    return ((goog.dom.vendor.getVendorJsPrefix() || "") + e).toLowerCase()
}
,
goog.provide("goog.fs.url"),
goog.fs.url.createObjectUrl = function(e) {
    return goog.fs.url.getUrlObject_().createObjectURL(e)
}
,
goog.fs.url.revokeObjectUrl = function(e) {
    goog.fs.url.getUrlObject_().revokeObjectURL(e)
}
,
goog.fs.url.UrlObject_,
goog.fs.url.getUrlObject_ = function() {
    var e = goog.fs.url.findUrlObject_();
    if (null != e)
        return e;
    throw Error("This browser doesn't seem to support blob URLs")
}
,
goog.fs.url.findUrlObject_ = function() {
    return goog.isDef(goog.global.URL) && goog.isDef(goog.global.URL.createObjectURL) ? goog.global.URL : goog.isDef(goog.global.webkitURL) && goog.isDef(goog.global.webkitURL.createObjectURL) ? goog.global.webkitURL : goog.isDef(goog.global.createObjectURL) ? goog.global : null
}
,
goog.fs.url.browserSupportsObjectUrls = function() {
    return null != goog.fs.url.findUrlObject_()
}
,
goog.provide("goog.string.TypedString"),
goog.string.TypedString = function() {}
,
goog.string.TypedString.prototype.implementsGoogStringTypedString,
goog.string.TypedString.prototype.getTypedStringValue,
goog.provide("goog.string.Const"),
goog.require("goog.asserts"),
goog.require("goog.string.TypedString"),
goog.string.Const = function() {
    this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ = "",
    this.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ = goog.string.Const.TYPE_MARKER_
}
,
goog.string.Const.prototype.implementsGoogStringTypedString = !0,
goog.string.Const.prototype.getTypedStringValue = function() {
    return this.stringConstValueWithSecurityContract__googStringSecurityPrivate_
}
,
goog.string.Const.prototype.toString = function() {
    return "Const{" + this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ + "}"
}
,
goog.string.Const.unwrap = function(e) {
    return e instanceof goog.string.Const && e.constructor === goog.string.Const && e.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ === goog.string.Const.TYPE_MARKER_ ? e.stringConstValueWithSecurityContract__googStringSecurityPrivate_ : (goog.asserts.fail("expected object of type Const, got '" + e + "'"),
    "type_error:Const")
}
,
goog.string.Const.from = function(e) {
    return goog.string.Const.create__googStringSecurityPrivate_(e)
}
,
goog.string.Const.TYPE_MARKER_ = {},
goog.string.Const.create__googStringSecurityPrivate_ = function(e) {
    var t = new goog.string.Const;
    return t.stringConstValueWithSecurityContract__googStringSecurityPrivate_ = e,
    t
}
,
goog.provide("goog.i18n.bidi"),
goog.provide("goog.i18n.bidi.Dir"),
goog.provide("goog.i18n.bidi.DirectionalString"),
goog.provide("goog.i18n.bidi.Format"),
goog.define("goog.i18n.bidi.FORCE_RTL", !1),
goog.i18n.bidi.IS_RTL = goog.i18n.bidi.FORCE_RTL || ("ar" == goog.LOCALE.substring(0, 2).toLowerCase() || "fa" == goog.LOCALE.substring(0, 2).toLowerCase() || "he" == goog.LOCALE.substring(0, 2).toLowerCase() || "iw" == goog.LOCALE.substring(0, 2).toLowerCase() || "ps" == goog.LOCALE.substring(0, 2).toLowerCase() || "sd" == goog.LOCALE.substring(0, 2).toLowerCase() || "ug" == goog.LOCALE.substring(0, 2).toLowerCase() || "ur" == goog.LOCALE.substring(0, 2).toLowerCase() || "yi" == goog.LOCALE.substring(0, 2).toLowerCase()) && (2 == goog.LOCALE.length || "-" == goog.LOCALE.substring(2, 3) || "_" == goog.LOCALE.substring(2, 3)) || 3 <= goog.LOCALE.length && "ckb" == goog.LOCALE.substring(0, 3).toLowerCase() && (3 == goog.LOCALE.length || "-" == goog.LOCALE.substring(3, 4) || "_" == goog.LOCALE.substring(3, 4)),
goog.i18n.bidi.Format = {
    LRE: "‪",
    RLE: "‫",
    PDF: "‬",
    LRM: "‎",
    RLM: "‏"
},
goog.i18n.bidi.Dir = {
    LTR: 1,
    RTL: -1,
    NEUTRAL: 0
},
goog.i18n.bidi.RIGHT = "right",
goog.i18n.bidi.LEFT = "left",
goog.i18n.bidi.I18N_RIGHT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.LEFT : goog.i18n.bidi.RIGHT,
goog.i18n.bidi.I18N_LEFT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT,
goog.i18n.bidi.toDir = function(e, t) {
    return "number" == typeof e ? 0 < e ? goog.i18n.bidi.Dir.LTR : e < 0 ? goog.i18n.bidi.Dir.RTL : t ? null : goog.i18n.bidi.Dir.NEUTRAL : null == e ? null : e ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR
}
,
goog.i18n.bidi.ltrChars_ = "A-Za-zÀ-ÖØ-öø-ʸ̀-֐ࠀ-῿‎Ⰰ-﬜︀-﹯﻽-￿",
goog.i18n.bidi.rtlChars_ = "֑-ۯۺ-߿‏יִ-﷿ﹰ-ﻼ",
goog.i18n.bidi.htmlSkipReg_ = /<[^>]*>|&[^;]+;/g,
goog.i18n.bidi.stripHtmlIfNeeded_ = function(e, t) {
    return t ? e.replace(goog.i18n.bidi.htmlSkipReg_, "") : e
}
,
goog.i18n.bidi.rtlCharReg_ = new RegExp("[" + goog.i18n.bidi.rtlChars_ + "]"),
goog.i18n.bidi.ltrCharReg_ = new RegExp("[" + goog.i18n.bidi.ltrChars_ + "]"),
goog.i18n.bidi.hasAnyRtl = function(e, t) {
    return goog.i18n.bidi.rtlCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(e, t))
}
,
goog.i18n.bidi.hasRtlChar = goog.i18n.bidi.hasAnyRtl,
goog.i18n.bidi.hasAnyLtr = function(e, t) {
    return goog.i18n.bidi.ltrCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(e, t))
}
,
goog.i18n.bidi.ltrRe_ = new RegExp("^[" + goog.i18n.bidi.ltrChars_ + "]"),
goog.i18n.bidi.rtlRe_ = new RegExp("^[" + goog.i18n.bidi.rtlChars_ + "]"),
goog.i18n.bidi.isRtlChar = function(e) {
    return goog.i18n.bidi.rtlRe_.test(e)
}
,
goog.i18n.bidi.isLtrChar = function(e) {
    return goog.i18n.bidi.ltrRe_.test(e)
}
,
goog.i18n.bidi.isNeutralChar = function(e) {
    return !goog.i18n.bidi.isLtrChar(e) && !goog.i18n.bidi.isRtlChar(e)
}
,
goog.i18n.bidi.ltrDirCheckRe_ = new RegExp("^[^" + goog.i18n.bidi.rtlChars_ + "]*[" + goog.i18n.bidi.ltrChars_ + "]"),
goog.i18n.bidi.rtlDirCheckRe_ = new RegExp("^[^" + goog.i18n.bidi.ltrChars_ + "]*[" + goog.i18n.bidi.rtlChars_ + "]"),
goog.i18n.bidi.startsWithRtl = function(e, t) {
    return goog.i18n.bidi.rtlDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(e, t))
}
,
goog.i18n.bidi.isRtlText = goog.i18n.bidi.startsWithRtl,
goog.i18n.bidi.startsWithLtr = function(e, t) {
    return goog.i18n.bidi.ltrDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(e, t))
}
,
goog.i18n.bidi.isLtrText = goog.i18n.bidi.startsWithLtr,
goog.i18n.bidi.isRequiredLtrRe_ = /^http:\/\/.*/,
goog.i18n.bidi.isNeutralText = function(e, t) {
    return e = goog.i18n.bidi.stripHtmlIfNeeded_(e, t),
    goog.i18n.bidi.isRequiredLtrRe_.test(e) || !goog.i18n.bidi.hasAnyLtr(e) && !goog.i18n.bidi.hasAnyRtl(e)
}
,
goog.i18n.bidi.ltrExitDirCheckRe_ = new RegExp("[" + goog.i18n.bidi.ltrChars_ + "][^" + goog.i18n.bidi.rtlChars_ + "]*$"),
goog.i18n.bidi.rtlExitDirCheckRe_ = new RegExp("[" + goog.i18n.bidi.rtlChars_ + "][^" + goog.i18n.bidi.ltrChars_ + "]*$"),
goog.i18n.bidi.endsWithLtr = function(e, t) {
    return goog.i18n.bidi.ltrExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(e, t))
}
,
goog.i18n.bidi.isLtrExitText = goog.i18n.bidi.endsWithLtr,
goog.i18n.bidi.endsWithRtl = function(e, t) {
    return goog.i18n.bidi.rtlExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(e, t))
}
,
goog.i18n.bidi.isRtlExitText = goog.i18n.bidi.endsWithRtl,
goog.i18n.bidi.rtlLocalesRe_ = new RegExp("^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Arab|Hebr|Thaa|Nkoo|Tfng))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)","i"),
goog.i18n.bidi.isRtlLanguage = function(e) {
    return goog.i18n.bidi.rtlLocalesRe_.test(e)
}
,
goog.i18n.bidi.bracketGuardHtmlRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(&lt;.*?(&gt;)+)/g,
goog.i18n.bidi.bracketGuardTextRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(<.*?>+)/g,
goog.i18n.bidi.guardBracketInHtml = function(e, t) {
    return (void 0 === t ? goog.i18n.bidi.hasAnyRtl(e) : t) ? e.replace(goog.i18n.bidi.bracketGuardHtmlRe_, "<span dir=rtl>$&</span>") : e.replace(goog.i18n.bidi.bracketGuardHtmlRe_, "<span dir=ltr>$&</span>")
}
,
goog.i18n.bidi.guardBracketInText = function(e, t) {
    t = (void 0 === t ? goog.i18n.bidi.hasAnyRtl(e) : t) ? goog.i18n.bidi.Format.RLM : goog.i18n.bidi.Format.LRM;
    return e.replace(goog.i18n.bidi.bracketGuardTextRe_, t + "$&" + t)
}
,
goog.i18n.bidi.enforceRtlInHtml = function(e) {
    return "<" == e.charAt(0) ? e.replace(/<\w+/, "$& dir=rtl") : "\n<span dir=rtl>" + e + "</span>"
}
,
goog.i18n.bidi.enforceRtlInText = function(e) {
    return goog.i18n.bidi.Format.RLE + e + goog.i18n.bidi.Format.PDF
}
,
goog.i18n.bidi.enforceLtrInHtml = function(e) {
    return "<" == e.charAt(0) ? e.replace(/<\w+/, "$& dir=ltr") : "\n<span dir=ltr>" + e + "</span>"
}
,
goog.i18n.bidi.enforceLtrInText = function(e) {
    return goog.i18n.bidi.Format.LRE + e + goog.i18n.bidi.Format.PDF
}
,
goog.i18n.bidi.dimensionsRe_ = /:\s*([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)/g,
goog.i18n.bidi.leftRe_ = /left/gi,
goog.i18n.bidi.rightRe_ = /right/gi,
goog.i18n.bidi.tempRe_ = /%%%%/g,
goog.i18n.bidi.mirrorCSS = function(e) {
    return e.replace(goog.i18n.bidi.dimensionsRe_, ":$1 $4 $3 $2").replace(goog.i18n.bidi.leftRe_, "%%%%").replace(goog.i18n.bidi.rightRe_, goog.i18n.bidi.LEFT).replace(goog.i18n.bidi.tempRe_, goog.i18n.bidi.RIGHT)
}
,
goog.i18n.bidi.doubleQuoteSubstituteRe_ = /([\u0591-\u05f2])"/g,
goog.i18n.bidi.singleQuoteSubstituteRe_ = /([\u0591-\u05f2])'/g,
goog.i18n.bidi.normalizeHebrewQuote = function(e) {
    return e.replace(goog.i18n.bidi.doubleQuoteSubstituteRe_, "$1״").replace(goog.i18n.bidi.singleQuoteSubstituteRe_, "$1׳")
}
,
goog.i18n.bidi.wordSeparatorRe_ = /\s+/,
goog.i18n.bidi.hasNumeralsRe_ = /[\d\u06f0-\u06f9]/,
goog.i18n.bidi.rtlDetectionThreshold_ = .4,
goog.i18n.bidi.estimateDirection = function(e, t) {
    for (var o = 0, r = 0, i = !1, s = goog.i18n.bidi.stripHtmlIfNeeded_(e, t).split(goog.i18n.bidi.wordSeparatorRe_), a = 0; a < s.length; a++) {
        var g = s[a];
        goog.i18n.bidi.startsWithRtl(g) ? (o++,
        r++) : goog.i18n.bidi.isRequiredLtrRe_.test(g) ? i = !0 : goog.i18n.bidi.hasAnyLtr(g) ? r++ : goog.i18n.bidi.hasNumeralsRe_.test(g) && (i = !0)
    }
    return 0 == r ? i ? goog.i18n.bidi.Dir.LTR : goog.i18n.bidi.Dir.NEUTRAL : o / r > goog.i18n.bidi.rtlDetectionThreshold_ ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR
}
,
goog.i18n.bidi.detectRtlDirectionality = function(e, t) {
    return goog.i18n.bidi.estimateDirection(e, t) == goog.i18n.bidi.Dir.RTL
}
,
goog.i18n.bidi.setElementDirAndAlign = function(e, t) {
    e && (t = goog.i18n.bidi.toDir(t)) && (e.style.textAlign = t == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT,
    e.dir = t == goog.i18n.bidi.Dir.RTL ? "rtl" : "ltr")
}
,
goog.i18n.bidi.setElementDirByTextDirectionality = function(e, t) {
    switch (goog.i18n.bidi.estimateDirection(t)) {
    case goog.i18n.bidi.Dir.LTR:
        e.dir = "ltr";
        break;
    case goog.i18n.bidi.Dir.RTL:
        e.dir = "rtl";
        break;
    default:
        e.removeAttribute("dir")
    }
}
,
goog.i18n.bidi.DirectionalString = function() {}
,
goog.i18n.bidi.DirectionalString.prototype.implementsGoogI18nBidiDirectionalString,
goog.i18n.bidi.DirectionalString.prototype.getDirection,
goog.provide("goog.html.SafeUrl"),
goog.require("goog.asserts"),
goog.require("goog.fs.url"),
goog.require("goog.i18n.bidi.Dir"),
goog.require("goog.i18n.bidi.DirectionalString"),
goog.require("goog.string.Const"),
goog.require("goog.string.TypedString"),
goog.html.SafeUrl = function() {
    this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = "",
    this.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_
}
,
goog.html.SafeUrl.INNOCUOUS_STRING = "about:invalid#zClosurez",
goog.html.SafeUrl.prototype.implementsGoogStringTypedString = !0,
goog.html.SafeUrl.prototype.getTypedStringValue = function() {
    return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_
}
,
goog.html.SafeUrl.prototype.implementsGoogI18nBidiDirectionalString = !0,
goog.html.SafeUrl.prototype.getDirection = function() {
    return goog.i18n.bidi.Dir.LTR
}
,
goog.DEBUG && (goog.html.SafeUrl.prototype.toString = function() {
    return "SafeUrl{" + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ + "}"
}
),
goog.html.SafeUrl.unwrap = function(e) {
    return e instanceof goog.html.SafeUrl && e.constructor === goog.html.SafeUrl && e.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ ? e.privateDoNotAccessOrElseSafeHtmlWrappedValue_ : (goog.asserts.fail("expected object of type SafeUrl, got '" + e + "'"),
    "type_error:SafeUrl")
}
,
goog.html.SafeUrl.fromConstant = function(e) {
    return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(goog.string.Const.unwrap(e))
}
,
goog.html.SAFE_MIME_TYPE_PATTERN_ = /^(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm))$/i,
goog.html.SafeUrl.fromBlob = function(e) {
    e = goog.html.SAFE_MIME_TYPE_PATTERN_.test(e.type) ? goog.fs.url.createObjectUrl(e) : goog.html.SafeUrl.INNOCUOUS_STRING;
    return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(e)
}
,
goog.html.DATA_URL_PATTERN_ = /^data:([^;,]*);base64,[a-z0-9+\/]+=*$/i,
goog.html.SafeUrl.fromDataUrl = function(e) {
    var t = e.match(goog.html.DATA_URL_PATTERN_)
      , t = t && goog.html.SAFE_MIME_TYPE_PATTERN_.test(t[1]);
    return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(t ? e : goog.html.SafeUrl.INNOCUOUS_STRING)
}
,
goog.html.SAFE_URL_PATTERN_ = /^(?:(?:https?|mailto|ftp):|[^&:/?#]*(?:[/?#]|$))/i,
goog.html.SafeUrl.sanitize = function(e) {
    return e instanceof goog.html.SafeUrl ? e : (e = e.implementsGoogStringTypedString ? e.getTypedStringValue() : String(e),
    goog.html.SAFE_URL_PATTERN_.test(e) || (e = goog.html.SafeUrl.INNOCUOUS_STRING),
    goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(e))
}
,
goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {},
goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse = function(e) {
    var t = new goog.html.SafeUrl;
    return t.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = e,
    t
}
,
goog.provide("goog.html.TrustedResourceUrl"),
goog.require("goog.asserts"),
goog.require("goog.i18n.bidi.Dir"),
goog.require("goog.i18n.bidi.DirectionalString"),
goog.require("goog.string.Const"),
goog.require("goog.string.TypedString"),
goog.html.TrustedResourceUrl = function() {
    this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ = "",
    this.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_
}
,
goog.html.TrustedResourceUrl.prototype.implementsGoogStringTypedString = !0,
goog.html.TrustedResourceUrl.prototype.getTypedStringValue = function() {
    return this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_
}
,
goog.html.TrustedResourceUrl.prototype.implementsGoogI18nBidiDirectionalString = !0,
goog.html.TrustedResourceUrl.prototype.getDirection = function() {
    return goog.i18n.bidi.Dir.LTR
}
,
goog.DEBUG && (goog.html.TrustedResourceUrl.prototype.toString = function() {
    return "TrustedResourceUrl{" + this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ + "}"
}
),
goog.html.TrustedResourceUrl.unwrap = function(e) {
    return e instanceof goog.html.TrustedResourceUrl && e.constructor === goog.html.TrustedResourceUrl && e.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ ? e.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ : (goog.asserts.fail("expected object of type TrustedResourceUrl, got '" + e + "'"),
    "type_error:TrustedResourceUrl")
}
,
goog.html.TrustedResourceUrl.fromConstant = function(e) {
    return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(goog.string.Const.unwrap(e))
}
,
goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {},
goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse = function(e) {
    var t = new goog.html.TrustedResourceUrl;
    return t.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ = e,
    t
}
,
goog.provide("goog.dom.tags"),
goog.require("goog.object"),
goog.dom.tags.VOID_TAGS_ = goog.object.createSet("area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"),
goog.dom.tags.isVoidTag = function(e) {
    return !0 === goog.dom.tags.VOID_TAGS_[e]
}
,
goog.provide("goog.html.SafeStyle"),
goog.require("goog.array"),
goog.require("goog.asserts"),
goog.require("goog.string"),
goog.require("goog.string.Const"),
goog.require("goog.string.TypedString"),
goog.html.SafeStyle = function() {
    this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = "",
    this.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_
}
,
goog.html.SafeStyle.prototype.implementsGoogStringTypedString = !0,
goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {},
goog.html.SafeStyle.fromConstant = function(e) {
    e = goog.string.Const.unwrap(e);
    return 0 === e.length ? goog.html.SafeStyle.EMPTY : (goog.html.SafeStyle.checkStyle_(e),
    goog.asserts.assert(goog.string.endsWith(e, ";"), "Last character of style string is not ';': " + e),
    goog.asserts.assert(goog.string.contains(e, ":"), "Style string must contain at least one ':', to specify a \"name: value\" pair: " + e),
    goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(e))
}
,
goog.html.SafeStyle.checkStyle_ = function(e) {
    goog.asserts.assert(!/[<>]/.test(e), "Forbidden characters in style string: " + e)
}
,
goog.html.SafeStyle.prototype.getTypedStringValue = function() {
    return this.privateDoNotAccessOrElseSafeStyleWrappedValue_
}
,
goog.DEBUG && (goog.html.SafeStyle.prototype.toString = function() {
    return "SafeStyle{" + this.privateDoNotAccessOrElseSafeStyleWrappedValue_ + "}"
}
),
goog.html.SafeStyle.unwrap = function(e) {
    return e instanceof goog.html.SafeStyle && e.constructor === goog.html.SafeStyle && e.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ ? e.privateDoNotAccessOrElseSafeStyleWrappedValue_ : (goog.asserts.fail("expected object of type SafeStyle, got '" + e + "'"),
    "type_error:SafeStyle")
}
,
goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse = function(e) {
    return (new goog.html.SafeStyle).initSecurityPrivateDoNotAccessOrElse_(e)
}
,
goog.html.SafeStyle.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(e) {
    return this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = e,
    this
}
,
goog.html.SafeStyle.EMPTY = goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(""),
goog.html.SafeStyle.INNOCUOUS_STRING = "zClosurez",
goog.html.SafeStyle.PropertyMap,
goog.html.SafeStyle.create = function(e) {
    var t, o = "";
    for (t in e) {
        if (!/^[-_a-zA-Z0-9]+$/.test(t))
            throw Error("Name allows only [-_a-zA-Z0-9], got: " + t);
        var r = e[t];
        null != r && (r instanceof goog.string.Const ? (r = goog.string.Const.unwrap(r),
        goog.asserts.assert(!/[{;}]/.test(r), "Value does not allow [{;}].")) : goog.html.SafeStyle.VALUE_RE_.test(r) ? goog.html.SafeStyle.hasBalancedQuotes_(r) || (goog.asserts.fail("String value requires balanced quotes, got: " + r),
        r = goog.html.SafeStyle.INNOCUOUS_STRING) : (goog.asserts.fail("String value allows only [-,.\"'%_!# a-zA-Z0-9], got: " + r),
        r = goog.html.SafeStyle.INNOCUOUS_STRING),
        o += t + ":" + r + ";")
    }
    return o ? (goog.html.SafeStyle.checkStyle_(o),
    goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(o)) : goog.html.SafeStyle.EMPTY
}
,
goog.html.SafeStyle.hasBalancedQuotes_ = function(e) {
    for (var t = !0, o = !0, r = 0; r < e.length; r++) {
        var i = e.charAt(r);
        "'" == i && o ? t = !t : '"' == i && t && (o = !o)
    }
    return t && o
}
,
goog.html.SafeStyle.VALUE_RE_ = /^[-,."'%_!# a-zA-Z0-9]+$/,
goog.html.SafeStyle.concat = function(e) {
    var t = ""
      , o = function(e) {
        goog.isArray(e) ? goog.array.forEach(e, o) : t += goog.html.SafeStyle.unwrap(e)
    };
    return goog.array.forEach(arguments, o),
    t ? goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(t) : goog.html.SafeStyle.EMPTY
}
,
goog.provide("goog.html.SafeStyleSheet"),
goog.require("goog.array"),
goog.require("goog.asserts"),
goog.require("goog.string"),
goog.require("goog.string.Const"),
goog.require("goog.string.TypedString"),
goog.html.SafeStyleSheet = function() {
    this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = "",
    this.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_
}
,
goog.html.SafeStyleSheet.prototype.implementsGoogStringTypedString = !0,
goog.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {},
goog.html.SafeStyleSheet.concat = function(e) {
    var t = ""
      , o = function(e) {
        goog.isArray(e) ? goog.array.forEach(e, o) : t += goog.html.SafeStyleSheet.unwrap(e)
    };
    return goog.array.forEach(arguments, o),
    goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(t)
}
,
goog.html.SafeStyleSheet.fromConstant = function(e) {
    e = goog.string.Const.unwrap(e);
    return 0 === e.length ? goog.html.SafeStyleSheet.EMPTY : (goog.asserts.assert(!goog.string.contains(e, "<"), "Forbidden '<' character in style sheet string: " + e),
    goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(e))
}
,
goog.html.SafeStyleSheet.prototype.getTypedStringValue = function() {
    return this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_
}
,
goog.DEBUG && (goog.html.SafeStyleSheet.prototype.toString = function() {
    return "SafeStyleSheet{" + this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ + "}"
}
),
goog.html.SafeStyleSheet.unwrap = function(e) {
    return e instanceof goog.html.SafeStyleSheet && e.constructor === goog.html.SafeStyleSheet && e.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ ? e.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ : (goog.asserts.fail("expected object of type SafeStyleSheet, got '" + e + "'"),
    "type_error:SafeStyleSheet")
}
,
goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse = function(e) {
    return (new goog.html.SafeStyleSheet).initSecurityPrivateDoNotAccessOrElse_(e)
}
,
goog.html.SafeStyleSheet.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(e) {
    return this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = e,
    this
}
,
goog.html.SafeStyleSheet.EMPTY = goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(""),
goog.provide("goog.html.SafeHtml"),
goog.require("goog.array"),
goog.require("goog.asserts"),
goog.require("goog.dom.TagName"),
goog.require("goog.dom.tags"),
goog.require("goog.html.SafeStyle"),
goog.require("goog.html.SafeStyleSheet"),
goog.require("goog.html.SafeUrl"),
goog.require("goog.html.TrustedResourceUrl"),
goog.require("goog.i18n.bidi.Dir"),
goog.require("goog.i18n.bidi.DirectionalString"),
goog.require("goog.object"),
goog.require("goog.string"),
goog.require("goog.string.Const"),
goog.require("goog.string.TypedString"),
goog.html.SafeHtml = function() {
    this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = "",
    this.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_,
    this.dir_ = null
}
,
goog.html.SafeHtml.prototype.implementsGoogI18nBidiDirectionalString = !0,
goog.html.SafeHtml.prototype.getDirection = function() {
    return this.dir_
}
,
goog.html.SafeHtml.prototype.implementsGoogStringTypedString = !0,
goog.html.SafeHtml.prototype.getTypedStringValue = function() {
    return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_
}
,
goog.DEBUG && (goog.html.SafeHtml.prototype.toString = function() {
    return "SafeHtml{" + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ + "}"
}
),
goog.html.SafeHtml.unwrap = function(e) {
    return e instanceof goog.html.SafeHtml && e.constructor === goog.html.SafeHtml && e.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ ? e.privateDoNotAccessOrElseSafeHtmlWrappedValue_ : (goog.asserts.fail("expected object of type SafeHtml, got '" + e + "'"),
    "type_error:SafeHtml")
}
,
goog.html.SafeHtml.TextOrHtml_,
goog.html.SafeHtml.htmlEscape = function(e) {
    if (e instanceof goog.html.SafeHtml)
        return e;
    var t = null;
    return e.implementsGoogI18nBidiDirectionalString && (t = e.getDirection()),
    e = e.implementsGoogStringTypedString ? e.getTypedStringValue() : String(e),
    goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(goog.string.htmlEscape(e), t)
}
,
goog.html.SafeHtml.htmlEscapePreservingNewlines = function(e) {
    if (e instanceof goog.html.SafeHtml)
        return e;
    e = goog.html.SafeHtml.htmlEscape(e);
    return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(goog.string.newLineToBr(goog.html.SafeHtml.unwrap(e)), e.getDirection())
}
,
goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces = function(e) {
    if (e instanceof goog.html.SafeHtml)
        return e;
    e = goog.html.SafeHtml.htmlEscape(e);
    return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(goog.string.whitespaceEscape(goog.html.SafeHtml.unwrap(e)), e.getDirection())
}
,
goog.html.SafeHtml.from = goog.html.SafeHtml.htmlEscape,
goog.html.SafeHtml.VALID_NAMES_IN_TAG_ = /^[a-zA-Z0-9-]+$/,
goog.html.SafeHtml.URL_ATTRIBUTES_ = goog.object.createSet("action", "cite", "data", "formaction", "href", "manifest", "poster", "src"),
goog.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_ = goog.object.createSet(goog.dom.TagName.EMBED, goog.dom.TagName.IFRAME, goog.dom.TagName.LINK, goog.dom.TagName.OBJECT, goog.dom.TagName.SCRIPT, goog.dom.TagName.STYLE, goog.dom.TagName.TEMPLATE),
goog.html.SafeHtml.AttributeValue_,
goog.html.SafeHtml.create = function(e, t, o) {
    if (!goog.html.SafeHtml.VALID_NAMES_IN_TAG_.test(e))
        throw Error("Invalid tag name <" + e + ">.");
    if (e.toUpperCase()in goog.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_)
        throw Error("Tag name <" + e + "> is not allowed for SafeHtml.");
    return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(e, t, o)
}
,
goog.html.SafeHtml.createIframe = function(e, t, o, r) {
    var i = {};
    i.src = e || null,
    i.srcdoc = t || null;
    o = goog.html.SafeHtml.combineAttributes(i, {
        sandbox: ""
    }, o);
    return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("iframe", o, r)
}
,
goog.html.SafeHtml.createStyle = function(e, t) {
    var o = goog.html.SafeHtml.combineAttributes({
        type: "text/css"
    }, {}, t)
      , r = "";
    e = goog.array.concat(e);
    for (var i = 0; i < e.length; i++)
        r += goog.html.SafeStyleSheet.unwrap(e[i]);
    t = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(r, goog.i18n.bidi.Dir.NEUTRAL);
    return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("style", o, t)
}
,
goog.html.SafeHtml.getAttrNameAndValue_ = function(e, t, o) {
    if (o instanceof goog.string.Const)
        o = goog.string.Const.unwrap(o);
    else if ("style" == t.toLowerCase())
        o = goog.html.SafeHtml.getStyleValue_(o);
    else {
        if (/^on/i.test(t))
            throw Error('Attribute "' + t + '" requires goog.string.Const value, "' + o + '" given.');
        if (t.toLowerCase()in goog.html.SafeHtml.URL_ATTRIBUTES_)
            if (o instanceof goog.html.TrustedResourceUrl)
                o = goog.html.TrustedResourceUrl.unwrap(o);
            else if (o instanceof goog.html.SafeUrl)
                o = goog.html.SafeUrl.unwrap(o);
            else {
                if (!goog.isString(o))
                    throw Error('Attribute "' + t + '" on tag "' + e + '" requires goog.html.SafeUrl, goog.string.Const, or string, value "' + o + '" given.');
                o = goog.html.SafeUrl.sanitize(o).getTypedStringValue()
            }
    }
    return o.implementsGoogStringTypedString && (o = o.getTypedStringValue()),
    goog.asserts.assert(goog.isString(o) || goog.isNumber(o), "String or number value expected, got " + typeof o + " with value: " + o),
    t + '="' + goog.string.htmlEscape(String(o)) + '"'
}
,
goog.html.SafeHtml.getStyleValue_ = function(e) {
    if (!goog.isObject(e))
        throw Error('The "style" attribute requires goog.html.SafeStyle or map of style properties, ' + typeof e + " given: " + e);
    return e instanceof goog.html.SafeStyle || (e = goog.html.SafeStyle.create(e)),
    goog.html.SafeStyle.unwrap(e)
}
,
goog.html.SafeHtml.createWithDir = function(e, t, o, r) {
    r = goog.html.SafeHtml.create(t, o, r);
    return r.dir_ = e,
    r
}
,
goog.html.SafeHtml.concat = function(e) {
    var t = goog.i18n.bidi.Dir.NEUTRAL
      , o = ""
      , r = function(e) {
        goog.isArray(e) ? goog.array.forEach(e, r) : (e = goog.html.SafeHtml.htmlEscape(e),
        o += goog.html.SafeHtml.unwrap(e),
        e = e.getDirection(),
        t == goog.i18n.bidi.Dir.NEUTRAL ? t = e : e != goog.i18n.bidi.Dir.NEUTRAL && t != e && (t = null))
    };
    return goog.array.forEach(arguments, r),
    goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(o, t)
}
,
goog.html.SafeHtml.concatWithDir = function(e, t) {
    var o = goog.html.SafeHtml.concat(goog.array.slice(arguments, 1));
    return o.dir_ = e,
    o
}
,
goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {},
goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse = function(e, t) {
    return (new goog.html.SafeHtml).initSecurityPrivateDoNotAccessOrElse_(e, t)
}
,
goog.html.SafeHtml.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(e, t) {
    return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = e,
    this.dir_ = t,
    this
}
,
goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse = function(e, t, o) {
    var r = null
      , i = "<" + e;
    if (t)
        for (var s in t) {
            if (!goog.html.SafeHtml.VALID_NAMES_IN_TAG_.test(s))
                throw Error('Invalid attribute name "' + s + '".');
            var a = t[s];
            goog.isDefAndNotNull(a) && (i += " " + goog.html.SafeHtml.getAttrNameAndValue_(e, s, a))
        }
    goog.isDefAndNotNull(o) ? goog.isArray(o) || (o = [o]) : o = [],
    goog.dom.tags.isVoidTag(e.toLowerCase()) ? (goog.asserts.assert(!o.length, "Void tag <" + e + "> does not allow content."),
    i += ">") : (g = goog.html.SafeHtml.concat(o),
    i += ">" + goog.html.SafeHtml.unwrap(g) + "</" + e + ">",
    r = g.getDirection());
    var g = t && t.dir;
    return g && (r = /^(ltr|rtl|auto)$/i.test(g) ? goog.i18n.bidi.Dir.NEUTRAL : null),
    goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(i, r)
}
,
goog.html.SafeHtml.combineAttributes = function(e, t, o) {
    var r, i = {};
    for (r in e)
        goog.asserts.assert(r.toLowerCase() == r, "Must be lower case"),
        i[r] = e[r];
    for (r in t)
        goog.asserts.assert(r.toLowerCase() == r, "Must be lower case"),
        i[r] = t[r];
    for (r in o) {
        var s = r.toLowerCase();
        if (s in e)
            throw Error('Cannot override "' + s + '" attribute, got "' + r + '" with value "' + o[r] + '"');
        s in t && delete i[s],
        i[r] = o[r]
    }
    return i
}
,
goog.html.SafeHtml.DOCTYPE_HTML = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("<!DOCTYPE html>", goog.i18n.bidi.Dir.NEUTRAL),
goog.html.SafeHtml.EMPTY = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("", goog.i18n.bidi.Dir.NEUTRAL),
goog.provide("goog.dom.safe"),
goog.provide("goog.dom.safe.InsertAdjacentHtmlPosition"),
goog.require("goog.asserts"),
goog.require("goog.html.SafeHtml"),
goog.require("goog.html.SafeUrl"),
goog.require("goog.html.TrustedResourceUrl"),
goog.require("goog.string"),
goog.require("goog.string.Const"),
goog.dom.safe.InsertAdjacentHtmlPosition = {
    AFTERBEGIN: "afterbegin",
    AFTEREND: "afterend",
    BEFOREBEGIN: "beforebegin",
    BEFOREEND: "beforeend"
},
goog.dom.safe.insertAdjacentHtml = function(e, t, o) {
    e.insertAdjacentHTML(t, goog.html.SafeHtml.unwrap(o))
}
;
goog.dom.safe.setInnerHtml = function(e, t) {
    e.innerHTML = goog.html.SafeHtml.unwrap(t)
}
,
goog.dom.safe.setOuterHtml = function(e, t) {
    e.outerHTML = goog.html.SafeHtml.unwrap(t)
}
,
goog.dom.safe.documentWrite = function(e, t) {
    e.write(goog.html.SafeHtml.unwrap(t))
}
,
goog.dom.safe.setAnchorHref = function(e, t) {
    t = t instanceof goog.html.SafeUrl ? t : goog.html.SafeUrl.sanitize(t);
    e.href = goog.html.SafeUrl.unwrap(t)
}
,
goog.dom.safe.setEmbedSrc = function(e, t) {
    e.src = goog.html.TrustedResourceUrl.unwrap(t)
}
,
goog.dom.safe.setFrameSrc = function(e, t) {
    e.src = goog.html.TrustedResourceUrl.unwrap(t)
}
,
goog.dom.safe.setIframeSrc = function(e, t) {
    e.src = goog.html.TrustedResourceUrl.unwrap(t)
}
,
goog.dom.safe.setLinkHrefAndRel = function(e, t, o) {
    e.rel = o,
    goog.string.caseInsensitiveContains(o, "stylesheet") ? (goog.asserts.assert(t instanceof goog.html.TrustedResourceUrl, 'URL must be TrustedResourceUrl because "rel" contains "stylesheet"'),
    e.href = goog.html.TrustedResourceUrl.unwrap(t)) : t instanceof goog.html.TrustedResourceUrl ? e.href = goog.html.TrustedResourceUrl.unwrap(t) : t instanceof goog.html.SafeUrl ? e.href = goog.html.SafeUrl.unwrap(t) : e.href = goog.html.SafeUrl.sanitize(t).getTypedStringValue()
}
,
goog.dom.safe.setObjectData = function(e, t) {
    e.data = goog.html.TrustedResourceUrl.unwrap(t)
}
,
goog.dom.safe.setScriptSrc = function(e, t) {
    e.src = goog.html.TrustedResourceUrl.unwrap(t)
}
,
goog.dom.safe.setLocationHref = function(e, t) {
    t = t instanceof goog.html.SafeUrl ? t : goog.html.SafeUrl.sanitize(t);
    e.href = goog.html.SafeUrl.unwrap(t)
}
,
goog.dom.safe.openInWindow = function(e, t, o, r, i) {
    e = e instanceof goog.html.SafeUrl ? e : goog.html.SafeUrl.sanitize(e);
    return (t || window).open(goog.html.SafeUrl.unwrap(e), o ? goog.string.Const.unwrap(o) : "", r, i)
}
,
goog.provide("goog.dom.BrowserFeature"),
goog.require("goog.userAgent"),
goog.dom.BrowserFeature = {
    CAN_ADD_NAME_OR_TYPE_ATTRIBUTES: !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9),
    CAN_USE_CHILDREN_ATTRIBUTE: !goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isDocumentModeOrHigher(9) || goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9.1"),
    CAN_USE_INNER_TEXT: goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"),
    CAN_USE_PARENT_ELEMENT_PROPERTY: goog.userAgent.IE || goog.userAgent.OPERA || goog.userAgent.WEBKIT,
    INNER_HTML_NEEDS_SCOPED_ELEMENT: goog.userAgent.IE,
    LEGACY_IE_RANGES: goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)
},
goog.provide("goog.dom"),
goog.provide("goog.dom.Appendable"),
goog.provide("goog.dom.DomHelper"),
goog.require("goog.array"),
goog.require("goog.asserts"),
goog.require("goog.dom.BrowserFeature"),
goog.require("goog.dom.NodeType"),
goog.require("goog.dom.TagName"),
goog.require("goog.dom.safe"),
goog.require("goog.html.SafeHtml"),
goog.require("goog.math.Coordinate"),
goog.require("goog.math.Size"),
goog.require("goog.object"),
goog.require("goog.string"),
goog.require("goog.string.Unicode"),
goog.require("goog.userAgent"),
goog.define("goog.dom.ASSUME_QUIRKS_MODE", !1),
goog.define("goog.dom.ASSUME_STANDARDS_MODE", !1),
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE,
goog.dom.getDomHelper = function(e) {
    return e ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(e)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper)
}
,
goog.dom.defaultDomHelper_,
goog.dom.getDocument = function() {
    return document
}
,
goog.dom.getElement = function(e) {
    return goog.dom.getElementHelper_(document, e)
}
,
goog.dom.getElementHelper_ = function(e, t) {
    return goog.isString(t) ? e.getElementById(t) : t
}
,
goog.dom.getRequiredElement = function(e) {
    return goog.dom.getRequiredElementHelper_(document, e)
}
,
goog.dom.getRequiredElementHelper_ = function(e, t) {
    goog.asserts.assertString(t);
    e = goog.dom.getElementHelper_(e, t);
    return e = goog.asserts.assertElement(e, "No element found with id: " + t)
}
,
goog.dom.$ = goog.dom.getElement,
goog.dom.getElementsByTagNameAndClass = function(e, t, o) {
    return goog.dom.getElementsByTagNameAndClass_(document, e, t, o)
}
,
goog.dom.getElementsByClass = function(e, t) {
    var o = t || document;
    return goog.dom.canUseQuerySelector_(o) ? o.querySelectorAll("." + e) : goog.dom.getElementsByTagNameAndClass_(document, "*", e, t)
}
,
goog.dom.getElementByClass = function(e, t) {
    var o = t || document;
    return (o.getElementsByClassName ? o.getElementsByClassName(e)[0] : goog.dom.canUseQuerySelector_(o) ? o.querySelector("." + e) : goog.dom.getElementsByTagNameAndClass_(document, "*", e, t)[0]) || null
}
,
goog.dom.getRequiredElementByClass = function(e, t) {
    t = goog.dom.getElementByClass(e, t);
    return goog.asserts.assert(t, "No element found with className: " + e)
}
,
goog.dom.canUseQuerySelector_ = function(e) {
    return !(!e.querySelectorAll || !e.querySelector)
}
,
goog.dom.getElementsByTagNameAndClass_ = function(e, t, o, r) {
    var e = r || e
      , i = t && "*" != t ? t.toUpperCase() : "";
    if (goog.dom.canUseQuerySelector_(e) && (i || o))
        return e.querySelectorAll(i + (o ? "." + o : ""));
    if (o && e.getElementsByClassName) {
        var s = e.getElementsByClassName(o);
        if (i) {
            for (var a = {}, g = 0, n = 0; l = s[n]; n++)
                i == l.nodeName && (a[g++] = l);
            return a.length = g,
            a
        }
        return s
    }
    s = e.getElementsByTagName(i || "*");
    if (o) {
        for (var l, a = {}, g = 0, n = 0; l = s[n]; n++) {
            var u = l.className;
            "function" == typeof u.split && goog.array.contains(u.split(/\s+/), o) && (a[g++] = l)
        }
        return a.length = g,
        a
    }
    return s
}
,
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass,
goog.dom.setProperties = function(o, e) {
    goog.object.forEach(e, function(e, t) {
        "style" == t ? o.style.cssText = e : "class" == t ? o.className = e : "for" == t ? o.htmlFor = e : goog.dom.DIRECT_ATTRIBUTE_MAP_.hasOwnProperty(t) ? o.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[t], e) : goog.string.startsWith(t, "aria-") || goog.string.startsWith(t, "data-") ? o.setAttribute(t, e) : o[t] = e
    })
}
,
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {
    cellpadding: "cellPadding",
    cellspacing: "cellSpacing",
    colspan: "colSpan",
    frameborder: "frameBorder",
    height: "height",
    maxlength: "maxLength",
    role: "role",
    rowspan: "rowSpan",
    type: "type",
    usemap: "useMap",
    valign: "vAlign",
    width: "width"
},
goog.dom.getViewportSize = function(e) {
    return goog.dom.getViewportSize_(e || window)
}
,
goog.dom.getViewportSize_ = function(e) {
    e = e.document,
    e = goog.dom.isCss1CompatMode_(e) ? e.documentElement : e.body;
    return new goog.math.Size(e.clientWidth,e.clientHeight)
}
,
goog.dom.getDocumentHeight = function() {
    return goog.dom.getDocumentHeight_(window)
}
,
goog.dom.getDocumentHeight_ = function(e) {
    var t = e.document
      , o = 0;
    if (t) {
        var r = t.body
          , i = t.documentElement;
        if (!i || !r)
            return 0;
        var s = goog.dom.getViewportSize_(e).height
          , o = goog.dom.isCss1CompatMode_(t) && i.scrollHeight ? i.scrollHeight != s ? i.scrollHeight : i.offsetHeight : (e = i.scrollHeight,
        t = i.offsetHeight,
        i.clientHeight != t && (e = r.scrollHeight,
        t = r.offsetHeight),
        s < e ? t < e ? e : t : e < t ? e : t)
    }
    return o
}
,
goog.dom.getPageScroll = function(e) {
    e = e || goog.global || window;
    return goog.dom.getDomHelper(e.document).getDocumentScroll()
}
,
goog.dom.getDocumentScroll = function() {
    return goog.dom.getDocumentScroll_(document)
}
,
goog.dom.getDocumentScroll_ = function(e) {
    var t = goog.dom.getDocumentScrollElement_(e)
      , o = goog.dom.getWindow_(e);
    return goog.userAgent.IE && goog.userAgent.isVersionOrHigher("10") && o.pageYOffset != t.scrollTop ? new goog.math.Coordinate(t.scrollLeft,goog.userAgent.MOBILE && e.documentElement && e.documentElement.scrollTop || t.scrollTop) : new goog.math.Coordinate(o.pageXOffset || t.scrollLeft,o.pageYOffset || t.scrollTop)
}
,
goog.dom.getDocumentScrollElement = function() {
    return goog.dom.getDocumentScrollElement_(document)
}
,
goog.dom.getDocumentScrollElement_ = function(e) {
    return e.scrollingElement || (goog.userAgent.WEBKIT || !goog.dom.isCss1CompatMode_(e)) && e.body || e.documentElement
}
,
goog.dom.getWindow = function(e) {
    return e ? goog.dom.getWindow_(e) : window
}
,
goog.dom.getWindow_ = function(e) {
    return e.parentWindow || e.defaultView
}
,
goog.dom.createDom = function(e, t, o) {
    return goog.dom.createDom_(document, arguments)
}
,
goog.dom.createDom_ = function(e, t) {
    var o, r, i = t[0], s = t[1];
    !goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && s && (s.name || s.type) && (o = ["<", i],
    s.name && o.push(' name="', goog.string.htmlEscape(s.name), '"'),
    s.type && (o.push(' type="', goog.string.htmlEscape(s.type), '"'),
    goog.object.extend(r = {}, s),
    delete r.type,
    s = r),
    o.push(">"),
    i = o.join(""));
    i = e.createElement(i);
    return s && (goog.isString(s) ? i.className = s : goog.isArray(s) ? i.className = s.join(" ") : goog.dom.setProperties(i, s)),
    2 < t.length && goog.dom.append_(e, i, t, 2),
    i
}
,
goog.dom.append_ = function(t, o, e, r) {
    function i(e) {
        e && o.appendChild(goog.isString(e) ? t.createTextNode(e) : e)
    }
    for (var s = r; s < e.length; s++) {
        var a = e[s];
        goog.isArrayLike(a) && !goog.dom.isNodeLike(a) ? goog.array.forEach(goog.dom.isNodeList(a) ? goog.array.toArray(a) : a, i) : i(a)
    }
}
,
goog.dom.$dom = goog.dom.createDom,
goog.dom.createElement = function(e) {
    return document.createElement(e)
}
,
goog.dom.createTextNode = function(e) {
    return document.createTextNode(String(e))
}
,
goog.dom.createTable = function(e, t, o) {
    return goog.dom.createTable_(document, e, t, !!o)
}
,
goog.dom.createTable_ = function(e, t, o, r) {
    for (var i = e.createElement(goog.dom.TagName.TABLE), s = i.appendChild(e.createElement(goog.dom.TagName.TBODY)), a = 0; a < t; a++) {
        for (var g = e.createElement(goog.dom.TagName.TR), n = 0; n < o; n++) {
            var l = e.createElement(goog.dom.TagName.TD);
            r && goog.dom.setTextContent(l, goog.string.Unicode.NBSP),
            g.appendChild(l)
        }
        s.appendChild(g)
    }
    return i
}
,
goog.dom.safeHtmlToNode = function(e) {
    return goog.dom.safeHtmlToNode_(document, e)
}
,
goog.dom.safeHtmlToNode_ = function(e, t) {
    var o = e.createElement(goog.dom.TagName.DIV);
    return goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT ? (goog.dom.safe.setInnerHtml(o, goog.html.SafeHtml.concat(goog.html.SafeHtml.create("br"), t)),
    o.removeChild(o.firstChild)) : goog.dom.safe.setInnerHtml(o, t),
    goog.dom.childrenToNode_(e, o)
}
,
goog.dom.htmlToDocumentFragment = function(e) {
    return goog.dom.htmlToDocumentFragment_(document, e)
}
,
goog.dom.htmlToDocumentFragment_ = function(e, t) {
    var o = e.createElement(goog.dom.TagName.DIV);
    return goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT ? (o.innerHTML = "<br>" + t,
    o.removeChild(o.firstChild)) : o.innerHTML = t,
    goog.dom.childrenToNode_(e, o)
}
,
goog.dom.childrenToNode_ = function(e, t) {
    if (1 == t.childNodes.length)
        return t.removeChild(t.firstChild);
    for (var o = e.createDocumentFragment(); t.firstChild; )
        o.appendChild(t.firstChild);
    return o
}
,
goog.dom.isCss1CompatMode = function() {
    return goog.dom.isCss1CompatMode_(document)
}
,
goog.dom.isCss1CompatMode_ = function(e) {
    return goog.dom.COMPAT_MODE_KNOWN_ ? goog.dom.ASSUME_STANDARDS_MODE : "CSS1Compat" == e.compatMode
}
,
goog.dom.canHaveChildren = function(e) {
    if (e.nodeType != goog.dom.NodeType.ELEMENT)
        return !1;
    switch (e.tagName) {
    case goog.dom.TagName.APPLET:
    case goog.dom.TagName.AREA:
    case goog.dom.TagName.BASE:
    case goog.dom.TagName.BR:
    case goog.dom.TagName.COL:
    case goog.dom.TagName.COMMAND:
    case goog.dom.TagName.EMBED:
    case goog.dom.TagName.FRAME:
    case goog.dom.TagName.HR:
    case goog.dom.TagName.IMG:
    case goog.dom.TagName.INPUT:
    case goog.dom.TagName.IFRAME:
    case goog.dom.TagName.ISINDEX:
    case goog.dom.TagName.KEYGEN:
    case goog.dom.TagName.LINK:
    case goog.dom.TagName.NOFRAMES:
    case goog.dom.TagName.NOSCRIPT:
    case goog.dom.TagName.META:
    case goog.dom.TagName.OBJECT:
    case goog.dom.TagName.PARAM:
    case goog.dom.TagName.SCRIPT:
    case goog.dom.TagName.SOURCE:
    case goog.dom.TagName.STYLE:
    case goog.dom.TagName.TRACK:
    case goog.dom.TagName.WBR:
        return !1
    }
    return !0
}
,
goog.dom.appendChild = function(e, t) {
    e.appendChild(t)
}
,
goog.dom.append = function(e, t) {
    goog.dom.append_(goog.dom.getOwnerDocument(e), e, arguments, 1)
}
,
goog.dom.removeChildren = function(e) {
    for (var t; t = e.firstChild; )
        e.removeChild(t)
}
,
goog.dom.insertSiblingBefore = function(e, t) {
    t.parentNode && t.parentNode.insertBefore(e, t)
}
,
goog.dom.insertSiblingAfter = function(e, t) {
    t.parentNode && t.parentNode.insertBefore(e, t.nextSibling)
}
,
goog.dom.insertChildAt = function(e, t, o) {
    e.insertBefore(t, e.childNodes[o] || null)
}
,
goog.dom.removeNode = function(e) {
    return e && e.parentNode ? e.parentNode.removeChild(e) : null
}
,
goog.dom.replaceNode = function(e, t) {
    var o = t.parentNode;
    o && o.replaceChild(e, t)
}
,
goog.dom.flattenElement = function(e) {
    var t, o = e.parentNode;
    if (o && o.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
        if (e.removeNode)
            return e.removeNode(!1);
        for (; t = e.firstChild; )
            o.insertBefore(t, e);
        return goog.dom.removeNode(e)
    }
}
,
goog.dom.getChildren = function(e) {
    return goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && null != e.children ? e.children : goog.array.filter(e.childNodes, function(e) {
        return e.nodeType == goog.dom.NodeType.ELEMENT
    })
}
,
goog.dom.getFirstElementChild = function(e) {
    return goog.isDef(e.firstElementChild) ? e.firstElementChild : goog.dom.getNextElementNode_(e.firstChild, !0)
}
,
goog.dom.getLastElementChild = function(e) {
    return goog.isDef(e.lastElementChild) ? e.lastElementChild : goog.dom.getNextElementNode_(e.lastChild, !1)
}
,
goog.dom.getNextElementSibling = function(e) {
    return goog.isDef(e.nextElementSibling) ? e.nextElementSibling : goog.dom.getNextElementNode_(e.nextSibling, !0)
}
,
goog.dom.getPreviousElementSibling = function(e) {
    return goog.isDef(e.previousElementSibling) ? e.previousElementSibling : goog.dom.getNextElementNode_(e.previousSibling, !1)
}
,
goog.dom.getNextElementNode_ = function(e, t) {
    for (; e && e.nodeType != goog.dom.NodeType.ELEMENT; )
        e = t ? e.nextSibling : e.previousSibling;
    return e
}
,
goog.dom.getNextNode = function(e) {
    if (!e)
        return null;
    if (e.firstChild)
        return e.firstChild;
    for (; e && !e.nextSibling; )
        e = e.parentNode;
    return e ? e.nextSibling : null
}
,
goog.dom.getPreviousNode = function(e) {
    if (!e)
        return null;
    if (!e.previousSibling)
        return e.parentNode;
    for (e = e.previousSibling; e && e.lastChild; )
        e = e.lastChild;
    return e
}
,
goog.dom.isNodeLike = function(e) {
    return goog.isObject(e) && 0 < e.nodeType
}
,
goog.dom.isElement = function(e) {
    return goog.isObject(e) && e.nodeType == goog.dom.NodeType.ELEMENT
}
,
goog.dom.isWindow = function(e) {
    return goog.isObject(e) && e.window == e
}
,
goog.dom.getParentElement = function(e) {
    var t;
    if (goog.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY) {
        var o = goog.userAgent.IE && goog.userAgent.isVersionOrHigher("9") && !goog.userAgent.isVersionOrHigher("10");
        if (!(o && goog.global.SVGElement && e instanceof goog.global.SVGElement) && (t = e.parentElement))
            return t
    }
    return t = e.parentNode,
    goog.dom.isElement(t) ? t : null
}
,
goog.dom.contains = function(e, t) {
    if (e.contains && t.nodeType == goog.dom.NodeType.ELEMENT)
        return e == t || e.contains(t);
    if (void 0 !== e.compareDocumentPosition)
        return e == t || Boolean(16 & e.compareDocumentPosition(t));
    for (; t && e != t; )
        t = t.parentNode;
    return t == e
}
,
goog.dom.compareNodeOrder = function(e, t) {
    if (e == t)
        return 0;
    if (e.compareDocumentPosition)
        return 2 & e.compareDocumentPosition(t) ? 1 : -1;
    if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
        if (e.nodeType == goog.dom.NodeType.DOCUMENT)
            return -1;
        if (t.nodeType == goog.dom.NodeType.DOCUMENT)
            return 1
    }
    if ("sourceIndex"in e || e.parentNode && "sourceIndex"in e.parentNode) {
        var o = e.nodeType == goog.dom.NodeType.ELEMENT
          , r = t.nodeType == goog.dom.NodeType.ELEMENT;
        if (o && r)
            return e.sourceIndex - t.sourceIndex;
        var i = e.parentNode
          , s = t.parentNode;
        return i == s ? goog.dom.compareSiblingOrder_(e, t) : !o && goog.dom.contains(i, t) ? -1 * goog.dom.compareParentsDescendantNodeIe_(e, t) : !r && goog.dom.contains(s, e) ? goog.dom.compareParentsDescendantNodeIe_(t, e) : (o ? e : i).sourceIndex - (r ? t : s).sourceIndex
    }
    r = goog.dom.getOwnerDocument(e),
    s = r.createRange();
    return s.selectNode(e),
    s.collapse(!0),
    (r = r.createRange()).selectNode(t),
    r.collapse(!0),
    s.compareBoundaryPoints(goog.global.Range.START_TO_END, r)
}
,
goog.dom.compareParentsDescendantNodeIe_ = function(e, t) {
    var o = e.parentNode;
    if (o == t)
        return -1;
    for (var r = t; r.parentNode != o; )
        r = r.parentNode;
    return goog.dom.compareSiblingOrder_(r, e)
}
,
goog.dom.compareSiblingOrder_ = function(e, t) {
    for (var o = t; o = o.previousSibling; )
        if (o == e)
            return -1;
    return 1
}
,
goog.dom.findCommonAncestor = function(e) {
    var t = arguments.length;
    if (!t)
        return null;
    if (1 == t)
        return e;
    for (var o = [], r = 1 / 0, i = 0; i < t; i++) {
        for (var s = [], a = arguments[i]; a; )
            s.unshift(a),
            a = a.parentNode;
        o.push(s),
        r = Math.min(r, s.length)
    }
    var g = null;
    for (i = 0; i < r; i++) {
        for (var n = o[0][i], l = 1; l < t; l++)
            if (n != o[l][i])
                return g;
        g = n
    }
    return g
}
,
goog.dom.getOwnerDocument = function(e) {
    return goog.asserts.assert(e, "Node cannot be null or undefined."),
    e.nodeType == goog.dom.NodeType.DOCUMENT ? e : e.ownerDocument || e.document
}
,
goog.dom.getFrameContentDocument = function(e) {
    return e.contentDocument || e.contentWindow.document
}
,
goog.dom.getFrameContentWindow = function(e) {
    return e.contentWindow || goog.dom.getWindow(goog.dom.getFrameContentDocument(e))
}
,
goog.dom.setTextContent = function(e, t) {
    if (goog.asserts.assert(null != e, "goog.dom.setTextContent expects a non-null value for node"),
    "textContent"in e)
        e.textContent = t;
    else if (e.nodeType == goog.dom.NodeType.TEXT)
        e.data = t;
    else if (e.firstChild && e.firstChild.nodeType == goog.dom.NodeType.TEXT) {
        for (; e.lastChild != e.firstChild; )
            e.removeChild(e.lastChild);
        e.firstChild.data = t
    } else {
        goog.dom.removeChildren(e);
        var o = goog.dom.getOwnerDocument(e);
        e.appendChild(o.createTextNode(String(t)))
    }
}
,
goog.dom.getOuterHtml = function(e) {
    if ("outerHTML"in e)
        return e.outerHTML;
    var t = goog.dom.getOwnerDocument(e).createElement(goog.dom.TagName.DIV);
    return t.appendChild(e.cloneNode(!0)),
    t.innerHTML
}
,
goog.dom.findNode = function(e, t) {
    var o = [];
    return goog.dom.findNodes_(e, t, o, !0) ? o[0] : void 0
}
,
goog.dom.findNodes = function(e, t) {
    var o = [];
    return goog.dom.findNodes_(e, t, o, !1),
    o
}
,
goog.dom.findNodes_ = function(e, t, o, r) {
    if (null != e)
        for (var i = e.firstChild; i; ) {
            if (t(i) && (o.push(i),
            r))
                return !0;
            if (goog.dom.findNodes_(i, t, o, r))
                return !0;
            i = i.nextSibling
        }
    return !1
}
,
goog.dom.TAGS_TO_IGNORE_ = {
    SCRIPT: 1,
    STYLE: 1,
    HEAD: 1,
    IFRAME: 1,
    OBJECT: 1
},
goog.dom.PREDEFINED_TAG_VALUES_ = {
    IMG: " ",
    BR: "\n"
},
goog.dom.isFocusableTabIndex = function(e) {
    return goog.dom.hasSpecifiedTabIndex_(e) && goog.dom.isTabIndexFocusable_(e)
}
,
goog.dom.setFocusableTabIndex = function(e, t) {
    t ? e.tabIndex = 0 : (e.tabIndex = -1,
    e.removeAttribute("tabIndex"))
}
,
goog.dom.isFocusable = function(e) {
    var t = goog.dom.nativelySupportsFocus_(e) ? !e.disabled && (!goog.dom.hasSpecifiedTabIndex_(e) || goog.dom.isTabIndexFocusable_(e)) : goog.dom.isFocusableTabIndex(e);
    return t && goog.userAgent.IE ? goog.dom.hasNonZeroBoundingRect_(e) : t
}
,
goog.dom.hasSpecifiedTabIndex_ = function(e) {
    e = e.getAttributeNode("tabindex");
    return goog.isDefAndNotNull(e) && e.specified
}
,
goog.dom.isTabIndexFocusable_ = function(e) {
    e = e.tabIndex;
    return goog.isNumber(e) && 0 <= e && e < 32768
}
,
goog.dom.nativelySupportsFocus_ = function(e) {
    return e.tagName == goog.dom.TagName.A || e.tagName == goog.dom.TagName.INPUT || e.tagName == goog.dom.TagName.TEXTAREA || e.tagName == goog.dom.TagName.SELECT || e.tagName == goog.dom.TagName.BUTTON
}
,
goog.dom.hasNonZeroBoundingRect_ = function(e) {
    e = goog.isFunction(e.getBoundingClientRect) ? e.getBoundingClientRect() : {
        height: e.offsetHeight,
        width: e.offsetWidth
    };
    return goog.isDefAndNotNull(e) && 0 < e.height && 0 < e.width
}
,
goog.dom.getTextContent = function(e) {
    var t = goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText"in e ? goog.string.canonicalizeNewlines(e.innerText) : (goog.dom.getTextContent_(e, t = [], !0),
    t.join(""));
    return t = (t = t.replace(/ \xAD /g, " ").replace(/\xAD/g, "")).replace(/\u200B/g, ""),
    t = " " != (t = !goog.dom.BrowserFeature.CAN_USE_INNER_TEXT ? t.replace(/ +/g, " ") : t) ? t.replace(/^\s*/, "") : t
}
,
goog.dom.getRawTextContent = function(e) {
    var t = [];
    return goog.dom.getTextContent_(e, t, !1),
    t.join("")
}
,
goog.dom.getTextContent_ = function(e, t, o) {
    if (!(e.nodeName in goog.dom.TAGS_TO_IGNORE_))
        if (e.nodeType == goog.dom.NodeType.TEXT)
            o ? t.push(String(e.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : t.push(e.nodeValue);
        else if (e.nodeName in goog.dom.PREDEFINED_TAG_VALUES_)
            t.push(goog.dom.PREDEFINED_TAG_VALUES_[e.nodeName]);
        else
            for (var r = e.firstChild; r; )
                goog.dom.getTextContent_(r, t, o),
                r = r.nextSibling
}
,
goog.dom.getNodeTextLength = function(e) {
    return goog.dom.getTextContent(e).length
}
,
goog.dom.getNodeTextOffset = function(e, t) {
    for (var o = t || goog.dom.getOwnerDocument(e).body, r = []; e && e != o; ) {
        for (var i = e; i = i.previousSibling; )
            r.unshift(goog.dom.getTextContent(i));
        e = e.parentNode
    }
    return goog.string.trimLeft(r.join("")).replace(/ +/g, " ").length
}
,
goog.dom.getNodeAtOffset = function(e, t, o) {
    for (var r = [e], i = 0, s = null; 0 < r.length && i < t; )
        if (!((s = r.pop()).nodeName in goog.dom.TAGS_TO_IGNORE_))
            if (s.nodeType == goog.dom.NodeType.TEXT)
                i += s.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " ").length;
            else if (s.nodeName in goog.dom.PREDEFINED_TAG_VALUES_)
                i += goog.dom.PREDEFINED_TAG_VALUES_[s.nodeName].length;
            else
                for (var a = s.childNodes.length - 1; 0 <= a; a--)
                    r.push(s.childNodes[a]);
    return goog.isObject(o) && (o.remainder = s ? s.nodeValue.length + t - i - 1 : 0,
    o.node = s),
    s
}
,
goog.dom.isNodeList = function(e) {
    if (e && "number" == typeof e.length) {
        if (goog.isObject(e))
            return "function" == typeof e.item || "string" == typeof e.item;
        if (goog.isFunction(e))
            return "function" == typeof e.item
    }
    return !1
}
,
goog.dom.getAncestorByTagNameAndClass = function(e, t, o, r) {
    if (!t && !o)
        return null;
    var i = t ? t.toUpperCase() : null;
    return goog.dom.getAncestor(e, function(e) {
        return (!i || e.nodeName == i) && (!o || goog.isString(e.className) && goog.array.contains(e.className.split(/\s+/), o))
    }, !0, r)
}
,
goog.dom.getAncestorByClass = function(e, t, o) {
    return goog.dom.getAncestorByTagNameAndClass(e, null, t, o)
}
,
goog.dom.getAncestor = function(e, t, o, r) {
    o || (e = e.parentNode);
    for (var i = null == r, s = 0; e && (i || s <= r); ) {
        if (goog.asserts.assert("parentNode" != e.name),
        t(e))
            return e;
        e = e.parentNode,
        s++
    }
    return null
}
,
goog.dom.getActiveElement = function(e) {
    try {
        return e && e.activeElement
    } catch (e) {}
    return null
}
,
goog.dom.getPixelRatio = function() {
    var e = goog.dom.getWindow();
    return goog.isDef(e.devicePixelRatio) ? e.devicePixelRatio : e.matchMedia && (goog.dom.matchesPixelRatio_(.75) || goog.dom.matchesPixelRatio_(1.5) || goog.dom.matchesPixelRatio_(2) || goog.dom.matchesPixelRatio_(3)) || 1
}
,
goog.dom.matchesPixelRatio_ = function(e) {
    return goog.dom.getWindow().matchMedia("(-webkit-min-device-pixel-ratio: " + e + "),(min--moz-device-pixel-ratio: " + e + "),(min-resolution: " + e + "dppx)").matches ? e : 0
}
,
goog.dom.DomHelper = function(e) {
    this.document_ = e || goog.global.document || document
}
,
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper,
goog.dom.DomHelper.prototype.setDocument = function(e) {
    this.document_ = e
}
,
goog.dom.DomHelper.prototype.getDocument = function() {
    return this.document_
}
,
goog.dom.DomHelper.prototype.getElement = function(e) {
    return goog.dom.getElementHelper_(this.document_, e)
}
,
goog.dom.DomHelper.prototype.getRequiredElement = function(e) {
    return goog.dom.getRequiredElementHelper_(this.document_, e)
}
,
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement,
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(e, t, o) {
    return goog.dom.getElementsByTagNameAndClass_(this.document_, e, t, o)
}
,
goog.dom.DomHelper.prototype.getElementsByClass = function(e, t) {
    t = t || this.document_;
    return goog.dom.getElementsByClass(e, t)
}
,
goog.dom.DomHelper.prototype.getElementByClass = function(e, t) {
    t = t || this.document_;
    return goog.dom.getElementByClass(e, t)
}
,
goog.dom.DomHelper.prototype.getRequiredElementByClass = function(e, t) {
    t = t || this.document_;
    return goog.dom.getRequiredElementByClass(e, t)
}
,
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass,
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties,
goog.dom.DomHelper.prototype.getViewportSize = function(e) {
    return goog.dom.getViewportSize(e || this.getWindow())
}
,
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
    return goog.dom.getDocumentHeight_(this.getWindow())
}
,
goog.dom.Appendable,
goog.dom.DomHelper.prototype.createDom = function(e, t, o) {
    return goog.dom.createDom_(this.document_, arguments)
}
,
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom,
goog.dom.DomHelper.prototype.createElement = function(e) {
    return this.document_.createElement(e)
}
,
goog.dom.DomHelper.prototype.createTextNode = function(e) {
    return this.document_.createTextNode(String(e))
}
,
goog.dom.DomHelper.prototype.createTable = function(e, t, o) {
    return goog.dom.createTable_(this.document_, e, t, !!o)
}
,
goog.dom.DomHelper.prototype.safeHtmlToNode = function(e) {
    return goog.dom.safeHtmlToNode_(this.document_, e)
}
,
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(e) {
    return goog.dom.htmlToDocumentFragment_(this.document_, e)
}
,
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
    return goog.dom.isCss1CompatMode_(this.document_)
}
,
goog.dom.DomHelper.prototype.getWindow = function() {
    return goog.dom.getWindow_(this.document_)
}
,
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
    return goog.dom.getDocumentScrollElement_(this.document_)
}
,
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
    return goog.dom.getDocumentScroll_(this.document_)
}
,
goog.dom.DomHelper.prototype.getActiveElement = function(e) {
    return goog.dom.getActiveElement(e || this.document_)
}
,
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild,
goog.dom.DomHelper.prototype.append = goog.dom.append,
goog.dom.DomHelper.prototype.canHaveChildren = goog.dom.canHaveChildren,
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren,
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore,
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter,
goog.dom.DomHelper.prototype.insertChildAt = goog.dom.insertChildAt,
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode,
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode,
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement,
goog.dom.DomHelper.prototype.getChildren = goog.dom.getChildren,
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild,
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild,
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling,
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling,
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode,
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode,
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike,
goog.dom.DomHelper.prototype.isElement = goog.dom.isElement,
goog.dom.DomHelper.prototype.isWindow = goog.dom.isWindow,
goog.dom.DomHelper.prototype.getParentElement = goog.dom.getParentElement,
goog.dom.DomHelper.prototype.contains = goog.dom.contains,
goog.dom.DomHelper.prototype.compareNodeOrder = goog.dom.compareNodeOrder,
goog.dom.DomHelper.prototype.findCommonAncestor = goog.dom.findCommonAncestor,
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument,
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument,
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow,
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent,
goog.dom.DomHelper.prototype.getOuterHtml = goog.dom.getOuterHtml,
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode,
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes,
goog.dom.DomHelper.prototype.isFocusableTabIndex = goog.dom.isFocusableTabIndex,
goog.dom.DomHelper.prototype.setFocusableTabIndex = goog.dom.setFocusableTabIndex,
goog.dom.DomHelper.prototype.isFocusable = goog.dom.isFocusable,
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent,
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength,
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset,
goog.dom.DomHelper.prototype.getNodeAtOffset = goog.dom.getNodeAtOffset,
goog.dom.DomHelper.prototype.isNodeList = goog.dom.isNodeList,
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass,
goog.dom.DomHelper.prototype.getAncestorByClass = goog.dom.getAncestorByClass,
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor,
goog.provide("goog.style"),
goog.require("goog.array"),
goog.require("goog.asserts"),
goog.require("goog.dom"),
goog.require("goog.dom.NodeType"),
goog.require("goog.dom.TagName"),
goog.require("goog.dom.vendor"),
goog.require("goog.math.Box"),
goog.require("goog.math.Coordinate"),
goog.require("goog.math.Rect"),
goog.require("goog.math.Size"),
goog.require("goog.object"),
goog.require("goog.string"),
goog.require("goog.userAgent"),
goog.forwardDeclare("goog.events.BrowserEvent"),
goog.forwardDeclare("goog.events.Event"),
goog.style.setStyle = function(e, t, o) {
    if (goog.isString(t))
        goog.style.setStyle_(e, o, t);
    else
        for (var r in t)
            goog.style.setStyle_(e, t[r], r)
}
,
goog.style.setStyle_ = function(e, t, o) {
    o = goog.style.getVendorJsStyleName_(e, o);
    o && (e.style[o] = t)
}
,
goog.style.styleNameCache_ = {},
goog.style.getVendorJsStyleName_ = function(e, t) {
    var o, r = goog.style.styleNameCache_[t];
    return r || (o = goog.string.toCamelCase(t),
    void 0 === e.style[r = o] && (o = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(o),
    void 0 !== e.style[o] && (r = o)),
    goog.style.styleNameCache_[t] = r),
    r
}
,
goog.style.getVendorStyleName_ = function(e, t) {
    var o = goog.string.toCamelCase(t);
    if (void 0 === e.style[o]) {
        o = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(o);
        if (void 0 !== e.style[o])
            return goog.dom.vendor.getVendorPrefix() + "-" + t
    }
    return t
}
,
goog.style.getStyle = function(e, t) {
    var o = e.style[goog.string.toCamelCase(t)];
    return void 0 !== o ? o : e.style[goog.style.getVendorJsStyleName_(e, t)] || ""
}
,
goog.style.getComputedStyle = function(e, t) {
    var o = goog.dom.getOwnerDocument(e);
    if (o.defaultView && o.defaultView.getComputedStyle) {
        e = o.defaultView.getComputedStyle(e, null);
        if (e)
            return e[t] || e.getPropertyValue(t) || ""
    }
    return ""
}
,
goog.style.getCascadedStyle = function(e, t) {
    return e.currentStyle ? e.currentStyle[t] : null
}
,
goog.style.getStyle_ = function(e, t) {
    return goog.style.getComputedStyle(e, t) || goog.style.getCascadedStyle(e, t) || e.style && e.style[t]
}
,
goog.style.getComputedBoxSizing = function(e) {
    return goog.style.getStyle_(e, "boxSizing") || goog.style.getStyle_(e, "MozBoxSizing") || goog.style.getStyle_(e, "WebkitBoxSizing") || null
}
,
goog.style.getComputedPosition = function(e) {
    return goog.style.getStyle_(e, "position")
}
,
goog.style.getBackgroundColor = function(e) {
    return goog.style.getStyle_(e, "backgroundColor")
}
,
goog.style.getComputedOverflowX = function(e) {
    return goog.style.getStyle_(e, "overflowX")
}
,
goog.style.getComputedOverflowY = function(e) {
    return goog.style.getStyle_(e, "overflowY")
}
,
goog.style.getComputedZIndex = function(e) {
    return goog.style.getStyle_(e, "zIndex")
}
,
goog.style.getComputedTextAlign = function(e) {
    return goog.style.getStyle_(e, "textAlign")
}
,
goog.style.getComputedCursor = function(e) {
    return goog.style.getStyle_(e, "cursor")
}
,
goog.style.getComputedTransform = function(e) {
    var t = goog.style.getVendorStyleName_(e, "transform");
    return goog.style.getStyle_(e, t) || goog.style.getStyle_(e, "transform")
}
,
goog.style.setPosition = function(e, t, o) {
    var r, o = t instanceof goog.math.Coordinate ? (r = t.x,
    t.y) : (r = t,
    o);
    e.style.left = goog.style.getPixelStyleValue_(r, !1),
    e.style.top = goog.style.getPixelStyleValue_(o, !1)
}
,
goog.style.getPosition = function(e) {
    return new goog.math.Coordinate(e.offsetLeft,e.offsetTop)
}
,
goog.style.getClientViewportElement = function(e) {
    e = e ? goog.dom.getOwnerDocument(e) : goog.dom.getDocument();
    return !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9) || goog.dom.getDomHelper(e).isCss1CompatMode() ? e.documentElement : e.body
}
,
goog.style.getViewportPageOffset = function(e) {
    var t = e.body
      , o = e.documentElement
      , e = t.scrollLeft || o.scrollLeft
      , o = t.scrollTop || o.scrollTop;
    return new goog.math.Coordinate(e,o)
}
,
goog.style.getBoundingClientRect_ = function(e) {
    var t;
    try {
        t = e.getBoundingClientRect()
    } catch (e) {
        return {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        }
    }
    return goog.userAgent.IE && e.ownerDocument.body && (e = e.ownerDocument,
    t.left -= e.documentElement.clientLeft + e.body.clientLeft,
    t.top -= e.documentElement.clientTop + e.body.clientTop),
    t
}
,
goog.style.getOffsetParent = function(e) {
    if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(8))
        return e.offsetParent;
    for (var t = goog.dom.getOwnerDocument(e), o = goog.style.getStyle_(e, "position"), r = "fixed" == o || "absolute" == o, i = e.parentNode; i && i != t; i = i.parentNode)
        if (i.nodeType == goog.dom.NodeType.DOCUMENT_FRAGMENT && i.host && (i = i.host),
        o = goog.style.getStyle_(i, "position"),
        !(r = r && "static" == o && i != t.documentElement && i != t.body) && (i.scrollWidth > i.clientWidth || i.scrollHeight > i.clientHeight || "fixed" == o || "absolute" == o || "relative" == o))
            return i;
    return null
}
,
goog.style.getVisibleRectForElement = function(e) {
    for (var t, o, r = new goog.math.Box(0,1 / 0,1 / 0,0), i = goog.dom.getDomHelper(e), s = i.getDocument().body, a = i.getDocument().documentElement, g = i.getDocumentScrollElement(), n = e; n = goog.style.getOffsetParent(n); )
        goog.userAgent.IE && 0 == n.clientWidth || goog.userAgent.WEBKIT && 0 == n.clientHeight && n == s || n == s || n == a || "visible" == goog.style.getStyle_(n, "overflow") || (t = goog.style.getPageOffset(n),
        o = goog.style.getClientLeftTop(n),
        t.x += o.x,
        t.y += o.y,
        r.top = Math.max(r.top, t.y),
        r.right = Math.min(r.right, t.x + n.clientWidth),
        r.bottom = Math.min(r.bottom, t.y + n.clientHeight),
        r.left = Math.max(r.left, t.x));
    e = g.scrollLeft,
    g = g.scrollTop;
    r.left = Math.max(r.left, e),
    r.top = Math.max(r.top, g);
    i = i.getViewportSize();
    return r.right = Math.min(r.right, e + i.width),
    r.bottom = Math.min(r.bottom, g + i.height),
    0 <= r.top && 0 <= r.left && r.bottom > r.top && r.right > r.left ? r : null
}
,
goog.style.getContainerOffsetToScrollInto = function(e, t, o) {
    var r = goog.style.getPageOffset(e)
      , i = goog.style.getPageOffset(t)
      , s = goog.style.getBorderBox(t)
      , a = r.x - i.x - s.left
      , g = r.y - i.y - s.top
      , n = t.clientWidth - e.offsetWidth
      , l = t.clientHeight - e.offsetHeight
      , r = t.scrollLeft
      , e = t.scrollTop;
    return t != goog.dom.getDocument().body && t != goog.dom.getDocument().documentElement || (r = i.x + s.left,
    e = i.y + s.top,
    goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(10) && (r += s.left,
    e += s.top)),
    o ? (r += a - n / 2,
    e += g - l / 2) : (r += Math.min(a, Math.max(a - n, 0)),
    e += Math.min(g, Math.max(g - l, 0))),
    new goog.math.Coordinate(r,e)
}
,
goog.style.scrollIntoContainerView = function(e, t, o) {
    o = goog.style.getContainerOffsetToScrollInto(e, t, o);
    t.scrollLeft = o.x,
    t.scrollTop = o.y
}
,
goog.style.getClientLeftTop = function(e) {
    return new goog.math.Coordinate(e.clientLeft,e.clientTop)
}
,
goog.style.getPageOffset = function(e) {
    var t = goog.dom.getOwnerDocument(e);
    goog.asserts.assertObject(e, "Parameter is required");
    var o = new goog.math.Coordinate(0,0);
    if (e == goog.style.getClientViewportElement(t))
        return o;
    e = goog.style.getBoundingClientRect_(e),
    t = goog.dom.getDomHelper(t).getDocumentScroll();
    return o.x = e.left + t.x,
    o.y = e.top + t.y,
    o
}
,
goog.style.getPageOffsetLeft = function(e) {
    return goog.style.getPageOffset(e).x
}
,
goog.style.getPageOffsetTop = function(e) {
    return goog.style.getPageOffset(e).y
}
,
goog.style.getFramedPageOffset = function(e, t) {
    var o = new goog.math.Coordinate(0,0)
      , r = goog.dom.getWindow(goog.dom.getOwnerDocument(e))
      , i = e;
    do {
        var s = r == t ? goog.style.getPageOffset(i) : goog.style.getClientPositionForElement_(goog.asserts.assert(i))
    } while (o.x += s.x,
    o.y += s.y,
    r && r != t && r != r.parent && (i = r.frameElement) && (r = r.parent));
    return o
}
,
goog.style.translateRectForAnotherFrame = function(e, t, o) {
    var r;
    t.getDocument() != o.getDocument() && (r = t.getDocument().body,
    o = goog.style.getFramedPageOffset(r, o.getWindow()),
    o = goog.math.Coordinate.difference(o, goog.style.getPageOffset(r)),
    !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9) || t.isCss1CompatMode() || (o = goog.math.Coordinate.difference(o, t.getDocumentScroll())),
    e.left += o.x,
    e.top += o.y)
}
,
goog.style.getRelativePosition = function(e, t) {
    e = goog.style.getClientPosition(e),
    t = goog.style.getClientPosition(t);
    return new goog.math.Coordinate(e.x - t.x,e.y - t.y)
}
,
goog.style.getClientPositionForElement_ = function(e) {
    e = goog.style.getBoundingClientRect_(e);
    return new goog.math.Coordinate(e.left,e.top)
}
,
goog.style.getClientPosition = function(e) {
    if (goog.asserts.assert(e),
    e.nodeType == goog.dom.NodeType.ELEMENT)
        return goog.style.getClientPositionForElement_(e);
    e = e.changedTouches ? e.changedTouches[0] : e;
    return new goog.math.Coordinate(e.clientX,e.clientY)
}
,
goog.style.setPageOffset = function(e, t, o) {
    var r = goog.style.getPageOffset(e);
    t instanceof goog.math.Coordinate && (o = t.y,
    t = t.x);
    t -= r.x,
    r = o - r.y;
    goog.style.setPosition(e, e.offsetLeft + t, e.offsetTop + r)
}
,
goog.style.setSize = function(e, t, o) {
    var r;
    if (t instanceof goog.math.Size)
        r = t.height,
        t = t.width;
    else {
        if (null == o)
            throw Error("missing height argument");
        r = o
    }
    goog.style.setWidth(e, t),
    goog.style.setHeight(e, r)
}
,
goog.style.getPixelStyleValue_ = function(e, t) {
    return e = "number" == typeof e ? (t ? Math.round(e) : e) + "px" : e
}
,
goog.style.setHeight = function(e, t) {
    e.style.height = goog.style.getPixelStyleValue_(t, !0)
}
,
goog.style.setWidth = function(e, t) {
    e.style.width = goog.style.getPixelStyleValue_(t, !0)
}
,
goog.style.getSize = function(e) {
    return goog.style.evaluateWithTemporaryDisplay_(goog.style.getSizeWithDisplay_, e)
}
,
goog.style.evaluateWithTemporaryDisplay_ = function(e, t) {
    if ("none" != goog.style.getStyle_(t, "display"))
        return e(t);
    var o = t.style
      , r = o.display
      , i = o.visibility
      , s = o.position;
    o.visibility = "hidden",
    o.position = "absolute",
    o.display = "inline";
    t = e(t);
    return o.display = r,
    o.position = s,
    o.visibility = i,
    t
}
,
goog.style.getSizeWithDisplay_ = function(e) {
    var t = e.offsetWidth
      , o = e.offsetHeight
      , r = goog.userAgent.WEBKIT && !t && !o;
    if (goog.isDef(t) && !r || !e.getBoundingClientRect)
        return new goog.math.Size(t,o);
    e = goog.style.getBoundingClientRect_(e);
    return new goog.math.Size(e.right - e.left,e.bottom - e.top)
}
,
goog.style.getTransformedSize = function(e) {
    if (!e.getBoundingClientRect)
        return null;
    e = goog.style.evaluateWithTemporaryDisplay_(goog.style.getBoundingClientRect_, e);
    return new goog.math.Size(e.right - e.left,e.bottom - e.top)
}
,
goog.style.getBounds = function(e) {
    var t = goog.style.getPageOffset(e)
      , e = goog.style.getSize(e);
    return new goog.math.Rect(t.x,t.y,e.width,e.height)
}
,
goog.style.toCamelCase = function(e) {
    return goog.string.toCamelCase(String(e))
}
,
goog.style.toSelectorCase = function(e) {
    return goog.string.toSelectorCase(e)
}
,
goog.style.getOpacity = function(e) {
    var t = e.style
      , e = "";
    return "opacity"in t ? e = t.opacity : "MozOpacity"in t ? e = t.MozOpacity : "filter"in t && ((t = t.filter.match(/alpha\(opacity=([\d.]+)\)/)) && (e = String(t[1] / 100))),
    "" == e ? e : Number(e)
}
,
goog.style.setOpacity = function(e, t) {
    e = e.style;
    "opacity"in e ? e.opacity = t : "MozOpacity"in e ? e.MozOpacity = t : "filter"in e && (e.filter = "" === t ? "" : "alpha(opacity=" + 100 * t + ")")
}
,
goog.style.setTransparentBackgroundImage = function(e, t) {
    e = e.style;
    goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? e.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + t + '", sizingMethod="crop")' : (e.backgroundImage = "url(" + t + ")",
    e.backgroundPosition = "top left",
    e.backgroundRepeat = "no-repeat")
}
,
goog.style.clearTransparentBackgroundImage = function(e) {
    e = e.style;
    "filter"in e ? e.filter = "" : e.backgroundImage = "none"
}
,
goog.style.showElement = function(e, t) {
    goog.style.setElementShown(e, t)
}
,
goog.style.setElementShown = function(e, t) {
    e.style.display = t ? "" : "none"
}
,
goog.style.isElementShown = function(e) {
    return "none" != e.style.display
}
,
goog.style.installStyles = function(e, t) {
    var o = goog.dom.getDomHelper(t)
      , r = null
      , i = o.getDocument();
    return goog.userAgent.IE && i.createStyleSheet ? (r = i.createStyleSheet(),
    goog.style.setStyles(r, e)) : ((t = o.getElementsByTagNameAndClass(goog.dom.TagName.HEAD)[0]) || (i = o.getElementsByTagNameAndClass(goog.dom.TagName.BODY)[0],
    t = o.createDom(goog.dom.TagName.HEAD),
    i.parentNode.insertBefore(t, i)),
    r = o.createDom(goog.dom.TagName.STYLE),
    goog.style.setStyles(r, e),
    o.appendChild(t, r)),
    r
}
,
goog.style.uninstallStyles = function(e) {
    e = e.ownerNode || e.owningElement || e;
    goog.dom.removeNode(e)
}
,
goog.style.setStyles = function(e, t) {
    goog.userAgent.IE && goog.isDef(e.cssText) ? e.cssText = t : e.innerHTML = t
}
,
goog.style.setPreWrap = function(e) {
    e = e.style;
    goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? (e.whiteSpace = "pre",
    e.wordWrap = "break-word") : goog.userAgent.GECKO ? e.whiteSpace = "-moz-pre-wrap" : e.whiteSpace = "pre-wrap"
}
,
goog.style.setInlineBlock = function(e) {
    e = e.style;
    e.position = "relative",
    goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? (e.zoom = "1",
    e.display = "inline") : e.display = "inline-block"
}
,
goog.style.isRightToLeft = function(e) {
    return "rtl" == goog.style.getStyle_(e, "direction")
}
,
goog.style.unselectableStyle_ = goog.userAgent.GECKO ? "MozUserSelect" : goog.userAgent.WEBKIT ? "WebkitUserSelect" : null,
goog.style.isUnselectable = function(e) {
    return goog.style.unselectableStyle_ ? "none" == e.style[goog.style.unselectableStyle_].toLowerCase() : !(!goog.userAgent.IE && !goog.userAgent.OPERA) && "on" == e.getAttribute("unselectable")
}
,
goog.style.setUnselectable = function(e, t, o) {
    var r = o ? null : e.getElementsByTagName("*")
      , i = goog.style.unselectableStyle_;
    if (i) {
        var s = t ? "none" : "";
        if (e.style && (e.style[i] = s),
        r)
            for (var a = 0; g = r[a]; a++)
                g.style && (g.style[i] = s)
    } else if (goog.userAgent.IE || goog.userAgent.OPERA) {
        s = t ? "on" : "";
        if (e.setAttribute("unselectable", s),
        r)
            for (var g, a = 0; g = r[a]; a++)
                g.setAttribute("unselectable", s)
    }
}
,
goog.style.getBorderBoxSize = function(e) {
    return new goog.math.Size(e.offsetWidth,e.offsetHeight)
}
,
goog.style.setBorderBoxSize = function(e, t) {
    var o = goog.dom.getOwnerDocument(e)
      , r = goog.dom.getDomHelper(o).isCss1CompatMode();
    !goog.userAgent.IE || goog.userAgent.isVersionOrHigher("10") || r && goog.userAgent.isVersionOrHigher("8") ? goog.style.setBoxSizingSize_(e, t, "border-box") : (o = e.style,
    r ? (r = goog.style.getPaddingBox(e),
    e = goog.style.getBorderBox(e),
    o.pixelWidth = t.width - e.left - r.left - r.right - e.right,
    o.pixelHeight = t.height - e.top - r.top - r.bottom - e.bottom) : (o.pixelWidth = t.width,
    o.pixelHeight = t.height))
}
,
goog.style.getContentBoxSize = function(e) {
    var t = goog.dom.getOwnerDocument(e)
      , o = goog.userAgent.IE && e.currentStyle;
    if (o && goog.dom.getDomHelper(t).isCss1CompatMode() && "auto" != o.width && "auto" != o.height && !o.boxSizing) {
        var r = goog.style.getIePixelValue_(e, o.width, "width", "pixelWidth")
          , i = goog.style.getIePixelValue_(e, o.height, "height", "pixelHeight");
        return new goog.math.Size(r,i)
    }
    r = goog.style.getBorderBoxSize(e),
    i = goog.style.getPaddingBox(e),
    e = goog.style.getBorderBox(e);
    return new goog.math.Size(r.width - e.left - i.left - i.right - e.right,r.height - e.top - i.top - i.bottom - e.bottom)
}
,
goog.style.setContentBoxSize = function(e, t) {
    var o = goog.dom.getOwnerDocument(e)
      , r = goog.dom.getDomHelper(o).isCss1CompatMode();
    !goog.userAgent.IE || goog.userAgent.isVersionOrHigher("10") || r && goog.userAgent.isVersionOrHigher("8") ? goog.style.setBoxSizingSize_(e, t, "content-box") : (o = e.style,
    r ? (o.pixelWidth = t.width,
    o.pixelHeight = t.height) : (r = goog.style.getPaddingBox(e),
    e = goog.style.getBorderBox(e),
    o.pixelWidth = t.width + e.left + r.left + r.right + e.right,
    o.pixelHeight = t.height + e.top + r.top + r.bottom + e.bottom))
}
,
goog.style.setBoxSizingSize_ = function(e, t, o) {
    e = e.style;
    goog.userAgent.GECKO ? e.MozBoxSizing = o : goog.userAgent.WEBKIT ? e.WebkitBoxSizing = o : e.boxSizing = o,
    e.width = Math.max(t.width, 0) + "px",
    e.height = Math.max(t.height, 0) + "px"
}
,
goog.style.getIePixelValue_ = function(e, t, o, r) {
    if (/^\d+px?$/.test(t))
        return parseInt(t, 10);
    var i = e.style[o]
      , s = e.runtimeStyle[o];
    e.runtimeStyle[o] = e.currentStyle[o],
    e.style[o] = t;
    r = e.style[r];
    return e.style[o] = i,
    e.runtimeStyle[o] = s,
    r
}
,
goog.style.getIePixelDistance_ = function(e, t) {
    t = goog.style.getCascadedStyle(e, t);
    return t ? goog.style.getIePixelValue_(e, t, "left", "pixelLeft") : 0
}
,
goog.style.getBox_ = function(e, t) {
    if (goog.userAgent.IE) {
        var o = goog.style.getIePixelDistance_(e, t + "Left")
          , r = goog.style.getIePixelDistance_(e, t + "Right")
          , i = goog.style.getIePixelDistance_(e, t + "Top")
          , s = goog.style.getIePixelDistance_(e, t + "Bottom");
        return new goog.math.Box(i,r,s,o)
    }
    o = goog.style.getComputedStyle(e, t + "Left"),
    r = goog.style.getComputedStyle(e, t + "Right"),
    i = goog.style.getComputedStyle(e, t + "Top"),
    s = goog.style.getComputedStyle(e, t + "Bottom");
    return new goog.math.Box(parseFloat(i),parseFloat(r),parseFloat(s),parseFloat(o))
}
,
goog.style.getPaddingBox = function(e) {
    return goog.style.getBox_(e, "padding")
}
,
goog.style.getMarginBox = function(e) {
    return goog.style.getBox_(e, "margin")
}
,
goog.style.ieBorderWidthKeywords_ = {
    thin: 2,
    medium: 4,
    thick: 6
},
goog.style.getIePixelBorder_ = function(e, t) {
    if ("none" == goog.style.getCascadedStyle(e, t + "Style"))
        return 0;
    t = goog.style.getCascadedStyle(e, t + "Width");
    return t in goog.style.ieBorderWidthKeywords_ ? goog.style.ieBorderWidthKeywords_[t] : goog.style.getIePixelValue_(e, t, "left", "pixelLeft")
}
,
goog.style.getBorderBox = function(e) {
    if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
        var t = goog.style.getIePixelBorder_(e, "borderLeft")
          , o = goog.style.getIePixelBorder_(e, "borderRight")
          , r = goog.style.getIePixelBorder_(e, "borderTop")
          , i = goog.style.getIePixelBorder_(e, "borderBottom");
        return new goog.math.Box(r,o,i,t)
    }
    t = goog.style.getComputedStyle(e, "borderLeftWidth"),
    o = goog.style.getComputedStyle(e, "borderRightWidth"),
    r = goog.style.getComputedStyle(e, "borderTopWidth"),
    i = goog.style.getComputedStyle(e, "borderBottomWidth");
    return new goog.math.Box(parseFloat(r),parseFloat(o),parseFloat(i),parseFloat(t))
}
,
goog.style.getFontFamily = function(e) {
    var t = goog.dom.getOwnerDocument(e)
      , o = "";
    if (t.body.createTextRange && goog.dom.contains(t, e)) {
        t = t.body.createTextRange();
        t.moveToElementText(e);
        try {
            o = t.queryCommandValue("FontName")
        } catch (e) {
            o = ""
        }
    }
    e = (o = o || goog.style.getStyle_(e, "fontFamily")).split(",");
    return 1 < e.length && (o = e[0]),
    goog.string.stripQuotes(o, "\"'")
}
,
goog.style.lengthUnitRegex_ = /[^\d]+$/,
goog.style.getLengthUnits = function(e) {
    e = e.match(goog.style.lengthUnitRegex_);
    return e && e[0] || null
}
,
goog.style.ABSOLUTE_CSS_LENGTH_UNITS_ = {
    cm: 1,
    in: 1,
    mm: 1,
    pc: 1,
    pt: 1
},
goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_ = {
    em: 1,
    ex: 1
},
goog.style.getFontSize = function(e) {
    var t = goog.style.getStyle_(e, "fontSize")
      , o = goog.style.getLengthUnits(t);
    if (t && "px" == o)
        return parseInt(t, 10);
    if (goog.userAgent.IE) {
        if (o in goog.style.ABSOLUTE_CSS_LENGTH_UNITS_)
            return goog.style.getIePixelValue_(e, t, "left", "pixelLeft");
        if (e.parentNode && e.parentNode.nodeType == goog.dom.NodeType.ELEMENT && o in goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_) {
            var o = e.parentNode
              , r = goog.style.getStyle_(o, "fontSize");
            return goog.style.getIePixelValue_(o, t == r ? "1em" : t, "left", "pixelLeft")
        }
    }
    r = goog.dom.createDom(goog.dom.TagName.SPAN, {
        style: "visibility:hidden;position:absolute;line-height:0;padding:0;margin:0;border:0;height:1em;"
    });
    return goog.dom.appendChild(e, r),
    t = r.offsetHeight,
    goog.dom.removeNode(r),
    t
}
,
goog.style.parseStyleAttribute = function(e) {
    var t = {};
    return goog.array.forEach(e.split(/\s*;\s*/), function(e) {
        e = e.split(/\s*:\s*/);
        2 == e.length && (t[goog.string.toCamelCase(e[0].toLowerCase())] = e[1])
    }),
    t
}
,
goog.style.toStyleAttribute = function(e) {
    var o = [];
    return goog.object.forEach(e, function(e, t) {
        o.push(goog.string.toSelectorCase(t), ":", e, ";")
    }),
    o.join("")
}
,
goog.style.setFloat = function(e, t) {
    e.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] = t
}
,
goog.style.getFloat = function(e) {
    return e.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] || ""
}
,
goog.style.getScrollbarWidth = function(e) {
    var t = goog.dom.createElement(goog.dom.TagName.DIV);
    e && (t.className = e),
    t.style.cssText = "overflow:auto;position:absolute;top:0;width:100px;height:100px";
    e = goog.dom.createElement(goog.dom.TagName.DIV);
    goog.style.setSize(e, "200px", "200px"),
    t.appendChild(e),
    goog.dom.appendChild(goog.dom.getDocument().body, t);
    e = t.offsetWidth - t.clientWidth;
    return goog.dom.removeNode(t),
    e
}
,
goog.style.MATRIX_TRANSLATION_REGEX_ = new RegExp("matrix\\([0-9\\.\\-]+, [0-9\\.\\-]+, [0-9\\.\\-]+, [0-9\\.\\-]+, ([0-9\\.\\-]+)p?x?, ([0-9\\.\\-]+)p?x?\\)"),
goog.style.getCssTranslation = function(e) {
    e = goog.style.getComputedTransform(e);
    if (!e)
        return new goog.math.Coordinate(0,0);
    e = e.match(goog.style.MATRIX_TRANSLATION_REGEX_);
    return e ? new goog.math.Coordinate(parseFloat(e[1]),parseFloat(e[2])) : new goog.math.Coordinate(0,0)
}
,
goog.provide("qjv.i18n.languages"),
goog.scope(function() {
    qjv.i18n.languages = {
        DE: {
            "tooltip.seat.title.First": "First",
            "tooltip.seat.title.Business": "Business",
            "tooltip.seat.title.Premium": "Premium",
            "tooltip.seat.title.Economy": "Economy",
            "tooltip.btn.title": "Panoramaübersicht",
            "tooltip.circle.pitch": "Abstand",
            "tooltip.circle.width": "Breite",
            "tooltip.circle.recline": "Rücklehne",
            "tooltip.footer.priceButton.seatReservation": "Eine Reservierung machen",
            "tooltip.footer.priceButton.reservationIsPossible": "Reservierung möglich",
            "tooltip.features.restrictedLegroom": "Eingeschränkte Beinfreiheit",
            "tooltip.features.extraLegroom": "Mehr Beinfreiheit",
            "tooltip.features.noFloorStorage": "Kein Stauraum unter dem Sitz",
            "tooltip.features.noOverheadStorage": "Kein Stauraum in den oberen Gepäckfächern",
            "tooltip.features.limitedOverheadStorage": "Stauraum in den oberen Gepäckfächern begrenzt",
            "tooltip.features.trayTableInArmrest": "Tablett-Tisch in der Armlehne",
            "tooltip.features.getColdByExit": "Nah zum Ausgang, Zugluft, kalt",
            "tooltip.features.misalignedWindow": "Teil- oder fehlende Fensterblick",
            "tooltip.features.noWindow": "Kein Fensterblick",
            "tooltip.features.doNotRecline": "Eingeschränkte Liegeposition, Rückenschmerzen möglich",
            "tooltip.features.limitedRecline": "Zurücklehnen kann eingeschränkt sein",
            "tooltip.features.nearLavatory": "In der Nähe von Toiletten",
            "tooltip.features.nearGalley": "In der Nähe von der Bordküche",
            "tooltip.features.nearStairs": "Treppen, schwere Verkehrsfläche",
            "tooltip.features.wingInWindow": "Flügelfenster",
            "tooltip.features.standardSeat": "Standardsitz",
            "tooltip.features.reservedCrewSeat": "Reserviert",
            "tooltip.features.prereclinedSeat": "Vorgelehnter sitz",
            "tooltip.features.bassinet": "Babywiege vorhanden",
            "tooltip.features.babyBassinet": "Babywiege vorhanden",
            "tooltip.features.audio_video_ondemand": "Audio & Video nach Anfrage (%s)",
            "tooltip.features.audioVideo": "Audio & Video nach Anfrage (%s)",
            "tooltip.features.wifi_enabled": "Wi-Fi aktiviert",
            "tooltip.features.wifiEnabled": "Wi-Fi aktiviert",
            "tooltip.features.usbPlug": "USB Anschluss",
            "tooltip.features.usbPowerPlug": "USB und Stromanschluss (%s)",
            "tooltip.features.powerPlug": "Stromanschluss (%s)",
            "tooltip.features.power": "Stromanschluss (%s)",
            "tooltip.features.narrower": "Engerer Sitz",
            "tooltip.features.bt": "Koppeln Sie Ihr Headset",
            "tooltip.footer.priceButton.request.close": "Schließen",
            "seatbar.info.guests": "Gäste",
            "seatbar.info.seats": "Sitze",
            "seatbar.info.guest": "Gast",
            "seatbar.info.seat": "Sitz",
            "feature.scanOnVR": "Scannen auf Ihrem VR-Gerät",
            "feature.virtualReality": "Virtuelle Realität",
            "feature.vrNotSupported": "leider wird die 3D-Panoramaansicht von diesem Browser nicht unterstützt. Bitte benutzen Sie einen anderen."
        },
        RU: {
            "tooltip.seat.title.First": "Первый",
            "tooltip.seat.title.Business": "Бизнесс",
            "tooltip.seat.title.Premium": "Премиум",
            "tooltip.seat.title.Economy": "Эконом",
            "tooltip.btn.title": "Панорамный вид",
            "tooltip.circle.pitch": "Расстояние",
            "tooltip.circle.width": "Ширина",
            "tooltip.circle.recline": "Наклон",
            "tooltip.features.restrictedLegroom": "Мало места для ног",
            "tooltip.features.extraLegroom": "Много места для ног",
            "tooltip.features.noFloorStorage": "Нет места для ручной клади под сиденьем",
            "tooltip.features.noOverheadStorage": "Нет полки для ручной клади",
            "tooltip.features.limitedOverheadStorage": "Полка ручной клади ограничена в размерах",
            "tooltip.features.trayTableInArmrest": "Откидной столик в подлокотнике",
            "tooltip.features.getColdByExit": "Возле выхода",
            "tooltip.features.misalignedWindow": "Иллюминатор смещён",
            "tooltip.features.noWindow": "Иллюминатор отстутсвует",
            "tooltip.features.doNotRecline": "Ограниченный угол наклона, возможны боли в спине",
            "tooltip.features.limitedRecline": "Угол наклона может быть ограничен",
            "tooltip.features.nearLavatory": "Около туалета",
            "tooltip.features.nearGalley": "Около буфета-кухни",
            "tooltip.features.nearStairs": "Рядом с лестницей, активное движение",
            "tooltip.features.wingInWindow": "Место возле крыла самолёта",
            "tooltip.features.standardSeat": "Стандартное сиденье",
            "tooltip.features.reservedCrewSeat": "Зарезервированное персоналом",
            "tooltip.features.prereclinedSeat": "Предварительно откинутое сиденье",
            "tooltip.features.bassinet": "Рядом с детской кроваткий",
            "tooltip.features.babyBassinet": "Рядом с детской кроваткой",
            "tooltip.features.audio_video_ondemand": "Развлекательная аудио- и видеопрограмма (%s)",
            "tooltip.features.audioVideo": "Развлекательная аудио- и видеопрограмма (%s)",
            "tooltip.features.wifi_enabled": "Наличие WiFi",
            "tooltip.features.wifiEnabled": "Наличие WiFi",
            "tooltip.features.usbPlug": "Наличие USB-порта",
            "tooltip.features.usbPowerPlug": "Наличие розетки и USB-порта (%s)",
            "tooltip.features.powerPlug": "Розетка (%s)",
            "tooltip.features.power": "Розетка (%s)",
            "tooltip.features.narrower": "Узкое сиденье",
            "tooltip.features.bt": "Сопряжение гарнитуры",
            "tooltip.footer.priceButton.request.close": "Закрыть",
            "seatbar.info.guests": "гостей",
            "seatbar.info.guest": "гостей",
            "seatbar.info.seats": "сидений",
            "seatbar.info.seat": "cиденье",
            "tooltip.footer.priceButton.seatReservation": "Зарезервировать",
            "tooltip.footer.priceButton.reservationIsPossible": "Возможно резервирование",
            "feature.scanOnVR": "Отсканируйте на VR девайсе",
            "feature.virtualReality": "Виртуальная реальность",
            "feature.vrNotSupported": "К сожалению, этот 3D панорамный вид не поддерживается вашим браузером. Пожалуйста, используйте другой."
        },
        "ZH-CN": {
            "tooltip.circle.pitch": "座位间距",
            "tooltip.circle.width": "座位宽度",
            "tooltip.circle.recline": "倾斜度",
            "tooltip.features.restrictedLegroom": "腿部空间较小",
            "tooltip.features.extraLegroom": "腿部空间较大",
            "tooltip.features.noFloorStorage": "前面无座位",
            "tooltip.features.noOverheadStorage": "行李柜较小",
            "tooltip.features.limitedOverheadStorage": "行李柜较小",
            "tooltip.features.trayTableInArmrest": "托盘桌在扶手里",
            "tooltip.features.getColdByExit": "靠近紧急出口，较冷",
            "tooltip.features.misalignedWindow": "部分窗户或无窗户",
            "tooltip.features.noWindow": "部分窗户或无窗户",
            "tooltip.features.doNotRecline": "后仰角度小，可能背疼",
            "tooltip.features.limitedRecline": "靠背可能有限",
            "tooltip.features.nearLavatory": "靠近洗手间",
            "tooltip.features.nearGalley": "靠近厨房",
            "tooltip.features.nearStairs": "楼梯，来往人流较多",
            "tooltip.features.wingInWindow": "机翼在窗外视线内",
            "tooltip.features.standardSeat": "标准座位",
            "tooltip.features.reservedCrewSeat": "已预订",
            "tooltip.features.prereclinedSeat": "預傾斜座椅",
            "tooltip.features.bassinet": "有婴儿摇篮",
            "tooltip.features.babyBassinet": "有婴儿摇篮",
            "tooltip.features.audio_video_ondemand": "自选式机上视听娱乐系统  (%s)",
            "tooltip.features.audioVideo": "自选式机上视听娱乐系统  (%s)",
            "tooltip.features.wifi_enabled": "有WiFi",
            "tooltip.features.wifiEnabled": "有WiFi",
            "tooltip.features.usbPlug": "USB端口",
            "tooltip.features.usbPowerPlug": "USB端口及电源插座(%s)",
            "tooltip.features.powerPlug": "电源插座(%s)",
            "tooltip.features.power": "电源插座(%s)",
            "tooltip.features.narrower": "较窄的座椅",
            "tooltip.features.bt": "配对您的耳麦",
            "tooltip.footer.priceButton.request.close": "關",
            "seatbar.info.guests": "賓客",
            "seatbar.info.seats": "席",
            "seatbar.info.guest": "客人",
            "seatbar.info.seat": "座位",
            "tooltip.seat.title.First": "第一个",
            "tooltip.seat.title.Business": "业务",
            "tooltip.seat.title.Premium": "高级",
            "tooltip.seat.title.Economy": "经济",
            "tooltip.btn.title": "全景概览",
            "feature.scanOnVR": "扫描到 VR 设备",
            "feature.virtualReality": "虚拟现实",
            "tooltip.footer.priceButton.seatReservation": "保留",
            "tooltip.footer.priceButton.reservationIsPossible": "可以预订",
            "feature.vrNotSupported": "抱歉，您的浏览器不支持此 3D 全景视图。请使用不同的"
        },
        DA: {
            "tooltip.circle.pitch": "Tonehøjde",
            "tooltip.circle.width": "Bredde",
            "tooltip.circle.recline": "Tilbagelæne",
            "tooltip.features.restrictedLegroom": "Begrænset benplads",
            "tooltip.features.extraLegroom": "Ekstra benplads",
            "tooltip.features.noFloorStorage": "Ingen opbevaring under sædet",
            "tooltip.features.noOverheadStorage": "Begrænset lagerplads",
            "tooltip.features.limitedOverheadStorage": "Begrænset lagerplads",
            "tooltip.features.trayTableInArmrest": "Bakkebord i armlænet",
            "tooltip.features.getColdByExit": "Tæt på udgang, let blæsende og køligt",
            "tooltip.features.misalignedWindow": "Delvis eller manglende vinduesæde",
            "tooltip.features.noWindow": "Delvis eller manglende vinduesæde",
            "tooltip.features.doNotRecline": "Begrænset tilbagelænet sæder. Rygsmerter er muligt",
            "tooltip.features.limitedRecline": "Tilbagelænet kan være begrænset",
            "tooltip.features.nearLavatory": "Tæt på toiletter",
            "tooltip.features.nearGalley": "Tæt på kabysser",
            "tooltip.features.nearStairs": "Trappe område med tung trafik",
            "tooltip.features.wingInWindow": "Fløj fra vinduesvisning",
            "tooltip.features.standardSeat": "Standard plads",
            "tooltip.features.reservedCrewSeat": "Reserveret",
            "tooltip.features.prereclinedSeat": "Forudlænet sæde",
            "tooltip.features.bassinet": "Baby bassinet til rådighed",
            "tooltip.features.babyBassinet": "Baby bassinet til rådighed",
            "tooltip.features.audio_video_ondemand": "Audio & Video Efter Behov (%s)",
            "tooltip.features.audioVideo": "Audio & Video Efter Behov (%s)",
            "tooltip.features.wifi_enabled": "WiFi aktiveret",
            "tooltip.features.wifiEnabled": "WiFi aktiveret",
            "tooltip.features.usbPlug": "USB-stik",
            "tooltip.features.usbPowerPlug": "USB og strømstik (%s)",
            "tooltip.features.powerPlug": "Strømstik (%s)",
            "tooltip.features.power": "Strømstik (%s)",
            "tooltip.features.narrower": "Smallere sæde",
            "tooltip.features.bt": "Par dit headset",
            "tooltip.footer.priceButton.request.close": "Luk",
            "seatbar.info.guests": "Gæster",
            "seatbar.info.seats": "Sæder",
            "seatbar.info.guest": "Gæst",
            "seatbar.info.seat": "Sæde",
            "tooltip.seat.title.First": "First",
            "tooltip.seat.title.Business": "Business",
            "tooltip.seat.title.Premium": "Premium",
            "tooltip.seat.title.Economy": "Economy",
            "tooltip.btn.title": "Panoramaudsigt",
            "feature.scanOnVR": "Scan til VR-enhed",
            "feature.virtualReality": "Virtual Reality",
            "feature.vrNotSupported": "Beklager, denne 3D-panoramaudsigt understøttes ikke af din browser. Brug en anden. ",
            "tooltip.footer.priceButton.seatReservation": "Reserve",
            "tooltip.footer.priceButton.reservationIsPossible": "Reservation mulig"
        },
        ES: {
            "tooltip.circle.pitch": "Separación",
            "tooltip.circle.width": "Anchura",
            "tooltip.circle.recline": "Reclinación",
            "tooltip.features.restrictedLegroom": "Espacio para las piernas restringido",
            "tooltip.features.extraLegroom": "Espacio extra para las piernas",
            "tooltip.features.noFloorStorage": "No hay almacenamiento debajo del asiento",
            "tooltip.features.noOverheadStorage": "Espacio de almacenamiento limitado",
            "tooltip.features.limitedOverheadStorage": "Espacio de almacenamiento limitado",
            "tooltip.features.trayTableInArmrest": "Mesa de bandejas en el reposabrazos",
            "tooltip.features.getColdByExit": "Cerca de la salida de corriente de aire y frío",
            "tooltip.features.misalignedWindow": "Vista parcial o nula por la ventana",
            "tooltip.features.noWindow": "Vista parcial o nula por la ventana",
            "tooltip.features.doNotRecline": "Posibles dolores de espalda por reclinación limitada",
            "tooltip.features.limitedRecline": "La reclinación puede ser limitada",
            "tooltip.features.nearLavatory": "Cerca de los baños",
            "tooltip.features.nearGalley": "Cerca de las cocinas",
            "tooltip.features.nearStairs": "Zona de escaleras de mucho tráfico",
            "tooltip.features.wingInWindow": "Vista del ala desde la ventana",
            "tooltip.features.standardSeat": "Asiento estándar",
            "tooltip.features.reservedCrewSeat": "Reservado",
            "tooltip.features.prereclinedSeat": "Asiento pre reclinado",
            "tooltip.features.bassinet": "Moisés para bebé disponible",
            "tooltip.features.babyBassinet": "Moisés para bebé disponible",
            "tooltip.features.audio_video_ondemand": "Audio y video bajo demanda (%s)",
            "tooltip.features.audioVideo": "Audio y video bajo demanda (%s)",
            "tooltip.features.wifi_enabled": "Wi-Fi habilitado",
            "tooltip.features.wifiEnabled": "Wi-Fi habilitado",
            "tooltip.features.usbPlug": "Enchufe USB",
            "tooltip.features.usbPowerPlug": "USB y enchufe (%s)",
            "tooltip.features.powerPlug": "Enchufe (%s)",
            "tooltip.features.power": "Enchufe (%s)",
            "tooltip.features.narrower": "Asiento más estrecho",
            "tooltip.features.bt": "Emparejar los auriculares",
            "tooltip.footer.priceButton.request.close": "Cerrar",
            "seatbar.info.guests": "invitados",
            "seatbar.info.seats": "asientos",
            "seatbar.info.guest": "invitado",
            "seatbar.info.seat": "asiento",
            "tooltip.seat.title.First": "Primero",
            "tooltip.seat.title.Business": "Negocios",
            "tooltip.seat.title.Premium": "Premium",
            "tooltip.seat.title.Economy": "Economía",
            "tooltip.btn.title": "Vista panorámica desde",
            "feature.scanOnVR": "Escanear a dispositivo VR",
            "feature.virtualReality": "Realidad virtual",
            "feature.vrNotSupported": "Lo sentimos, esta vista panorámica 3D no es compatible con su navegador. Utilice uno diferente. ",
            "tooltip.footer.priceButton.seatReservation": "Reservar",
            "tooltip.footer.priceButton.reservationIsPossible": "Reserva posible"
        },
        FR: {
            "tooltip.circle.pitch": "Pas",
            "tooltip.circle.width": "Largeur",
            "tooltip.circle.recline": "Incliner",
            "tooltip.features.restrictedLegroom": "Espace pour les jambes restreint",
            "tooltip.features.extraLegroom": "Espace supplémentaire pour les jambes",
            "tooltip.features.noFloorStorage": "Pas de rangement sous le siège",
            "tooltip.features.noOverheadStorage": "Espace de stockage limité",
            "tooltip.features.limitedOverheadStorage": "Espace de stockage limité",
            "tooltip.features.trayTableInArmrest": "Table à plateau dans l'accoudoir",
            "tooltip.features.getColdByExit": "Fermer pour sortir des courants d'air et froid",
            "tooltip.features.misalignedWindow": "Vue partielle ou manquante de la fenêtre",
            "tooltip.features.noWindow": "Vue partielle ou manquante de la fenêtre",
            "tooltip.features.doNotRecline": "Inclinaison restreinte des maux de dos possibles",
            "tooltip.features.limitedRecline": "L'inclinaison peut être limitée",
            "tooltip.features.nearLavatory": "Près des toilettes",
            "tooltip.features.nearGalley": "Près des galères",
            "tooltip.features.nearStairs": "Escaliers à fort trafic",
            "tooltip.features.wingInWindow": "Aile de la vue de fenêtre",
            "tooltip.features.standardSeat": "Siège standard",
            "tooltip.features.reservedCrewSeat": "Réservé",
            "tooltip.features.prereclinedSeat": "Siège pré-incliné",
            "tooltip.features.bassinet": "Berceau bébé disponible",
            "tooltip.features.babyBassinet": "Berceau bébé disponible",
            "tooltip.features.audio_video_ondemand": "Audio et vidéo à la demande (%s)",
            "tooltip.features.audioVideo": "Audio et vidéo à la demande (%s)",
            "tooltip.features.wifi_enabled": "Wi-Fi activé",
            "tooltip.features.wifiEnabled": "Wi-Fi activé",
            "tooltip.features.usbPlug": "Prise USB",
            "tooltip.features.usbPowerPlug": "Prise USB et alimentation (%s)",
            "tooltip.features.powerPlug": "Prise d'alimentation (%s)",
            "tooltip.features.power": "Prise d'alimentation (%s)",
            "tooltip.features.narrower": "Siège plus étroit",
            "tooltip.features.bt": "Appairer votre casque",
            "tooltip.footer.priceButton.request.close": "Proche",
            "seatbar.info.guests": "invités",
            "seatbar.info.seats": "sièges",
            "seatbar.info.guest": "client",
            "seatbar.info.seat": "siège",
            "tooltip.seat.title.First": "First",
            "tooltip.seat.title.Business": "Business",
            "tooltip.seat.title.Premium": "Premium",
            "tooltip.seat.title.Economy": "Economy",
            "tooltip.btn.title": "Vue panoramique depuis",
            "feature.scanOnVR": "Numériser vers un appareil VR",
            "feature.virtualReality": "Réalité virtuelle",
            "feature.vrNotSupported": "Désolé, cette vue panoramique 3D n'est pas prise en charge par votre navigateur. Veuillez en utiliser un autre.",
            "tooltip.footer.priceButton.seatReservation": "Réserver",
            "tooltip.footer.priceButton.reservationIsPossible": "Réservation possible"
        },
        IT: {
            "tooltip.circle.pitch": "Intonazione",
            "tooltip.circle.width": "Larghezza",
            "tooltip.circle.recline": "Reclinare",
            "tooltip.features.restrictedLegroom": "Spazio per le gambe limitato",
            "tooltip.features.extraLegroom": "Spazio extra per le gambe",
            "tooltip.features.noFloorStorage": "Nessun vano sottosella",
            "tooltip.features.noOverheadStorage": "Spazio per deposito limitato",
            "tooltip.features.limitedOverheadStorage": "Spazio per deposito limitato",
            "tooltip.features.trayTableInArmrest": "Tavolino vassoio nel bracciolo",
            "tooltip.features.getColdByExit": "Vicino all'uscita correnti d'aria e freddo",
            "tooltip.features.misalignedWindow": "Vista finestra parziale o mancante",
            "tooltip.features.noWindow": "Vista finestra parziale o mancante",
            "tooltip.features.doNotRecline": "Possibili sedili reclinabili limitati",
            "tooltip.features.limitedRecline": "La reclinazione potrebbe essere limitata",
            "tooltip.features.nearLavatory": "Vicino ai servizi igienici",
            "tooltip.features.nearGalley": "Vicino alle cambuse",
            "tooltip.features.nearStairs": "Zona a traffico intenso di scale",
            "tooltip.features.wingInWindow": "Vista dell'ala dalla finestra",
            "tooltip.features.standardSeat": "Sedile standard",
            "tooltip.features.reservedCrewSeat": "Riservato",
            "tooltip.features.prereclinedSeat": "Sedile pre-reclinabile",
            "tooltip.features.bassinet": "Culla per neonati disponibile",
            "tooltip.features.babyBassinet": "Culla per neonati disponibile",
            "tooltip.features.audio_video_ondemand": "Audio e video su richiesta (%s)",
            "tooltip.features.audioVideo": "Audio e video su richiesta (%s)",
            "tooltip.features.wifi_enabled": "WiFi abilitato",
            "tooltip.features.wifiEnabled": "WiFi abilitato",
            "tooltip.features.usbPlug": "Connettore USB",
            "tooltip.features.usbPowerPlug": "USB e spina di alimentazione (%s)",
            "tooltip.features.powerPlug": "Spina di alimentazione (%s)",
            "tooltip.features.power": "Spina di alimentazione (%s)",
            "tooltip.features.narrower": "Sedile più stretto",
            "tooltip.features.bt": "Accoppiamento delle cuffie",
            "tooltip.footer.priceButton.request.close": "Vicino",
            "seatbar.info.guests": "ospiti",
            "seatbar.info.seats": "posti",
            "seatbar.info.guest": "ospite",
            "seatbar.info.seat": "posto a sedere",
            "tooltip.seat.title.First": "Primo",
            "tooltip.seat.title.Business": "Business",
            "tooltip.seat.title.Premium": "Premium",
            "tooltip.seat.title.Economia": "Economia",
            "tooltip.btn.title": "Panoramica panoramica.",
            "feature.scanOnVR": "Scansione su dispositivo VR",
            "feature.virtualReality": "Realtà virtuale",
            "feature.vrNotSupported": "Spiacenti, questa vista panoramica 3D non è supportata dal tuo browser. Utilizzane uno diverso. ",
            "tooltip.footer.priceButton.seatReservation": "Prenota",
            "tooltip.footer.priceButton.reservationIsPossible": "Prenotazione possibile"
        },
        NO: {
            "tooltip.circle.pitch": "Stigning",
            "tooltip.circle.width": "Bredde",
            "tooltip.circle.recline": "Lene",
            "tooltip.features.restrictedLegroom": "Begrenset benplass",
            "tooltip.features.extraLegroom": "Ekstra benplass",
            "tooltip.features.noFloorStorage": "Ingen underlagsoppbevaring",
            "tooltip.features.noOverheadStorage": "Begrenset lagringsplass",
            "tooltip.features.limitedOverheadStorage": "Begrenset lagringsplass",
            "tooltip.features.trayTableInArmrest": "Brettbord i armlenet",
            "tooltip.features.getColdByExit": "Lukk for å avslutte utkast og kjølig",
            "tooltip.features.misalignedWindow": "Delvis eller manglende vindusvisning",
            "tooltip.features.noWindow": "Delvis eller manglende vindusvisning",
            "tooltip.features.doNotRecline": "Begrensede ryggsmerter mulig",
            "tooltip.features.limitedRecline": "Tilbakelegging kan være begrenset",
            "tooltip.features.nearLavatory": "Nær toaletter",
            "tooltip.features.nearGalley": "Nær gallerier",
            "tooltip.features.nearStairs": "Trapper tungt trafikkområde",
            "tooltip.features.wingInWindow": "Vinge fra vindusvisning",
            "tooltip.features.standardSeat": "Standard sete",
            "tooltip.features.reservedCrewSeat": "Reservert",
            "tooltip.features.prereclinedSeat": "Forhåndstilt tilbakelent sete",
            "tooltip.features.bassinet": "Barnevogn tilgjengelig",
            "tooltip.features.babyBassinet": "Barnevogn tilgjengelig",
            "tooltip.features.audio_video_ondemand": "Audio & Video On Demand (%s)",
            "tooltip.features.audioVideo": "Audio & Video On Demand (%s)",
            "tooltip.features.wifi_enabled": "WiFi aktivert",
            "tooltip.features.wifiEnabled": "WiFi aktivert",
            "tooltip.features.usbPlug": "USB-kontakt",
            "tooltip.features.usbPowerPlug": "USB- og strømkontakt (%s)",
            "tooltip.features.powerPlug": "Strømplugg(%s)",
            "tooltip.features.power": "Strømplugg(%s)",
            "tooltip.features.narrower": "Smalere sete",
            "tooltip.features.bt": "Par hodetelefonene dine",
            "tooltip.footer.priceButton.request.close": "Lukk",
            "seatbar.info.guests": "gjester",
            "seatbar.info.seats": "seter",
            "seatbar.info.guest": "gjest",
            "seatbar.info.seat": "sete",
            "tooltip.seat.title.First": "First",
            "tooltip.seat.title.Business": "Business",
            "tooltip.seat.title.Premium": "Premium",
            "tooltip.seat.title.Economy": "Economy",
            "tooltip.btn.title": "Panoramautsikt",
            "feature.scanOnVR": "Skann til VR-enhet",
            "feature.virtualReality": "Virtual Reality",
            "feature.vrNotSupported": "Beklager, denne 3D-panoramautsikten støttes ikke av nettleseren din. Vennligst bruk en annen. ",
            "tooltip.footer.priceButton.seatReservation": "Reserve",
            "tooltip.footer.priceButton.reservationIsPossible": "Reservering mulig"
        },
        SV: {
            "tooltip.circle.pitch": "Tonhöjd",
            "tooltip.circle.width": "Bredd",
            "tooltip.circle.recline": "Fälla bakåt",
            "tooltip.features.restrictedLegroom": "Begränsat benutrymme",
            "tooltip.features.extraLegroom": "Extra benutrymme",
            "tooltip.features.noFloorStorage": "Ingen förvaring på undersätet",
            "tooltip.features.noOverheadStorage": "Begränsat lagringsutrymme",
            "tooltip.features.limitedOverheadStorage": "Begränsat lagringsutrymme",
            "tooltip.features.trayTableInArmrest": "Brickbord i armstödet",
            "tooltip.features.getColdByExit": "Nära utgången drag och kyligt",
            "tooltip.features.misalignedWindow": "Delvis eller ingen fönstervy",
            "tooltip.features.noWindow": "Delvis eller ingen fönstervy",
            "tooltip.features.doNotRecline": "Begränsad lutning ryggvärk möjlig",
            "tooltip.features.limitedRecline": "Recline kan vara begränsad",
            "tooltip.features.nearLavatory": "Nära toaletter",
            "tooltip.features.nearGalley": "Nära till köket",
            "tooltip.features.nearStairs": "Trappor med tungt trafikområde",
            "tooltip.features.wingInWindow": "Vinge från fönstervy",
            "tooltip.features.standardSeat": "Standard säte",
            "tooltip.features.reservedCrewSeat": "Reserverad",
            "tooltip.features.prereclinedSeat": "Förutfällt säte",
            "tooltip.features.bassinet": "Babykorg tillgängligt",
            "tooltip.features.babyBassinet": "Babykorg tillgängligt",
            "tooltip.features.audio_video_ondemand": "Audio & Video On Demand (%s)",
            "tooltip.features.audioVideo": "Audio & Video On Demand (%s)",
            "tooltip.features.wifi_enabled": "WiFi aktiverat",
            "tooltip.features.wifiEnabled": "WiFi aktiverat",
            "tooltip.features.usbPlug": "USB-kontakt",
            "tooltip.features.usbPowerPlug": "USB och strömkontakt (%s)",
            "tooltip.features.powerPlug": "Strömkontakt (%s)",
            "tooltip.features.power": "Strömkontakt (%s)",
            "tooltip.features.narrower": "Smalare säte",
            "tooltip.features.bt": "Para ihop ditt headset",
            "tooltip.footer.priceButton.request.close": "Stänga",
            "seatbar.info.guests": "gäster",
            "seatbar.info.seats": "säten",
            "seatbar.info.guest": "gäst",
            "seatbar.info.seat": "sittplats",
            "tooltip.seat.title.First": "First",
            "tooltip.seat.title.Business": "Business",
            "tooltip.seat.title.Premium": "Premium",
            "tooltip.seat.title.Economy": "Economy",
            "tooltip.btn.title": "Panoramautsikt",
            "feature.scanOnVR": "Skanna till VR-enhet",
            "feature.virtualReality": "Virtual Reality",
            "feature.vrNotSupported": "Tyvärr stöds inte denna 3D-panoramavy av din webbläsare. Använd en annan. ",
            "tooltip.footer.priceButton.seatReservation": "Reservera",
            "tooltip.footer.priceButton.reservationIsPossible": "Reservation möjlig"
        },
        CS: {
            "tooltip.features.audio_video_ondemand": "Audio & Video On Demand (%s)",
            "tooltip.features.audioVideo": "Audio & Video On Demand (%s)",
            "tooltip.features.babyBassinet": "Dětský kočárek k dispozici",
            "tooltip.features.bassinet": "Dětský kočárek k dispozici",
            "tooltip.footer.priceButton.request.close": "Zavřít",
            "tooltip.features.doNotRecline": "Možnost omezeného naklonění zad",
            "tooltip.features.extraLegroom": "Extra prostor pro nohy",
            "tooltip.features.getColdByExit": "Uzavření pro zamezení chladu",
            "seatbar.info.guest": "host",
            "seatbar.info.guests": "Hosté",
            "tooltip.features.limitedOverheadStorage": "Omezený úložný prostor",
            "tooltip.features.limitedRecline": "Naklápění může být omezeno",
            "tooltip.features.misalignedWindow": "Částečný nebo chybějící výhled z okna",
            "tooltip.features.nearGalley": "Blízko kuchyněk",
            "tooltip.features.nearLavatory": "Blízko toalet",
            "tooltip.features.nearStairs": "Oblast schodů s hustým provozem",
            "tooltip.features.noFloorStorage": "Žádné úložiště pod sedadlem",
            "tooltip.features.noOverheadStorage": "Omezený úložný prostor",
            "tooltip.features.noWindow": "Částečný nebo chybějící výhled z okna",
            "tooltip.circle.pitch": "Rozteč",
            "tooltip.features.power": "Napájecí zástrčka (%s)",
            "tooltip.features.powerPlug": "Napájecí zástrčka (%s)",
            "tooltip.circle.recline": "Naklonit",
            "tooltip.footer.priceButton.reservationIsPossible": "Rezervace je možná",
            "tooltip.features.reservedCrewSeat": "Rezervováno",
            "tooltip.features.prereclinedSeat": "Předem sklopné sedadlo",
            "tooltip.features.restrictedLegroom": "Omezený prostor na nohy",
            "feature.scanOnVR": "Naskenujte na svém zařízení VR",
            "seatbar.info.seat": "sedadlo",
            "tooltip.footer.priceButton.seatReservation": "Žádost o místo",
            "seatbar.info.seats": "sedadla",
            "tooltip.features.standardSeat": "Standardní sedadlo",
            "tooltip.features.trayTableInArmrest": "Podnost v opěrce ruky",
            "tooltip.features.usbPlug": "USB konektor",
            "tooltip.features.usbPowerPlug": "USB & napájecí zástrčka (%s)",
            "tooltip.features.narrower": "Užší sedadlo",
            "tooltip.features.bt": "Spárování náhlavní soupravy",
            "feature.virtualReality": "Virtuální realita",
            "feature.vrNotSupported": "'Tento prohlížeč bohužel nepodporuje 3D panoramatické zobrazení. Použijte jin",
            "tooltip.circle.width": "Šířka",
            "tooltip.features.wifi_enabled": "WiFi povolena",
            "tooltip.features.wifiEnabled": "WiFi povolena",
            "tooltip.features.wingInWindow": "Křídlo při pohledu z okna",
            "tooltip.seat.title.First": ""
        },
        EL: {
            "tooltip.features.audio_video_ondemand": "Ήχος και βίντεο κατ 'απαίτηση (%s)",
            "tooltip.features.audioVideo": "Ήχος και βίντεο κατ 'απαίτηση (%s)",
            "tooltip.features.babyBassinet": "Διαθέσιμο κούνια μωρού",
            "tooltip.features.bassinet": "Διαθέσιμο κούνια μωρού",
            "tooltip.footer.priceButton.request.close": "Κλείσιμο",
            "tooltip.features.doNotRecline": "Περιορισμένη κλίση Πιθανή οσφυαλγία",
            "tooltip.features.extraLegroom": "Επιπλέον χώρος για τα πόδια",
            "tooltip.features.getColdByExit": "Κοντά στην έξοδο και ψυχρά",
            "seatbar.info.guest": "επισκέπτης",
            "seatbar.info.guests": "καλεσμένοι",
            "tooltip.features.limitedOverheadStorage": "Περιορισμένος αποθηκευτικός χώρος",
            "tooltip.features.limitedRecline": "Η ανάκλιση μπορεί να είναι περιορισμένη",
            "tooltip.features.misalignedWindow": "Μερική ή καθόλου θέα απ'το παράθυρο",
            "tooltip.features.nearGalley": "Κοντά σε κουζίνα",
            "tooltip.features.nearLavatory": "Κοντά στις τουαλέτες",
            "tooltip.features.nearStairs": "Σκάλα με πολύ κίνηση",
            "tooltip.features.noFloorStorage": "Χωρίς αποθηκευτικό χώρο κάτω από το κάθισμα",
            "tooltip.features.noOverheadStorage": "Περιορισμένος αποθηκευτικός χώρος",
            "tooltip.features.noWindow": "Μερική ή καθόλου θέα απ'το παράθυρο",
            "tooltip.circle.pitch": "Απόσταση",
            "tooltip.features.power": "Βύσμα τροφοδοσίας (%s)",
            "tooltip.features.powerPlug": "Βύσμα τροφοδοσίας (%s)",
            "tooltip.circle.recline": "Κλίση",
            "tooltip.footer.priceButton.reservationIsPossible": "Η κράτηση είναι δυνατή",
            "tooltip.features.reservedCrewSeat": "Κρατημένο",
            "tooltip.features.prereclinedSeat": "Προανακλινόμενο κάθισμα",
            "tooltip.features.restrictedLegroom": "Περιορισμένος χώρος για πόδια",
            "feature.scanOnVR": "Σάρωση στη συσκευή VR",
            "seatbar.info.seat": "θέση",
            "tooltip.footer.priceButton.seatReservation": "Αίτημα θέσης",
            "seatbar.info.seats": "θέσεις",
            "tooltip.features.standardSeat": "Κανονικό κάθισμα",
            "tooltip.features.trayTableInArmrest": "Τραπέζι δίσκου στο υποβραχιόνιο",
            "tooltip.features.usbPlug": "Βύσμα USB",
            "tooltip.features.usbPowerPlug": "USB & βύσμα τροφοδοσίας (%s)",
            "tooltip.features.narrower": "Στενότερο κάθισμα",
            "tooltip.features.bt": "Συνδέστε τα ακουστικά σας",
            "feature.virtualReality": "Εικονική πραγματικότητα",
            "feature.vrNotSupported": "Η VR δεν υποστηρίζεται",
            "tooltip.circle.width": "Πλάτος",
            "tooltip.features.wifi_enabled": "WiFi ενεργοποιημένο",
            "tooltip.features.wifiEnabled": "WiFi ενεργοποιημένο",
            "tooltip.features.wingInWindow": "Πτέρυγα θέας παραθύρου",
            "tooltip.seat.title.First": ""
        },
        ET: {
            "tooltip.features.audio_video_ondemand": "Heli ja video nõudmisel (%s)",
            "tooltip.features.audioVideo": "Heli ja video nõudmisel (%s)",
            "tooltip.features.babyBassinet": "Korvhäll saadaval",
            "tooltip.features.bassinet": "Korvhäll saadaval",
            "tooltip.footer.priceButton.request.close": "Sulge",
            "tooltip.features.doNotRecline": "Seljatoe allalaskmine piiratud. Võib põhjustada seljavalusid",
            "tooltip.features.extraLegroom": "Lisa jalaruum",
            "tooltip.features.getColdByExit": "Jaheda õhu ja tuuletõmbuse vältimiseks sulge",
            "seatbar.info.guest": "külaline",
            "seatbar.info.guests": "külalised",
            "tooltip.features.limitedOverheadStorage": "Piiratud mahutavusega panipaik",
            "tooltip.features.limitedRecline": "Tagasipööramine võib olla piiratud",
            "tooltip.features.misalignedWindow": "Aknavaade osaline või puudub",
            "tooltip.features.nearGalley": "Kambüüsi lähedal",
            "tooltip.features.nearLavatory": "Tualettruumide lähedal",
            "tooltip.features.nearStairs": "Trepid tiheda liiklusega alal",
            "tooltip.features.noFloorStorage": "Alumise istme all ei ole ruumi",
            "tooltip.features.noOverheadStorage": "Piiratud mahutavusega panipaik",
            "tooltip.features.noWindow": "Aknavaade osaline või puudub",
            "tooltip.circle.pitch": "Kallak",
            "tooltip.features.power": "Toitepistik (%s)",
            "tooltip.features.powerPlug": "Toitepistik (%s)",
            "tooltip.circle.recline": "Lamamisasend",
            "tooltip.footer.priceButton.reservationIsPossible": "Broneerimine on võimalik",
            "tooltip.features.reservedCrewSeat": "Reserveeritud",
            "tooltip.features.prereclinedSeat": "Eelnevalt kallutatav iste",
            "tooltip.features.restrictedLegroom": "Piiratud jalaruum",
            "feature.scanOnVR": "Skannige oma VR-seadmes",
            "seatbar.info.seat": "iste",
            "tooltip.footer.priceButton.seatReservation": "Istekoha taotlus",
            "seatbar.info.seats": "istmed",
            "tooltip.features.standardSeat": "Standardne iste",
            "tooltip.features.trayTableInArmrest": "Klapplaud käetoe sees",
            "tooltip.features.usbPlug": "SB-pisti",
            "tooltip.features.usbPowerPlug": "USB- ja toitepistik (%s)",
            "tooltip.features.narrower": "Kitsam iste",
            "tooltip.features.bt": "Seadke oma peakomplektid kokku",
            "feature.virtualReality": "Virtuaalne reaalsus",
            "feature.vrNotSupported": "Kahjuks ei toeta see brauser 3D-panoraamvaadet. Palun kasutage mõnda muud.",
            "tooltip.circle.width": "Laius",
            "tooltip.features.wifi_enabled": "WiFi on lubatud",
            "tooltip.features.wifiEnabled": "WiFi on lubatud",
            "tooltip.features.wingInWindow": "Lennukitiib aknavaatest",
            "tooltip.seat.title.First": ""
        },
        HU: {
            "tooltip.features.audio_video_ondemand": "ang és videó igény szerin (%s)",
            "tooltip.features.audioVideo": "ang és videó igény szerin (%s)",
            "tooltip.features.babyBassinet": "ózeskosár rendelkezésre ál",
            "tooltip.features.bassinet": "ózeskosár rendelkezésre ál",
            "tooltip.footer.priceButton.request.close": "Bezárás",
            "tooltip.features.doNotRecline": "orlátozott hátradőlés hátfájás lehetsége",
            "tooltip.features.extraLegroom": "Extra lábtér",
            "tooltip.features.getColdByExit": "özel a kijáratokhoz és hűvö",
            "seatbar.info.guest": "vendég",
            "seatbar.info.guests": "vendégek",
            "tooltip.features.limitedOverheadStorage": "Korlátozott tárolóhely",
            "tooltip.features.limitedRecline": "A hátradőlés korlátozott lehet",
            "tooltip.features.misalignedWindow": "Részleges vagy hiányzó ablaknézet",
            "tooltip.features.nearGalley": "Konyhák közelében",
            "tooltip.features.nearLavatory": "Mosdók közelében",
            "tooltip.features.nearStairs": "Lépcsők nagy forgalmú területe",
            "tooltip.features.noFloorStorage": "Nincs szék alatti tárolóhely",
            "tooltip.features.noOverheadStorage": "Korlátozott tárolóhely",
            "tooltip.features.noWindow": "Részleges vagy hiányzó ablaknézet",
            "tooltip.circle.pitch": "Dőlés",
            "tooltip.features.power": "Tápcsatlakozó (%s)",
            "tooltip.features.powerPlug": "Tápcsatlakozó (%s)",
            "tooltip.circle.recline": "Hátradőlés",
            "tooltip.footer.priceButton.reservationIsPossible": "Foglalás lehetséges",
            "tooltip.features.reservedCrewSeat": "Lefoglalt",
            "tooltip.features.prereclinedSeat": "Előre dönthető ülés",
            "tooltip.features.restrictedLegroom": "Korlátozott lábtér",
            "feature.scanOnVR": "Szkennelj a VR-eszközödön",
            "seatbar.info.seat": "ülőhely",
            "tooltip.footer.priceButton.seatReservation": "Ülőhely igénylés",
            "seatbar.info.seats": "ülések",
            "tooltip.features.standardSeat": "Normál ülés",
            "tooltip.features.trayTableInArmrest": "Tálcaasztal a kartámaszban",
            "tooltip.features.usbPlug": "USB-csatlakozó",
            "tooltip.features.usbPowerPlug": "USB és tápcsatlakozó (%s)",
            "tooltip.features.narrower": "Keskenyebb ülés",
            "tooltip.features.bt": "Fejhallgató párosítása",
            "feature.virtualReality": "Virtuális valóság",
            "feature.vrNotSupported": "Sajnos ez a böngésző nem támogatja a 3D-s panorámaképet. Kérjü",
            "tooltip.circle.width": "Szélesség",
            "tooltip.features.wifi_enabled": "Wi-Fi engedélyezve",
            "tooltip.features.wifiEnabled": "Wi-Fi engedélyezve",
            "tooltip.features.wingInWindow": "Szárny ablaknézetből",
            "tooltip.seat.title.First": ""
        },
        IW: {
            "tooltip.seat.title.First": "ראשון",
            "tooltip.seat.title.Business": "עסק",
            "tooltip.seat.title.Premium": "פרימיום",
            "tooltip.seat.title.Economy": "כלכלה",
            "tooltip.btn.title": "תצוגה פנורמית",
            "tooltip.circle.pitch": "מגרש",
            "tooltip.circle.width": "רוחב",
            "tooltip.circle.recline": "שכב",
            "tooltip.footer.priceButton.seatReservation": "הזמן מושב",
            "tooltip.footer.priceButton.reservationIsPossible": "אפשרות הזמנה",
            "tooltip.features.restrictedLegroom": "מרווח רגליים מוגבל",
            "tooltip.features.extraLegroom": "מרווח רגליים נוסף",
            "tooltip.features.noFloorStorage": "אין אחסון מתחת למושב",
            "tooltip.features.noOverheadStorage": "אין אחסון תקורה",
            "tooltip.features.limitedOverheadStorage": "אחסון תקורה מוגבל",
            "tooltip.features.trayTableInArmrest": "שולחן מגש במשענת היד",
            "tooltip.features.getColdByExit": "קרוב ליציאה, טיוטה, קר",
            "tooltip.features.misalignedWindow": "חלקי או ללא חלון",
            "tooltip.features.noWindow": "אין תצוגת חלון",
            "tooltip.features.doNotRecline": "אין שכיבה, כאבי גב אפשריים",
            "tooltip.features.limitedRecline": "השכיבה עשויה להיות מוגבלת",
            "tooltip.features.nearLavatory": "קרוב לשירותים",
            "tooltip.features.nearGalley": "קרוב לגליונות",
            "tooltip.features.nearStairs": "מדרגות, אזור תנועה כבדה",
            "tooltip.features.wingInWindow": "חלון כנף",
            "tooltip.features.standardSeat": "מושב סטנדרטי",
            "tooltip.features.reservedCrewSeat": "שמור על ידי הצוות",
            "tooltip.features.prereclinedSeat": "מושב משוכב מראש",
            "tooltip.features.bassinet": "ליד Baby Bassinet",
            "tooltip.features.babyBassinet": "כיס תינוק זמין",
            "tooltip.features.audio_video_ondemand": "אודיו ווידאו לפי דרישה (%s)",
            "tooltip.features.audioVideo": "אודיו ווידאו זמינים (%s)",
            "tooltip.features.wifi_enabled": "מופעל Wi-Fi",
            "tooltip.features.wifiEnabled": "מופעל Wi-Fi",
            "tooltip.features.usbPlug": "יציאת USB קיימת",
            "tooltip.features.usbPowerPlug": "USB ושקע חשמל (%s)",
            "tooltip.features.powerPlug": "תקע מתח (%s)",
            "tooltip.features.power": "שקע חשמל (%s)",
            "tooltip.features.narrower": "מושב צר יותר",
            "tooltip.features.bt": "התאם את האוזניות שלך",
            "tooltip.footer.priceButton.request.close": "סגור",
            "seatbar.info.guests": "אורחים",
            "seatbar.info.seats": "מושבים",
            "seatbar.info.guest": "אורח",
            "seatbar.info.seat": "מושב",
            "feature.scanOnVR": "סרוק במכשיר ה-VR שלך",
            "feature.virtualReality": "מציאות מדומה",
            "feature.vrNotSupported": "למרבה הצער פנורמה תלת מימדית אינה נתמכת על ידי דפדפן זה. אנא השתמש באחר"
        },
        HE: {
            "tooltip.seat.title.First": "ראשון",
            "tooltip.seat.title.Business": "עסק",
            "tooltip.seat.title.Premium": "פרימיום",
            "tooltip.seat.title.Economy": "כלכלה",
            "tooltip.btn.title": "תצוגה פנורמית",
            "tooltip.circle.pitch": "מגרש",
            "tooltip.circle.width": "רוחב",
            "tooltip.circle.recline": "שכב",
            "tooltip.footer.priceButton.seatReservation": "הזמן מושב",
            "tooltip.footer.priceButton.reservationIsPossible": "אפשרות הזמנה",
            "tooltip.features.restrictedLegroom": "מרווח רגליים מוגבל",
            "tooltip.features.extraLegroom": "מרווח רגליים נוסף",
            "tooltip.features.noFloorStorage": "אין אחסון מתחת למושב",
            "tooltip.features.noOverheadStorage": "אין אחסון תקורה",
            "tooltip.features.limitedOverheadStorage": "אחסון תקורה מוגבל",
            "tooltip.features.trayTableInArmrest": "שולחן מגש במשענת היד",
            "tooltip.features.getColdByExit": "קרוב ליציאה, טיוטה, קר",
            "tooltip.features.misalignedWindow": "חלקי או ללא חלון",
            "tooltip.features.noWindow": "אין תצוגת חלון",
            "tooltip.features.doNotRecline": "אין שכיבה, כאבי גב אפשריים",
            "tooltip.features.limitedRecline": "השכיבה עשויה להיות מוגבלת",
            "tooltip.features.nearLavatory": "קרוב לשירותים",
            "tooltip.features.nearGalley": "קרוב לגליונות",
            "tooltip.features.nearStairs": "מדרגות, אזור תנועה כבדה",
            "tooltip.features.wingInWindow": "חלון כנף",
            "tooltip.features.standardSeat": "מושב סטנדרטי",
            "tooltip.features.reservedCrewSeat": "שמור על ידי הצוות",
            "tooltip.features.prereclinedSeat": "מושב משוכב מראש",
            "tooltip.features.bassinet": "ליד Baby Bassinet",
            "tooltip.features.babyBassinet": "כיס תינוק זמין",
            "tooltip.features.audio_video_ondemand": "אודיו ווידאו לפי דרישה (%s)",
            "tooltip.features.audioVideo": "אודיו ווידאו זמינים (%s)",
            "tooltip.features.wifi_enabled": "מופעל Wi-Fi",
            "tooltip.features.wifiEnabled": "מופעל Wi-Fi",
            "tooltip.features.usbPlug": "יציאת USB קיימת",
            "tooltip.features.usbPowerPlug": "USB ושקע חשמל (%s)",
            "tooltip.features.powerPlug": "תקע מתח (%s)",
            "tooltip.features.power": "שקע חשמל (%s)",
            "tooltip.features.narrower": "מושב צר יותר",
            "tooltip.features.bt": "התאם את האוזניות שלך",
            "tooltip.footer.priceButton.request.close": "סגור",
            "seatbar.info.guests": "אורחים",
            "seatbar.info.seats": "מושבים",
            "seatbar.info.guest": "אורח",
            "seatbar.info.seat": "מושב",
            "feature.scanOnVR": "סרוק במכשיר ה-VR שלך",
            "feature.virtualReality": "מציאות מדומה",
            "feature.vrNotSupported": "למרבה הצער פנורמה תלת מימדית אינה נתמכת על ידי דפדפן זה. אנא השתמש באחר"
        },
        JA: {
            "tooltip.features.audio_video_ondemand": "オーディオ ＆ ビデオオンデマンド (%s)",
            "tooltip.features.audioVideo": "オーディオ ＆ ビデオオンデマンド (%s)",
            "tooltip.features.babyBassinet": "ベビーバシネットあり",
            "tooltip.features.bassinet": "ベビーバシネットあり",
            "tooltip.footer.priceButton.request.close": "閉じる",
            "tooltip.features.doNotRecline": "制限されたリクライニング腰痛の可能性",
            "tooltip.features.extraLegroom": "エクストラレッグルーム",
            "tooltip.features.getColdByExit": "ドラフトと肌寒い出口に近い",
            "seatbar.info.guest": "ゲスト",
            "seatbar.info.guests": "ゲスト",
            "tooltip.features.limitedOverheadStorage": "限られたストレージスペース",
            "tooltip.features.limitedRecline": "リクライニングに制限がある",
            "tooltip.features.misalignedWindow": "ウィンドウビューの一部または欠落",
            "tooltip.features.nearGalley": "ガレー船に近接",
            "tooltip.features.nearLavatory": "トイレに近接",
            "tooltip.features.nearStairs": "階段の交通量の多いエリア",
            "tooltip.features.noFloorStorage": "座席下収納なし",
            "tooltip.features.noOverheadStorage": "限られたストレージスペース",
            "tooltip.features.noWindow": "ウィンドウビューの一部または欠落",
            "tooltip.circle.pitch": "ピッチ",
            "tooltip.features.power": "電源プラグ（%s）",
            "tooltip.features.powerPlug": "電源プラグ（%s）",
            "tooltip.circle.recline": "リクライニング",
            "tooltip.footer.priceButton.reservationIsPossible": "予約可能",
            "tooltip.features.reservedCrewSeat": "予約済み",
            "tooltip.features.prereclinedSeat": "プレリクライニングシート",
            "tooltip.features.restrictedLegroom": "拘束された足元",
            "feature.scanOnVR": "VR デバイスでスキャン",
            "seatbar.info.seat": "シート",
            "tooltip.footer.priceButton.seatReservation": "座席リクエスト",
            "seatbar.info.seats": "座席",
            "tooltip.features.standardSeat": "スタンダードシート",
            "tooltip.features.trayTableInArmrest": "アームレストのトレイテーブル",
            "tooltip.features.usbPlug": "USB プラグ",
            "tooltip.features.usbPowerPlug": "USB ＆ 電源プラグ（%s）",
            "tooltip.features.narrower": "狭いシート",
            "tooltip.features.bt": "ヘッドセットをペアリングする",
            "feature.virtualReality": "バーチャルリアリティ",
            "feature.vrNotSupported": "残念ながら、3D パノラマビューはこのブラウザではサポートされていません。別のものを使用してください。",
            "tooltip.circle.width": "幅",
            "tooltip.features.wifi_enabled": "WiFi 対応",
            "tooltip.features.wifiEnabled": "WiFi 対応",
            "tooltip.features.wingInWindow": "ウィンドウのウイングビュー",
            "tooltip.seat.title.First": ""
        },
        KO: {
            "tooltip.features.audio_video_ondemand": "주문형 오디오 및 비디오 (%s)",
            "tooltip.features.audioVideo": "주문형 오디오 및 비디오 (%s)",
            "tooltip.features.babyBassinet": "유아용 요람 이용 가능",
            "tooltip.features.bassinet": "유아용 요람 이용 가능",
            "tooltip.footer.priceButton.request.close": "닫기",
            "tooltip.features.doNotRecline": "'뒤로 젖히기 제",
            "tooltip.features.extraLegroom": "추가로 발을 뻗을 수 있는 공간 보유",
            "tooltip.features.getColdByExit": "출구 바람에 가까워 쌀쌀함",
            "seatbar.info.guest": "고객",
            "seatbar.info.guests": "고객",
            "tooltip.features.limitedOverheadStorage": "물품 보관 공간 제한",
            "tooltip.features.limitedRecline": "후퇴가 제한될 수 있습니다",
            "tooltip.features.misalignedWindow": "약간의 창가 뷰 또는 뷰 없음",
            "tooltip.features.nearGalley": "주방에 가까움",
            "tooltip.features.nearLavatory": "화장실에 가까움",
            "tooltip.features.nearStairs": "계단 교통량이 많은 구역",
            "tooltip.features.noFloorStorage": "좌석 아래 물품 보관 공간 없음",
            "tooltip.features.noOverheadStorage": "물품 보관 공간 제한",
            "tooltip.features.noWindow": "약간의 창가 뷰 또는 뷰 없음",
            "tooltip.circle.pitch": "피치",
            "tooltip.features.power": "전원 플러그 (%s)",
            "tooltip.features.powerPlug": "전원 플러그 (%s)",
            "tooltip.circle.recline": "뒤로 기대기",
            "tooltip.footer.priceButton.reservationIsPossible": "예약 가능",
            "tooltip.features.reservedCrewSeat": "예약석",
            "tooltip.features.prereclinedSeat": "프리 리클라이닝 시트",
            "tooltip.features.restrictedLegroom": "발을 뻗을 수 있는 공간 제한",
            "feature.scanOnVR": "VR 기기에서 스캔 바람",
            "seatbar.info.seat": "좌석",
            "tooltip.footer.priceButton.seatReservation": "좌석 요청",
            "seatbar.info.seats": "좌석",
            "tooltip.features.standardSeat": "표준 좌석",
            "tooltip.features.trayTableInArmrest": "팔걸이의 트레이 테이블",
            "tooltip.features.usbPlug": "USB 플러그",
            "tooltip.features.usbPowerPlug": "USB 및 전원 플러그 (%s)",
            "tooltip.features.narrower": "좁은 좌석",
            "tooltip.features.bt": "헤드셋 페어링",
            "feature.virtualReality": "가상 현실",
            "feature.vrNotSupported": "안타깝게도 이 브라우저는 3D 파노라마 뷰를 지원하지 않습니다. 다른 브라우저를 이용해 주시기 바랍니다.",
            "tooltip.circle.width": "폭",
            "tooltip.features.wifi_enabled": "WiFi 활성화",
            "tooltip.features.wifiEnabled": "WiFi 활성화",
            "tooltip.features.wingInWindow": "창가 뷰에서 날개 보임",
            "tooltip.seat.title.First": ""
        },
        LT: {
            "tooltip.features.audio_video_ondemand": "Garso ir vaizdo įrašai pagal pareikalavimą (%s)",
            "tooltip.features.audioVideo": "Garso ir vaizdo įrašai pagal pareikalavimą (%s)",
            "tooltip.features.babyBassinet": "Kūdikių krepšys yra",
            "tooltip.features.bassinet": "Kūdikių krepšys yra",
            "tooltip.footer.priceButton.request.close": "Uždaryti",
            "tooltip.features.doNotRecline": "Ribotas atlošas, galimi nugaros skausmai",
            "tooltip.features.extraLegroom": "Papildoma vieta kojoms",
            "tooltip.features.getColdByExit": "Uždaryti siekiant išvengti skersvėjų ir vėsumos",
            "seatbar.info.guest": "svečias",
            "seatbar.info.guests": "svečiai",
            "tooltip.features.limitedOverheadStorage": "Ribota saugojimo vieta",
            "tooltip.features.limitedRecline": "Ribotas sėdynės atlošas",
            "tooltip.features.misalignedWindow": "Dalinis lango vaizdas arba tokio nėra",
            "tooltip.features.nearGalley": "Arti virtuvių",
            "tooltip.features.nearLavatory": "Arti tualetų",
            "tooltip.features.nearStairs": "Intensyvaus eismo zonos laiptai",
            "tooltip.features.noFloorStorage": "Nėra vietos po sėdynė",
            "tooltip.features.noOverheadStorage": "Ribota saugojimo vieta",
            "tooltip.features.noWindow": "Dalinis lango vaizdas arba nėra jo",
            "tooltip.circle.pitch": "Tarpas",
            "tooltip.features.power": "Maitinimo kištukas (%s)",
            "tooltip.features.powerPlug": "Maitinimo kištukas (%s)",
            "tooltip.circle.recline": "Pokrypis",
            "tooltip.footer.priceButton.reservationIsPossible": "Galima rezervuoti",
            "tooltip.features.reservedCrewSeat": "Rezervuota",
            "tooltip.features.prereclinedSeat": "Iš anksto atlošta sėdynė",
            "tooltip.features.restrictedLegroom": "Ribota kojų erdvė",
            "feature.scanOnVR": "Nuskaitykite savo VR įrenginyje",
            "seatbar.info.seat": "sėdynė",
            "tooltip.footer.priceButton.seatReservation": "Sėdynės prašymas",
            "seatbar.info.seats": "sėdynės",
            "tooltip.features.standardSeat": "Standartinė sėdynė",
            "tooltip.features.trayTableInArmrest": "Atlenkiamas stalelis porankyje",
            "tooltip.features.usbPlug": "USB kištukas",
            "tooltip.features.usbPowerPlug": "USB ir maitinimo kištukas (%s)",
            "tooltip.features.narrower": "Siauresnė sėdynė",
            "tooltip.features.bt": "Suporuokite ausines",
            "feature.virtualReality": "Virtuali realybė",
            "feature.vrNotSupported": "„Dej",
            "tooltip.circle.width": "Plotis",
            "tooltip.features.wifi_enabled": "WiFi įjungtas",
            "tooltip.features.wifiEnabled": "WiFi įjungtas",
            "tooltip.features.wingInWindow": "Sparnas pro lango vaizdą",
            "tooltip.seat.title.First": ""
        },
        LV: {
            "tooltip.features.audio_video_ondemand": "Audio un video pēc pieprasījuma (%s)",
            "tooltip.features.audioVideo": "Audio un video pēc pieprasījuma (%s)",
            "tooltip.features.babyBassinet": "Pieejams bērnu šūpulis",
            "tooltip.features.bassinet": "Pieejams bērnu šūpulis",
            "tooltip.footer.priceButton.request.close": "Aizvērt",
            "tooltip.features.doNotRecline": "Iespējamas muguras sāpes ierobežotas sēdekļu nolaišanas dēļ",
            "tooltip.features.extraLegroom": "Papildu vieta kājām",
            "tooltip.features.getColdByExit": "Tuvu izejas caurvējam un vēss",
            "seatbar.info.guest": "viesis",
            "seatbar.info.guests": "viesi",
            "tooltip.features.limitedOverheadStorage": "Ierobežota uzglabāšanas vieta",
            "tooltip.features.limitedRecline": "Ierobežots sēdekļa slīpums",
            "tooltip.features.misalignedWindow": "Daļējs vai bez skata pa logu",
            "tooltip.features.nearGalley": "Tuvu kambīzēm",
            "tooltip.features.nearLavatory": "Tuvu tualetēm",
            "tooltip.features.nearStairs": "Intensīvas satiksmes zonas kāpnes",
            "tooltip.features.noFloorStorage": "Nav uzglabāšanas vietas zem sēdekļa",
            "tooltip.features.noOverheadStorage": "Ierobežota uzglabāšanas vieta",
            "tooltip.features.noWindow": "Daļējs vai bez skata pa logu",
            "tooltip.circle.pitch": "Priekšgals",
            "tooltip.features.power": "Strāvas kontaktdakša (%s)",
            "tooltip.features.powerPlug": "Strāvas kontaktdakša (%s)",
            "tooltip.circle.recline": "Noliekt",
            "tooltip.footer.priceButton.reservationIsPossible": "Iespējams rezervēt",
            "tooltip.features.reservedCrewSeat": "Rezervēts",
            "tooltip.features.prereclinedSeat": "Iepriekš noliekts sēdeklis",
            "tooltip.features.restrictedLegroom": "Ierobežota vieta kājām",
            "feature.scanOnVR": "Noskenējiet jūsu VR ierīci",
            "seatbar.info.seat": "'sēdeklis",
            "tooltip.footer.priceButton.seatReservation": "Sēdekļa pieprasījums",
            "seatbar.info.seats": "sēdekļi",
            "tooltip.features.standardSeat": "Standarta sēdeklis",
            "tooltip.features.trayTableInArmrest": "Paplātes galds roku balstā",
            "tooltip.features.usbPlug": "USB spraudnis",
            "tooltip.features.usbPowerPlug": "USB un strāvas kontaktdakša (%s)",
            "tooltip.features.narrower": "Šaurāks sēdeklis",
            "tooltip.features.bt": "Savienojiet austiņas",
            "feature.virtualReality": "Virtuālā realitāte",
            "feature.vrNotSupported": "Diemžēl šis pārlūks neatbalsta 3D panorāmas skatu. Lūdz",
            "tooltip.circle.width": "Platums",
            "tooltip.features.wifi_enabled": "WiFi iespējots",
            "tooltip.features.wifiEnabled": "WiFi iespējots",
            "tooltip.features.wingInWindow": "Skats uz spārnu no loga",
            "tooltip.seat.title.First": ""
        },
        NL: {
            "tooltip.features.audio_video_ondemand": "Audio en video op aanvraag (%s)",
            "tooltip.features.audioVideo": "Audio en video op aanvraag (%s)",
            "tooltip.features.babyBassinet": "Babywieg beschikbaar",
            "tooltip.features.bassinet": "Babywieg beschikbaar",
            "tooltip.footer.priceButton.request.close": "Sluiten",
            "tooltip.features.doNotRecline": "Beperkte rugleuning mogelijk",
            "tooltip.features.extraLegroom": "Extra beenruimte",
            "tooltip.features.getColdByExit": "Dichtbij tocht en koud",
            "seatbar.info.guest": "gast",
            "seatbar.info.guests": "gasten",
            "tooltip.features.limitedOverheadStorage": "Beperkte opslagruimte",
            "tooltip.features.limitedRecline": "Rugleuning kan beperkt zijn",
            "tooltip.features.misalignedWindow": "Gedeeltelijke of ontbrekende vensterweergave",
            "tooltip.features.nearGalley": "Dichtbij kombuizen",
            "tooltip.features.nearLavatory": "Dicht bij toiletten",
            "tooltip.features.nearStairs": "Trappen zwaar verkeerszone",
            "tooltip.features.noFloorStorage": "Geen opslag onder het zadel",
            "tooltip.features.noOverheadStorage": "Beperkte opslagruimte",
            "tooltip.features.noWindow": "Gedeeltelijke of ontbrekende vensterweergave",
            "tooltip.circle.pitch": "Pitch",
            "tooltip.features.power": "Stekker (%s)",
            "tooltip.features.powerPlug": "Stekker (%s)",
            "tooltip.circle.recline": "Rusten",
            "tooltip.footer.priceButton.reservationIsPossible": "Reserveren is mogelijk",
            "tooltip.features.reservedCrewSeat": "Gereserveerd",
            "tooltip.features.prereclinedSeat": "Pre-kantelstoel",
            "tooltip.features.restrictedLegroom": "Beperkte beenruimte",
            "feature.scanOnVR": "Scannen op je VR-apparaat",
            "seatbar.info.seat": "zetel",
            "tooltip.footer.priceButton.seatReservation": "Aanvraag voor een zitplaats",
            "seatbar.info.seats": "stoelen",
            "tooltip.features.standardSeat": "Standaard stoel",
            "tooltip.features.trayTableInArmrest": "Dienbladtafel in de armleuning",
            "tooltip.features.usbPlug": "USB-stekker",
            "tooltip.features.usbPowerPlug": "USB en stekker (%s)",
            "tooltip.features.narrower": "Smallere zitting",
            "tooltip.features.bt": "Uw headset koppelen",
            "feature.virtualReality": "Virtuele realiteit",
            "feature.vrNotSupported": "Helaas wordt 3D-panoramische weergave niet ondersteund door deze browser. Gebruik een andere.",
            "tooltip.circle.width": "Breedte",
            "tooltip.features.wifi_enabled": "Wi-Fi ingeschakeld",
            "tooltip.features.wifiEnabled": "Wi-Fi ingeschakeld",
            "tooltip.features.wingInWindow": "Vleugel vanuit raamzicht",
            "tooltip.seat.title.First": ""
        },
        PL: {
            "tooltip.features.audio_video_ondemand": "Audio i wideo na żądanie (%s)",
            "tooltip.features.audioVideo": "Audio i wideo na żądanie (%s)",
            "tooltip.features.babyBassinet": "Dostępne łóżeczko dziecięce",
            "tooltip.features.bassinet": "Dostępne łóżeczko dziecięce",
            "tooltip.footer.priceButton.request.close": "Zamknij",
            "tooltip.features.doNotRecline": "Możliwe ograniczone odchylenie pleców",
            "tooltip.features.extraLegroom": "Dodatkowa przestrzeń na nogi",
            "tooltip.features.getColdByExit": "Blisko wyjść i w chłodzie",
            "seatbar.info.guest": "gość",
            "seatbar.info.guests": "goście",
            "tooltip.features.limitedOverheadStorage": "Ograniczona przestrzeń magazynowa",
            "tooltip.features.limitedRecline": "Odchylenie może być ograniczone",
            "tooltip.features.misalignedWindow": "Częściowy lub brak widoku okna",
            "tooltip.features.nearGalley": "W pobliżu kuchni",
            "tooltip.features.nearLavatory": "W pobliżu toalet",
            "tooltip.features.nearStairs": "Obszar o dużym natężeniu ruchu na schodach",
            "tooltip.features.noFloorStorage": "Brak miejsca na bagaż pod siedzeniem",
            "tooltip.features.noOverheadStorage": "Ograniczona przestrzeń magazynowa",
            "tooltip.features.noWindow": "Częściowy lub brak widoku okna",
            "tooltip.circle.pitch": "Pochylenie",
            "tooltip.features.power": "Wtyczka zasilania (%s)",
            "tooltip.features.powerPlug": "Wtyczka zasilania (%s)",
            "tooltip.circle.recline": "Rozkładany",
            "tooltip.footer.priceButton.reservationIsPossible": "Rezerwacja jest możliwa",
            "tooltip.features.reservedCrewSeat": "Zarezerwowany",
            "tooltip.features.prereclinedSeat": "Wstępnie rozkładane siedzenie",
            "tooltip.features.restrictedLegroom": "Ograniczona przestrzeń na nogi",
            "feature.scanOnVR": "Skanuj na urządzeniu VR",
            "seatbar.info.seat": "siedzenie",
            "tooltip.footer.priceButton.seatReservation": "Prośba o miejsce",
            "seatbar.info.seats": "siedzenia",
            "tooltip.features.standardSeat": "Miejsce standardowe",
            "tooltip.features.trayTableInArmrest": "Taca w podłokietniku",
            "tooltip.features.usbPlug": "Wtyczka USB",
            "tooltip.features.usbPowerPlug": "USB i wtyczka zasilania (%s)",
            "tooltip.features.narrower": "Węższe siedzisko",
            "tooltip.features.bt": "Parowanie zestawu słuchawkowego",
            "feature.virtualReality": "Wirtualna rzeczywistość",
            "feature.vrNotSupported": "„Niestety panoramiczny widok 3D nie jest obsługiwany przez tę przeglądarkę. Prosz",
            "tooltip.circle.width": "Szerokość",
            "tooltip.features.wifi_enabled": "Wi-Fi włączone",
            "tooltip.features.wifiEnabled": "Wi-Fi włączone",
            "tooltip.features.wingInWindow": "Skrzydło z okna",
            "tooltip.seat.title.First": ""
        },
        PT: {
            "tooltip.features.audio_video_ondemand": "Áudio e Vídeo On Demand (%s)",
            "tooltip.features.audioVideo": "Áudio e Vídeo On Demand (%s)",
            "tooltip.features.babyBassinet": "Berço de bebé disponível",
            "tooltip.features.bassinet": "Berço de bebé disponível",
            "tooltip.footer.priceButton.request.close": "Perto",
            "tooltip.features.doNotRecline": "Possibilidade de costas restrito",
            "tooltip.features.extraLegroom": "Espaço extra para as pernas",
            "tooltip.features.getColdByExit": "Perto da saída de correntes de ar e frio",
            "seatbar.info.guest": "convidado",
            "seatbar.info.guests": "convidados",
            "tooltip.features.limitedOverheadStorage": "Espaço de armazenamento limitado",
            "tooltip.features.limitedRecline": "A reclinação pode ser limitada",
            "tooltip.features.misalignedWindow": "Vista parcial ou ausente da janela",
            "tooltip.features.nearGalley": "Perto das cozinhas",
            "tooltip.features.nearLavatory": "Perto das casas de banho",
            "tooltip.features.nearStairs": "Escadas área de tráfego pesado",
            "tooltip.features.noFloorStorage": "Sem armazenamento sob o assento",
            "tooltip.features.noOverheadStorage": "Espaço de armazenamento limitado",
            "tooltip.features.noWindow": "Vista parcial ou ausente da janela",
            "tooltip.circle.pitch": "Distância",
            "tooltip.features.power": "Ficha de alimentação (%s)",
            "tooltip.features.powerPlug": "Ficha de alimentação (%s)",
            "tooltip.circle.recline": "Inclinação",
            "tooltip.footer.priceButton.reservationIsPossible": "É possível reservar",
            "tooltip.features.reservedCrewSeat": "Reservado",
            "tooltip.features.prereclinedSeat": "Assento pré reclinado",
            "tooltip.features.restrictedLegroom": "Espaço para as pernas limitado",
            "feature.scanOnVR": "Scan no seu dispositivo VR",
            "seatbar.info.seat": "assento",
            "tooltip.footer.priceButton.seatReservation": "Pedido de assento",
            "seatbar.info.seats": "assentos",
            "tooltip.features.standardSeat": "Assento padrão",
            "tooltip.features.trayTableInArmrest": "Mesa bandeja no apoio de braço",
            "tooltip.features.usbPlug": "Ficha USB",
            "tooltip.features.usbPowerPlug": "Ficha de alimentação e USB (%s)",
            "tooltip.features.narrower": "Assento mais estreito",
            "tooltip.features.bt": "Emparelhar o auricular",
            "feature.virtualReality": "Realidade virtual",
            "feature.vrNotSupported": "'Infelizment",
            "tooltip.circle.width": "Largura",
            "tooltip.features.wifi_enabled": "Wi-Fi ativo",
            "tooltip.features.wifiEnabled": "Wi-Fi ativo",
            "tooltip.features.wingInWindow": "Asa desde a janela",
            "tooltip.seat.title.First": ""
        },
        RO: {
            "tooltip.features.audio_video_ondemand": "Audio și video la cerere (%s)",
            "tooltip.features.audioVideo": "Audio și video la cerere (%s)",
            "tooltip.features.babyBassinet": "Coș pentru copii disponibil",
            "tooltip.features.bassinet": "Coș pentru copii disponibil",
            "tooltip.footer.priceButton.request.close": "Închide",
            "tooltip.features.doNotRecline": "Posibile dureri de spate cu înclinare restricționată",
            "tooltip.features.extraLegroom": "Spațiu suplimentar pentru picioare",
            "tooltip.features.getColdByExit": "Aproape pentru a ieși din curenți și frig",
            "seatbar.info.guest": "oaspete",
            "seatbar.info.guests": "vizitatori",
            "tooltip.features.limitedOverheadStorage": "Spațiu de depozitare limitat",
            "tooltip.features.limitedRecline": "Reclinarea ar putea fi limitată",
            "tooltip.features.misalignedWindow": "Vizualizare parțială sau lipsă a ferestrei",
            "tooltip.features.nearGalley": "Aproape de galere",
            "tooltip.features.nearLavatory": "Aproape de toalete",
            "tooltip.features.nearStairs": "Scară cu trafic intens",
            "tooltip.features.noFloorStorage": "Fără spațiu de depozitare",
            "tooltip.features.noOverheadStorage": "Spațiu de stocare limitat",
            "tooltip.features.noWindow": "Vizualizare parțială sau lipsă a ferestrei",
            "tooltip.circle.pitch": "Pas",
            "tooltip.features.power": "Fișă de alimentare (%s)",
            "tooltip.features.powerPlug": "Fișă de alimentare (%s)",
            "tooltip.circle.recline": "Inclinați",
            "tooltip.footer.priceButton.reservationIsPossible": "Rezervarea este posibilă",
            "tooltip.features.reservedCrewSeat": "Rezervat",
            "tooltip.features.prereclinedSeat": "Scaun preînclinat",
            "tooltip.features.restrictedLegroom": "Spațiu pentru picioare constrâns",
            "feature.scanOnVR": "Scanați pe dispozitivul dvs. VR",
            "seatbar.info.seat": "scaun",
            "tooltip.footer.priceButton.seatReservation": "Cerere de scaun",
            "seatbar.info.seats": "locuri",
            "tooltip.features.standardSeat": "Scaun standard",
            "tooltip.features.trayTableInArmrest": "Masă tava în cotieră",
            "tooltip.features.usbPlug": "Mufă USB",
            "tooltip.features.usbPowerPlug": "USB și mufă de alimentare (%s)",
            "tooltip.features.narrower": "Scaun mai îngust",
            "tooltip.features.bt": "Împerechează-ți căștile",
            "feature.virtualReality": "Realitate virtuala",
            "feature.vrNotSupported": "'Din păcat",
            "tooltip.circle.width": "Lăţime",
            "tooltip.features.wifi_enabled": "WiFi activat",
            "tooltip.features.wifiEnabled": "WiFi activat",
            "tooltip.features.wingInWindow": "Aripa din vizualizarea ferestrei",
            "tooltip.seat.title.First": ""
        },
        TR: {
            "tooltip.features.audio_video_ondemand": "İsteğe Bağlı Ses ve Video (%s)",
            "tooltip.features.audioVideo": "İsteğe Bağlı Ses ve Video (%s)",
            "tooltip.features.babyBassinet": "Bebek yatağı mevcut",
            "tooltip.features.bassinet": "Bebek yatağı mevcut",
            "tooltip.footer.priceButton.request.close": "Kapat",
            "tooltip.features.doNotRecline": "Koltuk yatırma kısıtlıdır Sırt ağrısına neden olabilir",
            "tooltip.features.extraLegroom": "Ekstra Diz Mesafesi",
            "tooltip.features.getColdByExit": "Hava çıkışlarına yakın ve soğuk",
            "seatbar.info.guest": "misafir",
            "seatbar.info.guests": "misafirler",
            "tooltip.features.limitedOverheadStorage": "Sınırlı depolama alanı",
            "tooltip.features.limitedRecline": "Yatma yeri sınırlı olabilir",
            "tooltip.features.misalignedWindow": "Pencereden görünüm kısmi veya yok",
            "tooltip.features.nearGalley": "Mutfağa yakın",
            "tooltip.features.nearLavatory": "Tuvaletlere yakın",
            "tooltip.features.nearStairs": "Merdiven yoğun trafik alanı",
            "tooltip.features.noFloorStorage": "Koltuk altı depolama yeri yok",
            "tooltip.features.noOverheadStorage": "Sınırlı depolama alanı",
            "tooltip.features.noWindow": "Pencereden görünüm kısmi veya yok",
            "tooltip.circle.pitch": "Eğim",
            "tooltip.features.power": "Elektrik fişi (%s)",
            "tooltip.features.powerPlug": "Elektrik fişi (%s)",
            "tooltip.circle.recline": "Arkaya yatırma",
            "tooltip.footer.priceButton.reservationIsPossible": "Rezervasyon yapılabilir",
            "tooltip.features.reservedCrewSeat": "Rezerve edilmiştir",
            "tooltip.features.prereclinedSeat": "Ön yatırılmış koltuk",
            "tooltip.features.restrictedLegroom": "Kısıtlı Diz Mesafesi",
            "feature.scanOnVR": "VR cihazınızda tarayın",
            "seatbar.info.seat": "koltuk",
            "tooltip.footer.priceButton.seatReservation": "Koltuk talebi",
            "seatbar.info.seats": "koltuklar",
            "tooltip.features.standardSeat": "Standart koltuk",
            "tooltip.features.trayTableInArmrest": "Kol dayama yerinde tepsi masası",
            "tooltip.features.usbPlug": "USB fişi",
            "tooltip.features.usbPowerPlug": "USB ve elektrik fişi (%s)",
            "tooltip.features.narrower": "Daha dar koltuk",
            "tooltip.features.bt": "Kulaklığınızı eşleştirin",
            "feature.virtualReality": "Sanal Gerçeklik",
            "feature.vrNotSupported": "Maalesef 3 Boyutlu panoramik görünüm bu tarayıcı tarafından desteklenmiyor. Lütfen başka bir görünüm kullanın.",
            "tooltip.circle.width": "Genişlik",
            "tooltip.features.wifi_enabled": "WiFi etkin",
            "tooltip.features.wifiEnabled": "WiFi etkin",
            "tooltip.features.wingInWindow": "Pencereden kanat görünür",
            "tooltip.seat.title.First": ""
        },
        UK: {
            "tooltip.features.audio_video_ondemand": "Аудіо та відео на вимогу (%s)",
            "tooltip.features.audioVideo": "Аудіо та відео на вимогу (%s)",
            "tooltip.features.babyBassinet": "Доступна дитяча люлька",
            "tooltip.features.bassinet": "Доступна дитяча люлька",
            "tooltip.footer.priceButton.request.close": "Закрити",
            "tooltip.features.doNotRecline": "Обмежений нахил спинки. Можливі болі у спині",
            "tooltip.features.extraLegroom": "Додаткове місце для ніг",
            "tooltip.features.getColdByExit": "Близько біля виходу - можливі протяги і прохолодно",
            "seatbar.info.guest": "гість",
            "seatbar.info.guests": "гості",
            "tooltip.features.limitedOverheadStorage": "Обмежений простір для багажу",
            "tooltip.features.limitedRecline": "Нахил спинки може бути обмеженим",
            "tooltip.features.misalignedWindow": "Частковий або відсутній огляд із вікна",
            "tooltip.features.nearGalley": "Близько до кухні",
            "tooltip.features.nearLavatory": "Близько до туалетів",
            "tooltip.features.nearStairs": "Сходи з інтенсивним рухом",
            "tooltip.features.noFloorStorage": "Немає місця для багажу під сидінням",
            "tooltip.features.noOverheadStorage": "Обмежений простір для багажу",
            "tooltip.features.noWindow": "Частковий або відсутній огляд із вікна",
            "tooltip.circle.pitch": "Відстань",
            "tooltip.features.power": "Розетка (%s)",
            "tooltip.features.powerPlug": "Вилка (%s)",
            "tooltip.circle.recline": "Нахил",
            "tooltip.footer.priceButton.reservationIsPossible": "Можливе бронювання",
            "tooltip.features.reservedCrewSeat": "Зарезервовано",
            "tooltip.features.prereclinedSeat": "Попередньо відкинуте сидіння",
            "tooltip.features.restrictedLegroom": "Обмежений простір для ніг",
            "feature.scanOnVR": "Сканування на вашому пристрої VR",
            "seatbar.info.seat": "місце",
            "tooltip.footer.priceButton.seatReservation": "Замовлення місця",
            "seatbar.info.seats": "місця",
            "tooltip.features.standardSeat": "Стандартне місце",
            "tooltip.features.trayTableInArmrest": "Стіл в підлокітнику",
            "tooltip.features.usbPlug": "USB-штекер",
            "tooltip.features.usbPowerPlug": "USB і штепсельна вилка (%s)",
            "tooltip.features.narrower": "Вузьке сидіння",
            "tooltip.features.bt": "Створіть пару з гарнітурою",
            "feature.virtualReality": "Віртуальна реальність",
            "feature.vrNotSupported": "На жаль, цей 3D панорамний вид не подтримується вашим браузером. Будь-ласка, спробуйте інший.",
            "tooltip.circle.width": "Ширина",
            "tooltip.features.wifi_enabled": "Wi-Fi увімкнено",
            "tooltip.features.wifiEnabled": "Wi-Fi увімкнено",
            "tooltip.features.wingInWindow": "Крило під вікном",
            "tooltip.seat.title.First": ""
        },
        "ZH-TW": {
            "tooltip.features.audio_video_ondemand": "音頻和視頻點播 (%s)",
            "tooltip.features.audioVideo": "音頻和視頻點播 (%s)",
            "tooltip.features.babyBassinet": "嬰兒搖籃可用",
            "tooltip.features.bassinet": "嬰兒搖籃可用",
            "tooltip.footer.priceButton.request.close": "關",
            "tooltip.features.doNotRecline": "受限制的橫臥，有可能會讓您背痛",
            "tooltip.features.extraLegroom": "額外的腿部空間",
            "tooltip.features.getColdByExit": "靠近出口的風，而且寒冷",
            "seatbar.info.guest": "客人",
            "seatbar.info.guests": "客人們",
            "tooltip.features.limitedOverheadStorage": "有限的存儲空間",
            "tooltip.features.limitedRecline": "靠背傾斜有限",
            "tooltip.features.misalignedWindow": "部分或没有窗口景色",
            "tooltip.features.nearGalley": "靠近廚房",
            "tooltip.features.nearLavatory": "靠近洗手間",
            "tooltip.features.nearStairs": "樓梯交通繁忙的區域",
            "tooltip.features.noFloorStorage": "沒有座椅下的存儲空間",
            "tooltip.features.noOverheadStorage": "有限的存儲空間",
            "tooltip.features.noWindow": "部分或没有窗口景色",
            "tooltip.circle.pitch": "瀝青",
            "tooltip.features.power": "電源插座（%s）",
            "tooltip.features.powerPlug": "電源插座（%s）",
            "tooltip.circle.recline": "橫臥",
            "tooltip.footer.priceButton.reservationIsPossible": "有可能能預訂",
            "tooltip.features.reservedCrewSeat": "保留的",
            "tooltip.features.prereclinedSeat": "预倾斜座椅",
            "tooltip.features.restrictedLegroom": "受限腿部空間",
            "feature.scanOnVR": "在您的VR設備上掃描",
            "seatbar.info.seat": "座位",
            "tooltip.footer.priceButton.seatReservation": "座位請求",
            "seatbar.info.seats": "座位",
            "tooltip.features.standardSeat": "標準座位",
            "tooltip.features.trayTableInArmrest": "扶手裡的托盤桌",
            "tooltip.features.usbPlug": "USB插座",
            "tooltip.features.usbPowerPlug": "USB和電源插座（%s）",
            "tooltip.features.narrower": "座位較窄",
            "tooltip.features.bt": "配對您的耳機麥克風",
            "feature.virtualReality": "虛擬現實",
            "feature.vrNotSupported": "很遺憾，此瀏覽器不支持三維全景視圖。請使用另一個。",
            "tooltip.circle.width": "寬度",
            "tooltip.features.wifi_enabled": "啟用了WiFi",
            "tooltip.features.wifiEnabled": "啟用了WiFi",
            "tooltip.features.wingInWindow": "從窗口能看到機翼",
            "tooltip.seat.title.First": ""
        },
        ID: {
            "tooltip.seat.title.First": "Pertama",
            "tooltip.seat.title.Business": "Bisnis",
            "tooltip.seat.title.Premium": "Premium",
            "tooltip.seat.title.Economy": "Ekonomi",
            "tooltip.btn.title": "Tampilan Panorama",
            "tooltip.circle.pitch": "Lapangan",
            "tooltip.circle.width": "Lebar",
            "tooltip.circle.recline": "Berbaring",
            "tooltip.footer.priceButton.seatReservation": "Pesan kursi",
            "tooltip.footer.priceButton.reservationIsPossible": "Pemesanan Memungkinkan",
            "tooltip.features.restrictedLegroom": "Ruang Kaki Terbatas",
            "tooltip.features.extraLegroom": "Ruang Kaki Ekstra",
            "tooltip.features.noFloorStorage": "Tidak ada penyimpanan di bawah kursi",
            "tooltip.features.noOverheadStorage": "Tidak ada penyimpanan overhead",
            "tooltip.features.limitedOverheadStorage": "Penyimpanan overhead terbatas",
            "tooltip.features.trayTableInArmrest": "Meja Baki Di Sandaran Tangan",
            "tooltip.features.getColdByExit": "Mendekati Keluar, konsep, dingin",
            "tooltip.features.misalignedWindow": "Sebagian atau Tanpa Jendela",
            "tooltip.features.noWindow": "Tidak ada tampilan Jendela",
            "tooltip.features.doNotRecline": "Tidak dapat dibaringkan, mungkin sakit punggung",
            "tooltip.features.limitedRecline": "Berbaring mungkin terbatas",
            "tooltip.features.nearLavatory": "Dekat dengan Toilet",
            "tooltip.features.nearGalley": "Dekat dengan Galley",
            "tooltip.features.nearStairs": "Tangga, area lalu lintas padat",
            "tooltip.features.wingInWindow": "Jendela Sayap",
            "tooltip.features.standardSeat": "Kursi Standar",
            "tooltip.features.reservedCrewSeat": "Dicadangkan oleh Kru",
            "tooltip.features.prereclinedSeat": "Kursi yang sudah direbahkan",
            "tooltip.features.bassinet": "Di sebelah Keranjang Bayi",
            "tooltip.features.babyBassinet": "Bayi bayi tersedia",
            "tooltip.features.audio_video_ondemand": "Audio & Video Sesuai Permintaan (%s)",
            "tooltip.features.audioVideo": "Audio & Video tersedia (%s)",
            "tooltip.features.wifi_enabled": "Wi-Fi diaktifkan",
            "tooltip.features.wifiEnabled": "Wi-Fi diaktifkan",
            "tooltip.features.usbPlug": "Ada port USB",
            "tooltip.features.usbPowerPlug": "USB dan Steker listrik (%s)",
            "tooltip.features.powerPlug": "Steker Listrik (%s)",
            "tooltip.features.power": "Soket Daya (%s)",
            "tooltip.features.narrower": "Kursi yang lebih sempit",
            "tooltip.features.bt": "Pasangkan headset Anda",
            "tooltip.footer.priceButton.request.close": "Tutup",
            "seatbar.info.guests": "Tamu",
            "seatbar.info.seats": "Kursi",
            "seatbar.info.guest": "Tamu",
            "seatbar.info.seat": "Kursi",
            "feature.scanOnVR": "Pindai pada perangkat VR Anda",
            "feature.virtualReality": "Realitas Maya",
            "feature.vrNotSupported": "Sayangnya panorama 3D tidak didukung oleh peramban ini. Silakan gunakan yang lain"
        },
        AR: {
            "tooltip.seat.title.First": "الأولى",
            "tooltip.seat.title.Business": "الأعمال",
            "tooltip.seat.title.Premium": "المميزة",
            "tooltip.seat.title.Economy": "السياحية",
            "tooltip.btn.title": "عرض بانورامي",
            "tooltip.circle.pitch": "المسافة",
            "tooltip.circle.width": "العرض",
            "tooltip.circle.recline": "استلقاء",
            "tooltip.footer.priceButton.seatReservation": "احجز مقعدًا",
            "tooltip.footer.priceButton.reservationIsPossible": "الحجز ممكن",
            "tooltip.features.restrictedLegroom": "مساحة محدودة للساقين",
            "tooltip.features.extraLegroom": "مساحة إضافية للساقين",
            "tooltip.features.noFloorStorage": "لا يوجد تخزين أسفل المقعد",
            "tooltip.features.noOverheadStorage": "لا يوجد تخزين علوي",
            "tooltip.features.limitedOverheadStorage": "سعة التخزين العلوية المحدودة",
            "tooltip.features.trayTableInArmrest": "طاولة الطعام داخل مسند الذراع",
            "tooltip.features.getColdByExit": "قريب من المخرج, مجرى بارد",
            "tooltip.features.misalignedWindow": "نافذة جزئية أو عدم",
            "tooltip.features.noWindow": "بلا نافذة",
            "tooltip.features.doNotRecline": "غير قابل للإمالة , آلام الظهر ممكنة",
            "tooltip.features.limitedRecline": "قد تكون إمالة المقعد محدودة",
            "tooltip.features.nearLavatory": "بالقرب من دورات المياه",
            "tooltip.features.nearGalley": "بالقرب من الخدمات",
            "tooltip.features.nearStairs": "السلالم , حركة مرور كثيفة",
            "tooltip.features.wingInWindow": "فوق الجناح",
            "tooltip.features.standardSeat": "مقعد عادي",
            "tooltip.features.reservedCrewSeat": "مقعد خاص للطاقم",
            "tooltip.features.prereclinedSeat": "مقعد مائل مسبقًا",
            "tooltip.features.bassinet": "بجانب سرير الأطفال",
            "tooltip.features.babyBassinet": "سرير أطفال متوفر",
            "tooltip.features.audio_video_ondemand": "الفيديو عند الطلب (%s)",
            "tooltip.features.audioVideo": "الفيديو متوفر (%s)",
            "tooltip.features.wifi_enabled": "واي فاي متاح",
            "tooltip.features.wifiEnabled": "واي فاي متاح",
            "tooltip.features.usbPlug": "متاح USB منفذ",
            "tooltip.features.usbPowerPlug": "متاح USB منفذ طاقة و (%s)",
            "tooltip.features.powerPlug": "قابس طاقة (%s)",
            "tooltip.features.power": "منفذ طاقة (%s)",
            "tooltip.features.narrower": "مقعد أضيق",
            "tooltip.features.bt": "إقران سماعة الرأس",
            "tooltip.footer.priceButton.request.close": "إغلاق",
            "seatbar.info.guests": "ضيوف",
            "seatbar.info.seats": "مقاعد",
            "seatbar.info.guest": "ضيف",
            "seatbar.info.seat": "مقعد",
            "feature.scanOnVR": "فحص على جهاز الواقع الافتراضي  الخاص بك",
            "feature.virtualReality": "الواقع الافتراضي",
            "feature.vrNotSupported": "للأسف لا يدعم هذا مستعرض الويب البانوراما ثلاثية الأبعاد. الرجاء استخدام آخر"
        }
    }
}),
goog.provide("goog.userAgent.product"),
goog.require("goog.labs.userAgent.browser"),
goog.require("goog.labs.userAgent.platform"),
goog.require("goog.userAgent"),
goog.define("goog.userAgent.product.ASSUME_FIREFOX", !1),
goog.define("goog.userAgent.product.ASSUME_IPHONE", !1),
goog.define("goog.userAgent.product.ASSUME_IPAD", !1),
goog.define("goog.userAgent.product.ASSUME_ANDROID", !1),
goog.define("goog.userAgent.product.ASSUME_CHROME", !1),
goog.define("goog.userAgent.product.ASSUME_SAFARI", !1),
goog.userAgent.product.PRODUCT_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_OPERA || goog.userAgent.product.ASSUME_FIREFOX || goog.userAgent.product.ASSUME_IPHONE || goog.userAgent.product.ASSUME_IPAD || goog.userAgent.product.ASSUME_ANDROID || goog.userAgent.product.ASSUME_CHROME || goog.userAgent.product.ASSUME_SAFARI,
goog.userAgent.product.OPERA = goog.userAgent.OPERA,
goog.userAgent.product.IE = goog.userAgent.IE,
goog.userAgent.product.FIREFOX = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_FIREFOX : goog.labs.userAgent.browser.isFirefox(),
goog.userAgent.product.isIphoneOrIpod_ = function() {
    return goog.labs.userAgent.platform.isIphone() || goog.labs.userAgent.platform.isIpod()
}
,
goog.userAgent.product.IPHONE = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPHONE : goog.userAgent.product.isIphoneOrIpod_(),
goog.userAgent.product.IPAD = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPAD : goog.labs.userAgent.platform.isIpad(),
goog.userAgent.product.ANDROID = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_ANDROID : goog.labs.userAgent.browser.isAndroidBrowser(),
goog.userAgent.product.CHROME = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_CHROME : goog.labs.userAgent.browser.isChrome(),
goog.userAgent.product.isSafariDesktop_ = function() {
    return goog.labs.userAgent.browser.isSafari() && !goog.labs.userAgent.platform.isIos()
}
,
goog.userAgent.product.SAFARI = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_SAFARI : goog.userAgent.product.isSafariDesktop_(),
goog.provide("goog.dom.dataset"),
goog.require("goog.string"),
goog.require("goog.userAgent.product"),
goog.dom.dataset.ALLOWED_ = !goog.userAgent.product.IE,
goog.dom.dataset.PREFIX_ = "data-",
goog.dom.dataset.set = function(e, t, o) {
    goog.dom.dataset.ALLOWED_ && e.dataset ? e.dataset[t] = o : e.setAttribute(goog.dom.dataset.PREFIX_ + goog.string.toSelectorCase(t), o)
}
,
goog.dom.dataset.get = function(e, t) {
    return goog.dom.dataset.ALLOWED_ && e.dataset ? t in e.dataset ? e.dataset[t] : null : e.getAttribute(goog.dom.dataset.PREFIX_ + goog.string.toSelectorCase(t))
}
,
goog.dom.dataset.remove = function(e, t) {
    goog.dom.dataset.ALLOWED_ && e.dataset ? delete e.dataset[t] : e.removeAttribute(goog.dom.dataset.PREFIX_ + goog.string.toSelectorCase(t))
}
,
goog.dom.dataset.has = function(e, t) {
    return goog.dom.dataset.ALLOWED_ && e.dataset ? t in e.dataset : e.hasAttribute ? e.hasAttribute(goog.dom.dataset.PREFIX_ + goog.string.toSelectorCase(t)) : !!e.getAttribute(goog.dom.dataset.PREFIX_ + goog.string.toSelectorCase(t))
}
,
goog.dom.dataset.getAll = function(e) {
    if (goog.dom.dataset.ALLOWED_ && e.dataset)
        return e.dataset;
    for (var t = {}, o = e.attributes, r = 0; r < o.length; ++r) {
        var i = o[r];
        goog.string.startsWith(i.name, goog.dom.dataset.PREFIX_) && (t[goog.string.toCamelCase(i.name.substr(5))] = i.value)
    }
    return t
}
,
goog.provide("qjv.i18n"),
goog.require("goog.dom"),
goog.require("goog.dom.dataset"),
goog.require("goog.object"),
goog.require("qjv.i18n.languages"),
goog.scope(function() {
    var i = goog.dom
      , s = goog.dom.dataset
      , o = qjv.i18n.languages
      , r = goog.object;
    goog.exportSymbol("quicketWebView.translate", function(e) {
        if (goog.DEBUG)
            return qjv.i18n.translate(e);
        try {
            qjv.i18n.translate(e)
        } catch (e) {
            alert("There was a problem translating the view.")
        }
    }),
    qjv.i18n.language = null,
    qjv.i18n.setLocale = function(e) {
        qjv.i18n.language = e ? e.toUpperCase() : null
    }
    ,
    qjv.i18n.translate = function(e) {
        if (null == e || "" === e)
            return qjv.i18n.language = null,
            !1;
        if (void 0 !== o[e] && 0 < Object.keys(o[e]).length) {
            var t = o[e];
            return qjv.i18n.language = e,
            r.forEach(t, function(e, t) {
                var o = i.getElementByClass(t);
                if (o) {
                    if (/tooltip.circle/.test(t)) {
                        var r = i.getElementByClass("tooltip-circle-title", o);
                        return r && i.setTextContent(r, e),
                        !0
                    }
                    t = i.getTextContent(o);
                    null != t && ((r = /\((.*)\)/).test(t) ? (r = t.match(r),
                    e = e.replace("%s", r[1])) : /%s/.test(e) && s.get(o, "translationReplacer") && (e = e.replace(/%s/, s.get(o, "translationReplacer"))),
                    null != e && i.setTextContent(o, e))
                }
            }),
            !0
        }
        console.log("i18n:// Failed to load language:", e),
        console.log("i18n:// Empty or undefined Object")
    }
}),
goog.provide("goog.dom.classes"),
goog.require("goog.array"),
goog.dom.classes.set = function(e, t) {
    e.className = t
}
,
goog.dom.classes.get = function(e) {
    e = e.className;
    return goog.isString(e) && e.match(/\S+/g) || []
}
,
goog.dom.classes.add = function(e, t) {
    var o = goog.dom.classes.get(e)
      , r = goog.array.slice(arguments, 1)
      , i = o.length + r.length;
    return goog.dom.classes.add_(o, r),
    goog.dom.classes.set(e, o.join(" ")),
    o.length == i
}
,
goog.dom.classes.remove = function(e, t) {
    var o = goog.dom.classes.get(e)
      , r = goog.array.slice(arguments, 1)
      , i = goog.dom.classes.getDifference_(o, r);
    return goog.dom.classes.set(e, i.join(" ")),
    i.length == o.length - r.length
}
,
goog.dom.classes.add_ = function(e, t) {
    for (var o = 0; o < t.length; o++)
        goog.array.contains(e, t[o]) || e.push(t[o])
}
,
goog.dom.classes.getDifference_ = function(e, t) {
    return goog.array.filter(e, function(e) {
        return !goog.array.contains(t, e)
    })
}
,
goog.dom.classes.swap = function(e, t, o) {
    for (var r = goog.dom.classes.get(e), i = !1, s = 0; s < r.length; s++)
        r[s] == t && (goog.array.splice(r, s--, 1),
        i = !0);
    return i && (r.push(o),
    goog.dom.classes.set(e, r.join(" "))),
    i
}
,
goog.dom.classes.addRemove = function(e, t, o) {
    var r = goog.dom.classes.get(e);
    goog.isString(t) ? goog.array.remove(r, t) : goog.isArray(t) && (r = goog.dom.classes.getDifference_(r, t)),
    goog.isString(o) && !goog.array.contains(r, o) ? r.push(o) : goog.isArray(o) && goog.dom.classes.add_(r, o),
    goog.dom.classes.set(e, r.join(" "))
}
,
goog.dom.classes.has = function(e, t) {
    return goog.array.contains(goog.dom.classes.get(e), t)
}
,
goog.dom.classes.enable = function(e, t, o) {
    o ? goog.dom.classes.add(e, t) : goog.dom.classes.remove(e, t)
}
,
goog.dom.classes.toggle = function(e, t) {
    var o = !goog.dom.classes.has(e, t);
    return goog.dom.classes.enable(e, t, o),
    o
}
,
goog.provide("goog.events.EventId"),
goog.events.EventId = function(e) {
    this.id = e
}
,
goog.events.EventId.prototype.toString = function() {
    return this.id
}
,
goog.provide("goog.events.Listenable"),
goog.provide("goog.events.ListenableKey"),
goog.require("goog.events.EventId"),
goog.events.Listenable = function() {}
,
goog.events.Listenable.IMPLEMENTED_BY_PROP = "closure_listenable_" + (1e6 * Math.random() | 0),
goog.events.Listenable.addImplementation = function(e) {
    e.prototype[goog.events.Listenable.IMPLEMENTED_BY_PROP] = !0
}
,
goog.events.Listenable.isImplementedBy = function(e) {
    return !(!e || !e[goog.events.Listenable.IMPLEMENTED_BY_PROP])
}
,
goog.events.Listenable.prototype.listen,
goog.events.Listenable.prototype.listenOnce,
goog.events.Listenable.prototype.unlisten,
goog.events.Listenable.prototype.unlistenByKey,
goog.events.Listenable.prototype.dispatchEvent,
goog.events.Listenable.prototype.removeAllListeners,
goog.events.Listenable.prototype.getParentEventTarget,
goog.events.Listenable.prototype.fireListeners,
goog.events.Listenable.prototype.getListeners,
goog.events.Listenable.prototype.getListener,
goog.events.Listenable.prototype.hasListener,
goog.events.ListenableKey = function() {}
,
goog.events.ListenableKey.counter_ = 0,
goog.events.ListenableKey.reserveKey = function() {
    return ++goog.events.ListenableKey.counter_
}
,
goog.events.ListenableKey.prototype.src,
goog.events.ListenableKey.prototype.type,
goog.events.ListenableKey.prototype.listener,
goog.events.ListenableKey.prototype.capture,
goog.events.ListenableKey.prototype.handler,
goog.events.ListenableKey.prototype.key,
goog.provide("goog.events.Listener"),
goog.require("goog.events.ListenableKey"),
goog.events.Listener = function(e, t, o, r, i, s) {
    goog.events.Listener.ENABLE_MONITORING && (this.creationStack = (new Error).stack),
    this.listener = e,
    this.proxy = t,
    this.src = o,
    this.type = r,
    this.capture = !!i,
    this.handler = s,
    this.key = goog.events.ListenableKey.reserveKey(),
    this.callOnce = !1,
    this.removed = !1
}
,
goog.define("goog.events.Listener.ENABLE_MONITORING", !1),
goog.events.Listener.prototype.creationStack,
goog.events.Listener.prototype.markAsRemoved = function() {
    this.removed = !0,
    this.listener = null,
    this.proxy = null,
    this.src = null,
    this.handler = null
}
,
goog.provide("goog.events.ListenerMap"),
goog.require("goog.array"),
goog.require("goog.events.Listener"),
goog.require("goog.object"),
goog.events.ListenerMap = function(e) {
    this.src = e,
    this.listeners = {},
    this.typeCount_ = 0
}
,
goog.events.ListenerMap.prototype.getTypeCount = function() {
    return this.typeCount_
}
,
goog.events.ListenerMap.prototype.getListenerCount = function() {
    var e, t = 0;
    for (e in this.listeners)
        t += this.listeners[e].length;
    return t
}
,
goog.events.ListenerMap.prototype.add = function(e, t, o, r, i) {
    var s, a = e.toString(), g = this.listeners[a];
    g || (g = this.listeners[a] = [],
    this.typeCount_++);
    e = goog.events.ListenerMap.findListenerIndex_(g, t, r, i);
    return -1 < e ? (s = g[e],
    o || (s.callOnce = !1)) : ((s = new goog.events.Listener(t,null,this.src,a,!!r,i)).callOnce = o,
    g.push(s)),
    s
}
,
goog.events.ListenerMap.prototype.remove = function(e, t, o, r) {
    var i = e.toString();
    if (!(i in this.listeners))
        return !1;
    e = this.listeners[i],
    r = goog.events.ListenerMap.findListenerIndex_(e, t, o, r);
    return -1 < r && (e[r].markAsRemoved(),
    goog.array.removeAt(e, r),
    0 == e.length && (delete this.listeners[i],
    this.typeCount_--),
    !0)
}
,
goog.events.ListenerMap.prototype.removeByKey = function(e) {
    var t = e.type;
    if (!(t in this.listeners))
        return !1;
    var o = goog.array.remove(this.listeners[t], e);
    return o && (e.markAsRemoved(),
    0 == this.listeners[t].length && (delete this.listeners[t],
    this.typeCount_--)),
    o
}
,
goog.events.ListenerMap.prototype.removeAll = function(e) {
    var t, o = e && e.toString(), r = 0;
    for (t in this.listeners)
        if (!o || t == o) {
            for (var i = this.listeners[t], s = 0; s < i.length; s++)
                ++r,
                i[s].markAsRemoved();
            delete this.listeners[t],
            this.typeCount_--
        }
    return r
}
,
goog.events.ListenerMap.prototype.getListeners = function(e, t) {
    var o = this.listeners[e.toString()]
      , r = [];
    if (o)
        for (var i = 0; i < o.length; ++i) {
            var s = o[i];
            s.capture == t && r.push(s)
        }
    return r
}
,
goog.events.ListenerMap.prototype.getListener = function(e, t, o, r) {
    var i = this.listeners[e.toString()]
      , e = -1;
    return -1 < (e = i ? goog.events.ListenerMap.findListenerIndex_(i, t, o, r) : e) ? i[e] : null
}
,
goog.events.ListenerMap.prototype.hasListener = function(e, r) {
    var i = goog.isDef(e)
      , s = i ? e.toString() : ""
      , a = goog.isDef(r);
    return goog.object.some(this.listeners, function(e, t) {
        for (var o = 0; o < e.length; ++o)
            if (!(i && e[o].type != s || a && e[o].capture != r))
                return !0;
        return !1
    })
}
,
goog.events.ListenerMap.findListenerIndex_ = function(e, t, o, r) {
    for (var i = 0; i < e.length; ++i) {
        var s = e[i];
        if (!s.removed && s.listener == t && s.capture == !!o && s.handler == r)
            return i
    }
    return -1
}
,
goog.provide("goog.events.BrowserFeature"),
goog.require("goog.userAgent"),
goog.events.BrowserFeature = {
    HAS_W3C_BUTTON: !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9),
    HAS_W3C_EVENT_SUPPORT: !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9),
    SET_KEY_CODE_TO_PREVENT_DEFAULT: goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"),
    HAS_NAVIGATOR_ONLINE_PROPERTY: !goog.userAgent.WEBKIT || goog.userAgent.isVersionOrHigher("528"),
    HAS_HTML5_NETWORK_EVENT_SUPPORT: goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9b") || goog.userAgent.IE && goog.userAgent.isVersionOrHigher("8") || goog.userAgent.OPERA && goog.userAgent.isVersionOrHigher("9.5") || goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("528"),
    HTML5_NETWORK_EVENTS_FIRE_ON_BODY: goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher("8") || goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"),
    TOUCH_ENABLED: "ontouchstart"in goog.global || !!(goog.global.document && document.documentElement && "ontouchstart"in document.documentElement) || !(!goog.global.navigator || !goog.global.navigator.msMaxTouchPoints)
},
goog.provide("goog.debug.EntryPointMonitor"),
goog.provide("goog.debug.entryPointRegistry"),
goog.require("goog.asserts"),
goog.debug.EntryPointMonitor = function() {}
,
goog.debug.EntryPointMonitor.prototype.wrap,
goog.debug.EntryPointMonitor.prototype.unwrap,
goog.debug.entryPointRegistry.refList_ = [],
goog.debug.entryPointRegistry.monitors_ = [],
goog.debug.entryPointRegistry.monitorsMayExist_ = !1,
goog.debug.entryPointRegistry.register = function(e) {
    if (goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = e,
    goog.debug.entryPointRegistry.monitorsMayExist_)
        for (var t = goog.debug.entryPointRegistry.monitors_, o = 0; o < t.length; o++)
            e(goog.bind(t[o].wrap, t[o]))
}
,
goog.debug.entryPointRegistry.monitorAll = function(e) {
    goog.debug.entryPointRegistry.monitorsMayExist_ = !0;
    for (var t = goog.bind(e.wrap, e), o = 0; o < goog.debug.entryPointRegistry.refList_.length; o++)
        goog.debug.entryPointRegistry.refList_[o](t);
    goog.debug.entryPointRegistry.monitors_.push(e)
}
,
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function(e) {
    var t = goog.debug.entryPointRegistry.monitors_;
    goog.asserts.assert(e == t[t.length - 1], "Only the most recent monitor can be unwrapped.");
    for (var o = goog.bind(e.unwrap, e), r = 0; r < goog.debug.entryPointRegistry.refList_.length; r++)
        goog.debug.entryPointRegistry.refList_[r](o);
    t.length--
}
,
goog.provide("goog.events.EventType"),
goog.require("goog.userAgent"),
goog.events.getVendorPrefixedName_ = function(e) {
    return goog.userAgent.WEBKIT ? "webkit" + e : goog.userAgent.OPERA ? "o" + e.toLowerCase() : e.toLowerCase()
}
,
goog.events.EventType = {
    CLICK: "click",
    RIGHTCLICK: "rightclick",
    DBLCLICK: "dblclick",
    MOUSEDOWN: "mousedown",
    MOUSEUP: "mouseup",
    MOUSEOVER: "mouseover",
    MOUSEOUT: "mouseout",
    MOUSEMOVE: "mousemove",
    MOUSEENTER: "mouseenter",
    MOUSELEAVE: "mouseleave",
    SELECTSTART: "selectstart",
    WHEEL: "wheel",
    KEYPRESS: "keypress",
    KEYDOWN: "keydown",
    KEYUP: "keyup",
    BLUR: "blur",
    FOCUS: "focus",
    DEACTIVATE: "deactivate",
    FOCUSIN: goog.userAgent.IE ? "focusin" : "DOMFocusIn",
    FOCUSOUT: goog.userAgent.IE ? "focusout" : "DOMFocusOut",
    CHANGE: "change",
    RESET: "reset",
    SELECT: "select",
    SUBMIT: "submit",
    INPUT: "input",
    PROPERTYCHANGE: "propertychange",
    DRAGSTART: "dragstart",
    DRAG: "drag",
    DRAGENTER: "dragenter",
    DRAGOVER: "dragover",
    DRAGLEAVE: "dragleave",
    DROP: "drop",
    DRAGEND: "dragend",
    TOUCHSTART: "touchstart",
    TOUCHMOVE: "touchmove",
    TOUCHEND: "touchend",
    TOUCHCANCEL: "touchcancel",
    BEFOREUNLOAD: "beforeunload",
    CONSOLEMESSAGE: "consolemessage",
    CONTEXTMENU: "contextmenu",
    DOMCONTENTLOADED: "DOMContentLoaded",
    ERROR: "error",
    HELP: "help",
    LOAD: "load",
    LOSECAPTURE: "losecapture",
    ORIENTATIONCHANGE: "orientationchange",
    READYSTATECHANGE: "readystatechange",
    RESIZE: "resize",
    SCROLL: "scroll",
    UNLOAD: "unload",
    HASHCHANGE: "hashchange",
    PAGEHIDE: "pagehide",
    PAGESHOW: "pageshow",
    POPSTATE: "popstate",
    COPY: "copy",
    PASTE: "paste",
    CUT: "cut",
    BEFORECOPY: "beforecopy",
    BEFORECUT: "beforecut",
    BEFOREPASTE: "beforepaste",
    ONLINE: "online",
    OFFLINE: "offline",
    MESSAGE: "message",
    CONNECT: "connect",
    ANIMATIONSTART: goog.events.getVendorPrefixedName_("AnimationStart"),
    ANIMATIONEND: goog.events.getVendorPrefixedName_("AnimationEnd"),
    ANIMATIONITERATION: goog.events.getVendorPrefixedName_("AnimationIteration"),
    TRANSITIONEND: goog.events.getVendorPrefixedName_("TransitionEnd"),
    POINTERDOWN: "pointerdown",
    POINTERUP: "pointerup",
    POINTERCANCEL: "pointercancel",
    POINTERMOVE: "pointermove",
    POINTEROVER: "pointerover",
    POINTEROUT: "pointerout",
    POINTERENTER: "pointerenter",
    POINTERLEAVE: "pointerleave",
    GOTPOINTERCAPTURE: "gotpointercapture",
    LOSTPOINTERCAPTURE: "lostpointercapture",
    MSGESTURECHANGE: "MSGestureChange",
    MSGESTUREEND: "MSGestureEnd",
    MSGESTUREHOLD: "MSGestureHold",
    MSGESTURESTART: "MSGestureStart",
    MSGESTURETAP: "MSGestureTap",
    MSGOTPOINTERCAPTURE: "MSGotPointerCapture",
    MSINERTIASTART: "MSInertiaStart",
    MSLOSTPOINTERCAPTURE: "MSLostPointerCapture",
    MSPOINTERCANCEL: "MSPointerCancel",
    MSPOINTERDOWN: "MSPointerDown",
    MSPOINTERENTER: "MSPointerEnter",
    MSPOINTERHOVER: "MSPointerHover",
    MSPOINTERLEAVE: "MSPointerLeave",
    MSPOINTERMOVE: "MSPointerMove",
    MSPOINTEROUT: "MSPointerOut",
    MSPOINTEROVER: "MSPointerOver",
    MSPOINTERUP: "MSPointerUp",
    TEXT: "text",
    TEXTINPUT: "textInput",
    COMPOSITIONSTART: "compositionstart",
    COMPOSITIONUPDATE: "compositionupdate",
    COMPOSITIONEND: "compositionend",
    EXIT: "exit",
    LOADABORT: "loadabort",
    LOADCOMMIT: "loadcommit",
    LOADREDIRECT: "loadredirect",
    LOADSTART: "loadstart",
    LOADSTOP: "loadstop",
    RESPONSIVE: "responsive",
    SIZECHANGED: "sizechanged",
    UNRESPONSIVE: "unresponsive",
    VISIBILITYCHANGE: "visibilitychange",
    STORAGE: "storage",
    DOMSUBTREEMODIFIED: "DOMSubtreeModified",
    DOMNODEINSERTED: "DOMNodeInserted",
    DOMNODEREMOVED: "DOMNodeRemoved",
    DOMNODEREMOVEDFROMDOCUMENT: "DOMNodeRemovedFromDocument",
    DOMNODEINSERTEDINTODOCUMENT: "DOMNodeInsertedIntoDocument",
    DOMATTRMODIFIED: "DOMAttrModified",
    DOMCHARACTERDATAMODIFIED: "DOMCharacterDataModified",
    BEFOREPRINT: "beforeprint",
    AFTERPRINT: "afterprint"
},
goog.provide("goog.disposable.IDisposable"),
goog.disposable.IDisposable = function() {}
,
goog.disposable.IDisposable.prototype.dispose = goog.abstractMethod,
goog.disposable.IDisposable.prototype.isDisposed = goog.abstractMethod,
goog.provide("goog.Disposable"),
goog.provide("goog.dispose"),
goog.provide("goog.disposeAll"),
goog.require("goog.disposable.IDisposable"),
goog.Disposable = function() {
    goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF && (goog.Disposable.INCLUDE_STACK_ON_CREATION && (this.creationStack = (new Error).stack),
    goog.Disposable.instances_[goog.getUid(this)] = this),
    this.disposed_ = this.disposed_,
    this.onDisposeCallbacks_ = this.onDisposeCallbacks_
}
,
goog.Disposable.MonitoringMode = {
    OFF: 0,
    PERMANENT: 1,
    INTERACTIVE: 2
},
goog.define("goog.Disposable.MONITORING_MODE", 0),
goog.define("goog.Disposable.INCLUDE_STACK_ON_CREATION", !0),
goog.Disposable.instances_ = {},
goog.Disposable.getUndisposedObjects = function() {
    var e, t = [];
    for (e in goog.Disposable.instances_)
        goog.Disposable.instances_.hasOwnProperty(e) && t.push(goog.Disposable.instances_[Number(e)]);
    return t
}
,
goog.Disposable.clearUndisposedObjects = function() {
    goog.Disposable.instances_ = {}
}
,
goog.Disposable.prototype.disposed_ = !1,
goog.Disposable.prototype.onDisposeCallbacks_,
goog.Disposable.prototype.creationStack,
goog.Disposable.prototype.isDisposed = function() {
    return this.disposed_
}
,
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed,
goog.Disposable.prototype.dispose = function() {
    if (!this.disposed_ && (this.disposed_ = !0,
    this.disposeInternal(),
    goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF)) {
        var e = goog.getUid(this);
        if (goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty(e))
            throw Error(this + " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call");
        delete goog.Disposable.instances_[e]
    }
}
,
goog.Disposable.prototype.registerDisposable = function(e) {
    this.addOnDisposeCallback(goog.partial(goog.dispose, e))
}
,
goog.Disposable.prototype.addOnDisposeCallback = function(e, t) {
    this.disposed_ ? e.call(t) : (this.onDisposeCallbacks_ || (this.onDisposeCallbacks_ = []),
    this.onDisposeCallbacks_.push(goog.isDef(t) ? goog.bind(e, t) : e))
}
,
goog.Disposable.prototype.disposeInternal = function() {
    if (this.onDisposeCallbacks_)
        for (; this.onDisposeCallbacks_.length; )
            this.onDisposeCallbacks_.shift()()
}
,
goog.Disposable.isDisposed = function(e) {
    return !(!e || "function" != typeof e.isDisposed) && e.isDisposed()
}
,
goog.dispose = function(e) {
    e && "function" == typeof e.dispose && e.dispose()
}
,
goog.disposeAll = function(e) {
    for (var t = 0, o = arguments.length; t < o; ++t) {
        var r = arguments[t];
        goog.isArrayLike(r) ? goog.disposeAll.apply(null, r) : goog.dispose(r)
    }
}
,
goog.provide("goog.events.Event"),
goog.provide("goog.events.EventLike"),
goog.require("goog.Disposable"),
goog.require("goog.events.EventId"),
goog.events.EventLike,
goog.events.Event = function(e, t) {
    this.type = e instanceof goog.events.EventId ? String(e) : e,
    this.target = t,
    this.currentTarget = this.target,
    this.propagationStopped_ = !1,
    this.defaultPrevented = !1,
    this.returnValue_ = !0
}
,
goog.events.Event.prototype.stopPropagation = function() {
    this.propagationStopped_ = !0
}
,
goog.events.Event.prototype.preventDefault = function() {
    this.defaultPrevented = !0,
    this.returnValue_ = !1
}
,
goog.events.Event.stopPropagation = function(e) {
    e.stopPropagation()
}
,
goog.events.Event.preventDefault = function(e) {
    e.preventDefault()
}
,
goog.provide("goog.reflect"),
goog.reflect.object = function(e, t) {
    return t
}
,
goog.reflect.sinkValue = function(e) {
    return goog.reflect.sinkValue[" "](e),
    e
}
,
goog.reflect.sinkValue[" "] = goog.nullFunction,
goog.reflect.canAccessProperty = function(e, t) {
    try {
        return goog.reflect.sinkValue(e[t]),
        !0
    } catch (e) {}
    return !1
}
,
goog.provide("goog.events.BrowserEvent"),
goog.provide("goog.events.BrowserEvent.MouseButton"),
goog.require("goog.events.BrowserFeature"),
goog.require("goog.events.Event"),
goog.require("goog.events.EventType"),
goog.require("goog.reflect"),
goog.require("goog.userAgent"),
goog.events.BrowserEvent = function(e, t) {
    goog.events.BrowserEvent.base(this, "constructor", e ? e.type : ""),
    this.target = null,
    this.currentTarget = null,
    this.relatedTarget = null,
    this.offsetX = 0,
    this.offsetY = 0,
    this.clientX = 0,
    this.clientY = 0,
    this.screenX = 0,
    this.screenY = 0,
    this.button = 0,
    this.keyCode = 0,
    this.charCode = 0,
    this.ctrlKey = !1,
    this.altKey = !1,
    this.shiftKey = !1,
    this.metaKey = !1,
    this.state = null,
    this.platformModifierKey = !1,
    this.event_ = null,
    e && this.init(e, t)
}
,
goog.inherits(goog.events.BrowserEvent, goog.events.Event),
goog.events.BrowserEvent.MouseButton = {
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2
},
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2],
goog.events.BrowserEvent.prototype.init = function(e, t) {
    var o = this.type = e.type
      , r = e.changedTouches ? e.changedTouches[0] : null;
    this.target = e.target || e.srcElement,
    this.currentTarget = t;
    t = e.relatedTarget;
    t ? goog.userAgent.GECKO && (goog.reflect.canAccessProperty(t, "nodeName") || (t = null)) : o == goog.events.EventType.MOUSEOVER ? t = e.fromElement : o == goog.events.EventType.MOUSEOUT && (t = e.toElement),
    this.relatedTarget = t,
    goog.isNull(r) ? (this.offsetX = goog.userAgent.WEBKIT || void 0 !== e.offsetX ? e.offsetX : e.layerX,
    this.offsetY = goog.userAgent.WEBKIT || void 0 !== e.offsetY ? e.offsetY : e.layerY,
    this.clientX = void 0 !== e.clientX ? e.clientX : e.pageX,
    this.clientY = void 0 !== e.clientY ? e.clientY : e.pageY,
    this.screenX = e.screenX || 0,
    this.screenY = e.screenY || 0) : (this.clientX = void 0 !== r.clientX ? r.clientX : r.pageX,
    this.clientY = void 0 !== r.clientY ? r.clientY : r.pageY,
    this.screenX = r.screenX || 0,
    this.screenY = r.screenY || 0),
    this.button = e.button,
    this.keyCode = e.keyCode || 0,
    this.charCode = e.charCode || ("keypress" == o ? e.keyCode : 0),
    this.ctrlKey = e.ctrlKey,
    this.altKey = e.altKey,
    this.shiftKey = e.shiftKey,
    this.metaKey = e.metaKey,
    this.platformModifierKey = goog.userAgent.MAC ? e.metaKey : e.ctrlKey,
    this.state = e.state,
    (this.event_ = e).defaultPrevented && this.preventDefault()
}
,
goog.events.BrowserEvent.prototype.isButton = function(e) {
    return goog.events.BrowserFeature.HAS_W3C_BUTTON ? this.event_.button == e : "click" == this.type ? e == goog.events.BrowserEvent.MouseButton.LEFT : !!(this.event_.button & goog.events.BrowserEvent.IEButtonMap[e])
}
,
goog.events.BrowserEvent.prototype.isMouseActionButton = function() {
    return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey)
}
,
goog.events.BrowserEvent.prototype.stopPropagation = function() {
    goog.events.BrowserEvent.superClass_.stopPropagation.call(this),
    this.event_.stopPropagation ? this.event_.stopPropagation() : this.event_.cancelBubble = !0
}
,
goog.events.BrowserEvent.prototype.preventDefault = function() {
    goog.events.BrowserEvent.superClass_.preventDefault.call(this);
    var e = this.event_;
    if (e.preventDefault)
        e.preventDefault();
    else if (e.returnValue = !1,
    goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT)
        try {
            (e.ctrlKey || 112 <= e.keyCode && e.keyCode <= 123) && (e.keyCode = -1)
        } catch (e) {}
}
,
goog.events.BrowserEvent.prototype.getBrowserEvent = function() {
    return this.event_
}
,
goog.provide("goog.events"),
goog.provide("goog.events.CaptureSimulationMode"),
goog.provide("goog.events.Key"),
goog.provide("goog.events.ListenableType"),
goog.require("goog.asserts"),
goog.require("goog.debug.entryPointRegistry"),
goog.require("goog.events.BrowserEvent"),
goog.require("goog.events.BrowserFeature"),
goog.require("goog.events.Listenable"),
goog.require("goog.events.ListenerMap"),
goog.forwardDeclare("goog.debug.ErrorHandler"),
goog.forwardDeclare("goog.events.EventWrapper"),
goog.events.Key,
goog.events.ListenableType,
goog.events.LISTENER_MAP_PROP_ = "closure_lm_" + (1e6 * Math.random() | 0),
goog.events.onString_ = "on",
goog.events.onStringMap_ = {},
goog.events.CaptureSimulationMode = {
    OFF_AND_FAIL: 0,
    OFF_AND_SILENT: 1,
    ON: 2
},
goog.define("goog.events.CAPTURE_SIMULATION_MODE", 2),
goog.events.listenerCountEstimate_ = 0,
goog.events.listen = function(e, t, o, r, i) {
    if (goog.isArray(t)) {
        for (var s = 0; s < t.length; s++)
            goog.events.listen(e, t[s], o, r, i);
        return null
    }
    return o = goog.events.wrapListener(o),
    goog.events.Listenable.isImplementedBy(e) ? e.listen(t, o, r, i) : goog.events.listen_(e, t, o, !1, r, i)
}
,
goog.events.listen_ = function(e, t, o, r, i, s) {
    if (!t)
        throw Error("Invalid event type");
    var a = !!i;
    if (a && !goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
        if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_FAIL)
            return goog.asserts.fail("Can not register capture listener in IE8-."),
            null;
        if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_SILENT)
            return null
    }
    var g = goog.events.getListenerMap_(e);
    g || (e[goog.events.LISTENER_MAP_PROP_] = g = new goog.events.ListenerMap(e));
    i = g.add(t, o, r, i, s);
    if (i.proxy)
        return i;
    s = goog.events.getProxy();
    if ((i.proxy = s).src = e,
    s.listener = i,
    e.addEventListener)
        e.addEventListener(t.toString(), s, a);
    else {
        if (!e.attachEvent)
            throw Error("addEventListener and attachEvent are unavailable.");
        e.attachEvent(goog.events.getOnString_(t.toString()), s)
    }
    return goog.events.listenerCountEstimate_++,
    i
}
,
goog.events.getProxy = function() {
    var t = goog.events.handleBrowserEvent_
      , o = goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function(e) {
        return t.call(o.src, o.listener, e)
    }
    : function(e) {
        e = t.call(o.src, o.listener, e);
        if (!e)
            return e
    }
    ;
    return o
}
,
goog.events.listenOnce = function(e, t, o, r, i) {
    if (goog.isArray(t)) {
        for (var s = 0; s < t.length; s++)
            goog.events.listenOnce(e, t[s], o, r, i);
        return null
    }
    return o = goog.events.wrapListener(o),
    goog.events.Listenable.isImplementedBy(e) ? e.listenOnce(t, o, r, i) : goog.events.listen_(e, t, o, !0, r, i)
}
,
goog.events.listenWithWrapper = function(e, t, o, r, i) {
    t.listen(e, o, r, i)
}
,
goog.events.unlisten = function(e, t, o, r, i) {
    if (goog.isArray(t)) {
        for (var s = 0; s < t.length; s++)
            goog.events.unlisten(e, t[s], o, r, i);
        return null
    }
    if (o = goog.events.wrapListener(o),
    goog.events.Listenable.isImplementedBy(e))
        return e.unlisten(t, o, r, i);
    if (!e)
        return !1;
    var a = !!r
      , g = goog.events.getListenerMap_(e);
    if (g) {
        a = g.getListener(t, o, a, i);
        if (a)
            return goog.events.unlistenByKey(a)
    }
    return !1
}
,
goog.events.unlistenByKey = function(e) {
    if (goog.isNumber(e))
        return !1;
    var t = e;
    if (!t || t.removed)
        return !1;
    var o = t.src;
    if (goog.events.Listenable.isImplementedBy(o))
        return o.unlistenByKey(t);
    var r = t.type
      , e = t.proxy;
    o.removeEventListener ? o.removeEventListener(r, e, t.capture) : o.detachEvent && o.detachEvent(goog.events.getOnString_(r), e),
    goog.events.listenerCountEstimate_--;
    e = goog.events.getListenerMap_(o);
    return e ? (e.removeByKey(t),
    0 == e.getTypeCount() && (e.src = null,
    o[goog.events.LISTENER_MAP_PROP_] = null)) : t.markAsRemoved(),
    !0
}
,
goog.events.unlistenWithWrapper = function(e, t, o, r, i) {
    t.unlisten(e, o, r, i)
}
,
goog.events.removeAll = function(e, t) {
    if (!e)
        return 0;
    if (goog.events.Listenable.isImplementedBy(e))
        return e.removeAllListeners(t);
    var o = goog.events.getListenerMap_(e);
    if (!o)
        return 0;
    var r, i = 0, s = t && t.toString();
    for (r in o.listeners)
        if (!s || r == s)
            for (var a = o.listeners[r].concat(), g = 0; g < a.length; ++g)
                goog.events.unlistenByKey(a[g]) && ++i;
    return i
}
,
goog.events.getListeners = function(e, t, o) {
    if (goog.events.Listenable.isImplementedBy(e))
        return e.getListeners(t, o);
    if (!e)
        return [];
    e = goog.events.getListenerMap_(e);
    return e ? e.getListeners(t, o) : []
}
,
goog.events.getListener = function(e, t, o, r, i) {
    o = goog.events.wrapListener(o);
    r = !!r;
    if (goog.events.Listenable.isImplementedBy(e))
        return e.getListener(t, o, r, i);
    if (!e)
        return null;
    e = goog.events.getListenerMap_(e);
    return e ? e.getListener(t, o, r, i) : null
}
,
goog.events.hasListener = function(e, t, o) {
    if (goog.events.Listenable.isImplementedBy(e))
        return e.hasListener(t, o);
    e = goog.events.getListenerMap_(e);
    return !!e && e.hasListener(t, o)
}
,
goog.events.expose = function(e) {
    var t, o = [];
    for (t in e)
        e[t] && e[t].id ? o.push(t + " = " + e[t] + " (" + e[t].id + ")") : o.push(t + " = " + e[t]);
    return o.join("\n")
}
,
goog.events.getOnString_ = function(e) {
    return e in goog.events.onStringMap_ ? goog.events.onStringMap_[e] : goog.events.onStringMap_[e] = goog.events.onString_ + e
}
,
goog.events.fireListeners = function(e, t, o, r) {
    return goog.events.Listenable.isImplementedBy(e) ? e.fireListeners(t, o, r) : goog.events.fireListeners_(e, t, o, r)
}
,
goog.events.fireListeners_ = function(e, t, o, r) {
    var i = !0
      , e = goog.events.getListenerMap_(e);
    if (e && (s = e.listeners[t.toString()]))
        for (var s = s.concat(), a = 0; a < s.length; a++) {
            var g = s[a];
            g && g.capture == o && !g.removed && (g = goog.events.fireListener(g, r),
            i = i && !1 !== g)
        }
    return i
}
,
goog.events.fireListener = function(e, t) {
    var o = e.listener
      , r = e.handler || e.src;
    return e.callOnce && goog.events.unlistenByKey(e),
    o.call(r, t)
}
,
goog.events.getTotalListenerCount = function() {
    return goog.events.listenerCountEstimate_
}
,
goog.events.dispatchEvent = function(e, t) {
    return goog.asserts.assert(goog.events.Listenable.isImplementedBy(e), "Can not use goog.events.dispatchEvent with non-goog.events.Listenable instance."),
    e.dispatchEvent(t)
}
,
goog.events.protectBrowserEventEntryPoint = function(e) {
    goog.events.handleBrowserEvent_ = e.protectEntryPoint(goog.events.handleBrowserEvent_)
}
,
goog.events.handleBrowserEvent_ = function(e, t) {
    if (e.removed)
        return !0;
    if (goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT)
        return goog.events.fireListener(e, new goog.events.BrowserEvent(t,this));
    var t = t || goog.getObjectByName("window.event")
      , o = new goog.events.BrowserEvent(t,this)
      , r = !0;
    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.ON) {
        if (!goog.events.isMarkedIeEvent_(t)) {
            goog.events.markIeEvent_(t);
            for (var i = [], s = o.currentTarget; s; s = s.parentNode)
                i.push(s);
            for (var a = e.type, g = i.length - 1; !o.propagationStopped_ && 0 <= g; g--) {
                o.currentTarget = i[g];
                var n = goog.events.fireListeners_(i[g], a, !0, o)
                  , r = r && n
            }
            for (g = 0; !o.propagationStopped_ && g < i.length; g++) {
                o.currentTarget = i[g];
                n = goog.events.fireListeners_(i[g], a, !1, o);
                r = r && n
            }
        }
    } else
        r = goog.events.fireListener(e, o);
    return r
}
,
goog.events.markIeEvent_ = function(e) {
    var t = !1;
    if (0 == e.keyCode)
        try {
            return void (e.keyCode = -1)
        } catch (e) {
            t = !0
        }
    !t && null != e.returnValue || (e.returnValue = !0)
}
,
goog.events.isMarkedIeEvent_ = function(e) {
    return e.keyCode < 0 || null != e.returnValue
}
,
goog.events.uniqueIdCounter_ = 0,
goog.events.getUniqueId = function(e) {
    return e + "_" + goog.events.uniqueIdCounter_++
}
,
goog.events.getListenerMap_ = function(e) {
    e = e[goog.events.LISTENER_MAP_PROP_];
    return e instanceof goog.events.ListenerMap ? e : null
}
,
goog.events.LISTENER_WRAPPER_PROP_ = "__closure_events_fn_" + (1e9 * Math.random() >>> 0),
goog.events.wrapListener = function(t) {
    return goog.asserts.assert(t, "Listener can not be null."),
    goog.isFunction(t) ? t : (goog.asserts.assert(t.handleEvent, "An object listener must have handleEvent method."),
    t[goog.events.LISTENER_WRAPPER_PROP_] || (t[goog.events.LISTENER_WRAPPER_PROP_] = function(e) {
        return t.handleEvent(e)
    }
    ),
    t[goog.events.LISTENER_WRAPPER_PROP_])
}
,
goog.debug.entryPointRegistry.register(function(e) {
    goog.events.handleBrowserEvent_ = e(goog.events.handleBrowserEvent_)
}),
goog.provide("qjv.utils"),
goog.require("goog.dom.vendor"),
goog.require("goog.style"),
goog.scope(function() {
    var o, e = goog.dom.vendor;
    qjv.utils.TRANSFORM_PROPERTY = e.getPrefixedPropertyName("transform"),
    qjv.utils.delay = (o = 0,
    function(e, t) {
        window.clearTimeout(o),
        o = window.setTimeout(e, t)
    }
    ),
    qjv.utils.getDefaultAvatar = function(e) {
        return "./images/broadcasting/avatar-" + (e = "f" === e ? "female" : "male") + ".gif"
    }
    ,
    qjv.utils.getDeviceWidth = function() {
        return document.documentElement.clientWidth
    }
    ,
    qjv.utils.scrollPage = function(e, t, o) {
        (document.body[e] ? document.body : document.documentElement)[e] = 0 < t ? Math.floor(t) : 0,
        goog.isFunction(o) && o()
    }
    ,
    qjv.utils.getUrlParams = function() {
        var e = location.search.substring(1);
        return e ? JSON.parse('{"' + decodeURI(e).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}') : {}
    }
    ,
    qjv.utils.getDeviceDPI = function() {
        for (var e = 56; e < 2e3; e++)
            if (!0 === matchMedia("(max-resolution: " + e + "dpi)").matches)
                return e;
        return e
    }
    ,
    qjv.utils.getOS = function() {
        var e = window.navigator.userAgent
          , t = window.navigator.platform
          , o = null;
        return -1 !== ["Macintosh", "MacIntel", "MacPPC", "Mac68K"].indexOf(t) ? o = "Mac OS" : -1 !== ["iPhone", "iPad", "iPod"].indexOf(t) ? o = "iOS" : -1 !== ["Win32", "Win64", "Windows", "WinCE"].indexOf(t) ? o = "Windows" : /Android/.test(e) ? o = "Android" : !o && /Linux/.test(t) && (o = "Linux"),
        o
    }
    ,
    qjv.utils.createClass = function(e, t) {
        var o = document.createElement("style");
        o.type = "text/css",
        document.getElementsByTagName("head")[0].appendChild(o),
        (o.sheet || {}).insertRule ? o.sheet.insertRule(e + "{" + t + "}", 0) : (o.styleSheet || o.sheet).addRule(e, t)
    }
    ,
    qjv.utils.applyClass = function(e, t) {
        (e = "string" == typeof e.valueOf() ? document.getElementById(e) : e) && (e.className = e.className + " " + t)
    }
    ,
    qjv.utils.getCurrentLanguage = function() {
        var e = qjv.utils.getUrlParams();
        return e.lang || e.language || "EN"
    }
    ,
    qjv.utils.cmToInch = function(e) {
        return parseInt(.393701 * parseFloat(e, 10), 10)
    }
    ,
    qjv.utils.inchToCm = function(e) {
        return parseInt(parseFloat(e, 10) / .393701, 10)
    }
}),
goog.provide("qjv.plane"),
goog.require("goog.array"),
goog.require("goog.dom"),
goog.require("goog.dom.classes"),
goog.require("goog.dom.dataset"),
goog.require("goog.object"),
goog.require("goog.string"),
goog.require("goog.style"),
goog.require("qjv.utils"),
goog.scope(function() {
    var i = goog.array
      , s = goog.dom
      , o = goog.dom.classes
      , a = goog.dom.dataset
      , r = goog.object
      , g = goog.string
      , n = goog.style;
    qjv.plane.BACKGROUND_SIZE_ = 6e3,
    qjv.plane.floors_ = null,
    qjv.plane.stickerBulksFloors_ = null,
    qjv.plane.node_ = null,
    qjv.plane.numberOfFloors_ = 0,
    qjv.plane.get = function() {
        return qjv.plane.node_ || (qjv.plane.node_ = s.getElement("plane"))
    }
    ,
    qjv.plane.getData = function(e, t) {
        return goog.isFunction(t) || (t = function(e) {
            return e
        }
        ),
        goog.isString(e) ? /data\-/.test(e) ? t(qjv.plane.get().getAttribute(e)) : t(a.get(qjv.plane.get(), e)) : r.map(a.getAll(qjv.plane.get()), t)
    }
    ,
    qjv.plane.getDisplayedFloorNumber = function() {
        return qjv.plane.getData("data-floor", g.parseInt)
    }
    ,
    qjv.plane.getFloor = function(e) {
        return qjv.plane.getFloors_()[e - 1]
    }
    ,
    qjv.plane.getStikerBulksFloor = function(e) {
        return qjv.plane.getStickerBulksFloors_()[e - 1]
    }
    ,
    qjv.plane.getFloorHeight = function(e) {
        return g.parseInt(n.getStyle(qjv.plane.getFloor(e), "height")) || 0
    }
    ,
    qjv.plane.getFloors_ = function() {
        return qjv.plane.floors_ || (qjv.plane.floors_ = s.getElementsByClass("comp-plane_floor", qjv.plane.get()))
    }
    ,
    qjv.plane.getStickerBulksFloors_ = function() {
        return qjv.plane.stickerBulksFloors_ || (qjv.plane.stickerBulksFloors_ = s.getElementsByClass("comp-plane_sticker-bulk-floor", qjv.plane.get()))
    }
    ,
    qjv.plane.getHeight = function(e) {
        var t = qjv.plane.getData();
        return 1 === e ? Math.floor(g.parseInt(t.height) * t.scale) : Math.floor(qjv.plane.getFloorHeight(e) * t.scale + 50)
    }
    ,
    qjv.plane.getHiddenFloorNumber = function() {
        return 1 === qjv.plane.getDisplayedFloorNumber() ? 2 : 1
    }
    ,
    qjv.plane.getNumberOfFloors = function() {
        return qjv.plane.numberOfFloors_ || (qjv.plane.numberOfFloors_ = qjv.plane.getFloors_().length)
    }
    ,
    qjv.plane.hideFloor = function(e) {
        o.add(qjv.plane.getStikerBulksFloor(e), "hidden"),
        o.add(qjv.plane.getFloor(e), "hidden")
    }
    ,
    qjv.plane.resize = function(t) {
        var e = Math.floor(qjv.plane.BACKGROUND_SIZE_ * t)
          , o = s.getElement("plane-wrap")
          , r = s.getElement("plane-vector-carpet");
        qjv.plane.resizeFloor_(o, t),
        qjv.plane.resizeFloor_(r, t),
        a.set(qjv.plane.get(), "scale", t),
        n.setStyle(qjv.plane.get(), {
            backgroundSize: e + "px 100%",
            height: qjv.plane.getHeight(qjv.plane.getDisplayedFloorNumber()) + "px"
        }),
        i.forEach(qjv.plane.getFloors_(), function(e) {
            qjv.plane.resizeFloor_(e, t)
        }),
        i.forEach(qjv.plane.getStickerBulksFloors_(), function(e) {
            qjv.plane.resizeFloor_(e, t)
        })
    }
    ,
    qjv.plane.resizeFloor_ = function(e, t) {
        e.style[qjv.utils.TRANSFORM_PROPERTY] = "scale(" + t + ")",
        e.style.transform = "scale(" + t + ")",
        o.remove(e, "invisible")
    }
    ,
    qjv.plane.sign = function() {
        var e = s.getElement("plane")
          , t = s.getChildren(document.body)
          , t = i.indexOf(t, e)
          , e = s.createDom("span", {
            className: "absolute identity",
            id: "identity"
        }, "#" + a.get(qjv.plane.get(), "id"));
        s.insertChildAt(document.body, e, t + 1)
    }
    ,
    qjv.plane.togglePlaneFuselage = function() {
        var e = document.querySelectorAll('[data-deck="2"]');
        e[0].hasAttribute("display") ? e[0].removeAttribute("display") : e[0].setAttribute("display", "none")
    }
    ,
    qjv.plane.showExactFloor = function(e) {
        var t = e.toString();
        [].forEach.call(qjv.plane.getFloors_(), function(e) {
            a.get(e, "level") === t ? o.remove(e, "hidden") : o.add(e, "hidden")
        }),
        [].forEach.call(qjv.plane.getStickerBulksFloors_(), function(e) {
            a.get(e, "level") === t ? o.remove(e, "hidden") : o.add(e, "hidden")
        })
    }
    ,
    qjv.plane.toggleFloor = function(e) {
        var t = e || qjv.plane.getHiddenFloorNumber();
        qjv.plane.node_.setAttribute("data-floor", t),
        qjv.switcher.setDisplayedFloorNamber(t),
        qjv.plane.togglePlaneFuselage(),
        n.setHeight(qjv.plane.node_, qjv.plane.getHeight(t)),
        e ? qjv.plane.showExactFloor(t) : ([].forEach.call(qjv.plane.getFloors_(), function(e) {
            o.toggle(e, "hidden")
        }),
        [].forEach.call(qjv.plane.getStickerBulksFloors_(), function(e) {
            o.toggle(e, "hidden")
        }))
    }
    ,
    qjv.plane.removeTopPadding = function() {
        var e = qjv.plane.get();
        n.setStyle(e, "padding", 0)
    }
}),
goog.provide("goog.dom.classlist"),
goog.require("goog.array"),
goog.define("goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST", !1),
goog.dom.classlist.get = function(e) {
    if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || e.classList)
        return e.classList;
    e = e.className;
    return goog.isString(e) && e.match(/\S+/g) || []
}
,
goog.dom.classlist.set = function(e, t) {
    e.className = t
}
,
goog.dom.classlist.contains = function(e, t) {
    return goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || e.classList ? e.classList.contains(t) : goog.array.contains(goog.dom.classlist.get(e), t)
}
,
goog.dom.classlist.add = function(e, t) {
    goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || e.classList ? e.classList.add(t) : goog.dom.classlist.contains(e, t) || (e.className += 0 < e.className.length ? " " + t : t)
}
,
goog.dom.classlist.addAll = function(t, e) {
    if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || t.classList)
        goog.array.forEach(e, function(e) {
            goog.dom.classlist.add(t, e)
        });
    else {
        var o, r = {};
        for (o in goog.array.forEach(goog.dom.classlist.get(t), function(e) {
            r[e] = !0
        }),
        goog.array.forEach(e, function(e) {
            r[e] = !0
        }),
        t.className = "",
        r)
            t.className += 0 < t.className.length ? " " + o : o
    }
}
,
goog.dom.classlist.remove = function(e, t) {
    goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || e.classList ? e.classList.remove(t) : goog.dom.classlist.contains(e, t) && (e.className = goog.array.filter(goog.dom.classlist.get(e), function(e) {
        return e != t
    }).join(" "))
}
,
goog.dom.classlist.removeAll = function(t, o) {
    goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || t.classList ? goog.array.forEach(o, function(e) {
        goog.dom.classlist.remove(t, e)
    }) : t.className = goog.array.filter(goog.dom.classlist.get(t), function(e) {
        return !goog.array.contains(o, e)
    }).join(" ")
}
,
goog.dom.classlist.enable = function(e, t, o) {
    o ? goog.dom.classlist.add(e, t) : goog.dom.classlist.remove(e, t)
}
,
goog.dom.classlist.enableAll = function(e, t, o) {
    (o ? goog.dom.classlist.addAll : goog.dom.classlist.removeAll)(e, t)
}
,
goog.dom.classlist.swap = function(e, t, o) {
    return !!goog.dom.classlist.contains(e, t) && (goog.dom.classlist.remove(e, t),
    goog.dom.classlist.add(e, o),
    !0)
}
,
goog.dom.classlist.toggle = function(e, t) {
    var o = !goog.dom.classlist.contains(e, t);
    return goog.dom.classlist.enable(e, t, o),
    o
}
,
goog.dom.classlist.addRemove = function(e, t, o) {
    goog.dom.classlist.remove(e, t),
    goog.dom.classlist.add(e, o)
}
,
goog.provide("goog.string.StringBuffer"),
goog.string.StringBuffer = function(e, t) {
    null != e && this.append.apply(this, arguments)
}
,
goog.string.StringBuffer.prototype.buffer_ = "",
goog.string.StringBuffer.prototype.set = function(e) {
    this.buffer_ = "" + e
}
,
goog.string.StringBuffer.prototype.append = function(e, t, o) {
    if (this.buffer_ += e,
    null != t)
        for (var r = 1; r < arguments.length; r++)
            this.buffer_ += arguments[r];
    return this
}
,
goog.string.StringBuffer.prototype.clear = function() {
    this.buffer_ = ""
}
,
goog.string.StringBuffer.prototype.getLength = function() {
    return this.buffer_.length
}
,
goog.string.StringBuffer.prototype.toString = function() {
    return this.buffer_
}
,
goog.provide("goog.html.SafeScript"),
goog.require("goog.asserts"),
goog.require("goog.string.Const"),
goog.require("goog.string.TypedString"),
goog.html.SafeScript = function() {
    this.privateDoNotAccessOrElseSafeScriptWrappedValue_ = "",
    this.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_
}
,
goog.html.SafeScript.prototype.implementsGoogStringTypedString = !0,
goog.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {},
goog.html.SafeScript.fromConstant = function(e) {
    e = goog.string.Const.unwrap(e);
    return 0 === e.length ? goog.html.SafeScript.EMPTY : goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(e)
}
,
goog.html.SafeScript.prototype.getTypedStringValue = function() {
    return this.privateDoNotAccessOrElseSafeScriptWrappedValue_
}
,
goog.DEBUG && (goog.html.SafeScript.prototype.toString = function() {
    return "SafeScript{" + this.privateDoNotAccessOrElseSafeScriptWrappedValue_ + "}"
}
),
goog.html.SafeScript.unwrap = function(e) {
    return e instanceof goog.html.SafeScript && e.constructor === goog.html.SafeScript && e.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ ? e.privateDoNotAccessOrElseSafeScriptWrappedValue_ : (goog.asserts.fail("expected object of type SafeScript, got '" + e + "'"),
    "type_error:SafeScript")
}
,
goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse = function(e) {
    return (new goog.html.SafeScript).initSecurityPrivateDoNotAccessOrElse_(e)
}
,
goog.html.SafeScript.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(e) {
    return this.privateDoNotAccessOrElseSafeScriptWrappedValue_ = e,
    this
}
,
goog.html.SafeScript.EMPTY = goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(""),
goog.provide("goog.html.uncheckedconversions"),
goog.require("goog.asserts"),
goog.require("goog.html.SafeHtml"),
goog.require("goog.html.SafeScript"),
goog.require("goog.html.SafeStyle"),
goog.require("goog.html.SafeStyleSheet"),
goog.require("goog.html.SafeUrl"),
goog.require("goog.html.TrustedResourceUrl"),
goog.require("goog.string"),
goog.require("goog.string.Const"),
goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract = function(e, t, o) {
    return goog.asserts.assertString(goog.string.Const.unwrap(e), "must provide justification"),
    goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(e)), "must provide non-empty justification"),
    goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(t, o || null)
}
,
goog.html.uncheckedconversions.safeScriptFromStringKnownToSatisfyTypeContract = function(e, t) {
    return goog.asserts.assertString(goog.string.Const.unwrap(e), "must provide justification"),
    goog.asserts.assert(!goog.string.isEmpty(goog.string.Const.unwrap(e)), "must provide non-empty justification"),
    goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(t)
}
,
goog.html.uncheckedconversions.safeStyleFromStringKnownToSatisfyTypeContract = function(e, t) {
    return goog.asserts.assertString(goog.string.Const.unwrap(e), "must provide justification"),
    goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(e)), "must provide non-empty justification"),
    goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(t)
}
,
goog.html.uncheckedconversions.safeStyleSheetFromStringKnownToSatisfyTypeContract = function(e, t) {
    return goog.asserts.assertString(goog.string.Const.unwrap(e), "must provide justification"),
    goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(e)), "must provide non-empty justification"),
    goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(t)
}
,
goog.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract = function(e, t) {
    return goog.asserts.assertString(goog.string.Const.unwrap(e), "must provide justification"),
    goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(e)), "must provide non-empty justification"),
    goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(t)
}
,
goog.html.uncheckedconversions.trustedResourceUrlFromStringKnownToSatisfyTypeContract = function(e, t) {
    return goog.asserts.assertString(goog.string.Const.unwrap(e), "must provide justification"),
    goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(e)), "must provide non-empty justification"),
    goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(t)
}
,
goog.provide("goog.soy.data.SanitizedContent"),
goog.provide("goog.soy.data.SanitizedContentKind"),
goog.require("goog.html.SafeHtml"),
goog.require("goog.html.uncheckedconversions"),
goog.require("goog.string.Const"),
goog.soy.data.SanitizedContentKind = {
    HTML: goog.DEBUG ? {
        sanitizedContentKindHtml: !0
    } : {},
    JS: goog.DEBUG ? {
        sanitizedContentJsChars: !0
    } : {},
    URI: goog.DEBUG ? {
        sanitizedContentUri: !0
    } : {},
    ATTRIBUTES: goog.DEBUG ? {
        sanitizedContentHtmlAttribute: !0
    } : {},
    CSS: goog.DEBUG ? {
        sanitizedContentCss: !0
    } : {},
    TEXT: goog.DEBUG ? {
        sanitizedContentKindText: !0
    } : {}
},
goog.soy.data.SanitizedContent = function() {
    throw Error("Do not instantiate directly")
}
,
goog.soy.data.SanitizedContent.prototype.contentKind,
goog.soy.data.SanitizedContent.prototype.contentDir = null,
goog.soy.data.SanitizedContent.prototype.content,
goog.soy.data.SanitizedContent.prototype.getContent = function() {
    return this.content
}
,
goog.soy.data.SanitizedContent.prototype.toString = function() {
    return this.content
}
,
goog.soy.data.SanitizedContent.prototype.toSafeHtml = function() {
    if (this.contentKind === goog.soy.data.SanitizedContentKind.TEXT)
        return goog.html.SafeHtml.htmlEscape(this.toString());
    if (this.contentKind !== goog.soy.data.SanitizedContentKind.HTML)
        throw Error("Sanitized content was not of kind TEXT or HTML.");
    return goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract(goog.string.Const.from("Soy SanitizedContent of kind HTML produces SafeHtml-contract-compliant value."), this.toString(), this.contentDir)
}
,
goog.provide("goog.soy"),
goog.require("goog.asserts"),
goog.require("goog.dom"),
goog.require("goog.dom.NodeType"),
goog.require("goog.dom.TagName"),
goog.require("goog.soy.data.SanitizedContent"),
goog.require("goog.soy.data.SanitizedContentKind"),
goog.require("goog.string"),
goog.define("goog.soy.REQUIRE_STRICT_AUTOESCAPE", !1),
goog.soy.renderHtml = function(e, t) {
    e.innerHTML = goog.soy.ensureTemplateOutputHtml_(t)
}
,
goog.soy.renderElement = function(e, t, o, r) {
    goog.asserts.assert(t, "Soy template may not be null."),
    e.innerHTML = goog.soy.ensureTemplateOutputHtml_(t(o || goog.soy.defaultTemplateData_, void 0, r))
}
,
goog.soy.renderAsFragment = function(e, t, o, r) {
    goog.asserts.assert(e, "Soy template may not be null.");
    r = r || goog.dom.getDomHelper(),
    o = goog.soy.ensureTemplateOutputHtml_(e(t || goog.soy.defaultTemplateData_, void 0, o));
    return goog.soy.assertFirstTagValid_(o),
    r.htmlToDocumentFragment(o)
}
,
goog.soy.renderAsElement = function(e, t, o, r) {
    return goog.asserts.assert(e, "Soy template may not be null."),
    goog.soy.convertToElement_(e(t || goog.soy.defaultTemplateData_, void 0, o), r)
}
,
goog.soy.convertToElement = function(e, t) {
    return goog.soy.convertToElement_(e, t)
}
,
goog.soy.convertToElement_ = function(e, t) {
    t = (t || goog.dom.getDomHelper()).createElement(goog.dom.TagName.DIV),
    e = goog.soy.ensureTemplateOutputHtml_(e);
    if (goog.soy.assertFirstTagValid_(e),
    t.innerHTML = e,
    1 == t.childNodes.length) {
        e = t.firstChild;
        if (e.nodeType == goog.dom.NodeType.ELEMENT)
            return e
    }
    return t
}
,
goog.soy.ensureTemplateOutputHtml_ = function(e) {
    if (!goog.soy.REQUIRE_STRICT_AUTOESCAPE && !goog.isObject(e))
        return String(e);
    if (e instanceof goog.soy.data.SanitizedContent) {
        var t = goog.soy.data.SanitizedContentKind;
        if (e.contentKind === t.HTML)
            return goog.asserts.assertString(e.getContent());
        if (e.contentKind === t.TEXT)
            return goog.string.htmlEscape(e.getContent())
    }
    return goog.asserts.fail("Soy template output is unsafe for use as HTML: " + e),
    "zSoyz"
}
,
goog.soy.assertFirstTagValid_ = function(e) {
    var t;
    goog.asserts.ENABLE_ASSERTS && (t = e.match(goog.soy.INVALID_TAG_TO_RENDER_),
    goog.asserts.assert(!t, "This template starts with a %s, which cannot be a child of a <div>, as required by soy internals. Consider using goog.soy.renderElement instead.\nTemplate output: %s", t && t[0], e))
}
,
goog.soy.INVALID_TAG_TO_RENDER_ = /^<(body|caption|col|colgroup|head|html|tr|td|th|tbody|thead|tfoot)>/i,
goog.soy.defaultTemplateData_ = {},
goog.provide("goog.structs.InversionMap"),
goog.require("goog.array"),
goog.structs.InversionMap = function(e, t, o) {
    if (this.rangeArray = null,
    e.length != t.length)
        return null;
    this.storeInversion_(e, o),
    this.values = t
}
,
goog.structs.InversionMap.prototype.storeInversion_ = function(e, t) {
    this.rangeArray = e;
    for (var o = 1; o < e.length; o++)
        null == e[o] ? e[o] = e[o - 1] + 1 : t && (e[o] += e[o - 1])
}
,
goog.structs.InversionMap.prototype.spliceInversion = function(e, t, o) {
    var r = new goog.structs.InversionMap(e,t,o)
      , e = r.rangeArray[0]
      , t = goog.array.peek(r.rangeArray)
      , o = this.getLeast(e)
      , t = this.getLeast(t);
    e != this.rangeArray[o] && o++;
    t = t - o + 1;
    goog.partial(goog.array.splice, this.rangeArray, o, t).apply(null, r.rangeArray),
    goog.partial(goog.array.splice, this.values, o, t).apply(null, r.values)
}
,
goog.structs.InversionMap.prototype.at = function(e) {
    e = this.getLeast(e);
    return e < 0 ? null : this.values[e]
}
,
goog.structs.InversionMap.prototype.getLeast = function(e) {
    for (var t = this.rangeArray, o = 0, r = t.length; 8 < r - o; ) {
        var i = r + o >> 1;
        t[i] <= e ? o = i : r = i
    }
    for (; o < r && !(e < t[o]); ++o)
        ;
    return o - 1
}
,
goog.provide("goog.i18n.GraphemeBreak"),
goog.require("goog.structs.InversionMap"),
goog.i18n.GraphemeBreak.property = {
    ANY: 0,
    CONTROL: 1,
    EXTEND: 2,
    PREPEND: 3,
    SPACING_MARK: 4,
    INDIC_CONSONANT: 5,
    VIRAMA: 6,
    L: 7,
    V: 8,
    T: 9,
    LV: 10,
    LVT: 11,
    CR: 12,
    LF: 13,
    REGIONAL_INDICATOR: 14
},
goog.i18n.GraphemeBreak.inversions_ = null,
goog.i18n.GraphemeBreak.applyLegacyBreakRules_ = function(e, t) {
    var o = goog.i18n.GraphemeBreak.property;
    return (e != o.CR || t != o.LF) && (e == o.CONTROL || e == o.CR || e == o.LF || (t == o.CONTROL || t == o.CR || t == o.LF || (e != o.L || t != o.L && t != o.V && t != o.LV && t != o.LVT) && ((e != o.LV && e != o.V || t != o.V && t != o.T) && ((e != o.LVT && e != o.T || t != o.T) && (t != o.EXTEND && t != o.VIRAMA && (e != o.VIRAMA || t != o.INDIC_CONSONANT))))))
}
,
goog.i18n.GraphemeBreak.getBreakProp_ = function(e) {
    if (44032 <= e && e <= 55203) {
        var t = goog.i18n.GraphemeBreak.property;
        return e % 28 == 16 ? t.LV : t.LVT
    }
    return goog.i18n.GraphemeBreak.inversions_ || (goog.i18n.GraphemeBreak.inversions_ = new goog.structs.InversionMap([0, 10, 1, 2, 1, 18, 95, 33, 13, 1, 594, 112, 275, 7, 263, 45, 1, 1, 1, 2, 1, 2, 1, 1, 56, 5, 11, 11, 48, 21, 16, 1, 101, 7, 1, 1, 6, 2, 2, 1, 4, 33, 1, 1, 1, 30, 27, 91, 11, 58, 9, 34, 4, 1, 9, 1, 3, 1, 5, 43, 3, 136, 31, 1, 17, 37, 1, 1, 1, 1, 3, 8, 4, 1, 2, 1, 7, 8, 2, 2, 21, 8, 1, 2, 17, 39, 1, 1, 1, 2, 6, 6, 1, 9, 5, 4, 2, 2, 12, 2, 15, 2, 1, 17, 39, 2, 3, 12, 4, 8, 6, 17, 2, 3, 14, 1, 17, 39, 1, 1, 3, 8, 4, 1, 20, 2, 29, 1, 2, 17, 39, 1, 1, 2, 1, 6, 6, 9, 6, 4, 2, 2, 13, 1, 16, 1, 18, 41, 1, 1, 1, 12, 1, 9, 1, 41, 3, 17, 37, 4, 3, 5, 7, 8, 3, 2, 8, 2, 30, 2, 17, 39, 1, 1, 1, 1, 2, 1, 3, 1, 5, 1, 8, 9, 1, 3, 2, 30, 2, 17, 38, 3, 1, 2, 5, 7, 1, 9, 1, 10, 2, 30, 2, 22, 48, 5, 1, 2, 6, 7, 19, 2, 13, 46, 2, 1, 1, 1, 6, 1, 12, 8, 50, 46, 2, 1, 1, 1, 9, 11, 6, 14, 2, 58, 2, 27, 1, 1, 1, 1, 1, 4, 2, 49, 14, 1, 4, 1, 1, 2, 5, 48, 9, 1, 57, 33, 12, 4, 1, 6, 1, 2, 2, 2, 1, 16, 2, 4, 2, 2, 4, 3, 1, 3, 2, 7, 3, 4, 13, 1, 1, 1, 2, 6, 1, 1, 14, 1, 98, 96, 72, 88, 349, 3, 931, 15, 2, 1, 14, 15, 2, 1, 14, 15, 2, 15, 15, 14, 35, 17, 2, 1, 7, 8, 1, 2, 9, 1, 1, 9, 1, 45, 3, 155, 1, 87, 31, 3, 4, 2, 9, 1, 6, 3, 20, 19, 29, 44, 9, 3, 2, 1, 69, 23, 2, 3, 4, 45, 6, 2, 1, 1, 1, 8, 1, 1, 1, 2, 8, 6, 13, 128, 4, 1, 14, 33, 1, 1, 5, 1, 1, 5, 1, 1, 1, 7, 31, 9, 12, 2, 1, 7, 23, 1, 4, 2, 2, 2, 2, 2, 11, 3, 2, 36, 2, 1, 1, 2, 3, 1, 1, 3, 2, 12, 36, 8, 8, 2, 2, 21, 3, 128, 3, 1, 13, 1, 7, 4, 1, 4, 2, 1, 203, 64, 523, 1, 2, 2, 24, 7, 49, 16, 96, 33, 3070, 3, 141, 1, 96, 32, 554, 6, 105, 2, 30164, 4, 1, 10, 33, 1, 80, 2, 272, 1, 3, 1, 4, 1, 23, 2, 2, 1, 24, 30, 4, 4, 3, 8, 1, 1, 13, 2, 16, 34, 16, 1, 27, 18, 24, 24, 4, 8, 2, 23, 11, 1, 1, 12, 32, 3, 1, 5, 3, 3, 36, 1, 2, 4, 2, 1, 3, 1, 69, 35, 6, 2, 2, 2, 2, 12, 1, 8, 1, 1, 18, 16, 1, 3, 6, 1, 5, 48, 1, 1, 3, 2, 2, 5, 2, 1, 1, 32, 9, 1, 2, 2, 5, 1, 1, 201, 14, 2, 1, 1, 9, 8, 2, 1, 2, 1, 2, 1, 1, 1, 18, 11184, 27, 49, 1028, 1024, 6942, 1, 737, 16, 16, 7, 216, 1, 158, 2, 89, 3, 513, 1, 2051, 15, 40, 7, 1, 1472, 1, 1, 1, 53, 14, 1, 57, 2, 1, 45, 3, 4, 2, 1, 1, 2, 1, 66, 3, 36, 5, 1, 6, 2, 75, 2, 1, 48, 3, 9, 1, 1, 1258, 1, 1, 1, 2, 6, 1, 1, 22681, 62, 4, 25042, 1, 1, 3, 3, 1, 5, 8, 8, 2, 7, 30, 4, 148, 3, 8097, 26, 790017, 255],[1, 13, 1, 12, 1, 0, 1, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 1, 0, 2, 0, 2, 0, 2, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 4, 0, 5, 2, 4, 2, 0, 4, 2, 4, 6, 4, 0, 2, 5, 0, 2, 0, 5, 2, 4, 0, 5, 2, 0, 2, 4, 2, 4, 6, 0, 2, 5, 0, 2, 0, 5, 0, 2, 4, 0, 5, 2, 4, 2, 6, 2, 5, 0, 2, 0, 2, 4, 0, 5, 2, 0, 4, 2, 4, 6, 0, 2, 0, 2, 4, 0, 5, 2, 0, 2, 4, 2, 4, 6, 2, 5, 0, 2, 0, 5, 0, 2, 0, 5, 2, 4, 2, 4, 6, 0, 2, 0, 4, 0, 5, 0, 2, 4, 2, 6, 2, 5, 0, 2, 0, 4, 0, 5, 2, 0, 4, 2, 4, 2, 4, 2, 4, 2, 6, 2, 5, 0, 2, 0, 4, 0, 5, 0, 2, 4, 2, 4, 6, 0, 2, 0, 2, 0, 4, 0, 5, 6, 2, 4, 2, 4, 2, 4, 0, 5, 0, 2, 0, 4, 2, 6, 0, 2, 0, 5, 0, 2, 0, 4, 2, 0, 2, 0, 5, 0, 2, 0, 2, 0, 2, 0, 2, 0, 4, 5, 2, 4, 2, 6, 0, 2, 0, 2, 0, 2, 0, 5, 0, 2, 4, 2, 0, 6, 4, 2, 5, 0, 5, 0, 4, 2, 5, 2, 5, 0, 5, 0, 5, 2, 5, 2, 0, 4, 2, 0, 2, 5, 0, 2, 0, 7, 8, 9, 0, 2, 0, 5, 2, 6, 0, 5, 2, 6, 0, 5, 2, 0, 5, 2, 5, 0, 2, 4, 2, 4, 2, 4, 2, 6, 2, 0, 2, 0, 2, 0, 2, 0, 5, 2, 4, 2, 4, 2, 4, 2, 0, 5, 0, 5, 0, 4, 0, 4, 0, 5, 2, 4, 0, 5, 0, 5, 4, 2, 4, 2, 6, 0, 2, 0, 2, 4, 2, 0, 2, 4, 0, 5, 2, 4, 2, 4, 2, 4, 2, 4, 6, 5, 0, 2, 0, 2, 4, 0, 5, 4, 2, 4, 2, 6, 4, 5, 0, 5, 0, 5, 0, 2, 4, 2, 4, 2, 4, 2, 6, 0, 5, 4, 2, 4, 2, 0, 5, 0, 2, 0, 2, 4, 2, 0, 2, 0, 4, 2, 0, 2, 0, 1, 2, 1, 0, 1, 0, 1, 0, 2, 0, 2, 0, 6, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 6, 5, 2, 5, 4, 2, 4, 0, 5, 0, 5, 0, 5, 0, 5, 0, 4, 0, 5, 4, 6, 0, 2, 0, 5, 0, 2, 0, 5, 2, 4, 6, 0, 7, 2, 4, 0, 5, 0, 5, 2, 4, 2, 4, 2, 4, 6, 0, 5, 2, 4, 2, 4, 2, 0, 2, 0, 2, 4, 0, 5, 0, 5, 0, 5, 0, 5, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 5, 4, 2, 4, 0, 4, 6, 0, 5, 0, 5, 0, 5, 0, 4, 2, 4, 2, 4, 0, 4, 6, 0, 11, 8, 9, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 2, 0, 2, 6, 0, 4, 2, 4, 0, 2, 6, 0, 2, 4, 0, 4, 2, 4, 6, 2, 0, 1, 0, 2, 0, 2, 4, 2, 6, 0, 2, 4, 0, 4, 2, 4, 6, 0, 2, 4, 2, 4, 2, 6, 2, 0, 4, 2, 0, 2, 4, 2, 0, 4, 2, 1, 2, 0, 2, 0, 2, 0, 2, 0, 14, 0, 1, 2],!0)),
    goog.i18n.GraphemeBreak.inversions_.at(e)
}
,
goog.i18n.GraphemeBreak.hasGraphemeBreak = function(e, t, o) {
    var r = goog.i18n.GraphemeBreak.getBreakProp_(e)
      , e = goog.i18n.GraphemeBreak.getBreakProp_(t)
      , t = goog.i18n.GraphemeBreak.property;
    return goog.i18n.GraphemeBreak.applyLegacyBreakRules_(r, e) && !(o && (r == t.PREPEND || e == t.SPACING_MARK))
}
,
goog.provide("goog.format"),
goog.require("goog.i18n.GraphemeBreak"),
goog.require("goog.string"),
goog.require("goog.userAgent"),
goog.format.fileSize = function(e, t) {
    return goog.format.numBytesToString(e, t, !1)
}
,
goog.format.isConvertableScaledNumber = function(e) {
    return goog.format.SCALED_NUMERIC_RE_.test(e)
}
,
goog.format.stringToNumericValue = function(e) {
    return goog.string.endsWith(e, "B") ? goog.format.stringToNumericValue_(e, goog.format.NUMERIC_SCALES_BINARY_) : goog.format.stringToNumericValue_(e, goog.format.NUMERIC_SCALES_SI_)
}
,
goog.format.stringToNumBytes = function(e) {
    return goog.format.stringToNumericValue_(e, goog.format.NUMERIC_SCALES_BINARY_)
}
,
goog.format.numericValueToString = function(e, t) {
    return goog.format.numericValueToString_(e, goog.format.NUMERIC_SCALES_SI_, t)
}
,
goog.format.numBytesToString = function(e, t, o, r) {
    var i = "";
    return goog.isDef(o) && !o || (i = "B"),
    goog.format.numericValueToString_(e, goog.format.NUMERIC_SCALES_BINARY_, t, i, r)
}
,
goog.format.stringToNumericValue_ = function(e, t) {
    e = e.match(goog.format.SCALED_NUMERIC_RE_);
    return e ? e[1] * t[e[2]] : NaN
}
,
goog.format.numericValueToString_ = function(e, t, o, r, i) {
    var s = goog.format.NUMERIC_SCALE_PREFIXES_
      , a = e
      , g = ""
      , n = ""
      , l = 1;
    e < 0 && (e = -e);
    for (var u = 0; u < s.length; u++) {
        var c = s[u];
        if ((l = t[c]) <= e || l <= 1 && .1 * l < e) {
            g = c;
            break
        }
    }
    g ? (r && (g += r),
    i && (n = " ")) : l = 1;
    o = Math.pow(10, goog.isDef(o) ? o : 2);
    return Math.round(a / l * o) / o + n + g
}
,
goog.format.SCALED_NUMERIC_RE_ = /^([-]?\d+\.?\d*)([K,M,G,T,P,k,m,u,n]?)[B]?$/,
goog.format.NUMERIC_SCALE_PREFIXES_ = ["P", "T", "G", "M", "K", "", "m", "u", "n"],
goog.format.NUMERIC_SCALES_SI_ = {
    "": 1,
    n: 1e-9,
    u: 1e-6,
    m: .001,
    k: 1e3,
    K: 1e3,
    M: 1e6,
    G: 1e9,
    T: 1e12,
    P: 1e15
},
goog.format.NUMERIC_SCALES_BINARY_ = {
    "": 1,
    n: Math.pow(1024, -3),
    u: Math.pow(1024, -2),
    m: 1 / 1024,
    k: 1024,
    K: 1024,
    M: Math.pow(1024, 2),
    G: Math.pow(1024, 3),
    T: Math.pow(1024, 4),
    P: Math.pow(1024, 5)
},
goog.format.FIRST_GRAPHEME_EXTEND_ = 768,
goog.format.isTreatedAsBreakingSpace_ = function(e) {
    return e <= goog.format.WbrToken_.SPACE || 4096 <= e && (8192 <= e && e <= 8198 || 8200 <= e && e <= 8203 || 5760 == e || 6158 == e || 8232 == e || 8233 == e || 8287 == e || 12288 == e)
}
,
goog.format.isInvisibleFormattingCharacter_ = function(e) {
    return 8204 <= e && e <= 8207 || 8234 <= e && e <= 8238
}
,
goog.format.insertWordBreaksGeneric_ = function(e, t, o) {
    var r = o || 10;
    if (r > e.length)
        return e;
    for (var i = [], s = 0, a = 0, g = 0, n = 0, l = 0; l < e.length; l++) {
        var u = n
          , u = (n = e.charCodeAt(l)) >= goog.format.FIRST_GRAPHEME_EXTEND_ && !t(u, n, !0);
        r <= s && !goog.format.isTreatedAsBreakingSpace_(n) && !u && (i.push(e.substring(g, l), goog.format.WORD_BREAK_HTML),
        g = l,
        s = 0),
        a ? n == goog.format.WbrToken_.GT && a == goog.format.WbrToken_.LT ? a = 0 : n == goog.format.WbrToken_.SEMI_COLON && a == goog.format.WbrToken_.AMP && (a = 0,
        s++) : n == goog.format.WbrToken_.LT || n == goog.format.WbrToken_.AMP ? a = n : goog.format.isTreatedAsBreakingSpace_(n) ? s = 0 : goog.format.isInvisibleFormattingCharacter_(n) || s++
    }
    return i.push(e.substr(g)),
    i.join("")
}
,
goog.format.insertWordBreaks = function(e, t) {
    return goog.format.insertWordBreaksGeneric_(e, goog.i18n.GraphemeBreak.hasGraphemeBreak, t)
}
,
goog.format.conservativelyHasGraphemeBreak_ = function(e, t, o) {
    return 1024 <= t && t < 1315
}
,
goog.format.insertWordBreaksBasic = function(e, t) {
    return goog.format.insertWordBreaksGeneric_(e, goog.format.conservativelyHasGraphemeBreak_, t)
}
,
goog.format.IS_IE8_OR_ABOVE_ = goog.userAgent.IE && goog.userAgent.isVersionOrHigher(8),
goog.format.WORD_BREAK_HTML = goog.userAgent.WEBKIT ? "<wbr></wbr>" : goog.userAgent.OPERA ? "&shy;" : goog.format.IS_IE8_OR_ABOVE_ ? "&#8203;" : "<wbr>",
goog.format.WbrToken_ = {
    LT: 60,
    GT: 62,
    AMP: 38,
    SEMI_COLON: 59,
    SPACE: 32
},
goog.provide("goog.html.legacyconversions"),
goog.require("goog.html.SafeHtml"),
goog.require("goog.html.SafeStyle"),
goog.require("goog.html.SafeUrl"),
goog.require("goog.html.TrustedResourceUrl"),
goog.define("goog.html.legacyconversions.ALLOW_LEGACY_CONVERSIONS", !0),
goog.html.legacyconversions.safeHtmlFromString = function(e) {
    return goog.html.legacyconversions.throwIfConversionsDisallowed(),
    goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(e, null)
}
,
goog.html.legacyconversions.safeStyleFromString = function(e) {
    return goog.html.legacyconversions.throwIfConversionsDisallowed(),
    goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(e)
}
,
goog.html.legacyconversions.trustedResourceUrlFromString = function(e) {
    return goog.html.legacyconversions.throwIfConversionsDisallowed(),
    goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(e)
}
,
goog.html.legacyconversions.safeUrlFromString = function(e) {
    return goog.html.legacyconversions.throwIfConversionsDisallowed(),
    goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(e)
}
,
goog.html.legacyconversions.reportCallback_ = goog.nullFunction,
goog.html.legacyconversions.setReportCallback = function(e) {
    goog.html.legacyconversions.reportCallback_ = e
}
,
goog.html.legacyconversions.throwIfConversionsDisallowed = function() {
    if (!goog.html.legacyconversions.ALLOW_LEGACY_CONVERSIONS)
        throw Error("Error: Legacy conversion from string to goog.html types is disabled");
    goog.html.legacyconversions.reportCallback_()
}
,
goog.provide("goog.i18n.BidiFormatter"),
goog.require("goog.html.SafeHtml"),
goog.require("goog.html.legacyconversions"),
goog.require("goog.i18n.bidi"),
goog.require("goog.i18n.bidi.Dir"),
goog.require("goog.i18n.bidi.Format"),
goog.i18n.BidiFormatter = function(e, t) {
    this.contextDir_ = goog.i18n.bidi.toDir(e, !0),
    this.alwaysSpan_ = !!t
}
,
goog.i18n.BidiFormatter.prototype.getContextDir = function() {
    return this.contextDir_
}
,
goog.i18n.BidiFormatter.prototype.getAlwaysSpan = function() {
    return this.alwaysSpan_
}
,
goog.i18n.BidiFormatter.prototype.setContextDir = function(e) {
    this.contextDir_ = goog.i18n.bidi.toDir(e, !0)
}
,
goog.i18n.BidiFormatter.prototype.setAlwaysSpan = function(e) {
    this.alwaysSpan_ = e
}
,
goog.i18n.BidiFormatter.prototype.estimateDirection = goog.i18n.bidi.estimateDirection,
goog.i18n.BidiFormatter.prototype.areDirectionalitiesOpposite_ = function(e, t) {
    return e * t < 0
}
,
goog.i18n.BidiFormatter.prototype.dirResetIfNeeded_ = function(e, t, o, r) {
    return r && (this.areDirectionalitiesOpposite_(t, this.contextDir_) || this.contextDir_ == goog.i18n.bidi.Dir.LTR && goog.i18n.bidi.endsWithRtl(e, o) || this.contextDir_ == goog.i18n.bidi.Dir.RTL && goog.i18n.bidi.endsWithLtr(e, o)) ? this.contextDir_ == goog.i18n.bidi.Dir.LTR ? goog.i18n.bidi.Format.LRM : goog.i18n.bidi.Format.RLM : ""
}
,
goog.i18n.BidiFormatter.prototype.dirAttrValue = function(e, t) {
    return this.knownDirAttrValue(this.estimateDirection(e, t))
}
,
goog.i18n.BidiFormatter.prototype.knownDirAttrValue = function(e) {
    return (e == goog.i18n.bidi.Dir.NEUTRAL ? this.contextDir_ : e) == goog.i18n.bidi.Dir.RTL ? "rtl" : "ltr"
}
,
goog.i18n.BidiFormatter.prototype.dirAttr = function(e, t) {
    return this.knownDirAttr(this.estimateDirection(e, t))
}
,
goog.i18n.BidiFormatter.prototype.knownDirAttr = function(e) {
    return e != this.contextDir_ ? e == goog.i18n.bidi.Dir.RTL ? 'dir="rtl"' : e == goog.i18n.bidi.Dir.LTR ? 'dir="ltr"' : "" : ""
}
,
goog.i18n.BidiFormatter.prototype.spanWrapSafeHtml = function(e, t) {
    return this.spanWrapSafeHtmlWithKnownDir(null, e, t)
}
,
goog.i18n.BidiFormatter.prototype.spanWrap = function(e, t, o) {
    return this.spanWrapWithKnownDir(null, e, t, o)
}
,
goog.i18n.BidiFormatter.prototype.spanWrapSafeHtmlWithKnownDir = function(e, t, o) {
    return null == e && (e = this.estimateDirection(goog.html.SafeHtml.unwrap(t), !0)),
    this.spanWrapWithKnownDir_(e, t, o)
}
,
goog.i18n.BidiFormatter.prototype.spanWrapWithKnownDir = function(e, t, o, r) {
    t = o ? goog.html.legacyconversions.safeHtmlFromString(t) : goog.html.SafeHtml.htmlEscape(t);
    return goog.html.SafeHtml.unwrap(this.spanWrapSafeHtmlWithKnownDir(e, t, r))
}
,
goog.i18n.BidiFormatter.prototype.spanWrapWithKnownDir_ = function(e, t, o) {
    o = o || null == o;
    var r = e != goog.i18n.bidi.Dir.NEUTRAL && e != this.contextDir_
      , i = this.alwaysSpan_ || r ? (r && (i = e == goog.i18n.bidi.Dir.RTL ? "rtl" : "ltr"),
    goog.html.SafeHtml.create("span", {
        dir: i
    }, t)) : t
      , t = goog.html.SafeHtml.unwrap(t);
    return i = goog.html.SafeHtml.concatWithDir(goog.i18n.bidi.Dir.NEUTRAL, i, this.dirResetIfNeeded_(t, e, !0, o))
}
,
goog.i18n.BidiFormatter.prototype.unicodeWrap = function(e, t, o) {
    return this.unicodeWrapWithKnownDir(null, e, t, o)
}
,
goog.i18n.BidiFormatter.prototype.unicodeWrapWithKnownDir = function(e, t, o, r) {
    return null == e && (e = this.estimateDirection(t, o)),
    this.unicodeWrapWithKnownDir_(e, t, o, r)
}
,
goog.i18n.BidiFormatter.prototype.unicodeWrapWithKnownDir_ = function(e, t, o, r) {
    r = r || null == r;
    var i = [];
    return e != goog.i18n.bidi.Dir.NEUTRAL && e != this.contextDir_ ? (i.push(e == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.Format.RLE : goog.i18n.bidi.Format.LRE),
    i.push(t),
    i.push(goog.i18n.bidi.Format.PDF)) : i.push(t),
    i.push(this.dirResetIfNeeded_(t, e, o, r)),
    i.join("")
}
,
goog.i18n.BidiFormatter.prototype.markAfter = function(e, t) {
    return this.markAfterKnownDir(null, e, t)
}
,
goog.i18n.BidiFormatter.prototype.markAfterKnownDir = function(e, t, o) {
    return null == e && (e = this.estimateDirection(t, o)),
    this.dirResetIfNeeded_(t, e, o, !0)
}
,
goog.i18n.BidiFormatter.prototype.mark = function() {
    switch (this.contextDir_) {
    case goog.i18n.bidi.Dir.LTR:
        return goog.i18n.bidi.Format.LRM;
    case goog.i18n.bidi.Dir.RTL:
        return goog.i18n.bidi.Format.RLM;
    default:
        return ""
    }
}
,
goog.i18n.BidiFormatter.prototype.startEdge = function() {
    return this.contextDir_ == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT
}
,
goog.i18n.BidiFormatter.prototype.endEdge = function() {
    return this.contextDir_ == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.LEFT : goog.i18n.bidi.RIGHT
}
,
goog.provide("soy"),
goog.provide("soy.StringBuilder"),
goog.provide("soy.esc"),
goog.provide("soydata"),
goog.provide("soydata.SanitizedHtml"),
goog.provide("soydata.SanitizedHtmlAttribute"),
goog.provide("soydata.SanitizedJs"),
goog.provide("soydata.SanitizedJsStrChars"),
goog.provide("soydata.SanitizedUri"),
goog.provide("soydata.VERY_UNSAFE"),
goog.require("goog.asserts"),
goog.require("goog.dom.DomHelper"),
goog.require("goog.format"),
goog.require("goog.i18n.BidiFormatter"),
goog.require("goog.i18n.bidi"),
goog.require("goog.soy"),
goog.require("goog.soy.data.SanitizedContentKind"),
goog.require("goog.string"),
goog.require("goog.string.StringBuffer"),
soy.StringBuilder = goog.string.StringBuffer,
soydata.SanitizedContentKind = goog.soy.data.SanitizedContentKind,
soydata.SanitizedHtml = function() {
    goog.soy.data.SanitizedContent.call(this)
}
,
goog.inherits(soydata.SanitizedHtml, goog.soy.data.SanitizedContent),
soydata.SanitizedHtml.prototype.contentKind = soydata.SanitizedContentKind.HTML,
soydata.SanitizedJs = function() {
    goog.soy.data.SanitizedContent.call(this)
}
,
goog.inherits(soydata.SanitizedJs, goog.soy.data.SanitizedContent),
soydata.SanitizedJs.prototype.contentKind = soydata.SanitizedContentKind.JS,
soydata.SanitizedJsStrChars = function() {
    goog.soy.data.SanitizedContent.call(this)
}
,
goog.inherits(soydata.SanitizedJsStrChars, goog.soy.data.SanitizedContent),
soydata.SanitizedJsStrChars.prototype.contentKind = soydata.SanitizedContentKind.JS_STR_CHARS,
soydata.SanitizedUri = function() {
    goog.soy.data.SanitizedContent.call(this)
}
,
goog.inherits(soydata.SanitizedUri, goog.soy.data.SanitizedContent),
soydata.SanitizedUri.prototype.contentKind = soydata.SanitizedContentKind.URI,
soydata.SanitizedHtmlAttribute = function() {
    goog.soy.data.SanitizedContent.call(this)
}
,
goog.inherits(soydata.SanitizedHtmlAttribute, goog.soy.data.SanitizedContent),
soydata.SanitizedHtmlAttribute.prototype.contentKind = soydata.SanitizedContentKind.ATTRIBUTES,
soydata.SanitizedCss = function() {
    goog.soy.data.SanitizedContent.call(this)
}
,
goog.inherits(soydata.SanitizedCss, goog.soy.data.SanitizedContent),
soydata.SanitizedCss.prototype.contentKind = soydata.SanitizedContentKind.CSS,
soydata.UnsanitizedText = function(e) {
    this.content = String(e)
}
,
goog.inherits(soydata.UnsanitizedText, goog.soy.data.SanitizedContent),
soydata.UnsanitizedText.prototype.contentKind = soydata.SanitizedContentKind.TEXT,
soydata.$$makeSanitizedContentFactory_ = function(e) {
    function o() {}
    return o.prototype = e.prototype,
    function(e) {
        var t = new o;
        return t.content = String(e),
        t
    }
}
,
soydata.markUnsanitizedText = function(e) {
    return new soydata.UnsanitizedText(e)
}
,
soydata.VERY_UNSAFE.ordainSanitizedHtml = soydata.$$makeSanitizedContentFactory_(soydata.SanitizedHtml),
soydata.VERY_UNSAFE.ordainSanitizedJs = soydata.$$makeSanitizedContentFactory_(soydata.SanitizedJs),
soydata.VERY_UNSAFE.ordainSanitizedJsStrChars = soydata.$$makeSanitizedContentFactory_(soydata.SanitizedJsStrChars),
soydata.VERY_UNSAFE.ordainSanitizedUri = soydata.$$makeSanitizedContentFactory_(soydata.SanitizedUri),
soydata.VERY_UNSAFE.ordainSanitizedHtmlAttribute = soydata.$$makeSanitizedContentFactory_(soydata.SanitizedHtmlAttribute),
soydata.VERY_UNSAFE.ordainSanitizedCss = soydata.$$makeSanitizedContentFactory_(soydata.SanitizedCss),
soy.renderElement = goog.soy.renderElement,
soy.renderAsFragment = function(e, t, o, r) {
    return goog.soy.renderAsFragment(e, t, r, new goog.dom.DomHelper(o))
}
,
soy.renderAsElement = function(e, t, o, r) {
    return goog.soy.renderAsElement(e, t, r, new goog.dom.DomHelper(o))
}
,
soy.$$augmentMap = function(e, t) {
    function o() {}
    o.prototype = e;
    var r, i = new o;
    for (r in t)
        i[r] = t[r];
    return i
}
,
soy.$$checkMapKey = function(e) {
    if ("string" != typeof e)
        throw Error("Map literal's key expression must evaluate to string (encountered type \"" + typeof e + '").');
    return e
}
,
soy.$$getMapKeys = function(e) {
    var t, o = [];
    for (t in e)
        o.push(t);
    return o
}
,
soy.$$getDelTemplateId = function(e) {
    return e
}
,
soy.$$DELEGATE_REGISTRY_PRIORITIES_ = {},
soy.$$DELEGATE_REGISTRY_FUNCTIONS_ = {},
soy.$$registerDelegateFn = function(e, t, o, r) {
    var i = "key_" + e + ":" + t
      , s = soy.$$DELEGATE_REGISTRY_PRIORITIES_[i];
    if (void 0 === s || s < o)
        soy.$$DELEGATE_REGISTRY_PRIORITIES_[i] = o,
        soy.$$DELEGATE_REGISTRY_FUNCTIONS_[i] = r;
    else if (o == s)
        throw Error('Encountered two active delegates with the same priority ("' + e + ":" + t + '").')
}
,
soy.$$getDelegateFn = function(e, t, o) {
    var r = soy.$$DELEGATE_REGISTRY_FUNCTIONS_["key_" + e + ":" + t];
    if (r = !r && "" != t ? soy.$$DELEGATE_REGISTRY_FUNCTIONS_["key_" + e + ":"] : r)
        return r;
    if (o)
        return soy.$$EMPTY_TEMPLATE_FN_;
    throw Error('Found no active impl for delegate call to "' + e + ":" + t + '" (and not allowemptydefault="true").')
}
,
soy.$$EMPTY_TEMPLATE_FN_ = function(e, t, o) {
    return ""
}
,
soy.$$escapeHtml = function(e) {
    return e && e.contentKind && e.contentKind === goog.soy.data.SanitizedContentKind.HTML ? (goog.asserts.assert(e.constructor === soydata.SanitizedHtml),
    e.content) : soy.esc.$$escapeHtmlHelper(e)
}
,
soy.$$cleanHtml = function(e) {
    return e && e.contentKind && e.contentKind === goog.soy.data.SanitizedContentKind.HTML ? (goog.asserts.assert(e.constructor === soydata.SanitizedHtml),
    e.content) : soy.$$stripHtmlTags(e, soy.esc.$$SAFE_TAG_WHITELIST_)
}
,
soy.$$escapeHtmlRcdata = function(e) {
    return e && e.contentKind && e.contentKind === goog.soy.data.SanitizedContentKind.HTML ? (goog.asserts.assert(e.constructor === soydata.SanitizedHtml),
    soy.esc.$$normalizeHtmlHelper(e.content)) : soy.esc.$$escapeHtmlHelper(e)
}
,
soy.$$HTML5_VOID_ELEMENTS_ = new RegExp("^<(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)\\b"),
soy.$$stripHtmlTags = function(e, r) {
    if (!r)
        return String(e).replace(soy.esc.$$HTML_TAG_REGEX_, "").replace(soy.esc.$$LT_REGEX_, "&lt;");
    var t = String(e).replace(/\[/g, "&#91;")
      , i = []
      , t = t.replace(soy.esc.$$HTML_TAG_REGEX_, function(e, t) {
        if (t && (t = t.toLowerCase(),
        r.hasOwnProperty(t) && r[t])) {
            var o = "/" === e.charAt(1) ? "</" : "<"
              , e = i.length;
            return i[e] = o + t + ">",
            "[" + e + "]"
        }
        return ""
    });
    t = soy.esc.$$normalizeHtmlHelper(t);
    e = soy.$$balanceTags_(i);
    return (t = t.replace(/\[(\d+)\]/g, function(e, t) {
        return i[t]
    })) + e
}
,
soy.$$balanceTags_ = function(e) {
    for (var t = [], o = 0, r = e.length; o < r; ++o) {
        var i = e[o];
        if ("/" === i.charAt(1)) {
            for (var s = t.length - 1; 0 <= s && t[s] != i; )
                s--;
            s < 0 ? e[o] = "" : (e[o] = t.slice(s).reverse().join(""),
            t.length = s)
        } else
            soy.$$HTML5_VOID_ELEMENTS_.test(i) || t.push("</" + i.substring(1))
    }
    return t.reverse().join("")
}
,
soy.$$escapeHtmlAttribute = function(e) {
    return e && e.contentKind && e.contentKind === goog.soy.data.SanitizedContentKind.HTML ? (goog.asserts.assert(e.constructor === soydata.SanitizedHtml),
    soy.esc.$$normalizeHtmlHelper(soy.$$stripHtmlTags(e.content))) : soy.esc.$$escapeHtmlHelper(e)
}
,
soy.$$escapeHtmlAttributeNospace = function(e) {
    return e && e.contentKind && e.contentKind === goog.soy.data.SanitizedContentKind.HTML ? (goog.asserts.assert(e.constructor === soydata.SanitizedHtml),
    soy.esc.$$normalizeHtmlNospaceHelper(soy.$$stripHtmlTags(e.content))) : soy.esc.$$escapeHtmlNospaceHelper(e)
}
,
soy.$$filterHtmlAttributes = function(e) {
    return e && e.contentKind === goog.soy.data.SanitizedContentKind.ATTRIBUTES ? (goog.asserts.assert(e.constructor === soydata.SanitizedHtmlAttribute),
    e.content.replace(/([^"'\s])$/, "$1 ")) : soy.esc.$$filterHtmlAttributesHelper(e)
}
,
soy.$$filterHtmlElementName = function(e) {
    return soy.esc.$$filterHtmlElementNameHelper(e)
}
,
soy.$$escapeJs = function(e) {
    return soy.$$escapeJsString(e)
}
,
soy.$$escapeJsString = function(e) {
    return e && e.contentKind === goog.soy.data.SanitizedContentKind.JS_STR_CHARS ? (goog.asserts.assert(e.constructor === soydata.SanitizedJsStrChars),
    e.content) : soy.esc.$$escapeJsStringHelper(e)
}
,
soy.$$escapeJsValue = function(e) {
    if (null == e)
        return " null ";
    if (e.contentKind == goog.soy.data.SanitizedContentKind.JS)
        return goog.asserts.assert(e.constructor === soydata.SanitizedJs),
        e.content;
    switch (typeof e) {
    case "boolean":
    case "number":
        return " " + e + " ";
    default:
        return "'" + soy.esc.$$escapeJsStringHelper(String(e)) + "'"
    }
}
,
soy.$$escapeJsRegex = function(e) {
    return soy.esc.$$escapeJsRegexHelper(e)
}
,
soy.$$problematicUriMarks_ = /['()]/g;
soy.$$pctEncode_ = function(e) {
    return "%" + e.charCodeAt(0).toString(16)
}
,
soy.$$escapeUri = function(e) {
    if (e && e.contentKind === goog.soy.data.SanitizedContentKind.URI)
        return goog.asserts.assert(e.constructor === soydata.SanitizedUri),
        soy.$$normalizeUri(e);
    e = soy.esc.$$escapeUriHelper(e);
    return soy.$$problematicUriMarks_.lastIndex = 0,
    soy.$$problematicUriMarks_.test(e) ? e.replace(soy.$$problematicUriMarks_, soy.$$pctEncode_) : e
}
,
soy.$$normalizeUri = function(e) {
    return soy.esc.$$normalizeUriHelper(e)
}
,
soy.$$filterNormalizeUri = function(e) {
    return e && e.contentKind == goog.soy.data.SanitizedContentKind.URI ? (goog.asserts.assert(e.constructor === soydata.SanitizedUri),
    soy.$$normalizeUri(e)) : soy.esc.$$filterNormalizeUriHelper(e)
}
,
soy.$$escapeCssString = function(e) {
    return soy.esc.$$escapeCssStringHelper(e)
}
,
soy.$$filterCssValue = function(e) {
    return e && e.contentKind === goog.soy.data.SanitizedContentKind.CSS ? (goog.asserts.assert(e.constructor === soydata.SanitizedCss),
    e.content) : null == e ? "" : soy.esc.$$filterCssValueHelper(e)
}
,
soy.$$filterNoAutoescape = function(e) {
    return e && e.contentKind === goog.soy.data.SanitizedContentKind.TEXT ? (goog.asserts.fail("Tainted SanitizedContentKind.TEXT for |noAutoescape: `%s`", [e.content]),
    "zSoyz") : String(e)
}
,
soy.$$changeNewlineToBr = function(e) {
    return goog.string.newLineToBr(String(e), !1)
}
,
soy.$$insertWordBreaks = function(e, t) {
    return goog.format.insertWordBreaks(String(e), t)
}
,
soy.$$truncate = function(e, t, o) {
    return (e = String(e)).length <= t || (o && (3 < t ? t -= 3 : o = !1),
    soy.$$isHighSurrogate_(e.charAt(t - 1)) && soy.$$isLowSurrogate_(e.charAt(t)) && --t,
    e = e.substring(0, t),
    o && (e += "...")),
    e
}
,
soy.$$isHighSurrogate_ = function(e) {
    return 55296 <= e && e <= 56319
}
,
soy.$$isLowSurrogate_ = function(e) {
    return 56320 <= e && e <= 57343
}
,
soy.$$bidiFormatterCache_ = {},
soy.$$getBidiFormatterInstance_ = function(e) {
    return soy.$$bidiFormatterCache_[e] || (soy.$$bidiFormatterCache_[e] = new goog.i18n.BidiFormatter(e))
}
,
soy.$$bidiTextDir = function(e, t) {
    return e ? goog.i18n.bidi.detectRtlDirectionality(e, t) ? -1 : 1 : 0
}
,
soy.$$bidiDirAttr = function(e, t, o) {
    return soydata.VERY_UNSAFE.ordainSanitizedHtmlAttribute(soy.$$getBidiFormatterInstance_(e).dirAttr(t, o))
}
,
soy.$$bidiMarkAfter = function(e, t, o) {
    return soy.$$getBidiFormatterInstance_(e).markAfter(t, o)
}
,
soy.$$bidiSpanWrap = function(e, t) {
    return soy.$$getBidiFormatterInstance_(e).spanWrap(t + "", !0)
}
,
soy.$$bidiUnicodeWrap = function(e, t) {
    return soy.$$getBidiFormatterInstance_(e).unicodeWrap(t + "", !0)
}
,
soy.esc.$$escapeUriHelper = function(e) {
    return goog.string.urlEncode(String(e))
}
,
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_ = {
    "\0": "&#0;",
    '"': "&quot;",
    "&": "&amp;",
    "'": "&#39;",
    "<": "&lt;",
    ">": "&gt;",
    "\t": "&#9;",
    "\n": "&#10;",
    "\v": "&#11;",
    "\f": "&#12;",
    "\r": "&#13;",
    " ": "&#32;",
    "-": "&#45;",
    "/": "&#47;",
    "=": "&#61;",
    "`": "&#96;",
    "": "&#133;",
    " ": "&#160;",
    "\u2028": "&#8232;",
    "\u2029": "&#8233;"
},
soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_ = function(e) {
    return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_[e]
}
,
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_ = {
    "\0": "\\x00",
    "\b": "\\x08",
    "\t": "\\t",
    "\n": "\\n",
    "\v": "\\x0b",
    "\f": "\\f",
    "\r": "\\r",
    '"': "\\x22",
    "&": "\\x26",
    "'": "\\x27",
    "/": "\\/",
    "<": "\\x3c",
    "=": "\\x3d",
    ">": "\\x3e",
    "\\": "\\\\",
    "": "\\x85",
    "\u2028": "\\u2028",
    "\u2029": "\\u2029",
    $: "\\x24",
    "(": "\\x28",
    ")": "\\x29",
    "*": "\\x2a",
    "+": "\\x2b",
    ",": "\\x2c",
    "-": "\\x2d",
    ".": "\\x2e",
    ":": "\\x3a",
    "?": "\\x3f",
    "[": "\\x5b",
    "]": "\\x5d",
    "^": "\\x5e",
    "{": "\\x7b",
    "|": "\\x7c",
    "}": "\\x7d"
},
soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_ = function(e) {
    return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_[e]
}
,
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_CSS_STRING_ = {
    "\0": "\\0 ",
    "\b": "\\8 ",
    "\t": "\\9 ",
    "\n": "\\a ",
    "\v": "\\b ",
    "\f": "\\c ",
    "\r": "\\d ",
    '"': "\\22 ",
    "&": "\\26 ",
    "'": "\\27 ",
    "(": "\\28 ",
    ")": "\\29 ",
    "*": "\\2a ",
    "/": "\\2f ",
    ":": "\\3a ",
    ";": "\\3b ",
    "<": "\\3c ",
    "=": "\\3d ",
    ">": "\\3e ",
    "@": "\\40 ",
    "\\": "\\5c ",
    "{": "\\7b ",
    "}": "\\7d ",
    "": "\\85 ",
    " ": "\\a0 ",
    "\u2028": "\\2028 ",
    "\u2029": "\\2029 "
},
soy.esc.$$REPLACER_FOR_ESCAPE_CSS_STRING_ = function(e) {
    return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_CSS_STRING_[e]
}
,
soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_ = {
    "\0": "%00",
    "": "%01",
    "": "%02",
    "": "%03",
    "": "%04",
    "": "%05",
    "": "%06",
    "": "%07",
    "\b": "%08",
    "\t": "%09",
    "\n": "%0A",
    "\v": "%0B",
    "\f": "%0C",
    "\r": "%0D",
    "": "%0E",
    "": "%0F",
    "": "%10",
    "": "%11",
    "": "%12",
    "": "%13",
    "": "%14",
    "": "%15",
    "": "%16",
    "": "%17",
    "": "%18",
    "": "%19",
    "": "%1A",
    "": "%1B",
    "": "%1C",
    "": "%1D",
    "": "%1E",
    "": "%1F",
    " ": "%20",
    '"': "%22",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "<": "%3C",
    ">": "%3E",
    "\\": "%5C",
    "{": "%7B",
    "}": "%7D",
    "": "%7F",
    "": "%C2%85",
    " ": "%C2%A0",
    "\u2028": "%E2%80%A8",
    "\u2029": "%E2%80%A9",
    "！": "%EF%BC%81",
    "＃": "%EF%BC%83",
    "＄": "%EF%BC%84",
    "＆": "%EF%BC%86",
    "＇": "%EF%BC%87",
    "（": "%EF%BC%88",
    "）": "%EF%BC%89",
    "＊": "%EF%BC%8A",
    "＋": "%EF%BC%8B",
    "，": "%EF%BC%8C",
    "／": "%EF%BC%8F",
    "：": "%EF%BC%9A",
    "；": "%EF%BC%9B",
    "＝": "%EF%BC%9D",
    "？": "%EF%BC%9F",
    "＠": "%EF%BC%A0",
    "［": "%EF%BC%BB",
    "］": "%EF%BC%BD"
},
soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_ = function(e) {
    return soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_[e]
}
,
soy.esc.$$MATCHER_FOR_ESCAPE_HTML_ = /[\x00\x22\x26\x27\x3c\x3e]/g,
soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_ = /[\x00\x22\x27\x3c\x3e]/g,
soy.esc.$$MATCHER_FOR_ESCAPE_HTML_NOSPACE_ = /[\x00\x09-\x0d \x22\x26\x27\x2d\/\x3c-\x3e`\x85\xa0\u2028\u2029]/g,
soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_NOSPACE_ = /[\x00\x09-\x0d \x22\x27\x2d\/\x3c-\x3e`\x85\xa0\u2028\u2029]/g,
soy.esc.$$MATCHER_FOR_ESCAPE_JS_STRING_ = /[\x00\x08-\x0d\x22\x26\x27\/\x3c-\x3e\\\x85\u2028\u2029]/g,
soy.esc.$$MATCHER_FOR_ESCAPE_JS_REGEX_ = /[\x00\x08-\x0d\x22\x24\x26-\/\x3a\x3c-\x3f\x5b-\x5e\x7b-\x7d\x85\u2028\u2029]/g,
soy.esc.$$MATCHER_FOR_ESCAPE_CSS_STRING_ = /[\x00\x08-\x0d\x22\x26-\x2a\/\x3a-\x3e@\\\x7b\x7d\x85\xa0\u2028\u2029]/g,
soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_ = /[\x00- \x22\x27-\x29\x3c\x3e\\\x7b\x7d\x7f\x85\xa0\u2028\u2029\uff01\uff03\uff04\uff06-\uff0c\uff0f\uff1a\uff1b\uff1d\uff1f\uff20\uff3b\uff3d]/g,
soy.esc.$$FILTER_FOR_FILTER_CSS_VALUE_ = /^(?!-*(?:expression|(?:moz-)?binding))(?:[.#]?-?(?:[_a-z0-9-]+)(?:-[_a-z0-9-]+)*-?|-?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[a-z]{1,2}|%)?|!important|)$/i,
soy.esc.$$FILTER_FOR_FILTER_NORMALIZE_URI_ = /^(?:(?:https?|mailto):|[^&:\/?#]*(?:[\/?#]|$))/i,
soy.esc.$$FILTER_FOR_FILTER_HTML_ATTRIBUTES_ = /^(?!style|on|action|archive|background|cite|classid|codebase|data|dsync|href|longdesc|src|usemap)(?:[a-z0-9_$:-]*)$/i,
soy.esc.$$FILTER_FOR_FILTER_HTML_ELEMENT_NAME_ = /^(?!script|style|title|textarea|xmp|no)[a-z0-9_$:-]*$/i,
soy.esc.$$escapeHtmlHelper = function(e) {
    return String(e).replace(soy.esc.$$MATCHER_FOR_ESCAPE_HTML_, soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_)
}
,
soy.esc.$$normalizeHtmlHelper = function(e) {
    return String(e).replace(soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_, soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_)
}
,
soy.esc.$$escapeHtmlNospaceHelper = function(e) {
    return String(e).replace(soy.esc.$$MATCHER_FOR_ESCAPE_HTML_NOSPACE_, soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_)
}
,
soy.esc.$$normalizeHtmlNospaceHelper = function(e) {
    return String(e).replace(soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_NOSPACE_, soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_)
}
,
soy.esc.$$escapeJsStringHelper = function(e) {
    return String(e).replace(soy.esc.$$MATCHER_FOR_ESCAPE_JS_STRING_, soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_)
}
,
soy.esc.$$escapeJsRegexHelper = function(e) {
    return String(e).replace(soy.esc.$$MATCHER_FOR_ESCAPE_JS_REGEX_, soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_)
}
,
soy.esc.$$escapeCssStringHelper = function(e) {
    return String(e).replace(soy.esc.$$MATCHER_FOR_ESCAPE_CSS_STRING_, soy.esc.$$REPLACER_FOR_ESCAPE_CSS_STRING_)
}
,
soy.esc.$$filterCssValueHelper = function(e) {
    e = String(e);
    return soy.esc.$$FILTER_FOR_FILTER_CSS_VALUE_.test(e) ? e : (goog.asserts.fail("Bad value `%s` for |filterCssValue", [e]),
    "zSoyz")
}
,
soy.esc.$$normalizeUriHelper = function(e) {
    return String(e).replace(soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_, soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_)
}
,
soy.esc.$$filterNormalizeUriHelper = function(e) {
    e = String(e);
    return soy.esc.$$FILTER_FOR_FILTER_NORMALIZE_URI_.test(e) ? e.replace(soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_, soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_) : (goog.asserts.fail("Bad value `%s` for |filterNormalizeUri", [e]),
    "#zSoyz")
}
,
soy.esc.$$filterHtmlAttributesHelper = function(e) {
    e = String(e);
    return soy.esc.$$FILTER_FOR_FILTER_HTML_ATTRIBUTES_.test(e) ? e : (goog.asserts.fail("Bad value `%s` for |filterHtmlAttributes", [e]),
    "zSoyz")
}
,
soy.esc.$$filterHtmlElementNameHelper = function(e) {
    e = String(e);
    return soy.esc.$$FILTER_FOR_FILTER_HTML_ELEMENT_NAME_.test(e) ? e : (goog.asserts.fail("Bad value `%s` for |filterHtmlElementName", [e]),
    "zSoyz")
}
,
soy.esc.$$HTML_TAG_REGEX_ = /<(?:!|\/?([a-zA-Z][a-zA-Z0-9:\-]*))(?:[^>'"]|"[^"]*"|'[^']*')*>/g,
soy.esc.$$LT_REGEX_ = /</g,
soy.esc.$$SAFE_TAG_WHITELIST_ = {
    b: 1,
    br: 1,
    em: 1,
    i: 1,
    s: 1,
    sub: 1,
    sup: 1,
    u: 1
},
goog.provide("tmpl.general"),
goog.require("soy"),
goog.require("soydata"),
tmpl.general.seatbar = function(e, t) {
    return '<div id="seatbar" class="fixed center seatbar"><div class="seatbar-arrow"><div class="seatbar-icon"></div></div><div class="seatbar-info hide"><div class="seatbar-guests"><span class="seatbar-guests__number">1</span> <span class="' + soy.$$escapeHtml(e.guestsTranslation.key) + '">' + soy.$$escapeHtml(e.guestsTranslation.value) + '</span></div><div class="seatbar-separator"></div><div class="seatbar-seats"><span class="seatbar-seats__number">0</span> <span class="' + soy.$$escapeHtml(e.seatsTranslation.key) + '">' + soy.$$escapeHtml(e.seatsTranslation.value) + '</span></div></div><div class="seatbar-switcher__wrap"></div></div>'
}
,
tmpl.general.switcher = function(e, t) {
    return '<div id="switcher" class="center floor-switcher"><img src="./images/qui_floor-switcher-up.png" class="absolute active up" /><img src="./images/qui_floor-switcher-down.png" class="absolute down" /></div>'
}
,
goog.provide("qjv.switcher"),
goog.require("goog.dom"),
goog.require("goog.dom.classes"),
goog.require("goog.events"),
goog.require("goog.string"),
goog.require("goog.style"),
goog.require("qjv.utils"),
goog.require("qjv.plane"),
goog.require("tmpl.general"),
goog.scope(function() {
    var e = goog.dom
      , t = goog.events
      , o = goog.dom.classes
      , r = goog.string
      , i = goog.style;
    qjv.switcher.node_ = null,
    qjv.switcher.displayedFloor_ = 1,
    qjv.switcher.click = function(e) {
        qjv.switcher.node_ && (t.hasListener(qjv.switcher.node_, t.EventType.CLICK) && t.removeAll(qjv.switcher.node_),
        t.listen(qjv.switcher.node_, t.EventType.CLICK, function() {
            qjv.switcher.toggleSwitcherArrows(),
            e()
        }))
    }
    ,
    qjv.switcher.toggleSwitcherArrows = function(e) {
        var t;
        e && e.toString() === qjv.switcher.displayedFloor_.toString() || (t = qjv.switcher.node_.childNodes,
        e = "1" === qjv.switcher.displayedFloor_.toString() ? t[0] : t[1],
        t.forEach(function(e) {
            o.add(e, "active")
        }),
        o.remove(e, "active"))
    }
    ,
    qjv.switcher.get = function() {
        return qjv.switcher.node_ || (qjv.switcher.node_ = e.getElement("switcher") || e.htmlToDocumentFragment(tmpl.general.switcher()))
    }
    ,
    qjv.switcher.getDisplayedFloorNumber = function() {
        return qjv.switcher.displayedFloor_
    }
    ,
    qjv.switcher.setDisplayedFloorNamber = function(e) {
        qjv.switcher.displayedFloor_ = e
    }
    ,
    qjv.switcher.resize = function(e, t) {
        qjv.switcher.node_ && (e = Math.floor(200 * e),
        i.setSize(qjv.switcher.node_, e, e),
        t && (qjv.switcher.node_.style[qjv.utils.TRANSFORM_PROPERTY] = "scale(" + r.padNumber(1 / t, 0, 3) + ")",
        qjv.switcher.node_.style.transform = "scale(" + r.padNumber(1 / t, 0, 3) + ")",
        qjv.switcher.node_.style.top = Math.floor(12 / t) + "px",
        qjv.switcher.node_.style.right = Math.floor(10 / t) + "px"))
    }
    ,
    qjv.switcher.show = function() {
        qjv.switcher.node_ && o.remove(qjv.switcher.node_, "hidden")
    }
}),
goog.provide("qjv.seatbar"),
goog.require("goog.dom"),
goog.require("goog.dom.classlist"),
goog.require("goog.array"),
goog.require("goog.events"),
goog.require("qjv.switcher"),
goog.require("qjv.plane"),
goog.require("qjv.i18n"),
goog.scope(function() {
    var i = goog.dom
      , o = goog.events
      , s = goog.dom.classlist;
    qjv.seatbar.node_ = null,
    qjv.seatbar.data_ = {
        guestsTranslation: {
            key: "seatbar.info.guests",
            value: "Guests"
        },
        seatsTranslation: {
            key: "seatbar.info.seats",
            value: "Seats"
        }
    },
    qjv.seatbar.get = function() {
        return qjv.seatbar.node_ || (qjv.seatbar.node_ = i.getElement("seatbar") || i.htmlToDocumentFragment(tmpl.general.seatbar(this.data_)))
    }
    ,
    qjv.seatbar.showInfoNode = function(e) {
        var t = i.getElementByClass("seatbar-info");
        s.remove(t, "hide"),
        qjv.seatbar.updateGuestsAndSeats(e)
    }
    ,
    qjv.seatbar.updateGuestsAndSeats = function(e) {
        var t = e.filter(function(e) {
            return e.seat
        }).length
          , o = i.getElementByClass("seatbar-guests", qjv.seatbar.get())
          , r = i.getElementByClass("seatbar-seats", qjv.seatbar.get())
          , o = i.getChildren(o)
          , r = i.getChildren(r);
        s.set(o[1], 1 === e.length ? "seatbar.info.guests.solo" : "seatbar.info.guests"),
        s.set(r[1], 1 === t ? "seatbar.info.seat" : "seatbar.info.seats"),
        i.setTextContent(o[0], e.length),
        i.setTextContent(r[0], t),
        null !== qjv.i18n.language && qjv.i18n.translate(qjv.i18n.language)
    }
    ,
    qjv.seatbar.getSeatbarArrowIcon = function() {
        return i.getElementByClass("seatbar-icon")
    }
    ,
    qjv.seatbar.isShowSwitcher = function() {
        return 1 < qjv.plane.getNumberOfFloors()
    }
    ,
    qjv.seatbar.init = function() {
        var e, t = qjv.seatbar.get();
        qjv.isRtlLanguage() && s.add(t, "rtl"),
        qjv.seatbar.isShowSwitcher() && (e = i.getElementByClass("seatbar-switcher__wrap", t),
        i.appendChild(e, qjv.switcher.get()),
        qjv.switcher.click(qjv.plane.toggleFloor)),
        i.insertSiblingAfter(t, qjv.plane.get()),
        o.listen(qjv.seatbar.getSeatbarArrowIcon(), o.EventType.CLICK, qjv.message.wannaCloseSeatmap),
        null !== qjv.i18n.language && qjv.i18n.translate(qjv.i18n.language)
    }
    ,
    qjv.seatbar.hideSeatbar = function() {
        var e = qjv.seatbar.get();
        s.add(e, "hidden")
    }
}),
goog.provide("qjv.seat.features"),
goog.scope(function() {
    qjv.seat.features = {
        restrictedLegroom: "Constrained Legroom",
        extraLegroom: "Extra Legroom",
        noFloorStorage: "No underseat storage",
        noOverheadStorage: "Limited storage space",
        limitedOverheadStorage: "Limited storage space",
        trayTableInArmrest: "Tray table in the armrest",
        getColdByExit: "Close to exit, drafts and chilly",
        misalignedWindow: "Partial or missing window view",
        noWindow: "Partial or missing window view",
        doNotRecline: "Restricted recline, backaches possible",
        limitedRecline: "Recline might be limited",
        nearLavatory: "Close to restrooms",
        nearGalley: "Close to galleys",
        nearStairs: "Stairs, heavy traffic area",
        wingInWindow: "Wing from window view",
        standardSeat: "Standard seat",
        reservedCrewSeat: "Reserved",
        prereclinedSeat: "Pre-reclined seat",
        bassinet: "Baby bassinet available",
        babyBassinet: "Baby bassinet available",
        audio_video_ondemand: "Audio & Video On Demand (%s)",
        audioVideo: "Audio & Video On Demand (%s)",
        wifi_enabled: "WiFi enabled",
        wifiEnabled: "WiFi enabled",
        usbPlug: "USB plug",
        usbPowerPlug: "USB & power plug (%s)",
        powerPlug: "Power plug (%s)",
        power: "Power plug (%s)",
        narrower: "Narrower seat",
        bt: "Pair your headset",
        sunrise: "Sunrise view"
    },
    qjv.seat.features.additionalProps = {},
    qjv.seat.features.setAdditionalProps = function(e, t) {
        qjv.seat.features.additionalProps[e] = t
    }
}),
goog.provide("goog.string.format"),
goog.require("goog.string"),
goog.string.format = function(e, t) {
    var l = Array.prototype.slice.call(arguments)
      , o = l.shift();
    if (void 0 === o)
        throw Error("[goog.string.format] Template required");
    return o.replace(/%([0\- \+]*)(\d+)?(\.(\d+))?([%sfdiu])/g, function(e, t, o, r, i, s, a, g) {
        if ("%" == s)
            return "%";
        var n = l.shift();
        if (void 0 === n)
            throw Error("[goog.string.format] Not enough arguments");
        return arguments[0] = n,
        goog.string.format.demuxes_[s].apply(null, arguments)
    })
}
,
goog.string.format.demuxes_ = {},
goog.string.format.demuxes_.s = function(e, t, o, r, i, s, a, g) {
    return isNaN(o) || "" == o || e.length >= o || (-1 < t.indexOf("-", 0) ? e += goog.string.repeat(" ", o - e.length) : e = goog.string.repeat(" ", o - e.length) + e),
    e
}
,
goog.string.format.demuxes_.f = function(e, t, o, r, i, s, a, g) {
    var n, l = e.toString();
    if (isNaN(i) || "" == i || (l = parseFloat(e).toFixed(i)),
    n = e < 0 ? "-" : 0 <= t.indexOf("+") ? "+" : 0 <= t.indexOf(" ") ? " " : "",
    0 <= e && (l = n + l),
    isNaN(o) || l.length >= o)
        return l;
    i = o - (l = isNaN(i) ? Math.abs(e).toString() : Math.abs(e).toFixed(i)).length - n.length;
    return l = 0 <= t.indexOf("-", 0) ? n + l + goog.string.repeat(" ", i) : (t = 0 <= t.indexOf("0", 0) ? "0" : " ",
    n + goog.string.repeat(t, i) + l)
}
,
goog.string.format.demuxes_.d = function(e, t, o, r, i, s, a, g) {
    return goog.string.format.demuxes_.f(parseInt(e, 10), t, o, r, 0, s, a, g)
}
,
goog.string.format.demuxes_.i = goog.string.format.demuxes_.d,
goog.string.format.demuxes_.u = goog.string.format.demuxes_.d,
goog.provide("goog.json"),
goog.provide("goog.json.Replacer"),
goog.provide("goog.json.Reviver"),
goog.provide("goog.json.Serializer"),
goog.define("goog.json.USE_NATIVE_JSON", !1),
goog.json.isValid = function(e) {
    if (/^\s*$/.test(e))
        return !1;
    return /^[\],:{}\s\u2028\u2029]*$/.test(e.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))
}
,
goog.json.parse = goog.json.USE_NATIVE_JSON ? goog.global.JSON.parse : function(s) {
    var o = String(s);
    if (goog.json.isValid(o))
        try {
            return eval("(" + o + ")")
        } catch (ex) {}
    throw Error("Invalid JSON string: " + o)
}
,
goog.json.unsafeParse = goog.json.USE_NATIVE_JSON ? goog.global.JSON.parse : function(s) {
    return eval("(" + s + ")")
}
,
goog.json.Replacer,
goog.json.Reviver,
goog.json.serialize = goog.json.USE_NATIVE_JSON ? goog.global.JSON.stringify : function(e, t) {
    return new goog.json.Serializer(t).serialize(e)
}
,
goog.json.Serializer = function(e) {
    this.replacer_ = e
}
,
goog.json.Serializer.prototype.serialize = function(e) {
    var t = [];
    return this.serializeInternal(e, t),
    t.join("")
}
,
goog.json.Serializer.prototype.serializeInternal = function(e, t) {
    if (null != e) {
        if ("object" == typeof e) {
            if (goog.isArray(e))
                return void this.serializeArray(e, t);
            if (!(e instanceof String || e instanceof Number || e instanceof Boolean))
                return void this.serializeObject_(e, t);
            e = e.valueOf()
        }
        switch (typeof e) {
        case "string":
            this.serializeString_(e, t);
            break;
        case "number":
            this.serializeNumber_(e, t);
            break;
        case "boolean":
            t.push(e);
            break;
        case "function":
            t.push("null");
            break;
        default:
            throw Error("Unknown type: " + typeof e)
        }
    } else
        t.push("null")
}
,
goog.json.Serializer.charToJsonCharCache_ = {
    '"': '\\"',
    "\\": "\\\\",
    "/": "\\/",
    "\b": "\\b",
    "\f": "\\f",
    "\n": "\\n",
    "\r": "\\r",
    "\t": "\\t",
    "\v": "\\u000b"
},
goog.json.Serializer.charsToReplace_ = /\uffff/.test("￿") ? /[\\"\x00-\x1f\x7f-\uffff]/g : /[\\"\x00-\x1f\x7f-\xff]/g,
goog.json.Serializer.prototype.serializeString_ = function(e, t) {
    t.push('"', e.replace(goog.json.Serializer.charsToReplace_, function(e) {
        var t = goog.json.Serializer.charToJsonCharCache_[e];
        return t || (t = "\\u" + (65536 | e.charCodeAt(0)).toString(16).substr(1),
        goog.json.Serializer.charToJsonCharCache_[e] = t),
        t
    }), '"')
}
,
goog.json.Serializer.prototype.serializeNumber_ = function(e, t) {
    t.push(isFinite(e) && !isNaN(e) ? e : "null")
}
,
goog.json.Serializer.prototype.serializeArray = function(e, t) {
    var o = e.length;
    t.push("[");
    for (var r = "", i = 0; i < o; i++) {
        t.push(r);
        var s = e[i];
        this.serializeInternal(this.replacer_ ? this.replacer_.call(e, String(i), s) : s, t),
        r = ","
    }
    t.push("]")
}
,
goog.json.Serializer.prototype.serializeObject_ = function(e, t) {
    t.push("{");
    var o, r, i = "";
    for (o in e)
        !Object.prototype.hasOwnProperty.call(e, o) || "function" != typeof (r = e[o]) && (t.push(i),
        this.serializeString_(o, t),
        t.push(":"),
        this.serializeInternal(this.replacer_ ? this.replacer_.call(e, o, r) : r, t),
        i = ",");
    t.push("}")
}
,
goog.provide("tmpl.broadcasting"),
goog.require("soy"),
goog.require("soydata"),
tmpl.broadcasting.avatar = function(e, t) {
    return '<div class="absolute circle comp-plane_seat-avatar comp-plane_seat-avatar--abbr ' + soy.$$escapeHtml(e.classNames || "") + '" style="background-color: ' + soy.$$escapeHtml(e.color) + '" >' + soy.$$escapeHtml(e.abbr) + "</div>"
}
,
goog.provide("qjv.seat"),
goog.require("goog.array"),
goog.require("goog.dom"),
goog.require("goog.dom.classes"),
goog.require("goog.dom.dataset"),
goog.require("goog.json"),
goog.require("goog.object"),
goog.require("goog.string.format"),
goog.require("goog.style"),
goog.require("qjv.seat.features"),
goog.require("qjv.utils"),
goog.require("tmpl.broadcasting"),
goog.scope(function() {
    var g = goog.array
      , r = goog.dom
      , t = goog.dom.classes
      , n = goog.dom.dataset
      , l = goog.json
      , u = goog.object
      , c = goog.string.format
      , i = goog.style
      , p = qjv.seat.features;
    qjv.seat = function(e) {
        return ("string" != typeof e || qjv.seat.exist(e)) && new qjv.seat.Chain_(e)
    }
    ,
    qjv.seat.CSS_SEAT_SELECTOR_ = "#plane > .comp-plane_floor > .comp-plane_seats.absolute .comp-plane_seat",
    qjv.seat.CSS_SPRITE_SELECTOR_ = "#plane > .comp-plane_floor > .comp-plane_seats:not(.absolute) .comp-plane_seat",
    qjv.seat.blocked_ = [],
    qjv.seat.notAvailableForPassenger_ = [],
    qjv.seat.get = function(e) {
        return document.body.querySelector(qjv.seat.CSS_SEAT_SELECTOR_ + e)
    }
    ,
    qjv.seat.getSeatNodeByNumber = function(e) {
        return document.querySelectorAll('[data-number="' + e + '"]')[0] || ""
    }
    ,
    qjv.seat.getSeatByUid = function(e) {
        return document.querySelector('[data-seat-uid="' + e + '"]')
    }
    ,
    qjv.seat.getSpriteByUid = function(e) {
        return document.querySelector('[data-sprite-uid="' + e + '"]')
    }
    ,
    qjv.seat.getSeatUid = function(e) {
        return n.get(e, "seatUid")
    }
    ,
    qjv.seat.getParentFloorNumber = function(e) {
        e = r.getParentElement(e),
        e = r.getParentElement(e);
        return n.get(e, "level")
    }
    ,
    qjv.seat.getPreparedSeatData = function(e) {
        var t = n.getAll(e)
          , o = t.class
          , r = t.label
          , t = t.number;
        return {
            classLetter: o,
            deckLevel: parseFloat(qjv.seat.getParentFloorNumber(e)),
            fragment: qjv.panorama.getFragmentBySeat(t).fragmentId,
            label: t,
            type: r,
            x: e.offsetLeft,
            y: e.offsetTop
        }
    }
    ,
    qjv.seat.find = function(e) {
        return e = e || "",
        document.querySelectorAll(qjv.seat.CSS_SEAT_SELECTOR_ + e)
    }
    ,
    qjv.seat.findSprite = function(e) {
        return e = e || "",
        document.querySelectorAll(qjv.seat.CSS_SPRITE_SELECTOR_ + e)
    }
    ,
    qjv.seat.clearOwnership = function(t) {
        g.forEach(qjv.seat.find("[data-owner]"), function(e) {
            e = qjv.seat(e);
            g.contains(t || [], e.number) || e.unsetOwner()
        })
    }
    ,
    qjv.seat.features = p,
    qjv.seat.block = function(e, t) {
        e = e instanceof qjv.seat.Chain_ ? e : qjv.seat(e);
        e && (g.insert(qjv.seat.blocked_, e.number),
        e.decolor())
    }
    ,
    qjv.seat.disableForPassenger = function(e) {
        e = e instanceof qjv.seat.Chain_ ? e : qjv.seat(e);
        e && (g.insert(qjv.seat.notAvailableForPassenger_, e.number),
        e.decolor())
    }
    ,
    qjv.seat.clearDisabledForPassengerSeats = function() {
        g.forEach(qjv.seat.notAvailableForPassenger_, function(e) {
            e = qjv.seat(e);
            t.remove(e.sprite(), "disabled")
        }),
        g.clear(qjv.seat.notAvailableForPassenger_)
    }
    ,
    qjv.seat.blockByClass = function(e) {
        e = qjv.seat.find('[data-class="' + e.toUpperCase() + '"]');
        g.forEach(e, function(e) {
            qjv.seat.block(n.get(e, "number"), !0)
        })
    }
    ,
    qjv.seat.exist = function(e) {
        return !!qjv.seat.get('[data-number="' + e.toUpperCase() + '"]')
    }
    ,
    qjv.seat.featureToImperial = function(e) {
        return !e || e.includes('"') || e.includes("°") ? e : e.includes("-") ? e.split("-").map(function(e) {
            return qjv.utils.cmToInch(e)
        }).join("-") + '/"' : (e = qjv.utils.cmToInch(e)) + '/"'
    }
    ,
    qjv.seat.featureToMetric = function(e) {
        return !e || e.includes("cm") || e.includes("°") ? e : e.includes("-") ? e.split("-").map(function(e) {
            return qjv.utils.inchToCm(e)
        }).join("-") + " cm" : (e = qjv.utils.inchToCm(e)) + " cm"
    }
    ,
    qjv.seat.prepareCircleFeature = function(e) {
        var t = qjv.utils.getUrlParams();
        return "metric" === t.measure && (e = qjv.seat.featureToMetric(e)),
        e = "imperial" === t.measure ? qjv.seat.featureToImperial(e) : e
    }
    ,
    qjv.seat.Chain_ = function(e) {
        "string" == typeof e ? (this.node_ = qjv.seat.get('[data-number="' + e.toUpperCase() + '"]'),
        this.number = e.toUpperCase()) : (this.node_ = e,
        this.number = n.get(this.node_, "number")),
        this.class = n.get(this.node_, "class"),
        this.passengerTypes = n.get(this.node_, "passengerTypes") || "",
        this.price = n.get(this.node_, "price"),
        this.title = this.number + " ",
        this.title = (this.title + (n.get(this.node_, "label") || "")).trim()
    }
    ,
    qjv.seat.Chain_.prototype.getNode = function() {
        return this.node_
    }
    ,
    qjv.seat.Chain_.prototype.sprite = function() {
        var e = r.getParentElement(this.node_)
          , t = r.getChildren(e)
          , t = g.indexOf(t, this.node_)
          , e = r.getParentElement(e)
          , t = qjv.seat.CSS_SPRITE_SELECTOR_ + ":nth-child(" + (t + 1) + ")";
        return e.querySelector(t)
    }
    ,
    qjv.seat.Chain_.prototype.decolor = function() {
        t.add(this.sprite(), "disabled")
    }
    ,
    qjv.seat.Chain_.prototype.getAdditionalPropsBySeat = function(e) {
        return p.additionalProps[e]
    }
    ,
    qjv.seat.Chain_.prototype.getClassFeatures = function() {
        var e = document.getElementById("plane")
          , e = n.get(e, "seatClassFeatures");
        if (!e)
            return {};
        var e = l.unsafeParse(e)
          , o = ["F", "B", "P", "E"]
          , r = e[this.class] || []
          , i = {}
          , s = []
          , a = u.getKeys(p);
        return u.forEach(e, function(e, t) {
            g.contains(o, t) || (r[t] = e)
        }),
        u.forEach(r, function(e, t) {
            if (g.contains(a, t)) {
                var o = p[t]
                  , r = t;
                switch (t) {
                case "audio_video_ondemand":
                    t = "movie";
                    break;
                case "wifi_enabled":
                    t = "wifi";
                    break;
                case "bt":
                    t = "bluetooth";
                    break;
                case "usbPlug":
                case "usbPowerPlug":
                case "powerPlug":
                    t = "power";
                    break;
                default:
                    t = "+"
                }
                o = /%/.test(o) ? c(o, e) : o,
                s.push({
                    label: o,
                    icon: t,
                    key: r
                })
            } else
                i[t] = qjv.seat.prepareCircleFeature(e)
        }),
        {
            list: s,
            circle: i
        }
    }
    ,
    qjv.seat.Chain_.prototype.isBlocked = function() {
        return g.contains(qjv.seat.blocked_, this.number)
    }
    ,
    qjv.seat.Chain_.prototype.free = function(e) {
        var t = n.get(this.node_, "passenger");
        return !this.isBlocked() && !t
    }
    ,
    qjv.seat.Chain_.prototype.owner = function() {
        var e = this.node_.getAttribute("data-owner");
        if (e)
            return l.parse(e)
    }
    ,
    qjv.seat.Chain_.prototype.passenger = function() {
        var e = parseInt(this.node_.getAttribute("data-passenger"), 10);
        return isNaN(e) ? -1 : e
    }
    ,
    qjv.seat.Chain_.prototype.features = function() {
        var e = l.unsafeParse(n.get(this.node_, "features"))
          , i = [];
        return g.forEach(e, function(e, t) {
            var o, r;
            qjv.seat.features[e.name] && (o = qjv.seat.features[e.name],
            r = e.value || "-",
            i.push({
                label: o,
                icon: r,
                key: e.name
            }))
        }),
        i
    }
    ,
    qjv.seat.Chain_.prototype.getSpecs = function() {
        var e = l.unsafeParse(n.get(this.node_, "specs"));
        if (!e)
            return {};
        var i = []
          , s = {}
          , a = u.getKeys(p);
        return u.forEach(e, function(e, t) {
            if (g.contains(a, t)) {
                var o = p[t]
                  , r = t;
                switch (t) {
                case "audio_video_ondemand":
                case "audioVideo":
                    t = "movie";
                    break;
                case "wifi_enabled":
                case "wifiEnabled":
                    t = "wifi";
                    break;
                case "power":
                    t = "power";
                    break;
                default:
                    t = "+"
                }
                o = /%/.test(o) ? c(o, e) : o,
                i.push({
                    label: o,
                    icon: t,
                    key: r
                })
            } else {
                switch (t) {
                case "pitch":
                    t = "seat_pitch";
                    break;
                case "recline":
                    t = "seat_recline";
                    break;
                case "width":
                    t = "seat_width"
                }
                s[t] = e
            }
        }),
        {
            list: i,
            circle: s
        }
    }
    ,
    qjv.seat.Chain_.prototype.hasSpecs = function() {
        var t = !1
          , o = l.unsafeParse(n.get(this.node_, "specs"))
          , e = u.getKeys(o);
        return u.forEach(e, function(e) {
            o[e] && (t = !0)
        }),
        t
    }
    ,
    qjv.seat.Chain_.prototype.mergeFeaturesAndSpecs = function(e, t) {
        var o, r = {
            audio_video_ondemand: "audioVideo",
            usbPlug: "power",
            usbPowerPlug: "power",
            powerPlug: "power"
        }, i = [], s = {};
        for (o in e.forEach(function(e) {
            var t = r[e.key] || e.key;
            s[t] = e
        }),
        t.forEach(function(e) {
            var t = r[e.key] || e.key;
            s[t] = e
        }),
        s)
            s.hasOwnProperty(o) && i.push(s[o]);
        return i
    }
    ,
    qjv.seat.Chain_.prototype.offset = function(e, t) {
        var o = i.getPageOffset(this.node_)
          , r = {};
        return r.top = o.y,
        r.left = o.x,
        "center" === e && e || (r.center = r.left + this.size("width") * (t || 1) / 2),
        e ? r[e] : r
    }
    ,
    qjv.seat.Chain_.prototype.size = function(e) {
        var t = i.getSize(this.node_);
        return e ? t[e] : t
    }
    ,
    qjv.seat.Chain_.prototype.getRenderedRectParams = function(e) {
        var t = this.node_.getBoundingClientRect();
        return e ? t[e] : t
    }
    ,
    qjv.seat.Chain_.prototype.setPassenger = function(e, t) {
        e.id;
        var o = e.passengerColor;
        if (!r.getChildren(this.node_).length)
            return this.node_ && (o = o || qjv.reservations.getPassengerDefaultColor(),
            this.node_.setAttribute("data-passenger", t),
            r.appendChild(this.node_, r.htmlToDocumentFragment(tmpl.broadcasting.avatar({
                abbr: qjv.reservations.getPassengerAbbr(e, t),
                color: o,
                classNames: "reservation"
            })))),
            this
    }
    ,
    qjv.seat.Chain_.prototype.unsetPassenger = function() {
        return this.node_ && (this.node_.removeAttribute("data-passenger"),
        this.removeAvatar()),
        this
    }
    ,
    qjv.seat.Chain_.prototype.setOwner = function(e) {
        return this.node_ && this.node_.setAttribute("data-owner", l.serialize(e)),
        this
    }
    ,
    qjv.seat.Chain_.prototype.removeAvatar = function() {
        var e = this.node_.querySelector(".comp-plane_seat-avatar");
        e && r.removeNode(e)
    }
    ,
    qjv.seat.Chain_.prototype.unsetOwner = function() {
        return this.node_ && (this.node_.removeAttribute("data-owner"),
        this.removeAvatar()),
        this
    }
}),
goog.provide("tmpl.plane"),
goog.require("soy"),
goog.require("soydata"),
tmpl.plane.map = function(e, t) {
    for (var o = '<!doctype html><html><head><meta charset="utf-8" /><meta name="robots" content="noindex"><meta http-equiv="X-UA-Compatible" content="IE=edge" /><title>Seat map</title><meta name="viewport" content="width=device-width, minimum-scale=1, minimal-ui"><link rel="stylesheet" href="./styles/themes.css" />\x3c!-- DEBUG_STYLES_BOF --\x3e<link rel="stylesheet" href="./development/styles/seatmap.css" />\x3c!-- DEBUG_STYLES_EOF --\x3e<style id="scrollbar_style"></style><style>', r = e.seatStyles, i = r.length, s = 0; s < i; s++) {
        var a = r[s];
        o += "4" == a.seatType ? soy.$$escapeHtml(a.className) + ' { background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" width="150" height="220" xmlns="http://www.w3.org/2000/svg"><g class="seat" transform="scale(1.2)"><path class="bd" fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" d="M89.24,20c-.34-7.62-6.46-6.61-9.52-10.33S78.71.5,70.55.5H29.75c-8.16,0-6.12,5.42-9.18,9.15S11.4,12.37,11.06,20s0,13.74,0,13.74H89.24S89.58,27.61,89.24,20Z"></path><path class="bd" fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" d="M85,72.8H16.81a6.89,6.89,0,0,1-6.88-6.86V37.14a6.89,6.89,0,0,1,6.88-6.86,326.72,326.72,0,0,1,34.08-1.9A313.07,313.07,0,0,1,85,30.27a6.89,6.89,0,0,1,6.88,6.86v28.8A6.89,6.89,0,0,1,85,72.8Z"></path><rect class="bd" fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" x="9.93" y="71.69" width="81.91" height="60.75" rx="7.59" ry="7.59"></rect><path class="bc" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" fill="' + soy.$$escapeHtml(a.armrestColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" d="M9,142.15H3.08A3.09,3.09,0,0,1,0,139.07V84.52a3.09,3.09,0,0,1,3.08-3.08H9a3.09,3.09,0,0,1,3.08,3.08v54.55A3.09,3.09,0,0,1,9,142.15Zm91-3.08V84.52a3.09,3.09,0,0,0-3.08-3.08H91.29a3.09,3.09,0,0,0-3.08,3.08v54.55a3.09,3.09,0,0,0,3.08,3.08h5.63A3.09,3.09,0,0,0,100,139.07Z"></path><path class="bd" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" fill="' + soy.$$escapeHtml(a.fillColor) + '" d="M84.71,145.5H14.9c-2.74,0-5-2.8-5-6.23V132c0-3.44,2.23-6.23,5-6.23l.19,0a195.67,195.67,0,0,0,34.71,3,210.38,210.38,0,0,0,34.72-3l.18,0c2.74,0,5,2.8,5,6.23v7.25C89.67,142.7,87.44,145.5,84.71,145.5Z"></path><path class="cf" fill="white" stroke="white" d="M67.32,141.13h-35a2.94,2.94,0,0,1-2.95-2.94V128.06a2.93,2.93,0,0,1,.08-.66L32,116.12a3,3,0,0,1,2.87-2.28H64.35a3,3,0,0,1,2.85,2.2l3,11.31a2.93,2.93,0,0,1,.1.74v10.09A2.94,2.94,0,0,1,67.32,141.13Z"></path></g></svg>\'); }' : "B" == a.cabinClass && "1" == a.seatType ? soy.$$escapeHtml(a.className) + ' { background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" width="150" height="150" xmlns="http://www.w3.org/2000/svg"><g class="seat" transform="scale(1)"><path class="bd" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" fill="' + soy.$$escapeHtml(a.fillColor) + '" d="M127.05,89.33H12.38V13.83A9.67,9.67,0,0,1,22,4.17,455.22,455.22,0,0,1,69.72,1.5a436.21,436.21,0,0,1,47.71,2.67,9.67,9.67,0,0,1,9.63,9.66Z"></path><path class="bd" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" fill="' + soy.$$escapeHtml(a.fillColor) + '" d="M12.38,89.33H127.05a0,0,0,0,1,0,0v36.26a7.59,7.59,0,0,1-7.59,7.59H20a7.59,7.59,0,0,1-7.59-7.59V89.33A0,0,0,0,1,12.38,89.33Z"></path><path stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" fill="' + soy.$$escapeHtml(a.armrestColor) + '" class="bc" d="M13.84,131.7H3.08A3.09,3.09,0,0,1,0,128.61V33a3.09,3.09,0,0,1,3.08-3.08H13.84A3.09,3.09,0,0,1,16.93,33v95.64A3.09,3.09,0,0,1,13.84,131.7ZM140,128.61V33a3.09,3.09,0,0,0-3.08-3.08H126.57A3.09,3.09,0,0,0,123.49,33v95.64a3.09,3.09,0,0,0,3.08,3.08h10.34A3.09,3.09,0,0,0,140,128.61Z"></path><path class="bd" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" fill="' + soy.$$escapeHtml(a.fillColor) + '" d="M118.59,146.5H20.86c-3.83,0-7-3.93-7-8.77v-10.2c0-4.84,3.12-8.77,7-8.77l.27,0A272.65,272.65,0,0,0,69.72,123a293.15,293.15,0,0,0,48.61-4.24l.25,0c3.83,0,7,3.93,7,8.77v10.2C125.54,142.57,122.42,146.5,118.59,146.5Z"></path><path stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" fill="' + soy.$$escapeHtml(a.fillColor) + '" class="cf" d="M94.24,140.35H45.19a4.13,4.13,0,0,1-4.13-4.14V122a4.15,4.15,0,0,1,.11-.93l3.65-7a4.13,4.13,0,0,1,4-3.21H90.1a4.13,4.13,0,0,1,4,3.09L98.24,121a4.15,4.15,0,0,1,.13,1v14.2A4.13,4.13,0,0,1,94.24,140.35Z"></path></g></svg>\'); }' : "5" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"> <g class="seat"> <polygon fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" points="4.1,43 67.1,43 115.6,188 81.1,197.7 27.7,182.8 3.3,161.5"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M145.8,138.9l53.6-3.3v42.5h-19.2c-0.5,0-1-0.2-1.5-0.5l-43-28.5L145.8,138.9z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M189.5,56.2c0.5-0.9,1.3-1.4,2.3-1.4l7.6-0.1v87.6l-63.1,1.6L189.5,56.2z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8"  d="M6.1,119.6L29,81.1l107,63.7l-22.9,38.3c-0.9,1.5-2.6,2.4-4.4,2.1c-7.2-1-27.2-5.4-56-21.9 c-29.2-16.6-42.2-32.9-46.3-38.9C5.3,123,5.2,121.1,6.1,119.6L6.1,119.6z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8"  d="M27.7,83.3L75.6,2.7c1.1-1.9,3.6-2.6,5.6-1.8C90.6,5,116.8,16.4,134,26.6s39.7,27.7,47.6,34.2 c1.6,1.4,2.1,3.9,1,5.8l-47.9,80.5L27.7,83.3z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M45.5,115.2l-2.8,4.6l-0.4,0.7l-2.8,4.6c-0.7,0.9-0.4,2.2,0.3,2.9c3.2,3.1,11.9,11.2,23.4,18 c11.6,6.9,22.7,10.7,27,12c1,0.4,2.1,0,2.7-1l2.8-4.6l0.4-0.7l2.8-4.6c0.7-0.9,0.4-2.2-0.3-2.9c-3.2-3.1-11.8-11.1-23.4-18 c-11.6-6.9-22.7-10.7-27-12C47.2,113.9,46.1,114.3,45.5,115.2z"/> <path fill="rgb(235, 235, 235)" d="M5,42v107.4c0,2.4,0.9,4.7,2.5,6.6c8.7,10,21,22.2,33.5,27.1c18.4,7.3,51.5,7.1,64.8,6.7c2.1-0.1,3.9-1.1,5-2.9 l24-39.6l6.1-10H200v10h-53.6l-27.1,44.8c-2.8,4.7-7.8,7.6-13.2,7.7c-2.8,0.1-6.4,0.2-10.6,0.2c-16.7,0-42.1-1.2-58.2-7.5 C23,186.8,9.4,173.6,0,162.8l0-8.1L0,42H5z"/> </g> </svg>\');}' : "6" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"> <g class="seat" transform="scale(-1, 1) translate(-200,0)"> <polygon fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" points="4.1,43 67.1,43 115.6,188 81.1,197.7 27.7,182.8 3.3,161.5"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M145.8,138.9l53.6-3.3v42.5h-19.2c-0.5,0-1-0.2-1.5-0.5l-43-28.5L145.8,138.9z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M189.5,56.2c0.5-0.9,1.3-1.4,2.3-1.4l7.6-0.1v87.6l-63.1,1.6L189.5,56.2z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8"  d="M6.1,119.6L29,81.1l107,63.7l-22.9,38.3c-0.9,1.5-2.6,2.4-4.4,2.1c-7.2-1-27.2-5.4-56-21.9 c-29.2-16.6-42.2-32.9-46.3-38.9C5.3,123,5.2,121.1,6.1,119.6L6.1,119.6z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8"  d="M27.7,83.3L75.6,2.7c1.1-1.9,3.6-2.6,5.6-1.8C90.6,5,116.8,16.4,134,26.6s39.7,27.7,47.6,34.2 c1.6,1.4,2.1,3.9,1,5.8l-47.9,80.5L27.7,83.3z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M45.5,115.2l-2.8,4.6l-0.4,0.7l-2.8,4.6c-0.7,0.9-0.4,2.2,0.3,2.9c3.2,3.1,11.9,11.2,23.4,18 c11.6,6.9,22.7,10.7,27,12c1,0.4,2.1,0,2.7-1l2.8-4.6l0.4-0.7l2.8-4.6c0.7-0.9,0.4-2.2-0.3-2.9c-3.2-3.1-11.8-11.1-23.4-18 c-11.6-6.9-22.7-10.7-27-12C47.2,113.9,46.1,114.3,45.5,115.2z"/> <path fill="rgb(235, 235, 235)" d="M5,42v107.4c0,2.4,0.9,4.7,2.5,6.6c8.7,10,21,22.2,33.5,27.1c18.4,7.3,51.5,7.1,64.8,6.7c2.1-0.1,3.9-1.1,5-2.9 l24-39.6l6.1-10H200v10h-53.6l-27.1,44.8c-2.8,4.7-7.8,7.6-13.2,7.7c-2.8,0.1-6.4,0.2-10.6,0.2c-16.7,0-42.1-1.2-58.2-7.5 C23,186.8,9.4,173.6,0,162.8l0-8.1L0,42H5z"/> </g> </svg>\');}' : "7" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 200" width="140" height="200"> <g class="seat"> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M3.2,139.6c-1.4,0-2.6-1.4-2.6-3.3V3.9c0-1.9,1.1-3.3,2.6-3.3h10.1c1.4,0,2.6,1.4,2.6,3.3v132.5 c0,1.8-1.1,3.3-2.6,3.3L3.2,139.6L3.2,139.6z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M126.7,139.6c-1.4,0-2.6-1.4-2.6-3.3V3.9c0-1.8,1.1-3.3,2.6-3.3h10.1c1.4,0,2.6,1.4,2.6,3.3v132.5 c0,1.8-1.1,3.3-2.6,3.3L126.7,139.6L126.7,139.6z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M123.9,98.4H15.8V17.3c0-1.9,1.4-3.5,3.4-3.8c8.8-1.2,33.3-4.3,50.7-4.3s42,3.2,50.8,4.3 c1.9,0.3,3.4,1.9,3.4,3.8L123.9,98.4C124,98.4,123.9,98.4,123.9,98.4z"/> <rect x="15.9" y="138.3" fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" width="108.1" height="39"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M123.9,188.2c0,1.6-1,3.1-2.5,3.5c-6.1,2.3-23.6,7.7-51.5,7.7s-45.4-5.4-51.5-7.7c-1.5-0.6-2.5-2-2.5-3.5v-11 H124L123.9,188.2L123.9,188.2z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M123.9,145c0,1.5-1,2.9-2.3,3.4c-5.7,2.7-22.7,9-51.8,8.4c-28.8-0.5-45.7-6.1-51.5-8.5c-1.4-0.6-2.4-2-2.4-3.5 V87.7H124L123.9,145L123.9,145z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M105.4,112.6c-5.3-1.2-19.2-4.2-35.4-4.2s-30.2,3-35.4,4.2c-1.2,0.3-2.2,1.4-2.2,2.8v6.5v1v6.5 c0,1.3,0.9,2.5,2.2,2.8c5.3,1.2,19.2,4.2,35.4,4.2s30.2-3,35.4-4.2c1.2-0.3,2.2-1.4,2.2-2.8v-6.5v-1v-6.5 C107.6,114,106.8,112.9,105.4,112.6z"/> </g> </svg>\');}' : "8" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 200" width="150" height="200"> <g class="seat"> <polygon fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" points="108.7,161.8 138.7,170 149.3,130.6 149.3,29.8 145.5,28.8 "/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M57.8,146.8l81.5,21.3l-7.8,29c-0.3,1.2-1.3,2-2.6,2.1c-5.1,0.4-19.3,0.7-40.4-5.1s-33.2-13.3-37.2-16.2 c-1.1-0.7-1.5-2-1.2-3.1L57.8,146.8z"/> <polygon fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" points="0.6,130.7 0.6,30 29.5,38 12.1,133.8 "/> <path fill="rgb(235, 235, 235)" d="M38.3,2.4L0.8,128c-0.5,1.8,0.2,3.3,1.5,3.7l7.7,2.1l1.8,0.5l86.8,23.5l1.7,0.5l7.8,2.1 c1.4,0.4,2.9-0.7,3.4-2.4L149,32.4c0.5-1.8-0.2-3.3-1.5-3.7l-9.6-2.5c-1.4-0.4-2.9,0.7-3.4,2.4l-31,103.8l-81.8-22.2l31-103.8 c0.5-1.8-0.2-3.3-1.5-3.7l-9.6-2.6C40.3-0.4,38.8,0.7,38.3,2.4z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M21,115l12.4-41.6l81.4,22.3l-12.3,41.4c-0.4,1.2-1.4,2-2.6,2.1c-4.9,0.6-18.9,1.2-40.7-4.5 C37.1,129,25.7,121,22,117.9C21.1,117.2,20.7,116.1,21,115L21,115z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M33.3,73.6l17.2-58.9c0.4-1.4,1.9-2.2,3.4-2.1c6.9,1,26.1,3.8,39.2,7.3s31.8,10.8,38.2,13.6 c1.4,0.7,2.2,2,1.7,3.5l-18.3,58.8L33.3,73.6C33.3,73.6,33.2,73.5,33.3,73.6z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M39.7,96.9l-1.4,4.7l-0.2,0.7l-1.4,4.7c-0.4,1,0.2,2,1.1,2.5c3.7,2,13.4,7,25.7,10.3s23.3,4,27.6,4.2 c1.1,0,2-0.6,2.2-1.6l1.4-4.7l0.2-0.7l1.4-4.7c0.4-1-0.2-2-1.1-2.5c-3.6-2-13.4-7-25.6-10.3c-12.3-3.3-23.3-4-27.6-4.2 C41.1,95.3,40.2,96,39.7,96.9z"/> </g> </svg>\');}' : "9" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 200" width="150" height="200"> <g class="seat" transform="scale(-1, 1) translate(-150,0)"> <polygon fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" points="108.7,161.8 138.7,170 149.3,130.6 149.3,29.8 145.5,28.8 "/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M57.8,146.8l81.5,21.3l-7.8,29c-0.3,1.2-1.3,2-2.6,2.1c-5.1,0.4-19.3,0.7-40.4-5.1s-33.2-13.3-37.2-16.2 c-1.1-0.7-1.5-2-1.2-3.1L57.8,146.8z"/> <polygon fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" points="0.6,130.7 0.6,30 29.5,38 12.1,133.8 "/> <path fill="rgb(235, 235, 235)" d="M38.3,2.4L0.8,128c-0.5,1.8,0.2,3.3,1.5,3.7l7.7,2.1l1.8,0.5l86.8,23.5l1.7,0.5l7.8,2.1 c1.4,0.4,2.9-0.7,3.4-2.4L149,32.4c0.5-1.8-0.2-3.3-1.5-3.7l-9.6-2.5c-1.4-0.4-2.9,0.7-3.4,2.4l-31,103.8l-81.8-22.2l31-103.8 c0.5-1.8-0.2-3.3-1.5-3.7l-9.6-2.6C40.3-0.4,38.8,0.7,38.3,2.4z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M21,115l12.4-41.6l81.4,22.3l-12.3,41.4c-0.4,1.2-1.4,2-2.6,2.1c-4.9,0.6-18.9,1.2-40.7-4.5 C37.1,129,25.7,121,22,117.9C21.1,117.2,20.7,116.1,21,115L21,115z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M33.3,73.6l17.2-58.9c0.4-1.4,1.9-2.2,3.4-2.1c6.9,1,26.1,3.8,39.2,7.3s31.8,10.8,38.2,13.6 c1.4,0.7,2.2,2,1.7,3.5l-18.3,58.8L33.3,73.6C33.3,73.6,33.2,73.5,33.3,73.6z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M39.7,96.9l-1.4,4.7l-0.2,0.7l-1.4,4.7c-0.4,1,0.2,2,1.1,2.5c3.7,2,13.4,7,25.7,10.3s23.3,4,27.6,4.2 c1.1,0,2-0.6,2.2-1.6l1.4-4.7l0.2-0.7l1.4-4.7c0.4-1-0.2-2-1.1-2.5c-3.6-2-13.4-7-25.6-10.3c-12.3-3.3-23.3-4-27.6-4.2 C41.1,95.3,40.2,96,39.7,96.9z"/> </g> </svg>\');}' : "10" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" width="200" height="150"> <g class="seat"> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M31.8,3.2c-0.3-1.3-1.5-2.3-2.9-2.3L4,0.6V102h49.7L31.8,3.2z"/> <rect x="41.5" y="57.4" transform="matrix(2.089475e-03 -1 1 2.089475e-03 -56.8623 190.4811)" fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" width="51" height="132.6"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M55.7,100.5l22.6,25.2l39.7,21.6l40.1-11.3l41.3-26.7L199.3,43c0-1.7-1.3-3-3-3H44.2L55.7,100.5z"/> <g> <path fill="rgb(235, 235, 235)" d="M98.7,146.2c-27.6-9.9-38.1-24.9-43.3-38.4c-6.3-16.4-16-68.3-16-68.3l10.3-0.2c0,0,10.2,49.5,15.3,65.6 c0.8,2.6,15.3,24,37.1,31.9c22.2,8,43.3-1.9,45.2-2.8l42.7-26.9V65.4c0-1.7,1.3-3,3-3h4c1.7,0,3,1.3,3,3v42.8 c0,2.8-1.4,5.3-3.7,6.8l-43.9,27.6l-0.3,0.2c-0.8,0.4-14,7.2-31.6,7.2C113.7,150,106.3,149,98.7,146.2z"/> </g> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M144.5,133.8c-0.5,1.1-1.5,1.8-2.5,1.9c-5,0.4-18.9,0.6-40-7.3c-20.9-7.9-31.7-16.3-35.3-19.6 c-0.9-0.8-1.2-2-0.8-3.1l16.5-46.2l78.6,28L144.5,133.8L144.5,133.8z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M81.3,62.6l21.4-60c0.5-1.5,1.9-2.2,3.4-1.9c6.7,1.4,25.4,5.5,37.9,10c12.6,4.5,29.7,13.2,35.8,16.3 c1.4,0.7,2,2.3,1.5,3.6l-21.4,60L81.3,62.6z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M136.8,108c-3.3-2.2-12.1-7.6-23.3-11.6c-11.1-4-21.5-5.4-25.4-5.8C87.2,90.5,86.3,91,86,92l-1.6,4.5l-0.3,0.7 l-1.6,4.5c-0.3,0.9,0,1.9,0.8,2.4c3.3,2.2,12.1,7.6,23.3,11.6s21.5,5.4,25.4,5.8c0.9,0.1,1.8-0.4,2.1-1.4l1.6-4.5l0.3-0.7l1.6-4.5 C137.9,109.6,137.6,108.5,136.8,108z"/> <g> <rect fill="rgb(235, 235, 235)" width="5" height="150"/> </g> </g> </svg>\');}' : "11" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" width="200" height="150"> <g class="seat" transform="scale(-1, 1) translate(-200,0)"> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M31.8,3.2c-0.3-1.3-1.5-2.3-2.9-2.3L4,0.6V102h49.7L31.8,3.2z"/> <rect x="41.5" y="57.4" transform="matrix(2.089475e-03 -1 1 2.089475e-03 -56.8623 190.4811)" fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" width="51" height="132.6"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M55.7,100.5l22.6,25.2l39.7,21.6l40.1-11.3l41.3-26.7L199.3,43c0-1.7-1.3-3-3-3H44.2L55.7,100.5z"/> <g> <path fill="rgb(235, 235, 235)" d="M98.7,146.2c-27.6-9.9-38.1-24.9-43.3-38.4c-6.3-16.4-16-68.3-16-68.3l10.3-0.2c0,0,10.2,49.5,15.3,65.6 c0.8,2.6,15.3,24,37.1,31.9c22.2,8,43.3-1.9,45.2-2.8l42.7-26.9V65.4c0-1.7,1.3-3,3-3h4c1.7,0,3,1.3,3,3v42.8 c0,2.8-1.4,5.3-3.7,6.8l-43.9,27.6l-0.3,0.2c-0.8,0.4-14,7.2-31.6,7.2C113.7,150,106.3,149,98.7,146.2z"/> </g> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M144.5,133.8c-0.5,1.1-1.5,1.8-2.5,1.9c-5,0.4-18.9,0.6-40-7.3c-20.9-7.9-31.7-16.3-35.3-19.6 c-0.9-0.8-1.2-2-0.8-3.1l16.5-46.2l78.6,28L144.5,133.8L144.5,133.8z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M81.3,62.6l21.4-60c0.5-1.5,1.9-2.2,3.4-1.9c6.7,1.4,25.4,5.5,37.9,10c12.6,4.5,29.7,13.2,35.8,16.3 c1.4,0.7,2,2.3,1.5,3.6l-21.4,60L81.3,62.6z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M136.8,108c-3.3-2.2-12.1-7.6-23.3-11.6c-11.1-4-21.5-5.4-25.4-5.8C87.2,90.5,86.3,91,86,92l-1.6,4.5l-0.3,0.7 l-1.6,4.5c-0.3,0.9,0,1.9,0.8,2.4c3.3,2.2,12.1,7.6,23.3,11.6s21.5,5.4,25.4,5.8c0.9,0.1,1.8-0.4,2.1-1.4l1.6-4.5l0.3-0.7l1.6-4.5 C137.9,109.6,137.6,108.5,136.8,108z"/> <g> <rect fill="rgb(235, 235, 235)" width="5" height="150"/> </g> </g> </svg>\');}' : "12" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 185" width="200" height="185"> <g class="seat"> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M3.6,116v63.2h65l31.4-15.7l35.4-88.1l64-40l-0.2-10.2c0,0-0.4-18.4-8.8-23.1s-17,2.8-17,2.8l-52.7,43.3 c-0.9,0.7-1.6,1.6-2.2,2.5L77.1,113L3.6,116z"/> <path fill="rgb(235, 235, 235)" d="M5,37v148H0V37c0-0.6,0.4-1,1-1h3C4.5,36,5,36.4,5,37z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M88.1,142.7L88.1,142.7c-0.1,1.2-0.8,2.2-1.8,2.7c-4.5,2-17.6,6.9-40.1,6.5c-22.3-0.4-35.3-4.7-39.8-6.6 c-1.1-0.5-1.8-1.5-1.8-2.7V93.5h83.5V142.7L88.1,142.7z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M4.6,96.9V33.2c0-1.5,1.1-2.7,2.6-2.9C14,29.4,33,27,46.3,27c13.4,0,32.4,2.4,39.2,3.3c1.5,0.2,2.6,1.5,2.6,2.9 v63.7H4.6L4.6,96.9z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M72.2,121.1c-3.9-0.9-14-3.1-25.9-3.1c-11.8,0-22.1,2.2-25.9,3.1c-0.9,0.2-1.5,1-1.5,2v4.7v0.8v4.7 c0,1,0.6,1.7,1.5,2c3.9,0.9,13.9,3.1,25.9,3.1s22.1-2.2,25.9-3.1c0.9-0.2,1.5-1,1.5-2v-4.7v-0.8v-4.7 C73.7,122.2,73.1,121.3,72.2,121.1z"/> <polygon fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" points="136.6,72.4 191.6,39.7 191.3,87.8 "/> <path fill="rgb(235, 235, 235)" d="M0,184.9v-9.5h62c9.4,0,31.7-8,34.8-16.8l32.6-78.4c2.5-7.5,10.6-11.9,18.3-9.8l42.8,12.4V39.7L200,34v51.4 c0,2.4-1,4.6-2.9,6s-4.3,1.9-6.5,1.3l-45.2-13.1c-2.8-0.8-5.9,0.9-6.8,3.7L106,161.8c-4.2,12.6-30.3,23.2-43.6,23.2L0,184.9 L0,184.9z"/> </g> </svg>\');}' : "13" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 185" width="200" height="185"> <g class="seat" transform="scale(-1, 1) translate(-200,0)"> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M3.6,116v63.2h65l31.4-15.7l35.4-88.1l64-40l-0.2-10.2c0,0-0.4-18.4-8.8-23.1s-17,2.8-17,2.8l-52.7,43.3 c-0.9,0.7-1.6,1.6-2.2,2.5L77.1,113L3.6,116z"/> <path fill="rgb(235, 235, 235)" d="M5,37v148H0V37c0-0.6,0.4-1,1-1h3C4.5,36,5,36.4,5,37z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M88.1,142.7L88.1,142.7c-0.1,1.2-0.8,2.2-1.8,2.7c-4.5,2-17.6,6.9-40.1,6.5c-22.3-0.4-35.3-4.7-39.8-6.6 c-1.1-0.5-1.8-1.5-1.8-2.7V93.5h83.5V142.7L88.1,142.7z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M4.6,96.9V33.2c0-1.5,1.1-2.7,2.6-2.9C14,29.4,33,27,46.3,27c13.4,0,32.4,2.4,39.2,3.3c1.5,0.2,2.6,1.5,2.6,2.9 v63.7H4.6L4.6,96.9z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M72.2,121.1c-3.9-0.9-14-3.1-25.9-3.1c-11.8,0-22.1,2.2-25.9,3.1c-0.9,0.2-1.5,1-1.5,2v4.7v0.8v4.7 c0,1,0.6,1.7,1.5,2c3.9,0.9,13.9,3.1,25.9,3.1s22.1-2.2,25.9-3.1c0.9-0.2,1.5-1,1.5-2v-4.7v-0.8v-4.7 C73.7,122.2,73.1,121.3,72.2,121.1z"/> <polygon fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" points="136.6,72.4 191.6,39.7 191.3,87.8 "/> <path fill="rgb(235, 235, 235)" d="M0,184.9v-9.5h62c9.4,0,31.7-8,34.8-16.8l32.6-78.4c2.5-7.5,10.6-11.9,18.3-9.8l42.8,12.4V39.7L200,34v51.4 c0,2.4-1,4.6-2.9,6s-4.3,1.9-6.5,1.3l-45.2-13.1c-2.8-0.8-5.9,0.9-6.8,3.7L106,161.8c-4.2,12.6-30.3,23.2-43.6,23.2L0,184.9 L0,184.9z"/> </g> </svg>\');}' : "14" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150" width="120" height="150"> <g class="seat"> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M115.6,129c0,0,6.3,20.4-55.5,20.4S4.6,129,4.6,129l5.8-42.7h99.4L115.6,129z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M90.9,109.6c-4.5-1.1-16.2-3.6-30-3.6s-25.7,2.5-30,3.6c-1.1,0.3-1.8,1.2-1.8,2.4v5.6v0.8v5.6 c0,1.2,0.8,2.1,1.8,2.4c4.5,1.1,16.2,3.6,30,3.6s25.7-2.5,30-3.6c1.1-0.3,1.8-1.2,1.8-2.4v-5.6v-0.8V112 C92.7,110.9,91.9,109.9,90.9,109.6z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M10.4,86.5V13.9c0-1.8,1.3-3.4,3.3-3.7c3.5-0.5,24.7-4.8,46.4-4.8c13,0,22.3,1.6,46.5,4.8 c1.8,0.3,3.2,1.8,3.2,3.7v72.6H10.4z"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M2.4,81.7c-1.1,0-1.8-1-1.8-2.1V2.7c0-1.2,0-2.1,0-2.1H14c1.7,0,2.5,0.9,2.5,2v17.3l-3.4,9.7 l-0.9,49.9c0,1.2-1.7,2.2-2.8,2.2H2.4z"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M110.6,81.7c-1.1,0-2.8-1.1-2.8-2.2 l-0.9-49.9l-3.4-9.7V2.6c0-1.2,0.9-2,2.5-2h13.4c0,0,0,1,0,2.1v77c0,1.2-0.8,2.1-1.8,2.1L110.6,81.7z"/> </g> </svg>\');}' : "15" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 175" width="150" height="175"> <g class="seat"> <path fill="rgb(235, 235, 235)"  d="M150,135c0,0-5.1,40-57.5,40S35,135,35,135V18.4c0-1.7,1.2-3,2.8-3h109.5c1.6,0,2.8,1.3,2.8,3V135H150z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M138,136.8c0,1.3-0.7,2.7-1.9,3.2c-4.8,2.4-18.9,8.3-42.8,7.9c-23.8-0.5-37.8-5.8-42.6-7.9 c-1.2-0.5-2-1.9-2-3.4v-53H138V136.8z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M138,83.6H48.8V8.1c0-1.7,1.2-3.4,2.8-3.5c7.3-1.1,27.6-4,41.9-4s34.7,3,42,4c1.6,0.3,2.8,1.7,2.8,3.5L138,83.6 L138,83.6z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M122.6,106.7c-4.3-1.2-15.8-3.9-29.3-3.9s-24.9,2.8-29.3,3.9c-1.1,0.3-1.7,1.3-1.7,2.6v6v0.9v6 c0,1.2,0.7,2.3,1.7,2.6c4.3,1.2,15.8,3.9,29.3,3.9s24.9-2.8,29.3-3.9c1.1-0.3,1.7-1.3,1.7-2.6v-6v-0.9v-6 C124.4,108,123.7,107,122.6,106.7z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M34.4,108.6H0.6v-97c0-2.7,1.5-4.9,3.2-4.9h27.3c1.8,0,3.2,2.2,3.2,4.9C34.4,11.6,34.4,108.6,34.4,108.6z"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M34.4,121.3c0,1.2-0.3,2.3-0.8,2.7c-1.9,1.7-7.3,5.8-16.1,5.8s-14.2-4-16.1-5.8c-0.5-0.4-0.8-1.5-0.8-2.7 v-12.6h33.8C34.4,108.7,34.4,121.3,34.4,121.3z"/> </g> </svg>\');}' : "16" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 175" width="150" height="175"> <g class="seat" transform="scale(-1, 1) translate(-150,0)"> <path fill="rgb(235, 235, 235)"  d="M150,135c0,0-5.1,40-57.5,40S35,135,35,135V18.4c0-1.7,1.2-3,2.8-3h109.5c1.6,0,2.8,1.3,2.8,3V135H150z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M138,136.8c0,1.3-0.7,2.7-1.9,3.2c-4.8,2.4-18.9,8.3-42.8,7.9c-23.8-0.5-37.8-5.8-42.6-7.9 c-1.2-0.5-2-1.9-2-3.4v-53H138V136.8z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M138,83.6H48.8V8.1c0-1.7,1.2-3.4,2.8-3.5c7.3-1.1,27.6-4,41.9-4s34.7,3,42,4c1.6,0.3,2.8,1.7,2.8,3.5L138,83.6 L138,83.6z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M122.6,106.7c-4.3-1.2-15.8-3.9-29.3-3.9s-24.9,2.8-29.3,3.9c-1.1,0.3-1.7,1.3-1.7,2.6v6v0.9v6 c0,1.2,0.7,2.3,1.7,2.6c4.3,1.2,15.8,3.9,29.3,3.9s24.9-2.8,29.3-3.9c1.1-0.3,1.7-1.3,1.7-2.6v-6v-0.9v-6 C124.4,108,123.7,107,122.6,106.7z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M34.4,108.6H0.6v-97c0-2.7,1.5-4.9,3.2-4.9h27.3c1.8,0,3.2,2.2,3.2,4.9C34.4,11.6,34.4,108.6,34.4,108.6z"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M34.4,121.3c0,1.2-0.3,2.3-0.8,2.7c-1.9,1.7-7.3,5.8-16.1,5.8s-14.2-4-16.1-5.8c-0.5-0.4-0.8-1.5-0.8-2.7 v-12.6h33.8C34.4,108.7,34.4,121.3,34.4,121.3z"/> </g> </svg>\');}' : "17" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 185 175" width="185" height="175"> <g class="seat"> <path fill="rgb(235, 235, 235)" d="M185,135c0,0-5.1,40-57.5,40S70,135,70,135V18.4c0-1.7,1.2-3,2.8-3h109.5c1.6,0,2.8,1.3,2.8,3V135H185z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M173,136.8c0,1.3-0.7,2.7-1.9,3.2c-4.8,2.4-18.9,8.3-42.8,7.9c-23.8-0.5-37.8-5.8-42.6-7.9 c-1.2-0.5-2-1.9-2-3.4v-53H173V136.8z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M173,83.6H83.8V8.1c0-1.7,1.2-3.4,2.8-3.5c7.3-1.1,27.6-4,41.9-4s34.7,3,42,4c1.6,0.3,2.8,1.7,2.8,3.5L173,83.6 L173,83.6z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M157.6,106.7c-4.3-1.2-15.8-3.9-29.3-3.9s-24.9,2.8-29.3,3.9c-1.1,0.3-1.7,1.3-1.7,2.6v6v0.9v6 c0,1.2,0.7,2.3,1.7,2.6c4.3,1.2,15.8,3.9,29.3,3.9s24.9-2.8,29.3-3.9c1.1-0.3,1.7-1.3,1.7-2.6v-6v-0.9v-6 C159.4,108,158.7,107,157.6,106.7z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M69.3,108.6H0.6V12.2c0-3.1,2-5.5,4.6-5.5h59.6c2.6,0,4.6,2.4,4.6,5.5L69.3,108.6L69.3,108.6z"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M69.3,121.3c0,1.2-0.8,2.3-1.7,2.7c-3.9,1.7-14.9,5.8-32.7,5.8s-28.8-4-32.7-5.8c-1-0.4-1.6-1.5-1.6-2.7v-12.6 h68.7V121.3z"/> </g> </svg>\');}' : "18" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 185 175" width="185" height="175"> <g class="seat" transform="scale(-1, 1) translate(-185,0)"> <path fill="rgb(235, 235, 235)" d="M185,135c0,0-5.1,40-57.5,40S70,135,70,135V18.4c0-1.7,1.2-3,2.8-3h109.5c1.6,0,2.8,1.3,2.8,3V135H185z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M173,136.8c0,1.3-0.7,2.7-1.9,3.2c-4.8,2.4-18.9,8.3-42.8,7.9c-23.8-0.5-37.8-5.8-42.6-7.9 c-1.2-0.5-2-1.9-2-3.4v-53H173V136.8z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M173,83.6H83.8V8.1c0-1.7,1.2-3.4,2.8-3.5c7.3-1.1,27.6-4,41.9-4s34.7,3,42,4c1.6,0.3,2.8,1.7,2.8,3.5L173,83.6 L173,83.6z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M157.6,106.7c-4.3-1.2-15.8-3.9-29.3-3.9s-24.9,2.8-29.3,3.9c-1.1,0.3-1.7,1.3-1.7,2.6v6v0.9v6 c0,1.2,0.7,2.3,1.7,2.6c4.3,1.2,15.8,3.9,29.3,3.9s24.9-2.8,29.3-3.9c1.1-0.3,1.7-1.3,1.7-2.6v-6v-0.9v-6 C159.4,108,158.7,107,157.6,106.7z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M69.3,108.6H0.6V12.2c0-3.1,2-5.5,4.6-5.5h59.6c2.6,0,4.6,2.4,4.6,5.5L69.3,108.6L69.3,108.6z"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M69.3,121.3c0,1.2-0.8,2.3-1.7,2.7c-3.9,1.7-14.9,5.8-32.7,5.8s-28.8-4-32.7-5.8c-1-0.4-1.6-1.5-1.6-2.7v-12.6 h68.7V121.3z"/> </g> </svg>\');}' : "19" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 255 175" width="255" height="175"> <g class="seat"> <path fill="rgb(235, 235, 235)" d="M185,135c0,0-5.1,40-57.5,40S70,135,70,135V18.4c0-1.7,1.2-3,2.8-3h109.5c1.6,0,2.8,1.3,2.8,3V135H185z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M173,136.8c0,1.3-0.7,2.7-1.9,3.2c-4.8,2.4-18.9,8.3-42.8,7.9c-23.8-0.5-37.8-5.8-42.6-7.9 c-1.2-0.5-2-1.9-2-3.4v-53H173V136.8z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M173,83.6H83.8V8.1c0-1.7,1.2-3.4,2.8-3.5c7.3-1.1,27.6-4,41.9-4s34.7,3,42,4c1.6,0.3,2.8,1.7,2.8,3.5L173,83.6 L173,83.6z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M157.6,106.7c-4.3-1.2-15.8-3.9-29.3-3.9s-24.9,2.8-29.3,3.9c-1.1,0.3-1.7,1.3-1.7,2.6v6v0.9v6 c0,1.2,0.7,2.3,1.7,2.6c4.3,1.2,15.8,3.9,29.3,3.9s24.9-2.8,29.3-3.9c1.1-0.3,1.7-1.3,1.7-2.6v-6v-0.9v-6 C159.4,108,158.7,107,157.6,106.7z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M69.3,108.6H0.6V12.2c0-3.1,2-5.5,4.6-5.5h59.6c2.6,0,4.6,2.4,4.6,5.5L69.3,108.6L69.3,108.6z"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M69.3,121.3c0,1.2-0.8,2.3-1.7,2.7c-3.9,1.7-14.9,5.8-32.7,5.8s-28.8-4-32.7-5.8c-1-0.4-1.6-1.5-1.6-2.7v-12.6 h68.7V121.3z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M254.3,108.6h-68.7V12.2c0-3.1,2-5.5,4.6-5.5h59.6c2.6,0,4.6,2.4,4.6,5.5L254.3,108.6L254.3,108.6z"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M254.3,121.3c0,1.2-0.8,2.3-1.7,2.7c-3.9,1.7-14.9,5.8-32.7,5.8s-28.8-4-32.7-5.8c-1-0.4-1.6-1.5-1.6-2.7v-12.6 h68.7V121.3z"/> </g> </svg>\');}' : "20" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 330" width="130" height="330"> <g class="seat"> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M119.3,307.9L119.3,307.9c0,1.4-0.9,2.7-2.2,3.4c-5.9,2.6-23,9-52.3,8.5c-29.2-0.5-46.2-6.2-52-8.6 c-1.4-0.6-2.3-1.9-2.3-3.5v-38h109L119.3,307.9L119.3,307.9L119.3,307.9z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M13.4,42.7V9h107.7v68.5H54.2c-0.9,0-1.8-0.4-2.6-1L13.4,42.7z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M119.3,269.8H10.4v-70.2c0-1.9,1.4-3.5,3.4-3.7c8.9-1.2,33.7-4.4,51-4.4c17.5,0,42.3,3.1,51.2,4.4 c1.9,0.3,3.4,1.9,3.4,3.7L119.3,269.8L119.3,269.8z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M91.2,286.6c-3.9-0.9-14.3-3.1-26.4-3.1c-12,0-22.5,2.2-26.4,3.1c-0.9,0.3-1.5,1-1.5,2.1v4.9v0.8v4.9 c0,1,0.6,1.8,1.5,2.1c3.9,0.9,14.3,3.1,26.4,3.1s22.5-2.2,26.4-3.1c0.9-0.3,1.5-1,1.5-2.1v-4.9v-0.8v-4.9 C92.8,287.8,92.1,286.9,91.2,286.6z"/> <path fill="rgb(235, 235, 235)" d="M0,330h130V0H0v7c0,1.7,1.3,3,3,3h117v310H10V189.2c0-1.7-1.3-3-3-3H3c-1.7,0-3,1.3-3,3V330z"/> </g> </svg>\');}' : "21" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 330" width="130" height="330"> <g class="seat" transform="scale(-1, 1) translate(-130,0)"> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M119.3,307.9L119.3,307.9c0,1.4-0.9,2.7-2.2,3.4c-5.9,2.6-23,9-52.3,8.5c-29.2-0.5-46.2-6.2-52-8.6 c-1.4-0.6-2.3-1.9-2.3-3.5v-38h109L119.3,307.9L119.3,307.9L119.3,307.9z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M13.4,42.7V9h107.7v68.5H54.2c-0.9,0-1.8-0.4-2.6-1L13.4,42.7z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M119.3,269.8H10.4v-70.2c0-1.9,1.4-3.5,3.4-3.7c8.9-1.2,33.7-4.4,51-4.4c17.5,0,42.3,3.1,51.2,4.4 c1.9,0.3,3.4,1.9,3.4,3.7L119.3,269.8L119.3,269.8z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M91.2,286.6c-3.9-0.9-14.3-3.1-26.4-3.1c-12,0-22.5,2.2-26.4,3.1c-0.9,0.3-1.5,1-1.5,2.1v4.9v0.8v4.9 c0,1,0.6,1.8,1.5,2.1c3.9,0.9,14.3,3.1,26.4,3.1s22.5-2.2,26.4-3.1c0.9-0.3,1.5-1,1.5-2.1v-4.9v-0.8v-4.9 C92.8,287.8,92.1,286.9,91.2,286.6z"/> <path fill="rgb(235, 235, 235)" d="M0,330h130V0H0v7c0,1.7,1.3,3,3,3h117v310H10V189.2c0-1.7-1.3-3-3-3H3c-1.7,0-3,1.3-3,3V330z"/> </g> </svg>\');}' : "22" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 400" width="200" height="400"> <g class="seat"> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M189.8,74.2c0,2.6-1.4,4.9-3.7,6c-9.7,4.4-38,15.5-86.6,14.6C51.4,94,23.3,84.2,13.5,80c-2.4-1.1-3.8-3.4-3.8-6 V8.6h180.4v65.7L189.8,74.2L189.8,74.2z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M7,396h189V6h-24.1c0,0-20.7,141.1-20,152.3c0.9,14.4,14.1,50,12.9,50.2l-7.4,63.2L7,270.5V396z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M165,362.6c0,2.2-1.1,4-2.7,4.9c-7.1,3.6-27.9,12.5-63.6,11.8c-35.4-0.7-56-8.5-63.1-12 c-1.7-0.9-2.8-2.7-2.8-4.9v-52.9h132.4L165,362.6L165,362.6z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M165.2,309.5H32.7v-97.6c0-2.7,1.7-4.9,4.1-5.3c10.8-1.6,40.9-6,62-6c21.2,0,51.4,4.4,62.1,6 c2.4,0.4,4.1,2.7,4.1,5.3C165.2,211.9,165.2,309.5,165.2,309.5z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M135.6,333c-5.5-1.3-19.8-4.4-36.7-4.4c-16.7,0-31.3,3.1-36.7,4.4c-1.3,0.4-2.2,1.5-2.2,2.9v6.7v1.1v6.7 c0,1.5,0.9,2.5,2.2,2.9c5.5,1.3,19.8,4.4,36.7,4.4s31.3-3.1,36.7-4.4c1.3-0.4,2.2-1.5,2.2-2.9v-6.7v-1.1v-6.7 C137.8,334.6,136.9,333.3,135.6,333z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M34.4,348h3.7V230.9c0.1-3.9-2.1-6.9-5.8-7h-3.1c-8.8-0.2-9.2,6.9-9.2,15.8l-0.5,31.6 c-0.1,1.6,0.1,3.3,0.5,4.8l8,66.4C28.4,345.6,31.1,348,34.4,348z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M169.8,342.4l8-66.4c0.5-1.5,0.6-3.2,0.5-4.8l-0.5-31.6c-0.1-8.8-0.4-15.9-9.2-15.8h-3.1 c-3.7,0.1-5.9,3.1-5.8,7V348h3.7C166.7,348,169.4,345.6,169.8,342.4z"/> <path fill="rgb(235, 235, 235)" d="M200,400H0V208.1c0-1.7,1.3-3,3-3h4c1.7,0,3,1.3,3,3V390h180V10H10v78.5c0,1.7-1.3,3-3,3H3c-1.7,0-3-1.3-3-3V0 h200V400z"/> </g> </svg>\');}' : "23" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 400" width="200" height="400"> <g class="seat" transform="scale(-1, 1) translate(-200,0)"> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M189.8,74.2c0,2.6-1.4,4.9-3.7,6c-9.7,4.4-38,15.5-86.6,14.6C51.4,94,23.3,84.2,13.5,80c-2.4-1.1-3.8-3.4-3.8-6 V8.6h180.4v65.7L189.8,74.2L189.8,74.2z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M7,396h189V6h-24.1c0,0-20.7,141.1-20,152.3c0.9,14.4,14.1,50,12.9,50.2l-7.4,63.2L7,270.5V396z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M165,362.6c0,2.2-1.1,4-2.7,4.9c-7.1,3.6-27.9,12.5-63.6,11.8c-35.4-0.7-56-8.5-63.1-12 c-1.7-0.9-2.8-2.7-2.8-4.9v-52.9h132.4L165,362.6L165,362.6z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M165.2,309.5H32.7v-97.6c0-2.7,1.7-4.9,4.1-5.3c10.8-1.6,40.9-6,62-6c21.2,0,51.4,4.4,62.1,6 c2.4,0.4,4.1,2.7,4.1,5.3C165.2,211.9,165.2,309.5,165.2,309.5z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M135.6,333c-5.5-1.3-19.8-4.4-36.7-4.4c-16.7,0-31.3,3.1-36.7,4.4c-1.3,0.4-2.2,1.5-2.2,2.9v6.7v1.1v6.7 c0,1.5,0.9,2.5,2.2,2.9c5.5,1.3,19.8,4.4,36.7,4.4s31.3-3.1,36.7-4.4c1.3-0.4,2.2-1.5,2.2-2.9v-6.7v-1.1v-6.7 C137.8,334.6,136.9,333.3,135.6,333z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M34.4,348h3.7V230.9c0.1-3.9-2.1-6.9-5.8-7h-3.1c-8.8-0.2-9.2,6.9-9.2,15.8l-0.5,31.6 c-0.1,1.6,0.1,3.3,0.5,4.8l8,66.4C28.4,345.6,31.1,348,34.4,348z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M169.8,342.4l8-66.4c0.5-1.5,0.6-3.2,0.5-4.8l-0.5-31.6c-0.1-8.8-0.4-15.9-9.2-15.8h-3.1 c-3.7,0.1-5.9,3.1-5.8,7V348h3.7C166.7,348,169.4,345.6,169.8,342.4z"/> <path fill="rgb(235, 235, 235)" d="M200,400H0V208.1c0-1.7,1.3-3,3-3h4c1.7,0,3,1.3,3,3V390h180V10H10v78.5c0,1.7-1.3,3-3,3H3c-1.7,0-3-1.3-3-3V0 h200V400z"/> </g> </svg>\');}' : "24" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 365" width="200" height="365"> <g class="seat"> <rect x="4" y="254.4" fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" width="190" height="105.6"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M8.2,304.5l1-72.9c0-1.8,0.3-3.7,0.6-5.4l8.5-33c2.4-9.2,11.8-14.7,21-12.5l3.3,0.8c4.1,1,6.5,4.8,5.5,8.9 L17.9,312.7l-3.8-1C10.5,310.9,8.2,308,8.2,304.5z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M181.8,111.1c-0.3,1.3-2,2.2-3.9,1.9c-8.9-1.3-33.7-4.5-50.6-8.3S86.9,93.2,78.5,90.5c-1.8-0.6-2.9-2.1-2.4-3.4 L93.4,6.3l101.1-0.7L181.8,111.1z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M65.9,112.4L6.9,99L7.7,6.8h121.8L70.5,110c-0.6,1.4-1.9,2.4-3.5,2.4C66.5,112.4,66.2,112.4,65.9,112.4z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M194.6,293.5l-72.8-18.2l10.4-62.2c0,0,41.2-27.1,45.8-47.1S167,5.5,167,5.5l27.5,0.1L194.6,293.5L194.6,293.5z "/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M32.5,253.8L142,281.1l-18.5,69.8c-0.4,1.7-1.7,2.8-3.3,3.1c-6.5,0.8-25.1,2.3-54.4-4.5 C36.2,342.7,20.6,332,15.5,328c-1.3-1-1.8-2.7-1.4-4.1L32.5,253.8z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M55.3,162.6c0.4-2,2.3-3.3,4.3-3.1c9.4,1,35,4.1,52.5,8.4c17.7,4.3,41.8,13.6,50.3,17.1 c1.8,0.8,2.8,2.7,2.4,4.7l-23.1,90.8L32.5,253.2L55.3,162.6z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M45.3,311.3l-1.3,4.8l-0.3,0.8l-1.3,4.8c-0.4,1,0.3,2,1,2.4c3.7,2,13.6,6.8,25.6,9.8 c12.2,3.1,23.2,3.4,27.3,3.4c1,0,2-0.6,2.3-1.7l1.3-4.8l0.3-0.8l1.3-4.8c0.4-1-0.3-2-1-2.4c-3.7-2-13.6-6.8-25.6-9.8 c-12.2-3.1-23.2-3.4-27.3-3.4C46.5,309.6,45.5,310.4,45.3,311.3z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M138.4,337.3l34.3-64.5c0.9-1.4,1.5-3.2,1.9-4.8l8.4-32.9c2.4-9.2-3.2-18.6-12.4-20.9l-3.2-0.9 c-3.8-0.9-8,1.3-9,5.4l-32,121.5l3.8,1C133.7,342.1,137.1,340.4,138.4,337.3z"/> <path fill="rgb(235, 235, 235)" d="M200,365H0V184.7c0-1.7,1.3-3,3-3h5c1.6,0,3,1.3,3,3V354h178.1V11H11v99.4c0,1.7-1.3,3-3,3H3c-1.6,0-3-1.3-3-3 V0h200V365z"/> </g> </svg>\');}' : "25" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 365" width="200" height="365"> <g class="seat" transform="scale(-1, 1) translate(-200,0)"> <rect x="4" y="254.4" fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" width="190" height="105.6"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M8.2,304.5l1-72.9c0-1.8,0.3-3.7,0.6-5.4l8.5-33c2.4-9.2,11.8-14.7,21-12.5l3.3,0.8c4.1,1,6.5,4.8,5.5,8.9 L17.9,312.7l-3.8-1C10.5,310.9,8.2,308,8.2,304.5z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M181.8,111.1c-0.3,1.3-2,2.2-3.9,1.9c-8.9-1.3-33.7-4.5-50.6-8.3S86.9,93.2,78.5,90.5c-1.8-0.6-2.9-2.1-2.4-3.4 L93.4,6.3l101.1-0.7L181.8,111.1z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M65.9,112.4L6.9,99L7.7,6.8h121.8L70.5,110c-0.6,1.4-1.9,2.4-3.5,2.4C66.5,112.4,66.2,112.4,65.9,112.4z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M194.6,293.5l-72.8-18.2l10.4-62.2c0,0,41.2-27.1,45.8-47.1S167,5.5,167,5.5l27.5,0.1L194.6,293.5L194.6,293.5z "/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M32.5,253.8L142,281.1l-18.5,69.8c-0.4,1.7-1.7,2.8-3.3,3.1c-6.5,0.8-25.1,2.3-54.4-4.5 C36.2,342.7,20.6,332,15.5,328c-1.3-1-1.8-2.7-1.4-4.1L32.5,253.8z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M55.3,162.6c0.4-2,2.3-3.3,4.3-3.1c9.4,1,35,4.1,52.5,8.4c17.7,4.3,41.8,13.6,50.3,17.1 c1.8,0.8,2.8,2.7,2.4,4.7l-23.1,90.8L32.5,253.2L55.3,162.6z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M45.3,311.3l-1.3,4.8l-0.3,0.8l-1.3,4.8c-0.4,1,0.3,2,1,2.4c3.7,2,13.6,6.8,25.6,9.8 c12.2,3.1,23.2,3.4,27.3,3.4c1,0,2-0.6,2.3-1.7l1.3-4.8l0.3-0.8l1.3-4.8c0.4-1-0.3-2-1-2.4c-3.7-2-13.6-6.8-25.6-9.8 c-12.2-3.1-23.2-3.4-27.3-3.4C46.5,309.6,45.5,310.4,45.3,311.3z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M138.4,337.3l34.3-64.5c0.9-1.4,1.5-3.2,1.9-4.8l8.4-32.9c2.4-9.2-3.2-18.6-12.4-20.9l-3.2-0.9 c-3.8-0.9-8,1.3-9,5.4l-32,121.5l3.8,1C133.7,342.1,137.1,340.4,138.4,337.3z"/> <path fill="rgb(235, 235, 235)" d="M200,365H0V184.7c0-1.7,1.3-3,3-3h5c1.6,0,3,1.3,3,3V354h178.1V11H11v99.4c0,1.7-1.3,3-3,3H3c-1.6,0-3-1.3-3-3 V0h200V365z"/> </g> </svg>\');}' : "26" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"> <g class="seat"> <rect x="9.9" y="83.4" fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" width="188.9" height="87.5"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M133.6,111.3l0-96.5c0-7.8,6.3-14.2,13.8-14.2h52v83.9L133.6,111.3z"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M75,199.4c-1.1,0-2.1,0-3.3-0.1c-29.6-0.3-46.2-5.3-50.5-6.8c-1.3-0.4-2-1.4-2-2.4v-18.9h105v19.1 c0,0.9-0.8,2-2,2.4C115.6,195.2,100.2,199.4,75,199.4L75,199.4z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M12.1,152.9c-1.5-0.5-2.3-1.7-2.3-3.1v-39.5 h123.7v39.3c0,1.3-1.1,2.7-2.4,3.1c-6.8,2.5-26.1,8.3-59.5,8.7c-1.5,0-2.8,0-4.3,0C36.4,161.5,18.4,155.4,12.1,152.9z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M9.9,111.5V50.3c0-1.7,1.5-3.1,3.3-3.5c25.3-2.9,45.1-4.5,58.5-4.5c22.7,0,54.8,4,58.4,4.5 c2,0.3,3.5,1.7,3.5,3.5l0,61.2H9.9z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M40.5,129.4v4.8v0.7v4.8c0,1.1,0.8,1.9,1.9,2c4.3,0.9,16,3.1,29.3,3.1s24.9-2.3,29.3-3.1 c1.1-0.3,1.9-1.1,1.9-2v-4.8v-0.7v-4.8c0-1.1-0.8-1.9-1.9-2c-4.3-0.9-16-3.1-29.3-3.1s-24.9,2.3-29.3,3.1 C41.2,127.5,40.5,128.3,40.5,129.4z"/> <path fill="rgb(235, 235, 235)" d="M197,81.3h-4c-1.7,0-3,1.3-3,3v80h-84.5h-61H10 v-99c0-1.7-1.3-3-3-3H3c-1.7,0-3,1.3-3,3l0,109h44.1h61.8H200v-90C200,82.6,198.7,81.3,197,81.3z"/> </g> </svg>\');}' : "27" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"> <g class="seat" transform="scale(-1, 1) translate(-200,0)"> <rect x="9.9" y="83.4" fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" width="188.9" height="87.5"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M133.6,111.3l0-96.5c0-7.8,6.3-14.2,13.8-14.2h52v83.9L133.6,111.3z"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M75,199.4c-1.1,0-2.1,0-3.3-0.1c-29.6-0.3-46.2-5.3-50.5-6.8c-1.3-0.4-2-1.4-2-2.4v-18.9h105v19.1 c0,0.9-0.8,2-2,2.4C115.6,195.2,100.2,199.4,75,199.4L75,199.4z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M12.1,152.9c-1.5-0.5-2.3-1.7-2.3-3.1v-39.5 h123.7v39.3c0,1.3-1.1,2.7-2.4,3.1c-6.8,2.5-26.1,8.3-59.5,8.7c-1.5,0-2.8,0-4.3,0C36.4,161.5,18.4,155.4,12.1,152.9z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M9.9,111.5V50.3c0-1.7,1.5-3.1,3.3-3.5c25.3-2.9,45.1-4.5,58.5-4.5c22.7,0,54.8,4,58.4,4.5 c2,0.3,3.5,1.7,3.5,3.5l0,61.2H9.9z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M40.5,129.4v4.8v0.7v4.8c0,1.1,0.8,1.9,1.9,2c4.3,0.9,16,3.1,29.3,3.1s24.9-2.3,29.3-3.1 c1.1-0.3,1.9-1.1,1.9-2v-4.8v-0.7v-4.8c0-1.1-0.8-1.9-1.9-2c-4.3-0.9-16-3.1-29.3-3.1s-24.9,2.3-29.3,3.1 C41.2,127.5,40.5,128.3,40.5,129.4z"/> <path fill="rgb(235, 235, 235)" d="M197,81.3h-4c-1.7,0-3,1.3-3,3v80h-84.5h-61H10 v-99c0-1.7-1.3-3-3-3H3c-1.7,0-3,1.3-3,3l0,109h44.1h61.8H200v-90C200,82.6,198.7,81.3,197,81.3z"/> </g> </svg>\');}' : "28" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"> <g class="seat"> <rect fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" x="0.6" y="115.3" width="198.8" height="84.1"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M133.4,80l-0.6,35.7l66.6,9.8V89.9c0,0-11.2-3.2-18-5C169.8,81.7,133.4,80,133.4,80z"/> <rect fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" x="0.6" y="0.6" width="105.4" height="16.1"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M101.1,1l2.3,39.8l96,6.5l-0.1-46.7H101L101.1,1z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M7.5,180.6L1,119.1c-0.3-1.4-0.5-3-0.4-4.4L1,85.4c0-8.2,0.3-14.8,7.4-14.6H11c3,0.1,4.8,2.9,4.7,6.5v108.4h-3C10,185.7,7.8,183.4,7.5,180.6L7.5,180.6z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M135.9,180.6l6.5-61.5c0.3-1.4,0.5-3,0.4-4.4l-0.4-29.2c0-8.2-0.3-14.8-7.4-14.6h-2.5c-3,0.1-4.8,2.9-4.7,6.5v108.4h3C133.4,185.7,135.6,183.4,135.9,180.6L135.9,180.6z"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M24.4,0.9l-0.6,15.8L0.6,19.3V0.7l23.8-0.1V0.9z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M75.3,196.8c-1.3,0-2.5,0-3.9,0c-30.2-0.4-47.7-5.6-53.8-7.8c-1.2-0.4-2.2-1.6-2.2-2.8v-41.6h112v41.7c0,1.2-0.7,2.3-2.1,2.8C119.7,191.4,103.4,196.9,75.3,196.8z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M15.5,144.7V82.3c0-1.6,1.3-2.9,3.1-3.1c3.3-0.5,32.3-4.1,52.8-4.1c12.2,0,30,1.4,53,4.1c1.7,0.4,3,1.6,3,3.1v62.4L15.5,144.7L15.5,144.7z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M98,163c-4-0.7-14.5-2.8-26.5-2.8S48.8,162.1,45,163c-1,0.1-1.7,0.8-1.7,1.8v4.3v0.6v4.3c0,0.8,0.7,1.6,1.7,1.8c4,0.7,14.5,2.8,26.5,2.8s22.7-1.9,26.5-2.8c1-0.1,1.7-0.8,1.7-1.8v-4.3v-0.6v-4.3C99.7,163.9,99.1,163.2,98,163z"/> </g> </svg>\');}' : "29" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"> <g class="seat" transform="scale(-1, 1) translate(-200,0)"> <rect fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" x="0.6" y="115.3" width="198.8" height="84.1"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M133.4,80l-0.6,35.7l66.6,9.8V89.9c0,0-11.2-3.2-18-5C169.8,81.7,133.4,80,133.4,80z"/> <rect fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" x="0.6" y="0.6" width="105.4" height="16.1"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M101.1,1l2.3,39.8l96,6.5l-0.1-46.7H101L101.1,1z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M7.5,180.6L1,119.1c-0.3-1.4-0.5-3-0.4-4.4L1,85.4c0-8.2,0.3-14.8,7.4-14.6H11c3,0.1,4.8,2.9,4.7,6.5v108.4h-3C10,185.7,7.8,183.4,7.5,180.6L7.5,180.6z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M135.9,180.6l6.5-61.5c0.3-1.4,0.5-3,0.4-4.4l-0.4-29.2c0-8.2-0.3-14.8-7.4-14.6h-2.5c-3,0.1-4.8,2.9-4.7,6.5v108.4h3C133.4,185.7,135.6,183.4,135.9,180.6L135.9,180.6z"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M24.4,0.9l-0.6,15.8L0.6,19.3V0.7l23.8-0.1V0.9z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M75.3,196.8c-1.3,0-2.5,0-3.9,0c-30.2-0.4-47.7-5.6-53.8-7.8c-1.2-0.4-2.2-1.6-2.2-2.8v-41.6h112v41.7c0,1.2-0.7,2.3-2.1,2.8C119.7,191.4,103.4,196.9,75.3,196.8z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M15.5,144.7V82.3c0-1.6,1.3-2.9,3.1-3.1c3.3-0.5,32.3-4.1,52.8-4.1c12.2,0,30,1.4,53,4.1c1.7,0.4,3,1.6,3,3.1v62.4L15.5,144.7L15.5,144.7z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M98,163c-4-0.7-14.5-2.8-26.5-2.8S48.8,162.1,45,163c-1,0.1-1.7,0.8-1.7,1.8v4.3v0.6v4.3c0,0.8,0.7,1.6,1.7,1.8c4,0.7,14.5,2.8,26.5,2.8s22.7-1.9,26.5-2.8c1-0.1,1.7-0.8,1.7-1.8v-4.3v-0.6v-4.3C99.7,163.9,99.1,163.2,98,163z"/> </g> </svg>\');}' : "30" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 265" width="200" height="265"> <g class="seat"> <rect fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" x="0.6" y="0.6" width="105.4" height="66.9"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M103.4,91.6l96,6.5V0.6H99L103.4,91.6z"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M26.4,0.6l-2.6,66.9L0.6,80.1V0.6H26.4z"/> <rect fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" x="0.6" y="180.3" width="198.8" height="84.1"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M133.4,145l-0.6,35.7l66.6,9.8v-35.6c0,0-11.2-3.2-18-5C169.8,146.7,133.4,145,133.4,145z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M7.5,245.6L1,184.1c-0.3-1.4-0.5-3-0.4-4.4L1,150.4c0-8.2,0.3-14.8,7.4-14.6H11c3,0.1,4.8,2.9,4.7,6.5v108.4h-3C10,250.7,7.8,248.4,7.5,245.6L7.5,245.6z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M135.9,245.6l6.5-61.5c0.3-1.4,0.5-3,0.4-4.4l-0.4-29.2c0-8.2-0.3-14.8-7.4-14.6h-2.5c-3,0.1-4.8,2.9-4.7,6.5v108.4h3C133.4,250.7,135.6,248.4,135.9,245.6L135.9,245.6z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M75.3,261.8c-1.3,0-2.5,0-3.9,0c-30.2-0.4-47.7-5.6-53.8-7.8c-1.2-0.4-2.2-1.6-2.2-2.8v-41.6h112v41.7c0,1.2-0.7,2.3-2.1,2.8C119.7,256.4,103.4,261.9,75.3,261.8z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M15.5,209.7v-62.4c0-1.6,1.3-2.9,3.1-3.1c3.3-0.5,32.3-4.1,52.8-4.1c12.2,0,30,1.4,53,4.1c1.7,0.4,3,1.6,3,3.1v62.4L15.5,209.7L15.5,209.7z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M98,228c-4-0.7-14.5-2.8-26.5-2.8S48.8,227.1,45,228c-1,0.1-1.7,0.8-1.7,1.8v4.3v0.6v4.3c0,0.8,0.7,1.6,1.7,1.8c4,0.7,14.5,2.8,26.5,2.8s22.7-1.9,26.5-2.8c1-0.1,1.7-0.8,1.7-1.8v-4.3v-0.6v-4.3C99.7,228.9,99.1,228.2,98,228z"/> </g> </svg>\');}' : "31" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 265" width="200" height="265"> <g class="seat" transform="scale(-1, 1) translate(-200,0)"> <rect fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" x="0.6" y="0.6" width="105.4" height="66.9"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M103.4,91.6l96,6.5V0.6H99L103.4,91.6z"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M26.4,0.6l-2.6,66.9L0.6,80.1V0.6H26.4z"/> <rect fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" x="0.6" y="180.3" width="198.8" height="84.1"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M133.4,145l-0.6,35.7l66.6,9.8v-35.6c0,0-11.2-3.2-18-5C169.8,146.7,133.4,145,133.4,145z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M7.5,245.6L1,184.1c-0.3-1.4-0.5-3-0.4-4.4L1,150.4c0-8.2,0.3-14.8,7.4-14.6H11c3,0.1,4.8,2.9,4.7,6.5v108.4h-3C10,250.7,7.8,248.4,7.5,245.6L7.5,245.6z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M135.9,245.6l6.5-61.5c0.3-1.4,0.5-3,0.4-4.4l-0.4-29.2c0-8.2-0.3-14.8-7.4-14.6h-2.5c-3,0.1-4.8,2.9-4.7,6.5v108.4h3C133.4,250.7,135.6,248.4,135.9,245.6L135.9,245.6z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M75.3,261.8c-1.3,0-2.5,0-3.9,0c-30.2-0.4-47.7-5.6-53.8-7.8c-1.2-0.4-2.2-1.6-2.2-2.8v-41.6h112v41.7c0,1.2-0.7,2.3-2.1,2.8C119.7,256.4,103.4,261.9,75.3,261.8z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M15.5,209.7v-62.4c0-1.6,1.3-2.9,3.1-3.1c3.3-0.5,32.3-4.1,52.8-4.1c12.2,0,30,1.4,53,4.1c1.7,0.4,3,1.6,3,3.1v62.4L15.5,209.7L15.5,209.7z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M98,228c-4-0.7-14.5-2.8-26.5-2.8S48.8,227.1,45,228c-1,0.1-1.7,0.8-1.7,1.8v4.3v0.6v4.3c0,0.8,0.7,1.6,1.7,1.8c4,0.7,14.5,2.8,26.5,2.8s22.7-1.9,26.5-2.8c1-0.1,1.7-0.8,1.7-1.8v-4.3v-0.6v-4.3C99.7,228.9,99.1,228.2,98,228z"/> </g> </svg>\');}' : "32" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 330" width="200" height="330"> <g class="seat"> <rect fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" x="0.6" y="0.6" width="105.4" height="66.9"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M103.4,91.6l96,6.5V0.6H99L103.4,91.6z"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M26.4,0.6l-2.6,66.9L0.6,80.1V0.6H26.4z"/> <rect fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" x="0.6" y="213.4" width="198.8" height="116"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M133.4,181.6l-0.6,45.7l66.6,9.8v-45.6c0,0-11.2-3.2-18-5C169.8,183.3,133.4,181.6,133.4,181.6z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M7.5,289.5c0,0-7-64.4-6.9-65.9L1,174.4c0-8.2,0.3-14.8,7.4-14.6H11c3,0.1,4.8,2.9,4.7,6.5v128.4h-3C10,294.6,7.8,292.4,7.5,289.5L7.5,289.5z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M135.8,289.4c-0.3,2.9-2.5,5.1-5.2,5.1h-3V166.1c-0.1-3.6,1.7-6.4,4.7-6.5h2.5c7.1-0.2,7.4,6.4,7.4,14.6l0.4,49.2C142.7,225,135.8,289.4,135.8,289.4L135.8,289.4z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M75.5,307.7c-1.3,0-2.5,0-3.9,0c-30.2-0.4-47.7-5.6-53.8-7.8c-1.2-0.4-2.2-1.6-2.2-2.8v-41.6h112v41.7c0,1.2-0.7,2.3-2.1,2.8C119.9,302.2,103.6,307.8,75.5,307.7z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M15.6,255.5v-83.4c0-1.6,1.3-2.9,3.1-3.1c3.3-0.5,32.3-4.1,52.8-4.1c12.2,0,30,1.4,53,4.1c1.7,0.4,3,1.6,3,3.1v83.4H15.6z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M98.2,273.9c-4-0.7-14.5-2.8-26.5-2.8S49,273,45.2,273.9c-1,0.1-1.7,0.8-1.7,1.8v4.3v0.6v4.3c0,0.8,0.7,1.6,1.7,1.8c4,0.7,14.5,2.8,26.5,2.8s22.7-1.9,26.5-2.8c1-0.1,1.7-0.8,1.7-1.8v-4.3V280v-4.3C99.8,274.7,99.2,274,98.2,273.9z"/> </g> </svg>\');}' : "33" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 330" width="200" height="330"> <g class="seat" transform="scale(-1, 1) translate(-200,0)"> <rect fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" x="0.6" y="0.6" width="105.4" height="66.9"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M103.4,91.6l96,6.5V0.6H99L103.4,91.6z"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M26.4,0.6l-2.6,66.9L0.6,80.1V0.6H26.4z"/> <rect fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" x="0.6" y="213.4" width="198.8" height="116"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M133.4,181.6l-0.6,45.7l66.6,9.8v-45.6c0,0-11.2-3.2-18-5C169.8,183.3,133.4,181.6,133.4,181.6z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M7.5,289.5c0,0-7-64.4-6.9-65.9L1,174.4c0-8.2,0.3-14.8,7.4-14.6H11c3,0.1,4.8,2.9,4.7,6.5v128.4h-3C10,294.6,7.8,292.4,7.5,289.5L7.5,289.5z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M135.8,289.4c-0.3,2.9-2.5,5.1-5.2,5.1h-3V166.1c-0.1-3.6,1.7-6.4,4.7-6.5h2.5c7.1-0.2,7.4,6.4,7.4,14.6l0.4,49.2C142.7,225,135.8,289.4,135.8,289.4L135.8,289.4z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M75.5,307.7c-1.3,0-2.5,0-3.9,0c-30.2-0.4-47.7-5.6-53.8-7.8c-1.2-0.4-2.2-1.6-2.2-2.8v-41.6h112v41.7c0,1.2-0.7,2.3-2.1,2.8C119.9,302.2,103.6,307.8,75.5,307.7z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M15.6,255.5v-83.4c0-1.6,1.3-2.9,3.1-3.1c3.3-0.5,32.3-4.1,52.8-4.1c12.2,0,30,1.4,53,4.1c1.7,0.4,3,1.6,3,3.1v83.4H15.6z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M98.2,273.9c-4-0.7-14.5-2.8-26.5-2.8S49,273,45.2,273.9c-1,0.1-1.7,0.8-1.7,1.8v4.3v0.6v4.3c0,0.8,0.7,1.6,1.7,1.8c4,0.7,14.5,2.8,26.5,2.8s22.7-1.9,26.5-2.8c1-0.1,1.7-0.8,1.7-1.8v-4.3V280v-4.3C99.8,274.7,99.2,274,98.2,273.9z"/> </g> </svg>\');}' : "34" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"> <g class="seat" transform="scale(-1, 1) translate(-200,0)"> <polygon fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" points="101,12.4 101,0.6 195,0.6 195,49.3 151.7,49.3 "/> <path fill="rgb(235, 235, 235)" d="M200,53.7h-44.7c-1.9,0-3.7-0.6-5.2-1.6L99.3,17.5c-2.7-1.9-4.3-5-4.3-8.4V0h9.5v9.1l50.8,34.6h35.1V0h9.5V53.7z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M197.4,89.1v73.2l-52.3,29.8l-80.4,5L5.2,118.7V39h7.1c1.2,0,2.4,0.9,2.8,2.1l15.3,40.1l95.8,7.9H197.4L197.4,89.1z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M154.4,152.7L154.4,152.7c0.6,1.4,0.4,2.9-0.5,3.9c-3.5,4.3-14.1,15.6-36.7,23.9c-22.4,8.2-37.5,7.9-42.9,7.3c-1.3-0.2-2.5-1.1-3.1-2.7l-14.3-36.4l83.2-32.7L154.4,152.7L154.4,152.7L154.4,152.7z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M140,116l-83.1,32.7L30.5,81.2c-0.7-1.8-0.3-3.8,1.2-4.6c6.4-3.9,24.1-14.3,37.3-19.5c13.3-5.3,33.4-9.7,40.7-11.2c1.5-0.3,3.3,0.8,4,2.6l26.5,67.4L140,116z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M124.9,140.6c-3.3,0.3-12,1.3-21.3,4.9c-9.2,3.6-16.3,8.8-19,10.9c-0.6,0.6-0.8,1.4-0.4,2.5l1.8,4.7l0.3,0.8l1.8,4.7c0.4,1,1.2,1.6,2,1.6c3.3-0.3,12-1.3,21.3-4.9s16.3-8.8,19-10.9c0.6-0.6,0.8-1.4,0.4-2.5l-1.8-4.7l-0.3-0.8l-1.8-4.7C126.6,141.3,125.7,140.6,124.9,140.6z"/> <path fill="rgb(235, 235, 235)" d="M0,38.4l0,77.3c0,1.7,0.5,3.4,1.6,4.8L62,200H135c4.6,0,9-1.2,12.9-3.6l52.1-31.6v-2.7l0,0V88.5h-5v67.6l-52.4,31.8c-2.3,1.5-5,2.2-7.7,2.2h-68l-57-75V38.4H0z"/> </g> </svg>\');}' : "35" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"> <g class="seat"> <polygon fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" points="101,12.4 101,0.6 195,0.6 195,49.3 151.7,49.3 "/> <path fill="rgb(235, 235, 235)" d="M200,53.7h-44.7c-1.9,0-3.7-0.6-5.2-1.6L99.3,17.5c-2.7-1.9-4.3-5-4.3-8.4V0h9.5v9.1l50.8,34.6h35.1V0h9.5V53.7z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M197.4,89.1v73.2l-52.3,29.8l-80.4,5L5.2,118.7V39h7.1c1.2,0,2.4,0.9,2.8,2.1l15.3,40.1l95.8,7.9H197.4L197.4,89.1z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M154.4,152.7L154.4,152.7c0.6,1.4,0.4,2.9-0.5,3.9c-3.5,4.3-14.1,15.6-36.7,23.9c-22.4,8.2-37.5,7.9-42.9,7.3c-1.3-0.2-2.5-1.1-3.1-2.7l-14.3-36.4l83.2-32.7L154.4,152.7L154.4,152.7L154.4,152.7z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M140,116l-83.1,32.7L30.5,81.2c-0.7-1.8-0.3-3.8,1.2-4.6c6.4-3.9,24.1-14.3,37.3-19.5c13.3-5.3,33.4-9.7,40.7-11.2c1.5-0.3,3.3,0.8,4,2.6l26.5,67.4L140,116z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M124.9,140.6c-3.3,0.3-12,1.3-21.3,4.9c-9.2,3.6-16.3,8.8-19,10.9c-0.6,0.6-0.8,1.4-0.4,2.5l1.8,4.7l0.3,0.8l1.8,4.7c0.4,1,1.2,1.6,2,1.6c3.3-0.3,12-1.3,21.3-4.9s16.3-8.8,19-10.9c0.6-0.6,0.8-1.4,0.4-2.5l-1.8-4.7l-0.3-0.8l-1.8-4.7C126.6,141.3,125.7,140.6,124.9,140.6z"/> <path fill="rgb(235, 235, 235)" d="M0,38.4l0,77.3c0,1.7,0.5,3.4,1.6,4.8L62,200H135c4.6,0,9-1.2,12.9-3.6l52.1-31.6v-2.7l0,0V88.5h-5v67.6l-52.4,31.8c-2.3,1.5-5,2.2-7.7,2.2h-68l-57-75V38.4H0z"/> </g> </svg>\');}' : "36" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 435" width="550" height="435"> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M7.8,4.1h101l-0.1,147.5v47.5L87.8,280v150.5H7.9L7.8,4.1z"/> <rect fill="' + soy.$$escapeHtml(a.fillColor) + '" x="46.3" y="6.9" width="67.2" height="145.6"/> <rect fill="' + soy.$$escapeHtml(a.fillColor) + '" x="110.3" y="6.9" width="379.7" height="145.6"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M507.1,427c0,0-20.1-82.5-20.2-82.7c-1-0.3-59.1,1-98.5,15.1c-18.5,6.6-41.1,15.7-59.9,29.1V426L507.1,427z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M91.7,33.2c1.6,7.1,5.5,25.5,5.5,47.2c0,21.5-3.8,40.2-5.5,47.2c-0.5,1.7-1.9,2.8-3.6,2.8h-8.3h-1.4h-8.3c-1.9,0-3.1-1.2-3.6-2.8c-1.6-7.1-5.5-25.5-5.5-47.2s3.8-40.2,5.5-47.2c0.5-1.7,1.9-2.8,3.6-2.8h8.3h1.4h8.3C89.7,30.4,91.3,31.6,91.7,33.2z"/> <path fill="none" stroke="rgb(147, 147, 147)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" d="M180.4,152.4l-70-74.8"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M148.2,390.8c0,2.2,1.1,4,2.7,4.9c7.1,3.6,27.9,12.5,63.6,11.8c35.4-0.7,56-8.5,63.1-12c1.7-0.9,2.8-2.7,2.8-4.9v-52.9H148L148.2,390.8L148.2,390.8z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M148,337.7h132.5v-97.6c0-2.7-1.7-4.9-4.1-5.3c-10.8-1.6-40.9-6-62-6c-21.2,0-51.4,4.4-62.1,6c-2.4,0.4-4.1,2.7-4.1,5.3C148,240.1,148,337.7,148,337.7z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M177.6,361.2c5.5-1.3,19.8-4.4,36.7-4.4c16.7,0,31.3,3.1,36.7,4.4c1.3,0.4,2.2,1.5,2.2,2.9v6.7v1.1v6.7c0,1.5-0.9,2.5-2.2,2.9c-5.5,1.3-19.8,4.4-36.7,4.4s-31.3-3.1-36.7-4.4c-1.3-0.4-2.2-1.5-2.2-2.9v-6.7v-1.1v-6.7C175.4,362.8,176.3,361.5,177.6,361.2z"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M278.8,376.2h-3.7V259.1c-0.1-3.9,2.1-6.9,5.8-7h3.1c8.8-0.2,9.2,6.9,9.2,15.8l0.5,31.6c0.1,1.6-0.1,3.3-0.5,4.8l-8,66.4C284.8,373.8,282.1,376.2,278.8,376.2z"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M143.4,370.6l-8-66.4c-0.5-1.5-0.6-3.2-0.5-4.8l0.5-31.6c0.1-8.8,0.4-15.9,9.2-15.8h3.1c3.7,0.1,5.9,3.1,5.8,7v117.2h-3.7C146.5,376.2,143.8,373.8,143.4,370.6z"/> <line fill="none" stroke="rgb(147, 147, 147)" stroke-width="2" stroke-miterlimit="4.8" x1="110.4" y1="5.6" x2="110.4" y2="151.9"/> <line fill="none" stroke="rgb(147, 147, 147)" stroke-width="2" stroke-miterlimit="4.8" x1="480.1" y1="5.6" x2="480.1" y2="151.9"/> <polyline fill="none" stroke="rgb(147, 147, 147)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" points="46.9,5.9 46.9,151.5 481.1,151.5"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M480.7,192.6h29.9h29.9V98.8V5h-29.9h-29.9v93.8V192.6z"/> <line fill="none" stroke="rgb(147, 147, 147)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" x1="480.7" y1="191.6" x2="543.5" y2="191.6"/> <path fill="rgb(235, 235, 235)" d="M543,400h4c1.7,0,3,1.3,3,3v32H200h-33.6H0V200v-27.3V0h180h20h350v220c0,1.7-1.3,3-3,3h-4c-1.7,0-3-1.3-3-3V10H197h-7H10v172.7v7.3v235h166.4H190h350v-22C540,401.3,541.3,400,543,400z"/> <path fill="rgb(235, 235, 235)" d="M533.4,105.9c-0.7-1.1-1.9-1.9-3.4-2l-18.9-3.4v-3.8c3-0.3,5.3-2.8,5.3-5.8c0-3.2-2.6-5.9-5.9-5.9s-5.9,2.6-5.9,5.9c0,0.3,0.3,0.6,0.6,0.6s0.6-0.3,0.6-0.6c0-2.6,2.1-4.7,4.7-4.7c2.6,0,4.7,2.1,4.7,4.7s-2.1,4.7-4.7,4.7c-0.3,0-0.6,0.3-0.6,0.6v4.3l-19.4,3.5c-1.5,0.2-2.8,1-3.4,2c-0.5,0.9-0.6,1.8-0.2,2.8l1.9,3.9h43l1.9-4C534,107.7,533.9,106.8,533.4,105.9z M532.6,108.2l-1.6,3.3h-41.5l-1.5-3.2c-0.3-0.7-0.1-1.3,0.2-1.7c0.5-0.8,1.4-1.3,2.6-1.5l19.5-3.5l19.6,3.5c1.1,0.1,2.1,0.7,2.5,1.5C532.6,106.9,532.8,107.5,532.6,108.2z"/> </svg>\');}' : "37" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 435" width="550" height="435"> <g class="seat"> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M542.1,430.5h-79.9V280l-20.8-80.9v-47.5L441.3,4.1h101L542.1,430.5z"/> <polygon fill="' + soy.$$escapeHtml(a.fillColor) + '" points="439.7,6.9 436.5,6.9 60,6.9 60,152.5 436.5,152.5 439.7,152.5 503.7,152.5 503.7,6.9 "/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M221.5,426v-37.5c-18.8-13.4-41.3-22.5-59.9-29.1c-39.4-14.1-97.6-15.5-98.5-15.1C63,344.5,42.9,427,42.9,427L221.5,426z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M461.9,30.4h8.3h1.4h8.3c1.7,0,3.1,1.2,3.6,2.8c1.6,6.9,5.5,25.5,5.5,47.2s-3.8,40.1-5.5,47.2c-0.5,1.7-1.7,2.8-3.6,2.8h-8.3h-1.4h-8.3c-1.7,0-3.1-1.2-3.6-2.8c-1.6-6.9-5.5-25.7-5.5-47.2c0-21.7,3.8-40.1,5.5-47.2C458.7,31.6,460.3,30.4,461.9,30.4z"/> <path fill="none" stroke="rgb(147, 147, 147)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" d="M439.6,77.6l-70,74.8"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M401.8,390.8c0,2.2-1.1,4-2.7,4.9c-7.1,3.6-27.9,12.5-63.6,11.8c-35.4-0.7-56-8.5-63.1-12c-1.7-0.9-2.8-2.7-2.8-4.9v-52.9H402L401.8,390.8L401.8,390.8z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M402,337.7H269.5v-97.6c0-2.7,1.7-4.9,4.1-5.3c10.8-1.6,40.9-6,62-6c21.2,0,51.4,4.4,62.1,6c2.4,0.4,4.1,2.7,4.1,5.3C402,240.1,402,337.7,402,337.7z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M372.4,361.2c-5.5-1.3-19.8-4.4-36.7-4.4c-16.7,0-31.3,3.1-36.7,4.4c-1.3,0.4-2.2,1.5-2.2,2.9v6.7v1.1v6.7c0,1.5,0.9,2.5,2.2,2.9c5.5,1.3,19.8,4.4,36.7,4.4c16.9,0,31.3-3.1,36.7-4.4c1.3-0.4,2.2-1.5,2.2-2.9v-6.7v-1.1v-6.7C374.6,362.8,373.7,361.5,372.4,361.2z"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M271.2,376.2h3.7V259.1c0.1-3.9-2.1-6.9-5.8-7H266c-8.8-0.2-9.2,6.9-9.2,15.8l-0.5,31.6c-0.1,1.6,0.1,3.3,0.5,4.8l8,66.4C265.2,373.8,267.9,376.2,271.2,376.2z"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M406.6,370.6l8-66.4c0.5-1.5,0.6-3.2,0.5-4.8l-0.5-31.6c-0.1-8.8-0.4-15.9-9.2-15.8h-3.1c-3.7,0.1-5.9,3.1-5.8,7v117.2h3.7C403.5,376.2,406.2,373.8,406.6,370.6z"/> <line fill="none" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" x1="439.6" y1="5.6" x2="439.6" y2="151.9"/> <line fill="none" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" x1="69.9" y1="5.6" x2="69.9" y2="151.9"/> <polyline fill="none" stroke="rgb(147, 147, 147)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" points="503.1,5.9 503.1,151.5 68.9,151.5 "/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M69.3,98.8V5h-30H9.4v93.8v93.8h29.9h29.9V98.8H69.3z"/> <line fill="none" stroke="rgb(147, 147, 147)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" x1="69.3" y1="191.6" x2="6.5" y2="191.6"/> <path fill="rgb(235, 235, 235)" d="M7,400H3c-1.7,0-3,1.3-3,3v32h350h33.6H550V200v-27.3V0H370h-20H0v220c0,1.7,1.3,3,3,3h4c1.7,0,3-1.3,3-3V10h343h7h180v172.7v7.3v235H373.6H360H10v-22C10,401.3,8.7,400,7,400z"/> <path fill="rgb(235, 235, 235)" d="M62.9,105.9c-0.7-1.1-1.9-1.9-3.4-2l-18.9-3.4v-3.8c3-0.3,5.3-2.8,5.3-5.8c0-3.2-2.6-5.9-5.9-5.9 s-5.9,2.6-5.9,5.9c0,0.3,0.3,0.6,0.6,0.6s0.6-0.3,0.6-0.6c0-2.6,2.1-4.7,4.7-4.7s4.7,2.1,4.7,4.7s-2.1,4.7-4.7,4.7 c-0.3,0-0.6,0.3-0.6,0.6v4.3L20,103.9c-1.5,0.2-2.8,1-3.4,2c-0.5,0.9-0.6,1.8-0.2,2.8l1.9,3.9h43l1.9-4 C63.5,107.7,63.4,106.8,62.9,105.9z M62,108.2l-1.6,3.3H19l-1.5-3.2c-0.3-0.7-0.1-1.3,0.2-1.7c0.5-0.8,1.4-1.3,2.6-1.5l19.5-3.5 l19.6,3.5c1.1,0.1,2.1,0.7,2.5,1.5C62.1,106.9,62.3,107.5,62,108.2z"/> </g> </svg>\');}' : "38" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 435" width="550" height="435"> <g class="seat"> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M7.9,4.5h79.9V155l20.8,80.9v47.5l0.1,147.5H7.8L7.9,4.5z"/> <polygon fill="' + soy.$$escapeHtml(a.fillColor) + '" points="113.5,282.5 110.3,282.5 46.3,282.5 46.3,428.1 110.3,428.1 113.5,428.1 490,428.1 490,282.5 "/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M328.5,9v37.5c18.8,13.4,41.3,22.5,59.9,29.1c39.4,14.1,97.6,15.5,98.5,15.1C487,90.5,507.1,8,507.1,8L328.5,9z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M88.1,404.6h-8.3h-1.4h-8.3c-1.7,0-3.1-1.2-3.6-2.8c-1.6-6.9-5.5-25.5-5.5-47.2s3.8-40.1,5.5-47.2c0.5-1.7,1.7-2.8,3.6-2.8h8.3h1.4h8.3c1.7,0,3.1,1.2,3.6,2.8c1.6,6.9,5.5,25.7,5.5,47.2c0,21.7-3.8,40.1-5.5,47.2C91.3,403.4,89.7,404.6,88.1,404.6z"/> <path fill="none" stroke="rgb(147, 147, 147)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" d="M110.4,357.4l70-74.8"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8"  d="M280.4,239.5c0,2.2-1.1,4-2.7,4.9c-7.1,3.6-27.9,12.5-63.6,11.8c-35.4-0.7-56-8.5-63.1-12c-1.7-0.9-2.8-2.7-2.8-4.9v-52.9h132.4L280.4,239.5L280.4,239.5z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8"  d="M280.6,186.4H148.1V88.8c0-2.7,1.7-4.9,4.1-5.3c10.8-1.6,40.9-6,62-6c21.2,0,51.4,4.4,62.1,6c2.4,0.4,4.1,2.7,4.1,5.3C280.6,88.8,280.6,186.4,280.6,186.4z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M251,209.9c-5.5-1.3-19.8-4.4-36.7-4.4c-16.7,0-31.3,3.1-36.7,4.4c-1.3,0.4-2.2,1.5-2.2,2.9v6.7v1.1v6.7c0,1.5,0.9,2.5,2.2,2.9c5.5,1.3,19.8,4.4,36.7,4.4s31.3-3.1,36.7-4.4c1.3-0.4,2.2-1.5,2.2-2.9v-6.7v-1.1v-6.7C253.2,211.5,252.3,210.2,251,209.9z"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M149.8,224.9h3.7V107.8c0.1-3.9-2.1-6.9-5.8-7h-3.1c-8.8-0.2-9.2,6.9-9.2,15.8l-0.5,31.6c-0.1,1.6,0.1,3.3,0.5,4.8l8,66.4C143.8,222.5,146.5,224.9,149.8,224.9z"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M285.2,219.3l8-66.4c0.5-1.5,0.6-3.2,0.5-4.8l-0.5-31.6c-0.1-8.8-0.4-15.9-9.2-15.8h-3.1c-3.7,0.1-5.9,3.1-5.8,7v117.2h3.7C282.1,224.9,284.8,222.5,285.2,219.3z"/> <line fill="none" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" x1="110.4" y1="429.4" x2="110.4" y2="283.1"/> <line fill="none" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" x1="480.1" y1="429.4" x2="480.1" y2="283.1"/> <polyline fill="none" stroke="rgb(147, 147, 147)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" points="46.9,429.1 46.9,283.5 481.1,283.5 "/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M480.7,336.2V430h29.9h29.9v-93.8v-93.8h-29.9h-29.9V336.2z"/> <line fill="none" stroke="rgb(147, 147, 147)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" x1="480.7" y1="243.4" x2="543.5" y2="243.4"/> <path fill="rgb(235, 235, 235)" d="M543,35h4c1.7,0,3-1.3,3-3V0H200h-33.6H0v235v27.3V435h180h20h350V215c0-1.7-1.3-3-3-3h-4c-1.7,0-3,1.3-3,3v210H197h-7H10V252.3V245V10h166.4H190h350v22C540,33.7,541.3,35,543,35z"/> <path fill="rgb(235, 235, 235)" d="M533.4,343.3c-0.7-1.1-1.9-1.9-3.4-2l-18.9-3.4v-3.8c3-0.3,5.3-2.8,5.3-5.8c0-3.2-2.6-5.9-5.9-5.9s-5.9,2.6-5.9,5.9c0,0.3,0.3,0.6,0.6,0.6s0.6-0.3,0.6-0.6c0-2.6,2.1-4.7,4.7-4.7c2.6,0,4.7,2.1,4.7,4.7s-2.1,4.7-4.7,4.7c-0.3,0-0.6,0.3-0.6,0.6v4.3l-19.4,3.5c-1.5,0.2-2.8,1-3.4,2c-0.5,0.9-0.6,1.8-0.2,2.8l1.9,3.9h43l1.9-4 C534,345.1,533.9,344.2,533.4,343.3z M532.6,345.6l-1.6,3.3h-41.5l-1.5-3.2c-0.3-0.7-0.1-1.3,0.2-1.7c0.5-0.8,1.4-1.3,2.6-1.5l19.5-3.5l19.6,3.5c1.1,0.1,2.1,0.7,2.5,1.5C532.6,344.3,532.8,344.9,532.6,345.6z"/> </g> </svg>\');}' : "39" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 435" width="550" height="435"> <g class="seat"> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M542.2,430.9h-101l0.1-147.5v-47.5l20.8-80.9V4.5H542L542.2,430.9z"/> <polygon fill="' + soy.$$escapeHtml(a.fillColor) + '" points="439.7,282.5 436.5,282.5 60,282.5 60,428.1 436.5,428.1 439.7,428.1 503.7,428.1 503.7,282.5 "/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M42.9,8c0,0,20.1,82.5,20.2,82.7c1,0.3,59.1-1,98.5-15.1c18.5-6.6,41.1-15.7,59.9-29.1V9L42.9,8z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M458.3,401.8c-1.6-7.1-5.5-25.5-5.5-47.2c0-21.5,3.8-40.2,5.5-47.2c0.5-1.7,1.9-2.8,3.6-2.8h8.3h1.4h8.3c1.9,0,3.1,1.2,3.6,2.8c1.6,7.1,5.5,25.5,5.5,47.2s-3.8,40.2-5.5,47.2c-0.5,1.7-1.9,2.8-3.6,2.8h-8.3h-1.4h-8.3C460.3,404.6,458.7,403.4,458.3,401.8z"/> <path fill="none" stroke="rgb(147, 147, 147)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" d="M369.6,282.6l70,74.8"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M269.6,239.5c0,2.2,1.1,4,2.7,4.9c7.1,3.6,27.9,12.5,63.6,11.8c35.4-0.7,56-8.5,63.1-12c1.7-0.9,2.8-2.7,2.8-4.9v-52.9H269.4L269.6,239.5L269.6,239.5z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M269.4,186.4h132.5V88.8c0-2.7-1.7-4.9-4.1-5.3c-10.8-1.6-40.9-6-62-6c-21.2,0-51.4,4.4-62.1,6c-2.4,0.4-4.1,2.7-4.1,5.3C269.4,88.8,269.4,186.4,269.4,186.4z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M299,209.9c5.5-1.3,19.8-4.4,36.7-4.4c16.7,0,31.3,3.1,36.7,4.4c1.3,0.4,2.2,1.5,2.2,2.9v6.7v1.1v6.7c0,1.5-0.9,2.5-2.2,2.9c-5.5,1.3-19.8,4.4-36.7,4.4c-16.9,0-31.3-3.1-36.7-4.4c-1.3-0.4-2.2-1.5-2.2-2.9v-6.7v-1.1v-6.7C296.8,211.5,297.7,210.2,299,209.9z"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M400.2,224.9h-3.7V107.8c-0.1-3.9,2.1-6.9,5.8-7h3.1c8.8-0.2,9.2,6.9,9.2,15.8l0.5,31.6c0.1,1.6-0.1,3.3-0.5,4.8l-8,66.4C406.2,222.5,403.5,224.9,400.2,224.9z"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M264.8,219.3l-8-66.4c-0.5-1.5-0.6-3.2-0.5-4.8l0.5-31.6c0.1-8.8,0.4-15.9,9.2-15.8h3.1c3.7,0.1,5.9,3.1,5.8,7v117.2h-3.7C267.9,224.9,265.2,222.5,264.8,219.3z"/> <line fill="none" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" x1="439.6" y1="429.4" x2="439.6" y2="283.1"/> <line fill="none" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" x1="69.9" y1="429.4" x2="69.9" y2="283.1"/> <polyline fill="none" stroke="rgb(147, 147, 147)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" points="503.1,429.1 503.1,283.5 68.9,283.5 "/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M69.3,242.4h-30H9.4v93.8V430h29.9h29.9v-93.8v-93.8H69.3z"/> <line fill="none" stroke="rgb(147, 147, 147)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" x1="69.3" y1="243.4" x2="6.5" y2="243.4"/> <path fill="rgb(235, 235, 235)" d="M7,35H3c-1.7,0-3-1.3-3-3V0h350h33.6H550v235v27.3V435H370h-20H0V215c0-1.7,1.3-3,3-3h4c1.7,0,3,1.3,3,3v210h343h7h180V252.3V245V10H373.6H360H10v22C10,33.7,8.7,35,7,35z"/> <path fill="rgb(235, 235, 235)" d="M62.9,343.3c-0.7-1.1-1.9-1.9-3.4-2l-18.9-3.4v-3.8c3-0.3,5.3-2.8,5.3-5.8c0-3.2-2.6-5.9-5.9-5.9 s-5.9,2.6-5.9,5.9c0,0.3,0.3,0.6,0.6,0.6s0.6-0.3,0.6-0.6c0-2.6,2.1-4.7,4.7-4.7s4.7,2.1,4.7,4.7S42.6,333,40,333c-0.3,0-0.6,0.3-0.6,0.6v4.3L20,341.3c-1.5,0.2-2.8,1-3.4,2c-0.5,0.9-0.6,1.8-0.2,2.8l1.9,3.9h43l1.9-4 C63.5,345.1,63.4,344.2,62.9,343.3z M62,345.6l-1.6,3.3H19l-1.5-3.2c-0.3-0.7-0.1-1.3,0.2-1.7c0.5-0.8,1.4-1.3,2.6-1.5l19.5-3.5l19.6,3.5c1.1,0.1,2.1,0.7,2.5,1.5C62.1,344.3,62.3,344.9,62,345.6z"/> </g> </svg>\');}' : "40" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 275 1230" width="275" height="1230"> <g class="seat"> <polygon fill="' + soy.$$escapeHtml(a.fillColor) + '" points="275,505 73,505 210.9,46.3 275,46.3 "/> <polygon fill="rgb(235, 235, 235)" points="275,513.8 70.9,513.8 70.9,503.8 275,503.8 \t"/> <polyline fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" points="275,983.4 38.8,983.4 38.8,912.2 275,912.2 "/> <path fill="rgb(235, 235, 235)" d="M50,691.8h225v10H48.4"/> <polyline fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" points="275,1179.3 38.5,1179.3 38.5,913.7 7.8,913.7 7.8,1225 275,1225 "/> <path fill="none" stroke="rgb(235, 235, 235)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" d="M275,492.9H108.5c3.4-14.5,7.1-28.9,11-43.2c12.3-44.6,35.8-125.2,63-204.3c9.9-28.8,20.2-57.4,30.2-84.1H275"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M81.7,766.6l52.1,85.9l57.2-34.7c1.6-1,2.2-2.8,1.5-4.5c-3.3-7.6-12.6-28.7-20.9-42.3c-8.3-13.7-22.8-31.8-27.9-38.1c-1.2-1.4-3.2-1.7-4.7-0.8C138.9,731.9,81.7,766.6,81.7,766.6z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M66.8,775.8c-1.3,0.8-1.9,2.1-1.8,3.5c0.7,5.9,3.7,22.5,18.1,45.4c14.3,22.7,27,33.3,31.9,36.6c1.2,0.8,2.7,0.9,4,0.1l31-18.8l-52.1-85.8L66.8,775.8L66.8,775.8z"/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M275,907.2l-90.4-0.4v-41.4c0-3.5,1.9-6.8,4.9-8.6l45.6-26.9c1.5-0.9,3.3-1.4,5.1-1.4H275"/> <rect fill="none" stroke="rgb(147, 147, 147)" stroke-width="2" stroke-miterlimit="4.8" x="91" y="535.5" width="159.1" height="140"/> <path fill="none" stroke="rgb(147, 147, 147)" stroke-width="2" stroke-miterlimit="4.8" d="M179.1,605.5c0,4.2-3.7,7.7-8.3,7.8s-8.5-3.1-8.8-7.3s3.1-7.9,7.7-8.3c4.6-0.4,8.7,2.6,9.3,6.8L179.1,605.5z"/> <line fill="none" stroke="rgb(147, 147, 147)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" x1="177.2" y1="599.5" x2="250.3" y2="535.4"/> <line fill="none" stroke="rgb(147, 147, 147)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" x1="177.2" y1="611.4" x2="250.3" y2="675.5"/> <line fill="none" stroke="rgb(147, 147, 147)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" x1="164.1" y1="599.5" x2="90.9" y2="535.4"/> <line fill="none" stroke="rgb(147, 147, 147)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" x1="164.1" y1="611.4" x2="90.9" y2="675.5"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M80.2,1166.7h132.5v-97.6c0-2.7-1.7-4.9-4.1-5.3c-10.8-1.6-40.9-6-62-6c-21.2,0-51.4,4.4-62.1,6c-2.4,0.4-4.1,2.7-4.1,5.3C80.2,1069.1,80.2,1166.7,80.2,1166.7z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M80.4,1192.3c0,2.2,1.1,4,2.7,4.9c7.1,3.6,27.9,12.5,63.6,11.8c35.4-0.7,56-8.5,63.1-12c1.7-0.9,2.8-2.7,2.8-4.9v-52.9H80.2L80.4,1192.3L80.4,1192.3z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M109.8,1162.7c5.5-1.3,19.8-4.4,36.7-4.4c16.7,0,31.3,3.1,36.7,4.4c1.3,0.4,2.2,1.5,2.2,2.9v6.7v1.1v6.7c0,1.5-0.9,2.5-2.2,2.9c-5.5,1.3-19.8,4.4-36.7,4.4s-31.3-3.1-36.7-4.4c-1.3-0.4-2.2-1.5-2.2-2.9v-6.7v-1.1v-6.7C107.6,1164.3,108.5,1163,109.8,1162.7z"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M211,1197.1h-3.7V1080c-0.1-3.9,2.1-6.9,5.8-7h3.1c8.8-0.2,9.2,6.9,9.2,15.8l0.5,31.6c0.1,1.6-0.1,3.3-0.5,4.8l-8,66.4C217,1194.7,214.3,1197.1,211,1197.1z"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M75.6,1191.5l-8-66.4c-0.5-1.5-0.6-3.2-0.5-4.8l0.5-31.6c0.1-8.8,0.4-15.9,9.2-15.8h3.1c3.7,0.1,5.9,3.1,5.8,7v117.2H82C78.7,1197.1,76,1194.7,75.6,1191.5z"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M275,50.2h-41.5c-16.2,46.2-47.1,119.3-73.2,195.3c-27.2,79.1-50.7,159.7-63,204.3C37.7,665.5,38.1,911.6,38.1,911.6l-30.3,2.1c0,0,15-320.5,42.1-396.7c11.8-33.2,25.9-102,45.8-169c25.9-86.9,57-170.8,57-170.8l67-171.3L275,5"/> <path fill="rgb(235, 235, 235)" d="M131.9,247.1C169.8,136.7,214.2,29.3,222.2,10H275V0h-59.4l-1.3,3.1c-0.5,1.2-50,119.2-91.8,240.8c-31.2,90.9-56.2,179.6-63.1,204.6C28.5,560.3,14,683.1,7.3,766.4C2.2,829.4,0.7,880,0.2,905H0v17v0.1V1230h275v-10H10V922.1V922c0-0.6,0-2.9,0.1-7H275v-10H10.2C11.4,844.1,19,632,69,451.1C75.9,426.2,100.8,337.7,131.9,247.1z"/> </g> </svg>\');}' : "41" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 275 1230" width="275" height="1230"> <g class="seat"> <polyline fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8"  points="0,983.4 128,983.4 128,912.2 0,912.2 "/> <polyline fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8"  points="0,1225 275,1225 275,1179.3 0,1179.3 "/> <path fill="rgb(235, 235, 235)" d="M0,1220h265v-118.2h10V1230H0"/> <polygon fill="' + soy.$$escapeHtml(a.fillColor) + '" points="0,505 79.3,505 177.6,46.3 0,46.3 "/> <polyline fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8"  points="0,50.2 176.2,50.2 153.6,157.2 213.4,157.3 212,7.7 0,6.2 "/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M0,828.5h126.6c0,0-0.9,77.7,0,78.7L0,906.8"/> <polygon fill="rgb(235, 235, 235)" points="275,995.6 265,995.6 265,704.2 205.1,508.2 205.1,507.4 209.1,159.2 208.4,10 0,10 0,0 218.4,0 219.1,159.3 215.1,506.8 275,702.8 \t"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8"  d="M80.2,1166.7h132.5v-97.6c0-2.7-1.7-4.9-4.1-5.3c-10.8-1.6-40.9-6-62-6c-21.2,0-51.4,4.4-62.1,6c-2.4,0.4-4.1,2.7-4.1,5.3C80.2,1069.1,80.2,1166.7,80.2,1166.7z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8"  d="M80.4,1192.3c0,2.2,1.1,4,2.7,4.9c7.1,3.6,27.9,12.5,63.6,11.8c35.4-0.7,56-8.5,63.1-12c1.7-0.9,2.8-2.7,2.8-4.9v-52.9H80.2L80.4,1192.3L80.4,1192.3z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M109.8,1162.7c5.5-1.3,19.8-4.4,36.7-4.4c16.7,0,31.3,3.1,36.7,4.4c1.3,0.4,2.2,1.5,2.2,2.9v6.7v1.1v6.7c0,1.5-0.9,2.5-2.2,2.9c-5.5,1.3-19.8,4.4-36.7,4.4s-31.3-3.1-36.7-4.4c-1.3-0.4-2.2-1.5-2.2-2.9v-6.7v-1.1v-6.7C107.6,1164.3,108.5,1163,109.8,1162.7z"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8"  d="M211,1197.1h-3.7V1080c-0.1-3.9,2.1-6.9,5.8-7h3.1c8.8-0.2,9.2,6.9,9.2,15.8l0.5,31.6c0.1,1.6-0.1,3.3-0.5,4.8l-8,66.4C217,1194.7,214.3,1197.1,211,1197.1z"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8"  d="M75.6,1191.5l-8-66.4c-0.5-1.5-0.6-3.2-0.5-4.8l0.5-31.6c0.1-8.8,0.4-15.9,9.2-15.8h3.1c3.7,0.1,5.9,3.1,5.8,7v117.2H82C78.7,1197.1,76,1194.7,75.6,1191.5z"/> <ellipse fill="rgb(235, 235, 235)" stroke="rgb(147, 147, 147)" stroke-width="1.2" stroke-miterlimit="4.8" cx="44.7" cy="878.8" rx="33.6" ry="27"/> <path fill="rgb(147, 147, 147)" d="M48.3,906.1h-7.2v-17.2c0-1.8,1.5-3.3,3.3-3.3h0.7c1.8,0,3.3,1.5,3.3,3.3L48.3,906.1L48.3,906.1z"/> <path fill="rgb(235, 235, 235)" d="M132,915H0v-10h132"/> <path fill="rgb(235, 235, 235)" d="M122.6,911.3v-99.1h10v99.1"/> <path fill="rgb(235, 235, 235)" d="M132.6,884.2v99.1h-10v-99.1"/> <polygon fill="rgb(235, 235, 235)" points="132,701.9 122,701.9 122,680.8 72.3,513.8 0,513.8 0,503.8 79.7,503.8 132,679.4"/> <polyline fill="none" stroke="rgb(235, 235, 235)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" points="0,492.9 59.8,492.9 133.3,161.3 0,161.3"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M97.8,119.4c-7.1,1.6-25.5,5.5-47.2,5.5c-21.5,0-40.2-3.8-47.2-5.5c-1.7-0.5-2.8-1.9-2.8-3.6v-8.3v-1.4v-8.3c0-1.9,1.2-3.1,2.8-3.6c7.1-1.6,25.5-5.5,47.2-5.5s40.2,3.8,47.2,5.5c1.7,0.5,2.8,1.9,2.8,3.6v8.3v1.4v8.3C100.6,117.4,99.4,119,97.8,119.4z"/> </g> </svg>\');}' : "42" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 325" width="550" height="325"> <g class="seat"> <polyline fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" points="544.4,80.9 36.5,80.9 36.5,9.7 544.4,9.7 "/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M336.3,314.6h132.5V217c0-2.7-1.7-4.9-4.1-5.3c-10.8-1.6-40.9-6-62-6c-21.2,0-51.4,4.4-62.1,6c-2.4,0.4-4.1,2.7-4.1,5.3C336.3,217,336.3,314.6,336.3,314.6z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M468.7,320v-32.9H336.3"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M363.7,318v3.3v-1.1v-6.7c0-1.3,0.9-2.6,2.2-2.9c5.5-1.3,19.8-4.4,36.7-4.4c16.7,0,31.3,3.1,36.7,4.4c1.3,0.4,2.2,1.5,2.2,2.9v6.7v1.1V318"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M463.4,320v-92.1c-0.1-3.9,2.1-6.9,5.8-7h3.1c8.8-0.2,9.2,6.9,9.2,15.8l0.5,31.6c0.1,1.6-0.1,3.3-0.5,4.8l-5.6,46.9"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M329.2,318.7l-5.5-45.7c-0.5-1.5-0.6-3.2-0.5-4.8l0.5-31.6c0.1-8.8,0.4-15.9,9.2-15.8h3.1c3.7,0.1,5.9,3.1,5.8,7v91.3"/> <rect fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" x="8" y="5.4" width="32.4" height="220.4"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M487,117.9c-1.6-7.1-5.5-25.5-5.5-47.2c0-21.5,3.8-40.2,5.5-47.2c0.5-1.7,1.9-2.8,3.6-2.8h8.3h1.4h8.3c1.9,0,3.1,1.2,3.6,2.8 c1.6,7.1,5.5,25.5,5.5,47.2s-3.8,40.2-5.5,47.2c-0.5,1.7-1.9,2.8-3.6,2.8h-8.3h-1.4h-8.3C489,120.7,487.4,119.5,487,117.9z"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M274.9,320.8H7.4V205.7h223.9c24.1,0,43.6,19.5,43.6,43.6V320.8z"/> <polygon fill="rgb(235, 235, 235)" points="550,129.2 550,0 548.8,0 1.2,0 0,0 0,2.8 0,322.2 0,325 1.2,325 548.8,325 550,325 550,202.8 540,202.8 540,315 10,315 10,10 540,10 540,129.2 "/> <path fill="none" stroke="rgb(235, 235, 235)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" d="M398.2,128.3l46.5-47"/> <path fill="none" stroke="rgb(235, 235, 235)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" d="M546.2,128.4h-506"/> </g> </svg>\');}' : "43" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 325" width="550" height="325"> <g class="seat" transform="scale(-1, 1) translate(-550,0)"> <polyline fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" points="544.4,80.9 36.5,80.9 36.5,9.7 544.4,9.7 "/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M336.3,314.6h132.5V217c0-2.7-1.7-4.9-4.1-5.3c-10.8-1.6-40.9-6-62-6c-21.2,0-51.4,4.4-62.1,6c-2.4,0.4-4.1,2.7-4.1,5.3C336.3,217,336.3,314.6,336.3,314.6z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M468.7,320v-32.9H336.3"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M363.7,318v3.3v-1.1v-6.7c0-1.3,0.9-2.6,2.2-2.9c5.5-1.3,19.8-4.4,36.7-4.4c16.7,0,31.3,3.1,36.7,4.4c1.3,0.4,2.2,1.5,2.2,2.9v6.7v1.1V318"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M463.4,320v-92.1c-0.1-3.9,2.1-6.9,5.8-7h3.1c8.8-0.2,9.2,6.9,9.2,15.8l0.5,31.6c0.1,1.6-0.1,3.3-0.5,4.8l-5.6,46.9"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M329.2,318.7l-5.5-45.7c-0.5-1.5-0.6-3.2-0.5-4.8l0.5-31.6c0.1-8.8,0.4-15.9,9.2-15.8h3.1c3.7,0.1,5.9,3.1,5.8,7v91.3"/> <rect fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" x="8" y="5.4" width="32.4" height="220.4"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M487,117.9c-1.6-7.1-5.5-25.5-5.5-47.2c0-21.5,3.8-40.2,5.5-47.2c0.5-1.7,1.9-2.8,3.6-2.8h8.3h1.4h8.3c1.9,0,3.1,1.2,3.6,2.8 c1.6,7.1,5.5,25.5,5.5,47.2s-3.8,40.2-5.5,47.2c-0.5,1.7-1.9,2.8-3.6,2.8h-8.3h-1.4h-8.3C489,120.7,487.4,119.5,487,117.9z"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M274.9,320.8H7.4V205.7h223.9c24.1,0,43.6,19.5,43.6,43.6V320.8z"/> <polygon fill="rgb(235, 235, 235)" points="550,129.2 550,0 548.8,0 1.2,0 0,0 0,2.8 0,322.2 0,325 1.2,325 548.8,325 550,325 550,202.8 540,202.8 540,315 10,315 10,10 540,10 540,129.2 "/> <path fill="none" stroke="rgb(235, 235, 235)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" d="M398.2,128.3l46.5-47"/> <path fill="none" stroke="rgb(235, 235, 235)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" d="M546.2,128.4h-506"/> </g> </svg>\');}' : "44" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 325" width="550" height="325"> <g class="seat"> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M213.7,10.4H81.2V108c0,2.7,1.7,4.9,4.1,5.3c10.8,1.6,40.9,6,62,6c21.2,0,51.4-4.4,62.1-6c2.4-0.4,4.1-2.7,4.1-5.3C213.7,108,213.7,10.4,213.7,10.4z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M81.3,5v32.9h132.4"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M186.3,7V3.7v1.1v6.7c0,1.3-0.9,2.6-2.2,2.9c-5.5,1.3-19.8,4.4-36.7,4.4c-16.7,0-31.3-3.1-36.7-4.4c-1.3-0.4-2.2-1.5-2.2-2.9V4.8V3.7V7"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M86.6,5v92.1c0.1,3.9-2.1,6.9-5.8,7h-3.1c-8.8,0.2-9.2-6.9-9.2-15.8L68,56.7c-0.1-1.6,0.1-3.3,0.5-4.8L74.1,5"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M220.8,6.3l5.5,45.7c0.5,1.5,0.6,3.2,0.5,4.8l-0.5,31.6c-0.1,8.8-0.4,15.9-9.2,15.8H214c-3.7-0.1-5.9-3.1-5.8-7V5.9"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M275.1,4.2h267.5v115.1H318.7c-24.1,0-43.6-19.5-43.6-43.6V4.2z"/> <polyline fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" points="543.2,244.1 35.3,244.1 35.3,315.3 543.2,315.3 "/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M489.4,204.3h8.3h1.4h8.3c1.7,0,3.1,1.1,3.6,2.8c1.7,7,5.5,25.5,5.5,47.2s-3.9,40.1-5.5,47.2c-0.5,1.6-1.7,2.8-3.6,2.8h-8.3h-1.4h-8.3c-1.7,0-3.1-1.1-3.6-2.8c-1.7-7-5.5-25.7-5.5-47.2c0-21.7,3.9-40.1,5.5-47.2C486.2,205.5,487.8,204.3,489.4,204.3z"/> <path fill="none" stroke="rgb(235, 235, 235)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" d="M443.5,243.8l-46.5-47"/> <path fill="none" stroke="rgb(235, 235, 235)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" d="M39,196.6h506"/> <rect  fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" x="8.5" y="6.6" width="32.4" height="313"/> <polygon fill="rgb(235, 235, 235)" points="550,195.8 550,325 548.8,325 1.2,325 0,325 0,322.2 0,2.8 0,0 1.2,0 548.8,0 550,0 550,120.2 540,120.2 540,10 10,10 10,315 540,315 540,195.8 "/> </g> </svg>\');}' : "45" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 325" width="550" height="325"> <g class="seat" transform="scale(-1, 1) translate(-550,0)"> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M213.7,10.4H81.2V108c0,2.7,1.7,4.9,4.1,5.3c10.8,1.6,40.9,6,62,6c21.2,0,51.4-4.4,62.1-6c2.4-0.4,4.1-2.7,4.1-5.3C213.7,108,213.7,10.4,213.7,10.4z"/> <path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" d="M81.3,5v32.9h132.4"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M186.3,7V3.7v1.1v6.7c0,1.3-0.9,2.6-2.2,2.9c-5.5,1.3-19.8,4.4-36.7,4.4c-16.7,0-31.3-3.1-36.7-4.4c-1.3-0.4-2.2-1.5-2.2-2.9V4.8V3.7V7"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M86.6,5v92.1c0.1,3.9-2.1,6.9-5.8,7h-3.1c-8.8,0.2-9.2-6.9-9.2-15.8L68,56.7c-0.1-1.6,0.1-3.3,0.5-4.8L74.1,5"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M220.8,6.3l5.5,45.7c0.5,1.5,0.6,3.2,0.5,4.8l-0.5,31.6c-0.1,8.8-0.4,15.9-9.2,15.8H214c-3.7-0.1-5.9-3.1-5.8-7V5.9"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M275.1,4.2h267.5v115.1H318.7c-24.1,0-43.6-19.5-43.6-43.6V4.2z"/> <polyline fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" stroke-miterlimit="4.8" points="543.2,244.1 35.3,244.1 35.3,315.3 543.2,315.3 "/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M489.4,204.3h8.3h1.4h8.3c1.7,0,3.1,1.1,3.6,2.8c1.7,7,5.5,25.5,5.5,47.2s-3.9,40.1-5.5,47.2c-0.5,1.6-1.7,2.8-3.6,2.8h-8.3h-1.4h-8.3c-1.7,0-3.1-1.1-3.6-2.8c-1.7-7-5.5-25.7-5.5-47.2c0-21.7,3.9-40.1,5.5-47.2C486.2,205.5,487.8,204.3,489.4,204.3z"/> <path fill="none" stroke="rgb(235, 235, 235)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" d="M443.5,243.8l-46.5-47"/> <path fill="none" stroke="rgb(235, 235, 235)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" d="M39,196.6h506"/> <rect  fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" x="8.5" y="6.6" width="32.4" height="313"/> <polygon fill="rgb(235, 235, 235)" points="550,195.8 550,325 548.8,325 1.2,325 0,325 0,322.2 0,2.8 0,0 1.2,0 548.8,0 550,0 550,120.2 540,120.2 540,10 10,10 10,315 540,315 540,195.8 "/> </g> </svg>\');}' : "E" == a.cabinClass || "P" == a.cabinClass ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" viewBox="0 -3 110 100" width="110" height="100" xmlns="http://www.w3.org/2000/svg"><g class="seat" transform="scale(2)"><rect fill="' + soy.$$escapeHtml(a.armrestColor) + '" y="4.3" width="5.36" height="32.29" rx="1.97" ry="1.97" /><rect fill="' + soy.$$escapeHtml(a.armrestColor) + '" x="49.02" y="4.3" width="5.36" height="32.29" rx="1.97" ry="1.97" /><path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" d="M44.94,1.07C40.15.71,33.1,0,26.87,0,21.37,0,13.66.47,9.35.93A4.41,4.41,0,0,0,5.41,5.31V33H49V5.47A4.41,4.41,0,0,0,44.94,1.07Z" /><path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" d="M47.56,37.58h-40a2.85,2.85,0,0,1-2.85-2.85V31.43a2.85,2.85,0,0,1,2.85-2.85h.11A139.86,139.86,0,0,0,27.56,30a150.41,150.41,0,0,0,19.9-1.38h.1a2.85,2.85,0,0,1,2.85,2.85v3.31A2.85,2.85,0,0,1,47.56,37.58Z" /><rect fill="rgb(235, 235, 235)" x="19.25" y="28.88" width="15.92" height="5.47" rx="2.02" ry="2.02" /></g></svg>\');}' : "F" == a.cabinClass && "1" == a.seatType ? soy.$$escapeHtml(a.className) + ' { background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" width="150" height="150" xmlns="http://www.w3.org/2000/svg"><g class="seat" transform="scale(1)"><path class="bd" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" fill="' + soy.$$escapeHtml(a.fillColor) + '" d="M127.05,89.33H12.38V13.83A9.67,9.67,0,0,1,22,4.17,455.22,455.22,0,0,1,69.72,1.5a436.21,436.21,0,0,1,47.71,2.67,9.67,9.67,0,0,1,9.63,9.66Z"></path><path class="bd" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" fill="' + soy.$$escapeHtml(a.fillColor) + '" d="M12.38,89.33H127.05a0,0,0,0,1,0,0v36.26a7.59,7.59,0,0,1-7.59,7.59H20a7.59,7.59,0,0,1-7.59-7.59V89.33A0,0,0,0,1,12.38,89.33Z"></path><path stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" fill="' + soy.$$escapeHtml(a.armrestColor) + '" class="bc" d="M13.84,131.7H3.08A3.09,3.09,0,0,1,0,128.61V33a3.09,3.09,0,0,1,3.08-3.08H13.84A3.09,3.09,0,0,1,16.93,33v95.64A3.09,3.09,0,0,1,13.84,131.7ZM140,128.61V33a3.09,3.09,0,0,0-3.08-3.08H126.57A3.09,3.09,0,0,0,123.49,33v95.64a3.09,3.09,0,0,0,3.08,3.08h10.34A3.09,3.09,0,0,0,140,128.61Z"></path><path class="bd" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" fill="' + soy.$$escapeHtml(a.fillColor) + '" d="M118.59,146.5H20.86c-3.83,0-7-3.93-7-8.77v-10.2c0-4.84,3.12-8.77,7-8.77l.27,0A272.65,272.65,0,0,0,69.72,123a293.15,293.15,0,0,0,48.61-4.24l.25,0c3.83,0,7,3.93,7,8.77v10.2C125.54,142.57,122.42,146.5,118.59,146.5Z"></path><path stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" fill="' + soy.$$escapeHtml(a.fillColor) + '" class="cf" d="M94.24,140.35H45.19a4.13,4.13,0,0,1-4.13-4.14V122a4.15,4.15,0,0,1,.11-.93l3.65-7a4.13,4.13,0,0,1,4-3.21H90.1a4.13,4.13,0,0,1,4,3.09L98.24,121a4.15,4.15,0,0,1,.13,1v14.2A4.13,4.13,0,0,1,94.24,140.35Z"></path></g></svg>\'); }' : "F" == a.cabinClass && "2" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" viewBox="0 -3 110 100" width="110" height="100" xmlns="http://www.w3.org/2000/svg"><g class="seat" transform="scale(2)"><rect fill="' + soy.$$escapeHtml(a.armrestColor) + '" y="4.3" width="5.36" height="32.29" rx="1.97" ry="1.97" /><rect fill="' + soy.$$escapeHtml(a.armrestColor) + '" x="49.02" y="4.3" width="5.36" height="32.29" rx="1.97" ry="1.97" /><path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" d="M44.94,1.07C40.15.71,33.1,0,26.87,0,21.37,0,13.66.47,9.35.93A4.41,4.41,0,0,0,5.41,5.31V33H49V5.47A4.41,4.41,0,0,0,44.94,1.07Z" /><path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" d="M47.56,37.58h-40a2.85,2.85,0,0,1-2.85-2.85V31.43a2.85,2.85,0,0,1,2.85-2.85h.11A139.86,139.86,0,0,0,27.56,30a150.41,150.41,0,0,0,19.9-1.38h.1a2.85,2.85,0,0,1,2.85,2.85v3.31A2.85,2.85,0,0,1,47.56,37.58Z" /><rect fill="rgb(235, 235, 235)" x="19.25" y="28.88" width="15.92" height="5.47" rx="2.02" ry="2.02" /></g></svg>\');}' : "F" == a.cabinClass && "3" == a.seatType ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" width="110" height="100" xmlns="http://www.w3.org/2000/svg"><g class="seat" transform="scale(2)"><rect fill="' + soy.$$escapeHtml(a.armrestColor) + '" y="4.3" width="5.36" height="32.29" rx="1.97" ry="1.97" /><rect fill="' + soy.$$escapeHtml(a.armrestColor) + '" x="49.02" y="4.3" width="5.36" height="32.29" rx="1.97" ry="1.97" /><path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" d="M44.94,1.07C40.15.71,33.1,0,26.87,0,21.37,0,13.66.47,9.35.93A4.41,4.41,0,0,0,5.41,5.31V33H49V5.47A4.41,4.41,0,0,0,44.94,1.07Z" /><path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" d="M47.56,37.58h-40a2.85,2.85,0,0,1-2.85-2.85V31.43a2.85,2.85,0,0,1,2.85-2.85h.11A139.86,139.86,0,0,0,27.56,30a150.41,150.41,0,0,0,19.9-1.38h.1a2.85,2.85,0,0,1,2.85,2.85v3.31A2.85,2.85,0,0,1,47.56,37.58Z" /><rect fill="rgb(235, 235, 235)" x="19.25" y="28.88" width="15.92" height="5.47" rx="2.02" ry="2.02" /></g></svg>\');}' : "F" == a.cabinClass ? soy.$$escapeHtml(a.className) + ' { background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" width="150" height="220" xmlns="http://www.w3.org/2000/svg"><g class="seat" transform="scale(1.2)"><path class="bd" fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" d="M89.24,20c-.34-7.62-6.46-6.61-9.52-10.33S78.71.5,70.55.5H29.75c-8.16,0-6.12,5.42-9.18,9.15S11.4,12.37,11.06,20s0,13.74,0,13.74H89.24S89.58,27.61,89.24,20Z"></path><path class="bd" fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" d="M85,72.8H16.81a6.89,6.89,0,0,1-6.88-6.86V37.14a6.89,6.89,0,0,1,6.88-6.86,326.72,326.72,0,0,1,34.08-1.9A313.07,313.07,0,0,1,85,30.27a6.89,6.89,0,0,1,6.88,6.86v28.8A6.89,6.89,0,0,1,85,72.8Z"></path><rect class="bd" fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" x="9.93" y="71.69" width="81.91" height="60.75" rx="7.59" ry="7.59"></rect><path class="bc" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" fill="' + soy.$$escapeHtml(a.armrestColor) + '" d="M9,142.15H3.08A3.09,3.09,0,0,1,0,139.07V84.52a3.09,3.09,0,0,1,3.08-3.08H9a3.09,3.09,0,0,1,3.08,3.08v54.55A3.09,3.09,0,0,1,9,142.15Zm91-3.08V84.52a3.09,3.09,0,0,0-3.08-3.08H91.29a3.09,3.09,0,0,0-3.08,3.08v54.55a3.09,3.09,0,0,0,3.08,3.08h5.63A3.09,3.09,0,0,0,100,139.07Z"></path><path class="bd" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" fill="' + soy.$$escapeHtml(a.fillColor) + '" d="M84.71,145.5H14.9c-2.74,0-5-2.8-5-6.23V132c0-3.44,2.23-6.23,5-6.23l.19,0a195.67,195.67,0,0,0,34.71,3,210.38,210.38,0,0,0,34.72-3l.18,0c2.74,0,5,2.8,5,6.23v7.25C89.67,142.7,87.44,145.5,84.71,145.5Z"></path><path class="cf" fill="white" stroke="white" d="M67.32,141.13h-35a2.94,2.94,0,0,1-2.95-2.94V128.06a2.93,2.93,0,0,1,.08-.66L32,116.12a3,3,0,0,1,2.87-2.28H64.35a3,3,0,0,1,2.85,2.2l3,11.31a2.93,2.93,0,0,1,.1.74v10.09A2.94,2.94,0,0,1,67.32,141.13Z"></path></g></svg>\'); }' : "B" == a.cabinClass ? soy.$$escapeHtml(a.className) + ' {  background-image: url(\'data:image/svg+xml;utf8,<svg version="1.1" baseProfile="full" viewBox="0 -3 110 100" width="110" height="100" xmlns="http://www.w3.org/2000/svg"><g class="seat" transform="scale(2)"><rect fill="' + soy.$$escapeHtml(a.armrestColor) + '" y="4.3" width="5.36" height="32.29" rx="1.97" ry="1.97" /><rect fill="' + soy.$$escapeHtml(a.armrestColor) + '" x="49.02" y="4.3" width="5.36" height="32.29" rx="1.97" ry="1.97" /><path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" d="M44.94,1.07C40.15.71,33.1,0,26.87,0,21.37,0,13.66.47,9.35.93A4.41,4.41,0,0,0,5.41,5.31V33H49V5.47A4.41,4.41,0,0,0,44.94,1.07Z" /><path fill="' + soy.$$escapeHtml(a.fillColor) + '" stroke="' + soy.$$escapeHtml(a.strokeColor) + '" stroke-width="' + soy.$$escapeHtml(a.strokeWidth) + '" d="M47.56,37.58h-40a2.85,2.85,0,0,1-2.85-2.85V31.43a2.85,2.85,0,0,1,2.85-2.85h.11A139.86,139.86,0,0,0,27.56,30a150.41,150.41,0,0,0,19.9-1.38h.1a2.85,2.85,0,0,1,2.85,2.85v3.31A2.85,2.85,0,0,1,47.56,37.58Z" /><rect fill="rgb(235, 235, 235)" x="19.25" y="28.88" width="15.92" height="5.47" rx="2.02" ry="2.02" /></g></svg>\');}' : ""
    }
    o += "</style>" + (e.isAnalyticMode ? "<script async src='https://www.googletagmanager.com/gtag/js?id=G-1SQ44QYD58'><\/script><script id=\"ga-script\">window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);}gtag('js', new Date()); gtag('config', 'G-1SQ44QYD58');<\/script>" : "") + '</head><body class="pointer"><div id="loading-cover" class="loading-cover active fixed"><div class="loading-img"><img src="./images/loading.png" width="100%" height="3px" /></div></div><div id="plane" class="axis comp-plane" style="' + soy.$$escapeHtml(e.styles) + '" data-floor="1" data-width="' + soy.$$escapeHtml(e.width) + '" data-height="' + soy.$$escapeHtml(e.height) + '" data-id="' + soy.$$escapeHtml(e.id) + '" data-seat-class-features="' + soy.$$escapeHtml(e.seatClassFeatures || "") + '"><div id="plane-wrap" class="absolute comp-plane_plane" style="' + soy.$$escapeHtml(e.planeParams.constructionParams) + '">' + soy.$$filterNoAutoescape(e.vectorPlaneSvg) + '</div><div id="plane-vector-carpet" class="comp-plane_carpet plane-vector_carpet plane-wrap" style="' + soy.$$escapeHtml(e.planeParams.constructionParams) + '">' + soy.$$filterNoAutoescape(e.vectorPlaneCarpetSvg) + "</div>";
    for (var g = e.floors, n = g.length, l = 0; l < n; l++) {
        var u = g[l];
        o += '<div class="absolute comp-plane_sticker-bulk-floor" data-level="' + soy.$$escapeHtml(u.level) + '" style="' + soy.$$escapeHtml(u.styles) + '"><div class="absolute comp-plane_sticker-bulks" style="' + soy.$$escapeHtml(u.bulks.styles) + '">';
        for (var c = u.bulks.objects, p = c.length, d = 0; d < p; d++) {
            var m = c[d];
            o += m.isStickerBulk ? '<div class="absolute center sticker ' + (m.bulkParams.isMirror ? " mirror-bulk " : "") + '" style="' + soy.$$escapeHtml(m.styles) + '" data-uid="' + soy.$$escapeHtml(m.uid) + '"><div class="bulk-wrap">' + soy.$$filterNoAutoescape(m.vectorSource) + "</div></div>" : ""
        }
        o += '</div></div><div class="absolute comp-plane_floor invisible" data-level="' + soy.$$escapeHtml(u.level) + '" style="' + soy.$$escapeHtml(u.styles) + '"><div class="axis comp-plane_seats">';
        for (var f = u.rows, h = f.length, v = 0; v < h; v++)
            for (var y = f[v].seats, _ = y.length, b = 0; b < _; b++) {
                var S = y[b];
                o += S.format ? "" : '<div class="absolute comp-plane_seat ' + soy.$$escapeHtml(S.class) + " ST-" + soy.$$escapeHtml(S.type) + (S.rotation ? " R-" + soy.$$escapeHtml(S.rotation) : "") + '" style="' + soy.$$escapeHtml(S.styles) + '" data-sprite-uid="' + soy.$$escapeHtml(S.uid) + '"><div class="absolute comp-plane_seat-sprite ' + soy.$$escapeHtml(S.class) + soy.$$escapeHtml(S.type) + "-" + soy.$$escapeHtml(S.colorIndex) + '"><div class="center comp-plane_seat-number">' + soy.$$escapeHtml(S.number) + "</div></div></div>"
            }
        o += '</div><div class="absolute comp-plane_bulks" style="' + soy.$$escapeHtml(u.bulks.styles) + '">';
        for (var E = u.bulks.objects, A = E.length, C = 0; C < A; C++) {
            var k = E[C];
            o += (k.bulkParams.noseBulk ? '<div id="comp-plane_nose-bulk" class="absolute center comp-plane_bulk nose-bulk" style="' + soy.$$escapeHtml(k.bulkParams.styles) + '">' + soy.$$filterNoAutoescape(k.vectorSource) + "</div>" : "") + (k.isStickerBulk || k.bulkParams.noseBulk ? "" : '<div class="absolute center comp-plane_bulk ' + (k.bulkParams.isMirror ? " mirror-bulk " : "") + '" style="' + soy.$$escapeHtml(k.styles) + '" data-uid="' + soy.$$escapeHtml(k.uid) + '"><div class="bulk-wrap">' + soy.$$filterNoAutoescape(k.vectorSource) + "</div>" + (k.stickers.length ? '<div class="comp-plane_bulk-stickers-wrapper"><div style="' + soy.$$escapeHtml(k.bulkIconStyles) + '">' + soy.$$filterNoAutoescape(k.bulkIcon) + "</div></div>" : "") + "</div>")
        }
        o += '</div><div class="absolute comp-plane_seats">';
        for (var w = u.rows, T = w.length, R = 0; R < T; R++)
            for (var L = w[R], N = L.seats, O = N.length, M = 0; M < O; M++) {
                var H = N[M];
                o += H.format ? "" : '<div class="absolute comp-plane_seat ST-' + soy.$$escapeHtml(H.type) + (H.rotation ? " R-" + soy.$$escapeHtml(H.rotation) : "") + '" style="' + soy.$$escapeHtml(H.styles) + '" data-number="' + soy.$$escapeHtml(H.number) + '" data-class="' + soy.$$escapeHtml(H.class) + '" data-label="' + soy.$$escapeHtml(H.label) + '" data-features="' + soy.$$escapeHtml(H.features || "") + '" data-row-number="' + soy.$$escapeHtml(L.number) + '" data-seat-uid="' + soy.$$escapeHtml(H.uid) + '" data-specs="' + soy.$$escapeHtml(H.specs) + '" ></div>'
            }
        o += "</div></div>"
    }
    return o += '<div id="watermark" class="watermark">© seatmaps.com, ' + soy.$$escapeHtml(e.currentYear) + '</div></div>\x3c!-- DEBUG_SCRIPTS_BOF --\x3e<script src="./development/tools/closure-library/closure/goog/base.js"><\/script><script src="./deps.js"><\/script><script>goog.require(\'qjv\');<\/script>\x3c!-- DEBUG_SCRIPTS_EOF --\x3e</body></html>'
}
,
tmpl.plane.passengersLine = function(e, t) {
    for (var o = '<div id="passengers-line" class="fixed center passengers-line">', r = e.seatNumbers, i = r.length, s = 0; s < i; s++) {
        var a = r[s];
        o += '<figure class="axis inline-block center pointer passengers-line_passenger" data-seat="' + soy.$$escapeHtml(a || "") + '" data-index="#' + soy.$$escapeHtml(s + 1) + '"><img class="passengers-line_passenger-icon" src="./images/broadcasting/seatman' + soy.$$escapeHtml(a ? "" : "_greyscale") + '.png" alt=""></figure>'
    }
    return o += "</div>"
}
,
tmpl.plane.panoramaTriggerButton = function(e, t) {
    return '<figure class="absolute center pointer panorama-trigger-button"><img class="inline-block" src="./images/broadcasting/360icon.png" /></figure>'
}
,
goog.provide("qjv.reservations"),
goog.require("goog.array"),
goog.require("goog.dom"),
goog.require("goog.dom.classes"),
goog.require("goog.dom.dataset"),
goog.require("goog.events"),
goog.require("goog.events.Event"),
goog.require("goog.events.EventType"),
goog.require("goog.json"),
goog.require("goog.string"),
goog.require("goog.style"),
goog.require("goog.userAgent"),
goog.require("qjv.seat"),
goog.require("qjv.utils"),
goog.require("qjv.seatbar"),
goog.require("tmpl.plane"),
goog.scope(function() {
    var t = goog.array
      , a = goog.dom
      , g = goog.events
      , n = (goog.json,
    goog.dom.dataset)
      , o = goog.style;
    qjv.reservations.reservationOwner_ = null,
    qjv.reservations.passengerLine_ = null,
    qjv.reservations.DEFAULT_PASSENGER_TYPE = "ADT",
    qjv.reservations.passengersList_ = null,
    qjv.reservations.isActive = function() {
        return !!qjv.reservations.passengersList_
    }
    ,
    qjv.reservations.getPassengerById = function(t) {
        var e, o;
        return (null == (e = qjv.reservations) || null == (o = e.passengersList_) ? void 0 : o.find(function(e) {
            return e.id === t
        })) || {}
    }
    ,
    qjv.reservations.getNextEmptyPassenger = function() {
        var e, t;
        return (null == (e = qjv.reservations) || null == (t = e.passengersList_) ? void 0 : t.find(function(e) {
            return !e.seat
        })) || {}
    }
    ,
    qjv.reservations.getPassengerDefaultColor = function() {
        var e = qjv.plane.get();
        return o.getComputedStyle(e, "background-color")
    }
    ,
    qjv.reservations.passengersListHasUpdated = function() {
        qjv.reservations.checkAvailability(),
        qjv.seatbar.updateGuestsAndSeats(qjv.reservations.passengersList_),
        qjv.message.passengersListUpdated(qjv.reservations.passengersList_)
    }
    ,
    qjv.reservations.checkAvailability = function() {
        var e = qjv.reservations.getNextEmptyPassenger()
          , o = e.passengerType || qjv.reservations.DEFAULT_PASSENGER_TYPE;
        qjv.seat.clearDisabledForPassengerSeats(),
        e.id && t.forEach(qjv.seat.find(), function(e) {
            var t = n.get(e, "passengerTypes")
              , e = qjv.seat(e).number;
            t && !t.includes(o) && qjv.seat.disableForPassenger(e)
        })
    }
    ,
    qjv.reservations.addPassengerSeat = function(o, e) {
        var t = qjv.reservations.getPassengerById(e)
          , r = e || t.id
          , e = qjv.seat(o)
          , i = parseFloat(n.get(e.getNode(), "price")) || 0
          , s = 0;
        qjv.reservations.passengersList_.forEach(function(e, t) {
            e.id === r && (s = t + 1,
            e.seat = {
                price: i,
                seatLabel: o
            })
        }),
        e.setPassenger(t, s);
        e = a.getChildren(e.getNode())[0];
        g.listen(e, g.EventType.CLICK, function(e) {
            qjv.reservations.removePassengerBySeat(e, o)
        }),
        qjv.reservations.passengersListHasUpdated()
    }
    ,
    qjv.reservations.removePassengerBySeat = function(e, o) {
        e.stopPropagation(),
        qjv.seat(o).unsetPassenger(),
        qjv.reservations.passengersList_.forEach(function(e) {
            var t;
            (null == e || null == (t = e.seat) ? void 0 : t.seatLabel) === o && (e.seat = null)
        }),
        qjv.reservations.passengersListHasUpdated()
    }
    ,
    qjv.reservations.init = function(e) {
        var t;
        null == (t = qjv.reservations) || null != (t = t.passengersList_) && t.forEach(function(e, t) {
            var o, r, i;
            null == e || null == (o = e.seat) || !o.seatLabel || goog.isNull(null == e || null == (r = e.seat) ? void 0 : r.seatLabel) || null != (i = qjv.seat(null == e || null == (i = e.seat) ? void 0 : i.seatLabel)) && i.unsetPassenger()
        }),
        qjv.reservations.passengersList_ = e,
        qjv.reservations.passengersList_.forEach(function(e, t) {
            var o = qjv.seat.getSeatNodeByNumber(null == e || null == (r = e.seat) ? void 0 : r.seatLabel)
              , r = qjv.seat(o).passengerTypes
              , o = e.passengerType || "ADT"
              , o = !r || r.includes(o);
            !goog.isNull(e.seat) && o ? qjv.reservations.addPassengerSeat(e.seat.seatLabel, e.id) : e.seat = null
        }),
        qjv.reservations.checkAvailability(),
        qjv.seatbar.showInfoNode(qjv.reservations.passengersList_)
    }
    ,
    qjv.reservations.getPassengerAbbr = function(e, t) {
        var o = e.id
          , e = e.passengerLabel;
        if (!e)
            return "P" + (null !== t ? t : o);
        o = null == e ? void 0 : e.split(" ");
        return 1 < o.length ? o.slice(0, 2).map(function(e) {
            return e[0]
        }).join("") : e.substring(0, 2).toUpperCase()
    }
}),
goog.provide("goog.events.EventTarget"),
goog.require("goog.Disposable"),
goog.require("goog.asserts"),
goog.require("goog.events"),
goog.require("goog.events.Event"),
goog.require("goog.events.Listenable"),
goog.require("goog.events.ListenerMap"),
goog.require("goog.object"),
goog.events.EventTarget = function() {
    goog.Disposable.call(this),
    this.eventTargetListeners_ = new goog.events.ListenerMap(this),
    (this.actualEventTarget_ = this).parentEventTarget_ = null
}
,
goog.inherits(goog.events.EventTarget, goog.Disposable),
goog.events.Listenable.addImplementation(goog.events.EventTarget),
goog.events.EventTarget.MAX_ANCESTORS_ = 1e3,
goog.events.EventTarget.prototype.getParentEventTarget = function() {
    return this.parentEventTarget_
}
,
goog.events.EventTarget.prototype.setParentEventTarget = function(e) {
    this.parentEventTarget_ = e
}
,
goog.events.EventTarget.prototype.addEventListener = function(e, t, o, r) {
    goog.events.listen(this, e, t, o, r)
}
,
goog.events.EventTarget.prototype.removeEventListener = function(e, t, o, r) {
    goog.events.unlisten(this, e, t, o, r)
}
,
goog.events.EventTarget.prototype.dispatchEvent = function(e) {
    this.assertInitialized_();
    var t = this.getParentEventTarget();
    if (t)
        for (var o = [], r = 1; t; t = t.getParentEventTarget())
            o.push(t),
            goog.asserts.assert(++r < goog.events.EventTarget.MAX_ANCESTORS_, "infinite loop");
    return goog.events.EventTarget.dispatchEventInternal_(this.actualEventTarget_, e, o)
}
,
goog.events.EventTarget.prototype.disposeInternal = function() {
    goog.events.EventTarget.superClass_.disposeInternal.call(this),
    this.removeAllListeners(),
    this.parentEventTarget_ = null
}
,
goog.events.EventTarget.prototype.listen = function(e, t, o, r) {
    return this.assertInitialized_(),
    this.eventTargetListeners_.add(String(e), t, !1, o, r)
}
,
goog.events.EventTarget.prototype.listenOnce = function(e, t, o, r) {
    return this.eventTargetListeners_.add(String(e), t, !0, o, r)
}
,
goog.events.EventTarget.prototype.unlisten = function(e, t, o, r) {
    return this.eventTargetListeners_.remove(String(e), t, o, r)
}
,
goog.events.EventTarget.prototype.unlistenByKey = function(e) {
    return this.eventTargetListeners_.removeByKey(e)
}
,
goog.events.EventTarget.prototype.removeAllListeners = function(e) {
    return this.eventTargetListeners_ ? this.eventTargetListeners_.removeAll(e) : 0
}
,
goog.events.EventTarget.prototype.fireListeners = function(e, t, o) {
    if (!(r = this.eventTargetListeners_.listeners[String(e)]))
        return !0;
    for (var r = r.concat(), i = !0, s = 0; s < r.length; ++s) {
        var a, g, n = r[s];
        n && !n.removed && n.capture == t && (a = n.listener,
        g = n.handler || n.src,
        n.callOnce && this.unlistenByKey(n),
        i = !1 !== a.call(g, o) && i)
    }
    return i && 0 != o.returnValue_
}
,
goog.events.EventTarget.prototype.getListeners = function(e, t) {
    return this.eventTargetListeners_.getListeners(String(e), t)
}
,
goog.events.EventTarget.prototype.getListener = function(e, t, o, r) {
    return this.eventTargetListeners_.getListener(String(e), t, o, r)
}
,
goog.events.EventTarget.prototype.hasListener = function(e, t) {
    e = goog.isDef(e) ? String(e) : void 0;
    return this.eventTargetListeners_.hasListener(e, t)
}
,
goog.events.EventTarget.prototype.setTargetForTesting = function(e) {
    this.actualEventTarget_ = e
}
,
goog.events.EventTarget.prototype.assertInitialized_ = function() {
    goog.asserts.assert(this.eventTargetListeners_, "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?")
}
,
goog.events.EventTarget.dispatchEventInternal_ = function(e, t, o) {
    var r, i = t.type || t;
    goog.isString(t) ? t = new goog.events.Event(t,e) : t instanceof goog.events.Event ? t.target = t.target || e : (r = t,
    t = new goog.events.Event(i,e),
    goog.object.extend(t, r));
    var s, a = !0;
    if (o)
        for (var g = o.length - 1; !t.propagationStopped_ && 0 <= g; g--)
            a = (s = t.currentTarget = o[g]).fireListeners(i, !0, t) && a;
    if (t.propagationStopped_ || (a = (s = t.currentTarget = e).fireListeners(i, !0, t) && a,
    t.propagationStopped_ || (a = s.fireListeners(i, !1, t) && a)),
    o)
        for (g = 0; !t.propagationStopped_ && g < o.length; g++)
            a = (s = t.currentTarget = o[g]).fireListeners(i, !1, t) && a;
    return a
}
,
goog.provide("goog.dom.ViewportSizeMonitor"),
goog.require("goog.dom"),
goog.require("goog.events"),
goog.require("goog.events.EventTarget"),
goog.require("goog.events.EventType"),
goog.require("goog.math.Size"),
goog.dom.ViewportSizeMonitor = function(e) {
    goog.dom.ViewportSizeMonitor.base(this, "constructor"),
    this.window_ = e || window,
    this.listenerKey_ = goog.events.listen(this.window_, goog.events.EventType.RESIZE, this.handleResize_, !1, this),
    this.size_ = goog.dom.getViewportSize(this.window_)
}
,
goog.inherits(goog.dom.ViewportSizeMonitor, goog.events.EventTarget),
goog.dom.ViewportSizeMonitor.getInstanceForWindow = function(e) {
    var t = e || window
      , e = goog.getUid(t);
    return goog.dom.ViewportSizeMonitor.windowInstanceMap_[e] = goog.dom.ViewportSizeMonitor.windowInstanceMap_[e] || new goog.dom.ViewportSizeMonitor(t)
}
,
goog.dom.ViewportSizeMonitor.removeInstanceForWindow = function(e) {
    e = goog.getUid(e || window);
    goog.dispose(goog.dom.ViewportSizeMonitor.windowInstanceMap_[e]),
    delete goog.dom.ViewportSizeMonitor.windowInstanceMap_[e]
}
,
goog.dom.ViewportSizeMonitor.windowInstanceMap_ = {},
goog.dom.ViewportSizeMonitor.prototype.getSize = function() {
    return this.size_ ? this.size_.clone() : null
}
,
goog.dom.ViewportSizeMonitor.prototype.disposeInternal = function() {
    goog.dom.ViewportSizeMonitor.superClass_.disposeInternal.call(this),
    this.listenerKey_ && (goog.events.unlistenByKey(this.listenerKey_),
    this.listenerKey_ = null),
    this.window_ = null,
    this.size_ = null
}
,
goog.dom.ViewportSizeMonitor.prototype.handleResize_ = function(e) {
    var t = goog.dom.getViewportSize(this.window_);
    goog.math.Size.equals(t, this.size_) || (this.size_ = t,
    this.dispatchEvent(goog.events.EventType.RESIZE))
}
,
goog.provide("qjv.message"),
goog.require("goog.array"),
goog.require("goog.dom"),
goog.require("goog.dom.dataset"),
goog.require("goog.dom.ViewportSizeMonitor"),
goog.require("goog.events"),
goog.require("goog.events.EventType"),
goog.require("goog.json"),
goog.require("goog.object"),
goog.require("goog.string"),
goog.require("goog.dom.classes"),
goog.require("qjv.seat"),
goog.require("qjv.seatbar"),
goog.require("qjv.reservations"),
goog.require("qjv.utils"),
goog.scope(function() {
    goog.array;
    var r = goog.dom
      , a = goog.dom.dataset
      , e = qjv.utils
      , t = (goog.events,
    goog.string);
    goog.json,
    goog.dom.classes;
    qjv.message.messageTypesMap_ = {
        SEAT_AVAILABILITY_AVAILABLE: "setSeatAvailability_",
        SYNC_PASSENGERS: "syncPassengers_",
        DECK__SWITCH: "deckSwitch_",
        SEAT__JUMP_TO: "seatJumpTo_",
        SEAT_MAP__DATA: "seatMapData_",
        SEAT_MAP__LOADED: "seatMapLoaded_",
        SEAT_ADDITIONAL_PROPS: "seatAdditionalProps_",
        APPLY_COLOR_THEME: "applyColorTheme_",
        CUSTOMIZE_SCROLLBAR: "customizeScrollbar_"
    },
    qjv.message.handleMessage = function(e) {
        var t, o, e = "string" == typeof (null == e || null == (t = e.event_) ? void 0 : t.data) ? JSON.parse(null == e || null == (o = e.event_) ? void 0 : o.data) : null == e || null == (r = e.event_) ? void 0 : r.data, r = qjv.message.messageTypesMap_[e.type];
        r ? qjv.message[r](e.data) : console.log("METHOD DOES NOT EXIST", e)
    }
    ,
    qjv.message.messageEmitter = function(e, t) {
        e = {
            data: t,
            type: e
        };
        window.mobile ? window.mobile.postMessage(JSON.stringify(e)) : window.parent !== window ? window.parent.postMessage(JSON.stringify(e), "*") : console.log(JSON.stringify(e))
    }
    ,
    qjv.message.init = function() {
        qjv.message.seatMapLoaded_()
    }
    ,
    qjv.message.seatMapLoaded_ = function() {
        var e = qjv.message.dataPrepareHandler_();
        qjv.message.messageEmitter("SEAT_MAP__LOADED", e)
    }
    ,
    qjv.message.setSeatAvailability_ = function(e) {
        var s = new Map;
        null != (e = e.results[0].availableClasses) && e.forEach(function(e) {
            s.set(e.classCode, {
                seats: e.seats,
                wildcard: e.seats.find(function(e) {
                    return "*" === e.label
                })
            })
        }),
        goog.array.forEach(qjv.seat.find(), function(e) {
            var t = a.get(e, "class")
              , o = a.get(e, "number");
            if (s.has(t)) {
                var r = s.get(t)
                  , i = r.seats.find(function(e) {
                    return e.label === o
                });
                if (i) {
                    t = i.price && i.price + " " + i.currency || 0;
                    return a.set(e, "price", t),
                    void (i.onlyForPassengerType && a.set(e, "passengerTypes", i.onlyForPassengerType))
                }
                if (r.wildcard)
                    return a.set(e, "price", r.wildcard.price + " " + r.wildcard.currency),
                    void (r.wildcard.onlyForPassengerType && a.set(e, "passengerTypes", r.wildcard.onlyForPassengerType));
                qjv.seat.block(o)
            } else
                qjv.seat.block(o)
        })
    }
    ,
    qjv.message.syncPassengers_ = function(e) {
        e = e.passengers;
        e.forEach(function(e) {
            var t;
            null != (t = e.seat) && t.seatLabel && (goog.isNull(e.seat) || qjv.seat(null == (t = e.seat) ? void 0 : t.seatLabel)) || (e.seat = null)
        }),
        qjv.reservations.init(e)
    }
    ,
    qjv.message.passengersListUpdated = function(e) {
        qjv.message.messageEmitter("SYNC_PASSENGERS", {
            passengers: e
        })
    }
    ,
    qjv.message.seatPressed = function(e) {
        e = qjv.seat.getPreparedSeatData(e);
        qjv.message.messageEmitter("SEAT__PRESSED", e)
    }
    ,
    qjv.message.seatEntered = function(e) {
        e = qjv.seat.getPreparedSeatData(e);
        qjv.message.messageEmitter("SEAT__ENTERED", e)
    }
    ,
    qjv.message.seatLeft = function(e) {
        e = qjv.seat.getPreparedSeatData(e);
        qjv.message.messageEmitter("SEAT__LEFT", e)
    }
    ,
    qjv.message.mouseClickTracker = function(e, t) {
        var o = r.getElementByClass("comp-plane_bulks").getBoundingClientRect().left
          , t = {
            x: (e.event_.pageX - o) / t,
            y: (e.event_.pageY - 64) / t
        };
        qjv.message.messageEmitter("MOUSE_CLICKED", t)
    }
    ,
    qjv.message.deckSwitch_ = function(e) {
        var t = e.seatLabel
          , e = e.deckId
          , t = qjv.seat.getSeatNodeByNumber(t);
        t || !(2 < e) && e ? (e = t ? qjv.seat.getParentFloorNumber(t) : e,
        qjv.switcher.getDisplayedFloorNumber().toString() !== e && (qjv.tooltip.destroy(),
        qjv.switcher.toggleSwitcherArrows(e),
        qjv.plane.toggleFloor(e))) : console.log("INCORRECT DATA")
    }
    ,
    qjv.message.wannaCloseSeatmap = function() {
        qjv.message.messageEmitter("WANNA_CLOSE_SEATMAP", {})
    }
    ,
    qjv.message.wannaOpenPano = function(e) {
        var t, o, r, i, s;
        e && (s = e.getClassFeatures().circle,
        t = (i = qjv.seat.getPreparedSeatData(e.node_)).classLetter,
        o = i.deckLevel,
        r = i.fragment,
        e = i.label,
        i = i.type,
        s = Object.assign({}, {
            classLetter: t,
            deckLevel: o,
            fragment: r,
            label: e,
            type: i
        }, s),
        qjv.message.messageEmitter("WANNA_OPEN_PANO", s))
    }
    ,
    qjv.message.seatJumpTo_ = function(e) {
        var t = e.label
          , o = e.tooltip;
        qjv.message.deckSwitch_({
            seatLabel: t
        });
        var r = qjv.seat.getSeatNodeByNumber(t);
        r || console.log("INCORRECT DATA. SEAT DOES NOT EXIST!");
        t = r.getBoundingClientRect();
        qjv.utils.scrollPage("scrollTop", t.top + window.scrollY - window.innerHeight / 2, function() {
            o && qjv.tooltip.show(r)
        })
    }
    ,
    qjv.message.seatMapData_ = function() {
        var e = qjv.message.dataPrepareHandler_();
        qjv.message.messageEmitter("SEAT_MAP__DATA", e)
    }
    ,
    qjv.message.dataPrepareHandler_ = function() {
        return {
            deviceDPI: e.getDeviceDPI(),
            devicePixelRatio: window.devicePixelRatio,
            heightInPx: window.innerHeight,
            planeId: qjv.plane.getData("id", t.toNumber),
            floorsNumber: qjv.plane.getNumberOfFloors(),
            platform: e.getOS(),
            scrollLeftInPx: window.pageXOffset,
            scrollTopInPx: window.pageYOffset,
            widthInPx: window.innerWidth
        }
    }
    ,
    qjv.message.seatAdditionalProps_ = function(e) {
        e.seats.forEach(function(e) {
            qjv.seat.features.setAdditionalProps(e.label, e.props)
        })
    }
    ,
    qjv.message.applyColorTheme_ = function(e) {
        qjv.colorizer(e)
    }
    ,
    qjv.message.customizeScrollbar_ = function(e) {
        var t = e.size
          , o = e.thumbColor
          , r = e.thumbBorderRadius
          , e = e.trackColor;
        qjv.customizeScrollbar(t, o, r, e)
    }
}),
goog.provide("tmpl.tooltip"),
goog.require("soy"),
goog.require("soydata"),
tmpl.tooltip.container = function(e, t) {
    var o = '<div id="tooltip" class="absolute comp-tooltip invisible"><div class="comp-tooltip_wrapper tooltip-wrapper">';
    return "seat" === e.type && (o += tmpl.tooltip.seat(e)),
    o += '</div><div class="absolute comp-tooltip_arrow tooltip-arrow"></div></div>'
}
,
tmpl.tooltip.seatFeatureCircles = function(e, t) {
    return '<div class="center comp-tooltip_circles"><div class="axis inline-block circle tooltip-unit pitch tooltip.circle.pitch" data-before="Pitch"><svg width="74" height="51" viewBox="0 0 74 51" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.98892 0.152473C1.60004 0.510215 0.442636 1.49927 0.253243 3.2038V3.30902C-0.503624 20.2124 0.272842 21.9085 4.82805 31.8585L4.84076 31.8863L4.99918 32.2325L4.99924 32.2327L4.99927 32.2327C5.87007 34.1358 6.88816 36.3607 8.01834 38.978C8.334 39.7355 8.64965 40.2616 9.36514 40.6615C9.9754 40.9982 10.754 41.1455 12.0166 41.1665C13.2619 41.187 14.4597 41.2 15.6234 41.2077L17.9559 48.0057H11.2591C10.5857 48.0057 10.0175 48.5528 10.0175 49.2473C10.0175 49.9207 10.5646 50.4888 11.2591 50.4888H19.5541C19.6426 50.4987 19.7329 50.499 19.8235 50.4888H31.2295C31.9029 50.4888 32.471 49.9417 32.471 49.2473C32.471 48.5739 31.9239 48.0057 31.2295 48.0057H20.5872L18.2578 41.2168C20.2165 41.2179 22.1025 41.2077 23.9874 41.1974H23.9883H23.9892L23.992 41.1974L23.9947 41.1974C24.6238 41.194 25.2528 41.1906 25.8844 41.1876C26.7241 41.1876 27.5679 41.1835 28.5151 41.179H28.5156H28.5162C29.7287 41.1731 31.1108 41.1665 32.8709 41.1665C34.1335 41.1876 34.9752 40.3037 35.3961 39.1253C35.5434 38.7044 35.6276 38.2415 35.6486 37.7785C35.6697 37.3155 35.6276 36.8315 35.5224 36.3896C35.2067 35.148 34.4071 34.1379 32.9761 34.0117C28.6832 33.6539 25.8213 33.4014 22.9804 33.1489C21.6481 33.0323 20.3191 32.9124 19.0403 32.7971L19.0374 32.7968L19.0368 32.7968L19.0366 32.7968C17.085 32.6207 15.2506 32.4553 13.7001 32.3282C8.18669 20.3544 7.00825 17.5976 7.9973 3.43528C8.10252 1.96223 7.23973 0.910044 6.04024 0.383953C5.57728 0.173516 5.07224 0.0472546 4.54614 0.00516733C4.02005 -0.0158763 3.49396 0.026211 2.98892 0.152473ZM16.7077 38.6924C19.9006 38.7099 22.8527 38.691 25.8633 38.6623C28.4728 38.6413 31.1032 38.6202 32.8498 38.6202H32.8709C32.8709 38.6202 32.934 38.4729 33.0182 38.2625C33.0813 38.0731 33.1234 37.8416 33.1444 37.6101C33.1655 37.3787 33.1444 37.1472 33.0813 36.9367C33.0182 36.6632 32.913 36.4738 32.7446 36.4527C32.2021 36.4054 31.6163 36.3545 30.9963 36.3006L30.9954 36.3005C28.5853 36.0911 25.6566 35.8367 22.7278 35.5689L22.7265 35.5688L22.7256 35.5687L22.7244 35.5686C19.8846 35.3162 17.0443 35.0637 12.7321 34.7061L12.0166 34.643L11.722 33.9906L11.6378 33.8223C5.70355 20.9646 4.44093 18.2079 5.49311 3.24589C5.51415 2.97232 5.30371 2.76188 5.0091 2.63562C4.81971 2.55145 4.58823 2.48832 4.33571 2.46727C4.08319 2.44623 3.83066 2.46727 3.59918 2.5304L3.62022 2.55145C3.17831 2.67771 2.79952 2.97232 2.73639 3.45632C2.02158 19.7078 2.75606 21.3194 7.08023 30.8073L7.09242 30.8341C7.9973 32.7911 9.04948 35.0849 10.2911 37.9679C10.3963 38.2415 10.5015 38.4098 10.5857 38.4519C10.7961 38.5781 11.217 38.6202 12.0377 38.6413C13.5277 38.6658 14.948 38.6814 16.322 38.6901C16.4521 38.67 16.5821 38.6715 16.7077 38.6924ZM40.9889 0.152473C39.6 0.510215 38.4426 1.49927 38.2532 3.2038V3.30902C37.4964 20.2124 38.2728 21.9085 42.828 31.8585L42.8408 31.8863L42.9991 32.2323C43.8699 34.1355 44.8881 36.3605 46.0183 38.978C46.334 39.7355 46.6497 40.2616 47.3651 40.6615C47.9754 40.9982 48.754 41.1455 50.0166 41.1665C51.2619 41.187 52.4597 41.2 53.6234 41.2077L55.9559 48.0057H49.2591C48.5857 48.0057 48.0175 48.5528 48.0175 49.2473C48.0175 49.9207 48.5646 50.4888 49.2591 50.4888H57.5541C57.6426 50.4987 57.7329 50.499 57.8235 50.4888H69.2295C69.9029 50.4888 70.471 49.9417 70.471 49.2473C70.471 48.5739 69.9239 48.0057 69.2295 48.0057H58.5872L56.2578 41.2168C58.2165 41.2179 60.1025 41.2077 61.9874 41.1974H61.9883H61.9892C62.6201 41.194 63.251 41.1906 63.8844 41.1876C64.7241 41.1876 65.5679 41.1835 66.5151 41.179H66.5156H66.5162C67.7288 41.1731 69.1108 41.1665 70.8709 41.1665C72.1335 41.1876 72.9752 40.3037 73.3961 39.1253C73.5434 38.7044 73.6276 38.2415 73.6486 37.7785C73.6697 37.3155 73.6276 36.8315 73.5224 36.3896C73.2067 35.148 72.4071 34.1379 70.9761 34.0117C66.6832 33.6539 63.8213 33.4014 60.9804 33.1489C59.6486 33.0324 58.3201 32.9125 57.0417 32.7972L57.0376 32.7969L57.0368 32.7968L57.0366 32.7968L57.0361 32.7967C55.0847 32.6207 53.2505 32.4553 51.7001 32.3282C46.1867 20.3544 45.0083 17.5976 45.9973 3.43528C46.1025 1.96223 45.2397 0.910044 44.0402 0.383953C43.5773 0.173516 43.0722 0.0472546 42.5461 0.00516733C42.0201 -0.0158763 41.494 0.026211 40.9889 0.152473ZM54.7077 38.6924C57.9006 38.7099 60.8527 38.691 63.8633 38.6623C66.4728 38.6413 69.1032 38.6202 70.8498 38.6202H70.8709C70.8709 38.6202 70.934 38.4729 71.0182 38.2625C71.0813 38.0731 71.1234 37.8416 71.1444 37.6101C71.1655 37.3787 71.1444 37.1472 71.0813 36.9367C71.0182 36.6632 70.913 36.4738 70.7446 36.4527C70.2021 36.4054 69.6163 36.3545 68.9963 36.3006L68.9954 36.3005C66.5853 36.0911 63.6566 35.8367 60.7278 35.5689L60.7265 35.5688C57.886 35.3163 55.0454 35.0638 50.7321 34.7061L50.0166 34.643L49.722 33.9906L49.6378 33.8223C43.7035 20.9646 42.4409 18.2079 43.4931 3.24589C43.5142 2.97232 43.3037 2.76188 43.0091 2.63562C42.8197 2.55145 42.5882 2.48832 42.3357 2.46727C42.0832 2.44623 41.8307 2.46727 41.5992 2.5304L41.6202 2.55145C41.1783 2.67771 40.7995 2.97232 40.7364 3.45632C40.0216 19.7078 40.7561 21.3194 45.0802 30.8073L45.0924 30.8341C45.9973 32.7911 47.0495 35.0849 48.2911 37.9679C48.3963 38.2415 48.5015 38.4098 48.5857 38.4519C48.7961 38.5781 49.217 38.6202 50.0377 38.6413C51.5277 38.6658 52.948 38.6814 54.322 38.6901C54.4521 38.67 54.5821 38.6715 54.7077 38.6924Z"/></svg><div class="tooltip-circle-title">Pitch</div>' + (e.features.seat_pitch ? '<div class="tooltip-circle-value">' + soy.$$escapeHtml(e.features.seat_pitch) + "</div>" : "- -") + '</div><div class="axis inline-block circle tooltip-unit width tooltip.circle.width" data-before="Width"><svg width="35" height="50" viewBox="0 0 35 50" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.1151 33.3111C32.0089 33.4715 32.8177 33.9081 33.4335 34.5238C34.2198 35.31 34.7141 36.4106 34.7141 37.6011C34.7141 38.7916 34.2198 39.8922 33.4335 40.6784C32.6472 41.4645 31.5464 41.9587 30.3557 41.9587H23.2082L23.1928 47.4843H27.8396C28.5361 47.4843 29.0977 48.0458 29.0977 48.7421C29.0977 49.4385 28.5361 50 27.8396 50H7.86769C7.17126 50 6.60962 49.4385 6.60962 48.7421C6.60962 48.0458 7.17126 47.4843 7.86769 47.4843H12.4992L12.5146 41.9587H5.35149C4.16082 41.9587 3.06 41.4645 2.2737 40.6784C1.48741 39.8922 0.993164 38.7916 0.993164 37.6011C0.993164 36.4106 1.48741 35.31 2.2737 34.5238C2.88437 33.9133 3.68474 33.4788 4.56958 33.3152L4.82779 23.4241C4.72932 23.4271 4.63334 23.4314 4.51247 23.4369C4.3114 23.446 4.04146 23.4581 3.57663 23.4727C2.90266 23.4951 2.31855 22.956 2.29609 22.2597C2.27362 21.5859 2.8128 21.0019 3.50923 20.9794C3.98488 20.965 4.26402 20.9529 4.47273 20.9438C4.63574 20.9368 4.75578 20.9316 4.89293 20.9286L5.32902 4.22282C5.35149 3.05481 5.84573 1.9991 6.60956 1.2354C7.37339 0.471698 8.42928 0 9.59749 0H26.0873C27.2555 0 28.3114 0.471698 29.0752 1.2354C29.839 1.9991 30.3108 3.05481 30.3557 4.22282L30.7921 20.9384C30.8322 20.94 30.8743 20.9419 30.9198 20.9438C31.1286 20.9529 31.4077 20.965 31.8833 20.9794C32.5798 21.0019 33.1189 21.5859 33.0965 22.2597C33.074 22.956 32.4899 23.4951 31.8159 23.4727C31.3511 23.4581 31.0812 23.446 30.8801 23.4369C30.8724 23.4365 30.8648 23.4362 30.8573 23.4359L31.1151 33.3111ZM20.6991 47.4843L20.7145 41.9587H15.0083L14.9929 47.4843H20.6991ZM27.8171 4.26775L28.5809 33.221H7.05887L7.82271 4.26775C7.82271 3.77359 8.0249 3.32435 8.36188 2.98742C8.6764 2.67296 9.10325 2.4708 9.57502 2.4708H26.0648C26.5366 2.4708 26.9634 2.67296 27.2779 2.98742C27.5925 3.32435 27.7946 3.77359 27.8171 4.26775ZM30.3557 35.7368H5.35149C4.83479 35.7368 4.38547 35.9389 4.04849 36.2759C3.7115 36.6128 3.50931 37.0845 3.50931 37.5787C3.50931 38.0953 3.7115 38.5445 4.04849 38.8814C4.38547 39.2184 4.85725 39.4205 5.35149 39.4205H30.3557C30.8724 39.4205 31.3218 39.2184 31.6587 38.8814C31.9957 38.5445 32.1979 38.0728 32.1979 37.5787C32.1979 37.062 31.9957 36.6128 31.6587 36.2759C31.3218 35.9389 30.85 35.7368 30.3557 35.7368Z" /></svg><div class="tooltip-circle-title">Width</div>' + (e.features.seat_width ? '<div class="tooltip-circle-value">' + soy.$$escapeHtml(e.features.seat_width) + "</div>" : "- -") + '</div><div class="axis inline-block circle tooltip-unit recline tooltip.circle.recline" data-before="Recline"><svg width="48" height="51" viewBox="0 0 48 51" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.3954 30.8342C19.7952 31.1919 20.4265 30.8973 20.4265 30.3502C20.4265 30.1818 20.3424 30.0345 20.2161 29.9082L20.1319 29.8241L19.2902 29.1507L19.2691 29.1296C18.8272 28.7298 18.1538 29.1086 18.259 29.6978C18.2801 29.8451 18.3432 29.9503 18.4484 30.0345L18.4695 30.0555L19.3112 30.7289L19.3954 30.8131V30.8342Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14.5973 0.152473C13.2084 0.510215 12.051 1.49927 11.8616 3.2038V3.30902C11.4284 12.9854 11.4976 17.6783 12.4905 21.7889L11.967 21.091L11.946 21.0489C11.8197 20.8384 11.5672 20.7543 11.3357 20.7753C10.8938 20.8384 10.6833 21.3435 10.9148 21.7223L10.9359 21.7643L11.6303 22.6903L11.6724 22.7534L11.6934 22.7955C11.9769 23.1853 12.5288 23.0977 12.734 22.7212C12.8634 23.1823 13.0052 23.6402 13.1601 24.1013C13.1537 24.128 13.1488 24.1557 13.1454 24.1844C13.1244 24.3527 13.1875 24.5211 13.2927 24.6473L13.3138 24.6894L13.4099 24.8175C14.1463 26.8561 15.1378 29.0219 16.4364 31.8585L16.4492 31.8863C16.5014 32.0005 16.5542 32.1159 16.6075 32.2325C17.1074 33.3248 17.6558 34.5232 18.246 35.841C18.0278 35.9337 17.8592 36.149 17.8592 36.4318C17.8592 36.6001 17.9434 36.7474 18.0697 36.8737L18.8904 37.6944L18.9535 37.7365C19.0105 37.7891 19.073 37.828 19.1381 37.8543C19.2985 38.2206 19.4614 38.5951 19.6267 38.978C19.9424 39.7355 20.2581 40.2616 20.9735 40.6615C21.5838 40.9982 22.3624 41.1455 23.625 41.1665C24.8703 41.187 26.0681 41.2 27.2319 41.2077L29.5644 48.0056H22.8676C22.1942 48.0056 21.626 48.5527 21.626 49.2472C21.626 49.9206 22.1731 50.4888 22.8676 50.4888H31.1617C31.2508 50.4988 31.3418 50.499 31.433 50.4888H42.838C43.5114 50.4888 44.0795 49.9416 44.0795 49.2472C44.0795 48.5738 43.5324 48.0056 42.838 48.0056H32.1957L29.8663 41.2168C31.8256 41.2179 33.7121 41.2077 35.5976 41.1974C36.2285 41.194 36.8594 41.1906 37.4928 41.1876C38.3328 41.1876 39.1769 41.1835 40.1246 41.179C41.3371 41.1731 42.7192 41.1665 44.4793 41.1665C45.7419 41.1876 46.5836 40.3037 47.0045 39.1253C47.1518 38.7044 47.236 38.2415 47.257 37.7785C47.2781 37.3155 47.236 36.8315 47.1308 36.3896C46.8151 35.148 46.0155 34.1379 44.5845 34.0117C40.2916 33.6539 37.4297 33.4014 34.5888 33.1489C33.2553 33.0322 31.925 32.9122 30.6452 32.7968C28.6936 32.6208 26.859 32.4553 25.3085 32.3282C19.7951 20.3544 18.6166 17.5976 19.6057 3.43528C19.7109 1.96223 18.8481 0.910044 17.6486 0.383953C17.1857 0.173516 16.6806 0.0472546 16.1545 0.00516733C15.6285 -0.0158763 15.1024 0.026211 14.5973 0.152473ZM28.3161 38.6924C31.509 38.7099 34.4611 38.691 37.4717 38.6623C40.0812 38.6413 42.7116 38.6202 44.4582 38.6202H44.4793C44.4793 38.6202 44.5424 38.4729 44.6266 38.2625C44.6897 38.0731 44.7318 37.8416 44.7528 37.6101C44.7739 37.3787 44.7528 37.1472 44.6897 36.9367C44.6266 36.6632 44.5214 36.4738 44.353 36.4527C43.8105 36.4054 43.2248 36.3545 42.6047 36.3006C40.1945 36.0912 37.2654 35.8367 34.3362 35.5689L34.335 35.5688C31.4945 35.3163 28.6538 35.0638 24.3405 34.7061L23.625 34.643L23.3304 33.9906L23.2462 33.8223C23.1555 33.6256 23.0658 33.4313 22.9772 33.2392C22.7687 33.4555 22.4052 33.5083 22.1311 33.2752V33.2963L22.0469 33.2331L21.5419 32.8123L21.2052 32.4756C21.0789 32.3493 21.0158 32.223 20.9947 32.0547C20.9526 31.5075 21.605 31.1919 22.0048 31.5496L22.3415 31.8863L22.3617 31.9031C17.1874 20.6464 16.1038 17.4332 17.1015 3.24589C17.1226 2.97232 16.9121 2.76188 16.6175 2.63562C16.4281 2.55145 16.1966 2.48832 15.9441 2.46727C15.6916 2.44623 15.4391 2.46727 15.2076 2.5304L15.2286 2.55145C14.7867 2.67771 14.4079 2.97232 14.3448 3.45632C13.7423 17.155 14.1695 20.4518 16.9083 26.8319L17.5225 27.4461C17.7771 27.7007 17.767 28.0756 17.5559 28.3069C17.9026 29.0826 18.2795 29.9097 18.6886 30.8073L18.7008 30.8341C19.6057 32.7912 20.6579 35.0849 21.8995 37.9679C22.0047 38.2415 22.1099 38.4098 22.1941 38.4519C22.4045 38.5781 22.8254 38.6202 23.6461 38.6413C25.1362 38.6658 26.5566 38.6814 27.9307 38.6901C28.0607 38.6701 28.1906 38.6716 28.3161 38.6924Z"/><path d="M0.140476 10.527L0.132009 10.5185L0.182563 10.6533L0.0983887 10.485V9.05399C0.140476 8.88564 0.245694 8.75938 0.371956 8.67521C0.834916 8.38059 1.42414 8.80147 1.29788 9.32756V10.1062L1.38205 10.3587C1.5504 10.7796 1.2137 11.2215 0.771785 11.2004C0.540305 11.1794 0.329869 11.0321 0.245694 10.8006L0.22465 10.7375L0.140476 10.527Z"/><path d="M2.26588 12.6525C2.05545 12.1264 1.31892 12.1474 1.12953 12.6525C1.0664 12.7998 1.0664 12.9471 1.12953 13.0944L1.15057 13.1575L1.48727 13.9151L1.59249 14.2307C1.80292 14.7358 2.51841 14.7358 2.72884 14.2307C2.79197 14.0834 2.79197 13.9151 2.72884 13.7678L2.56049 13.2627L2.30797 12.6945L2.28693 12.6314L2.26588 12.6525Z"/><path d="M3.63372 16.0405C3.42328 15.5354 2.7078 15.5354 2.49736 16.0405C2.43423 16.1878 2.43423 16.3561 2.49736 16.5034V16.5245L2.68676 17.0295L2.93928 17.6188V17.6398C3.17076 18.1659 3.90729 18.1238 4.07564 17.5977C4.11772 17.4504 4.11772 17.3031 4.05459 17.1558V17.1347L3.73894 16.3982L3.61268 16.0615V16.0405H3.63372Z"/><path d="M5.08573 19.3864C4.83321 18.8393 4.05459 18.9445 3.92833 19.5337C3.90729 19.66 3.92833 19.7862 3.97042 19.9125V19.9336L4.51755 21.0278C4.62277 21.2383 4.85425 21.3856 5.08573 21.3856C5.52765 21.3645 5.80121 20.9016 5.61182 20.5017L5.06469 19.4075V19.3864H5.08573Z"/><path d="M5.56973 22.7534C5.5066 22.9217 5.52765 23.0901 5.61182 23.2374L6.24313 24.2896L6.28522 24.3527C6.41148 24.5421 6.62192 24.6684 6.85339 24.6473C7.31636 24.6263 7.56888 24.1212 7.3374 23.7214L7.29531 23.6583L6.664 22.6061L6.68505 22.6482C6.43252 22.1852 5.73808 22.2273 5.56973 22.7534Z"/><path d="M8.57897 25.6995C8.26332 25.2576 7.54784 25.4259 7.46366 25.9731C7.44262 26.1204 7.4847 26.2887 7.56888 26.415L8.32645 27.4251L8.34749 27.4461C8.68419 27.867 9.37863 27.6776 9.44176 27.1305C9.46281 26.9621 9.42072 26.8148 9.3155 26.6886L8.55793 25.6785L8.57897 25.6995Z"/><path d="M10.8517 28.4773C10.7044 28.3089 10.4729 28.2458 10.2625 28.3089C9.7995 28.4141 9.63116 28.9823 9.96785 29.319L9.9889 29.3401L10.3677 29.8451L10.8306 30.3081C11.2094 30.6868 11.8828 30.4133 11.8828 29.8661C11.8828 29.6978 11.8197 29.5505 11.6934 29.4453L11.6513 29.4032L11.5251 29.2348L10.9359 28.6456L10.8517 28.4773Z"/><path d="M13.4401 31.0235C13.0613 30.6658 12.451 30.9183 12.4089 31.4444C12.4089 31.6338 12.472 31.8022 12.5983 31.9284L13.4401 32.7702C13.8399 33.1279 14.4712 32.8333 14.4712 32.3072C14.4712 32.1389 14.387 31.9705 14.2608 31.8653L13.419 31.0235H13.4401Z"/><path d="M16.1547 33.4857C15.7549 33.1279 15.1446 33.4225 15.1446 33.9486C15.1446 34.117 15.2288 34.2853 15.355 34.4116L16.2178 35.2744C16.3651 35.4217 16.5756 35.4638 16.786 35.4217C17.27 35.2954 17.4173 34.7062 17.0385 34.3695L16.1547 33.4857Z"/><path d="M9.67324 19.6389C9.94681 20.1019 10.6202 20.0388 10.7886 19.5127C10.8306 19.3443 10.8306 19.176 10.7465 19.0287L10.3887 18.3132L10.3046 18.1028L10.2625 18.0186C10.031 17.5556 9.33654 17.5977 9.14715 18.0817C9.08402 18.2501 9.08402 18.4184 9.16819 18.5868L9.21028 18.6709L9.54698 19.5127L9.6522 19.7231L9.67324 19.6389Z"/><path d="M8.0108 16.314C8.11601 16.5455 8.32645 16.6718 8.57897 16.6718C9.02089 16.6507 9.29446 16.2088 9.12611 15.809L8.78941 14.9673L8.74732 14.841L8.70523 14.7568C8.4948 14.2728 7.8214 14.2518 7.58992 14.7358C7.52679 14.9041 7.50575 15.0725 7.58992 15.2408L7.63201 15.325L7.80036 15.83L8.0108 16.3561V16.314Z"/><path d="M6.57983 12.905C6.79026 13.4311 7.54784 13.41 7.73723 12.8839C7.77931 12.7366 7.77931 12.5893 7.73723 12.4631L7.71618 12.442L7.54784 11.937L7.4847 11.8107L7.29531 11.3688V11.3477C7.08488 10.8006 6.30626 10.8217 6.13791 11.3898C6.09582 11.5161 6.09582 11.6424 6.15896 11.7897V11.8107L6.47461 12.5472L6.664 12.926L6.68505 12.9471L6.57983 12.905Z"/><path d="M5.27512 9.45382C5.48556 10.001 6.26417 9.97991 6.43252 9.43278C6.47461 9.30651 6.47461 9.18025 6.43252 9.05399L6.41148 8.99086L6.28522 8.69625L6.03269 8.02285L5.94852 7.8545L5.92748 7.83346C5.696 7.32841 4.95947 7.3705 4.79112 7.89659C4.74903 8.0439 4.74903 8.1912 4.81216 8.33851V8.44372L5.12782 9.28547L5.19095 9.43278L5.21199 9.49591L5.27512 9.45382Z"/><path d="M3.44433 7.66511C3.97042 7.62302 4.2019 6.97067 3.82311 6.61293C3.69685 6.48667 3.5285 6.44458 3.36015 6.44458H2.28693L1.65562 6.76023H1.63457C1.40309 6.86545 1.27683 7.09693 1.27683 7.32841C1.29788 7.77033 1.73979 8.0439 2.13962 7.8545H3.00241L3.44433 7.66511Z"/></svg><div class="tooltip-circle-title">Recline</div>' + (e.features.seat_recline ? '<div class="tooltip-circle-value">' + soy.$$escapeHtml(e.features.seat_recline) + "</div>" : "- -") + "</div></div>"
}
,
tmpl.tooltip.seatFeatureList = function(e, t) {
    for (var o = '<ul class="comp-tooltip_features">', r = e.features, i = r.length, s = 0; s < i; s++) {
        var a = r[s];
        o += '<li class="axis comp-tooltip_features-item ' + ("+" == a.icon ? "tooltip-feature-plus" : "-" == a.icon ? "tooltip-feature-minus" : "tooltip-feature") + '">' + ("power" == a.icon ? '<span class="absolute comp-tooltip_features-item-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 21"><path d="M20.07,10.16a1.34,1.34,0,0,1-1.34,1.34H3.5a1.34,1.34,0,1,1,0-2.68h2V1.12a1.12,1.12,0,1,1,2.24,0v7.7h6.73V1.12a1.12,1.12,0,1,1,2.24,0v7.7h2A1.34,1.34,0,0,1,20.07,10.16ZM3.54,12.63V18.8A2.25,2.25,0,0,0,5.4,21H16.84a2.24,2.24,0,0,0,1.85-2.2V12.62Z" /></svg></span>' : "+" == a.icon ? '<span class="absolute comp-tooltip_features-item-icon plus"><svg width="20" height="20" viewBox="-1 -1 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM7.29 14.29L3.7 10.7C3.31 10.31 3.31 9.68 3.7 9.29C4.09 8.9 4.72 8.9 5.11 9.29L8 12.17L14.88 5.29C15.27 4.9 15.9 4.9 16.29 5.29C16.68 5.68 16.68 6.31 16.29 6.7L8.7 14.29C8.32 14.68 7.68 14.68 7.29 14.29Z"/></svg></span>' : "-" == a.icon ? '<span class="absolute comp-tooltip_features-item-icon minus"><svg width="20" height="20" viewBox="-1 -1 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M11.89 6.7L10 8.59L8.11 6.7C7.72 6.31 7.09 6.31 6.7 6.7C6.31 7.09 6.31 7.72 6.7 8.11L8.59 10L6.7 11.89C6.31 12.28 6.31 12.91 6.7 13.3C7.09 13.69 7.72 13.69 8.11 13.3L10 11.41L11.89 13.3C12.28 13.69 12.91 13.69 13.3 13.3C13.69 12.91 13.69 12.28 13.3 11.89L11.41 10L13.3 8.11C13.69 7.72 13.69 7.09 13.3 6.7C12.91 6.32 12.27 6.32 11.89 6.7ZM10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z"/></svg></span>' : "wifi" == a.icon ? '<span class="absolute comp-tooltip_features-item-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 21"><path d="M9.56,16.8a1.56,1.56,0,1,1,1.56,1.56A1.56,1.56,0,0,1,9.56,16.8Zm1.56-3.24a3.24,3.24,0,0,1,3.1,2.31l1.67-1.75a5.46,5.46,0,0,0-9.61.13L8,16A3.24,3.24,0,0,1,11.12,13.57Zm0-4.39a7.62,7.62,0,0,1,6.31,3.35L19,10.88a9.84,9.84,0,0,0-15.91.21L4.7,12.7A7.62,7.62,0,0,1,11.12,9.18Zm0-4.31a11.91,11.91,0,0,1,9.33,4.5L22,7.74A14.14,14.14,0,0,0,0,8L1.6,9.62A11.92,11.92,0,0,1,11.12,4.87Z" /></svg></span>' : "movie" == a.icon ? '<span class="absolute comp-tooltip_features-item-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 21"><path d="M6.51,8.59h3.57L8.44,11.13H4.88ZM18.45,2.31,17.43,0,15,1.08l2.53,1.65Zm-3.16,1.4L12.77,2.07,9.51,3.52,12,5.17Zm-4.42,7.41h3.57l1.64-2.53H12.51Zm-1.05-5L7.29,4.51,4,6,6.56,7.6ZM18.5,8.59l-1.64,2.53h2.67V8.59Zm-16,11.24A1.16,1.16,0,0,0,3.63,21H18.37a1.16,1.16,0,0,0,1.16-1.16V13.2H2.47Zm.17-13V11.2L4.51,8.41Z" /></svg></span>' : "bluetooth" == a.icon ? '<span class="absolute comp-tooltip_features-item-icon bluetooth"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 148.000000 148.000000"> <g transform="translate(0, 148.000000) scale(0.1,-0.1)" stroke="none"> <path d="M667 1459 l-27 -20 -2 -264 -3 -264 -117 115 c-96 94 -122 114 -147 114 -31 0 -71 -38 -71 -68 0 -9 71 -87 157 -174 l157 -158 -157 -158 c-86 -87 -157 -165 -157 -174 0 -30 40 -68 72 -68 25 0 50 20 149 117 l119 116 0 -266 0 -266 26 -20 c15 -12 35 -21 45 -21 21 0 431 338 455 375 9 14 13 32 9 45 -4 11 -85 86 -181 166 -96 80 -174 150 -174 154 0 4 78 74 174 154 96 80 177 155 181 166 4 13 0 31 -9 45 -24 37 -434 375 -455 375 -10 0 -30 -9 -44 -21z m229 -289 c56 -47 103 -88 103 -92 1 -7 -204 -181 -219 -186 -6 -2 -10 68 -10 183 0 132 3 186 11 183 6 -2 58 -42 115 -88z m-1 -673 c58 -49 105 -92 104 -95 0 -8 -203 -175 -218 -180 -8 -3 -11 51 -11 183 0 115 4 185 10 183 5 -1 57 -43 115 -91z"/> </g> </svg></span>' : "dot" == a.icon ? '<span class="absolute comp-tooltip_features-item-icon comp-tooltip_features-item-icon__additional"><svg version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.107 29.107" style="enable-background:new 0 0 29.107 29.107;" xml:space="preserve"><g><path d="M14.554,0C6.561,0,0,6.562,0,14.552c0,7.996,6.561,14.555,14.554,14.555c7.996,0,14.553-6.559,14.553-14.555 C29.106,6.562,22.55,0,14.554,0z"/></g></svg></span>' : "") + '<span class="block comp-tooltip_features-item-label tooltip-feature-label tooltip.features.' + soy.$$escapeHtml(a.key) + '">' + soy.$$escapeHtml(a.label) + "</span></li>"
    }
    return o += "</ul>"
}
,
tmpl.tooltip.seat = function(e, t) {
    return '<div id="tooltip.seat" class="axis comp-tooltip_container"><h1 class="comp-tooltip_header tooltip-header">' + soy.$$escapeHtml(e.seatNumber) + ' <span class="tooltip.seat.title.' + soy.$$escapeHtml(e.seatTitle) + '">' + soy.$$escapeHtml(e.seatTitle) + "</span></h1>" + (e.listFeatures.length ? tmpl.tooltip.seatFeatureList({
        features: e.listFeatures
    }) : "") + (soy.$$getMapKeys(e.circleFeatures).length ? tmpl.tooltip.seatFeatureCircles({
        features: e.circleFeatures
    }) : "") + '<footer class="axis comp-tooltip_footer ' + (e.profile || e.button || e.priceButton || e.statusTranslation ? "filled" : "") + '">' + (e.profile ? tmpl.tooltip.profile(e.profile) : "") + (e.button ? tmpl.tooltip.tooltipButton(e.button) : "") + (e.priceButton ? tmpl.tooltip.orderButton(e.priceButton) : "") + (e.statusTranslation ? '<p class="center comp-tooltip_footer-occupied ' + soy.$$escapeHtml(e.statusTranslation.key) + '">' + soy.$$escapeHtml(e.statusTranslation.value) + "</p>" : "") + '<p class="center copyright">© seatmaps.com</p></footer>' + (e.profile && e.profile.isAuthUser ? '<div id="tooltip.seat.flip" class="absolute block comp-tooltip_flip"><img class="comp-tooltip_flip-button" src="./images/broadcasting/' + soy.$$escapeHtml(e.profile.socialNetwork || "facebook") + '-icon_white.png" /></div>' : "") + "</div>"
}
,
tmpl.tooltip.button = function(e, t) {
    return '<hr class="comp-tooltip_footer-separator" /><div id="tooltip-button" class="axis block comp-tooltip_button ' + (e.isButtonInverse ? "inverse" : "") + '"><span class="block bold comp-tooltip_button-title ' + soy.$$escapeHtml(e.titleTranslation.key) + '">' + soy.$$escapeHtml(e.titleTranslation.value) + "</span>" + (e.subtitleTranslation ? '<cite class="block light comp-tooltip_button-description ' + soy.$$escapeHtml(e.subtitleTranslation.key) + '" data-translation-replacer="' + soy.$$escapeHtml(e.subtitleTranslation.replacer || "") + '" >' + soy.$$escapeHtml(e.subtitleTranslation.value) + "</cite>" : "") + (e.icon ? '<img class="absolute comp-tooltip_button-icon ' + (e.isIconFlipped ? "flipped" : "") + '" src="./images/broadcasting/' + soy.$$escapeHtml(e.icon) + '" />' : "") + "</div>"
}
,
tmpl.tooltip.profile = function(e, t) {
    return '<div class="axis comp-tooltip_footer-title"><' + soy.$$escapeHtml(e.link ? 'a href="' + e.link + '" target="_blank"' : "span") + ' class="block comp-tooltip_footer-title-name">' + soy.$$escapeHtml(e.name) + "</" + soy.$$escapeHtml(e.link ? "a" : "span") + ">" + (e.seatStatusTranslation ? '<cite class="absolute comp-tooltip_footer-title-type"><span class="' + soy.$$escapeHtml(e.seatStatusTranslation.key) + '">' + soy.$$escapeHtml(e.seatStatusTranslation.value) + "</span></cite>" : "") + (e.about ? '<cite class="absolute comp-tooltip_footer-title-about">' + soy.$$escapeHtml(e.about) + "</cite>" : "") + "</div>" + (e.avatar ? '<img class="absolute circle comp-tooltip_footer-avatar" src="' + soy.$$escapeHtml(e.avatar) + "\" onerror=\"this.removeAttribute('onerror'); this.src='./images/broadcasting/avatar-male.gif';\" />" : "") + (e.link ? '<a class="absolute circle comp-tooltip_footer-avatar" href="' + soy.$$escapeHtml(e.link) + '" target="_blank"></a>' : "")
}
,
tmpl.tooltip.tooltipButton = function(e, t) {
    return '<div id="tooltip-button" class="axis block comp-tooltip_button tooltip-button"><span class="inline-block comp-tooltip_button-img"><svg class="tooltip-vr-icon" viewBox="0 -66 512.001 512" xmlns="http://www.w3.org/2000/svg"><path d="m322.285156 335.644531c-7.441406 0-13.898437-5.53125-14.863281-13.105469-1.042969-8.21875 4.769531-15.726562 12.984375-16.773437 47.398438-6.039063 89.84375-18.882813 119.515625-36.171875 27.136719-15.808594 42.078125-34.394531 42.078125-52.332031 0-19.769531-17.484375-35.945313-32.15625-46.039063-6.824219-4.695312-8.550781-14.03125-3.855469-20.859375 4.695313-6.824219 14.035157-8.550781 20.859375-3.855469 29.539063 20.320313 45.152344 44.785157 45.152344 70.757813 0 29.476563-19.699219 56.535156-56.972656 78.25-33.550782 19.546875-78.789063 33.382813-130.828125 40.011719-.644531.078125-1.285157.117187-1.914063.117187zm0 0"/><path d="m252.34375 314.15625-40-40c-5.859375-5.859375-15.355469-5.859375-21.214844 0-5.855468 5.855469-5.855468 15.355469 0 21.210938l11.6875 11.6875c-44.8125-4.628907-85.523437-15.0625-117.046875-30.222657-35.441406-17.042969-55.769531-38.757812-55.769531-59.570312 0-17.652344 14.554688-36 40.980469-51.664063 7.128906-4.222656 9.480469-13.425781 5.257812-20.550781-4.226562-7.128906-13.429687-9.480469-20.554687-5.257813-46.023438 27.28125-55.683594 57.1875-55.683594 77.472657 0 33.28125 25.84375 64.039062 72.769531 86.609375 36.421875 17.511718 83.535157 29.242187 134.863281 33.78125l-16.503906 16.503906c-5.855468 5.855469-5.855468 15.355469 0 21.214844 2.929688 2.925781 6.769532 4.390625 10.609375 4.390625 3.835938 0 7.675781-1.464844 10.605469-4.390625l40-40c5.855469-5.859375 5.855469-15.359375 0-21.214844zm0 0"/><path d="m157.097656 187.222656v-3.609375c0-12.730469-7.792968-15.199219-18.242187-15.199219-6.460938 0-8.550781-5.699218-8.550781-11.398437 0-5.703125 2.089843-11.402344 8.550781-11.402344 7.21875 0 14.820312-.949219 14.820312-16.339843 0-11.019532-6.269531-13.679688-14.0625-13.679688-9.308593 0-14.058593 2.28125-14.058593 9.691406 0 6.457032-2.851563 10.828125-13.871094 10.828125-13.679688 0-15.386719-2.851562-15.386719-11.972656 0-14.816406 10.636719-34.007813 43.316406-34.007813 24.132813 0 42.371094 8.738282 42.371094 34.390626 0 13.867187-5.128906 26.789062-14.628906 31.160156 11.210937 4.179687 19.378906 12.539062 19.378906 27.929687v3.609375c0 31.160156-21.46875 42.941406-48.070313 42.941406-32.679687 0-45.21875-19.949218-45.21875-35.910156 0-8.550781 3.609376-10.832031 14.058594-10.832031 12.160156 0 15.199219 2.660156 15.199219 9.882813 0 8.929687 8.363281 11.019531 16.910156 11.019531 12.921875 0 17.484375-4.75 17.484375-17.101563zm0 0"/><path d="m302.066406 183.613281v1.710938c0 32.679687-20.332031 44.839843-46.550781 44.839843s-46.742187-12.160156-46.742187-44.839843v-50.351563c0-32.679687 21.089843-44.839844 48.453124-44.839844 32.109376 0 44.839844 19.949219 44.839844 35.71875 0 9.121094-4.371094 11.96875-13.871094 11.96875-8.167968 0-15.390624-2.089843-15.390624-10.828124 0-7.21875-7.597657-11.019532-16.527344-11.019532-11.210938 0-17.863282 5.890625-17.863282 19v17.097656c6.082032-6.648437 14.632813-8.359374 23.753907-8.359374 21.65625 0 39.898437 9.5 39.898437 39.902343zm-63.652344 3.800781c0 13.109376 6.460938 18.808594 17.101563 18.808594s16.910156-5.699218 16.910156-18.808594v-1.710937c0-13.871094-6.269531-19.191406-17.101562-19.191406-10.257813 0-16.910157 4.941406-16.910157 17.480469zm0 0"/><path d="m325.054688 185.324219v-50.351563c0-32.679687 20.328124-44.839844 46.550781-44.839844 26.21875 0 46.738281 12.160157 46.738281 44.839844v50.351563c0 32.679687-20.519531 44.839843-46.738281 44.839843-26.222657 0-46.550781-12.160156-46.550781-44.839843zm63.648437-50.351563c0-13.109375-6.457031-19-17.097656-19s-16.910157 5.890625-16.910157 19v50.351563c0 13.109375 6.269532 19 16.910157 19s17.097656-5.890625 17.097656-19zm0 0"/><path d="m454.351562 90c-24.816406 0-45-20.1875-45-45s20.183594-45 45-45c24.8125 0 45 20.1875 45 45s-20.1875 45-45 45zm0-60c-8.273437 0-15 6.730469-15 15 0 8.273438 6.726563 15 15 15 8.269532 0 15-6.726562 15-15 0-8.269531-6.730468-15-15-15zm0 0"/></svg></span><span class="block bold comp-tooltip_button-title ' + soy.$$escapeHtml(e.titleTranslation.key) + '">' + soy.$$escapeHtml(e.titleTranslation.value) + "</span></div>"
}
,
tmpl.tooltip.orderButton = function(e, t) {
    return '<div id="order-button" class="axis block comp-tooltip_order-button comp-tooltip_button tooltip-button"><div class="comp-tooltip_order-button__content">' + ("0" != e.price && null != e.price ? '<span class="block bold">' + soy.$$escapeHtml(e.price) + "</span>" : "") + '<span class="block bold ' + soy.$$escapeHtml(e.titleTranslation.key) + '">' + soy.$$escapeHtml(e.titleTranslation.value) + "</span></div>" + (e.subtitleTranslation ? '<cite class="block light comp-tooltip_order-button-description ' + soy.$$escapeHtml(e.subtitleTranslation.key) + '">' + soy.$$escapeHtml(e.subtitleTranslation.value) + "</cite>" : "") + "</div>"
}
,
goog.provide("qjv.tooltip"),
goog.require("goog.array"),
goog.require("goog.dom"),
goog.require("goog.dom.classes"),
goog.require("goog.dom.dataset"),
goog.require("goog.events"),
goog.require("goog.events.EventType"),
goog.require("goog.object"),
goog.require("goog.string"),
goog.require("goog.style"),
goog.require("qjv.plane"),
goog.require("qjv.reservations"),
goog.require("qjv.seat"),
goog.require("qjv.message"),
goog.require("qjv.utils"),
goog.require("qjv.i18n"),
goog.require("tmpl.tooltip"),
goog.scope(function() {
    var l = goog.array
      , u = goog.dom.classes
      , g = goog.dom
      , a = (goog.dom.dataset,
    goog.events)
      , c = goog.object
      , p = goog.string
      , d = goog.style;
    qjv.tooltip.RATIO_ = .95,
    qjv.tooltip.LEFT_ALIGN_COEFFICIENT_ = .825,
    qjv.tooltip.node_ = null,
    qjv.tooltip.magnification_ = null,
    qjv.tooltip.optionalColorization_ = {},
    qjv.tooltip.languageExceptions_ = ["iw", "ja", "ko", "tr", "ar"],
    qjv.tooltip.seat_ = null,
    qjv.tooltip.handlers_ = [],
    qjv.tooltip.getTooltipNode = function() {
        return qjv.tooltip.node_
    }
    ,
    qjv.tooltip.destroy = function() {
        qjv.tooltip.node_ && (g.removeNode(qjv.tooltip.node_),
        qjv.tooltip.node_ = null,
        qjv.tooltip.seat_ = null),
        qjv.tooltip.unbind_()
    }
    ,
    qjv.tooltip.setOptionalColorzation = function(e, t, o) {
        o = "comp-tooltip_arrow" === e ? o + " transparent transparent transparent" : o,
        qjv.tooltip.optionalColorization_[e] ? qjv.tooltip.optionalColorization_[e] += ";" + t + ": " + o : qjv.tooltip.optionalColorization_[e] = t + ": " + o
    }
    ,
    qjv.tooltip.getArrows_ = function() {
        return qjv.tooltip.node_.querySelectorAll(".comp-tooltip_arrow")
    }
    ,
    qjv.tooltip.getArrowsRenderedRectParams_ = function(e) {
        var t = qjv.tooltip.getArrows_()[0].getBoundingClientRect();
        return e ? t[e] : t
    }
    ,
    qjv.tooltip.getHeight_ = function() {
        return d.getSize(qjv.tooltip.node_).height
    }
    ,
    qjv.tooltip.getWidth_ = function() {
        return Math.floor(qjv.utils.getDeviceWidth() * qjv.tooltip.RATIO_)
    }
    ,
    qjv.tooltip.getOffset_ = function(e, t, o) {
        var r = {};
        return r.margin = (qjv.utils.getDeviceWidth() - t) / 2 / o,
        r.top = e.top - 8 - qjv.tooltip.getHeight_() / o,
        r.left = d.getViewportPageOffset(document).x + r.margin * qjv.tooltip.LEFT_ALIGN_COEFFICIENT_,
        r.right = r.left + t / o,
        r.indent = 0,
        r
    }
    ,
    qjv.tooltip.isTooltip = function(e) {
        return qjv.tooltip.node_ && (qjv.tooltip.node_ === e || g.contains(qjv.tooltip.node_, e))
    }
    ,
    qjv.tooltip.setMagnification = function(e) {
        qjv.tooltip.magnification_ = e
    }
    ,
    qjv.tooltip.resize = function(e, t) {
        if (qjv.tooltip.node_) {
            e = e || qjv.tooltip.magnification_,
            qjv.tooltip.magnification_ = e;
            var o = qjv.tooltip.seat_.offset(null, e.scale)
              , r = qjv.tooltip.getWidth_()
              , i = qjv.tooltip.getOffset_(o, r, e.zoom)
              , s = qjv.tooltip.seat_.getRenderedRectParams("height") || 0
              , a = qjv.tooltip.getHeight_() / e.zoom
              , g = qjv.tooltip.getArrowsRenderedRectParams_("height")
              , n = d.getViewportPageOffset(document).y
              , a = o.top - a - g;
            if (qjv.tooltip.node_.style[qjv.utils.TRANSFORM_PROPERTY] = "scale(" + p.padNumber(1 / e.zoom, 0, 3) + ")",
            qjv.tooltip.node_.style.transform = "scale(" + p.padNumber(1 / e.zoom, 0, 3) + ")",
            i.left + 2 * i.margin > o.center ? (i.left = o.center - 2 * i.margin,
            i.indent = 2 * i.margin * e.zoom + e.zoom) : (o.center + 2 * i.margin > i.right && (i.left = o.center - r / e.zoom + 2 * i.margin),
            i.indent = (o.center - i.left) * e.zoom),
            i = c.map(i, Math.floor),
            a < n ? (i.top = o.top + s + g / 2,
            u.add(qjv.tooltip.node_, "arrow-top")) : (i.top = a,
            u.remove(qjv.tooltip.node_, "arrow-top")),
            i.top < 0)
                return qjv.plane.get().style.paddingTop = 158 - i.top + "px",
                qjv.tooltip.resize.apply(null, arguments);
            qjv.tooltip.node_.style.width = r + "px",
            d.setPosition(qjv.tooltip.node_, i.left, i.top),
            l.forEach(qjv.tooltip.node_.querySelectorAll("#tooltip\\.seat\\.flip"), function(e) {
                e.style.right = "-" + i.margin + "px",
                e.style.paddingRight = i.margin + "px"
            }),
            l.forEach(qjv.tooltip.getArrows_(), function(e) {
                e.style.left = i.indent + "px"
            }),
            u.remove(qjv.tooltip.node_, "invisible"),
            t && (d.getViewportPageOffset(document).y > i.top && qjv.utils.scrollPage("scrollTop", i.top - i.margin),
            ((r = d.getViewportPageOffset(document).x) > i.left || r < i.left - i.margin) && qjv.utils.scrollPage("scrollLeft", i.left - i.margin))
        }
    }
    ,
    qjv.tooltip.getTemplate_ = function() {
        var e = qjv.tooltip.seat_.getClassFeatures()
          , t = qjv.tooltip.seat_.features()
          , o = {}
          , r = qjv.tooltip.seat_.getSpecs()
          , i = l.some(t, function(e) {
            return "doNotRecline" === e.key || "limitedRecline" === e.key || "prereclinedSeat" === e.key
        })
          , s = l.contains(["0", "Fixed", '0"', "0°"], e.circle.seat_recline);
        (i || s) && e.circle && (e.circle.seat_recline = "- -"),
        o = qjv.tooltip.seat_.hasSpecs() ? (a = qjv.tooltip.seat_.mergeFeaturesAndSpecs(e.list, r.list),
        t = l.concat(t, a),
        r.circle || {}) : (e.list && e.list.length && (t = l.concat(t, e.list)),
        e.circle || {});
        var a = qjv.tooltip.seat_.number
          , r = qjv.tooltip.seat_.title.replace(a, "").trim()
          , e = qjv.tooltip.seat_.getAdditionalPropsBySeat(a);
        e && e.forEach(function(e) {
            t.push({
                label: e.label,
                icon: e.icon || "dot",
                key: "add_prop"
            })
        });
        r = {
            type: "seat",
            seatNumber: a,
            seatTitle: r,
            listFeatures: t,
            circleFeatures: o
        };
        return qjv.tooltip.seat_.price && (o = qjv.reservations.getNextEmptyPassenger().id,
        r.priceButton = o ? {
            price: qjv.tooltip.seat_.price,
            titleTranslation: {
                key: "tooltip.footer.priceButton.seatReservation",
                value: "Seat request"
            },
            subtitleTranslation: {
                key: "tooltip.footer.priceButton.reservationIsPossible",
                value: "Reservation is possible"
            }
        } : {
            titleTranslation: {
                key: "tooltip.footer.priceButton.request.close",
                value: "Close"
            }
        }),
        qjv.panorama.getFragmentBySeat(qjv.tooltip.seat_.number) && (r.button = {
            isIconFlipped: !1,
            isButtonInverse: !1,
            titleTranslation: {
                key: "tooltip.btn.title",
                value: "Seat panoramic view"
            }
        }),
        g.htmlToDocumentFragment(tmpl.tooltip.container(r))
    }
    ,
    qjv.tooltip.unbind_ = function() {
        qjv.tooltip.handlers_.length && (goog.array.forEach(qjv.tooltip.handlers_, a.unlistenByKey),
        qjv.tooltip.handlers_ = [])
    }
    ,
    qjv.tooltip.bind_ = function() {
        var e, o;
        if (qjv.tooltip.unbind_(),
        l.insert(qjv.tooltip.handlers_, a.listen(document, a.EventType.CLICK, function(e) {
            qjv.tooltip.isTooltip(e.target) || qjv.tooltip.destroy()
        })),
        (e = goog.dom.getElement("tooltip-button")) && (o = "true" === qjv.utils.getUrlParams().external_pano_viewer,
        l.insert(qjv.tooltip.handlers_, a.listen(e, a.EventType.CLICK, function(e) {
            var t = qjv.tooltip.seat_.number;
            return o ? qjv.message.wannaOpenPano(qjv.tooltip.seat_) : qjv.panorama.onTrigger_(e, t),
            e.stopPropagation(),
            !1
        }))),
        e = goog.dom.getElement("order-button")) {
            var t = qjv.reservations.getNextEmptyPassenger()
              , r = t.id
              , i = void 0 === t.passengerType ? "ADT" : t.passengerType
              , s = qjv.tooltip.seat_.number
              , t = qjv.tooltip.seat_.passengerTypes;
            if (r && t && !t.includes(i))
                return void u.add(e, "disabled");
            l.insert(qjv.tooltip.handlers_, a.listen(e, a.EventType.CLICK, function(e) {
                return qjv.reservations.isActive() && r && qjv.reservations.addPassengerSeat(s, r),
                qjv.tooltip.destroy(),
                e.stopPropagation(),
                !1
            }))
        }
        null !== qjv.i18n.language && qjv.i18n.translate(qjv.i18n.language),
        qjv.tooltip.resize(null, !0)
    }
    ,
    qjv.tooltip.colorizeTooltip = function() {
        var o = qjv.tooltip.optionalColorization_;
        Object.keys(o).forEach(function(i) {
            var e = i.includes("svg") ? i.substring(0, i.length - 4) : i
              , e = g.getElementsByClass(e)
              , t = o[i].split(";");
            l.forEach(e, function(r) {
                r && t.forEach(function(e) {
                    var t = i.includes("svg") ? r.getElementsByTagName("svg")[0] : r
                      , o = e.split(":")
                      , e = o[0]
                      , o = o[1];
                    "comp-tooltip_arrow" === i && t.classList.remove("tooltip-arrow"),
                    t.style.setProperty(e, o, "important")
                })
            })
        })
    }
    ,
    qjv.tooltip.show = function(e) {
        qjv.tooltip.destroy(),
        qjv.tooltip.seat_ = qjv.seat(e),
        g.append(document.body, qjv.tooltip.getTemplate_()),
        qjv.tooltip.node_ = g.getElement("tooltip"),
        qjv.isRtlLanguage() && u.add(qjv.tooltip.node_, "rtl"),
        qjv.tooltip.isExceptionLanguage() && u.add(qjv.tooltip.node_, "exception"),
        qjv.tooltip.bind_(),
        qjv.tooltip.colorizeTooltip()
    }
    ,
    qjv.tooltip.isExceptionLanguage = function() {
        var e = qjv.utils.getCurrentLanguage();
        return qjv.tooltip.languageExceptions_.includes(e.toLowerCase())
    }
}),
goog.provide("qjv.panorama"),
goog.require("goog.array"),
goog.require("goog.dom"),
goog.require("goog.dom.classes"),
goog.require("goog.dom.dataset"),
goog.require("goog.events"),
goog.require("goog.events.Event"),
goog.require("goog.events.EventType"),
goog.require("goog.json"),
goog.require("goog.string"),
goog.require("goog.style"),
goog.require("goog.userAgent"),
goog.require("qjv.plane"),
goog.require("qjv.seat"),
goog.require("qjv.utils"),
goog.require("tmpl.plane"),
goog.scope(function() {
    goog.array;
    var r = goog.dom
      , t = goog.dom.classes
      , i = goog.events
      , e = (goog.json,
    goog.dom.dataset,
    goog.string)
      , o = "https://pano.jets.kwiket.com/api/v1"
      , s = "d7141c97-3042-4ac0-a0af-061b5cb91636"
      , a = qjv.plane.getData("id", e.toNumber);
    qjv.panorama.fragments = [],
    qjv.panorama.getFragments = function() {
        return fetch(o + "/auth?appId=04772b83-d58c-4c5e-a4f8-977dd9465ca0", {
            headers: {
                Authorization: "Bearer d6c025d6-9abb-4d52-aa06-f8fee5c6736b"
            }
        }).then(function(e) {
            return e.json()
        }).then(function(e) {
            e = e.accessToken;
            fetch(o + "/plane/" + a + "/for/customer/" + s + "/fragments", {
                headers: {
                    Authorization: "Bearer " + e
                }
            }).then(function(e) {
                return e.json()
            }).then(function(e) {
                qjv.panorama.fragments = e
            })
        })
    }
    ,
    qjv.panorama.getFragmentBySeat = function(t) {
        return (Array.isArray(qjv.panorama.fragments) ? qjv.panorama.fragments : []).find(function(e) {
            return e.seat === t
        }) || ""
    }
    ,
    qjv.panorama.destroy = function() {
        var e = r.getElement("panorama-frame")
          , t = r.getNextElementSibling(e);
        i.removeAll(t, i.EventType.CLICK),
        r.removeNode(e),
        r.removeNode(t)
    }
    ,
    qjv.panorama.build = function(e) {
        var t = r.createDom("iframe", {
            id: "panorama-frame",
            class: "panorama-frame fixed"
        })
          , o = qjv.utils.getUrlParams()
          , e = qjv.panorama.getFragmentBySeat(e).fragmentId
          , o = ["RU", "ru", "EN", "en"].includes(o.lang) ? o.lang.toUpperCase() : "EN";
        r.appendChild(document.body, t),
        t.src = "./viewer/index-s7.htm?fragmentId=" + e + "&customerId=" + s + "&lang=" + o
    }
    ,
    qjv.panorama.onTrigger_ = function(e, t) {
        qjv.panorama.build(t),
        qjv.panorama.setCloseButton(),
        e.stopPropagation()
    }
    ,
    qjv.panorama.setCloseButton = function() {
        var e = r.createElement("figure");
        e.innerHTML = "&times;",
        t.add(e, "fixed", "center", "panorama-close-button"),
        i.listenOnce(e, i.EventType.CLICK, qjv.panorama.destroy),
        r.insertSiblingAfter(e, r.getElement("panorama-frame"))
    }
    ,
    qjv.panorama.setTriggerButton = function(e) {
        var t = document.querySelector("#plane > .comp-plane_floor")
          , o = r.htmlToDocumentFragment(tmpl.plane.panoramaTriggerButton());
        o.style.top = e + "px",
        i.listen(o, i.EventType.CLICK, qjv.panorama.onTrigger_),
        r.appendChild(t, o)
    }
    ,
    qjv.panorama.init = function(e) {}
}),
goog.provide("qjv"),
goog.require("goog.array"),
goog.require("goog.dom"),
goog.require("goog.dom.ViewportSizeMonitor"),
goog.require("goog.events"),
goog.require("goog.events.EventType"),
goog.require("goog.json"),
goog.require("goog.object"),
goog.require("goog.string"),
goog.require("goog.dom.classes"),
goog.require("goog.dom.classlist"),
goog.require("goog.style"),
goog.require("qjv.panorama"),
goog.require("qjv.plane"),
goog.require("qjv.reservations"),
goog.require("qjv.seat"),
goog.require("qjv.seatbar"),
goog.require("qjv.tooltip"),
goog.require("qjv.utils"),
goog.require("qjv.message"),
goog.scope(function() {
    var s = goog.array
      , n = goog.dom
      , l = goog.events
      , u = goog.string
      , r = goog.json
      , e = (goog.object,
    goog.dom.ViewportSizeMonitor)
      , c = goog.dom.classes
      , p = goog.dom.classlist
      , d = ["momondo", "kiwi", "kayak", "skyscanner", "businessclass", "travolic"]
      , a = goog.style
      , t = {
        floor: "plane-vector_carpet",
        aircraft: "comp-plane",
        "seatmap-seatnumber": "comp-plane_seat-number",
        "order-button": "comp-tooltip_order-button",
        "tooltip-button": "comp-tooltip_button",
        "tooltip-arrow": "comp-tooltip_arrow"
    };
    qjv.viewportMonitor = new e,
    qjv.zoom = 1,
    qjv.rtlLanguages_ = ["iw", "he", "ar"],
    qjv.getMagnification = function() {
        var e = qjv.viewportMonitor.getSize().width / qjv.plane.getData("width", u.parseInt);
        return {
            zoom: qjv.utils.getDeviceWidth() / window.innerWidth,
            scale: u.toNumber(u.padNumber(e, 0, 3))
        }
    }
    ,
    qjv.resize = function() {
        var e = qjv.getMagnification();
        qjv.plane.resize(e.scale),
        qjv.tooltip.resize(e)
    }
    ,
    qjv.isRtlLanguage = function() {
        var e = qjv.utils.getCurrentLanguage();
        return qjv.rtlLanguages_.includes(e.toLowerCase())
    }
    ,
    qjv.colorizer = function(i) {
        i.fuselage__fill && (i["tail-stabilizer__fill"] = i["tail-horizontal-stabilizer__fill"] = i.wing__fill = i.fuselage__fill),
        i["fuselage-cut__fill"] && (i["tail-stabilizer__stroke"] = i["tail-horizontal-stabilizer__stroke"] = i.wing__stroke = i["fuselage-cut__fill"]),
        Object.keys(i).forEach(function(t) {
            var e = t.split("__")
              , o = e[0]
              , r = e[e.length - 1];
            ((o = qjv.matchClassNameHandler(o)).includes("tooltip") || o.includes("order")) && (qjv.tooltip.setOptionalColorzation(o, r, i[t]),
            qjv.tooltip.getTooltipNode() && qjv.tooltip.colorizeTooltip());
            o = n.getElementsByClass(o);
            o && s.forEach(o, function(e) {
                a.setStyle(e, r, i[t])
            })
        })
    }
    ,
    qjv.customizeScrollbar = function(e, t, o, r) {
        var i;
        switch (e = void 0 === e ? "auto" : e,
        t = void 0 === t ? "#a8a8a8" : t,
        o = void 0 === o ? "none" : o,
        r = void 0 === r ? "#f1f1f1" : r,
        !0) {
        case 0 === parseInt(e, 10):
            i = "none";
            break;
        case parseInt(e, 10) < 8:
            i = "thin";
            break;
        default:
            i = "auto"
        }
        document.getElementById("scrollbar_style").innerHTML = "\n      ::-webkit-scrollbar {\n        width: " + e + ";\n        height: " + e + ";\n      }\n  \n      ::-webkit-scrollbar-thumb {\n        background: " + t + ";\n        border-radius: " + o + ";\n      }\n  \n      ::-webkit-scrollbar-track {\n        background: " + r + ";\n      }\n    \n      html {\n        scrollbar-color: " + t + " " + r + ";\n        scrollbar-width: " + i + ";\n      }\n    "
    }
    ,
    qjv.matchClassNameHandler = function(e) {
        return t[e] || e
    }
    ,
    qjv.init = function() {
        var e, t = qjv.utils.getUrlParams(), o = n.getElement(document.body), r = document.getElementsByTagName("symbol"), i = document.querySelector("#loading-cover"), s = d.includes(t.colorTheme) ? t.colorTheme : "default", a = "true" === (null == t || null == (e = t.tooltip_on_hover) ? void 0 : e.toLowerCase());
        c.add(o, s);
        for (var g = 0; g < r.length; g++)
            r[g].classList.add(s);
        l.listen(qjv.plane.get(), l.EventType.CLICK, function(e) {
            return qjv.message.mouseClickTracker(e, qjv.plane.getData("scale", u.toNumber))
        }),
        qjv.i18n.setLocale(t.lang || t.language),
        1 < qjv.plane.getNumberOfFloors() && qjv.plane.hideFloor(2),
        qjv.resize(),
        l.listen(qjv.viewportMonitor, l.EventType.RESIZE, qjv.resize),
        qjv.tooltip.setMagnification({
            scale: qjv.plane.getData("scale", u.toNumber),
            zoom: qjv.utils.getDeviceWidth() / window.innerWidth
        }),
        l.listen(window, l.EventType.SCROLL, function() {
            qjv.utils.delay(function() {}, 400)
        }),
        qjv.plane.sign(),
        qjv.seatbar.init(),
        qjv.panorama.init(),
        "hide" === t.seatbar && (qjv.seatbar.hideSeatbar(),
        qjv.plane.removeTopPadding()),
        t.edit ? p.remove(i, "active") : (qjv.panorama.getFragments().then(function() {
            qjv.message.init(),
            p.remove(i, "active")
        }),
        l.listen(window, l.EventType.MESSAGE, qjv.message.handleMessage),
        goog.array.forEach(qjv.seat.find(), function(r) {
            l.listen(r, [l.EventType.CLICK, l.EventType.MOUSEENTER], function(e) {
                var t;
                e.type === l.EventType.MOUSEENTER && !a || ((t = {})[l.EventType.CLICK] = qjv.message.seatPressed,
                t[l.EventType.MOUSEENTER] = qjv.message.seatEntered,
                t = t,
                e.stopPropagation(),
                t[e.type](r),
                qjv.tooltip.show(r),
                qjv.tooltip.resize({
                    scale: qjv.plane.getData("scale", u.toNumber),
                    zoom: qjv.utils.getDeviceWidth() / window.innerWidth
                }, !0))
            }),
            l.listen(r, l.EventType.MOUSELEAVE, function(e) {
                var t, o;
                a && (t = qjv.tooltip.getTooltipNode(),
                o = function() {
                    qjv.message.seatLeft(r),
                    qjv.tooltip.destroy()
                }
                ,
                l.listen(t, l.EventType.MOUSELEAVE, function(e) {
                    null != r && r.contains(e.relatedTarget) || o()
                }),
                null != t && t.contains(e.relatedTarget) || o())
            })
        }))
    }
    ,
    qjv.externalInit = function(e) {
        var t = r.parse(e)
          , o = (o = t.seatNumber) ? o.toUpperCase() : null;
        qjv.seat.clearOwnership(),
        !o || (e = qjv.seat(o)) && (e.setOwner({
            id: t.id,
            name: t.name,
            avatar: t.avatar,
            seatNumber: o,
            seatType: t.seatType,
            gender: t.gender,
            aboutMe: t.aboutMe,
            socialid: t.socialid,
            allowsociallink: t.allowsociallink,
            socialurl: t.socialurl,
            social: void 0
        }),
        document.body.scrollTop = e.offset("top") - 200),
        s.forEach(t.orderedSeats, qjv.seat.block)
    }
    ,
    goog.exportSymbol("quicketWebView.reservations", qjv.reservations.init),
    goog.exportSymbol("quicketWebView.demo", function(e) {
        qjv.DEMO = !0,
        window.quicketWebView.init(e)
    }),
    goog.exportSymbol("quicketWebView.init", function() {
        if (goog.DEBUG)
            return qjv.externalInit.apply(null, arguments);
        try {
            qjv.externalInit.apply(null, arguments)
        } catch (e) {
            alert("There was a problem loading passenger")
        }
    }),
    goog.exportSymbol("quicketWebView.panorama", qjv.panorama.init),
    qjv.init()
});
