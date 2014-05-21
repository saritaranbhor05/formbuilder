Formbuilder.registerField 'date_time',

  view: """
    <% if(!rf.get(Formbuilder.options.mappings.TIME_ONLY) && !rf.get(Formbuilder.options.mappings.DATE_ONLY)) { %>
      <div class='input-line'>
        <input id='<%= rf.getCid()%>_datetime' type='text' readonly date_format='<%= rf.get(Formbuilder.options.mappings.DATE_FORMAT)%>'/>
      </div>
      <script>
        $(function() {
          $("#<%= rf.getCid() %>_datetime")
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
    <% } else if(rf.get(Formbuilder.options.mappings.TIME_ONLY)) { %>
      <div class='input-line'>
        <input id='<%= rf.getCid() %>_time' type='text' readonly />
      </div>
      <script>
        $(function() {
          $("#<%= rf.getCid() %>_time")
                .timepicker({
                    stepMinute: parseInt('<%= rf.get(Formbuilder.options.mappings.STEP) || '1' %>'),
                    addSliderAccess: true,
                    sliderAccessArgs: { touchonly: false }
                  });
        })
      </script>
    <% } else if(rf.get(Formbuilder.options.mappings.DATE_ONLY)) { %>
      <div class='input-line'>
        <input id='<%= rf.getCid() %>_date' type='text' readonly date_format='<%= rf.get(Formbuilder.options.mappings.DATE_FORMAT)%>' />
      </div>
      <script>
        $(function() {
          $("#<%= rf.getCid() %>_date")
              .datepicker({
                  dateFormat: '<%= rf.get(Formbuilder.options.mappings.DATE_FORMAT) || 'dd/mm/yy' %>',
                  changeMonth : true,
                  changeYear : true,
                  yearRange: '-100y:+100y'
                });
        })
      </script>
    <% } %>
  """

  edit: """
    <%= Formbuilder.templates['edit/date_only']() %>
    <%= Formbuilder.templates['edit/time_only']() %>
    <%= Formbuilder.templates['edit/step']() %>
    <%= Formbuilder.templates['edit/date_format']() %>
  """

  addButton: """
    <span class="symbol"><span class="icon-calendar"></span></span> Date and Time
  """

  checkAttributeHasValue: (cid, $el)->
    return false if($el.find("input[type=text]").val() == "")
    return cid

  setup: (field_view, model) ->
    do(today = new Date, el = field_view.$el.find('input')) =>
      if !model.get('field_values')
        if el.attr('id') is model.getCid()+'_datetime'
          if Formbuilder.isMobile()
            setTimeout (->
              el.datetimepicker 'setDate', new Date()
              return
            ), 500
          else
            el.datetimepicker 'setDate', new Date()
        else if el.attr('id') is model.getCid()+'_date'
          if Formbuilder.isMobile()
            setTimeout (->
              el.datepicker 'setDate', new Date()
              return
            ), 500
          else
            el.datepicker 'setDate', new Date()
        else
          if Formbuilder.isMobile()
            setTimeout (->
              el.timepicker 'setTime', new Date()
              return
            ), 500
          else
            el.timepicker 'setTime', new Date()
      else
        el.val(model.get('field_values')["#{model.getCid()}_1"])
      $(el).click ->
        $("#ui-datepicker-div").css( "z-index", 3 )
      $('#ui-datepicker-div').css('display','none')
      el.blur()

  isValid: ($el, model) ->
    do(valid = false) =>
      valid = do (required_attr = $el.find("[name = "+model.getCid()+"_1]").attr("required")) =>
        return true if !required_attr
        return $el.find(".hasDatepicker").val() != ''
      valid

  clearFields: ($el, model) ->
    $el.find("[name = " + model.getCid() + "_1]").val("")


  check_date_result: (condition, firstValue, secondValue) ->
    firstValue[0] = parseInt(firstValue[0])
    firstValue[1] = parseInt(firstValue[1])
    firstValue[2] = parseInt(firstValue[2])

    secondValue[0] = parseInt(secondValue[0])
    secondValue[1] = parseInt(secondValue[1])
    secondValue[2] = parseInt(secondValue[2])

    if (condition == "<")
      if(firstValue[2] <= secondValue[2] &&
         firstValue[1] <= secondValue[1] &&
         firstValue[0] < secondValue[0])
            true
      else
        false
    else if(condition == ">")
      if(firstValue[2] >= secondValue[2] &&
         firstValue[1] >= secondValue[1] &&
         firstValue[0] > secondValue[0])
           true
      else
        false
    else
      if(firstValue[2] is secondValue[2] &&
         firstValue[1] is secondValue[1] &&
         firstValue[0] is secondValue[0])
            true
      else
        false

  check_time_retult: (clicked_element, cid, condition, set_value,split_string) ->
    do(firstDate = new Date(),secondDate = new Date()
        , firstValue = ""
        , secondValue = ""
        , combinedValue = ''
    ) =>
      if split_string
        combinedValue = clicked_element
                          .find("[name = "+cid+"_1]").val()
        combinedValue = combinedValue.split(' ')
        firstValue = combinedValue[1]
      else
        firstValue = clicked_element
                    .find("[name = "+cid+"_1]").val()
      if firstValue
        firstValue = firstValue.split(':')
        secondValue = set_value.split(':')
        firstDate.setHours(firstValue[0])
        firstDate.setMinutes(firstValue[1])
        secondDate.setHours(secondValue[0])
        secondDate.setMinutes(secondValue[1])
        if (condition == "<")
          (firstDate < secondDate)? true: false
        else if(condition == ">")
          (firstDate > secondDate)? true: false
        else if(condition == "==")
          if(parseInt(firstValue[0]) == parseInt(secondValue[0]) &&
             parseInt(firstValue[1]) == parseInt(secondValue[1]))
              true

  evalCondition: (clicked_element, cid, condition, set_value, field) ->
    do(
       combinedValue = ''
       firstValue = '' ,
       check_result = false,
       secondValue = '',
       is_date_true = false,
       is_time_true = false,
       split_string = false,
       hold_date = ''
       check_field_date_format = ''
    ) =>
      check_field_id = clicked_element.find("[name = "+cid+"_1]").attr('id')
      check_field_date_format = clicked_element.find("[name = "+cid+"_1]").attr('date_format')

      if check_field_id is cid+'_datetime'
        combinedValue = clicked_element
                          .find("[name = "+cid+"_1]").val()
        combinedValue = combinedValue.split(' ')
        firstValue = combinedValue[0]
        if firstValue
          firstValue = firstValue.split('/')
          if(check_field_date_format is 'mm/dd/yy')
            hold_date = firstValue[0]
            firstValue[0] = firstValue[1]
            firstValue[1] = hold_date
          set_value = set_value.split(' ')
          secondValue = set_value[0].split('/')
          is_date_true = field.check_date_result(condition,firstValue,secondValue)
          split_string = true
          is_time_true = field.check_time_retult(clicked_element, cid, condition, set_value[1],split_string)
          if is_date_true and is_time_true
            true
      else if check_field_id is cid+'_date'
        firstValue = clicked_element
                          .find("[name = "+cid+"_1]").val()
        if firstValue
          firstValue = firstValue.split('/')
          if(check_field_date_format is 'mm/dd/yy')
            hold_date = firstValue[0]
            firstValue[0] = firstValue[1]
            firstValue[1] = hold_date
          secondValue = set_value.split('/')
          is_date_true = field.check_date_result(condition,firstValue,secondValue)
      else
        is_time_true = field.check_time_retult(clicked_element, cid, condition, set_value , split_string)

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)

  show_or_hide: (field_view, model, check_result, action) ->
    do($input_el = field_view.$el.find('input')) =>
      if(check_result) # If condition is true then adding class
        if (action == 'show')
          field_view.$el.removeClass('hide').addClass('show')
        else
          field_view.$el.removeClass('show').addClass('hide')
        if $input_el.val() == ''
          $input_el.datetimepicker 'setDate', new Date()
      else # Reverting an action done
        if (action == 'show')
          field_view.$el.removeClass('show').addClass('hide')
        else
          field_view.$el.removeClass('hide').addClass('show')