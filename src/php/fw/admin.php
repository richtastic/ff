<?php
// admin.php



function giau_action_admin_menu() {
/*
	// A | B\ | C\, | \, 
	$arr = ["A","B\\","C\,","\\,"];
	error_log("ARR: ".objectToString($arr));
	// A | B\\, C\\\, \,
	$str = commaSeparatedStringFromArray($arr);
	error_log("STR: ".$str);
	error_log("++++");
	$arr = arrayFromCommaSeparatedString($str);
	error_log("ARR: ".objectToString($arr));
*/
	// OPTIONS > GIAU PLUGIN
	//add_options_page('Giau Plugin Options', 'Giau Plugin', 'manage_options', GIAU_UNIQUE_IDENTIFIER(), 'giau_admin_plugin_options');
	// GIAU PLUGIN | MENU
	//add_menu_page('Giau Plugin Page', 'Plugin Settings', 'manage_options', 'giau-plugin-main', 'giau_admin_menu_page_main');
		//    PAGE_TITLE    MENU_TITLE    CAPABILITY   SLUG   FUNCTION    ICON_URL   POITION
		add_menu_page('Giau Plugin', 'Giau Plugin', 'manage_options', 'giau-plugin-main', 'giau_admin_menu_page_main',  giau_plugin_images_url().'/admin/giau_icon_white_24x24.png');
		add_submenu_page('giau-plugin-main', 'Giau - File Upload', 'File Upload', 'manage_options', 'giau-plugin-submenu-file-upload', 'giau_admin_menu_page_submenu_file_upload');
		add_submenu_page('giau-plugin-main', 'Giau - Data Entry', 'Data Entry', 'manage_options', 'giau-plugin-submenu-data-entry', 'giau_admin_menu_page_submenu_data_entry');
		add_submenu_page('giau-plugin-main', 'Giau - Backup', 'Backup', 'manage_options', 'giau-plugin-submenu-backup', 'giau_admin_menu_page_submenu_backup');
}

function giau_admin_menu_page_main(){
	$iconBlackMini = giau_plugin_images_url().'/admin/giau_icon_black_24x24.png';
	$THIS_URL = getCurrentRequestURL();
	$URL_FILE_UPLOAD = add_query_arg('page','giau-plugin-submenu-file-upload');
	$URL_DATA_ENTRY = add_query_arg('page','giau-plugin-submenu-data-entry');
	$URL_DATA_BACKUP = add_query_arg('page','giau-plugin-submenu-backup');
?>
	<h1 style="vertical-align:middle;"><img src="<?php echo $iconBlackMini; ?>"  style="display:inline-block; vertical-align:middle;" />Giau Plugin</h1>
	<ul>
		<li><a href="<?php echo $URL_FILE_UPLOAD; ?>">File Uploading</a></li>
		<li><a href="<?php echo $URL_DATA_ENTRY; ?>">Data Entry</a></li>
		<li><a href="<?php echo $URL_DATA_BACKUP; ?>">File & Data Backup</a></li>
	</ul>
	<?php
		$URL_IMAGE_DIAGRAM = giau_plugin_images_url().'/admin/structure_giau_diagram.png';
	?>
	<!-- info -->
	<img src = "<?php echo $URL_IMAGE_DIAGRAM; ?>" />
	<ul>
		<li>Page:
			<ul>
				<li>Ordered list of sections</li>
			</ul>
		</il>
		<li>Section:
			<ul>
				<li>Implementation of a widget, possibly contains subsections</li>
			</ul>
		</li>
		<li>Widget:
			<ul>
				<li>Defined set of behavior (typically display)</li>
			</ul>
		</li>
		<li>Bio:
			<ul>
				<li>Personnel directory listing</li>
			</ul>
		</li>
		<li>Calendar:
			<ul>
				<li>List of events with start date and duration</li>
			</ul>
		</li>
		<li>Languagization:
			<ul>
				<li>Localization of material (text) , to display content according to end user laguage preferences</li>
			</ul>
		</li>
	</ul>

	<pre>



PAGES:
	- "__live" tag is the default page shown for the homepage

CALENDAR /DATE:
	- setting duration = 0 makes it display as a single day

IMAGES:
	- optimize, eg: tinypng.com
	- appropriately sized, eg: having larger than 1920x1080 isn't useful for galleries


	</pre>

	<!--
	<div class="giauTestA" style="width:200px; height:120px; background-color:#CCC;"></div>
	<div class="giauTestB" style="width:200px; height:100px; background-color:#CCC;"></div>
	<div class="giauTestC" style="width:200px; height:100px; background-color:#CCC;"></div>
	<div class="giauTestD" style="width:200px; height:100px; background-color:#CCC;"></div>
	<div class="giauTestE" style="width:200px; height:30px; background-color:#CCC;"></div>
	<div class="giauTestF" style="width:200px; height:30px; background-color:#CCC;"></div>
	<div class="giauTestG" style="width:200px; height:30px; background-color:#CCC;"></div>
	<div class="giauTestH" style="width:200px; height:30px; background-color:#CCC;"></div>
	<div class="giauTestI" style="width:200px; min-height:30px; background-color:#CCC; display:block; "></div>
	<div class="giauTestJ" style="width:200px; min-height:30px; background-color:#CCC; display:block; "></div>
	<div class="giauTestOverlay" style="width:400px; height:30px; background-color:#AAA;">Click me</div>
	<script>
	
	function afterDelay(){
		console.log("afterDelay");
		// console.log(giau)
		// console.log(window.giau)
		if(window.giau){
			var timestamp = new giau.InputFieldDate($(".giauTestA")[0],"2016-11-28 09:04:59.1234");
			var color = new giau.InputFieldColor($(".giauTestB")[0],"0xFFCC9966"); // 0xFFCC9966
			var duration = new giau.InputFieldDuration($(".giauTestC")[0],"1234000");
			var bool = new giau.InputFieldBoolean($(".giauTestD")[0],"false");
//var timestill = new giau.InputFieldDateMini($(".giauTestE")[0],"false");
var colorstill = new giau.InputFieldColorMini($(".giauTestE")[0],"0x99FF0000");
var timestill = new giau.InputFieldDateMini($(".giauTestF")[0],"2016-11-28 09:04:59.1234");

var timeall = new giau.InputFieldDateModal($(".giauTestG")[0],"2016-11-28 09:04:59.1234");
var colorall = new giau.InputFieldColorModal($(".giauTestH")[0],0xCC00FF00);


//var tags = new giau.InputFieldTags($(".giauTestI")[0],"comma,,,separated,fields,,,yay,,");
var tags = new giau.InputFieldTags($(".giauTestI")[0],"comma\\,,\\,separated,fields,\\,\\,yay\\,\\,\\\\");
var select = new giau.InputFieldDiscrete($(".giauTestJ")[0],[
	{"value":"val0", "display":"value 0"},
	{"value":"val1", "display":"value 1"},
	{"value":"val2", "display":"value 2"},
],1);

			var testOverlay = $(".giauTestOverlay")[0];
			var dispatch = new JSDispatch();
			dispatch.addJSEventListener(testOverlay, Code.JS_EVENT_MOUSE_DOWN, function(e){
				var overlay = new giau.InputOverlay();
				var object = {};
				overlay.addFunction(giau.InputOverlay.EVENT_SHOW, handleOverlayShow, object);
				overlay.addFunction(giau.InputOverlay.EVENT_HIDE, handleOverlayHide, object);
				overlay.addFunction(giau.InputOverlay.EVENT_LAYOUT, handleOverlayLayout, object);
				overlay.addFunction(giau.InputOverlay.EVENT_EXIT, handleOverlayExit, object);
				overlay.show();
			}, window, {"element":testOverlay});
				
		}else{
			setTimeout(afterDelay, 200);
		}
	}
	function handleOverlayShow(e){
		var element = e.elementContainer();
		
		var container = Code.newDiv();
			Code.addChild(element, container);
		var content = new giau.InputFieldDate(container,null); 
		this.content = content;
		this.container = container;
		//
		var timestamp = "2016-11-28 09:04:59.1234";
		this.content.value(timestamp);
		console.log("FIRST VALUE: "+this.content.value());
	}
	function handleOverlayHide(e){
		console.log("hide");
	}
	function handleOverlayLayout(e){
		// center self
		var container = this.container;
		var calendarWidth = 200;
		var calendarHeight = 120;
		var containerWidth = Code.getElementWidth(e.elementContainer());
		var containerHeight = Code.getElementHeight(e.elementContainer());
		var left = Math.floor((containerWidth - calendarWidth)*0.5);
		var top = Math.floor((containerHeight - calendarHeight)*0.5);
		Code.setStyleDisplay(container,"inline-block");
		Code.setStylePosition(container,"relative");
		Code.setStyleTop(container,top+"px");
		Code.setStyleWidth(container,calendarWidth+"px");
		Code.setStyleHeight(container,calendarHeight+"px");
		Code.setStyleMargin(container,0+"px");
		Code.setStylePadding(container,0+"px");
		Code.setStyleBorderWidth(container,0+"px");
		Code.setStyleBackgroundColor(container,Code.getJSColorFromARGB(0x990000FF));
		//

		// layout subelements
		this.content._updateLayout();
	}
	function handleOverlayExit(e){
		console.log("exit");
		var timestamp = this.content.value();
		console.log("FINAL VALUE: "+timestamp);
		//e.kill();
	}
	setTimeout(afterDelay, 800);
	</script>
	-->
<?php
}
function giau_admin_menu_page_submenu_file_upload(){
?>
	<h1>File Upload</h1>
	<div></div>
	<div class="giauFileBrowser limitedWidth" style="">
		<div data-icon-key="icon_default" data-icon-value="<?php echo giau_plugin_images_url(); ?>/file_browser/icon_fb_blank.png"></div>
		<div data-icon-key="icon_folder" data-icon-value="<?php echo giau_plugin_images_url(); ?>/file_browser/icon_fb_folder.png"></div>
		<div data-icon-key="icon_image_background" data-icon-value="<?php echo giau_plugin_images_url(); ?>/file_browser/icon_fb_image_background.png"></div>
	</div>
<?php
}

function giau_admin_menu_page_submenu_backup(){	
	$URL_BACKUP_DOWNLOAD = add_query_arg('page','giau-plugin-submenu-data-download');
	$URL_BACKUP_UPLOAD = add_query_arg('page','giau-plugin-submenu-data-upload');
?>
	<!-- <h1 style="vertical-align:middle;"><img src="<?php echo $iconBlackMini; ?>"  style="display:inline-block; vertical-align:middle;" />Giau Plugin</h1> -->
	<h1>Temp Cache</h1>

	<h2>Clear Temp directory</h2>
	<div id="temp_remove_element" class="giauBackupButton"></div>
	<div id="temp_remove_feedback"></div>
	<div style="font-size: 10px;">temporary files created here are available publicly to download, after downloading an asset, clear the temp directory to remove all remote file storage.</div>


	<h1>Database Backup</h1>

	<h2>Download Database Backup</h2>
	<div id="download_database_element" class="giauBackupButton"></div>
	<div id="download_database_link"></div>
	
	<h2>Upload Database Backup (.txt)</h2>
	
	<div class="giauDropArea giauBackupButton">
		<div data-parameter-accepted-filetype="text/plain"></div>
		<div data-parameter-accepted-filetype="text/javascript"></div>
		<div data-parameter-key="operation" data-parameter-value="backup_upload_database"></div>
		<div>Drag & Drop database file here to auto-upload</div>
	</div>

	
	<h1>File Backup</h1>

	<h2>Download File Backup</h2>
	<div id="download_file_element" class="giauBackupButton"></div>
	<div id="download_file_link"></div>

	<h2>Upload File Backup (.zip)</h2>
	<div class="giauDropArea giauBackupButton">
		<div data-parameter-accepted-filetype="application/zip"></div>
		<div data-parameter-key="operation" data-parameter-value="backup_upload_uploads_zip"></div>
		<div>Drag & Drop archive file here to auto-upload</div>
	</div>




	<script>
	function afterDelay(){
		console.log("afterDelay");
		// console.log(giau)
		// console.log(window.giau)
		if(window.giau){
			installBackupButton("temp_remove_element", "temp_remove_feedback", "temp_directory_remove",
				"Press To Remove Temp Directory", null);
			installBackupButton("download_database_element", "download_database_link", "backup_download_database",
				"Press To Download Database Backup", "database_json");
			installBackupButton("download_file_element", "download_file_link", "backup_download_uploads_zip",
				"Press To Download Files Backup","uploads_zip");
		}else{
			setTimeout(afterDelay, 200);
		}
	}
	setTimeout(afterDelay, 800);

	function installBackupButton(elementName, linkName, operationName, phraseButton, returnedField){
			var elementButtonDownload = Code.getElements(Code.getBody(), function(e){
				return Code.getProperty(e,"id") == elementName;
			}, true)[0];
			var elementDatabaseLink = Code.getElements(Code.getBody(), function(e){
				return Code.getProperty(e,"id") == linkName;
			}, true)[0];
			//console.log(elementButtonDownload);
			// Code.setStyleMinWidth(elementButtonDownload,200+"px");
			// Code.setStyleMinHeight(elementButtonDownload,50+"px");
			// Code.setStyleTextAlign(elementButtonDownload,"center");
			// Code.setStyleColor(elementButtonDownload,Code.getJSColorFromARGB(0xFF000000));
			// Code.setStyleBackgroundColor(elementButtonDownload,Code.getJSColorFromARGB(0xFFDD6677));
			Code.setContent(elementButtonDownload,phraseButton);
			var ajax = new Ajax(true);
			var dispatch = new JSDispatch();
			dispatch.addJSEventListener(elementButtonDownload, Code.JS_EVENT_MOUSE_DOWN, function(e){
				if(!Code.getMouseLeftClick(e)){ return; }
				var url = "./";
				ajax.url(url);
				ajax.timeout(100*1000);
				ajax.method(Ajax.METHOD_TYPE_POST);
				ajax.append('operation',operationName);
				ajax.callback(function(e){
					var json = Code.parseJSON(e);
					if(json && json["result"]=="success"){
						var jsonData = json["data"];
						if(jsonData){
							if(returnedField){
								var databaseURL = jsonData[returnedField];
								Code.open(databaseURL);
								var br = Code.newBreak();
								var div = Code.newAnchor(databaseURL,databaseURL);
								Code.addChild( elementDatabaseLink, br);
								Code.addChild( elementDatabaseLink, div);
							}
						}else{ // output success feedback
							var div = Code.newDiv("success");
							Code.addChild( elementDatabaseLink, div);
							var ticker = new Ticker(1000);
							ticker.addFunction(Ticker.EVENT_TICK,function(){
								ticker.stop();
								Code.removeFromParent(div);
							},null);
							ticker.start();
						}
					}
				});
				ajax.send();
			});
	}

	</script>

	<?php
}
function giau_test(){
	error_log("GIAU TEST");
}


function giau_admin_menu_page_submenu_file_backup(){
	$URL_BACKUP_DOWNLOAD = add_query_arg('page','giau-plugin-submenu-file-download');
	$URL_BACKUP_UPLOAD = add_query_arg('page','giau-plugin-submenu-file-upload');
?>
	<h1 style="vertical-align:middle;"><img src="<?php echo $iconBlackMini; ?>"  style="display:inline-block; vertical-align:middle;" />Giau Plugin</h1>
	<h1>File Backup</h1>
	<ul>
		<li><a href="<?php echo $URL_BACKUP_DOWNLOAD; ?>">Download Backup</a></li>
		<li><a href="<?php echo $URL_BACKUP_UPLOAD; ?>">Upload Backup</a></li>
	<?php
	return;
	$zipDirectory = giau_plugin_upload_root_dir();
	$zipFilename = "/tmp/zipfile.zip";
	giau_zip_directory($zipDirectory, $zipFilename);
	// LINK TO FILE ...
}

function giau_zip_directory($zipDirectory, $zipFilename){
	/*
	$requiredExtensions = ["zip","zlib"];
	$requiredCount = count($requiredExtensions);
	for($i=0; $i<$requiredCount; ++$i){
		$extension = $requiredExtensions[$i];
		$isLoaded = extension_loaded ( $extension );
		echo "EXTENSION LOADED: ".$extension." '" . $isLoaded . "' <br/>";
		if(!$isLoaded){
			$toLoadSO = $extension.".so";
			echo "LOADING: '".$toLoadSO."' <br/>";
			$didLoad = dl($toLoadSO);
			if(!$didLoad){
				return;
			}
		}
	}
	*/

	echo "ZIPPING: '".$zipDirectory."' to '".$zipFilename."' <br/>";
	$fileList = [];
	getDirectoryListingRecursive($zipDirectory, $fileList, 10);

	$zip = new ZipArchive();
	$zip->open($zipFilename, ZipArchive::CREATE | ZipArchive::OVERWRITE);

	giau_zip_directory_recursive($zip, $fileList, $zipDirectory);
	
	$zip->close();
}

function giau_zip_directory_recursive(&$zip, &$fileList, &$zipDirectory){
	$fileCount = count($fileList);
//	echo "COUNT: ".$fileCount." <br/>";
	for($i=0; $i<$fileCount; ++$i){
		$file = $fileList[$i];
		$absoluteFilePath = $file["path"];
		$isDirectory = $file["isDirectory"];
		if($isDirectory){
			$contents = $file["contents"];
//			echo "DIRECTORY: ".$absoluteFilePath."<br/>";
			giau_zip_directory_recursive($zip, $contents, $zipDirectory);
		}else{
			$relativePath = preg_replace('#^'. preg_quote($zipDirectory."/",'/') .'#', '', $absoluteFilePath);
			//echo $zipDirectory." && ".$absoluteFilePath." == ".$relativePath." <br/>";
			echo "".$relativePath." <br/>";
			$zip->addFile($absoluteFilePath, $relativePath);
		}
	}
}

function getCurrentRequestURL(){
	$THIS_URL = $_SERVER['REQUEST_URL'];
	return $THIS_URL;
}


function echoEmptyDiv($properties){
	$propertyKeys = getKeys($properties);
	$properyCount = count($propertyKeys);
	?><div style="display:none;" <?php
	for($j=0; $j<$properyCount; ++$j){
		$key = $propertyKeys[$j];
		$value = $properties[$key];
		echo ''.$key.' = "'.$value.'"';
	}
	?>></div>
	<?php
}
function echoEmptyDivs($autoCompleteFields){
	$elementCount = count($autoCompleteFields);
	for($i=0; $i<$elementCount; ++$i){
		$properties = $autoCompleteFields[$i];
		echoEmptyDiv($properties);
	}
}

function giau_admin_menu_page_submenu_data_entry(){
	if( !giau_is_current_user_admin() ){
		return;
	}

	$selectedTableGetParameter = $_GET['table'];

	$THIS_URL = getCurrentRequestURL();

	$LANGUAGE_URL = add_query_arg(['table'=>'languages','p'=>'0']);
	$CALENDAR_URL = add_query_arg(['table'=>'calendar','p'=>'0']);
	$BIOS_URL = add_query_arg(['table'=>'bios','p'=>'0']);
	$PAGES_URL = add_query_arg(['table'=>'pages','p'=>'0']);
	$SECTIONS_URL = add_query_arg(['table'=>'sections','p'=>'0']);

	$TABLE_LIST = [
		[
			"display" => 'Language Texts',
			"url" => $LANGUAGE_URL,
			"get_table" => "languages",
			"data_table" => "languagization",
		],
		[
			"display" => 'Calendar Events',
			"url" => $CALENDAR_URL,
			"get_table" => "calendar",
			"data_table" => "calendar",
		],
		[
			"display" => 'Bios',
			"url" => $BIOS_URL,
			"get_table" => "bios",
			"data_table" => "bio",
		],
		[
			"display" => 'Pages',
			"url" => $PAGES_URL,
			"get_table" => "pages",
			"data_table" => "page",
		],
		[
			"display" => 'Sections',
			"url" => $SECTIONS_URL,
			"get_table" => "sections",
			"data_table" => "section",
		],
	];

	$selectedTableDisplayName = "";
	$selectedTableDataName = "section"; // default
?>
	<h1>Data Entry</h1>
	
	<ul>
		<?php
			foreach ($TABLE_LIST as $key => $value) {
				$display = $value["display"];
				$url = $value["url"];
				$table = $value["get_table"];
				echo '<li><a href="'.$url.'">'.$display.'</a></li>';
				if($selectedTableGetParameter==$table){
					$selectedTableDataName = $value["data_table"];
					$selectedTableDisplayName = $display;
				}
			}
			
		?>
		<!-- <li>Widgets</li> -->
		<!-- <li></li> -->
	</ul>
	<h2><?php echo $selectedTableDisplayName; ?></h2>

	<?php
		$autoCompleteData = [
			"languagization" => [
				[
					"data-param" => "table",
					"data-value" => "languagization",
				],
				[
					"data-param-criteria-field" => "field",
					"data-value" => "languagization_hash",
				],
				[
					"data-param-criteria-field" => "field",
					"data-value" => "languagization_phrase",
				],
			],
			"calendar" => [
				[
					"data-param" => "table",
					"data-value" => "calendar",
				],
				[
					"data-param-criteria-field" => "field",
					"data-value" => "calendar_short_name",
				],
				[
					"data-param-criteria-field" => "field",
					"data-value" => "calendar_title",
				],
				[
					"data-param-criteria-field" => "field",
					"data-value" => "calendar_description",
				],
				[
					"data-param-criteria-field" => "field",
					"data-value" => "calendar_tags",
				],
			],
			"bio" => [
				[
					"data-param" => "table",
					"data-value" => "bio",
				],
				[
					"data-param-criteria-field" => "field",
					"data-value" => "bio_first_name",
				],
				[
					"data-param-criteria-field" => "field",
					"data-value" => "bio_last_name",
				],
				[
					"data-param-criteria-field" => "field",
					"data-value" => "bio_display_name",
				],
				[
					"data-param-criteria-field" => "field",
					"data-value" => "bio_position",
				],
				[
					"data-param-criteria-field" => "field",
					"data-value" => "bio_email",
				],
				[
					"data-param-criteria-field" => "field",
					"data-value" => "bio_phone",
				],
				[
					"data-param-criteria-field" => "field",
					"data-value" => "bio_description",
				],
				[
					"data-param-criteria-field" => "field",
					"data-value" => "bio_uri",
				],
				[
					"data-param-criteria-field" => "field",
					"data-value" => "bio_tags",
				],
			],
			"page" => [
				[
					"data-param" => "table",
					"data-value" => "page",
				],
				[
					"data-param-criteria-field" => "field",
					"data-value" => "page_name",
				],
				[
					"data-param-criteria-field" => "field",
					"data-value" => "page_tags",
				],
				
			],
			"section" => [
				[
					"data-param" => "table",
					"data-value" => "section",
				],
				[
					"data-param-criteria-field" => "field",
					"data-value" => "section_name",
				],
			],
			"all" => [
			 	[
			 		"data-param-url" => "url",
			 		"data-value" => "./",
			 	],
				[
					"data-param" => "operation",
					"data-value" => "get_autocomplete",
				],
				[
					"data-param" => "count",
					"data-value" => "5",
				],
				[
					"data-param-message-bus-name" => "bus_name",
					"data-value" => "autocomplete",
				],
			]
		];
	?>

	<!-- table? -->
		<div class="limitedWidth" style="display:block; position:relative; margin-right:18px;">

		<!-- <div class="giauAutoComplete" style="background-color: #F00">
			<div style="display:none;" data-param-url="url" data-value="./"></div>
			<div style="display:none;" data-param="operation" data-value="get_autocomplete"></div>
			<div style="display:none;" data-param="table" data-value="languagization"></div>
			<div style="display:none;" data-param="count" data-value="5"></div>
			<div style="display:none;" data-param-criteria-field="field" data-value="languagization_hash"></div>
			<div style="display:none;" data-param-criteria-field="field" data-value="languagization_phrase"></div>
		</div> -->
		<?php
			$autoCompleteFields = $autoCompleteData[$selectedTableDataName];
			if($autoCompleteFields){
				$defaultAutoCompleteFields = $autoCompleteData["all"];
			?>
			<div class="giauAutoComplete" style="">
			<?php
				echoEmptyDivs($defaultAutoCompleteFields);
				echoEmptyDivs($autoCompleteFields);
			?>
			</div>
			<?php
			}
		?>

		<div style="width:70%; min-height:600px; display:inline-block; float:left;"><div class="giauCRUD" style="" data-table-name="<?php echo $selectedTableDataName; ?>"></div></div><div style="width:30%; display:inline-block; text-align: right;"><div class="giauLibraryView" style="" data-name="section_id" data-display-value="section_id" data-display-title="widget_name" data-display-subtitle="section_modified">
		<div data-key="table" data-value="section"></div>
		<div data-key="library" data-value="true"></div>
		</div><div class="giauLibraryView" style="" data-name="widget_id" data-display-value="widget_id" data-display-title="widget_name" data-display-subtitle="widget_modified">
		<div data-key="table" data-value="widget"></div>
		<div data-key="library" data-value="true"></div>
		</div></div>
	</div>
<?php
}


?>
