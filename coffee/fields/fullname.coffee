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

      <span>
        <input id='suffix' type='text'/>
        <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_SUFFIX_TEXT) || 'Suffix' %></label>
      </span>
    </div>
  """

  edit: """
    <%= Formbuilder.templates['edit/middle']({ includeOther: true, rf:rf }) %>
    <div class='fb-common-wrapper'>
      <div class='fb-label-description span11'>
        <div class="control-group">
          <label class="control-label">Prefix </label>
          <div class="controls">
            <input type="text" pattern="[a-zA-Z0-9_\\s]+" data-rv-input=
              "model.<%= Formbuilder.options.mappings.FULLNAME_PREFIX_TEXT %>"
               value='Prefix' placeholder="Prefix"/>
          </div>
        </div>
        <div class="control-group">
          <label class="control-label">First </label>
          <div class="controls">
            <input type="text" pattern="[a-zA-Z0-9_\\s]+" data-rv-input=
              "model.<%= Formbuilder.options.mappings.FULLNAME_FIRST_TEXT %>"
              value='First' placeholder="First"/>
          </div>
        </div>
        <div class="control-group" id='middle_name_div_<%= rf.getCid() %>'
          style= '<%= rf.get(Formbuilder.options.mappings.INCLUDE_OTHER) ? 'display:block' : 'display:none' %>' >
          <label class="control-label">Middle </label>
          <div class="controls">
            <input type="text" pattern="[a-zA-Z0-9_\\s]+"
             data-rv-input=
             "model.<%= Formbuilder.options.mappings.FULLNAME_MIDDLE_TEXT %>"
             value='Middle' placeholder="Middle"/>
          </div>
        </div>
        <div class="control-group">
          <label class="control-label">Last </label>
          <div class="controls">
            <input type="text" pattern="[a-zA-Z0-9_\\s]+"
            data-rv-input="model.<%= Formbuilder.options.mappings.FULLNAME_LAST_TEXT %>"
            value='Last' placeholder="Last"/>
          </div>
        </div>
        <div class="control-group">
          <label class="control-label">Suffix </label>
          <div class="controls">
            <input type="text" pattern="[a-zA-Z0-9_\\s]+"
            data-rv-input=
             "model.<%= Formbuilder.options.mappings.FULLNAME_SUFFIX_TEXT %>"
            value='Suffix' placeholder="Suffix"/>
          </div>
        </div>
      </div>
    </div>
    <script >
      $(function(){
        $('#include_middle_name_<%= rf.getCid() %>').click(function(e){
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

  addButton: """
    <span class="symbol"><span class="icon-user"></span></span> Full Name
  """

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
    check_result = eval("'#{elem_val}' #{condition} '#{set_value}'")
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
