Formbuilder.registerField 'esignature',

  view: """
    <% if(rf.get(Formbuilder.options.mappings.CANVAS_WIDTH) || rf.get(Formbuilder.options.mappings.CANVAS_HEIGHT)) { %>
    <% console.log('in 1'); %>  
      <canvas 
          type='esignature' 
          id="can"
          width='<%= rf.get(Formbuilder.options.mappings.CANVAS_WIDTH) %>px'
          height='<%= rf.get(Formbuilder.options.mappings.CANVAS_HEIGHT) %>px'
          style="border:1px solid #000000;"
      />
      <% } else 
      if(!rf.get(Formbuilder.options.mappings.CANVAS_WIDTH) && !rf.get(Formbuilder.options.mappings.CANVAS_HEIGHT)) { %>
      <% console.log('in 2'); %>  
        <canvas 
            type='esignature' 
            id="can"
            width='250px'
            height='150px'
            style="border:1px solid #000000;"
        />
      <% } %>
    <div style="display:inline">
      <input type="button" value="Clear" id="clr" style="min-width:50px;position:absolute;max-width:100px"/>
    </div>
  """

  edit: """
    <%= Formbuilder.templates['edit/canvas_options']() %>
  """

  addButton: """
    <span class="symbol"><span class="icon-pen"></span></span> E-Signature 
  """

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)

  isValid: ($el, model) ->
    do(valid = false) =>
      valid = do (required_attr = model.get('required'), checked_chk_cnt = 0, is_empty='') =>
        return true if !required_attr
        is_empty =  !($el.find("[name = "+model.getCid()+"_1]")[0].toDataURL() == getCanvasDrawn()) 
        return is_empty
      valid