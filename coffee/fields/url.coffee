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

  defaultAttributes: (attrs) ->
    attrs.field_options.size = 'medium'
    attrs

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