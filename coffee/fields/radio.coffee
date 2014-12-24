Formbuilder.registerField 'radio',
  caption: 'Radio Button'
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
      <% var field_options = rf.get(Formbuilder.options.mappings.OPTIONS) || [],
          all_attr =  rf.get('field_values'),
          labelArr = [], opt1, opt2, cid =  rf.get('cid');
        _.each(field_options, function(option){
          labelArr.push(option.label)
        });
        opt1 = _.pick(all_attr, labelArr);
        opt2 = _.pick(all_attr, ['__other__', cid + '_1']);
        _.extend(opt1, opt2);
      %>
      <% if(opt1){ %>
        <% for(var k in opt1){ %>
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

  fieldToValue: ($el, model) ->
    do(all_elem = $el.find('[name^='+model.getCid()+']'),
      res = {}) ->
      _.each all_elem, (elem) ->
        do($elem = $(elem)) ->
          if $elem.is(":radio")
            res[$elem.val()] = $elem.is(":checked")
          else
            res[$elem.attr('name')] = $elem.val()
      res

  setup: (field_view, model) ->
    if model.get('field_values')
      do( val_hash = model.get('field_values')) ->
        _.each val_hash, (val, key) ->
          do(target_elemnt = field_view.$el.find(":radio[value='"+key+"']")) ->
            if target_elemnt.is(":radio")
              target_elemnt.prop('checked',val)
            else
              field_view.$el.find("input[name="+key+"]").val(val)
    else if model.get('field_options')
      do( options = model.get('field_options').options,
          cid = model.getCid() ) ->
        _.each options, (val, index) ->
          if val.checked
            field_view.$el.find(":radio[value="+val.label+"]").prop("checked", true)
    if field_view.$el.find('input[type=radio]:checked')
      field_view.trigger('change_state')

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
    $el.find('input:text').val('')

  evalCondition: (clicked_element, cid, condition, set_value) ->
    do(
       elem_val = '' ,
       check_result = false
    ) =>
      elem_val = clicked_element.find("[value = '" + set_value+"']").is(':checked')
      if elem_val
        check_result =  condition(elem_val, true)
      else if clicked_element.find("[value = '__other__']").is(':checked')
        elem_val = clicked_element.find('input[type=text]').val()
        check_result =  condition(elem_val, set_value)
      check_result
