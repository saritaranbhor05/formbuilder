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

  edit: """
    <%= Formbuilder.templates['edit/canvas_options']() %>
  """

  addButton: """
    <span class="symbol"><span class="icon-pen"></span></span> E-Signature
  """
  checkAttributeHasValue: (cid, $el)->
      incomplete = false
      cb = (k,v) ->
        if(v.src == "")
          incomplete = true
      $el.find("img").each(cb);

      if(incomplete == true)
        return false
      else
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

  setup: (field_view, model) ->
    do(model_cid = model.getCid(),
       upload_url = '',
       $img = field_view.$el.find('img')) =>
      #This can be in setup method of esignature
      initializeCanvas(model_cid)
      if model.get('field_values') && model.get('field_values')["#{model_cid}_1"]
        upload_url = model.get('field_values')["#{model_cid}_1"]
        $img.attr("upload_url", upload_url)
        $img.show()
      else
        $img.hide()
      if upload_url
        makeRequest(upload_url, $img.attr("name"))
