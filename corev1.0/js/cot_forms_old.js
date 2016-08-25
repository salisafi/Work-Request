var cot_form = function(o) {
	this.id=o.id;
	this.title=o.title;
	this.sections = [];
};
var cot_section = function(o) {
	this.id=o.id;
	this.title=o.title;
	this.rows = [];
};
var cot_row = function(o) {
	this.fields = o;
};
cot_form.prototype.addSection = function(o) {
	this.sections.push(o);
	return o;
}
cot_section.prototype.addRow = function(o) {
	this.rows.push(o);
	return o;
}

cot_form.prototype.render = function(o) {
	var sHTML="",intFields,sClass="",sRequired,sType,sRadioClass,sPH;
	sHTML = "<h2>" + this.title + "</h2>";
	$.each(this.sections, function(i, section) {
		sHTML += '<div class="panel panel-default">';
			sHTML += '<div class="panel-heading ' + section.id + '">';
				sHTML += '<h3><span class="glyphicon glyphicon-th-large green"> </span> ' + section.title + '</h3>';
			sHTML += '</div>';
			sHTML += '<div class="panel-body">';
				$.each(section.rows, function(k, row) {
					intFields = row.fields.length;
					sClass=(intFields==1)?"col-xs-12":(intFields==2)?"col-xs-12 col-sm-6" :(intFields==3)?"col-xs-12 col-md-4":"col-xs-12 col-sm-2 col-md-3";
					sHTML += '<div class="row">';
					$.each(row.fields, function(l, field) {
						sPH = (field.placeholder||"")?field.placeholder:"";
						sRequired = (field.required||"")?(field.required)?'required':'':'';
						sType = (field.type||"")?field.type:'text';
						sHTML += '<div class="' + sClass + ' form-group">';
							sHTML += '<div>';
							sHTML += (field.type=='html')?'':(field.type=='static')?'<span class="staticlabel">' + field.title +'</span>':'<label class="control-label" for="' + field.id + '">' + field.title + ':  </label>';	
							switch (sType) {
								case 'static':
									sHTML += '<p id="' + field.id + '">' + field.value+ '</p>';
									break;
								case 'text':
									sHTML += '<input placeholder="' + sPH + '" class="form-control ' + sRequired + '" type="text" id="' + field.id + '" name="' + field.id + '" title="' + field.title + '">';
									break;
								case 'radio':
									sRadioClass=(field.orientation||'')?field.orientation:'vertical';
									sHTML += "<div>";
									$.each(field.choices, function(m, choice) {
										sHTML += '<div class="' + sRadioClass + '"><input class="form-control" type="radio" id="' + field.id + '" name="' + field.id + '" value="' + choice + '"> ' + choice + '</div>';
									});
									sHTML += "</div>";
									break;
								case 'checkbox':
									sRadioClass=(field.orientation||'')?field.orientation:'vertical';
									sHTML += "<div>";
									$.each(field.choices, function(m, choice) {
										sHTML += '<div class="' + sRadioClass + '"><input class="form-control" type="checkbox" id="' + field.id + '" name="' + field.id + '" value="' + choice + '"> ' + choice + '</div>';
									});
									sHTML += "</div>";
									break;
								case 'dropdown':
									sHTML += '<select class="form-control" id="' + field.id + '" name="' + field.id + '">';
									$.each(field.choices, function(m, choice) {
										sHTML += '<option value="' + choice + '"> ' + choice + '</option>';
									});
									sHTML += '</select>';
									break;
								case 'textarea':
									sHTML += '<textarea id="' + field.id + '" name="' + field.id + '"/>';
									break;
								case 'html':
									sHTML += field.html;
									break;
								default:
								
							}
							sHTML += (field.helptext||'')?'<p class="helptext">' + field.helptext + '</p>':''
							sHTML += '</div>';
						sHTML += '</div>';
					});
					sHTML += '</div>';
				});
			sHTML += '</div>';
		sHTML += '</div>';
		$(o.target).append(sHTML);
		sHTML = "";
	});
}


			              
			

	