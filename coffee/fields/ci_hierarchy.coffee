Formbuilder.registerField 'ci-hierarchy',

  view: """
    <div class="row-fluid">
      <div class="control-group">
        <label class="control-label">Organisation </label>
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
      <div class="control-group">
        <label class="control-label">User </label>
        <div class="controls">
          <select id="user_id_<%= rf.getCid() %>">
            <% if (rf.get(Formbuilder.options.mappings.INCLUDE_BLANK)) { %>
              <option value=''></option>
            <% } %>
          </select>
        </div>
      </div>
    </div>
  """

  edit: ""

  print: """
    <table class="innerTbl">
      <tbody>
        <tr>
          <td><label>Organisation </label>
          </td>
          <td>
            <label>Location </label>
          </td>
          <td>
            <label>Division </label>
          </td>
          <td>
            <label>User </label>
          </td>
        </tr>
        <tr>
          <td>
            <label id="company_id_<%= rf.getCid() %>"></label>
          </td>
          <td>
            <label id="location_id_<%= rf.getCid() %>"></label>
          </td>
          <td>
            <label id="division_id_<%= rf.getCid() %>"></label>
          </td>
          <td>
            <label id="user_id_<%= rf.getCid() %>"></label>
          </td>
        </tr>
      </tbody>
    </table>
  """

  addButton: """
    <span class="symbol">
      <span class="icon-caret-down"></span>
    </span> Hierarchy
  """
  selected_comp: null

  checkAttributeHasValue: (cid, $el) ->
    do(incomplete = false)=>
      call_back = (k,v) ->
        incomplete = true if(v.value == '')
      $el.find('select').each(call_back)
      return false if(incomplete == true)
      return cid

  defaultAttributes: (attrs) ->
    attrs.field_options.size = 'small'
    attrs

  bindChangeEvents: (fd_view)->
    do(cid = null, $company_id = null,
      $location_id = null, $division_id = null,
      field_values = null, selected_compId = '',
      selected_locId = '', selected_divId = '',
      $user_id = null, selected_userId = ''
    ) =>
      cid = fd_view.model.attributes.cid
      field_values = fd_view.model.attributes.field_values
      $company_id = fd_view.$("#company_id_" + cid)
      $location_id = fd_view.$("#location_id_" + cid)
      $division_id = fd_view.$("#division_id_" + cid)
      $user_id = fd_view.$("#user_id_" + cid)
      $company_id.bind('change', { that: @, fd_view: fd_view },
                       @populateLocationsByCompanyId)
      $location_id.bind('change', { that: @, fd_view: fd_view },
                       @populateDivisionsByLocId)
      $division_id.bind('change', { that: @, fd_view: fd_view },
                       @populateUsersByDivisionId)
      if field_values
        if $company_id
          selected_compId = @getSelectedFieldVal($company_id, field_values)
        if $location_id
          selected_locId = @getSelectedFieldVal($location_id, field_values)
        if $division_id
          selected_divId = @getSelectedFieldVal($division_id, field_values)
        if $user_id
          selected_userId = @getSelectedFieldVal($user_id, field_values)
      @populateCompanies(fd_view, selected_compId,
                         selected_locId, selected_divId, selected_userId)

  getSelectedFieldVal: ($ele, fieldValues) ->
    do(name = '', selectedId='') =>
      name = $ele.attr('name')
      selectedId = fieldValues[name]
      selectedId

  populateCompanies: (fd_view, selected_compId = '', selected_locId = '',
                      selected_divId = '', selected_userId = '') ->
    do(companies = Formbuilder.options.COMPANY_HIERARCHY,
      $company_id = null, cid = null
    ) =>
      cid = fd_view.model.attributes.cid
      $company_id = fd_view.$("#company_id_" + cid)
      if($company_id && companies && companies.length > 0)
        $company_id.empty()
        fd_view.field.clearSelectFields(fd_view, cid)
        fd_view.field.addPlaceHolder($company_id, '--- Select ---')
        fd_view.field.appendData($company_id, companies)
        if selected_compId && selected_compId != ''
          $company_id.val selected_compId
          @setSelectedCompAndPopulateLocs(fd_view, selected_compId,
                                          selected_locId, selected_divId, selected_userId)

  populateLocationsByCompanyId: (e) ->
    do(selected_company_id = $(e.currentTarget).val(),
      that = e.data.that,
      fd_view = e.data.fd_view
    ) =>
      that.setSelectedCompAndPopulateLocs(fd_view, selected_company_id)

  setSelectedCompAndPopulateLocs: (fd_view, selected_compId,
                                   selected_locId = '', selected_divId = '',
                                   selected_userId = '') ->
    @selected_comp = Formbuilder.options.COMPANY_HIERARCHY.getHashObject(
      selected_compId)
    @clearSelectFields(fd_view, fd_view.model.attributes.cid)
    @populateLocations(
      fd_view, this.selected_comp, selected_locId, selected_divId, selected_userId)

  populateLocations: (fd_view, selected_comp,
                      selected_locId = '', selected_divId = '',
                      selected_userId = '') ->
    do(locations = [],
       $location_id = null
    ) =>
      $location_id = fd_view.$("#location_id_" + fd_view.model.attributes.cid)
      if selected_comp
        locations = selected_comp.locations

      if($location_id && locations.length > 0)
        @addPlaceHolder($location_id, '--- Select ---')
        @appendData($location_id, locations)
        if selected_locId && selected_locId != ''
          $location_id.val selected_locId
          @setSelectedLocAndPopulateDivs(fd_view, selected_locId,
                                         selected_divId, selected_userId)

  populateDivisionsByLocId: (e) ->
    do(selected_location_id = $(e.currentTarget).val(),
      that = e.data.that,
      fd_view = e.data.fd_view
    ) =>
      that.setSelectedLocAndPopulateDivs(fd_view, selected_location_id)

  setSelectedLocAndPopulateDivs: (fd_view, selected_locId,
                                  selected_divId = '', selected_userId = '') ->
    do(selected_loc = null)=>
      @selected_loc = @selected_comp.locations.getHashObject(selected_locId)
      @populateDivisions(fd_view, @selected_loc, selected_divId, selected_userId)

  populateDivisions: (fd_view, selected_loc, selected_divId = '',
                      selected_userId = '') ->
    do( divisions = [],
        $division_id = null, $user_id = null
    ) =>
      $division_id = fd_view.$("#division_id_" + fd_view.model.attributes.cid)
      $user_id = fd_view.$("#user_id_" + fd_view.model.attributes.cid)
      if selected_loc
        divisions = selected_loc.divisions
      $division_id.empty()
      $user_id.empty()
      @addPlaceHolder($division_id, '--- Select ---')
      if $division_id && divisions.length > 0
        @appendData($division_id, divisions)
        if selected_divId && selected_divId != ''
          $division_id.val selected_divId
          @setSelectedDivAndPopulateUsers(fd_view, selected_divId,
                                          selected_userId)

  populateUsersByDivisionId: (e) ->
    do(selected_division_id = $(e.currentTarget).val(),
      that = e.data.that,
      fd_view = e.data.fd_view
    ) =>
      that.setSelectedDivAndPopulateUsers(fd_view, selected_division_id)

  setSelectedDivAndPopulateUsers: (fd_view, selected_divId,
                                  selected_userId = '') ->
    do(selected_div = null)=>
      selected_div = @selected_loc.divisions.getHashObject(selected_divId)
      @populateUsers(fd_view, selected_div, selected_userId)

  populateUsers: (fd_view, selected_div, selected_userId = '') ->
    do( users = [],
        $user_id = null
    ) =>
      $user_id = fd_view.$("#user_id_" + fd_view.model.attributes.cid)
      if selected_div
        users = selected_div.users
      $user_id.empty()
      @addPlaceHolder($user_id, '--- Select ---')
      if $user_id && users.length > 0
        @appendData($user_id, users)
        if selected_userId && selected_userId != ''
          $user_id.val selected_userId

  clearSelectFields: (fd_view, cid) ->
    fd_view.$("#location_id_"+ cid).empty()
    fd_view.$("#division_id_"+ cid).empty()
    fd_view.$("#user_id_"+ cid).empty()

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
      $el.find("#user_id_"+ cid).val("")

  isValid: ($el, model) ->
    do(valid = false, cid = '') =>
      cid = model.attributes.cid
      valid = do (required_attr = model.get('required'), checked_chk_cnt = 0) ->
        return true if !required_attr
        return ($el.find("#company_id_" + cid).val() != '' &&
                $el.find("#location_id_" + cid).val() != '' &&
                $el.find("#division_id_" + cid).val() != '' &&
                $el.find("#user_id_"+ cid).val() != '')
      valid

  evalCondition: (clicked_element, cid, condition, set_value) ->
    do(check_result = false, $comp = null, $loc = null, $div = null, $user = null,
       comp_name = '', comp_id = '', loc_id = '', div_id = '', user_id = '',
       loc_name = '', div_name = '', _toLowerCase_set_val = '', user_name = ''
    ) =>
      $comp = clicked_element.find("#company_id_" + cid)
      $loc = clicked_element.find("#location_id_" + cid)
      $div = clicked_element.find("#division_id_" + cid)
      $user = clicked_element.find("#user_id_" + cid)
      comp_id = $comp.val()
      loc_id = $loc.val()
      div_id = $div.val()
      user_id = $user.val()
      comp_name = $comp.find('option:selected').text()
      loc_name = $loc.find('option:selected').text()
      div_name = $div.find('option:selected').text()
      user_name = $user.find('option:selected').text()
      if condition == '!='
        check_result = (comp_id != '' && loc_id != '' &&
                        div_id != '' && user_id != '')
      else if condition == '=='
        _toLowerCase_set_val = set_value.toLowerCase()
        check_result = (comp_name.toLowerCase() is _toLowerCase_set_val ||
                        loc_name.toLowerCase() is _toLowerCase_set_val ||
                        div_name.toLowerCase() is _toLowerCase_set_val ||
                        user_name.toLowerCase() is _LowerCase_set_val )
      check_result

  add_remove_require:(cid, required) ->
    $("#company_id_" + cid).attr("required", required)
    $("#location_id_" + cid).attr("required", required)
    $("#division_id_" + cid).attr("required", required)
    $("#user_id_" + cid).attr("required", required)

  setValue: (fd_view) ->
    if fd_view.options.view_type == 'print'
      @setValForPrint(fd_view)
    else
      @bindChangeEvents(fd_view)

  setValForPrint: (fd_view) ->
    do(cid = null, $company_id = null,
      $location_id = null, $division_id = null, $user_id = null,
      field_values = null, selected_compId = '',
      selected_locId = '', selected_divId = '', selected_userId = '',
      comp_obj = null, loc_obj = null, div_obj = null, user_obj = null,
      companies = Formbuilder.options.COMPANY_HIERARCHY
    ) =>
      cid = fd_view.model.attributes.cid
      field_values = fd_view.model.attributes.field_values
      $company_id = fd_view.$("#company_id_" + cid)
      $location_id = fd_view.$("#location_id_" + cid)
      $division_id = fd_view.$("#division_id_" + cid)
      $user_id = fd_view.$("#user_id_" + cid)
      if field_values
        selected_compId = field_values[cid+'_1'] if $company_id
        selected_locId = field_values[cid+'_2'] if $location_id
        selected_divId = field_values[cid+'_3'] if $division_id
        selected_userId = field_values[cid+'_4'] if $user_id && field_values[cid+'_4']
      if selected_compId
        comp_obj = @findObjFrmData(companies, selected_compId)
        $company_id.text(comp_obj && comp_obj.name || '')
        if comp_obj && selected_locId
            loc_obj = @findObjFrmData(comp_obj.locations, selected_locId)
            $location_id.text(loc_obj && loc_obj.name || '')
            if loc_obj && selected_divId
              div_obj = @findObjFrmData(loc_obj.divisions, selected_divId)
              $division_id.text(div_obj && div_obj.name || '')
              if div_obj && selected_userId
                user_obj = @findObjFrmData(div_obj.users, selected_userId)
                $user_id.text(user_obj && user_obj.name || '')
        else
          @setEmptyForPrint(fd_view, cid)
      else
        @setEmptyForPrint(fd_view, cid)

  findObjFrmData: (data, selected_id) ->
    do(obj = null) =>
      _.each data, (obj_hash) ->
        if obj_hash.id == parseInt(selected_id)
          obj = obj_hash
          return false
      return obj

  setEmptyForPrint: (fd_view, cid) ->
    fd_view.$("#company_id_" + cid).text('')
    fd_view.$("#location_id_" + cid).text('')
    fd_view.$("#division_id_" + cid).text('')
    fd_view.$("#user_id_" + cid).text('')