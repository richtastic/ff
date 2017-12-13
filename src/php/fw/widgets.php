<?php
// widgets.php





function fillOutPageFromID($pageID){
	$page = giau_get_page_id($pageID);
	if($page!==null){
		fillOutFromsection_list($page["section_list"]);
	}else{
		error_log("NO PAGE : ".$pageID);
	}
}

function fillOutFromsection_list($section_list){
	if($section_list){
		$section_list = explode(",",$section_list);
		foreach($section_list as $sectionID){
			fillOutSectionFromID($sectionID);
		}
	}
}

function fillOutSectionFromID($sectionID){
	$section = giau_get_section_id($sectionID);
	if($section!=null){
		$widgetID = $section["widget"];
		$widget = giau_get_widget_id($widgetID);
		if($widget!==null){
			fillOutSectionFromWidget($widget,$section);
		}
	}else{
		error_log("NO SECTION");
	}
}
function fillOutSectionFromWidget($widget,$section){
	$widgetName = $widget["name"];
	$lookup = [];
	// lookup table
	$lookup["content_container"] = handle_widget_content_container;
	$lookup["navigation_list"] = handle_widget_navigation_list;
	$lookup["text_display"] = handle_widget_text_display;
	$lookup["vertical_divider"] = handle_widget_vertical_divider;
	$lookup["category_listing"] = handle_widget_category_listing;
	$lookup["image_gallery"] = handle_widget_image_gallery;
	$lookup["bottom_footer"] = handle_widget_bottom_footer;
	$lookup["calendar_listing"] = handle_widget_calendar_listing;
	$lookup["social_apps"] = handle_widget_social_apps;
	$lookup["language_switch"] = handle_widget_language_switch;
	$lookup["display_overlay"] = handle_widget_display_overlay;
	$lookup["bio_listing"] = handle_widget_bio_listing;
	$lookup["medal_banner"] = handle_widget_medal_banner;
	$lookup["service_listing"] = handle_widget_service_listing;
	$lookup["personnel_coverage"] = handle_widget_personnel_coverage;
	$lookup["download_listing"] = handle_widget_download_listing;
	$lookup["map_google"] = handle_widget_map_google;
	$lookup["contact_form"] = handle_widget_contact_form;
	$lookup["contact_bio"] = handle_widget_contact_bio;
	$lookup["info_status"] = handle_widget_info_status;

	$fxn = $lookup[$widgetName];
	if($fxn!=null){
		$fxn($widget,$section);
	}
}

function handle_widget_info_status($widget,$section){
	$widgetJSON = decodeWidget($widget);
	$sectionJSON = decodeSection($section);
	$style = section_get_value_widget_string($widgetJSON,$sectionJSON,"style");
	$klass = section_get_value_widget_string($widgetJSON,$sectionJSON,"class");
	$titles = section_get_value_widget_array($widgetJSON,$sectionJSON,"fields");

	$pageRequest = getPageRequest();
	$headingTitleDisplay = "";
	foreach ($titles as $item) {
		$page = $item["index"];
		$name = $item["title"];
		if( strcmp($page,$pageRequest)==0 ){
			$headingTitleDisplay = giau_languagization_substitution_and_html($name,null);
			break;
		}
	}

	
	?>
	<!-- FEATURE TITLE -->
<div class="headerTitleContainer" style="display:block;">
	<div class="headerNavigationContainer" style="display:table;">
		<!-- LOGO -->
		<div class="organizationTitleContainer" style="display:table-cell;  border-collapse: collapse; ">
			<div class="mainNavigationBarTitle" >THE FATHER'S HOUSE</div>
			<div class="mainNavigationBarHeading" ><?php echo $headingTitleDisplay; ?></div>
		</div>
		<?php
		// sub sections
		fillOutFromsection_list($section["section_list"]);
		?>
	</div>
</div>
<?php
}

function handle_widget_map_google($widget,$section){
	$widgetJSON = decodeWidget($widget);
	$sectionJSON = decodeSection($section);
	$style = section_get_value_widget_string($widgetJSON,$sectionJSON,"style");
	$klass = section_get_value_widget_string($widgetJSON,$sectionJSON,"class");
	$frameSource = section_get_value_widget_string($widgetJSON,$sectionJSON,"source");
	?>
	<!-- GOOGLE MAP -->
	<div class="giauMobileLimted limitedWidth"  style="background-color: rgba(255,255,255,0.0); text-align:center; width:100%; height:400px;" data-limited-width-activation="" data-limited-height="300px" data-limited-interaction="true">
	<!-- if the height of the item is greater than the viewable page, interaction is disabled to allow mobile devices to scroll -->
		<iframe src="<?php echo $frameSource; ?>" frameborder="0" style="overflow:hidden;height:100%;width:100%; display:inline-block; margin: 0 auto;" allowfullscreen>
		</iframe>
	</div>

	<?php
}

function handle_widget_contact_bio($widget,$section){
	$widgetJSON = decodeWidget($widget);
	$sectionJSON = decodeSection($section);
	$style = section_get_value_widget_string($widgetJSON,$sectionJSON,"style");
	$klass = section_get_value_widget_string($widgetJSON,$sectionJSON,"class");
	$bioOrdering = section_get_value_widget_array($widgetJSON,$sectionJSON,"ordering");
	$tags = section_get_value_widget_array($widgetJSON,$sectionJSON,"tags");
	?>
			<?php 
			$offset = null;
			$count = null;
			$sortIndexDirection = null;
			$bios = giau_bio_paginated($offset,$count,$sortIndexDirection,$tags);
			$bioCount = count($bios);

			$orderCount = count($bioOrdering);

			$bioList = [];

			for($i=0; $i<$bioCount; ++$i){
				$title = null;
				$bio = null;
				if($orderCount>$i){
					$lookup = $bioOrdering[$i];
					$index = $lookup["index"];
					if($index!==null){
						$bio = $bios[$index];
					}
					$title = $lookup["title"];
						$title = giau_languagization_substitution_and_html($title,null);
				}else{
					$bio = $bios[$i];
					
				}
				if(!$title){
					$title = $bio["position"];
				}
				
				$name = $bio["display_name"];
				$email = $bio["email"];
				$phone = $bio["phone"];
					$phone = getHumanReadablePhone($phone);
				$item = [
					"heading" => $title,
					"title" => $name,
					"email" => $email,
					"phone" => $phone
				];
				$bioList[] = $item;
			}
				foreach ($bioList as $bio) {
					$heading = $bio["heading"];
					$title = $bio["title"];
					$email = $bio["email"];
					$phone = $bio["phone"];
			?>
			<div class="customContactBioContainer" style="">
				<div class="customContactBioHeading" style=""><?php echo $heading; ?></div>
				<div class="customContactBioTitle" style=""><?php echo $title; ?></div>
				<?php
				if($email!==null && strlen($email)>0){
				?>
					<div style=""><a class="customContactBioEmail" href="mailto:<?php echo $email; ?>"><?php echo $email; ?></a></div>
				<?php
				}
				?>
				<div class="customContactBioPhone" style=""><?php echo $phone; ?></div>
			</div>
			<?php
				}
			?>
		<?php
}

function handle_widget_contact_form($widget,$section){
	$widgetJSON = decodeWidget($widget);
	$sectionJSON = decodeSection($section);
	$style = section_get_value_widget_string($widgetJSON,$sectionJSON,"style");
	$klass = section_get_value_widget_string($widgetJSON,$sectionJSON,"class");
	$inputs = section_get_value_widget_object($widgetJSON,$sectionJSON,"inputs");
	$message = section_get_value_widget_string($widgetJSON,$sectionJSON,"submit_message");
		if(!$message){
			$message = "Submitted";
		}
	echo '<div class="giauContactForm" data-message-success="'.$message.'" data-url="" >';
		// $inputCount = count($inputs);
		// $i;
		// for($i=0; $i<$inputCount; ++$i){
	echo '<ul data-name="inputs">';
	foreach ($inputs as $inputName => $input) {
			$name = $inputName;
			$order = $input["order"];
			$incl = $input["include"];
			$hint = $input["hint"];
				$hint = giau_languagization_substitution_and_html($hint,null);
			$required = $input["required"];
			$message = $input["message"];
				$message = giau_languagization_substitution_and_html($message,null);
			$title = $input["title"];
				$title = giau_languagization_substitution_and_html($title,null);
			if(($incl && $incl!="" && $incl=="true") || (strcmp($name,"submit")==0) ){
				echo '<li';
				if($name && $name!=""){
					echo ' data-input="'.$name.'"';
				}
				if($title && $title!=""){
					echo ' data-title="'.$title.'"';
				}
				if($hint && $hint!=""){
					echo ' data-hint="'.$hint.'"';
				}
				if($required && $required!=""){
					echo ' data-required="'.$required.'"';
				}
				if($message && $message!=""){
					echo ' data-message="'.$message.'"';
				}
				if($order && $order!=""){
					echo ' data-order="'.$order.'"';
				}
				echo '></li>';
			}
		}
	echo '</ul>';
	echo '</div>';
}

function handle_widget_download_listing($widget,$section){
	$widgetJSON = decodeWidget($widget);
	$sectionJSON = decodeSection($section);
	$style = section_get_value_widget_string($widgetJSON,$sectionJSON,"style");
	$klass = section_get_value_widget_string($widgetJSON,$sectionJSON,"class");
	$files = section_get_value_widget_array($widgetJSON,$sectionJSON,"files");
	?>
	<div class="formDownloadSectionContainer" style="background-color:#F6F7F9">
	<?php
		$fileCount = count($files);
		$i;
		for($i=0; $i<$fileCount; ++$i){
			$title = $files[$i]["title"];
				$title = giau_languagization_substitution_and_html($title,null);
			$uri = $files[$i]["uri"];
			$uri = giau_plugin_url_from_any_url($uri);
			?>
		<div class="formItemDownload">
			<a href="<?php echo $uri; ?>" target="_blank"><?php echo $title; ?></a>
		</div>
			<?php
		}
		?>
	</div>
	<?php
}

function handle_widget_medal_banner($widget,$section){
	$widgetJSON = decodeWidget($widget);
	$sectionJSON = decodeSection($section);
	$style = section_get_value_widget_string($widgetJSON,$sectionJSON,"style");
	$klass = section_get_value_widget_string($widgetJSON,$sectionJSON,"class");

	$title = section_get_value_widget_string($widgetJSON,$sectionJSON,"title");
		$title = giau_languagization_substitution_and_html($title,null);
	$body = section_get_value_widget_string($widgetJSON,$sectionJSON,"message");
		$body = giau_languagization_substitution_and_html($body,null);
	$image = section_get_value_widget_string($widgetJSON,$sectionJSON,"icon");
		$image = giau_plugin_url_from_any_url($image);

	$colorBase = section_get_value_widget_string($widgetJSON,$sectionJSON,"color_base");
	$colorLight = section_get_value_widget_string($widgetJSON,$sectionJSON,"color_light");
	$colorDark = section_get_value_widget_string($widgetJSON,$sectionJSON,"color_dark");
	

	$colorBase = colorHTMLFromColorString($colorBase);
	$colorLight = colorHTMLFromColorString($colorLight);
	$colorDark = colorHTMLFromColorString($colorDark);
	?>
	<div class="" style="display:block; background-color:<?php echo $colorBase; ?>; text-align:center; position:relative; border-style:solid; border-width:2px 0px 2px 0px; border-top-color:<?php echo $colorLight; ?>; border-bottom-color:<?php echo $colorDark; ?>;">
		<div class="departmentStatementContainer" style="">
			<div class="departmentStatementTitle" style=""><?php echo $title; ?></div>
			<div class="departmentStatementBody" style=""><?php echo $body; ?></div>
		</div>
		<div class="departmentStatementLogoContainer" style="">
			<img src="<?php echo $image; ?>" class="departmentStatementLogo" style="" />
		</div>
	</div>
	<?php
}
function handle_widget_service_listing($widget,$section){
	$widgetJSON = decodeWidget($widget);
	$sectionJSON = decodeSection($section);
	$style = section_get_value_widget_string($widgetJSON,$sectionJSON,"style");
	$klass = section_get_value_widget_string($widgetJSON,$sectionJSON,"class");
	$servicesList = section_get_value_widget_string($widgetJSON,$sectionJSON,"services");
	?>
	<div class="limitedWidth" style="display:block; background-color:#FFF; padding:20px;">
		<div class="" style="display:table; width: 100%; text-align:center;">
			<div class="" style="display:table-row; text-align:center;">
			<?php
				if($servicesList && sizeof($servicesList)>0 ){
					$len = sizeof($servicesList);
					$i;
					for($i=0; $i<$len; ++$i){
						$service = $servicesList[$i];
						$title = $service["title"];
							$title = giau_languagization_substitution_and_html($title,null);
						$body = $service["description"];
							$body = giau_languagization_substitution_and_html($body,null);
			?>
				<div class="departmentScheduleItemContainer" style="">
					<div class="departmentScheduleItemTitle"><?php echo $title; ?></div>
					<div class="departmentScheduleItemInfo"><?php echo $body; ?></div>
				</div>
			<?php
					}
				}
			?>
			</div>
		</div>
	</div>
	<?php
}
function handle_widget_personnel_coverage($widget,$section){
	$widgetJSON = decodeWidget($widget);
	$sectionJSON = decodeSection($section);
	$style = section_get_value_widget_string($widgetJSON,$sectionJSON,"style");
	$klass = section_get_value_widget_string($widgetJSON,$sectionJSON,"class");

	$offset = null;
	$count = null;
	$sortIndexDirection = null;
	$tags = section_get_value_widget_array($widgetJSON,$sectionJSON,"tags");

	$defaultImage = section_get_value_widget_string($widgetJSON,$sectionJSON,"default_image");
		// $defaultImage = "/images/personnel/anonymous.png";
	$defaultImage = giau_plugin_url_from_any_url($defaultImage);


	$bios = giau_bio_paginated($offset,$count,$sortIndexDirection,$tags);

	$bios = giau_bio_paginated($offset,$count,$sortIndexDirection,$tags);
	$bioCount = count($bios);

	$i;
	for($i=0; $i<$bioCount; ++$i){
		$bio = $bios[$i];
		$image = $bio["image_url"];
			$image = giau_languagization_substitution($image); // _and_html
			$image = giau_plugin_url_from_any_url($image);
		if(!$image){
			$image = $defaultImage;
		}
		$name = $bio["display_name"];
		$email = $bio["email"];
		$phone = $bio["phone"];
			$phone = getHumanReadablePhone($phone);
		?>
	<img class="departmentInstructorDescription" src="<?php echo $image; ?>" style="width:100px; border-radius: 50%; display:inline-block;">
	<div class="departmentInstructorDescriptionTitle"><?php echo $name; ?></div>
	<div class="departmentInstructorDescriptionInfo"><?php echo $email; ?></div>
	<div class="departmentInstructorDescriptionInfo"><?php echo $phone; ?></div>
	<?php
	}
}


function handle_widget_display_overlay($widget,$section){
	$widgetJSON = decodeWidget($widget);
	$sectionJSON = decodeSection($section);
	?>
	<div class="featureInfoOverlay giauInfoOverlay" style="">
	<?php
		fillOutFromsection_list($section["section_list"]);
	?>
	</div>
	<?php
}
function handle_widget_navigation_list($widget,$section){
	$widgetJSON = decodeWidget($widget);
	$sectionJSON = decodeSection($section);
	$style = section_get_value_widget_string($widgetJSON,$sectionJSON,"style");
	$klass = section_get_value_widget_string($widgetJSON,$sectionJSON,"class");
	$navigationList = get_value_array($sectionJSON,"components");
	$animatesUp = section_get_value_widget_string($widgetJSON,$sectionJSON,"animates_up");
	$animatesDown = section_get_value_widget_string($widgetJSON,$sectionJSON,"animates_down");
	$startsHidden = section_get_value_widget_string($widgetJSON,$sectionJSON,"start_hidden");
	$propertyAnimatesDown = "data-animates-down";
	$propertyAnimatesUp = "data-animates-up";
	$propertyStartHidden = "data-start-hidden";


	$isDarkMode =  section_get_value_widget_boolean($widgetJSON,$sectionJSON,"dark_mode");
	$darkModeText = "";
	if($isDarkMode){
		$darkModeText = 'data-darkmode="true"';
	}

	$pageRequest = getPageRequest();
	?>
	<div class="giauNavigationItemList navigationContainer <?php echo $class; ?>" style="display:inline-block; position:relative; text-align: center; padding:6px; text-align:center;padding: 10px; z-index:100; <?php echo $style; ?>" <?php echo $darkModeText; ?> <?php
		if($animatesDown && strlen($animatesDown)>0){
			echo ' '.$propertyAnimatesDown.'="'.$animatesDown.'" ';
		}
		if($animatesUp && strlen($animatesUp)>0){
			echo ' '.$propertyAnimatesUp.'="'.$animatesUp.'" ';
		}
		if($startsHidden && $startsHidden=="true"){
			echo ' '.$propertyStartHidden.'="'."true".'" ';
		}
	?>
		<ul>
		<?php
		foreach($navigationList as $item){
			$page = $item["page"];
			$name = $item["name"];
			$uri = $item["uri"];
			$display = $item["display_text"];
			$display = giau_languagization_substitution_and_html($display,null);
			$selected = "";
			if( strcmp($page,$pageRequest)==0 ){
				$selected = ' data-selected="selected" ';
			}
		?>
		<div class="navigationMenuItem" data-display="<?php echo $display; ?>" data-url="<?php echo $uri; ?>" data-name="<?php echo $name; ?>" <?php echo $selected; ?> ></div>
		<?php
		}
		?>
		</ul>
	</div>
	<?php
	fillOutFromsection_list($section["section_list"]);
}
function handle_widget_text_display($widget,$section){
	$widgetJSON = decodeWidget($widget);
	$sectionJSON = decodeSection($section);
	$text = $sectionJSON["text"];
		$text = giau_languagization_substitution_and_html($text,null);
	$style = section_get_value_widget_string($widgetJSON,$sectionJSON,"style");
	$klass = section_get_value_widget_string($widgetJSON,$sectionJSON,"class");
	?>
	<div class="<?php echo $klass; ?>" style="<?php echo $style; ?>"><?php echo $text; ?></div>
	<?php
	// sub sections
	fillOutFromsection_list($section["section_list"]);
}
function handle_widget_content_container ($widget,$section){
	$widgetJSON = decodeWidget($widget);
	$sectionJSON = decodeSection($section);
	$style = section_get_value_widget_string($widgetJSON,$sectionJSON,"style");
	$klass = section_get_value_widget_string($widgetJSON,$sectionJSON,"class");
	?>
	<div class="<?php echo $klass; ?>" style="<?php echo $style; ?>">
	<?php
		fillOutFromsection_list($section["section_list"]);
	?>
	</div>
	<?php
}

function handle_widget_language_switch($widget,$section){
	$widgetJSON = decodeWidget($widget);
	$sectionJSON = decodeSection($section);
	$languages = get_value_array($sectionJSON,"languages");
	$style = section_get_value_widget_string($widgetJSON,$sectionJSON,"style");
	$klass = section_get_value_widget_string($widgetJSON,$sectionJSON,"class");
	$color = section_get_value_widget_string($widgetJSON,$sectionJSON,"color");
	$dataColor = "0xFFFFFFFF";
	if($color && !(strcmp($color,"")==0) ){
		$dataColor = $color;
	}
	?>
	<div class="languageSwitchContainer" style="display:inline-block; position:absolute; right:0; top:0; padding-right:10px; z-index:100;">
	<div class="giauLanguageToggleSwitch" style="display:table-cell; padding:10px; vertical-align:middle; text-align:right;"  data-storage="<?php echo KEY_COOKIE_PARAM_LANGUAGE(); ?>" data-color="<?php echo $dataColor; ?>" >
	<?php
		$len = count($languages);
		$i;
		for($i=0; $i<$len; ++$i){
			$language = $languages[$i];
			$lang = $language["language_name"];
			$display = $language["display_text"];
			$isEnabled = get_value_boolean($language,"enabled", false) ? "true" : "false";
			$display = giau_languagization_substitution_and_html($display,null);
			?>
			<div class="<?php echo $klass; ?>" style="display:inline-block; <?php echo $style; ?>" data-language="<?php echo $lang; ?>" data-display="<?php echo $display; ?>" data-url="./" data-enabled="<?php echo $isEnabled; ?>"></div>
			<?php
		}
	?>
	</div>
	</div>
	<?php
	// <div style="display:inline-block;" data-language="ko" data-display="KO" data-url="./"></div>
	fillOutFromsection_list($section["section_list"]);
}

function handle_widget_vertical_divider($widget,$section){
	$widgetJSON = decodeWidget($widget);
	$sectionJSON = decodeSection($section);
	$show_bar = section_get_value_widget_boolean($widgetJSON,$sectionJSON,"show_bar");
	// <div class="sectionContainerDividerSmall limitedWidth"  style="">
	?>
	
	<div class="giauVerticalDividerContainer limitedWidth"  style="">
	<?php
	if($show_bar){
		?>
		<div class="giauVerticalDividerBar"  style=""></div>
		<?php
	}
	?>
	</div>
	<?php
	// sub sections
	fillOutFromsection_list($section["section_list"]);
}

function handle_widget_category_listing($widget,$section){
	$widgetJSON = decodeWidget($widget);
	$sectionJSON = decodeSection($section);
	$categoryList = $sectionJSON["categories"];
	$categoryLength = count($categoryList);
	$rounded = section_get_value_widget_boolean($widgetJSON,$sectionJSON,"rounded") ? "true" :  "false";
	$style = section_get_value_widget_string($widgetJSON,$sectionJSON,"style");
	$klass = section_get_value_widget_string($widgetJSON,$sectionJSON,"class");
	?>
	<div class="giauCategoryListingContainer limitedWidth <?php echo $klass; ?>" style="<?php echo $style; ?>">
		<div class="giauCategoryListing">
			<?php
			$i;
			for($i=0;$i<$categoryLength;++$i){
				$category = $categoryList[$i];
				$image = $category["image"];
					$image = giau_plugin_url_from_any_url($image);
				$name = $category["name"];
					$name = giau_languagization_substitution_and_html($name,"");
				$uri = $category["uri"];
				$shading = "";
				$cover = "";
				?>
				<div style="display:none;" data-data="true" data-rounded="<?php echo $rounded; ?>" data-title="<?php echo $name; ?>" data-image="<?php echo $image; ?>" data-url="<?php echo $uri; ?>" data-cover="<?php echo $cover; ?>"  data-shading="<?php echo $shading; ?>" ?>" ></div>
				<?php
			}
			?>
		</div>
	</div>
	<?php
	// sub sections
	fillOutFromsection_list($section["section_list"]);
}


function handle_widget_image_gallery($widget,$section){
	$widgetJSON = decodeWidget($widget);
	$sectionJSON = decodeSection($section);
	$autoPlay = section_get_value_widget_number_int($widgetJSON,$sectionJSON,"autoplay");
	$displayNavigation = section_get_value_widget_boolean($widgetJSON,$sectionJSON,"display_navigation") ? "true" : "false";

	$imageList = section_get_value_widget_array($widgetJSON,$sectionJSON,"images");

	$showPageIndicators = section_get_value_widget_boolean($widgetJSON,$sectionJSON,"page_indicators") ? "true" : "false";
	$overlayColor = section_get_value_widget_string($widgetJSON,$sectionJSON,"overlay_color");
	$divHeight = section_get_value_widget_string($widgetJSON,$sectionJSON,"height");
	if(!$divHeight){
		$divHeight = "500px";
	}
	$style = section_get_value_widget_string($widgetJSON,$sectionJSON,"style");
	$klass = section_get_value_widget_string($widgetJSON,$sectionJSON,"class");
	// position:relative; width:100%; height:400px;
	?>
		<div class="giauImageGallery <?php echo $klass; ?>" data-ovarlay-color="<?php echo $overlayColor; ?>" data-show-page-indicators="<?php echo $showPageIndicators; ?>" data-autoplay="<?php echo $autoPlay; ?>" data-navigation="<?php echo $displayNavigation; ?>" style="<?php echo $style; ?> position:relative; width:100%; height:<?php echo $divHeight; ?>;">
		<?php
			$i;
			$len = count($imageList);
			for($i=0; $i<$len; ++$i){
				$image = $imageList[$i];
				$image = giau_plugin_url_from_any_url($image);
				?>
				<div data-source="<?php echo $image; ?>" style="display:none;"></div>
				<?php
			}
		// sub sections
		fillOutFromsection_list($section["section_list"]);
		?>
		</div>
	<?php
}

function handle_widget_bottom_footer($widget,$section){
	?>
	<div class="giauFooterContainer sectionContainerFooter">
		<?php
		// sub sections
		fillOutFromsection_list($section["section_list"]);
		?>
	</div>
	<?php
}

function handle_widget_social_apps($widget,$section){
	$widgetJSON = decodeWidget($widget);
	$sectionJSON = decodeSection($section);
	$lookupList = get_value_array(get_value_array(get_value_array($widgetJSON,"fields"),"social"),"fields");
	$valueList =  get_value_array($sectionJSON,"social"); //section_get_value_widget_array($widgetJSON,$sectionJSON,"fields");
	$klass = section_get_value_widget_array($widgetJSON,$sectionJSON,"class");
	?>
	<div class="footerElementSocialGrouping">
	<?php
	foreach($lookupList as $lookupKey => $lookupValue){
		$item = $valueList[$lookupKey];
		if($item){
			//print_r($item);
			$uri = $item["uri"];
			$image = $item["icon"];
				$image = giau_plugin_url_from_any_url($image);
			$style2 = "";
			if($uri==""){
				$style2 = "opacity: 0.25;";
			}
			if($uri){
				echo '<a href="'.$uri.'">';
			}
				echo '<img class="'.$klass.'" style="'.$style2.'" src="'.$image.'" />';
			if($uri){
				echo '</a>';
			}
			
		}
	}
	?>
	</div>
	<?php

	// sub sections
	fillOutFromsection_list($section["section_list"]);
}

function handle_widget_calendar_listing($widget,$section){
	$widgetJSON = decodeWidget($widget);
	$sectionJSON = decodeSection($section);
	$tagList = section_get_value_widget_array($widgetJSON,$sectionJSON,"tags");
	$orderRecentFirst = section_get_value_widget_boolean($widgetJSON,$sectionJSON,"order_recent_first");
	$rangeStart = section_get_value_widget_number_int($widgetJSON,$sectionJSON,"range_start");
	$rangeEnd = section_get_value_widget_number_int($widgetJSON,$sectionJSON,"range_end");
	$isRelative = section_get_value_widget_boolean($widgetJSON,$sectionJSON,"relative");
	$minCount = section_get_value_widget_boolean($widgetJSON,$sectionJSON,"min_count");
	$maxCount = section_get_value_widget_boolean($widgetJSON,$sectionJSON,"max_count");
	$style = section_get_value_widget_string($widgetJSON,$sectionJSON,"style");
	$klass = section_get_value_widget_string($widgetJSON,$sectionJSON,"class");
	?>
	
	<div class="giauCalendarList <?php echo $klass; ?>" style="<?php echo $style; ?>"
		data-months-short="<?php echo(implode(",",getCookieMonthsOfYearShort())); ?>"
		data-months-long="<?php echo(implode(",",getCookieMonthsOfYearLong())); ?>"
		data-days-short="<?php echo(implode(",",getCookieDaysOfWeekShort())); ?>"
		data-days-long="<?php echo(implode(",",getCookieDaysOfWeekLong())); ?>"
		data-min-count="<?php echo($minCount); ?>"
		data-max-count="<?php echo($maxCount); ?>"
		>
			<?php
				$startDate;
				$endDate;
				if($isRelative){
					$dateNow = getDateNow();
					$dateLimit = addTimeToSeconds($dateNow, 0,0,0, 0,0,$rangeStart/1000, 0);
					$startDate = stringFromDate($dateLimit);
					$dateLimit = addTimeToSeconds($dateNow, 0,0,0, 0,0,$rangeEnd/1000, 0);
					$endDate = stringFromDate($dateLimit);
				}else{ // absolute
					$startDate = stringFromDate($rangeStart/1000);
					$endDate = stringFromDate($rangeEnd/1000);
				}
				$orderDateNumber = $orderRecentFirst ? 1 : 0;
				$operationOffset = 0;
				$operationCount = 100;
				$operationOrder = [ ["start_date",$orderDateNumber], ["duration",1], ["id",0] ];
				$results = giau_calendar_paginated($operationOffset,$operationCount,$operationOrder, $startDate,$endDate, $tagList);
				$length = count($results);
				$index = 0;
				foreach($results as $row){
					$row["$__"] = $index;
					$included = ["$__","title","description","start_date","duration"];
					$labels = ["data-index","data-title","data-description","data-start-date","data-duration"];
					$extra = "";
					$div = divWithDatasValuesLabelsExtras($row, $included, $labels, $extra);
					echo $div;
					++$index;
				}
	// sub sections
	fillOutFromsection_list($section["section_list"]);
			?>
	
	</div>
	<div class="" style="padding-top:32px;"></div>
	<?php
}

function handle_widget_bio_listing($widget,$section){
	$widgetJSON = decodeWidget($widget);
	$sectionJSON = decodeSection($section);

	$defaultBio = section_get_value_widget_string($widgetJSON,$sectionJSON,"default_display");
		$defaultBio = giau_languagization_substitution_and_html($defaultBio,"");
	$defaultImage = section_get_value_widget_string($widgetJSON,$sectionJSON,"default_image");
		$defaultImage = giau_plugin_url_from_any_url($defaultImage);
	$style = section_get_value_widget_string($widgetJSON,$sectionJSON,"style");
	$klass = section_get_value_widget_string($widgetJSON,$sectionJSON,"class");

	$offset = null;
	$count = null;
	$sortIndexDirection = null;
	$tags = section_get_value_widget_string($widgetJSON,$sectionJSON,"tags"); // get_value_array($sectionJSON,"class");

	$bios = giau_bio_paginated($offset,$count,$sortIndexDirection,$tags);
	$bioCount = count($bios);
//  style="background-color: rgb(246, 247, 29);">
	?>
	<div class="giauBiographyListContainer">
	<div class="giauBiographyList <?php echo $klass; ?>" style="<?php echo $style; ?>" data-default-image="<?php echo $defaultImage; ?>" data-default-description="<?php echo $defaultBio; ?>">
	<?php
		$i;
		for($i=0; $i<$bioCount; ++$i){
			$bio = $bios[$i];
			$firstName = $bio["first_name"];
			$lastName = $bio["last_name"];
			$displayName = $bio["display_name"];
			$position = $bio["position"];
			$email = $bio["email"];
			$phone = $bio["phone"];
				$phone = getHumanReadablePhone($phone);
			$description = $bio["description"];
			$uri = $bio["uri"];
			$image = $bio["image_url"];
				$image = giau_languagization_substitution($image); // _and_html
			if($image!=""){
				$image = giau_plugin_url_from_any_url($image);
			}
			?>
			<div style="display:none;" data-data="true"
			data-first-name="<?php echo $firstName; ?>"
			data-last-name="<?php echo $lastName;?>"
			data-display-name="<?php echo $displayName; ?>"
			data-title="<?php echo $position; ?>"
			data-email="<?php echo $email; ?>"
			data-phone="<?php echo $phone; ?>"
			data-description="<?php echo $description; ?>"
			data-image="<?php echo $image; ?>"
			data-uri="<?php echo $uri; ?>"></div>
			<?php
		}
	?>
	</div>
	</div>
	<?php

	
	
}



function decodeSection($section){
	return json_decode($section["configuration"],true);
}
function decodeWidget($widget){
	return json_decode($widget["configuration"],true);
}
function section_get_value_widget_boolean($widget,$section,$field){
	$value = section_get_value_widget_any($widget,$section,$field);
	if($value!==null){
		if($value=="true"){
			return true;
		}
	}
	return false;
}
function get_value_boolean($object,$field, $default){
	$value = $object[$field];
	if($value!==null){
		if($value==="true"){
			return true;
		}else if($value==="false"){
			return false;
		}
	}
	return $default;
}
function section_get_value_widget_number_int($widget,$section,$field){
	$value = section_get_value_widget_any($widget,$section,$field);
	if($value!=null){
		return intval($value);
	}
	return 0;
}
function section_get_value_widget_number_float($widget,$section,$field){
	$value = section_get_value_widget_any($widget,$section,$field);
	if($value!=null){
		return floatval($value);
	}
	return 0;
}
function section_get_value_widget_string($widget,$section,$field){
	$value = section_get_value_widget_any($widget,$section,$field);
	if($value!=null){
		// STRING CHECK
		return $value;
	}
	return "";
}
function section_get_value_widget_array($widget,$section,$field){
	$value = section_get_value_widget_any($widget,$section,$field);
	if($value!=null){
		// ARRAY CHECK
		return $value;
	}
	return [];
}
function section_get_value_widget_object($widget,$section,$field){
	$value = section_get_value_widget_any($widget,$section,$field);
	if($value!=null){
		// OBJECT CHECK
		return $value;
	}
	return [];
}
function section_get_value_widget_any($widget,$section,$field){
	if(!$section || !$widget){
		return null;
	}
	$sectionValue = $section[$field]; // value
	$widgetInfo = $widget[$field]; // info
	if($sectionValue!=null){
		return $sectionValue;
	}
	return null;
}



function get_value_array($object,$field){
	if(!$object){
		return [];
	}
	$value = $object[$field];
	if($value!=null){
		return $value;
	}
	return [];
}


?>
