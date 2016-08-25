var cot_form = function(o) {
	this.id=o.id;
	this.title=o.title;
	this.success = o.success;
	this.sections = [];
};
var cot_section = function(o) {
	this.id=o.id;
	this.title=o.title;
	this.class=o.class;
	this.rows = [];
};
var cot_row = function(o) {
	this.fields = o;
	this.type='standard';
};
var cot_grid = function(o) {
	this.id = (o.id||"")?o.id:'grid-' + Math.floor(Math.random()*100000000);
	this.add = (o.add||"")?true:false;
	this.class = o.class;
	this.title = o.title;
	this.headers = o.headers;
	this.fields = o.fields;
	this.type='grid';
};
cot_form.prototype.addSection = function(o) {
	this.sections.push(o);
	return o;
}
cot_section.prototype.addRow = function(o) {
	this.rows.push(o);
	return o;
}
cot_section.prototype.addGrid = function(o) {
	this.rows.push(o);
	return o;
}
cot_form.prototype.render = function(o) {
	var app = this;
	var oVal={fields:{}};
	var form = document.createElement('form');
	form.id = this.id;
	if (this.title||"") {
		var formHead = form.appendChild(document.createElement('h2'));
		formHead.innerText = this.title;
	}
	$.each(this.sections, function(i, section) {
		var oPanel = form.appendChild(document.createElement('div'));
		oPanel.id = section.id;
		

		oPanel.className = (section.class||"") ? 'panel ' + section.class : "panel panel-default";
		if (section.title||"") {
			oPanelHead = oPanel.appendChild(document.createElement('div'));
			oPanelHead.className = 'panel-heading';
			var oH3 = oPanelHead.appendChild(document.createElement('h3'));
			var oSpan = oH3.appendChild(document.createElement('span'));
			oSpan.className = "glyphicon glyphicon-th-large";
			oSpan = oH3.appendChild(document.createElement('span'));
			oH3.innerText = section.title;
		}
		var oPanelBody = oPanel.appendChild(document.createElement('div'));
		oPanelBody.className = 'panel-body';

		$.each(section.rows, function(k, row) {
			var oRow = oPanelBody.appendChild(document.createElement('div'));
			oRow.className = 'row';
			if (row.type=='grid') {
				app.processGrid(oRow, oVal, row);
			} else {
				$.each(row.fields, function(l, field) {
					app.processField(oRow, oVal, row, field)
				});
			}
		});
	});
	$(o.target).append(form);
	
	app.initializeFunctions();
		
	//INITIATE FORM VALIDATION
	var myForm = this;
	$('#' + this.id).bootstrapValidator({
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		onSuccess: this.success,
		onError: function(e) {
			$($(".has-error input")[0]).focus();
		},
		fields: oVal.fields
	})
}

cot_form.prototype.initializeFunctions = function() {
	$.each(this.sections, function(i, section) {
		$.each(section.rows, function(k, row) {
			$.each(row.fields, function(l, field) {
				if (field.type=='button') {$("#"+field.id).click(function() {field.onclick();})}
				if (field.type=='multiselect') {$("."+field.id+".multiselect").multiselect(field.options);}
				if (field.validationtype=="Phone") {$("#"+field.id).intlTelInput({utilsScript: '../corev1.0/js/utils.js',autoPlaceholder: true,preferredCountries: ['ca']})}
				if (field.type=='datetimepicker') {
				$("."+field.id+".datetimepicker").datetimepicker(field.options);
				}
			});
		});
	});
	
}

cot_form.prototype.addRow = function(id,row) {
	var app = this;
	var oTable = $("#"+id + " table")[0];
	oTR = oTable.appendChild(document.createElement('tr'));
	oTR.id = id + '-row-' + $('#' + id + ' tr').length;
	$.each(row.fields, function(l, field) {
		var oFieldDiv = oTR.appendChild(document.createElement('td'));
		//CORE FIELD LOGIC
		var sType = (field.type||"")?field.type:'text';
		var x = app.callFunction(app[sType+'FieldRender'],field);
		oFieldDiv.appendChild(x);
	});
	var oTD = oTR.appendChild(document.createElement('td'));
	oTD.className = 'text-right';
	var oBTN = oTD.appendChild(document.createElement('button'));
	oBTN.className = 'btn btn-danger grid-remove';
	oBTN.onclick = function () {app.removeRow(id + '-row-' + $('#' + id + ' tr').length)};
	var oSpan = oBTN.appendChild(document.createElement('span'));
	oSpan.className = 'glyphicon glyphicon-remove';
	oSpan = oBTN.appendChild(document.createElement('span'));
	oSpan.innerText = 'Remove';
	app.initializeFunctions();
}
cot_form.prototype.removeRow = function(id) {
	var app = this;
	$('#' + id).remove();
}
cot_form.prototype.processGrid = function(oRow, oVal, row) {
	var app = this;
	var intFields = row.fields.length;
	var oGrid = oRow.appendChild(document.createElement('div'));
	oGrid.id = row.id;
	oGrid.className = 'grid-object ';
	oGrid.className += (row.class||"")?row.class:'';
	var oGridHead = oGrid.appendChild(document.createElement('h4'));
	oGridHead.className = 'grid-title';
	oGridHead.innerText = row.title;
	var oTable = oGrid.appendChild(document.createElement('table'));
	oTable.className = 'grid-table table table-striped';
	var oTR = oTable.appendChild(document.createElement('tr'));	
	
	//ADD HEADERS
	$.each(row.headers, function(i,header) {
		var oTH = oTR.appendChild(document.createElement('th'));
		oTH.innerText = header.title;
	});
	
	//IF THE USER HAS SPECIFIED AN ADD FUNCTION THEN ADD A COLUMN FOR ADDING/DELETING
	if (row.add) {
		var oTH = oTR.appendChild(document.createElement('th'));
		oTH.className = 'text-right';
		var oBTN = oTH.appendChild(document.createElement('button'));
		oBTN.className = 'btn btn-info grid-add';
		oBTN.onclick = function () {app.addRow(row.id,row)};
		var oSpan = oBTN.appendChild(document.createElement('span'));
		oSpan.className = 'glyphicon glyphicon-plus';
		oSpan = oBTN.appendChild(document.createElement('span'));
		oSpan.innerText = 'Add Row';
	}
	
	oTR = oTable.appendChild(document.createElement('tr'));
	
	$.each(row.fields, function(l, field) {
		var oFieldDiv = oTR.appendChild(document.createElement('td'));
		//CORE FIELD LOGIC
		var sType = (field.type||"")?field.type:'text';
		var x = app.callFunction(app[sType+'FieldRender'],field);
		oFieldDiv.appendChild(x);
	});
	if (row.add) {var oFieldDiv = oTR.appendChild(document.createElement('td'));}
	/*
	//LABEL
	if (field.type!='html'&&field.type!='button') {
		if (field.type=='static') {
			var oLabel = oFieldDiv.appendChild(document.createElement('span'));
			oLabel.className = 'staticlabel';
			oLabel.innerText = field.title;
		} else {
			var oLabel = oFieldDiv.appendChild(document.createElement('label'));
			oLabel.className = 'control-label';
			oLabel.for = field.id;
			var oLabelSpan = oLabel.appendChild(document.createElement('span'));
			oLabelSpan.innerText = field.title;
			oLabelSpan = oLabel.appendChild(document.createElement('span'));
			if (field.required||""||field.validators) {
				oLabelSpan.innerText = '(optional)';
				oLabelSpan.className = 'optional';
			}
		}
	}
	
	//PRE HELP TEXT
	if (field.prehelptext||'') {
		var oHelp = oFieldDiv.appendChild(document.createElement('p'));
		oHelp.className = 'helptext';
		oHelp.innerHTML = field.prehelptext;
	}
	
	//CORE FIELD LOGIC
	var sType = (field.type||"")?field.type:'text';
	var x = app.callFunction(app[sType+'FieldRender'],field);
	oFieldDiv.appendChild(x);
	
	//POST HELP TEXT
	if (field.posthelptext||'') {
		var oHelp = oFieldDiv.appendChild(document.createElement('p'));
		oHelp.className = 'helptext';
		oHelp.innerHTML = field.posthelptext;
	}
	
	//ADD VALIDATION
	oVal.fields[field.id] = {};
	oVal.fields[field.id].validators = {};
	if (field.validators||field.required||"") {
		if (field.validators||"") {
			oVal.fields[field.id].validators=field.validators;
		}
	}
	if (field.validationtype=="Phone") {
		oVal.fields[field.id].validators.callback = {};
		oVal.fields[field.id].validators.callback.message = 'The phone number is not valid';
		oVal.fields[field.id].validators.callback.callback = function(value, validator, $field) {
				return value === '' || $field.intlTelInput('isValidNumber');
		}
	}
	if (field.validationtype=="Email") {oVal.fields[field.id].validators ={emailAddress: {message: 'The value is not a valid email address'}};}
	if (field.validationtype=="URL") {oVal.fields[field.id].validators ={uri: {message: 'The value is not a valid URL (http://xx.xx or https://xx.xx).'}};}
	if (field.required||"") {
		oVal.fields[field.id].validators.notEmpty={};
		oVal.fields[field.id].validators.notEmpty.message=field.title + ' is required and cannot be left blank';
	}
	*/
}
cot_form.prototype.processField = function(oRow, oVal, row, field) {
	var app = this;
	var intFields = row.fields.length;
	var sClass=(intFields==1)?"col-xs-12":(intFields==2)?"col-xs-12 col-sm-6" :(intFields==3)?"col-xs-12 col-md-4":"col-xs-12 col-sm-2 col-md-3";
	var oField = oRow.appendChild(document.createElement('div'));
	oField.id = field.id + 'Element';
	oField.className = (field.class||"")?field.class:sClass;
	oField.className += ' form-group form-group-';
	oField.className += (field.orientation||'') ? field.orientation : 'vertical';
	oFieldDiv = oField.appendChild(document.createElement('div'));
	
	//LABEL
	if (field.type!='html'&&field.type!='button') {
		if (field.type=='static') {
			var oLabel = oFieldDiv.appendChild(document.createElement('span'));
			oLabel.className = 'staticlabel';
			oLabel.innerText = field.title;
		} else {
			var oLabel = oFieldDiv.appendChild(document.createElement('label'));
			oLabel.className = 'control-label';
			oLabel.for = field.id;
			var oLabelSpan = oLabel.appendChild(document.createElement('span'));
			oLabelSpan.innerText = field.title;
			oLabelSpan = oLabel.appendChild(document.createElement('span'));
			if (field.required||""||field.validators) {
			
			} else {
				oLabelSpan.innerText = '(optional)';
				oLabelSpan.className = 'optional';
			}
		}
	}
	
	//PRE HELP TEXT
	if (field.prehelptext||'') {
		var oHelp = oFieldDiv.appendChild(document.createElement('p'));
		oHelp.className = 'helptext';
		oHelp.innerHTML = field.prehelptext;
	}
	
	//CORE FIELD LOGIC
	var sType = (field.type||"")?field.type:'text';
	var x = app.callFunction(app[sType+'FieldRender'],field);
	oFieldDiv.appendChild(x);
	
	//POST HELP TEXT
	if (field.posthelptext||'') {
		var oHelp = oFieldDiv.appendChild(document.createElement('p'));
		oHelp.className = 'helptext';
		oHelp.innerHTML = field.posthelptext;
	}
	
	//ADD VALIDATION
	oVal.fields[field.id] = {};
	oVal.fields[field.id].validators = {};
	if (field.validators||field.required||"") {
		if (field.validators||"") {
			oVal.fields[field.id].validators=field.validators;
		}
	}
	if (field.validationtype=="Phone") {
		oVal.fields[field.id].validators.callback = {};
		oVal.fields[field.id].validators.callback.message = 'The phone number is not valid';
		oVal.fields[field.id].validators.callback.callback = function(value, validator, $field) {
				return value === '' || $field.intlTelInput('isValidNumber');
		}
	}
	if (field.validationtype=="Email") {oVal.fields[field.id].validators ={emailAddress: {message: 'The value is not a valid email address'}};}
	if (field.validationtype=="URL") {oVal.fields[field.id].validators ={uri: {message: 'The value is not a valid URL (http://xx.xx or https://xx.xx).'}};}
	if (field.required||"") {
		oVal.fields[field.id].validators.notEmpty={};
		oVal.fields[field.id].validators.notEmpty.message=field.title + ' is required and cannot be left blank';
	}
}
cot_form.prototype.callFunction = function(func){
    var ret = func.apply(this, Array.prototype.slice.call(arguments, 1));
	return ret;
}
cot_form.prototype.staticFieldRender = function(field) {
	var o = document.createElement('p');
	o.id = field.id;
	o.innerText = field.value;
	return o;
}
cot_form.prototype.htmlFieldRender = function(field) {
	var o = document.createElement('div');
	o.innerHTML = field.html;
	return o;
}
cot_form.prototype.textFieldRender = function(field) {
	var o = document.createElement('div');
	o.className = 'entryField';
	var oField = o.appendChild(document.createElement('input'));
	oField.id = oField.name = field.id;
	oField.title = field.title;
	oField.type = 'text';
	oField.value += (field.value||"")?field.value:'';
	oField.className += (field.required||"")?'form-control required':'form-control';
	oField.placeholder = (field.placeholder||"")?field.placeholder:"";
	return o;
}
cot_form.prototype.radioFieldRender = function(field) {
	var o = document.createElement('div');
	o.className = 'form-control';
	$.each(field.choices, function(m, choice) {
		var oDiv = o.appendChild(document.createElement('div'));
		oDiv.className = (field.orientation||'')?field.orientation:'vertical';
		oDiv.className +=  ' entryField';
		var oField = oDiv.appendChild(document.createElement('input'));
		oField.name = field.id;
		oField.title = field.title;
		oField.type = 'radio';
		oField.className += (field.required||"")?'form-control required':'form-control';
		oField.value = choice.hasOwnProperty('value')?choice.value:choice.text;
		if (field.value||"") {
			oField.checked = (field.value==oField.value)?'checked':'';
		}
		oDiv.appendChild(document.createTextNode(choice.text));
	});
	return o;
}								
cot_form.prototype.checkboxFieldRender = function(field) {
	var o = document.createElement('div');
	o.className = 'form-control';
	$.each(field.choices, function(m, choice) {
		var oDiv = o.appendChild(document.createElement('div'));
		oDiv.className = (field.orientation||'')?field.orientation:'vertical';
		oDiv.className +=  ' entryField';
		var oField = oDiv.appendChild(document.createElement('input'));
		oField.name = field.id;
		oField.title = field.title;
		oField.type = 'checkbox';
		oField.className += (field.required||"")?'form-control required':'form-control';
		oField.value = choice.hasOwnProperty('value')?choice.value:choice.text;
		if (choice.selected||"") {oField.checked="checked";}
		oDiv.appendChild(document.createTextNode(choice.text));
	});
	return o;
}	
cot_form.prototype.dropdownFieldRender = function(field) {
	var o = document.createElement('div');
	o.className = 'entryField';
	var oField = o.appendChild(document.createElement('select'));
	oField.name = oField.name = field.id;
	oField.className = 'form-control';
	$.each(field.choices, function(m, choice) {
		var oOption = oField.appendChild(document.createElement('option'));
		oOption.value = choice.hasOwnProperty('value')?choice.value:choice.text;
		oOption.text = choice.text;
		if (field.value||"") {
			oOption.selected = (field.value==oOption.value)?'selected':'';
		}
	});
	return o;
}		
cot_form.prototype.multiselectFieldRender = function(field) {
	var o = document.createElement('div');
	o.className = 'entryField';
	var oField = o.appendChild(document.createElement('select'));
	oField.name = oField.id;// = field.id;
	oField.className = 'form-control hide multiselect ' + field.id;
	oField.multiple = (field.multiple||"")? 'multiple' : '';
	$.each(field.choices, function(m, choice) {
		var oOption = oField.appendChild(document.createElement('option'));
		oOption.value = choice.hasOwnProperty('value')?choice.value:choice.text;
		oOption.text = choice.text;
	});
	return o;
}			
cot_form.prototype.datetimepickerFieldRender = function(field) {
	var o = document.createElement('div');
	o.className = 'input-group date entryField datetimepicker ' + field.id;
	var oField = o.appendChild(document.createElement('input'));
	oField.id = field.id;
	oField.type = 'text';
	oField.value += (field.value||"")?field.value:'';
	oField.className = 'form-control';
	var oSpan = o.appendChild(document.createElement('span'));
	oSpan.className = 'input-group-addon';
	oSpan = oSpan.appendChild(document.createElement('span'));
	oSpan.className = 'glyphicon glyphicon-calendar';
	return o;
}
cot_form.prototype.textareaFieldRender = function(field) {
	var o = document.createElement('div');
	o.className = 'entryField';
	var oField = o.appendChild(document.createElement('textarea'));
	oField.id = oField.name = field.id;
	oField.title = field.title;
	oField.type = 'text';
	oField.className += (field.required||"")?'form-control required':'form-control';
	oField.placeholder = (field.placeholder||"")?field.placeholder:"";
	oField.value += (field.value||"")?field.value:'';
	return o;
}
cot_form.prototype.buttonFieldRender = function(field) {
	var o = document.createElement('button');
	o.id = field.id;
	o.className = (field.class||"")?field.class:'btn btn-success';
	var oSpan = o.appendChild(document.createElement('span'));
	oSpan.className = (field.glyphicon||"")?'glyphicon ' + field.glyphicon : '';
	oSpan = o.appendChild(document.createElement('span'));
	oSpan.innerText = field.title;
	return o;
}


			              
			

	