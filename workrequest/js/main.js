var currentType;
var seasonType;
var currentDate = new Date();
var FWdate1 = new Date("January 1, 2016");
var FWdate2 = new Date("June 30, 2016");
var SSdate1 = new Date("July 1, 2016");
var SSdate2 = new Date("December 31, 2016");
var dateStatus;
var late;
var IDswitch = 0;
var manualStatus = "";
var vars, name, mom, lizard, personName, empID;
//this function is for multiselect feature for "days" field

var QueryString = function () {
	// This function is anonymous, is executed immediately and 
	// the return value is assigned to QueryString!
	var query_string = {};
	var query = window.location.search.substring(1);
	//alert("query is " + query);
	vars = query.split("&");
	//alert("query after split by = is " + vars);
	
	username = vars[0].substr(6);
	if (username == "jsmith") {
	personName = "John Smith";
	empID = "123123123";
	IDswitch = 1;
	} else if (username == "bjones") {
	personName = "Bob Jones";
	empID = "999999999";
	IDswitch = 2;
	} else {
	personName = username;
	empID = "000000000";}

	return query_string;
}();
	
var app = new cot_app("PF&R Request To Work");
$(document).ready(function() {
	renderCFrame();
});

function renderCFrame() {
	app.setBreadcrumb([]);
	app.includeFormValidation=app.includeMultiSelect=app.includeDatePicker=true;
	app.render(showApp);
}
function showApp() {
	$("#app-content-top").load('html/requesttowork.html #rtw', function() {
		$('#daysR').multiselect();
		$('[data-toggle="tooltip"]').tooltip();
		if (currentDate > SSdate2) {dateStatus = "Late".fontcolor("red")}
		else {dateStatus = "On time".fontcolor("green")}
		document.getElementById("SSdateDeadline").innerHTML = "The Spring/Summer request period is from " + SSdate1.toDateString() + " to " + SSdate2.toDateString();
		document.getElementById("SSdateDeadline2").innerHTML = "<b>Current Date: </b>" + currentDate.toDateString() + " <b>Status: <b>" + dateStatus;
		
		if (currentDate > FWdate2) {dateStatus = "Late".fontcolor("red")}
		else {dateStatus = "On time".fontcolor("green")}
		document.getElementById("FWdateDeadline").innerHTML = "The Fall/Winter request period is from " + FWdate1.toDateString() + " to " + FWdate2.toDateString();
		document.getElementById("FWdateDeadline2").innerHTML = "<b>Current Date: </b>" + currentDate.toDateString() + " <b>Status: <b>" + dateStatus;
		document.getElementById("nameDiv").innerHTML = "<b>Name: </b>" + personName;
		document.getElementById("empDiv").innerHTML = "<b>Employee ID: </b>" + empID;
			
		$('.panel-collapse').on('hide.bs.collapse', function () {
			$("a[aria-controls='" + this.id + "'] i").removeClass("glyphicon-minus");
			$("a[aria-controls='" + this.id + "'] i").addClass("glyphicon-plus");
		});
		$('.panel-collapse').on('show.bs.collapse', function () {
			$("a[aria-controls='" + this.id + "'] i").removeClass("glyphicon-plus");
			$("a[aria-controls='" + this.id + "'] i").addClass("glyphicon-minus");
		});
		
		$(".timepick").datetimepicker({format: 'LT'});
		$(".datepick").datetimepicker({format: "DD/MM/YYYY"});
		
	});
}

function manualCheck() {
	if (IDswitch == 0) {manualStatus = "<br><b>***Manual Request***</b>".fontcolor("orange")}
	else {manualStatus = ""}
}
function SSswitch() {
	if (currentDate > SSdate2) {late = "<br><b>***Late***</b>".fontcolor("red")}
	else {late = ""}
}
function FWswitch() {
	if (currentDate > FWdate2) {late = "<br><b>***Late***</b>".fontcolor("red")}
	else {late = ""}
}
function openAll() {
  $('.panel-collapse')
    .collapse('show');
}
function closeAll() {
  $('.panel-collapse')
    .collapse('hide');
}
function submit() {
alert("Requests submitted");
}
function modalReset() {
	$("#etobicokeYork").show();
	$("#northYork").show();
	$("#scarborough").show();
	$("#torontoEastYork").show();
	$(".eYork").show();
	$(".nYork").show();
	$(".scar").show();
	$(".tYork").show();
	$("#job option").show();
	$("#jobR option").show();
	$("#manualNewForm").show();
	$("#manualNotify").html("");

}
function SSOpt() {	//spring/summer options, hides fall/winter options from select box
$("#season").val("blank");	//makes season select box go to blank option every time
$("#springOpt").show();
$("#summerOpt").show();
$("#springSummerOpt").show();
$("#fallOpt").hide();
$("#winterOpt").hide();
$("#fallWinterOpt").hide();
}
function FWOpt() {
$("#season").val("blank");
$("#springOpt").hide();
$("#summerOpt").hide();
$("#springSummerOpt").hide();
$("#fallOpt").show();
$("#winterOpt").show();
$("#fallWinterOpt").show();
}
function districtChange(){
	var dist = document.getElementById("district").options;
	var currDist = dist[dist.selectedIndex].id;
		switch (currDist) {
			case "etobicokeYork":
				$("#location")[0].selectedIndex = 1;
				$(".eYork").show();
				$(".nYork").hide();
				$(".scar").hide();
				$(".tYork").hide();
				if (IDswitch == 2 && currentType == "B" || currentType == "C") {
				$(".eHide2").hide();
				}
				break;
			case "northYork":
				$("#location")[0].selectedIndex = 4;
				$(".eYork").hide();
				$(".nYork").show();
				$(".scar").hide();
				$(".tYork").hide();
				break;
			case "scarborough":
				$("#location")[0].selectedIndex = 7;
				$(".eYork").hide();
				$(".nYork").hide();
				$(".scar").show();
				$(".tYork").hide();
				if (IDswitch == 2 && currentType == "B" || currentType == "C") {
				$("#location")[0].selectedIndex = 8;
				$(".sHide2").hide();
				}
				break;
			case "torontoEastYork":
				$("#location")[0].selectedIndex = 10;
				$(".eYork").hide();
				$(".nYork").hide();
				$(".scar").hide();
				$(".tYork").show();
				if (IDswitch == 1 && currentType == "B" || currentType == "C") {
				$(".tHide").hide();
				}
				break;
			case "noDist":
				$("#location")[0].selectedIndex = 0;
				$(".eYork").hide();
				$(".nYork").hide();
				$(".scar").hide();
				$(".tYork").hide();
				break;
		}
}
function districtChangeR(){
	var dist = document.getElementById("districtR").options;
	var currDist = dist[dist.selectedIndex].id;
		switch (currDist) {
			case "etobicokeYorkR":
				$("#locationR")[0].selectedIndex = 1;
				$(".eYork").show();
				$(".nYork").hide();
				$(".scar").hide();
				$(".tYork").hide();
				if (IDswitch == 2 && currentType == "B" || currentType == "C") {
				$(".eHide2").hide();
				}
				break;
			case "northYorkR":
				$("#locationR")[0].selectedIndex = 4;
				$(".eYork").hide();
				$(".nYork").show();
				$(".scar").hide();
				$(".tYork").hide();
				break;
			case "scarboroughR":
				$("#locationR")[0].selectedIndex = 7;
				$(".eYork").hide();
				$(".nYork").hide();
				$(".scar").show();
				$(".tYork").hide();
				if (IDswitch == 2 && currentType == "B" || currentType == "C") {
				$("#location")[0].selectedIndex = 8;
				$(".sHide2").hide();
				}
				break;
			case "torontoEastYorkR":
				$("#locationR")[0].selectedIndex = 10;
				$(".eYork").hide();
				$(".nYork").hide();
				$(".scar").hide();
				$(".tYork").show();
				if (IDswitch == 1 && currentType == "B" || currentType == "C") {
				$(".tHide").hide();
				}
				break;
			case "noDist":
				$("#locationR")[0].selectedIndex = 0;
				$(".eYork").hide();
				$(".nYork").hide();
				$(".scar").hide();
				$(".tYork").hide();
				break;
		}
}
/* this function is to bring up the modal when we click "Add New". We used to use the data-toggle and data-target in the html button tag but using javascript gives more control.
Old: <button type="button" class= "btn btn-success pull-right" data-toggle="modal" data-target="#typeAModal">
New: <button type="button" class= "btn btn-success pull-right" onclick="showModal('A');"> */
function showModal(sRequestType, modalType, season) { //sRequest is the actual modal section, modalType is which modal type to use (either A or D), seasonType is which season it pertains to
//where it goes, what modal to use, which season it goes to
	var seasonTitle;
	
	if (season == "SS"){
		seasonTitle = "Spring/Summer"; 
		seasonType = "SS"; 
		SSOpt();
		$("#endDate").data("DateTimePicker").minDate(new Date(2000, 1,1));
		$("#startDate").data("DateTimePicker").minDate(new Date(2000, 1,1));
		$("#endDate").data("DateTimePicker").maxDate(new Date(2099, 8,4));
		$("#startDate").data("DateTimePicker").maxDate(new Date(2099, 8,4));
		
		$("#endDate").data("DateTimePicker").minDate(new Date(2016, 3,1));
		$("#endDate").data("DateTimePicker").maxDate(new Date(2016, 8,4));
		$("#startDate").data("DateTimePicker").minDate(new Date(2016, 3,1));
		$("#startDate").data("DateTimePicker").maxDate(new Date(2016, 8,4));
	}
	else {
		seasonTitle = "Fall/Winter"; 
		seasonType = "FW"; 
		FWOpt();
		$("#endDate").data("DateTimePicker").minDate(new Date(2000, 1,1));
		$("#startDate").data("DateTimePicker").minDate(new Date(2000, 1,1));
		$("#endDate").data("DateTimePicker").maxDate(new Date(2099, 8,4));
		$("#startDate").data("DateTimePicker").maxDate(new Date(2099, 8,4));
		
		$("#endDate").data("DateTimePicker").minDate(new Date(2016, 8,5));
		$("#endDate").data("DateTimePicker").maxDate(new Date(2017, 2,31));
		$("#startDate").data("DateTimePicker").minDate(new Date(2016, 8,5));
		$("#startDate").data("DateTimePicker").maxDate(new Date(2017, 2,31));
	}
	
	$("#type" + modalType + "Modal").modal(); //execute modal
	document.getElementById("Type" + modalType + "Label").innerHTML = "New Type " + sRequestType + " Request" + "<br><small>" + seasonTitle + "</small>";
	
	$("#district")[0].selectedIndex = -1; //every time add new button clicked, starts at blank district & location
	$("#location")[0].selectedIndex = -1;
	$("#job")[0].selectedIndex = -1;
	$("#availStart").val("");
	$("#availEnd").val("");
	$("#availStartR").val("");
	$("#availEndR").val("");
	$("#startDate").val("");
	$("#endDate").val("");
	$("#districtR")[0].selectedIndex = -1; //every time add new button clicked, starts at blank district & location
	$("#locationR")[0].selectedIndex = -1;
	$("#jobR")[0].selectedIndex = -1;
	$(".eYork").hide();
	$(".nYork").hide();
	$(".scar").hide();
	$(".tYork").hide();
	manualCheck();
	
	switch (sRequestType) {
		case 'A':
			return currentType = "A";
			break;
		case 'B':
			if (IDswitch == 1) {
				$("#etobicokeYork").hide();
				$("#northYork").hide();
				$("#scarborough").hide();
				$(".jHide").hide();
			} else if (IDswitch == 2) {
				$("#northYork").hide();
				$("#torontoEastYork").hide();
				$(".jHide2").hide();
			}
			return currentType = "B";
			break;
		case 'C':
			if (IDswitch == 1) {
				$("#etobicokeYork").hide();
				$("#northYork").hide();
				$("#scarborough").hide();
			} else if (IDswitch == 2) {
				$("#northYork").hide();
				$("#torontoEastYork").hide();
			}
			return currentType = "C";
			break;
		case 'D':
			return currentType = "D";
			break;
		case 'R':
			document.getElementById("Type" + modalType + "Label").innerHTML = "New Relief Request" + "<br><small>" + seasonTitle + "</small>";
			return currentType = "R";
			break;
	}
}
$(document).on('hidden.bs.modal', '#typeDModal', function(){ //when modal dismisses, reset all options
modalReset();
	if (empID == "123123123") {
		IDswitch = 1;
	} else if (empID == "999999999") {
		IDswitch = 2;
	}
manualCheck();
})

function seasonAModal() {
showModal('A', 'D', seasonType);
$("#manualNewForm").hide();
IDswitch = 0;
manualCheck();
}
function manualRequest() {
modalReset();
IDswitch = 0;
manualCheck();
showModal(currentType, 'D', seasonType);
$("#manualNewForm").hide();
$("#manualNotify").html("<b>Manual new request mode, all options have been unlocked.</b>").css("color","red");
}

/* this is the main add request function for modal A*/
function addWorkRequest(sRequestType,destinationSelector, sourceSelector) { /* "sRequestType" is the type of request (A, B, C, D), second parameter is the place that records are popping up in the main.html, but is used to determine which section's panel body to add items to, third parameter is to reference specifically which record item from modal echoes back on main.html page. */
	destinationSelector = destinationSelector + seasonType;

	var index = ($(destinationSelector + ">div").length > 0) ? parseInt($(destinationSelector + ">div:last-child").attr("data-row-number")) + 1 : 1; /* if the current section (type a section, type b section, etc.) has no items (which are divs), then the index is 1. Else, the index is the index of the last div plus one */
	var oDiv = document.createElement('div'); /* create a new div for the new item (item means a request listing) */
	oDiv.setAttribute("data-row-number", index); /* for the purpose of index and ordering */
	oDiv.id = "type" + sRequestType + "row" + index; /* give the div an id depending on which type it is (ABCDR) and which index it is */
	oDiv.className = 'list-entry';

	
	var oSubDiv1 = oDiv.appendChild(document.createElement('div')); //div to hold the data (location, job, shift, etc.)
	oSubDiv1.className = "col-xs-9 col-md-9";
	oSubDiv1.innerHTML = $(sourceSelector + " .userdata").html(); //userdata is the class used in the html div that contains the data. the purpose of this line is to take the data from the modal and put it into the panel body item
	
	
	var oSubDiv2 = oDiv.appendChild(document.createElement('div')); //div to hold Edit Button
	oSubDiv2.className = "col-xs-1 col-md-1";
	
	
	var oSubDiv3 = oDiv.appendChild(document.createElement('div')); //div to hold Delete Button
	oSubDiv3.className = "col-xs-2 col-md-2";
	
	
	var oButtonEdit = oSubDiv2.appendChild(document.createElement('button')); //create an edit button and put it into the edit div
	oButtonEdit.innerText = "Edit";
	oButtonEdit.className = "btn btn-info editbutton";
	
	
	var oButtonDel = oSubDiv3.appendChild(document.createElement('button')); //create a remove button and put it into the remove div
	oButtonDel.innerText = "Remove";
	oButtonDel.className = "btn btn-danger removebutton";
	
	
	/* Sali */
	var oSubDiv0 = oDiv.appendChild(document.createElement('br')); //visual break
	oSubDiv0.innerHTML = $(sourceSelector + " .userdata").html();
	
	
	$(destinationSelector).append(oDiv.outerHTML); //append the whole div/item created above into the panel body of the corresponding section
	$(sourceSelector).addClass("hide"); //whenever we use a modal option, the listing is hidden from the modal list so that users can't choose it again
	$("#type" + sRequestType + "row" + index + " .removebutton").click(function() {$(event.target).closest(".list-entry").remove(); 
	$(sourceSelector).removeClass("hide");}); //when an item's remove button is clicked, remove that listing from the section panel body, and unhide the listing from the modal so it can be chosen again
	$("#type" + sRequestType + "row" + index + " .editbutton").click(function() {alert("This would go back into the corresponding request to change values inside the modal")}); //this is supposed to interact with the json object so that the user can edit their listing
}

/* this is the main add request function for type b/c/d*/
function addWorkRequestTypeD(sRequestType,destinationSelector, sourceSelector) { /* "sRequestType" is the type of request (A, B, C, D), second parameter is the place that records are popping up in the main.html, but is used to determine which section's panel body to add items to, third parameter is to reference specifically which record item from modal echoes back on main.html page. */
	
	sRequestType = currentType;
	destinationSelector = "#type" + currentType + "Requests" + seasonType; //where it goes
	//validation for empty field
	if ( document.getElementById("season").value == "blank") {	
		alert("Please select a season");
	}
	else {
		var index = ($(destinationSelector + ">div").length > 0) ? parseInt($(destinationSelector + ">div:last-child").attr("data-row-number")) + 1 : 1; /* if the current section (type a section, type b section, etc.) has no items (which are divs), then the index is 1. Else, the index is the index of the last div plus one */
		var oDiv = document.createElement('div'); /* create a new div for the new item (item means a request listing) */
		oDiv.setAttribute("data-row-number", index); /* for the purpose of index and ordering */
		oDiv.id = "type" + sRequestType + "row" + seasonType + index; /* give the div an id depending on which type it is (ABCDR) and which index it is */
		oDiv.className = 'list-entry';
		
		var oSubDiv0 = oDiv.appendChild(document.createElement('br')); //visual break
		
		var oSubDiv1 = oDiv.appendChild(document.createElement('div')); //div to hold the data (location, job, shift, etc.)
		oSubDiv1.className = "col-xs-9 col-md-9";
		oSubDiv1.innerHTML = "<b><p>" + document.getElementById("district").value + " - " + document.getElementById("location").value + " - " + document.getElementById("job").value + "</b>" + "<br />" + document.getElementById("days").value + " - " + document.getElementById("availStart").value + " to " + document.getElementById("availEnd").value + " - " + document.getElementById("season").value + late + manualStatus + "</p>"; //the purpose of this line is to take the data from the modal and put it into the panel body item. .value gets the current selected index of the various form options
		
		var oSubDiv2 = oDiv.appendChild(document.createElement('div')); //div to hold Edit Button
		oSubDiv2.className = "col-xs-1 col-md-1";
		var oSubDiv3 = oDiv.appendChild(document.createElement('div')); //div to hold Delete Button
		oSubDiv3.className = "col-xs-2 col-md-2";
		var oButtonEdit = oSubDiv2.appendChild(document.createElement('button')); //create an edit button and put it into the edit div
		oButtonEdit.innerText = "Edit";
		oButtonEdit.className = "btn btn-info editbutton";
		var oButtonDel = oSubDiv3.appendChild(document.createElement('button')); //create a remove button and put it into the remove div
		oButtonDel.innerText = "Remove";
		oButtonDel.className = "btn btn-danger removebutton";
		$(destinationSelector).append(oDiv.outerHTML); //append the whole div/item created above into the panel body of the corresponding section
		$("#type" + sRequestType + "row" + seasonType + index + " .removebutton").click(function() {$(event.target).closest(".list-entry").remove(); }); 
		$("#type" + sRequestType + "row" + seasonType + index + " .editbutton").click(function() {alert("This would go back into the corresponding request to change values inside the modal")}); //this is supposed to interact with the json object so that the user can edit their listing
	}
}

/* this is the main add request function for relief requests*/
function addWorkRequestTypeR(sRequestType,destinationSelector, sourceSelector) { /* "sRequestType" is the type of request (A, B, C, D), second parameter is the place that records are popping up in the main.html, but is used to determine which section's panel body to add items to, third parameter is to reference specifically which record item from modal echoes back on main.html page. */
	
	sRequestType = currentType;
	destinationSelector = "#type" + currentType + "Requests" + seasonType; //where it goes
	modalReset();
	
	//validation for empty field
	var allDays = [];		//for loop to store all multi-selected days
	var d = document.getElementById("daysR");
	for (var i = 0; i< d.options.length; i++) {
		if (d.options[i].selected == true) {
			var dayID = " " + d.options[i].value;
			allDays.push(dayID);
		}
	}
			
		var index = ($(destinationSelector + ">div").length > 0) ? parseInt($(destinationSelector + ">div:last-child").attr("data-row-number")) + 1 : 1; /* if the current section (type a section, type b section, etc.) has no items (which are divs), then the index is 1. Else, the index is the index of the last div plus one */
		var oDiv = document.createElement('div'); /* create a new div for the new item (item means a request listing) */
		oDiv.setAttribute("data-row-number", index); /* for the purpose of index and ordering */
		oDiv.id = "type" + sRequestType + "row" + seasonType + index; /* give the div an id depending on which type it is (ABCDR) and which index it is */
		oDiv.className = 'list-entry';
		
		var oSubDiv0 = oDiv.appendChild(document.createElement('br')); //visual break
		
		var oSubDiv1 = oDiv.appendChild(document.createElement('div')); //div to hold the data (location, job, shift, etc.)
		oSubDiv1.className = "col-xs-9 col-md-9";
		oSubDiv1.innerHTML = "<b><p>" + document.getElementById("districtR").value + " - " + document.getElementById("locationR").value + " - " + document.getElementById("jobR").value + "</b>" + "<br />" + allDays + " - " + document.getElementById("availStartR").value + " to " + document.getElementById("availEndR").value + "<br>" + document.getElementById("startDate").value + " - " + document.getElementById("endDate").value + late + manualStatus + "</p>"; //the purpose of this line is to take the data from the modal and put it into the panel body item. .value gets the current selected index of the various form options
		
		var oSubDiv2 = oDiv.appendChild(document.createElement('div')); //div to hold Edit Button
		oSubDiv2.className = "col-xs-1 col-md-1";
		var oSubDiv3 = oDiv.appendChild(document.createElement('div')); //div to hold Delete Button
		oSubDiv3.className = "col-xs-2 col-md-2";
		var oButtonEdit = oSubDiv2.appendChild(document.createElement('button')); //create an edit button and put it into the edit div
		oButtonEdit.innerText = "Edit";
		oButtonEdit.className = "btn btn-info editbutton";
		var oButtonDel = oSubDiv3.appendChild(document.createElement('button')); //create a remove button and put it into the remove div
		oButtonDel.innerText = "Remove";
		oButtonDel.className = "btn btn-danger removebutton";
		$(destinationSelector).append(oDiv.outerHTML); //append the whole div/item created above into the panel body of the corresponding section
		$("#type" + sRequestType + "row" + seasonType + index + " .removebutton").click(function() {$(event.target).closest(".list-entry").remove(); }); 
		$("#type" + sRequestType + "row" + seasonType + index + " .editbutton").click(function() {alert("This would go back into the corresponding request to change values inside the modal")}); //this is supposed to interact with the json object so that the user can edit their listing
}