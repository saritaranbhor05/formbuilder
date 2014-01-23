Formbuilder.registerField 'gmap',

  view: """
    <input type='button' style="min-width: 100px ;height: 35px;padding-top: 5px;padding-bottom: 5px;" id="gmap_button" value="" />
  """

  edit: ""

  addButton: """
    <span class="symbol"><span class="icon-map-marker"></span></span> google maps
  """

  isValid: ($el, model) ->
    do(valid = false) =>
      valid = do (required_attr = $el.find("[name = "+model.getCid()+"_1]").attr("required")) =>
        return true if !required_attr
        return $el.find("[name = " + model.getCid() + "_1]").val() != ''
      valid