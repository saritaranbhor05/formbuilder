Formbuilder.registerField 'take_pic_video_audio',

  view: """
    <div class='input-line'>
      <% if (rf.get(Formbuilder.options.mappings.INCLUDE_PHOTO)) { %>
        <button type='button' class='file_field btn_capture_icon image btn_icon_photo' cid="<%= rf.getCid() %>" id="btn_image_<%= rf.getCid() %>"></button>
      <% } %>

      <% if (rf.get(Formbuilder.options.mappings.INCLUDE_VIDEO)) { %>
        <button type='button' class='file_field btn_capture_icon video btn_icon_video' cid="<%= rf.getCid() %>" id="btn_video_<%= rf.getCid() %>"></button>
      <% } %>

      <% if (rf.get(Formbuilder.options.mappings.INCLUDE_AUDIO)) { %>
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
    $el.find(".capture").text("")

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)
