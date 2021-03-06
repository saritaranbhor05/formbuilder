Formbuilder.registerField 'gmap',
  caption: 'Geo-Location'
  view: """
    <a style="min-width: 100px ;height: 35px;padding-top: 5px;padding-bottom: 5px;text-decoration: underline;" id="gmap_button" type='gmap'>Select Your Address</a>
    <input id='current_user_latlng_points' type='text' class='hidden' value=''>
  """

  edit: ""

  print: """
  <div class="centered_td">
    <% if(rf.get('field_type') === 'gmap') { %>
      <% var lat_long_arr = ['-25.363882','131.044922'],
         mapAttr = rf.get('field_values');
      %>
      <% if(mapAttr){ %>
        <% if(mapAttr[ rf.get('cid') +'_1']){ %>
          <% var location = mapAttr[ rf.get('cid') +'_1'],
             lat_long_str = mapAttr[ rf.get('cid') +'_2'],
             lat_long_arr = (mapAttr[ rf.get('cid') +'_2']).split(','),
             lat = lat_long_arr[0],
             long = lat_long_arr[1];
          %>
        <% } %>
      <% } %>
    <% } %>
    <div class="lat_long_wrapper">
      <ul>
        <li>
          <label type="text" id="print_lat_gmap">Latitude : <%= (lat)? lat : '' %></label>
        </li>
        <li>
          <label type="text" id="print_long_gmap" >Longitude : <%= (long)? long : '' %></label>
        </li>
        <li>
          <%= (location)? location : '' %>
        </li>
      </ul>
      <div id="map-canvas">
        <% if(lat_long_str){ %>
        <img src=<%= "http://maps.googleapis.com/maps/api/staticmap?center="+lat_long_str+"&zoom=13&size=400x400&sensor=false&markers=color:red|"+lat_long_str %> />
        <% } %>
      </div>
    </div>
  </div>
  """

  addButton: """
    <span class="symbol"><span class="icon-map-marker"></span></span> Geo-Location
  """

  addRequiredConditions: (model) ->
    read_only = (if Formbuilder.options.FIELD_CONFIGS then Formbuilder.options.FIELD_CONFIGS[model.get('field_type')]['read_only'] else false)
    disabled = (if read_only then "disabled" else "")
    hide_class = (if read_only then "hide" else "")
    close_button = (if read_only then "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>" else "")
    $('<div class="modal fade" id="gmapModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <div class="geo-location-panel top-panel1">
              <table>
              <tr><td>
                <input id="gmap_latlng" class="geo-location-panel1" type="textbox" '+disabled+'
                />
                <input type="button" value="Lat,Long" onclick="codeLatLngPopulateAddress()"
                class="'+hide_class+'"/>
              </td></tr><tr><td>
                <input id="gmap_address" class="geo-location-panel1" type="textbox" '+disabled+' />
                <input type="button" value="Location" onclick="codeAddress()" class="'+hide_class+'"/>
              </td></tr>
              </table>
              </div>
            </div>
            <div class="modal-body">
              <div id="map-canvas"/>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default btn-success '+hide_class+'" id="gmap_ok" data-dismiss="modal">Ok</button>
                '+close_button+'
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

  clearFields: ($el, model) ->
    $el.find('a').text('Select Your Address')
    $el.find('input').val('')

  fieldToValue: ($el, model) ->
    do(all_elem = $el.find('[name^='+model.getCid()+']'),
      res = {}) ->
      _.each all_elem, (elem) ->
        do($elem = $(elem)) ->
          if $elem.is("a")
            res[$elem.attr('name')] = $elem.text()
          else if $elem.is("input")
            res[$elem.attr('name')] = $elem.val()
      res

  clickGmapButton: (model) ->
    $("[name = "+model.getCid()+"_1]").bind 'click', (ev) =>
      if $('#gmapModal').length is 0
        this.addRequiredConditions(model) if this.addRequiredConditions
      $('#gmap_ok').val(model.getCid())
      @generateLocation(model) unless model.attributes.field_values
      $('#gmapModal').modal({
        show: true
      })

      $("#gmapModal").on "shown.bs.modal", (e) ->
        gmap_button_value = $("[name = " + getCid() + "_2]").val()
        initialize();
        $( "#gmap_address" ).keypress (event) ->
          set_prev_lat_lng($('#gmap_latlng').val())
          if(event.keyCode == 13)
            codeAddress();

        $( "#gmap_latlng" ).keypress (event) ->
          set_prev_address($("#gmap_address").val())
          if(event.keyCode == 13)
            codeLatLng()

        if( gmap_button_value != '')
          set_prev_lat_lng(gmap_button_value)
          codeLatLng(gmap_button_value)

      $('#gmapModal').on 'hidden.bs.modal', (e) ->
        $('#gmapModal').off('shown').on('shown')
        $(this).removeData "modal"
        $( "#gmap_address" ).unbind('keypress')
        $( "#gmap_latlng" ).unbind('keypress')

  generateLocation: (model) ->
    if !(model.get('field_values') && model.get('field_values')[name])
      get_user_location = getCurrentLocation(model.getCid());
      if get_user_location != 'false'
        $("[name = " + model.getCid() + "_1]").text(get_user_location)
      else
        $("[name = " + model.getCid() + "_1]").text('Select Your Address')

  setup: (field_view, model) ->
    do($input = field_view.$el.find($("[name = " + model.getCid() + "_2]"))) =>
      if model.attributes.field_values
        field_view.$el.find($("[name = " + model.getCid() + "_1]")).text(model.attributes.field_values["#{model.getCid()}_1"])
        $input.val(model.attributes.field_values["#{model.getCid()}_2"])
      else
        if !(model.get('field_values') && model.get('field_values')[name])
          $("[name = " + model.getCid() + "_1]").text('Select Your Address')
      if $input.val() != ''
        field_view.trigger('change_state')
    @clickGmapButton(model)
