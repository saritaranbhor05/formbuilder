Formbuilder.registerField 'address',

  view: """
    <div class='input-line'>
      <span class="span6">
        <input type='text' id='address'/>
        <label>Street Address</label>
      </span>
    </div>

    <div class='input-line'>
      <span class="span3">
        <input class="span12" type='text' id='suburb'/>
        <label>Suburb/City</label>
      </span>

      <span class="span3">
        <input class="span12" type='text' id='state'/>
        <label>State / Province / Region</label>
      </span>
    </div>

    <div class='input-line' >
      <span class="span3">
        <input class="span12" id='zipcode' type='text' pattern="[a-zA-Z0-9]+"/>
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
    <div class='fb-edit-section-header'>Options</div>

    <div class='input-line span12' >
      <span class="span11">
        <label>Select Default Country</label>
        <select id="dropdown_country_edit_<%= rf.getCid() %>"
          class='dropdown_country span12 bfh-selectbox bfh-countries'
          data-country="<%= rf.get(Formbuilder.options.mappings.DEFAULT_COUNTRY)%>"
          data-rv-value="model.<%= Formbuilder.options.mappings.DEFAULT_COUNTRY %>"
        ></select>
      </span>
    </div>
    <script>
      $(function() {
        $("#dropdown_country_edit_<%= rf.getCid() %>").bfhcount();
      });
    </script>
  """

  addButton: """
    <span class="symbol"><span class="icon-home"></span></span> Address
  """
  clearFields: ($el, model) ->
    $el.find("#address").val("")
    $el.find("#suburb").val("")
    $el.find("#state").val("")
    $el.find("#zipcode").val("")

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
        check_result = eval("'#{elem_val}' #{condition} '#{set_value}'")
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
