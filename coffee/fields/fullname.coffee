Formbuilder.registerField 'fullname',
  prefix: ['Mr.', 'Mrs.', 'Miss.', 'Ms.', 'Mst.', 'Dr.']
  view: """
    <div class='input-line'>
    <% if(Formbuilder.isAndroid()) { %>
      <span class="rf-size-mini">
    <%}else {%>
      <span>
    <% } %>
      <% if(Formbuilder.isAndroid()) { %>
        <% var opt={};%>
        <% _.each(this.prefix, function(val,index){ %>
        <% var temp = {}; temp[val] = val ; opt[index] = temp; %>
        <% }); %>
        <input id="prefix_option_<%= rf.getCid()%>" value="<%= this.prefix[0] %>" readonly="readonly" data-prefixlist='<%= JSON.stringify(opt) %>'></input>
      <%} else { %>
        <select class='span12'>
          <% _.each(this.prefix, function(val){ %>
            <option><%= val %></option>
          <% }); %>
        </select>
      <% } %>
        <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_PREFIX_TEXT) || 'Prefix' %></label>
      </span>

      <span>
        <input id='first_name' type='text' pattern="[a-zA-Z]+"/>
        <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_FIRST_TEXT) || 'First' %></label>
      </span>

      <% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>
        <span id='middle_name_span_<%= rf.getCid() %>'>
          <input id='middle_name' type='text' pattern="[a-zA-Z]+"/>
          <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_MIDDLE_TEXT) || 'Middle' %></label>
        </span>
      <% } %>

      <span>
        <input id='last_name' type='text' pattern="[a-zA-Z]+"/>
        <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_LAST_TEXT) || 'Last' %></label>
      </span>

      <% if (rf.get(Formbuilder.options.mappings.INCLUDE_SUFFIX)) { %>
        <span>
          <input id='suffix' type='text'/>
          <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_SUFFIX_TEXT) || 'Suffix' %></label>
        </span>
      <% } %>
    </div>
  """

  edit: """
    <%= Formbuilder.templates['edit/middle']({ includeOther: true, rf:rf }) %>
    <%= Formbuilder.templates['edit/suffix']({ includeSuffix: false, rf:rf }) %>
    <%= Formbuilder.templates['edit/full_name_label_values']({ rf:rf }) %>
    <script >
      $(function() {
        $('#include_middle_name_<%= rf.getCid() %>').click(function(e) {
          var $target = $(e.currentTarget),
          $parent_middle_div = $('#middle_name_div_<%= rf.getCid() %>'),
          $middle_name_ip = $parent_middle_div.find('input'),
          $view_middle_name_lbl = $('#middle_name_span_<%= rf.getCid() %> label'),
          middle_text = '<%= rf.get(Formbuilder.options.mappings.FULLNAME_MIDDLE_TEXT) %>';
          if ($target.is(':checked')) {
            $parent_middle_div.show();
            $middle_name_ip.val(middle_text);
            $view_middle_name_lbl.text(middle_text || 'Middle');
          } else {
            $parent_middle_div.hide();
            $middle_name_ip.val('');
          }
        });
      });
    </script>
  """

  print: """
    <table class="innerTbl">
      <tbody>
        <tr>
          <td>
            <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_PREFIX_TEXT) || 'Prefix' %></label>
          </td>
          <td>
            <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_FIRST_TEXT) || 'First' %></label>
          </th>
          <% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>
            <td>
              <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_MIDDLE_TEXT) || 'Middle' %></label>
            </td>
          <% } %>
          <td>
            <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_LAST_TEXT) || 'Last' %></label>
          </td>
          <% if (rf.get(Formbuilder.options.mappings.INCLUDE_SUFFIX)) { %>
          <td>
            <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_SUFFIX_TEXT) || 'Suffix' %></label>
          </td>
          <% } %>
        </tr>
        <tr id="values">
          <td>
            <label id="prefix_print"></label>
          </td>
          <td>
            <label id="first_name_print"></label>
          </td>
          <% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>
          <td>
            <label id="middle_name_print"></label>
          </td>
          <% } %>
          <td>
            <label id="last_name_print"></label>
          </td>
          <% if (rf.get(Formbuilder.options.mappings.INCLUDE_SUFFIX)) { %>
          <td>
            <label id="suffix_print"></label>
          </td>
          <% } %>
        </tr>
      </tbody>
    </table>
  """

  addButton: """
    <span class="symbol"><span class="icon-user"></span></span> Full Name
  """

  checkAttributeHasValue: (cid, $el)->
    do(incomplete = false) =>
      call_back = ->
        if($(this).val() == "")
          incomplete = true
      $el.find("input[type=text]").each(call_back);
      incomplete = true if($el.find('select').val() == "")
      return false if(incomplete == true)
      return cid

  isValid: ($el, model) ->
    do(valid = false) =>
      valid = do (required_attr = model.get('required'), checked_chk_cnt = 0) =>
        return true if !required_attr
        return ($el.find("#first_name").val() != '' &&
          $el.find("#last_name").val() != '')
      valid

  clearFields: ($el, model) ->
    $el.find("#first_name").val("")
    $el.find("#middle_name").val("") if $el.find("#middle_name")
    $el.find("#last_name").val("")
    $el.find("#suffix").val("")

  setValForPrint: (field_view, model) ->
    do (
      fields = field_view.$el.find('#values').find('label'),
      values = model.get('field_values'),
      i = 0
    ) =>
      for key of values
        $(fields[i]).html(values["#{model.getCid()}_#{++i}"]);

  evalCondition: (clicked_element, cid, condition, set_value) ->
    do(
       elem_val = '' ,
       check_result = false
    ) =>
    elem_val = clicked_element
                          .find("#first_name").val()
    check_result = condition("'#{elem_val}'", "'#{set_value}'")
    check_result

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)

    $("." + cid)
            .find("[name = "+cid+"_2]")
            .attr("required", required)

    $("." + cid)
            .find("[name = "+cid+"_3]")
            .attr("required", required)
