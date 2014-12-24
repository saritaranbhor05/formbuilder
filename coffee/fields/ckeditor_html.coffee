unless typeof(CKEDITOR) is 'undefined'
  Formbuilder.registerField 'free_text_html',
    caption: 'Free Text HTML'
    type: 'non_input'

    view: """
      <%
        if(rf.get(Formbuilder.options.mappings.OPTIONAL_FIELD)){

          if($("#title_"+rf.getCid()).is(':disabled')){
            $("#title_"+rf.getCid()).attr("disabled",false);
          }

          if(!$("#title_"+rf.getCid()).is(':focus')){
            $("#title_"+rf.getCid()).val(rf.get(Formbuilder.options.mappings.LABEL));
            $("#title_"+rf.getCid()).focus();
          }
      %>
        <label class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'>
          <%= rf.get(Formbuilder.options.mappings.LABEL) %>
        </label>
      <% }else{
          $("#title_"+rf.getCid()).val("");
          $("#title_"+rf.getCid()).attr("disabled",true);
      } %>
      <div class="freeTextHTMLDiv" id='<%= rf.getCid() %>'></div>
      <script>
        $(function() {
          var data = "<%=rf.get(Formbuilder.options.mappings.HTML_DATA)%>"
          $("#<%= rf.getCid() %>").html(data);
        });
      </script>


    """

    edit: """
      <%= Formbuilder.templates['edit/optional_title']() %>
      </br>

      <% if(!rf.get(Formbuilder.options.mappings.OPTIONAL_FIELD)){ %>
        <input id="title_<%= rf.getCid() %>" type='text' disabled="true"
          data-rv-input='model.<%= Formbuilder.options.mappings.LABEL %>'/>
      <% } else { %>
        <input id="title_<%= rf.getCid() %>" type='text'
          data-rv-input='model.<%= Formbuilder.options.mappings.LABEL %>'/>
      <% } %>

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
        class="modal fade modal_style free_text_html_modal" tabindex="-1"
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

              $("#open_model_<%= rf.getCid() %>").on('shown.bs.modal', function() {
                var that = $(this).data('modal');
                $(document).off('focusin.modal').on('focusin.modal', function (e) {
                  // Add this line
                  if( e.target.className && e.target.className.indexOf('cke_') == 0 ) return;
                  // Original
                  if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
                  that.$element.focus() }
                });
              });

              $("#open_model_<%= rf.getCid() %>").modal('show');

              $("#open_model_<%= rf.getCid() %>").on('hidden.bs.modal', function() {
                $("#ck_<%= rf.getCid() %>").val(editor_<%= rf.getCid() %>.getData().replace(/(\\r\\n|\\n|\\r)/gm, "").replace(/\"/g,"'"));
                $("#ck_<%= rf.getCid() %>").trigger("change");
                $(this).unbind('shown');
                $(this).unbind('hidden');
              });
            });
            CKEDITOR.disableAutoInline = true;
            // this event fired when any popup is opened inside ckeditor
            CKEDITOR.on('dialogDefinition', function(ev){
                var dialogName = ev.data.name;
                var dialogDef  = ev.data.definition;
                // check if link popup is opened
                if(dialogName === "link"){
                  // remove unwanted link types
                  dialogDef.getContents('info').get('linkType')['items'].splice(1,2);
                  // remove unwanted protocols
                  dialogDef.getContents('info').get('protocol')['items'].splice(2,5);
                  // select another tab called as target
                  var targetTab = dialogDef.getContents('target').elements[0];
                  if(typeof targetTab.children === "object" && typeof targetTab.children[0] === "object"){
                    if(typeof targetTab.children[0].items === "object"){
                      // validate and then remove unwanted options in target tab
                      if(targetTab.children[0].items.length > 1){
                        targetTab.children[0].items.splice(4,3);
                        targetTab.children[0].items.splice(0,3);
                        targetTab.children[0].default = "_blank";
                      }
                    }
                  }
                }
              });
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

    checkAttributeHasValue: (cid, $el)->
      return false if($el.find('.freeTextHTMLDiv').is(':empty'))
      return cid

    clearFields: ($el, model) ->
      $el.find('#' + model.getCid()).find('p').text('')

    evalCondition: (clicked_element, cid, condition, set_value) ->
      do(
        check_result=false
      ) =>
        elem_val = clicked_element
                            .find("#"+cid).find('p').text()
        check_result = condition("'#{elem_val}'", "'#{set_value}'")
        check_result

    add_remove_require:(cid,required) ->
      $("." + cid)
              .find("#"+cid)
              .attr("required", required)
