unless typeof(CKEDITOR) is 'undefined'
  Formbuilder.registerField 'free_text_html',

    type: 'non_input'

    view: """
      <label class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'>
        <%= rf.get(Formbuilder.options.mappings.LABEL) %>
      </label>
      <div id='<%= rf.getCid() %>'></div>
      <script>
        $(function() {
          var data = "<%=rf.get(Formbuilder.options.mappings.HTML_DATA)%>"
          $("#<%= rf.getCid() %>").html(data);
        });
      </script>


    """

    edit: """

      </br>
      <input type='text'
        data-rv-input='model.<%= Formbuilder.options.mappings.LABEL %>' />

      <div class='inline'>
        <span>Edit Here:</span>
        <div class='fb-bottom-add'>
          <a id='button_<%= rf.getCid() %>'
            class="js-add-document <%= Formbuilder.options.BUTTON_CLASS %>">
              Edit
          </a>
        </div>
      </div>

      <div id="open_model_<%= rf.getCid() %>"
        class="modal hide fade modal_style" tabindex="-1"
        role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal"
            aria-hidden="true">&times;</button>
          <h3>Select Documents</h3>
        </div>
        <div class="modal-body" id="modal_body_<%= rf.getCid() %>">
          <textarea id='ck_<%= rf.getCid() %>' contenteditable="true" data-rv-value='model.<%= Formbuilder.options.mappings.HTML_DATA %>'>
          </textarea>
        </div>
        <div class="modal-footer">
          <button class="btn" data-dismiss="modal" aria-hidden="true">
            Done
          </button>
        </div>
      </div>

      <script>
        $(function() {
          $(document).ready( function() {
            $("#button_<%= rf.getCid() %>").click( function() {
              $("#open_model_<%= rf.getCid() %>").modal('show');
              $("#open_model_<%= rf.getCid() %>").on('hidden', function() {
                $("#ck_<%= rf.getCid() %>").val(editor_<%= rf.getCid() %>.getData().replace(/(\\r\\n|\\n|\\r)/gm, "").replace(/\"/g,"'"));
                $("#ck_<%= rf.getCid() %>").trigger("change");
                $(this).unbind('shown');
                $(this).unbind('hidden');
              });
            });
            CKEDITOR.disableAutoInline = true;
            editor_<%= rf.getCid() %> = CKEDITOR.replace(document.getElementById("ck_<%= rf.getCid() %>"),
              Formbuilder.options.CKEDITOR_CONFIG
            );
          });
        });
      </script>

    """

    addButton: """
      <span class='symbol'><span class='icon-font'></span></span> Free Text HTML
    """

    clearFields: ($el, model) ->
      $el.find('#' + model.getCid()).find('p').text('')

    evalCondition: (clicked_element, cid, condition, set_value) ->
      do(
        check_result=false
      ) =>
        elem_val = clicked_element
                            .find("#"+cid).find('p').text()
        check_result = eval("'#{elem_val}' #{condition} '#{set_value}'")
        check_result

    add_remove_require:(cid,required) ->
      $("." + cid)
              .find("#"+cid)
              .attr("required", required)
