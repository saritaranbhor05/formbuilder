Formbuilder.registerField 'date',
  caption: 'Date'
  view: """
    <label>
      Unsupported field. Please replace this with the new DateTime field.
    </label>
  """

  edit: ""

  getFieldType: ->
    'date'