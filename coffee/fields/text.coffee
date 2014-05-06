Formbuilder.registerField 'text',

  view: """
    <input
      type='text'
      class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'
    />
  """

  edit: """
    <%= Formbuilder.templates['edit/size']() %>
    <%= Formbuilder.templates['edit/min_max_length']({rf:rf}) %>
    <%= Formbuilder.templates['edit/default_value_hint']() %>
  """

  addButton: """
    <span class='symbol'><span class='icon-font'></span></span> Text Box
  """

  checkAttributeHasValue: (cid, $el)->
    return false if($el.find("input[type=text]").val() == "")
    return cid

  defaultAttributes: (attrs) ->
    attrs.field_options.size = 'medium'
    attrs

  setup: (field_view, model) ->
    el = field_view.$el.find('input')
    if model.get(Formbuilder.options.mappings.MINLENGTH)
      do(min_length = model.get(Formbuilder.options.mappings.MINLENGTH)) ->
        el.attr("pattern", "[a-zA-Z0-9_\\s]{#{min_length},}")
    if model.get(Formbuilder.options.mappings.MAXLENGTH)
      el.attr("maxlength", model.get(Formbuilder.options.mappings.MAXLENGTH))
    if model.get(Formbuilder.options.mappings.DEFAULT_VALUE)
      el.val(model.get(Formbuilder.options.mappings.DEFAULT_VALUE))
    if model.get(Formbuilder.options.mappings.HINT)
      el.attr("placeholder", model.get(Formbuilder.options.mappings.HINT))
    if model.get('field_values')
      el.val(model.get('field_values')["#{model.getCid()}_1"])

  clearFields: ($el, model) ->
    do($input = $el.find("[name = " + model.getCid() + "_1]")) =>
      $input.val("")
      if model.get(Formbuilder.options.mappings.DEFAULT_VALUE)
        $input.val(model.get(Formbuilder.options.mappings.DEFAULT_VALUE))

  evalCondition: (clicked_element, cid, condition, set_value) ->
    do(
      check_result=false
      elem_val = ''
    ) =>
      elem_val = clicked_element
                          .find("[name = "+cid+"_1]").val()
      check_result =  condition("'#{elem_val}'", "'set_value'")
      check_result

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)