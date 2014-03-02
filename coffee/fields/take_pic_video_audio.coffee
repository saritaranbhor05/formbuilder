Formbuilder.registerField 'take_pic_video_audio',

  view: """
    <div class='input-line'>
      <button id="btn_picture_<%= rf.getCid() %>">Picture</button>
      <button id="btn_video_<%= rf.getCid() %>">Video</button>
      <button id="btn_audio_<%= rf.getCid() %>">Audio</button>
      <a
        target="_blank" class="active_link"
        id="record_link_<%= rf.getCid() %>" href=""
      >picture</a>
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
        <button class="btn" data-dismiss="modal" aria-hidden="true">
          Done
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

      setTimeout(function(){
          var data = $("#snapshot_<%= rf.getCid() %>").val();
          $("#record_link_<%= rf.getCid() %>").attr('href',data);
        },100);

      $("#btn_picture_<%= rf.getCid() %>").click( function() {
        $("#open_model_<%= rf.getCid() %>").modal('show');
        $("#open_model_<%= rf.getCid() %>").on('shown', function() {
          startCamera();
        });
        $("#open_model_<%= rf.getCid() %>").on('hidden', function() {
          localMediaStream.stop();
          localMediaStream = null;
          $("#snapshot_<%= rf.getCid() %>").val(
            $('#record_link_<%= rf.getCid() %>').attr('href')
          );
          $("#snapshot_<%= rf.getCid() %>").trigger("change");
          $(this).unbind('shown');
          $(this).unbind('hidden');
        });
      });
      var video = document.querySelector("#video_<%= rf.getCid() %>");
      var canvas = document.querySelector("#canvas_<%= rf.getCid() %>");
      var ctx = canvas.getContext('2d');
      var localMediaStream = null;
      navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      function snapshot() {
        if (localMediaStream) {
          ctx.drawImage(video, 0, 0);
          // "image/webp" works in Chrome.
          // Other browsers will fall back to image/png.
          document.querySelector('#record_link_<%= rf.getCid() %>').href = canvas.toDataURL('image/webp');
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

      video.addEventListener('click', snapshot, false);
    </script>
  """

  edit: "
  "

  addButton: """
    <span class="symbol"><span class="icon-home"></span></span> Record
  """
  clearFields: ($el, model) ->
    $el.find("#picture").val("")
    $el.find("#video").val("")
    $el.find("#audio").val("")

  evalCondition: (clicked_element, cid, condition, set_value) ->

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)
    $("." + cid)
            .find("[name = "+cid+"_2]")
            .attr("required", required)
    $("." + cid)
            .find("[name = "+cid+"_3]")
            .attr("required", required)
