Formbuilder.registerField 'number',

  view: """
    <input type='number' />
    <% if (units = rf.get(Formbuilder.options.mappings.UNITS)) { %>
      <%= units %>
    <% } %>
  """

  edit: """
    <%= Formbuilder.templates['edit/min_max']() %>
    <%= Formbuilder.templates['edit/units']() %>
    <%= Formbuilder.templates['edit/integer_only']() %>
  """

  addButton: """
    <span class="symbol"><span class="icon-number">123</span></span> Number
  """

  setup: (el, model, index) ->
    if model.get(Formbuilder.options.mappings.MIN)
      el.attr("min", model.get(Formbuilder.options.mappings.MIN))
    if model.get(Formbuilder.options.mappings.MAX)
      el.attr("max", model.get(Formbuilder.options.mappings.MAX))
