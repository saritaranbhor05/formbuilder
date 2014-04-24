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

  addButton: """
    <span class="symbol"><span class="icon-dollar"></span></span> Price
  """

  isAnyAttributeEmpty: (cid, $el)->
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
      if(eval "#{firstValue} #{condition} #{secondValue}")
        true

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)
    $("." + cid)
            .find("[name = "+cid+"_2]")
            .attr("required", required)                