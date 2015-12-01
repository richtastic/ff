// Cache.js

Cache.DEFAULT_PREFIX = "cache";
Cache.EVENT_MAX_SIZE = "QUOTA_EXCEEDED_ERR";

function Cache(){
	this._prefix = Cache.DEFAULT_PREFIX;
	console.log("cache time");
	console.log(window.openDatabase);

	var db;
	var dbName = "documents";
	var dbVersion = "1.0";
	var dbDescription = "documents storage database";
	var dbSize = 10 * 1024 * 1024;
	
	db = openDatabase(dbName, dbVersion, dbDescription, dbSize, function(e){
		console.log("callback: "+e);
	});

	// CREATE TABLE
	var createQuery = "CREATE TABLE IF NOT EXISTS documents( \
		id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, \
		value TEXT NOT NULL \
	)";
	db.transaction(function(t){
		console.log("create");
		t.executeSql(createQuery, [], function resultHandler(t,r){ console.log("result: "+r); }, function errorHandler(e){ console.log("error: "+e); } );
	});

	// READ ROWS
	var selectQuery = "SELECT * FROM documents";
	db.transaction(function(t){
		console.log("select");
		t.executeSql(selectQuery, [], function resultHandler(t,r){
			console.log("result: "+r);
			console.log(r);
			var rows = r.rows;
			console.log("rows: "+rows.length);
			var i, len = rows.length;
			for(i=0; i<len; ++i){
				console.log(rows[i]);
			}
		}, function errorHandler(e){ console.log("error: "+e); } );
	});

	// CREATE ROWS
	var insertQuery = 'INSERT INTO documents (value) VALUES ("object: '+Date()+'")';
	db.transaction(function(t){
		console.log("insert");
		t.executeSql(insertQuery, [], function resultHandler(t,r){
			console.log("result: "+r);
		}, function errorHandler(e){ console.log("error: "+e); } );
	});

/*
	// UPDATE ROWS
	var updateQuery = 'UPDATE documents SET value="new date: '+Date()+'" WHERE id=2';
	db.transaction(function(t){
		console.log("update");
		t.executeSql(updateQuery, [], function resultHandler(t,r){
			console.log("result: "+r);
			console.log(r);
			console.log(r.rowsAffected);
		}, function errorHandler(e){ console.log(e); } );
	});
*/
	// DELETE ROWS
/*
	var deleteQuery = 'DELETE FROM documents WHERE id=1';
	db.transaction(function(t){
		console.log("delete");
		t.executeSql(deleteQuery, [], function resultHandler(t,r){
			console.log("result: "+r);
			console.log(r.rowsAffected);
		}, function errorHandler(e){ console.log(e); } );
	});
*/
	// DELETE TABLE
/*
	var deleteQuery = 'DROP TABLE IF EXISTS documents';
	db.transaction(function(t){
		console.log("delete table");
		t.executeSql(deleteQuery, [], function resultHandler(t,r){
			console.log("result: "+r);
			console.log(r);
		}, function errorHandler(e){ console.log(e); } );
	});
*/
	/*
	openDatabase('documents', '1.0', 'Local document storage', 5*1024*1024, function (db) {
	  db.changeVersion('', '1.0', function (t) {
	    t.executeSql('CREATE TABLE docids (id, name)');
	  }, error);
	});
	*/
/*

	// window.sessionStorage

	// 5MB max
	console.log(window);
	console.log(window.localStorage);

	var localStorage = window.localStorage;
	var index = "item";
	console.log(localStorage.length);
	console.log(localStorage.getItem(index));
	console.log(localStorage.setItem(index,{"name":"value"}));
	console.log(localStorage.removeItem(index));
*/
}
Cache.prototype.hia = function(){
	//
}

Cache.prototype.hia = function(){
	//
}

Cache.prototype.kill = function(){
	this.emptyLocalStorage();
}


// openDatabase
