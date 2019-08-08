const fs = require("fs");
const csstree = require("css");
const debug = require("debug");
const dbg = debug("kandinskijs:kGenerator");
const it = require("../src/utilities/itGenerator");

module.exports = {
	cssFile: undefined,
	outDir: "testSuite",
	init: function (cssPath, outDir) {
		if (!cssPath) {
			throw new Error("cssPath is undefined");
		}
		this.cssFile = getCssFile(cssPath);
		this.outDir = outDir || this.outDir;
		createOutDir(this.outDir);
	},
	generate: function (opts) {
		//opts will be a set of key value functions
		var wstream = fs.createWriteStream('demo/itOutput.js');
		wstream.write("/*------------Test cases scaffolding----------------*/\n\n\r");
		const itGen = new it(wstream);

		var ast = csstree.parse(this.cssFile);

		if (ast.stylesheet) {

			ast.stylesheet.rules.forEach(function (rule) {

				if (rule.type == "rule") {
					rule.selectors.forEach(function (selector) {
						dbg("selector: ", selector);
						var property, value;
						rule.declarations.forEach(function (declaration) {
							dbg("property: ", declaration.property);
							dbg("value: ", declaration.value);
							property = declaration.property;
							value = declaration.value;
							itGen.generateIt(selector, property, value);
						})
					})
				}

				if (rule.type == "media") {
					dbg(rule.media);
					rule.rules.forEach(function (rule) {
						if (rule.type == "rule") {
							rule.selectors.forEach(function (selector) {
								dbg("m-selector: ", selector);
								rule.declarations.forEach(function (declaration) {
									dbg("m-property: ", declaration.property);
									dbg("m-value: ", declaration.value);
								})
							})
						}
					});
				}
			});

			wstream.end();
		}
	}
};

function getCssFile (cssPath) {
	if (!fs.existsSync(cssPath)) {
		throw new Error("cssPath is not found");
	}
	return fs.readFileSync(cssPath, "utf8");
};

function createOutDir (outDir) {
	if (!fs.existsSync(outDir)) {
		fs.mkdirSync(outDir);
	}
};



