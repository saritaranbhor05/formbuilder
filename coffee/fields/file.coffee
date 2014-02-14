Formbuilder.registerField 'file',

  view: """
    <span id='file_name_<%= rf.getCid() %>'></span>
    <a target="_blank" class="active_link"></a>
    <input
      id='file_<%= rf.getCid() %>'
      type='file'
      accept="<%= rf.get(Formbuilder.options.mappings.ALLOWED_FILE_TYPES) %>"
      for-ios-file-size="<%= rf.get(Formbuilder.options.mappings.MAX) %>"
    />
    <script>
      $(function() {
        $("#file_<%= rf.getCid() %>").filestyle({
          input: false,
          buttonText: "<%= rf.get(Formbuilder.options.mappings.FILE_BUTTON_TEXT)%>"
        });

        setTimeout(function(){
          if ($('a[name="<%= rf.getCid() %>_1"]').text() != ""){
            $("#file_<%= rf.getCid() %>").attr('required',false);
          }
        },1000);

        $('#file_<%= rf.getCid() %>').change(function(){
          $('#file_name_<%= rf.getCid() %>').text(this.files[0].name);
          var max_size = 1024*1024*'<%= rf.get(Formbuilder.options.mappings.MAX) %>'
          if(this.files[0].size <= max_size){
            return true;
          }
          else{
            bri_alerts("Please select file size less that <%= rf.get(Formbuilder.options.mappings.MAX) %> MB", 'error');
            $("#file_<%= rf.getCid() %>").filestyle("clear");
            $("#file_<%= rf.getCid() %>").replaceWith($("#file_<%= rf.getCid() %>").clone(true));
            $('#file_name_<%= rf.getCid() %>').text('');
          }
        });
      });
    </script>
  """

  edit: """

    <div class='fb-edit-section-header'>Options</div>

    <div class="span12">
      <span>Change Button Text:</span>
      <input
        type="text"
        class="span12"
        data-rv-input="model.<%= Formbuilder.options.mappings.FILE_BUTTON_TEXT %>"
      >
      </input>
    </div>

    <div class="span12">
      <span>Allowed File Types:</span>
      <textarea
        class="span12"
        data-rv-input="model.<%= Formbuilder.options.mappings.ALLOWED_FILE_TYPES %>"
      >
      </textarea>
    </div>

    <div class="span12">
      <span>Max File Size in MB:</span>
      <input
        class="span3"
        type="number"
        data-rv-input="model.<%= Formbuilder.options.mappings.MAX %>"
        style="width: 80px"
      />
    </div>
  """

  addButton: """
    <span class="symbol"><span class="icon-cloud-upload"></span></span> File
  """

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)
    $("." + cid)
            .find("[name = "+cid+"_2]")
            .attr("required", required)
