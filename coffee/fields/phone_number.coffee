Formbuilder.registerField 'phone_number',

  view: """
    <input id='<%= rf.getCid() %>phone' type='tel'/>
  """

  edit: """
  	<%= Formbuilder.templates['edit/country_code']({rf:rf}) %>
    <script>
      $(function() {
        var pref_countries = ["au", "gb", "us"];
        var ph_no_conf = Formbuilder.options.FIELD_CONFIGS['phone_number'];
        if(!_.isUndefined(ph_no_conf) && ph_no_conf['preferredCountries']) {
          pref_countries = ph_no_conf['preferredCountries'];
        }
        $('#<%= rf.getCid() %>_country_code').intlTelInput({
            autoHideDialCode: false,
            preferredCountries: pref_countries
        });
        $("#<%= rf.getCid() %>_country_code").val();
        $("#<%= rf.getCid() %>_country_code").trigger('change');
      });
    </script>
    <%= Formbuilder.templates['edit/area_code']() %>
  	<%= Formbuilder.templates['edit/mask_value']() %>
  """

  addButton: """
    <span class="symbol"><span class="icon-phone"></span></span> Phone Number
  """

  print: """
    <label id="phone_print"></label>
  """

  setValForPrint: (field_view, model) ->
    field_view.$el.find('#phone_print').html(model.get('field_values')["#{model.getCid()}_1"]);

  checkAttributeHasValue: (cid, $el) ->
    return false if($el.find('input[type=tel]').val() == "")
    return cid

  setup: (field_view, model) ->
	  do(mask_value = false , country_code = false, country_code_set='') =>
		  country_code = model.get(Formbuilder.options.mappings.COUNTRY_CODE)
		  mask_value = model.get(Formbuilder.options.mappings.MASK_VALUE)
		  if country_code and mask_value
		  	$('#'+model.getCid()+'phone').val(country_code+')')
		  else if country_code
		  	$('#'+model.getCid()+'phone').val(country_code)
		  country_code_set = $('#'+model.getCid()+'phone').val()
		  area_code = model.get(Formbuilder.options.mappings.AREA_CODE)
		  if area_code and mask_value
		  	$('#'+model.getCid()+'phone').val(country_code_set+area_code+')')
		  else if area_code
		  	$('#'+model.getCid()+'phone').val(country_code_set+area_code)
		  if mask_value
		  	$('#'+model.getCid()+'phone').mask(mask_value)
    if model.get('field_values')
      field_view.$el.find('input').val(model.get('field_values')["#{model.getCid()}_1"])
    if field_view.$el.find('input').val() != ''
      field_view.trigger('change_state')

  clearFields: ($el, model) ->
  	$el.find("[name = " + model.getCid() + "_1]").val("")

  evalCondition: (clicked_element, cid, condition, set_value) ->
    do(
      check_result=false
    ) =>
      elem_val = clicked_element
                          .find("[name = "+cid+"_1]").val()
      check_result = condition("'#{elem_val}'", "'#{set_value}'")
      check_result

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)