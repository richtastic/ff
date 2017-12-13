<?php
// data.php

function giau_data_default_insert_into_database(){
	$timestampNow = stringFromDate( getDateNow() );

	global $wpdb;

	error_log("DEFAULT DATA");

	// LANGUAGIZATION
	$langEng = LANGUAGE_EN_US();
	$langKor = LANGUAGE_KO_KP();
	
	$themeBackgroundColorA = " background-color:#F6F7F9; ";

	// MAIN PAGE ITEMS:
	giau_insert_languagization($langEng,"CALENDAR_TITLE_TEXT","Upcoming Events");
	giau_insert_languagization($langKor,"CALENDAR_TITLE_TEXT","다가오는 이벤트");

	// -> BIO
	giau_insert_languagization($langEng,"BIO_FIRST_NAME_JOSEPH_KIM_TEXT","Joseph");
	giau_insert_languagization($langEng,"BIO_LAST_NAME_JOSEPH_KIM_TEXT","Kim");
	giau_insert_languagization($langEng,"BIO_DISPLAY_NAME_JOSEPH_KIM_TEXT","Reverend Joseph Kim");
	giau_insert_languagization($langEng,"BIO_POSITION_JOSEPH_KIM_TEXT","Director of Christian Education, Interim Junior High Pastor");
		giau_insert_languagization($langKor,"BIO_POSITION_JOSEPH_KIM_TEXT","기독교 교육 원장, 중등부 목사");
	giau_insert_languagization($langEng,"BIO_EMAIL_JOSEPH_KIM_TEXT","jmkim75@gmail.com");
	giau_insert_languagization($langEng,"BIO_PHONE_JOSEPH_KIM_TEXT","2132006092");
	giau_insert_languagization($langEng,"BIO_DESCRIPTION_JOSEPH_KIM_TEXT","Joseph is happily married to Joyce, the woman of his dreams. He has a bachelor’s degree in civil engineering and a Master of Divinity degree and was called into vocational ministry in 2004. He began serving at LACPC as a high school pastor in December 2006 and by God’s grace is currently serving as the director of Christian Education.");
		giau_insert_languagization($langKor,"BIO_DESCRIPTION_JOSEPH_KIM_TEXT","요셉은 꿈의 여인같은 아내 죠이스 씨랑  행복한 삶을 살고 있습니다.  토목 공사 학사 학위와 신학 석사 학위를 지니고, 2004년에 전문 사역의 부름을 받으며, 2006년 12월 LACPC 의 고등부 담임 목사로 시작하여 현재 하나님의 은혜로 기독교 교육부 이사로 섬기고 있습니다.");
	giau_insert_languagization($langEng,"BIO_URI_JOSEPH_KIM_URI_TEXT","");
	giau_insert_languagization($langEng,"BIO_URI_JOSEPH_KIM_IMAGE_URI","/images/personnel/ce-joe.png");
	
	giau_insert_languagization($langEng,"BIO_FIRST_NAME_TONY_PARK_TEXT","Tony");
	giau_insert_languagization($langEng,"BIO_LAST_NAME_TONY_PARK_TEXT","Park");
	giau_insert_languagization($langEng,"BIO_DISPLAY_NAME_TONY_PARK_TEXT","Tony Park");
	giau_insert_languagization($langEng,"BIO_POSITION_TONY_PARK_TEXT","Elder of Christian Education");
	giau_insert_languagization($langEng,"BIO_EMAIL_TONY_PARK_TEXT","");
	giau_insert_languagization($langEng,"BIO_PHONE_TONY_PARK_TEXT","");
	giau_insert_languagization($langEng,"BIO_DESCRIPTION_TONY_PARK_TEXT","");
	giau_insert_languagization($langEng,"BIO_URI_TONY_PARK_URI_TEXT","");
	giau_insert_languagization($langEng,"BIO_URI_TONY_PARK_IMAGE_URI","");
	
	giau_insert_languagization($langEng,"BIO_FIRST_NAME_KURT_KIM_TEXT","Kurt");
	giau_insert_languagization($langEng,"BIO_LAST_NAME_KURT_KIM_TEXT","Kim");
	giau_insert_languagization($langEng,"BIO_DISPLAY_NAME_KURT_KIM_TEXT","Kurt Kim");
	giau_insert_languagization($langEng,"BIO_POSITION_KURT_KIM_TEXT","Secretary");
		giau_insert_languagization($langKor,"BIO_POSITION_KURT_KIM_TEXT","서기");
	giau_insert_languagization($langEng,"BIO_EMAIL_KURT_KIM_TEXT","jangyeaonkim@gmail.com");
	giau_insert_languagization($langEng,"BIO_PHONE_KURT_KIM_TEXT","5268571224");
	giau_insert_languagization($langEng,"BIO_DESCRIPTION_KURT_KIM_TEXT","");
	giau_insert_languagization($langEng,"BIO_URI_KURT_KIM_URI_TEXT","");
	giau_insert_languagization($langEng,"BIO_URI_KURT_KIM_IMAGE_URI","");

	giau_insert_languagization($langEng,"BIO_FIRST_NAME_SEBASTIAN_LEE_TEXT","Sebastian");
	giau_insert_languagization($langEng,"BIO_LAST_NAME_SEBASTIAN_LEE_TEXT","Lee");
	giau_insert_languagization($langEng,"BIO_DISPLAY_NAME_SEBASTIAN_LEE_TEXT","Sebastian Lee");
	giau_insert_languagization($langEng,"BIO_POSITION_SEBASTIAN_LEE_TEXT","Finance Deacon");
	giau_insert_languagization($langEng,"BIO_EMAIL_SEBASTIAN_LEE_TEXT","");
	giau_insert_languagization($langEng,"BIO_PHONE_SEBASTIAN_LEE_TEXT","");
	giau_insert_languagization($langEng,"BIO_DESCRIPTION_SEBASTIAN_LEE_TEXT","");
	giau_insert_languagization($langEng,"BIO_URI_SEBASTIAN_LEE_URI_TEXT","");
	giau_insert_languagization($langEng,"BIO_URI_SEBASTIAN_LEE_IMAGE_URI","");

	giau_insert_languagization($langEng,"BIO_FIRST_NAME_ANDREW_LIM_TEXT","Andrew");
	giau_insert_languagization($langEng,"BIO_LAST_NAME_ANDREW_LIM_TEXT","Lim");
	giau_insert_languagization($langEng,"BIO_DISPLAY_NAME_ANDREW_LIM_TEXT","Andrew Lim");
	giau_insert_languagization($langEng,"BIO_POSITION_ANDREW_LIM_TEXT","High School Pastor");
		giau_insert_languagization($langKor,"BIO_POSITION_ANDREW_LIM_TEXT","고등부 목사");
	giau_insert_languagization($langEng,"BIO_EMAIL_ANDREW_LIM_TEXT","mrlimshhs@gmail.com");
	giau_insert_languagization($langEng,"BIO_PHONE_ANDREW_LIM_TEXT","6265366126");
	giau_insert_languagization($langEng,"BIO_DESCRIPTION_ANDREW_LIM_TEXT","Andrew has been attending LACPC ever since he was a high school freshman. He got his bachelor’s degree from UC Irvine and a Masters in Pastoral Studies from Azusa Pacific University. He has been serving as the high school pastor since May of last year and also works full time as a high school English teacher.");
		giau_insert_languagization($langKor,"BIO_DESCRIPTION_ANDREW_LIM_TEXT","앤드류는 고등학교 1학년떄부터LACPC 의 멤버였으며, 유시 얼바인 에서 학위를 받았고, 아주사 퍼시픽 대학원에서 목회 학사 학위를 받았습니다. 지난 해 5월달부터 고등부 목사 또는 고등부 영어 교사로 섬기고 있습니다.");
	giau_insert_languagization($langEng,"BIO_URI_ANDREW_LIM_URI_TEXT","");
	giau_insert_languagization($langEng,"BIO_URI_ANDREW_LIM_IMAGE_URI","/images/personnel/ce-andy.png");

	giau_insert_languagization($langEng,"BIO_FIRST_NAME_BORAM_LEE_TEXT","Boram");
	giau_insert_languagization($langEng,"BIO_LAST_NAME_BORAM_LEE_TEXT","Lee");
	giau_insert_languagization($langEng,"BIO_DISPLAY_NAME_BORAM_LEE_TEXT","Boram Lee");
	giau_insert_languagization($langEng,"BIO_POSITION_BORAM_LEE_TEXT","Elementary Pastor");
		giau_insert_languagization($langKor,"BIO_POSITION_BORAM_LEE_TEXT","초등부 목사");
	giau_insert_languagization($langEng,"BIO_EMAIL_BORAM_LEE_TEXT","boramjdsn@gmail.com");
	giau_insert_languagization($langEng,"BIO_PHONE_BORAM_LEE_TEXT","9098688457");
	giau_insert_languagization($langEng,"BIO_DESCRIPTION_BORAM_LEE_TEXT","Born and raised in Los Angeles, Boram has a BA in cognitive psychology, a multiple subjects credential, and a master’s degree in teaching. She began seminary in January 2013 at Azusa Pacific University where she is studying to obtain an MA in pastoral studies with an emphasis is youth and family ministry. Her passion is to serve and train young children so that they can develop a solid relationship with God.");
		giau_insert_languagization($langKor,"BIO_DESCRIPTION_BORAM_LEE_TEXT","로스 앤젤레스에서 태어나 자란 보람 씨는 심리학 또는 여러 과목 자격 증명을 얻고, 교육 석사 학위를 가지고 있습니다. 보람 씨는 2013년 1월 아주사 퍼시픽 대학교에서 신학 공부를 시작하였고, 현재 청소년과 가족 사역을 중점으로 하여 목회 학위를 얻기 위해 공부하고 있습니다. 그녀의 열정은 어린이들이 주님과 견고한 관계를 발전 할 수 있도록 가리키고 봉사하는 것입니다.");
	giau_insert_languagization($langEng,"BIO_URI_BORAM_LEE_URI_TEXT","");
	giau_insert_languagization($langEng,"BIO_URI_BORAM_LEE_IMAGE_URI","/images/personnel/ce-boram.png");

	giau_insert_languagization($langEng,"BIO_FIRST_NAME_LISA_LEE_TEXT","Lisa");
	giau_insert_languagization($langEng,"BIO_LAST_NAME_LISA_LEE_TEXT","Lee");
	giau_insert_languagization($langEng,"BIO_DISPLAY_NAME_LISA_LEE_TEXT","Pastor Lisa Lee");
	giau_insert_languagization($langEng,"BIO_POSITION_LISA_LEE_TEXT","");
	giau_insert_languagization($langEng,"BIO_EMAIL_LISA_LEE_TEXT","");
	giau_insert_languagization($langEng,"BIO_PHONE_LISA_LEE_TEXT","");
	giau_insert_languagization($langEng,"BIO_DESCRIPTION_LISA_LEE_TEXT","Lisa graduated from Princeton Theological Seminary in May of 2016. She recently moved back home to California. She is currently teaching part-time at Azusa Pacific University. She has a BA in Psychology Social Behavior from UC Irvine and an MA in TESOL from Teachers College, Columbia University. Her commitment is to teach and to share God's love with the youth during their formational years. She is excited to be a part of God's work at LACPC.");
	giau_insert_languagization($langEng,"BIO_URI_NAME_LISA_LEE_URI_TEXT","");
	giau_insert_languagization($langEng,"BIO_URI_NAME_LISA_IMAGE_URI","");


	giau_insert_languagization($langEng,"BIO_FIRST_NAME_JESSICA_WON_TEXT","Jessica");
	giau_insert_languagization($langEng,"BIO_LAST_NAME_JESSICA_WON_TEXT","Won");
	giau_insert_languagization($langEng,"BIO_DISPLAY_NAME_JESSICA_WON_TEXT","Jessica Won");
	giau_insert_languagization($langEng,"BIO_POSITION_JESSICA_WON_TEXT","Nursery Pastor");
		giau_insert_languagization($langKor,"BIO_POSITION_JESSICA_WON_TEXT","유아실 목사");
	giau_insert_languagization($langEng,"BIO_EMAIL_JESSICA_WON_TEXT","jcb4jessica@gmail.com");
	giau_insert_languagization($langEng,"BIO_PHONE_JESSICA_WON_TEXT","3232034004");
	giau_insert_languagization($langEng,"BIO_DESCRIPTION_JESSICA_WON_TEXT","Jessica Won is married to Peter Won and has twin boys and a girl. She has a degree of Child Development from Patten University and currently working on M.Div. from Azusa University. She loves to share gospel to children and now oversees the nursery department.");
		giau_insert_languagization($langKor,"BIO_DESCRIPTION_JESSICA_WON_TEXT","제시카 원 는 피터 원과 결혼하였으며, 쌍둥이 아들 딸이 있습니다. 그녀는 패튼 대학교 에서 아동발달 학위를 얻었고, 현재 아주사 대학원에서 M.Div 공부를 하고 있습니다. 그녀는 아이들에게 복음 전하는 것을 즐기며, 유아부를 담당하고 있습니다.");
	giau_insert_languagization($langEng,"BIO_URI_JESSICA_WON_URI_TEXT","");

	// -> CALENDAR
	giau_insert_languagization($langEng,"CALENDAR_EVENT_CHILDRENS_DAY_2016_TITLE_TEXT","Children's Day");
	giau_insert_languagization($langEng,"CALENDAR_EVENT_CHILDRENS_DAY_2016_DESCRIPTION_TEXT","Joint Worship 11:00 AM");

	giau_insert_languagization($langEng,"CALENDAR_EVENT_LOVE_FESTIVAL_2016_TITLE_TEXT","Love Festival");
	giau_insert_languagization($langEng,"CALENDAR_EVENT_LOVE_FESTIVAL_2016_DESCRIPTION_TEXT","Love Festival for people with developmental disabilities");

	giau_insert_languagization($langEng,"CALENDAR_EVENT_MOTHERS_DAY_2016_TITLE_TEXT","Mothers' Day");
	giau_insert_languagization($langEng,"CALENDAR_EVENT_MOTHERS_DAY_2016_DESCRIPTION_TEXT","Mothers' Day Celebration");

	giau_insert_languagization($langEng,"CALENDAR_EVENT_TEACHERS_DAY_2016_TITLE_TEXT","Teachers' Day");
	giau_insert_languagization($langEng,"CALENDAR_EVENT_TEACHERS_DAY_2016_DESCRIPTION_TEXT","Annual Teachers' Day Luncheon 12:30 PM @ Patio");

	giau_insert_languagization($langEng,"CALENDAR_EVENT_PRAYER_MEETING_JUNE_2016_TITLE_TEXT","Prayer Meeting");
	giau_insert_languagization($langEng,"CALENDAR_EVENT_PRAYER_MEETING_JUNE_2016_DESCRIPTION_TEXT","Bi-Monthly Parents/Teachers' Prayer Meeting");

	giau_insert_languagization($langEng,"CALENDAR_EVENT_VACATION_BIBLE_SCHOOL_2016_TITLE_TEXT","Vacation Bible School");
	giau_insert_languagization($langEng,"CALENDAR_EVENT_VACATION_BIBLE_SCHOOL_2016_DESCRIPTION_TEXT","Vacation Bible School: Cave Quest");

	giau_insert_languagization($langEng,"CALENDAR_EVENT_CE_GRADUATION_2016_TITLE_TEXT","CE Graduation");
	giau_insert_languagization($langEng,"CALENDAR_EVENT_CE_GRADUATION_2016_DESCRIPTION_TEXT","CE Graduation");

	giau_insert_languagization($langEng,"CALENDAR_EVENT_SUMMER_MISSION_2016_TITLE_TEXT","Short-Term Summer Mission");
	giau_insert_languagization($langEng,"CALENDAR_EVENT_SUMMER_MISSION_2016_DESCRIPTION_TEXT","Navajo Reservation in Arizona");

	giau_insert_languagization($langEng,"CALENDAR_EVENT_JH_SUMMER_RETREAT_2016_TITLE_TEXT","Junior High Summer Retreat");
	giau_insert_languagization($langEng,"CALENDAR_EVENT_JH_SUMMER_RETREAT_2016_DESCRIPTION_TEXT","@ Tahquitz Pines");

	giau_insert_languagization($langEng,"CALENDAR_EVENT_HS_SUMMER_RETREAT_2016_TITLE_TEXT","High School Summer Retreat");
	giau_insert_languagization($langEng,"CALENDAR_EVENT_HS_SUMMER_RETREAT_2016_DESCRIPTION_TEXT","@ Lake Arrowhead");

	giau_insert_languagization($langEng,"CALENDAR_EVENT_ORANGE_TOUR_CONFERENCE_2016_TITLE_TEXT","Orange Tour Conference");
	giau_insert_languagization($langKor,"CALENDAR_EVENT_ORANGE_TOUR_CONFERENCE_2016_TITLE_TEXT","회의 Orange Tour");

	giau_insert_languagization($langEng,"CALENDAR_EVENT_KOREAN_CHALLENGE_2016_TITLE_TEXT","Korean Challenge!");
	giau_insert_languagization($langKor,"CALENDAR_EVENT_KOREAN_CHALLENGE_2016_TITLE_TEXT","도전! 한국어");
	giau_insert_languagization($langEng,"CALENDAR_EVENT_KOREAN_CHALLENGE_2016_DESCRIPTION_TEXT","Korean Challenge!");
	giau_insert_languagization($langKor,"CALENDAR_EVENT_KOREAN_CHALLENGE_2016_DESCRIPTION_TEXT","도전! 한국어");

	giau_insert_languagization($langEng,"CALENDAR_EVENT_HALLELUJAH_NIGHT_2016_TITLE_TEXT","Hallelujah Night");
	giau_insert_languagization($langKor,"CALENDAR_EVENT_HALLELUJAH_NIGHT_2016_TITLE_TEXT","할렐루야 의 밤");

	giau_insert_languagization($langEng,"CALENDAR_EVENT_CE_PASTOR_RETREAT_2016_TITLE_TEXT","CE Teachers and Staff Retreat");
	giau_insert_languagization($langKor,"CALENDAR_EVENT_CE_PASTOR_RETREAT_2016_TITLE_TEXT","CE 목사 후퇴");

	giau_insert_languagization($langEng,"CALENDAR_EVENT_CE_THANKSGIVING_WORSHIP_2016_TITLE_TEXT","CE Thanksgiving Worship");
	giau_insert_languagization($langKor,"CALENDAR_EVENT_CE_THANKSGIVING_WORSHIP_2016_TITLE_TEXT","추수 감사절 예배");

	giau_insert_languagization($langEng,"CALENDAR_EVENT_TEACHER_APPRECIATION_2016_TITLE_TEXT","Teacher Appreciation Banquet");
	giau_insert_languagization($langKor,"CALENDAR_EVENT_TEACHER_APPRECIATION_2016_TITLE_TEXT","교사 감사 연회");

	giau_insert_languagization($langEng,"CALENDAR_EVENT_CHRISTMAS_CELEBRATION_2016_TITLE_TEXT","Christmas Celebration");
	giau_insert_languagization($langKor,"CALENDAR_EVENT_CHRISTMAS_CELEBRATION_2016_TITLE_TEXT","크리스마스 축하");

	giau_insert_languagization($langEng,"CALENDAR_EVENT_JH_HS_WINTER_RETREAT_TITLE_TEXT","Faith in Action (Junior High and High School Retreat)");
	giau_insert_languagization($langKor,"CALENDAR_EVENT_JH_HS_WINTER_RETREAT_TITLE_TEXT","중학교 과 고등학교 겨울 수련회");

	giau_insert_languagization($langEng,"CALENDAR_EVENT_FAMILY_WORSHIP_2017_TITLE_TEXT","Family Worship Movement : Every Wednesday");
	giau_insert_languagization($langEng,"CALENDAR_EVENT_BASIC_THEOLOGY_2017_TITLE_TEXT","THEO 101 – Basic Theology : Every Saturday");
	giau_insert_languagization($langEng,"CALENDAR_EVENT_PRAYER_MEETING_MONTHLY_JAN_2017_TITLE_TEXT","Monthly Parents'/Teachers' Prayer Meeting");
	giau_insert_languagization($langEng,"CALENDAR_EVENT_PRAYER_MEETING_MONTHLY_FEB_2017_TITLE_TEXT","Monthly Parents'/Teachers' Prayer Meeting");
	giau_insert_languagization($langEng,"CALENDAR_EVENT_MOUNTAIN_OUTING_FEBRUARY_2017_TITLE_TEXT","CE Staff Prayer Mountain Outing");
	giau_insert_languagization($langEng,"CALENDAR_EVENT_PRAYER_MEETING_MONTHLY_MAR_2017_TITLE_TEXT","Monthly Parents'/Teachers' Prayer Meeting");

	//giau_insert_languagization($langEng,"","");

	$calendar_tag_front_page = "frontpage";
	$calendar_tag_nursery = "nursery";
	$calendar_tag_kindergarten = "kindergarten";
	$calendar_tag_elementary = "elementary";
	$calendar_tag_juniorhigh = "juniorhigh";
	$calendar_tag_highschool = "highschool";
	$calendar_tag_koreanschool = "koreanschool";

	error_log("RICHIE - A");

	// CALENDAR ITEMS
	// set 1
	giau_insert_calendar("event_childrens_day_2016","CALENDAR_EVENT_CHILDRENS_DAY_2016_TITLE_TEXT","CALENDAR_EVENT_CHILDRENS_DAY_2016_DESCRIPTION_TEXT", stringFromHumanTime(2016, 5, 1,11, 0, 0, 0), 0*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_nursery, $calendar_tag_kindergarten, $calendar_tag_elementary, $calendar_tag_juniorhigh, $calendar_tag_highschool]);
	giau_insert_calendar("event_love_festival_2016","CALENDAR_EVENT_LOVE_FESTIVAL_2016_TITLE_TEXT","CALENDAR_EVENT_LOVE_FESTIVAL_2016_DESCRIPTION_TEXT", stringFromHumanTime(2016, 5, 7, 0, 0, 0, 0), 0*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_nursery, $calendar_tag_kindergarten, $calendar_tag_elementary, $calendar_tag_juniorhigh, $calendar_tag_highschool]);
	giau_insert_calendar("event_mothers_day_2016","CALENDAR_EVENT_MOTHERS_DAY_2016_TITLE_TEXT","CALENDAR_EVENT_MOTHERS_DAY_2016_DESCRIPTION_TEXT", stringFromHumanTime(2016, 5, 8, 0, 0, 0, 0), 0*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_nursery, $calendar_tag_kindergarten, $calendar_tag_elementary, $calendar_tag_juniorhigh, $calendar_tag_highschool]);
	giau_insert_calendar("event_teachers_day_2016","CALENDAR_EVENT_TEACHERS_DAY_2016_TITLE_TEXT","CALENDAR_EVENT_TEACHERS_DAY_2016_DESCRIPTION_TEXT", stringFromHumanTime(2016, 5,15,12,30, 0, 0), 0*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_nursery, $calendar_tag_kindergarten, $calendar_tag_elementary, $calendar_tag_juniorhigh, $calendar_tag_highschool]);
	giau_insert_calendar("event_prayer_meeting_2016","CALENDAR_EVENT_PRAYER_MEETING_JUNE_2016_TITLE_TEXT","CALENDAR_EVENT_PRAYER_MEETING_JUNE_2016_DESCRIPTION_TEXT", stringFromHumanTime(2016, 6,10, 0, 0, 0, 0), 0*24*60*60*1000, [$calendar_tag_front_page]);
	giau_insert_calendar("event_vacation_bible_study_2016","CALENDAR_EVENT_VACATION_BIBLE_SCHOOL_2016_TITLE_TEXT","CALENDAR_EVENT_VACATION_BIBLE_SCHOOL_2016_DESCRIPTION_TEXT", stringFromHumanTime(2016, 6,17, 0, 0, 0, 0), 2*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_juniorhigh, $calendar_tag_highschool]);
	giau_insert_calendar("event_ce_graduation_2016","CALENDAR_EVENT_CE_GRADUATION_2016_TITLE_TEXT","CALENDAR_EVENT_CE_GRADUATION_2016_DESCRIPTION_TEXT", stringFromHumanTime(2016, 6,26, 0, 0, 0, 0), 0*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_juniorhigh, $calendar_tag_highschool]);
	giau_insert_calendar("event_summer_mission_2016","CALENDAR_EVENT_SUMMER_MISSION_2016_TITLE_TEXT","CALENDAR_EVENT_SUMMER_MISSION_2016_DESCRIPTION_TEXT", stringFromHumanTime(2016, 7, 1, 0, 0, 0, 0), 7*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_juniorhigh, $calendar_tag_highschool]);
	giau_insert_calendar("event_jh_summer_retreat_2016","CALENDAR_EVENT_JH_SUMMER_RETREAT_2016_TITLE_TEXT","CALENDAR_EVENT_JH_SUMMER_RETREAT_2016_DESCRIPTION_TEXT", stringFromHumanTime(2016, 7,31, 0, 0, 0, 0), 4*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_juniorhigh]);
	giau_insert_calendar("event_hs_summer_retreat_2016","CALENDAR_EVENT_HS_SUMMER_RETREAT_2016_TITLE_TEXT","CALENDAR_EVENT_HS_SUMMER_RETREAT_2016_DESCRIPTION_TEXT", stringFromHumanTime(2016, 7,31, 0, 0, 0, 0), 4*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_highschool]);
	// set 2
	giau_insert_calendar("event_orange_tour_2016","CALENDAR_EVENT_ORANGE_TOUR_CONFERENCE_2016_TITLE_TEXT","CALENDAR_EVENT_ORANGE_TOUR_CONFERENCE_2016_TITLE_TEXT", stringFromHumanTime(2016, 9,20, 0, 0, 0, 0), 1*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_juniorhigh, $calendar_tag_highschool]);
	giau_insert_calendar("event_korean_challenge_2016","CALENDAR_EVENT_KOREAN_CHALLENGE_2016_TITLE_TEXT","CALENDAR_EVENT_KOREAN_CHALLENGE_2016_DESCRIPTION_TEXT", stringFromHumanTime(2016, 9,25, 0, 0, 0, 0), 0*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_juniorhigh, $calendar_tag_highschool]);
	giau_insert_calendar("event_hallelujah_2016","CALENDAR_EVENT_HALLELUJAH_NIGHT_2016_TITLE_TEXT","CALENDAR_EVENT_HALLELUJAH_NIGHT_2016_TITLE_TEXT", stringFromHumanTime(2016,10,31, 0, 0, 0, 0), 0*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_nursery, $calendar_tag_kindergarten, $calendar_tag_elementary, $calendar_tag_juniorhigh, $calendar_tag_highschool]);
	giau_insert_calendar("event_pastor_retreat_2016","CALENDAR_EVENT_CE_PASTOR_RETREAT_2016_TITLE_TEXT","CALENDAR_EVENT_CE_PASTOR_RETREAT_2016_TITLE_TEXT", stringFromHumanTime(2016,11,18, 0, 0, 0, 0), 1*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_juniorhigh, $calendar_tag_highschool]);
	giau_insert_calendar("event_thanksgiving_worship_2016","CALENDAR_EVENT_CE_THANKSGIVING_WORSHIP_2016_TITLE_TEXT","CALENDAR_EVENT_CE_THANKSGIVING_WORSHIP_2016_TITLE_TEXT", stringFromHumanTime(2016,11,20, 0, 0, 0, 0), 0*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_nursery, $calendar_tag_kindergarten, $calendar_tag_elementary, $calendar_tag_juniorhigh, $calendar_tag_highschool]);
	giau_insert_calendar("event_teacher_appreciation_2016","CALENDAR_EVENT_TEACHER_APPRECIATION_2016_TITLE_TEXT","CALENDAR_EVENT_TEACHER_APPRECIATION_2016_TITLE_TEXT", stringFromHumanTime(2016,12,17, 0, 0, 0, 0), 0*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_nursery, $calendar_tag_kindergarten, $calendar_tag_elementary, $calendar_tag_juniorhigh, $calendar_tag_highschool]);
	giau_insert_calendar("event_christmas_celebration_2016","CALENDAR_EVENT_CHRISTMAS_CELEBRATION_2016_TITLE_TEXT","CALENDAR_EVENT_CHRISTMAS_CELEBRATION_2016_TITLE_TEXT", stringFromHumanTime(2016,12,23, 0, 0, 0, 0), 0*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_nursery, $calendar_tag_kindergarten, $calendar_tag_elementary, $calendar_tag_juniorhigh, $calendar_tag_highschool]);
	giau_insert_calendar("event_jh_hs_winter_retreat_2017","CALENDAR_EVENT_JH_HS_WINTER_RETREAT_TITLE_TEXT","CALENDAR_EVENT_JH_HS_WINTER_RETREAT_TITLE_TEXT", stringFromHumanTime(2016,12,26, 0, 0, 0, 0), 2*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_juniorhigh, $calendar_tag_highschool]);
	// set 3
	giau_insert_calendar("event_family_worship_2017","CALENDAR_EVENT_FAMILY_WORSHIP_2017_TITLE_TEXT","CALENDAR_EVENT_FAMILY_WORSHIP_2017_TITLE_TEXT", stringFromHumanTime(2017, 1, 4, 0, 0, 0, 0), 357*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_nursery,$calendar_tag_kindergarten,$calendar_tag_elementary,$calendar_tag_juniorhigh,$calendar_tag_highschool,$calendar_tag_koreanschool]);
	giau_insert_calendar("event_theology_101_2017","CALENDAR_EVENT_BASIC_THEOLOGY_2017_TITLE_TEXT","CALENDAR_EVENT_BASIC_THEOLOGY_2017_TITLE_TEXT", stringFromHumanTime(2017, 1, 7, 0, 0, 0, 0), 63*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_nursery,$calendar_tag_kindergarten,$calendar_tag_elementary,$calendar_tag_juniorhigh,$calendar_tag_highschool,$calendar_tag_koreanschool]);
	giau_insert_calendar("event_monthly_prayer_jan_2017","CALENDAR_EVENT_PRAYER_MEETING_MONTHLY_JAN_2017_TITLE_TEXT","CALENDAR_EVENT_PRAYER_MEETING_MONTHLY_JAN_2017_TITLE_TEXT", stringFromHumanTime(2017, 1,13, 0, 0, 0, 0), 0*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_nursery,$calendar_tag_kindergarten,$calendar_tag_elementary,$calendar_tag_juniorhigh,$calendar_tag_highschool,$calendar_tag_koreanschool]);
	giau_insert_calendar("event_monthly_prayer_feb_2017","CALENDAR_EVENT_PRAYER_MEETING_MONTHLY_FEB_2017_TITLE_TEXT","CALENDAR_EVENT_PRAYER_MEETING_MONTHLY_FEB_2017_TITLE_TEXT", stringFromHumanTime(2017, 2,10, 0, 0, 0, 0), 0*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_nursery,$calendar_tag_kindergarten,$calendar_tag_elementary,$calendar_tag_juniorhigh,$calendar_tag_highschool,$calendar_tag_koreanschool]);
	giau_insert_calendar("event_mountain_outing_feb_2017","CALENDAR_EVENT_MOUNTAIN_OUTING_FEBRUARY_2017_TITLE_TEXT","CALENDAR_EVENT_MOUNTAIN_OUTING_FEBRUARY_2017_TITLE_TEXT", stringFromHumanTime(2017, 2,17, 0, 0, 0, 0), 1*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_nursery,$calendar_tag_kindergarten,$calendar_tag_elementary,$calendar_tag_juniorhigh,$calendar_tag_highschool,$calendar_tag_koreanschool]);
	giau_insert_calendar("event_monthly_prayer_mar_2017","CALENDAR_EVENT_PRAYER_MEETING_MONTHLY_MAR_2017_TITLE_TEXT","CALENDAR_EVENT_PRAYER_MEETING_MONTHLY_MAR_2017_TITLE_TEXT", stringFromHumanTime(2017, 3,10, 0, 0, 0, 0), 0*24*60*60*1000, [$calendar_tag_front_page, $calendar_tag_nursery,$calendar_tag_kindergarten,$calendar_tag_elementary,$calendar_tag_juniorhigh,$calendar_tag_highschool,$calendar_tag_koreanschool]);
	// ?


	

	// BIOs
	giau_insert_bio(
			'BIO_FIRST_NAME_JOSEPH_KIM_TEXT',
			'BIO_LAST_NAME_JOSEPH_KIM_TEXT',
			'BIO_DISPLAY_NAME_JOSEPH_KIM_TEXT',
			'BIO_POSITION_JOSEPH_KIM_TEXT',
			'BIO_EMAIL_JOSEPH_KIM_TEXT',
			'BIO_PHONE_JOSEPH_KIM_TEXT',
			'BIO_DESCRIPTION_JOSEPH_KIM_TEXT',
			'BIO_URI_JOSEPH_KIM_URI_TEXT',
			'BIO_URI_JOSEPH_KIM_IMAGE_URI',
			'bio,contact,kindergarten'
	);
	giau_insert_bio(
			'BIO_FIRST_NAME_TONY_PARK_TEXT',
			'BIO_LAST_NAME_TONY_PARK_TEXT',
			'BIO_DISPLAY_NAME_TONY_PARK_TEXT',
			'BIO_POSITION_TONY_PARK_TEXT',
			'BIO_EMAIL_TONY_PARK_TEXT',
			'BIO_PHONE_TONY_PARK_TEXT',
			'BIO_DESCRIPTION_TONY_PARK_TEXT',
			'BIO_URI_TONY_PARK_URI_TEXT',
			'BIO_URI_TONY_PARK_IMAGE_URI',
			'bio'
	);
	giau_insert_bio(
			'BIO_FIRST_NAME_KURT_KIM_TEXT',
			'BIO_LAST_NAME_KURT_KIM_TEXT',
			'BIO_DISPLAY_NAME_KURT_KIM_TEXT',
			'BIO_POSITION_KURT_KIM_TEXT',
			'BIO_EMAIL_KURT_KIM_TEXT',
			'BIO_PHONE_KURT_KIM_TEXT',
			'BIO_DESCRIPTION_KURT_KIM_TEXT',
			'BIO_URI_KURT_KIM_URI_TEXT',
			'BIO_URI_KURT_KIM_IMAGE_URI',
			'bio,contact'
	);
	giau_insert_bio(
			'BIO_FIRST_NAME_SEBASTIAN_LEE_TEXT',
			'BIO_LAST_NAME_SEBASTIAN_LEE_TEXT',
			'BIO_DISPLAY_NAME_SEBASTIAN_LEE_TEXT',
			'BIO_POSITION_SEBASTIAN_LEE_TEXT',
			'BIO_EMAIL_SEBASTIAN_LEE_TEXT',
			'BIO_PHONE_SEBASTIAN_LEE_TEXT',
			'BIO_DESCRIPTION_SEBASTIAN_LEE_TEXT',
			'BIO_URI_SEBASTIAN_LEE_URI_TEXT',
			'BIO_URI_SEBASTIAN_LEE_IMAGE_URI',
			'bio'
	);
	giau_insert_bio(
			'BIO_FIRST_NAME_ANDREW_LIM_TEXT',
			'BIO_LAST_NAME_ANDREW_LIM_TEXT',
			'BIO_DISPLAY_NAME_ANDREW_LIM_TEXT',
			'BIO_POSITION_ANDREW_LIM_TEXT',
			'BIO_EMAIL_ANDREW_LIM_TEXT',
			'BIO_PHONE_ANDREW_LIM_TEXT',
			'BIO_DESCRIPTION_ANDREW_LIM_TEXT',
			'BIO_URI_ANDREW_LIM_URI_TEXT',
			'BIO_URI_ANDREW_LIM_IMAGE_URI',
			'bio,contact,highschool'
	);
	giau_insert_bio(
			'BIO_FIRST_NAME_BORAM_LEE_TEXT',
			'BIO_LAST_NAME_BORAM_LEE_TEXT',
			'BIO_DISPLAY_NAME_BORAM_LEE_TEXT',
			'BIO_POSITION_BORAM_LEE_TEXT',
			'BIO_EMAIL_BORAM_LEE_TEXT',
			'BIO_PHONE_BORAM_LEE_TEXT',
			'BIO_DESCRIPTION_BORAM_LEE_TEXT',
			'BIO_URI_BORAM_LEE_URI_TEXT',
			'BIO_URI_BORAM_LEE_IMAGE_URI',
			'bio,contact,elementary'
	);
	giau_insert_bio(
			'BIO_FIRST_NAME_LISA_LEE_TEXT',
			'BIO_LAST_NAME_LISA_LEE_TEXT',
			'BIO_DISPLAY_NAME_LISA_LEE_TEXT',
			'BIO_POSITION_LISA_LEE_TEXT',
			'BIO_EMAIL_LISA_LEE_TEXT',
			'BIO_PHONE_LISA_LEE_TEXT',
			'BIO_DESCRIPTION_LISA_LEE_TEXT',
			'BIO_URI_NAME_LISA_LEE_URI_TEXT',
			'BIO_URI_NAME_LISA_IMAGE_URI',
			'bio,contact,juniorhigh'
	);
	giau_insert_bio(
			'BIO_FIRST_NAME_JESSICA_WON_TEXT',
			'BIO_LAST_NAME_JESSICA_WON_TEXT',
			'BIO_DISPLAY_NAME_JESSICA_WON_TEXT',
			'BIO_POSITION_JESSICA_WON_TEXT',
			'BIO_EMAIL_JESSICA_WON_TEXT',
			'BIO_PHONE_JESSICA_WON_TEXT',
			'BIO_DESCRIPTION_JESSICA_WON_TEXT',
			'BIO_URI_JESSICA_WON_URI_TEXT',
			'/images/personnel/ce-jessica.png',
			'bio,contact,nursery'
	);


	// NAV-WIDGET
	giau_insert_languagization($langEng,"NAV_ITEM_PAGE_NAVIGATION_HOME_TEXT","Home");
		giau_insert_languagization($langKor,"NAV_ITEM_PAGE_NAVIGATION_HOME_TEXT","홈");
	giau_insert_languagization($langEng,"NAV_ITEM_PAGE_NAVIGATION_DEPARTMENTS_TEXT","Departments");
		giau_insert_languagization($langKor,"NAV_ITEM_PAGE_NAVIGATION_DEPARTMENTS_TEXT","부서");
	giau_insert_languagization($langEng,"NAV_ITEM_PAGE_NAVIGATION_STAFF_TEXT","Staff");
		giau_insert_languagization($langKor,"NAV_ITEM_PAGE_NAVIGATION_STAFF_TEXT","직원들");
	giau_insert_languagization($langEng,"NAV_ITEM_PAGE_NAVIGATION_FORMS_TEXT","Forms");
		giau_insert_languagization($langKor,"NAV_ITEM_PAGE_NAVIGATION_FORMS_TEXT","문서");
	giau_insert_languagization($langEng,"NAV_ITEM_PAGE_NAVIGATION_CONTACT_TEXT","Contact");
		giau_insert_languagization($langKor,"NAV_ITEM_PAGE_NAVIGATION_CONTACT_TEXT","연락처");
	giau_insert_languagization($langEng,"NAV_ITEM_PAGE_NAVIGATION_LACPC_TEXT","LACPC");

	giau_insert_languagization($langEng,"NAV_ITEM_PAGE_NAVIGATION_DEPT_NURSERY_TEXT","Nursery");
		giau_insert_languagization($langKor,"NAV_ITEM_PAGE_NAVIGATION_DEPT_NURSERY_TEXT","유아실");
	giau_insert_languagization($langEng,"NAV_ITEM_PAGE_NAVIGATION_DEPT_KINDERGARTEN_TEXT","Kindergarten");
		giau_insert_languagization($langKor,"NAV_ITEM_PAGE_NAVIGATION_DEPT_KINDERGARTEN_TEXT","유치부");
	giau_insert_languagization($langEng,"NAV_ITEM_PAGE_NAVIGATION_DEPT_ELEMENTARY_TEXT","Elementary");
		giau_insert_languagization($langKor,"NAV_ITEM_PAGE_NAVIGATION_DEPT_ELEMENTARY_TEXT","초등부");
	giau_insert_languagization($langEng,"NAV_ITEM_PAGE_NAVIGATION_DEPT_JUNIOR_HIGH_TEXT","Junior High");
		giau_insert_languagization($langKor,"NAV_ITEM_PAGE_NAVIGATION_DEPT_JUNIOR_HIGH_TEXT","중등부");
	giau_insert_languagization($langEng,"NAV_ITEM_PAGE_NAVIGATION_DEPT_HIGH_SCHOOL_TEXT","High School");
		giau_insert_languagization($langKor,"NAV_ITEM_PAGE_NAVIGATION_DEPT_HIGH_SCHOOL_TEXT","고등부");
	giau_insert_languagization($langEng,"NAV_ITEM_PAGE_NAVIGATION_DEPT_KOREAN_SCHOOL_TEXT","Korean School");
		giau_insert_languagization($langKor,"NAV_ITEM_PAGE_NAVIGATION_DEPT_KOREAN_SCHOOL_TEXT","한국어 학교");
	
	giau_insert_languagization($langEng,"LANGUAGE_SWITCH_ENGLISH_TEXT","EN");
	giau_insert_languagization($langEng,"LANGUAGE_SWITCH_KOREAN_TEXT","한국어");	

	giau_insert_languagization($langEng,"FOOTER_TITLE_TEXT","THE FATHER'S HOUSE");
	giau_insert_languagization($langEng,"FOOTER_ADDRESS_1_TEXT","Los Angeles Presbyterian Church");
	giau_insert_languagization($langEng,"FOOTER_ADDRESS_2_TEXT","2241 N. Eastern Ave.");
	giau_insert_languagization($langEng,"FOOTER_ADDRESS_3_TEXT","Los Angeles, CA 90032");
	giau_insert_languagization($langEng,"FOOTER_COPYRIGHT_TEXT","LACPC Christian Education © 2016");

	giau_insert_languagization($langEng,"PAGE_HOME_OVERLAY_TITLE_1_TEXT","THE FATHER'S HOUSE");
	giau_insert_languagization($langEng,"PAGE_HOME_OVERLAY_TITLE_2_TEXT","JOIN US FOR WORSHIP");
		giau_insert_languagization($langKor,"PAGE_HOME_OVERLAY_TITLE_2_TEXT","매주 일요일 오전11시에");
	giau_insert_languagization($langEng,"PAGE_HOME_OVERLAY_TITLE_3_TEXT","Sunday at 11:00 a.m.");
		giau_insert_languagization($langKor,"PAGE_HOME_OVERLAY_TITLE_3_TEXT","저희와 함깨 예배드리러 오세요");

	giau_insert_languagization($langEng,"HEADING_HOME_CALENDAR_SCHEDULE_TEXT","Schedule of Events");
		giau_insert_languagization($langKor,"HEADING_HOME_CALENDAR_SCHEDULE_TEXT","일정");


	// WIDGET


	// => EMPTY CONTAINER
	$widget_id_content_container = giau_insert_widget("content_container",
		[
			"alias" => "content_container",
			"name" => "Giau Empty",
			"cssClass" => "",
			"jsClass" => "",
			"fields" => [
				"class" => [
					"type" => "string"
				],
				"style" => [
					"type" => "string"
				],
			]
		]
	);

	// => NAVIGATION
	$widget_id_navigation_list = giau_insert_widget("navigation_list",
		[
			"alias" => "navigation_list",
			"name" => "Giau Navigation",
			"cssClass" => "giauNavigationItemList",
			"jsClass" => "giau.NavigationList",
			"fields" => [
				"components" => [
					"type" => "array-object",
					"description" => "navigation item",
					"fields" => [
						"display_text" => [
							"type" => "string",
							"description" => "displayed text"
						],
						"uri" => [
							"type" => "string",
							"description" => "location destination"
						]
					]
				],
				"animates_down" => [
					"type" => "string",
					"description" => "name of event to listen to"
				],
				"animates_up" => [
					"type" => "string",
					"description" => "name of event to listen to"
				],
				"class" => [
					"type" => "string"
				],
				"style" => [
					"type" => "string"
				],
				"dark_mode" => [
					"type" => "string-boolean",
				],
				"start_hidden" => [
					"type" => "string-boolean",
				],
			]
		]
	);

	// => LANGUAGE TOGGLE SWITCH
	$widget_id_language_switch = giau_insert_widget("language_switch",
		[
			"alias" => "language_switch",
			"name" => "Giau Language Toggle",
			"cssClass" => "giauLanguageToggleSwitch",
			"jsClass" => "giau.LanguageToggle",
			"fields" => [
				"enabled" => [
					"type" => "string-boolean",
					"description" => "is toggle enabled",
				],
				"languages" => [
					"type" => "array-object",
					"description" => "list of language switches",
					"fields" => [
						"display_text" => [
							"type" => "string",
							"description" => "displayed text"
						],
						"language_name" => [
							"type" => "string",
							"description" => "language type, eg: en, en-US, ko, ko-KP"
						],
					]
				]
			]
		]
	);

	// => DISPLAY OVERLAY
	$widget_id_display_overlay = giau_insert_widget("display_overlay",
		[
			"alias" => "display_overlay",
			"name" => "Giau Display Overlay",
			"cssClass" => "giauInfoOverlay",
			"jsClass" => "giau.InfoOverlay",
			"fields" => [
				//
			]
		]
	);

	// => HALLMARK EMBLEM
	$widget_id_hallmark_emblem = giau_insert_widget("hallmark_emblem",
		[
		]
	);

	// => TEXT DISPLAY
	$widget_id_text_display = giau_insert_widget("text_display",
		[
			"alias" => "text_display",
			"name" => "Giau Text Display",
			"cssClass" => "giauImageGallery",
			"jsClass" => "giau.ImageGallery",
			"fields" => [
				"text" => [
					"type" => "string",
					"languagization" => "true"
				],
				"class" => [
					"type" => "string"
				],
				"style" => [
					"type" => "string"
				],
			]
		]
	);
	error_log("RICHIE - B");

	// => VERTICAL DIVIDER
	$widget_id_vertical_divider = giau_insert_widget("vertical_divider",
		[
			"alias" => "vertical_divider",
			"name" => "Giau Vertical Divider",
			"cssClass" => "",
			"jsClass" => "",
			"fields" => [
				"show_bar" => [
					"type" => "boolean",
				],
				"height" => [
					"type" => "string"
				],
				"class" => [
					"type" => "string"
				],
			]
		]
	);

	// => CATEGORY LISTING
	$widget_id_category_listing = giau_insert_widget("category_listing",
		[
			"alias" => "category_listing",
			"name" => "Giau Category Listing",
			"cssClass" => "giauCategoryListing",
			"jsClass" => "giau.CategoryListing",
			"fields" => [
				"categories" => [
					"type" => "array-object",
					"description" => "category items",
					"fields" => [
						"image" => [
							"type" => "string-image",
							"description" => "image for item"
						],
						"name" => [
							"type" => "string",
							"description" => "name for item"
						],
						"uri" => [
							"type" => "string",
							"description" => "url for item"
						]
					]
				],
				"rounded" => [
					"type" => "boolean",
					"description" => "round image edges"
				],
				"style" => [
					"type" => "string"
				],
			]
		]
	);

	// => IMAGE GALLERY
	$widget_id_image_gallery = giau_insert_widget("image_gallery",
		[
			"alias" => "image_gallery",
			"name" => "Giau Image Gallery",
			"cssClass" => "giauImageGallery",
			"jsClass" => "giau.ImageGallery",
			"fields" => [
				"autoplay" => [
					"type" => "number",
					"description" => "time in milliseconds to autoplay, 0 or negative turns this off",
					"hint" => "eg: 10000"
				],
				"display_navigation" => [
					"type" => "boolean",
					"description" => "show the left and right navigation arrows"
				],
				"images" => [ // HERE
					"type" => "array-string-image",
					"description" => "list of images for gallery"
				],
				"overlay_color" => [
					"type" => "string-color",
					"description" => "color covering image gallery"
				],
				"class" => [
					"type" => "string"
				],
				"style" => [
					"type" => "string"
				],
				"height" => [
					"type" => "string"
				],
				"page_indicators" => [
					"type" => "string-boolean"
				],
			]
		]
	);

	// => FOOTER
	$widget_id_footer = giau_insert_widget("bottom_footer",
		[
			"alias" => "bottom_footer",
			"name" => "Giau Bottom Footer",
			"cssClass" => "",
			"jsClass" => "",
			"fields" => [
				// "?" => [
				// 	"type" => "?",
				// 	"description" => "?"
				// ]
			]
		]
	);

	// => CALENDAR LISTING
	$widget_id_calendar_listing = giau_insert_widget("calendar_listing",
		[
			"alias" => "calendar_listing",
			"name" => "Giau Bottom Footer",
			"cssClass" => "giauCalendarList",
			"jsClass" => "giau.CalendarListView",
			"fields" => [
				"tags" => [
					"type" => "array-string",
					"description" => "list of tags to filter on"
				],
				"range_start" => [
					"type" => "number",
					"description" => "start date or lookback time (milliseconds)"
				],
				"range_end" => [
					"type" => "number",
					"description" => "end date or lookahead time (milliseconds)"
				],
				"relative" => [
					"type" => "boolean",
					"description" => "whether to use start/end range from current date or as absolute date"
				],
				"order_recent_first" => [
					"type" => "boolean",
					"description" => "order by earlier to later"
				],
				"min_count" => [
					"type" => "number",
					"description" => "minimum number of items to display"
				],
				"max_count" => [
					"type" => "number",
					"description" => "maximum number of items to display"
				]
			]
		]
	);

	// => SOCIAL APPS
	$widget_id_social_apps = giau_insert_widget("social_apps",
		[
			"alias" => "social_apps",
			"name" => "Giau Social Apps",
			"cssClass" => "",
			"jsClass" => "",
			"fields" => [
				"social" => [
					"type" => "object",
					"description" => "social items",
					"fields" => [
						"facebook" => [
							"type" => "object",
							"description" => "facebook data",
							"fields" => [
								"uri" => [
									"type" => "string",
									"description" => "external link url"
								],
								"icon" => [
									"type" => "string-image",
									"description" => "display image"
								]
							]
						],
						"twitter" => [
							"type" => "object",
							"description" => "twitter data",
							"fields" => [
								"uri" => [
									"type" => "string",
									"description" => "external link url"
								],
								"icon" => [
									"type" => "string-image",
									"description" => "display image"
								]
							]
						],
						"instagram" => [
							"type" => "object",
							"description" => "instagram data",
							"fields" => [
								"uri" => [
									"type" => "string",
									"description" => "external link url"
								],
								"icon" => [
									"type" => "string-image",
									"description" => "display image"
								]
							]
						],
						"tumblr" => [
							"type" => "object",
							"description" => "tumblr data",
							"fields" => [
								"uri" => [
									"type" => "string",
									"description" => "external link url"
								],
								"icon" => [
									"type" => "string-image",
									"description" => "display image"
								]
							]
						],
						"email" => [
							"type" => "object",
							"description" => "email data",
							"fields" => [
								"uri" => [
									"type" => "string",
									"description" => "external link url"
								],
								"icon" => [
									"type" => "string-image",
									"description" => "display image"
								]
							]
						]
					]
				],
				"style" => [
					"type" => "string"
				],
				"class" => [
					"type" => "string"
				],
			]
		]
	);


	// => BANNER HEADER
	$widget_id_banner_medal = giau_insert_widget("medal_banner",
		[
			"alias" => "medal_banner",
			"name" => "Giau Medal Banner",
			"cssClass" => "",
			"jsClass" => "",
			"fields" => [
				"title" => [
					"type" => "string"
				],
				"message" => [
					"type" => "string"
				],
				"icon" => [
					"type" => "string-image"
				],
				"color_base" => [
					"type" => "string-color"
				],
				"color_light" => [
					"type" => "string-color"
				],
				"color_dark" => [
					"type" => "string-color"
				],
				"style" => [
					"type" => "string"
				],
				"class" => [
					"type" => "string"
				],
			]
		]
	);



	// => SERVICE LIST
	$widget_id_service_listing = giau_insert_widget("service_listing",
		[
			"alias" => "social_apps",
			"name" => "Giau Social Apps",
			"cssClass" => "",
			"jsClass" => "",
			"fields" => [
				"services" => [
					"type" => "array-object",
					"fields" => [
						"title" => [
							"type" => "string"
						],
						"description" => [
							"type" => "string"
						],
					]
				],
				"style" => [
					"type" => "string"
				],
				"class" => [
					"type" => "string"
				],
			]
		]
	);

	// => PERSONNEL COVERAGE
	$widget_id_personnel_coverage = giau_insert_widget("personnel_coverage",
		[
			"alias" => "social_apps",
			"name" => "Giau Social Apps",
			"cssClass" => "",
			"jsClass" => "",
			"fields" => [
				"tags" => [
					"type" => "array-string",
					"description" => "list of tags to filter on for listing"
				],
				"style" => [
					"type" => "string"
				],
				"class" => [
					"type" => "string"
				],
			]
		]
	);

	$widget_id_download_listing = giau_insert_widget("download_listing",
		[
			"alias" => "download_listing",
			"name" => "Giau Download Listing",
			"cssClass" => "",
			"jsClass" => "",
			"fields" => [
				"files" => [
					"type" => "array-object",
					"description" => "list of items to download",
					"fields" => [
						"title" => [
							"type" => "string",
							"description" => "text to display",
						],
						"uri" => [
							"type" => "string-url",
							"description" => "url to file source",
						]
					]
				],
				"style" => [
					"type" => "string"
				],
				"class" => [
					"type" => "string"
				],
			]
		]
	);

	// => BIOGRAPHIES
	$widget_id_bio_listing = giau_insert_widget("bio_listing",
		[
			"alias" => "bio_listing",
			"name" => "Giau Biography Listing",
			"cssClass" => "",
			"jsClass" => "",
			"fields" => [
				"tags" => [
					"type" => "array-string"
				],
				"default_image" => [
					"type" => "string-url",
					"description" => "image to use if none is found on bio entry"
				],
				"style" => [
					"type" => "string"
				],
				"class" => [
					"type" => "string"
				],
			]
		]
	);

	// => GOOGLE MAP
	$widget_id_map_google = giau_insert_widget("map_google",
		[
			"alias" => "map_google",
			"name" => "Giau Google Map",
			"cssClass" => "",
			"jsClass" => "",
			"fields" => [
				"source" => [
					"type" => "string"
				],
				"style" => [
					"type" => "string"
				],
				"class" => [
					"type" => "string"
				],
			]
		]
	);

	error_log("RICHIE - C");
	
	// => CONTACT BIO ORDERING
	$widget_id_contact_bio = giau_insert_widget("contact_bio",
		[
			"alias" => "map_google",
			"name" => "Giau Google Map",
			"cssClass" => "",
			"jsClass" => "",
			"fields" => [
				"ordering" => [
					"type" => "array-object",
					"fields" => [
						"index" => [
							"type" => "string"
						],
						"title" => [
							"type" => "string"
						]
					]
				],
				"tags" => [
					"type" => "array-string"
				],
				"style" => [
					"type" => "string"
				],
				"class" => [
					"type" => "string"
				],
			]
		]
	);

	// => CONTACT FORM
	$widget_id_contact_form = giau_insert_widget("contact_form",
		[
			"alias" => "map_google",
			"name" => "Giau Google Map",
			"cssClass" => "",
			"jsClass" => "",
			"fields" => [
				"inputs" => [
					"type" => "object",
					"fields" => [
						"email" => [
							"type" => "object",
							"fields" => [
								"title" => [
									"type" => "string-language"
								],
								"include" => [
									"type" => "string-boolean"
								],
								"hint" => [
									"type" => "string-language"
								],
								"required" => [
									"type" => "string-boolean"
								],
							]
						],
						"name" => [
							"type" => "object",
							"fields" => [
								"title" => [
									"type" => "string-language"
								],
								"include" => [
									"type" => "string-boolean"
								],
								"hint" => [
									"type" => "string-language"
								],
								"required" => [
									"type" => "string-boolean"
								],
							]
						],
						"message" => [
							"type" => "object",
							"fields" => [
								"title" => [
									"type" => "string-language"
								],
								"include" => [
									"type" => "string-boolean"
								],
								"hint" => [
									"type" => "string-language"
								],
								"required" => [
									"type" => "string-boolean"
								],
							]
						],
						"phone" => [
							"type" => "object",
							"fields" => [
								"title" => [
									"type" => "string-language"
								],
								"include" => [
									"type" => "string-boolean"
								],
								"hint" => [
									"type" => "string-language"
								],
								"required" => [
									"type" => "string-boolean"
								],
							]
						],
						"submit" => [
							"type" => "object",
								"fields" => [
									"title" => [
										"type" => "string-language"
									],
									"message" => [
										"type" => "string-language"
									],
								]
							]
						],
					]
				],
				"tags" => [
					"type" => "array-string"
				],
				"style" => [
					"type" => "string"
				],
				"class" => [
					"type" => "string"
				],
		]
	);


	// => TOP LEFT CORNER PAGE TITLE
	$widget_id_info_status = giau_insert_widget("info_status",
		[
			"alias" => "info_status",
			"name" => "Giau Info Status",
			"cssClass" => "",
			"jsClass" => "",
			"fields" => [
				"titles" => [
					"type" => "array-object",
					"fields" => [
						"index" => [
							"type" => "string"
						],
						"title" => [
							"type" => "string"
						]
					]
				],
				"style" => [
					"type" => "string"
				],
				"class" => [
					"type" => "string"
				],
			]
		]
	);

	


	$navigationComponentsMainMenu = [
			"components" => [ // return $root."?page=".$pageName."&sp=".($subpage ? $subpage : "");
				[
					"name" => "nav_home",
					"display_text" => "NAV_ITEM_PAGE_NAVIGATION_HOME_TEXT",
					"uri" => "./?page=home",
					"page" => "home"
				],
				[
					"name" => "nav_departments",
					"display_text" => "NAV_ITEM_PAGE_NAVIGATION_DEPARTMENTS_TEXT",
					//"uri" => "./?page=departments&sp="
					"page" => "",
				],
				[
					"name" => "nav_staff",
					"display_text" => "NAV_ITEM_PAGE_NAVIGATION_STAFF_TEXT",
					"uri" => "./?page=staff",
					"page" => "staff",
				],
				[
					"name" => "nav_forms",
					"display_text" => "NAV_ITEM_PAGE_NAVIGATION_FORMS_TEXT",
					"uri" => "./?page=forms",
					"page" => "forms",
				],
				[
					"name" => "nav_contact",
					"display_text" => "NAV_ITEM_PAGE_NAVIGATION_CONTACT_TEXT",
					"uri" => "./?page=contact",
					"page" => "contact",
				],
				[
					"name" => "nav_lacpc",
					"display_text" => "NAV_ITEM_PAGE_NAVIGATION_LACPC_TEXT",
					"uri" => "http://www.lacpcks.org",
					"page" => "",
				]
			],
			"dark_mode" => "true",
		];
	
	$section_id_navigation_main = giau_insert_section("nav home dark", $widget_id_navigation_list,
		$navigationComponentsMainMenu
	, []);

	$navigationComponentsMainMenu["dark_mode"] = "false";
	$section_id_navigation_main_light = giau_insert_section("nav home light", $widget_id_navigation_list,
		$navigationComponentsMainMenu
	, []);
	
	$navigationComponentsSubMenu = [
			"components" => [ // return $root."?page=".$pageName."&sp=".($subpage ? $subpage : "");
				[
					"name" => "nav_nursery",
					"display_text" => "NAV_ITEM_PAGE_NAVIGATION_DEPT_NURSERY_TEXT",
					"uri" => "./?page=nursery",
					"page" => "nursery",
				],
				[
					"name" => "nav_kindergarten",
					"display_text" => "NAV_ITEM_PAGE_NAVIGATION_DEPT_KINDERGARTEN_TEXT",
					"uri" => "./?page=kindergarten",
					"page" => "kindergarten",
				],
				[
					"name" => "nav_elementary",
					"display_text" => "NAV_ITEM_PAGE_NAVIGATION_DEPT_ELEMENTARY_TEXT",
					"uri" => "./?page=elementary",
					"page" => "elementary",
				],
				[
					"name" => "nav_junior_high",
					"display_text" => "NAV_ITEM_PAGE_NAVIGATION_DEPT_JUNIOR_HIGH_TEXT",
					"uri" => "./?page=juniorhigh",
					"page" => "juniorhigh",
				],
				[
					"name" => "nav_high_school",
					"display_text" => "NAV_ITEM_PAGE_NAVIGATION_DEPT_HIGH_SCHOOL_TEXT",
					"uri" => "./?page=highschool",
					"page" => "highschool",
				],
				[
					"name" => "nav_korean_school",
					"display_text" => "NAV_ITEM_PAGE_NAVIGATION_DEPT_KOREAN_SCHOOL_TEXT",
					"uri" => "http://www.lacpcks.org",
					"page" => "",
				]
			],
			"dark_mode" => "true",
			"start_hidden" => "true",
			"animates_down" => "nav_departments",
			"animates_up" => "nav_departments",
		];

	$section_id_navigation_departments = giau_insert_section("nav departments dark", $widget_id_navigation_list,
		$navigationComponentsSubMenu
	, []);


	$navigationComponentsSubMenu["dark_mode"] = "false";
		$navigationComponentsSubMenu["style"] = "padding-top:0px;";
	$section_id_navigation_departments_light = giau_insert_section("nav departments light", $widget_id_navigation_list,
		$navigationComponentsSubMenu
	, []);

	$languageSwitchComponents = [
			"languages" => [
				[
					"display_text" => "LANGUAGE_SWITCH_ENGLISH_TEXT",
					"language_name" => "en",
					"enabled" => "true",
				],
				[
					"display_text" => "LANGUAGE_SWITCH_KOREAN_TEXT",
					"language_name" => "ko",
					"enabled" => "false",
				],
			],
			"color" => "0xFFFFFFFF",
		];

	$section_id_language_switch = giau_insert_section("language switch light", $widget_id_language_switch,
		$languageSwitchComponents
	, []);


	$languageSwitchComponents["color"] = "0xFF000000";
	$section_id_language_switch_light = giau_insert_section("language switch dark", $widget_id_language_switch,
		$languageSwitchComponents
	, []);


	$section_id_text_overlay_1 = giau_insert_section("home overlay a", $widget_id_text_display,
		[
			"text" => "PAGE_HOME_OVERLAY_TITLE_1_TEXT",
			"class" => "featureInfoOverlayHeading",
		]
	, []);
	$section_id_text_overlay_2 = giau_insert_section("home overlay b", $widget_id_text_display,
		[
			"text" => "PAGE_HOME_OVERLAY_TITLE_2_TEXT",
			"class" => "featureInfoOverlayTitle",
		]
	, []);
	$section_id_text_overlay_3 = giau_insert_section("home overlay c", $widget_id_text_display,
		[
			"text" => "PAGE_HOME_OVERLAY_TITLE_3_TEXT",
			"class" => "featureInfoOverlaySubtitle",
		]
	, []);
	$section_id_text_overlay_spacer = giau_insert_section("home overlay spacer", $widget_id_text_display,
		[
			"text" => "",
			"class" => "",
		]
	, []);

	$section_id_home_gallery_overlay = giau_insert_section("home overlay container", $widget_id_display_overlay,
		[
			//
		]
	, [$section_id_text_overlay_1,$section_id_text_overlay_spacer,$section_id_text_overlay_2,$section_id_text_overlay_spacer,$section_id_text_overlay_3,$section_id_text_overlay_spacer]);

	giau_insert_languagization($langEng,"PAGE_HOME_QUOTE_DEUTERONOMY_6_6_7_BODY_TEXT","\"These commandments I give you today are to be upon your hearts. Impress them on your children. Talk about them when you sit at home and when you walk along the road, when you are down and when you get up.\"");
	giau_insert_languagization($langEng,"PAGE_HOME_QUOTE_DEUTERONOMY_6_6_7_TITLE_TEXT","Deuteronomy 6:6-7");
	giau_insert_languagization($langEng,"PAGE_HOME_QUOTE_PURPOSE_BODY_TEXT","Through worship, bible study & accountability, we strive to provide an environment for our children and youth to experience the grace of God. In addition, we aim to serve parents and entire families as well. More than just a children and youth ministry, our Christian Education department is a family ministry.");
		giau_insert_languagization($langKor,"PAGE_HOME_QUOTE_PURPOSE_BODY_TEXT","어린이들과 청소년들이 가족들과 함께 예배와 성경공부를 통해 하나님의 은혜를 경험할수있는 환경을 제공하겠습니다. 우리는 부모와 가족 전체뿐만 아니라 서비스를 제공하는 것을 목표로하고 있습니다. 저희 교회의 교육부서는 어린이들과 청소년을 포함한, 가족을위한 XX (Ministry) 입니다.");

	giau_insert_languagization($langEng,"LISTING_DEPT_NURSERY_TEXT","Nursery");
		giau_insert_languagization($langKor,"LISTING_DEPT_NURSERY_TEXT","유아실");
	giau_insert_languagization($langEng,"LISTING_DEPT_KINDERGARTEN_TEXT","Kindergarten");
		giau_insert_languagization($langKor,"LISTING_DEPT_KINDERGARTEN_TEXT","유치부");
	giau_insert_languagization($langEng,"LISTING_DEPT_ELEMENTARY_TEXT","Elementary");
		giau_insert_languagization($langKor,"LISTING_DEPT_ELEMENTARY_TEXT","초등부");
	giau_insert_languagization($langEng,"LISTING_DEPT_JUNIOR_HIGH_TEXT","Junior High");
		giau_insert_languagization($langKor,"LISTING_DEPT_JUNIOR_HIGH_TEXT","중등부");
	giau_insert_languagization($langEng,"LISTING_DEPT_HIGH_SCHOOL_TEXT","High School");
		giau_insert_languagization($langKor,"LISTING_DEPT_HIGH_SCHOOL_TEXT","고등부");
	giau_insert_languagization($langEng,"LISTING_DEPT_KOREAN_SCHOOL_TEXT","Korean School");
		giau_insert_languagization($langKor,"LISTING_DEPT_KOREAN_SCHOOL_TEXT","한국어 학교");
	
	$section_id_category_listing_departments = giau_insert_section("category deparmentlist ", $widget_id_category_listing,
		[
			"categories" => [
				[
					"image" => "/images/icons/category_nursery.png",
					"name" => "LISTING_DEPT_NURSERY_TEXT",
					"uri" => "./?page=nursery"
				],
				[
					"image" => "/images/icons/category_kindergarten.png",
					"name" => "LISTING_DEPT_KINDERGARTEN_TEXT",
					"uri" => "./?page=kindergarten"
				],
				[
					"image" => "/images/icons/category_elementary.png",
					"name" => "LISTING_DEPT_ELEMENTARY_TEXT",
					"uri" => "./?page=elementary"
				],
				[
					"image" => "/images/icons/category_junior_high.png",
					"name" => "LISTING_DEPT_JUNIOR_HIGH_TEXT",
					"uri" => "./?page=juniorhigh"
				],
				[
					"image" => "/images/icons/category_high_school.png",
					"name" => "LISTING_DEPT_HIGH_SCHOOL_TEXT",
					"uri" => "./?page=highschool"
				],
				[
					"image" => "/images/icons/category_korean_school.png",
					"name" => "LISTING_DEPT_KOREAN_SCHOOL_TEXT",
					"uri" => "http://www.lacpcks.org"
				]
			],
			"class_image" => "",
			"class_text" => "",
			"rounded" => "true",
			"class" => "customCategoryDepartments",
			"style" => ""
		]
	, []);


// LIGHT STUFF

	$section_id_navigation_departments_light_container = giau_insert_section("category departments light container", $widget_id_content_container,
		[
			"class" => "",
			"style" => "display:block; width:100%; text-align:center;",
		]
	, [$section_id_navigation_departments_light]);


	$section_id_navigation_status_container = giau_insert_section("navigation status container", $widget_id_info_status,
		[
			"fields" => [
				[
					"index" => "home",
					"title" => "PAGE_HOME_TITLE_TEXT",
				],
				[
					"index" => "nursery",
					"title" => "PAGE_DEPARTMENT_NURSERY_TITLE_TEXT",
				],
				[
					"index" => "kindergarten",
					"title" => "PAGE_DEPARTMENT_KINDERGARTEN_TITLE_TEXT",
				],
				[
					"index" => "elementary",
					"title" => "PAGE_DEPARTMENT_ELEMENTARY_TITLE_TEXT",
				],
				[
					"index" => "juniorhigh",
					"title" => "PAGE_DEPARTMENT_JUNIORHIGH_TITLE_TEXT",
				],
				[
					"index" => "highschool",
					"title" => "PAGE_DEPARTMENT_HIGHSCHOOL_TITLE_TEXT",
				],
				[
					"index" => "staff",
					"title" => "PAGE_STAFF_TITLE_TEXT",
				],
				[
					"index" => "forms",
					"title" => "PAGE_FORMS_TITLE_TEXT",
				],
				[
					"index" => "contact",
					"title" => "PAGE_CONTACT_TITLE_TEXT",
				],
				[
					"index" => "lacpc",
					"title" => "PAGE_LACPC_TITLE_TEXT",
				],
			],
			"class" => "",
			"style" => "",
		]
	, [$section_id_navigation_main_light,$section_id_language_switch_light]);



	$section_id_navigation_main_shadow = giau_insert_section("main nav shadow", $widget_id_content_container,
		[
			"style" => "position:absolute; display:inline-block; left:0; right:0; top:0; height:50px; background-repeat:repeat-x; background-image:url('./wp-content/themes/giau/img/shadow_fade_top.png');",
			"class" => ""
		]
	, []);


	$section_id_navigation_main_container = giau_insert_section("main nav container", $widget_id_content_container,
		[
			"style" => "position:relative; top:0px; display:inline-block; text-align:center;  width:100%;",
			"class" => "headerNavigationContainer"
		]
	, [$section_id_navigation_main_shadow, $section_id_language_switch, $section_id_navigation_main]);

	$section_id_navigation_secondary_container = giau_insert_section("nav secondary container", $widget_id_content_container,
		[
			"style" => "position:relative; display:inline-block; text-align:center;  width:100%;",
			"class" => ""
		]
	, [$section_id_navigation_departments]);

	$section_id_gallery_home_page_primary = giau_insert_section("image gallery featured", $widget_id_image_gallery,
		[
			"autoplay" => "10000",
			"display_navigation" => "false",
			"images" => [
				"/images/galleries/home_featured/featured_06_opt.png",
				"/images/galleries/home_featured/featured_01_opt.png",
				"/images/galleries/home_featured/featured_02_opt.png",
				"/images/galleries/home_featured/featured_03_opt.png",
				"/images/galleries/home_featured/featured_04_opt.png",
				"/images/galleries/home_featured/featured_05_opt.png",
			],
			"overlay_color" => "0x44000000",
			"height" => "500px",
			"style" => "",
			"class" => "featurePresentationContainer",
			"page_indicators" => "true",
		]
	, [$section_id_home_gallery_overlay, $section_id_navigation_main_container, $section_id_navigation_secondary_container]);

	$section_id_image_gallery_home_secondary = giau_insert_section("image gallery home", $widget_id_image_gallery,
		[
			"autoplay" => "20000",
			"display_navigation" => "true",
			"images" => [
				"/images/galleries/home_featured/featured_01_opt.png",
				"/images/galleries/home_featured/featured_02_opt.png",
				"/images/galleries/home_featured/featured_03_opt.png",
				"/images/galleries/home_featured/featured_04_opt.png",
			],
			"height" => "500px",
			"page_indicators" => "true",
			"style" => "position:relative; width:100%;", // height:400px;
			"class" => "limitedWidth"
		]
	, []);


	$section_id_text_home_page_deuteronomy_title = giau_insert_section("home bible title", $widget_id_text_display,
		[
			"text" => "PAGE_HOME_QUOTE_DEUTERONOMY_6_6_7_TITLE_TEXT",
			"class" => "centeredText importantText focusedCenterpieceWidth customHeadingQuoteTitle",
			"style" => "padding-top:64px;"
		]
	, []);
	$section_id_text_home_page_deuteronomy_body = giau_insert_section("home bible body", $widget_id_text_display,
		[
			"text" => "PAGE_HOME_QUOTE_DEUTERONOMY_6_6_7_BODY_TEXT",
			"class" => "centeredText standardText narrow35Text customHeadingQuoteBody",
		]
	, []);
	$section_id_text_home_page_deuteronomy_spacer = giau_insert_section("home bible spacer", $widget_id_text_display,
		[
			"text" => "",
			"class" => "dividerText",
		]
	, []);
	$section_id_text_home_page_purpose_body = giau_insert_section("home purpose body", $widget_id_text_display,
		[
			"text" => "PAGE_HOME_QUOTE_PURPOSE_BODY_TEXT",
			"class" => "centeredText standardText narrow35Text customHeadingQuoteBody",
			"style" => "padding-bottom:64px;"
		]
	, []);

	$section_id_divider_with_bar = giau_insert_section("home spacer", $widget_id_vertical_divider,
		[
			"show_bar" => "true",
			"height" => "8",
		]
	, []);


	$section_id_text_footer_title = giau_insert_section("footer title", $widget_id_text_display,
		[
			"text" => "FOOTER_TITLE_TEXT",
			"class" => "footerElementTitle",
		]
	, []);

	$section_id_text_footer_address_1 = giau_insert_section("footer address a", $widget_id_text_display,
		[
			"text" => "FOOTER_ADDRESS_1_TEXT",
			"class" => "footerElementTextLine",
		]
	, []);

	$section_id_text_footer_address_2 = giau_insert_section("footer address b", $widget_id_text_display,
		[
			"text" => "FOOTER_ADDRESS_2_TEXT",
			"class" => "footerElementTextLine",
		]
	, []);

	$section_id_text_footer_address_3 = giau_insert_section("footer address c", $widget_id_text_display,
		[
			"text" => "FOOTER_ADDRESS_3_TEXT",
			"class" => "footerElementTextLine",
		]
	, []);

	$section_id_text_footer_copyright = giau_insert_section("footer copyright", $widget_id_text_display,
		[
			"text" => "FOOTER_COPYRIGHT_TEXT",
			"class" => "footerElementTextCopyright",
		]
	, []);

	$section_id_text_footer_bottom_empty = giau_insert_section("footer bottom spacer", $widget_id_text_display,
		[
			"text" => "",
			"class" => "footerElementBottom",
		]
	, []);

	$section_id_social_apps = giau_insert_section("footer social apps", $widget_id_social_apps,
		[
			"social" => [
				"facebook" => [
					"uri" => "https://www.facebook.com/thefathershouse.lacpc",
					"icon" => "/images/social_media/icon_footer_facebook.png"
				],
				"twitter" => [
					"uri" => "https://twitter.com/thefathersh0use?lang=en",
					"icon" => "/images/social_media/icon_footer_twitter.png"
				],
				"instagram" => [
					"uri" => "",
					"icon" => "/images/social_media/icon_footer_instagram.png"
				],
				"email" => [
					"uri" => "mailto:ce@lacpc.org",
					"icon" => "/images/social_media/icon_footer_email.png"
				],
			],
			"class" => "footerElementSocialItem"
		]
	, []);
	
	$section_id_footer_all = giau_insert_section("footer container", $widget_id_footer,
		[
				//
		]
	, [$section_id_text_footer_title, $section_id_social_apps, $section_id_text_footer_address_1, $section_id_text_footer_address_2 , $section_id_text_footer_address_3 , $section_id_text_footer_copyright, $section_id_text_footer_bottom_empty]);

	error_log("section_id_footer_all: ".$section_id_footer_all);


	$section_id_text_calendar_heading = giau_insert_section("calendar heading", $widget_id_text_display,
		[
			"text" => "HEADING_HOME_CALENDAR_SCHEDULE_TEXT",
			"class" => "customHeadingCalendarSchedule limitedWidth",
		]
	, []);

	$section_id_calendar_listing_home = giau_insert_section("calendar listing home", $widget_id_calendar_listing,
		[
			"tags" => [$calendar_tag_front_page],
			"range_start" => "".(-10*24*60*60*1000), // 7 days ago
			"range_end" => "".(120*24*60*60*1000), // 4 months into future
			"relative" => "true", // treat numbers as milliseconds around date |OR| as absolute unix epoc times
			"order_recent_first" => "true",
			"class" => "limitedWidth"
		]
	, []);


	// PAGES 
	
	$PAGE_TAG_LIVE = "__live";
	$PAGE_TAG_HOME = "home";
	// PAGE - MAIN
	$page_id_front_page = giau_insert_page("page_home",
		[
			//$section_id_home_page_top,
			$section_id_gallery_home_page_primary,

			$section_id_category_listing_departments,

			$section_id_divider_with_bar,
			$section_id_text_home_page_purpose_body,
			$section_id_text_home_page_deuteronomy_spacer,
			
			$section_id_image_gallery_home_secondary,

			$section_id_text_home_page_deuteronomy_title,
			$section_id_text_home_page_deuteronomy_body,

			$section_id_divider_with_bar,

			$section_id_text_calendar_heading,

			$section_id_calendar_listing_home,

			$section_id_footer_all
		],
		"".$PAGE_TAG_LIVE.",".$PAGE_TAG_HOME.""
	);
	// PAGE - DEPARTMENTS
	

	// SUB-NAV-WIDGET

	//EN|KO
	//HomeDepartmentsStaffFormsContact UsLACPC


	// PAGE DEPARTMENT - NURSERY
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_NURSERY_TITLE_TEXT","NURSERY");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_NURSERY_TITLE_TEXT","유아실");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_NURSERY_BANNER_TITLE","Nursery of Overflowing Love");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_NURSERY_BANNER_MESSAGE","And now these three remain: fath, hope and love, but the greatest of these is love.\n- 1 Corinthians 13:13");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_NURSERY_BANNER_MESSAGE","그런즉 믿음, 소망, 사랑, 이 세 가지는 항상 있을 것인데 그 중에 제일은 사랑이라.\n- 고린도전서 13:13 ");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_NURSERY_SERVICE_TITLE_1","Sunday Worship\n1st Service");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_NURSERY_SERVICE_TITLE_1","주일예배 (첫예배)");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_NURSERY_SERVICE_INFO_1","9:00 AM\n@ Nursery Worship Room\n(in Nursery Building)");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_NURSERY_SERVICE_INFO_1","9:00 AM\n@ 유아 예배실\n(유아실 건물)");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_NURSERY_SERVICE_TITLE_2","Sunday Worship\n2nd Service");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_NURSERY_SERVICE_TITLE_2","주일예배\n2nd Service");
	
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_NURSERY_SERVICE_INFO_2","11:00 AM\n@ Nursery Worship Room\n(in Nursery Building)");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_NURSERY_SERVICE_INFO_2","11:00 AM\n@ 유아 예배실\n(유아실 건물)");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_NURSERY_SERVICE_TITLE_3","Friday Night\nFellowship");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_NURSERY_SERVICE_INFO_3","8:00 PM\n@ Nursery Building");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_NURSERY_SERVICE_INFO_3","8:00 PM\n@ 유아실 건물");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_NURSERY_SECTION_1","The Nursery department at LACPC envisions a children's ministry that follows the overarching theme of the education department, \"Father's House.\" Through nursery department's worship, guidance, and nurturing, we hope to reestablish the following:");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_NURSERY_SECTION_2","1");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_NURSERY_SECTION_3","Family worships and communication with families that will enrich the spiritual lives of our young children.");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_NURSERY_SECTION_3","우리 어린이들의 영적 삶을 풍요롭게하는 가족예배와 서로간의 소통");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_NURSERY_SECTION_4","2");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_NURSERY_SECTION_5","Family visitations that will enhance the love of God.");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_NURSERY_SECTION_5","주님의 사랑을 향상하는 가족방문");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_NURSERY_SECTION_6","3");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_NURSERY_SECTION_7","Revival and acceptance of multicultural children and families.");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_NURSERY_SECTION_7","다문화 어린이들과 가족들의 수용");

	$section_id_banner_nursery = giau_insert_section("nursery banner", $widget_id_banner_medal,
		[
			"title" => "PAGE_DEPARTMENT_NURSERY_BANNER_TITLE",
			"message" => "PAGE_DEPARTMENT_NURSERY_BANNER_MESSAGE",
			"icon" => "/images/icons/featured_nursery.png",
			"color_base" => "0xCBC42D",
			"color_light" => "0xBBBB22",
			"color_dark" => "0xBBBB22",
			"class" => "",
			"style" => "",
		]
	, []);

	$section_id_services_nursery = giau_insert_section("nursery services", $widget_id_service_listing,
		[
			"services" => [
				[
					"title" => "PAGE_DEPARTMENT_NURSERY_SERVICE_TITLE_1",
					"description" => "PAGE_DEPARTMENT_NURSERY_SERVICE_INFO_1",
				],
				[
					"title" => "PAGE_DEPARTMENT_NURSERY_SERVICE_TITLE_2",
					"description" => "PAGE_DEPARTMENT_NURSERY_SERVICE_INFO_2",
				],
				[
					"title" => "PAGE_DEPARTMENT_NURSERY_SERVICE_TITLE_3",
					"description" => "PAGE_DEPARTMENT_NURSERY_SERVICE_INFO_3",
				],
			],
			"class" => "",
			"style" => "",
		]
	, []);

	$section_id_personnel_nursery = giau_insert_section("nursery personnel", $widget_id_personnel_coverage,
		[
			"tags" => [
				"nursery"
			],
			"class" => "",
			"style" => "",
		]
	, []);

	$section_id_text_nursery_1 = giau_insert_section("nursery info a", $widget_id_text_display,
		[
			"text" => "PAGE_DEPARTMENT_NURSERY_SECTION_1",
			"class" => "departmentDescriptionItemBold",
			"style" => "",
		]
	, []);
	$section_id_text_nursery_2 = giau_insert_section("nursery info b", $widget_id_text_display,
		[
			"text" => "PAGE_DEPARTMENT_NURSERY_SECTION_2",
			"class" => "departmentDescriptionItemFeatured",
			"style" => "",
		]
	, []);
	$section_id_text_nursery_3 = giau_insert_section("nursery info c", $widget_id_text_display,
		[
			"text" => "PAGE_DEPARTMENT_NURSERY_SECTION_3",
			"class" => "departmentDescriptionItemInfo",
			"style" => "",
		]
	, []);
	$section_id_text_nursery_4 = giau_insert_section("nursery info d", $widget_id_text_display,
		[
			"text" => "PAGE_DEPARTMENT_NURSERY_SECTION_4",
			"class" => "departmentDescriptionItemFeatured",
			"style" => "",
		]
	, []);
	$section_id_text_nursery_5 = giau_insert_section("nursery info e", $widget_id_text_display,
		[
			"text" => "PAGE_DEPARTMENT_NURSERY_SECTION_5",
			"class" => "departmentDescriptionItemInfo",
			"style" => "",
		]
	, []);
	$section_id_text_nursery_6 = giau_insert_section("nursery info f", $widget_id_text_display,
		[
			"text" => "PAGE_DEPARTMENT_NURSERY_SECTION_6",
			"class" => "departmentDescriptionItemFeatured",
			"style" => "",
		]
	, []);
	$section_id_text_nursery_7 = giau_insert_section("nursery info g", $widget_id_text_display,
		[
			"text" => "PAGE_DEPARTMENT_NURSERY_SECTION_7",
			"class" => "departmentDescriptionItemInfo",
			"style" => "",
		]
	, []);

	$section_id_gallery_nursery = giau_insert_section("image gallery nursery", $widget_id_image_gallery,
		[
			"autoplay" => "10000",
			"display_navigation" => "false",
			"images" => [
				"/images/galleries/elementary/gallery_01_opt.png",
				"/images/galleries/elementary/gallery_02_opt.png",
				"/images/galleries/elementary/gallery_03_opt.png",
				"/images/galleries/elementary/gallery_04_opt.png",
				"/images/galleries/elementary/gallery_05_opt.png",
			],
			"height" => "500px",
			"page_indicators" => "true",
			"style" => "",
			"class" => ""
		]
	, []);
	

	$section_id_text_nursery_left = giau_insert_section("nursery left container", $widget_id_content_container,
		[
			"class" => "",
			"style" => "display:table-cell; width:40%; vertical-align:top; text-align:center;",
		]
	, [$section_id_personnel_nursery]);
	$section_id_text_nursery_right = giau_insert_section("nursery right container", $widget_id_content_container,
		[
			"class" => "",
			"style" => "display:table-cell; width:60%; vertical-align:top; text-align:center; padding:0px 20px 0px 20px;",
		]
	, [	$section_id_text_nursery_1,
		$section_id_text_nursery_2,
		$section_id_text_nursery_3,
		$section_id_text_nursery_4,
		$section_id_text_nursery_5,
		$section_id_text_nursery_6,
		$section_id_text_nursery_7]);

	$section_id_text_nursery_container = giau_insert_section("nursery container", $widget_id_content_container,
		[
			"class" => "limitedWidth",
			"style" => "display:block; padding:20px; margin-top:32px; margin-bottom:40px; ".$themeBackgroundColorA."",
		]
	, [$section_id_text_nursery_left,$section_id_text_nursery_right]);

	$PAGE_TAG_DEPARTMENTS_NURSERY = "nursery";
	// PAGE - NURSERY
	$page_id_nursery = giau_insert_page("page_nursery",
		[
			$section_id_navigation_status_container,
			$section_id_navigation_departments_light_container,
			//
			$section_id_banner_nursery,
			$section_id_gallery_nursery,
			$section_id_services_nursery,
			$section_id_text_nursery_container,
			// TODO -- make specific nursery gallery
			$section_id_text_calendar_heading,
			$section_id_calendar_listing_home,
			$section_id_footer_all
		],
		"".$PAGE_TAG_DEPARTMENTS_NURSERY.""
	);
	error_log("page_id_nursery: ".$page_id_nursery);





	// PAGE DEPARTMENT - KINDERGARTEN
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_KINDERGARTEN_TITLE_TEXT","KINDERGARTEN");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_KINDERGARTEN_TITLE_TEXT","유치부");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_KINDERGARTEN_BANNER_TITLE","Grown in Christ, as God's Children");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_KINDERGARTEN_BANNER_MESSAGE","Worship the LORD with gladness: come before him with joyful song.\n- Psalm 100:2");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_KINDERGARTEN_BANNER_MESSAGE","기쁨으로 여호와를 섬기며 노래하면서 그 앞에 나아갈찌어다.\n- 시편 100:2");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_KINDERGARTEN_SERVICE_TITLE_1","Sunday\nWorship");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_KINDERGARTEN_SERVICE_TITLE_1","주일예배");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_KINDERGARTEN_SERVICE_INFO_1","11:00 AM\n@ Kindergarden Worship Room\n(in Kindergarden Building)");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_KINDERGARTEN_SERVICE_INFO_1","11:00 AM\n@ 유치부 예배실\n(유치부 건물)");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_KINDERGARTEN_SERVICE_TITLE_2","Sunday\nBible Study");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_KINDERGARTEN_SERVICE_TITLE_2","주일 성경공부");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_KINDERGARTEN_SERVICE_INFO_2","11:40 AM\n@ Classroom #302, 303, 306\n(in Kindergarden Building)");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_KINDERGARTEN_SERVICE_INFO_2","11:40 AM\n@ 주일 성경공부 (#302, 303, 306호 교실)\n(유치부 건물)");

	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_KINDERGARTEN_SERVICE_TITLE_3","Friday Night\nBible Study");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_KINDERGARTEN_SERVICE_TITLE_3","금요일밤 성경공부");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_KINDERGARTEN_SERVICE_INFO_3","8:00 PM\n@ Classroom #303\n(in Kindergarden Building)");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_KINDERGARTEN_SERVICE_INFO_3","8:00 PM\n@ 호 교실 #303\n(유치부 건물)");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_KINDERGARTEN_SECTION_1","As a goal, let children grow in the Lord Jesus Christ, building the image of God through the \"Word of God.\" Becoming disciples of Jesus in the joy of worshiping God as well as becoming evangelists of Jesus in Children's lives. For families, Christian education builds up in a family and provide parents with training opportunities and teaching materials to be active ministry supporters.");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_KINDERGARTEN_SECTION_2","For families, Christian education builds up in a family and provide parents with training opportunities and teaching materials to be active ministry supporters.");

	$section_id_banner_kindergarten = giau_insert_section("banner kindergarten", $widget_id_banner_medal,
		[
			"title" => "PAGE_DEPARTMENT_KINDERGARTEN_BANNER_TITLE",
			"message" => "PAGE_DEPARTMENT_KINDERGARTEN_BANNER_MESSAGE",
			"icon" => "/images/icons/featured_kindergarden.png",
			"color_base" => "0xE0D011",
			"color_light" => "0xDDC313",
			"color_dark" => "0xDDC313",
			"class" => "",
			"style" => "",
		]
	, []);

	$section_id_services_kindergarten = giau_insert_section("services kindergarten", $widget_id_service_listing,
		[
			"services" => [
				[
					"title" => "PAGE_DEPARTMENT_KINDERGARTEN_SERVICE_TITLE_1",
					"description" => "PAGE_DEPARTMENT_KINDERGARTEN_SERVICE_INFO_1",
				],
				[
					"title" => "PAGE_DEPARTMENT_KINDERGARTEN_SERVICE_TITLE_2",
					"description" => "PAGE_DEPARTMENT_KINDERGARTEN_SERVICE_INFO_2",
				],
				[
					"title" => "PAGE_DEPARTMENT_KINDERGARTEN_SERVICE_TITLE_3",
					"description" => "PAGE_DEPARTMENT_KINDERGARTEN_SERVICE_INFO_3",
				],
			],
			"class" => "",
			"style" => "",
		]
	, []);

	$section_id_personnel_kindergarten = giau_insert_section("personnel kindergarten", $widget_id_personnel_coverage,
		[
			"tags" => [
				"kindergarten"
			],
			"class" => "",
			"style" => "",
		]
	, []);

	$section_id_text_kindergarten_1 = giau_insert_section("text display kindergarten 1", $widget_id_text_display,
		[
			"text" => "PAGE_DEPARTMENT_KINDERGARTEN_SECTION_1",
			"class" => "departmentDescriptionItemBold",
			"style" => "",
		]
	, []);
	$section_id_text_kindergarten_2 = giau_insert_section("text display kindergarten 2", $widget_id_text_display,
		[
			"text" => "PAGE_DEPARTMENT_KINDERGARTEN_SECTION_2",
			"class" => "departmentDescriptionItemBold",
			"style" => "",
		]
	, []);

	$section_id_gallery_kindergarten = giau_insert_section("gallery kindergarten", $widget_id_image_gallery,
		[
			"autoplay" => "10000",
			"display_navigation" => "false",
			"images" => [
				"/images/galleries/kindergarten/gallery_01_opt.png",
				"/images/galleries/kindergarten/gallery_02_opt.png",
				"/images/galleries/kindergarten/gallery_03_opt.png",
				"/images/galleries/kindergarten/gallery_04_opt.png",
				"/images/galleries/kindergarten/gallery_05_opt.png",
				"/images/galleries/kindergarten/gallery_06_opt.png",
				"/images/galleries/kindergarten/gallery_07_opt.png",
			],
			"height" => "500px",
			"page_indicators" => "true",
			"style" => "",
			"class" => ""
		]
	, []);

	

	$section_id_text_kindergarten_left = giau_insert_section("section left kindergarten", $widget_id_content_container,
		[
			"class" => "",
			"style" => "display:table-cell; width:40%; vertical-align:top; text-align:center;",
		]
	, [$section_id_personnel_kindergarten]);
	$section_id_text_kindergarten_right = giau_insert_section("section right kindergarten", $widget_id_content_container,
		[
			"class" => "",
			"style" => "display:table-cell; width:60%; vertical-align:top; text-align:center; padding:0px 20px 0px 20px;",
		]
	, [$section_id_text_kindergarten_1,$section_id_text_kindergarten_2]);

	$section_id_text_kindergarten_container = giau_insert_section("container kindergarten", $widget_id_content_container,
		[
			"class" => "limitedWidth",
			"style" => "display:block; padding:20px; margin-top:32px; margin-bottom:40px; ".$themeBackgroundColorA."",
		]
	, [$section_id_text_kindergarten_left,$section_id_text_kindergarten_right]);

	$PAGE_TAG_DEPARTMENTS_KINDERGARTEN = "kindergarten";
	// PAGE - KINDERGARTEN
	$page_id_kindergarten = giau_insert_page("page_kindergarten",
		[
			$section_id_navigation_status_container,
			$section_id_navigation_departments_light_container,
			//
			$section_id_banner_kindergarten,
			$section_id_gallery_kindergarten,
			$section_id_services_kindergarten,
			$section_id_text_kindergarten_container,
			// TODO -- make specific kindergarten gallery
			$section_id_text_calendar_heading,
			$section_id_calendar_listing_home,
			$section_id_footer_all
		],
		"".$PAGE_TAG_DEPARTMENTS_KINDERGARTEN.""
	);
	error_log("page_id_kindergarten: ".$page_id_kindergarten);





	// PAGE DEPARTMENT - ELEMENTARY
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_ELEMENTARY_TITLE_TEXT","ELEMENTARY");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_ELEMENTARY_TITLE_TEXT","초등부");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_ELEMENTARY_BANNER_TITLE","");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_ELEMENTARY_BANNER_MESSAGE","Start children off on the way they should go, and even when they are old they will not turn from it\n- Proverbs 22:6");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_ELEMENTARY_BANNER_MESSAGE","마땅히 행할 길을 아이에게 가르치라 그리하면 늙어도 그것을 떠나지 아니하리라.\n- 잠언 22:6");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_ELEMENTARY_SERVICE_TITLE_1","Sunday Worship\n1st Service");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_ELEMENTARY_SERVICE_TITLE_1","주일예배 (첫예배)");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_ELEMENTARY_SERVICE_INFO_1","11:00 AM\n@ Elementary Worship Room");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_ELEMENTARY_SERVICE_INFO_1","11:00 AM\n@ 초등부 예배");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_ELEMENTARY_SERVICE_TITLE_2","Sunday Worship\n2nd Service");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_ELEMENTARY_SERVICE_TITLE_2","주일예배\n2nd Service");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_ELEMENTARY_SERVICE_INFO_2","11:45 AM\n@ Classroom #138, 139, 140, 141, 142");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_ELEMENTARY_SERVICE_INFO_2","11:45 AM\n@ 호 교실 #138, 139, 140, 141, 142");
	
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_ELEMENTARY_SERVICE_TITLE_3","Friday Program:\nAWANA");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_ELEMENTARY_SERVICE_INFO_3","8:00 - 8:30 PM\nGame Time (Cafeteria)\n\n8:30 - 9:00 PM<br>Handbook Time\n(Classrooms)\n\n9:00 - 9:20 PM\nCouncil Time (Choir Room)");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_ELEMENTARY_SERVICE_INFO_3","8:00 - 8:30 PM\n게임 (식당)\n\n8:30 - 9:00 PM<br>안내서 시간 (교실)\n\n9:00 - 9:20 PM\n이사회 모임 (성가대실)");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_ELEMENTARY_SECTION_1","Elementary Department's vision and goal is to start children off on their journey of faith through:");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_ELEMENTARY_SECTION_2","1");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_ELEMENTARY_SECTION_3","Fostering a joy and desire to lean about God (fun and engaging worship, bible studies, and events)");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_ELEMENTARY_SECTION_3","하나님께 더 가까이가고, 배우고자하는 자발적 정신 (재미위주의 예배, 성경공부, 행사참여)");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_ELEMENTARY_SECTION_4","2");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_ELEMENTARY_SECTION_5","Implementing the basic Christian disciplines (prayer, quiet time, bible reading)");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_ELEMENTARY_SECTION_5","기본적인 기독교 학문 구현 (기도, 명상, 성경읽기)");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_ELEMENTARY_SECTION_6","3");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_ELEMENTARY_SECTION_7","Encouraging an active Christian lifestyle (knowledge into action)");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_ELEMENTARY_SECTION_7","건강한 신앙생활을 위한 격려 (행동으로 옮기기)");

	$section_id_banner_elementary = giau_insert_section("banner elementary", $widget_id_banner_medal,
		[
			"title" => "PAGE_DEPARTMENT_ELEMENTARY_BANNER_TITLE",
			"message" => "PAGE_DEPARTMENT_ELEMENTARY_BANNER_MESSAGE",
			"icon" => "/images/icons/featured_elementary.png",
			"color_base" => "0xF1592A",
			"color_light" => "0xDD5526",
			"color_dark" => "0xDD5526",
			"class" => "",
			"style" => "",
		]
	, []);

	$section_id_services_elementary = giau_insert_section("services elementary", $widget_id_service_listing,
		[
			"services" => [
				[
					"title" => "PAGE_DEPARTMENT_ELEMENTARY_SERVICE_TITLE_1",
					"description" => "PAGE_DEPARTMENT_ELEMENTARY_SERVICE_INFO_1",
				],
				[
					"title" => "PAGE_DEPARTMENT_ELEMENTARY_SERVICE_TITLE_2",
					"description" => "PAGE_DEPARTMENT_ELEMENTARY_SERVICE_INFO_2",
				],
				[
					"title" => "PAGE_DEPARTMENT_ELEMENTARY_SERVICE_TITLE_3",
					"description" => "PAGE_DEPARTMENT_ELEMENTARY_SERVICE_INFO_3",
				],
			],
			"class" => "",
			"style" => "",
		]
	, []);

	$section_id_personnel_elementary = giau_insert_section("personnel elementary", $widget_id_personnel_coverage,
		[
			"tags" => [
				"elementary"
			],
			"class" => "",
			"style" => "",
		]
	, []);

	$section_id_text_elementary_1 = giau_insert_section("text elementary 1", $widget_id_text_display,
		[
			"text" => "PAGE_DEPARTMENT_ELEMENTARY_SECTION_1",
			"class" => "departmentDescriptionItemBold",
			"style" => "",
		]
	, []);
	$section_id_text_elementary_2 = giau_insert_section("text elementary 2", $widget_id_text_display,
		[
			"text" => "PAGE_DEPARTMENT_ELEMENTARY_SECTION_2",
			"class" => "departmentDescriptionItemFeatured",
			"style" => "",
		]
	, []);
	$section_id_text_elementary_3 = giau_insert_section("text elementary 3", $widget_id_text_display,
		[
			"text" => "PAGE_DEPARTMENT_ELEMENTARY_SECTION_3",
			"class" => "departmentDescriptionItemInfo",
			"style" => "",
		]
	, []);
	$section_id_text_elementary_4 = giau_insert_section("text elementary 4", $widget_id_text_display,
		[
			"text" => "PAGE_DEPARTMENT_ELEMENTARY_SECTION_4",
			"class" => "departmentDescriptionItemFeatured",
			"style" => "",
		]
	, []);
	$section_id_text_elementary_5 = giau_insert_section("text elementary 5", $widget_id_text_display,
		[
			"text" => "PAGE_DEPARTMENT_ELEMENTARY_SECTION_5",
			"class" => "departmentDescriptionItemInfo",
			"style" => "",
		]
	, []);
	$section_id_text_elementary_6 = giau_insert_section("text elementary 6", $widget_id_text_display,
		[
			"text" => "PAGE_DEPARTMENT_ELEMENTARY_SECTION_6",
			"class" => "departmentDescriptionItemFeatured",
			"style" => "",
		]
	, []);
	$section_id_text_elementary_7 = giau_insert_section("text elementary 7", $widget_id_text_display,
		[
			"text" => "PAGE_DEPARTMENT_ELEMENTARY_SECTION_7",
			"class" => "departmentDescriptionItemInfo",
			"style" => "",
		]
	, []);

	$section_id_gallery_elementary = giau_insert_section("text elementary 8", $widget_id_image_gallery,
		[
			"autoplay" => "10000",
			"display_navigation" => "false",
			"images" => [
				"/images/galleries/elementary/gallery_01_opt.png",
				"/images/galleries/elementary/gallery_02_opt.png",
				"/images/galleries/elementary/gallery_03_opt.png",
				"/images/galleries/elementary/gallery_04_opt.png",
				"/images/galleries/elementary/gallery_05_opt.png",
			],
			"height" => "500px",
			"page_indicators" => "true",
			"style" => "",
			"class" => ""
		]
	, []);

	

	$section_id_text_elementary_left = giau_insert_section("container left elementary", $widget_id_content_container,
		[
			"class" => "",
			"style" => "display:table-cell; width:40%; vertical-align:top; text-align:center;",
		]
	, [$section_id_personnel_elementary]);
	$section_id_text_elementary_right = giau_insert_section("container right elementary", $widget_id_content_container,
		[
			"class" => "",
			"style" => "display:table-cell; width:60%; vertical-align:top; text-align:center; padding:0px 20px 0px 20px;",
		]
	, [$section_id_text_elementary_1,$section_id_text_elementary_2,$section_id_text_elementary_3,$section_id_text_elementary_4,$section_id_text_elementary_5,$section_id_text_elementary_6,$section_id_text_elementary_7]);

	$section_id_text_elementary_container = giau_insert_section("container elementary", $widget_id_content_container,
		[
			"class" => "limitedWidth",
			"style" => "display:block; padding:20px; margin-top:32px; margin-bottom:40px; ".$themeBackgroundColorA."",
		]
	, [$section_id_text_elementary_left,$section_id_text_elementary_right]);

	$PAGE_TAG_DEPARTMENTS_ELEMENTARY = "elementary";
	// PAGE - ELEMENTARY
	$page_id_elementary = giau_insert_page("page_elementary",
		[
			$section_id_navigation_status_container,
			$section_id_navigation_departments_light_container,
			//
			$section_id_banner_elementary,
			$section_id_gallery_elementary,
			$section_id_services_elementary,
			$section_id_text_elementary_container,
			// TODO -- make specific elementary gallery
			$section_id_text_calendar_heading,
			$section_id_calendar_listing_home,
			$section_id_footer_all
		],
		"".$PAGE_TAG_DEPARTMENTS_ELEMENTARY.""
	);
	error_log("page_id_elementary: ".$page_id_elementary);





	// PAGE DEPARTMENT - JUNIORHIGH
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_JUNIORHIGH_TITLE_TEXT","\"HIS\" JR. HIGH");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_JUNIORHIGH_TITLE_TEXT","중등부");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_JUNIORHIGH_BANNER_TITLE","Live for the Lord for we are His");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_JUNIORHIGH_BANNER_TITLE","우리가 살아도 주를 위하여 살고 죽어도"); // guessed where this separates
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_JUNIORHIGH_BANNER_MESSAGE","If we live, we live to the Lord; and if we die, we die to the Lord. So, whether we live or die, we belong to the Lord.\n- Romans 14:8");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_JUNIORHIGH_BANNER_MESSAGE","주를 위하여 죽나니 그러므로 사나 죽으나 우리가 주의 것이로라.\n- 로마서 14:8");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_JUNIORHIGH_SERVICE_TITLE_1","Sunday\nWorship");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_JUNIORHIGH_SERVICE_TITLE_1","주일예배");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_JUNIORHIGH_SERVICE_INFO_1","11:00 AM\n@ Junior High Worship Room");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_JUNIORHIGH_SERVICE_INFO_1","11:00 AM\n@ 중등부 예배실");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_JUNIORHIGH_SERVICE_TITLE_2","Sunday\nBible Study");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_JUNIORHIGH_SERVICE_TITLE_2","주일 성경공부");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_JUNIORHIGH_SERVICE_INFO_2","12:00 PM\n@ Classroom #150, 152, 153");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_JUNIORHIGH_SERVICE_INFO_2","12:00 PM\n@ 호 교실 #150, 152, 153");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_JUNIORHIGH_SERVICE_TITLE_3","Friday Night\nBible Study");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_JUNIORHIGH_SERVICE_TITLE_3","금요일밤 성경공부");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_JUNIORHIGH_SERVICE_INFO_3","8:00 PM\n@ Junior High Worship Room");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_JUNIORHIGH_SERVICE_INFO_3","8:00 PM\n@ 중등부 예배실");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_JUNIORHIGH_SECTION_1","We belong to God and belonging to God is the greatest blessing and encouragement that anyone can have. Being His is a great blessing but another aspect of being His is to live and die for Him. Our lives belong to Him therefore we should live our lives according to His will.");

	$section_id_banner_juniorhigh = giau_insert_section("banner juniorhigh", $widget_id_banner_medal,
		[
			"title" => "PAGE_DEPARTMENT_JUNIORHIGH_BANNER_TITLE",
			"message" => "PAGE_DEPARTMENT_JUNIORHIGH_BANNER_MESSAGE",
			"icon" => "/images/icons/featured_jrhigh.png",
			"color_base" => "0xBA1E71",
			"color_light" => "0xB91370",
			"color_dark" => "0xB91370",
			"class" => "",
			"style" => "",
		]
	, []);

	$section_id_services_juniorhigh = giau_insert_section("services juniorhigh", $widget_id_service_listing,
		[
			"services" => [
				[
					"title" => "PAGE_DEPARTMENT_JUNIORHIGH_SERVICE_TITLE_1",
					"description" => "PAGE_DEPARTMENT_JUNIORHIGH_SERVICE_INFO_1",
				],
				[
					"title" => "PAGE_DEPARTMENT_JUNIORHIGH_SERVICE_TITLE_2",
					"description" => "PAGE_DEPARTMENT_JUNIORHIGH_SERVICE_INFO_2",
				],
				[
					"title" => "PAGE_DEPARTMENT_JUNIORHIGH_SERVICE_TITLE_3",
					"description" => "PAGE_DEPARTMENT_JUNIORHIGH_SERVICE_INFO_3",
				],
			],
			"class" => "",
			"style" => "",
		]
	, []);

	$section_id_personnel_juniorhigh = giau_insert_section("personnel juniorhigh", $widget_id_personnel_coverage,
		[
			"tags" => [
				"juniorhigh"
			],
			"default_image" => "/images/personnel/anonymous.png",
			"class" => "",
			"style" => "",
		]
	, []);

	$section_id_text_juniorhigh_1 = giau_insert_section("text juniorhigh 1", $widget_id_text_display,
		[
			"text" => "PAGE_DEPARTMENT_JUNIORHIGH_SECTION_1",
			"class" => "departmentDescriptionItemBold",
			"style" => "",
		]
	, []);

	$section_id_gallery_juniorhigh = giau_insert_section("gallery juniorhigh", $widget_id_image_gallery,
		[
			"autoplay" => "10000",
			"display_navigation" => "false",
			"images" => [
				"/images/galleries/juniorhigh/gallery_01_opt.png",
				"/images/galleries/juniorhigh/gallery_02_opt.png",
				"/images/galleries/juniorhigh/gallery_03_opt.png",
				"/images/galleries/juniorhigh/gallery_04_opt.png",
				"/images/galleries/juniorhigh/gallery_05_opt.png",
				"/images/galleries/juniorhigh/gallery_06_opt.png",
				"/images/galleries/juniorhigh/gallery_07_opt.png",
				"/images/galleries/juniorhigh/gallery_08_opt.png",
				"/images/galleries/juniorhigh/gallery_09_opt.png",
				"/images/galleries/juniorhigh/gallery_10_opt.png",
			],
			"height" => "500px",
			"page_indicators" => "true",
			"style" => "",
			"class" => ""
		]
	, []);

	

	$section_id_text_juniorhigh_left = giau_insert_section("container left juniorhigh", $widget_id_content_container,
		[
			"class" => "",
			"style" => "display:table-cell; width:40%; vertical-align:top; text-align:center;",
		]
	, [$section_id_personnel_juniorhigh]);
	$section_id_text_juniorhigh_right = giau_insert_section("container right juniorhigh", $widget_id_content_container,
		[
			"class" => "",
			"style" => "display:table-cell; width:60%; vertical-align:top; text-align:center; padding:0px 20px 0px 20px;",
		]
	, [$section_id_text_juniorhigh_1]);

	$section_id_text_juniorhigh_container = giau_insert_section("container juniorhigh", $widget_id_content_container,
		[
			"class" => "limitedWidth",
			"style" => "display:block; padding:20px; margin-top:32px; margin-bottom:40px; ".$themeBackgroundColorA."",
		]
	, [$section_id_text_juniorhigh_left,$section_id_text_juniorhigh_right]);

	$PAGE_TAG_DEPARTMENTS_JUNIORHIGH = "juniorhigh";
	// PAGE - JUNIORHIGH
	$page_id_juniorhigh = giau_insert_page("page_juniorhigh",
		[
			$section_id_navigation_status_container,
			$section_id_navigation_departments_light_container,
			//
			$section_id_banner_juniorhigh,
			$section_id_gallery_juniorhigh,
			$section_id_services_juniorhigh,
			$section_id_text_juniorhigh_container,
			// TODO -- make specific juniorhigh gallery
			$section_id_text_calendar_heading,
			$section_id_calendar_listing_home,
			$section_id_footer_all
		],
		"".$PAGE_TAG_DEPARTMENTS_JUNIORHIGH.""
	);
	error_log("page_id_juniorhigh: ".$page_id_juniorhigh);






	// PAGE DEPARTMENT - HIGHSCHOOL
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_HIGHSCHOOL_TITLE_TEXT","HIGH SCHOOL");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_HIGHSCHOOL_TITLE_TEXT","고등부");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_HIGHSCHOOL_BANNER_TITLE","");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_HIGHSCHOOL_BANNER_MESSAGE","But seek first his kingdom and his righteousness, and all these things will be given to you as well. Therefore do not worry about tomorrow, for tomorrow will worry about itself.\n- Matthew 6:33-34");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_HIGHSCHOOL_BANNER_MESSAGE","너희는 먼저 그의 나라와 그의 의를 구하라. 그리하면 이 모든 것을 너희에게 더하시리라 34 그러므로 내일 일을 위하여 염려하지 말라 내일 일은 내일 염려할 것이요.\n- 마태복음 6:33-34");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_HIGHSCHOOL_SERVICE_TITLE_1","Sunday\nWorship");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_HIGHSCHOOL_SERVICE_TITLE_1","주일예배");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_HIGHSCHOOL_SERVICE_INFO_1","11:00 AM\n@ High School Worship Room");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_HIGHSCHOOL_SERVICE_INFO_1","11:00 AM\n@ 고등부 예배실");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_HIGHSCHOOL_SERVICE_TITLE_2","Sunday\nBible Study");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_HIGHSCHOOL_SERVICE_TITLE_2","주일 성경공부");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_HIGHSCHOOL_SERVICE_INFO_2","12:00 PM\n@ Classroom #135, 136, 137, 148");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_HIGHSCHOOL_SERVICE_INFO_2","12:00 PM\n@ 호 교실 #135, 136, 137, 148");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_HIGHSCHOOL_SERVICE_TITLE_3","Friday Night\nBible Study");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_HIGHSCHOOL_SERVICE_TITLE_3","금요일밤 성경공부");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_HIGHSCHOOL_SERVICE_INFO_3","8:00 PM\n@ High School Worship Room");
		giau_insert_languagization($langKor,"PAGE_DEPARTMENT_HIGHSCHOOL_SERVICE_INFO_3","8:00 PM\n@ 고등부 예배실");
	giau_insert_languagization($langEng,"PAGE_DEPARTMENT_HIGHSCHOOL_SECTION_1","Our mission is to help take the next step in their spiritual lives and grown in maturity in their relationship with Jesus. The high school years are a challenging time when students have so many other activities competing for their time and energy, and we emphasize prioritizing their personal relationship with Jesus amidst all of the busyness in their lives. Students are encouraged to go beyond a simple emotional relationship with God and have a relationship marked by spiritual discipline and obedience.");

	$section_id_banner_highschool = giau_insert_section("banner highschool", $widget_id_banner_medal,
		[
			"title" => "PAGE_DEPARTMENT_HIGHSCHOOL_BANNER_TITLE",
			"message" => "PAGE_DEPARTMENT_HIGHSCHOOL_BANNER_MESSAGE",
			"icon" => "/images/icons/featured_highschool.png",
			"color_base" => "0x3B1955",
			"color_light" => "0x361650",
			"color_dark" => "0x361650",
			"class" => "",
			"style" => "",
		]
	, []);

	$section_id_services_highschool = giau_insert_section("services highschool", $widget_id_service_listing,
		[
			"services" => [
				[
					"title" => "PAGE_DEPARTMENT_HIGHSCHOOL_SERVICE_TITLE_1",
					"description" => "PAGE_DEPARTMENT_HIGHSCHOOL_SERVICE_INFO_1",
				],
				[
					"title" => "PAGE_DEPARTMENT_HIGHSCHOOL_SERVICE_TITLE_2",
					"description" => "PAGE_DEPARTMENT_HIGHSCHOOL_SERVICE_INFO_2",
				],
				[
					"title" => "PAGE_DEPARTMENT_HIGHSCHOOL_SERVICE_TITLE_3",
					"description" => "PAGE_DEPARTMENT_HIGHSCHOOL_SERVICE_INFO_3",
				],
			],
			"class" => "",
			"style" => "",
		]
	, []);

	$section_id_personnel_highschool = giau_insert_section("personnel highschool", $widget_id_personnel_coverage,
		[
			"tags" => [
				"highschool"
			],
			"class" => "",
			"style" => "",
		]
	, []);

	$section_id_text_highschool_1 = giau_insert_section("text display highschool 1", $widget_id_text_display,
		[
			"text" => "PAGE_DEPARTMENT_HIGHSCHOOL_SECTION_1",
			"class" => "departmentDescriptionItemBold",
			"style" => "",
		]
	, []);

	$section_id_gallery_highschool = giau_insert_section("gallery highschool", $widget_id_image_gallery,
		[
			"autoplay" => "10000",
			"display_navigation" => "false",
			"images" => [
				"/images/galleries/highschool/gallery_01_opt.png",
				"/images/galleries/highschool/gallery_02_opt.png",
			],
			"height" => "500px",
			"page_indicators" => "true",
			"style" => "",
			"class" => ""
		]
	, []);

	

	$section_id_text_highschool_left = giau_insert_section("container left highschool", $widget_id_content_container,
		[
			"class" => "",
			"style" => "display:table-cell; width:40%; vertical-align:top; text-align:center;",
		]
	, [$section_id_personnel_highschool]);
	$section_id_text_highschool_right = giau_insert_section("container right highschool", $widget_id_content_container,
		[
			"class" => "",
			"style" => "display:table-cell; width:60%; vertical-align:top; text-align:center; padding:0px 20px 0px 20px;",
		]
	, [$section_id_text_highschool_1,$section_id_text_highschool_2]);

	$section_id_text_highschool_container = giau_insert_section("container highschool", $widget_id_content_container,
		[
			"class" => "limitedWidth",
			"style" => "display:block; padding:20px; margin-top:32px; margin-bottom:40px; ".$themeBackgroundColorA."",
		]
	, [$section_id_text_highschool_left,$section_id_text_highschool_right]);

	$PAGE_TAG_DEPARTMENTS_HIGHSCHOOL = "highschool";
	// PAGE - HIGHSCHOOL
	$page_id_highschool = giau_insert_page("page_highschool",
		[
			$section_id_navigation_status_container,
			$section_id_navigation_departments_light_container,
			//
			$section_id_banner_highschool,
			$section_id_gallery_highschool,
			$section_id_services_highschool,
			$section_id_text_highschool_container,
			// TODO -- make specific highschool gallery
			$section_id_text_calendar_heading,
			$section_id_calendar_listing_home,
			$section_id_footer_all
		],
		"".$PAGE_TAG_DEPARTMENTS_HIGHSCHOOL.""
	);
	error_log("page_id_highschool: ".$page_id_highschool);





	// PAGE STAFF
	giau_insert_languagization($langEng,"PAGE_STAFF_TITLE_TEXT","MEET THE STAFF");
		giau_insert_languagization($langKor,"PAGE_STAFF_TITLE_TEXT","직원들 만나기");

	giau_insert_languagization($langEng,"PAGE_BIO_DEFAULT_TEXT","Bio forthcoming.");
		giau_insert_languagization($langKor,"PAGE_BIO_DEFAULT_TEXT","섬기는 사람들 소개 ");
	$section_id_bio_listing_bio = giau_insert_section("bio listing", $widget_id_bio_listing,
		[
			"tags" => ["bio"],
			"default_display" => "PAGE_BIO_DEFAULT_TEXT",
			"default_image" => "/images/personnel/anonymous.png",
			"class" => "limitedWidth",
			"style" => "",
		]
	, []);

	$PAGE_TAG_STAFF = "staff";
	// PAGE - STAFF
	$page_id_staff = giau_insert_page("page_staff",
		[
			// NAV
			$section_id_navigation_status_container,
			$section_id_navigation_departments_light_container,
			$section_id_bio_listing_bio,
			$section_id_footer_all
		],
		"".$PAGE_TAG_STAFF.""
	);
	error_log("page_id_staff: ".$page_id_staff);



	// PAGE FORMS
	giau_insert_languagization($langEng,"PAGE_FORMS_TITLE_TEXT","FORMS");
	giau_insert_languagization($langEng,"PAGE_FORMS_DOWNLOAD_TEXT","Download forms and documentation here:");
		giau_insert_languagization($langKor,"PAGE_FORMS_DOWNLOAD_TEXT","자료 및 문서 다운로드는 여기서 하 실수 있습니다:");
	giau_insert_languagization($langEng,"PAGE_FORMS_ITEM_MEDICAL_RELEASE_2016_2017_TEXT","LACPC Medical Release Form 2016-2017 (pdf)");
		giau_insert_languagization($langKor,"PAGE_FORMS_ITEM_MEDICAL_RELEASE_2016_2017_TEXT","의료 출시 자료 2016-2017 (pdf)");
	giau_insert_languagization($langEng,"PAGE_FORMS_ITEM_PHOTOGRAPH_RELEASE_TEXT","LACPC Photograph Release Form (pdf)");
		giau_insert_languagization($langKor,"PAGE_FORMS_ITEM_PHOTOGRAPH_RELEASE_TEXT","사진 공개 자료 (pdf)");
	$section_id_form_title = giau_insert_section("form title", $widget_id_text_display,
		[
			"text" => "PAGE_FORMS_DOWNLOAD_TEXT",
			"class" => "titleSectionMain",
			"style" => "background-color:#F6F7F9;", //  padding-top:20px;
		]
	, []);
	$section_id_form_listing_downloads = giau_insert_section("form listing downloads", $widget_id_download_listing,
		[
			"files" => [
				[
					"title" => "PAGE_FORMS_ITEM_MEDICAL_RELEASE_2016_2017_TEXT",
					"uri" => "/downloads/forms/lacpc_medical_release_form_2016_2017.pdf"
				],
				[
					"title" => "PAGE_FORMS_ITEM_PHOTOGRAPH_RELEASE_TEXT",
					"uri" => "/downloads/forms/photograph_release_form.pdf"
				]
			],
			"class" => "formDownloadSectionContainer",
			"style" => ""
		]
	, []);
	error_log("section_id_bio_listing_bio: ".$section_id_bio_listing_bio);

	$PAGE_TAG_FORMS = "forms";
	// PAGE - FORMS
	$page_id_forms = giau_insert_page("page_forms",
		[
			$section_id_navigation_status_container,
			$section_id_navigation_departments_light_container,
			$section_id_form_title,
			$section_id_form_listing_downloads,
			$section_id_footer_all
		],
		"".$PAGE_TAG_FORMS.""
	);
	error_log("page_id_forms: ".$page_id_forms);




	// PAGE CONTACT
	giau_insert_languagization($langEng,"PAGE_CONTACT_TITLE_TEXT","CONTACT");
		giau_insert_languagization($langKor,"PAGE_CONTACT_TITLE_TEXT","교제");
	giau_insert_languagization($langEng,"PAGE_CONTACT_ADDRESS_LINE_1_TEXT","Contact Info");
	giau_insert_languagization($langEng,"PAGE_CONTACT_ADDRESS_LINE_2_TEXT","2241 N. Eastern Ave.");
	giau_insert_languagization($langEng,"PAGE_CONTACT_ADDRESS_LINE_3_TEXT","Los Angeles, CA 90032");
	giau_insert_languagization($langEng,"PAGE_CONTACT_FORM_HINT_NAME","Name*");
		giau_insert_languagization($langKor,"PAGE_CONTACT_FORM_HINT_NAME","이름*");
	giau_insert_languagization($langEng,"PAGE_CONTACT_FORM_HINT_EMAIL","Email*");
		giau_insert_languagization($langKor,"PAGE_CONTACT_FORM_HINT_EMAIL","이메일*");
	giau_insert_languagization($langEng,"PAGE_CONTACT_FORM_HINT_PHONE","Phone Number (optional)");
		giau_insert_languagization($langKor,"PAGE_CONTACT_FORM_HINT_PHONE","전화번호 (필요하지)");
	giau_insert_languagization($langEng,"PAGE_CONTACT_FORM_HINT_MESSAGE","Message*");
		giau_insert_languagization($langKor,"PAGE_CONTACT_FORM_HINT_MESSAGE","문자*");
	giau_insert_languagization($langEng,"PAGE_CONTACT_FORM_SUBMIT","SUBMIT");
		giau_insert_languagization($langKor,"PAGE_CONTACT_FORM_SUBMIT","보내");
	giau_insert_languagization($langEng,"PAGE_CONTACT_FORM_SUBMIT_MESSAGE","Form submitted successfully.");
		giau_insert_languagization($langKor,"PAGE_CONTACT_FORM_SUBMIT_MESSAGE","Form submitted successfully.");

	$section_id_contact_address_1 = giau_insert_section("contact address line 1", $widget_id_text_display,
		[
			"text" => "PAGE_CONTACT_ADDRESS_LINE_1_TEXT",
			"class" => "customContactTitle",
			"style" => "",
		]
	, []);
	$section_id_contact_address_2 = giau_insert_section("contact address line 2", $widget_id_text_display,
		[
			"text" => "PAGE_CONTACT_ADDRESS_LINE_2_TEXT",
			"class" => "customContactAddress",
			"style" => "",
		]
	, []);
	$section_id_contact_address_3 = giau_insert_section("contact address line 3", $widget_id_text_display,
		[
			"text" => "PAGE_CONTACT_ADDRESS_LINE_3_TEXT",
			"class" => "customContactAddress",
			"style" => "",
		]
	, []);

	$section_id_contact_map = giau_insert_section("contact map", $widget_id_map_google,
		[
			"source" => "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3304.9435064350605!2d-118.18318181958668!3d34.07096242428407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c5b8f66d4e9d%3A0xa798b42cbfdca248!2sLos+Angeles+Christian+Presbyterian!5e0!3m2!1sen!2sus!4v1475290571183",
		]
	, []);


	giau_insert_languagization($langEng,"PAGE_CONTACT_BIO_TITLE_CE","CE");
		giau_insert_languagization($langKor,"PAGE_CONTACT_BIO_TITLE_CE","CE");
	giau_insert_languagization($langEng,"PAGE_CONTACT_BIO_TITLE_ELEMENTARY","Elementary");
		giau_insert_languagization($langKor,"PAGE_CONTACT_BIO_TITLE_ELEMENTARY","초등부");
	giau_insert_languagization($langEng,"PAGE_CONTACT_BIO_TITLE_NURSERY","Nursery");
		giau_insert_languagization($langKor,"PAGE_CONTACT_BIO_TITLE_NURSERY","유아실");
	giau_insert_languagization($langEng,"PAGE_CONTACT_BIO_TITLE_HIGHSCHOOL","High School");
		giau_insert_languagization($langKor,"PAGE_CONTACT_BIO_TITLE_HIGHSCHOOL","고등부");
	giau_insert_languagization($langEng,"PAGE_CONTACT_BIO_TITLE_KINDERGARTEN","Kindergarten");
		giau_insert_languagization($langKor,"PAGE_CONTACT_BIO_TITLE_KINDERGARTEN","유치부");
	giau_insert_languagization($langEng,"PAGE_CONTACT_BIO_TITLE_KOREANSCHOOL","Korean School");
		giau_insert_languagization($langKor,"PAGE_CONTACT_BIO_TITLE_KOREANSCHOOL","한국어 학교");
	// jr high
	// 중등부


	$section_id_contact_bio = giau_insert_section("contact bio listing", $widget_id_contact_bio,
		[
			"tags" => [
				"contact"
			],
			"ordering" => [
				[
					"index" => 0,
					"title" => "PAGE_CONTACT_BIO_TITLE_CE",
				],
				[
					"index" => 3,
					"title" => "PAGE_CONTACT_BIO_TITLE_ELEMENTARY",
				],
				[
					"index" => 5,
					"title" => "PAGE_CONTACT_BIO_TITLE_NURSERY",
				],
				[
					"index" => 2,
					"title" => "PAGE_CONTACT_BIO_TITLE_HIGHSCHOOL",
				],
				[
					"index" => 4,
					"title" => "PAGE_CONTACT_BIO_TITLE_KINDERGARTEN",
				],
				[
					"index" => 1,
					"title" => "PAGE_CONTACT_BIO_TITLE_KOREANSCHOOL",
				],
			],
			"class" => "customContactInfo",
			"style" => "",
		]
	, []);

	$section_id_contact_left_container = giau_insert_section("contact container left", $widget_id_content_container,
		[
			"class" => "customContactInfo",
			"style" => "width:50%;",
		]
	, [$section_id_contact_address_1,$section_id_contact_address_2,$section_id_contact_address_3,$section_id_contact_bio]);

	$section_id_contact_form = giau_insert_section("contact form", $widget_id_contact_form,
		[
			"inputs" => [
				"email" => [
					"order" => "1",
					"title" => "",
					"include" => "true",
					"hint" => "PAGE_CONTACT_FORM_HINT_EMAIL",
					"required" => "false",
				],
				"name" => [
					"order" => "0",
					"title" => "",
					"include" => "true",
					"hint" => "PAGE_CONTACT_FORM_HINT_NAME",
					"required" => "true",
				],
				"message" => [
					"order" => "3",
					"title" => "",
					"include" => "true",
					"hint" => "PAGE_CONTACT_FORM_HINT_MESSAGE",
					"required" => "true",
				],
				"phone" => [
					"order" => "2",
					"title" => "",
					"include" => "true",
					"hint" => "PAGE_CONTACT_FORM_HINT_PHONE",
					"required" => "false",
				],
				"submit" => [
					"order" => "4",
					"title" => "",
					"message" => "PAGE_CONTACT_FORM_SUBMIT"
				]
			],
			"submit_message" => "PAGE_CONTACT_FORM_SUBMIT_MESSAGE",
			"class" => "",
			"style" => "",
		]
	, []);

	$section_id_contact_bio_container = giau_insert_section("container bio contact inner", $widget_id_content_container,
		[
			"class" => "customContactContainer",
			"style" => "width:100%;",
		]
	, [$section_id_contact_left_container,$section_id_contact_form]);


	$section_id_contact_bio_container_outer = giau_insert_section("container bio contact outer", $widget_id_content_container,
		[
			"class" => "limitedWidth",
			"style" => "display:block; padding:10px;",
		]
	, [$section_id_contact_bio_container]);

	$section_id_contact_everything_container = giau_insert_section("container bio contact all", $widget_id_content_container,
		[
			"class" => "everythingContact",
			"style" => "display:block; width:100%; padding-top:32px; padding-bottom:64px; ".$themeBackgroundColorA.""
		]
	, [$section_id_contact_map, $section_id_contact_bio_container_outer]);

	$PAGE_TAG_CONTACT = "contact";
	// PAGE - CONTACT
	$page_id_contact = giau_insert_page("page_contact",
		[
			$section_id_navigation_status_container,
			$section_id_navigation_departments_light_container,
			$section_id_contact_everything_container,
			$section_id_footer_all
		],
		"".$PAGE_TAG_CONTACT.""
	);
	error_log("page_id_contact: ".$page_id_contact);


	// WEBSITE DETAILS
	$website_id = giau_insert_website("0");
	error_log("website_id: ".$website_id);
}


?>
