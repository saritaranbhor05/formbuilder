Formbuilder.registerField 'paragraph',

  view: """
    <textarea class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'></textarea>
  """

  edit: """
    <%= Formbuilder.templates['edit/size']() %>
    <%= Formbuilder.templates['edit/min_max_length']({rf:rf}) %>
  """

  addButton: """
    <span class="symbol">&#182;</span> Paragraph
  """

  defaultAttributes: (attrs) ->
    attrs.field_options.size = 'small'
    attrs

  setup: (el, model, index) ->
    if model.get(Formbuilder.options.mappings.MINLENGTH)
      do(min_length = model.get(Formbuilder.options.mappings.MINLENGTH)) ->
        el.attr("pattern", "[a-zA-Z0-9_\\s]{#{min_length},}")
    if model.get(Formbuilder.options.mappings.MAXLENGTH)
      el.attr("maxlength", model.get(Formbuilder.options.mappings.MAXLENGTH))

  clearFields: ($el, model) ->
    $el.find("[name = " + model.getCid() + "_1]").val("")

  evalCondition: (clicked_element, cid, condition, set_value) ->
    do(
      check_result=false
    ) =>
      elem_val = clicked_element
                          .find("[name = "+cid+"_1]").val()
      check_result = eval("'#{elem_val}' #{condition} '#{set_value}'")
      check_result

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)

  isValid: ($el, model) ->
    do(valid = false) =>
      valid = do (required_attr = model.get('required'), textarea_char_cnt = 0) =>
        return true if !required_attr
        textarea_char_cnt = $el.find('textarea').val().length
        if model.get(Formbuilder.options.mappings.MINLENGTH)
          return textarea_char_cnt >= parseInt(model.get(Formbuilder.options.mappings.MINLENGTH))
      valid