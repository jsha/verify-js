// Run this with node, e.g.:
// node signer.js
var vm = require("vm");
var fs = require("fs");
function loadJS(path, context) {
  var data = fs.readFileSync(path);
  vm.runInContext(data, context, path);
}

context = vm.createContext({});

loadJS('./ext/bigint/bigint.js', context);
loadJS('./ext/whirlpool/whirlpool.js', context);
loadJS('./src/common/js/elliptic.js', context);

var payload = fs.readFileSync("payload.js").toString();

// Janky escaping.  Figure out context issues so we don't have to do this.
payload = payload.replace(/'/g, "\\'") .replace(/"/g, '\\"') .replace(/\n/g, '\\n');

var cmd = "var signature = ecdsaSign('3ccCUJCZ4hWw84OmxBAwm3e1GQH5ISx9YSHwAYK2Gux', '" + payload + "');";
vm.runInContext(cmd, context);
console.log("var payload = '" + payload + "';");
console.log("var signature = '" + context.signature + "';");

