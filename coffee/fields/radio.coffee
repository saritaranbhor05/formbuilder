Formbuilder.registerField 'radio',

  view: """
    <% var field_options = (rf.get(Formbuilder.options.mappings.OPTIONS) || []) %>
    <% for ( var i = 0 ; i < field_options.length ; i++) { %>
      <div>
        <label class='fb-option'>
          <input type='radio' value='<%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %>/>
          <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>
        </label>
      </div>
    <% } %>

    <% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>
      <div class='other-option'>
        <label class='fb-option'>
          <input class='other-option' type='radio' value="__other__"/>
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
    <div>
     <% var all_attr =  rf.get('field_values') %>
     <% var cid =  rf.get('cid') %>
     <% if(all_attr){ %>
        <% for(var k in all_attr){ %>
          <% if(all_attr[k]){ %>
            <label>
              <% if(k == '__other__') { %>
                <%= all_attr[cid + '_1'] %>
              <% } else { %>
                <%=  k %>
              <% } %>
            </label>
        <% break;} %>
        <% } %>
     <% } %>
    </div>
  """

  addButton: """
    <span class="symbol"><span class="icon-circle-blank"></span></span> Radio Button
  """

  defaultAttributes: (attrs) ->
    # @todo
    attrs.field_options.options = [
      label: "",
      checked: false
    ,
      label: "",
      checked: false
    ]

    attrs

  checkAttributeHasValue: (cid, $el)->
    return false if($el.find('input:checked').length <= 0)

    if $el.find('input:checked').val() == '__other__'
      return false if($el.find('input:text').val() == '')
    return cid

  isValid: ($el, model) ->
    do(valid = false) =>
      valid = do (required_attr = model.get('required'), checked_chk_cnt = 0) =>
        return true if !required_attr
        checked_chk_cnt = $el.find('input:checked').length
        if $el.find('input:checked').val() == '__other__'
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
      elem_val = clicked_element.find("[value = '" + set_value+"']").is(':checked')
      check_result =  condition(elem_val, true)
      check_result
