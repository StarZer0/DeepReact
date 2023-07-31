(function (global, factory) {
    typeof exports === "object" && typeof module !== "undefined"
      ? factory(exports, require("react"))
      : typeof define === "function" && define.amd
      ? define(["exports", "react"], factory)
      : ((global = global || self), factory((global.ReactDOM = {}), global.React));
  })(this, function (exports, React) {
    "use strict";
  
    var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  
    function formatProdErrorMessage(code) {
      return "formatProdErrorMessage";
    }
  
    var FunctionComponent = 0;
    var ClassComponent = 1;
    var IndeterminateComponent = 2;
    var HostRoot = 3;
    var HostPortal = 4;
    var HostComponent = 5;
    var HostText = 6;
    var Fragment = 7;
    var Mode = 8;
    var ContextConsumer = 9;
    var ContextProvider = 10;
    var ForwardRef = 11;
    var Profiler = 12;
    var SuspenseComponent = 13;
    var MemoComponent = 14;
    var SimpleMemoComponent = 15;
    var LazyComponent = 16;
    var IncompleteClassComponent = 17;
    var DehydratedFragment = 18;
    var SuspenseListComponent = 19;
    var FundamentalComponent = 20;
    var ScopeComponent = 21;
    var Block = 22;
    var OffscreenComponent = 23;
    var LegacyHiddenComponent = 24;
  
    var enableProfilerTimer = false;
    var enableProfilerCommitHooks = false;
    var enableFundamentalAPI = false;
    var enableNewReconciler = false;
  
    var allNativeEvents = new Set();
    var registrationNameDependencies = {};
  
    function registerTwoPhaseEvent(registrationName, dependencies) {
      registerDirectEvent(registrationName, dependencies);
      registerDirectEvent(registrationName + "Capture", dependencies);
    }
    function registerDirectEvent(registrationName, dependencies) {
      registrationNameDependencies[registrationName] = dependencies;
  
      for (var i = 0; i < dependencies.length; i++) {
        allNativeEvents.add(dependencies[i]);
      }
    }
  
    var canUseDOM = !!(
      typeof window !== "undefined" &&
      typeof window.document !== "undefined" &&
      typeof window.document.createElement !== "undefined"
    );
  
    var RESERVED = 0;
  
    var STRING = 1;
  
    var BOOLEANISH_STRING = 2;
  
    var BOOLEAN = 3;
  
    var OVERLOADED_BOOLEAN = 4;
  
    var NUMERIC = 5;
  
    var POSITIVE_NUMERIC = 6;
  
    var ATTRIBUTE_NAME_START_CHAR =
      ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
  
    var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
    var ROOT_ATTRIBUTE_NAME = "data-reactroot";
    var VALID_ATTRIBUTE_NAME_REGEX = new RegExp("^[" + ATTRIBUTE_NAME_START_CHAR + "][" + ATTRIBUTE_NAME_CHAR + "]*$");
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var illegalAttributeNameCache = {};
    var validatedAttributeNameCache = {};
    function isAttributeNameSafe(attributeName) {
      if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) {
        return true;
      }
  
      if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) {
        return false;
      }
  
      if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
        validatedAttributeNameCache[attributeName] = true;
        return true;
      }
  
      illegalAttributeNameCache[attributeName] = true;
  
      return false;
    }
    function shouldIgnoreAttribute(name, propertyInfo, isCustomComponentTag) {
      if (propertyInfo !== null) {
        return propertyInfo.type === RESERVED;
      }
  
      if (isCustomComponentTag) {
        return false;
      }
  
      if (name.length > 2 && (name[0] === "o" || name[0] === "O") && (name[1] === "n" || name[1] === "N")) {
        return true;
      }
  
      return false;
    }
    function shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag) {
      if (propertyInfo !== null && propertyInfo.type === RESERVED) {
        return false;
      }
  
      switch (typeof value) {
        case "function":
  
        case "symbol":
          return true;
  
        case "boolean": {
          if (isCustomComponentTag) {
            return false;
          }
  
          if (propertyInfo !== null) {
            return !propertyInfo.acceptsBooleans;
          } else {
            var prefix = name.toLowerCase().slice(0, 5);
            return prefix !== "data-" && prefix !== "aria-";
          }
        }
  
        default:
          return false;
      }
    }
    function shouldRemoveAttribute(name, value, propertyInfo, isCustomComponentTag) {
      if (value === null || typeof value === "undefined") {
        return true;
      }
  
      if (shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag)) {
        return true;
      }
  
      if (isCustomComponentTag) {
        return false;
      }
  
      if (propertyInfo !== null) {
        switch (propertyInfo.type) {
          case BOOLEAN:
            return !value;
  
          case OVERLOADED_BOOLEAN:
            return value === false;
  
          case NUMERIC:
            return isNaN(value);
  
          case POSITIVE_NUMERIC:
            return isNaN(value) || value < 1;
        }
      }
  
      return false;
    }
    function getPropertyInfo(name) {
      return properties.hasOwnProperty(name) ? properties[name] : null;
    }
  
    function PropertyInfoRecord(
      name,
      type,
      mustUseProperty,
      attributeName,
      attributeNamespace,
      sanitizeURL,
      removeEmptyString
    ) {
      this.acceptsBooleans = type === BOOLEANISH_STRING || type === BOOLEAN || type === OVERLOADED_BOOLEAN;
      this.attributeName = attributeName;
      this.attributeNamespace = attributeNamespace;
      this.mustUseProperty = mustUseProperty;
      this.propertyName = name;
      this.type = type;
      this.sanitizeURL = sanitizeURL;
      this.removeEmptyString = removeEmptyString;
    }
  
    var properties = {};
  
    var reservedProps = [
      "children",
      "dangerouslySetInnerHTML",
  
      "defaultValue",
      "defaultChecked",
      "innerHTML",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
      "style",
    ];
    reservedProps.forEach(function (name) {
      properties[name] = new PropertyInfoRecord(name, RESERVED, false, name, null, false, false);
    });
  
    [
      ["acceptCharset", "accept-charset"],
      ["className", "class"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
    ].forEach(function (_ref) {
      var name = _ref[0],
        attributeName = _ref[1];
      properties[name] = new PropertyInfoRecord(name, STRING, false, attributeName, null, false, false);
    });
  
    ["contentEditable", "draggable", "spellCheck", "value"].forEach(function (name) {
      properties[name] = new PropertyInfoRecord(name, BOOLEANISH_STRING, false, name.toLowerCase(), null, false, false);
    });
  
    ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function (name) {
      properties[name] = new PropertyInfoRecord(name, BOOLEANISH_STRING, false, name, null, false, false);
    });
  
    [
      "allowFullScreen",
      "async",
      "autoFocus",
      "autoPlay",
      "controls",
      "default",
      "defer",
      "disabled",
      "disablePictureInPicture",
      "disableRemotePlayback",
      "formNoValidate",
      "hidden",
      "loop",
      "noModule",
      "noValidate",
      "open",
      "playsInline",
      "readOnly",
      "required",
      "reversed",
      "scoped",
      "seamless",
      "itemScope",
    ].forEach(function (name) {
      properties[name] = new PropertyInfoRecord(name, BOOLEAN, false, name.toLowerCase(), null, false, false);
    });
  
    ["checked", "multiple", "muted", "selected"].forEach(function (name) {
      properties[name] = new PropertyInfoRecord(name, BOOLEAN, true, name, null, false, false);
    });
  
    ["capture", "download"].forEach(function (name) {
      properties[name] = new PropertyInfoRecord(name, OVERLOADED_BOOLEAN, false, name, null, false, false);
    });
  
    ["cols", "rows", "size", "span"].forEach(function (name) {
      properties[name] = new PropertyInfoRecord(name, POSITIVE_NUMERIC, false, name, null, false, false);
    });
  
    ["rowSpan", "start"].forEach(function (name) {
      properties[name] = new PropertyInfoRecord(name, NUMERIC, false, name.toLowerCase(), null, false, false);
    });
    var CAMELIZE = /[\-\:]([a-z])/g;
  
    var capitalize = function (token) {
      return token[1].toUpperCase();
    };
  
    [
      "accent-height",
      "alignment-baseline",
      "arabic-form",
      "baseline-shift",
      "cap-height",
      "clip-path",
      "clip-rule",
      "color-interpolation",
      "color-interpolation-filters",
      "color-profile",
      "color-rendering",
      "dominant-baseline",
      "enable-background",
      "fill-opacity",
      "fill-rule",
      "flood-color",
      "flood-opacity",
      "font-family",
      "font-size",
      "font-size-adjust",
      "font-stretch",
      "font-style",
      "font-variant",
      "font-weight",
      "glyph-name",
      "glyph-orientation-horizontal",
      "glyph-orientation-vertical",
      "horiz-adv-x",
      "horiz-origin-x",
      "image-rendering",
      "letter-spacing",
      "lighting-color",
      "marker-end",
      "marker-mid",
      "marker-start",
      "overline-position",
      "overline-thickness",
      "paint-order",
      "panose-1",
      "pointer-events",
      "rendering-intent",
      "shape-rendering",
      "stop-color",
      "stop-opacity",
      "strikethrough-position",
      "strikethrough-thickness",
      "stroke-dasharray",
      "stroke-dashoffset",
      "stroke-linecap",
      "stroke-linejoin",
      "stroke-miterlimit",
      "stroke-opacity",
      "stroke-width",
      "text-anchor",
      "text-decoration",
      "text-rendering",
      "underline-position",
      "underline-thickness",
      "unicode-bidi",
      "unicode-range",
      "units-per-em",
      "v-alphabetic",
      "v-hanging",
      "v-ideographic",
      "v-mathematical",
      "vector-effect",
      "vert-adv-y",
      "vert-origin-x",
      "vert-origin-y",
      "word-spacing",
      "writing-mode",
      "xmlns:xlink",
      "x-height",
    ].forEach(function (attributeName) {
      var name = attributeName.replace(CAMELIZE, capitalize);
      properties[name] = new PropertyInfoRecord(name, STRING, false, attributeName, null, false, false);
    });
  
    ["xlink:actuate", "xlink:arcrole", "xlink:role", "xlink:show", "xlink:title", "xlink:type"].forEach(function (
      attributeName
    ) {
      var name = attributeName.replace(CAMELIZE, capitalize);
      properties[name] = new PropertyInfoRecord(
        name,
        STRING,
        false,
        attributeName,
        "http://www.w3.org/1999/xlink",
        false,
        false
      );
    });
  
    ["xml:base", "xml:lang", "xml:space"].forEach(function (attributeName) {
      var name = attributeName.replace(CAMELIZE, capitalize);
      properties[name] = new PropertyInfoRecord(
        name,
        STRING,
        false,
        attributeName,
        "http://www.w3.org/XML/1998/namespace",
        false,
        false
      );
    });
  
    ["tabIndex", "crossOrigin"].forEach(function (attributeName) {
      properties[attributeName] = new PropertyInfoRecord(
        attributeName,
        STRING,
        false,
        attributeName.toLowerCase(),
        null,
        false,
        false
      );
    });
  
    var xlinkHref = "xlinkHref";
    properties[xlinkHref] = new PropertyInfoRecord(
      "xlinkHref",
      STRING,
      false,
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      true,
      false
    );
    ["src", "href", "action", "formAction"].forEach(function (attributeName) {
      properties[attributeName] = new PropertyInfoRecord(
        attributeName,
        STRING,
        false,
        attributeName.toLowerCase(),
        null,
        true,
        true
      );
    });
  
    function sanitizeURL(url) {}
  
    /**
     * Sets the value for a property on a node.
     *
     * @param {DOMElement} node
     * @param {string} name
     * @param {*} value
     */
  
    function setValueForProperty(node, name, value, isCustomComponentTag) {
      var propertyInfo = getPropertyInfo(name);
  
      if (shouldIgnoreAttribute(name, propertyInfo, isCustomComponentTag)) {
        return;
      }
  
      if (shouldRemoveAttribute(name, value, propertyInfo, isCustomComponentTag)) {
        value = null;
      }
  
      if (isCustomComponentTag || propertyInfo === null) {
        if (isAttributeNameSafe(name)) {
          var _attributeName = name;
  
          if (value === null) {
            node.removeAttribute(_attributeName);
          } else {
            node.setAttribute(_attributeName, "" + value);
          }
        }
  
        return;
      }
  
      var mustUseProperty = propertyInfo.mustUseProperty;
  
      if (mustUseProperty) {
        var propertyName = propertyInfo.propertyName;
  
        if (value === null) {
          var type = propertyInfo.type;
          node[propertyName] = type === BOOLEAN ? false : "";
        } else {
          node[propertyName] = value;
        }
  
        return;
      }
  
      var attributeName = propertyInfo.attributeName,
        attributeNamespace = propertyInfo.attributeNamespace;
  
      if (value === null) {
        node.removeAttribute(attributeName);
      } else {
        var _type = propertyInfo.type;
        var attributeValue;
  
        if (_type === BOOLEAN || (_type === OVERLOADED_BOOLEAN && value === true)) {
          attributeValue = "";
        } else {
          {
            attributeValue = "" + value;
          }
  
          if (propertyInfo.sanitizeURL) {
            sanitizeURL(attributeValue.toString());
          }
        }
  
        if (attributeNamespace) {
          node.setAttributeNS(attributeNamespace, attributeName, attributeValue);
        } else {
          node.setAttribute(attributeName, attributeValue);
        }
      }
    }
  
    var ReactInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    var _assign = ReactInternals.assign;
  
    var REACT_ELEMENT_TYPE = 0xeac7;
    var REACT_PORTAL_TYPE = 0xeaca;
    var REACT_FRAGMENT_TYPE = 0xeacb;
    var REACT_STRICT_MODE_TYPE = 0xeacc;
    var REACT_PROFILER_TYPE = 0xead2;
    var REACT_PROVIDER_TYPE = 0xeacd;
    var REACT_CONTEXT_TYPE = 0xeace;
    var REACT_FORWARD_REF_TYPE = 0xead0;
    var REACT_SUSPENSE_TYPE = 0xead1;
    var REACT_SUSPENSE_LIST_TYPE = 0xead8;
    var REACT_MEMO_TYPE = 0xead3;
    var REACT_LAZY_TYPE = 0xead4;
    var REACT_BLOCK_TYPE = 0xead9;
    var REACT_SERVER_BLOCK_TYPE = 0xeada;
    var REACT_FUNDAMENTAL_TYPE = 0xead5;
    var REACT_SCOPE_TYPE = 0xead7;
    var REACT_OPAQUE_ID_TYPE = 0xeae0;
    var REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1;
    var REACT_OFFSCREEN_TYPE = 0xeae2;
    var REACT_LEGACY_HIDDEN_TYPE = 0xeae3;
  
    if (typeof Symbol === "function" && Symbol.for) {
      var symbolFor = Symbol.for;
      REACT_ELEMENT_TYPE = symbolFor("react.element");
      REACT_PORTAL_TYPE = symbolFor("react.portal");
      REACT_FRAGMENT_TYPE = symbolFor("react.fragment");
      REACT_STRICT_MODE_TYPE = symbolFor("react.strict_mode");
      REACT_PROFILER_TYPE = symbolFor("react.profiler");
      REACT_PROVIDER_TYPE = symbolFor("react.provider");
      REACT_CONTEXT_TYPE = symbolFor("react.context");
      REACT_FORWARD_REF_TYPE = symbolFor("react.forward_ref");
      REACT_SUSPENSE_TYPE = symbolFor("react.suspense");
      REACT_SUSPENSE_LIST_TYPE = symbolFor("react.suspense_list");
      REACT_MEMO_TYPE = symbolFor("react.memo");
      REACT_LAZY_TYPE = symbolFor("react.lazy");
      REACT_BLOCK_TYPE = symbolFor("react.block");
      REACT_SERVER_BLOCK_TYPE = symbolFor("react.server.block");
      REACT_FUNDAMENTAL_TYPE = symbolFor("react.fundamental");
      REACT_SCOPE_TYPE = symbolFor("react.scope");
      REACT_OPAQUE_ID_TYPE = symbolFor("react.opaque.id");
      REACT_DEBUG_TRACING_MODE_TYPE = symbolFor("react.debug_trace_mode");
      REACT_OFFSCREEN_TYPE = symbolFor("react.offscreen");
      REACT_LEGACY_HIDDEN_TYPE = symbolFor("react.legacy_hidden");
    }
  
    var MAYBE_ITERATOR_SYMBOL = typeof Symbol === "function" && Symbol.iterator;
    var FAUX_ITERATOR_SYMBOL = "@@iterator";
    function getIteratorFn(maybeIterable) {
      if (maybeIterable === null || typeof maybeIterable !== "object") {
        return null;
      }
  
      var maybeIterator =
        (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) || maybeIterable[FAUX_ITERATOR_SYMBOL];
  
      if (typeof maybeIterator === "function") {
        return maybeIterator;
      }
  
      return null;
    }
  
    var prefix;
    function describeBuiltInComponentFrame(name) {
      {
        if (prefix === undefined) {
          try {
            throw Error();
          } catch (x) {
            var match = x.stack.trim().match(/\n( *(at )?)/);
            prefix = (match && match[1]) || "";
          }
        }
  
        return "\n" + prefix + name;
      }
    }
    var reentry = false;
  
    function describeNativeComponentFrame(fn, construct) {
      if (!fn || reentry) {
        return "";
      }
  
      var control;
      reentry = true;
      var previousPrepareStackTrace = Error.prepareStackTrace;
  
      Error.prepareStackTrace = undefined;
  
      try {
        if (construct) {
          var Fake = function () {
            throw Error();
          };
  
          Object.defineProperty(Fake.prototype, "props", {
            set: function () {
              throw Error();
            },
          });
  
          if (typeof Reflect === "object" && Reflect.construct) {
            try {
              Reflect.construct(Fake, []);
            } catch (x) {
              control = x;
            }
  
            Reflect.construct(fn, [], Fake);
          } else {
            try {
              Fake.call();
            } catch (x) {
              control = x;
            }
  
            fn.call(Fake.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (x) {
            control = x;
          }
  
          fn();
        }
      } catch (sample) {
        if (sample && control && typeof sample.stack === "string") {
          var sampleLines = sample.stack.split("\n");
          var controlLines = control.stack.split("\n");
          var s = sampleLines.length - 1;
          var c = controlLines.length - 1;
  
          while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
            c--;
          }
  
          for (; s >= 1 && c >= 0; s--, c--) {
            if (sampleLines[s] !== controlLines[c]) {
              if (s !== 1 || c !== 1) {
                do {
                  s--;
                  c--;
  
                  if (c < 0 || sampleLines[s] !== controlLines[c]) {
                    var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
  
                    return _frame;
                  }
                } while (s >= 1 && c >= 0);
              }
  
              break;
            }
          }
        }
      } finally {
        reentry = false;
  
        Error.prepareStackTrace = previousPrepareStackTrace;
      }
  
      var name = fn ? fn.displayName || fn.name : "";
      var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
  
      return syntheticFrame;
    }
  
    function describeClassComponentFrame(ctor) {
      {
        return describeNativeComponentFrame(ctor, true);
      }
    }
    function describeFunctionComponentFrame(fn) {
      {
        return describeNativeComponentFrame(fn, false);
      }
    }
  
    function describeFiber(fiber) {
      switch (fiber.tag) {
        case HostComponent:
          return describeBuiltInComponentFrame(fiber.type);
  
        case LazyComponent:
          return describeBuiltInComponentFrame("Lazy");
  
        case SuspenseComponent:
          return describeBuiltInComponentFrame("Suspense");
  
        case SuspenseListComponent:
          return describeBuiltInComponentFrame("SuspenseList");
  
        case FunctionComponent:
        case IndeterminateComponent:
        case SimpleMemoComponent:
          return describeFunctionComponentFrame(fiber.type);
  
        case ForwardRef:
          return describeFunctionComponentFrame(fiber.type.render);
  
        case Block:
          return describeFunctionComponentFrame(fiber.type._render);
  
        case ClassComponent:
          return describeClassComponentFrame(fiber.type);
  
        default:
          return "";
      }
    }
  
    function getStackByFiberInDevAndProd(workInProgress) {
      try {
        var info = "";
        var node = workInProgress;
  
        do {
          info += describeFiber(node);
          node = node.return;
        } while (node);
  
        return info;
      } catch (x) {
        return "\nError generating stack: " + x.message + "\n" + x.stack;
      }
    }
  
    function getWrappedName(outerType, innerType, wrapperName) {
      var functionName = innerType.displayName || innerType.name || "";
      return outerType.displayName || (functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName);
    }
  
    function getContextName(type) {
      return type.displayName || "Context";
    }
  
    function getComponentName(type) {
      if (type == null) {
        return null;
      }
  
      if (typeof type === "function") {
        return type.displayName || type.name || null;
      }
  
      if (typeof type === "string") {
        return type;
      }
  
      switch (type) {
        case REACT_FRAGMENT_TYPE:
          return "Fragment";
  
        case REACT_PORTAL_TYPE:
          return "Portal";
  
        case REACT_PROFILER_TYPE:
          return "Profiler";
  
        case REACT_STRICT_MODE_TYPE:
          return "StrictMode";
  
        case REACT_SUSPENSE_TYPE:
          return "Suspense";
  
        case REACT_SUSPENSE_LIST_TYPE:
          return "SuspenseList";
      }
  
      if (typeof type === "object") {
        switch (type.$$typeof) {
          case REACT_CONTEXT_TYPE:
            var context = type;
            return getContextName(context) + ".Consumer";
  
          case REACT_PROVIDER_TYPE:
            var provider = type;
            return getContextName(provider._context) + ".Provider";
  
          case REACT_FORWARD_REF_TYPE:
            return getWrappedName(type, type.render, "ForwardRef");
  
          case REACT_MEMO_TYPE:
            return getComponentName(type.type);
  
          case REACT_BLOCK_TYPE:
            return getComponentName(type._render);
  
          case REACT_LAZY_TYPE: {
            var lazyComponent = type;
            var payload = lazyComponent._payload;
            var init = lazyComponent._init;
  
            try {
              return getComponentName(init(payload));
            } catch (x) {
              return null;
            }
          }
        }
      }
  
      return null;
    }
  
    function resetCurrentFiber() {}
  
    function toString(value) {
      return "" + value;
    }
    function getToStringValue(value) {
      switch (typeof value) {
        case "boolean":
        case "number":
        case "object":
        case "string":
        case "undefined":
          return value;
  
        default:
          return "";
      }
    }
  
    function isCheckable(elem) {
      var type = elem.type;
      var nodeName = elem.nodeName;
      return nodeName && nodeName.toLowerCase() === "input" && (type === "checkbox" || type === "radio");
    }
  
    function getTracker(node) {
      return node._valueTracker;
    }
  
    function detachTracker(node) {
      node._valueTracker = null;
    }
  
    function getValueFromNode(node) {
      var value = "";
  
      if (!node) {
        return value;
      }
  
      if (isCheckable(node)) {
        value = node.checked ? "true" : "false";
      } else {
        value = node.value;
      }
  
      return value;
    }
  
    function trackValueOnNode(node) {
      var valueField = isCheckable(node) ? "checked" : "value";
      var descriptor = Object.getOwnPropertyDescriptor(node.constructor.prototype, valueField);
      var currentValue = "" + node[valueField];
  
      if (
        node.hasOwnProperty(valueField) ||
        typeof descriptor === "undefined" ||
        typeof descriptor.get !== "function" ||
        typeof descriptor.set !== "function"
      ) {
        return;
      }
  
      var get = descriptor.get,
        set = descriptor.set;
      Object.defineProperty(node, valueField, {
        configurable: true,
        get: function () {
          return get.call(this);
        },
        set: function (value) {
          currentValue = "" + value;
          set.call(this, value);
        },
      });
  
      Object.defineProperty(node, valueField, {
        enumerable: descriptor.enumerable,
      });
      var tracker = {
        getValue: function () {
          return currentValue;
        },
        setValue: function (value) {
          currentValue = "" + value;
        },
        stopTracking: function () {
          detachTracker(node);
          delete node[valueField];
        },
      };
      return tracker;
    }
  
    function track(node) {
      if (getTracker(node)) {
        return;
      }
  
      node._valueTracker = trackValueOnNode(node);
    }
    function updateValueIfChanged(node) {
      if (!node) {
        return false;
      }
  
      var tracker = getTracker(node);
  
      if (!tracker) {
        return true;
      }
  
      var lastValue = tracker.getValue();
      var nextValue = getValueFromNode(node);
  
      if (nextValue !== lastValue) {
        tracker.setValue(nextValue);
        return true;
      }
  
      return false;
    }
  
    function getActiveElement(doc) {
      doc = doc || (typeof document !== "undefined" ? document : undefined);
  
      if (typeof doc === "undefined") {
        return null;
      }
  
      try {
        return doc.activeElement || doc.body;
      } catch (e) {
        return doc.body;
      }
    }
  
    function isControlled(props) {
      var usesChecked = props.type === "checkbox" || props.type === "radio";
      return usesChecked ? props.checked != null : props.value != null;
    }
  
    function getHostProps(element, props) {
      var node = element;
      var checked = props.checked;
  
      var hostProps = _assign({}, props, {
        defaultChecked: undefined,
        defaultValue: undefined,
        value: undefined,
        checked: checked != null ? checked : node._wrapperState.initialChecked,
      });
  
      return hostProps;
    }
    function initWrapperState(element, props) {
      var node = element;
      var defaultValue = props.defaultValue == null ? "" : props.defaultValue;
      node._wrapperState = {
        initialChecked: props.checked != null ? props.checked : props.defaultChecked,
        initialValue: getToStringValue(props.value != null ? props.value : defaultValue),
        controlled: isControlled(props),
      };
    }
    function updateChecked(element, props) {
      var node = element;
      var checked = props.checked;
  
      if (checked != null) {
        setValueForProperty(node, "checked", checked, false);
      }
    }
    function updateWrapper(element, props) {
      var node = element;
  
      updateChecked(element, props);
      var value = getToStringValue(props.value);
      var type = props.type;
  
      if (value != null) {
        if (type === "number") {
          if ((value === 0 && node.value === "") || node.value != value) {
            node.value = toString(value);
          }
        } else if (node.value !== toString(value)) {
          node.value = toString(value);
        }
      } else if (type === "submit" || type === "reset") {
        node.removeAttribute("value");
        return;
      }
  
      if (props.hasOwnProperty("value")) {
        setDefaultValue(node, props.type, value);
      } else if (props.hasOwnProperty("defaultValue")) {
        setDefaultValue(node, props.type, getToStringValue(props.defaultValue));
      }
  
      if (props.checked == null && props.defaultChecked != null) {
        node.defaultChecked = !!props.defaultChecked;
      }
    }
    function postMountWrapper(element, props, isHydrating) {
      var node = element;
  
      if (props.hasOwnProperty("value") || props.hasOwnProperty("defaultValue")) {
        var type = props.type;
        var isButton = type === "submit" || type === "reset";
  
        if (isButton && (props.value === undefined || props.value === null)) {
          return;
        }
  
        var initialValue = toString(node._wrapperState.initialValue);
  
        if (!isHydrating) {
          if (initialValue !== node.value) {
            node.value = initialValue;
          }
        }
  
        node.defaultValue = initialValue;
      }
  
      var name = node.name;
  
      if (name !== "") {
        node.name = "";
      }
  
      node.defaultChecked = !node.defaultChecked;
      node.defaultChecked = !!node._wrapperState.initialChecked;
  
      if (name !== "") {
        node.name = name;
      }
    }
    function restoreControlledState(element, props) {
      var node = element;
      updateWrapper(node, props);
      updateNamedCousins(node, props);
    }
  
    function updateNamedCousins(rootNode, props) {
      var name = props.name;
  
      if (props.type === "radio" && name != null) {
        var queryRoot = rootNode;
  
        while (queryRoot.parentNode) {
          queryRoot = queryRoot.parentNode;
        }
  
        var group = queryRoot.querySelectorAll("input[name=" + JSON.stringify("" + name) + '][type="radio"]');
  
        for (var i = 0; i < group.length; i++) {
          var otherNode = group[i];
  
          if (otherNode === rootNode || otherNode.form !== rootNode.form) {
            continue;
          }
  
          var otherProps = getFiberCurrentPropsFromNode(otherNode);
  
          if (!otherProps) {
            {
              throw Error(formatProdErrorMessage(90));
            }
          }
  
          updateValueIfChanged(otherNode);
  
          updateWrapper(otherNode, otherProps);
        }
      }
    }
  
    function setDefaultValue(node, type, value) {
      if (type !== "number" || getActiveElement(node.ownerDocument) !== node) {
        if (value == null) {
          node.defaultValue = toString(node._wrapperState.initialValue);
        } else if (node.defaultValue !== toString(value)) {
          node.defaultValue = toString(value);
        }
      }
    }
  
    function flattenChildren(children) {
      var content = "";
  
      React.Children.forEach(children, function (child) {
        if (child == null) {
          return;
        }
  
        content += child;
      });
      return content;
    }
    function postMountWrapper$1(element, props) {
      if (props.value != null) {
        element.setAttribute("value", toString(getToStringValue(props.value)));
      }
    }
    function getHostProps$1(element, props) {
      var hostProps = _assign(
        {
          children: undefined,
        },
        props
      );
  
      var content = flattenChildren(props.children);
  
      if (content) {
        hostProps.children = content;
      }
  
      return hostProps;
    }
  
    function updateOptions(node, multiple, propValue, setDefaultSelected) {
      var options = node.options;
  
      if (multiple) {
        var selectedValues = propValue;
        var selectedValue = {};
  
        for (var i = 0; i < selectedValues.length; i++) {
          selectedValue["$" + selectedValues[i]] = true;
        }
  
        for (var _i = 0; _i < options.length; _i++) {
          var selected = selectedValue.hasOwnProperty("$" + options[_i].value);
  
          if (options[_i].selected !== selected) {
            options[_i].selected = selected;
          }
  
          if (selected && setDefaultSelected) {
            options[_i].defaultSelected = true;
          }
        }
      } else {
        var _selectedValue = toString(getToStringValue(propValue));
  
        var defaultSelected = null;
  
        for (var _i2 = 0; _i2 < options.length; _i2++) {
          if (options[_i2].value === _selectedValue) {
            options[_i2].selected = true;
  
            if (setDefaultSelected) {
              options[_i2].defaultSelected = true;
            }
  
            return;
          }
  
          if (defaultSelected === null && !options[_i2].disabled) {
            defaultSelected = options[_i2];
          }
        }
  
        if (defaultSelected !== null) {
          defaultSelected.selected = true;
        }
      }
    }
  
    function getHostProps$2(element, props) {
      return _assign({}, props, {
        value: undefined,
      });
    }
    function initWrapperState$1(element, props) {
      var node = element;
  
      node._wrapperState = {
        wasMultiple: !!props.multiple,
      };
    }
    function postMountWrapper$2(element, props) {
      var node = element;
      node.multiple = !!props.multiple;
      var value = props.value;
  
      if (value != null) {
        updateOptions(node, !!props.multiple, value, false);
      } else if (props.defaultValue != null) {
        updateOptions(node, !!props.multiple, props.defaultValue, true);
      }
    }
    function postUpdateWrapper(element, props) {
      var node = element;
      var wasMultiple = node._wrapperState.wasMultiple;
      node._wrapperState.wasMultiple = !!props.multiple;
      var value = props.value;
  
      if (value != null) {
        updateOptions(node, !!props.multiple, value, false);
      } else if (wasMultiple !== !!props.multiple) {
        if (props.defaultValue != null) {
          updateOptions(node, !!props.multiple, props.defaultValue, true);
        } else {
          updateOptions(node, !!props.multiple, props.multiple ? [] : "", false);
        }
      }
    }
    function restoreControlledState$1(element, props) {
      var node = element;
      var value = props.value;
  
      if (value != null) {
        updateOptions(node, !!props.multiple, value, false);
      }
    }
  
    function getHostProps$3(element, props) {
      var node = element;
  
      if (!(props.dangerouslySetInnerHTML == null)) {
        {
          throw Error(formatProdErrorMessage(91));
        }
      }
  
      var hostProps = _assign({}, props, {
        value: undefined,
        defaultValue: undefined,
        children: toString(node._wrapperState.initialValue),
      });
  
      return hostProps;
    }
    function initWrapperState$2(element, props) {
      var node = element;
  
      var initialValue = props.value;
  
      if (initialValue == null) {
        var children = props.children,
          defaultValue = props.defaultValue;
  
        if (children != null) {
          {
            if (!(defaultValue == null)) {
              {
                throw Error(formatProdErrorMessage(92));
              }
            }
  
            if (Array.isArray(children)) {
              if (!(children.length <= 1)) {
                {
                  throw Error(formatProdErrorMessage(93));
                }
              }
  
              children = children[0];
            }
  
            defaultValue = children;
          }
        }
  
        if (defaultValue == null) {
          defaultValue = "";
        }
  
        initialValue = defaultValue;
      }
  
      node._wrapperState = {
        initialValue: getToStringValue(initialValue),
      };
    }
    function updateWrapper$1(element, props) {
      var node = element;
      var value = getToStringValue(props.value);
      var defaultValue = getToStringValue(props.defaultValue);
  
      if (value != null) {
        var newValue = toString(value);
  
        if (newValue !== node.value) {
          node.value = newValue;
        }
  
        if (props.defaultValue == null && node.defaultValue !== newValue) {
          node.defaultValue = newValue;
        }
      }
  
      if (defaultValue != null) {
        node.defaultValue = toString(defaultValue);
      }
    }
    function postMountWrapper$3(element) {
      var node = element;
  
      var textContent = node.textContent;
  
      if (textContent === node._wrapperState.initialValue) {
        if (textContent !== "" && textContent !== null) {
          node.value = textContent;
        }
      }
    }
    function restoreControlledState$2(element, props) {
      updateWrapper$1(element, props);
    }
  
    var HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
    var MATH_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
    var SVG_NAMESPACE = "http://www.w3.org/2000/svg";
    var Namespaces = {
      html: HTML_NAMESPACE,
      mathml: MATH_NAMESPACE,
      svg: SVG_NAMESPACE,
    };
  
    function getIntrinsicNamespace(type) {
      switch (type) {
        case "svg":
          return SVG_NAMESPACE;
  
        case "math":
          return MATH_NAMESPACE;
  
        default:
          return HTML_NAMESPACE;
      }
    }
    function getChildNamespace(parentNamespace, type) {
      if (parentNamespace == null || parentNamespace === HTML_NAMESPACE) {
        return getIntrinsicNamespace(type);
      }
  
      if (parentNamespace === SVG_NAMESPACE && type === "foreignObject") {
        return HTML_NAMESPACE;
      }
  
      return parentNamespace;
    }
  
    var createMicrosoftUnsafeLocalFunction = function (func) {
      if (typeof MSApp !== "undefined" && MSApp.execUnsafeLocalFunction) {
        return function (arg0, arg1, arg2, arg3) {
          MSApp.execUnsafeLocalFunction(function () {
            return func(arg0, arg1, arg2, arg3);
          });
        };
      } else {
        return func;
      }
    };
  
    var reusableSVGContainer;
  
    var setInnerHTML = createMicrosoftUnsafeLocalFunction(function (node, html) {
      if (node.namespaceURI === Namespaces.svg) {
        if (!("innerHTML" in node)) {
          reusableSVGContainer = reusableSVGContainer || document.createElement("div");
          reusableSVGContainer.innerHTML = "<svg>" + html.valueOf().toString() + "</svg>";
          var svgNode = reusableSVGContainer.firstChild;
  
          while (node.firstChild) {
            node.removeChild(node.firstChild);
          }
  
          while (svgNode.firstChild) {
            node.appendChild(svgNode.firstChild);
          }
  
          return;
        }
      }
  
      node.innerHTML = html;
    });
  
    var ELEMENT_NODE = 1;
    var TEXT_NODE = 3;
    var COMMENT_NODE = 8;
    var DOCUMENT_NODE = 9;
    var DOCUMENT_FRAGMENT_NODE = 11;
  
    var setTextContent = function (node, text) {
      if (text) {
        var firstChild = node.firstChild;
  
        if (firstChild && firstChild === node.lastChild && firstChild.nodeType === TEXT_NODE) {
          firstChild.nodeValue = text;
          return;
        }
      }
  
      node.textContent = text;
    };
  
    var isUnitlessNumber = {
      animationIterationCount: true,
      borderImageOutset: true,
      borderImageSlice: true,
      borderImageWidth: true,
      boxFlex: true,
      boxFlexGroup: true,
      boxOrdinalGroup: true,
      columnCount: true,
      columns: true,
      flex: true,
      flexGrow: true,
      flexPositive: true,
      flexShrink: true,
      flexNegative: true,
      flexOrder: true,
      gridArea: true,
      gridRow: true,
      gridRowEnd: true,
      gridRowSpan: true,
      gridRowStart: true,
      gridColumn: true,
      gridColumnEnd: true,
      gridColumnSpan: true,
      gridColumnStart: true,
      fontWeight: true,
      lineClamp: true,
      lineHeight: true,
      opacity: true,
      order: true,
      orphans: true,
      tabSize: true,
      widows: true,
      zIndex: true,
      zoom: true,
  
      fillOpacity: true,
      floodOpacity: true,
      stopOpacity: true,
      strokeDasharray: true,
      strokeDashoffset: true,
      strokeMiterlimit: true,
      strokeOpacity: true,
      strokeWidth: true,
    };
  
    function prefixKey(prefix, key) {
      return prefix + key.charAt(0).toUpperCase() + key.substring(1);
    }
  
    var prefixes = ["Webkit", "ms", "Moz", "O"];
  
    Object.keys(isUnitlessNumber).forEach(function (prop) {
      prefixes.forEach(function (prefix) {
        isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
      });
    });
  
    function dangerousStyleValue(name, value, isCustomProperty) {
      var isEmpty = value == null || typeof value === "boolean" || value === "";
  
      if (isEmpty) {
        return "";
      }
  
      if (
        !isCustomProperty &&
        typeof value === "number" &&
        value !== 0 &&
        !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])
      ) {
        return value + "px";
      }
  
      return ("" + value).trim();
    }
  
    function setValueForStyles(node, styles) {
      var style = node.style;
  
      for (var styleName in styles) {
        if (!styles.hasOwnProperty(styleName)) {
          continue;
        }
  
        var isCustomProperty = styleName.indexOf("--") === 0;
  
        var styleValue = dangerousStyleValue(styleName, styles[styleName], isCustomProperty);
  
        if (styleName === "float") {
          styleName = "cssFloat";
        }
  
        if (isCustomProperty) {
          style.setProperty(styleName, styleValue);
        } else {
          style[styleName] = styleValue;
        }
      }
    }
  
    var omittedCloseTags = {
      area: true,
      base: true,
      br: true,
      col: true,
      embed: true,
      hr: true,
      img: true,
      input: true,
      keygen: true,
      link: true,
      meta: true,
      param: true,
      source: true,
      track: true,
      wbr: true,
    };
  
    var voidElementTags = _assign(
      {
        menuitem: true,
      },
      omittedCloseTags
    );
  
    var HTML = "__html";
  
    function assertValidProps(tag, props) {
      if (!props) {
        return;
      }
  
      if (voidElementTags[tag]) {
        if (!(props.children == null && props.dangerouslySetInnerHTML == null)) {
          {
            throw Error(formatProdErrorMessage(137, tag));
          }
        }
      }
  
      if (props.dangerouslySetInnerHTML != null) {
        if (!(props.children == null)) {
          {
            throw Error(formatProdErrorMessage(60));
          }
        }
  
        if (!(typeof props.dangerouslySetInnerHTML === "object" && HTML in props.dangerouslySetInnerHTML)) {
          {
            throw Error(formatProdErrorMessage(61));
          }
        }
      }
  
      if (!(props.style == null || typeof props.style === "object")) {
        {
          throw Error(formatProdErrorMessage(62));
        }
      }
    }
  
    function isCustomComponent(tagName, props) {
      if (tagName.indexOf("-") === -1) {
        return typeof props.is === "string";
      }
  
      switch (tagName) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return false;
  
        default:
          return true;
      }
    }
  
    var IS_EVENT_HANDLE_NON_MANAGED_NODE = 1;
    var IS_NON_DELEGATED = 1 << 1;
    var IS_CAPTURE_PHASE = 1 << 2;
    var IS_REPLAYED = 1 << 4;
  
    var SHOULD_NOT_PROCESS_POLYFILL_EVENT_PLUGINS =
      IS_EVENT_HANDLE_NON_MANAGED_NODE | IS_NON_DELEGATED | IS_CAPTURE_PHASE;
  
    function getEventTarget(nativeEvent) {
      var target = nativeEvent.target || nativeEvent.srcElement || window;
  
      if (target.correspondingUseElement) {
        target = target.correspondingUseElement;
      }
  
      return target.nodeType === TEXT_NODE ? target.parentNode : target;
    }
  
    var restoreImpl = null;
    var restoreTarget = null;
    var restoreQueue = null;
  
    function restoreStateOfTarget(target) {
      var internalInstance = getInstanceFromNode(target);
  
      if (!internalInstance) {
        return;
      }
  
      if (!(typeof restoreImpl === "function")) {
        {
          throw Error(formatProdErrorMessage(280));
        }
      }
  
      var stateNode = internalInstance.stateNode;
  
      if (stateNode) {
        var _props = getFiberCurrentPropsFromNode(stateNode);
  
        restoreImpl(internalInstance.stateNode, internalInstance.type, _props);
      }
    }
  
    function setRestoreImplementation(impl) {
      restoreImpl = impl;
    }
    function enqueueStateRestore(target) {
      if (restoreTarget) {
        if (restoreQueue) {
          restoreQueue.push(target);
        } else {
          restoreQueue = [target];
        }
      } else {
        restoreTarget = target;
      }
    }
    function needsStateRestore() {
      return restoreTarget !== null || restoreQueue !== null;
    }
    function restoreStateIfNeeded() {
      if (!restoreTarget) {
        return;
      }
  
      var target = restoreTarget;
      var queuedTargets = restoreQueue;
      restoreTarget = null;
      restoreQueue = null;
      restoreStateOfTarget(target);
  
      if (queuedTargets) {
        for (var i = 0; i < queuedTargets.length; i++) {
          restoreStateOfTarget(queuedTargets[i]);
        }
      }
    }
  
    var batchedUpdatesImpl = function (fn, bookkeeping) {
      return fn(bookkeeping);
    };
  
    var discreteUpdatesImpl = function (fn, a, b, c, d) {
      return fn(a, b, c, d);
    };
  
    var flushDiscreteUpdatesImpl = function () {};
  
    var batchedEventUpdatesImpl = batchedUpdatesImpl;
    var isInsideEventHandler = false;
    var isBatchingEventUpdates = false;
  
    function finishEventHandler() {
      var controlledComponentsHavePendingUpdates = needsStateRestore();
  
      if (controlledComponentsHavePendingUpdates) {
        flushDiscreteUpdatesImpl();
        restoreStateIfNeeded();
      }
    }
  
    function batchedUpdates(fn, bookkeeping) {
      if (isInsideEventHandler) {
        return fn(bookkeeping);
      }
  
      isInsideEventHandler = true;
  
      try {
        return batchedUpdatesImpl(fn, bookkeeping);
      } finally {
        isInsideEventHandler = false;
        finishEventHandler();
      }
    }
    function batchedEventUpdates(fn, a, b) {
      if (isBatchingEventUpdates) {
        return fn(a, b);
      }
  
      isBatchingEventUpdates = true;
  
      try {
        return batchedEventUpdatesImpl(fn, a, b);
      } finally {
        isBatchingEventUpdates = false;
        finishEventHandler();
      }
    }
    function discreteUpdates(fn, a, b, c, d) {
      var prevIsInsideEventHandler = isInsideEventHandler;
      isInsideEventHandler = true;
  
      try {
        return discreteUpdatesImpl(fn, a, b, c, d);
      } finally {
        isInsideEventHandler = prevIsInsideEventHandler;
  
        if (!isInsideEventHandler) {
          finishEventHandler();
        }
      }
    }
    function flushDiscreteUpdatesIfNeeded(timeStamp) {
      {
        if (!isInsideEventHandler) {
          flushDiscreteUpdatesImpl();
        }
      }
    }
    function setBatchingImplementation(
      _batchedUpdatesImpl,
      _discreteUpdatesImpl,
      _flushDiscreteUpdatesImpl,
      _batchedEventUpdatesImpl
    ) {
      batchedUpdatesImpl = _batchedUpdatesImpl;
      discreteUpdatesImpl = _discreteUpdatesImpl;
      flushDiscreteUpdatesImpl = _flushDiscreteUpdatesImpl;
      batchedEventUpdatesImpl = _batchedEventUpdatesImpl;
    }
  
    function isInteractive(tag) {
      return tag === "button" || tag === "input" || tag === "select" || tag === "textarea";
    }
  
    function shouldPreventMouseEvent(name, type, props) {
      switch (name) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          return !!(props.disabled && isInteractive(type));
  
        default:
          return false;
      }
    }
  
    function getListener(inst, registrationName) {
      var stateNode = inst.stateNode;
  
      if (stateNode === null) {
        return null;
      }
  
      var props = getFiberCurrentPropsFromNode(stateNode);
  
      if (props === null) {
        return null;
      }
  
      var listener = props[registrationName];
  
      if (shouldPreventMouseEvent(registrationName, inst.type, props)) {
        return null;
      }
  
      if (!(!listener || typeof listener === "function")) {
        {
          throw Error(formatProdErrorMessage(231, registrationName, typeof listener));
        }
      }
  
      return listener;
    }
  
    var passiveBrowserEventsSupported = false;
  
    if (canUseDOM) {
      try {
        var options = {};
  
        Object.defineProperty(options, "passive", {
          get: function () {
            passiveBrowserEventsSupported = true;
          },
        });
        window.addEventListener("test", options, options);
        window.removeEventListener("test", options, options);
      } catch (e) {
        passiveBrowserEventsSupported = false;
      }
    }
  
    function invokeGuardedCallbackProd(name, func, context, a, b, c, d, e, f) {
      var funcArgs = Array.prototype.slice.call(arguments, 3);
  
      try {
        func.apply(context, funcArgs);
      } catch (error) {
        this.onError(error);
      }
    }
  
    var invokeGuardedCallbackImpl = invokeGuardedCallbackProd;
  
    var hasError = false;
    var caughtError = null;
  
    var hasRethrowError = false;
    var rethrowError = null;
    var reporter = {
      onError: function (error) {
        hasError = true;
        caughtError = error;
      },
    };
  
    function invokeGuardedCallback(name, func, context, a, b, c, d, e, f) {
      hasError = false;
      caughtError = null;
      invokeGuardedCallbackImpl.apply(reporter, arguments);
    }
  
    function invokeGuardedCallbackAndCatchFirstError(name, func, context, a) {
      invokeGuardedCallback.apply(this, arguments);
  
      if (hasError) {
        var error = clearCaughtError();
  
        if (!hasRethrowError) {
          hasRethrowError = true;
          rethrowError = error;
        }
      }
    }
  
    function rethrowCaughtError() {
      if (hasRethrowError) {
        var error = rethrowError;
        hasRethrowError = false;
        rethrowError = null;
        throw error;
      }
    }
    function clearCaughtError() {
      if (hasError) {
        var error = caughtError;
        hasError = false;
        caughtError = null;
        return error;
      } else {
        {
          {
            throw Error(formatProdErrorMessage(198));
          }
        }
      }
    }
  
    var ReactInternals$1 = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    var _ReactInternals$Sched = ReactInternals$1.Scheduler,
      unstable_cancelCallback = _ReactInternals$Sched.unstable_cancelCallback,
      unstable_now = _ReactInternals$Sched.unstable_now,
      unstable_scheduleCallback = _ReactInternals$Sched.unstable_scheduleCallback,
      unstable_shouldYield = _ReactInternals$Sched.unstable_shouldYield,
      unstable_requestPaint = _ReactInternals$Sched.unstable_requestPaint,
      unstable_runWithPriority = _ReactInternals$Sched.unstable_runWithPriority,
      unstable_getCurrentPriorityLevel = _ReactInternals$Sched.unstable_getCurrentPriorityLevel,
      unstable_ImmediatePriority = _ReactInternals$Sched.unstable_ImmediatePriority,
      unstable_UserBlockingPriority = _ReactInternals$Sched.unstable_UserBlockingPriority,
      unstable_NormalPriority = _ReactInternals$Sched.unstable_NormalPriority,
      unstable_LowPriority = _ReactInternals$Sched.unstable_LowPriority,
      unstable_IdlePriority = _ReactInternals$Sched.unstable_IdlePriority;
  
    function get(key) {
      return key._reactInternals;
    }
    function has(key) {
      return key._reactInternals !== undefined;
    }
    function set(key, value) {
      key._reactInternals = value;
    }
  
    var NoFlags = 0;
    var PerformedWork = 1;
  
    var Placement = 2;
    var Update = 4;
    var PlacementAndUpdate = 6;
    var Deletion = 8;
    var ContentReset = 16;
    var Callback = 32;
    var DidCapture = 64;
    var Ref = 128;
    var Snapshot = 256;
    var Passive = 512;
    var Hydrating = 1024;
    var HydratingAndUpdate = 1028;
  
    var LifecycleEffectMask = 932;
  
    var HostEffectMask = 2047;
  
    var Incomplete = 2048;
    var ShouldCapture = 4096;
    var ForceUpdateForLegacySuspense = 16384;
  
    function getNearestMountedFiber(fiber) {
      var node = fiber;
      var nearestMounted = fiber;
  
      if (!fiber.alternate) {
        var nextNode = node;
  
        do {
          node = nextNode;
  
          if ((node.flags & (Placement | Hydrating)) !== NoFlags) {
            nearestMounted = node.return;
          }
  
          nextNode = node.return;
        } while (nextNode);
      } else {
        while (node.return) {
          node = node.return;
        }
      }
  
      if (node.tag === HostRoot) {
        return nearestMounted;
      }
  
      return null;
    }
    function getSuspenseInstanceFromFiber(fiber) {
      if (fiber.tag === SuspenseComponent) {
        var suspenseState = fiber.memoizedState;
  
        if (suspenseState === null) {
          var current = fiber.alternate;
  
          if (current !== null) {
            suspenseState = current.memoizedState;
          }
        }
  
        if (suspenseState !== null) {
          return suspenseState.dehydrated;
        }
      }
  
      return null;
    }
    function getContainerFromFiber(fiber) {
      return fiber.tag === HostRoot ? fiber.stateNode.containerInfo : null;
    }
    function isFiberMounted(fiber) {
      return getNearestMountedFiber(fiber) === fiber;
    }
    function isMounted(component) {
      var fiber = get(component);
  
      if (!fiber) {
        return false;
      }
  
      return getNearestMountedFiber(fiber) === fiber;
    }
  
    function assertIsMounted(fiber) {
      if (!(getNearestMountedFiber(fiber) === fiber)) {
        {
          throw Error(formatProdErrorMessage(188));
        }
      }
    }
  
    function findCurrentFiberUsingSlowPath(fiber) {
      var alternate = fiber.alternate;
  
      if (!alternate) {
        var nearestMounted = getNearestMountedFiber(fiber);
  
        if (!(nearestMounted !== null)) {
          {
            throw Error(formatProdErrorMessage(188));
          }
        }
  
        if (nearestMounted !== fiber) {
          return null;
        }
  
        return fiber;
      }
  
      var a = fiber;
      var b = alternate;
  
      while (true) {
        var parentA = a.return;
  
        if (parentA === null) {
          break;
        }
  
        var parentB = parentA.alternate;
  
        if (parentB === null) {
          var nextParent = parentA.return;
  
          if (nextParent !== null) {
            a = b = nextParent;
            continue;
          }
  
          break;
        }
  
        if (parentA.child === parentB.child) {
          var child = parentA.child;
  
          while (child) {
            if (child === a) {
              assertIsMounted(parentA);
              return fiber;
            }
  
            if (child === b) {
              assertIsMounted(parentA);
              return alternate;
            }
  
            child = child.sibling;
          }
  
          {
            {
              throw Error(formatProdErrorMessage(188));
            }
          }
        }
  
        if (a.return !== b.return) {
          a = parentA;
          b = parentB;
        } else {
          var didFindChild = false;
          var _child = parentA.child;
  
          while (_child) {
            if (_child === a) {
              didFindChild = true;
              a = parentA;
              b = parentB;
              break;
            }
  
            if (_child === b) {
              didFindChild = true;
              b = parentA;
              a = parentB;
              break;
            }
  
            _child = _child.sibling;
          }
  
          if (!didFindChild) {
            _child = parentB.child;
  
            while (_child) {
              if (_child === a) {
                didFindChild = true;
                a = parentB;
                b = parentA;
                break;
              }
  
              if (_child === b) {
                didFindChild = true;
                b = parentB;
                a = parentA;
                break;
              }
  
              _child = _child.sibling;
            }
  
            if (!didFindChild) {
              {
                throw Error(formatProdErrorMessage(189));
              }
            }
          }
        }
  
        if (!(a.alternate === b)) {
          {
            throw Error(formatProdErrorMessage(190));
          }
        }
      }
  
      if (!(a.tag === HostRoot)) {
        {
          throw Error(formatProdErrorMessage(188));
        }
      }
  
      if (a.stateNode.current === a) {
        return fiber;
      }
  
      return alternate;
    }
    function findCurrentHostFiber(parent) {
      var currentParent = findCurrentFiberUsingSlowPath(parent);
  
      if (!currentParent) {
        return null;
      }
  
      var node = currentParent;
  
      while (true) {
        if (node.tag === HostComponent || node.tag === HostText) {
          return node;
        } else if (node.child) {
          node.child.return = node;
          node = node.child;
          continue;
        }
  
        if (node === currentParent) {
          return null;
        }
  
        while (!node.sibling) {
          if (!node.return || node.return === currentParent) {
            return null;
          }
  
          node = node.return;
        }
  
        node.sibling.return = node.return;
        node = node.sibling;
      }
  
      return null;
    }
    function doesFiberContain(parentFiber, childFiber) {
      var node = childFiber;
      var parentFiberAlternate = parentFiber.alternate;
  
      while (node !== null) {
        if (node === parentFiber || node === parentFiberAlternate) {
          return true;
        }
  
        node = node.return;
      }
  
      return false;
    }
  
    var attemptUserBlockingHydration;
    function setAttemptUserBlockingHydration(fn) {
      attemptUserBlockingHydration = fn;
    }
    var attemptContinuousHydration;
    function setAttemptContinuousHydration(fn) {
      attemptContinuousHydration = fn;
    }
    var attemptHydrationAtCurrentPriority;
    function setAttemptHydrationAtCurrentPriority(fn) {
      attemptHydrationAtCurrentPriority = fn;
    }
    var attemptHydrationAtPriority;
    function setAttemptHydrationAtPriority(fn) {
      attemptHydrationAtPriority = fn;
    }
    var hasScheduledReplayAttempt = false;
  
    var queuedDiscreteEvents = [];
  
    var queuedFocus = null;
    var queuedDrag = null;
    var queuedMouse = null;
  
    var queuedPointers = new Map();
    var queuedPointerCaptures = new Map();
  
    var queuedExplicitHydrationTargets = [];
    function hasQueuedDiscreteEvents() {
      return queuedDiscreteEvents.length > 0;
    }
    var discreteReplayableEvents = [
      "mousedown",
      "mouseup",
      "touchcancel",
      "touchend",
      "touchstart",
      "auxclick",
      "dblclick",
      "pointercancel",
      "pointerdown",
      "pointerup",
      "dragend",
      "dragstart",
      "drop",
      "compositionend",
      "compositionstart",
      "keydown",
      "keypress",
      "keyup",
      "input",
      "textInput",
      "copy",
      "cut",
      "paste",
      "click",
      "change",
      "contextmenu",
      "reset",
      "submit",
    ];
    function isReplayableDiscreteEvent(eventType) {
      return discreteReplayableEvents.indexOf(eventType) > -1;
    }
  
    function createQueuedReplayableEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
      return {
        blockedOn: blockedOn,
        domEventName: domEventName,
        eventSystemFlags: eventSystemFlags | IS_REPLAYED,
        nativeEvent: nativeEvent,
        targetContainers: [targetContainer],
      };
    }
  
    function queueDiscreteEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
      var queuedEvent = createQueuedReplayableEvent(
        blockedOn,
        domEventName,
        eventSystemFlags,
        targetContainer,
        nativeEvent
      );
      queuedDiscreteEvents.push(queuedEvent);
    }
  
    function clearIfContinuousEvent(domEventName, nativeEvent) {
      switch (domEventName) {
        case "focusin":
        case "focusout":
          queuedFocus = null;
          break;
  
        case "dragenter":
        case "dragleave":
          queuedDrag = null;
          break;
  
        case "mouseover":
        case "mouseout":
          queuedMouse = null;
          break;
  
        case "pointerover":
        case "pointerout": {
          var pointerId = nativeEvent.pointerId;
          queuedPointers.delete(pointerId);
          break;
        }
  
        case "gotpointercapture":
        case "lostpointercapture": {
          var _pointerId = nativeEvent.pointerId;
          queuedPointerCaptures.delete(_pointerId);
          break;
        }
      }
    }
  
    function accumulateOrCreateContinuousQueuedReplayableEvent(
      existingQueuedEvent,
      blockedOn,
      domEventName,
      eventSystemFlags,
      targetContainer,
      nativeEvent
    ) {
      if (existingQueuedEvent === null || existingQueuedEvent.nativeEvent !== nativeEvent) {
        var queuedEvent = createQueuedReplayableEvent(
          blockedOn,
          domEventName,
          eventSystemFlags,
          targetContainer,
          nativeEvent
        );
  
        if (blockedOn !== null) {
          var _fiber2 = getInstanceFromNode(blockedOn);
  
          if (_fiber2 !== null) {
            attemptContinuousHydration(_fiber2);
          }
        }
  
        return queuedEvent;
      }
  
      existingQueuedEvent.eventSystemFlags |= eventSystemFlags;
      var targetContainers = existingQueuedEvent.targetContainers;
  
      if (targetContainer !== null && targetContainers.indexOf(targetContainer) === -1) {
        targetContainers.push(targetContainer);
      }
  
      return existingQueuedEvent;
    }
  
    function queueIfContinuousEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
      switch (domEventName) {
        case "focusin": {
          var focusEvent = nativeEvent;
          queuedFocus = accumulateOrCreateContinuousQueuedReplayableEvent(
            queuedFocus,
            blockedOn,
            domEventName,
            eventSystemFlags,
            targetContainer,
            focusEvent
          );
          return true;
        }
  
        case "dragenter": {
          var dragEvent = nativeEvent;
          queuedDrag = accumulateOrCreateContinuousQueuedReplayableEvent(
            queuedDrag,
            blockedOn,
            domEventName,
            eventSystemFlags,
            targetContainer,
            dragEvent
          );
          return true;
        }
  
        case "mouseover": {
          var mouseEvent = nativeEvent;
          queuedMouse = accumulateOrCreateContinuousQueuedReplayableEvent(
            queuedMouse,
            blockedOn,
            domEventName,
            eventSystemFlags,
            targetContainer,
            mouseEvent
          );
          return true;
        }
  
        case "pointerover": {
          var pointerEvent = nativeEvent;
          var pointerId = pointerEvent.pointerId;
          queuedPointers.set(
            pointerId,
            accumulateOrCreateContinuousQueuedReplayableEvent(
              queuedPointers.get(pointerId) || null,
              blockedOn,
              domEventName,
              eventSystemFlags,
              targetContainer,
              pointerEvent
            )
          );
          return true;
        }
  
        case "gotpointercapture": {
          var _pointerEvent = nativeEvent;
          var _pointerId2 = _pointerEvent.pointerId;
          queuedPointerCaptures.set(
            _pointerId2,
            accumulateOrCreateContinuousQueuedReplayableEvent(
              queuedPointerCaptures.get(_pointerId2) || null,
              blockedOn,
              domEventName,
              eventSystemFlags,
              targetContainer,
              _pointerEvent
            )
          );
          return true;
        }
      }
  
      return false;
    }
  
    function attemptExplicitHydrationTarget(queuedTarget) {
      var targetInst = getClosestInstanceFromNode(queuedTarget.target);
  
      if (targetInst !== null) {
        var nearestMounted = getNearestMountedFiber(targetInst);
  
        if (nearestMounted !== null) {
          var tag = nearestMounted.tag;
  
          if (tag === SuspenseComponent) {
            var instance = getSuspenseInstanceFromFiber(nearestMounted);
  
            if (instance !== null) {
              queuedTarget.blockedOn = instance;
              attemptHydrationAtPriority(queuedTarget.lanePriority, function () {
                unstable_runWithPriority(queuedTarget.priority, function () {
                  attemptHydrationAtCurrentPriority(nearestMounted);
                });
              });
              return;
            }
          } else if (tag === HostRoot) {
            var root = nearestMounted.stateNode;
  
            if (root.hydrate) {
              queuedTarget.blockedOn = getContainerFromFiber(nearestMounted);
  
              return;
            }
          }
        }
      }
  
      queuedTarget.blockedOn = null;
    }
  
    function attemptReplayContinuousQueuedEvent(queuedEvent) {
      if (queuedEvent.blockedOn !== null) {
        return false;
      }
  
      var targetContainers = queuedEvent.targetContainers;
  
      while (targetContainers.length > 0) {
        var targetContainer = targetContainers[0];
        var nextBlockedOn = attemptToDispatchEvent(
          queuedEvent.domEventName,
          queuedEvent.eventSystemFlags,
          targetContainer,
          queuedEvent.nativeEvent
        );
  
        if (nextBlockedOn !== null) {
          var _fiber3 = getInstanceFromNode(nextBlockedOn);
  
          if (_fiber3 !== null) {
            attemptContinuousHydration(_fiber3);
          }
  
          queuedEvent.blockedOn = nextBlockedOn;
          return false;
        }
  
        targetContainers.shift();
      }
  
      return true;
    }
  
    function attemptReplayContinuousQueuedEventInMap(queuedEvent, key, map) {
      if (attemptReplayContinuousQueuedEvent(queuedEvent)) {
        map.delete(key);
      }
    }
  
    function replayUnblockedEvents() {
      hasScheduledReplayAttempt = false;
  
      while (queuedDiscreteEvents.length > 0) {
        var nextDiscreteEvent = queuedDiscreteEvents[0];
  
        if (nextDiscreteEvent.blockedOn !== null) {
          var _fiber4 = getInstanceFromNode(nextDiscreteEvent.blockedOn);
  
          if (_fiber4 !== null) {
            attemptUserBlockingHydration(_fiber4);
          }
  
          break;
        }
  
        var targetContainers = nextDiscreteEvent.targetContainers;
  
        while (targetContainers.length > 0) {
          var targetContainer = targetContainers[0];
          var nextBlockedOn = attemptToDispatchEvent(
            nextDiscreteEvent.domEventName,
            nextDiscreteEvent.eventSystemFlags,
            targetContainer,
            nextDiscreteEvent.nativeEvent
          );
  
          if (nextBlockedOn !== null) {
            nextDiscreteEvent.blockedOn = nextBlockedOn;
            break;
          }
  
          targetContainers.shift();
        }
  
        if (nextDiscreteEvent.blockedOn === null) {
          queuedDiscreteEvents.shift();
        }
      }
  
      if (queuedFocus !== null && attemptReplayContinuousQueuedEvent(queuedFocus)) {
        queuedFocus = null;
      }
  
      if (queuedDrag !== null && attemptReplayContinuousQueuedEvent(queuedDrag)) {
        queuedDrag = null;
      }
  
      if (queuedMouse !== null && attemptReplayContinuousQueuedEvent(queuedMouse)) {
        queuedMouse = null;
      }
  
      queuedPointers.forEach(attemptReplayContinuousQueuedEventInMap);
      queuedPointerCaptures.forEach(attemptReplayContinuousQueuedEventInMap);
    }
  
    function scheduleCallbackIfUnblocked(queuedEvent, unblocked) {
      if (queuedEvent.blockedOn === unblocked) {
        queuedEvent.blockedOn = null;
  
        if (!hasScheduledReplayAttempt) {
          hasScheduledReplayAttempt = true;
  
          unstable_scheduleCallback(unstable_NormalPriority, replayUnblockedEvents);
        }
      }
    }
  
    function retryIfBlockedOn(unblocked) {
      if (queuedDiscreteEvents.length > 0) {
        scheduleCallbackIfUnblocked(queuedDiscreteEvents[0], unblocked);
  
        for (var i = 1; i < queuedDiscreteEvents.length; i++) {
          var queuedEvent = queuedDiscreteEvents[i];
  
          if (queuedEvent.blockedOn === unblocked) {
            queuedEvent.blockedOn = null;
          }
        }
      }
  
      if (queuedFocus !== null) {
        scheduleCallbackIfUnblocked(queuedFocus, unblocked);
      }
  
      if (queuedDrag !== null) {
        scheduleCallbackIfUnblocked(queuedDrag, unblocked);
      }
  
      if (queuedMouse !== null) {
        scheduleCallbackIfUnblocked(queuedMouse, unblocked);
      }
  
      var unblock = function (queuedEvent) {
        return scheduleCallbackIfUnblocked(queuedEvent, unblocked);
      };
  
      queuedPointers.forEach(unblock);
      queuedPointerCaptures.forEach(unblock);
  
      for (var _i = 0; _i < queuedExplicitHydrationTargets.length; _i++) {
        var queuedTarget = queuedExplicitHydrationTargets[_i];
  
        if (queuedTarget.blockedOn === unblocked) {
          queuedTarget.blockedOn = null;
        }
      }
  
      while (queuedExplicitHydrationTargets.length > 0) {
        var nextExplicitTarget = queuedExplicitHydrationTargets[0];
  
        if (nextExplicitTarget.blockedOn !== null) {
          break;
        } else {
          attemptExplicitHydrationTarget(nextExplicitTarget);
  
          if (nextExplicitTarget.blockedOn === null) {
            queuedExplicitHydrationTargets.shift();
          }
        }
      }
    }
  
    var DiscreteEvent = 0;
    var UserBlockingEvent = 1;
    var ContinuousEvent = 2;
  
    function makePrefixMap(styleProp, eventName) {
      var prefixes = {};
      prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
      prefixes["Webkit" + styleProp] = "webkit" + eventName;
      prefixes["Moz" + styleProp] = "moz" + eventName;
      return prefixes;
    }
  
    var vendorPrefixes = {
      animationend: makePrefixMap("Animation", "AnimationEnd"),
      animationiteration: makePrefixMap("Animation", "AnimationIteration"),
      animationstart: makePrefixMap("Animation", "AnimationStart"),
      transitionend: makePrefixMap("Transition", "TransitionEnd"),
    };
  
    var prefixedEventNames = {};
    var style = {};
  
    if (canUseDOM) {
      style = document.createElement("div").style;
  
      if (!("AnimationEvent" in window)) {
        delete vendorPrefixes.animationend.animation;
        delete vendorPrefixes.animationiteration.animation;
        delete vendorPrefixes.animationstart.animation;
      }
  
      if (!("TransitionEvent" in window)) {
        delete vendorPrefixes.transitionend.transition;
      }
    }
  
    function getVendorPrefixedEventName(eventName) {
      if (prefixedEventNames[eventName]) {
        return prefixedEventNames[eventName];
      } else if (!vendorPrefixes[eventName]) {
        return eventName;
      }
  
      var prefixMap = vendorPrefixes[eventName];
  
      for (var styleProp in prefixMap) {
        if (prefixMap.hasOwnProperty(styleProp) && styleProp in style) {
          return (prefixedEventNames[eventName] = prefixMap[styleProp]);
        }
      }
  
      return eventName;
    }
  
    var ANIMATION_END = getVendorPrefixedEventName("animationend");
    var ANIMATION_ITERATION = getVendorPrefixedEventName("animationiteration");
    var ANIMATION_START = getVendorPrefixedEventName("animationstart");
    var TRANSITION_END = getVendorPrefixedEventName("transitionend");
  
    var topLevelEventsToReactNames = new Map();
    var eventPriorities = new Map();
  
    var discreteEventPairsForSimpleEventPlugin = [
      "cancel",
      "cancel",
      "click",
      "click",
      "close",
      "close",
      "contextmenu",
      "contextMenu",
      "copy",
      "copy",
      "cut",
      "cut",
      "auxclick",
      "auxClick",
      "dblclick",
      "doubleClick",
      "dragend",
      "dragEnd",
      "dragstart",
      "dragStart",
      "drop",
      "drop",
      "focusin",
      "focus",
      "focusout",
      "blur",
      "input",
      "input",
      "invalid",
      "invalid",
      "keydown",
      "keyDown",
      "keypress",
      "keyPress",
      "keyup",
      "keyUp",
      "mousedown",
      "mouseDown",
      "mouseup",
      "mouseUp",
      "paste",
      "paste",
      "pause",
      "pause",
      "play",
      "play",
      "pointercancel",
      "pointerCancel",
      "pointerdown",
      "pointerDown",
      "pointerup",
      "pointerUp",
      "ratechange",
      "rateChange",
      "reset",
      "reset",
      "seeked",
      "seeked",
      "submit",
      "submit",
      "touchcancel",
      "touchCancel",
      "touchend",
      "touchEnd",
      "touchstart",
      "touchStart",
      "volumechange",
      "volumeChange",
    ];
    var otherDiscreteEvents = [
      "change",
      "selectionchange",
      "textInput",
      "compositionstart",
      "compositionend",
      "compositionupdate",
    ];
  
    var userBlockingPairsForSimpleEventPlugin = [
      "drag",
      "drag",
      "dragenter",
      "dragEnter",
      "dragexit",
      "dragExit",
      "dragleave",
      "dragLeave",
      "dragover",
      "dragOver",
      "mousemove",
      "mouseMove",
      "mouseout",
      "mouseOut",
      "mouseover",
      "mouseOver",
      "pointermove",
      "pointerMove",
      "pointerout",
      "pointerOut",
      "pointerover",
      "pointerOver",
      "scroll",
      "scroll",
      "toggle",
      "toggle",
      "touchmove",
      "touchMove",
      "wheel",
      "wheel",
    ];
  
    var continuousPairsForSimpleEventPlugin = [
      "abort",
      "abort",
      ANIMATION_END,
      "animationEnd",
      ANIMATION_ITERATION,
      "animationIteration",
      ANIMATION_START,
      "animationStart",
      "canplay",
      "canPlay",
      "canplaythrough",
      "canPlayThrough",
      "durationchange",
      "durationChange",
      "emptied",
      "emptied",
      "encrypted",
      "encrypted",
      "ended",
      "ended",
      "error",
      "error",
      "gotpointercapture",
      "gotPointerCapture",
      "load",
      "load",
      "loadeddata",
      "loadedData",
      "loadedmetadata",
      "loadedMetadata",
      "loadstart",
      "loadStart",
      "lostpointercapture",
      "lostPointerCapture",
      "playing",
      "playing",
      "progress",
      "progress",
      "seeking",
      "seeking",
      "stalled",
      "stalled",
      "suspend",
      "suspend",
      "timeupdate",
      "timeUpdate",
      TRANSITION_END,
      "transitionEnd",
      "waiting",
      "waiting",
    ];
  
    function registerSimplePluginEventsAndSetTheirPriorities(eventTypes, priority) {
      for (var i = 0; i < eventTypes.length; i += 2) {
        var topEvent = eventTypes[i];
        var event = eventTypes[i + 1];
        var capitalizedEvent = event[0].toUpperCase() + event.slice(1);
        var reactName = "on" + capitalizedEvent;
        eventPriorities.set(topEvent, priority);
        topLevelEventsToReactNames.set(topEvent, reactName);
        registerTwoPhaseEvent(reactName, [topEvent]);
      }
    }
  
    function setEventPriorities(eventTypes, priority) {
      for (var i = 0; i < eventTypes.length; i++) {
        eventPriorities.set(eventTypes[i], priority);
      }
    }
  
    function getEventPriorityForPluginSystem(domEventName) {
      var priority = eventPriorities.get(domEventName);
  
      return priority === undefined ? ContinuousEvent : priority;
    }
    function registerSimpleEvents() {
      registerSimplePluginEventsAndSetTheirPriorities(discreteEventPairsForSimpleEventPlugin, DiscreteEvent);
      registerSimplePluginEventsAndSetTheirPriorities(userBlockingPairsForSimpleEventPlugin, UserBlockingEvent);
      registerSimplePluginEventsAndSetTheirPriorities(continuousPairsForSimpleEventPlugin, ContinuousEvent);
      setEventPriorities(otherDiscreteEvents, DiscreteEvent);
    }
  
    var ReactInternals$2 = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    var _ReactInternals$Sched$1 = ReactInternals$2.SchedulerTracing;
  
    var Scheduler_now = unstable_now;
  
    var ImmediatePriority = 99;
    var UserBlockingPriority = 98;
    var NormalPriority = 97;
    var LowPriority = 96;
    var IdlePriority = 95;
  
    var NoPriority = 90;
  
    var SyncLanePriority = 15;
    var SyncBatchedLanePriority = 14;
    var InputDiscreteHydrationLanePriority = 13;
    var InputDiscreteLanePriority = 12;
    var InputContinuousHydrationLanePriority = 11;
    var InputContinuousLanePriority = 10;
    var DefaultHydrationLanePriority = 9;
    var DefaultLanePriority = 8;
    var TransitionHydrationPriority = 7;
    var TransitionPriority = 6;
    var RetryLanePriority = 5;
    var SelectiveHydrationLanePriority = 4;
    var IdleHydrationLanePriority = 3;
    var IdleLanePriority = 2;
    var OffscreenLanePriority = 1;
    var NoLanePriority = 0;
    var TotalLanes = 31;
    var NoLanes = 0;
    var NoLane = 0;
    var SyncLane = 1;
    var SyncBatchedLane = 2;
    var InputDiscreteHydrationLane = 4;
    var InputDiscreteLanes = 24;
    var InputContinuousHydrationLane = 32;
    var InputContinuousLanes = 192;
    var DefaultHydrationLane = 256;
    var DefaultLanes = 3584;
    var TransitionHydrationLane = 4096;
    var TransitionLanes = 4186112;
    var RetryLanes = 62914560;
    var SomeRetryLane = 33554432;
    var SelectiveHydrationLane = 67108864;
    var NonIdleLanes = 134217727;
    var IdleHydrationLane = 134217728;
    var IdleLanes = 805306368;
    var OffscreenLane = 1073741824;
    var NoTimestamp = -1;
    function setCurrentUpdateLanePriority(newLanePriority) {}
  
    var return_highestLanePriority = DefaultLanePriority;
  
    function getHighestPriorityLanes(lanes) {
      if ((SyncLane & lanes) !== NoLanes) {
        return_highestLanePriority = SyncLanePriority;
        return SyncLane;
      }
  
      if ((SyncBatchedLane & lanes) !== NoLanes) {
        return_highestLanePriority = SyncBatchedLanePriority;
        return SyncBatchedLane;
      }
  
      if ((InputDiscreteHydrationLane & lanes) !== NoLanes) {
        return_highestLanePriority = InputDiscreteHydrationLanePriority;
        return InputDiscreteHydrationLane;
      }
  
      var inputDiscreteLanes = InputDiscreteLanes & lanes;
  
      if (inputDiscreteLanes !== NoLanes) {
        return_highestLanePriority = InputDiscreteLanePriority;
        return inputDiscreteLanes;
      }
  
      if ((lanes & InputContinuousHydrationLane) !== NoLanes) {
        return_highestLanePriority = InputContinuousHydrationLanePriority;
        return InputContinuousHydrationLane;
      }
  
      var inputContinuousLanes = InputContinuousLanes & lanes;
  
      if (inputContinuousLanes !== NoLanes) {
        return_highestLanePriority = InputContinuousLanePriority;
        return inputContinuousLanes;
      }
  
      if ((lanes & DefaultHydrationLane) !== NoLanes) {
        return_highestLanePriority = DefaultHydrationLanePriority;
        return DefaultHydrationLane;
      }
  
      var defaultLanes = DefaultLanes & lanes;
  
      if (defaultLanes !== NoLanes) {
        return_highestLanePriority = DefaultLanePriority;
        return defaultLanes;
      }
  
      if ((lanes & TransitionHydrationLane) !== NoLanes) {
        return_highestLanePriority = TransitionHydrationPriority;
        return TransitionHydrationLane;
      }
  
      var transitionLanes = TransitionLanes & lanes;
  
      if (transitionLanes !== NoLanes) {
        return_highestLanePriority = TransitionPriority;
        return transitionLanes;
      }
  
      var retryLanes = RetryLanes & lanes;
  
      if (retryLanes !== NoLanes) {
        return_highestLanePriority = RetryLanePriority;
        return retryLanes;
      }
  
      if (lanes & SelectiveHydrationLane) {
        return_highestLanePriority = SelectiveHydrationLanePriority;
        return SelectiveHydrationLane;
      }
  
      if ((lanes & IdleHydrationLane) !== NoLanes) {
        return_highestLanePriority = IdleHydrationLanePriority;
        return IdleHydrationLane;
      }
  
      var idleLanes = IdleLanes & lanes;
  
      if (idleLanes !== NoLanes) {
        return_highestLanePriority = IdleLanePriority;
        return idleLanes;
      }
  
      if ((OffscreenLane & lanes) !== NoLanes) {
        return_highestLanePriority = OffscreenLanePriority;
        return OffscreenLane;
      }
  
      return_highestLanePriority = DefaultLanePriority;
      return lanes;
    }
  
    function schedulerPriorityToLanePriority(schedulerPriorityLevel) {
      switch (schedulerPriorityLevel) {
        case ImmediatePriority:
          return SyncLanePriority;
  
        case UserBlockingPriority:
          return InputContinuousLanePriority;
  
        case NormalPriority:
        case LowPriority:
          return DefaultLanePriority;
  
        case IdlePriority:
          return IdleLanePriority;
  
        default:
          return NoLanePriority;
      }
    }
    function lanePriorityToSchedulerPriority(lanePriority) {
      switch (lanePriority) {
        case SyncLanePriority:
        case SyncBatchedLanePriority:
          return ImmediatePriority;
  
        case InputDiscreteHydrationLanePriority:
        case InputDiscreteLanePriority:
        case InputContinuousHydrationLanePriority:
        case InputContinuousLanePriority:
          return UserBlockingPriority;
  
        case DefaultHydrationLanePriority:
        case DefaultLanePriority:
        case TransitionHydrationPriority:
        case TransitionPriority:
        case SelectiveHydrationLanePriority:
        case RetryLanePriority:
          return NormalPriority;
  
        case IdleHydrationLanePriority:
        case IdleLanePriority:
        case OffscreenLanePriority:
          return IdlePriority;
  
        case NoLanePriority:
          return NoPriority;
  
        default: {
          {
            throw Error(formatProdErrorMessage(358, lanePriority));
          }
        }
      }
    }
    function getNextLanes(root, wipLanes) {
      var pendingLanes = root.pendingLanes;
  
      if (pendingLanes === NoLanes) {
        return_highestLanePriority = NoLanePriority;
        return NoLanes;
      }
  
      var nextLanes = NoLanes;
      var nextLanePriority = NoLanePriority;
      var expiredLanes = root.expiredLanes;
      var suspendedLanes = root.suspendedLanes;
      var pingedLanes = root.pingedLanes;
  
      if (expiredLanes !== NoLanes) {
        nextLanes = expiredLanes;
        nextLanePriority = return_highestLanePriority = SyncLanePriority;
      } else {
        var nonIdlePendingLanes = pendingLanes & NonIdleLanes;
  
        if (nonIdlePendingLanes !== NoLanes) {
          var nonIdleUnblockedLanes = nonIdlePendingLanes & ~suspendedLanes;
  
          if (nonIdleUnblockedLanes !== NoLanes) {
            nextLanes = getHighestPriorityLanes(nonIdleUnblockedLanes);
            nextLanePriority = return_highestLanePriority;
          } else {
            var nonIdlePingedLanes = nonIdlePendingLanes & pingedLanes;
  
            if (nonIdlePingedLanes !== NoLanes) {
              nextLanes = getHighestPriorityLanes(nonIdlePingedLanes);
              nextLanePriority = return_highestLanePriority;
            }
          }
        } else {
          var unblockedLanes = pendingLanes & ~suspendedLanes;
  
          if (unblockedLanes !== NoLanes) {
            nextLanes = getHighestPriorityLanes(unblockedLanes);
            nextLanePriority = return_highestLanePriority;
          } else {
            if (pingedLanes !== NoLanes) {
              nextLanes = getHighestPriorityLanes(pingedLanes);
              nextLanePriority = return_highestLanePriority;
            }
          }
        }
      }
  
      if (nextLanes === NoLanes) {
        return NoLanes;
      }
  
      nextLanes = pendingLanes & getEqualOrHigherPriorityLanes(nextLanes);
  
      if (wipLanes !== NoLanes && wipLanes !== nextLanes && (wipLanes & suspendedLanes) === NoLanes) {
        getHighestPriorityLanes(wipLanes);
        var wipLanePriority = return_highestLanePriority;
  
        if (nextLanePriority <= wipLanePriority) {
          return wipLanes;
        } else {
          return_highestLanePriority = nextLanePriority;
        }
      }
  
      var entangledLanes = root.entangledLanes;
  
      if (entangledLanes !== NoLanes) {
        var entanglements = root.entanglements;
        var lanes = nextLanes & entangledLanes;
  
        while (lanes > 0) {
          var index = pickArbitraryLaneIndex(lanes);
          var lane = 1 << index;
          nextLanes |= entanglements[index];
          lanes &= ~lane;
        }
      }
  
      return nextLanes;
    }
    function getMostRecentEventTime(root, lanes) {
      var eventTimes = root.eventTimes;
      var mostRecentEventTime = NoTimestamp;
  
      while (lanes > 0) {
        var index = pickArbitraryLaneIndex(lanes);
        var lane = 1 << index;
        var eventTime = eventTimes[index];
  
        if (eventTime > mostRecentEventTime) {
          mostRecentEventTime = eventTime;
        }
  
        lanes &= ~lane;
      }
  
      return mostRecentEventTime;
    }
  
    function computeExpirationTime(lane, currentTime) {
      getHighestPriorityLanes(lane);
      var priority = return_highestLanePriority;
  
      if (priority >= InputContinuousLanePriority) {
        return currentTime + 250;
      } else if (priority >= TransitionPriority) {
        return currentTime + 5000;
      } else {
        return NoTimestamp;
      }
    }
  
    function markStarvedLanesAsExpired(root, currentTime) {
      var pendingLanes = root.pendingLanes;
      var suspendedLanes = root.suspendedLanes;
      var pingedLanes = root.pingedLanes;
      var expirationTimes = root.expirationTimes;
  
      var lanes = pendingLanes;
  
      while (lanes > 0) {
        var index = pickArbitraryLaneIndex(lanes);
        var lane = 1 << index;
        var expirationTime = expirationTimes[index];
  
        if (expirationTime === NoTimestamp) {
          if ((lane & suspendedLanes) === NoLanes || (lane & pingedLanes) !== NoLanes) {
            expirationTimes[index] = computeExpirationTime(lane, currentTime);
          }
        } else if (expirationTime <= currentTime) {
          root.expiredLanes |= lane;
        }
  
        lanes &= ~lane;
      }
    }
    function getLanesToRetrySynchronouslyOnError(root) {
      var everythingButOffscreen = root.pendingLanes & ~OffscreenLane;
  
      if (everythingButOffscreen !== NoLanes) {
        return everythingButOffscreen;
      }
  
      if (everythingButOffscreen & OffscreenLane) {
        return OffscreenLane;
      }
  
      return NoLanes;
    }
    function returnNextLanesPriority() {
      return return_highestLanePriority;
    }
    function includesNonIdleWork(lanes) {
      return (lanes & NonIdleLanes) !== NoLanes;
    }
    function includesOnlyRetries(lanes) {
      return (lanes & RetryLanes) === lanes;
    }
    function includesOnlyTransitions(lanes) {
      return (lanes & TransitionLanes) === lanes;
    }
  
    function findUpdateLane(lanePriority, wipLanes) {
      switch (lanePriority) {
        case NoLanePriority:
          break;
  
        case SyncLanePriority:
          return SyncLane;
  
        case SyncBatchedLanePriority:
          return SyncBatchedLane;
  
        case InputDiscreteLanePriority: {
          var _lane = pickArbitraryLane(InputDiscreteLanes & ~wipLanes);
  
          if (_lane === NoLane) {
            return findUpdateLane(InputContinuousLanePriority, wipLanes);
          }
  
          return _lane;
        }
  
        case InputContinuousLanePriority: {
          var _lane2 = pickArbitraryLane(InputContinuousLanes & ~wipLanes);
  
          if (_lane2 === NoLane) {
            return findUpdateLane(DefaultLanePriority, wipLanes);
          }
  
          return _lane2;
        }
  
        case DefaultLanePriority: {
          var _lane3 = pickArbitraryLane(DefaultLanes & ~wipLanes);
  
          if (_lane3 === NoLane) {
            _lane3 = pickArbitraryLane(TransitionLanes & ~wipLanes);
  
            if (_lane3 === NoLane) {
              _lane3 = pickArbitraryLane(DefaultLanes);
            }
          }
  
          return _lane3;
        }
  
        case TransitionPriority:
  
        case RetryLanePriority:
          break;
  
        case IdleLanePriority:
          var lane = pickArbitraryLane(IdleLanes & ~wipLanes);
  
          if (lane === NoLane) {
            lane = pickArbitraryLane(IdleLanes);
          }
  
          return lane;
      }
  
      {
        {
          throw Error(formatProdErrorMessage(358, lanePriority));
        }
      }
    }
  
    function findTransitionLane(wipLanes, pendingLanes) {
      var lane = pickArbitraryLane(TransitionLanes & ~pendingLanes);
  
      if (lane === NoLane) {
        lane = pickArbitraryLane(TransitionLanes & ~wipLanes);
  
        if (lane === NoLane) {
          lane = pickArbitraryLane(TransitionLanes);
        }
      }
  
      return lane;
    }
  
    function findRetryLane(wipLanes) {
      var lane = pickArbitraryLane(RetryLanes & ~wipLanes);
  
      if (lane === NoLane) {
        lane = pickArbitraryLane(RetryLanes);
      }
  
      return lane;
    }
  
    function getHighestPriorityLane(lanes) {
      return lanes & -lanes;
    }
  
    function getLowestPriorityLane(lanes) {
      var index = 31 - clz32(lanes);
      return index < 0 ? NoLanes : 1 << index;
    }
  
    function getEqualOrHigherPriorityLanes(lanes) {
      return (getLowestPriorityLane(lanes) << 1) - 1;
    }
  
    function pickArbitraryLane(lanes) {
      return getHighestPriorityLane(lanes);
    }
  
    function pickArbitraryLaneIndex(lanes) {
      return 31 - clz32(lanes);
    }
  
    function laneToIndex(lane) {
      return pickArbitraryLaneIndex(lane);
    }
  
    function includesSomeLane(a, b) {
      return (a & b) !== NoLanes;
    }
    function isSubsetOfLanes(set, subset) {
      return (set & subset) === subset;
    }
    function mergeLanes(a, b) {
      return a | b;
    }
    function removeLanes(set, subset) {
      return set & ~subset;
    }
  
    function laneToLanes(lane) {
      return lane;
    }
    function higherPriorityLane(a, b) {
      return a !== NoLane && a < b ? a : b;
    }
    function createLaneMap(initial) {
      var laneMap = [];
  
      for (var i = 0; i < TotalLanes; i++) {
        laneMap.push(initial);
      }
  
      return laneMap;
    }
    function markRootUpdated(root, updateLane, eventTime) {
      root.pendingLanes |= updateLane;
  
      var higherPriorityLanes = updateLane - 1;
  
      root.suspendedLanes &= higherPriorityLanes;
      root.pingedLanes &= higherPriorityLanes;
      var eventTimes = root.eventTimes;
      var index = laneToIndex(updateLane);
  
      eventTimes[index] = eventTime;
    }
    function markRootSuspended(root, suspendedLanes) {
      root.suspendedLanes |= suspendedLanes;
      root.pingedLanes &= ~suspendedLanes;
  
      var expirationTimes = root.expirationTimes;
      var lanes = suspendedLanes;
  
      while (lanes > 0) {
        var index = pickArbitraryLaneIndex(lanes);
        var lane = 1 << index;
        expirationTimes[index] = NoTimestamp;
        lanes &= ~lane;
      }
    }
    function markRootPinged(root, pingedLanes) {
      root.pingedLanes |= root.suspendedLanes & pingedLanes;
    }
    function markDiscreteUpdatesExpired(root) {
      root.expiredLanes |= InputDiscreteLanes & root.pendingLanes;
    }
    function hasDiscreteLanes(lanes) {
      return (lanes & InputDiscreteLanes) !== NoLanes;
    }
    function markRootMutableRead(root, updateLane) {
      root.mutableReadLanes |= updateLane & root.pendingLanes;
    }
    function markRootFinished(root, remainingLanes) {
      var noLongerPendingLanes = root.pendingLanes & ~remainingLanes;
      root.pendingLanes = remainingLanes;
  
      root.suspendedLanes = 0;
      root.pingedLanes = 0;
      root.expiredLanes &= remainingLanes;
      root.mutableReadLanes &= remainingLanes;
      root.entangledLanes &= remainingLanes;
      var entanglements = root.entanglements;
      var eventTimes = root.eventTimes;
      var expirationTimes = root.expirationTimes;
  
      var lanes = noLongerPendingLanes;
  
      while (lanes > 0) {
        var index = pickArbitraryLaneIndex(lanes);
        var lane = 1 << index;
        entanglements[index] = NoLanes;
        eventTimes[index] = NoTimestamp;
        expirationTimes[index] = NoTimestamp;
        lanes &= ~lane;
      }
    }
    function markRootEntangled(root, entangledLanes) {
      root.entangledLanes |= entangledLanes;
      var entanglements = root.entanglements;
      var lanes = entangledLanes;
  
      while (lanes > 0) {
        var index = pickArbitraryLaneIndex(lanes);
        var lane = 1 << index;
        entanglements[index] |= entangledLanes;
        lanes &= ~lane;
      }
    }
    var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;
  
    var log = Math.log;
    var LN2 = Math.LN2;
  
    function clz32Fallback(lanes) {
      if (lanes === 0) {
        return 32;
      }
  
      return (31 - ((log(lanes) / LN2) | 0)) | 0;
    }
  
    var UserBlockingPriority$1 = unstable_UserBlockingPriority,
      runWithPriority = unstable_runWithPriority;
  
    var _enabled = true;
  
    function setEnabled(enabled) {
      _enabled = !!enabled;
    }
    function isEnabled() {
      return _enabled;
    }
    function createEventListenerWrapperWithPriority(targetContainer, domEventName, eventSystemFlags) {
      var eventPriority = getEventPriorityForPluginSystem(domEventName);
      var listenerWrapper;
  
      switch (eventPriority) {
        case DiscreteEvent:
          listenerWrapper = dispatchDiscreteEvent;
          break;
  
        case UserBlockingEvent:
          listenerWrapper = dispatchUserBlockingUpdate;
          break;
  
        case ContinuousEvent:
        default:
          listenerWrapper = dispatchEvent;
          break;
      }
  
      return listenerWrapper.bind(null, domEventName, eventSystemFlags, targetContainer);
    }
  
    function dispatchDiscreteEvent(domEventName, eventSystemFlags, container, nativeEvent) {
      {
        flushDiscreteUpdatesIfNeeded(nativeEvent.timeStamp);
      }
  
      discreteUpdates(dispatchEvent, domEventName, eventSystemFlags, container, nativeEvent);
    }
  
    function dispatchUserBlockingUpdate(domEventName, eventSystemFlags, container, nativeEvent) {
      {
        runWithPriority(
          UserBlockingPriority$1,
          dispatchEvent.bind(null, domEventName, eventSystemFlags, container, nativeEvent)
        );
      }
    }
  
    function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
      if (!_enabled) {
        return;
      }
  
      var allowReplay = true;
  
      {
        allowReplay = (eventSystemFlags & IS_CAPTURE_PHASE) === 0;
      }
  
      if (allowReplay && hasQueuedDiscreteEvents() && isReplayableDiscreteEvent(domEventName)) {
        queueDiscreteEvent(null, domEventName, eventSystemFlags, targetContainer, nativeEvent);
        return;
      }
  
      var blockedOn = attemptToDispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent);
  
      if (blockedOn === null) {
        if (allowReplay) {
          clearIfContinuousEvent(domEventName, nativeEvent);
        }
  
        return;
      }
  
      if (allowReplay) {
        if (isReplayableDiscreteEvent(domEventName)) {
          queueDiscreteEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent);
          return;
        }
  
        if (queueIfContinuousEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent)) {
          return;
        }
  
        clearIfContinuousEvent(domEventName, nativeEvent);
      }
  
      dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, null, targetContainer);
    }
  
    function attemptToDispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
      var nativeEventTarget = getEventTarget(nativeEvent);
      var targetInst = getClosestInstanceFromNode(nativeEventTarget);
  
      if (targetInst !== null) {
        var nearestMounted = getNearestMountedFiber(targetInst);
  
        if (nearestMounted === null) {
          targetInst = null;
        } else {
          var tag = nearestMounted.tag;
  
          if (tag === SuspenseComponent) {
            var instance = getSuspenseInstanceFromFiber(nearestMounted);
  
            if (instance !== null) {
              return instance;
            }
  
            targetInst = null;
          } else if (tag === HostRoot) {
            var root = nearestMounted.stateNode;
  
            if (root.hydrate) {
              return getContainerFromFiber(nearestMounted);
            }
  
            targetInst = null;
          } else if (nearestMounted !== targetInst) {
            targetInst = null;
          }
        }
      }
  
      dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer);
  
      return null;
    }
  
    function addEventBubbleListener(target, eventType, listener) {
      target.addEventListener(eventType, listener, false);
      return listener;
    }
    function addEventCaptureListener(target, eventType, listener) {
      target.addEventListener(eventType, listener, true);
      return listener;
    }
    function addEventCaptureListenerWithPassiveFlag(target, eventType, listener, passive) {
      target.addEventListener(eventType, listener, {
        capture: true,
        passive: passive,
      });
      return listener;
    }
    function addEventBubbleListenerWithPassiveFlag(target, eventType, listener, passive) {
      target.addEventListener(eventType, listener, {
        passive: passive,
      });
      return listener;
    }
  
    var root = null;
    var startText = null;
    var fallbackText = null;
    function initialize(nativeEventTarget) {
      root = nativeEventTarget;
      startText = getText();
      return true;
    }
    function reset() {
      root = null;
      startText = null;
      fallbackText = null;
    }
    function getData() {
      if (fallbackText) {
        return fallbackText;
      }
  
      var start;
      var startValue = startText;
      var startLength = startValue.length;
      var end;
      var endValue = getText();
      var endLength = endValue.length;
  
      for (start = 0; start < startLength; start++) {
        if (startValue[start] !== endValue[start]) {
          break;
        }
      }
  
      var minEnd = startLength - start;
  
      for (end = 1; end <= minEnd; end++) {
        if (startValue[startLength - end] !== endValue[endLength - end]) {
          break;
        }
      }
  
      var sliceTail = end > 1 ? 1 - end : undefined;
      fallbackText = endValue.slice(start, sliceTail);
      return fallbackText;
    }
    function getText() {
      if ("value" in root) {
        return root.value;
      }
  
      return root.textContent;
    }
  
    function getEventCharCode(nativeEvent) {
      var charCode;
      var keyCode = nativeEvent.keyCode;
  
      if ("charCode" in nativeEvent) {
        charCode = nativeEvent.charCode;
  
        if (charCode === 0 && keyCode === 13) {
          charCode = 13;
        }
      } else {
        charCode = keyCode;
      }
  
      if (charCode === 10) {
        charCode = 13;
      }
  
      if (charCode >= 32 || charCode === 13) {
        return charCode;
      }
  
      return 0;
    }
  
    function functionThatReturnsTrue() {
      return true;
    }
  
    function functionThatReturnsFalse() {
      return false;
    }
  
    function createSyntheticEvent(Interface) {
      /**
       * Synthetic events are dispatched by event plugins, typically in response to a
       * top-level event delegation handler.
       *
       * These systems should generally use pooling to reduce the frequency of garbage
       * collection. The system should check `isPersistent` to determine whether the
       * event should be released into the pool after being dispatched. Users that
       * need a persisted event should invoke `persist`.
       *
       * Synthetic events (and subclasses) implement the DOM Level 3 Events API by
       * normalizing browser quirks. Subclasses do not necessarily have to implement a
       * DOM interface; custom application-specific events can also subclass this.
       */
      function SyntheticBaseEvent(reactName, reactEventType, targetInst, nativeEvent, nativeEventTarget) {
        this._reactName = reactName;
        this._targetInst = targetInst;
        this.type = reactEventType;
        this.nativeEvent = nativeEvent;
        this.target = nativeEventTarget;
        this.currentTarget = null;
  
        for (var _propName in Interface) {
          if (!Interface.hasOwnProperty(_propName)) {
            continue;
          }
  
          var normalize = Interface[_propName];
  
          if (normalize) {
            this[_propName] = normalize(nativeEvent);
          } else {
            this[_propName] = nativeEvent[_propName];
          }
        }
  
        var defaultPrevented =
          nativeEvent.defaultPrevented != null ? nativeEvent.defaultPrevented : nativeEvent.returnValue === false;
  
        if (defaultPrevented) {
          this.isDefaultPrevented = functionThatReturnsTrue;
        } else {
          this.isDefaultPrevented = functionThatReturnsFalse;
        }
  
        this.isPropagationStopped = functionThatReturnsFalse;
        return this;
      }
  
      _assign(SyntheticBaseEvent.prototype, {
        preventDefault: function () {
          this.defaultPrevented = true;
          var event = this.nativeEvent;
  
          if (!event) {
            return;
          }
  
          if (event.preventDefault) {
            event.preventDefault();
          } else if (typeof event.returnValue !== "unknown") {
            event.returnValue = false;
          }
  
          this.isDefaultPrevented = functionThatReturnsTrue;
        },
        stopPropagation: function () {
          var event = this.nativeEvent;
  
          if (!event) {
            return;
          }
  
          if (event.stopPropagation) {
            event.stopPropagation();
          } else if (typeof event.cancelBubble !== "unknown") {
            event.cancelBubble = true;
          }
  
          this.isPropagationStopped = functionThatReturnsTrue;
        },
  
        /**
         * We release all dispatched `SyntheticEvent`s after each event loop, adding
         * them back into the pool. This allows a way to hold onto a reference that
         * won't be added back into the pool.
         */
        persist: function () {},
  
        /**
         * Checks if this event should be released back into the pool.
         *
         * @return {boolean} True if this should not be released, false otherwise.
         */
        isPersistent: functionThatReturnsTrue,
      });
  
      return SyntheticBaseEvent;
    }
    /**
     * @interface Event
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
  
    var EventInterface = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (event) {
        return event.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    };
    var SyntheticEvent = createSyntheticEvent(EventInterface);
  
    var UIEventInterface = _assign({}, EventInterface, {
      view: 0,
      detail: 0,
    });
  
    var SyntheticUIEvent = createSyntheticEvent(UIEventInterface);
    var lastMovementX;
    var lastMovementY;
    var lastMouseEvent;
  
    function updateMouseMovementPolyfillState(event) {
      if (event !== lastMouseEvent) {
        if (lastMouseEvent && event.type === "mousemove") {
          lastMovementX = event.screenX - lastMouseEvent.screenX;
          lastMovementY = event.screenY - lastMouseEvent.screenY;
        } else {
          lastMovementX = 0;
          lastMovementY = 0;
        }
  
        lastMouseEvent = event;
      }
    }
    /**
     * @interface MouseEvent
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
  
    var MouseEventInterface = _assign({}, UIEventInterface, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: getEventModifierState,
      button: 0,
      buttons: 0,
      relatedTarget: function (event) {
        if (event.relatedTarget === undefined)
          return event.fromElement === event.srcElement ? event.toElement : event.fromElement;
        return event.relatedTarget;
      },
      movementX: function (event) {
        if ("movementX" in event) {
          return event.movementX;
        }
  
        updateMouseMovementPolyfillState(event);
        return lastMovementX;
      },
      movementY: function (event) {
        if ("movementY" in event) {
          return event.movementY;
        }
  
        return lastMovementY;
      },
    });
  
    var SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface);
    /**
     * @interface DragEvent
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
  
    var DragEventInterface = _assign({}, MouseEventInterface, {
      dataTransfer: 0,
    });
  
    var SyntheticDragEvent = createSyntheticEvent(DragEventInterface);
    /**
     * @interface FocusEvent
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
  
    var FocusEventInterface = _assign({}, UIEventInterface, {
      relatedTarget: 0,
    });
  
    var SyntheticFocusEvent = createSyntheticEvent(FocusEventInterface);
    /**
     * @interface Event
     * @see http://www.w3.org/TR/css3-animations/#AnimationEvent-interface
     * @see https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent
     */
  
    var AnimationEventInterface = _assign({}, EventInterface, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0,
    });
  
    var SyntheticAnimationEvent = createSyntheticEvent(AnimationEventInterface);
    /**
     * @interface Event
     * @see http://www.w3.org/TR/clipboard-apis/
     */
  
    var ClipboardEventInterface = _assign({}, EventInterface, {
      clipboardData: function (event) {
        return "clipboardData" in event ? event.clipboardData : window.clipboardData;
      },
    });
  
    var SyntheticClipboardEvent = createSyntheticEvent(ClipboardEventInterface);
    /**
     * @interface Event
     * @see http://www.w3.org/TR/DOM-Level-3-Events/#events-compositionevents
     */
  
    var CompositionEventInterface = _assign({}, EventInterface, {
      data: 0,
    });
  
    var SyntheticCompositionEvent = createSyntheticEvent(CompositionEventInterface);
    /**
     * @interface Event
     * @see http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105
     *      /#events-inputevents
     */
  
    var SyntheticInputEvent = SyntheticCompositionEvent;
    /**
     * Normalization of deprecated HTML5 `key` values
     * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
     */
  
    var normalizeKey = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified",
    };
    /**
     * Translation from legacy `keyCode` to HTML5 `key`
     * Only special keys supported, all others depend on keyboard layout or browser
     * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
     */
  
    var translateToKey = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta",
    };
    /**
     * @param {object} nativeEvent Native browser event.
     * @return {string} Normalized `key` property.
     */
  
    function getEventKey(nativeEvent) {
      if (nativeEvent.key) {
        var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
  
        if (key !== "Unidentified") {
          return key;
        }
      }
  
      if (nativeEvent.type === "keypress") {
        var charCode = getEventCharCode(nativeEvent);
  
        return charCode === 13 ? "Enter" : String.fromCharCode(charCode);
      }
  
      if (nativeEvent.type === "keydown" || nativeEvent.type === "keyup") {
        return translateToKey[nativeEvent.keyCode] || "Unidentified";
      }
  
      return "";
    }
    /**
     * Translation from modifier key to the associated property in the event.
     * @see http://www.w3.org/TR/DOM-Level-3-Events/#keys-Modifiers
     */
  
    var modifierKeyToProp = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey",
    };
  
    function modifierStateGetter(keyArg) {
      var syntheticEvent = this;
      var nativeEvent = syntheticEvent.nativeEvent;
  
      if (nativeEvent.getModifierState) {
        return nativeEvent.getModifierState(keyArg);
      }
  
      var keyProp = modifierKeyToProp[keyArg];
      return keyProp ? !!nativeEvent[keyProp] : false;
    }
  
    function getEventModifierState(nativeEvent) {
      return modifierStateGetter;
    }
    /**
     * @interface KeyboardEvent
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
  
    var KeyboardEventInterface = _assign({}, UIEventInterface, {
      key: getEventKey,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: getEventModifierState,
  
      charCode: function (event) {
        if (event.type === "keypress") {
          return getEventCharCode(event);
        }
  
        return 0;
      },
      keyCode: function (event) {
        if (event.type === "keydown" || event.type === "keyup") {
          return event.keyCode;
        }
  
        return 0;
      },
      which: function (event) {
        if (event.type === "keypress") {
          return getEventCharCode(event);
        }
  
        if (event.type === "keydown" || event.type === "keyup") {
          return event.keyCode;
        }
  
        return 0;
      },
    });
  
    var SyntheticKeyboardEvent = createSyntheticEvent(KeyboardEventInterface);
    /**
     * @interface PointerEvent
     * @see http://www.w3.org/TR/pointerevents/
     */
  
    var PointerEventInterface = _assign({}, MouseEventInterface, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    });
  
    var SyntheticPointerEvent = createSyntheticEvent(PointerEventInterface);
    /**
     * @interface TouchEvent
     * @see http://www.w3.org/TR/touch-events/
     */
  
    var TouchEventInterface = _assign({}, UIEventInterface, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: getEventModifierState,
    });
  
    var SyntheticTouchEvent = createSyntheticEvent(TouchEventInterface);
    /**
     * @interface Event
     * @see http://www.w3.org/TR/2009/WD-css3-transitions-20090320/#transition-events-
     * @see https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent
     */
  
    var TransitionEventInterface = _assign({}, EventInterface, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0,
    });
  
    var SyntheticTransitionEvent = createSyntheticEvent(TransitionEventInterface);
    /**
     * @interface WheelEvent
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
  
    var WheelEventInterface = _assign({}, MouseEventInterface, {
      deltaX: function (event) {
        return "deltaX" in event ? event.deltaX : "wheelDeltaX" in event ? -event.wheelDeltaX : 0;
      },
      deltaY: function (event) {
        return "deltaY" in event
          ? event.deltaY
          : "wheelDeltaY" in event
          ? -event.wheelDeltaY
          : "wheelDelta" in event
          ? -event.wheelDelta
          : 0;
      },
      deltaZ: 0,
  
      deltaMode: 0,
    });
  
    var SyntheticWheelEvent = createSyntheticEvent(WheelEventInterface);
  
    var END_KEYCODES = [9, 13, 27, 32];
  
    var START_KEYCODE = 229;
    var canUseCompositionEvent = canUseDOM && "CompositionEvent" in window;
    var documentMode = null;
  
    if (canUseDOM && "documentMode" in document) {
      documentMode = document.documentMode;
    }
  
    var canUseTextInputEvent = canUseDOM && "TextEvent" in window && !documentMode;
  
    var useFallbackCompositionData =
      canUseDOM && (!canUseCompositionEvent || (documentMode && documentMode > 8 && documentMode <= 11));
    var SPACEBAR_CODE = 32;
    var SPACEBAR_CHAR = String.fromCharCode(SPACEBAR_CODE);
  
    function registerEvents() {
      registerTwoPhaseEvent("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
      registerTwoPhaseEvent("onCompositionEnd", [
        "compositionend",
        "focusout",
        "keydown",
        "keypress",
        "keyup",
        "mousedown",
      ]);
      registerTwoPhaseEvent("onCompositionStart", [
        "compositionstart",
        "focusout",
        "keydown",
        "keypress",
        "keyup",
        "mousedown",
      ]);
      registerTwoPhaseEvent("onCompositionUpdate", [
        "compositionupdate",
        "focusout",
        "keydown",
        "keypress",
        "keyup",
        "mousedown",
      ]);
    }
  
    var hasSpaceKeypress = false;
    /**
     * Return whether a native keypress event is assumed to be a command.
     * This is required because Firefox fires `keypress` events for key commands
     * (cut, copy, select-all, etc.) even though no character is inserted.
     */
  
    function isKeypressCommand(nativeEvent) {
      return (
        (nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) && !(nativeEvent.ctrlKey && nativeEvent.altKey)
      );
    }
    /**
     * Translate native top level events into event types.
     */
  
    function getCompositionEventType(domEventName) {
      switch (domEventName) {
        case "compositionstart":
          return "onCompositionStart";
  
        case "compositionend":
          return "onCompositionEnd";
  
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    /**
     * Does our fallback best-guess model think this event signifies that
     * composition has begun?
     */
  
    function isFallbackCompositionStart(domEventName, nativeEvent) {
      return domEventName === "keydown" && nativeEvent.keyCode === START_KEYCODE;
    }
    /**
     * Does our fallback mode think that this event is the end of composition?
     */
  
    function isFallbackCompositionEnd(domEventName, nativeEvent) {
      switch (domEventName) {
        case "keyup":
          return END_KEYCODES.indexOf(nativeEvent.keyCode) !== -1;
  
        case "keydown":
          return nativeEvent.keyCode !== START_KEYCODE;
  
        case "keypress":
        case "mousedown":
        case "focusout":
          return true;
  
        default:
          return false;
      }
    }
    /**
     * Google Input Tools provides composition data via a CustomEvent,
     * with the `data` property populated in the `detail` object. If this
     * is available on the event object, use it. If not, this is a plain
     * composition event and we have nothing special to extract.
     *
     * @param {object} nativeEvent
     * @return {?string}
     */
  
    function getDataFromCustomEvent(nativeEvent) {
      var detail = nativeEvent.detail;
  
      if (typeof detail === "object" && "data" in detail) {
        return detail.data;
      }
  
      return null;
    }
    /**
     * Check if a composition event was triggered by Korean IME.
     * Our fallback mode does not work well with IE's Korean IME,
     * so just use native composition events when Korean IME is used.
     * Although CompositionEvent.locale property is deprecated,
     * it is available in IE, where our fallback mode is enabled.
     *
     * @param {object} nativeEvent
     * @return {boolean}
     */
  
    function isUsingKoreanIME(nativeEvent) {
      return nativeEvent.locale === "ko";
    }
  
    var isComposing = false;
    /**
     * @return {?object} A SyntheticCompositionEvent.
     */
  
    function extractCompositionEvent(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget) {
      var eventType;
      var fallbackData;
  
      if (canUseCompositionEvent) {
        eventType = getCompositionEventType(domEventName);
      } else if (!isComposing) {
        if (isFallbackCompositionStart(domEventName, nativeEvent)) {
          eventType = "onCompositionStart";
        }
      } else if (isFallbackCompositionEnd(domEventName, nativeEvent)) {
        eventType = "onCompositionEnd";
      }
  
      if (!eventType) {
        return null;
      }
  
      if (useFallbackCompositionData && !isUsingKoreanIME(nativeEvent)) {
        if (!isComposing && eventType === "onCompositionStart") {
          isComposing = initialize(nativeEventTarget);
        } else if (eventType === "onCompositionEnd") {
          if (isComposing) {
            fallbackData = getData();
          }
        }
      }
  
      var listeners = accumulateTwoPhaseListeners(targetInst, eventType);
  
      if (listeners.length > 0) {
        var event = new SyntheticCompositionEvent(eventType, domEventName, null, nativeEvent, nativeEventTarget);
        dispatchQueue.push({
          event: event,
          listeners: listeners,
        });
  
        if (fallbackData) {
          event.data = fallbackData;
        } else {
          var customData = getDataFromCustomEvent(nativeEvent);
  
          if (customData !== null) {
            event.data = customData;
          }
        }
      }
    }
  
    function getNativeBeforeInputChars(domEventName, nativeEvent) {
      switch (domEventName) {
        case "compositionend":
          return getDataFromCustomEvent(nativeEvent);
  
        case "keypress":
          /**
           * If native `textInput` events are available, our goal is to make
           * use of them. However, there is a special case: the spacebar key.
           * In Webkit, preventing default on a spacebar `textInput` event
           * cancels character insertion, but it *also* causes the browser
           * to fall back to its default spacebar behavior of scrolling the
           * page.
           *
           * Tracking at:
           * https://code.google.com/p/chromium/issues/detail?id=355103
           *
           * To avoid this issue, use the keypress event as if no `textInput`
           * event is available.
           */
          var which = nativeEvent.which;
  
          if (which !== SPACEBAR_CODE) {
            return null;
          }
  
          hasSpaceKeypress = true;
          return SPACEBAR_CHAR;
  
        case "textInput":
          var chars = nativeEvent.data;
  
          if (chars === SPACEBAR_CHAR && hasSpaceKeypress) {
            return null;
          }
  
          return chars;
  
        default:
          return null;
      }
    }
    /**
     * For browsers that do not provide the `textInput` event, extract the
     * appropriate string to use for SyntheticInputEvent.
     */
  
    function getFallbackBeforeInputChars(domEventName, nativeEvent) {
      if (isComposing) {
        if (
          domEventName === "compositionend" ||
          (!canUseCompositionEvent && isFallbackCompositionEnd(domEventName, nativeEvent))
        ) {
          var chars = getData();
          reset();
          isComposing = false;
          return chars;
        }
  
        return null;
      }
  
      switch (domEventName) {
        case "paste":
          return null;
  
        case "keypress":
          /**
           * As of v27, Firefox may fire keypress events even when no character
           * will be inserted. A few possibilities:
           *
           * - `which` is `0`. Arrow keys, Esc key, etc.
           *
           * - `which` is the pressed key code, but no char is available.
           *   Ex: 'AltGr + d` in Polish. There is no modified character for
           *   this key combination and no character is inserted into the
           *   document, but FF fires the keypress for char code `100` anyway.
           *   No `input` event will occur.
           *
           * - `which` is the pressed key code, but a command combination is
           *   being used. Ex: `Cmd+C`. No character is inserted, and no
           *   `input` event will occur.
           */
          if (!isKeypressCommand(nativeEvent)) {
            if (nativeEvent.char && nativeEvent.char.length > 1) {
              return nativeEvent.char;
            } else if (nativeEvent.which) {
              return String.fromCharCode(nativeEvent.which);
            }
          }
  
          return null;
  
        case "compositionend":
          return useFallbackCompositionData && !isUsingKoreanIME(nativeEvent) ? null : nativeEvent.data;
  
        default:
          return null;
      }
    }
    /**
     * Extract a SyntheticInputEvent for `beforeInput`, based on either native
     * `textInput` or fallback behavior.
     *
     * @return {?object} A SyntheticInputEvent.
     */
  
    function extractBeforeInputEvent(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget) {
      var chars;
  
      if (canUseTextInputEvent) {
        chars = getNativeBeforeInputChars(domEventName, nativeEvent);
      } else {
        chars = getFallbackBeforeInputChars(domEventName, nativeEvent);
      }
  
      if (!chars) {
        return null;
      }
  
      var listeners = accumulateTwoPhaseListeners(targetInst, "onBeforeInput");
  
      if (listeners.length > 0) {
        var event = new SyntheticInputEvent("onBeforeInput", "beforeinput", null, nativeEvent, nativeEventTarget);
        dispatchQueue.push({
          event: event,
          listeners: listeners,
        });
        event.data = chars;
      }
    }
    /**
     * Create an `onBeforeInput` event to match
     * http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105/#events-inputevents.
     *
     * This event plugin is based on the native `textInput` event
     * available in Chrome, Safari, Opera, and IE. This event fires after
     * `onKeyPress` and `onCompositionEnd`, but before `onInput`.
     *
     * `beforeInput` is spec'd but not implemented in any browsers, and
     * the `input` event does not provide any useful information about what has
     * actually been added, contrary to the spec. Thus, `textInput` is the best
     * available event to identify the characters that have actually been inserted
     * into the target node.
     *
     * This plugin is also responsible for emitting `composition` events, thus
     * allowing us to share composition fallback code for both `beforeInput` and
     * `composition` event types.
     */
  
    function extractEvents(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget) {
      extractCompositionEvent(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
      extractBeforeInputEvent(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
    }
  
    /**
     * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
     */
    var supportedInputTypes = {
      color: true,
      date: true,
      datetime: true,
      "datetime-local": true,
      email: true,
      month: true,
      number: true,
      password: true,
      range: true,
      search: true,
      tel: true,
      text: true,
      time: true,
      url: true,
      week: true,
    };
  
    function isTextInputElement(elem) {
      var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
  
      if (nodeName === "input") {
        return !!supportedInputTypes[elem.type];
      }
  
      if (nodeName === "textarea") {
        return true;
      }
  
      return false;
    }
  
    /**
     * Checks if an event is supported in the current execution environment.
     *
     * NOTE: This will not work correctly for non-generic events such as `change`,
     * `reset`, `load`, `error`, and `select`.
     *
     * Borrows from Modernizr.
     *
     * @param {string} eventNameSuffix Event name, e.g. "click".
     * @return {boolean} True if the event is supported.
     * @internal
     * @license Modernizr 3.0.0pre (Custom Build) | MIT
     */
  
    function isEventSupported(eventNameSuffix) {
      if (!canUseDOM) {
        return false;
      }
  
      var eventName = "on" + eventNameSuffix;
      var isSupported = eventName in document;
  
      if (!isSupported) {
        var element = document.createElement("div");
        element.setAttribute(eventName, "return;");
        isSupported = typeof element[eventName] === "function";
      }
  
      return isSupported;
    }
  
    function registerEvents$1() {
      registerTwoPhaseEvent("onChange", [
        "change",
        "click",
        "focusin",
        "focusout",
        "input",
        "keydown",
        "keyup",
        "selectionchange",
      ]);
    }
  
    function createAndAccumulateChangeEvent(dispatchQueue, inst, nativeEvent, target) {
      enqueueStateRestore(target);
      var listeners = accumulateTwoPhaseListeners(inst, "onChange");
  
      if (listeners.length > 0) {
        var event = new SyntheticEvent("onChange", "change", null, nativeEvent, target);
        dispatchQueue.push({
          event: event,
          listeners: listeners,
        });
      }
    }
    /**
     * For IE shims
     */
  
    var activeElement = null;
    var activeElementInst = null;
    /**
     * SECTION: handle `change` event
     */
  
    function shouldUseChangeEvent(elem) {
      var nodeName = elem.nodeName && elem.nodeName.toLowerCase();
      return nodeName === "select" || (nodeName === "input" && elem.type === "file");
    }
  
    function manualDispatchChangeEvent(nativeEvent) {
      var dispatchQueue = [];
      createAndAccumulateChangeEvent(dispatchQueue, activeElementInst, nativeEvent, getEventTarget(nativeEvent));
  
      batchedUpdates(runEventInBatch, dispatchQueue);
    }
  
    function runEventInBatch(dispatchQueue) {
      processDispatchQueue(dispatchQueue, 0);
    }
  
    function getInstIfValueChanged(targetInst) {
      var targetNode = getNodeFromInstance(targetInst);
  
      if (updateValueIfChanged(targetNode)) {
        return targetInst;
      }
    }
  
    function getTargetInstForChangeEvent(domEventName, targetInst) {
      if (domEventName === "change") {
        return targetInst;
      }
    }
    /**
     * SECTION: handle `input` event
     */
  
    var isInputEventSupported = false;
  
    if (canUseDOM) {
      isInputEventSupported = isEventSupported("input") && (!document.documentMode || document.documentMode > 9);
    }
    /**
     * (For IE <=9) Starts tracking propertychange events on the passed-in element
     * and override the value property so that we can distinguish user events from
     * value changes in JS.
     */
  
    function startWatchingForValueChange(target, targetInst) {
      activeElement = target;
      activeElementInst = targetInst;
      activeElement.attachEvent("onpropertychange", handlePropertyChange);
    }
    /**
     * (For IE <=9) Removes the event listeners from the currently-tracked element,
     * if any exists.
     */
  
    function stopWatchingForValueChange() {
      if (!activeElement) {
        return;
      }
  
      activeElement.detachEvent("onpropertychange", handlePropertyChange);
      activeElement = null;
      activeElementInst = null;
    }
    /**
     * (For IE <=9) Handles a propertychange event, sending a `change` event if
     * the value of the active element has changed.
     */
  
    function handlePropertyChange(nativeEvent) {
      if (nativeEvent.propertyName !== "value") {
        return;
      }
  
      if (getInstIfValueChanged(activeElementInst)) {
        manualDispatchChangeEvent(nativeEvent);
      }
    }
  
    function handleEventsForInputEventPolyfill(domEventName, target, targetInst) {
      if (domEventName === "focusin") {
        stopWatchingForValueChange();
        startWatchingForValueChange(target, targetInst);
      } else if (domEventName === "focusout") {
        stopWatchingForValueChange();
      }
    }
  
    function getTargetInstForInputEventPolyfill(domEventName, targetInst) {
      if (domEventName === "selectionchange" || domEventName === "keyup" || domEventName === "keydown") {
        return getInstIfValueChanged(activeElementInst);
      }
    }
    /**
     * SECTION: handle `click` event
     */
  
    function shouldUseClickEvent(elem) {
      var nodeName = elem.nodeName;
      return nodeName && nodeName.toLowerCase() === "input" && (elem.type === "checkbox" || elem.type === "radio");
    }
  
    function getTargetInstForClickEvent(domEventName, targetInst) {
      if (domEventName === "click") {
        return getInstIfValueChanged(targetInst);
      }
    }
  
    function getTargetInstForInputOrChangeEvent(domEventName, targetInst) {
      if (domEventName === "input" || domEventName === "change") {
        return getInstIfValueChanged(targetInst);
      }
    }
  
    function handleControlledInputBlur(node) {
      var state = node._wrapperState;
  
      if (!state || !state.controlled || node.type !== "number") {
        return;
      }
  
      setDefaultValue(node, "number", node.value);
    }
  
    function extractEvents$1(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget) {
      var targetNode = targetInst ? getNodeFromInstance(targetInst) : window;
      var getTargetInstFunc, handleEventFunc;
  
      if (shouldUseChangeEvent(targetNode)) {
        getTargetInstFunc = getTargetInstForChangeEvent;
      } else if (isTextInputElement(targetNode)) {
        if (isInputEventSupported) {
          getTargetInstFunc = getTargetInstForInputOrChangeEvent;
        } else {
          getTargetInstFunc = getTargetInstForInputEventPolyfill;
          handleEventFunc = handleEventsForInputEventPolyfill;
        }
      } else if (shouldUseClickEvent(targetNode)) {
        getTargetInstFunc = getTargetInstForClickEvent;
      }
  
      if (getTargetInstFunc) {
        var inst = getTargetInstFunc(domEventName, targetInst);
  
        if (inst) {
          createAndAccumulateChangeEvent(dispatchQueue, inst, nativeEvent, nativeEventTarget);
          return;
        }
      }
  
      if (handleEventFunc) {
        handleEventFunc(domEventName, targetNode, targetInst);
      }
  
      if (domEventName === "focusout") {
        handleControlledInputBlur(targetNode);
      }
    }
  
    function registerEvents$2() {
      registerDirectEvent("onMouseEnter", ["mouseout", "mouseover"]);
      registerDirectEvent("onMouseLeave", ["mouseout", "mouseover"]);
      registerDirectEvent("onPointerEnter", ["pointerout", "pointerover"]);
      registerDirectEvent("onPointerLeave", ["pointerout", "pointerover"]);
    }
  
    function extractEvents$2(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags) {
      var isOverEvent = domEventName === "mouseover" || domEventName === "pointerover";
      var isOutEvent = domEventName === "mouseout" || domEventName === "pointerout";
  
      if (isOverEvent && (eventSystemFlags & IS_REPLAYED) === 0) {
        var related = nativeEvent.relatedTarget || nativeEvent.fromElement;
  
        if (related) {
          if (getClosestInstanceFromNode(related) || isContainerMarkedAsRoot(related)) {
            return;
          }
        }
      }
  
      if (!isOutEvent && !isOverEvent) {
        return;
      }
  
      var win;
  
      if (nativeEventTarget.window === nativeEventTarget) {
        win = nativeEventTarget;
      } else {
        var doc = nativeEventTarget.ownerDocument;
  
        if (doc) {
          win = doc.defaultView || doc.parentWindow;
        } else {
          win = window;
        }
      }
  
      var from;
      var to;
  
      if (isOutEvent) {
        var _related = nativeEvent.relatedTarget || nativeEvent.toElement;
  
        from = targetInst;
        to = _related ? getClosestInstanceFromNode(_related) : null;
  
        if (to !== null) {
          var nearestMounted = getNearestMountedFiber(to);
  
          if (to !== nearestMounted || (to.tag !== HostComponent && to.tag !== HostText)) {
            to = null;
          }
        }
      } else {
        from = null;
        to = targetInst;
      }
  
      if (from === to) {
        return;
      }
  
      var SyntheticEventCtor = SyntheticMouseEvent;
      var leaveEventType = "onMouseLeave";
      var enterEventType = "onMouseEnter";
      var eventTypePrefix = "mouse";
  
      if (domEventName === "pointerout" || domEventName === "pointerover") {
        SyntheticEventCtor = SyntheticPointerEvent;
        leaveEventType = "onPointerLeave";
        enterEventType = "onPointerEnter";
        eventTypePrefix = "pointer";
      }
  
      var fromNode = from == null ? win : getNodeFromInstance(from);
      var toNode = to == null ? win : getNodeFromInstance(to);
      var leave = new SyntheticEventCtor(leaveEventType, eventTypePrefix + "leave", from, nativeEvent, nativeEventTarget);
      leave.target = fromNode;
      leave.relatedTarget = toNode;
      var enter = null;
  
      var nativeTargetInst = getClosestInstanceFromNode(nativeEventTarget);
  
      if (nativeTargetInst === targetInst) {
        var enterEvent = new SyntheticEventCtor(
          enterEventType,
          eventTypePrefix + "enter",
          to,
          nativeEvent,
          nativeEventTarget
        );
        enterEvent.target = toNode;
        enterEvent.relatedTarget = fromNode;
        enter = enterEvent;
      }
  
      accumulateEnterLeaveTwoPhaseListeners(dispatchQueue, leave, enter, from, to);
    }
  
    function is(x, y) {
      return (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y);
    }
  
    var objectIs = typeof Object.is === "function" ? Object.is : is;
  
    var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  
    function shallowEqual(objA, objB) {
      if (objectIs(objA, objB)) {
        return true;
      }
  
      if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
        return false;
      }
  
      var keysA = Object.keys(objA);
      var keysB = Object.keys(objB);
  
      if (keysA.length !== keysB.length) {
        return false;
      }
  
      for (var i = 0; i < keysA.length; i++) {
        if (!hasOwnProperty$1.call(objB, keysA[i]) || !objectIs(objA[keysA[i]], objB[keysA[i]])) {
          return false;
        }
      }
  
      return true;
    }
  
    function getLeafNode(node) {
      while (node && node.firstChild) {
        node = node.firstChild;
      }
  
      return node;
    }
  
    function getSiblingNode(node) {
      while (node) {
        if (node.nextSibling) {
          return node.nextSibling;
        }
  
        node = node.parentNode;
      }
    }
  
    function getNodeForCharacterOffset(root, offset) {
      var node = getLeafNode(root);
      var nodeStart = 0;
      var nodeEnd = 0;
  
      while (node) {
        if (node.nodeType === TEXT_NODE) {
          nodeEnd = nodeStart + node.textContent.length;
  
          if (nodeStart <= offset && nodeEnd >= offset) {
            return {
              node: node,
              offset: offset - nodeStart,
            };
          }
  
          nodeStart = nodeEnd;
        }
  
        node = getLeafNode(getSiblingNode(node));
      }
    }
  
    function getOffsets(outerNode) {
      var ownerDocument = outerNode.ownerDocument;
      var win = (ownerDocument && ownerDocument.defaultView) || window;
      var selection = win.getSelection && win.getSelection();
  
      if (!selection || selection.rangeCount === 0) {
        return null;
      }
  
      var anchorNode = selection.anchorNode,
        anchorOffset = selection.anchorOffset,
        focusNode = selection.focusNode,
        focusOffset = selection.focusOffset;
  
      try {
        anchorNode.nodeType;
        focusNode.nodeType;
      } catch (e) {
        return null;
      }
  
      return getModernOffsetsFromPoints(outerNode, anchorNode, anchorOffset, focusNode, focusOffset);
    }
  
    function getModernOffsetsFromPoints(outerNode, anchorNode, anchorOffset, focusNode, focusOffset) {
      var length = 0;
      var start = -1;
      var end = -1;
      var indexWithinAnchor = 0;
      var indexWithinFocus = 0;
      var node = outerNode;
      var parentNode = null;
  
      outer: while (true) {
        var next = null;
  
        while (true) {
          if (node === anchorNode && (anchorOffset === 0 || node.nodeType === TEXT_NODE)) {
            start = length + anchorOffset;
          }
  
          if (node === focusNode && (focusOffset === 0 || node.nodeType === TEXT_NODE)) {
            end = length + focusOffset;
          }
  
          if (node.nodeType === TEXT_NODE) {
            length += node.nodeValue.length;
          }
  
          if ((next = node.firstChild) === null) {
            break;
          }
  
          parentNode = node;
          node = next;
        }
  
        while (true) {
          if (node === outerNode) {
            break outer;
          }
  
          if (parentNode === anchorNode && ++indexWithinAnchor === anchorOffset) {
            start = length;
          }
  
          if (parentNode === focusNode && ++indexWithinFocus === focusOffset) {
            end = length;
          }
  
          if ((next = node.nextSibling) !== null) {
            break;
          }
  
          node = parentNode;
          parentNode = node.parentNode;
        }
  
        node = next;
      }
  
      if (start === -1 || end === -1) {
        return null;
      }
  
      return {
        start: start,
        end: end,
      };
    }
  
    function setOffsets(node, offsets) {
      var doc = node.ownerDocument || document;
      var win = (doc && doc.defaultView) || window;
  
      if (!win.getSelection) {
        return;
      }
  
      var selection = win.getSelection();
      var length = node.textContent.length;
      var start = Math.min(offsets.start, length);
      var end = offsets.end === undefined ? start : Math.min(offsets.end, length);
  
      if (!selection.extend && start > end) {
        var temp = end;
        end = start;
        start = temp;
      }
  
      var startMarker = getNodeForCharacterOffset(node, start);
      var endMarker = getNodeForCharacterOffset(node, end);
  
      if (startMarker && endMarker) {
        if (
          selection.rangeCount === 1 &&
          selection.anchorNode === startMarker.node &&
          selection.anchorOffset === startMarker.offset &&
          selection.focusNode === endMarker.node &&
          selection.focusOffset === endMarker.offset
        ) {
          return;
        }
  
        var range = doc.createRange();
        range.setStart(startMarker.node, startMarker.offset);
        selection.removeAllRanges();
  
        if (start > end) {
          selection.addRange(range);
          selection.extend(endMarker.node, endMarker.offset);
        } else {
          range.setEnd(endMarker.node, endMarker.offset);
          selection.addRange(range);
        }
      }
    }
  
    function isTextNode(node) {
      return node && node.nodeType === TEXT_NODE;
    }
  
    function containsNode(outerNode, innerNode) {
      if (!outerNode || !innerNode) {
        return false;
      } else if (outerNode === innerNode) {
        return true;
      } else if (isTextNode(outerNode)) {
        return false;
      } else if (isTextNode(innerNode)) {
        return containsNode(outerNode, innerNode.parentNode);
      } else if ("contains" in outerNode) {
        return outerNode.contains(innerNode);
      } else if (outerNode.compareDocumentPosition) {
        return !!(outerNode.compareDocumentPosition(innerNode) & 16);
      } else {
        return false;
      }
    }
  
    function isInDocument(node) {
      return node && node.ownerDocument && containsNode(node.ownerDocument.documentElement, node);
    }
  
    function isSameOriginFrame(iframe) {
      try {
        return typeof iframe.contentWindow.location.href === "string";
      } catch (err) {
        return false;
      }
    }
  
    function getActiveElementDeep() {
      var win = window;
      var element = getActiveElement();
  
      while (element instanceof win.HTMLIFrameElement) {
        if (isSameOriginFrame(element)) {
          win = element.contentWindow;
        } else {
          return element;
        }
  
        element = getActiveElement(win.document);
      }
  
      return element;
    }
  
    function hasSelectionCapabilities(elem) {
      var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
      return (
        nodeName &&
        ((nodeName === "input" &&
          (elem.type === "text" ||
            elem.type === "search" ||
            elem.type === "tel" ||
            elem.type === "url" ||
            elem.type === "password")) ||
          nodeName === "textarea" ||
          elem.contentEditable === "true")
      );
    }
    function getSelectionInformation() {
      var focusedElem = getActiveElementDeep();
      return {
        focusedElem: focusedElem,
        selectionRange: hasSelectionCapabilities(focusedElem) ? getSelection(focusedElem) : null,
      };
    }
  
    function restoreSelection(priorSelectionInformation) {
      var curFocusedElem = getActiveElementDeep();
      var priorFocusedElem = priorSelectionInformation.focusedElem;
      var priorSelectionRange = priorSelectionInformation.selectionRange;
  
      if (curFocusedElem !== priorFocusedElem && isInDocument(priorFocusedElem)) {
        if (priorSelectionRange !== null && hasSelectionCapabilities(priorFocusedElem)) {
          setSelection(priorFocusedElem, priorSelectionRange);
        }
  
        var ancestors = [];
        var ancestor = priorFocusedElem;
  
        while ((ancestor = ancestor.parentNode)) {
          if (ancestor.nodeType === ELEMENT_NODE) {
            ancestors.push({
              element: ancestor,
              left: ancestor.scrollLeft,
              top: ancestor.scrollTop,
            });
          }
        }
  
        if (typeof priorFocusedElem.focus === "function") {
          priorFocusedElem.focus();
        }
  
        for (var i = 0; i < ancestors.length; i++) {
          var info = ancestors[i];
          info.element.scrollLeft = info.left;
          info.element.scrollTop = info.top;
        }
      }
    }
  
    function getSelection(input) {
      var selection;
  
      if ("selectionStart" in input) {
        selection = {
          start: input.selectionStart,
          end: input.selectionEnd,
        };
      } else {
        selection = getOffsets(input);
      }
  
      return (
        selection || {
          start: 0,
          end: 0,
        }
      );
    }
  
    function setSelection(input, offsets) {
      var start = offsets.start;
      var end = offsets.end;
  
      if (end === undefined) {
        end = start;
      }
  
      if ("selectionStart" in input) {
        input.selectionStart = start;
        input.selectionEnd = Math.min(end, input.value.length);
      } else {
        setOffsets(input, offsets);
      }
    }
  
    var skipSelectionChangeEvent = canUseDOM && "documentMode" in document && document.documentMode <= 11;
  
    function registerEvents$3() {
      registerTwoPhaseEvent("onSelect", [
        "focusout",
        "contextmenu",
        "dragend",
        "focusin",
        "keydown",
        "keyup",
        "mousedown",
        "mouseup",
        "selectionchange",
      ]);
    }
  
    var activeElement$1 = null;
    var activeElementInst$1 = null;
    var lastSelection = null;
    var mouseDown = false;
  
    function getSelection$1(node) {
      if ("selectionStart" in node && hasSelectionCapabilities(node)) {
        return {
          start: node.selectionStart,
          end: node.selectionEnd,
        };
      } else {
        var win = (node.ownerDocument && node.ownerDocument.defaultView) || window;
        var selection = win.getSelection();
        return {
          anchorNode: selection.anchorNode,
          anchorOffset: selection.anchorOffset,
          focusNode: selection.focusNode,
          focusOffset: selection.focusOffset,
        };
      }
    }
  
    function getEventTargetDocument(eventTarget) {
      return eventTarget.window === eventTarget
        ? eventTarget.document
        : eventTarget.nodeType === DOCUMENT_NODE
        ? eventTarget
        : eventTarget.ownerDocument;
    }
  
    function constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget) {
      var doc = getEventTargetDocument(nativeEventTarget);
  
      if (mouseDown || activeElement$1 == null || activeElement$1 !== getActiveElement(doc)) {
        return;
      }
  
      var currentSelection = getSelection$1(activeElement$1);
  
      if (!lastSelection || !shallowEqual(lastSelection, currentSelection)) {
        lastSelection = currentSelection;
        var listeners = accumulateTwoPhaseListeners(activeElementInst$1, "onSelect");
  
        if (listeners.length > 0) {
          var event = new SyntheticEvent("onSelect", "select", null, nativeEvent, nativeEventTarget);
          dispatchQueue.push({
            event: event,
            listeners: listeners,
          });
          event.target = activeElement$1;
        }
      }
    }
  
    function extractEvents$3(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget) {
      var targetNode = targetInst ? getNodeFromInstance(targetInst) : window;
  
      switch (domEventName) {
        case "focusin":
          if (isTextInputElement(targetNode) || targetNode.contentEditable === "true") {
            activeElement$1 = targetNode;
            activeElementInst$1 = targetInst;
            lastSelection = null;
          }
  
          break;
  
        case "focusout":
          activeElement$1 = null;
          activeElementInst$1 = null;
          lastSelection = null;
          break;
  
        case "mousedown":
          mouseDown = true;
          break;
  
        case "contextmenu":
        case "mouseup":
        case "dragend":
          mouseDown = false;
          constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
          break;
  
        case "selectionchange":
          if (skipSelectionChangeEvent) {
            break;
          }
  
        case "keydown":
        case "keyup":
          constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
      }
    }
  
    function extractEvents$4(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags) {
      var reactName = topLevelEventsToReactNames.get(domEventName);
  
      if (reactName === undefined) {
        return;
      }
  
      var SyntheticEventCtor = SyntheticEvent;
      var reactEventType = domEventName;
  
      switch (domEventName) {
        case "keypress":
          if (getEventCharCode(nativeEvent) === 0) {
            return;
          }
  
        case "keydown":
        case "keyup":
          SyntheticEventCtor = SyntheticKeyboardEvent;
          break;
  
        case "focusin":
          reactEventType = "focus";
          SyntheticEventCtor = SyntheticFocusEvent;
          break;
  
        case "focusout":
          reactEventType = "blur";
          SyntheticEventCtor = SyntheticFocusEvent;
          break;
  
        case "beforeblur":
        case "afterblur":
          SyntheticEventCtor = SyntheticFocusEvent;
          break;
  
        case "click":
          if (nativeEvent.button === 2) {
            return;
          }
  
        case "auxclick":
        case "dblclick":
        case "mousedown":
        case "mousemove":
        case "mouseup":
  
        case "mouseout":
        case "mouseover":
        case "contextmenu":
          SyntheticEventCtor = SyntheticMouseEvent;
          break;
  
        case "drag":
        case "dragend":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "dragstart":
        case "drop":
          SyntheticEventCtor = SyntheticDragEvent;
          break;
  
        case "touchcancel":
        case "touchend":
        case "touchmove":
        case "touchstart":
          SyntheticEventCtor = SyntheticTouchEvent;
          break;
  
        case ANIMATION_END:
        case ANIMATION_ITERATION:
        case ANIMATION_START:
          SyntheticEventCtor = SyntheticAnimationEvent;
          break;
  
        case TRANSITION_END:
          SyntheticEventCtor = SyntheticTransitionEvent;
          break;
  
        case "scroll":
          SyntheticEventCtor = SyntheticUIEvent;
          break;
  
        case "wheel":
          SyntheticEventCtor = SyntheticWheelEvent;
          break;
  
        case "copy":
        case "cut":
        case "paste":
          SyntheticEventCtor = SyntheticClipboardEvent;
          break;
  
        case "gotpointercapture":
        case "lostpointercapture":
        case "pointercancel":
        case "pointerdown":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "pointerup":
          SyntheticEventCtor = SyntheticPointerEvent;
          break;
      }
  
      var inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
  
      {
        var accumulateTargetOnly = !inCapturePhase && domEventName === "scroll";
  
        var _listeners = accumulateSinglePhaseListeners(
          targetInst,
          reactName,
          nativeEvent.type,
          inCapturePhase,
          accumulateTargetOnly
        );
  
        if (_listeners.length > 0) {
          var _event = new SyntheticEventCtor(reactName, reactEventType, null, nativeEvent, nativeEventTarget);
  
          dispatchQueue.push({
            event: _event,
            listeners: _listeners,
          });
        }
      }
    }
  
    registerSimpleEvents();
    registerEvents$2();
    registerEvents$1();
    registerEvents$3();
    registerEvents();
  
    function extractEvents$5(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags) {
      extractEvents$4(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags);
      var shouldProcessPolyfillPlugins = (eventSystemFlags & SHOULD_NOT_PROCESS_POLYFILL_EVENT_PLUGINS) === 0;
  
      if (shouldProcessPolyfillPlugins) {
        extractEvents$2(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags);
        extractEvents$1(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
        extractEvents$3(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
        extractEvents(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
      }
    }
  
    var mediaEventTypes = [
      "abort",
      "canplay",
      "canplaythrough",
      "durationchange",
      "emptied",
      "encrypted",
      "ended",
      "error",
      "loadeddata",
      "loadedmetadata",
      "loadstart",
      "pause",
      "play",
      "playing",
      "progress",
      "ratechange",
      "seeked",
      "seeking",
      "stalled",
      "suspend",
      "timeupdate",
      "volumechange",
      "waiting",
    ];
  
    var nonDelegatedEvents = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(mediaEventTypes));
  
    function executeDispatch(event, listener, currentTarget) {
      var type = event.type || "unknown-event";
      event.currentTarget = currentTarget;
      invokeGuardedCallbackAndCatchFirstError(type, listener, undefined, event);
      event.currentTarget = null;
    }
  
    function processDispatchQueueItemsInOrder(event, dispatchListeners, inCapturePhase) {
      var previousInstance;
  
      if (inCapturePhase) {
        for (var i = dispatchListeners.length - 1; i >= 0; i--) {
          var _dispatchListeners$i = dispatchListeners[i],
            instance = _dispatchListeners$i.instance,
            currentTarget = _dispatchListeners$i.currentTarget,
            listener = _dispatchListeners$i.listener;
  
          if (instance !== previousInstance && event.isPropagationStopped()) {
            return;
          }
  
          executeDispatch(event, listener, currentTarget);
          previousInstance = instance;
        }
      } else {
        for (var _i = 0; _i < dispatchListeners.length; _i++) {
          var _dispatchListeners$_i = dispatchListeners[_i],
            _instance = _dispatchListeners$_i.instance,
            _currentTarget = _dispatchListeners$_i.currentTarget,
            _listener = _dispatchListeners$_i.listener;
  
          if (_instance !== previousInstance && event.isPropagationStopped()) {
            return;
          }
  
          executeDispatch(event, _listener, _currentTarget);
          previousInstance = _instance;
        }
      }
    }
  
    function processDispatchQueue(dispatchQueue, eventSystemFlags) {
      var inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
  
      for (var i = 0; i < dispatchQueue.length; i++) {
        var _dispatchQueue$i = dispatchQueue[i],
          event = _dispatchQueue$i.event,
          listeners = _dispatchQueue$i.listeners;
        processDispatchQueueItemsInOrder(event, listeners, inCapturePhase);
      }
  
      rethrowCaughtError();
    }
  
    function dispatchEventsForPlugins(domEventName, eventSystemFlags, nativeEvent, targetInst) {
      var nativeEventTarget = getEventTarget(nativeEvent);
      var dispatchQueue = [];
      extractEvents$5(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags);
      processDispatchQueue(dispatchQueue, eventSystemFlags);
    }
  
    function listenToNonDelegatedEvent(domEventName, targetElement) {
      var isCapturePhaseListener = false;
      var listenerSet = getEventListenerSet(targetElement);
      var listenerSetKey = getListenerSetKey(domEventName, isCapturePhaseListener);
  
      if (!listenerSet.has(listenerSetKey)) {
        addTrappedEventListener(targetElement, domEventName, IS_NON_DELEGATED, isCapturePhaseListener);
        listenerSet.add(listenerSetKey);
      }
    }
    var listeningMarker = "_reactListening" + Math.random().toString(36).slice(2);
    function listenToAllSupportedEvents(rootContainerElement) {
      if (rootContainerElement[listeningMarker]) {
        return;
      }
      rootContainerElement[listeningMarker] = true;
  
      allNativeEvents.forEach(function (domEventName) {
        if (!nonDelegatedEvents.has(domEventName)) {
          listenToNativeEvent(domEventName, false, rootContainerElement, null);
        }
  
        listenToNativeEvent(domEventName, true, rootContainerElement, null);
      });
      console.log(`
  bind events: ${Array.from(allNativeEvents.values()).join()}
  
  nonDelegatedEvents: ${Array.from(nonDelegatedEvents).join()}
      `);
    }
    function listenToNativeEvent(domEventName, isCapturePhaseListener, rootContainerElement, targetElement) {
      var eventSystemFlags = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var target = rootContainerElement;
  
      if (domEventName === "selectionchange" && rootContainerElement.nodeType !== DOCUMENT_NODE) {
        target = rootContainerElement.ownerDocument;
      }
  
      if (targetElement !== null && !isCapturePhaseListener && nonDelegatedEvents.has(domEventName)) {
        if (domEventName !== "scroll") {
          return;
        }
  
        eventSystemFlags |= IS_NON_DELEGATED;
        target = targetElement;
      }
  
      var listenerSet = getEventListenerSet(target);
      var listenerSetKey = getListenerSetKey(domEventName, isCapturePhaseListener);
  
      if (!listenerSet.has(listenerSetKey)) {
        if (isCapturePhaseListener) {
          eventSystemFlags |= IS_CAPTURE_PHASE;
        }
  
        addTrappedEventListener(target, domEventName, eventSystemFlags, isCapturePhaseListener);
        listenerSet.add(listenerSetKey);
      }
    }
  
    function addTrappedEventListener(targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener) {
      var listener = createEventListenerWrapperWithPriority(targetContainer, domEventName, eventSystemFlags);
  
      var isPassiveListener = undefined;
  
      if (passiveBrowserEventsSupported) {
        if (domEventName === "touchstart" || domEventName === "touchmove" || domEventName === "wheel") {
          isPassiveListener = true;
        }
      }
  
      targetContainer = targetContainer;
      var unsubscribeListener;
  
      if (isCapturePhaseListener) {
        if (isPassiveListener !== undefined) {
          unsubscribeListener = addEventCaptureListenerWithPassiveFlag(
            targetContainer,
            domEventName,
            listener,
            isPassiveListener
          );
        } else {
          unsubscribeListener = addEventCaptureListener(targetContainer, domEventName, listener);
        }
      } else {
        if (isPassiveListener !== undefined) {
          unsubscribeListener = addEventBubbleListenerWithPassiveFlag(
            targetContainer,
            domEventName,
            listener,
            isPassiveListener
          );
        } else {
          unsubscribeListener = addEventBubbleListener(targetContainer, domEventName, listener);
        }
      }
    }
  
    function isMatchingRootContainer(grandContainer, targetContainer) {
      return (
        grandContainer === targetContainer ||
        (grandContainer.nodeType === COMMENT_NODE && grandContainer.parentNode === targetContainer)
      );
    }
  
    function dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer) {
      var ancestorInst = targetInst;
  
      if ((eventSystemFlags & IS_EVENT_HANDLE_NON_MANAGED_NODE) === 0 && (eventSystemFlags & IS_NON_DELEGATED) === 0) {
        var targetContainerNode = targetContainer;
  
        if (targetInst !== null) {
          var node = targetInst;
  
          mainLoop: while (true) {
            if (node === null) {
              return;
            }
  
            var nodeTag = node.tag;
  
            if (nodeTag === HostRoot || nodeTag === HostPortal) {
              var container = node.stateNode.containerInfo;
  
              if (isMatchingRootContainer(container, targetContainerNode)) {
                break;
              }
  
              if (nodeTag === HostPortal) {
                var grandNode = node.return;
  
                while (grandNode !== null) {
                  var grandTag = grandNode.tag;
  
                  if (grandTag === HostRoot || grandTag === HostPortal) {
                    var grandContainer = grandNode.stateNode.containerInfo;
  
                    if (isMatchingRootContainer(grandContainer, targetContainerNode)) {
                      return;
                    }
                  }
  
                  grandNode = grandNode.return;
                }
              }
  
              while (container !== null) {
                var parentNode = getClosestInstanceFromNode(container);
  
                if (parentNode === null) {
                  return;
                }
  
                var parentTag = parentNode.tag;
  
                if (parentTag === HostComponent || parentTag === HostText) {
                  node = ancestorInst = parentNode;
                  continue mainLoop;
                }
  
                container = container.parentNode;
              }
            }
  
            node = node.return;
          }
        }
      }
  
      batchedEventUpdates(function () {
        return dispatchEventsForPlugins(domEventName, eventSystemFlags, nativeEvent, ancestorInst);
      });
    }
  
    function createDispatchListener(instance, listener, currentTarget) {
      return {
        instance: instance,
        listener: listener,
        currentTarget: currentTarget,
      };
    }
  
    function accumulateSinglePhaseListeners(
      targetFiber,
      reactName,
      nativeEventType,
      inCapturePhase,
      accumulateTargetOnly
    ) {
      var captureName = reactName !== null ? reactName + "Capture" : null;
      var reactEventName = inCapturePhase ? captureName : reactName;
      var listeners = [];
      var instance = targetFiber;
      var lastHostComponent = null;
  
      while (instance !== null) {
        var _instance2 = instance,
          stateNode = _instance2.stateNode,
          tag = _instance2.tag;
  
        if (tag === HostComponent && stateNode !== null) {
          lastHostComponent = stateNode;
  
          if (reactEventName !== null) {
            var listener = getListener(instance, reactEventName);
  
            if (listener != null) {
              listeners.push(createDispatchListener(instance, listener, lastHostComponent));
            }
          }
        }
  
        if (accumulateTargetOnly) {
          break;
        }
  
        instance = instance.return;
      }
  
      return listeners;
    }
  
    function accumulateTwoPhaseListeners(targetFiber, reactName) {
      var captureName = reactName + "Capture";
      var listeners = [];
      var instance = targetFiber;
  
      while (instance !== null) {
        var _instance3 = instance,
          stateNode = _instance3.stateNode,
          tag = _instance3.tag;
  
        if (tag === HostComponent && stateNode !== null) {
          var currentTarget = stateNode;
          var captureListener = getListener(instance, captureName);
  
          if (captureListener != null) {
            listeners.unshift(createDispatchListener(instance, captureListener, currentTarget));
          }
  
          var bubbleListener = getListener(instance, reactName);
  
          if (bubbleListener != null) {
            listeners.push(createDispatchListener(instance, bubbleListener, currentTarget));
          }
        }
  
        instance = instance.return;
      }
  
      return listeners;
    }
  
    function getParent(inst) {
      if (inst === null) {
        return null;
      }
  
      do {
        inst = inst.return;
      } while (inst && inst.tag !== HostComponent);
  
      if (inst) {
        return inst;
      }
  
      return null;
    }
    /**
     * Return the lowest common ancestor of A and B, or null if they are in
     * different trees.
     */
  
    function getLowestCommonAncestor(instA, instB) {
      var nodeA = instA;
      var nodeB = instB;
      var depthA = 0;
  
      for (var tempA = nodeA; tempA; tempA = getParent(tempA)) {
        depthA++;
      }
  
      var depthB = 0;
  
      for (var tempB = nodeB; tempB; tempB = getParent(tempB)) {
        depthB++;
      }
  
      while (depthA - depthB > 0) {
        nodeA = getParent(nodeA);
        depthA--;
      }
  
      while (depthB - depthA > 0) {
        nodeB = getParent(nodeB);
        depthB--;
      }
  
      var depth = depthA;
  
      while (depth--) {
        if (nodeA === nodeB || (nodeB !== null && nodeA === nodeB.alternate)) {
          return nodeA;
        }
  
        nodeA = getParent(nodeA);
        nodeB = getParent(nodeB);
      }
  
      return null;
    }
  
    function accumulateEnterLeaveListenersForEvent(dispatchQueue, event, target, common, inCapturePhase) {
      var registrationName = event._reactName;
      var listeners = [];
      var instance = target;
  
      while (instance !== null) {
        if (instance === common) {
          break;
        }
  
        var _instance4 = instance,
          alternate = _instance4.alternate,
          stateNode = _instance4.stateNode,
          tag = _instance4.tag;
  
        if (alternate !== null && alternate === common) {
          break;
        }
  
        if (tag === HostComponent && stateNode !== null) {
          var currentTarget = stateNode;
  
          if (inCapturePhase) {
            var captureListener = getListener(instance, registrationName);
  
            if (captureListener != null) {
              listeners.unshift(createDispatchListener(instance, captureListener, currentTarget));
            }
          } else if (!inCapturePhase) {
            var bubbleListener = getListener(instance, registrationName);
  
            if (bubbleListener != null) {
              listeners.push(createDispatchListener(instance, bubbleListener, currentTarget));
            }
          }
        }
  
        instance = instance.return;
      }
  
      if (listeners.length !== 0) {
        dispatchQueue.push({
          event: event,
          listeners: listeners,
        });
      }
    }
  
    function accumulateEnterLeaveTwoPhaseListeners(dispatchQueue, leaveEvent, enterEvent, from, to) {
      var common = from && to ? getLowestCommonAncestor(from, to) : null;
  
      if (from !== null) {
        accumulateEnterLeaveListenersForEvent(dispatchQueue, leaveEvent, from, common, false);
      }
  
      if (to !== null && enterEvent !== null) {
        accumulateEnterLeaveListenersForEvent(dispatchQueue, enterEvent, to, common, true);
      }
    }
    function getListenerSetKey(domEventName, capture) {
      return domEventName + "__" + (capture ? "capture" : "bubble");
    }
  
    var DANGEROUSLY_SET_INNER_HTML = "dangerouslySetInnerHTML";
    var SUPPRESS_CONTENT_EDITABLE_WARNING = "suppressContentEditableWarning";
    var SUPPRESS_HYDRATION_WARNING = "suppressHydrationWarning";
    var AUTOFOCUS = "autoFocus";
    var CHILDREN = "children";
    var STYLE = "style";
    var HTML$1 = "__html";
    var HTML_NAMESPACE$1 = Namespaces.html;
  
    function getOwnerDocumentFromRootContainer(rootContainerElement) {
      return rootContainerElement.nodeType === DOCUMENT_NODE ? rootContainerElement : rootContainerElement.ownerDocument;
    }
  
    function noop() {}
  
    function trapClickOnNonInteractiveElement(node) {
      node.onclick = noop;
    }
  
    function setInitialDOMProperties(tag, domElement, rootContainerElement, nextProps, isCustomComponentTag) {
      for (var propKey in nextProps) {
        if (!nextProps.hasOwnProperty(propKey)) {
          continue;
        }
  
        var nextProp = nextProps[propKey];
  
        if (propKey === STYLE) {
          setValueForStyles(domElement, nextProp);
        } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
          var nextHtml = nextProp ? nextProp[HTML$1] : undefined;
  
          if (nextHtml != null) {
            setInnerHTML(domElement, nextHtml);
          }
        } else if (propKey === CHILDREN) {
          if (typeof nextProp === "string") {
            var canSetTextContent = tag !== "textarea" || nextProp !== "";
  
            if (canSetTextContent) {
              setTextContent(domElement, nextProp);
            }
          } else if (typeof nextProp === "number") {
            setTextContent(domElement, "" + nextProp);
          }
        } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING);
        else if (propKey === AUTOFOCUS);
        else if (registrationNameDependencies.hasOwnProperty(propKey)) {
          if (nextProp != null) {
            if (propKey === "onScroll") {
              listenToNonDelegatedEvent("scroll", domElement);
            }
          }
        } else if (nextProp != null) {
          setValueForProperty(domElement, propKey, nextProp, isCustomComponentTag);
        }
      }
    }
  
    function updateDOMProperties(domElement, updatePayload, wasCustomComponentTag, isCustomComponentTag) {
      for (var i = 0; i < updatePayload.length; i += 2) {
        var propKey = updatePayload[i];
        var propValue = updatePayload[i + 1];
  
        if (propKey === STYLE) {
          setValueForStyles(domElement, propValue);
        } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
          setInnerHTML(domElement, propValue);
        } else if (propKey === CHILDREN) {
          setTextContent(domElement, propValue);
        } else {
          setValueForProperty(domElement, propKey, propValue, isCustomComponentTag);
        }
      }
    }
  
    function createElement(type, props, rootContainerElement, parentNamespace) {
      var ownerDocument = getOwnerDocumentFromRootContainer(rootContainerElement);
      var domElement;
      var namespaceURI = parentNamespace;
  
      if (namespaceURI === HTML_NAMESPACE$1) {
        namespaceURI = getIntrinsicNamespace(type);
      }
  
      if (namespaceURI === HTML_NAMESPACE$1) {
        if (type === "script") {
          var div = ownerDocument.createElement("div");
  
          div.innerHTML = "<script><" + "/script>";
  
          var firstChild = div.firstChild;
          domElement = div.removeChild(firstChild);
        } else if (typeof props.is === "string") {
          domElement = ownerDocument.createElement(type, {
            is: props.is,
          });
        } else {
          domElement = ownerDocument.createElement(type);
  
          if (type === "select") {
            var node = domElement;
  
            if (props.multiple) {
              node.multiple = true;
            } else if (props.size) {
              node.size = props.size;
            }
          }
        }
      } else {
        domElement = ownerDocument.createElementNS(namespaceURI, type);
      }
  
      return domElement;
    }
    function createTextNode(text, rootContainerElement) {
      return getOwnerDocumentFromRootContainer(rootContainerElement).createTextNode(text);
    }
    function setInitialProperties(domElement, tag, rawProps, rootContainerElement) {
      var isCustomComponentTag = isCustomComponent(tag, rawProps);
  
      var props;
  
      switch (tag) {
        case "dialog":
          listenToNonDelegatedEvent("cancel", domElement);
          listenToNonDelegatedEvent("close", domElement);
          props = rawProps;
          break;
  
        case "iframe":
        case "object":
        case "embed":
          listenToNonDelegatedEvent("load", domElement);
          props = rawProps;
          break;
  
        case "video":
        case "audio":
          for (var i = 0; i < mediaEventTypes.length; i++) {
            listenToNonDelegatedEvent(mediaEventTypes[i], domElement);
          }
  
          props = rawProps;
          break;
  
        case "source":
          listenToNonDelegatedEvent("error", domElement);
          props = rawProps;
          break;
  
        case "img":
        case "image":
        case "link":
          listenToNonDelegatedEvent("error", domElement);
          listenToNonDelegatedEvent("load", domElement);
          props = rawProps;
          break;
  
        case "details":
          listenToNonDelegatedEvent("toggle", domElement);
          props = rawProps;
          break;
  
        case "input":
          initWrapperState(domElement, rawProps);
          props = getHostProps(domElement, rawProps);
  
          listenToNonDelegatedEvent("invalid", domElement);
  
          break;
  
        case "option":
          props = getHostProps$1(domElement, rawProps);
          break;
  
        case "select":
          initWrapperState$1(domElement, rawProps);
          props = getHostProps$2(domElement, rawProps);
  
          listenToNonDelegatedEvent("invalid", domElement);
  
          break;
  
        case "textarea":
          initWrapperState$2(domElement, rawProps);
          props = getHostProps$3(domElement, rawProps);
  
          listenToNonDelegatedEvent("invalid", domElement);
  
          break;
  
        default:
          props = rawProps;
      }
  
      assertValidProps(tag, props);
      setInitialDOMProperties(tag, domElement, rootContainerElement, props, isCustomComponentTag);
  
      switch (tag) {
        case "input":
          track(domElement);
          postMountWrapper(domElement, rawProps, false);
          break;
  
        case "textarea":
          track(domElement);
          postMountWrapper$3(domElement);
          break;
  
        case "option":
          postMountWrapper$1(domElement, rawProps);
          break;
  
        case "select":
          postMountWrapper$2(domElement, rawProps);
          break;
  
        default:
          if (typeof props.onClick === "function") {
            trapClickOnNonInteractiveElement(domElement);
          }
  
          break;
      }
    }
  
    function diffProperties(domElement, tag, lastRawProps, nextRawProps) {
      var updatePayload = null;
      var lastProps;
      var nextProps;
  
      switch (tag) {
        case "input":
          lastProps = getHostProps(domElement, lastRawProps);
          nextProps = getHostProps(domElement, nextRawProps);
          updatePayload = [];
          break;
  
        case "option":
          lastProps = getHostProps$1(domElement, lastRawProps);
          nextProps = getHostProps$1(domElement, nextRawProps);
          updatePayload = [];
          break;
  
        case "select":
          lastProps = getHostProps$2(domElement, lastRawProps);
          nextProps = getHostProps$2(domElement, nextRawProps);
          updatePayload = [];
          break;
  
        case "textarea":
          lastProps = getHostProps$3(domElement, lastRawProps);
          nextProps = getHostProps$3(domElement, nextRawProps);
          updatePayload = [];
          break;
  
        default:
          lastProps = lastRawProps;
          nextProps = nextRawProps;
  
          if (typeof lastProps.onClick !== "function" && typeof nextProps.onClick === "function") {
            trapClickOnNonInteractiveElement(domElement);
          }
  
          break;
      }
  
      assertValidProps(tag, nextProps);
      var propKey;
      var styleName;
      var styleUpdates = null;
  
      for (propKey in lastProps) {
        if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
          continue;
        }
  
        if (propKey === STYLE) {
          var lastStyle = lastProps[propKey];
  
          for (styleName in lastStyle) {
            if (lastStyle.hasOwnProperty(styleName)) {
              if (!styleUpdates) {
                styleUpdates = {};
              }
  
              styleUpdates[styleName] = "";
            }
          }
        } else if (propKey === DANGEROUSLY_SET_INNER_HTML || propKey === CHILDREN);
        else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING);
        else if (propKey === AUTOFOCUS);
        else if (registrationNameDependencies.hasOwnProperty(propKey)) {
          if (!updatePayload) {
            updatePayload = [];
          }
        } else {
          (updatePayload = updatePayload || []).push(propKey, null);
        }
      }
  
      for (propKey in nextProps) {
        var nextProp = nextProps[propKey];
        var lastProp = lastProps != null ? lastProps[propKey] : undefined;
  
        if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || (nextProp == null && lastProp == null)) {
          continue;
        }
  
        if (propKey === STYLE) {
          if (lastProp) {
            for (styleName in lastProp) {
              if (lastProp.hasOwnProperty(styleName) && (!nextProp || !nextProp.hasOwnProperty(styleName))) {
                if (!styleUpdates) {
                  styleUpdates = {};
                }
  
                styleUpdates[styleName] = "";
              }
            }
  
            for (styleName in nextProp) {
              if (nextProp.hasOwnProperty(styleName) && lastProp[styleName] !== nextProp[styleName]) {
                if (!styleUpdates) {
                  styleUpdates = {};
                }
  
                styleUpdates[styleName] = nextProp[styleName];
              }
            }
          } else {
            if (!styleUpdates) {
              if (!updatePayload) {
                updatePayload = [];
              }
  
              updatePayload.push(propKey, styleUpdates);
            }
  
            styleUpdates = nextProp;
          }
        } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
          var nextHtml = nextProp ? nextProp[HTML$1] : undefined;
          var lastHtml = lastProp ? lastProp[HTML$1] : undefined;
  
          if (nextHtml != null) {
            if (lastHtml !== nextHtml) {
              (updatePayload = updatePayload || []).push(propKey, nextHtml);
            }
          }
        } else if (propKey === CHILDREN) {
          if (typeof nextProp === "string" || typeof nextProp === "number") {
            (updatePayload = updatePayload || []).push(propKey, "" + nextProp);
          }
        } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING);
        else if (registrationNameDependencies.hasOwnProperty(propKey)) {
          if (nextProp != null) {
            if (propKey === "onScroll") {
              listenToNonDelegatedEvent("scroll", domElement);
            }
          }
  
          if (!updatePayload && lastProp !== nextProp) {
            updatePayload = [];
          }
        } else if (typeof nextProp === "object" && nextProp !== null && nextProp.$$typeof === REACT_OPAQUE_ID_TYPE) {
          nextProp.toString();
        } else {
          (updatePayload = updatePayload || []).push(propKey, nextProp);
        }
      }
  
      if (styleUpdates) {
        (updatePayload = updatePayload || []).push(STYLE, styleUpdates);
      }
  
      return updatePayload;
    }
  
    function updateProperties(domElement, updatePayload, tag, lastRawProps, nextRawProps) {
      if (tag === "input" && nextRawProps.type === "radio" && nextRawProps.name != null) {
        updateChecked(domElement, nextRawProps);
      }
  
      var wasCustomComponentTag = isCustomComponent(tag, lastRawProps);
      var isCustomComponentTag = isCustomComponent(tag, nextRawProps);
  
      updateDOMProperties(domElement, updatePayload, wasCustomComponentTag, isCustomComponentTag);
  
      switch (tag) {
        case "input":
          updateWrapper(domElement, nextRawProps);
          break;
  
        case "textarea":
          updateWrapper$1(domElement, nextRawProps);
          break;
  
        case "select":
          postUpdateWrapper(domElement, nextRawProps);
          break;
      }
    }
  
    function diffHydratedProperties(domElement, tag, rawProps) {
      switch (tag) {
        case "dialog":
          listenToNonDelegatedEvent("cancel", domElement);
          listenToNonDelegatedEvent("close", domElement);
          break;
  
        case "iframe":
        case "object":
        case "embed":
          listenToNonDelegatedEvent("load", domElement);
          break;
  
        case "video":
        case "audio":
          for (var i = 0; i < mediaEventTypes.length; i++) {
            listenToNonDelegatedEvent(mediaEventTypes[i], domElement);
          }
  
          break;
  
        case "source":
          listenToNonDelegatedEvent("error", domElement);
          break;
  
        case "img":
        case "image":
        case "link":
          listenToNonDelegatedEvent("error", domElement);
          listenToNonDelegatedEvent("load", domElement);
          break;
  
        case "details":
          listenToNonDelegatedEvent("toggle", domElement);
          break;
  
        case "input":
          initWrapperState(domElement, rawProps);
  
          listenToNonDelegatedEvent("invalid", domElement);
  
          break;
  
        case "option":
          break;
  
        case "select":
          initWrapperState$1(domElement, rawProps);
  
          listenToNonDelegatedEvent("invalid", domElement);
  
          break;
  
        case "textarea":
          initWrapperState$2(domElement, rawProps);
  
          listenToNonDelegatedEvent("invalid", domElement);
  
          break;
      }
  
      assertValidProps(tag, rawProps);
  
      var updatePayload = null;
  
      for (var propKey in rawProps) {
        if (!rawProps.hasOwnProperty(propKey)) {
          continue;
        }
  
        var nextProp = rawProps[propKey];
  
        if (propKey === CHILDREN) {
          if (typeof nextProp === "string") {
            if (domElement.textContent !== nextProp) {
              updatePayload = [CHILDREN, nextProp];
            }
          } else if (typeof nextProp === "number") {
            if (domElement.textContent !== "" + nextProp) {
              updatePayload = [CHILDREN, "" + nextProp];
            }
          }
        } else if (registrationNameDependencies.hasOwnProperty(propKey)) {
          if (nextProp != null) {
            if (propKey === "onScroll") {
              listenToNonDelegatedEvent("scroll", domElement);
            }
          }
        }
      }
  
      switch (tag) {
        case "input":
          track(domElement);
          postMountWrapper(domElement, rawProps, true);
          break;
  
        case "textarea":
          track(domElement);
          postMountWrapper$3(domElement);
          break;
  
        case "select":
        case "option":
          break;
  
        default:
          if (typeof rawProps.onClick === "function") {
            trapClickOnNonInteractiveElement(domElement);
          }
  
          break;
      }
  
      return updatePayload;
    }
    function diffHydratedText(textNode, text) {
      var isDifferent = textNode.nodeValue !== text;
      return isDifferent;
    }
    function restoreControlledState$3(domElement, tag, props) {
      switch (tag) {
        case "input":
          restoreControlledState(domElement, props);
          return;
  
        case "textarea":
          restoreControlledState$2(domElement, props);
          return;
  
        case "select":
          restoreControlledState$1(domElement, props);
          return;
      }
    }
  
    var SUSPENSE_START_DATA = "$";
    var SUSPENSE_END_DATA = "/$";
    var SUSPENSE_PENDING_START_DATA = "$?";
    var SUSPENSE_FALLBACK_START_DATA = "$!";
    var STYLE$1 = "style";
    var eventsEnabled = null;
    var selectionInformation = null;
  
    function shouldAutoFocusHostComponent(type, props) {
      switch (type) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          return !!props.autoFocus;
      }
  
      return false;
    }
    function getRootHostContext(rootContainerInstance) {
      var type;
      var namespace;
      var nodeType = rootContainerInstance.nodeType;
  
      switch (nodeType) {
        case DOCUMENT_NODE:
        case DOCUMENT_FRAGMENT_NODE: {
          type = nodeType === DOCUMENT_NODE ? "#document" : "#fragment";
          var root = rootContainerInstance.documentElement;
          namespace = root ? root.namespaceURI : getChildNamespace(null, "");
          break;
        }
  
        default: {
          var container = nodeType === COMMENT_NODE ? rootContainerInstance.parentNode : rootContainerInstance;
          var ownNamespace = container.namespaceURI || null;
          type = container.tagName;
          namespace = getChildNamespace(ownNamespace, type);
          break;
        }
      }
  
      return namespace;
    }
    function getChildHostContext(parentHostContext, type) {
      var parentNamespace = parentHostContext;
      return getChildNamespace(parentNamespace, type);
    }
    function getPublicInstance(instance) {
      return instance;
    }
    function prepareForCommit(containerInfo) {
      eventsEnabled = isEnabled();
      selectionInformation = getSelectionInformation();
      var activeInstance = null;
  
      setEnabled(false);
      return activeInstance;
    }
    function resetAfterCommit(containerInfo) {
      restoreSelection(selectionInformation);
      setEnabled(eventsEnabled);
      eventsEnabled = null;
      selectionInformation = null;
    }
    function createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
      var parentNamespace;
  
      {
        parentNamespace = hostContext;
      }
  
      var domElement = createElement(type, props, rootContainerInstance, parentNamespace);
      precacheFiberNode(internalInstanceHandle, domElement);
      updateFiberProps(domElement, props);
      return domElement;
    }
    function appendInitialChild(parentInstance, child) {
      parentInstance.appendChild(child);
    }
    function finalizeInitialChildren(domElement, type, props, rootContainerInstance) {
      setInitialProperties(domElement, type, props, rootContainerInstance);
      return shouldAutoFocusHostComponent(type, props);
    }
    function prepareUpdate(domElement, type, oldProps, newProps) {
      return diffProperties(domElement, type, oldProps, newProps);
    }
    function shouldSetTextContent(type, props) {
      return (
        type === "textarea" ||
        type === "option" ||
        type === "noscript" ||
        typeof props.children === "string" ||
        typeof props.children === "number" ||
        (typeof props.dangerouslySetInnerHTML === "object" &&
          props.dangerouslySetInnerHTML !== null &&
          props.dangerouslySetInnerHTML.__html != null)
      );
    }
    function createTextInstance(text, rootContainerInstance, hostContext, internalInstanceHandle) {
      var textNode = createTextNode(text, rootContainerInstance);
      precacheFiberNode(internalInstanceHandle, textNode);
      return textNode;
    }
  
    var scheduleTimeout = typeof setTimeout === "function" ? setTimeout : undefined;
    var cancelTimeout = typeof clearTimeout === "function" ? clearTimeout : undefined;
    var noTimeout = -1;
    function commitMount(domElement, type, newProps) {
      if (shouldAutoFocusHostComponent(type, newProps)) {
        domElement.focus();
      }
    }
    function commitUpdate(domElement, updatePayload, type, oldProps, newProps) {
      updateFiberProps(domElement, newProps);
  
      updateProperties(domElement, updatePayload, type, oldProps, newProps);
    }
    function resetTextContent(domElement) {
      setTextContent(domElement, "");
    }
    function commitTextUpdate(textInstance, oldText, newText) {
      textInstance.nodeValue = newText;
    }
    function appendChild(parentInstance, child) {
      parentInstance.appendChild(child);
    }
    function appendChildToContainer(container, child) {
      var parentNode;
  
      if (container.nodeType === COMMENT_NODE) {
        parentNode = container.parentNode;
        parentNode.insertBefore(child, container);
      } else {
        parentNode = container;
        parentNode.appendChild(child);
      }
  
      var reactRootContainer = container._reactRootContainer;
  
      if ((reactRootContainer === null || reactRootContainer === undefined) && parentNode.onclick === null) {
        trapClickOnNonInteractiveElement(parentNode);
      }
    }
    function insertBefore(parentInstance, child, beforeChild) {
      parentInstance.insertBefore(child, beforeChild);
    }
    function insertInContainerBefore(container, child, beforeChild) {
      if (container.nodeType === COMMENT_NODE) {
        container.parentNode.insertBefore(child, beforeChild);
      } else {
        container.insertBefore(child, beforeChild);
      }
    }
  
    function removeChild(parentInstance, child) {
      parentInstance.removeChild(child);
    }
    function removeChildFromContainer(container, child) {
      if (container.nodeType === COMMENT_NODE) {
        container.parentNode.removeChild(child);
      } else {
        container.removeChild(child);
      }
    }
    function hideInstance(instance) {
      instance = instance;
      var style = instance.style;
  
      if (typeof style.setProperty === "function") {
        style.setProperty("display", "none", "important");
      } else {
        style.display = "none";
      }
    }
    function hideTextInstance(textInstance) {
      textInstance.nodeValue = "";
    }
    function unhideInstance(instance, props) {
      instance = instance;
      var styleProp = props[STYLE$1];
      var display =
        styleProp !== undefined && styleProp !== null && styleProp.hasOwnProperty("display") ? styleProp.display : null;
      instance.style.display = dangerousStyleValue("display", display);
    }
    function unhideTextInstance(textInstance, text) {
      textInstance.nodeValue = text;
    }
    function clearContainer(container) {
      if (container.nodeType === ELEMENT_NODE) {
        container.textContent = "";
      } else if (container.nodeType === DOCUMENT_NODE) {
        var body = container.body;
  
        if (body != null) {
          body.textContent = "";
        }
      }
    }
    function canHydrateInstance(instance, type) {
      if (instance.nodeType !== ELEMENT_NODE || type.toLowerCase() !== instance.nodeName.toLowerCase()) {
        return null;
      }
  
      return instance;
    }
    function canHydrateTextInstance(instance, text) {
      if (text === "" || instance.nodeType !== TEXT_NODE) {
        return null;
      }
  
      return instance;
    }
    function isSuspenseInstancePending(instance) {
      return instance.data === SUSPENSE_PENDING_START_DATA;
    }
    function isSuspenseInstanceFallback(instance) {
      return instance.data === SUSPENSE_FALLBACK_START_DATA;
    }
  
    function getNextHydratable(node) {
      for (; node != null; node = node.nextSibling) {
        var nodeType = node.nodeType;
  
        if (nodeType === ELEMENT_NODE || nodeType === TEXT_NODE) {
          break;
        }
      }
  
      return node;
    }
  
    function getNextHydratableSibling(instance) {
      return getNextHydratable(instance.nextSibling);
    }
    function getFirstHydratableChild(parentInstance) {
      return getNextHydratable(parentInstance.firstChild);
    }
    function hydrateInstance(instance, type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
      precacheFiberNode(internalInstanceHandle, instance);
  
      updateFiberProps(instance, props);
  
      return diffHydratedProperties(instance, type, props);
    }
    function hydrateTextInstance(textInstance, text, internalInstanceHandle) {
      precacheFiberNode(internalInstanceHandle, textInstance);
      return diffHydratedText(textInstance, text);
    }
    function getNextHydratableInstanceAfterSuspenseInstance(suspenseInstance) {
      var node = suspenseInstance.nextSibling;
  
      var depth = 0;
  
      while (node) {
        if (node.nodeType === COMMENT_NODE) {
          var data = node.data;
  
          if (data === SUSPENSE_END_DATA) {
            if (depth === 0) {
              return getNextHydratableSibling(node);
            } else {
              depth--;
            }
          } else if (
            data === SUSPENSE_START_DATA ||
            data === SUSPENSE_FALLBACK_START_DATA ||
            data === SUSPENSE_PENDING_START_DATA
          ) {
            depth++;
          }
        }
  
        node = node.nextSibling;
      }
  
      return null;
    }
  
    function getParentSuspenseInstance(targetInstance) {
      var node = targetInstance.previousSibling;
  
      var depth = 0;
  
      while (node) {
        if (node.nodeType === COMMENT_NODE) {
          var data = node.data;
  
          if (
            data === SUSPENSE_START_DATA ||
            data === SUSPENSE_FALLBACK_START_DATA ||
            data === SUSPENSE_PENDING_START_DATA
          ) {
            if (depth === 0) {
              return node;
            } else {
              depth--;
            }
          } else if (data === SUSPENSE_END_DATA) {
            depth++;
          }
        }
  
        node = node.previousSibling;
      }
  
      return null;
    }
    function commitHydratedContainer(container) {
      retryIfBlockedOn(container);
    }
    function commitHydratedSuspenseInstance(suspenseInstance) {
      retryIfBlockedOn(suspenseInstance);
    }
    var clientId = 0;
    function makeClientId() {
      return "r:" + (clientId++).toString(36);
    }
    function makeOpaqueHydratingObject(attemptToReadValue) {
      return {
        $$typeof: REACT_OPAQUE_ID_TYPE,
        toString: attemptToReadValue,
        valueOf: attemptToReadValue,
      };
    }
    function preparePortalMount(portalInstance) {
      {
        listenToAllSupportedEvents(portalInstance);
      }
    }
  
    var randomKey = Math.random().toString(36).slice(2);
    var internalInstanceKey = "__reactFiber$" + randomKey;
    var internalPropsKey = "__reactProps$" + randomKey;
    var internalContainerInstanceKey = "__reactContainer$" + randomKey;
    var internalEventHandlersKey = "__reactEvents$" + randomKey;
    function precacheFiberNode(hostInst, node) {
      node[internalInstanceKey] = hostInst;
    }
    function markContainerAsRoot(hostRoot, node) {
      node[internalContainerInstanceKey] = hostRoot;
    }
    function unmarkContainerAsRoot(node) {
      node[internalContainerInstanceKey] = null;
    }
    function isContainerMarkedAsRoot(node) {
      return !!node[internalContainerInstanceKey];
    }
  
    function getClosestInstanceFromNode(targetNode) {
      var targetInst = targetNode[internalInstanceKey];
  
      if (targetInst) {
        return targetInst;
      }
  
      var parentNode = targetNode.parentNode;
  
      while (parentNode) {
        targetInst = parentNode[internalContainerInstanceKey] || parentNode[internalInstanceKey];
  
        if (targetInst) {
          var alternate = targetInst.alternate;
  
          if (targetInst.child !== null || (alternate !== null && alternate.child !== null)) {
            var suspenseInstance = getParentSuspenseInstance(targetNode);
  
            while (suspenseInstance !== null) {
              var targetSuspenseInst = suspenseInstance[internalInstanceKey];
  
              if (targetSuspenseInst) {
                return targetSuspenseInst;
              }
  
              suspenseInstance = getParentSuspenseInstance(suspenseInstance);
            }
          }
  
          return targetInst;
        }
  
        targetNode = parentNode;
        parentNode = targetNode.parentNode;
      }
  
      return null;
    }
    /**
     * Given a DOM node, return the ReactDOMComponent or ReactDOMTextComponent
     * instance, or null if the node was not rendered by this React.
     */
  
    function getInstanceFromNode(node) {
      var inst = node[internalInstanceKey] || node[internalContainerInstanceKey];
  
      if (inst) {
        if (
          inst.tag === HostComponent ||
          inst.tag === HostText ||
          inst.tag === SuspenseComponent ||
          inst.tag === HostRoot
        ) {
          return inst;
        } else {
          return null;
        }
      }
  
      return null;
    }
    /**
     * Given a ReactDOMComponent or ReactDOMTextComponent, return the corresponding
     * DOM node.
     */
  
    function getNodeFromInstance(inst) {
      if (inst.tag === HostComponent || inst.tag === HostText) {
        return inst.stateNode;
      }
  
      {
        {
          throw Error(formatProdErrorMessage(33));
        }
      }
    }
    function getFiberCurrentPropsFromNode(node) {
      return node[internalPropsKey] || null;
    }
    function updateFiberProps(node, props) {
      node[internalPropsKey] = props;
    }
    function getEventListenerSet(node) {
      var elementListenerSet = node[internalEventHandlersKey];
  
      if (elementListenerSet === undefined) {
        elementListenerSet = node[internalEventHandlersKey] = new Set();
      }
  
      return elementListenerSet;
    }
  
    var valueStack = [];
  
    var index = -1;
  
    function createCursor(defaultValue) {
      return {
        current: defaultValue,
      };
    }
  
    function pop(cursor) {
      if (index < 0) {
        return;
      }
  
      cursor.current = valueStack[index];
      valueStack[index] = null;
  
      index--;
    }
  
    function push(cursor, value) {
      index++;
      valueStack[index] = cursor.current;
  
      cursor.current = value;
    }
  
    var emptyContextObject = {};
  
    var contextStackCursor = createCursor(emptyContextObject);
  
    var didPerformWorkStackCursor = createCursor(false);
  
    var previousContext = emptyContextObject;
  
    function getUnmaskedContext(workInProgress, Component, didPushOwnContextIfProvider) {
      if (didPushOwnContextIfProvider && isContextProvider(Component)) {
        return previousContext;
      }
  
      return contextStackCursor.current;
    }
  
    function cacheContext(workInProgress, unmaskedContext, maskedContext) {
      {
        var instance = workInProgress.stateNode;
        instance.__reactInternalMemoizedUnmaskedChildContext = unmaskedContext;
        instance.__reactInternalMemoizedMaskedChildContext = maskedContext;
      }
    }
  
    function getMaskedContext(workInProgress, unmaskedContext) {
      var type = workInProgress.type;
      var contextTypes = type.contextTypes;
  
      if (!contextTypes) {
        return emptyContextObject;
      }
  
      var instance = workInProgress.stateNode;
  
      if (instance && instance.__reactInternalMemoizedUnmaskedChildContext === unmaskedContext) {
        return instance.__reactInternalMemoizedMaskedChildContext;
      }
  
      var context = {};
  
      for (var key in contextTypes) {
        context[key] = unmaskedContext[key];
      }
  
      if (instance) {
        cacheContext(workInProgress, unmaskedContext, context);
      }
  
      return context;
    }
  
    function hasContextChanged() {
      {
        return didPerformWorkStackCursor.current;
      }
    }
  
    function isContextProvider(type) {
      {
        var childContextTypes = type.childContextTypes;
        return childContextTypes !== null && childContextTypes !== undefined;
      }
    }
  
    function popContext() {
      {
        pop(didPerformWorkStackCursor);
        pop(contextStackCursor);
      }
    }
  
    function popTopLevelContextObject() {
      {
        pop(didPerformWorkStackCursor);
        pop(contextStackCursor);
      }
    }
  
    function pushTopLevelContextObject(fiber, context, didChange) {
      {
        if (!(contextStackCursor.current === emptyContextObject)) {
          {
            throw Error(formatProdErrorMessage(168));
          }
        }
  
        push(contextStackCursor, context);
        push(didPerformWorkStackCursor, didChange);
      }
    }
  
    function processChildContext(fiber, type, parentContext) {
      {
        var instance = fiber.stateNode;
        var childContextTypes = type.childContextTypes;
  
        if (typeof instance.getChildContext !== "function") {
          return parentContext;
        }
  
        var childContext = instance.getChildContext();
  
        for (var contextKey in childContext) {
          if (!(contextKey in childContextTypes)) {
            {
              throw Error(formatProdErrorMessage(108, getComponentName(type) || "Unknown", contextKey));
            }
          }
        }
  
        return _assign({}, parentContext, childContext);
      }
    }
  
    function pushContextProvider(workInProgress) {
      {
        var instance = workInProgress.stateNode;
  
        var memoizedMergedChildContext =
          (instance && instance.__reactInternalMemoizedMergedChildContext) || emptyContextObject;
  
        previousContext = contextStackCursor.current;
        push(contextStackCursor, memoizedMergedChildContext);
        push(didPerformWorkStackCursor, didPerformWorkStackCursor.current);
        return true;
      }
    }
  
    function invalidateContextProvider(workInProgress, type, didChange) {
      {
        var instance = workInProgress.stateNode;
  
        if (!instance) {
          {
            throw Error(formatProdErrorMessage(169));
          }
        }
  
        if (didChange) {
          var mergedContext = processChildContext(workInProgress, type, previousContext);
          instance.__reactInternalMemoizedMergedChildContext = mergedContext;
  
          pop(didPerformWorkStackCursor);
          pop(contextStackCursor);
  
          push(contextStackCursor, mergedContext);
          push(didPerformWorkStackCursor, didChange);
        } else {
          pop(didPerformWorkStackCursor);
          push(didPerformWorkStackCursor, didChange);
        }
      }
    }
  
    function findCurrentUnmaskedContext(fiber) {
      {
        if (!(isFiberMounted(fiber) && fiber.tag === ClassComponent)) {
          {
            throw Error(formatProdErrorMessage(170));
          }
        }
  
        var node = fiber;
  
        do {
          switch (node.tag) {
            case HostRoot:
              return node.stateNode.context;
  
            case ClassComponent: {
              var Component = node.type;
  
              if (isContextProvider(Component)) {
                return node.stateNode.__reactInternalMemoizedMergedChildContext;
              }
  
              break;
            }
          }
  
          node = node.return;
        } while (node !== null);
  
        {
          {
            throw Error(formatProdErrorMessage(171));
          }
        }
      }
    }
  
    var LegacyRoot = 0;
    var BlockingRoot = 1;
    var ConcurrentRoot = 2;
  
    var rendererID = null;
    var injectedHook = null;
  
    function onCommitRoot(root, priorityLevel) {
      if (injectedHook && typeof injectedHook.onCommitFiberRoot === "function") {
        try {
          var didError = (root.current.flags & DidCapture) === DidCapture;
  
          if (enableProfilerTimer) {
            injectedHook.onCommitFiberRoot(rendererID, root, priorityLevel, didError);
          } else {
            injectedHook.onCommitFiberRoot(rendererID, root, undefined, didError);
          }
        } catch (err) {}
      }
    }
  
    function onCommitUnmount(fiber) {
      if (injectedHook && typeof injectedHook.onCommitFiberUnmount === "function") {
        try {
          injectedHook.onCommitFiberUnmount(rendererID, fiber);
        } catch (err) {}
      }
    }
  
    var Scheduler_runWithPriority = unstable_runWithPriority,
      Scheduler_scheduleCallback = unstable_scheduleCallback,
      Scheduler_cancelCallback = unstable_cancelCallback,
      Scheduler_shouldYield = unstable_shouldYield,
      Scheduler_requestPaint = unstable_requestPaint,
      Scheduler_now$1 = unstable_now,
      Scheduler_getCurrentPriorityLevel = unstable_getCurrentPriorityLevel,
      Scheduler_ImmediatePriority = unstable_ImmediatePriority,
      Scheduler_UserBlockingPriority = unstable_UserBlockingPriority,
      Scheduler_NormalPriority = unstable_NormalPriority,
      Scheduler_LowPriority = unstable_LowPriority,
      Scheduler_IdlePriority = unstable_IdlePriority;
  
    var fakeCallbackNode = {};
  
    var ImmediatePriority$1 = 99;
    var UserBlockingPriority$2 = 98;
    var NormalPriority$1 = 97;
    var LowPriority$1 = 96;
    var IdlePriority$1 = 95;
  
    var NoPriority$1 = 90;
    var shouldYield = Scheduler_shouldYield;
    var requestPaint = Scheduler_requestPaint !== undefined ? Scheduler_requestPaint : function () {};
    var syncQueue = null;
    var immediateQueueCallbackNode = null;
    var isFlushingSyncQueue = false;
    var initialTimeMs$1 = Scheduler_now$1();
  
    var now =
      initialTimeMs$1 < 10000
        ? Scheduler_now$1
        : function () {
            return Scheduler_now$1() - initialTimeMs$1;
          };
    function getCurrentPriorityLevel() {
      switch (Scheduler_getCurrentPriorityLevel()) {
        case Scheduler_ImmediatePriority:
          return ImmediatePriority$1;
  
        case Scheduler_UserBlockingPriority:
          return UserBlockingPriority$2;
  
        case Scheduler_NormalPriority:
          return NormalPriority$1;
  
        case Scheduler_LowPriority:
          return LowPriority$1;
  
        case Scheduler_IdlePriority:
          return IdlePriority$1;
  
        default: {
          {
            throw Error(formatProdErrorMessage(332));
          }
        }
      }
    }
  
    function reactPriorityToSchedulerPriority(reactPriorityLevel) {
      switch (reactPriorityLevel) {
        case ImmediatePriority$1:
          return Scheduler_ImmediatePriority;
  
        case UserBlockingPriority$2:
          return Scheduler_UserBlockingPriority;
  
        case NormalPriority$1:
          return Scheduler_NormalPriority;
  
        case LowPriority$1:
          return Scheduler_LowPriority;
  
        case IdlePriority$1:
          return Scheduler_IdlePriority;
  
        default: {
          {
            throw Error(formatProdErrorMessage(332));
          }
        }
      }
    }
  
    function runWithPriority$1(reactPriorityLevel, fn) {
      var priorityLevel = reactPriorityToSchedulerPriority(reactPriorityLevel);
      return Scheduler_runWithPriority(priorityLevel, fn);
    }
    function scheduleCallback(reactPriorityLevel, callback, options) {
      console.log("[scheduleCallback]");
      var priorityLevel = reactPriorityToSchedulerPriority(reactPriorityLevel);
      return Scheduler_scheduleCallback(priorityLevel, callback, options);
    }
    function scheduleSyncCallback(callback) {
      if (syncQueue === null) {
        syncQueue = [callback];
  
        immediateQueueCallbackNode = Scheduler_scheduleCallback(Scheduler_ImmediatePriority, flushSyncCallbackQueueImpl);
      } else {
        syncQueue.push(callback);
      }
  
      return fakeCallbackNode;
    }
    function cancelCallback(callbackNode) {
      if (callbackNode !== fakeCallbackNode) {
        Scheduler_cancelCallback(callbackNode);
      }
    }
    function flushSyncCallbackQueue() {
      if (immediateQueueCallbackNode !== null) {
        var node = immediateQueueCallbackNode;
        immediateQueueCallbackNode = null;
        Scheduler_cancelCallback(node);
      }
  
      flushSyncCallbackQueueImpl();
    }
  
    function flushSyncCallbackQueueImpl() {
      if (!isFlushingSyncQueue && syncQueue !== null) {
        isFlushingSyncQueue = true;
        var i = 0;
  
        try {
          var _isSync2 = true;
          var _queue = syncQueue;
          runWithPriority$1(ImmediatePriority$1, function () {
            for (; i < _queue.length; i++) {
              var callback = _queue[i];
  
              do {
                callback = callback(_isSync2);
              } while (callback !== null);
            }
          });
          syncQueue = null;
        } catch (error) {
          if (syncQueue !== null) {
            syncQueue = syncQueue.slice(i + 1);
          }
  
          Scheduler_scheduleCallback(Scheduler_ImmediatePriority, flushSyncCallbackQueue);
          throw error;
        } finally {
          isFlushingSyncQueue = false;
        }
      }
    }
  
    var ReactVersion = "17.0.0";
  
    var NoMode = 0;
    var StrictMode = 1;
  
    var BlockingMode = 2;
    var ConcurrentMode = 4;
    var ProfileMode = 8;
    var DebugTracingMode = 16;
  
    var ReactCurrentBatchConfig = ReactSharedInternals.ReactCurrentBatchConfig;
    var NoTransition = 0;
    function requestCurrentTransition() {
      return ReactCurrentBatchConfig.transition;
    }
  
    function resolveDefaultProps(Component, baseProps) {
      if (Component && Component.defaultProps) {
        var props = _assign({}, baseProps);
  
        var defaultProps = Component.defaultProps;
  
        for (var propName in defaultProps) {
          if (props[propName] === undefined) {
            props[propName] = defaultProps[propName];
          }
        }
  
        return props;
      }
  
      return baseProps;
    }
  
    var MAX_SIGNED_31_BIT_INT = 1073741823;
  
    var valueCursor = createCursor(null);
  
    var currentlyRenderingFiber = null;
    var lastContextDependency = null;
    var lastContextWithAllBitsObserved = null;
    function resetContextDependencies() {
      currentlyRenderingFiber = null;
      lastContextDependency = null;
      lastContextWithAllBitsObserved = null;
    }
    function pushProvider(providerFiber, nextValue) {
      var context = providerFiber.type._context;
  
      {
        push(valueCursor, context._currentValue);
        context._currentValue = nextValue;
      }
    }
    function popProvider(providerFiber) {
      var currentValue = valueCursor.current;
      pop(valueCursor);
      var context = providerFiber.type._context;
  
      {
        context._currentValue = currentValue;
      }
    }
    function calculateChangedBits(context, newValue, oldValue) {
      if (objectIs(oldValue, newValue)) {
        return 0;
      } else {
        var changedBits =
          typeof context._calculateChangedBits === "function"
            ? context._calculateChangedBits(oldValue, newValue)
            : MAX_SIGNED_31_BIT_INT;
  
        return changedBits | 0;
      }
    }
    function scheduleWorkOnParentPath(parent, renderLanes) {
      var node = parent;
  
      while (node !== null) {
        var alternate = node.alternate;
  
        if (!isSubsetOfLanes(node.childLanes, renderLanes)) {
          node.childLanes = mergeLanes(node.childLanes, renderLanes);
  
          if (alternate !== null) {
            alternate.childLanes = mergeLanes(alternate.childLanes, renderLanes);
          }
        } else if (alternate !== null && !isSubsetOfLanes(alternate.childLanes, renderLanes)) {
          alternate.childLanes = mergeLanes(alternate.childLanes, renderLanes);
        } else {
          break;
        }
  
        node = node.return;
      }
    }
    function propagateContextChange(workInProgress, context, changedBits, renderLanes) {
      var fiber = workInProgress.child;
  
      if (fiber !== null) {
        fiber.return = workInProgress;
      }
  
      while (fiber !== null) {
        var nextFiber = void 0;
  
        var list = fiber.dependencies;
  
        if (list !== null) {
          nextFiber = fiber.child;
          var dependency = list.firstContext;
  
          while (dependency !== null) {
            if (dependency.context === context && (dependency.observedBits & changedBits) !== 0) {
              if (fiber.tag === ClassComponent) {
                var update = createUpdate(NoTimestamp, pickArbitraryLane(renderLanes));
                update.tag = ForceUpdate;
  
                enqueueUpdate(fiber, update);
              }
  
              fiber.lanes = mergeLanes(fiber.lanes, renderLanes);
              var alternate = fiber.alternate;
  
              if (alternate !== null) {
                alternate.lanes = mergeLanes(alternate.lanes, renderLanes);
              }
  
              scheduleWorkOnParentPath(fiber.return, renderLanes);
  
              list.lanes = mergeLanes(list.lanes, renderLanes);
  
              break;
            }
  
            dependency = dependency.next;
          }
        } else if (fiber.tag === ContextProvider) {
          nextFiber = fiber.type === workInProgress.type ? null : fiber.child;
        } else {
          nextFiber = fiber.child;
        }
  
        if (nextFiber !== null) {
          nextFiber.return = fiber;
        } else {
          nextFiber = fiber;
  
          while (nextFiber !== null) {
            if (nextFiber === workInProgress) {
              nextFiber = null;
              break;
            }
  
            var sibling = nextFiber.sibling;
  
            if (sibling !== null) {
              sibling.return = nextFiber.return;
              nextFiber = sibling;
              break;
            }
  
            nextFiber = nextFiber.return;
          }
        }
  
        fiber = nextFiber;
      }
    }
    function prepareToReadContext(workInProgress, renderLanes) {
      currentlyRenderingFiber = workInProgress;
      lastContextDependency = null;
      lastContextWithAllBitsObserved = null;
      var dependencies = workInProgress.dependencies;
  
      if (dependencies !== null) {
        var firstContext = dependencies.firstContext;
  
        if (firstContext !== null) {
          if (includesSomeLane(dependencies.lanes, renderLanes)) {
            markWorkInProgressReceivedUpdate();
          }
  
          dependencies.firstContext = null;
        }
      }
    }
    function readContext(context, observedBits) {
      if (lastContextWithAllBitsObserved === context);
      else if (observedBits === false || observedBits === 0);
      else {
        var resolvedObservedBits;
  
        if (typeof observedBits !== "number" || observedBits === MAX_SIGNED_31_BIT_INT) {
          lastContextWithAllBitsObserved = context;
          resolvedObservedBits = MAX_SIGNED_31_BIT_INT;
        } else {
          resolvedObservedBits = observedBits;
        }
  
        var contextItem = {
          context: context,
          observedBits: resolvedObservedBits,
          next: null,
        };
  
        if (lastContextDependency === null) {
          if (!(currentlyRenderingFiber !== null)) {
            {
              throw Error(formatProdErrorMessage(308));
            }
          }
  
          lastContextDependency = contextItem;
          currentlyRenderingFiber.dependencies = {
            lanes: NoLanes,
            firstContext: contextItem,
            responders: null,
          };
        } else {
          lastContextDependency = lastContextDependency.next = contextItem;
        }
      }
  
      return context._currentValue;
    }
  
    var UpdateState = 0;
    var ReplaceState = 1;
    var ForceUpdate = 2;
    var CaptureUpdate = 3;
  
    var hasForceUpdate = false;
  
    function initializeUpdateQueue(fiber) {
      var queue = {
        baseState: fiber.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
        },
        effects: null,
      };
      fiber.updateQueue = queue;
    }
    function cloneUpdateQueue(current, workInProgress) {
      var queue = workInProgress.updateQueue;
      var currentQueue = current.updateQueue;
  
      if (queue === currentQueue) {
        var clone = {
          baseState: currentQueue.baseState,
          firstBaseUpdate: currentQueue.firstBaseUpdate,
          lastBaseUpdate: currentQueue.lastBaseUpdate,
          shared: currentQueue.shared,
          effects: currentQueue.effects,
        };
        workInProgress.updateQueue = clone;
      }
    }
    /** 创建update对象(环形链表) 1. 应用初始化 2. 发起组件更新 */
    function createUpdate(eventTime, lane) {
      var update = {
        eventTime: eventTime,
        lane: lane,
        tag: UpdateState,
        payload: null,
        callback: null,
        next: null,
      };
      return update;
    }
    /** 将update放到fiber.shared.pending上 */
    function enqueueUpdate(fiber, update) {
      var updateQueue = fiber.updateQueue;
  
      if (updateQueue === null) {
        return;
      }
  
      var sharedQueue = updateQueue.shared;
      var pending = sharedQueue.pending;
  
      // update是一个环形链表
      if (pending === null) {
        update.next = update;
      } else {
        update.next = pending.next;
        pending.next = update;
      }
  
      sharedQueue.pending = update;
    }
    function enqueueCapturedUpdate(workInProgress, capturedUpdate) {
      var queue = workInProgress.updateQueue;
  
      var current = workInProgress.alternate;
  
      if (current !== null) {
        var currentQueue = current.updateQueue;
  
        if (queue === currentQueue) {
          var newFirst = null;
          var newLast = null;
          var firstBaseUpdate = queue.firstBaseUpdate;
  
          if (firstBaseUpdate !== null) {
            var update = firstBaseUpdate;
  
            do {
              var clone = {
                eventTime: update.eventTime,
                lane: update.lane,
                tag: update.tag,
                payload: update.payload,
                callback: update.callback,
                next: null,
              };
  
              if (newLast === null) {
                newFirst = newLast = clone;
              } else {
                newLast.next = clone;
                newLast = clone;
              }
  
              update = update.next;
            } while (update !== null);
  
            if (newLast === null) {
              newFirst = newLast = capturedUpdate;
            } else {
              newLast.next = capturedUpdate;
              newLast = capturedUpdate;
            }
          } else {
            newFirst = newLast = capturedUpdate;
          }
  
          queue = {
            baseState: currentQueue.baseState,
            firstBaseUpdate: newFirst,
            lastBaseUpdate: newLast,
            shared: currentQueue.shared,
            effects: currentQueue.effects,
          };
          workInProgress.updateQueue = queue;
          return;
        }
      }
  
      var lastBaseUpdate = queue.lastBaseUpdate;
  
      if (lastBaseUpdate === null) {
        queue.firstBaseUpdate = capturedUpdate;
      } else {
        lastBaseUpdate.next = capturedUpdate;
      }
  
      queue.lastBaseUpdate = capturedUpdate;
    }
  
    function getStateFromUpdate(workInProgress, queue, update, prevState, nextProps, instance) {
      switch (update.tag) {
        case ReplaceState: {
          var payload = update.payload;
  
          if (typeof payload === "function") {
            var nextState = payload.call(instance, prevState, nextProps);
  
            return nextState;
          }
  
          return payload;
        }
  
        case CaptureUpdate: {
          workInProgress.flags = (workInProgress.flags & ~ShouldCapture) | DidCapture;
        }
  
        case UpdateState: {
          var _payload = update.payload;
          var partialState;
  
          if (typeof _payload === "function") {
            partialState = _payload.call(instance, prevState, nextProps);
          } else {
            partialState = _payload;
          }
  
          if (partialState === null || partialState === undefined) {
            return prevState;
          }
  
          return _assign({}, prevState, partialState);
        }
  
        case ForceUpdate: {
          hasForceUpdate = true;
          return prevState;
        }
      }
  
      return prevState;
    }
  
    function processUpdateQueue(workInProgress, props, instance, renderLanes) {
      var queue = workInProgress.updateQueue;
      hasForceUpdate = false;
  
      var firstBaseUpdate = queue.firstBaseUpdate;
      var lastBaseUpdate = queue.lastBaseUpdate;
  
      var pendingQueue = queue.shared.pending;
  
      if (pendingQueue !== null) {
        queue.shared.pending = null;
  
        var lastPendingUpdate = pendingQueue;
        var firstPendingUpdate = lastPendingUpdate.next;
        lastPendingUpdate.next = null;
  
        if (lastBaseUpdate === null) {
          firstBaseUpdate = firstPendingUpdate;
        } else {
          lastBaseUpdate.next = firstPendingUpdate;
        }
  
        lastBaseUpdate = lastPendingUpdate;
  
        var current = workInProgress.alternate;
  
        if (current !== null) {
          var currentQueue = current.updateQueue;
          var currentLastBaseUpdate = currentQueue.lastBaseUpdate;
  
          if (currentLastBaseUpdate !== lastBaseUpdate) {
            if (currentLastBaseUpdate === null) {
              currentQueue.firstBaseUpdate = firstPendingUpdate;
            } else {
              currentLastBaseUpdate.next = firstPendingUpdate;
            }
  
            currentQueue.lastBaseUpdate = lastPendingUpdate;
          }
        }
      }
  
      if (firstBaseUpdate !== null) {
        var newState = queue.baseState;
  
        var newLanes = NoLanes;
        var newBaseState = null;
        var newFirstBaseUpdate = null;
        var newLastBaseUpdate = null;
        var update = firstBaseUpdate;
  
        do {
          var updateLane = update.lane;
          var updateEventTime = update.eventTime;
  
          if (!isSubsetOfLanes(renderLanes, updateLane)) {
            var clone = {
              eventTime: updateEventTime,
              lane: updateLane,
              tag: update.tag,
              payload: update.payload,
              callback: update.callback,
              next: null,
            };
  
            if (newLastBaseUpdate === null) {
              newFirstBaseUpdate = newLastBaseUpdate = clone;
              newBaseState = newState;
            } else {
              newLastBaseUpdate = newLastBaseUpdate.next = clone;
            }
  
            newLanes = mergeLanes(newLanes, updateLane);
          } else {
            if (newLastBaseUpdate !== null) {
              var _clone = {
                eventTime: updateEventTime,
  
                lane: NoLane,
                tag: update.tag,
                payload: update.payload,
                callback: update.callback,
                next: null,
              };
              newLastBaseUpdate = newLastBaseUpdate.next = _clone;
            }
  
            newState = getStateFromUpdate(workInProgress, queue, update, newState, props, instance);
            var callback = update.callback;
  
            if (callback !== null) {
              workInProgress.flags |= Callback;
              var effects = queue.effects;
  
              if (effects === null) {
                queue.effects = [update];
              } else {
                effects.push(update);
              }
            }
          }
  
          update = update.next;
  
          if (update === null) {
            pendingQueue = queue.shared.pending;
  
            if (pendingQueue === null) {
              break;
            } else {
              var _lastPendingUpdate = pendingQueue;
  
              var _firstPendingUpdate = _lastPendingUpdate.next;
              _lastPendingUpdate.next = null;
              update = _firstPendingUpdate;
              queue.lastBaseUpdate = _lastPendingUpdate;
              queue.shared.pending = null;
            }
          }
        } while (true);
  
        if (newLastBaseUpdate === null) {
          newBaseState = newState;
        }
  
        queue.baseState = newBaseState;
        queue.firstBaseUpdate = newFirstBaseUpdate;
        queue.lastBaseUpdate = newLastBaseUpdate;
  
        markSkippedUpdateLanes(newLanes);
        workInProgress.lanes = newLanes;
        workInProgress.memoizedState = newState;
      }
    }
  
    function callCallback(callback, context) {
      if (!(typeof callback === "function")) {
        {
          throw Error(formatProdErrorMessage(191, callback));
        }
      }
  
      callback.call(context);
    }
  
    function resetHasForceUpdateBeforeProcessing() {
      hasForceUpdate = false;
    }
    function checkHasForceUpdateAfterProcessing() {
      return hasForceUpdate;
    }
    function commitUpdateQueue(finishedWork, finishedQueue, instance) {
      var effects = finishedQueue.effects;
      finishedQueue.effects = null;
  
      if (effects !== null) {
        for (var i = 0; i < effects.length; i++) {
          var effect = effects[i];
          var callback = effect.callback;
  
          if (callback !== null) {
            effect.callback = null;
            callCallback(callback, instance);
          }
        }
      }
    }
  
    var emptyRefsObject = new React.Component().refs;
  
    function applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, nextProps) {
      var prevState = workInProgress.memoizedState;
  
      var partialState = getDerivedStateFromProps(nextProps, prevState);
  
      var memoizedState =
        partialState === null || partialState === undefined ? prevState : _assign({}, prevState, partialState);
      workInProgress.memoizedState = memoizedState;
  
      if (workInProgress.lanes === NoLanes) {
        var updateQueue = workInProgress.updateQueue;
        updateQueue.baseState = memoizedState;
      }
    }
    var classComponentUpdater = {
      isMounted: isMounted,
      enqueueSetState: function (inst, payload, callback) {
        var fiber = get(inst);
        var eventTime = requestEventTime();
        var lane = requestUpdateLane(fiber);
        var update = createUpdate(eventTime, lane);
        update.payload = payload;
  
        if (callback !== undefined && callback !== null) {
          update.callback = callback;
        }
  
        enqueueUpdate(fiber, update);
        scheduleUpdateOnFiber(fiber, lane, eventTime);
      },
      enqueueReplaceState: function (inst, payload, callback) {
        var fiber = get(inst);
        var eventTime = requestEventTime();
        var lane = requestUpdateLane(fiber);
        var update = createUpdate(eventTime, lane);
        update.tag = ReplaceState;
        update.payload = payload;
  
        if (callback !== undefined && callback !== null) {
          update.callback = callback;
        }
  
        enqueueUpdate(fiber, update);
        scheduleUpdateOnFiber(fiber, lane, eventTime);
      },
      enqueueForceUpdate: function (inst, callback) {
        var fiber = get(inst);
        var eventTime = requestEventTime();
        var lane = requestUpdateLane(fiber);
        var update = createUpdate(eventTime, lane);
        update.tag = ForceUpdate;
  
        if (callback !== undefined && callback !== null) {
          update.callback = callback;
        }
  
        enqueueUpdate(fiber, update);
        scheduleUpdateOnFiber(fiber, lane, eventTime);
      },
    };
  
    function checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext) {
      var instance = workInProgress.stateNode;
  
      if (typeof instance.shouldComponentUpdate === "function") {
        var shouldUpdate = instance.shouldComponentUpdate(newProps, newState, nextContext);
  
        return shouldUpdate;
      }
  
      if (ctor.prototype && ctor.prototype.isPureReactComponent) {
        return !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState);
      }
  
      return true;
    }
  
    function adoptClassInstance(workInProgress, instance) {
      instance.updater = classComponentUpdater;
      workInProgress.stateNode = instance;
  
      set(instance, workInProgress);
    }
  
    function constructClassInstance(workInProgress, ctor, props) {
      var isLegacyContextConsumer = false;
      var unmaskedContext = emptyContextObject;
      var context = emptyContextObject;
      var contextType = ctor.contextType;
  
      if (typeof contextType === "object" && contextType !== null) {
        context = readContext(contextType);
      } else {
        unmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
        var contextTypes = ctor.contextTypes;
        isLegacyContextConsumer = contextTypes !== null && contextTypes !== undefined;
        context = isLegacyContextConsumer ? getMaskedContext(workInProgress, unmaskedContext) : emptyContextObject;
      }
  
      var instance = new ctor(props, context);
      adoptClassInstance(workInProgress, instance);
  
      if (isLegacyContextConsumer) {
        cacheContext(workInProgress, unmaskedContext, context);
      }
  
      return instance;
    }
  
    function callComponentWillMount(workInProgress, instance) {
      var oldState = instance.state;
  
      if (typeof instance.componentWillMount === "function") {
        instance.componentWillMount();
      }
  
      if (typeof instance.UNSAFE_componentWillMount === "function") {
        instance.UNSAFE_componentWillMount();
      }
  
      if (oldState !== instance.state) {
        classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
      }
    }
  
    function callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext) {
      var oldState = instance.state;
  
      if (typeof instance.componentWillReceiveProps === "function") {
        instance.componentWillReceiveProps(newProps, nextContext);
      }
  
      if (typeof instance.UNSAFE_componentWillReceiveProps === "function") {
        instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
      }
  
      if (instance.state !== oldState) {
        classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
      }
    }
  
    function mountClassInstance(workInProgress, ctor, newProps, renderLanes) {
      var instance = workInProgress.stateNode;
      instance.props = newProps;
      instance.state = workInProgress.memoizedState;
      instance.refs = emptyRefsObject;
      initializeUpdateQueue(workInProgress);
      var contextType = ctor.contextType;
  
      if (typeof contextType === "object" && contextType !== null) {
        instance.context = readContext(contextType);
      } else {
        var unmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
        instance.context = getMaskedContext(workInProgress, unmaskedContext);
      }
  
      processUpdateQueue(workInProgress, newProps, instance, renderLanes);
      instance.state = workInProgress.memoizedState;
      var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  
      if (typeof getDerivedStateFromProps === "function") {
        applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, newProps);
        instance.state = workInProgress.memoizedState;
      }
  
      if (
        typeof ctor.getDerivedStateFromProps !== "function" &&
        typeof instance.getSnapshotBeforeUpdate !== "function" &&
        (typeof instance.UNSAFE_componentWillMount === "function" || typeof instance.componentWillMount === "function")
      ) {
        callComponentWillMount(workInProgress, instance);
  
        processUpdateQueue(workInProgress, newProps, instance, renderLanes);
        instance.state = workInProgress.memoizedState;
      }
  
      if (typeof instance.componentDidMount === "function") {
        workInProgress.flags |= Update;
      }
    }
  
    function resumeMountClassInstance(workInProgress, ctor, newProps, renderLanes) {
      var instance = workInProgress.stateNode;
      var oldProps = workInProgress.memoizedProps;
      instance.props = oldProps;
      var oldContext = instance.context;
      var contextType = ctor.contextType;
      var nextContext = emptyContextObject;
  
      if (typeof contextType === "object" && contextType !== null) {
        nextContext = readContext(contextType);
      } else {
        var nextLegacyUnmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
        nextContext = getMaskedContext(workInProgress, nextLegacyUnmaskedContext);
      }
  
      var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
      var hasNewLifecycles =
        typeof getDerivedStateFromProps === "function" || typeof instance.getSnapshotBeforeUpdate === "function";
  
      if (
        !hasNewLifecycles &&
        (typeof instance.UNSAFE_componentWillReceiveProps === "function" ||
          typeof instance.componentWillReceiveProps === "function")
      ) {
        if (oldProps !== newProps || oldContext !== nextContext) {
          callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext);
        }
      }
  
      resetHasForceUpdateBeforeProcessing();
      var oldState = workInProgress.memoizedState;
      var newState = (instance.state = oldState);
      processUpdateQueue(workInProgress, newProps, instance, renderLanes);
      newState = workInProgress.memoizedState;
  
      if (
        oldProps === newProps &&
        oldState === newState &&
        !hasContextChanged() &&
        !checkHasForceUpdateAfterProcessing()
      ) {
        if (typeof instance.componentDidMount === "function") {
          workInProgress.flags |= Update;
        }
  
        return false;
      }
  
      if (typeof getDerivedStateFromProps === "function") {
        applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, newProps);
        newState = workInProgress.memoizedState;
      }
  
      var shouldUpdate =
        checkHasForceUpdateAfterProcessing() ||
        checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext);
  
      if (shouldUpdate) {
        if (
          !hasNewLifecycles &&
          (typeof instance.UNSAFE_componentWillMount === "function" || typeof instance.componentWillMount === "function")
        ) {
          if (typeof instance.componentWillMount === "function") {
            instance.componentWillMount();
          }
  
          if (typeof instance.UNSAFE_componentWillMount === "function") {
            instance.UNSAFE_componentWillMount();
          }
        }
  
        if (typeof instance.componentDidMount === "function") {
          workInProgress.flags |= Update;
        }
      } else {
        if (typeof instance.componentDidMount === "function") {
          workInProgress.flags |= Update;
        }
  
        workInProgress.memoizedProps = newProps;
        workInProgress.memoizedState = newState;
      }
  
      instance.props = newProps;
      instance.state = newState;
      instance.context = nextContext;
      return shouldUpdate;
    }
  
    function updateClassInstance(current, workInProgress, ctor, newProps, renderLanes) {
      var instance = workInProgress.stateNode;
      cloneUpdateQueue(current, workInProgress);
      var unresolvedOldProps = workInProgress.memoizedProps;
      var oldProps =
        workInProgress.type === workInProgress.elementType
          ? unresolvedOldProps
          : resolveDefaultProps(workInProgress.type, unresolvedOldProps);
      instance.props = oldProps;
      var unresolvedNewProps = workInProgress.pendingProps;
      var oldContext = instance.context;
      var contextType = ctor.contextType;
      var nextContext = emptyContextObject;
  
      if (typeof contextType === "object" && contextType !== null) {
        nextContext = readContext(contextType);
      } else {
        var nextUnmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
        nextContext = getMaskedContext(workInProgress, nextUnmaskedContext);
      }
  
      var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
      var hasNewLifecycles =
        typeof getDerivedStateFromProps === "function" || typeof instance.getSnapshotBeforeUpdate === "function";
  
      if (
        !hasNewLifecycles &&
        (typeof instance.UNSAFE_componentWillReceiveProps === "function" ||
          typeof instance.componentWillReceiveProps === "function")
      ) {
        if (unresolvedOldProps !== unresolvedNewProps || oldContext !== nextContext) {
          callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext);
        }
      }
  
      resetHasForceUpdateBeforeProcessing();
      var oldState = workInProgress.memoizedState;
      var newState = (instance.state = oldState);
      processUpdateQueue(workInProgress, newProps, instance, renderLanes);
      newState = workInProgress.memoizedState;
  
      if (
        unresolvedOldProps === unresolvedNewProps &&
        oldState === newState &&
        !hasContextChanged() &&
        !checkHasForceUpdateAfterProcessing()
      ) {
        if (typeof instance.componentDidUpdate === "function") {
          if (unresolvedOldProps !== current.memoizedProps || oldState !== current.memoizedState) {
            workInProgress.flags |= Update;
          }
        }
  
        if (typeof instance.getSnapshotBeforeUpdate === "function") {
          if (unresolvedOldProps !== current.memoizedProps || oldState !== current.memoizedState) {
            workInProgress.flags |= Snapshot;
          }
        }
  
        return false;
      }
  
      if (typeof getDerivedStateFromProps === "function") {
        applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, newProps);
        newState = workInProgress.memoizedState;
      }
  
      var shouldUpdate =
        checkHasForceUpdateAfterProcessing() ||
        checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext);
  
      if (shouldUpdate) {
        if (
          !hasNewLifecycles &&
          (typeof instance.UNSAFE_componentWillUpdate === "function" ||
            typeof instance.componentWillUpdate === "function")
        ) {
          if (typeof instance.componentWillUpdate === "function") {
            instance.componentWillUpdate(newProps, newState, nextContext);
          }
  
          if (typeof instance.UNSAFE_componentWillUpdate === "function") {
            instance.UNSAFE_componentWillUpdate(newProps, newState, nextContext);
          }
        }
  
        if (typeof instance.componentDidUpdate === "function") {
          workInProgress.flags |= Update;
        }
  
        if (typeof instance.getSnapshotBeforeUpdate === "function") {
          workInProgress.flags |= Snapshot;
        }
      } else {
        if (typeof instance.componentDidUpdate === "function") {
          if (unresolvedOldProps !== current.memoizedProps || oldState !== current.memoizedState) {
            workInProgress.flags |= Update;
          }
        }
  
        if (typeof instance.getSnapshotBeforeUpdate === "function") {
          if (unresolvedOldProps !== current.memoizedProps || oldState !== current.memoizedState) {
            workInProgress.flags |= Snapshot;
          }
        }
  
        workInProgress.memoizedProps = newProps;
        workInProgress.memoizedState = newState;
      }
  
      instance.props = newProps;
      instance.state = newState;
      instance.context = nextContext;
      return shouldUpdate;
    }
  
    var isArray = Array.isArray;
  
    function coerceRef(returnFiber, current, element) {
      var mixedRef = element.ref;
  
      if (mixedRef !== null && typeof mixedRef !== "function" && typeof mixedRef !== "object") {
        if (element._owner) {
          var owner = element._owner;
          var inst;
  
          if (owner) {
            var ownerFiber = owner;
  
            if (!(ownerFiber.tag === ClassComponent)) {
              {
                throw Error(formatProdErrorMessage(309));
              }
            }
  
            inst = ownerFiber.stateNode;
          }
  
          if (!inst) {
            {
              throw Error(formatProdErrorMessage(147, mixedRef));
            }
          }
  
          var stringRef = "" + mixedRef;
  
          if (
            current !== null &&
            current.ref !== null &&
            typeof current.ref === "function" &&
            current.ref._stringRef === stringRef
          ) {
            return current.ref;
          }
  
          var ref = function (value) {
            var refs = inst.refs;
  
            if (refs === emptyRefsObject) {
              refs = inst.refs = {};
            }
  
            if (value === null) {
              delete refs[stringRef];
            } else {
              refs[stringRef] = value;
            }
          };
  
          ref._stringRef = stringRef;
          return ref;
        } else {
          if (!(typeof mixedRef === "string")) {
            {
              throw Error(formatProdErrorMessage(284));
            }
          }
  
          if (!element._owner) {
            {
              throw Error(formatProdErrorMessage(290, mixedRef));
            }
          }
        }
      }
  
      return mixedRef;
    }
  
    function throwOnInvalidObjectType(returnFiber, newChild) {
      if (returnFiber.type !== "textarea") {
        {
          {
            throw Error(
              formatProdErrorMessage(
                31,
                Object.prototype.toString.call(newChild) === "[object Object]"
                  ? "object with keys {" + Object.keys(newChild).join(", ") + "}"
                  : newChild
              )
            );
          }
        }
      }
    }
  
    function ChildReconciler(shouldTrackSideEffects) {
      function deleteChild(returnFiber, childToDelete) {
        if (!shouldTrackSideEffects) {
          return;
        }
  
        var last = returnFiber.lastEffect;
  
        if (last !== null) {
          last.nextEffect = childToDelete;
          returnFiber.lastEffect = childToDelete;
        } else {
          returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
        }
  
        childToDelete.nextEffect = null;
        // 添加Deletion副作用
        childToDelete.flags = Deletion;
      }
  
      function deleteRemainingChildren(returnFiber, currentFirstChild) {
        if (!shouldTrackSideEffects) {
          return null;
        }
  
        var childToDelete = currentFirstChild;
  
        while (childToDelete !== null) {
          deleteChild(returnFiber, childToDelete);
          childToDelete = childToDelete.sibling;
        }
  
        return null;
      }
  
      function mapRemainingChildren(returnFiber, currentFirstChild) {
        var existingChildren = new Map();
        var existingChild = currentFirstChild;
  
        while (existingChild !== null) {
          if (existingChild.key !== null) {
            existingChildren.set(existingChild.key, existingChild);
          } else {
            existingChildren.set(existingChild.index, existingChild);
          }
  
          existingChild = existingChild.sibling;
        }
  
        return existingChildren;
      }
  
      function useFiber(fiber, pendingProps) {
        var clone = createWorkInProgress(fiber, pendingProps);
        clone.index = 0;
        clone.sibling = null;
        return clone;
      }
  
      function placeChild(newFiber, lastPlacedIndex, newIndex) {
        newFiber.index = newIndex;
  
        if (!shouldTrackSideEffects) {
          return lastPlacedIndex;
        }
  
        var current = newFiber.alternate;
  
        if (current !== null) {
          var oldIndex = current.index;
  
          if (oldIndex < lastPlacedIndex) {
            newFiber.flags = Placement;
            return lastPlacedIndex;
          } else {
            return oldIndex;
          }
        } else {
          newFiber.flags = Placement;
          return lastPlacedIndex;
        }
      }
  
      function placeSingleChild(newFiber) {
        if (shouldTrackSideEffects && newFiber.alternate === null) {
          newFiber.flags = Placement;
        }
  
        return newFiber;
      }
  
      function updateTextNode(returnFiber, current, textContent, lanes) {
        if (current === null || current.tag !== HostText) {
          var created = createFiberFromText(textContent, returnFiber.mode, lanes);
          created.return = returnFiber;
          return created;
        } else {
          var existing = useFiber(current, textContent);
          existing.return = returnFiber;
          return existing;
        }
      }
  
      function updateElement(returnFiber, current, element, lanes) {
        if (current !== null) {
          if (current.elementType === element.type || false) {
            var existing = useFiber(current, element.props);
            existing.ref = coerceRef(returnFiber, current, element);
            existing.return = returnFiber;
  
            return existing;
          }
        }
  
        var created = createFiberFromElement(element, returnFiber.mode, lanes);
        created.ref = coerceRef(returnFiber, current, element);
        created.return = returnFiber;
        return created;
      }
  
      function updatePortal(returnFiber, current, portal, lanes) {
        if (
          current === null ||
          current.tag !== HostPortal ||
          current.stateNode.containerInfo !== portal.containerInfo ||
          current.stateNode.implementation !== portal.implementation
        ) {
          var created = createFiberFromPortal(portal, returnFiber.mode, lanes);
          created.return = returnFiber;
          return created;
        } else {
          var existing = useFiber(current, portal.children || []);
          existing.return = returnFiber;
          return existing;
        }
      }
  
      function updateFragment(returnFiber, current, fragment, lanes, key) {
        if (current === null || current.tag !== Fragment) {
          var created = createFiberFromFragment(fragment, returnFiber.mode, lanes, key);
          created.return = returnFiber;
          return created;
        } else {
          var existing = useFiber(current, fragment);
          existing.return = returnFiber;
          return existing;
        }
      }
  
      function createChild(returnFiber, newChild, lanes) {
        if (typeof newChild === "string" || typeof newChild === "number") {
          var created = createFiberFromText("" + newChild, returnFiber.mode, lanes);
          created.return = returnFiber;
          return created;
        }
  
        if (typeof newChild === "object" && newChild !== null) {
          switch (newChild.$$typeof) {
            case REACT_ELEMENT_TYPE: {
              var _created = createFiberFromElement(newChild, returnFiber.mode, lanes);
  
              _created.ref = coerceRef(returnFiber, null, newChild);
              _created.return = returnFiber;
              return _created;
            }
  
            case REACT_PORTAL_TYPE: {
              var _created2 = createFiberFromPortal(newChild, returnFiber.mode, lanes);
  
              _created2.return = returnFiber;
              return _created2;
            }
          }
  
          if (isArray(newChild) || getIteratorFn(newChild)) {
            var _created3 = createFiberFromFragment(newChild, returnFiber.mode, lanes, null);
  
            _created3.return = returnFiber;
            return _created3;
          }
  
          throwOnInvalidObjectType(returnFiber, newChild);
        }
  
        return null;
      }
  
      function updateSlot(returnFiber, oldFiber, newChild, lanes) {
        var key = oldFiber !== null ? oldFiber.key : null;
  
        if (typeof newChild === "string" || typeof newChild === "number") {
          if (key !== null) {
            return null;
          }
  
          return updateTextNode(returnFiber, oldFiber, "" + newChild, lanes);
        }
  
        if (typeof newChild === "object" && newChild !== null) {
          switch (newChild.$$typeof) {
            case REACT_ELEMENT_TYPE: {
              if (newChild.key === key) {
                if (newChild.type === REACT_FRAGMENT_TYPE) {
                  return updateFragment(returnFiber, oldFiber, newChild.props.children, lanes, key);
                }
  
                return updateElement(returnFiber, oldFiber, newChild, lanes);
              } else {
                return null;
              }
            }
  
            case REACT_PORTAL_TYPE: {
              if (newChild.key === key) {
                return updatePortal(returnFiber, oldFiber, newChild, lanes);
              } else {
                return null;
              }
            }
          }
  
          if (isArray(newChild) || getIteratorFn(newChild)) {
            if (key !== null) {
              return null;
            }
  
            return updateFragment(returnFiber, oldFiber, newChild, lanes, null);
          }
  
          throwOnInvalidObjectType(returnFiber, newChild);
        }
  
        return null;
      }
  
      function updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes) {
        if (typeof newChild === "string" || typeof newChild === "number") {
          var matchedFiber = existingChildren.get(newIdx) || null;
          return updateTextNode(returnFiber, matchedFiber, "" + newChild, lanes);
        }
  
        if (typeof newChild === "object" && newChild !== null) {
          switch (newChild.$$typeof) {
            case REACT_ELEMENT_TYPE: {
              var _matchedFiber = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
  
              if (newChild.type === REACT_FRAGMENT_TYPE) {
                return updateFragment(returnFiber, _matchedFiber, newChild.props.children, lanes, newChild.key);
              }
  
              return updateElement(returnFiber, _matchedFiber, newChild, lanes);
            }
  
            case REACT_PORTAL_TYPE: {
              var _matchedFiber2 = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
  
              return updatePortal(returnFiber, _matchedFiber2, newChild, lanes);
            }
          }
  
          if (isArray(newChild) || getIteratorFn(newChild)) {
            var _matchedFiber3 = existingChildren.get(newIdx) || null;
  
            return updateFragment(returnFiber, _matchedFiber3, newChild, lanes, null);
          }
  
          throwOnInvalidObjectType(returnFiber, newChild);
        }
  
        return null;
      }
  
      function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
        var resultingFirstChild = null;
        var previousNewFiber = null;
        var oldFiber = currentFirstChild;
        var lastPlacedIndex = 0;
        var newIdx = 0;
        var nextOldFiber = null;
  
        for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
          if (oldFiber.index > newIdx) {
            nextOldFiber = oldFiber;
            oldFiber = null;
          } else {
            nextOldFiber = oldFiber.sibling;
          }
  
          var newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], lanes);
  
          if (newFiber === null) {
            if (oldFiber === null) {
              oldFiber = nextOldFiber;
            }
  
            break;
          }
  
          if (shouldTrackSideEffects) {
            if (oldFiber && newFiber.alternate === null) {
              deleteChild(returnFiber, oldFiber);
            }
          }
  
          lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
  
          if (previousNewFiber === null) {
            resultingFirstChild = newFiber;
          } else {
            previousNewFiber.sibling = newFiber;
          }
  
          previousNewFiber = newFiber;
          oldFiber = nextOldFiber;
        }
  
        if (newIdx === newChildren.length) {
          deleteRemainingChildren(returnFiber, oldFiber);
          return resultingFirstChild;
        }
  
        if (oldFiber === null) {
          for (; newIdx < newChildren.length; newIdx++) {
            var _newFiber = createChild(returnFiber, newChildren[newIdx], lanes);
  
            if (_newFiber === null) {
              continue;
            }
  
            lastPlacedIndex = placeChild(_newFiber, lastPlacedIndex, newIdx);
  
            if (previousNewFiber === null) {
              resultingFirstChild = _newFiber;
            } else {
              previousNewFiber.sibling = _newFiber;
            }
  
            previousNewFiber = _newFiber;
          }
  
          return resultingFirstChild;
        }
  
        var existingChildren = mapRemainingChildren(returnFiber, oldFiber);
  
        for (; newIdx < newChildren.length; newIdx++) {
          var _newFiber2 = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx], lanes);
  
          if (_newFiber2 !== null) {
            if (shouldTrackSideEffects) {
              if (_newFiber2.alternate !== null) {
                existingChildren.delete(_newFiber2.key === null ? newIdx : _newFiber2.key);
              }
            }
  
            lastPlacedIndex = placeChild(_newFiber2, lastPlacedIndex, newIdx);
  
            if (previousNewFiber === null) {
              resultingFirstChild = _newFiber2;
            } else {
              previousNewFiber.sibling = _newFiber2;
            }
  
            previousNewFiber = _newFiber2;
          }
        }
  
        if (shouldTrackSideEffects) {
          existingChildren.forEach(function (child) {
            return deleteChild(returnFiber, child);
          });
        }
  
        return resultingFirstChild;
      }
  
      function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildrenIterable, lanes) {
        var iteratorFn = getIteratorFn(newChildrenIterable);
  
        if (!(typeof iteratorFn === "function")) {
          {
            throw Error(formatProdErrorMessage(150));
          }
        }
  
        var newChildren = iteratorFn.call(newChildrenIterable);
  
        if (!(newChildren != null)) {
          {
            throw Error(formatProdErrorMessage(151));
          }
        }
  
        var resultingFirstChild = null;
        var previousNewFiber = null;
        var oldFiber = currentFirstChild;
        var lastPlacedIndex = 0;
        var newIdx = 0;
        var nextOldFiber = null;
        var step = newChildren.next();
  
        for (; oldFiber !== null && !step.done; newIdx++, step = newChildren.next()) {
          if (oldFiber.index > newIdx) {
            nextOldFiber = oldFiber;
            oldFiber = null;
          } else {
            nextOldFiber = oldFiber.sibling;
          }
  
          var newFiber = updateSlot(returnFiber, oldFiber, step.value, lanes);
  
          if (newFiber === null) {
            if (oldFiber === null) {
              oldFiber = nextOldFiber;
            }
  
            break;
          }
  
          if (shouldTrackSideEffects) {
            if (oldFiber && newFiber.alternate === null) {
              deleteChild(returnFiber, oldFiber);
            }
          }
  
          lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
  
          if (previousNewFiber === null) {
            resultingFirstChild = newFiber;
          } else {
            previousNewFiber.sibling = newFiber;
          }
  
          previousNewFiber = newFiber;
          oldFiber = nextOldFiber;
        }
  
        if (step.done) {
          deleteRemainingChildren(returnFiber, oldFiber);
          return resultingFirstChild;
        }
  
        if (oldFiber === null) {
          for (; !step.done; newIdx++, step = newChildren.next()) {
            var _newFiber3 = createChild(returnFiber, step.value, lanes);
  
            if (_newFiber3 === null) {
              continue;
            }
  
            lastPlacedIndex = placeChild(_newFiber3, lastPlacedIndex, newIdx);
  
            if (previousNewFiber === null) {
              resultingFirstChild = _newFiber3;
            } else {
              previousNewFiber.sibling = _newFiber3;
            }
  
            previousNewFiber = _newFiber3;
          }
  
          return resultingFirstChild;
        }
  
        var existingChildren = mapRemainingChildren(returnFiber, oldFiber);
  
        for (; !step.done; newIdx++, step = newChildren.next()) {
          var _newFiber4 = updateFromMap(existingChildren, returnFiber, newIdx, step.value, lanes);
  
          if (_newFiber4 !== null) {
            if (shouldTrackSideEffects) {
              if (_newFiber4.alternate !== null) {
                existingChildren.delete(_newFiber4.key === null ? newIdx : _newFiber4.key);
              }
            }
  
            lastPlacedIndex = placeChild(_newFiber4, lastPlacedIndex, newIdx);
  
            if (previousNewFiber === null) {
              resultingFirstChild = _newFiber4;
            } else {
              previousNewFiber.sibling = _newFiber4;
            }
  
            previousNewFiber = _newFiber4;
          }
        }
  
        if (shouldTrackSideEffects) {
          existingChildren.forEach(function (child) {
            return deleteChild(returnFiber, child);
          });
        }
  
        return resultingFirstChild;
      }
  
      function reconcileSingleTextNode(returnFiber, currentFirstChild, textContent, lanes) {
        if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
          deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
          var existing = useFiber(currentFirstChild, textContent);
          existing.return = returnFiber;
          return existing;
        }
  
        deleteRemainingChildren(returnFiber, currentFirstChild);
        var created = createFiberFromText(textContent, returnFiber.mode, lanes);
        created.return = returnFiber;
        return created;
      }
  
      function reconcileSingleElement(returnFiber, currentFirstChild, element, lanes) {
        var key = element.key;
        var child = currentFirstChild;
  
        while (child !== null) {
          if (child.key === key) {
            switch (child.tag) {
              case Fragment: {
                if (element.type === REACT_FRAGMENT_TYPE) {
                  deleteRemainingChildren(returnFiber, child.sibling);
                  var existing = useFiber(child, element.props.children);
                  existing.return = returnFiber;
  
                  return existing;
                }
  
                break;
              }
  
              case Block:
  
              default: {
                if (child.elementType === element.type || false) {
                  deleteRemainingChildren(returnFiber, child.sibling);
  
                  var _existing3 = useFiber(child, element.props);
  
                  _existing3.ref = coerceRef(returnFiber, child, element);
                  _existing3.return = returnFiber;
  
                  return _existing3;
                }
  
                break;
              }
            }
  
            deleteRemainingChildren(returnFiber, child);
            break;
          } else {
            deleteChild(returnFiber, child);
          }
  
          child = child.sibling;
        }
  
        if (element.type === REACT_FRAGMENT_TYPE) {
          var created = createFiberFromFragment(element.props.children, returnFiber.mode, lanes, element.key);
          created.return = returnFiber;
          return created;
        } else {
          var _created4 = createFiberFromElement(element, returnFiber.mode, lanes);
  
          _created4.ref = coerceRef(returnFiber, currentFirstChild, element);
          _created4.return = returnFiber;
          return _created4;
        }
      }
  
      function reconcileSinglePortal(returnFiber, currentFirstChild, portal, lanes) {
        var key = portal.key;
        var child = currentFirstChild;
  
        while (child !== null) {
          if (child.key === key) {
            if (
              child.tag === HostPortal &&
              child.stateNode.containerInfo === portal.containerInfo &&
              child.stateNode.implementation === portal.implementation
            ) {
              deleteRemainingChildren(returnFiber, child.sibling);
              var existing = useFiber(child, portal.children || []);
              existing.return = returnFiber;
              return existing;
            } else {
              deleteRemainingChildren(returnFiber, child);
              break;
            }
          } else {
            deleteChild(returnFiber, child);
          }
  
          child = child.sibling;
        }
  
        var created = createFiberFromPortal(portal, returnFiber.mode, lanes);
        created.return = returnFiber;
        return created;
      }
  
      function reconcileChildFibers(returnFiber, currentFirstChild, newChild, lanes) {
        var isUnkeyedTopLevelFragment =
          typeof newChild === "object" &&
          newChild !== null &&
          newChild.type === REACT_FRAGMENT_TYPE &&
          newChild.key === null;
  
        if (isUnkeyedTopLevelFragment) {
          newChild = newChild.props.children;
        }
  
        var isObject = typeof newChild === "object" && newChild !== null;
  
        if (isObject) {
          switch (newChild.$$typeof) {
            case REACT_ELEMENT_TYPE:
              return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild, lanes));
  
            case REACT_PORTAL_TYPE:
              return placeSingleChild(reconcileSinglePortal(returnFiber, currentFirstChild, newChild, lanes));
          }
        }
  
        if (typeof newChild === "string" || typeof newChild === "number") {
          return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFirstChild, "" + newChild, lanes));
        }
  
        if (isArray(newChild)) {
          return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, lanes);
        }
  
        if (getIteratorFn(newChild)) {
          return reconcileChildrenIterator(returnFiber, currentFirstChild, newChild, lanes);
        }
  
        if (isObject) {
          throwOnInvalidObjectType(returnFiber, newChild);
        }
  
        if (typeof newChild === "undefined" && !isUnkeyedTopLevelFragment) {
          switch (returnFiber.tag) {
            case ClassComponent:
  
            case Block:
            case FunctionComponent:
            case ForwardRef:
            case SimpleMemoComponent:
              throw Error(formatProdErrorMessage(152, getComponentName(returnFiber.type) || "Component"));
          }
        }
  
        // 删除之前的fiber
        return deleteRemainingChildren(returnFiber, currentFirstChild);
      }
  
      return reconcileChildFibers;
    }
  
    var reconcileChildFibers = ChildReconciler(true);
    var mountChildFibers = ChildReconciler(false);
    function cloneChildFibers(current, workInProgress) {
      if (!(current === null || workInProgress.child === current.child)) {
        {
          throw Error(formatProdErrorMessage(153));
        }
      }
  
      if (workInProgress.child === null) {
        return;
      }
  
      var currentChild = workInProgress.child;
      var newChild = createWorkInProgress(currentChild, currentChild.pendingProps);
      workInProgress.child = newChild;
      newChild.return = workInProgress;
  
      while (currentChild.sibling !== null) {
        currentChild = currentChild.sibling;
        newChild = newChild.sibling = createWorkInProgress(currentChild, currentChild.pendingProps);
        newChild.return = workInProgress;
      }
  
      newChild.sibling = null;
    }
  
    function resetChildFibers(workInProgress, lanes) {
      var child = workInProgress.child;
  
      while (child !== null) {
        resetWorkInProgress(child, lanes);
        child = child.sibling;
      }
    }
  
    var NO_CONTEXT = {};
    var contextStackCursor$1 = createCursor(NO_CONTEXT);
    var contextFiberStackCursor = createCursor(NO_CONTEXT);
    var rootInstanceStackCursor = createCursor(NO_CONTEXT);
  
    function requiredContext(c) {
      if (!(c !== NO_CONTEXT)) {
        {
          throw Error(formatProdErrorMessage(174));
        }
      }
  
      return c;
    }
  
    function getRootHostContainer() {
      var rootInstance = requiredContext(rootInstanceStackCursor.current);
      return rootInstance;
    }
  
    function pushHostContainer(fiber, nextRootInstance) {
      push(rootInstanceStackCursor, nextRootInstance);
  
      push(contextFiberStackCursor, fiber);
  
      push(contextStackCursor$1, NO_CONTEXT);
      var nextRootContext = getRootHostContext(nextRootInstance);
  
      pop(contextStackCursor$1);
      push(contextStackCursor$1, nextRootContext);
    }
  
    function popHostContainer() {
      pop(contextStackCursor$1);
      pop(contextFiberStackCursor);
      pop(rootInstanceStackCursor);
    }
  
    function getHostContext() {
      var context = requiredContext(contextStackCursor$1.current);
      return context;
    }
  
    function pushHostContext(fiber) {
      var context = requiredContext(contextStackCursor$1.current);
      var nextContext = getChildHostContext(context, fiber.type);
  
      if (context === nextContext) {
        return;
      }
  
      push(contextFiberStackCursor, fiber);
      push(contextStackCursor$1, nextContext);
    }
  
    function popHostContext(fiber) {
      if (contextFiberStackCursor.current !== fiber) {
        return;
      }
  
      pop(contextStackCursor$1);
      pop(contextFiberStackCursor);
    }
  
    var DefaultSuspenseContext = 0;
  
    var SubtreeSuspenseContextMask = 1;
  
    var InvisibleParentSuspenseContext = 1;
  
    var ForceSuspenseFallback = 2;
    var suspenseStackCursor = createCursor(DefaultSuspenseContext);
    function hasSuspenseContext(parentContext, flag) {
      return (parentContext & flag) !== 0;
    }
    function setDefaultShallowSuspenseContext(parentContext) {
      return parentContext & SubtreeSuspenseContextMask;
    }
    function setShallowSuspenseContext(parentContext, shallowContext) {
      return (parentContext & SubtreeSuspenseContextMask) | shallowContext;
    }
    function addSubtreeSuspenseContext(parentContext, subtreeContext) {
      return parentContext | subtreeContext;
    }
    function pushSuspenseContext(fiber, newContext) {
      push(suspenseStackCursor, newContext);
    }
    function popSuspenseContext() {
      pop(suspenseStackCursor);
    }
  
    function shouldCaptureSuspense(workInProgress, hasInvisibleParent) {
      var nextState = workInProgress.memoizedState;
  
      if (nextState !== null) {
        if (nextState.dehydrated !== null) {
          return true;
        }
  
        return false;
      }
  
      var props = workInProgress.memoizedProps;
  
      if (props.fallback === undefined) {
        return false;
      }
  
      if (props.unstable_avoidThisFallback !== true) {
        return true;
      }
  
      if (hasInvisibleParent) {
        return false;
      }
  
      return true;
    }
    function findFirstSuspended(row) {
      var node = row;
  
      while (node !== null) {
        if (node.tag === SuspenseComponent) {
          var state = node.memoizedState;
  
          if (state !== null) {
            var dehydrated = state.dehydrated;
  
            if (dehydrated === null || isSuspenseInstancePending(dehydrated) || isSuspenseInstanceFallback(dehydrated)) {
              return node;
            }
          }
        } else if (node.tag === SuspenseListComponent && node.memoizedProps.revealOrder !== undefined) {
          var didSuspend = (node.flags & DidCapture) !== NoFlags;
  
          if (didSuspend) {
            return node;
          }
        } else if (node.child !== null) {
          node.child.return = node;
          node = node.child;
          continue;
        }
  
        if (node === row) {
          return null;
        }
  
        while (node.sibling === null) {
          if (node.return === null || node.return === row) {
            return null;
          }
  
          node = node.return;
        }
  
        node.sibling.return = node.return;
        node = node.sibling;
      }
  
      return null;
    }
  
    var NoFlags$1 = 0;
  
    var HasEffect = 1;
  
    var Layout = 2;
    var Passive$1 = 4;
  
    var hydrationParentFiber = null;
    var nextHydratableInstance = null;
    var isHydrating = false;
  
    function enterHydrationState(fiber) {
      var parentInstance = fiber.stateNode.containerInfo;
      nextHydratableInstance = getFirstHydratableChild(parentInstance);
      hydrationParentFiber = fiber;
      isHydrating = true;
      return true;
    }
  
    function deleteHydratableInstance(returnFiber, instance) {
      var childToDelete = createFiberFromHostInstanceForDeletion();
      childToDelete.stateNode = instance;
      childToDelete.return = returnFiber;
      childToDelete.flags = Deletion;
  
      if (returnFiber.lastEffect !== null) {
        returnFiber.lastEffect.nextEffect = childToDelete;
        returnFiber.lastEffect = childToDelete;
      } else {
        returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
      }
    }
  
    function insertNonHydratedInstance(returnFiber, fiber) {
      fiber.flags = (fiber.flags & ~Hydrating) | Placement;
    }
  
    function tryHydrate(fiber, nextInstance) {
      switch (fiber.tag) {
        case HostComponent: {
          var type = fiber.type;
          var instance = canHydrateInstance(nextInstance, type);
  
          if (instance !== null) {
            fiber.stateNode = instance;
            return true;
          }
  
          return false;
        }
  
        case HostText: {
          var text = fiber.pendingProps;
          var textInstance = canHydrateTextInstance(nextInstance, text);
  
          if (textInstance !== null) {
            fiber.stateNode = textInstance;
            return true;
          }
  
          return false;
        }
  
        case SuspenseComponent: {
          return false;
        }
  
        default:
          return false;
      }
    }
  
    function tryToClaimNextHydratableInstance(fiber) {
      if (!isHydrating) {
        return;
      }
  
      var nextInstance = nextHydratableInstance;
  
      if (!nextInstance) {
        insertNonHydratedInstance(hydrationParentFiber, fiber);
        isHydrating = false;
        hydrationParentFiber = fiber;
        return;
      }
  
      var firstAttemptedInstance = nextInstance;
  
      if (!tryHydrate(fiber, nextInstance)) {
        nextInstance = getNextHydratableSibling(firstAttemptedInstance);
  
        if (!nextInstance || !tryHydrate(fiber, nextInstance)) {
          insertNonHydratedInstance(hydrationParentFiber, fiber);
          isHydrating = false;
          hydrationParentFiber = fiber;
          return;
        }
  
        deleteHydratableInstance(hydrationParentFiber, firstAttemptedInstance);
      }
  
      hydrationParentFiber = fiber;
      nextHydratableInstance = getFirstHydratableChild(nextInstance);
    }
  
    function prepareToHydrateHostInstance(fiber, rootContainerInstance, hostContext) {
      var instance = fiber.stateNode;
      var updatePayload = hydrateInstance(
        instance,
        fiber.type,
        fiber.memoizedProps,
        rootContainerInstance,
        hostContext,
        fiber
      );
  
      fiber.updateQueue = updatePayload;
  
      if (updatePayload !== null) {
        return true;
      }
  
      return false;
    }
  
    function prepareToHydrateHostTextInstance(fiber) {
      var textInstance = fiber.stateNode;
      var textContent = fiber.memoizedProps;
      var shouldUpdate = hydrateTextInstance(textInstance, textContent, fiber);
  
      return shouldUpdate;
    }
  
    function skipPastDehydratedSuspenseInstance(fiber) {
      var suspenseState = fiber.memoizedState;
      var suspenseInstance = suspenseState !== null ? suspenseState.dehydrated : null;
  
      if (!suspenseInstance) {
        {
          throw Error(formatProdErrorMessage(317));
        }
      }
  
      return getNextHydratableInstanceAfterSuspenseInstance(suspenseInstance);
    }
  
    function popToNextHostParent(fiber) {
      var parent = fiber.return;
  
      while (
        parent !== null &&
        parent.tag !== HostComponent &&
        parent.tag !== HostRoot &&
        parent.tag !== SuspenseComponent
      ) {
        parent = parent.return;
      }
  
      hydrationParentFiber = parent;
    }
  
    function popHydrationState(fiber) {
      if (fiber !== hydrationParentFiber) {
        return false;
      }
  
      if (!isHydrating) {
        popToNextHostParent(fiber);
        isHydrating = true;
        return false;
      }
  
      var type = fiber.type;
  
      if (
        fiber.tag !== HostComponent ||
        (type !== "head" && type !== "body" && !shouldSetTextContent(type, fiber.memoizedProps))
      ) {
        var nextInstance = nextHydratableInstance;
  
        while (nextInstance) {
          deleteHydratableInstance(fiber, nextInstance);
          nextInstance = getNextHydratableSibling(nextInstance);
        }
      }
  
      popToNextHostParent(fiber);
  
      if (fiber.tag === SuspenseComponent) {
        nextHydratableInstance = skipPastDehydratedSuspenseInstance(fiber);
      } else {
        nextHydratableInstance = hydrationParentFiber ? getNextHydratableSibling(fiber.stateNode) : null;
      }
  
      return true;
    }
  
    function resetHydrationState() {
      hydrationParentFiber = null;
      nextHydratableInstance = null;
      isHydrating = false;
    }
  
    function getIsHydrating() {
      return isHydrating;
    }
  
    var workInProgressSources = [];
  
    function markSourceAsDirty(mutableSource) {
      workInProgressSources.push(mutableSource);
    }
    function resetWorkInProgressVersions() {
      for (var i = 0; i < workInProgressSources.length; i++) {
        var mutableSource = workInProgressSources[i];
  
        {
          mutableSource._workInProgressVersionPrimary = null;
        }
      }
  
      workInProgressSources.length = 0;
    }
    function getWorkInProgressVersion(mutableSource) {
      {
        return mutableSource._workInProgressVersionPrimary;
      }
    }
    function setWorkInProgressVersion(mutableSource, version) {
      {
        mutableSource._workInProgressVersionPrimary = version;
      }
  
      workInProgressSources.push(mutableSource);
    }
  
    var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher,
      ReactCurrentBatchConfig$1 = ReactSharedInternals.ReactCurrentBatchConfig;
  
    /** 每一次render之前, 需要确定本次render的优先级 */
    var renderLanes = NoLanes;
    /** 当前正在渲染的组件fiber */
    var currentlyRenderingFiber$1 = null;
  
    var currentHook = null;
    var workInProgressHook = null;
  
    var didScheduleRenderPhaseUpdate = false;
  
    var didScheduleRenderPhaseUpdateDuringThisPass = false;
    var RE_RENDER_LIMIT = 25;
  
    function throwInvalidHookError() {
      {
        {
          throw Error(formatProdErrorMessage(321));
        }
      }
    }
  
    function areHookInputsEqual(nextDeps, prevDeps) {
      if (prevDeps === null) {
        return false;
      }
  
      for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
        if (objectIs(nextDeps[i], prevDeps[i])) {
          continue;
        }
  
        return false;
      }
  
      return true;
    }
  
    function renderWithHooks(current, workInProgress, Component, props, secondArg, nextRenderLanes) {
      logStacks();
      console.log("[render with hooks]");
      renderLanes = nextRenderLanes;
      // 全局标记当前render的fiber节点,用于hook的dispatch绑定关联的fiber对象(通过.bind的参数进行关联)
      currentlyRenderingFiber$1 = workInProgress;
  
      workInProgress.memoizedState = null;
      workInProgress.updateQueue = null;
      workInProgress.lanes = NoLanes;
  
      ReactCurrentDispatcher$1.current =
        current === null || current.memoizedState === null ? HooksDispatcherOnMount : HooksDispatcherOnUpdate;
  
      var children = Component(props, secondArg);
  
      if (didScheduleRenderPhaseUpdateDuringThisPass) {
        var numberOfReRenders = 0;
  
        do {
          didScheduleRenderPhaseUpdateDuringThisPass = false;
  
          if (!(numberOfReRenders < RE_RENDER_LIMIT)) {
            throw Error(formatProdErrorMessage(301));
          }
  
          numberOfReRenders += 1;
  
          currentHook = null;
          workInProgressHook = null;
          workInProgress.updateQueue = null;
  
          ReactCurrentDispatcher$1.current = HooksDispatcherOnRerender;
          children = Component(props, secondArg);
        } while (didScheduleRenderPhaseUpdateDuringThisPass);
      }
  
      ReactCurrentDispatcher$1.current = ContextOnlyDispatcher;
  
      var didRenderTooFewHooks = currentHook !== null && currentHook.next !== null;
      renderLanes = NoLanes;
      currentlyRenderingFiber$1 = null;
      currentHook = null;
      workInProgressHook = null;
  
      didScheduleRenderPhaseUpdate = false;
  
      if (!!didRenderTooFewHooks) {
        throw Error(formatProdErrorMessage(300));
      }
  
      return children;
    }
    function bailoutHooks(current, workInProgress, lanes) {
      workInProgress.updateQueue = current.updateQueue;
      workInProgress.flags &= ~(Passive | Update);
      current.lanes = removeLanes(current.lanes, lanes);
    }
    function resetHooksAfterThrow() {
      ReactCurrentDispatcher$1.current = ContextOnlyDispatcher;
  
      if (didScheduleRenderPhaseUpdate) {
        var hook = currentlyRenderingFiber$1.memoizedState;
  
        while (hook !== null) {
          var queue = hook.queue;
  
          if (queue !== null) {
            queue.pending = null;
          }
  
          hook = hook.next;
        }
  
        didScheduleRenderPhaseUpdate = false;
      }
  
      renderLanes = NoLanes;
      currentlyRenderingFiber$1 = null;
      currentHook = null;
      workInProgressHook = null;
  
      didScheduleRenderPhaseUpdateDuringThisPass = false;
    }
  
    function mountWorkInProgressHook() {
      // 创建hook
      var hook = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null,
      };
  
      if (workInProgressHook === null) {
        currentlyRenderingFiber$1.memoizedState = workInProgressHook = hook;
      } else {
        workInProgressHook = workInProgressHook.next = hook;
      }
  
      return workInProgressHook;
    }
  
    function updateWorkInProgressHook() {
      var nextCurrentHook;
  
      if (currentHook === null) {
        var current = currentlyRenderingFiber$1.alternate;
  
        if (current !== null) {
          nextCurrentHook = current.memoizedState;
        } else {
          nextCurrentHook = null;
        }
      } else {
        nextCurrentHook = currentHook.next;
      }
  
      var nextWorkInProgressHook;
  
      if (workInProgressHook === null) {
        nextWorkInProgressHook = currentlyRenderingFiber$1.memoizedState;
      } else {
        nextWorkInProgressHook = workInProgressHook.next;
      }
  
      if (nextWorkInProgressHook !== null) {
        workInProgressHook = nextWorkInProgressHook;
        nextWorkInProgressHook = workInProgressHook.next;
        currentHook = nextCurrentHook;
      } else {
        if (!(nextCurrentHook !== null)) {
          {
            throw Error(formatProdErrorMessage(310));
          }
        }
  
        currentHook = nextCurrentHook;
        var newHook = {
          memoizedState: currentHook.memoizedState,
          baseState: currentHook.baseState,
          baseQueue: currentHook.baseQueue,
          queue: currentHook.queue,
          next: null,
        };
  
        if (workInProgressHook === null) {
          currentlyRenderingFiber$1.memoizedState = workInProgressHook = newHook;
        } else {
          workInProgressHook = workInProgressHook.next = newHook;
        }
      }
  
      return workInProgressHook;
    }
  
    function createFunctionComponentUpdateQueue() {
      return {
        lastEffect: null,
      };
    }
  
    function basicStateReducer(state, action) {
      return typeof action === "function" ? action(state) : action;
    }
  
    function mountReducer(reducer, initialArg, init) {
      var hook = mountWorkInProgressHook();
      var initialState;
  
      if (init !== undefined) {
        initialState = init(initialArg);
      } else {
        initialState = initialArg;
      }
  
      hook.memoizedState = hook.baseState = initialState;
      var queue = (hook.queue = {
        pending: null,
        dispatch: null,
        lastRenderedReducer: reducer,
        lastRenderedState: initialState,
      });
      var dispatch = (queue.dispatch = dispatchAction.bind(null, currentlyRenderingFiber$1, queue));
      return [hook.memoizedState, dispatch];
    }
  
    function updateReducer(reducer, initialArg, init) {
      var hook = updateWorkInProgressHook();
      var queue = hook.queue;
  
      if (!(queue !== null)) {
        {
          throw Error(formatProdErrorMessage(311));
        }
      }
  
      queue.lastRenderedReducer = reducer;
      var current = currentHook;
  
      var baseQueue = current.baseQueue;
  
      var pendingQueue = queue.pending;
  
      if (pendingQueue !== null) {
        if (baseQueue !== null) {
          var baseFirst = baseQueue.next;
          var pendingFirst = pendingQueue.next;
          baseQueue.next = pendingFirst;
          pendingQueue.next = baseFirst;
        }
  
        current.baseQueue = baseQueue = pendingQueue;
        queue.pending = null;
      }
  
      if (baseQueue !== null) {
        var first = baseQueue.next;
        var newState = current.baseState;
        var newBaseState = null;
        var newBaseQueueFirst = null;
        var newBaseQueueLast = null;
        var update = first;
  
        do {
          var updateLane = update.lane;
  
          if (!isSubsetOfLanes(renderLanes, updateLane)) {
            var clone = {
              lane: updateLane,
              action: update.action,
              eagerReducer: update.eagerReducer,
              eagerState: update.eagerState,
              next: null,
            };
  
            if (newBaseQueueLast === null) {
              newBaseQueueFirst = newBaseQueueLast = clone;
              newBaseState = newState;
            } else {
              newBaseQueueLast = newBaseQueueLast.next = clone;
            }
  
            currentlyRenderingFiber$1.lanes = mergeLanes(currentlyRenderingFiber$1.lanes, updateLane);
            markSkippedUpdateLanes(updateLane);
          } else {
            if (newBaseQueueLast !== null) {
              var _clone = {
                lane: NoLane,
                action: update.action,
                eagerReducer: update.eagerReducer,
                eagerState: update.eagerState,
                next: null,
              };
              newBaseQueueLast = newBaseQueueLast.next = _clone;
            }
  
            if (update.eagerReducer === reducer) {
              newState = update.eagerState;
            } else {
              var action = update.action;
              newState = reducer(newState, action);
            }
          }
  
          update = update.next;
        } while (update !== null && update !== first);
  
        if (newBaseQueueLast === null) {
          newBaseState = newState;
        } else {
          newBaseQueueLast.next = newBaseQueueFirst;
        }
  
        if (!objectIs(newState, hook.memoizedState)) {
          markWorkInProgressReceivedUpdate();
        }
  
        hook.memoizedState = newState;
        hook.baseState = newBaseState;
        hook.baseQueue = newBaseQueueLast;
        queue.lastRenderedState = newState;
      }
  
      var dispatch = queue.dispatch;
      return [hook.memoizedState, dispatch];
    }
  
    function rerenderReducer(reducer, initialArg, init) {
      var hook = updateWorkInProgressHook();
      var queue = hook.queue;
  
      if (!(queue !== null)) {
        {
          throw Error(formatProdErrorMessage(311));
        }
      }
  
      queue.lastRenderedReducer = reducer;
  
      var dispatch = queue.dispatch;
      var lastRenderPhaseUpdate = queue.pending;
      var newState = hook.memoizedState;
  
      if (lastRenderPhaseUpdate !== null) {
        queue.pending = null;
        var firstRenderPhaseUpdate = lastRenderPhaseUpdate.next;
        var update = firstRenderPhaseUpdate;
  
        do {
          var action = update.action;
          newState = reducer(newState, action);
          update = update.next;
        } while (update !== firstRenderPhaseUpdate);
  
        if (!objectIs(newState, hook.memoizedState)) {
          markWorkInProgressReceivedUpdate();
        }
  
        hook.memoizedState = newState;
  
        if (hook.baseQueue === null) {
          hook.baseState = newState;
        }
  
        queue.lastRenderedState = newState;
      }
  
      return [newState, dispatch];
    }
  
    function readFromUnsubcribedMutableSource(root, source, getSnapshot) {
      var getVersion = source._getVersion;
      var version = getVersion(source._source);
  
      var isSafeToReadFromSource = false;
  
      var currentRenderVersion = getWorkInProgressVersion(source);
  
      if (currentRenderVersion !== null) {
        isSafeToReadFromSource = currentRenderVersion === version;
      } else {
        isSafeToReadFromSource = isSubsetOfLanes(renderLanes, root.mutableReadLanes);
  
        if (isSafeToReadFromSource) {
          setWorkInProgressVersion(source, version);
        }
      }
  
      if (isSafeToReadFromSource) {
        var snapshot = getSnapshot(source._source);
  
        return snapshot;
      } else {
        markSourceAsDirty(source);
  
        {
          {
            throw Error(formatProdErrorMessage(350));
          }
        }
      }
    }
  
    function useMutableSource(hook, source, getSnapshot, subscribe) {
      var root = getWorkInProgressRoot();
  
      if (!(root !== null)) {
        {
          throw Error(formatProdErrorMessage(349));
        }
      }
  
      var getVersion = source._getVersion;
      var version = getVersion(source._source);
      var dispatcher = ReactCurrentDispatcher$1.current;
  
      var _dispatcher$useState = dispatcher.useState(function () {
          return readFromUnsubcribedMutableSource(root, source, getSnapshot);
        }),
        currentSnapshot = _dispatcher$useState[0],
        setSnapshot = _dispatcher$useState[1];
  
      var snapshot = currentSnapshot;
  
      var stateHook = workInProgressHook;
      var memoizedState = hook.memoizedState;
      var refs = memoizedState.refs;
      var prevGetSnapshot = refs.getSnapshot;
      var prevSource = memoizedState.source;
      var prevSubscribe = memoizedState.subscribe;
      var fiber = currentlyRenderingFiber$1;
      hook.memoizedState = {
        refs: refs,
        source: source,
        subscribe: subscribe,
      };
  
      dispatcher.useEffect(
        function () {
          refs.getSnapshot = getSnapshot;
  
          refs.setSnapshot = setSnapshot;
  
          var maybeNewVersion = getVersion(source._source);
  
          if (!objectIs(version, maybeNewVersion)) {
            var maybeNewSnapshot = getSnapshot(source._source);
  
            if (!objectIs(snapshot, maybeNewSnapshot)) {
              setSnapshot(maybeNewSnapshot);
              var lane = requestUpdateLane(fiber);
              markRootMutableRead(root, lane);
            }
  
            markRootEntangled(root, root.mutableReadLanes);
          }
        },
        [getSnapshot, source, subscribe]
      );
  
      dispatcher.useEffect(
        function () {
          var handleChange = function () {
            var latestGetSnapshot = refs.getSnapshot;
            var latestSetSnapshot = refs.setSnapshot;
  
            try {
              latestSetSnapshot(latestGetSnapshot(source._source));
  
              var lane = requestUpdateLane(fiber);
              markRootMutableRead(root, lane);
            } catch (error) {
              latestSetSnapshot(function () {
                throw error;
              });
            }
          };
  
          var unsubscribe = subscribe(source._source, handleChange);
  
          return unsubscribe;
        },
        [source, subscribe]
      );
  
      if (
        !objectIs(prevGetSnapshot, getSnapshot) ||
        !objectIs(prevSource, source) ||
        !objectIs(prevSubscribe, subscribe)
      ) {
        var newQueue = {
          pending: null,
          dispatch: null,
          lastRenderedReducer: basicStateReducer,
          lastRenderedState: snapshot,
        };
        newQueue.dispatch = setSnapshot = dispatchAction.bind(null, currentlyRenderingFiber$1, newQueue);
        stateHook.queue = newQueue;
        stateHook.baseQueue = null;
        snapshot = readFromUnsubcribedMutableSource(root, source, getSnapshot);
        stateHook.memoizedState = stateHook.baseState = snapshot;
      }
  
      return snapshot;
    }
  
    function mountMutableSource(source, getSnapshot, subscribe) {
      var hook = mountWorkInProgressHook();
      hook.memoizedState = {
        refs: {
          getSnapshot: getSnapshot,
          setSnapshot: null,
        },
        source: source,
        subscribe: subscribe,
      };
      return useMutableSource(hook, source, getSnapshot, subscribe);
    }
  
    function updateMutableSource(source, getSnapshot, subscribe) {
      var hook = updateWorkInProgressHook();
      return useMutableSource(hook, source, getSnapshot, subscribe);
    }
  
    function mountState(initialState) {
      // 创建hook对象并添加进入hook链表中
      var hook = mountWorkInProgressHook();
  
      // 获取默认值
      if (typeof initialState === "function") {
        initialState = initialState();
      }
  
      // 缓存初始值, 并将初始值赋值给memoizedState用于记录
      hook.memoizedState = hook.baseState = initialState;
      // 创建一个用于管理state更新的队列, 并初始化相关属性
      var queue = (hook.queue = {
        pending: null,
        dispatch: null,
        lastRenderedReducer: basicStateReducer,
        lastRenderedState: initialState,
      });
      // 创建一个dispatch函数, 用于触发state更新的操作
      var dispatch = (queue.dispatch = dispatchAction.bind(null, currentlyRenderingFiber$1, queue));
      return [hook.memoizedState, dispatch];
    }
  
    function updateState(initialState) {
      return updateReducer(basicStateReducer);
    }
  
    function rerenderState(initialState) {
      return rerenderReducer(basicStateReducer);
    }
  
    function pushEffect(tag, create, destroy, deps) {
      var effect = {
        tag: tag,
        create: create,
        destroy: destroy,
        deps: deps,
  
        next: null,
      };
      var componentUpdateQueue = currentlyRenderingFiber$1.updateQueue;
  
      // 将当前effect插入链表
      if (componentUpdateQueue === null) {
        componentUpdateQueue = createFuncionComponentUpdateQueue();
        currentlyRenderingFiber$1.updateQueue = componentUpdateQueue;
        componentUpdateQueue.lastEffect = effect.next = effect;
      } else {
        var lastEffect = componentUpdateQueue.lastEffect;
  
        if (lastEffect === null) {
          componentUpdateQueue.lastEffect = effect.next = effect;
        } else {
          var firstEffect = lastEffect.next;
          lastEffect.next = effect;
          effect.next = firstEffect;
          componentUpdateQueue.lastEffect = effect;
        }
      }
  
      return effect;
    }
  
    function mountRef(initialValue) {
      var hook = mountWorkInProgressHook();
      var ref = {
        current: initialValue,
      };
  
      hook.memoizedState = ref;
      return ref;
    }
  
    function updateRef(initialValue) {
      var hook = updateWorkInProgressHook();
      return hook.memoizedState;
    }
  
    function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
      var hook = mountWorkInProgressHook();
      var nextDeps = deps === undefined ? null : deps;
      currentlyRenderingFiber$1.flags |= fiberFlags;
      hook.memoizedState = pushEffect(HasEffect | hookFlags, create, undefined, nextDeps);
    }
  
    function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
      var hook = updateWorkInProgressHook();
      var nextDeps = deps === undefined ? null : deps;
      var destroy = undefined;
  
      if (currentHook !== null) {
        var prevEffect = currentHook.memoizedState;
        destroy = prevEffect.destroy;
  
        // 比较前后deps是否一致来判断是否需要执行effect
        if (nextDeps !== null) {
          var prevDeps = prevEffect.deps;
  
          if (areHookInputsEqual(nextDeps, prevDeps)) {
            pushEffect(hookFlags, create, destroy, nextDeps);
            return;
          }
        }
      }
  
      currentlyRenderingFiber$1.flags |= fiberFlags;
      hook.memoizedState = pushEffect(HasEffect | hookFlags, create, destroy, nextDeps);
    }
  
    function mountEffect(create, deps) {
      return mountEffectImpl(Update | Passive, Passive$1, create, deps);
    }
  
    function updateEffect(create, deps) {
      return updateEffectImpl(Update | Passive, Passive$1, create, deps);
    }
  
    function mountLayoutEffect(create, deps) {
      return mountEffectImpl(Update, Layout, create, deps);
    }
  
    function updateLayoutEffect(create, deps) {
      return updateEffectImpl(Update, Layout, create, deps);
    }
  
    function imperativeHandleEffect(create, ref) {
      if (typeof ref === "function") {
        var refCallback = ref;
  
        var _inst = create();
  
        refCallback(_inst);
        return function () {
          refCallback(null);
        };
      } else if (ref !== null && ref !== undefined) {
        var refObject = ref;
  
        var _inst2 = create();
  
        refObject.current = _inst2;
        return function () {
          refObject.current = null;
        };
      }
    }
  
    function mountImperativeHandle(ref, create, deps) {
      var effectDeps = deps !== null && deps !== undefined ? deps.concat([ref]) : null;
      return mountEffectImpl(Update, Layout, imperativeHandleEffect.bind(null, create, ref), effectDeps);
    }
  
    function updateImperativeHandle(ref, create, deps) {
      var effectDeps = deps !== null && deps !== undefined ? deps.concat([ref]) : null;
      return updateEffectImpl(Update, Layout, imperativeHandleEffect.bind(null, create, ref), effectDeps);
    }
  
    function mountDebugValue(value, formatterFn) {}
  
    var updateDebugValue = mountDebugValue;
  
    function mountCallback(callback, deps) {
      var hook = mountWorkInProgressHook();
      var nextDeps = deps === undefined ? null : deps;
      hook.memoizedState = [callback, nextDeps];
      return callback;
    }
  
    function updateCallback(callback, deps) {
      var hook = updateWorkInProgressHook();
      var nextDeps = deps === undefined ? null : deps;
      var prevState = hook.memoizedState;
  
      if (prevState !== null) {
        if (nextDeps !== null) {
          var prevDeps = prevState[1];
  
          if (areHookInputsEqual(nextDeps, prevDeps)) {
            return prevState[0];
          }
        }
      }
  
      hook.memoizedState = [callback, nextDeps];
      return callback;
    }
  
    function mountMemo(nextCreate, deps) {
      var hook = mountWorkInProgressHook();
      var nextDeps = deps === undefined ? null : deps;
      var nextValue = nextCreate();
      hook.memoizedState = [nextValue, nextDeps];
      return nextValue;
    }
  
    function updateMemo(nextCreate, deps) {
      var hook = updateWorkInProgressHook();
      var nextDeps = deps === undefined ? null : deps;
      var prevState = hook.memoizedState;
  
      if (prevState !== null) {
        if (nextDeps !== null) {
          var prevDeps = prevState[1];
  
          if (areHookInputsEqual(nextDeps, prevDeps)) {
            return prevState[0];
          }
        }
      }
  
      var nextValue = nextCreate();
      hook.memoizedState = [nextValue, nextDeps];
      return nextValue;
    }
  
    function mountDeferredValue(value) {
      var _mountState = mountState(value),
        prevValue = _mountState[0],
        setValue = _mountState[1];
  
      mountEffect(
        function () {
          var prevTransition = ReactCurrentBatchConfig$1.transition;
          ReactCurrentBatchConfig$1.transition = 1;
  
          try {
            setValue(value);
          } finally {
            ReactCurrentBatchConfig$1.transition = prevTransition;
          }
        },
        [value]
      );
      return prevValue;
    }
  
    function updateDeferredValue(value) {
      var _updateState = updateState(),
        prevValue = _updateState[0],
        setValue = _updateState[1];
  
      updateEffect(
        function () {
          var prevTransition = ReactCurrentBatchConfig$1.transition;
          ReactCurrentBatchConfig$1.transition = 1;
  
          try {
            setValue(value);
          } finally {
            ReactCurrentBatchConfig$1.transition = prevTransition;
          }
        },
        [value]
      );
      return prevValue;
    }
  
    function rerenderDeferredValue(value) {
      var _rerenderState = rerenderState(),
        prevValue = _rerenderState[0],
        setValue = _rerenderState[1];
  
      updateEffect(
        function () {
          var prevTransition = ReactCurrentBatchConfig$1.transition;
          ReactCurrentBatchConfig$1.transition = 1;
  
          try {
            setValue(value);
          } finally {
            ReactCurrentBatchConfig$1.transition = prevTransition;
          }
        },
        [value]
      );
      return prevValue;
    }
  
    function startTransition(setPending, callback) {
      var priorityLevel = getCurrentPriorityLevel();
  
      {
        runWithPriority$1(priorityLevel < UserBlockingPriority$2 ? UserBlockingPriority$2 : priorityLevel, function () {
          setPending(true);
        });
        runWithPriority$1(priorityLevel > NormalPriority$1 ? NormalPriority$1 : priorityLevel, function () {
          var prevTransition = ReactCurrentBatchConfig$1.transition;
          ReactCurrentBatchConfig$1.transition = 1;
  
          try {
            setPending(false);
            callback();
          } finally {
            ReactCurrentBatchConfig$1.transition = prevTransition;
          }
        });
      }
    }
  
    function mountTransition() {
      var _mountState2 = mountState(false),
        isPending = _mountState2[0],
        setPending = _mountState2[1];
  
      var start = startTransition.bind(null, setPending);
      mountRef(start);
      return [start, isPending];
    }
  
    function updateTransition() {
      var _updateState2 = updateState(),
        isPending = _updateState2[0];
  
      var startRef = updateRef();
      var start = startRef.current;
      return [start, isPending];
    }
  
    function rerenderTransition() {
      var _rerenderState2 = rerenderState(),
        isPending = _rerenderState2[0];
  
      var startRef = updateRef();
      var start = startRef.current;
      return [start, isPending];
    }
  
    function mountOpaqueIdentifier() {
      var makeId = makeClientId;
  
      if (getIsHydrating()) {
        var didUpgrade = false;
  
        var readValue = function () {
          if (!didUpgrade) {
            didUpgrade = true;
  
            {
              setId(makeId());
            }
          }
  
          {
            {
              throw Error(formatProdErrorMessage(355));
            }
          }
        };
  
        var id = makeOpaqueHydratingObject(readValue);
        var setId = mountState(id)[1];
  
        if ((currentlyRenderingFiber$1.mode & BlockingMode) === NoMode) {
          currentlyRenderingFiber$1.flags |= Update | Passive;
          pushEffect(
            HasEffect | Passive$1,
            function () {
              setId(makeId());
            },
            undefined,
            null
          );
        }
  
        return id;
      } else {
        var _id = makeId();
  
        mountState(_id);
        return _id;
      }
    }
  
    function updateOpaqueIdentifier() {
      var id = updateState()[0];
      return id;
    }
  
    function rerenderOpaqueIdentifier() {
      var id = rerenderState()[0];
      return id;
    }
  
    function dispatchAction(fiber, queue, action) {
      logStacks();
      // debugger;
      console.log("[DispatchAction]:", fiber);
      // 获取事件时间和更新优先级
      var eventTime = requestEventTime();
      var lane = requestUpdateLane(fiber);
  
      // 创建一个更新对象, 并初始化相关属性
      var update = {
        lane: lane,
        action: action,
        eagerReducer: null,
        eagerState: null,
        next: null,
      };
  
      var pending = queue.pending;
  
      // 将新的更新插入链表
      if (pending === null) {
        update.next = update;
      } else {
        update.next = pending.next;
        pending.next = update;
      }
  
      queue.pending = update;
      var alternate = fiber.alternate;
  
      // 判断是否在当前渲染过程中触发了state更新
      if (fiber === currentlyRenderingFiber$1 || (alternate !== null && alternate === currentlyRenderingFiber$1)) {
        didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = true;
      } else {
        // 如果不是在当前渲染过程中触发的state更新, 需要进一步处理
        if (fiber.lanes === NoLanes && (alternate === null || alternate.lanes === NoLanes)) {
          //  如果待更新的 Fiber 节点的优先级为0（表示当前没有更高优先级的更新），且它的 alternate 节点也没有优先级
          var lastRenderedReducer = queue.lastRenderedReducer;
  
          if (lastRenderedReducer !== null) {
            try {
              var currentState = queue.lastRenderedState;
              // 执行更内容(setState的参数)
              var eagerState = lastRenderedReducer(currentState, action);
  
              // 记录优化后的 reducer 和对应的 state
              update.eagerReducer = lastRenderedReducer;
              update.eagerState = eagerState;
  
              // 如果优化后的 state 与当前 state 相同，则不执行后续更新操作
              if (objectIs(eagerState, currentState)) {
                return;
              }
            } catch (error) {
            } finally {
            }
          }
        }
  
        // 调度更新操作
        scheduleUpdateOnFiber(fiber, lane, eventTime);
      }
    }
  
    var ContextOnlyDispatcher = {
      readContext: readContext,
      useCallback: throwInvalidHookError,
      useContext: throwInvalidHookError,
      useEffect: throwInvalidHookError,
      useImperativeHandle: throwInvalidHookError,
      useLayoutEffect: throwInvalidHookError,
      useMemo: throwInvalidHookError,
      useReducer: throwInvalidHookError,
      useRef: throwInvalidHookError,
      useState: throwInvalidHookError,
      useDebugValue: throwInvalidHookError,
      useDeferredValue: throwInvalidHookError,
      useTransition: throwInvalidHookError,
      useMutableSource: throwInvalidHookError,
      useOpaqueIdentifier: throwInvalidHookError,
      unstable_isNewReconciler: enableNewReconciler,
    };
    var HooksDispatcherOnMount = {
      readContext: readContext,
      useCallback: mountCallback,
      useContext: readContext,
      useEffect: mountEffect,
      useImperativeHandle: mountImperativeHandle,
      useLayoutEffect: mountLayoutEffect,
      useMemo: mountMemo,
      useReducer: mountReducer,
      useRef: mountRef,
      useState: mountState,
      useDebugValue: mountDebugValue,
      useDeferredValue: mountDeferredValue,
      useTransition: mountTransition,
      useMutableSource: mountMutableSource,
      useOpaqueIdentifier: mountOpaqueIdentifier,
      unstable_isNewReconciler: enableNewReconciler,
    };
    var HooksDispatcherOnUpdate = {
      readContext: readContext,
      useCallback: updateCallback,
      useContext: readContext,
      useEffect: updateEffect,
      useImperativeHandle: updateImperativeHandle,
      useLayoutEffect: updateLayoutEffect,
      useMemo: updateMemo,
      useReducer: updateReducer,
      useRef: updateRef,
      useState: updateState,
      useDebugValue: updateDebugValue,
      useDeferredValue: updateDeferredValue,
      useTransition: updateTransition,
      useMutableSource: updateMutableSource,
      useOpaqueIdentifier: updateOpaqueIdentifier,
      unstable_isNewReconciler: enableNewReconciler,
    };
    var HooksDispatcherOnRerender = {
      readContext: readContext,
      useCallback: updateCallback,
      useContext: readContext,
      useEffect: updateEffect,
      useImperativeHandle: updateImperativeHandle,
      useLayoutEffect: updateLayoutEffect,
      useMemo: updateMemo,
      useReducer: rerenderReducer,
      useRef: updateRef,
      useState: rerenderState,
      useDebugValue: updateDebugValue,
      useDeferredValue: rerenderDeferredValue,
      useTransition: rerenderTransition,
      useMutableSource: updateMutableSource,
      useOpaqueIdentifier: rerenderOpaqueIdentifier,
      unstable_isNewReconciler: enableNewReconciler,
    };
  
    var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
    var didReceiveUpdate = false;
  
    function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
      if (current === null) {
        workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderLanes);
      } else {
        workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren, renderLanes);
      }
    }
  
    function forceUnmountCurrentAndReconcile(current, workInProgress, nextChildren, renderLanes) {
      workInProgress.child = reconcileChildFibers(workInProgress, current.child, null, renderLanes);
  
      workInProgress.child = reconcileChildFibers(workInProgress, null, nextChildren, renderLanes);
    }
  
    function updateForwardRef(current, workInProgress, Component, nextProps, renderLanes) {
      var render = Component.render;
      var ref = workInProgress.ref;
  
      var nextChildren;
      prepareToReadContext(workInProgress, renderLanes);
  
      nextChildren = renderWithHooks(current, workInProgress, render, nextProps, ref, renderLanes);
  
      if (current !== null && !didReceiveUpdate) {
        bailoutHooks(current, workInProgress, renderLanes);
        return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
      }
  
      workInProgress.flags |= PerformedWork;
      reconcileChildren(current, workInProgress, nextChildren, renderLanes);
      return workInProgress.child;
    }
  
    function updateMemoComponent(current, workInProgress, Component, nextProps, updateLanes, renderLanes) {
      if (current === null) {
        var type = Component.type;
  
        if (isSimpleFunctionComponent(type) && Component.compare === null && Component.defaultProps === undefined) {
          var resolvedType = type;
  
          workInProgress.tag = SimpleMemoComponent;
          workInProgress.type = resolvedType;
  
          return updateSimpleMemoComponent(current, workInProgress, resolvedType, nextProps, updateLanes, renderLanes);
        }
  
        var child = createFiberFromTypeAndProps(
          Component.type,
          null,
          nextProps,
          workInProgress,
          workInProgress.mode,
          renderLanes
        );
        child.ref = workInProgress.ref;
        child.return = workInProgress;
        workInProgress.child = child;
        return child;
      }
  
      var currentChild = current.child;
  
      if (!includesSomeLane(updateLanes, renderLanes)) {
        var prevProps = currentChild.memoizedProps;
  
        var compare = Component.compare;
        compare = compare !== null ? compare : shallowEqual;
  
        if (compare(prevProps, nextProps) && current.ref === workInProgress.ref) {
          return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
        }
      }
  
      workInProgress.flags |= PerformedWork;
      var newChild = createWorkInProgress(currentChild, nextProps);
      newChild.ref = workInProgress.ref;
      newChild.return = workInProgress;
      workInProgress.child = newChild;
      return newChild;
    }
  
    function updateSimpleMemoComponent(current, workInProgress, Component, nextProps, updateLanes, renderLanes) {
      if (current !== null) {
        var prevProps = current.memoizedProps;
  
        if (shallowEqual(prevProps, nextProps) && current.ref === workInProgress.ref && true) {
          didReceiveUpdate = false;
  
          if (!includesSomeLane(renderLanes, updateLanes)) {
            workInProgress.lanes = current.lanes;
            return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
          } else if ((current.flags & ForceUpdateForLegacySuspense) !== NoFlags) {
            didReceiveUpdate = true;
          }
        }
      }
  
      return updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes);
    }
  
    function updateOffscreenComponent(current, workInProgress, renderLanes) {
      var nextProps = workInProgress.pendingProps;
      var nextChildren = nextProps.children;
      var prevState = current !== null ? current.memoizedState : null;
  
      if (nextProps.mode === "hidden" || nextProps.mode === "unstable-defer-without-hiding") {
        if ((workInProgress.mode & ConcurrentMode) === NoMode) {
          var nextState = {
            baseLanes: NoLanes,
          };
          workInProgress.memoizedState = nextState;
          pushRenderLanes(workInProgress, renderLanes);
        } else if (!includesSomeLane(renderLanes, OffscreenLane)) {
          var nextBaseLanes;
  
          if (prevState !== null) {
            var prevBaseLanes = prevState.baseLanes;
            nextBaseLanes = mergeLanes(prevBaseLanes, renderLanes);
          } else {
            nextBaseLanes = renderLanes;
          }
  
          workInProgress.lanes = workInProgress.childLanes = laneToLanes(OffscreenLane);
          var _nextState = {
            baseLanes: nextBaseLanes,
          };
          workInProgress.memoizedState = _nextState;
  
          pushRenderLanes(workInProgress, nextBaseLanes);
          return null;
        } else {
          var _nextState2 = {
            baseLanes: NoLanes,
          };
          workInProgress.memoizedState = _nextState2;
  
          var subtreeRenderLanes = prevState !== null ? prevState.baseLanes : renderLanes;
          pushRenderLanes(workInProgress, subtreeRenderLanes);
        }
      } else {
        var _subtreeRenderLanes;
  
        if (prevState !== null) {
          _subtreeRenderLanes = mergeLanes(prevState.baseLanes, renderLanes);
  
          workInProgress.memoizedState = null;
        } else {
          _subtreeRenderLanes = renderLanes;
        }
  
        pushRenderLanes(workInProgress, _subtreeRenderLanes);
      }
  
      reconcileChildren(current, workInProgress, nextChildren, renderLanes);
      return workInProgress.child;
    }
  
    var updateLegacyHiddenComponent = updateOffscreenComponent;
  
    function updateFragment(current, workInProgress, renderLanes) {
      var nextChildren = workInProgress.pendingProps;
      reconcileChildren(current, workInProgress, nextChildren, renderLanes);
      return workInProgress.child;
    }
  
    function updateMode(current, workInProgress, renderLanes) {
      var nextChildren = workInProgress.pendingProps.children;
      reconcileChildren(current, workInProgress, nextChildren, renderLanes);
      return workInProgress.child;
    }
  
    function updateProfiler(current, workInProgress, renderLanes) {
      var nextProps = workInProgress.pendingProps;
      var nextChildren = nextProps.children;
      reconcileChildren(current, workInProgress, nextChildren, renderLanes);
      return workInProgress.child;
    }
  
    function markRef(current, workInProgress) {
      var ref = workInProgress.ref;
  
      if ((current === null && ref !== null) || (current !== null && current.ref !== ref)) {
        workInProgress.flags |= Ref;
      }
    }
  
    function updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes) {
      console.log("[update function component]");
      var context;
  
      var unmaskedContext = getUnmaskedContext(workInProgress, Component, true);
      context = getMaskedContext(workInProgress, unmaskedContext);
  
      var nextChildren;
      prepareToReadContext(workInProgress, renderLanes);
  
      nextChildren = renderWithHooks(current, workInProgress, Component, nextProps, context, renderLanes);
  
      if (current !== null && !didReceiveUpdate) {
        bailoutHooks(current, workInProgress, renderLanes);
        return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
      }
  
      workInProgress.flags |= PerformedWork;
      reconcileChildren(current, workInProgress, nextChildren, renderLanes);
      return workInProgress.child;
    }
  
    function updateClassComponent(current, workInProgress, Component, nextProps, renderLanes) {
      var hasContext;
  
      if (isContextProvider(Component)) {
        hasContext = true;
        pushContextProvider(workInProgress);
      } else {
        hasContext = false;
      }
  
      prepareToReadContext(workInProgress, renderLanes);
      var instance = workInProgress.stateNode;
      var shouldUpdate;
  
      if (instance === null) {
        if (current !== null) {
          current.alternate = null;
          workInProgress.alternate = null;
  
          workInProgress.flags |= Placement;
        }
  
        constructClassInstance(workInProgress, Component, nextProps);
        mountClassInstance(workInProgress, Component, nextProps, renderLanes);
        shouldUpdate = true;
      } else if (current === null) {
        shouldUpdate = resumeMountClassInstance(workInProgress, Component, nextProps, renderLanes);
      } else {
        shouldUpdate = updateClassInstance(current, workInProgress, Component, nextProps, renderLanes);
      }
  
      var nextUnitOfWork = finishClassComponent(
        current,
        workInProgress,
        Component,
        shouldUpdate,
        hasContext,
        renderLanes
      );
  
      return nextUnitOfWork;
    }
  
    function finishClassComponent(current, workInProgress, Component, shouldUpdate, hasContext, renderLanes) {
      markRef(current, workInProgress);
      var didCaptureError = (workInProgress.flags & DidCapture) !== NoFlags;
  
      if (!shouldUpdate && !didCaptureError) {
        if (hasContext) {
          invalidateContextProvider(workInProgress, Component, false);
        }
  
        return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
      }
  
      var instance = workInProgress.stateNode;
  
      ReactCurrentOwner$1.current = workInProgress;
      var nextChildren;
  
      if (didCaptureError && typeof Component.getDerivedStateFromError !== "function") {
        nextChildren = null;
      } else {
        nextChildren = instance.render();
      }
  
      workInProgress.flags |= PerformedWork;
  
      if (current !== null && didCaptureError) {
        forceUnmountCurrentAndReconcile(current, workInProgress, nextChildren, renderLanes);
      } else {
        reconcileChildren(current, workInProgress, nextChildren, renderLanes);
      }
  
      workInProgress.memoizedState = instance.state;
  
      if (hasContext) {
        invalidateContextProvider(workInProgress, Component, true);
      }
  
      return workInProgress.child;
    }
  
    function pushHostRootContext(workInProgress) {
      var root = workInProgress.stateNode;
  
      if (root.pendingContext) {
        pushTopLevelContextObject(workInProgress, root.pendingContext, root.pendingContext !== root.context);
      } else if (root.context) {
        pushTopLevelContextObject(workInProgress, root.context, false);
      }
  
      pushHostContainer(workInProgress, root.containerInfo);
    }
  
    function updateHostRoot(current, workInProgress, renderLanes) {
      pushHostRootContext(workInProgress);
      var updateQueue = workInProgress.updateQueue;
  
      if (!(current !== null && updateQueue !== null)) {
        throw Error(formatProdErrorMessage(282));
      }
  
      var nextProps = workInProgress.pendingProps;
      var prevState = workInProgress.memoizedState;
      var prevChildren = prevState !== null ? prevState.element : null;
      cloneUpdateQueue(current, workInProgress);
      // 遍历updateQueue.shared.pending, 提取有足够优先级的update对象,计算出最终的状态 workInProgress.memoizedState
      processUpdateQueue(workInProgress, nextProps, null, renderLanes);
      var nextState = workInProgress.memoizedState;
  
      var nextChildren = nextState.element;
  
      if (nextChildren === prevChildren) {
        resetHydrationState();
        return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
      }
  
      var root = workInProgress.stateNode;
  
      if (root.hydrate && enterHydrationState(workInProgress)) {
        {
          var mutableSourceEagerHydrationData = root.mutableSourceEagerHydrationData;
  
          if (mutableSourceEagerHydrationData != null) {
            for (var i = 0; i < mutableSourceEagerHydrationData.length; i += 2) {
              var mutableSource = mutableSourceEagerHydrationData[i];
              var version = mutableSourceEagerHydrationData[i + 1];
              setWorkInProgressVersion(mutableSource, version);
            }
          }
        }
  
        var child = mountChildFibers(workInProgress, null, nextChildren, renderLanes);
        workInProgress.child = child;
        var node = child;
  
        while (node) {
          node.flags = (node.flags & ~Placement) | Hydrating;
          node = node.sibling;
        }
      } else {
        reconcileChildren(current, workInProgress, nextChildren, renderLanes);
        resetHydrationState();
      }
  
      return workInProgress.child;
    }
  
    function updateHostComponent(current, workInProgress, renderLanes) {
      pushHostContext(workInProgress);
  
      if (current === null) {
        tryToClaimNextHydratableInstance(workInProgress);
      }
  
      var type = workInProgress.type;
      var nextProps = workInProgress.pendingProps;
      var prevProps = current !== null ? current.memoizedProps : null;
      var nextChildren = nextProps.children;
      var isDirectTextChild = shouldSetTextContent(type, nextProps);
  
      if (isDirectTextChild) {
        nextChildren = null;
      } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
        workInProgress.flags |= ContentReset;
      }
  
      markRef(current, workInProgress);
  
      // 协调children
      reconcileChildren(current, workInProgress, nextChildren, renderLanes);
      return workInProgress.child;
    }
  
    function updateHostText(current, workInProgress) {
      if (current === null) {
        tryToClaimNextHydratableInstance(workInProgress);
      }
  
      return null;
    }
  
    function mountLazyComponent(_current, workInProgress, elementType, updateLanes, renderLanes) {
      if (_current !== null) {
        _current.alternate = null;
        workInProgress.alternate = null;
  
        workInProgress.flags |= Placement;
      }
  
      var props = workInProgress.pendingProps;
      var lazyComponent = elementType;
      var payload = lazyComponent._payload;
      var init = lazyComponent._init;
      var Component = init(payload);
  
      workInProgress.type = Component;
      var resolvedTag = (workInProgress.tag = resolveLazyComponentTag(Component));
      var resolvedProps = resolveDefaultProps(Component, props);
      var child;
  
      switch (resolvedTag) {
        case FunctionComponent: {
          child = updateFunctionComponent(null, workInProgress, Component, resolvedProps, renderLanes);
          return child;
        }
  
        case ClassComponent: {
          child = updateClassComponent(null, workInProgress, Component, resolvedProps, renderLanes);
          return child;
        }
  
        case ForwardRef: {
          child = updateForwardRef(null, workInProgress, Component, resolvedProps, renderLanes);
          return child;
        }
  
        case MemoComponent: {
          child = updateMemoComponent(
            null,
            workInProgress,
            Component,
            resolveDefaultProps(Component.type, resolvedProps),
            updateLanes,
            renderLanes
          );
          return child;
        }
      }
  
      var hint = "";
  
      {
        {
          throw Error(formatProdErrorMessage(306, Component, hint));
        }
      }
    }
  
    function mountIncompleteClassComponent(_current, workInProgress, Component, nextProps, renderLanes) {
      if (_current !== null) {
        _current.alternate = null;
        workInProgress.alternate = null;
  
        workInProgress.flags |= Placement;
      }
  
      workInProgress.tag = ClassComponent;
  
      var hasContext;
  
      if (isContextProvider(Component)) {
        hasContext = true;
        pushContextProvider(workInProgress);
      } else {
        hasContext = false;
      }
  
      prepareToReadContext(workInProgress, renderLanes);
      constructClassInstance(workInProgress, Component, nextProps);
      mountClassInstance(workInProgress, Component, nextProps, renderLanes);
      return finishClassComponent(null, workInProgress, Component, true, hasContext, renderLanes);
    }
  
    /** 用于创建一个不确定类型的组件(组件动态变化、组件异步加载) */
    function mountIndeterminateComponent(_current, workInProgress, Component, renderLanes) {
      // 如果当前组件存在, 意味着这可能是一次重新渲染, 可能是由于suspend引起的
      // 重置alternate链并在workInProgress fiber上设置Placement状态
      if (_current !== null) {
        _current.alternate = null;
        workInProgress.alternate = null;
  
        workInProgress.flags |= Placement;
      }
  
      var props = workInProgress.pendingProps;
  
      // 获取未屏蔽的context并创建组件的屏蔽context
      var unmaskedContext = getUnmaskedContext(workInProgress, Component, false);
      var context = getMaskedContext(workInProgress, unmaskedContext);
  
      // 准备读取context
      prepareToReadContext(workInProgress, renderLanes);
      // 调用函数组件
      var value = renderWithHooks(null, workInProgress, Component, props, context, renderLanes);
  
      workInProgress.flags |= PerformedWork;
  
      if (
        typeof value === "object" &&
        value !== null &&
        typeof value.render === "function" &&
        value.$$typeof === undefined
      ) {
        // 通过判断$$typeof是否存在来判断组件是否是类组件, 并执行必要的初始化和挂载步骤
  
        // 更新组件Tag为类组件
        workInProgress.tag = ClassComponent;
  
        workInProgress.memoizedState = null;
        workInProgress.updateQueue = null;
  
        var hasContext = false;
  
        if (isContextProvider(Component)) {
          hasContext = true;
          pushContextProvider(workInProgress);
        } else {
          hasContext = false;
        }
  
        workInProgress.memoizedState = value.state !== null && value.state !== undefined ? value.state : null;
        initializeUpdateQueue(workInProgress);
        var getDerivedStateFromProps = Component.getDerivedStateFromProps;
  
        if (typeof getDerivedStateFromProps === "function") {
          applyDerivedStateFromProps(workInProgress, Component, getDerivedStateFromProps, props);
        }
  
        adoptClassInstance(workInProgress, value);
        mountClassInstance(workInProgress, Component, props, renderLanes);
        return finishClassComponent(null, workInProgress, Component, true, hasContext, renderLanes);
      } else {
        workInProgress.tag = FunctionComponent;
  
        // 协调children
        reconcileChildren(null, workInProgress, value, renderLanes);
  
        return workInProgress.child;
      }
    }
  
    var SUSPENDED_MARKER = {
      dehydrated: null,
      retryLane: NoLane,
    };
  
    function mountSuspenseOffscreenState(renderLanes) {
      return {
        baseLanes: renderLanes,
      };
    }
  
    function updateSuspenseOffscreenState(prevOffscreenState, renderLanes) {
      return {
        baseLanes: mergeLanes(prevOffscreenState.baseLanes, renderLanes),
      };
    }
  
    function shouldRemainOnFallback(suspenseContext, current) {
      if (current !== null) {
        var suspenseState = current.memoizedState;
  
        if (suspenseState === null) {
          return false;
        }
      }
  
      return hasSuspenseContext(suspenseContext, ForceSuspenseFallback);
    }
  
    function getRemainingWorkInPrimaryTree(current, renderLanes) {
      return removeLanes(current.childLanes, renderLanes);
    }
  
    function updateSuspenseComponent(current, workInProgress, renderLanes) {
      var nextProps = workInProgress.pendingProps;
  
      var suspenseContext = suspenseStackCursor.current;
      var showFallback = false;
      var didSuspend = (workInProgress.flags & DidCapture) !== NoFlags;
  
      if (didSuspend || shouldRemainOnFallback(suspenseContext, current)) {
        showFallback = true;
        workInProgress.flags &= ~DidCapture;
      } else {
        if (current === null || current.memoizedState !== null) {
          if (nextProps.fallback !== undefined && nextProps.unstable_avoidThisFallback !== true) {
            suspenseContext = addSubtreeSuspenseContext(suspenseContext, InvisibleParentSuspenseContext);
          }
        }
      }
  
      suspenseContext = setDefaultShallowSuspenseContext(suspenseContext);
      pushSuspenseContext(workInProgress, suspenseContext);
  
      if (current === null) {
        if (nextProps.fallback !== undefined) {
          tryToClaimNextHydratableInstance(workInProgress);
        }
  
        var nextPrimaryChildren = nextProps.children;
        var nextFallbackChildren = nextProps.fallback;
  
        if (showFallback) {
          var fallbackFragment = mountSuspenseFallbackChildren(
            workInProgress,
            nextPrimaryChildren,
            nextFallbackChildren,
            renderLanes
          );
          var primaryChildFragment = workInProgress.child;
          primaryChildFragment.memoizedState = mountSuspenseOffscreenState(renderLanes);
          workInProgress.memoizedState = SUSPENDED_MARKER;
          return fallbackFragment;
        } else if (typeof nextProps.unstable_expectedLoadTime === "number") {
          var _fallbackFragment = mountSuspenseFallbackChildren(
            workInProgress,
            nextPrimaryChildren,
            nextFallbackChildren,
            renderLanes
          );
  
          var _primaryChildFragment = workInProgress.child;
          _primaryChildFragment.memoizedState = mountSuspenseOffscreenState(renderLanes);
          workInProgress.memoizedState = SUSPENDED_MARKER;
  
          workInProgress.lanes = SomeRetryLane;
  
          return _fallbackFragment;
        } else {
          return mountSuspensePrimaryChildren(workInProgress, nextPrimaryChildren, renderLanes);
        }
      } else {
        var prevState = current.memoizedState;
  
        if (prevState !== null) {
          if (showFallback) {
            var _nextFallbackChildren2 = nextProps.fallback;
            var _nextPrimaryChildren2 = nextProps.children;
  
            var _fallbackChildFragment = updateSuspenseFallbackChildren(
              current,
              workInProgress,
              _nextPrimaryChildren2,
              _nextFallbackChildren2,
              renderLanes
            );
  
            var _primaryChildFragment3 = workInProgress.child;
            var prevOffscreenState = current.child.memoizedState;
            _primaryChildFragment3.memoizedState =
              prevOffscreenState === null
                ? mountSuspenseOffscreenState(renderLanes)
                : updateSuspenseOffscreenState(prevOffscreenState, renderLanes);
            _primaryChildFragment3.childLanes = getRemainingWorkInPrimaryTree(current, renderLanes);
            workInProgress.memoizedState = SUSPENDED_MARKER;
            return _fallbackChildFragment;
          } else {
            var _nextPrimaryChildren3 = nextProps.children;
  
            var _primaryChildFragment4 = updateSuspensePrimaryChildren(
              current,
              workInProgress,
              _nextPrimaryChildren3,
              renderLanes
            );
  
            workInProgress.memoizedState = null;
            return _primaryChildFragment4;
          }
        } else {
          if (showFallback) {
            var _nextFallbackChildren3 = nextProps.fallback;
            var _nextPrimaryChildren4 = nextProps.children;
  
            var _fallbackChildFragment2 = updateSuspenseFallbackChildren(
              current,
              workInProgress,
              _nextPrimaryChildren4,
              _nextFallbackChildren3,
              renderLanes
            );
  
            var _primaryChildFragment5 = workInProgress.child;
            var _prevOffscreenState = current.child.memoizedState;
            _primaryChildFragment5.memoizedState =
              _prevOffscreenState === null
                ? mountSuspenseOffscreenState(renderLanes)
                : updateSuspenseOffscreenState(_prevOffscreenState, renderLanes);
            _primaryChildFragment5.childLanes = getRemainingWorkInPrimaryTree(current, renderLanes);
  
            workInProgress.memoizedState = SUSPENDED_MARKER;
            return _fallbackChildFragment2;
          } else {
            var _nextPrimaryChildren5 = nextProps.children;
  
            var _primaryChildFragment6 = updateSuspensePrimaryChildren(
              current,
              workInProgress,
              _nextPrimaryChildren5,
              renderLanes
            );
  
            workInProgress.memoizedState = null;
            return _primaryChildFragment6;
          }
        }
      }
    }
  
    function mountSuspensePrimaryChildren(workInProgress, primaryChildren, renderLanes) {
      var mode = workInProgress.mode;
      var primaryChildProps = {
        mode: "visible",
        children: primaryChildren,
      };
      var primaryChildFragment = createFiberFromOffscreen(primaryChildProps, mode, renderLanes, null);
      primaryChildFragment.return = workInProgress;
      workInProgress.child = primaryChildFragment;
      return primaryChildFragment;
    }
  
    function mountSuspenseFallbackChildren(workInProgress, primaryChildren, fallbackChildren, renderLanes) {
      var mode = workInProgress.mode;
      var progressedPrimaryFragment = workInProgress.child;
      var primaryChildProps = {
        mode: "hidden",
        children: primaryChildren,
      };
      var primaryChildFragment;
      var fallbackChildFragment;
  
      if ((mode & BlockingMode) === NoMode && progressedPrimaryFragment !== null) {
        primaryChildFragment = progressedPrimaryFragment;
        primaryChildFragment.childLanes = NoLanes;
        primaryChildFragment.pendingProps = primaryChildProps;
  
        fallbackChildFragment = createFiberFromFragment(fallbackChildren, mode, renderLanes, null);
      } else {
        primaryChildFragment = createFiberFromOffscreen(primaryChildProps, mode, NoLanes, null);
        fallbackChildFragment = createFiberFromFragment(fallbackChildren, mode, renderLanes, null);
      }
  
      primaryChildFragment.return = workInProgress;
      fallbackChildFragment.return = workInProgress;
      primaryChildFragment.sibling = fallbackChildFragment;
      workInProgress.child = primaryChildFragment;
      return fallbackChildFragment;
    }
  
    function createWorkInProgressOffscreenFiber(current, offscreenProps) {
      return createWorkInProgress(current, offscreenProps);
    }
  
    function updateSuspensePrimaryChildren(current, workInProgress, primaryChildren, renderLanes) {
      var currentPrimaryChildFragment = current.child;
      var currentFallbackChildFragment = currentPrimaryChildFragment.sibling;
      var primaryChildFragment = createWorkInProgressOffscreenFiber(currentPrimaryChildFragment, {
        mode: "visible",
        children: primaryChildren,
      });
  
      if ((workInProgress.mode & BlockingMode) === NoMode) {
        primaryChildFragment.lanes = renderLanes;
      }
  
      primaryChildFragment.return = workInProgress;
      primaryChildFragment.sibling = null;
  
      if (currentFallbackChildFragment !== null) {
        currentFallbackChildFragment.nextEffect = null;
        currentFallbackChildFragment.flags = Deletion;
        workInProgress.firstEffect = workInProgress.lastEffect = currentFallbackChildFragment;
      }
  
      workInProgress.child = primaryChildFragment;
      return primaryChildFragment;
    }
  
    function updateSuspenseFallbackChildren(current, workInProgress, primaryChildren, fallbackChildren, renderLanes) {
      var mode = workInProgress.mode;
      var currentPrimaryChildFragment = current.child;
      var currentFallbackChildFragment = currentPrimaryChildFragment.sibling;
      var primaryChildProps = {
        mode: "hidden",
        children: primaryChildren,
      };
      var primaryChildFragment;
  
      if ((mode & BlockingMode) === NoMode && workInProgress.child !== currentPrimaryChildFragment) {
        var progressedPrimaryFragment = workInProgress.child;
        primaryChildFragment = progressedPrimaryFragment;
        primaryChildFragment.childLanes = NoLanes;
        primaryChildFragment.pendingProps = primaryChildProps;
  
        var progressedLastEffect = primaryChildFragment.lastEffect;
  
        if (progressedLastEffect !== null) {
          workInProgress.firstEffect = primaryChildFragment.firstEffect;
          workInProgress.lastEffect = progressedLastEffect;
          progressedLastEffect.nextEffect = null;
        } else {
          workInProgress.firstEffect = workInProgress.lastEffect = null;
        }
      } else {
        primaryChildFragment = createWorkInProgressOffscreenFiber(currentPrimaryChildFragment, primaryChildProps);
      }
  
      var fallbackChildFragment;
  
      if (currentFallbackChildFragment !== null) {
        fallbackChildFragment = createWorkInProgress(currentFallbackChildFragment, fallbackChildren);
      } else {
        fallbackChildFragment = createFiberFromFragment(fallbackChildren, mode, renderLanes, null);
  
        fallbackChildFragment.flags |= Placement;
      }
  
      fallbackChildFragment.return = workInProgress;
      primaryChildFragment.return = workInProgress;
      primaryChildFragment.sibling = fallbackChildFragment;
      workInProgress.child = primaryChildFragment;
      return fallbackChildFragment;
    }
  
    function scheduleWorkOnFiber(fiber, renderLanes) {
      fiber.lanes = mergeLanes(fiber.lanes, renderLanes);
      var alternate = fiber.alternate;
  
      if (alternate !== null) {
        alternate.lanes = mergeLanes(alternate.lanes, renderLanes);
      }
  
      scheduleWorkOnParentPath(fiber.return, renderLanes);
    }
  
    function propagateSuspenseContextChange(workInProgress, firstChild, renderLanes) {
      var node = firstChild;
  
      while (node !== null) {
        if (node.tag === SuspenseComponent) {
          var state = node.memoizedState;
  
          if (state !== null) {
            scheduleWorkOnFiber(node, renderLanes);
          }
        } else if (node.tag === SuspenseListComponent) {
          scheduleWorkOnFiber(node, renderLanes);
        } else if (node.child !== null) {
          node.child.return = node;
          node = node.child;
          continue;
        }
  
        if (node === workInProgress) {
          return;
        }
  
        while (node.sibling === null) {
          if (node.return === null || node.return === workInProgress) {
            return;
          }
  
          node = node.return;
        }
  
        node.sibling.return = node.return;
        node = node.sibling;
      }
    }
  
    function findLastContentRow(firstChild) {
      var row = firstChild;
      var lastContentRow = null;
  
      while (row !== null) {
        var currentRow = row.alternate;
  
        if (currentRow !== null && findFirstSuspended(currentRow) === null) {
          lastContentRow = row;
        }
  
        row = row.sibling;
      }
  
      return lastContentRow;
    }
  
    function initSuspenseListRenderState(
      workInProgress,
      isBackwards,
      tail,
      lastContentRow,
      tailMode,
      lastEffectBeforeRendering
    ) {
      var renderState = workInProgress.memoizedState;
  
      if (renderState === null) {
        workInProgress.memoizedState = {
          isBackwards: isBackwards,
          rendering: null,
          renderingStartTime: 0,
          last: lastContentRow,
          tail: tail,
          tailMode: tailMode,
          lastEffect: lastEffectBeforeRendering,
        };
      } else {
        renderState.isBackwards = isBackwards;
        renderState.rendering = null;
        renderState.renderingStartTime = 0;
        renderState.last = lastContentRow;
        renderState.tail = tail;
        renderState.tailMode = tailMode;
        renderState.lastEffect = lastEffectBeforeRendering;
      }
    }
  
    function updateSuspenseListComponent(current, workInProgress, renderLanes) {
      var nextProps = workInProgress.pendingProps;
      var revealOrder = nextProps.revealOrder;
      var tailMode = nextProps.tail;
      var newChildren = nextProps.children;
      reconcileChildren(current, workInProgress, newChildren, renderLanes);
      var suspenseContext = suspenseStackCursor.current;
      var shouldForceFallback = hasSuspenseContext(suspenseContext, ForceSuspenseFallback);
  
      if (shouldForceFallback) {
        suspenseContext = setShallowSuspenseContext(suspenseContext, ForceSuspenseFallback);
        workInProgress.flags |= DidCapture;
      } else {
        var didSuspendBefore = current !== null && (current.flags & DidCapture) !== NoFlags;
  
        if (didSuspendBefore) {
          propagateSuspenseContextChange(workInProgress, workInProgress.child, renderLanes);
        }
  
        suspenseContext = setDefaultShallowSuspenseContext(suspenseContext);
      }
  
      pushSuspenseContext(workInProgress, suspenseContext);
  
      if ((workInProgress.mode & BlockingMode) === NoMode) {
        workInProgress.memoizedState = null;
      } else {
        switch (revealOrder) {
          case "forwards": {
            var lastContentRow = findLastContentRow(workInProgress.child);
            var tail;
  
            if (lastContentRow === null) {
              tail = workInProgress.child;
              workInProgress.child = null;
            } else {
              tail = lastContentRow.sibling;
              lastContentRow.sibling = null;
            }
  
            initSuspenseListRenderState(workInProgress, false, tail, lastContentRow, tailMode, workInProgress.lastEffect);
            break;
          }
  
          case "backwards": {
            var _tail = null;
            var row = workInProgress.child;
            workInProgress.child = null;
  
            while (row !== null) {
              var currentRow = row.alternate;
  
              if (currentRow !== null && findFirstSuspended(currentRow) === null) {
                workInProgress.child = row;
                break;
              }
  
              var nextRow = row.sibling;
              row.sibling = _tail;
              _tail = row;
              row = nextRow;
            }
  
            initSuspenseListRenderState(workInProgress, true, _tail, null, tailMode, workInProgress.lastEffect);
            break;
          }
  
          case "together": {
            initSuspenseListRenderState(workInProgress, false, null, null, undefined, workInProgress.lastEffect);
            break;
          }
  
          default: {
            workInProgress.memoizedState = null;
          }
        }
      }
  
      return workInProgress.child;
    }
  
    function updatePortalComponent(current, workInProgress, renderLanes) {
      pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
      var nextChildren = workInProgress.pendingProps;
  
      if (current === null) {
        workInProgress.child = reconcileChildFibers(workInProgress, null, nextChildren, renderLanes);
      } else {
        reconcileChildren(current, workInProgress, nextChildren, renderLanes);
      }
  
      return workInProgress.child;
    }
  
    function updateContextProvider(current, workInProgress, renderLanes) {
      var providerType = workInProgress.type;
      var context = providerType._context;
      var newProps = workInProgress.pendingProps;
      var oldProps = workInProgress.memoizedProps;
      var newValue = newProps.value;
  
      pushProvider(workInProgress, newValue);
  
      if (oldProps !== null) {
        var oldValue = oldProps.value;
        var changedBits = calculateChangedBits(context, newValue, oldValue);
  
        if (changedBits === 0) {
          if (oldProps.children === newProps.children && !hasContextChanged()) {
            return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
          }
        } else {
          propagateContextChange(workInProgress, context, changedBits, renderLanes);
        }
      }
  
      var newChildren = newProps.children;
      reconcileChildren(current, workInProgress, newChildren, renderLanes);
      return workInProgress.child;
    }
  
    function updateContextConsumer(current, workInProgress, renderLanes) {
      var context = workInProgress.type;
  
      var newProps = workInProgress.pendingProps;
      var render = newProps.children;
  
      prepareToReadContext(workInProgress, renderLanes);
      var newValue = readContext(context, newProps.unstable_observedBits);
      var newChildren;
  
      newChildren = render(newValue);
  
      workInProgress.flags |= PerformedWork;
      reconcileChildren(current, workInProgress, newChildren, renderLanes);
      return workInProgress.child;
    }
  
    function markWorkInProgressReceivedUpdate() {
      didReceiveUpdate = true;
    }
  
    function bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes) {
      if (current !== null) {
        workInProgress.dependencies = current.dependencies;
      }
  
      markSkippedUpdateLanes(workInProgress.lanes);
  
      // 根据子节点优先级决定是否应该跳过当前fiber
      if (!includesSomeLane(renderLanes, workInProgress.childLanes)) {
        return null;
      } else {
        cloneChildFibers(current, workInProgress);
        return workInProgress.child;
      }
    }
  
    function beginWork(current, workInProgress, renderLanes) {
      console.log("[beginWork]:", current, workInProgress);
      var updateLanes = workInProgress.lanes;
  
      if (current !== null) {
        var oldProps = current.memoizedProps;
        var newProps = workInProgress.pendingProps;
  
        if (oldProps !== newProps || hasContextChanged() || false) {
          didReceiveUpdate = true;
        } else if (!includesSomeLane(renderLanes, updateLanes)) {
          didReceiveUpdate = false;
  
          switch (workInProgress.tag) {
            case HostRoot:
              pushHostRootContext(workInProgress);
              resetHydrationState();
              break;
  
            case HostComponent:
              pushHostContext(workInProgress);
              break;
  
            case ClassComponent: {
              var Component = workInProgress.type;
  
              if (isContextProvider(Component)) {
                pushContextProvider(workInProgress);
              }
  
              break;
            }
  
            case HostPortal:
              pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
              break;
  
            case ContextProvider: {
              var newValue = workInProgress.memoizedProps.value;
              pushProvider(workInProgress, newValue);
              break;
            }
  
            case Profiler:
              break;
  
            case SuspenseComponent: {
              var state = workInProgress.memoizedState;
  
              if (state !== null) {
                var primaryChildFragment = workInProgress.child;
                var primaryChildLanes = primaryChildFragment.childLanes;
  
                if (includesSomeLane(renderLanes, primaryChildLanes)) {
                  return updateSuspenseComponent(current, workInProgress, renderLanes);
                } else {
                  pushSuspenseContext(workInProgress, setDefaultShallowSuspenseContext(suspenseStackCursor.current));
  
                  var child = bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  
                  if (child !== null) {
                    return child.sibling;
                  } else {
                    return null;
                  }
                }
              } else {
                pushSuspenseContext(workInProgress, setDefaultShallowSuspenseContext(suspenseStackCursor.current));
              }
  
              break;
            }
  
            case SuspenseListComponent: {
              var didSuspendBefore = (current.flags & DidCapture) !== NoFlags;
  
              var _hasChildWork = includesSomeLane(renderLanes, workInProgress.childLanes);
  
              if (didSuspendBefore) {
                if (_hasChildWork) {
                  return updateSuspenseListComponent(current, workInProgress, renderLanes);
                }
  
                workInProgress.flags |= DidCapture;
              }
  
              var renderState = workInProgress.memoizedState;
  
              if (renderState !== null) {
                renderState.rendering = null;
                renderState.tail = null;
                renderState.lastEffect = null;
              }
  
              pushSuspenseContext(workInProgress, suspenseStackCursor.current);
  
              if (_hasChildWork) {
                break;
              } else {
                return null;
              }
            }
  
            case OffscreenComponent:
            case LegacyHiddenComponent: {
              workInProgress.lanes = NoLanes;
              return updateOffscreenComponent(current, workInProgress, renderLanes);
            }
          }
  
          return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
        } else {
          if ((current.flags & ForceUpdateForLegacySuspense) !== NoFlags) {
            didReceiveUpdate = true;
          } else {
            didReceiveUpdate = false;
          }
        }
      } else {
        didReceiveUpdate = false;
      }
  
      workInProgress.lanes = NoLanes;
  
      switch (workInProgress.tag) {
        // 1. react的concurrent异步分片渲染模式下, 存在一个"最优先渲染"阶段负责处理优先级最高的任务
        //    在最优先渲染中, 如果遇到函数组件, react需要快速创建对应的fiber节点来表示该组件, 但是由于组件的执行结果未知
        //    所以在此阶段将函数组件的tag设置为IndeterminateComponent来表示不确定性, 这样可以继续进行后续优先级计算而无需等待函数组件的执行结果
        // 2. suspense的情况因为函数组件的渲染可能会被中断和延迟, 因此将其对应的fiber.tag设置成IndeterminateComponent标记不确定性
        case IndeterminateComponent: {
          return mountIndeterminateComponent(current, workInProgress, workInProgress.type, renderLanes);
        }
  
        case LazyComponent: {
          var elementType = workInProgress.elementType;
          return mountLazyComponent(current, workInProgress, elementType, updateLanes, renderLanes);
        }
  
        case FunctionComponent: {
          var _Component = workInProgress.type;
          var unresolvedProps = workInProgress.pendingProps;
          var resolvedProps =
            workInProgress.elementType === _Component
              ? unresolvedProps
              : resolveDefaultProps(_Component, unresolvedProps);
          return updateFunctionComponent(current, workInProgress, _Component, resolvedProps, renderLanes);
        }
  
        case ClassComponent: {
          var _Component2 = workInProgress.type;
          var _unresolvedProps = workInProgress.pendingProps;
  
          var _resolvedProps =
            workInProgress.elementType === _Component2
              ? _unresolvedProps
              : resolveDefaultProps(_Component2, _unresolvedProps);
  
          return updateClassComponent(current, workInProgress, _Component2, _resolvedProps, renderLanes);
        }
  
        case HostRoot:
          return updateHostRoot(current, workInProgress, renderLanes);
  
        case HostComponent:
          return updateHostComponent(current, workInProgress, renderLanes);
  
        case HostText:
          return updateHostText(current, workInProgress);
  
        case SuspenseComponent:
          return updateSuspenseComponent(current, workInProgress, renderLanes);
  
        case HostPortal:
          return updatePortalComponent(current, workInProgress, renderLanes);
  
        case ForwardRef: {
          var type = workInProgress.type;
          var _unresolvedProps2 = workInProgress.pendingProps;
  
          var _resolvedProps2 =
            workInProgress.elementType === type ? _unresolvedProps2 : resolveDefaultProps(type, _unresolvedProps2);
  
          return updateForwardRef(current, workInProgress, type, _resolvedProps2, renderLanes);
        }
  
        case Fragment:
          return updateFragment(current, workInProgress, renderLanes);
  
        case Mode:
          return updateMode(current, workInProgress, renderLanes);
  
        case Profiler:
          return updateProfiler(current, workInProgress, renderLanes);
  
        case ContextProvider:
          return updateContextProvider(current, workInProgress, renderLanes);
  
        case ContextConsumer:
          return updateContextConsumer(current, workInProgress, renderLanes);
  
        // 被React.memo包裹的组件
        case MemoComponent: {
          var _type2 = workInProgress.type;
          var _unresolvedProps3 = workInProgress.pendingProps;
  
          var _resolvedProps3 = resolveDefaultProps(_type2, _unresolvedProps3);
  
          _resolvedProps3 = resolveDefaultProps(_type2.type, _resolvedProps3);
          return updateMemoComponent(current, workInProgress, _type2, _resolvedProps3, updateLanes, renderLanes);
        }
  
        case SimpleMemoComponent: {
          return updateSimpleMemoComponent(
            current,
            workInProgress,
            workInProgress.type,
            workInProgress.pendingProps,
            updateLanes,
            renderLanes
          );
        }
  
        case IncompleteClassComponent: {
          var _Component3 = workInProgress.type;
          var _unresolvedProps4 = workInProgress.pendingProps;
  
          var _resolvedProps4 =
            workInProgress.elementType === _Component3
              ? _unresolvedProps4
              : resolveDefaultProps(_Component3, _unresolvedProps4);
  
          return mountIncompleteClassComponent(current, workInProgress, _Component3, _resolvedProps4, renderLanes);
        }
  
        case SuspenseListComponent: {
          return updateSuspenseListComponent(current, workInProgress, renderLanes);
        }
  
        case FundamentalComponent: {
          break;
        }
  
        case ScopeComponent: {
          break;
        }
  
        case Block: {
          break;
        }
  
        case OffscreenComponent: {
          return updateOffscreenComponent(current, workInProgress, renderLanes);
        }
  
        case LegacyHiddenComponent: {
          return updateLegacyHiddenComponent(current, workInProgress, renderLanes);
        }
      }
  
      throw Error(formatProdErrorMessage(156, workInProgress.tag));
    }
  
    function markUpdate(workInProgress) {
      workInProgress.flags |= Update;
    }
  
    function markRef$1(workInProgress) {
      workInProgress.flags |= Ref;
    }
  
    var appendAllChildren = function (parent, workInProgress) {
      var node = workInProgress.child;
  
      while (node !== null) {
        if (node.tag === HostComponent || node.tag === HostText) {
          appendInitialChild(parent, node.stateNode);
        } else if (node.tag === HostPortal);
        else if (node.child !== null) {
          node.child.return = node;
          node = node.child;
          continue;
        }
  
        if (node === workInProgress) {
          return;
        }
  
        while (node.sibling === null) {
          if (node.return === null || node.return === workInProgress) {
            return;
          }
  
          node = node.return;
        }
  
        node.sibling.return = node.return;
        node = node.sibling;
      }
    };
  
    var updateHostContainer = function () {};
  
    var updateHostComponent$1 = function (current, workInProgress, type, newProps) {
      var oldProps = current.memoizedProps;
  
      if (oldProps === newProps) {
        return;
      }
  
      var instance = workInProgress.stateNode;
  
      var updatePayload = prepareUpdate(instance, type, oldProps, newProps);
  
      workInProgress.updateQueue = updatePayload;
  
      if (updatePayload) {
        markUpdate(workInProgress);
      }
    };
  
    var updateHostText$1 = function (current, workInProgress, oldText, newText) {
      if (oldText !== newText) {
        markUpdate(workInProgress);
      }
    };
  
    function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
      if (getIsHydrating()) {
        return;
      }
  
      switch (renderState.tailMode) {
        case "hidden": {
          var tailNode = renderState.tail;
          var lastTailNode = null;
  
          while (tailNode !== null) {
            if (tailNode.alternate !== null) {
              lastTailNode = tailNode;
            }
  
            tailNode = tailNode.sibling;
          }
  
          if (lastTailNode === null) {
            renderState.tail = null;
          } else {
            lastTailNode.sibling = null;
          }
  
          break;
        }
  
        case "collapsed": {
          var _tailNode = renderState.tail;
          var _lastTailNode = null;
  
          while (_tailNode !== null) {
            if (_tailNode.alternate !== null) {
              _lastTailNode = _tailNode;
            }
  
            _tailNode = _tailNode.sibling;
          }
  
          if (_lastTailNode === null) {
            if (!hasRenderedATailFallback && renderState.tail !== null) {
              renderState.tail.sibling = null;
            } else {
              renderState.tail = null;
            }
          } else {
            _lastTailNode.sibling = null;
          }
  
          break;
        }
      }
    }
  
    function completeWork(current, workInProgress, renderLanes) {
      var newProps = workInProgress.pendingProps;
  
      switch (workInProgress.tag) {
        case IndeterminateComponent:
        case LazyComponent:
        case SimpleMemoComponent:
        case FunctionComponent:
        case ForwardRef:
        case Fragment:
        case Mode:
        case Profiler:
        case ContextConsumer:
        case MemoComponent:
          return null;
  
        case ClassComponent: {
          var Component = workInProgress.type;
  
          if (isContextProvider(Component)) {
            popContext();
          }
  
          return null;
        }
  
        case HostRoot: {
          popHostContainer();
          popTopLevelContextObject();
          resetWorkInProgressVersions();
          var fiberRoot = workInProgress.stateNode;
  
          if (fiberRoot.pendingContext) {
            fiberRoot.context = fiberRoot.pendingContext;
            fiberRoot.pendingContext = null;
          }
  
          if (current === null || current.child === null) {
            var wasHydrated = popHydrationState(workInProgress);
  
            if (wasHydrated) {
              markUpdate(workInProgress);
            } else if (!fiberRoot.hydrate) {
              workInProgress.flags |= Snapshot;
            }
          }
  
          updateHostContainer(workInProgress);
          return null;
        }
  
        case HostComponent: {
          popHostContext(workInProgress);
          var rootContainerInstance = getRootHostContainer();
          var type = workInProgress.type;
  
          if (current !== null && workInProgress.stateNode != null) {
            updateHostComponent$1(current, workInProgress, type, newProps, rootContainerInstance);
  
            if (current.ref !== workInProgress.ref) {
              markRef$1(workInProgress);
            }
          } else {
            if (!newProps) {
              if (!(workInProgress.stateNode !== null)) {
                {
                  throw Error(formatProdErrorMessage(166));
                }
              }
  
              return null;
            }
  
            var currentHostContext = getHostContext();
  
            var _wasHydrated = popHydrationState(workInProgress);
  
            if (_wasHydrated) {
              if (prepareToHydrateHostInstance(workInProgress, rootContainerInstance, currentHostContext)) {
                markUpdate(workInProgress);
              }
            } else {
              var instance = createInstance(type, newProps, rootContainerInstance, currentHostContext, workInProgress);
              appendAllChildren(instance, workInProgress, false, false);
              workInProgress.stateNode = instance;
  
              if (finalizeInitialChildren(instance, type, newProps, rootContainerInstance)) {
                markUpdate(workInProgress);
              }
            }
  
            if (workInProgress.ref !== null) {
              markRef$1(workInProgress);
            }
          }
  
          return null;
        }
  
        case HostText: {
          var newText = newProps;
  
          if (current && workInProgress.stateNode != null) {
            var oldText = current.memoizedProps;
  
            updateHostText$1(current, workInProgress, oldText, newText);
          } else {
            if (typeof newText !== "string") {
              if (!(workInProgress.stateNode !== null)) {
                {
                  throw Error(formatProdErrorMessage(166));
                }
              }
            }
  
            var _rootContainerInstance = getRootHostContainer();
  
            var _currentHostContext = getHostContext();
  
            var _wasHydrated2 = popHydrationState(workInProgress);
  
            if (_wasHydrated2) {
              if (prepareToHydrateHostTextInstance(workInProgress)) {
                markUpdate(workInProgress);
              }
            } else {
              workInProgress.stateNode = createTextInstance(
                newText,
                _rootContainerInstance,
                _currentHostContext,
                workInProgress
              );
            }
          }
  
          return null;
        }
  
        case SuspenseComponent: {
          popSuspenseContext();
          var nextState = workInProgress.memoizedState;
  
          if ((workInProgress.flags & DidCapture) !== NoFlags) {
            workInProgress.lanes = renderLanes;
  
            return workInProgress;
          }
  
          var nextDidTimeout = nextState !== null;
          var prevDidTimeout = false;
  
          if (current === null) {
            if (workInProgress.memoizedProps.fallback !== undefined) {
              popHydrationState(workInProgress);
            }
          } else {
            var prevState = current.memoizedState;
            prevDidTimeout = prevState !== null;
          }
  
          if (nextDidTimeout && !prevDidTimeout) {
            if ((workInProgress.mode & BlockingMode) !== NoMode) {
              var hasInvisibleChildContext =
                current === null && workInProgress.memoizedProps.unstable_avoidThisFallback !== true;
  
              if (
                hasInvisibleChildContext ||
                hasSuspenseContext(suspenseStackCursor.current, InvisibleParentSuspenseContext)
              ) {
                renderDidSuspend();
              } else {
                renderDidSuspendDelayIfPossible();
              }
            }
          }
  
          {
            if (nextDidTimeout || prevDidTimeout) {
              workInProgress.flags |= Update;
            }
          }
  
          return null;
        }
  
        case HostPortal:
          popHostContainer();
          updateHostContainer(workInProgress);
  
          if (current === null) {
            preparePortalMount(workInProgress.stateNode.containerInfo);
          }
  
          return null;
  
        case ContextProvider:
          popProvider(workInProgress);
          return null;
  
        case IncompleteClassComponent: {
          var _Component = workInProgress.type;
  
          if (isContextProvider(_Component)) {
            popContext();
          }
  
          return null;
        }
  
        case SuspenseListComponent: {
          popSuspenseContext();
          var renderState = workInProgress.memoizedState;
  
          if (renderState === null) {
            return null;
          }
  
          var didSuspendAlready = (workInProgress.flags & DidCapture) !== NoFlags;
          var renderedTail = renderState.rendering;
  
          if (renderedTail === null) {
            if (!didSuspendAlready) {
              var cannotBeSuspended =
                renderHasNotSuspendedYet() && (current === null || (current.flags & DidCapture) === NoFlags);
  
              if (!cannotBeSuspended) {
                var row = workInProgress.child;
  
                while (row !== null) {
                  var suspended = findFirstSuspended(row);
  
                  if (suspended !== null) {
                    didSuspendAlready = true;
                    workInProgress.flags |= DidCapture;
                    cutOffTailIfNeeded(renderState, false);
  
                    var newThennables = suspended.updateQueue;
  
                    if (newThennables !== null) {
                      workInProgress.updateQueue = newThennables;
                      workInProgress.flags |= Update;
                    }
  
                    if (renderState.lastEffect === null) {
                      workInProgress.firstEffect = null;
                    }
  
                    workInProgress.lastEffect = renderState.lastEffect;
  
                    resetChildFibers(workInProgress, renderLanes);
  
                    pushSuspenseContext(
                      workInProgress,
                      setShallowSuspenseContext(suspenseStackCursor.current, ForceSuspenseFallback)
                    );
                    return workInProgress.child;
                  }
  
                  row = row.sibling;
                }
              }
  
              if (renderState.tail !== null && now() > getRenderTargetTime()) {
                workInProgress.flags |= DidCapture;
                didSuspendAlready = true;
                cutOffTailIfNeeded(renderState, false);
  
                workInProgress.lanes = SomeRetryLane;
              }
            } else {
              cutOffTailIfNeeded(renderState, false);
            }
          } else {
            if (!didSuspendAlready) {
              var _suspended = findFirstSuspended(renderedTail);
  
              if (_suspended !== null) {
                workInProgress.flags |= DidCapture;
                didSuspendAlready = true;
  
                var _newThennables = _suspended.updateQueue;
  
                if (_newThennables !== null) {
                  workInProgress.updateQueue = _newThennables;
                  workInProgress.flags |= Update;
                }
  
                cutOffTailIfNeeded(renderState, true);
  
                if (
                  renderState.tail === null &&
                  renderState.tailMode === "hidden" &&
                  !renderedTail.alternate &&
                  !getIsHydrating()
                ) {
                  var lastEffect = (workInProgress.lastEffect = renderState.lastEffect);
  
                  if (lastEffect !== null) {
                    lastEffect.nextEffect = null;
                  }
  
                  return null;
                }
              } else if (
                now() * 2 - renderState.renderingStartTime > getRenderTargetTime() &&
                renderLanes !== OffscreenLane
              ) {
                workInProgress.flags |= DidCapture;
                didSuspendAlready = true;
                cutOffTailIfNeeded(renderState, false);
  
                workInProgress.lanes = SomeRetryLane;
              }
            }
  
            if (renderState.isBackwards) {
              renderedTail.sibling = workInProgress.child;
              workInProgress.child = renderedTail;
            } else {
              var previousSibling = renderState.last;
  
              if (previousSibling !== null) {
                previousSibling.sibling = renderedTail;
              } else {
                workInProgress.child = renderedTail;
              }
  
              renderState.last = renderedTail;
            }
          }
  
          if (renderState.tail !== null) {
            var next = renderState.tail;
            renderState.rendering = next;
            renderState.tail = next.sibling;
            renderState.lastEffect = workInProgress.lastEffect;
            renderState.renderingStartTime = now();
            next.sibling = null;
  
            var suspenseContext = suspenseStackCursor.current;
  
            if (didSuspendAlready) {
              suspenseContext = setShallowSuspenseContext(suspenseContext, ForceSuspenseFallback);
            } else {
              suspenseContext = setDefaultShallowSuspenseContext(suspenseContext);
            }
  
            pushSuspenseContext(workInProgress, suspenseContext);
  
            return next;
          }
  
          return null;
        }
  
        case FundamentalComponent: {
          break;
        }
  
        case ScopeComponent: {
          break;
        }
  
        case Block:
          break;
  
        case OffscreenComponent:
        case LegacyHiddenComponent: {
          popRenderLanes();
  
          if (current !== null) {
            var _nextState = workInProgress.memoizedState;
            var _prevState = current.memoizedState;
            var prevIsHidden = _prevState !== null;
            var nextIsHidden = _nextState !== null;
  
            if (prevIsHidden !== nextIsHidden && newProps.mode !== "unstable-defer-without-hiding") {
              workInProgress.flags |= Update;
            }
          }
  
          return null;
        }
      }
  
      throw Error(formatProdErrorMessage(156, workInProgress.tag));
    }
  
    /** 处理中断或终止正在进行工作的fiber单元 */
    function unwindWork(workInProgress) {
      switch (workInProgress.tag) {
        case ClassComponent: {
          var Component = workInProgress.type;
  
          if (isContextProvider(Component)) {
            popContext();
          }
  
          var flags = workInProgress.flags;
  
          if (flags & ShouldCapture) {
            workInProgress.flags = (flags & ~ShouldCapture) | DidCapture;
  
            return workInProgress;
          }
  
          return null;
        }
  
        case HostRoot: {
          popHostContainer();
          popTopLevelContextObject();
          resetWorkInProgressVersions();
          var _flags = workInProgress.flags;
  
          if (!((_flags & DidCapture) === NoFlags)) {
            {
              throw Error(formatProdErrorMessage(285));
            }
          }
  
          workInProgress.flags = (_flags & ~ShouldCapture) | DidCapture;
          return workInProgress;
        }
  
        case HostComponent: {
          popHostContext(workInProgress);
          return null;
        }
  
        case SuspenseComponent: {
          popSuspenseContext();
  
          var _flags2 = workInProgress.flags;
  
          if (_flags2 & ShouldCapture) {
            workInProgress.flags = (_flags2 & ~ShouldCapture) | DidCapture;
  
            return workInProgress;
          }
  
          return null;
        }
  
        case SuspenseListComponent: {
          popSuspenseContext();
  
          return null;
        }
  
        case HostPortal:
          popHostContainer();
          return null;
  
        case ContextProvider:
          popProvider(workInProgress);
          return null;
  
        case OffscreenComponent:
        case LegacyHiddenComponent:
          popRenderLanes();
          return null;
  
        default:
          return null;
      }
    }
  
    function unwindInterruptedWork(interruptedWork) {
      switch (interruptedWork.tag) {
        case ClassComponent: {
          var childContextTypes = interruptedWork.type.childContextTypes;
  
          if (childContextTypes !== null && childContextTypes !== undefined) {
            popContext();
          }
  
          break;
        }
  
        case HostRoot: {
          popHostContainer();
          popTopLevelContextObject();
          resetWorkInProgressVersions();
          break;
        }
  
        case HostComponent: {
          popHostContext(interruptedWork);
          break;
        }
  
        case HostPortal:
          popHostContainer();
          break;
  
        case SuspenseComponent:
          popSuspenseContext();
          break;
  
        case SuspenseListComponent:
          popSuspenseContext();
          break;
  
        case ContextProvider:
          popProvider(interruptedWork);
          break;
  
        case OffscreenComponent:
        case LegacyHiddenComponent:
          popRenderLanes();
          break;
      }
    }
  
    function createCapturedValue(value, source) {
      return {
        value: value,
        source: source,
        stack: getStackByFiberInDevAndProd(source),
      };
    }
  
    function showErrorDialog(boundary, errorInfo) {
      return true;
    }
  
    function logCapturedError(boundary, errorInfo) {
      try {
        var logError = showErrorDialog(boundary, errorInfo);
  
        if (logError === false) {
          return;
        }
  
        var error = errorInfo.value;
  
        if (false) {
          var source = errorInfo.source;
          var stack = errorInfo.stack;
          var componentStack = stack !== null ? stack : "";
  
          if (error != null && error._suppressLogging) {
            if (boundary.tag === ClassComponent) {
              return;
            }
  
            console["error"](error);
          }
  
          var componentName = source ? getComponentName(source.type) : null;
          var componentNameMessage = componentName
            ? "The above error occurred in the <" + componentName + "> component:"
            : "The above error occurred in one of your React components:";
          var errorBoundaryMessage;
          var errorBoundaryName = getComponentName(boundary.type);
  
          if (errorBoundaryName) {
            errorBoundaryMessage =
              "React will try to recreate this component tree from scratch " +
              ("using the error boundary you provided, " + errorBoundaryName + ".");
          } else {
            errorBoundaryMessage =
              "Consider adding an error boundary to your tree to customize error handling behavior.\n" +
              "Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.";
          }
  
          var combinedMessage = componentNameMessage + "\n" + componentStack + "\n\n" + ("" + errorBoundaryMessage);
  
          console["error"](combinedMessage);
        } else {
          console["error"](error);
        }
      } catch (e) {
        setTimeout(function () {
          throw e;
        });
      }
    }
  
    var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
  
    function createRootErrorUpdate(fiber, errorInfo, lane) {
      var update = createUpdate(NoTimestamp, lane);
  
      update.tag = CaptureUpdate;
  
      update.payload = {
        element: null,
      };
      var error = errorInfo.value;
  
      update.callback = function () {
        onUncaughtError(error);
        logCapturedError(fiber, errorInfo);
      };
  
      return update;
    }
  
    function createClassErrorUpdate(fiber, errorInfo, lane) {
      var update = createUpdate(NoTimestamp, lane);
      update.tag = CaptureUpdate;
      var getDerivedStateFromError = fiber.type.getDerivedStateFromError;
  
      if (typeof getDerivedStateFromError === "function") {
        var error = errorInfo.value;
  
        update.payload = function () {
          logCapturedError(fiber, errorInfo);
          return getDerivedStateFromError(error);
        };
      }
  
      var inst = fiber.stateNode;
  
      if (inst !== null && typeof inst.componentDidCatch === "function") {
        update.callback = function callback() {
          if (typeof getDerivedStateFromError !== "function") {
            markLegacyErrorBoundaryAsFailed(this);
  
            logCapturedError(fiber, errorInfo);
          }
  
          var error = errorInfo.value;
          var stack = errorInfo.stack;
          this.componentDidCatch(error, {
            componentStack: stack !== null ? stack : "",
          });
        };
      }
  
      return update;
    }
  
    function attachPingListener(root, wakeable, lanes) {
      var pingCache = root.pingCache;
      var threadIDs;
  
      if (pingCache === null) {
        pingCache = root.pingCache = new PossiblyWeakMap();
        threadIDs = new Set();
        pingCache.set(wakeable, threadIDs);
      } else {
        threadIDs = pingCache.get(wakeable);
  
        if (threadIDs === undefined) {
          threadIDs = new Set();
          pingCache.set(wakeable, threadIDs);
        }
      }
  
      if (!threadIDs.has(lanes)) {
        threadIDs.add(lanes);
        var ping = pingSuspendedRoot.bind(null, root, wakeable, lanes);
        wakeable.then(ping, ping);
      }
    }
  
    function throwException(root, returnFiber, sourceFiber, value, rootRenderLanes) {
      sourceFiber.flags |= Incomplete;
  
      sourceFiber.firstEffect = sourceFiber.lastEffect = null;
  
      if (value !== null && typeof value === "object" && typeof value.then === "function") {
        var wakeable = value;
  
        if ((sourceFiber.mode & BlockingMode) === NoMode) {
          var currentSource = sourceFiber.alternate;
  
          if (currentSource) {
            sourceFiber.updateQueue = currentSource.updateQueue;
            sourceFiber.memoizedState = currentSource.memoizedState;
            sourceFiber.lanes = currentSource.lanes;
          } else {
            sourceFiber.updateQueue = null;
            sourceFiber.memoizedState = null;
          }
        }
  
        var hasInvisibleParentBoundary = hasSuspenseContext(suspenseStackCursor.current, InvisibleParentSuspenseContext);
  
        var _workInProgress = returnFiber;
  
        do {
          if (
            _workInProgress.tag === SuspenseComponent &&
            shouldCaptureSuspense(_workInProgress, hasInvisibleParentBoundary)
          ) {
            var wakeables = _workInProgress.updateQueue;
  
            if (wakeables === null) {
              var updateQueue = new Set();
              updateQueue.add(wakeable);
              _workInProgress.updateQueue = updateQueue;
            } else {
              wakeables.add(wakeable);
            }
  
            if ((_workInProgress.mode & BlockingMode) === NoMode) {
              _workInProgress.flags |= DidCapture;
              sourceFiber.flags |= ForceUpdateForLegacySuspense;
  
              sourceFiber.flags &= ~(LifecycleEffectMask | Incomplete);
  
              if (sourceFiber.tag === ClassComponent) {
                var currentSourceFiber = sourceFiber.alternate;
  
                if (currentSourceFiber === null) {
                  sourceFiber.tag = IncompleteClassComponent;
                } else {
                  var update = createUpdate(NoTimestamp, SyncLane);
                  update.tag = ForceUpdate;
                  enqueueUpdate(sourceFiber, update);
                }
              }
  
              sourceFiber.lanes = mergeLanes(sourceFiber.lanes, SyncLane);
  
              return;
            }
  
            attachPingListener(root, wakeable, rootRenderLanes);
            _workInProgress.flags |= ShouldCapture;
            _workInProgress.lanes = rootRenderLanes;
            return;
          }
  
          _workInProgress = _workInProgress.return;
        } while (_workInProgress !== null);
  
        value = new Error(
          (getComponentName(sourceFiber.type) || "A React component") +
            " suspended while rendering, but no fallback UI was specified.\n" +
            "\n" +
            "Add a <Suspense fallback=...> component higher in the tree to " +
            "provide a loading indicator or placeholder to display."
        );
      }
  
      renderDidError();
      value = createCapturedValue(value, sourceFiber);
      var workInProgress = returnFiber;
  
      do {
        switch (workInProgress.tag) {
          case HostRoot: {
            var _errorInfo = value;
            workInProgress.flags |= ShouldCapture;
            var lane = pickArbitraryLane(rootRenderLanes);
            workInProgress.lanes = mergeLanes(workInProgress.lanes, lane);
  
            var _update = createRootErrorUpdate(workInProgress, _errorInfo, lane);
  
            enqueueCapturedUpdate(workInProgress, _update);
            return;
          }
  
          case ClassComponent:
            var errorInfo = value;
            var ctor = workInProgress.type;
            var instance = workInProgress.stateNode;
  
            if (
              (workInProgress.flags & DidCapture) === NoFlags &&
              (typeof ctor.getDerivedStateFromError === "function" ||
                (instance !== null &&
                  typeof instance.componentDidCatch === "function" &&
                  !isAlreadyFailedLegacyErrorBoundary(instance)))
            ) {
              workInProgress.flags |= ShouldCapture;
  
              var _lane = pickArbitraryLane(rootRenderLanes);
  
              workInProgress.lanes = mergeLanes(workInProgress.lanes, _lane);
  
              var _update2 = createClassErrorUpdate(workInProgress, errorInfo, _lane);
  
              enqueueCapturedUpdate(workInProgress, _update2);
              return;
            }
  
            break;
        }
  
        workInProgress = workInProgress.return;
      } while (workInProgress !== null);
    }
  
    var PossiblyWeakSet = typeof WeakSet === "function" ? WeakSet : Set;
  
    var callComponentWillUnmountWithTimer = function (current, instance) {
      instance.props = current.memoizedProps;
      instance.state = current.memoizedState;
  
      {
        instance.componentWillUnmount();
      }
    };
  
    function safelyCallComponentWillUnmount(current, instance) {
      try {
        callComponentWillUnmountWithTimer(current, instance);
      } catch (unmountError) {
        captureCommitPhaseError(current, unmountError);
      }
    }
  
    function safelyDetachRef(current) {
      var ref = current.ref;
  
      if (ref !== null) {
        if (typeof ref === "function") {
          {
            try {
              ref(null);
            } catch (refError) {
              captureCommitPhaseError(current, refError);
            }
          }
        } else {
          ref.current = null;
        }
      }
    }
  
    function safelyCallDestroy(current, destroy) {
      {
        try {
          destroy();
        } catch (error) {
          captureCommitPhaseError(current, error);
        }
      }
    }
  
    function commitBeforeMutationLifeCycles(current, finishedWork) {
      switch (finishedWork.tag) {
        case FunctionComponent:
        case ForwardRef:
        case SimpleMemoComponent:
        case Block: {
          return;
        }
  
        case ClassComponent: {
          if (finishedWork.flags & Snapshot) {
            if (current !== null) {
              var prevProps = current.memoizedProps;
              var prevState = current.memoizedState;
              var instance = finishedWork.stateNode;
  
              var snapshot = instance.getSnapshotBeforeUpdate(
                finishedWork.elementType === finishedWork.type
                  ? prevProps
                  : resolveDefaultProps(finishedWork.type, prevProps),
                prevState
              );
  
              instance.__reactInternalSnapshotBeforeUpdate = snapshot;
            }
          }
  
          return;
        }
  
        case HostRoot: {
          {
            if (finishedWork.flags & Snapshot) {
              var root = finishedWork.stateNode;
              clearContainer(root.containerInfo);
            }
          }
  
          return;
        }
  
        case HostComponent:
        case HostText:
        case HostPortal:
        case IncompleteClassComponent:
          return;
      }
  
      {
        {
          throw Error(formatProdErrorMessage(163));
        }
      }
    }
  
    function commitHookEffectListUnmount(tag, finishedWork) {
      var updateQueue = finishedWork.updateQueue;
      var lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  
      if (lastEffect !== null) {
        var firstEffect = lastEffect.next;
        var effect = firstEffect;
  
        do {
          if ((effect.tag & tag) === tag) {
            var destroy = effect.destroy;
            effect.destroy = undefined;
  
            if (destroy !== undefined) {
              destroy();
            }
          }
  
          effect = effect.next;
        } while (effect !== firstEffect);
      }
    }
  
    function commitHookEffectListMount(tag, finishedWork) {
      var updateQueue = finishedWork.updateQueue;
      var lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  
      if (lastEffect !== null) {
        var firstEffect = lastEffect.next;
        var effect = firstEffect;
  
        do {
          if ((effect.tag & tag) === tag) {
            var create = effect.create;
            effect.destroy = create();
          }
  
          effect = effect.next;
        } while (effect !== firstEffect);
      }
    }
  
    function schedulePassiveEffects(finishedWork) {
      var updateQueue = finishedWork.updateQueue;
      var lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  
      if (lastEffect !== null) {
        var firstEffect = lastEffect.next;
        var effect = firstEffect;
  
        // 循环effect链表, 将unmount, mount添加进effect队列
        do {
          var _effect = effect,
            next = _effect.next,
            tag = _effect.tag;
  
          if ((tag & Passive$1) !== NoFlags$1 && (tag & HasEffect) !== NoFlags$1) {
            enqueuePendingPassiveHookEffectUnmount(finishedWork, effect);
            enqueuePendingPassiveHookEffectMount(finishedWork, effect);
          }
  
          effect = next;
        } while (effect !== firstEffect);
      }
    }
  
    function commitLifeCycles(finishedRoot, current, finishedWork) {
      switch (finishedWork.tag) {
        case FunctionComponent:
        case ForwardRef:
        case SimpleMemoComponent:
        case Block: {
          commitHookEffectListMount(Layout | HasEffect, finishedWork);
          // 调度effect
          schedulePassiveEffects(finishedWork);
          return;
        }
  
        case ClassComponent: {
          var instance = finishedWork.stateNode;
  
          if (finishedWork.flags & Update) {
            if (current === null) {
              {
                instance.componentDidMount();
              }
            } else {
              var prevProps =
                finishedWork.elementType === finishedWork.type
                  ? current.memoizedProps
                  : resolveDefaultProps(finishedWork.type, current.memoizedProps);
              var prevState = current.memoizedState;
  
              {
                instance.componentDidUpdate(prevProps, prevState, instance.__reactInternalSnapshotBeforeUpdate);
              }
            }
          }
  
          var updateQueue = finishedWork.updateQueue;
  
          if (updateQueue !== null) {
            commitUpdateQueue(finishedWork, updateQueue, instance);
          }
  
          return;
        }
  
        case HostRoot: {
          var _updateQueue = finishedWork.updateQueue;
  
          if (_updateQueue !== null) {
            var _instance = null;
  
            if (finishedWork.child !== null) {
              switch (finishedWork.child.tag) {
                case HostComponent:
                  _instance = getPublicInstance(finishedWork.child.stateNode);
                  break;
  
                case ClassComponent:
                  _instance = finishedWork.child.stateNode;
                  break;
              }
            }
  
            commitUpdateQueue(finishedWork, _updateQueue, _instance);
          }
  
          return;
        }
  
        case HostComponent: {
          var _instance2 = finishedWork.stateNode;
  
          if (current === null && finishedWork.flags & Update) {
            var type = finishedWork.type;
            var props = finishedWork.memoizedProps;
            commitMount(_instance2, type, props);
          }
  
          return;
        }
  
        case HostText: {
          return;
        }
  
        case HostPortal: {
          return;
        }
  
        case Profiler: {
          return;
        }
  
        case SuspenseComponent: {
          commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
          return;
        }
  
        case SuspenseListComponent:
        case IncompleteClassComponent:
        case FundamentalComponent:
        case ScopeComponent:
        case OffscreenComponent:
        case LegacyHiddenComponent:
          return;
      }
  
      {
        {
          throw Error(formatProdErrorMessage(163));
        }
      }
    }
  
    function hideOrUnhideAllChildren(finishedWork, isHidden) {
      {
        var node = finishedWork;
  
        while (true) {
          if (node.tag === HostComponent) {
            var instance = node.stateNode;
  
            if (isHidden) {
              hideInstance(instance);
            } else {
              unhideInstance(node.stateNode, node.memoizedProps);
            }
          } else if (node.tag === HostText) {
            var _instance3 = node.stateNode;
  
            if (isHidden) {
              hideTextInstance(_instance3);
            } else {
              unhideTextInstance(_instance3, node.memoizedProps);
            }
          } else if (
            (node.tag === OffscreenComponent || node.tag === LegacyHiddenComponent) &&
            node.memoizedState !== null &&
            node !== finishedWork
          );
          else if (node.child !== null) {
            node.child.return = node;
            node = node.child;
            continue;
          }
  
          if (node === finishedWork) {
            return;
          }
  
          while (node.sibling === null) {
            if (node.return === null || node.return === finishedWork) {
              return;
            }
  
            node = node.return;
          }
  
          node.sibling.return = node.return;
          node = node.sibling;
        }
      }
    }
  
    function commitAttachRef(finishedWork) {
      var ref = finishedWork.ref;
  
      if (ref !== null) {
        var instance = finishedWork.stateNode;
        var instanceToUse;
  
        switch (finishedWork.tag) {
          case HostComponent:
            instanceToUse = getPublicInstance(instance);
            break;
  
          default:
            instanceToUse = instance;
        }
  
        if (typeof ref === "function") {
          ref(instanceToUse);
        } else {
          ref.current = instanceToUse;
        }
      }
    }
  
    function commitDetachRef(current) {
      var currentRef = current.ref;
  
      if (currentRef !== null) {
        if (typeof currentRef === "function") {
          currentRef(null);
        } else {
          currentRef.current = null;
        }
      }
    }
  
    function commitUnmount(finishedRoot, current) {
      onCommitUnmount(current);
  
      switch (current.tag) {
        case FunctionComponent:
        case ForwardRef:
        case MemoComponent:
        case SimpleMemoComponent:
        case Block: {
          var updateQueue = current.updateQueue;
  
          if (updateQueue !== null) {
            var lastEffect = updateQueue.lastEffect;
  
            if (lastEffect !== null) {
              var firstEffect = lastEffect.next;
              var effect = firstEffect;
  
              do {
                var _effect2 = effect,
                  destroy = _effect2.destroy,
                  tag = _effect2.tag;
  
                if (destroy !== undefined) {
                  if ((tag & Passive$1) !== NoFlags$1) {
                    enqueuePendingPassiveHookEffectUnmount(current, effect);
                  } else {
                    {
                      safelyCallDestroy(current, destroy);
                    }
                  }
                }
  
                effect = effect.next;
              } while (effect !== firstEffect);
            }
          }
  
          return;
        }
  
        case ClassComponent: {
          safelyDetachRef(current);
          var instance = current.stateNode;
  
          if (typeof instance.componentWillUnmount === "function") {
            safelyCallComponentWillUnmount(current, instance);
          }
  
          return;
        }
  
        case HostComponent: {
          safelyDetachRef(current);
          return;
        }
  
        case HostPortal: {
          {
            unmountHostComponents(finishedRoot, current);
          }
  
          return;
        }
  
        case FundamentalComponent: {
          return;
        }
  
        case DehydratedFragment: {
          return;
        }
  
        case ScopeComponent: {
          return;
        }
      }
    }
  
    function commitNestedUnmounts(finishedRoot, root) {
      var node = root;
  
      while (true) {
        commitUnmount(finishedRoot, node);
  
        if (node.child !== null && node.tag !== HostPortal) {
          node.child.return = node;
          node = node.child;
          continue;
        }
  
        if (node === root) {
          return;
        }
  
        while (node.sibling === null) {
          if (node.return === null || node.return === root) {
            return;
          }
  
          node = node.return;
        }
  
        node.sibling.return = node.return;
        node = node.sibling;
      }
    }
  
    function detachFiberMutation(fiber) {
      fiber.alternate = null;
      fiber.child = null;
      fiber.dependencies = null;
      fiber.firstEffect = null;
      fiber.lastEffect = null;
      fiber.memoizedProps = null;
      fiber.memoizedState = null;
      fiber.pendingProps = null;
      fiber.return = null;
      fiber.updateQueue = null;
    }
  
    function getHostParentFiber(fiber) {
      var parent = fiber.return;
  
      while (parent !== null) {
        if (isHostParent(parent)) {
          return parent;
        }
  
        parent = parent.return;
      }
  
      {
        {
          throw Error(formatProdErrorMessage(160));
        }
      }
    }
  
    function isHostParent(fiber) {
      return fiber.tag === HostComponent || fiber.tag === HostRoot || fiber.tag === HostPortal;
    }
  
    function getHostSibling(fiber) {
      var node = fiber;
  
      siblings: while (true) {
        while (node.sibling === null) {
          if (node.return === null || isHostParent(node.return)) {
            return null;
          }
  
          node = node.return;
        }
  
        node.sibling.return = node.return;
        node = node.sibling;
  
        while (node.tag !== HostComponent && node.tag !== HostText && node.tag !== DehydratedFragment) {
          if (node.flags & Placement) {
            continue siblings;
          }
  
          if (node.child === null || node.tag === HostPortal) {
            continue siblings;
          } else {
            node.child.return = node;
            node = node.child;
          }
        }
  
        if (!(node.flags & Placement)) {
          return node.stateNode;
        }
      }
    }
  
    function commitPlacement(finishedWork) {
      var parentFiber = getHostParentFiber(finishedWork);
  
      var parent;
      var isContainer;
      var parentStateNode = parentFiber.stateNode;
  
      switch (parentFiber.tag) {
        case HostComponent:
          parent = parentStateNode;
          isContainer = false;
          break;
  
        case HostRoot:
          parent = parentStateNode.containerInfo;
          isContainer = true;
          break;
  
        case HostPortal:
          parent = parentStateNode.containerInfo;
          isContainer = true;
          break;
  
        case FundamentalComponent:
  
        default: {
          {
            throw Error(formatProdErrorMessage(161));
          }
        }
      }
  
      if (parentFiber.flags & ContentReset) {
        resetTextContent(parent);
  
        parentFiber.flags &= ~ContentReset;
      }
  
      var before = getHostSibling(finishedWork);
  
      if (isContainer) {
        insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
      } else {
        insertOrAppendPlacementNode(finishedWork, before, parent);
      }
    }
  
    function insertOrAppendPlacementNodeIntoContainer(node, before, parent) {
      var tag = node.tag;
      var isHost = tag === HostComponent || tag === HostText;
  
      if (isHost || enableFundamentalAPI) {
        var stateNode = isHost ? node.stateNode : node.stateNode.instance;
  
        if (before) {
          insertInContainerBefore(parent, stateNode, before);
        } else {
          appendChildToContainer(parent, stateNode);
        }
      } else if (tag === HostPortal);
      else {
        var child = node.child;
  
        if (child !== null) {
          insertOrAppendPlacementNodeIntoContainer(child, before, parent);
          var sibling = child.sibling;
  
          while (sibling !== null) {
            insertOrAppendPlacementNodeIntoContainer(sibling, before, parent);
            sibling = sibling.sibling;
          }
        }
      }
    }
  
    function insertOrAppendPlacementNode(node, before, parent) {
      var tag = node.tag;
      var isHost = tag === HostComponent || tag === HostText;
  
      if (isHost || enableFundamentalAPI) {
        var stateNode = isHost ? node.stateNode : node.stateNode.instance;
  
        if (before) {
          insertBefore(parent, stateNode, before);
        } else {
          appendChild(parent, stateNode);
        }
      } else if (tag === HostPortal);
      else {
        var child = node.child;
  
        if (child !== null) {
          insertOrAppendPlacementNode(child, before, parent);
          var sibling = child.sibling;
  
          while (sibling !== null) {
            insertOrAppendPlacementNode(sibling, before, parent);
            sibling = sibling.sibling;
          }
        }
      }
    }
  
    function unmountHostComponents(finishedRoot, current) {
      var node = current;
  
      var currentParentIsValid = false;
  
      var currentParent;
      var currentParentIsContainer;
  
      while (true) {
        if (!currentParentIsValid) {
          var parent = node.return;
  
          findParent: while (true) {
            if (!(parent !== null)) {
              {
                throw Error(formatProdErrorMessage(160));
              }
            }
  
            var parentStateNode = parent.stateNode;
  
            switch (parent.tag) {
              case HostComponent:
                currentParent = parentStateNode;
                currentParentIsContainer = false;
                break findParent;
  
              case HostRoot:
                currentParent = parentStateNode.containerInfo;
                currentParentIsContainer = true;
                break findParent;
  
              case HostPortal:
                currentParent = parentStateNode.containerInfo;
                currentParentIsContainer = true;
                break findParent;
            }
  
            parent = parent.return;
          }
  
          currentParentIsValid = true;
        }
  
        if (node.tag === HostComponent || node.tag === HostText) {
          commitNestedUnmounts(finishedRoot, node);
  
          if (currentParentIsContainer) {
            removeChildFromContainer(currentParent, node.stateNode);
          } else {
            removeChild(currentParent, node.stateNode);
          }
        } else if (node.tag === HostPortal) {
          if (node.child !== null) {
            currentParent = node.stateNode.containerInfo;
            currentParentIsContainer = true;
  
            node.child.return = node;
            node = node.child;
            continue;
          }
        } else {
          commitUnmount(finishedRoot, node);
  
          if (node.child !== null) {
            node.child.return = node;
            node = node.child;
            continue;
          }
        }
  
        if (node === current) {
          return;
        }
  
        while (node.sibling === null) {
          if (node.return === null || node.return === current) {
            return;
          }
  
          node = node.return;
  
          if (node.tag === HostPortal) {
            currentParentIsValid = false;
          }
        }
  
        node.sibling.return = node.return;
        node = node.sibling;
      }
    }
  
    function commitDeletion(finishedRoot, current) {
      {
        unmountHostComponents(finishedRoot, current);
      }
  
      var alternate = current.alternate;
      detachFiberMutation(current);
  
      if (alternate !== null) {
        detachFiberMutation(alternate);
      }
    }
  
    function commitWork(current, finishedWork) {
      switch (finishedWork.tag) {
        case FunctionComponent:
        case ForwardRef:
        case MemoComponent:
        case SimpleMemoComponent:
        case Block: {
          {
            commitHookEffectListUnmount(Layout | HasEffect, finishedWork);
          }
  
          return;
        }
  
        case ClassComponent: {
          return;
        }
  
        case HostComponent: {
          var instance = finishedWork.stateNode;
  
          if (instance != null) {
            var newProps = finishedWork.memoizedProps;
  
            var oldProps = current !== null ? current.memoizedProps : newProps;
            var type = finishedWork.type;
  
            var updatePayload = finishedWork.updateQueue;
            finishedWork.updateQueue = null;
  
            if (updatePayload !== null) {
              commitUpdate(instance, updatePayload, type, oldProps, newProps);
            }
          }
  
          return;
        }
  
        case HostText: {
          if (!(finishedWork.stateNode !== null)) {
            {
              throw Error(formatProdErrorMessage(162));
            }
          }
  
          var textInstance = finishedWork.stateNode;
          var newText = finishedWork.memoizedProps;
  
          var oldText = current !== null ? current.memoizedProps : newText;
          commitTextUpdate(textInstance, oldText, newText);
          return;
        }
  
        case HostRoot: {
          {
            var _root = finishedWork.stateNode;
  
            if (_root.hydrate) {
              _root.hydrate = false;
              commitHydratedContainer(_root.containerInfo);
            }
          }
  
          return;
        }
  
        case Profiler: {
          return;
        }
  
        case SuspenseComponent: {
          commitSuspenseComponent(finishedWork);
          attachSuspenseRetryListeners(finishedWork);
          return;
        }
  
        case SuspenseListComponent: {
          attachSuspenseRetryListeners(finishedWork);
          return;
        }
  
        case IncompleteClassComponent: {
          return;
        }
  
        case FundamentalComponent: {
          break;
        }
  
        case ScopeComponent: {
          break;
        }
  
        case OffscreenComponent:
        case LegacyHiddenComponent: {
          var newState = finishedWork.memoizedState;
          var isHidden = newState !== null;
          hideOrUnhideAllChildren(finishedWork, isHidden);
          return;
        }
      }
  
      {
        {
          throw Error(formatProdErrorMessage(163));
        }
      }
    }
  
    function commitSuspenseComponent(finishedWork) {
      var newState = finishedWork.memoizedState;
  
      if (newState !== null) {
        markCommitTimeOfFallback();
  
        {
          var primaryChildParent = finishedWork.child;
          hideOrUnhideAllChildren(primaryChildParent, true);
        }
      }
    }
  
    function commitSuspenseHydrationCallbacks(finishedRoot, finishedWork) {
      var newState = finishedWork.memoizedState;
  
      if (newState === null) {
        var current = finishedWork.alternate;
  
        if (current !== null) {
          var prevState = current.memoizedState;
  
          if (prevState !== null) {
            var suspenseInstance = prevState.dehydrated;
  
            if (suspenseInstance !== null) {
              commitHydratedSuspenseInstance(suspenseInstance);
            }
          }
        }
      }
    }
  
    function attachSuspenseRetryListeners(finishedWork) {
      var wakeables = finishedWork.updateQueue;
  
      if (wakeables !== null) {
        finishedWork.updateQueue = null;
        var retryCache = finishedWork.stateNode;
  
        if (retryCache === null) {
          retryCache = finishedWork.stateNode = new PossiblyWeakSet();
        }
  
        wakeables.forEach(function (wakeable) {
          var retry = resolveRetryWakeable.bind(null, finishedWork, wakeable);
  
          if (!retryCache.has(wakeable)) {
            retryCache.add(wakeable);
            wakeable.then(retry, retry);
          }
        });
      }
    }
  
    function isSuspenseBoundaryBeingHidden(current, finishedWork) {
      if (current !== null) {
        var oldState = current.memoizedState;
  
        if (oldState === null || oldState.dehydrated !== null) {
          var newState = finishedWork.memoizedState;
          return newState !== null && newState.dehydrated === null;
        }
      }
  
      return false;
    }
  
    function commitResetTextContent(current) {
      resetTextContent(current.stateNode);
    }
  
    var COMPONENT_TYPE = 0;
    var HAS_PSEUDO_CLASS_TYPE = 1;
    var ROLE_TYPE = 2;
    var TEST_NAME_TYPE = 3;
    var TEXT_TYPE = 4;
  
    if (typeof Symbol === "function" && Symbol.for) {
      var symbolFor$1 = Symbol.for;
      COMPONENT_TYPE = symbolFor$1("selector.component");
      HAS_PSEUDO_CLASS_TYPE = symbolFor$1("selector.has_pseudo_class");
      ROLE_TYPE = symbolFor$1("selector.role");
      TEST_NAME_TYPE = symbolFor$1("selector.test_id");
      TEXT_TYPE = symbolFor$1("selector.text");
    }
  
    var ceil = Math.ceil;
    var ReactCurrentDispatcher$2 = ReactSharedInternals.ReactCurrentDispatcher,
      ReactCurrentOwner$2 = ReactSharedInternals.ReactCurrentOwner;
    var NoContext = 0;
    var BatchedContext = 1;
    var EventContext = 2;
    var DiscreteEventContext = 4;
    var LegacyUnbatchedContext = 8;
    var RenderContext = 16;
    var CommitContext = 32;
    var RetryAfterError = 64;
    var RootIncomplete = 0;
    var RootFatalErrored = 1;
    var RootErrored = 2;
    var RootSuspended = 3;
    var RootSuspendedWithDelay = 4;
    var RootCompleted = 5;
  
    var executionContext = NoContext;
  
    var workInProgressRoot = null;
  
    var workInProgress = null;
  
    var workInProgressRootRenderLanes = NoLanes;
  
    var subtreeRenderLanes = NoLanes;
    var subtreeRenderLanesCursor = createCursor(NoLanes);
  
    var workInProgressRootExitStatus = RootIncomplete;
  
    var workInProgressRootFatalError = null;
  
    var workInProgressRootIncludedLanes = NoLanes;
  
    var workInProgressRootSkippedLanes = NoLanes;
  
    var workInProgressRootUpdatedLanes = NoLanes;
  
    var workInProgressRootPingedLanes = NoLanes;
    var mostRecentlyUpdatedRoot = null;
  
    var globalMostRecentFallbackTime = 0;
    var FALLBACK_THROTTLE_MS = 500;
  
    var workInProgressRootRenderTargetTime = Infinity;
  
    var RENDER_TIMEOUT_MS = 500;
  
    function resetRenderTimer() {
      workInProgressRootRenderTargetTime = now() + RENDER_TIMEOUT_MS;
    }
  
    function getRenderTargetTime() {
      return workInProgressRootRenderTargetTime;
    }
    var nextEffect = null;
    var hasUncaughtError = false;
    var firstUncaughtError = null;
    var legacyErrorBoundariesThatAlreadyFailed = null;
    /** 所有effects被收集完 */
    var rootDoesHavePassiveEffects = false;
    var rootWithPendingPassiveEffects = null;
    var pendingPassiveEffectsRenderPriority = NoPriority$1;
    var pendingPassiveHookEffectsMount = [];
    var pendingPassiveHookEffectsUnmount = [];
    var rootsWithPendingDiscreteUpdates = null;
  
    var NESTED_UPDATE_LIMIT = 50;
    var nestedUpdateCount = 0;
    var rootWithNestedUpdates = null;
  
    var currentEventTime = NoTimestamp;
    var currentEventWipLanes = NoLanes;
    var currentEventPendingLanes = NoLanes;
    var focusedInstanceHandle = null;
    var shouldFireAfterActiveInstanceBlur = false;
    function getWorkInProgressRoot() {
      return workInProgressRoot;
    }
    function requestEventTime() {
      if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
        return now();
      }
  
      if (currentEventTime !== NoTimestamp) {
        return currentEventTime;
      }
  
      currentEventTime = now();
      return currentEventTime;
    }
    function requestUpdateLane(fiber) {
      var mode = fiber.mode;
  
      if ((mode & BlockingMode) === NoMode) {
        return SyncLane;
      } else if ((mode & ConcurrentMode) === NoMode) {
        return getCurrentPriorityLevel() === ImmediatePriority$1 ? SyncLane : SyncBatchedLane;
      }
  
      if (currentEventWipLanes === NoLanes) {
        currentEventWipLanes = workInProgressRootIncludedLanes;
      }
  
      var isTransition = requestCurrentTransition() !== NoTransition;
  
      if (isTransition) {
        if (currentEventPendingLanes !== NoLanes) {
          currentEventPendingLanes = mostRecentlyUpdatedRoot !== null ? mostRecentlyUpdatedRoot.pendingLanes : NoLanes;
        }
  
        return findTransitionLane(currentEventWipLanes, currentEventPendingLanes);
      }
  
      var schedulerPriority = getCurrentPriorityLevel();
  
      var lane;
  
      if ((executionContext & DiscreteEventContext) !== NoContext && schedulerPriority === UserBlockingPriority$2) {
        lane = findUpdateLane(InputDiscreteLanePriority, currentEventWipLanes);
      } else {
        var schedulerLanePriority = schedulerPriorityToLanePriority(schedulerPriority);
  
        lane = findUpdateLane(schedulerLanePriority, currentEventWipLanes);
      }
  
      return lane;
    }
  
    function requestRetryLane(fiber) {
      var mode = fiber.mode;
  
      if ((mode & BlockingMode) === NoMode) {
        return SyncLane;
      } else if ((mode & ConcurrentMode) === NoMode) {
        return getCurrentPriorityLevel() === ImmediatePriority$1 ? SyncLane : SyncBatchedLane;
      }
  
      if (currentEventWipLanes === NoLanes) {
        currentEventWipLanes = workInProgressRootIncludedLanes;
      }
  
      return findRetryLane(currentEventWipLanes);
    }
  
    /**
     * 在fiber节点上开始调度update更新
     * @param {*} fiber 需要更新的fiber节点
     * @param {*} lane update的优先级
     * @param {*} eventTime update的发起时间
     * @returns
     */
    function scheduleUpdateOnFiber(fiber, lane, eventTime) {
      checkForNestedUpdates();
      // fiber对比更新中发挥作用
      var root = markUpdateLaneFromFiberToRoot(fiber, lane);
  
      if (root === null) {
        return null;
      }
  
      markRootUpdated(root, lane, eventTime);
  
      if (root === workInProgressRoot) {
        workInProgressRootUpdatedLanes = mergeLanes(workInProgressRootUpdatedLanes, lane);
  
        if (workInProgressRootExitStatus === RootSuspendedWithDelay) {
          markRootSuspended$1(root, workInProgressRootRenderLanes);
        }
      }
  
      var priorityLevel = getCurrentPriorityLevel();
  
      if (lane === SyncLane) {
        // legacy或blocking模式
        if (
          (executionContext & LegacyUnbatchedContext) !== NoContext &&
          (executionContext & (RenderContext | CommitContext)) === NoContext
        ) {
          performSyncWorkOnRoot(root);
        } else {
          // 注册回调任务
          ensureRootIsScheduled(root, eventTime);
  
          if (executionContext === NoContext) {
            resetRenderTimer();
            // 取消schedule调度, 主动刷新回调队列并立即进入fiber树构造过程
            flushSyncCallbackQueue();
          }
        }
      } else {
        if (
          (executionContext & DiscreteEventContext) !== NoContext &&
          (priorityLevel === UserBlockingPriority$2 || priorityLevel === ImmediatePriority$1)
        ) {
          if (rootsWithPendingDiscreteUpdates === null) {
            rootsWithPendingDiscreteUpdates = new Set([root]);
          } else {
            rootsWithPendingDiscreteUpdates.add(root);
          }
        }
  
        ensureRootIsScheduled(root, eventTime);
      }
  
      mostRecentlyUpdatedRoot = root;
    }
  
    function markUpdateLaneFromFiberToRoot(sourceFiber, lane) {
      sourceFiber.lanes = mergeLanes(sourceFiber.lanes, lane);
      var alternate = sourceFiber.alternate;
  
      if (alternate !== null) {
        alternate.lanes = mergeLanes(alternate.lanes, lane);
      }
  
      var node = sourceFiber;
      var parent = sourceFiber.return;
  
      while (parent !== null) {
        parent.childLanes = mergeLanes(parent.childLanes, lane);
        alternate = parent.alternate;
  
        if (alternate !== null) {
          alternate.childLanes = mergeLanes(alternate.childLanes, lane);
        }
  
        node = parent;
        parent = parent.return;
      }
  
      if (node.tag === HostRoot) {
        var root = node.stateNode;
        return root;
      } else {
        return null;
      }
    }
  
    function ensureRootIsScheduled(root, currentTime) {
      console.log("[ensure root is scheduled]");
      // logStacks("[ensure root is scheduled stack]");
      var existingCallbackNode = root.callbackNode;
  
      markStarvedLanesAsExpired(root, currentTime);
      // 获取最新的更新任务Lane
      var nextLanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes);
      // 计算最新的调度优先级
      var newCallbackPriority = returnNextLanesPriority();
  
      // 如果没有更新任务(空Lane) 中断上一帧执行的任务,并重置状态并返回
      if (nextLanes === NoLanes) {
        if (existingCallbackNode !== null) {
          cancelCallback(existingCallbackNode);
          root.callbackNode = null;
          root.callbackPriority = NoLanePriority;
        }
  
        return;
      }
  
      // 当前存在未完成的协调任务
      if (existingCallbackNode !== null) {
        var existingCallbackPriority = root.callbackPriority;
  
        // 未完成的协调任务和当前最新的任务优先级一致, 退出最新的任务执行, 继续之前的任务
        if (existingCallbackPriority === newCallbackPriority) {
          console.log("[Existing Callback Priority Equal]");
          return;
        }
  
        cancelCallback(existingCallbackNode);
      }
  
      var newCallbackNode;
  
      if (newCallbackPriority === SyncLanePriority) {
        newCallbackNode = scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
      } else if (newCallbackPriority === SyncBatchedLanePriority) {
        newCallbackNode = scheduleCallback(ImmediatePriority$1, performSyncWorkOnRoot.bind(null, root));
      } else {
        console.log("[schedule concurrent work into scheudle]");
        var schedulerPriorityLevel = lanePriorityToSchedulerPriority(newCallbackPriority);
        newCallbackNode = scheduleCallback(schedulerPriorityLevel, performConcurrentWorkOnRoot.bind(null, root));
      }
  
      root.callbackPriority = newCallbackPriority;
      root.callbackNode = newCallbackNode;
    }
  
    function performConcurrentWorkOnRoot(root) {
      console.log("[New frame with concurrent work]");
  
      currentEventTime = NoTimestamp;
      currentEventWipLanes = NoLanes;
      currentEventPendingLanes = NoLanes;
  
      if (!((executionContext & (RenderContext | CommitContext)) === NoContext)) {
        throw Error(formatProdErrorMessage(327));
      }
  
      var originalCallbackNode = root.callbackNode;
      var didFlushPassiveEffects = flushPassiveEffects();
  
      if (didFlushPassiveEffects) {
        if (root.callbackNode !== originalCallbackNode) {
          return null;
        }
      }
  
      var lanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes);
  
      if (lanes === NoLanes) {
        return null;
      }
  
      var exitStatus = renderRootConcurrent(root, lanes);
  
      if (includesSomeLane(workInProgressRootIncludedLanes, workInProgressRootUpdatedLanes)) {
        prepareFreshStack(root, NoLanes);
      } else if (exitStatus !== RootIncomplete) {
        if (exitStatus === RootErrored) {
          executionContext |= RetryAfterError;
  
          if (root.hydrate) {
            root.hydrate = false;
            clearContainer(root.containerInfo);
          }
  
          lanes = getLanesToRetrySynchronouslyOnError(root);
  
          if (lanes !== NoLanes) {
            exitStatus = renderRootSync(root, lanes);
          }
        }
  
        if (exitStatus === RootFatalErrored) {
          var fatalError = workInProgressRootFatalError;
          prepareFreshStack(root, NoLanes);
          markRootSuspended$1(root, lanes);
          ensureRootIsScheduled(root, now());
          throw fatalError;
        }
  
        var finishedWork = root.current.alternate;
        root.finishedWork = finishedWork;
        root.finishedLanes = lanes;
        finishConcurrentRender(root, exitStatus, lanes);
      }
  
      ensureRootIsScheduled(root, now());
  
      // 判断当前帧执行完调度后任务是否发生改变, ensureRootIsScheduled用于终止、更新调度任务
      // 如果任务没有变化, 返回当前函数, Scheudler模块会在下一帧继续执行当前函数
      if (root.callbackNode === originalCallbackNode) {
        return performConcurrentWorkOnRoot.bind(null, root);
      }
  
      return null;
    }
  
    function finishConcurrentRender(root, exitStatus, lanes) {
      switch (exitStatus) {
        case RootIncomplete:
        case RootFatalErrored:
          throw Error(formatProdErrorMessage(345));
  
        case RootErrored: {
          commitRoot(root);
          break;
        }
  
        case RootSuspended: {
          markRootSuspended$1(root, lanes);
  
          if (includesOnlyRetries(lanes) && !shouldForceFlushFallbacksInDEV()) {
            var msUntilTimeout = globalMostRecentFallbackTime + FALLBACK_THROTTLE_MS - now();
  
            if (msUntilTimeout > 10) {
              var nextLanes = getNextLanes(root, NoLanes);
  
              if (nextLanes !== NoLanes) {
                break;
              }
  
              var suspendedLanes = root.suspendedLanes;
  
              if (!isSubsetOfLanes(suspendedLanes, lanes)) {
                markRootPinged(root, suspendedLanes);
                break;
              }
  
              root.timeoutHandle = scheduleTimeout(commitRoot.bind(null, root), msUntilTimeout);
              break;
            }
          }
  
          commitRoot(root);
          break;
        }
  
        case RootSuspendedWithDelay: {
          markRootSuspended$1(root, lanes);
  
          if (includesOnlyTransitions(lanes)) {
            break;
          }
  
          {
            var mostRecentEventTime = getMostRecentEventTime(root, lanes);
            var eventTimeMs = mostRecentEventTime;
            var timeElapsedMs = now() - eventTimeMs;
  
            var _msUntilTimeout = jnd(timeElapsedMs) - timeElapsedMs;
  
            if (_msUntilTimeout > 10) {
              root.timeoutHandle = scheduleTimeout(commitRoot.bind(null, root), _msUntilTimeout);
              break;
            }
          }
  
          commitRoot(root);
          break;
        }
  
        case RootCompleted: {
          commitRoot(root);
          break;
        }
  
        default: {
          {
            {
              throw Error(formatProdErrorMessage(329));
            }
          }
        }
      }
    }
  
    function markRootSuspended$1(root, suspendedLanes) {
      suspendedLanes = removeLanes(suspendedLanes, workInProgressRootPingedLanes);
      suspendedLanes = removeLanes(suspendedLanes, workInProgressRootUpdatedLanes);
      markRootSuspended(root, suspendedLanes);
    }
  
    function performSyncWorkOnRoot(root) {
      if (!((executionContext & (RenderContext | CommitContext)) === NoContext)) {
        throw Error(formatProdErrorMessage(327));
      }
  
      flushPassiveEffects();
      // 本次render的优先级
      var lanes;
      var exitStatus;
  
      if (root === workInProgressRoot && includesSomeLane(root.expiredLanes, workInProgressRootRenderLanes)) {
        // 初次构造时root = fiberRoot, workInProgressRoot = null, 因此只有对比更新才会进入该分支
        lanes = workInProgressRootRenderLanes;
        exitStatus = renderRootSync(root, lanes);
  
        if (includesSomeLane(workInProgressRootIncludedLanes, workInProgressRootUpdatedLanes)) {
          lanes = getNextLanes(root, lanes);
          exitStatus = renderRootSync(root, lanes);
        }
      } else {
        // 初次构造时
        // 获取本次render优先级
        lanes = getNextLanes(root, NoLanes);
        // 从root节点开始深度优先更新
        exitStatus = renderRootSync(root, lanes);
      }
  
      if (root.tag !== LegacyRoot && exitStatus === RootErrored) {
        executionContext |= RetryAfterError;
  
        if (root.hydrate) {
          root.hydrate = false;
          clearContainer(root.containerInfo);
        }
  
        lanes = getLanesToRetrySynchronouslyOnError(root);
  
        if (lanes !== NoLanes) {
          exitStatus = renderRootSync(root, lanes);
        }
      }
  
      if (exitStatus === RootFatalErrored) {
        var fatalError = workInProgressRootFatalError;
        prepareFreshStack(root, NoLanes);
        markRootSuspended$1(root, lanes);
        ensureRootIsScheduled(root, now());
        throw fatalError;
      }
  
      var finishedWork = root.current.alternate;
      root.finishedWork = finishedWork;
      root.finishedLanes = lanes;
      commitRoot(root);
  
      ensureRootIsScheduled(root, now());
      return null;
    }
    function flushDiscreteUpdates() {
      if ((executionContext & (BatchedContext | RenderContext | CommitContext)) !== NoContext) {
        return;
      }
  
      flushPendingDiscreteUpdates();
  
      flushPassiveEffects();
    }
  
    function flushPendingDiscreteUpdates() {
      if (rootsWithPendingDiscreteUpdates !== null) {
        var roots = rootsWithPendingDiscreteUpdates;
        rootsWithPendingDiscreteUpdates = null;
        roots.forEach(function (root) {
          markDiscreteUpdatesExpired(root);
          ensureRootIsScheduled(root, now());
        });
      }
  
      flushSyncCallbackQueue();
    }
  
    function batchedUpdates$1(fn, a) {
      var prevExecutionContext = executionContext;
      executionContext |= BatchedContext;
  
      try {
        return fn(a);
      } finally {
        executionContext = prevExecutionContext;
  
        if (executionContext === NoContext) {
          resetRenderTimer();
          flushSyncCallbackQueue();
        }
      }
    }
    function batchedEventUpdates$1(fn, a) {
      var prevExecutionContext = executionContext;
      executionContext |= EventContext;
  
      try {
        return fn(a);
      } finally {
        executionContext = prevExecutionContext;
  
        if (executionContext === NoContext) {
          resetRenderTimer();
          flushSyncCallbackQueue();
        }
      }
    }
    function discreteUpdates$1(fn, a, b, c, d) {
      var prevExecutionContext = executionContext;
      executionContext |= DiscreteEventContext;
  
      {
        try {
          return runWithPriority$1(UserBlockingPriority$2, fn.bind(null, a, b, c, d));
        } finally {
          executionContext = prevExecutionContext;
  
          if (executionContext === NoContext) {
            resetRenderTimer();
            flushSyncCallbackQueue();
          }
        }
      }
    }
    function unbatchedUpdates(fn, a) {
      var prevExecutionContext = executionContext;
      executionContext &= ~BatchedContext;
      executionContext |= LegacyUnbatchedContext;
  
      try {
        return fn(a);
      } finally {
        executionContext = prevExecutionContext;
  
        if (executionContext === NoContext) {
          resetRenderTimer();
          flushSyncCallbackQueue();
        }
      }
    }
    function flushSync(fn, a) {
      var prevExecutionContext = executionContext;
  
      if ((prevExecutionContext & (RenderContext | CommitContext)) !== NoContext) {
        return fn(a);
      }
  
      executionContext |= BatchedContext;
  
      {
        try {
          if (fn) {
            return runWithPriority$1(ImmediatePriority$1, fn.bind(null, a));
          } else {
            return undefined;
          }
        } finally {
          executionContext = prevExecutionContext;
  
          flushSyncCallbackQueue();
        }
      }
    }
    function flushControlled(fn) {
      var prevExecutionContext = executionContext;
      executionContext |= BatchedContext;
  
      {
        try {
          runWithPriority$1(ImmediatePriority$1, fn);
        } finally {
          executionContext = prevExecutionContext;
  
          if (executionContext === NoContext) {
            resetRenderTimer();
            flushSyncCallbackQueue();
          }
        }
      }
    }
    function pushRenderLanes(fiber, lanes) {
      push(subtreeRenderLanesCursor, subtreeRenderLanes);
      subtreeRenderLanes = mergeLanes(subtreeRenderLanes, lanes);
      workInProgressRootIncludedLanes = mergeLanes(workInProgressRootIncludedLanes, lanes);
    }
    function popRenderLanes() {
      subtreeRenderLanes = subtreeRenderLanesCursor.current;
      pop(subtreeRenderLanesCursor);
    }
  
    function prepareFreshStack(root, lanes) {
      root.finishedWork = null;
      root.finishedLanes = NoLanes;
      var timeoutHandle = root.timeoutHandle;
  
      if (timeoutHandle !== noTimeout) {
        root.timeoutHandle = noTimeout;
  
        cancelTimeout(timeoutHandle);
      }
  
      if (workInProgress !== null) {
        var interruptedWork = workInProgress.return;
  
        while (interruptedWork !== null) {
          unwindInterruptedWork(interruptedWork);
          interruptedWork = interruptedWork.return;
        }
      }
  
      workInProgressRoot = root;
      workInProgress = createWorkInProgress(root.current, null);
      workInProgressRootRenderLanes = subtreeRenderLanes = workInProgressRootIncludedLanes = lanes;
      workInProgressRootExitStatus = RootIncomplete;
      workInProgressRootFatalError = null;
      workInProgressRootSkippedLanes = NoLanes;
      workInProgressRootUpdatedLanes = NoLanes;
      workInProgressRootPingedLanes = NoLanes;
    }
  
    function handleError(root, thrownValue) {
      do {
        var erroredWork = workInProgress;
  
        try {
          resetContextDependencies();
          resetHooksAfterThrow();
          resetCurrentFiber();
  
          ReactCurrentOwner$2.current = null;
  
          if (erroredWork === null || erroredWork.return === null) {
            workInProgressRootExitStatus = RootFatalErrored;
            workInProgressRootFatalError = thrownValue;
  
            workInProgress = null;
            return;
          }
          throwException(root, erroredWork.return, erroredWork, thrownValue, workInProgressRootRenderLanes);
          completeUnitOfWork(erroredWork);
        } catch (yetAnotherThrownValue) {
          thrownValue = yetAnotherThrownValue;
  
          if (workInProgress === erroredWork && erroredWork !== null) {
            erroredWork = erroredWork.return;
            workInProgress = erroredWork;
          } else {
            erroredWork = workInProgress;
          }
  
          continue;
        }
  
        return;
      } while (true);
    }
  
    function pushDispatcher() {
      var prevDispatcher = ReactCurrentDispatcher$2.current;
      ReactCurrentDispatcher$2.current = ContextOnlyDispatcher;
  
      if (prevDispatcher === null) {
        return ContextOnlyDispatcher;
      } else {
        return prevDispatcher;
      }
    }
  
    function popDispatcher(prevDispatcher) {
      ReactCurrentDispatcher$2.current = prevDispatcher;
    }
  
    function markCommitTimeOfFallback() {
      globalMostRecentFallbackTime = now();
    }
    function markSkippedUpdateLanes(lane) {
      workInProgressRootSkippedLanes = mergeLanes(lane, workInProgressRootSkippedLanes);
    }
    function renderDidSuspend() {
      if (workInProgressRootExitStatus === RootIncomplete) {
        workInProgressRootExitStatus = RootSuspended;
      }
    }
    function renderDidSuspendDelayIfPossible() {
      if (workInProgressRootExitStatus === RootIncomplete || workInProgressRootExitStatus === RootSuspended) {
        workInProgressRootExitStatus = RootSuspendedWithDelay;
      }
  
      if (
        workInProgressRoot !== null &&
        (includesNonIdleWork(workInProgressRootSkippedLanes) || includesNonIdleWork(workInProgressRootUpdatedLanes))
      ) {
        markRootSuspended$1(workInProgressRoot, workInProgressRootRenderLanes);
      }
    }
    function renderDidError() {
      if (workInProgressRootExitStatus !== RootCompleted) {
        workInProgressRootExitStatus = RootErrored;
      }
    }
  
    function renderHasNotSuspendedYet() {
      return workInProgressRootExitStatus === RootIncomplete;
    }
  
    function renderRootSync(root, lanes) {
      var prevExecutionContext = executionContext;
      executionContext |= RenderContext;
      var prevDispatcher = pushDispatcher();
  
      if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
        // 刷新栈帧
        prepareFreshStack(root, lanes);
      }
  
      do {
        try {
          workLoopSync();
          break;
        } catch (thrownValue) {
          handleError(root, thrownValue);
        }
      } while (true);
  
      resetContextDependencies();
  
      executionContext = prevExecutionContext;
      popDispatcher(prevDispatcher);
  
      if (workInProgress !== null) {
        throw Error(formatProdErrorMessage(261));
      }
  
      // 重置全局状态
      workInProgressRoot = null;
      workInProgressRootRenderLanes = NoLanes;
      return workInProgressRootExitStatus;
    }
  
    function workLoopSync() {
      console.log("[workLoopSync]");
  
      while (workInProgress !== null) {
        performUnitOfWork(workInProgress);
      }
    }
  
    function renderRootConcurrent(root, lanes) {
      var prevExecutionContext = executionContext;
      executionContext |= RenderContext;
      var prevDispatcher = pushDispatcher();
  
      if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
        resetRenderTimer();
        prepareFreshStack(root, lanes);
      }
  
      do {
        try {
          workLoopConcurrent();
          break;
        } catch (thrownValue) {
          handleError(root, thrownValue);
        }
      } while (true);
  
      resetContextDependencies();
  
      popDispatcher(prevDispatcher);
      executionContext = prevExecutionContext;
  
      if (workInProgress !== null) {
        return RootIncomplete;
      } else {
        workInProgressRoot = null;
        workInProgressRootRenderLanes = NoLanes;
  
        return workInProgressRootExitStatus;
      }
    }
  
    function workLoopConcurrent() {
      console.log("[workLoopConcurrent]");
  
      while (workInProgress !== null && !shouldYield()) {
        performUnitOfWork(workInProgress);
      }
    }
  
    function performUnitOfWork(unitOfWork) {
      console.log("[unit of work]:", { ...unitOfWork });
  
      var current = unitOfWork.alternate;
      var next;
  
      next = beginWork(current, unitOfWork, subtreeRenderLanes);
  
      unitOfWork.memoizedProps = unitOfWork.pendingProps;
  
      if (next === null) {
        completeUnitOfWork(unitOfWork);
      } else {
        workInProgress = next;
      }
  
      ReactCurrentOwner$2.current = null;
    }
  
    function completeUnitOfWork(unitOfWork) {
      var completedWork = unitOfWork;
  
      do {
        var current = completedWork.alternate;
        var returnFiber = completedWork.return;
  
        if ((completedWork.flags & Incomplete) === NoFlags) {
          // 当前fiber已经工作结束
          var next = completeWork(current, completedWork, subtreeRenderLanes);
  
          if (next !== null) {
            workInProgress = next;
            return;
          }
  
          // 重置子节点Lanes
          resetChildLanes(completedWork);
  
          // 判断父节点fiber的工作是否还未完成
          if (returnFiber !== null && (returnFiber.flags & Incomplete) === NoFlags) {
            /** 下面这一块的逻辑: 将子节点的effect list 添加到父节点的effect list之后 */
            // firstEffect默认指向effect链第一个fiber节点
            // 将父节点的第一个effect节点指向当前fiber得到的firstEffect, 这里是因为当前completedWork之前可能存在sibling节点
            if (returnFiber.firstEffect === null) {
              returnFiber.firstEffect = completedWork.firstEffect;
            }
  
            // 当前fiber节点的lastEffect代表本次effect链表最后一个fiber节点
            if (completedWork.lastEffect !== null) {
              // effect链表是一个循环链表, 修改最后一个effect的指针指向
              if (returnFiber.lastEffect !== null) {
                returnFiber.lastEffect.nextEffect = completedWork.firstEffect;
              }
  
              returnFiber.lastEffect = completedWork.lastEffect;
            }
  
            var flags = completedWork.flags;
  
            // 判断flag是否存在更新
            if (flags > PerformedWork) {
              if (returnFiber.lastEffect !== null) {
                returnFiber.lastEffect.nextEffect = completedWork;
              } else {
                returnFiber.firstEffect = completedWork;
              }
  
              returnFiber.lastEffect = completedWork;
            }
          }
        } else {
          var _next = unwindWork(completedWork);
  
          if (_next !== null) {
            _next.flags &= HostEffectMask;
            workInProgress = _next;
            return;
          }
  
          if (returnFiber !== null) {
            returnFiber.firstEffect = returnFiber.lastEffect = null;
            returnFiber.flags |= Incomplete;
          }
        }
  
        var siblingFiber = completedWork.sibling;
  
        if (siblingFiber !== null) {
          workInProgress = siblingFiber;
          return;
        }
  
        completedWork = returnFiber;
  
        workInProgress = completedWork;
      } while (completedWork !== null);
  
      if (workInProgressRootExitStatus === RootIncomplete) {
        workInProgressRootExitStatus = RootCompleted;
      }
    }
  
    function resetChildLanes(completedWork) {
      if (
        (completedWork.tag === LegacyHiddenComponent || completedWork.tag === OffscreenComponent) &&
        completedWork.memoizedState !== null &&
        !includesSomeLane(subtreeRenderLanes, OffscreenLane) &&
        (completedWork.mode & ConcurrentMode) !== NoLanes
      ) {
        return;
      }
  
      var newChildLanes = NoLanes;
  
      var _child = completedWork.child;
  
      while (_child !== null) {
        newChildLanes = mergeLanes(newChildLanes, mergeLanes(_child.lanes, _child.childLanes));
        _child = _child.sibling;
      }
  
      completedWork.childLanes = newChildLanes;
    }
  
    function commitRoot(root) {
      var renderPriorityLevel = getCurrentPriorityLevel();
      runWithPriority$1(ImmediatePriority$1, commitRootImpl.bind(null, root, renderPriorityLevel));
      return null;
    }
  
    /** Commit阶段： 将虚拟DOM的更新应用到真实DOM上, 并且执行副作用操作 */
    function commitRootImpl(root, renderPriorityLevel) {
      do {
        // 触发并处理所有尚未被执行的effect
        flushPassiveEffects();
      } while (rootWithPendingPassiveEffects !== null);
  
      if (!((executionContext & (RenderContext | CommitContext)) === NoContext)) {
        throw Error(formatProdErrorMessage(327));
      }
  
      var finishedWork = root.finishedWork;
      var lanes = root.finishedLanes;
  
      if (finishedWork === null) {
        return null;
      }
  
      root.finishedWork = null;
      root.finishedLanes = NoLanes;
  
      if (!(finishedWork !== root.current)) {
        throw Error(formatProdErrorMessage(177));
      }
  
      root.callbackNode = null;
  
      var remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes);
      markRootFinished(root, remainingLanes);
  
      if (rootsWithPendingDiscreteUpdates !== null) {
        if (!hasDiscreteLanes(remainingLanes) && rootsWithPendingDiscreteUpdates.has(root)) {
          rootsWithPendingDiscreteUpdates.delete(root);
        }
      }
  
      if (root === workInProgressRoot) {
        workInProgressRoot = null;
        workInProgress = null;
        workInProgressRootRenderLanes = NoLanes;
      }
  
      var firstEffect;
  
      if (finishedWork.flags > PerformedWork) {
        if (finishedWork.lastEffect !== null) {
          finishedWork.lastEffect.nextEffect = finishedWork;
          firstEffect = finishedWork.firstEffect;
        } else {
          firstEffect = finishedWork;
        }
      } else {
        firstEffect = finishedWork.firstEffect;
      }
  
      if (firstEffect !== null) {
        var prevExecutionContext = executionContext;
        executionContext |= CommitContext;
  
        ReactCurrentOwner$2.current = null;
  
        focusedInstanceHandle = prepareForCommit(root.containerInfo);
        shouldFireAfterActiveInstanceBlur = false;
        nextEffect = firstEffect;
  
        do {
          {
            try {
              commitBeforeMutationEffects();
            } catch (error) {
              if (!(nextEffect !== null)) {
                throw Error(formatProdErrorMessage(330));
              }
  
              captureCommitPhaseError(nextEffect, error);
              nextEffect = nextEffect.nextEffect;
            }
          }
        } while (nextEffect !== null);
  
        focusedInstanceHandle = null;
  
        nextEffect = firstEffect;
  
        do {
          {
            try {
              commitMutationEffects(root, renderPriorityLevel);
            } catch (error) {
              if (!(nextEffect !== null)) {
                throw Error(formatProdErrorMessage(330));
              }
  
              captureCommitPhaseError(nextEffect, error);
              nextEffect = nextEffect.nextEffect;
            }
          }
        } while (nextEffect !== null);
  
        resetAfterCommit(root.containerInfo);
  
        root.current = finishedWork;
  
        nextEffect = firstEffect;
  
        do {
          {
            try {
              commitLayoutEffects(root, lanes);
            } catch (error) {
              if (!(nextEffect !== null)) {
                throw Error(formatProdErrorMessage(330));
              }
  
              captureCommitPhaseError(nextEffect, error);
              nextEffect = nextEffect.nextEffect;
            }
          }
        } while (nextEffect !== null);
  
        nextEffect = null;
  
        requestPaint();
  
        executionContext = prevExecutionContext;
      } else {
        root.current = finishedWork;
      }
  
      if (rootDoesHavePassiveEffects) {
        rootDoesHavePassiveEffects = false;
        rootWithPendingPassiveEffects = root;
        pendingPassiveEffectsRenderPriority = renderPriorityLevel;
      } else {
        nextEffect = firstEffect;
  
        while (nextEffect !== null) {
          var nextNextEffect = nextEffect.nextEffect;
          nextEffect.nextEffect = null;
  
          if (nextEffect.flags & Deletion) {
            detachFiberAfterEffects(nextEffect);
          }
  
          nextEffect = nextNextEffect;
        }
      }
  
      remainingLanes = root.pendingLanes;
  
      if (remainingLanes !== NoLanes);
      else {
        legacyErrorBoundariesThatAlreadyFailed = null;
      }
  
      if (remainingLanes === SyncLane) {
        if (root === rootWithNestedUpdates) {
          nestedUpdateCount++;
        } else {
          nestedUpdateCount = 0;
          rootWithNestedUpdates = root;
        }
      } else {
        nestedUpdateCount = 0;
      }
  
      onCommitRoot(finishedWork.stateNode, renderPriorityLevel);
  
      ensureRootIsScheduled(root, now());
  
      if (hasUncaughtError) {
        hasUncaughtError = false;
        var _error3 = firstUncaughtError;
        firstUncaughtError = null;
        throw _error3;
      }
  
      if ((executionContext & LegacyUnbatchedContext) !== NoContext) {
        return null;
      }
  
      flushSyncCallbackQueue();
  
      return null;
    }
  
    function commitBeforeMutationEffects() {
      while (nextEffect !== null) {
        var current = nextEffect.alternate;
  
        if (!shouldFireAfterActiveInstanceBlur && focusedInstanceHandle !== null) {
          if ((nextEffect.flags & Deletion) !== NoFlags) {
            if (doesFiberContain(nextEffect, focusedInstanceHandle)) {
              shouldFireAfterActiveInstanceBlur = true;
            }
          } else {
            if (
              nextEffect.tag === SuspenseComponent &&
              isSuspenseBoundaryBeingHidden(current, nextEffect) &&
              doesFiberContain(nextEffect, focusedInstanceHandle)
            ) {
              shouldFireAfterActiveInstanceBlur = true;
            }
          }
        }
  
        var flags = nextEffect.flags;
  
        if ((flags & Snapshot) !== NoFlags) {
          commitBeforeMutationLifeCycles(current, nextEffect);
        }
  
        if ((flags & Passive) !== NoFlags) {
          if (!rootDoesHavePassiveEffects) {
            rootDoesHavePassiveEffects = true;
            scheduleCallback(NormalPriority$1, function () {
              flushPassiveEffects();
              return null;
            });
          }
        }
  
        nextEffect = nextEffect.nextEffect;
      }
    }
  
    function commitMutationEffects(root, renderPriorityLevel) {
      while (nextEffect !== null) {
        var flags = nextEffect.flags;
  
        if (flags & ContentReset) {
          commitResetTextContent(nextEffect);
        }
  
        if (flags & Ref) {
          var current = nextEffect.alternate;
  
          if (current !== null) {
            commitDetachRef(current);
          }
        }
  
        var primaryFlags = flags & (Placement | Update | Deletion | Hydrating);
  
        switch (primaryFlags) {
          case Placement: {
            commitPlacement(nextEffect);
  
            nextEffect.flags &= ~Placement;
            break;
          }
  
          case PlacementAndUpdate: {
            commitPlacement(nextEffect);
  
            nextEffect.flags &= ~Placement;
  
            var _current = nextEffect.alternate;
            commitWork(_current, nextEffect);
            break;
          }
  
          case Hydrating: {
            nextEffect.flags &= ~Hydrating;
            break;
          }
  
          case HydratingAndUpdate: {
            nextEffect.flags &= ~Hydrating;
  
            var _current2 = nextEffect.alternate;
            commitWork(_current2, nextEffect);
            break;
          }
  
          case Update: {
            var _current3 = nextEffect.alternate;
            commitWork(_current3, nextEffect);
            break;
          }
  
          case Deletion: {
            commitDeletion(root, nextEffect);
            break;
          }
        }
        nextEffect = nextEffect.nextEffect;
      }
    }
  
    function commitLayoutEffects(root, committedLanes) {
      while (nextEffect !== null) {
        var flags = nextEffect.flags;
  
        if (flags & (Update | Callback)) {
          var current = nextEffect.alternate;
          commitLifeCycles(root, current, nextEffect);
        }
  
        if (flags & Ref) {
          commitAttachRef(nextEffect);
        }
  
        nextEffect = nextEffect.nextEffect;
      }
    }
  
    function flushPassiveEffects() {
      if (pendingPassiveEffectsRenderPriority !== NoPriority$1) {
        var priorityLevel =
          pendingPassiveEffectsRenderPriority > NormalPriority$1 ? NormalPriority$1 : pendingPassiveEffectsRenderPriority;
        pendingPassiveEffectsRenderPriority = NoPriority$1;
  
        return runWithPriority$1(priorityLevel, flushPassiveEffectsImpl);
      }
  
      return false;
    }
    function enqueuePendingPassiveHookEffectMount(fiber, effect) {
      pendingPassiveHookEffectsMount.push(effect, fiber);
  
      // 判断root是否存在待执行的effect
      if (!rootDoesHavePassiveEffects) {
        rootDoesHavePassiveEffects = true;
        // 异步调度执行effect列表
        scheduleCallback(NormalPriority$1, function () {
          flushPassiveEffects();
          return null;
        });
      }
    }
    function enqueuePendingPassiveHookEffectUnmount(fiber, effect) {
      pendingPassiveHookEffectsUnmount.push(effect, fiber);
  
      if (!rootDoesHavePassiveEffects) {
        rootDoesHavePassiveEffects = true;
        scheduleCallback(NormalPriority$1, function () {
          flushPassiveEffects();
          return null;
        });
      }
    }
  
    function flushPassiveEffectsImpl() {
      // 不存在待处理的passive effect队列
      if (rootWithPendingPassiveEffects === null) {
        return false;
      }
  
      var root = rootWithPendingPassiveEffects;
      rootWithPendingPassiveEffects = null;
  
      if (!((executionContext & (RenderContext | CommitContext)) === NoContext)) {
        throw Error(formatProdErrorMessage(331));
      }
  
      // 添加Commit执行上下文
      var prevExecutionContext = executionContext;
      executionContext |= CommitContext;
  
      // 获取待处理的unmount passive effects队列
      var unmountEffects = pendingPassiveHookEffectsUnmount;
      pendingPassiveHookEffectsUnmount = [];
  
      for (var i = 0; i < unmountEffects.length; i += 2) {
        var _effect = unmountEffects[i];
        var fiber = unmountEffects[i + 1];
        // 获取unmount函数
        var destroy = _effect.destroy;
        _effect.destroy = undefined;
  
        if (typeof destroy === "function") {
          try {
            // 执行unmount函数
            destroy();
          } catch (error) {
            if (!(fiber !== null)) {
              throw Error(formatProdErrorMessage(330));
            }
  
            captureCommitPhaseError(fiber, error);
          }
        }
      }
  
      // 处理mount passive effects队列
      var mountEffects = pendingPassiveHookEffectsMount;
      pendingPassiveHookEffectsMount = [];
  
      for (var _i = 0; _i < mountEffects.length; _i += 2) {
        var _effect2 = mountEffects[_i];
        var _fiber = mountEffects[_i + 1];
  
        try {
          var create = _effect2.create;
          // 收集函数返回结果(对应useEffect中函数返回结果)
          _effect2.destroy = create();
        } catch (error) {
          if (!(_fiber !== null)) {
            {
              throw Error(formatProdErrorMessage(330));
            }
          }
  
          captureCommitPhaseError(_fiber, error);
        }
      }
  
      // 从根节点开始遍历passive effect链表并执行删除操作
      var effect = root.current.firstEffect;
      while (effect !== null) {
        var nextNextEffect = effect.nextEffect;
        effect.nextEffect = null;
  
        if (effect.flags & Deletion) detachFiberAfterEffects(effect);
  
        effect = nextNextEffect;
      }
  
      // 重置执行上下文
      executionContext = prevExecutionContext;
      // 刷新同步回调队列, 执行同步回调任务
      flushSyncCallbackQueue();
      return true;
    }
  
    function isAlreadyFailedLegacyErrorBoundary(instance) {
      return legacyErrorBoundariesThatAlreadyFailed !== null && legacyErrorBoundariesThatAlreadyFailed.has(instance);
    }
    function markLegacyErrorBoundaryAsFailed(instance) {
      if (legacyErrorBoundariesThatAlreadyFailed === null) {
        legacyErrorBoundariesThatAlreadyFailed = new Set([instance]);
      } else {
        legacyErrorBoundariesThatAlreadyFailed.add(instance);
      }
    }
  
    function prepareToThrowUncaughtError(error) {
      if (!hasUncaughtError) {
        hasUncaughtError = true;
        firstUncaughtError = error;
      }
    }
  
    var onUncaughtError = prepareToThrowUncaughtError;
  
    function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
      var errorInfo = createCapturedValue(error, sourceFiber);
      var update = createRootErrorUpdate(rootFiber, errorInfo, SyncLane);
      enqueueUpdate(rootFiber, update);
      var eventTime = requestEventTime();
      var root = markUpdateLaneFromFiberToRoot(rootFiber, SyncLane);
  
      if (root !== null) {
        markRootUpdated(root, SyncLane, eventTime);
        ensureRootIsScheduled(root, eventTime);
      }
    }
  
    function captureCommitPhaseError(sourceFiber, error) {
      if (sourceFiber.tag === HostRoot) {
        captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error);
        return;
      }
  
      var fiber = sourceFiber.return;
  
      while (fiber !== null) {
        if (fiber.tag === HostRoot) {
          captureCommitPhaseErrorOnRoot(fiber, sourceFiber, error);
          return;
        } else if (fiber.tag === ClassComponent) {
          var ctor = fiber.type;
          var instance = fiber.stateNode;
  
          if (
            typeof ctor.getDerivedStateFromError === "function" ||
            (typeof instance.componentDidCatch === "function" && !isAlreadyFailedLegacyErrorBoundary(instance))
          ) {
            var errorInfo = createCapturedValue(error, sourceFiber);
            var update = createClassErrorUpdate(fiber, errorInfo, SyncLane);
            enqueueUpdate(fiber, update);
            var eventTime = requestEventTime();
            var root = markUpdateLaneFromFiberToRoot(fiber, SyncLane);
  
            if (root !== null) {
              markRootUpdated(root, SyncLane, eventTime);
              ensureRootIsScheduled(root, eventTime);
            } else {
              if (typeof instance.componentDidCatch === "function" && !isAlreadyFailedLegacyErrorBoundary(instance)) {
                try {
                  instance.componentDidCatch(error, errorInfo);
                } catch (errorToIgnore) {}
              }
            }
  
            return;
          }
        }
  
        fiber = fiber.return;
      }
    }
    function pingSuspendedRoot(root, wakeable, pingedLanes) {
      var pingCache = root.pingCache;
  
      if (pingCache !== null) {
        pingCache.delete(wakeable);
      }
  
      var eventTime = requestEventTime();
      markRootPinged(root, pingedLanes);
  
      if (workInProgressRoot === root && isSubsetOfLanes(workInProgressRootRenderLanes, pingedLanes)) {
        if (
          workInProgressRootExitStatus === RootSuspendedWithDelay ||
          (workInProgressRootExitStatus === RootSuspended &&
            includesOnlyRetries(workInProgressRootRenderLanes) &&
            now() - globalMostRecentFallbackTime < FALLBACK_THROTTLE_MS)
        ) {
          prepareFreshStack(root, NoLanes);
        } else {
          workInProgressRootPingedLanes = mergeLanes(workInProgressRootPingedLanes, pingedLanes);
        }
      }
  
      ensureRootIsScheduled(root, eventTime);
    }
  
    function retryTimedOutBoundary(boundaryFiber, retryLane) {
      if (retryLane === NoLane) {
        retryLane = requestRetryLane(boundaryFiber);
      }
  
      var eventTime = requestEventTime();
      var root = markUpdateLaneFromFiberToRoot(boundaryFiber, retryLane);
  
      if (root !== null) {
        markRootUpdated(root, retryLane, eventTime);
        ensureRootIsScheduled(root, eventTime);
      }
    }
    function resolveRetryWakeable(boundaryFiber, wakeable) {
      var retryLane = NoLane;
  
      var retryCache;
  
      retryCache = boundaryFiber.stateNode;
  
      if (retryCache !== null) {
        retryCache.delete(wakeable);
      }
  
      retryTimedOutBoundary(boundaryFiber, retryLane);
    }
  
    function jnd(timeElapsed) {
      return timeElapsed < 120
        ? 120
        : timeElapsed < 480
        ? 480
        : timeElapsed < 1080
        ? 1080
        : timeElapsed < 1920
        ? 1920
        : timeElapsed < 3000
        ? 3000
        : timeElapsed < 4320
        ? 4320
        : ceil(timeElapsed / 1960) * 1960;
    }
  
    function checkForNestedUpdates() {
      if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
        nestedUpdateCount = 0;
        rootWithNestedUpdates = null;
  
        {
          {
            throw Error(formatProdErrorMessage(185));
          }
        }
      }
    }
  
    var IsThisRendererActing = {
      current: false,
    };
  
    function shouldForceFlushFallbacksInDEV() {
      return false;
    }
  
    function detachFiberAfterEffects(fiber) {
      fiber.sibling = null;
      fiber.stateNode = null;
    }
  
    function FiberNode(tag, pendingProps, key, mode) {
      this.tag = tag;
      this.key = key;
      this.elementType = null;
      this.type = null;
      this.stateNode = null;
  
      this.return = null;
      this.child = null;
      this.sibling = null;
      this.index = 0;
      this.ref = null;
      this.pendingProps = pendingProps;
      this.memoizedProps = null; // 存储组件的属性: 父组件传递的值
      this.updateQueue = null;
      this.memoizedState = null; // 存储组件的状态: 组件状态的变化会导致组件被重新渲染
      this.dependencies = null;
      this.mode = mode;
  
      /** 标志位: reconciler阶段会将所有拥有flags标记的节点添加到副作用链表中 */
      this.flags = NoFlags;
      /** 单向链表: 指向下一个具有effect的fiber节点 */
      this.nextEffect = null;
      /** 指向副作用链表中的第一个fiber节点 */
      this.firstEffect = null;
      /** 指向副作用链表中的最后一个fiber节点 */
      this.lastEffect = null;
      this.lanes = NoLanes;
      this.childLanes = NoLanes;
      this.alternate = null;
    }
  
    var createFiber = function (tag, pendingProps, key, mode) {
      return new FiberNode(tag, pendingProps, key, mode);
    };
  
    function shouldConstruct(Component) {
      var prototype = Component.prototype;
      return !!(prototype && prototype.isReactComponent);
    }
  
    function isSimpleFunctionComponent(type) {
      return typeof type === "function" && !shouldConstruct(type) && type.defaultProps === undefined;
    }
    function resolveLazyComponentTag(Component) {
      if (typeof Component === "function") {
        return shouldConstruct(Component) ? ClassComponent : FunctionComponent;
      } else if (Component !== undefined && Component !== null) {
        var $$typeof = Component.$$typeof;
  
        if ($$typeof === REACT_FORWARD_REF_TYPE) {
          return ForwardRef;
        }
  
        if ($$typeof === REACT_MEMO_TYPE) {
          return MemoComponent;
        }
      }
  
      return IndeterminateComponent;
    }
  
    function createWorkInProgress(current, pendingProps) {
      var workInProgress = current.alternate;
  
      if (workInProgress === null) {
        workInProgress = createFiber(current.tag, pendingProps, current.key, current.mode);
        workInProgress.elementType = current.elementType;
        workInProgress.type = current.type;
        workInProgress.stateNode = current.stateNode;
  
        workInProgress.alternate = current;
        current.alternate = workInProgress;
      } else {
        workInProgress.pendingProps = pendingProps;
  
        workInProgress.type = current.type;
  
        workInProgress.flags = NoFlags;
  
        workInProgress.nextEffect = null;
        workInProgress.firstEffect = null;
        workInProgress.lastEffect = null;
      }
  
      workInProgress.childLanes = current.childLanes;
      workInProgress.lanes = current.lanes;
      workInProgress.child = current.child;
      workInProgress.memoizedProps = current.memoizedProps;
      workInProgress.memoizedState = current.memoizedState;
      workInProgress.updateQueue = current.updateQueue;
  
      var currentDependencies = current.dependencies;
      workInProgress.dependencies =
        currentDependencies === null
          ? null
          : {
              lanes: currentDependencies.lanes,
              firstContext: currentDependencies.firstContext,
            };
  
      workInProgress.sibling = current.sibling;
      workInProgress.index = current.index;
      workInProgress.ref = current.ref;
  
      return workInProgress;
    }
  
    function resetWorkInProgress(workInProgress, renderLanes) {
      workInProgress.flags &= Placement;
  
      workInProgress.nextEffect = null;
      workInProgress.firstEffect = null;
      workInProgress.lastEffect = null;
      var current = workInProgress.alternate;
  
      if (current === null) {
        workInProgress.childLanes = NoLanes;
        workInProgress.lanes = renderLanes;
        workInProgress.child = null;
        workInProgress.memoizedProps = null;
        workInProgress.memoizedState = null;
        workInProgress.updateQueue = null;
        workInProgress.dependencies = null;
        workInProgress.stateNode = null;
      } else {
        workInProgress.childLanes = current.childLanes;
        workInProgress.lanes = current.lanes;
        workInProgress.child = current.child;
        workInProgress.memoizedProps = current.memoizedProps;
        workInProgress.memoizedState = current.memoizedState;
        workInProgress.updateQueue = current.updateQueue;
  
        workInProgress.type = current.type;
  
        var currentDependencies = current.dependencies;
        workInProgress.dependencies =
          currentDependencies === null
            ? null
            : {
                lanes: currentDependencies.lanes,
                firstContext: currentDependencies.firstContext,
              };
      }
  
      return workInProgress;
    }
    function createHostRootFiber(tag) {
      var mode;
  
      if (tag === ConcurrentRoot) {
        mode = ConcurrentMode | BlockingMode | StrictMode;
      } else if (tag === BlockingRoot) {
        mode = BlockingMode | StrictMode;
      } else {
        mode = NoMode;
      }
  
      return createFiber(HostRoot, null, null, mode);
    }
    function createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes) {
      var fiberTag = IndeterminateComponent;
  
      var resolvedType = type;
  
      if (typeof type === "function") {
        if (shouldConstruct(type)) {
          fiberTag = ClassComponent;
        }
      } else if (typeof type === "string") {
        fiberTag = HostComponent;
      } else {
        getTag: switch (type) {
          case REACT_FRAGMENT_TYPE:
            return createFiberFromFragment(pendingProps.children, mode, lanes, key);
  
          case REACT_DEBUG_TRACING_MODE_TYPE:
            fiberTag = Mode;
            mode |= DebugTracingMode;
            break;
  
          case REACT_STRICT_MODE_TYPE:
            fiberTag = Mode;
            mode |= StrictMode;
            break;
  
          case REACT_PROFILER_TYPE:
            return createFiberFromProfiler(pendingProps, mode, lanes, key);
  
          case REACT_SUSPENSE_TYPE:
            return createFiberFromSuspense(pendingProps, mode, lanes, key);
  
          case REACT_SUSPENSE_LIST_TYPE:
            return createFiberFromSuspenseList(pendingProps, mode, lanes, key);
  
          case REACT_OFFSCREEN_TYPE:
            return createFiberFromOffscreen(pendingProps, mode, lanes, key);
  
          case REACT_LEGACY_HIDDEN_TYPE:
            return createFiberFromLegacyHidden(pendingProps, mode, lanes, key);
  
          case REACT_SCOPE_TYPE:
  
          default: {
            if (typeof type === "object" && type !== null) {
              switch (type.$$typeof) {
                case REACT_PROVIDER_TYPE:
                  fiberTag = ContextProvider;
                  break getTag;
  
                case REACT_CONTEXT_TYPE:
                  fiberTag = ContextConsumer;
                  break getTag;
  
                case REACT_FORWARD_REF_TYPE:
                  fiberTag = ForwardRef;
  
                  break getTag;
  
                case REACT_MEMO_TYPE:
                  fiberTag = MemoComponent;
                  break getTag;
  
                case REACT_LAZY_TYPE:
                  fiberTag = LazyComponent;
                  resolvedType = null;
                  break getTag;
  
                case REACT_BLOCK_TYPE:
                  fiberTag = Block;
                  break getTag;
              }
            }
  
            var info = "";
  
            {
              {
                throw Error(formatProdErrorMessage(130, type == null ? type : typeof type, info));
              }
            }
          }
        }
      }
  
      var fiber = createFiber(fiberTag, pendingProps, key, mode);
      fiber.elementType = type;
      fiber.type = resolvedType;
      fiber.lanes = lanes;
  
      return fiber;
    }
    function createFiberFromElement(element, mode, lanes) {
      var owner = null;
  
      var type = element.type;
      var key = element.key;
      var pendingProps = element.props;
      var fiber = createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes);
  
      return fiber;
    }
    function createFiberFromFragment(elements, mode, lanes, key) {
      var fiber = createFiber(Fragment, elements, key, mode);
      fiber.lanes = lanes;
      return fiber;
    }
  
    function createFiberFromProfiler(pendingProps, mode, lanes, key) {
      var fiber = createFiber(Profiler, pendingProps, key, mode | ProfileMode);
  
      fiber.elementType = REACT_PROFILER_TYPE;
      fiber.type = REACT_PROFILER_TYPE;
      fiber.lanes = lanes;
  
      return fiber;
    }
  
    function createFiberFromSuspense(pendingProps, mode, lanes, key) {
      var fiber = createFiber(SuspenseComponent, pendingProps, key, mode);
  
      fiber.type = REACT_SUSPENSE_TYPE;
      fiber.elementType = REACT_SUSPENSE_TYPE;
      fiber.lanes = lanes;
      return fiber;
    }
    function createFiberFromSuspenseList(pendingProps, mode, lanes, key) {
      var fiber = createFiber(SuspenseListComponent, pendingProps, key, mode);
  
      fiber.elementType = REACT_SUSPENSE_LIST_TYPE;
      fiber.lanes = lanes;
      return fiber;
    }
    function createFiberFromOffscreen(pendingProps, mode, lanes, key) {
      var fiber = createFiber(OffscreenComponent, pendingProps, key, mode);
  
      fiber.elementType = REACT_OFFSCREEN_TYPE;
      fiber.lanes = lanes;
      return fiber;
    }
    function createFiberFromLegacyHidden(pendingProps, mode, lanes, key) {
      var fiber = createFiber(LegacyHiddenComponent, pendingProps, key, mode);
  
      fiber.elementType = REACT_LEGACY_HIDDEN_TYPE;
      fiber.lanes = lanes;
      return fiber;
    }
    function createFiberFromText(content, mode, lanes) {
      var fiber = createFiber(HostText, content, null, mode);
      fiber.lanes = lanes;
      return fiber;
    }
    function createFiberFromHostInstanceForDeletion() {
      var fiber = createFiber(HostComponent, null, null, NoMode);
  
      fiber.elementType = "DELETED";
      fiber.type = "DELETED";
      return fiber;
    }
    function createFiberFromPortal(portal, mode, lanes) {
      var pendingProps = portal.children !== null ? portal.children : [];
      var fiber = createFiber(HostPortal, pendingProps, portal.key, mode);
      fiber.lanes = lanes;
      fiber.stateNode = {
        containerInfo: portal.containerInfo,
        pendingChildren: null,
  
        implementation: portal.implementation,
      };
      return fiber;
    }
  
    function FiberRootNode(containerInfo, tag, hydrate) {
      this.tag = tag;
      this.containerInfo = containerInfo;
      this.pendingChildren = null;
      this.current = null;
      this.pingCache = null;
      this.finishedWork = null;
      this.timeoutHandle = noTimeout;
      this.context = null;
      this.pendingContext = null;
      this.hydrate = hydrate;
      this.callbackNode = null;
      this.callbackPriority = NoLanePriority;
      this.eventTimes = createLaneMap(NoLanes);
      this.expirationTimes = createLaneMap(NoTimestamp);
      this.pendingLanes = NoLanes;
      this.suspendedLanes = NoLanes;
      this.pingedLanes = NoLanes;
      this.expiredLanes = NoLanes;
      this.mutableReadLanes = NoLanes;
      this.finishedLanes = NoLanes;
      this.entangledLanes = NoLanes;
      this.entanglements = createLaneMap(NoLanes);
  
      this.mutableSourceEagerHydrationData = null;
    }
  
    function createFiberRoot(containerInfo, tag, hydrate) {
      var root = new FiberRootNode(containerInfo, tag, hydrate);
  
      var uninitializedFiber = createHostRootFiber(tag);
      root.current = uninitializedFiber;
      uninitializedFiber.stateNode = root;
      initializeUpdateQueue(uninitializedFiber);
      return root;
    }
  
    function createPortal(children, containerInfo, implementation) {
      var key = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      return {
        $$typeof: REACT_PORTAL_TYPE,
        key: key == null ? null : "" + key,
        children: children,
        containerInfo: containerInfo,
        implementation: implementation,
      };
    }
  
    function getContextForSubtree(parentComponent) {
      if (!parentComponent) {
        return emptyContextObject;
      }
  
      var fiber = get(parentComponent);
      var parentContext = findCurrentUnmaskedContext(fiber);
  
      if (fiber.tag === ClassComponent) {
        var Component = fiber.type;
  
        if (isContextProvider(Component)) {
          return processChildContext(fiber, Component, parentContext);
        }
      }
  
      return parentContext;
    }
  
    function findHostInstance(component) {
      var fiber = get(component);
  
      if (fiber === undefined) {
        if (typeof component.render === "function") {
          {
            {
              throw Error(formatProdErrorMessage(188));
            }
          }
        } else {
          {
            {
              throw Error(formatProdErrorMessage(268, Object.keys(component)));
            }
          }
        }
      }
  
      var hostFiber = findCurrentHostFiber(fiber);
  
      if (hostFiber === null) {
        return null;
      }
  
      return hostFiber.stateNode;
    }
  
    function createContainer(containerInfo, tag, hydrate) {
      return createFiberRoot(containerInfo, tag, hydrate);
    }
    /** 初次构建fiber树 */
    function updateContainer(element, container, parentComponent, callback) {
      var current = container.current;
      var eventTime = requestEventTime();
  
      var lane = requestUpdateLane(current);
      console.log("[StartLane]:", lane, lane.toString(2));
  
      var context = getContextForSubtree(parentComponent);
  
      if (container.context === null) {
        container.context = context;
      } else {
        container.pendingContext = context;
      }
  
      var update = createUpdate(eventTime, lane);
  
      update.payload = {
        element: element,
      };
      callback = callback === undefined ? null : callback;
  
      if (callback !== null) {
        update.callback = callback;
      }
  
      enqueueUpdate(current, update);
  
      scheduleUpdateOnFiber(current, lane, eventTime);
      return lane;
    }
    function getPublicRootInstance(container) {
      var containerFiber = container.current;
  
      if (!containerFiber.child) {
        return null;
      }
  
      switch (containerFiber.child.tag) {
        case HostComponent:
          return getPublicInstance(containerFiber.child.stateNode);
  
        default:
          return containerFiber.child.stateNode;
      }
    }
  
    function markRetryLaneImpl(fiber, retryLane) {
      var suspenseState = fiber.memoizedState;
  
      if (suspenseState !== null && suspenseState.dehydrated !== null) {
        suspenseState.retryLane = higherPriorityLane(suspenseState.retryLane, retryLane);
      }
    }
  
    function markRetryLaneIfNotHydrated(fiber, retryLane) {
      markRetryLaneImpl(fiber, retryLane);
      var alternate = fiber.alternate;
  
      if (alternate) {
        markRetryLaneImpl(alternate, retryLane);
      }
    }
  
    function attemptUserBlockingHydration$1(fiber) {
      if (fiber.tag !== SuspenseComponent) {
        return;
      }
  
      var eventTime = requestEventTime();
      var lane = InputDiscreteHydrationLane;
      scheduleUpdateOnFiber(fiber, lane, eventTime);
      markRetryLaneIfNotHydrated(fiber, lane);
    }
    function attemptContinuousHydration$1(fiber) {
      if (fiber.tag !== SuspenseComponent) {
        return;
      }
  
      var eventTime = requestEventTime();
      var lane = SelectiveHydrationLane;
      scheduleUpdateOnFiber(fiber, lane, eventTime);
      markRetryLaneIfNotHydrated(fiber, lane);
    }
    function attemptHydrationAtCurrentPriority$1(fiber) {
      if (fiber.tag !== SuspenseComponent) {
        return;
      }
  
      var eventTime = requestEventTime();
      var lane = requestUpdateLane(fiber);
      scheduleUpdateOnFiber(fiber, lane, eventTime);
      markRetryLaneIfNotHydrated(fiber, lane);
    }
    function runWithPriority$2(priority, fn) {
      try {
        setCurrentUpdateLanePriority(priority);
        return fn();
      } finally {
      }
    }
  
    function ReactDOMRoot(container, options) {
      this._internalRoot = createRootImpl(container, ConcurrentRoot, options);
    }
  
    function ReactDOMBlockingRoot(container, tag, options) {
      this._internalRoot = createRootImpl(container, tag, options);
    }
  
    ReactDOMRoot.prototype.render = ReactDOMBlockingRoot.prototype.render = function (children) {
      var root = this._internalRoot;
  
      updateContainer(children, root, null, null);
    };
  
    ReactDOMRoot.prototype.unmount = ReactDOMBlockingRoot.prototype.unmount = function () {
      var root = this._internalRoot;
      var container = root.containerInfo;
      updateContainer(null, root, null, function () {
        unmarkContainerAsRoot(container);
      });
    };
  
    function createRootImpl(container, tag, options) {
      var root = createContainer(container, tag, false);
  
      markContainerAsRoot(root.current, container);
  
      var rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container;
  
      listenToAllSupportedEvents(rootContainerElement);
  
      return root;
    }
  
    function createRoot(container, options) {
      if (!isValidContainer(container)) {
        throw Error(formatProdErrorMessage(299));
      }
      return new ReactDOMRoot(container, options);
    }
    function createBlockingRoot(container, options) {
      if (!isValidContainer(container)) {
        throw Error(formatProdErrorMessage(299));
      }
      return new ReactDOMBlockingRoot(container, BlockingRoot, options);
    }
    function createLegacyRoot(container, options) {
      return new ReactDOMBlockingRoot(container, LegacyRoot, options);
    }
    function isValidContainer(node) {
      return !!(
        node &&
        (node.nodeType === ELEMENT_NODE ||
          node.nodeType === DOCUMENT_NODE ||
          node.nodeType === DOCUMENT_FRAGMENT_NODE ||
          (node.nodeType === COMMENT_NODE && node.nodeValue === " react-mount-point-unstable "))
      );
    }
  
    function getReactRootElementInContainer(container) {
      if (!container) {
        return null;
      }
  
      if (container.nodeType === DOCUMENT_NODE) {
        return container.documentElement;
      } else {
        return container.firstChild;
      }
    }
  
    function shouldHydrateDueToLegacyHeuristic(container) {
      var rootElement = getReactRootElementInContainer(container);
      return !!(rootElement && rootElement.nodeType === ELEMENT_NODE && rootElement.hasAttribute(ROOT_ATTRIBUTE_NAME));
    }
  
    function legacyCreateRootFromDOMContainer(container, forceHydrate) {
      var shouldHydrate = forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
  
      if (!shouldHydrate) {
        var rootSibling;
  
        while ((rootSibling = container.lastChild)) {
          container.removeChild(rootSibling);
        }
      }
  
      return createLegacyRoot(
        container,
        shouldHydrate
          ? {
              hydrate: true,
            }
          : undefined
      );
    }
  
    function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
      var root = container._reactRootContainer;
      var fiberRoot;
  
      if (!root) {
        root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
        fiberRoot = root._internalRoot;
  
        if (typeof callback === "function") {
          var originalCallback = callback;
  
          callback = function () {
            var instance = getPublicRootInstance(fiberRoot);
            originalCallback.call(instance);
          };
        }
  
        unbatchedUpdates(function () {
          updateContainer(children, fiberRoot, parentComponent, callback);
        });
      } else {
        fiberRoot = root._internalRoot;
  
        if (typeof callback === "function") {
          var _originalCallback = callback;
  
          callback = function () {
            var instance = getPublicRootInstance(fiberRoot);
  
            _originalCallback.call(instance);
          };
        }
  
        updateContainer(children, fiberRoot, parentComponent, callback);
      }
  
      return getPublicRootInstance(fiberRoot);
    }
  
    function findDOMNode(componentOrElement) {
      if (componentOrElement == null) {
        return null;
      }
  
      if (componentOrElement.nodeType === ELEMENT_NODE) {
        return componentOrElement;
      }
  
      return findHostInstance(componentOrElement);
    }
    function hydrate(element, container, callback) {
      if (!isValidContainer(container)) {
        throw Error(formatProdErrorMessage(200));
      }
  
      return legacyRenderSubtreeIntoContainer(null, element, container, true, callback);
    }
    function render(element, container, callback) {
      console.log("[render]");
      if (!isValidContainer(container)) {
        throw Error(formatProdErrorMessage(200));
      }
  
      return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);
    }
    function unstable_renderSubtreeIntoContainer(parentComponent, element, containerNode, callback) {
      if (!isValidContainer(containerNode)) {
        throw Error(formatProdErrorMessage(200));
      }
  
      if (!(parentComponent != null && has(parentComponent))) {
        throw Error(formatProdErrorMessage(38));
      }
  
      return legacyRenderSubtreeIntoContainer(parentComponent, element, containerNode, false, callback);
    }
    function unmountComponentAtNode(container) {
      if (!isValidContainer(container)) {
        throw Error(formatProdErrorMessage(40));
      }
  
      if (container._reactRootContainer) {
        unbatchedUpdates(function () {
          legacyRenderSubtreeIntoContainer(null, null, container, false, function () {
            container._reactRootContainer = null;
            unmarkContainerAsRoot(container);
          });
        });
  
        return true;
      } else {
        return false;
      }
    }
  
    setAttemptUserBlockingHydration(attemptUserBlockingHydration$1);
    setAttemptContinuousHydration(attemptContinuousHydration$1);
    setAttemptHydrationAtCurrentPriority(attemptHydrationAtCurrentPriority$1);
    setAttemptHydrationAtPriority(runWithPriority$2);
  
    setRestoreImplementation(restoreControlledState$3);
    setBatchingImplementation(batchedUpdates$1, discreteUpdates$1, flushDiscreteUpdates, batchedEventUpdates$1);
  
    function createPortal$1(children, container) {
      var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  
      if (!isValidContainer(container)) {
        {
          throw Error(formatProdErrorMessage(200));
        }
      }
  
      return createPortal(children, container, null, key);
    }
  
    function scheduleHydration(target) {}
  
    function renderSubtreeIntoContainer(parentComponent, element, containerNode, callback) {
      return unstable_renderSubtreeIntoContainer(parentComponent, element, containerNode, callback);
    }
  
    function unstable_createPortal(children, container) {
      var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  
      return createPortal$1(children, container, key);
    }
  
    var Internals = {
      Events: [
        getInstanceFromNode,
        getNodeFromInstance,
        getFiberCurrentPropsFromNode,
        enqueueStateRestore,
        restoreStateIfNeeded,
        flushPassiveEffects,
        IsThisRendererActing,
      ],
    };
  
    exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Internals;
    exports.createPortal = createPortal$1;
    exports.findDOMNode = findDOMNode;
    exports.flushSync = flushSync;
    exports.hydrate = hydrate;
    exports.render = render;
    exports.unmountComponentAtNode = unmountComponentAtNode;
    exports.unstable_batchedUpdates = batchedUpdates$1;
    exports.unstable_createBlockingRoot = createBlockingRoot;
    exports.unstable_createPortal = unstable_createPortal;
    exports.unstable_createRoot = createRoot;
    exports.unstable_flushControlled = flushControlled;
    exports.unstable_renderSubtreeIntoContainer = renderSubtreeIntoContainer;
    exports.unstable_runWithPriority = runWithPriority$2;
    exports.unstable_scheduleHydration = scheduleHydration;
    exports.version = ReactVersion;
  });
  
  function logStacks(message) {
    try {
      throw new Error(message || "Log Stack");
    } catch ({ stack }) {
      stack = stack.replace(/^Error:\s/, "[Stacks]: ");
      stack = stack.replace(/\s+at\slogStacks[^\n]*\n/, "\n");
      console.log(stack);
    }
  }
  