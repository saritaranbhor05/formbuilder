Formbuilder.registerField 'free_text_html',

  type: 'non_input'

  view: """
    <div id='<%= rf.getCid() %>'></div>
    <script>
      $(function() {
        var data = "<%=rf.get(Formbuilder.options.mappings.HTML_DATA)%>"
        $("#<%= rf.getCid() %>").html(data);
      });
    </script>
  """

  edit: """

    <div class='actions-wrapper-ck-editorc'>
      <textarea id='ck_<%= rf.getCid() %>' contenteditable="true" data-rv-value='model.<%= Formbuilder.options.mappings.HTML_DATA %>'> Untitled </div>
      </textarea>
    </div>

    <script>
      $(function() {
        $(document).ready( function() {
          CKEDITOR.disableAutoInline = true;
          editor = CKEDITOR.inline(document.getElementById("ck_<%= rf.getCid() %>"));
          editor.on( 'blur', function( e ) {
            $("#ck_<%= rf.getCid() %>").val(editor.getData().replace(/(\\r\\n|\\n|\\r)/gm, ""));
            $("#ck_<%= rf.getCid() %>").trigger("change");
          });
        });

      });

    </script>
  """

  addButton: """
    <span class='symbol'><span class='icon-font'></span></span> Free Text HTML
  """

