<?php
// tables.php

// NAMES

function WORDPRESS_TABLE_PREFIX(){
	global $wpdb;
	$wordpress_prefix = $wpdb->prefix;
	return $wordpress_prefix;
}
function GIAU_UNIQUE_IDENTIFIER(){
	return "giau";
}
function GIAU_TABLE_PREFIX(){
	return "giau_";
}
function GIAU_TABLE_NAME_LANGUAGIZATION(){
	return "languagization";
}
function GIAU_TABLE_NAME_WEBSITE(){
	return "presentation_website";
}
function GIAU_TABLE_NAME_PAGE(){
	return "presentation_page";
}
function GIAU_TABLE_NAME_SECTION(){
	return "section";
}
function GIAU_TABLE_NAME_WIDGET(){
	return "widget";
}
function GIAU_TABLE_NAME_CALENDAR(){
	return "calendar";
}
function GIAU_TABLE_NAME_BIO(){
	return "bio";
}

function GIAU_FULL_TABLE_NAME_LANGUAGIZATION(){
	return WORDPRESS_TABLE_PREFIX()."".GIAU_TABLE_PREFIX()."".GIAU_TABLE_NAME_LANGUAGIZATION();
}
function GIAU_FULL_TABLE_NAME_WEBSITE(){
	return WORDPRESS_TABLE_PREFIX()."".GIAU_TABLE_PREFIX()."".GIAU_TABLE_NAME_WEBSITE();
}
function GIAU_FULL_TABLE_NAME_PAGE(){
	return WORDPRESS_TABLE_PREFIX()."".GIAU_TABLE_PREFIX()."".GIAU_TABLE_NAME_PAGE();
}
function GIAU_FULL_TABLE_NAME_SECTION(){
	return WORDPRESS_TABLE_PREFIX()."".GIAU_TABLE_PREFIX()."".GIAU_TABLE_NAME_SECTION();
}
function GIAU_FULL_TABLE_NAME_WIDGET(){
	return WORDPRESS_TABLE_PREFIX()."".GIAU_TABLE_PREFIX()."".GIAU_TABLE_NAME_WIDGET();
}
function GIAU_FULL_TABLE_NAME_CALENDAR(){
	return WORDPRESS_TABLE_PREFIX()."".GIAU_TABLE_PREFIX()."".GIAU_TABLE_NAME_CALENDAR();
}
function GIAU_FULL_TABLE_NAME_BIO(){
	return WORDPRESS_TABLE_PREFIX()."".GIAU_TABLE_PREFIX()."".GIAU_TABLE_NAME_BIO();
}

		/*
		id int NOT NULL AUTO_INCREMENT,
		created VARCHAR(32) NOT NULL,
		modified VARCHAR(32) NOT NULL,
		widget int NOT NULL,
		configuration TEXT NOT NULL,
		extend int,
		section_list VARCHAR(65535) NOT NULL,
		*/
function GIAU_TABLE_DEFINITION_TO_PRESENTATION(&$tableDefinition){ // for client consumption
	// remove the functions key
	unset($tableDefinition["functions"]);
	$i;
	// remove server validation params
	$columns = &$tableDefinition["columns"];
	$keys = getKeys($columns);
	$len = count($keys);
	for($i=0; $i<$len; ++$i){
		$key = $keys[$i];
		if($columns[$key]["validation"]){
			unset($columns[$key]["validation"]);
		}
	}

	$presentation = &$tableDefinition["presentation"];
	if($presentation["joining"]){
		unset($presentation["joining"]);
	}

	return $tableDefinition;
}

function GIAU_TABLE_DEFINITION_ALL_TABLES(){
	return [
			GIAU_TABLE_DEFINITION_LANGUAGIZATION(),
			GIAU_TABLE_DEFINITION_CALENDAR(),
			GIAU_TABLE_DEFINITION_WIDGET(),
			GIAU_TABLE_DEFINITION_SECTION(),
			GIAU_TABLE_DEFINITION_PAGE(),
			GIAU_TABLE_DEFINITION_BIO(),
			GIAU_TABLE_DEFINITION_WEBSITE()
		];
}
function GIAU_TABLE_DEFINITION_WIDGET(){
	return
	[
		"table" => GIAU_FULL_TABLE_NAME_WIDGET(),
		"columns" => [
			"id" =>  [
				"type" => "string-number",
				"attributes" =>  [
					"display_name" => "ID",
					"order" => "99",
					"primary_key" => "true",
					"sort" => "false",
					"editable" => "false",
					"default" => "",
				],
			],
			"created" => [
				"type" => "string-date",
				"attributes" =>  [
					"display_name" => "Created",
					"order" => "1",
					"sort" =>  "true",
					"editable" => "false",
					"default" => "",
				],
			],
			"modified" => [
				"type" => "string-date",
				"attributes" =>  [
					"display_name" => "Modified",
					"order" => "2",
					"sort" =>  "true",
					"editable" => "false",
					"default" => "",
				],
			],
			"name" => [
				"type" => "string",
				"attributes" =>  [
					"display_name" => "Name",
					"order" => "0",
					"sort" =>  "true",
					"editable" => "true",
					"default" => "",
				],
			],
			"configuration" => [
				"type" => "string-json",
				"attributes" =>  [
					"display_name" => "Configuration",
					"order" => "5",
					"sort" =>  "false",
					"editable" => "true",
					"default" => "{}",
				],
			]
		],
		"presentation" => [
			"column_aliases" => [
				"widget_id" => "id",
				"widget_created" => "created",
				"widget_modified" => "modified",
				"widget_name" => "name",
				"widget_configuration" => "configuration",
			],
			"columns" => [
				// 
			],
			"ordering" => [
				[
					"column" => "name",
					"order" => "ASC",
				],
				[
					"column" => "id",
					"order" => "DESC",
				]
			],
		]
	];
}
function GIAU_TABLE_DEFINITION_SECTION(){
	return
	[
		"table" => GIAU_FULL_TABLE_NAME_SECTION(),
		"columns" => [
			"id" =>  [
				"type" => "string-number",
				"attributes" =>  [
					"display_name" => "ID",
					"order" => "99",
					"primary_key" => "true",
					"sort" => "false",
					"editable" => "false",
					"display" => "false",
					"default" => null,
				],
				"validation" => [
					//
				],
			],
			"created" => [
				"type" => "string-date",
				"attributes" =>  [
					"display_name" => "Created",
					"order" => "4",
					"sort" =>  "true",
					"editable" => "false",
					"default" => null,
				],
				"validation" => [
					"create" => [
						"timestamp" => "now" // replace with now
					],
				],
			],
			"modified" => [
				"type" => "string-date",
				"attributes" =>  [
					"display_name" => "Modified",
					"order" => "5",
					"sort" =>  "true",
					"editable" => "false",
					"default" => null,
				],
				"validation" => [
					"create" => [
						"timestamp" => "now" // replace with now
					],
					"update" => [
						"timestamp" => "now" // replace with now
					],
				],
			],
			"widget" => [
				"type" => "string-array",
				"attributes" =>  [
					"display_name" => "Widget",
					"order" => "1",
					"sort" =>  "true",
					"editable" => "true",
					"default" => null,
				],
				"validation" => [
					"create" => [
						// widget doesn't have to exist on creation
					],
					"update" => [
						"reference" => [
							"table" => GIAU_FULL_TABLE_NAME_WIDGET(),
							"column" => "id",
							"logic" => "equal",
						],
					],
				]
			],
			"configuration" => [
				"type" => "string-json",
				"attributes" =>  [
					"display_name" => "Configuration",
					"order" => "3",
					"sort" =>  "false",
					"editable" => "true",
					"default" => "{}",
				],
			],
			"name" => [
				"type" => "string",
				"attributes" =>  [
					"display_name" => "Name",
					"order" => "0",
					"sort" =>  "true",
					"editable" => "true",
					"default" => "",
				],
				"validation" => [
					"create" => [
						"max_length" => [
							"characters" => "255",
						],
					],
				],
			],
			"section_list" => [
				"type" => "string-array",
				"attributes" =>  [
					"display_name" => "Subsections",
					"order" => "2",
					"sort" =>  "false",
					"editable" => "true",
					"default" => "",
				],
				"validation" => [
					"create" => [
						"recursion_contains" => [  // cannot contain self
							"logic" => "not_equal",
							"column_source" => "id",
							"column_check" => "section_list",
							"limit" => "0",
						],
					],
				],
			],
		],
		"presentation" => [
			"column_aliases" => [
				"section_id" => "id",
				"section_created" => "created",
				"section_modified" => "modified",
				"section_configuration" => "configuration",
				"section_name" => "name",
				"section_subsections" => "section_list",
				"widget_id" => "widget",
				"widget_configuration" => null,
				"widget_name" => null,
			],
			"joining" => [
				"widget_configuration" => [
					"table" => GIAU_FULL_TABLE_NAME_WIDGET(),
					"column" => "configuration",
					"column_external" => "id",
					"column_internal" => "widget",
				],
				"widget_name" => [
					"table" => GIAU_FULL_TABLE_NAME_WIDGET(),
					"column" => "name",
					"column_external" => "id",
					"column_internal" => "widget",
				],
			],
			"ordering" => [
				[
					"column" => "name",
					"order" => "ASC",
				],
				[
					"column" => "id",
					"order" => "DESC",
				]
			],
			"columns" => [
				"configuration" => [
					"json_model_column" => "widget_configuration",
				],
				"section_list" =>  [
					"drag_and_drop" =>  [
						"source" =>  [
							"max_count" => null,
							"name" => "section_id",
							"url" => "",
						],
						"metadata" => [ // reference
							"source" => "section_list",
							"match_index" => "section_id",
							"display_index" => "section_name",
						],
					],
				],
				"widget" =>  [
					"drag_and_drop" =>  [
						"source" =>  [
							"min_count" => "1",
							"max_count" => "1",
							"replace_on_add" => "true",
							"name" => "widget_id",
							"url" => "",
						],
						"metadata" => [ // reference
							"source" => "widget_list",
							"match_index" => "widget_id",
							"display_index" => "widget_name",
						],
					],
				],
			]
		],
		"functions" => [
			"crud" => [
				//"create" => GIAU_TABLE_FUNCTION_CRUD_CREATE,
				//
				GIAU_FULL_TABLE_NAME_SECTION() =>
				[
					"read_single" => giau_read_section,
					// "read_many" => giau_read_section,
				],
			],

			//
		],
	];
}
function GIAU_TABLE_FUNCTION_CRUD_CREATE($data) {
	return null;
}
function GIAU_TABLE_DEFINITION_LANGUAGIZATION(){
	return
	[
		"table" => GIAU_FULL_TABLE_NAME_LANGUAGIZATION(),
		"columns" => [
			"id" => [
				"type" => "string-number",
				"attributes" => [
					"display_name" => "ID",
					"order" => "99",
					"primary_key" => "true",
					"sort" =>  "false",
					"editable" => "false",
					"display" => "false",
				],
			],
			"created" => [
				"type" => "string-date",
				"attributes" => [
					"display_name" => "Created",
					"order" => "3",
					"sort" =>  "true",
					"editable" => "false",
				],
				"validation" => [
					"create" => [
						"timestamp" => "now" // replace with now
					],
				],
			],
			"modified" => [
				"type" => "string-date",
				"attributes" => [
					"display_name" => "Modified",
					"order" => "4",
					"sort" =>  "true",
					"editable" => "false",
				],
				"validation" => [
					"create" => [
						"timestamp" => "now" // replace with now
					],
					"update" => [
						"timestamp" => "now" // replace with now
					],
				],
			],
			"hash_index" => [
				"type" => "string",
				"attributes" => [
					"display_name" => "Hash Index",
					"order" => "0",
					"sort" =>  "true",
					"editable" => "true",
					"monospace" => "true",
				],
				"validation" => [
					"update" => [
						"max_length" => [
							"characters" => "255",
						],
					],
				],
			],
			"language" => [
				"type" => "string-option",
				"attributes" => [
					"display_name" => "Language",
					"order" => "1",
					"sort" =>  "false",
					"monospace" => "true",
					"editable" => "true",
				],
				"validation" => [
					"update" => [
						"max_length" => [
							"characters" => "16",
						],
					],
				],
			],
			"phrase_value" => [
				"type" => "string",
				"attributes" => [
					"display_name" => "Phrase",
					"order" => "2",
					"sort" =>  "true",
					"editable" => "true",
				],
			],
		],
		"presentation" => [
			"column_aliases" => [
				"languagization_id" => "id",
				"languagization_created" => "created",
				"languagization_modified" => "modified",
				"languagization_hash" => "hash_index",
				"languagization_language" => "language",
				"languagization_phrase" => "phrase_value",
			],
			"columns" => [
				"hash_index" => [
					"row_grouping" => [
						//
					]
				],
				"language" => [
					"options" => GIAU_METADATA_LANGUAGE(),
				]
			]
		]
	];
}
function GIAU_METADATA_LANGUAGE(){
	return [
		[
			"display" => "English",
			"value" => "en-US",
			"default" => "true",
		],
		[
			"display" => "Korean",
			"value" => "ko-KP",
		]
	];
}
function GIAU_TABLE_DEFINITION_BIO(){
	return
	[
		"table" => GIAU_FULL_TABLE_NAME_BIO(),
		"columns" => [
			"id" => [
				"type" => "string-number",
				"attributes" => [
					"display_name" => "ID",
					"order" => "12",
					"primary_key" => "true",
					"sort" =>  "false",
					"editable" => "false",
				],
			],
			"created" => [
				"type" => "string-date",
				"attributes" => [
					"display_name" => "Created",
					"order" => "10",
					"sort" =>  "true",
					"editable" => "false",
				],
				"validation" => [
					"create" => [
						"timestamp" => "now" // replace with now
					],
				],
			],
			"modified" => [
				"type" => "string-date",
				"attributes" => [
					"display_name" => "Modified",
					"order" => "11",
					"sort" =>  "true",
					"editable" => "false",
				],
				"validation" => [
					"create" => [
						"timestamp" => "now" // replace with now
					],
					"update" => [
						"timestamp" => "now" // replace with now
					],
				],
			],
			"first_name" => [
				"type" => "string",
				"attributes" => [
					"display_name" => "First Name",
					"order" => "1",
					"sort" =>  "true",
					"editable" => "true",
				],
			],
			"last_name" => [
				"type" => "string",
				"attributes" => [
					"display_name" => "Last Name",
					"order" => "2",
					"sort" =>  "true",
					"editable" => "true",
				],
			],
			"display_name" => [
				"type" => "string",
				"attributes" => [
					"display_name" => "Display Name",
					"order" => "0",
					"sort" =>  "true",
					"editable" => "true",
				],
			],
			"position" => [
				"type" => "string",
				"attributes" => [
					"display_name" => "Position",
					"order" => "3",
					"sort" =>  "true",
					"editable" => "true",
				],
			],
			"email" => [
				"type" => "string",
				"attributes" => [
					"display_name" => "Email",
					"order" => "4",
					"sort" =>  "true",
					"editable" => "true",
				],
			],
			"phone" => [
				"type" => "string",
				"attributes" => [
					"display_name" => "Phone",
					"order" => "5",
					"sort" =>  "true",
					"editable" => "true",
				],
			],
			"description" => [
				"type" => "string",
				"attributes" => [
					"display_name" => "Description",
					"order" => "6",
					"sort" =>  "true",
					"editable" => "true",
				],
			],
			"uri" => [
				"type" => "string",
				"attributes" => [
					"display_name" => "Web URL",
					"order" => "7",
					"sort" =>  "false",
					"editable" => "true",
				],
			],
			"image_url" => [
				"type" => "string",
				"attributes" => [
					"display_name" => "Image URL",
					"order" => "8",
					"sort" =>  "false",
					"editable" => "true",
				],
			],
			"tags" => [
				"type" => "string-array",
				"attributes" => [
					"display_name" => "Tags",
					"order" => "9",
					"sort" =>  "false",
					"editable" => "true",
				],
			],
		],
		"presentation" => [
			"column_aliases" => [
				"bio_id" => "id",
				"bio_created" => "created",
				"bio_modified" => "modified",
				"bio_first_name" => "first_name",
				"bio_last_name" => "last_name",
				"bio_display_name" => "display_name",
				"bio_position" => "position",
				"bio_email" => "email",
				"bio_phone" => "phone",
				"bio_description" => "description",
				"bio_uri" => "uri",
				"bio_image_url" => "image_url",
				"bio_tags" => "tags",
			],
			"columns" => [
				//
			],
		]
	];
}

function GIAU_TABLE_DEFINITION_CALENDAR(){
	return
	[
		"table" => GIAU_FULL_TABLE_NAME_CALENDAR(),
		"columns" => [
			"id" =>  [
				"type" => "string-number",
				"attributes" =>  [
					"display_name" => "ID",
					"order" => "6",
					"primary_key" => "true",
					"sort" => "false",
					"editable" => "false",
				],
			],
			"created" => [
				"type" => "string-date",
				"attributes" =>  [
					"display_name" => "Created",
					"order" => "7",
					"sort" =>  "true",
					"editable" => "false",
				],
				"validation" => [
					"create" => [
						"timestamp" => "now" // replace with now
					],
				],
			],
			"modified" => [
				"type" => "string-date",
				"attributes" =>  [
					"display_name" => "Modified",
					"order" => "8",
					"sort" =>  "true",
					"editable" => "false",
				],
				"validation" => [
					"create" => [
						"timestamp" => "now" // replace with now
					],
					"update" => [
						"timestamp" => "now" // replace with now
					],
				],
			],
			"short_name" => [
				"type" => "string",
				"attributes" =>  [
					"display_name" => "Short Name",
					"order" => "0",
					"sort" =>  "true",
					"editable" => "true",
				],
			],
			"title" => [
				"type" => "string",
				"attributes" =>  [
					"display_name" => "Title",
					"order" => "1",
					"sort" =>  "true",
					"editable" => "true",
				],
			],
			"description" => [
				"type" => "string",
				"attributes" =>  [
					"display_name" => "Description",
					"order" => "2",
					"sort" =>  "true",
					"editable" => "true",
				],
			],
			"start_date" => [
				"type" => "string-date",
				"attributes" =>  [
					"display_name" => "Start Date",
					"order" => "3",
					"sort" =>  "true",
					"editable" => "true",
				],
				"validation" => [
					"create" => [
						"timestamp" => "now" // replace with now
					],
				],
			],
			"duration" => [
				"type" => "string-duration",
				"attributes" =>  [
					"display_name" => "Duration",
					"order" => "4",
					"sort" =>  "true",
					"editable" => "true",
				],
			],
			"tags" => [
				"type" => "string-array",
				"attributes" => [
					"display_name" => "Tags",
					"order" => "5",
					"sort" =>  "false",
					"editable" => "true",
				],
			],
		],
		"presentation" => [
			"column_aliases" => [
				"calendar_id" => "id",
				"calendar_created" => "created",
				"calendar_modified" => "modified",
				"calendar_short_name" => "short_name",
				"calendar_title" => "title",
				"calendar_description" => "description",
				"calendar_start_date" => "start_date",
				"calendar_duration" => "duration",
				"calendar_tags" => "tags",
			],
			"columns" => [
				//
			],
		]
	];
}
function GIAU_TABLE_DEFINITION_PAGE(){
	return
	[
		"table" => GIAU_FULL_TABLE_NAME_PAGE(),
		"columns" => [
			"id" =>  [
				"type" => "string-number",
				"attributes" =>  [
					"display_name" => "ID",
					"order" => "5",
					"primary_key" => "true",
					"sort" => "false",
					"editable" => "false",
				],
			],
			"created" => [
				"type" => "string-date",
				"attributes" =>  [
					"display_name" => "Created",
					"order" => "3",
					"sort" =>  "true",
					"editable" => "false",
				],
				"validation" => [
					"create" => [
						"timestamp" => "now" // replace with now
					],
				],
			],
			"modified" => [
				"type" => "string-date",
				"attributes" =>  [
					"display_name" => "Modified",
					"order" => "4",
					"sort" =>  "true",
					"editable" => "false",
				],
				"validation" => [
					"create" => [
						"timestamp" => "now" // replace with now
					],
					"update" => [
						"timestamp" => "now" // replace with now
					],
				],
			],
			"name" => [
				"type" => "string",
				"attributes" =>  [
					"display_name" => "Name",
					"order" => "0",
					"sort" =>  "true",
					"editable" => "true",
				],
			],
			"section_list" => [
				"type" => "string-array",
				"attributes" =>  [
					"display_name" => "Sections",
					"order" => "1",
					"sort" =>  "false",
					"editable" => "true",
				],
			],
			"tags" => [
				"type" => "string-array",
				"attributes" => [
					"display_name" => "Tags",
					"order" => "2",
					"sort" =>  "false",
					"editable" => "true",
				],
			],
		],
		"presentation" => [
			"column_aliases" => [
				"page_id" => "id",
				"page_created" => "created",
				"page_modified" => "modified",
				"page_name" => "name",
				"page_section_list" => "section_list",
				"page_tags" => "tags",
			],
			"columns" => [
				// "section_list" =>  [
				// 	"drag_and_drop" =>  [
				// 		"source" =>  [
				// 			"max_count" => null,
				// 			"name" => "section_id",
				// 			"url" => "",
				// 		],
				// 		// "metadata" => [
				// 		// 	"source" => "widgets",
				// 		// ],
				// 	]
				// ],
				"section_list" =>  [
					"drag_and_drop" =>  [
						"source" =>  [
							"max_count" => null,
							"name" => "section_id",
							"url" => "",
						],
						"metadata" => [ // reference
							"source" => "section_list",
							"match_index" => "section_id",
							"display_index" => "section_name",
						],
					],
				],
			],

		]
	];
}
function GIAU_TABLE_DEFINITION_WEBSITE(){
	return
	[
		"table" => GIAU_FULL_TABLE_NAME_WEBSITE(),
		"columns" => [
			"id" =>  [
				"type" => "string-number",
				"attributes" =>  [
					"display_name" => "ID",
					"order" => "0",
					"primary_key" => "true",
					"sort" => "false",
					"editable" => "false",
				],
			],
			"created" => [
				"type" => "string-date",
				"attributes" =>  [
					"display_name" => "Created",
					"order" => "1",
					"sort" =>  "true",
					"editable" => "false",
				],
			],
			"modified" => [
				"type" => "string-date",
				"attributes" =>  [
					"display_name" => "Modified",
					"order" => "2",
					"sort" =>  "true",
					"editable" => "false",
				],
			],
			"start_page" => [
				"type" => "string-number",
				"attributes" =>  [
					"display_name" => "Start Page",
					"order" => "3",
					"sort" =>  "true",
					"editable" => "true",
				],
			],
		],
		"presentation" => [
			"column_aliases" => [
				"website_id" => "id",
				"website_created" => "created",
				"website_modified" => "modified",
				"website_start_page" => "start_page",
			],
			"columns" => [
				// 
			]
		]
	];
}
	// sectioned, binned, boxed, atomic, tagged, capsule, parcel


function giau_create_database(){
	error_log("giau_create_database");
	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' ); // dbDelta
	global $wpdb;

	// languagization lookup table
	// key: TEXT-TO-APPEAR-FOR-CALENDAR-DATE
	// language: en | en-US | kr | ...
	// value: 

	$charset_collate = $wpdb->get_charset_collate();

	// LANGUAGIZATION
	// id = unique entry number EG: 123
	// created = ISO-8601 timestamp first made  EG: 2016-07-01T18:35:43.0000Z
	// modified = ISO-8601 timestamp last changed  EG: 2015-06-28T12:34:56.0000Z
	// hash_index = index lookup  EG: "CALENDAR_TITLE_TEXT"
	// language = (ISO639-1)-(IETF tag/ISO3166-1) language code  EG: en, en-US, sp-MX, ko, ko-KP/ko-KR
	// phrase_value = value to substitute in location  EG: "Upcoming Events"
	$sql = "CREATE TABLE ".GIAU_FULL_TABLE_NAME_LANGUAGIZATION()." (
		id int NOT NULL AUTO_INCREMENT,
		created VARCHAR(32) NOT NULL,
		modified VARCHAR(32) NOT NULL,
		hash_index VARCHAR(255) NOT NULL,
		language VARCHAR(16) NOT NULL,
		phrase_value TEXT NOT NULL,
		UNIQUE KEY id (id)
		) $charset_collate
	;";
	dbDelta( $sql );

	// WIDGET
	// id
	// created
	// modified
	// name = widget name
	// configuration = default json configuration
	$sql = "CREATE TABLE ".GIAU_FULL_TABLE_NAME_WIDGET()." (
		id int NOT NULL AUTO_INCREMENT,
		created VARCHAR(32) NOT NULL,
		modified VARCHAR(32) NOT NULL,
		name VARCHAR(32) NOT NULL,
		configuration TEXT NOT NULL,
		UNIQUE KEY id (id)
		) $charset_collate
	;";
	dbDelta( $sql );

	// SECTION
	// id
	// created
	// modified
	// short_name = ?
	// title = display title
	// configuration = overriding json configuration
	// extends = section this extends from (uses as default but overrides specified criteria)
	// sectionList = list of additional sections to process, contained inside sectionList
	// 		extend int,
	$sql = "CREATE TABLE ".GIAU_FULL_TABLE_NAME_SECTION()." (
		id int NOT NULL AUTO_INCREMENT,
		created VARCHAR(32) NOT NULL,
		modified VARCHAR(32) NOT NULL,
		name VARCHAR(255) NOT NULL,
		widget int NOT NULL,
		configuration TEXT NOT NULL,
		section_list VARCHAR(65535) NOT NULL,
		UNIQUE KEY id (id)
		) $charset_collate
	;";
	dbDelta( $sql );

	// PAGES
	// id = unique entry number EG: 123
	// created = ISO-8601 timestamp first made  EG: 2016-07-01T18:35:43.0000Z
	// modified = ISO-8601 timestamp last changed  EG: 2015-06-28T12:34:56.0000Z
	// short_name
	// title
	// section_list = comma-separated list of configured section objects
	// 
	$sql = "CREATE TABLE ".GIAU_FULL_TABLE_NAME_PAGE()." (
		id int NOT NULL AUTO_INCREMENT,
		created VARCHAR(32) NOT NULL,
		modified VARCHAR(32) NOT NULL,
		name VARCHAR(255) NOT NULL,
		section_list VARCHAR(65535) NOT NULL,
		tags VARCHAR(255) NOT NULL,
		UNIQUE KEY id (id)
		) $charset_collate
	;";
	dbDelta( $sql );

	// WEBSITE
	// id = unique entry number EG: 123
	// created = ISO-8601 timestamp first made  EG: 2016-07-01T18:35:43.0000Z
	// modified = ISO-8601 timestamp last changed  EG: 2015-06-28T12:34:56.0000Z
	// start_page = main page id
	// 
	$sql = "CREATE TABLE ".GIAU_FULL_TABLE_NAME_WEBSITE()." (
		id int NOT NULL AUTO_INCREMENT,
		created VARCHAR(32) NOT NULL,
		modified VARCHAR(32) NOT NULL,
		start_page int NOT NULL,
		UNIQUE KEY id (id)
		) $charset_collate
	;";
	dbDelta( $sql );


	// CALENDAR
	// id = unique entry number EG: 123
	// created = ISO-8601 timestamp first made  EG: 2016-07-01T18:35:43.0000Z
	// modified = ISO-8601 timestamp last changed  EG: 2015-06-28T12:34:56.0000Z
	// short_name = human readable id
	// title = 
	// description = 
	// start_date = millisecond time stamp
	// duration = milliseconds
	// tags = comma-separated filtering
	$sql = "CREATE TABLE ".GIAU_FULL_TABLE_NAME_CALENDAR()." (
		id int NOT NULL AUTO_INCREMENT,
		created VARCHAR(32) NOT NULL,
		modified VARCHAR(32) NOT NULL,
		short_name VARCHAR(64) NOT NULL,
		title VARCHAR(255) NOT NULL,
		description VARCHAR(255) NOT NULL,
		start_date VARCHAR(32) NOT NULL,
		duration VARCHAR(32) NOT NULL,
		tags VARCHAR(255) NOT NULL,
		UNIQUE KEY id (id)
		) $charset_collate
	;";
	dbDelta( $sql );

	// BIO
	// id = unique entry number EG: 123
	// created = ISO-8601 timestamp first made  EG: 2016-07-01T18:35:43.0000Z
	// modified = ISO-8601 timestamp last changed  EG: 2015-06-28T12:34:56.0000Z
	// first_name = 
	// last_name = 
	// display_name = 
	// position = 
	// description = 
	// email = 
	// phone = 
	// uri = 
	// image_url = 
	// tags =  ??? group =  ??? department? tags ? for filtering
	$sql = "CREATE TABLE ".GIAU_FULL_TABLE_NAME_BIO()." (
		id int NOT NULL AUTO_INCREMENT,
		created VARCHAR(32) NOT NULL,
		modified VARCHAR(32) NOT NULL,
		first_name VARCHAR(255) NOT NULL,
		last_name VARCHAR(255) NOT NULL,
		display_name VARCHAR(255) NOT NULL,
		position VARCHAR(255) NOT NULL,
		email VARCHAR(255) NOT NULL,
		phone VARCHAR(255) NOT NULL,
		description VARCHAR(255) NOT NULL,
		uri VARCHAR(255) NOT NULL,
		image_url VARCHAR(255) NOT NULL,
		tags VARCHAR(255) NOT NULL,
		UNIQUE KEY id (id)
		) $charset_collate
	;";
	dbDelta( $sql );
	
}

// DROP

function giau_remove_database(){
	error_log("giau_remove_database");
	global $wpdb;

	// LANGUAGIZATION
	$sql = "DROP TABLE IF EXISTS ".GIAU_FULL_TABLE_NAME_LANGUAGIZATION()." ;";
	$wpdb->query($sql);

	// WEBSITE
	$sql = "DROP TABLE IF EXISTS ".GIAU_FULL_TABLE_NAME_WEBSITE()." ;";
	$wpdb->query($sql);

	// PAGE
	$sql = "DROP TABLE IF EXISTS ".GIAU_FULL_TABLE_NAME_PAGE()." ;";
	$wpdb->query($sql);

	// SECTION
	$sql = "DROP TABLE IF EXISTS ".GIAU_FULL_TABLE_NAME_SECTION()." ;";
	$wpdb->query($sql);

	// WIDGET
	$sql = "DROP TABLE IF EXISTS ".GIAU_FULL_TABLE_NAME_WIDGET()." ;";
	$wpdb->query($sql);

	// CALENDAR
	$sql = "DROP TABLE IF EXISTS ".GIAU_FULL_TABLE_NAME_CALENDAR()." ;";
	$wpdb->query($sql);

	// BIO
	$sql = "DROP TABLE IF EXISTS ".GIAU_FULL_TABLE_NAME_BIO()." ;";
	$wpdb->query($sql);
}



// CREATE
function giau_insert_website($startPage){
	error_log("giau_insert_website: ".$startPage);
	// startPage must be non-empty
	if($startPage===null){
		return;
	}
	//
	$timestampNow = stringFromDate( getDateNow() );
	global $wpdb;
	$wpdb->insert(GIAU_FULL_TABLE_NAME_WEBSITE(),
		array(
			"created" => $timestampNow,
			"modified" => $timestampNow,
			"start_page" => $startPage,
		)
	);
	return $wpdb->insert_id;
}

function giau_insert_languagization($language,$hash,$phrase){
	// hash must be non-empty
	if($hash===null || strlen($hash) == 0){
		return;
	}
	// language must be non-empty
	if($language===null || strlen($language) == 0){
		return;
	}
	// phrase must be non-null
	if($phrase===null){
		$phrase = "";
	}
	//
	$timestampNow = stringFromDate( getDateNow() );
	global $wpdb;
// TODO: CHECK IF LANG ALREADY EXISTS
	$wpdb->insert(GIAU_FULL_TABLE_NAME_LANGUAGIZATION(),
		array(
			"created" => $timestampNow,
			"modified" => $timestampNow,
			"hash_index" => $hash,
			"language" => $language,
			"phrase_value" => $phrase,
		)
	);
	return $wpdb->insert_id;
}

function giau_insert_bio($firstName,$lastName,$displayName,$position,$email,$phone,$description,$uri,$imageURL,$tags){
	//$phone = getOnlyNumbersFromString($phone); // this is a text field
	$tags = commaSeparatedStringFromString($tags, 255);
	$timestampNow = stringFromDate( getDateNow() );
	global $wpdb;
	$wpdb->insert(GIAU_FULL_TABLE_NAME_BIO(),
		array(
			"created" => $timestampNow,
			"modified" => $timestampNow,
			"first_name" => $firstName,
			"last_name" => $lastName,
			"display_name" => $displayName,
			"position" => $position,
			"email" => $email,
			"phone" => $phone,
			"description" => $description,
			"uri" => $uri,
			"image_url" => $imageURL,
			"tags" => $tags
		)
	);
	return $wpdb->insert_id;
}

function giau_insert_calendar($shortName, $title, $description, $startDate, $duration, $tags){
	$tags = commaSeparatedStringFromString($tags, 255);
	$timestampNow = stringFromDate( getDateNow() );
	global $wpdb;
	$wpdb->insert(GIAU_FULL_TABLE_NAME_CALENDAR(),
		array(
			"created" => $timestampNow,
			"modified" => $timestampNow,
			"short_name" => $shortName,
			"title" => $title,
			"description" => $description,
			"start_date" => $startDate,
			"duration" => $duration,
			"tags" => $tags,
		)
	);
}

function giau_insert_widget($widgetName,$widgetConfig){
	$widgetConfig = json_encode($widgetConfig);
	$timestampNow = stringFromDate( getDateNow() );
	global $wpdb;
	$wpdb->insert(GIAU_FULL_TABLE_NAME_WIDGET(),
		array(
			"created" => $timestampNow,
			"modified" => $timestampNow,
			"name" => $widgetName,
			"configuration" => $widgetConfig,
		)
	);
	return $wpdb->insert_id;
}

function giau_insert_section($sectionName, $widgetID, $sectionConfig, $sectionIDList){
	$widgetID = $widgetID!==null ? $widgetID : 0;
	$sectionName = $sectionName!==null ? $sectionName : "";
	if(!is_string($sectionConfig)){
		$sectionConfig = json_encode($sectionConfig);
	}
	if(!$sectionIDList){
		$sectionIDList = [];
	}
	$sectionList = implode(",", $sectionIDList);
	$timestampNow = stringFromDate( getDateNow() );
	global $wpdb;
	$wpdb->insert(GIAU_FULL_TABLE_NAME_SECTION(),
		array(
			"created" => $timestampNow,
			"modified" => $timestampNow,
			"name" => $sectionName,
			"widget" => $widgetID,
			"configuration" => $sectionConfig,
			"section_list" => $sectionList,
		)
	);
	return $wpdb->insert_id;
}
function giau_create_section($sectionName, $widgetID, $sectionConfig, $sectionList){
	error_log("giau_create_section - sectionConfig: ".$sectionConfig);
	// to array
	$sectionList = arrayFromCommaSeparatedString($sectionList);
	$sectionID = giau_insert_section($sectionName, $widgetID, $sectionConfig, $sectionIDList);
	return giau_read_section($sectionID);
}
function giau_read_section($sectionID){
	if($sectionID===null){
		return null;
	}
	if(!is_array($sectionID)){
		$sectionID = [$sectionID];
	}
	$sectionIDList = "(".commaSeparatedArray($sectionID).")";
	error_log("giau_read_section d: ".$sectionIDList);
	$tableDefinition = GIAU_TABLE_DEFINITION_SECTION();
	$tableName = giauTableNameFromDefinition($tableDefinition);
	$criteria = $tableName.".id IN ".$sectionIDList;
	$query = pagedQueryGETFromDefinition($tableDefinition, $criteria, null, "LIMIT 1");
	error_log("QUERY: ".$query);
	global $wpdb;
	$rows = $wpdb->get_results($query, ARRAY_A);
	if( count($rows)==1 ){
		return $rows[0];
	}
	return null;
}
function giau_update_section($sectionID, $sectionName, $widgetID, $sectionConfig, $sectionList){
	$section = giau_read_section($sectionID);
	if($section){
		$timestampNow = stringFromDate( getDateNow() );
		$sectionID = $section['section_id'];
		global $wpdb;
		$array = [];

		if($sectionName!==null){
			$array['name'] = $sectionName;
		}
		if($widgetID!==null){
			$array['widget'] = $widgetID;
		}
		error_log("sectionConfig: ".$sectionConfig);
		if($sectionConfig!==null){
			$array['configuration'] = $sectionConfig;
		}
		if($sectionList!==null){
			$array['section_list'] = $sectionList;
		}
		if( count($array)>0 ){
			$array['modified'] = $timestampNow;
			error_log("UPDATE: ".$sectionID);
			$result = $wpdb->update( GIAU_FULL_TABLE_NAME_SECTION(), $array,
				['id' => $sectionID]);
			if($result===false){
				return null;
			}
		}
		$section = giau_read_section($sectionID);
		return $section;
	}
	return null;

}
function giau_delete_section($sectionID){
	error_log(" delete sectionID: ".$sectionID);
	$section = giau_read_section($sectionID);
	if($section){
		$sectionID = $section['section_id'];
		global $wpdb;
		$result = $wpdb->delete(GIAU_FULL_TABLE_NAME_SECTION(), ['id' => $sectionID]);
		error_log("  result: ".$result);
		if($result===false){
			return null;
		}
		return true;
	}
	return null;
}

function giau_insert_page($pageName, $sectionIDList, $tags){
	$tags = commaSeparatedStringFromString($tags, 255);
	if(!$sectionIDList){
		$sectionIDList = [];
	}
	$sectionList = implode(",", $sectionIDList);
	$timestampNow = stringFromDate( getDateNow() );
	global $wpdb;
	$wpdb->insert(GIAU_FULL_TABLE_NAME_PAGE(),
		array(
			"created" => $timestampNow,
			"modified" => $timestampNow,
			"name" => $pageName,
			"section_list" => $sectionList,
			"tags" => $tags
		)
	);
	return $wpdb->insert_id;
}

function giau_database_backup_json(){
	global $wpdb;

	$returnData = [];
	$allTables = GIAU_TABLE_DEFINITION_ALL_TABLES();
	$tableCount = count($allTables);
	//echo "<br/>".$tableCount;
	for($i=0; $i<$tableCount; ++$i){
		$tableDefinition = $allTables[$i];
		$tableName = $tableDefinition["table"];
		$tableColumns = $tableDefinition["columns"];
		$columnCount = count($tableColumns);
			$returnData[$tableName] = [];
		// create array of column names
		$columnNames = [];
		foreach ($tableColumns as $columnName => $columnDefinition){
			array_push($columnNames, $columnName);
		}
		// get database info -- TODO: PAGING
		$query = 'SELECT * FROM '.$tableName;//.' LIMIT 1';
		$rows = $wpdb->get_results($query, ARRAY_A);
		$rowCount = count($rows);
		$backupRow = [];
		// copy contents into return data
		for($j=0; $j<$rowCount; ++$j){
			$backupRow = [];
			for($k=0; $k<$columnCount; ++$k){
				$columnName = $columnNames[$k];
				$backupRow[$columnName] = $rows[$j][$columnName];
			}
			$returnData[$tableName][] = $backupRow;
		}
	}
	$returnJSON = json_encode($returnData);
	return $returnJSON;
}

function giau_database_backup_file($directory=null){
	if(!$directory){
		$directory = giau_plugin_temp_dir();
	}
	createDirectoryIfNotExist($directory);
	$date = getDateNow();
	$year = getDateYear($date);
	$month = getDateMonth($date);
	$day = getDateDay($date);
	$hour = getDateHour($date);
	$minute = getDateMinute($date);
	$second = getDateSecond($date);
	$timestamp = "".$year."_".$month."_".$day."_".$hour."_".$minute."_".$second."";
	$endName = "database_".$timestamp.".txt";
	$jsonData = giau_database_backup_json();
	$tempDirectory = $directory;
	$fileName = $tempDirectory."/".$endName;
	$result = file_put_contents($fileName, $jsonData);
	setFilePermissionsReadOnly($fileName);
	return $endName;
}

function giau_database_backup_url(){
	$dir = giau_plugin_temp_url();
	$filename = giau_database_backup_file();
	$fileURL = $dir."/".$filename;
	error_log("fileURL: ".$fileURL);
	return $fileURL;
}


function giau_insert_database_from_json($jsonSource, $deleteTables){
	global $wpdb;
	$jsonObject = json_decode($jsonSource, true);
	$tableCount = count($jsonObject);
	foreach ($jsonObject as $tableName => $rowList) {
		if($deleteTables){
			//$dropQuery = "DROP TABLE IF EXISTS ".$tableName." ;";
			//$wpdb->query($dropQuery);
			// ALTER TABLE tablename AUTO_INCREMENT = 1
			$truncateQuery = "TRUNCATE TABLE  ".$tableName." ;";
			$wpdb->query($truncateQuery);
		}
		$rowCount = count($rowList);
		for($i=0; $i<$rowCount; ++$i){
			$row = $rowList[$i];
			$insertArray = [];
			foreach ($row as $column => $value) {
				$insertArray[$column] = $value;
			}
			// INSERT
			$result = $wpdb->insert($tableName, $insertArray);
		}
	}
	return true;
}














// HELPERS ---------------------------------------------------------------------
function pagedQueryGETFromDefinition(&$tableDefinition, $criteria=null, $ordering=null, $limiting=null){
	$query = "SELECT ";
	$ordering = $ordering != null ? $ordering : giauOrderingFromDefinition($tableDefinition);
	$tableName = giauTableNameFromDefinition($tableDefinition);
	$aliases = giauAliasesFromDefinition($tableDefinition);
	$joining = giauJoiningFromDefinition($tableDefinition);
	$hasJoins = $joining != null;
	$aliasKeys = getKeys($aliases);
	$aliasKeyCount = count($aliasKeys);
	$queryPieceColumns = [];
	for($i=0; $i<$aliasKeyCount; ++$i){
		$aliasName = $aliasKeys[$i];
		$columnName = $aliases[$aliasName];
		if($aliasName && $columnName){
			$columnQuery = $tableName.".".$columnName." AS ".$aliasName;
			$queryPieceColumns[] = $columnQuery;
		}
	}
	$joinTables = [];
	if($hasJoins){
		$joiningKeys = getKeys($joining);
		$joiningCount = count($joiningKeys);
		$joinTableColumnList = [];
		for($i=0; $i<$joiningCount; ++$i){
			$joinColumnAlias = $joiningKeys[$i];
			$joinEntry = $joining[$joinColumnAlias];
			$joinTableName = $joinEntry["table"];
			$joinColumnName = $joinEntry["column"];
			$joinExternalColumnName = $joinEntry["column_external"];
			$joinInternalColumnName = $joinEntry["column_internal"];
			$joinPiece = $joinTableName.".".$joinColumnName." AS ".$joinColumnAlias;
			$queryPieceColumns[] = $joinPiece;
			// only one external join per table - last one wins
			$joinTables[$joinTableName] = ["internal" => $joinInternalColumnName, "external" => $joinExternalColumnName];
		}
	}
	$query = $query." ".commaSeparatedArray($queryPieceColumns)." ";
	$query = $query." FROM ".$tableName;

	// if($criteria!=null){
	// 	$query = $query." WHERE ".$criteria." ";
	// }

	if($hasJoins){
		$joinTablesKeys = getKeys($joinTables);
		$joinTablesCount = count($joinTablesKeys);
		$joinPiece = "";
		for($i=0; $i<$joinTablesCount; ++$i){
			$joinTableName = $joinTablesKeys[$i];
			$joinEntry = $joinTables[$joinTableName];
			$joinColumnExternal = $joinEntry["external"];
			$joinColumnInternal = $joinEntry["internal"];
			$joinPiece = " LEFT JOIN ".$joinTableName." ON ".$joinTableName.".".$joinColumnExternal." = ".$tableName.".".$joinColumnInternal." ";
		}
		$query = $query." ".$joinPiece." ";
	}
	// THIS DOES CRITERIA AFTER -- bad
	if($criteria!=null){
		$query = $query." WHERE ".$criteria." ";
	}
	if($ordering!=null){
		$orderLen = count($ordering);
		$orderPiece = [];
		for($i=0; $i<$orderLen; ++$i){
			$order = $ordering[$i];
			$columnName = $order["column"];
			$columnAlias = giauColumnAliasFromColumnName($tableDefinition, $columnName);
			$direction = $order["order"];
			error_log("QUERY FOUND: ".$columnName." / ".$columnAlias." == ".$direction);
			$direction = $direction=="ASC" ? "ASC" : "DESC";
			$orderPiece[] = " ".$columnAlias." ".$direction;
		}
		$query = $query." ORDER BY ".commaSeparatedArray($orderPiece);
	}
	if($limiting){
		$query = $query." ".$limiting;
	}
//	$query = $query.";";
	//error_log("pagedQueryGETFromDefinition: ".$query);
	return $query;
}

function giauTableNameFromDefinition(&$tableDefinition){
	$tableName = $tableDefinition["table"];
	return $tableName;
}
function giauPresentationFromDefinition(&$tableDefinition){
	$presentation = $tableDefinition["presentation"];
	return $presentation;
}
function giauJoiningFromDefinition(&$tableDefinition){
	$presentation = giauPresentationFromDefinition($tableDefinition);
	$joining = $presentation["joining"];
	return $joining;
}
function giauOrderingFromDefinition(&$tableDefinition, &$directions=null){ // directions are based on aliases
	$presentation = giauPresentationFromDefinition($tableDefinition);
	$ordering = $presentation["ordering"];
	if(!$ordering){
		$ordering = [];
	}
	// convert columns to aliases
	// for($i=0; $i<count($ordering); ++$i){
	// 	$columnName = $ordering[$i]["column"];
	// 	$aliasName = giauColumnAliasFromColumnName($columnName);
	// 	$ordering[$i]["column"] = $aliasName;
	// }
	if($directions){ // copy input data into ordering
		$directionCount = count($directions);
		//for($i=0; $i<$directionCount; ++$i){
		for($i=$directionCount-1; $i>=0; --$i){
			$item = $directions[$i];
			$alias = $item["column"];
			$column = giauColumnNameFromColumnAlias($tableDefinition, $alias);
			$direction = $item["direction"];
			if($alias && $column && $direction){
				$direction = "$direction";
				if($direction=="1"){
					$direction = "ASC";
				}else if($direction=="-1"){
					$direction = "DESC";
				}else{
					$direction = "DESC";
				}
				$sort = [
					"column" => $column,
					"order" => $direction,
				];
				// remove existing
				for($j=0; $j<count($ordering); ++$j){
					$item = $ordering[$j];
					if($item["column"]==$column){
						array_splice($ordering, $j,1);
					}
				}
				// push on front
				array_unshift($ordering, $sort);
			}
		}
	}
	return $ordering;
}


function giauAliasesFromDefinition(&$tableDefinition){
	$presentation = giauPresentationFromDefinition($tableDefinition);
	$aliases = $presentation["column_aliases"];
	return $aliases;
}
function giauColumnAliasFromColumnName(&$tableDefinition, $columnName){
	$aliases = giauAliasesFromDefinition($tableDefinition);
	foreach ($aliases as $alias => $column){
		if($column==$columnName){
			return $alias;
		}
	}
	return null;
}
function giauColumnNameFromColumnAlias(&$tableDefinition, $aliasName){
	$aliases = giauAliasesFromDefinition($tableDefinition);
	foreach ($aliases as $alias => $column){
		if($alias==$aliasName){
			return $column;
		}
	}
	return null;
}
function giauColumnAliasesFromDefinition(&$tableDefinition){
	$aliases = giauAliasesFromDefinition($tableDefinition);
	$array = [];
	foreach ($aliases as $alias => $column){
		$array[] = $alias;
	}
	return $array;
}
function giauTableDefinitionFromOperationName($operationTable){
	$tableDefinition = null;
	if($operationTable=="languagization"){
		$tableDefinition = GIAU_TABLE_DEFINITION_LANGUAGIZATION();
	}else if($operationTable=="widget"){
		$tableDefinition = GIAU_TABLE_DEFINITION_WIDGET();
	}else if($operationTable=="section"){
		$tableDefinition = GIAU_TABLE_DEFINITION_SECTION();
	}else if($operationTable=="page"){
		$tableDefinition = GIAU_TABLE_DEFINITION_PAGE();
	}else if($operationTable=="bio"){
		$tableDefinition = GIAU_TABLE_DEFINITION_BIO();
	}else if($operationTable=="calendar"){
		$tableDefinition = GIAU_TABLE_DEFINITION_CALENDAR();
	}else if($operationTable=="website"){
		$tableDefinition = GIAU_TABLE_DEFINITION_WEBSITE();
	}
	return $tableDefinition;
}



?>
