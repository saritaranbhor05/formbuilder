Formbuilder.registerField 'image',

  type: 'non_input'

  view: """
    <a>
      <img
        id='img_<%= rf.getCid() %>'
        src='<%= rf.get(Formbuilder.options.mappings.IMAGE_DATA) %>'
        width='<%= rf.get(Formbuilder.options.mappings.IMAGEWIDTH) %>'
        height='<%= rf.get(Formbuilder.options.mappings.IMAGEHEIGHT) %>'
      />
    </a>
  """

  edit: """
    <%= Formbuilder.templates['edit/image_options']() %>
    <input id='<%= rf.getCid() %>' type='file' />
    <input
      class='hide'
      id='text_<%= rf.getCid() %>'
      data-rv-value='model.<%= Formbuilder.options.mappings.IMAGE_DATA %>'
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

        $('#<%= rf.getCid() %>').change(function(){
            readURL(this);
        });
      });
    </script>
  """

  addButton: """
    <span class="symbol"><span class="icon-cloud-upload"></span></span> Image
  """
