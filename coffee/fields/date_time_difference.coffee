Formbuilder.registerField 'date_time_difference',

  view: """
    <div class='input-line'>
      <span>
        <input class="hasDateTimepicker" id='<%= rf.getCid()%>_startDateTimeDifference' type='text' readonly date_format='<%= rf.get(Formbuilder.options.mappings.DATE_FORMAT)%>'/>

        <label><%= rf.get(Formbuilder.options.mappings.START_DATE_TIME_TEXT) || 'Start Date Time' %></label>
      </span>
      <span>
        <input class="hasDateTimepicker" id='<%= rf.getCid()%>_endDateTimeDifference' type='text' readonly date_format='<%= rf.get(Formbuilder.options.mappings.DATE_FORMAT)%>'/>
        <label><%= rf.get(Formbuilder.options.mappings.END_DATE_TIME_TEXT) || 'End Date Time' %></label>
      </span>
      <span>
        <input id='<%= rf.getCid()%>_differenceDateTimeDifference' type='text' readonly data-text="qwerty"/>
        <label><%= rf.get(Formbuilder.options.mappings.DATETIME_DIFFERENCE_TEXT) || 'Difference' %></label>
      </span>
      <script>
        $(function() {
          $("#<%= rf.getCid() %>_startDateTimeDifference")
              .datetimepicker({
                  dateFormat: '<%= rf.get(Formbuilder.options.mappings.DATE_FORMAT) || 'dd/mm/yy' %>',
                  stepMinute: parseInt('<%= rf.get(Formbuilder.options.mappings.STEP) || '1' %>'),
                  addSliderAccess: true,
                  sliderAccessArgs: { touchonly: false },
                  changeMonth : true,
                  changeYear : true,
                  yearRange: '-100y:+100y'
               });
          $("#<%= rf.getCid() %>_endDateTimeDifference")
                .datetimepicker({
                    dateFormat: '<%= rf.get(Formbuilder.options.mappings.DATE_FORMAT) || 'dd/mm/yy' %>',
                    stepMinute: parseInt('<%= rf.get(Formbuilder.options.mappings.STEP) || '1' %>'),
                    addSliderAccess: true,
                    sliderAccessArgs: { touchonly: false },
                    changeMonth : true,
                    changeYear : true,
                    yearRange: '-100y:+100y'
                 });
        })
      </script>
    </div>
  """

  setup: (field_view, model) ->
    do( dateTimeFields = [ field_view.$el.find('#'+model.getCid()+'_startDateTimeDifference'),
        field_view.$el.find('#'+model.getCid()+'_endDateTimeDifference') ]) =>
      _.each dateTimeFields, (el) =>
        if Formbuilder.isMobile()
          setTimeout (->
            el.datetimepicker 'setDate', new Date()
            return
          ), 500
        else
          el.datetimepicker 'setDate', new Date()
        $(el).click ->
          $("#ui-datepicker-div").css( "z-index", 3 )
        $('#ui-datepicker-div').css('display','none')
        el.blur()

      if model.get('field_values')
        _.each dateTimeFields, (el) =>
          el.val(model.attributes.field_values["#{model.getCid()}_1"])
        field_view.$el.find('#'+model.getCid()+'_differenceDateTimeDifference').val(model.attributes.field_values["#{model.getCid()}_3"])

      _.each dateTimeFields, (el) =>
        el.change {ele: field_view.$el, fmt: model.get('field_options').date_format || 'dd/mm/yy', cid:model.getCid() }, @changeEventHandler

  changeEventHandler: (event, data) =>
    data = event.data if typeof data is "undefined"
    do( cid = data.cid,
        st_date_str = data.ele.find("#" + data.cid + "_startDateTimeDifference").val(),
        end_date_str = data.ele.find("#" + data.cid + "_endDateTimeDifference").val(),
        diff_str = "",
        fmt = data.fmt, days = 0, hrs = 0, mins = 0, st_date_obj = "",
        end_date_obj = "", st_date_mili = "", end_date_mili = "",
        one_day_mili = 24 * 60 * 60 * 1000, one_hour_mili = 60 * 60 * 1000,
        diff_field = data.ele.find("#" + data.cid + "_differenceDateTimeDifference") ) =>
        if st_date_str && end_date_str
          st_date_str = (if (fmt is "dd/mm/yy") then st_date_str.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3") else st_date_str)
          end_date_str = (if (fmt is "dd/mm/yy") then end_date_str.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3") else end_date_str)
          st_date_obj = new Date(st_date_str)
          end_date_obj = new Date(end_date_str)
          st_date_mili = st_date_obj.getTime()
          end_date_mili = end_date_obj.getTime()
          diff_time = end_date_mili - st_date_mili
          diff_time = (if (diff_time < 0) then (diff_time*(-1)) else diff_time)
          days = Math.floor(diff_time / one_day_mili)
          hrs = Math.floor( (diff_time - days * one_day_mili) / one_hour_mili)
          mins = Math.round( (diff_time - days * one_day_mili - hrs * one_hour_mili) / 60000)
          diff_str = days + "d " + hrs + "h " + mins + "m"
        diff_field.val(diff_str)

  edit: """
    <%= Formbuilder.templates['edit/datetime_difference_labels']() %>
    <%= Formbuilder.templates['edit/date_format']() %>
  """

  addButton: """
    <span class="symbol"><span class="icon-calendar"></span></span> Date Time Difference
  """

  print: """
    <label id="st_dt_print"></label>
    <label id="end_dt_print"></label>
    <label id="diff_dt_print"></label>
  """

  setValForPrint: (field_view, model) ->
    field_view.$el.find('#st_dt_print').html(model.get('field_values')["#{model.getCid()}_1"]);
    field_view.$el.find('#end_dt_print').html(model.get('field_values')["#{model.getCid()}_2"]);
    field_view.$el.find('#diff_dt_print').html(model.get('field_values')["#{model.getCid()}_3"]);

  checkAttributeHasValue: (cid, $el)->
    do(incomplete = false) =>
      call_back = ->
        if($(this).val() == "")
          incomplete = true
      $el.find("input[type=text]").each(call_back);
      incomplete = true if($el.find('select').val() == "")
      return false if(incomplete == true)
      return cid

  isValid: ($el, model) ->
    do(valid = false) =>
      valid = do (required_attr = model.get('required'), cid=model.getCid()) =>
        return true if !required_attr
        return ($el.find("#"+cid+"_startDateTimeDifference").val() != '' &&
                $el.find("#"+cid+"_endDateTimeDifference").val() != '' &&
                $el.find("#"+cid+"_differenceDateTimeDifference").val() != '')
      valid

  clearFields: ($el, model) ->
    do( targetFields = [
        $el.find("[name = " + model.getCid() + "_1]"),
        $el.find("[name = " + model.getCid() + "_2]"),
        $el.find("[name = " + model.getCid() + "_3]")
      ] ) =>
    _.each targetFields, (el) =>
      el.val("")

  convertToMili: (dhmStr) ->
    do(
      d=0,
      h=0,
      m=0,
      res=0,
      parts = dhmStr.split(" ")
    ) =>
      for val in parts
         do(val) ->
          switch val.substring(val.length,val.length-1)
            when 'd' then d=val.substring(0,val.length-1)
            when 'h' then h=val.substring(0,val.length-1)
            when 'm' then m=val.substring(0,val.length-1)
      if isNaN(d) || isNaN(d) || isNaN(d)
        res = 0
      else
        res = d*86400000 + h*3600000 + m*60000
      res

  evalCondition: (clicked_element, cid, condition, set_value) ->
    do(
       elem_val = '' ,
       check_result = false
    ) =>
    elem_val = clicked_element.find("#"+cid+"_differenceDateTimeDifference").val()
    elem_val = @convertToMili(elem_val)
    set_value = @convertToMili(set_value)
    check_result = condition("'#{elem_val}'", "'#{set_value}'")
    check_result
