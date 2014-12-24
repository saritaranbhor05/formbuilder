Formbuilder.registerField 'section_break',
  caption: 'Section Break'
  type: 'non_input'

  view: """
    <div class="easyWizardButtons" style="clear: both;">
      <button class="next btn-success">
        <%= rf.get(Formbuilder.options.mappings.NEXT_BUTTON_TEXT) || 'Next' %>
      </button>
      <% if(rf.get(Formbuilder.options.mappings.BACK_VISIBLITY) != 'false') {
          rf.set(Formbuilder.options.mappings.BACK_VISIBLITY,'true')
        }
      %>
      <% if(rf.get(Formbuilder.options.mappings.BACK_VISIBLITY) == 'true'){%>
        <button class="prev btn-danger">
          <%= rf.get(Formbuilder.options.mappings.PREV_BUTTON_TEXT) || 'Back' %>
        </button>
      <% } %>
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

    <%= Formbuilder.templates['edit/back_visiblity']() %>
    <div class='fb-edit-section-header'>Recurring section</div>

    <label>
      <input type='checkbox' data-rv-checked='model.<%= Formbuilder.options.mappings.RECURRING_SECTION %>' />
  Allow multiple entries for following section
    </label>
  """

  print: """
    <div class="section_break_div">
      <hr>
    </div>
  """

  addButton: """
    <span class='symbol'><span class='icon-minus'></span></span> Section Break
  """

  checkAttributeHasValue: (cid, $el)->
    true
