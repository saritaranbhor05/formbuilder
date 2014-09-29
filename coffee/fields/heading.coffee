Formbuilder.registerField 'heading',

  type: 'non_input'

  view: """
    <label id='<%= rf.getCid() %>' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'>
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

  print: """
    <label id='<%= rf.getCid() %>' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %> print-heading'>
      <%= rf.get(Formbuilder.options.mappings.LABEL) %>
    </label>
    <p class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'>
      <%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %>
    </p>
  """

  addButton: """
    <span class='symbol'><span class='icon-font'></span></span> Heading
  """

  clearFields: ($el, model) ->
    $el.find('#' + model.getCid()).text('')

  evalCondition: (clicked_element, cid, condition, set_value) ->
    do(
      check_result=false
    ) =>
      elem_val = clicked_element
                          .find("#"+cid).text()
      elem_val = elem_val.replace(/(\r\n|\n|\r)/gm,'')
      elem_val = elem_val.trimLeft()
      check_result = condition("'#{elem_val}'", "'#{set_value}'")
      check_result

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("#"+cid)
            .attr("required", required)

  defaultAttributes: (attrs) ->
    attrs.field_options.size = 'medium'
    attrs
