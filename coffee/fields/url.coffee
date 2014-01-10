Formbuilder.registerField 'url',

  view: """
    <input type='url' pattern="https?://.+" class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' placeholder='http://' />
  """

  edit: """
    <%= Formbuilder.templates['edit/size']() %>
  """

  addButton: """
    <span class="symbol"><span class="icon-link"></span></span> URL
  """
  clearFields: ($el, model) ->
    $el.find("[name = " + model.getCid() + "_1]").val("");
