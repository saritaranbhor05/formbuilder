Formbuilder.registerField 'address',

  view: """
    <div class='input-line'>
      <span>
        <input type='text' id='address'/>
        <label>Address</label>
      </span>
    </div>

    <div class='input-line'>
      <span>
        <input type='text' id='suburb'/>
        <label>Suburb</label>
      </span>

      <span>
        <input type='text' id='state'/>
        <label>State / Province / Region</label>
      </span>
    </div>

    <div class='input-line' id='zipcode'>
      <span>
        <input type='text' pattern="[a-zA-Z0-9]+"/>
        <label>Zipcode</label>
      </span>

      <span>
        <select class='dropdown_country'><option>United States</option></select>
        <label>Country</label>
      </span>
    </div>
  """

  edit: ""

  addButton: """
    <span class="symbol"><span class="icon-home"></span></span> Address
  """
  clearFields: ($el, model) ->
    $el.find("#address").val("")
    $el.find("#suburb").val("")
    $el.find("#state").val("")
    $el.find("#zipcode").val("")