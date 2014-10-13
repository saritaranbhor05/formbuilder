Formbuilder.registerField 'scale_rating',

  view: """
    <%var field_options = (rf.get(Formbuilder.options.mappings.OPTIONS) || [])%>
    <div class='row-fluid mobile-device'>
      <div class="scale_rating_min">
        <label>
          <%= rf.get(Formbuilder.options.mappings.STARTING_POINT_TEXT) %>
        </label>
      </div>
      <div>
        <% for ( var i = 0 ; i < field_options.length ; i++) { %>
          <div class="span1 scale_rating">
            <%= i+1 %>
            <label class='fb-option'>
              <input type='radio' value='<%= i+1 %>'
                <%=
                  rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked &&
                  'checked'
                %>
              />
            </label>
          </div>
        <% } %>
      </div>
      <div class="scale_rating_max">
        <label>
          <%= rf.get(Formbuilder.options.mappings.ENDING_POINT_TEXT) %>
        </label>
      </div>
    </div>
  """

  edit: """
    <%= Formbuilder.templates['edit/scale_rating_options']() %>
  """

  addButton: """
    <span class="symbol">
      <span class="icon-circle-blank"></span>
    </span> Scale Rating
  """

  checkAttributeHasValue: (cid, $el)->
    return false if($el.find('input:checked').length <= 0)
    return cid

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

  fieldToValue: ($el, model) ->
    do(all_elem = $el.find('[name='+model.getCid()+'_0]'),
      res = {}) ->
      _.each all_elem, (elem) ->
        do($elem = $(elem)) ->
          if $elem.is(":radio")
            res[$elem.val()] = $elem.is(":checked")
      res

  setup: (field_view, model) ->
    if model.get('field_values')
      do( val_hash = model.get('field_values')) ->
        _.each val_hash, (val, key) ->
          do(target_elemnt = field_view.$el.find(":radio[value="+key+"]")) ->
            if target_elemnt.is(":radio")
              target_elemnt.prop('checked',val)
    else if model.get('field_options')
      do( options = model.get('field_options').options,
          cid = model.getCid() ) ->
        _.each options, (val, index) ->
          if val.checked
            field_view.$el.find(":radio[value="+(index+1)+"]").prop("checked", true)

  clearFields: ($el, model) ->
    do(elem = '') =>
      for elem in $el.find('input:checked')
        elem.checked = false

  evalCondition: (clicked_element, cid, condition, set_value) ->
    do(
      elem_val = '' ,
      check_result = false
    ) =>
      elem_val = clicked_element.find("[value = " + set_value+"]").is(':checked')
      check_result =  condition("'#{elem_val}'", "'true'")
      check_result
