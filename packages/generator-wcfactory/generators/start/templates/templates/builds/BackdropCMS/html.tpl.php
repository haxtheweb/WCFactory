<?php
/**
 * @file
 * <%= name %>
 * <%= description %>
 *
 * Variables:
 * - $css: An array of CSS files for the current page.
 * - $language: (object) The language the site is being displayed in.
 *   $language->language contains its textual representation.
 *   $language->dir contains the language direction. It will either be 'ltr' or 'rtl'.
 * - $rdf_namespaces: All the RDF namespace prefixes used in the HTML document.
 * - $grddl_profile: A GRDDL profile allowing agents to extract the RDF data.
 * - $head_title: A modified version of the page title, for use in the TITLE
 *   tag.
 * - $head_title_array: (array) An associative array containing the string parts
 *   that were used to generate the $head_title variable, already prepared to be
 *   output as TITLE tag. The key/value pairs may contain one or more of the
 *   following, depending on conditions:
 *   - title: The title of the current page, if any.
 *   - name: The name of the site.
 *   - slogan: The slogan of the site, if any, and if there is no title.
 * - $head: Markup for the HEAD section (including meta tags, keyword tags, and
 *   so on).
 * - $styles: Style tags necessary to import all CSS files for the page.
 * - $scripts: Script tags necessary to load the JavaScript files and settings
 *   for the page.
 * - $page_top: Initial markup from any modules that have altered the
 *   page. This variable should always be output first, before all other dynamic
 *   content.
 * - $page: The rendered page content.
 * - $page_bottom: Final closing markup from any modules that have altered the
 *   page. This variable should always be output last, after all other dynamic
 *   content.
 * - $classes String of classes that can be used to style contextually through
 *   CSS.
 *
 * @see template_preprocess()
 * @see template_preprocess_html()
 * @see template_process()
 *
 * @ingroup themeable
 */
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML+RDFa 1.0//EN" "http://www.w3.org/MarkUp/DTD/xhtml-rdfa-1.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php print $language->language; ?>" version="XHTML+RDFa 1.0" dir="<?php print $language->dir; ?>"<?php print $rdf_namespaces; ?>>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes">
  <!-- tell IE versions to render as high as possible -->
  <meta http-equiv="X-UA-Compatible" content="IE=EDGE" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="msapplication-tap-highlight" content="no">
  <!-- Chrome, Firefox OS and Opera -->
  <meta name="msapplication-navbutton-color" content="#eeeeee">
  <meta name="msapplication-TileColor" content="#eeeeee">
  <meta name="theme-color" content="#eeeeee">
  </head>
  <title><?php print $head_title; ?></title>
  <?php print $head; ?>
  <?php print $styles; ?>
  <?php print $scripts; ?>
</head>
<body class="<?php print $classes; ?>" <?php print $attributes;?> no-js>
  <h1 class="element-invisible"><?php print $head_title;?></h1>
  <?php print $page_top; ?>
  <?php print $page; ?>
  <?php print $page_bottom; ?>
  <script>document.body.removeAttribute('no-js');var cdn="/sites/all/libraries/webcomponents/";var old=false;var ancient=false;
    if (typeof Symbol == "undefined") { // IE 11, at least try to serve a watered down site
      ancient = true;
    }
    try {
      new Function('let a;'); // bizarre but needed for Safari 9 bc of when it was made
    }
    catch (err) {
      ancient = true;
    }
    if (!ancient) {
      try { new Function('import("");'); } catch (err) {
        "use strict"; (function () { function a(a, b, c) { var d = a; if (d.state = b, d.stateData = c, 0 < d.onNextStateChange.length) { var e = d.onNextStateChange.slice(); d.onNextStateChange.length = 0; for (var f, g = 0, h = e; g < h.length; g++)f = h[g], f() } return d } function b(b) { function d() { try { document.head.removeChild(f) } catch (a) { } } var e = a(b, "Loading", void 0), f = document.createElement("script"); return f.src = b.url, f.onload = function () { var a, b, f; void 0 === r ? (b = [], f = void 0) : (a = r(), b = a[0], f = a[1]), c(e, b, f), d() }, f.onerror = function () { g(b, new TypeError("Failed to fetch " + b.url)), d() }, document.head.appendChild(f), e } function c(b, c, e) { var f = d(b, c), g = f[0], h = f[1]; return a(b, "WaitingForTurn", { args: g, deps: h, moduleBody: e }) } function d(a, c) { for (var e, f = [], g = [], i = 0, j = c; i < j.length; i++) { if (e = j[i], "exports" === e) { f.push(a.exports); continue } if ("require" === e) { f.push(function (b, c, e) { var f = d(a, b), g = f[0], i = f[1]; h(i, function () { c && c.apply(null, g) }, e) }); continue } if ("meta" === e) { f.push({ url: !0 === a.isTopLevel ? a.url.substring(0, a.url.lastIndexOf("#")) : a.url }); continue } var l = k(n(a.urlBase, e)); f.push(l.exports), g.push(l), "Initialized" === l.state && b(l) } return [f, g] } function e(b) { var c = a(b, "WaitingOnDeps", b.stateData); return h(b.stateData.deps, function () { return f(c) }, function (a) { return g(c, a) }), c } function f(b) { var c = b.stateData; if (null != c.moduleBody) try { c.moduleBody.apply(null, c.args) } catch (a) { return g(b, a) } return a(b, "Executed", void 0) } function g(b, c) { return !0 === b.isTopLevel && setTimeout(function () { throw c }), a(b, "Failed", c) } function h(a, b, c) { var d = a.shift(); return void 0 === d ? void (b && b()) : "WaitingOnDeps" === d.state ? (!1, void h(a, b, c)) : void i(d, function () { h(a, b, c) }, c) } function i(a, b, c) { switch (a.state) { case "WaitingForTurn": return e(a), void i(a, b, c); case "Failed": return void (c && c(a.stateData)); case "Executed": return void b(); case "Loading": case "WaitingOnDeps": return void a.onNextStateChange.push(function () { return i(a, b, c) }); case "Initialized": throw new Error("All dependencies should be loading already before pressureDependencyToExecute is called."); default: throw new Error("Impossible module state: " + a.state); } } function j(a, b) { switch (a.state) { case "Executed": case "Failed": return void b(); default: a.onNextStateChange.push(function () { return j(a, b) }); } } function k(a) { var b = q[a]; return void 0 === b && (b = q[a] = { url: a, urlBase: m(a), exports: Object.create(null), state: "Initialized", stateData: void 0, isTopLevel: !1, onNextStateChange: [] }), b } function l(a) { return v.href = a, v.href } function m(a) { return a = a.split("?")[0], a = a.split("#")[0], a.substring(0, a.lastIndexOf("/") + 1) } function n(a, b) { return -1 === b.indexOf("://") ? l("/" === b[0] ? b : a + b) : b } function o() { return document.baseURI || (document.querySelector("base") || window.location).href } function p() { var b = document.currentScript; if (!b) return u; if (window.HTMLImports) { var c = window.HTMLImports.importForElement(b); return c ? c.href : u } var d = b.ownerDocument.createElement("a"); return d.href = "", d.href } if (!window.define) { var q = Object.create(null), r = void 0, s = 0, t = void 0, u = o(); window.define = function (a, b) { var d = !1; r = function () { return d = !0, r = void 0, [a, b] }; var f = p(); setTimeout(function () { if (!1 == d) { r = void 0; var g = f + "#" + s++, h = k(g); h.isTopLevel = !0; var i = c(h, a, b); void 0 === t ? e(i) : j(k(t), function () { e(i) }), t = g } }, 0) }, window.define._reset = function () { for (var a in q) delete q[a]; r = void 0, s = 0, t = void 0, u = o() }; var v = document.createElement("a") } })();
        var defs;
        // FF 6x.x can be given ES6 compliant code safely
        if (/Firefox\/6/.test(navigator.userAgent) || window.customElements) {
          defs = [
            cdn + "build/es6-amd/node_modules/web-animations-js/web-animations-next-lite.min.js",
            cdn + "build/dist/babel-top.js",
            cdn + "build/es6-amd/node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js",
            cdn + "build/es6-amd/dist/entry.js",
          ];
        }
        else {
          defs = [
            cdn + "build/es5-amd/node_modules/web-animations-js/web-animations-next-lite.min.js",
            cdn + "build/dist/babel-top.js",
            cdn + "build/es5-amd/node_modules/fetch-ie8/fetch.js",
            cdn + "build/es6/node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js",
            cdn + "build/es5-amd/node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js",
            cdn + "build/es5-amd/dist/entry.js"
          ];
        }
        define(defs, function () { "use strict" });
        old=true;
      }
    }
  </script>
  <script>if(old)document.write('<!--');</script>
  <script type="module">
    import "/sites/all/libraries/webcomponents/build/es6/dist/entry.js";
  </script>
  <script async src="/sites/all/libraries/webcomponents/build/es6/node_modules/web-animations-js/web-animations-next-lite.min.js">
  //<!--! do not remove -->
  </script>
</body>
</html>
