Formbuilder.registerField 'take_pic_video_audio',
  caption: 'Capture'
  view: """
    <div class='input-line'>
      <% if(_.contains(Formbuilder.options.FIELD_CONFIGS['take_pic_video_audio'], 'all')){ %>
        <% if (rf.get(Formbuilder.options.mappings.INCLUDE_PHOTO)) { %>
          <button type='button' class='file_field btn_capture_icon image btn_icon_photo' cid="<%= rf.getCid() %>" id="btn_image_<%= rf.getCid() %>"></button>
        <% } %>

        <% if (rf.get(Formbuilder.options.mappings.INCLUDE_VIDEO)) { %>
          <button type='button' class='file_field btn_capture_icon video btn_icon_video' cid="<%= rf.getCid() %>" id="btn_video_<%= rf.getCid() %>"></button>
        <% } %>

        <% if (rf.get(Formbuilder.options.mappings.INCLUDE_AUDIO)) { %>
          <button type='button' class='file_field btn_capture_icon audio btn_icon_audio' cid="<%= rf.getCid() %>" id="btn_audio_<%= rf.getCid() %>"></button>
        <% } %>
      <% } %>
      <% if(_.contains(Formbuilder.options.FIELD_CONFIGS['take_pic_video_audio'], 'photo')){ %>
        <button type='button' class='file_field btn_capture_icon image btn_icon_photo' cid="<%= rf.getCid() %>" id="btn_image_<%= rf.getCid() %>"></button>
      <% } %>
      <% if(_.contains(Formbuilder.options.FIELD_CONFIGS['take_pic_video_audio'], 'video')){ %>
        <button type='button' class='file_field btn_capture_icon video btn_icon_video' cid="<%= rf.getCid() %>" id="btn_video_<%= rf.getCid() %>"></button>
      <% } %>
      <% if(_.contains(Formbuilder.options.FIELD_CONFIGS['take_pic_video_audio'], 'audio')){ %>
        <button type='button' class='file_field btn_capture_icon audio btn_icon_audio' cid="<%= rf.getCid() %>" id="btn_audio_<%= rf.getCid() %>"></button>
      <% } %>

      <a
        type='take_pic_video_audio'
        target="_blank" capture='capture' class="capture active_link"
        id="record_link_<%= rf.getCid() %>" href=""
        style="margin-bottom:12px;"
      ></a>
      <div id="capture_link_<%= rf.getCid() %>"></div>
    </div>
    <div id="open_model_<%= rf.getCid() %>"
      class="modal hide fade modal_style" tabindex="-1"
      role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"
          aria-hidden="true">&times;</button>
        <h3>Picture</h3>
      </div>
      <div class="modal-body" id="modal_body_<%= rf.getCid() %>">
        <video id="video_<%= rf.getCid() %>" autoplay></video>
        <canvas id="canvas_<%= rf.getCid() %>" style="display:none;"></canvas>
      </div>
      <div class="modal-footer">
        <button id="take_picture_<%= rf.getCid() %>" class="btn" data-dismiss="modal" aria-hidden="true">
          Take Picture
        </button>
        <button class="btn btn-default btn-success" data-dismiss="modal" aria-hidden="true">
          Ok
        </button>
      </div>
    </div>

    <textarea
     id='snapshot_<%= rf.getCid() %>'
     data-rv-value='model.<%= Formbuilder.options.mappings.HTML_DATA %>'
     style="display:none;"
    >
    </textarea>

    <script>

      $('#snapshot_<%= rf.getCid() %>').attr("required", false);
      $('#canvas_<%= rf.getCid() %>').attr("required", false);

      $("#btn_image_<%= rf.getCid() %>").click( function() {
        $("#open_model_<%= rf.getCid() %>").modal('show');
        $("#open_model_<%= rf.getCid() %>").on('shown', function() {
          startCamera();
        });
        $("#open_model_<%= rf.getCid() %>").on('hidden', function() {
          localMediaStream.stop();
          localMediaStream = null;
          $("#snapshot_<%= rf.getCid() %>").text(
            $('#record_link_<%= rf.getCid() %>').attr('href')
          );
          $("#snapshot_<%= rf.getCid() %>").trigger("change");
          $(this).unbind('shown');
          $(this).unbind('hidden');
        });
      });
      var video = document.querySelector("#video_<%= rf.getCid() %>"),
          take_picture = document.querySelector("#take_picture_<%= rf.getCid() %>")
          canvas = document.querySelector("#canvas_<%= rf.getCid() %>"),
          ctx = canvas.getContext('2d'), localMediaStream = null;
      navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      function snapshot() {
        if (localMediaStream) {
          ctx.drawImage(video, 0, 0);
          // "image/webp" works in Chrome.
          // Other browsers will fall back to image/png.
          document.querySelector('#record_link_<%= rf.getCid() %>').href = canvas.toDataURL('image/webp');
          $('#record_link_<%= rf.getCid() %>').text('View File');
        }
      }
      function sizeCanvas() {
        // video.onloadedmetadata not firing in Chrome so we have to hack.
        // See crbug.com/110938.
        setTimeout(function() {
          canvas.width = 640;
          canvas.height = 420;
        }, 100);
      }
      function startCamera(){
        navigator.getUserMedia(
          {video: true},
          function(stream){
            video.src = window.URL.createObjectURL(stream);
            localMediaStream = stream;
            sizeCanvas();
          },
          function errorCallback(error){
            console.log("navigator.getUserMedia error: ", error);
          }
        );
      }

      take_picture.addEventListener('click', snapshot, false);
    </script>
  """

  edit: """
    <%= Formbuilder.templates['edit/capture']({ rf:rf }) %>
  """

  print: """
    <div id="capture_link_<%= rf.getCid() %>"></div>
  """

  addButton: """
    <span class="symbol"><span class="icon-camera"></span></span> Capture
  """
  clearFields: ($el, model) ->
    do(attr_name = model.getCid()) =>
      $el.find(".capture").text("")
      $el.find("#capture_link_"+attr_name).html('')

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)

  fieldToValue: ($el, model) ->
    do(link_eles = $el.find('a[type=pic_video_audio]'), comp_obj = {}) =>
      do(key = '', link_href = '') =>
        _.each link_eles, (link_ele) ->
          key = $(link_ele).attr('name')
          link_href = $(link_ele).attr('href')
          if _.isEmpty(link_href)
            comp_obj[key] = { 'name': $(link_ele).text(), 'url': $(link_ele).text() }
          else
            comp_obj[key] = { 'name': $(link_ele).text(), 'url': link_href }
      comp_obj

  android_bindevents: (field_view) ->
    do(btn_photo_inputs = field_view.$el.find(".image"),
      btn_video_inputs = field_view.$el.find(".video"),
      btn_audio_inputs = field_view.$el.find(".audio"), _that = @) =>
      _that.bind_event_for_type(btn_photo_inputs, "image", field_view)
      _that.bind_event_for_type(btn_video_inputs, "video", field_view)
      _that.bind_event_for_type(btn_audio_inputs, "audio", field_view)

  bind_event_for_type: (btn_inputs, input_type, field_view) ->
    do(view_index = 0) =>
      _.each btn_inputs, (btn_input) ->
        $(btn_input).unbind()
        $(btn_input).on "click", ->
          view_index = field_view.model.get('view_index')
          if !view_index
            view_index = 0
          Android.f2dBeginCapture(
            field_view.model.getCid(),
            input_type,
            view_index)
          return

  setup: (field_view, model) ->
    do(model_cid = model.getCid(),
       file_url = '',
       $cap_link_ele = field_view.$el.find('#capture_link_'+model.getCid()), _that = @) =>
      if model.get('field_values')
        $cap_link_ele.html('')
        _.each(model.get('field_values'), (value, key) ->
          if value
            if $cap_link_ele
              if _.isString value
                if value.indexOf("data:image") == -1
                  $cap_link_ele.append(
                    "<div class='capture_link_div' id=capture_link_div_"+key+"><a class='active_link_doc' target='_blank' type = 'pic_video_audio' name="+key+" href="+value+">"+value.split("/").pop().split("?")[0]+"</a><span id=capture_link_close_"+key+">X</span></br></div>"
                  )
                else if value.indexOf("data:image") == 0
                  $('#record_link_'+model_cid).attr('href',value)
                  $('#record_link_'+model_cid).text("View File")
              else if _.isObject value
                $('#capture_link_'+model_cid).append(
                  "<div class='capture_link_div' id=capture_link_div_"+key+"><a class='active_link_doc' target='_blank' type = 'pic_video_audio' name="+key+" href="+value.url+">"+value.name+"</a><span id=capture_link_close_"+key+">X</span></br></div>"
                )
            @$('#capture_link_close_'+key).click( () ->
              $('#capture_link_div_'+key).remove()
            ) if @$('#capture_link_close_'+key)
          )

  isValid: ($el, model) ->
    do(valid = false) =>
      valid = do (required_attr = model.get('required'), is_file_selected = false) =>
        return true if !required_attr
        _.each $el.find("a"), (elment) ->
          if !_.isEmpty elment.text
            is_file_selected = true
        return is_file_selected
      valid