Formbuilder.registerField 'fullname',
  perfix: ['Mr.', 'Mrs.', 'Miss.', 'Ms.', 'Mst.', 'Dr.']
  view: """
    <div class='input-line'>
      <span>
        <select class='span12'>
          <%for (i = 0; i < this.perfix.length; i++){%>
            <option><%= this.perfix[i]%></option>
          <%}%>
        </select>
        <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_PREFIX_TEXT) || 'Prefix' %></label>
      </span>

      <span>
        <input id='first_name' type='text' pattern="[a-zA-Z]+"/>
        <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_FIRST_TEXT) || 'First' %></label>
      </span>

      <% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>
        <span id='middle_name_span_<%= rf.getCid() %>'>
          <input type='text' pattern="[a-zA-Z]+"/>
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
            <%= rf.get(Formbuilder.options.mappings.FULLNAME_PREFIX_TEXT) || 'Prefix' %>
          </td>
          <td>
            <%= rf.get(Formbuilder.options.mappings.FULLNAME_FIRST_TEXT) || 'First' %>
          </th>
          <% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>
            <td>
              <%= rf.get(Formbuilder.options.mappings.FULLNAME_MIDDLE_TEXT) || 'Middle' %>
            </td>
          <% } %>
          <td>
            <%= rf.get(Formbuilder.options.mappings.FULLNAME_LAST_TEXT) || 'Last' %>
          </td>
          <% if (rf.get(Formbuilder.options.mappings.INCLUDE_SUFFIX)) { %>
          <td>
            <%= rf.get(Formbuilder.options.mappings.FULLNAME_SUFFIX_TEXT) || 'Suffix' %>
          </td>
          <% } %>
        </tr>
        <tr>
          <td>
            <select class='span12'>
            <%for (i = 0; i < this.perfix.length; i++){%>
              <option><%= this.perfix[i]%></option>
            <%}%>
            </select>
          </td>
          <td>
            <input id='first_name' type='text' pattern="[a-zA-Z]+"/>
          </td>
          <% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>
          <td>
            <input type='text' pattern="[a-zA-Z]+"/>
          </td>
          <% } %>
          <td>
            <input id='last_name' type='text' pattern="[a-zA-Z]+"/>
          </td>
          <% if (rf.get(Formbuilder.options.mappings.FULLNAME_SUFFIX_TEXT)) { %>
          <td>
            <input id='suffix' type='text'/>
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
    $el.find("#last_name").val("")
    $el.find("#suffix").val("")

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
