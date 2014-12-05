Formbuilder.registerField 'file',

  view: """
    <span id='file_name_<%= rf.getCid() %>'></span>
    <a target="_blank" class="active_link"></a>
    <input
      id='file_<%= rf.getCid() %>'
      type='file'
      class='icon-folder-open file_field'
      cid="<%= rf.getCid() %>"
      accept="<%= rf.get(Formbuilder.options.mappings.ALLOWED_FILE_TYPES) %>"
      for-ios-file-size="<%= rf.get(Formbuilder.options.mappings.MAX) %>"
    />
    <div id="file_upload_link_<%= rf.getCid() %>"></div>
    <script>
      $(function() {
        setTimeout(function(){
          if ($('a[name="<%= rf.getCid() %>_1"]').text() != ""){
            $("#file_<%= rf.getCid() %>").attr('required',false);
            $("#file_name_<%= rf.getCid() %>").text('');
          }
        },1000);

        $('#file_<%= rf.getCid() %>').change(function(){
          $('#file_name_<%= rf.getCid() %>').text(this.files[0].name);
          var max_size = 1024*1024*'<%= rf.get(Formbuilder.options.mappings.MAX) || 10000%>'
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

  print: """
    <div id="file_upload_link_<%= rf.getCid() %>"></div>
  """

  addButton: """
    <span class="symbol"><span class="icon-cloud-upload"></span></span> File
  """

  clearFields: ($el, model) ->
    $el.find('a[type=pic_video_audio]').text('')

  fieldToValue: ($el, model) ->
    do(link_ele = $el.find('a[type=pic_video_audio]'), comp_obj = {}) =>
      do(key = link_ele.attr('name'), link_href = link_ele.attr('href')) =>
        if _.isEmpty(link_href)
          comp_obj[key] = { 'name': link_ele.text(), 'url': link_ele.text() }
        else
          comp_obj[key] = { 'name': link_ele.text(), 'url': link_href }
      comp_obj

  checkAttributeHasValue: (cid, $el)->
    do(incomplete = false) =>
      call_back = (k,v)->
        incomplete = true if(v.href == "")
      call_back_create_mode = (k,v)->
        incomplete = true if(v.innerHTML == "")
      return false if($el.find('.active_link_doc').length == 0 && $el.find('#file_name_'+cid).length == 0)
      $el.find('#file_name_'+cid).each(call_back_create_mode)
      $el.find('.active_link_doc').each(call_back)
      return false if(incomplete == true)
      return cid

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)
    $("." + cid)
            .find("[name = "+cid+"_2]")
            .attr("required", required)

  android_bindevents: (field_view) ->
    do(btn_input_file = field_view.$el.find('input[type=file]'), _that = @,
      view_index = 0) =>
      $(btn_input_file).on "click", ->
        view_index = field_view.model.get('view_index')
        if !view_index
          view_index = 0
        Android.f2dSelectFile(
          field_view.model.getCid(),
          "file_upload",
          $(btn_input_file).attr("for-ios-file-size").toString(), view_index)
        return

  android_setup: (field_view, model) ->
    if model.get('field_values')
      _.each model.get('field_values')["0"], (value, key) ->
        unless value is ""
          do (a_href_val = '', a_text = '', mod_cid = field_view.model.getCid()) =>
            if $('#file_upload_link_'+mod_cid)
              if _.isString value
                a_href_val = value
                a_text = value.split("/").pop().split("?")[0]
              else if _.isObject(value) && !_.isUndefined(value.url)
                a_href_val = value.url
                a_text = value.name
              else if _.isObject(value) && _.isObject value[mod_cid+"_2"]
                a_href_val = value[mod_cid+"_2"].url
                a_text = value[mod_cid+"_2"].name
              @$('#file_upload_link_'+field_view.model.getCid()).html(
                "<div class='file_upload_link_div' id=file_upload_link_div_"+key+"><a type = 'pic_video_audio' class='active_link_doc' target='_blank' name="+key+" href="+a_href_val+">"+a_text+"</a></div>"
              )
            @$('#file_'+field_view.model.getCid()).attr("required", false)

  setup: (field_view, model) ->
    if model.get('field_values')
      _.each model.get('field_values')["0"], (value, key) ->
        unless value is ""
          do (a_href_val = '', a_text = '', mod_cid = field_view.model.getCid()) =>
            if $('#file_upload_link_'+mod_cid)
              if _.isString value
                a_href_val = value
                a_text = value.split("/").pop().split("?")[0]
              else if _.isObject(value) && !_.isUndefined(value.url)
                a_href_val = value.url
                a_text = value.name
              else if _.isObject(value) && _.isObject value[mod_cid+"_2"]
                a_href_val = value[mod_cid+"_2"].url
                a_text = value[mod_cid+"_2"].name
              @$('#file_upload_link_'+field_view.model.getCid()).html(
                "<div class='file_upload_link_div' id=file_upload_link_div_"+key+"><a type = 'pic_video_audio' class='active_link_doc' target='_blank' name="+key+" href="+a_href_val+">"+a_text+"</a></div>"
              )
            @$('#file_'+field_view.model.getCid()).attr("required", false)

  isValid: ($el, model) ->
    do(valid = false) =>
      valid = do (required_attr = model.get('required'), is_file_selected = false) =>
        return true if !required_attr
        _.each $el.find("a"), (elment) ->
          if !_.isEmpty elment.text
            is_file_selected = true
        return is_file_selected
      valid
