Formbuilder.registerField 'image',

  view: """
    <div
      style="
        text-align: <%= rf.get(Formbuilder.options.mappings.IMAGEALIGN) %>;
      "
    >
      <a
        target='_blank'
        href='<%= rf.get(Formbuilder.options.mappings.IMAGELINK) %>'
      >
        <img
          id='img_<%= rf.getCid() %>'
          src='<%= rf.get(Formbuilder.options.mappings.IMAGE_DATA) %>'
          style="
            width:<%= rf.get(Formbuilder.options.mappings.IMAGEWIDTH) %>px;
            height:<%= rf.get(Formbuilder.options.mappings.IMAGEHEIGHT) %>px
          "
        />
      </a>
    </div>
  """

  edit: """
    <div class='fb-edit-section-header'>Upload File</div>
    <input id='<%= rf.getCid() %>' type='file' accept="image/gif, image/jpeg, image/png"/>
    <input
      class='hide'
      id='text_<%= rf.getCid() %>'
      data-rv-value='model.<%= Formbuilder.options.mappings.IMAGE_DATA %>'
    />
    <%= Formbuilder.templates['edit/image_options']() %>
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
            if(this.files[0].size <= 204800){
              readURL(this);
            }
            else{
              alert("Please select file size less that 200 KB")
            }
        });
      });
    </script>
  """

  addButton: """
    <span class="symbol"><span class="icon-picture"></span></span> Image
  """
