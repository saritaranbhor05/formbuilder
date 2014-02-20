Formbuilder.registerField 'heading',

  type: 'non_input'

  view: """
    <label class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'>
      <%= rf.get(Formbuilder.options.mappings.LABEL) %>
    </label>
    <p class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'>
      <%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %>
    </p>
  """

  edit: """
    <div class=''>Heading Title</div>
    <input type='text'
      data-rv-input='model.<%= Formbuilder.options.mappings.LABEL %>' />
    <textarea
      data-rv-input='model.<%= Formbuilder.options.mappings.DESCRIPTION %>'
      placeholder='Add a longer description to this field'>
    </textarea>
    <%= Formbuilder.templates['edit/size']() %>
  """

  addButton: """
    <span class='symbol'><span class='icon-font'></span></span> Heading
  """

  defaultAttributes: (attrs) ->
    attrs.field_options.size = 'medium'
    attrs
