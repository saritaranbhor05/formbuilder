Formbuilder.registerField 'file',

  view: """
    <a target="_blank" class="active_link"></a>
    <input type='file' />
  """

  edit: ""

  addButton: """
    <span class="symbol"><span class="icon-cloud-upload"></span></span> File
  """

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)
    $("." + cid)
            .find("[name = "+cid+"_2]")
            .attr("required", required)        