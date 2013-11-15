Formbuilder.registerField 'date_of_birth',

  view: """
    <div class='input-line'>
      <input type='date'/>
    </div>
  """

  edit: """
    <%= Formbuilder.templates['edit/age_restriction']({ includeOther: true }) %>
  """

  addButton: """
    <span class="symbol"><span class="icon-gift"></span></span> BirthDay
  """

  setup: (el, model, index) ->
    do(today = new Date, restricted_date = new Date) =>
      if model.get(Formbuilder.options.mappings.MINAGE)
        restricted_date.setFullYear(
          today.getFullYear() -
          model.get(Formbuilder.options.mappings.MINAGE)
        )
        el.attr("max", restricted_date.toISOString().slice(0,10))
      else
        el.attr("max", today.toISOString().slice(0,10))
