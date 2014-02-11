Formbuilder.registerField 'ci-hierarchy',

  view: """
    <div class="row-fluid">
      <div class="control-group">
        <label class="control-label">Company </label>
        <div class="controls">
          <select id="company_id_<%= rf.getCid() %>">
            <% if (rf.get(Formbuilder.options.mappings.INCLUDE_BLANK)) { %>
              <option value=''></option>
            <% } %>
          </select>
        </div>
      </div>
      <div class="control-group">
        <label class="control-label">Location </label>
        <div class="controls">
          <select id="location_id_<%= rf.getCid() %>">
            <% if (rf.get(Formbuilder.options.mappings.INCLUDE_BLANK)) { %>
              <option value=''></option>
            <% } %>
          </select>
        </div>
      </div>
      <div class="control-group">
        <label class="control-label">Division </label>
        <div class="controls">
          <select id="division_id_<%= rf.getCid() %>">
            <% if (rf.get(Formbuilder.options.mappings.INCLUDE_BLANK)) { %>
              <option value=''></option>
            <% } %>
          </select>
        </div>
      </div>
    </div>
  """

  edit: ""

  addButton: """
    <span class="symbol">
      <span class="icon-caret-down"></span>
    </span> CI-Hierarchy
  """
  selected_comp: null

  bindChangeEvents: (fd_view)->
    do(cid = null, $company_id = null,
      $location_id = null, $division_id = null,
      field_values = null, selected_compId = '',
      selected_locId = '', selected_divId = ''
    ) =>
      cid = fd_view.model.attributes.cid
      field_values = fd_view.model.attributes.field_values
      $company_id = $("#company_id_" + cid)
      $location_id = $("#location_id_" + cid)
      $division_id = $("#division_id_" + cid)
      $company_id.bind('change', { that: @, fd_view: fd_view },
                       @populateLocationsByCompanyId)
      $location_id.bind('change', { that: @, fd_view: fd_view },
                       @populateDivisionsByLocId)
      if field_values
        if $company_id
          selected_compId = @getSelectedFieldVal($company_id, field_values)
        if $location_id
          selected_locId = @getSelectedFieldVal($location_id, field_values)
        if $division_id
          selected_divId = @getSelectedFieldVal($division_id, field_values)
      @populateCompanies(fd_view, selected_compId,
                         selected_locId, selected_divId)

  getSelectedFieldVal: ($ele, fieldValues) ->
    do(name = '', selectedId='') =>
      name = $ele.attr('name')
      selectedId = fieldValues[name]
      selectedId

  populateCompanies: (fd_view, selected_compId = '', selected_locId = '',
                      selected_divId = '') ->
    do(companies = Formbuilder.options.COMPANY_HIERARCHY,
      $company_id = null, cid = null
    ) =>
      cid = fd_view.model.attributes.cid
      $company_id = $("#company_id_" + cid)
      if($company_id && companies && companies.length > 0)
        $company_id.empty()
        fd_view.field.clearSelectFields(cid)
        fd_view.field.addPlaceHolder($company_id, '--- Select ---')
        fd_view.field.appendData($company_id, companies)
        if selected_compId && selected_compId != ''
          $company_id.val selected_compId
          @setSelectedCompAndPopulateLocs(fd_view, selected_compId,
                                          selected_locId, selected_divId)

  populateLocationsByCompanyId: (e) ->
    do(selected_company_id = $(e.currentTarget).val(),
      that = e.data.that,
      fd_view = e.data.fd_view
    ) =>
      that.setSelectedCompAndPopulateLocs(fd_view, selected_company_id)

  setSelectedCompAndPopulateLocs: (fd_view, selected_compId,
                                   selected_locId = '', selected_divId = '') ->
    @selected_comp = Formbuilder.options.COMPANY_HIERARCHY.getHashObject(
      selected_compId)
    @clearSelectFields(fd_view.model.attributes.cid)
    @populateLocations(
      fd_view, this.selected_comp, selected_locId, selected_divId)

  populateLocations: (fd_view, selected_comp,
                      selected_locId = '', selected_divId = '') ->
    do(locations = [],
       $location_id = null
    ) =>
      $location_id = $("#location_id_" + fd_view.model.attributes.cid)
      if selected_comp
        locations = selected_comp.locations

      if($location_id && locations.length > 0)
        @addPlaceHolder($location_id, '--- Select ---')
        @appendData($location_id, locations)
        if selected_locId && selected_locId != ''
          $location_id.val selected_locId
          @setSelectedLocAndPopulateDivs(fd_view, selected_locId,
                                             selected_divId)

  populateDivisionsByLocId: (e) ->
    do(selected_location_id = $(e.currentTarget).val(),
      that = e.data.that,
      fd_view = e.data.fd_view
    ) =>
      that.setSelectedLocAndPopulateDivs(fd_view, selected_location_id)

  setSelectedLocAndPopulateDivs: (fd_view, selected_locId,
                                  selected_divId = '') ->
    do(selected_loc = null)=>
      selected_loc = @selected_comp.locations.getHashObject(selected_locId)
      @populateDivisions(fd_view, selected_loc, selected_divId)

  populateDivisions: (fd_view, selected_loc, selected_divId = '') ->
    do( divisions = [],
        $division_id = null
    ) =>
      $division_id = $("#division_id_" + fd_view.model.attributes.cid)
      if selected_loc
        divisions = selected_loc.divisions
      $division_id.empty()
      @addPlaceHolder($division_id, '--- Select ---')
      if $division_id && divisions.length > 0
        @appendData($division_id, divisions)
        if selected_divId && selected_divId != ''
          $division_id.val selected_divId

  clearSelectFields: (cid) ->
    $("#location_id_"+ cid).empty()
    $("#division_id_"+ cid).empty()

  appendData: ($element, data) ->
    do(appendString = '') =>
      _.each data, (obj_hash) ->
        @appendString = "<option value='" + obj_hash.id + "'>"
        @appendString += obj_hash.name + "</option>"
        $element.append @appendString

  addPlaceHolder: ($element, name) ->
    $element.html("<option value=''>"+ name + "</option>")

  clearFields: ($el, model) ->
    do(cid = '') =>
      cid = model.attributes.cid
      $el.find("#company_id_"+ cid).val("")
      $el.find("#location_id_"+ cid).val("")
      $el.find("#division_id_"+ cid).val("")

  isValid: ($el, model) ->
    do(valid = false, cid = '') =>
      cid = model.attributes.cid
      valid = do (required_attr = model.get('required'), checked_chk_cnt = 0) ->
        return true if !required_attr
        return ($el.find("#company_id_" + cid).val() != '' &&
                $el.find("#location_id_" + cid).val() != '' &&
                $el.find("#division_id_" + cid).val() != '')
      valid

  evalCondition: (clicked_element, cid, condition, set_value) ->
    do(check_result = false, $comp = null, $loc = null, $div = null,
       comp_name = '', comp_id = '', loc_id = '', div_id = '',
       loc_name = '', div_name = '', _toLowerCase_set_val = ''
    ) =>
      $comp = clicked_element.find("#company_id_" + cid)
      $loc = clicked_element.find("#location_id_" + cid)
      $div = clicked_element.find("#division_id_" + cid)
      comp_id = $comp.val()
      loc_id = $loc.val()
      div_id = $div.val()
      comp_name = $comp.find('option:selected').text()
      loc_name = $loc.find('option:selected').text()
      div_name = $div.find('option:selected').text()
      if condition == '!='
        check_result = (comp_id != '' && loc_id != '' &&
                        div_id != '')
      else if condition == '=='
        _toLowerCase_set_val = set_value.toLowerCase()
        check_result = (comp_name.toLowerCase() is _toLowerCase_set_val ||
                        loc_name.toLowerCase() is _toLowerCase_set_val ||
                        div_name.toLowerCase() is _toLowerCase_set_val)
      check_result

  add_remove_require:(cid, required) ->
    $("#company_id_" + cid).attr("required", required)
    $("#location_id_" + cid).attr("required", required)
    $("#division_id_" + cid).attr("required", required)
