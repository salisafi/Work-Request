var cot_app = function(sName) {
	this.name=sName;
	this.hasHeader=this.hasFooter=this.hasContentTop=this.hasContentBottom=this.hasContentRight=this.hasContentLeft=true;
	this.hasLeftNav=this.includeFormValidation=this.includePlaceholders=this.includeMultiSelect=this.includeOMS=this.includeFullCalendar=this.includeDatePicker=this.includeEditableSelect=false;
	this.data=this.forms={};
};
cot_app.prototype.setBreadcrumb = function(arrBC) {this.breadcrumb=arrBC;}

cot_app.prototype.loadContent = function(o) {
	var app = this;
	$.ajax({ 
		url: o.url,  
		type: (o.type||"")?o.type:"GET", 
		cache: (o.cache||"")?o.cache:"true", 
		dataType: (o.dataType||"")?o.dataType:"jsonp", 
		success: function(data) { 
			data = (o.skiproot||"") ? (o.skiproot) ? data = data[0] : data : data;
			$.each(data.items, function(i, item) {
				app.data[item.title] = item.summary;
			});
			if (o.success||"") {o.success(data);} else {return app;}
		},
		error: function(jqXHR,textStatus,errorThrown ) {
			if (o.error||"") {o.error();} else {alert("Error: The application was unable to load data.")};
		}		
	});	
}

cot_app.prototype.getTeaserModal = function(o) {
	var sReturn="";
	if ((o.title||"") && (o.body||"")) {
		sReturn += '<p><button ';
		sReturn += (o.btnclass||"") ? 'class="' + o.btnclass + '" ' :"";
		sReturn += 'onclick="$(\'#teaserModal\').modal()">' + o.title + '</button></p>';
		sReturn += '<div class="modal fade" id="teaserModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
			sReturn += '<div class="modal-dialog">';
				sReturn += '<div class="modal-content">';
					sReturn += '<div class="modal-header"><button class="close" type="button" data-dismiss="modal"> <span aria-hidden="true">&times;</span> <span class="sr-only">Close</span></button>';
						sReturn += '<h2 id="serviceModalLabel" class="modal-title">' + o.title + '</h2>';
				sReturn += '</div>';
				sReturn += '<div id="serviceModalBody" class="modal-body">' + o.body + '</div>';
					sReturn += '<div class="modal-footer">';
						sReturn += '<button class="btn btn-default" type="button" data-dismiss="modal">Close</button>';
				sReturn += '</div></div></div></div>';
	} else {
		sReturn += "<p class='hasError'>Error!</p>";
	}
	return sReturn;
}

cot_app.prototype.getTeaserStandard = function(o) {
	var sReturn="";
	if (o.modal||"") {
		sReturn += (o.modal && (o.title||"") && (o.body||"")) ? this.getModalHTML(o.title,o.body) : "";
	} else {
		sReturn += (o.title||"") ? "<div class='componentTitle'><h2>" + o.title + "</h2></div>" : "";
		sReturn += (o.body||"") ? "<div class='article media componentBody'>" + o.body + "</div>" : "";
	}
	return sReturn;
}
cot_app.prototype.render = function(fCallback) {
	var ac=document.createElement('div');
	ac.id="appCode";
	var ad=document.createElement('div');
	ad.id="appDisplay";
	$("#appDisplay,#appCode").addClass("hide");
	$("body").append(ac,ad);
	$("#appCode").append('<link rel="stylesheet" href="../corev1.0/css/cot_app.css">');
	$("#appCode").append('<script type="text/javascript" src="../corev1.0/js/jquery.cookie.js"></script>');
	if (this.includeFormValidation) {
		$("#appCode").append('<script type="text/javascript" src="../corev1.0/js/bootstrapValidator.min.js"></script><link rel="stylesheet" href="../corev1.0/css/bootstrapValidator.min.css">');
		$("#appCode").append('<link rel="stylesheet" href="../corev1.0/css/intlTelInput.css"><script type="text/javascript" src="../corev1.0/js/intlTelInput.min.js">');
		$("#appCode").append('<script type="text/javascript" src="../corev1.0/js/cot_forms.js">');
	}
	if (this.includeEditableSelect) {$("#appCode").append('<link rel="stylesheet" href="../corev1.0/css/jquery-editable-select.css"><script type="text/javascript" src="../corev1.0/js/jquery-editable-select.js"></script>');}
	if (this.includePlaceholders) {$("#appCode").append('<script type="text/javascript" src="../corev1.0/js/placeholders.min.js"></script>');}
	if (this.includeMultiSelect) {$("#appCode").append('<link rel="stylesheet" href="../corev1.0/css/bootstrap-multiselect.css"><script type="text/javascript" src="../corev1.0/js/bootstrap-multiselect.js"></script>');}
	if (this.includeOMS) {$("#appCode").append('<script type="text/javascript" src="../corev1.0/js/oms.min.js"></script>');}
	if (this.includeFullCalendar) {$("#appCode").append('<link rel="stylesheet" media="print" href="../corev1.0/css/fullcalendar.print.css"><script type="text/javascript" src="../corev1.0/js/fullcalendar.min.js"></script><script type="text/javascript" src="../corev1.0/js/moment.min.js"></script>');}
	if (this.includeDatePicker) {$("#appCode").append('<link rel="stylesheet" href="../corev1.0/css/bootstrap-datetimepicker.css"><script type="text/javascript" src="../corev1.0/js/moment.min.js"></script><script type="text/javascript" src="../corev1.0/js/bootstrap-datetimepicker.js"></script>');}
	
	

	var app=this;
	$("#appDisplay").load("../corev1.0/html/cot_template_page.html #cot-template-page", function(responseText, textStatus, req) {
		$("#app-header section h1").html(app.name);
		if (app.breadcrumb.length==0) {
			$("#app-breadcrumb").remove();
		} else {
			$.each(app.breadcrumb, function(i,bcitem) {
				$("#app-breadcrumb ol").append('<li><a href="' + bcitem.link + '">' + bcitem.name + '</a></li>');
			});
			$("#app-breadcrumb ol").append('<li>' + app.name + '</li>');
		}
		
		if (app.hasLeftNav) {$("#app_nav_left").removeClass("hide");$("#app-content_full").addClass("col-sm-9");} else {$("#app_nav_left").remove();}
		if(!app.hasHeader) {$("#cot_header").remove();$("#app-header").remove();}
		if(!app.hasFooter) {$("#app-footer").remove();}
		if(!app.hasContentTop) {$("#app-content-top").remove();}
		if(!app.hasContentRight) {$("#app-content-right").remove();}
		if(!app.hasContentLeft) {$("#app-content-left").remove();}
		if(!app.hasContentBottom) {$("#app-content-bottom").remove();}
		$("#appDisplay").removeClass("hide");
		fCallback();
	});
}

//TERMS AND CONDITIONS
cot_app.prototype.showTerms = function(htmlTerms,htmlDisagree,sCookie,eTarget,fSuccess) {
	var app = this;
	if (getCookie(sCookie) != "agree") {
		$(eTarget).load("../corev1.0/html/cot_template_terms.html #cot-template-terms", function(responseText, textStatus, req) {
			$("#cot-terms-title h2").html("Terms of Use Agreement");
			$("#cot-terms-body").html(htmlTerms);
			$("#cot-terms-agree").click(function() {
				//dcsMultiTrack('WT.dl','31','WT.ti','','WT.conv','0','WT.conv_type','Terms and Conditions Agree');
				setCookie(sCookie,"agree");
				fSuccess();
			});
			$("#cot-terms-disagree").click(function() {
				//dcsMultiTrack('WT.dl','31','WT.ti','','WT.conv','0','WT.conv_type','Terms and Conditions Disagree');
				$(eTarget).load("../corev1.0/html/cot_template_terms.html #cot-template-terms-disagree", function(responseText, textStatus, req) {
					$("#cot-terms-return").click(function() {app.showTerms(htmlTerms,htmlDisagree,sCookie,eTarget,fSuccess)});
					$("#cot-terms-body").html(htmlDisagree);
					$("#cot-terms").removeClass("hide");
				});
			});
			$("#cot-terms").removeClass("hide");
		});
	} else {
		fSuccess();
	}
}

//UTILTIES
function formatDate(strDate) {
	var arrMM = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var yyyy = strDate.substring(0,4);
	var mm = strDate.substring(5,7);
	var dd = parseInt(strDate.substring(8,10));
	var strNew = arrMM[parseInt(mm) - 1] + " " + dd + ", " + yyyy;
	return strNew;
}





