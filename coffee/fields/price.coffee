Formbuilder.registerField 'price',

  view: """
    <div class='input-line'>
      <span class='above-line'>$</span>
      <span class='dolars'>
        <input type='text' pattern="[0-9]+" />
        <label>Dollars</label>
      </span>
      <span class='above-line'>.</span>
      <span class='cents'>
        <input type='text' pattern="[0-9]+" />
        <label>Cents</label>
      </span>
    </div>
  """

  edit: ""

  print: """
    <div>
     <% var all_attr =  rf.get('field_values') %>
     <% var cid =  rf.get('cid') %>
     <% if(all_attr && all_attr.length == 2){ %>
     <label class='above-line'>$</label>
     <label><%= all_attr[cid + '_1'] %></label>
     <label class='above-line'>.</label>
     <label><%= all_attr[cid + '_2'] %></label>
     <% } %>
    </div>
  """

  addButton: """
    <span class="symbol"><span class="icon-dollar"></span></span> Price
  """

  checkAttributeHasValue: (cid, $el)->
    incomplete = false
    cb = (k,v) ->
      if(v.value == "")
        incomplete = true
    $el.find("input[type=text]").each(cb);

    if(incomplete == true)
      return false
    else
      return cid

  clearFields: ($el, model) ->
    $el.find("[name = " + model.getCid() + "_1]").val("")

  evalCondition: (clicked_element, cid, condition, set_value) ->
    do(  
       firstValue = '' ,
       check_result = false,
       secondValue = '',
       is_true = false                  
    ) =>
      elem_val = clicked_element
                          .find("[name = "+cid+"_1]").val()
      firstValue = parseInt elem_val
      secondValue = parseInt set_value
      check_result = condition(firstValue, secondValue)
      check_result

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)
    $("." + cid)
            .find("[name = "+cid+"_2]")
            .attr("required", required)                