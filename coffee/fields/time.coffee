Formbuilder.registerField 'time',

  view: """
    <div class='input-line'>
      <input type="time" />
    </div>
  """

  edit: """
    <%= Formbuilder.templates['edit/step']() %>
  """

  addButton: """
    <span class="symbol"><span class="icon-time"></span></span> Time
  """

  setup: (el, model, index) ->
    if model.get(Formbuilder.options.mappings.STEP)
      el.attr("step", model.get(Formbuilder.options.mappings.STEP))
