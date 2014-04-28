Formbuilder.registerField 'paragraph',

  view: """
    <textarea class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'></textarea>
  """

  edit: """
    <%= Formbuilder.templates['edit/size']() %>
    <%= Formbuilder.templates['edit/min_max_length']({rf:rf}) %>
    <%= Formbuilder.templates['edit/default_paragraph_value']() %>
  """

  addButton: """
    <span class="symbol">&#182;</span> Paragraph
  """

  defaultAttributes: (attrs) ->
    attrs.field_options.size = 'medium'
    attrs

  setup: (field_view, model) ->
    el = field_view.$el.find('textarea')
    if model.get(Formbuilder.options.mappings.MINLENGTH)
      do(min_length = model.get(Formbuilder.options.mappings.MINLENGTH)) ->
        el.attr("pattern", "[a-zA-Z0-9_\\s]{#{min_length},}")
    if model.get(Formbuilder.options.mappings.MAXLENGTH)
      el.attr("maxlength", model.get(Formbuilder.options.mappings.MAXLENGTH))
    if model.get(Formbuilder.options.mappings.DEFAULT_VALUE)
      el.text(model.get(Formbuilder.options.mappings.DEFAULT_VALUE))
    el.focus (event) =>
      if Formbuilder.isAndroid()
        el.css('width', '100%')
        $('#grid_div').animate( {
          scrollTop: el.offset().top + $('#grid_div').scrollTop() - 20
        }, 1000)
    if model.get('field_values')
      el.val(model.get('field_values')["#{model.getCid()}_1"])

  clearFields: ($el, model) ->
    do($input = $el.find("[name = " + model.getCid() + "_1]")) =>
      $input.val("")
      if model.get(Formbuilder.options.mappings.DEFAULT_VALUE)
        $input.text(model.get(Formbuilder.options.mappings.DEFAULT_VALUE))
        $input.val(model.get(Formbuilder.options.mappings.DEFAULT_VALUE))

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
      valid = do (required_attr = model.get('required'), textarea_char_cnt = 0) =>
        return true if !required_attr
        textarea_char_cnt = $el.find('textarea').val().length
        if model.get(Formbuilder.options.mappings.MINLENGTH)
          return textarea_char_cnt >= parseInt(model.get(Formbuilder.options.mappings.MINLENGTH))
        else
          return true
      valid
