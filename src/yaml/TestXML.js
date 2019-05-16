// TestXML.js

function TestXML(){

/*
	var xml = new XML();
	// <!DOCTYPE html>
	xml.startElement("xml");
	xml.setAttribute("version","1.0");
	xml.setAttribute("encoding","utf-8");
	xml.addComment(" this is a comment ");
	xml.startElement("as-is");
	xml.setValue("\asd\asd\asdasdsad\\\asd", true);
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
	console.log(xml.toString());

},null);



}
