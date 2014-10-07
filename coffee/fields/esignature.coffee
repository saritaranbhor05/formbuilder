Formbuilder.registerField 'esignature',

  view: """
    <div class='esign-panel' style="display: inline-block;" >
    <% if(rf.get(Formbuilder.options.mappings.CANVAS_WIDTH) || rf.get(Formbuilder.options.mappings.CANVAS_HEIGHT)) { %>
      <img title="click here to change" type='esignature' id='esign' class='canvas_img' style='width:<%= rf.get(Formbuilder.options.mappings.CANVAS_WIDTH) %>px;
                      height:<%= rf.get(Formbuilder.options.mappings.CANVAS_HEIGHT) %>px;display:none;'></img>
      <canvas
          id="can"
          width='<%= rf.get(Formbuilder.options.mappings.CANVAS_WIDTH) %>px'
          height='<%= rf.get(Formbuilder.options.mappings.CANVAS_HEIGHT) %>px'
          style="display:none;" class="esign_canvas"
      />
    <% } else
      if(!rf.get(Formbuilder.options.mappings.CANVAS_WIDTH) && !rf.get(Formbuilder.options.mappings.CANVAS_HEIGHT)) { %>
        <img title="click here to change" type='esignature' id='esign' class='canvas_img' style='width:250px;height:150px;float:left;display:none;'></img>
        <canvas
            id="can"
            width='250px'
            height='150px'
            style="display:none;" class="esign_canvas"
        />
    <% } %>
    <% if (typeof(Android) == 'undefined' && typeof(BRIJavaScriptInterface) == 'undefined') { %>
    <div class="esign_actions" style="display:none;">
      <i class="esign_icons icon-refresh" id="clr" type="" value="Clear" title="clear" style="max-width:70px;"></i>
      <i class="esign_icons icon-ok" id="done" type="" value="Done" title="done" style="max-width:70px;"></i>
      <i class="esign_icons icon-remove" id="cancel" type="" value="Cancel" title="cancel"  style="max-width:70px;"></i>
    </div>
    <% } %>
    </div>
  """


  print: """
    <div class='esign-panel' style="display: inline-block;" >
    <% if(rf.get(Formbuilder.options.mappings.CANVAS_WIDTH) || rf.get(Formbuilder.options.mappings.CANVAS_HEIGHT)) { %>
      <img type='esignature' id='esign' class='canvas_img' style='width:<%= rf.get(Formbuilder.options.mappings.CANVAS_WIDTH) %>px;
                      height:<%= rf.get(Formbuilder.options.mappings.CANVAS_HEIGHT) %>px;display:none;'></img>
      <canvas
          id="can"
          width='<%= rf.get(Formbuilder.options.mappings.CANVAS_WIDTH) %>px'
          height='<%= rf.get(Formbuilder.options.mappings.CANVAS_HEIGHT) %>px'
          style="display:none;" class="esign_canvas"
      />
    <% } else
      if(!rf.get(Formbuilder.options.mappings.CANVAS_WIDTH) && !rf.get(Formbuilder.options.mappings.CANVAS_HEIGHT)) { %>
        <img type='esignature' id='esign' class='canvas_img' style='width:150px;height:100px;float:left;display:none;'></img>
        <canvas
            id="can"
            width='150px'
            height='100px'
            style="display:none;" class="esign_canvas"
        />
    <% } %>
    </div>
  """

  edit: """
    <%= Formbuilder.templates['edit/canvas_options']() %>
  """

  addButton: """
    <span class="symbol"><span class="icon-pen"></span></span> E-Signature
  """
  checkAttributeHasValue: (cid, $el)->
    do(incomplete = false) =>
      call_back = (k,v) ->
        incomplete = true if(v.src == "")
      $el.find("img").each(call_back);
      return false if(incomplete == true)
      return cid

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)

  isValid: ($el, model) ->
    do(valid = false, src = null) =>
      valid = do (required_attr = model.get('required'), checked_chk_cnt = 0, is_empty = false) =>
        return true if !required_attr
        src = $el.find("[name = "+model.getCid()+"_1]").attr('src')
        if src
          is_empty =  true
        return is_empty
      valid

  clearFields: ($el, model) ->
    $el.find('.canvas_img').attr('src', '')
    $el.find('.canvas_img').attr('upload_url', '')

  fieldToValue: ($el, model) ->
    do(esig_can = $el.find('.canvas_img'), comp_obj = {}) =>
      do(key = esig_can.attr('name')) =>
        comp_obj[key] = esig_can.attr('src')
      comp_obj

  assignSrcAndShowImg: (base64_data_or_url, $img) ->
    regex4esign = /^data:image\/png;base64/
    if(regex4esign.test base64_data_or_url)
      $img.attr("src", base64_data_or_url)
    else
      $img.attr("upload_url", base64_data_or_url)
      makeRequest(base64_data_or_url, $img.attr("name"))
    $img.show()
  
  android_setup: (field_view, model) ->
    do(model_cid = model.getCid(),
       upload_url = '',
       $img = field_view.$el.find('img'), esig_fl_vals = {}, _that = @) =>
      if (!model.get('field_values') || _.isEmpty(model.get('field_values')) || model.get('field_values')["#{model_cid}_1"] == '')
        # Android.getEsigImageData is a method which takes esignature cid and
        # returns field values as follows:
        # {"0":{"c36_1": base64_data}, "1": {"c36_1": base64_data}}
        esig_fl_vals = JSON.parse(Android.getEsigImageData(model_cid + '_' + 1))
        model.set({'field_values': esig_fl_vals }, {silent: true});
      if model.get('field_values') && model.get('field_values')["#{model_cid}_1"]
        _that.assignSrcAndShowImg(
          model.get('field_values')["#{model_cid}_1"], $img)
      else if model.get('field_values') && model.get('field_values')["0"]
        _that.assignSrcAndShowImg(
          model.get('field_values')["0"]["#{model_cid}_1"], $img)
      else if $img.attr('src') && $img.attr('src') != ''
        $img.show()
      else
        $img.hide()

  setup: (field_view, model) ->
    do(model_cid = model.getCid(),
       upload_url = '',
       $img = field_view.$el.find('img'), _that = @) =>
      if model.get('field_values') && model.get('field_values')["#{model_cid}_1"]
        _that.assignSrcAndShowImg(
          model.get('field_values')["#{model_cid}_1"], $img)
        regex4esign = /^data:image\/png;base64/
      else if $img.attr('src') && $img.attr('src') != ''
        $img.show()
      else
        $img.hide()
