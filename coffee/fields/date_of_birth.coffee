Formbuilder.registerField 'date_of_birth',

  today: new Date

  restricted_date: new Date

  view: """
    <div class='input-line'>
      <input type='date' max=<%= this.today.toISOString().slice(0,10)%> />
    </div>
  """

  edit: """
    <%= Formbuilder.templates['edit/age_restriction']({ includeOther: true }) %>
  """

  addButton: """
    <span class="symbol"><span class="icon-gift"></span></span> BirthDay
  """

  setup: (el, model, index) ->
    if model.get(Formbuilder.options.mappings.MINAGE)
      this.restricted_date.setFullYear(
        this.today.getFullYear() -
        model.get(Formbuilder.options.mappings.MINAGE)
      )
      el.attr("max", this.restricted_date.toISOString().slice(0,10))