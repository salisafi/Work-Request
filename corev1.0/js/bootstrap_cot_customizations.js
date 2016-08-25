function querystring(key) {
   var re=new RegExp('(?:\\?|&)'+key+'=(.*?)(?=&|$)','gi');
   var r=[], m;
   while ((m=re.exec(document.location.search)) != null) r.push(m[1]);
   return r;
}

function increaseFontSize() {
	var fs="1.6em";
	var val=getCookie('fontsize');
	if(val) {
		if (val=="2.2em") {fs="2.4em";}
		if (val=="2em") {fs="2.2em";}
		if (val=="1.8em") {fs="2em";}
		if (val=="1.6em") {fs="1.8em";}
		if (val=="1.4em") {fs="1.6em";}
		if (val=="1.2em") {fs="1.4em";}
		if (val=="1em") {fs="1.2em";}
	}
	$("body").css("font-size", fs);
	if (fs=="2.4em") {$("#increaseFontSize")[0].disabled = true;}
	$("#decreaseFontSize")[0].disabled = false;
	setCookie('fontsize', fs);

	if ( $.isFunction(window["setPageTabHeight"]) ) {setPageTabHeight();}
	setConsistentHeight(".tabNavigation", ".nav-tabs a");
	setConsistentHeight(".carousel", ".item");
	if (typeof($gallery)!="undefined") {$gallery.flickity('resize');setConsistentHeightHP(".r5", ".linkBoxInside");}
}

function decreaseFontSize() {
	var fs="1.2em";
	var val=getCookie('fontsize');
	if(val) {
		if (val=="1.2em") {fs="1em";}
		if (val=="1.4em") {fs="1.2em";}
		if (val=="1.6em") {fs="1.4em";}
		if (val=="1.8em") {fs="1.6em";}
		if (val=="2em") {fs="1.8em";}
		if (val=="2.2em") {fs="2em";}
		if (val=="2.4em") {fs="2.2em";}
	}
	$("body").css("font-size", fs);
	if (fs=="1em") {$("#decreaseFontSize")[0].disabled = true;}
	$("#increaseFontSize")[0].disabled = false;
	setCookie('fontsize', fs);
	if ( $.isFunction(window["setPageTabHeight"]) ) {setPageTabHeight();}
	setConsistentHeight(".tabNavigation", ".nav-tabs a");
	setConsistentHeight(".carousel", ".item");
	if (typeof($gallery)!="undefined") {$gallery.flickity('resize');setConsistentHeightHP(".r5", ".linkBoxInside");}
}

function resetFontSize() {
	$("body").css("font-size", "");
	deleteCookie('fontsize');
	$("#increaseFontSize")[0].disabled = false;
	$("#decreaseFontSize")[0].disabled = false;
	if ( $.isFunction(window["setPageTabHeight"]) ) {setPageTabHeight();}
	setConsistentHeight(".tabNavigation", ".nav-tabs a");
	setConsistentHeight(".carousel", ".item");
	if (typeof($gallery)!="undefined") {$gallery.flickity('resize');setConsistentHeightHP(".r5", ".linkBoxInside");}
}

function setCookie(key, value) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000))
        document.cookie = key + '=' + value + ';path=/;expires=' + expires.toUTCString();
}

function getCookie(key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
}

function deleteCookie(key) {
	$.removeCookie(key, { path: '/' });
};

function gglTranslate(key) {
	var oURL;
	if (document.referrer!="") {oURL=encodeURIComponent(document.referrer);} else {oURL="http%3a%2f%2fwww1.toronto.ca%2f";}
	document.location.href="http://translate.google.com/translate?u=" + oURL + "&sl=en&tl=" + key + "&hl=en&ie=UTF-8";
}

function setConsistentHeight(strParentSelector, strChildSelector) {
	var itemsParent = $(strParentSelector);
	var heights = [];
	var tallest;

	itemsParent.each (
		function () {
			var items = $(this).find(strChildSelector);
			if (items.length) {
				items.each( function () {$(this).css('height','auto'); });
				items.each( function () { heights.push($(this).height()); });
			        tallest = Math.max.apply(null, heights) + 10;
			        items.each( function () {$(this).css('height',tallest + 'px'); });
			}
		})
}

function dismissLD() {
	document.cookie = "lddismiss=true; path=/";
}

function processLDResponse(data) {
		if (data.items.title=="Notice") {
			var sModal = '<div class="modal fade" tabindex="-1" role="dialog" id="ldModal" style="z-index: 9999999;"><div class="modal-dialog"><div class="modal-content">';
			sModal += '<div class="modal-header">';
			sModal += '<h4 class="modal-title">' + data.items.title + '</h4></div><div class="modal-body"><p>' + data.items.summary + '</p></div>'
			sModal += '<div class="modal-footer" style="text-align: center;"><button onclick="dismissLD();" type="button" class="btn btn-primary" data-dismiss="modal">Continue</button>';
			sModal += '</div></div></div></div>';
			$( "body" ).append( sModal );	
			$( ".modal a").css('text-decoration', 'underline');
			$('#ldModal').modal({backdrop: false});
		}
}

$(function() {
	if(getCookie('fontsize')) {
		$("body").css("font-size", getCookie('fontsize'));
		if (getCookie('fontsize')=="2.4em") {$("#increaseFontSize")[0].disabled = true;}
		if (getCookie('fontsize')=="1em") {$("#decreaseFontSize")[0].disabled = true;}
	}

	if (querystring("tab")!="") {
		if ($(".tabNavigation").length>0) {
			$(".tabNavigation ul.nav li.active").removeClass("active");
			$(".tabNavigation .tab-content .tab-pane.active").removeClass("active");
			var strSelector = ".tabNavigation ul.nav li:eq(" + parseInt(querystring("tab")) +")";
			$(strSelector).addClass("active");
			strSelector = ".tabNavigation .tab-content .tab-pane:eq(" + parseInt(querystring("tab")) +")";
			$(strSelector).addClass("active");
		}
	}
	
/*
	if(getCookie('lddismiss')!="true" && $("#breadcrumb-bar").html().indexOf("Labour Disruption") < 0) {
	
		var strURL = '/wps/portal/ServletContent?r=cot-templating/JSONFeed?guid=9c11d1ca365f2510VgnVCM10000071d60f89RCRD';
	
		$.ajax({
			type: 'GET',
			url: strURL,
			crossDomain: true,
			dataType: 'jsonp',
			success: function (data) {
				processLDResponse(data);
			}
		});	
	}
*/
});