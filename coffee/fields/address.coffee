Formbuilder.registerField 'address',

  view: """
    <div class='input-line'>
      <span class="span6">
        <input type='text' id='address' class='span12' value="<%= rf.get(Formbuilder.options.mappings.DEFAULT_ADDRESS)%>"/>
        <label>Street Address</label>
      </span>
    </div>

    <div class='input-line'>
      <span class="span3">
        <input class="span12" type='text' id='suburb' value="<%= rf.get(Formbuilder.options.mappings.DEFAULT_CITY)%>"/>
        <label>Suburb/City</label>
      </span>

      <span class="span3">
        <input class="span12" type='text' id='state' value="<%= rf.get(Formbuilder.options.mappings.DEFAULT_STATE)%>"/>
        <label>State / Province / Region</label>
      </span>
    </div>

    <div class='input-line' >
      <span class="span3">
        <input class="span12" id='zipcode' type='text' pattern="[a-zA-Z0-9]+"
         value="<%= rf.get(Formbuilder.options.mappings.DEFAULT_ZIPCODE)%>"/>
        <label>Postal/Zip Code</label>
      </span>

      <span class="span3">
        <select id="file_<%= rf.getCid() %>"
          data-country="<%= rf.get(Formbuilder.options.mappings.DEFAULT_COUNTRY)%>"
          class='span7 dropdown_country bfh-selectbox bfh-countries'
        ></select>
        <label>Country</label>
      </span>
    </div>

    <script>
      $(function() {
        $("#file_<%= rf.getCid() %>").bfhcount();
      });
    </script>
  """

  edit: """
    <%= Formbuilder.templates['edit/default_address']({rf: rf}) %>
  """

  addButton: """
    <span class="symbol"><span class="icon-home"></span></span> Address
  """
  clearFields: ($el, model) ->
    do(_that = @) =>
      $el.find("#address").val(_that.check_and_return_val(model, Formbuilder.options.mappings.DEFAULT_ADDRESS))
      $el.find("#suburb").val(_that.check_and_return_val(model, Formbuilder.options.mappings.DEFAULT_CITY))
      $el.find("#state").val(_that.check_and_return_val(model, Formbuilder.options.mappings.DEFAULT_STATE))
      $el.find("#zipcode").val(_that.check_and_return_val(model, Formbuilder.options.mappings.DEFAULT_ZIPCODE))

  check_and_return_val: (model, val) ->
    model.get(val) || ''

  evalCondition: (clicked_element, cid, condition, set_value) ->
    do(
      check_result=false,
      check_match_condtions=[],
      elem_val = ''
    ) =>
      if(condition is '!=')
        check_result = ( clicked_element.find("#address").val() != '' &&
                   clicked_element.find("#suburb").val() != '' &&
                   clicked_element.find("#state").val() != '' &&
                   clicked_element.find("[name="+cid+"_4]") != '' )
      else
        elem_val = clicked_element.find("#address").val()
        check_result = condition("'#{elem_val}'", "'#{set_value}'")
      check_result

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)
    $("." + cid)
            .find("[name = "+cid+"_2]")
            .attr("required", required)
    $("." + cid)
            .find("[name = "+cid+"_3]")
            .attr("required", required)
    $("." + cid)
            .find("[name = "+cid+"_4]")
            .attr("required", required)
    $("." + cid)
            .find("[name = "+cid+"_5]")
            .attr("required", required)

  setup: (field_view, model) ->
    do($str_add = field_view.$el.find("#address")) =>
      if model.attributes.field_values
        field_view.$el.find("#address").val(model.attributes.field_values["#{model.getCid()}_1"])
        field_view.$el.find("#suburb").val(model.attributes.field_values["#{model.getCid()}_2"])
        field_view.$el.find("#state").val(model.attributes.field_values["#{model.getCid()}_3"])
        field_view.$el.find("#zipcode").val(model.attributes.field_values["#{model.getCid()}_4"])
        field_view.$el.find("select").val(model.attributes.field_values["#{model.getCid()}_5"])
      else
        @clearFields
      if $str_add.val() != ''
        field_view.trigger('change_state')