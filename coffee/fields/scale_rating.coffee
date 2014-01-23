Formbuilder.registerField 'scale_rating',

  view: """
    <% var field_options = (rf.get(Formbuilder.options.mappings.OPTIONS) || []) %>
    <div class='row-fluid'>
      <label class='span1 scale_rating_text'>
        <%= rf.get(Formbuilder.options.mappings.STARTING_POINT_TEXT) %>
      </label>
      <div>
        <% for ( var i = 0 ; i < field_options.length ; i++) { %>
          <div class="span1 scale_rating">
            <%= i+1 %>
            <div class="divider"></div>
            <label class='fb-option'>
              <input type='radio' value='<%= i+1 %>' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %>/>
            </label>
          </div>
        <% } %>
      </div>
      <label class='span1 scale_rating_text'>
        <%= rf.get(Formbuilder.options.mappings.ENDING_POINT_TEXT) %>
      </label>
    </div>
  """

  edit: """
    <%= Formbuilder.templates['edit/scale_rating_options']() %>
  """

  addButton: """
    <span class="symbol"><span class="icon-circle-blank"></span></span> Scale Rating
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
      elem_val = clicked_element.find("[value = " + set_value+"]").is(':checked')
      check_result = eval("'#{elem_val}' #{condition} 'true'")
      check_result
