Formbuilder.registerField 'date_of_birth',

  view: """
    <div class='input-line'>
      <input id='<%= rf.getCid() %>' type='text' readonly/>
    </div>
  """

  edit: """
    <%= Formbuilder.templates['edit/age_restriction']({ includeOther: true }) %>
  """

  addButton: """
    <span class="symbol"><span class="icon-gift"></span></span> Birth Date
  """

  setup: (el, model, index) ->
    do(today = new Date, restricted_date = new Date) =>
      if model.get(Formbuilder.options.mappings.MINAGE)
        restricted_date.setFullYear(
          today.getFullYear() -
          model.get(Formbuilder.options.mappings.MINAGE)
        )
        el.datepicker({
          dateFormat: "dd/mm/yy",
          maxDate: restricted_date
        });
      else
        el.datepicker({
          dateFormat: "dd/mm/yy",
          maxDate: today
        });

  isValid: ($el, model) ->
    do(valid = false) =>
      valid = do (required_attr = $el.find("[name = "+model.getCid()+"_1]").attr("required")) =>
        return true if !required_attr
        return $el.find(".hasDatepicker").val() != ''
      valid