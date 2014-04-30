Formbuilder.registerField 'gmap',

  view: """
    <a style="min-width: 100px ;height: 35px;padding-top: 5px;padding-bottom: 5px;text-decoration: underline;" id="gmap_button" type='gmap'>Select Your Address</a>
    <input id='current_user_latlng_points' type='text' class='hidden' value=''>
  """

  edit: ""

  print: """
    <% if(rf.get('field_type') === 'gmap'){%>
    <% var lat_long_arr = ['-25.363882','131.044922']%>
    <% var mapAttr = rf.get('field_values');%>
    <% if(mapAttr){%>
      <% if(mapAttr[ rf.get('cid') +'_1']){ %>
        <% var location = mapAttr[ rf.get('cid') +'_1']; %>
        <% var lat_long_arr = (mapAttr[ rf.get('cid') +'_2']).split(','); %>
        <% var lat = lat_long_arr[0]; %>
        <% var long = lat_long_arr[1]; %>
      <% } %>
    <% } %>
  <% } %>
    <div class="lat_long_wrapper">
      <ul>
        <li>
          <label class="first_li"> Latitude :</label>
          <label type="text" id="print_lat_gmap"><%= (lat)? lat : '' %></label>
        </li>
        <li>
          <label class="first_li"> Longitude :</label>
          <label type="text" id="print_long_gmap" ><%= (long)? long : '' %></label>
        </li>
        <li>
          <%= (location)? location : '' %>
        </li>
      </ul>
    </div>
    <div id="map-canvas" style="height=300px;width=300px;">
    </div>
    <script type="text/javascript">
    $(function(){
      var myLatlng = new google.maps.LatLng(
      $('#print_lat_gmap').val()? $('#print_lat_gmap').val() : '',
      $('#print_long_gmap').val()? $('#print_long_gmap').val() : '');
      var mapOptions = {
        zoom: 13,
        center: myLatlng
      }
      var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Map Location'
        });
      })
      </script>
  """

  addButton: """
    <span class="symbol"><span class="icon-map-marker"></span></span> Geo-Location
  """

  addRequiredConditions: ->
    $('<div class="modal fade" id="gmapModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <div class="geo-location-panel top-panel1">
              <table>
              <tr><td>
                <input id="gmap_latlng" class="geo-location-panel1" type="textbox"/>
                <input type="button" value="Lat,Long" onclick="codeLatLngPopulateAddress()"/>
              </td></tr><tr><td>
                <input id="gmap_address" class="geo-location-panel1" type="textbox"/>
                <input type="button" value="Location" onclick="codeAddress()"/>
              </td></tr>
              </table>
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
