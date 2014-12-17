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
      <% if(Formbuilder.isAndroid()) { %>
        <input id="file_<%= rf.getCid() %>" addr_section="country" name="file_<%= rf.getCid() %>" data-country="<%= rf.get(Formbuilder.options.mappings.DEFAULT_COUNTRY)%>" readonly="true"></input>
      <% }else { %>
        <select id="file_<%= rf.getCid() %>"
          data-country="<%= rf.get(Formbuilder.options.mappings.DEFAULT_COUNTRY)%>"
          class='span7 dropdown_country bfh-selectbox bfh-countries'
        ></select>
      <% } %>
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

  print: """
    <table class="innerTbl">
      <tbody>
        <tr>
          <td>
            <label>Street Address</label>
          </td>
          <td>
            <label>Suburb/City</label>
          </td>
          <td>
            <label>State / Province / Region</label>
          </td>
          <td>
            <label>Postal/Zip Code</label>
          </td>
          <td>
            <label>Country</label>
          </td>
        </tr>
        <tr id="values">
          <td>
            <label id="address"></label>
          </td>
          <td>
            <label id="suburb"></label>
          </td>
          <td>
            <label id="state"></label>
          </td>
          <td>
            <label id="zipcode"></label>
          </td>
          <td>
            <select id="file_<%= rf.getCid() %>"
              data-country="<%= rf.get(Formbuilder.options.mappings.DEFAULT_COUNTRY)%>"
              class='span7 dropdown_country bfh-selectbox bfh-countries'
            ></select>
          </td>
        </tr>
      </tbody>
    </table>
    <script>
      $(function() {
        $("#file_<%= rf.getCid() %>").bfhcount();
      });
    </script>
  """

  addButton: """
    <span class="symbol"><span class="icon-home"></span></span> Address
  """

  checkAttributeHasValue: (cid, $el)->
    do(incomplete = false) =>
      call_back = ->
        incomplete = true if($(this).val() == "")
      $el.find("input[type=text]").each(call_back)
      incomplete = true if($el.find('select').val() == "")
      return false if(incomplete == true)
      return cid

  clearFields: ($el, model) ->
    do(_that = @) =>
      $el.find("#address").val(_that.check_and_return_val(model, Formbuilder.options.mappings.DEFAULT_ADDRESS))
      $el.find("#suburb").val(_that.check_and_return_val(model, Formbuilder.options.mappings.DEFAULT_CITY))
      $el.find("#state").val(_that.check_and_return_val(model, Formbuilder.options.mappings.DEFAULT_STATE))
      $el.find("#zipcode").val(_that.check_and_return_val(model, Formbuilder.options.mappings.DEFAULT_ZIPCODE))
      $el.find('input[data-country]').val('') # Clear selection of country input

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

  fieldToValue: ($el, model) ->
    do(all_elem = $el.find('[name^='+model.getCid()+']'),
      res = {}) ->
      _.each all_elem, (elem) ->
        do($elem = $(elem)) ->
          if $elem.attr('addr_section')
            res[$elem.attr('name')] = $elem.data('id')
          else
            res[$elem.attr('name')] = $elem.val()
      res

  android_setup: (field_view, model) ->
    do(that = @, $str_add = field_view.$el.find("#address")) =>
      if model.attributes.field_values
        field_view.$el.find("#address").val(model.attributes.field_values["#{model.getCid()}_1"])
        field_view.$el.find("#suburb").val(model.attributes.field_values["#{model.getCid()}_2"])
        field_view.$el.find("#state").val(model.attributes.field_values["#{model.getCid()}_3"])
        field_view.$el.find("#zipcode").val(model.attributes.field_values["#{model.getCid()}_4"])
        if(!_.isUndefined(Android.f2dgetCountryFullName))
          do(sel_contry_abbr = model.attributes.field_values["#{model.getCid()}_5"],
            $con_el = field_view.$el.find('input[data-country]')) =>
            $con_el.val(Android.f2dgetCountryFullName(sel_contry_abbr))
            $con_el.data('id', sel_contry_abbr)
      else
        that.clearFields(field_view.$el, model)
      if $str_add.val() != ''
        field_view.trigger('change_state')

  setup: (field_view, model) ->
    do(that = @, $str_add = field_view.$el.find("#address")) =>
      if model.attributes.field_values
        field_view.$el.find("#address").val(model.attributes.field_values["#{model.getCid()}_1"])
        field_view.$el.find("#suburb").val(model.attributes.field_values["#{model.getCid()}_2"])
        field_view.$el.find("#state").val(model.attributes.field_values["#{model.getCid()}_3"])
        field_view.$el.find("#zipcode").val(model.attributes.field_values["#{model.getCid()}_4"])
        field_view.$el.find("select").val(model.attributes.field_values["#{model.getCid()}_5"])
      else
        that.clearFields(field_view.$el, model)
      if $str_add.val() != ''
        field_view.trigger('change_state')

  setValForPrint: (field_view, model) ->
    do (
      fields = field_view.$el.find('#values').find('label'),
      values = model.get('field_values'),
      i = 0
    ) =>
      for key of values
        $(fields[i]).html(values["#{model.getCid()}_#{++i}"]);
