Formbuilder.registerField 'dropdown',

  view: """
    <select id="dropdown">
      <% if (rf.get(Formbuilder.options.mappings.INCLUDE_BLANK)) { %>
        <% var empty_opt_text = (rf.get(Formbuilder.options.mappings.EMPTY_OPTION_TEXT) || '') %>
        <option value=''><%= empty_opt_text %></option>
      <% } %>

      <% var field_options = (rf.get(Formbuilder.options.mappings.OPTIONS) || []) %>
      <% for ( var i = 0 ; i < field_options.length ; i++) { %>
        <option <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'selected' %>>
          <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>
        </option>
      <% } %>
    </select>
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

  checkAttributeHasValue: (cid, $el) ->
    if $el.find('select').val() == ''
      return false
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
    if(condition == '<')
      if(elem_val < set_value)
        true
      else
        false  
    else if(condition == '>')
      if(elem_val > set_value)
        true
      else
        false
    else
      if(elem_val is set_value)
        true
      else
        false
  
  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)    