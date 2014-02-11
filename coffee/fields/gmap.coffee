Formbuilder.registerField 'gmap',

  view: """
    <a style="min-width: 100px ;height: 35px;padding-top: 5px;padding-bottom: 5px;text-decoration: underline;" id="gmap_button" type='gmap'>Select Your Address</a>
    <input id='current_user_latlng_points' type='text' class='hidden' value=''>
  """

  edit: ""

  addButton: """
    <span class="symbol"><span class="icon-map-marker"></span></span> Geo-Location
  """

  addRequiredConditions: ->
    $('<div class="modal fade" id="gmapModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <div class="geo-location-panel top-panel1">
                <input id="gmap_latlng" class="geo-location-panel1" type="textbox"/>
                <input type="button" value="Lat,Long" onclick="codeLatLngPopulateAddress()"/>
              </div>
              <div class="geo-location-panel top-panel2">
                <input id="gmap_address" class="geo-location-panel1" type="textbox"/>
                <input type="button" value="Location" onclick="codeAddress()"/>
              </div>
            </div>
            <div class="modal-body">
              <div id="map-canvas"/>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default btn-success" id="gmap_ok" data-dismiss="modal">Ok</button>
            </div>
          </div>
        </div>
      </div>
  ').appendTo('body')

  isValid: ($el, model) ->
    do(valid = false) =>
      valid = do (required_attr = $el.find("[name = "+model.getCid()+"_1]").attr("required")) =>
        return true if !required_attr
        return $el.find("[name = " + model.getCid() + "_1]").text() != ''
      valid