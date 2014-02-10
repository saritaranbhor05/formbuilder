Formbuilder.registerField 'esignature',

  view: """
    <canvas type='esignature' id="can" width="200" height="100" style="border:1px solid #000000;"></canvas>
    <div style="display:inline">
      <input type="button" value="Clear" id="clr" style="min-width:50px;position:absolute"/>
    </div>
  """

  edit: ""

  addButton: """
    <span class="symbol"><span class="icon-pen"></span></span> E-Signature 
  """

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)

  isValid: ($el, model) ->
    do(valid = false) =>
      valid = do (required_attr = model.get('required'), checked_chk_cnt = 0) =>
        return true if !required_attr
        return true if $el.find("[name = "+model.getCid()+"_1]")[0].toDataURL() != ''
      valid          