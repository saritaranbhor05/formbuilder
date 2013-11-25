Formbuilder.registerField 'section_break',

  type: 'non_input'

  view: """
    <div class="easyWizardButtons" style="clear: both;">
      <button class="next">
        <%= rf.get(Formbuilder.options.mappings.NEXT_BUTTON_TEXT) || 'Next' %>
      </button>
      <button class="prev">
        <%= rf.get(Formbuilder.options.mappings.PREV_BUTTON_TEXT) || 'Back' %>
      </button>
    </div>
  """

  edit: """
    <div class='fb-edit-section-header'>Next button</div>
    <input type="text" pattern="[a-zA-Z0-9_\\s]+" data-rv-input=
      "model.<%= Formbuilder.options.mappings.NEXT_BUTTON_TEXT %>"
      value='Next'/>

    <div class='fb-edit-section-header'>Back button</div>
    <input type="text" pattern="[a-zA-Z0-9_\\s]+" data-rv-input=
      "model.<%= Formbuilder.options.mappings.PREV_BUTTON_TEXT %>"
      value='Back'/>
  """

  addButton: """
    <span class='symbol'><span class='icon-minus'></span></span> Section Break
  """
