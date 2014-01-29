Formbuilder.registerField 'image',

  view: """
    <a
      target='_blank'
      class='image_link_form'
      href='<%= rf.get(Formbuilder.options.mappings.IMAGELINK) %>'
      style="
        text-align: <%= rf.get(Formbuilder.options.mappings.IMAGEALIGN) %>;
      "
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
  """

  edit: """
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
    <span class="symbol"><span class="icon-cloud-upload"></span></span> Image
  """
