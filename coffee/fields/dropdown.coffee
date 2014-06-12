Formbuilder.registerField 'dropdown',

  view: """
    <% if(Formbuilder.isAndroid()) { %>
      <input id="<%= rf.getCid() %>" dropdown="dropdown" name="<%= rf.getCid() %>" readonly="true"></input>
    <% } else { %>
    <select id="dropdown">
      <% if (rf.get(Formbuilder.options.mappings.INCLUDE_BLANK)) { %>
        <% var empty_opt_text = (rf.get(Formbuilder.options.mappings.EMPTY_OPTION_TEXT) || '') %>
        <option value=''><%= empty_opt_text %></option>
      <% } %>

      <% var field_options = (rf.get(Formbuilder.options.mappings.OPTIONS) || []) %>
      <% for ( var i = 0 ; i < field_options.length ; i++) { %>
        <option value="<%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>" <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'selected' %>>
          <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>
        </option>
      <% } %>
    </select>
    <% } %>
  """

  edit: """
    <%= Formbuilder.templates['edit/options']({ includeBlank: true, rf:rf }) %>
    <script >
      $(function() {
        $('#include_empty_option_<%= rf.getCid() %>').click(function(e) {
          var $target = $(e.currentTarget),
          $empty_option_div = $('#empty_option_div_<%= rf.getCid() %>');
          if ($target.is(':checked')) {
            $empty_option_div.show();
          } else {
            $empty_option_div.hide();
          }
        });
      });
    </script>
  """

  addButton: """
    <span class="symbol"><span class="icon-caret-down"></span></span> Dropdown
  """

  print: """
    <label id="dropdown_print"></label>
  """

  setValForPrint: (field_view, model) ->
    field_view.$el.find('#dropdown_print').html(model.get('field_values')["#{model.getCid()}_1"]);

  checkAttributeHasValue: (cid, $el) ->
    return false if $el.find('select').val() == ''
    return cid

  defaultAttributes: (attrs) ->
    attrs.field_options.options = [
      label: "",
      checked: false
    ,
      label: "",
      checked: false
    ]

    attrs.field_options.include_blank_option = false
    attrs.field_options.size = 'small'
    attrs

  evalCondition: (clicked_element, cid, condition, set_value) ->
    do( 
      check_result=false
    ) =>
    elem_val = clicked_element
                          .find("[name = "+cid+"_1]").val()
    if (typeof elem_val is 'number')
      elem_val = parseInt elem_val
      set_value = parseInt set_value
    check_result = condition(elem_val, set_value)
    check_result
  
  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required) 

  setup: (field_view, model, edit_fs_model) ->
    if model.attributes.field_values
      if Formbuilder.isAndroid()
        if model.attributes.field_values["#{model.getCid()}_1"] == '' && model.attributes.field_options.include_blank_option
          field_view.$el.find("input").val(model.attributes.field_options.empty_option_text)
          field_view.$el.find("input").data('id','')
        else
          field_view.$el.find("input").val(model.attributes.field_values["#{model.getCid()}_1"])
          field_view.$el.find("input").data('id',model.attributes.field_values["#{model.getCid()}_1"])
      else
        field_view.$el.find("select").val(model.attributes.field_values["#{model.getCid()}_1"])
    else if model.attributes.field_options && Formbuilder.isAndroid()
      do(opt = model.attributes.field_options.options) ->
        if opt[0]
          field_view.$el.find("input").val(opt[0].label)
          field_view.$el.find("input").data('id',opt[0].label)
        if model.attributes.field_options.include_blank_option
          field_view.$el.find("input").val(model.attributes.field_options.empty_option_text)
          field_view.$el.find("input").data('id','')
        for e in opt
          do(e) ->
            if e.checked
              field_view.$el.find("input").val(e.label)
              field_view.$el.find("input").data('id',e.label)
    do(field_dom = field_view.$el.find('select')) ->
      if field_dom.length > 0 && field_dom.val() != ''
        field_view.trigger('change_state')
      else if Formbuilder.isAndroid() && field_view.$el.find('input').val() != ""
        field_view.trigger('change_state')
