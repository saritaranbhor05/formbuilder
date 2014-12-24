Formbuilder.registerField 'paragraph',
  caption: 'Paragraph'
  view: """
    <textarea class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'></textarea>
  """

  print: """
    <label id="paragraph_print"></label>
  """

  edit: """
    <%= Formbuilder.templates['edit/size']() %>
    <%= Formbuilder.templates['edit/min_max_length']({rf:rf}) %>
    <%= Formbuilder.templates['edit/default_paragraph_value']() %>
  """

  addButton: """
    <span class="symbol">&#182;</span> Paragraph
  """

  checkAttributeHasValue: (cid, $el) ->
    return false if($el.find('textarea').val() == "")
    return cid

  defaultAttributes: (attrs) ->
    attrs.field_options.size = 'medium'
    attrs

  android_bindevents: (field_view) ->
    do(el = field_view.$el.find('textarea')) =>
      el.focus (event) =>
        el.css('width', '100%')
        $('#grid_div').animate( {
          scrollTop: el.offset().top + $('#grid_div').scrollTop() - 20
        }, 1000)

      $(el).bind "input propertychange", ->
        do(maxLength = $(this).attr("maxlength")) =>
          if maxLength && $(this).val().length > maxLength
            $(this).val $(this).val().substring(0, maxLength)
        return

  setup: (field_view, model) ->
    el = field_view.$el.find('textarea')
    if model.get(Formbuilder.options.mappings.MINLENGTH)
      do(min_length = model.get(Formbuilder.options.mappings.MINLENGTH)) ->
        el.attr("pattern", "[a-zA-Z0-9_\\s]{#{min_length},}")
    if model.get(Formbuilder.options.mappings.MAXLENGTH)
      el.attr("maxlength", model.get(Formbuilder.options.mappings.MAXLENGTH))
    if model.get(Formbuilder.options.mappings.DEFAULT_VALUE)
      el.val(model.get(Formbuilder.options.mappings.DEFAULT_VALUE))
    if model.get('field_values')
      el.val(model.get('field_values')["#{model.getCid()}_1"])
    if field_view.$el.find('textarea').val() != ''
      field_view.trigger('change_state')

  clearFields: ($el, model) ->
    do($input = $el.find("[name = " + model.getCid() + "_1]")) =>
      $input.val("")
      if model.get(Formbuilder.options.mappings.DEFAULT_VALUE)
        $input.val(model.get(Formbuilder.options.mappings.DEFAULT_VALUE))
        $input.val(model.get(Formbuilder.options.mappings.DEFAULT_VALUE))

  setValForPrint: (field_view, model) ->
    field_view.$el.find('#paragraph_print').html(model.get('field_values')["#{model.getCid()}_1"]);

  evalCondition: (clicked_element, cid, condition, set_value) ->
    do(
      check_result=false
    ) =>
      elem_val = clicked_element
                          .find("[name = "+cid+"_1]").val()
      check_result = condition("'#{elem_val}'", "'#{set_value}'")
      check_result

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)

  isValid: ($el, model) ->
    do(valid = false) =>
      valid = do (required_attr = model.get('required'), textarea_char_cnt = 0,
        min_length = model.get(Formbuilder.options.mappings.MINLENGTH),
        max_length = model.get(Formbuilder.options.mappings.MAXLENGTH)) =>
        textarea_char_cnt = $el.find('textarea').val().length
        return true if !required_attr && textarea_char_cnt == 0
        if !min_length && !max_length
          return false if textarea_char_cnt == 0
          return true
        else if min_length && max_length
          return textarea_char_cnt >= parseInt(min_length) && textarea_char_cnt <= parseInt(max_length)
        else if min_length
          return textarea_char_cnt >= parseInt(min_length)
        else if max_length
          return textarea_char_cnt <= parseInt(max_length)
        return true
      valid
