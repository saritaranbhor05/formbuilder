Formbuilder.registerField 'number',
  caption: 'Number'
  view: """
    <input type='number'/>
    <% if (units = rf.get(Formbuilder.options.mappings.UNITS)) { %>
      <%= units %>
    <% } %>
  """

  edit: """
    <%= Formbuilder.templates['edit/min_max_step']() %>
    <%= Formbuilder.templates['edit/units']() %>
    <%= Formbuilder.templates['edit/default_number_value']() %>
    <%= Formbuilder.templates['edit/integer_only']() %>
  """

  addButton: """
    <span class="symbol"><span class="icon-number">123</span></span> Number
  """

  print: """
    <label id="number_print"></label>
  """

  setValForPrint: (field_view, model) ->
    field_view.$el.find('#number_print').html(model.get('field_values')["#{model.getCid()}_1"]);

  checkAttributeHasValue: (cid, $el) ->
    return false if($el.find('input[type=number]').val() == "")
    return cid

  defaultAttributes: (attrs) ->
    attrs.field_options.size = 'small'
    attrs

  setup: (field_view, model) ->
    el = field_view.$el.find('input')
    if model.get(Formbuilder.options.mappings.MIN)
      el.attr("min", model.get(Formbuilder.options.mappings.MIN))
    if model.get(Formbuilder.options.mappings.MAX)
      el.attr("max", model.get(Formbuilder.options.mappings.MAX))

    if !model.get(Formbuilder.options.mappings.INTEGER_ONLY) and model.get(Formbuilder.options.mappings.STEP)
      if model.get(Formbuilder.options.mappings.STEP)
        el.attr("step", model.get(Formbuilder.options.mappings.STEP))
      else
        el.attr("step",'any')
    else if !model.get(Formbuilder.options.mappings.INTEGER_ONLY)
      el.attr("step",'any')
    else
      if model.get(Formbuilder.options.mappings.STEP)
        rounded_value = Math.round(model.get(Formbuilder.options.mappings.STEP))
        el.attr("step", rounded_value)

    if model.get(Formbuilder.options.mappings.DEFAULT_NUM_VALUE)
      el.val(model.get(Formbuilder.options.mappings.DEFAULT_NUM_VALUE))

    if model.get('field_values')
      el.val(model.get('field_values')["#{model.getCid()}_1"])

    if el.val() != ''
      field_view.trigger('change_state')

  clearFields: ($el, model) ->
    do($input = $el.find("[name = " + model.getCid() + "_1]")) =>
      $input.val("")
      if model.get(Formbuilder.options.mappings.DEFAULT_NUM_VALUE)
        $input.val(model.get(Formbuilder.options.mappings.DEFAULT_NUM_VALUE))

  evalCondition: (clicked_element, cid, condition, set_value) ->
    do(
      check_result=false
    ) =>
      elem_val = clicked_element
                          .find("[name = "+cid+"_1]").val()
      if isNaN(parseInt(elem_val)) || isNaN(parseInt(set_value))
        check_result = false
      else
        check_result = condition("'#{elem_val}'", "'#{set_value}'")
      check_result

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)
