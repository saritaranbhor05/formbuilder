Formbuilder.registerField 'address',

  view: """
    <div class='input-line'>
      <span>
        <input type='text' id='address'/>
        <label>Address</label>
      </span>
    </div>

    <div class='input-line'>
      <span>
        <input type='text' id='suburb'/>
        <label>Suburb</label>
      </span>

      <span>
        <input type='text' id='state'/>
        <label>State / Province / Region</label>
      </span>
    </div>

    <div class='input-line' id='zipcode'>
      <span>
        <input type='text' pattern="[a-zA-Z0-9]+"/>
        <label>Zipcode</label>
      </span>

      <span>
        <select class='dropdown_country'><option>United States</option></select>
        <label>Country</label>
      </span>
    </div>
  """

  edit: ""

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
      