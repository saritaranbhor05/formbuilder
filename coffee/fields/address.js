// Generated by CoffeeScript 1.7.1
(function() {
  Formbuilder.registerField('address', {
    view: "<div class='input-line'>\n  <span class=\"span6\">\n    <input type='text' id='address'/>\n    <label>Street Address</label>\n  </span>\n</div>\n\n<div class='input-line'>\n  <span class=\"span3\">\n    <input class=\"span12\" type='text' id='suburb'/>\n    <label>Suburb/City</label>\n  </span>\n\n  <span class=\"span3\">\n    <input class=\"span12\" type='text' id='state'/>\n    <label>State / Province / Region</label>\n  </span>\n</div>\n\n<div class='input-line' >\n  <span>\n    <input class=\"span12\" id='zipcode' type='text' pattern=\"[a-zA-Z0-9]+\"/>\n    <label>Postal/Zip Code</label>\n  </span>\n\n  <span>\n    <select id=\"file_<%= rf.getCid() %>\"\n      data-country=\"<%= rf.get(Formbuilder.options.mappings.DEFAULT_COUNTRY)%>\"\n      class='span7 dropdown_country bfh-selectbox bfh-countries'\n    ></select>\n    <label>Country</label>\n  </span>\n</div>\n\n<script>\n  $(function() {\n    $(\"#file_<%= rf.getCid() %>\").bfhcount();\n  });\n</script>",
    edit: "<div class='fb-edit-section-header'>Options</div>\n\n<div class='input-line span12' >\n  <span class=\"span11\">\n    <label>Select Default Country</label>\n    <select id=\"dropdown_country_edit_<%= rf.getCid() %>\"\n      class='dropdown_country span12 bfh-selectbox bfh-countries'\n      data-country=\"<%= rf.get(Formbuilder.options.mappings.DEFAULT_COUNTRY)%>\"\n      data-rv-value=\"model.<%= Formbuilder.options.mappings.DEFAULT_COUNTRY %>\"\n    ></select>\n  </span>\n</div>\n<script>\n  $(function() {\n    $(\"#dropdown_country_edit_<%= rf.getCid() %>\").bfhcount();\n  });\n</script>",
    addButton: "<span class=\"symbol\"><span class=\"icon-home\"></span></span> Address",
    clearFields: function($el, model) {
      $el.find("#address").val("");
      $el.find("#suburb").val("");
      $el.find("#state").val("");
      return $el.find("#zipcode").val("");
    },
    evalCondition: function(clicked_element, cid, condition, set_value) {
      return (function(_this) {
        return function(check_result, check_match_condtions, elem_val) {
          if (condition === '!=') {
            check_result = clicked_element.find("#address").val() !== '' && clicked_element.find("#suburb").val() !== '' && clicked_element.find("#state").val() !== '' && clicked_element.find("[name=" + cid + "_4]") !== '';
          } else {
            elem_val = clicked_element.find("#address").val();
            check_result = eval("'" + elem_val + "' " + condition + " '" + set_value + "'");
          }
          return check_result;
        };
      })(this)(false, [], '');
    },
    add_remove_require: function(cid, required) {
      $("." + cid).find("[name = " + cid + "_1]").attr("required", required);
      $("." + cid).find("[name = " + cid + "_2]").attr("required", required);
      $("." + cid).find("[name = " + cid + "_3]").attr("required", required);
      return $("." + cid).find("[name = " + cid + "_4]").attr("required", required);
    }
  });

}).call(this);
