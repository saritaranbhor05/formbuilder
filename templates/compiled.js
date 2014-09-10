this["Formbuilder"] = this["Formbuilder"] || {};
this["Formbuilder"]["templates"] = this["Formbuilder"]["templates"] || {};

this["Formbuilder"]["templates"]["edit/age_restriction"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Minimum Age Restriction</div>\n\n  <input type="number" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MINAGE )) == null ? '' : __t) +
'" min=\'0\' style="width: 30px" />\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/area_code"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Area Code</div>\n\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.AREA_CODE )) == null ? '' : __t) +
'" style="width: 30px" />';

}
return __p
};

this["Formbuilder"]["templates"]["edit/back_visiblity"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Back Visiblity</div>\n<select data-rv-value=\'model.' +
((__t = ( Formbuilder.options.mappings.BACK_VISIBLITY )) == null ? '' : __t) +
'\'>\n    <option value=\'true\'>true</option>\n    <option value=\'false\'>false</option>\n</select>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
((__t = ( Formbuilder.templates['edit/base_header']() )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.templates['edit/common']() )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf: rf, opts:opts}) )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.templates['edit/conditions']({ rf:rf, opts:opts }))) == null ? '' : __t) +
'\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base_header"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-field-label\'>\n  <span data-rv-text="model.' +
((__t = ( Formbuilder.options.mappings.LABEL )) == null ? '' : __t) +
'"></span>\n  <code class=\'field-type\' data-rv-text=\'model.' +
((__t = ( Formbuilder.options.mappings.FIELD_TYPE )) == null ? '' : __t) +
'\'></code>\n  <span class=\'icon-arrow-right pull-right\'></span>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p +=
((__t = ( Formbuilder.templates['edit/base_header']() )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf: rf}) )) == null ? '' : __t) +
'\n';
 if(rf.get('field_type') == 'heading' || rf.get('field_type') == 'free_text_html') { ;
__p += '\n' +
((__t = ( Formbuilder.templates['edit/conditions']({ rf:rf, opts:opts }))) == null ? '' : __t) +
'\n';
 } ;


}
return __p
};

this["Formbuilder"]["templates"]["edit/canvas_options"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Set Attributes</div>\n\nWidth\n<input type="number" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.CANVAS_WIDTH )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\nHeight\n<input type="number" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.CANVAS_HEIGHT )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;';

}
return __p
};

this["Formbuilder"]["templates"]["edit/capture"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Options</div>\n\n<label>\n  <input id=\'include_middle_name_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\' type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_PHOTO )) == null ? '' : __t) +
'\' />\n  Include "Photo"\n</label>\n\n<label>\n  <input id=\'include_middle_name_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\' type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_VIDEO )) == null ? '' : __t) +
'\' />\n  Include "Video"\n</label>\n\n<label>\n  <input id=\'include_middle_name_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\' type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_AUDIO )) == null ? '' : __t) +
'\' />\n  Include "Audio"\n</label>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/checkboxes"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<label>\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.REQUIRED )) == null ? '' : __t) +
'\' />\n  Required\n</label>\n<label>\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.ADMIN_ONLY )) == null ? '' : __t) +
'\' />\n  Admin only access\n</label>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/common"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Label</div>\n\n<div class=\'fb-common-wrapper\'>\n  <div class=\'fb-label-description span11\'>\n    ' +
((__t = ( Formbuilder.templates['edit/label_description']() )) == null ? '' : __t) +
'\n  </div>\n  <div class=\'fb-common-checkboxes span12\'>\n    ' +
((__t = ( Formbuilder.templates['edit/checkboxes']() )) == null ? '' : __t) +
'\n  </div>\n  <div class=\'fb-clear\'></div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/conditions"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Conditions</div>\n\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.MATCH_CONDITIONS )) == null ? '' : __t) +
'">\n  <option value="or">Select Matching</option>\n  <option value="and">Match All Conditions</option>\n  <option value="or">Match Any Conditions</option>\n</select>\n\n<div class=\'subtemplate-wrapper\' >\n  <div class=\'condition\' data-rv-each-condition=\'model.conditions\'>\n    <div class=\'row-fluid\' data-rv-show="condition:isSource">\n      <span class=\'fb-field-label fb-field-condition-label span1 fb-min-width-10\'> If </span>\n      <div class="span8">\n        <select data-rv-value=\'condition:source\'>\n          <option value="">Select Field</option>\n          ';
 opts.parentView.collection.sort();;
__p += '\n          ';
 for( var i=0 ; i < opts.parentView.collection.length ; i++){;
__p += '\n            ';
 if(opts.parentView.collection.toJSON()[i].cid == rf.getCid()){ ;
__p += '\n              ';
 break ;
__p += '\n            ';
 } ;
__p += '\n            <option value="' +
((__t = ( opts.parentView.collection.toJSON()[i].cid )) == null ? '' : __t) +
'">' +
((__t = ( opts.parentView.collection.toJSON()[i].label )) == null ? '' : __t) +
'</option>\n          ';
};
__p += '\n        </select>\n      </div>\n      <span class=\'fb-field-label fb-field-condition-label span2\'> field </span>\n      <div class="span6">\n        <select data-rv-value=\'condition:condition\'>\n            <option value="">Select Comparator</option>\n            <option>equals</option>\n            <option>greater than</option>\n            <option>less than</option>\n            <option>is not empty</option>\n        </select>\n      </div>\n      <input class=\'span5 pull-right\' data-rv-input=\'condition:value\' type=\'text\'/>\n      <span class=\'fb-field-label fb-field-condition-label span2 fb-min-width-40\'> then </span>\n      <div class="span8">\n        <select data-rv-value=\'condition:action\'>\n            <option value="">Select Action</option>\n            <option>show</option>\n            <option>hide</option>\n        </select>\n      </div>\n      <div class="span8 fb-this-field-div">\n        <input type=\'text\' class=\'fb-this-field-input\' disabled value=\'This Field\'>\n      </div>\n      <a class="pull-right js-remove-condition ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Remove Condition"><i class=\'icon-minus-sign\'></i></a>\n    </div>\n  </div>\n</div>\n\n<div class=\'fb-bottom-add\'>\n  <a class="js-add-condition ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">Add Condition</a>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/country_code"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Country Code</div>\n\n<input id=\'' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'_country_code\' type="text" data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.COUNTRY_CODE )) == null ? '' : __t) +
'"/>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/date_format"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Date Format</div>\n\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.DATE_FORMAT )) == null ? '' : __t) +
'">\n  <option value="dd/mm/yy">dd/mm/yy</option>\n  <option value="mm/dd/yy">mm/dd/yy</option>\n</select>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/date_only"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Date Only</div>\n\n<label>\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.DATE_ONLY )) == null ? '' : __t) +
'\' />\n  only date field\n</label>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/datetime_difference_labels"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Labels</div>\n<div class="control-group">\n  <label class="control-label">First Value</label>\n  <div class="controls">\n    <input type="text" pattern="^[\\w]+[\\w\\s ]*" data-rv-input=\n      "model.' +
((__t = ( Formbuilder.options.mappings.START_DATE_TIME_TEXT )) == null ? '' : __t) +
'"\n      value=\'Start Date Time\' placeholder="Start Date Time"/>\n  </div>\n</div>\n<div class="control-group">\n  <label class="control-label">Second Value</label>\n  <div class="controls">\n    <input type="text" pattern="^[\\w]+[\\w\\s ]*" data-rv-input=\n      "model.' +
((__t = ( Formbuilder.options.mappings.END_DATE_TIME_TEXT )) == null ? '' : __t) +
'"\n      value=\'End Date Time\' placeholder="End Date Time"/>\n  </div>\n</div>\n<div class="control-group">\n  <label class="control-label">Difference</label>\n  <div class="controls">\n    <input type="text" pattern="^[\\w]+[\\w\\s ]*" data-rv-input=\n      "model.' +
((__t = ( Formbuilder.options.mappings.DATETIME_DIFFERENCE_TEXT )) == null ? '' : __t) +
'"\n      value=\'Difference\' placeholder="Difference"/>\n  </div>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/default_address"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Default Address</div>\n\n<div class=\'input-line span12\' >\n  <span class="span11">\n    <label>Street Address</label>\n    <input type="text" id="address_edit_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'"\n      class=\'span12\'\n      data-address="' +
((__t = ( rf.get(Formbuilder.options.mappings.DEFAULT_ADDRESS))) == null ? '' : __t) +
'"\n      data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.DEFAULT_ADDRESS )) == null ? '' : __t) +
'"\n    />\n  </span>\n</div>\n<div class=\'input-line span12\' >\n  <span class="span11">\n    <label>Suburb/City</label>\n    <input type="text" id="city_edit_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'"\n      class=\'span12\'\n      data-city="' +
((__t = ( rf.get(Formbuilder.options.mappings.DEFAULT_CITY))) == null ? '' : __t) +
'"\n      data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.DEFAULT_CITY )) == null ? '' : __t) +
'"\n    />\n  </span>\n</div>\n<div class=\'input-line span12\' >\n  <span class="span11">\n    <label>State / Provience / Region</label>\n    <input type="text" id="dropdown_country_edit_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'"\n      class=\'span12\'\n      data-state="' +
((__t = ( rf.get(Formbuilder.options.mappings.DEFAULT_STATE))) == null ? '' : __t) +
'"\n      data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.DEFAULT_STATE )) == null ? '' : __t) +
'"\n    />\n  </span>\n</div>\n<div class=\'input-line span12\' >\n  <span class="span11">\n    <label>Postal/Zip Code</label>\n    <input type="text" id="dropdown_country_edit_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'"\n      class=\'span12\' pattern="[a-zA-Z0-9]+"\n      data-zipcode="' +
((__t = ( rf.get(Formbuilder.options.mappings.DEFAULT_ZIPCODE))) == null ? '' : __t) +
'"\n      data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.DEFAULT_ZIPCODE )) == null ? '' : __t) +
'"\n    />\n  </span>\n</div>\n<div class=\'input-line span12\' >\n  <span class="span11">\n    <label>Select Default Country</label>\n    <select id="dropdown_country_edit_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'"\n      class=\'dropdown_country span12 bfh-selectbox bfh-countries\'\n      data-country="' +
((__t = ( rf.get(Formbuilder.options.mappings.DEFAULT_COUNTRY))) == null ? '' : __t) +
'"\n      data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.DEFAULT_COUNTRY )) == null ? '' : __t) +
'"\n    ></select>\n  </span>\n</div>\n<script>\n  $(function() {\n    $("#dropdown_country_edit_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'").bfhcount();\n  });\n</script>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/default_number_value"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Default Value</div>\n\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.DEFAULT_NUM_VALUE )) == null ? '' : __t) +
'" style="width: 30px" />';

}
return __p
};

this["Formbuilder"]["templates"]["edit/default_paragraph_value"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Default value</div>\n\n<textarea data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.DEFAULT_VALUE )) == null ? '' : __t) +
'"></textarea>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/default_value_hint"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Default value</div>\n\n<input type="text" pattern="[a-zA-Z0-9_\\\\s]+" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.DEFAULT_VALUE )) == null ? '' : __t) +
'"/>\n\n<div class=\'fb-edit-section-header\'>Hint/Placeholder</div>\n\n<input type="text" pattern="[a-zA-Z0-9_\\\\s]+" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.HINT )) == null ? '' : __t) +
'"/>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/first_label_value"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="control-group">\n  <label class="control-label">First </label>\n  <div class="controls">\n    <input type="text" pattern="^[\\w]+[\\w\\s ]*" data-rv-input=\n      "model.' +
((__t = ( Formbuilder.options.mappings.FULLNAME_FIRST_TEXT )) == null ? '' : __t) +
'"\n      value=\'First\' placeholder="First"/>\n  </div>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/full_name_label_values"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-common-wrapper\'>\n  <div class=\'fb-label-description span11\'>\n    ' +
((__t = ( Formbuilder.templates['edit/prefix_label_value']() )) == null ? '' : __t) +
'\n    ' +
((__t = ( Formbuilder.templates['edit/first_label_value']() )) == null ? '' : __t) +
'\n    ' +
((__t = ( Formbuilder.templates['edit/middle_label_value']({ rf: rf }) )) == null ? '' : __t) +
'\n    ' +
((__t = ( Formbuilder.templates['edit/last_label_value']() )) == null ? '' : __t) +
'\n    ' +
((__t = ( Formbuilder.templates['edit/suffix_label_value']({ rf: rf }) )) == null ? '' : __t) +
'\n  </div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/image_options"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Options</div>\n\nWidth\n<input type="number" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.IMAGEWIDTH )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\nHeight\n<input type="number" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.IMAGEHEIGHT )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\n<div class=\'fb-edit-section-header\'>Align</div>\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.IMAGEALIGN )) == null ? '' : __t) +
'">\n  <option value="left">left</option>\n  <option value="center">center</option>\n  <option value="right">right</option>\n</select>\n\n\n<div class=\'fb-edit-section-header\'>Image Link</div>\n<input type=\'url\' pattern="https?://.+" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.IMAGELINK )) == null ? '' : __t) +
'" placeholder=\'http://\'/>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/integer_only"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Integer only</div>\n<label>\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INTEGER_ONLY )) == null ? '' : __t) +
'\' />\n  Only accept integers\n</label>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/label_description"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<input type=\'text\' data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.LABEL )) == null ? '' : __t) +
'\' />\n<textarea data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.DESCRIPTION )) == null ? '' : __t) +
'\'\n  placeholder=\'Add a longer description to this field\'></textarea>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/last_label_value"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="control-group">\n  <label class="control-label">Last </label>\n  <div class="controls">\n    <input type="text" pattern="^[\\w]+[\\w\\s ]*"\n    data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.FULLNAME_LAST_TEXT )) == null ? '' : __t) +
'"\n    value=\'Last\' placeholder="Last"/>\n  </div>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/mask_value"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Mask Value</div>\n\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MASK_VALUE )) == null ? '' : __t) +
'" placeholder="(00) 0000-0000"/>\n<label>0: numbers only</label>\n<label>A: alphanumeric</label>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/middle"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Options</div>\n\n';
 if (typeof includeOther !== 'undefined'){ ;
__p += '\n  <label>\n    <input id=\'include_middle_name_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\' type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_OTHER )) == null ? '' : __t) +
'\' />\n    Include "Middle Name"\n  </label>\n';
 } ;
__p += '\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/middle_label_value"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="control-group" id=\'middle_name_div_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\'\n  style= \'' +
((__t = ( rf.get(Formbuilder.options.mappings.INCLUDE_OTHER) ? 'display:block' : 'display:none' )) == null ? '' : __t) +
'\' >\n  <label class="control-label">Middle </label>\n  <div class="controls">\n    <input type="text" pattern="^[\\w]+[\\w\\s ]*"\n     data-rv-input=\n     "model.' +
((__t = ( Formbuilder.options.mappings.FULLNAME_MIDDLE_TEXT )) == null ? '' : __t) +
'"\n     value=\'Middle\' placeholder="Middle"/>\n  </div>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/min_max_length"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<form>\n  <div class=\'fb-edit-section-header\'>Characters Limit</div>\n\n  Min\n  <input id="min_' +
((__t = (rf.getCid())) == null ? '' : __t) +
'" type="number" min="0" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MINLENGTH )) == null ? '' : __t) +
'" style="width: 30px" />\n\n  &nbsp;&nbsp;\n\n  Max\n  <input id="max_' +
((__t = (rf.getCid())) == null ? '' : __t) +
'" type="number" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MAXLENGTH )) == null ? '' : __t) +
'" style="width: 30px" />\n\n  &nbsp;&nbsp;\n\n  <input class="fb-clear-min-max" type="reset" value="clear">\n</form>\n\n<script>\n  $(function() {\n    $("#min_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'").change(function(){\n      $("#max_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'").attr(\'min\',$(this).val())\n      if (parseInt($(this).val()) < 0){\n        $(this).val(0)\n      }\n    });\n    $("#max_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'").change(function(){\n      if (parseInt($(this).val()) < parseInt($(\'#min_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\').val()) || parseInt($(this).val()) < 0){\n        $(this).val(\'\')\n      }\n    });\n  });\n</script>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/min_max_step"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Minimum / Maximum</div>\n\nAbove\n<input type="number" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MIN )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\nBelow\n<input type="number" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MAX )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\nStep\n<input type="number" step=\'any\' data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.STEP )) == null ? '' : __t) +
'" style="width: 30px" />\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/optional_title"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Options</div>\n\n<label>\n\t<input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.OPTIONAL_FIELD )) == null ? '' : __t) +
'\' />\n    Show Label\n</label>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/options"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Options</div>\n\n';
 if (typeof includeBlank !== 'undefined'){ ;
__p += '\n  <label>\n    <input type=\'checkbox\' id=\'include_empty_option_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_BLANK )) == null ? '' : __t) +
'\' />\n    Include blank\n  </label>\n  ';
 if (typeof rf !== 'undefined'){ ;
__p += '\n    <div class="control-group" id=\'empty_option_div_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\'\n      style= \'' +
((__t = ( rf.get(Formbuilder.options.mappings.INCLUDE_BLANK) ? 'display:block' : 'display:none' )) == null ? '' : __t) +
'\' >\n      <div class="controls">\n        <input class="empty-option-text" type="text" pattern="^[\\w]+[\\w\\s ]*"\n         data-rv-input=\n         "model.' +
((__t = ( Formbuilder.options.mappings.EMPTY_OPTION_TEXT )) == null ? '' : __t) +
'"\n         value=\'Select Option\' placeholder="Empty option text"/>\n      </div>\n    </div>\n  ';
 } ;
__p += '\n';
 } ;
__p += '\n\n<div class=\'option\' data-rv-each-option=\'model.' +
((__t = ( Formbuilder.options.mappings.OPTIONS )) == null ? '' : __t) +
'\'>\n  <input type="checkbox" class=\'js-default-updated\' data-rv-checked="option:checked" />\n  <input type="text" data-rv-input="option:label" class=\'option-label-input\' />\n  <a class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Add Option"><i class=\'icon-plus-sign\'></i></a>\n  <a class="js-remove-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Remove Option"><i class=\'icon-minus-sign\'></i></a>\n</div>\n\n';
 if (typeof includeOther !== 'undefined'){ ;
__p += '\n  <label>\n    <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_OTHER )) == null ? '' : __t) +
'\' />\n    Include "other"\n  </label>\n';
 } ;
__p += '\n\n<div class=\'fb-bottom-add\'>\n  <a class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">Add option</a>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/prefix_label_value"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="control-group">\n  <label class="control-label">Prefix </label>\n  <div class="controls">\n    <input type="text" pattern="^[\\w]+[\\w\\s ]*" data-rv-input=\n      "model.' +
((__t = ( Formbuilder.options.mappings.FULLNAME_PREFIX_TEXT )) == null ? '' : __t) +
'"\n       value=\'Prefix\' placeholder="Prefix"/>\n  </div>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/scale_rating_options"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Options</div>\n\n<div class=\'row-fluid\'>\n  <span class="fb-field-label">Starting Point:</span>\n  <input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.STARTING_POINT_TEXT )) == null ? '' : __t) +
'" class=\'option-label-input span3\' />\n</div>\n\n<div class=\'row-fluid\'>\n  <span class="fb-field-label scale_rating_label">Ending Point:</span>\n  <input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.ENDING_POINT_TEXT )) == null ? '' : __t) +
'" class=\'option-label-input span3\' />\n</div>\n\n<div class=\'option\' data-rv-each-option=\'model.' +
((__t = ( Formbuilder.options.mappings.OPTIONS )) == null ? '' : __t) +
'\'>\n  <input type="checkbox" class=\'js-default-updated\' data-rv-checked="option:checked" />\n  <a class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Add Option"><i class=\'icon-plus-sign\'></i></a>\n  <a class="js-remove-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Remove Option"><i class=\'icon-minus-sign\'></i></a>\n</div>\n\n<div class=\'fb-bottom-add\'>\n  <a class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">Add option</a>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/size"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Size</div>\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.SIZE )) == null ? '' : __t) +
'">\n  <option value="small">Small</option>\n  <option value="medium">Medium</option>\n  <option value="large">Large</option>\n</select>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/step"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Step</div>\n\n<input type="number" min=\'1\' placeholder="1" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.STEP )) == null ? '' : __t) +
'" style="width: 40px" /> Stepping for minute\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/suffix"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (typeof includeSuffix !== 'undefined'){ ;
__p += '\n  <label>\n    <input id=\'include_suffix_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\' type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_SUFFIX )) == null ? '' : __t) +
'\' />\n    Include "Suffix"\n  </label>\n';
 } ;
__p += '\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/suffix_label_value"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="control-group" id=\'suffix_div_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\'\n  style= \'' +
((__t = ( rf.get(Formbuilder.options.mappings.INCLUDE_SUFFIX) ? 'display:block' : 'display:none' )) == null ? '' : __t) +
'\' >\n  <label class="control-label">Suffix </label>\n  <div class="controls">\n    <input type="text" pattern="^[\\w]+[\\w\\s ]*"\n    data-rv-input=\n     "model.' +
((__t = ( Formbuilder.options.mappings.FULLNAME_SUFFIX_TEXT )) == null ? '' : __t) +
'"\n    value=\'Suffix\' placeholder="Suffix"/>\n  </div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/time_format"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Time Format</div>\n\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.TIME_FORMAT )) == null ? '' : __t) +
'">\n  <option value="HH:mm">HH:mm</option>\n  <option value="HH:mm:ss">HH:mm:ss</option>\n</select>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/time_only"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Time Only</div>\n\n<label>\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.TIME_ONLY )) == null ? '' : __t) +
'\' />\n  only time field\n</label>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/units"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Units</div>\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.UNITS )) == null ? '' : __t) +
'" />\n';

}
return __p
};

this["Formbuilder"]["templates"]["page"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (!opts.live) { ;
__p += '\n' +
((__t = ( Formbuilder.templates['partials/save_button']() )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.templates['partials/left_side']() )) == null ? '' : __t) +
'\n';
 } ;
__p += '\n' +
((__t = ( Formbuilder.templates['partials/right_side']({opts: opts}) )) == null ? '' : __t) +
'\n';
 if (!opts.live) { ;
__p += '\n<div class=\'fb-clear\'></div>\n';
 } ;
__p += '\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/add_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'fb-tab-pane active\' id=\'addField\'>\n  <div class=\'fb-add-field-types\'>\n    <div class=\'section\'>\n      ';
 for (i in Formbuilder.inputFields) { 
         if(Formbuilder.inputFields[i].getFieldType) { } else { ;
__p += '\n              <a data-field-type="' +
((__t = ( i )) == null ? '' : __t) +
'" class="' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">\n                ' +
((__t = ( Formbuilder.inputFields[i].addButton )) == null ? '' : __t) +
'\n              </a>\n            \n      ';
 } };
__p += '\n    </div>\n\n    <div class=\'section\'>\n      ';
 for (i in Formbuilder.nonInputFields) { ;
__p += '\n        <a data-field-type="' +
((__t = ( i )) == null ? '' : __t) +
'" class="' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">\n          ' +
((__t = ( Formbuilder.nonInputFields[i].addButton )) == null ? '' : __t) +
'\n        </a>\n      ';
 } ;
__p += '\n    </div>\n  </div>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/edit_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-tab-pane\' id=\'editField\'>\n  <div class=\'fb-edit-field-wrapper\'></div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/left_side"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-left\'>\n  <ul class=\'fb-tabs\'>\n    <li class=\'active\'><a data-target=\'#addField\'>Add new field</a></li>\n    <li><a data-target=\'#editField\'>Edit field</a></li>\n  </ul>\n\n  <div class=\'fb-tab-content\'>\n    ' +
((__t = ( Formbuilder.templates['partials/add_field']() )) == null ? '' : __t) +
'\n    ' +
((__t = ( Formbuilder.templates['partials/edit_field']() )) == null ? '' : __t) +
'\n  </div>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/right_side"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if(opts && opts.live) { ;
__p += '\n<form enctype="multipart/form-data"\n  id=\'formbuilder_form\'\n  class=\'fb-right-live\'\n  ';
 if(opts.submitUrl) { ;
__p += '\n  action="' +
((__t = ( opts.submitUrl )) == null ? '' : __t) +
'"\n  ';
 } ;
__p += '\n  method="post">\n';
 } else { ;
__p += '\n<div class=\'fb-right\'>\n';
 } ;
__p += '\n  <div class=\'fb-no-response-fields\'>\n    <div class=\'input-line nav_help_user\'>\n      <div class=\'nav_help_user_new_form\'></div>\n      <label>Select or drag and drop to add</label>\n    </div>\n  </div>\n  <div class=\'fb-response-fields\'></div>\n  ';
 if(opts && opts.submitUrl) { ;
__p += '\n  <input type="submit" value="Submit">\n  ';
 } ;
__p += '\n\n  ';
 for (l in (opts.hidden || {})) { ;
__p += '\n  <input type="hidden" name=' +
((__t = ( l)) == null ? '' : __t) +
' value=' +
((__t = ( opts.hidden[l])) == null ? '' : __t) +
'>\n  ';
 } ;
__p += '\n';
 if(opts && opts.live) { ;
__p += '\n</form>\n';
 } else { ;
__p += '\n</div>\n';
 } ;
__p += '\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/save_button"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-save-wrapper\'>\n  <button class=\'js-save-form ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'\'></button>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["view/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'subtemplate-wrapper\'>\n  ';
 if(opts.readonly){ ;
__p += '\n  <div class=\'cover\'></div>\n  ';
 } ;
__p += '\n  ' +
((__t = ( Formbuilder.templates['view/label']({rf: rf, opts: opts}) )) == null ? '' : __t) +
'\n\n  ';
 if (rf.get(Formbuilder.options.mappings.FIELD_TYPE) == 'checkboxes' ||
      rf.get(Formbuilder.options.mappings.FIELD_TYPE) == 'radio'){ ;
__p += '\n    ' +
((__t = ( Formbuilder.templates['view/description']({rf: rf}) )) == null ? '' : __t) +
'\n    ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf, opts: opts}) )) == null ? '' : __t) +
'\n  ';
 } else { ;
__p += '\n    ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf, opts: opts}) )) == null ? '' : __t) +
'\n    ' +
((__t = ( Formbuilder.templates['view/description']({rf: rf}) )) == null ? '' : __t) +
'\n  ';
 } ;
__p += '\n\n  ';
 if(!opts.live){ ;
__p += '\n  ' +
((__t = ( Formbuilder.templates['view/duplicate_remove']({rf: rf}) )) == null ? '' : __t) +
'\n  ';
 } ;
__p += '\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'subtemplate-wrapper\'>\n  <div class=\'cover\'></div>\n  ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf}) )) == null ? '' : __t) +
'\n  ';
 if(!opts.live){ ;
__p += '\n  ' +
((__t = ( Formbuilder.templates['view/duplicate_remove']({rf: rf}) )) == null ? '' : __t) +
'\n  ';
 } ;
__p += '\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/base_print"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if(opts.readonly && opts.view_type != 'print'){ ;
__p += '\n<div class=\'cover\'></div>\n';
 } ;
__p += '\n';
 if($.inArray(rf.get(Formbuilder.options.mappings.FIELD_TYPE), Formbuilder.options.PRINT_FIELDS_AS_SINGLE_ROW) != -1){ ;
__p += '\n  <td colspan=2 class="first_cell">\n    <span class="print-label">\n      ' +
((__t = ( Formbuilder.templates['view/label']({rf: rf, opts: opts}) )) == null ? '' : __t) +
'\n    </span>\n    <span class="print-description">\n      ' +
((__t = ( Formbuilder.templates['view/description']({rf: rf}) )) == null ? '' : __t) +
'\n    </span>\n    ';
 if (typeof Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].print === 'function'){ ;
__p += '\n      ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].print({rf: rf, opts: opts}) )) == null ? '' : __t) +
'\n    ';
 } else { ;
__p += '\n      ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf, opts: opts}) )) == null ? '' : __t) +
'\n    ';
 } ;
__p += '\n  </td>\n';
 } else { ;
__p += '\n  <td class="first_cell">\n    <span class="print-label">\n    ' +
((__t = ( Formbuilder.templates['view/label']({rf: rf, opts: opts}) )) == null ? '' : __t) +
'\n    </span>\n    <span class="print-description">\n    ' +
((__t = ( Formbuilder.templates['view/description']({rf: rf}) )) == null ? '' : __t) +
'\n    </span>\n  </td>\n  <td class=\'_' +
((__t = ( rf.get(Formbuilder.options.mappings.FIELD_TYPE) )) == null ? '' : __t) +
'\'>\n  ';
 if (typeof Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].print === 'function'){ ;
__p += '\n    ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].print({rf: rf, opts: opts}) )) == null ? '' : __t) +
'\n  ';
 } else { ;
__p += '\n    ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf, opts: opts}) )) == null ? '' : __t) +
'\n  ';
 } ;
__p += '\n  </td>\n';
 } ;
__p += '\n\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/base_print_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n<td colspan=2>\n  ';
 if (typeof Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].print === 'function'){ ;
__p += '\n\t' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].print({rf: rf}) )) == null ? '' : __t) +
'\n  ';
 } else { ;
__p += '\n\t' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf}) )) == null ? '' : __t) +
'\n  ';
 } ;
__p += '\n  ';
 if(!opts.live){ ;
__p += '\n  ' +
((__t = ( Formbuilder.templates['view/duplicate_remove']({rf: rf}) )) == null ? '' : __t) +
'\n  ';
 } ;
__p += '\n</td>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/description"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<span class=\'help-block\'>\n  ' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.DESCRIPTION)) )) == null ? '' : __t) +
'\n</span>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/duplicate_remove"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'actions-wrapper\'>\n  <a class="js-duplicate ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Duplicate Field"><i class=\'icon-plus-sign\'></i></a>\n  <a class="js-clear ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Remove Field"><i class=\'icon-minus-sign\'></i></a>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["view/label"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<label>\n  <span>' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.LABEL)) )) == null ? '' : __t) +
'\n  ';
 if (rf.get(Formbuilder.options.mappings.REQUIRED)) { ;
__p += '\n    <abbr title=\'required\'>*</abbr>\n  ';
 } ;
__p += '\n  ';
 if(rf.get('field_type') == 'esignature' || (rf.get('field_type') == 'esignature' && (typeof(Android) != 'undefined' || typeof(BRIJavaScriptInterface) != 'undefined')) ) {
      if(opts.view_type != 'print'){
   ;
__p += '\n    ';
 var lbl_info_to_show = 'click here to sign',
        esign_cid = rf.get('cid');
      if (rf.get('field_values') && rf.get('field_values')[rf.get('cid')+'_1']){
        lbl_info_to_show = 'click here to change';
      }
    ;
__p += '\n    <span class=\'label_info\'>' +
((__t = ( lbl_info_to_show )) == null ? '' : __t) +
'</span>\n  ';
 }
  } ;
__p += '\n</label>\n\n';

}
return __p
};