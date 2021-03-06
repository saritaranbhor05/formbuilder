Formbuilder.registerField 'url',
  caption: 'URL'
  view: """
    <input type='url' pattern="https?://.+" class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' placeholder='http://' />
  """

  edit: """
    <%= Formbuilder.templates['edit/size']() %>
  """

  addButton: """
    <span class="symbol"><span class="icon-link"></span></span> URL
  """

  print: """
    <label id="url_print"></label>
  """

  setValForPrint: (field_view, model) ->
    field_view.$el.find('#url_print').html(model.get('field_values')["#{model.getCid()}_1"]);


  checkAttributeHasValue: (cid, $el)->
    return false if($el.find("input[type=url]").val() == "")
    return cid

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
                          .find("input[name = "+cid+"_1]").val()
      check_result =  condition("'#{elem_val}'", "'set_value'")
      check_result

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)