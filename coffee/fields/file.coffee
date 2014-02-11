Formbuilder.registerField 'file',

  view: """
    <a target="_blank" class="active_link"></a>
    <input
      id='file_<%= rf.getCid() %>'
      type='file'
      accept="<%= rf.get(Formbuilder.options.mappings.ALLOWED_FILE_TYPES) %>"
    />
    <script>
      $(function() {
        function readURL(input) {
          if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onloadend = function (e) {
              $('#text_<%= rf.getCid() %>').val(e.target.result);
              $('#text_<%= rf.getCid() %>').trigger("change");
            }
            reader.readAsDataURL(input.files[0]);
          }
        }

        $('#file_<%= rf.getCid() %>').change(function(){
            if(this.files[0].size <= <%= rf.get(Formbuilder.options.mappings.MAX) %>){
              readURL(this);
            }
            else{
              alert("Please select file size less that 200 KB")
            }
        });
      });
    </script>
  """

  edit: """

    <div class='fb-edit-section-header'>Options</div>

    Allowed File Types
    <input
      type="text"
      data-rv-input="model.<%= Formbuilder.options.mappings.ALLOWED_FILE_TYPES %>"
      style="width: 40px"
    />

    &nbsp;&nbsp;

    Max File Size
    <input
      type="number"
      data-rv-input="model.<%= Formbuilder.options.mappings.MAX %>"
      style="width: 40px"
    />

  """

  addButton: """
    <span class="symbol"><span class="icon-cloud-upload"></span></span> File
  """
