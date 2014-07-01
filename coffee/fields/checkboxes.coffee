Formbuilder.registerField 'checkboxes',

  view: """
    <% var field_options = (rf.get(Formbuilder.options.mappings.OPTIONS) || []) %>
    <% for ( var i = 0 ; i < field_options.length ; i++) { %>
      <div>
        <label class='fb-option'>
          <input type='checkbox' value='<%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label%>' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> />
          <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>
        </label>
      </div>
    <% } %>

    <% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>
      <div class='other-option'>
        <label class='fb-option'>
          <input class='other-option' type='checkbox' value="__other__"/>
          Other
        </label>

        <input type='text' />
      </div>
    <% } %>
  """

  edit: """
    <%= Formbuilder.templates['edit/options']({ includeOther: true }) %>
  """

  print: """
    <% var field_options = rf.get(Formbuilder.options.mappings.OPTIONS) || [],
       cnt = field_options.length,
       labelArr = [],
       field_values =  rf.get('field_values'),
       cid =  rf.get('cid');
    %>
    <% _.each(field_options, function(option){ %>
      <% labelArr.push(option.label) %>
    <% }) %>
    <% if(field_values){ %>
      <% for(var index = 0, values_length = Object.keys(field_values).length; index < values_length; index++) { %>
        <% var input_val = field_values[cid + '_'+ (index+1)]; %>
        <% if(input_val){ %>
          <label>
          <% if(labelArr[index]) %>
            <%= labelArr[index] %>
          <% else if(typeof(input_val) == 'string' && input_val.trim() != '') %>
            <%= input_val %>
          </label>
        <% } %>
      <% } %>
    <% } %>
  """

  addButton: """
    <span class="symbol"><span class="icon-check-empty"></span></span> Checkboxes
  """

  checkAttributeHasValue: (cid, $el) ->
    return false if($el.find('input:checked').length <= 0)
    if $el.find('input:checked').last().val() == '__other__'
      return false if($el.find('input:text').val() == '')
    return cid

  defaultAttributes: (attrs) ->
    attrs.field_options.options = [
      label: "",
      checked: false
    ,
      label: "",
      checked: false
    ]

    attrs

  isValid: ($el, model) ->
    do(valid = false) =>
      valid = do (required_attr = model.get('required'), checked_chk_cnt = 0) =>
        return true if !required_attr
        checked_chk_cnt = $el.find('input:checked').length
        if $($el.find('input:checked').last()).val() == '__other__'
          return $el.find('input:text').val() != ''
        return checked_chk_cnt > 0
      valid

  clearFields: ($el, model) ->
    for elem in $el.find('input:checked')
      elem.checked = false

  evalCondition: (clicked_element, cid, condition, set_value) ->
    do(
       elem_val = '' ,
       check_result = false
    ) =>
      elem_val = clicked_element.find("input[value = '" + set_value+"']").is(':checked')
      check_result = condition(elem_val, true)
      check_result

  add_remove_require:(cid,required) ->
    do (checked_chk_cnt = 0) =>
      for i, input_elem in $el.find('input:checked').length
        $("." + cid)
                .find("[name = "+cid+"_1]")
                .attr("required", required)
