Formbuilder.registerField 'image',

  type: 'non_input'

  view: """
  <span><%= Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.LABEL)) %>
    <div
      style="
        text-align: <%= rf.get(Formbuilder.options.mappings.IMAGEALIGN) %>;
      "
    >
    <% var image_link;%>
    <% if(typeof rf.get(Formbuilder.options.mappings.IMAGELINK) != "undefined"){ %>
      <% if(rf.get(Formbuilder.options.mappings.IMAGELINK) != ""){ %>
        <% image_link = rf.get(Formbuilder.options.mappings.IMAGELINK)%>
      <% } %>
    <% } %>
      <a
        class='image_link_form'
        target='_blank'
        <%= image_link ? 'href='+image_link : '' %>
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
  <span class='help-block'>
    <%= Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.DESCRIPTION)) %>
  </span>
  """

  edit: """
    <div class='fb-edit-section-header'>Label</div>

    <div class='fb-common-wrapper'>
      <div class='fb-label-description span11'>
        <input type='text' data-rv-input='model.<%= Formbuilder.options.mappings.LABEL %>' />
        <textarea data-rv-input='model.<%= Formbuilder.options.mappings.DESCRIPTION %>'
          placeholder='Add a longer description to this field'></textarea>
      </div>
    </div>
    <div class='fb-edit-section-header'>Upload File</div>
    <input id='<%= rf.getCid() %>' type='file' accept="image/jpeg, image/png"/>
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
            if(this.files[0].size <= 512000){
              readURL(this);
            }
            else{
              alert("Please select file size less that 500 KB")
            }
        });
      });
    </script>
  """

  addButton: """
    <span class="symbol"><span class="icon-picture"></span></span> Image
  """
  checkAttributeHasValue: (cid, $el)->
    do(incomplete = false) =>
      call_back = (k,v) ->
        if(v.src == "")
          incomplete = true
      $el.find("img").each(call_back);
      return false if(incomplete == true)
      return cid
