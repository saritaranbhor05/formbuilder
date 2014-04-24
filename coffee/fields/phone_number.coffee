Formbuilder.registerField 'phone_number',

  view: """
    <input id='<%= rf.getCid() %>phone' type='tel'/>
  """

  edit: """
  	<%= Formbuilder.templates['edit/country_code']({rf:rf}) %>
    <script>
      $(function() {
        $('#<%= rf.getCid() %>_country_code').intlTelInput({
            autoHideDialCode: false,
            preferredCountries: ["au", "gb", "us"]
        });
        $("#<%= rf.getCid() %>_country_code").val();
      });
    </script>
    <%= Formbuilder.templates['edit/area_code']() %>
  	<%= Formbuilder.templates['edit/mask_value']() %>
  """

  addButton: """
    <span class="symbol"><span class="icon-phone"></span></span> Phone Number
  """

  checkAttributeHasValue: (cid, $el) ->
    if ($el.find('input[type=tel]').val() == "")
      return false
    return cid

  setup: (el, model, index) ->
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

  clearFields: ($el, model) ->
  	$el.find("[name = " + model.getCid() + "_1]").val("")

  evalCondition: (clicked_element, cid, condition, set_value) ->
    do(
      check_result=false
    ) =>
      elem_val = clicked_element
                          .find("[name = "+cid+"_1]").val()
      check_result = eval("'#{elem_val}' #{condition} '#{set_value}'")
      check_result

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)