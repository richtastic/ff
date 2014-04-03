// FFWorker.js
FFWorker.FILENAMES = ['Code.js'];
function FFWorker(homeDirectory){
	var list = FFWorker.FILENAMES;
	for(i=0;i<list.length;++i){
		importScripts(homeDirectory+list[i]);
	}
}



