Formbuilder.registerField 'date',

  view: """
    <div class='input-line'>
      <input id='<%= rf.getCid() %>' type='text' readonly/>
    </div>
    <script>
      $(function() {
        $("#<%= rf.getCid() %>").datepicker({ dateFormat: "dd/mm/yy" });
      });
    </script>
  """

  edit: ""

  addButton: """
    <span class="symbol"><span class="icon-calendar"></span></span> Date
  """
