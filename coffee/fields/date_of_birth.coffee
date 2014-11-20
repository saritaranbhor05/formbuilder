Formbuilder.registerField 'date_of_birth',

  view: """
    <div class='input-line'>
      <input id='<%= rf.getCid() %>' type='text' readonly date_format='<%= rf.get(Formbuilder.options.mappings.DATE_FORMAT)%>'/>
    </div>
  """

  edit: """
    <%= Formbuilder.templates['edit/age_restriction']({ includeOther: true }) %>
    <%= Formbuilder.templates['edit/date_format']() %>
  """

  addButton: """
    <span class="symbol"><span class="icon-gift"></span></span> Birth Date
  """

  print: """
    <label id="dob_print"></label>
  """

  setValForPrint: (field_view, model) ->
    field_view.$el.find('#dob_print').html(model.get('field_values')["#{model.getCid()}_1"]);


  setup: (field_view, model) ->
    el = field_view.$el.find('input')
    do(today = new Date, restricted_date = new Date) =>
      if model.get(Formbuilder.options.mappings.MINAGE)
        restricted_date.setFullYear(
          today.getFullYear() -
          model.get(Formbuilder.options.mappings.MINAGE)
        )
        el.datepicker({
          dateFormat: model.get(Formbuilder.options.mappings.DATE_FORMAT) || 'dd/mm/yy',
          changeMonth : true,
          changeYear : true,
          yearRange: '-100y:c+nn',
          maxDate: restricted_date
        });
      else
        el.datepicker({
          dateFormat: model.get(Formbuilder.options.mappings.DATE_FORMAT) || 'dd/mm/yy',
          changeMonth : true,
          changeYear : true,
          yearRange: '-100y:c+nn',
          maxDate: today
        });
      if model.get('field_values')
        el.val(model.get('field_values')["#{model.getCid()}_1"])
      $(el).click ->
        $("#ui-datepicker-div").css( "z-index", 3 )

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

  checkAttributeHasValue: (cid, $el)->
    return false if($el.find("input[type=text]").val() == "")
    return cid

  evalCondition: (clicked_element, cid, condition, set_value, field) ->
    do(
       firstValue = '' ,
       check_result = false,
       secondValue = '',
       is_true = false,
       check_field_date_format = ''
    ) =>
      check_field_date_format = clicked_element.find("[name = "+cid+"_1]").attr('date_format')
      firstValue = clicked_element
                          .find("[name = "+cid+"_1]").val()
      firstValue = firstValue.split('/')
      if(check_field_date_format is 'mm/dd/yy')
        hold_date = firstValue[0]
        firstValue[0] = firstValue[1]
        firstValue[1] = hold_date
      secondValue = set_value.split('/')
      is_true = field.check_date_result(condition,firstValue,secondValue)

  add_remove_require:(cid,required) ->
    $("." + cid)
            .find("[name = "+cid+"_1]")
            .attr("required", required)

  fieldToValue: ($el, model) ->
    do(elem = $el.find('[name^='+model.getCid()+']'),
      res = {}) ->
      res[$(elem).attr('name')] = $(elem).val()
      res
