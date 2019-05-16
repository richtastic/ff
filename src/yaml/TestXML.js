// TestXML.js

function TestXML(){

	// ...


/*
	var xml = new XML();
	// <!DOCTYPE html>
	// <?xml version="1.0" encoding="utf-8" standalone="true" ?>
	xml.startElement("xml");
	xml.setAttribute("version","1.0");
	xml.setAttribute("encoding","utf-8");

	xml.startElement("html");
	xml.setAttribute("cat","5");
	xml.startChildren();
		xml.startElement("head");
		xml.setAttribute("data-head","value");
		xml.startElement("body");
		xml.setAttribute("style","background=\"red\";");
		xml.startChildren();
			xml.startElement("p");
			xml.setValue("innerHTML here");
			xml.startElement("a");
		xml.endChildren();
	xml.endChildren();


	console.log(xml);
	//
	var str = xml.toStringX();

	console.log(str);

*/

var ajax = new Ajax();

ajax.get("./cube.dae",this,function(d){
	console.log("loaded");
	var xml = new XML();
	console.log(xml);
	xml.parse(d);
	console.log(xml.toStringX());
	/*
	after it is parsed, navigate:

	var root = xml.root()

	var collada = root.children("COLLADA");
	var

	*/

},null);


/*

var str=' \
<xml version="1.0" encoding="utf-8"/> \
<html cat="5"> \
	<head data-head="value"/> \
	<body style="background=\\"red\\";"> \
		<p>innerHTML here</p> \
		<a/> \
	</body> \
</html>';

console.log(str);



var xml = new XML();

console.log(xml);

xml.parse(str);


console.log(xml.toStringX());
*/

}
