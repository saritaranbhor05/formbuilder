Formbuilder.registerField 'date',

  view: """
    <div class='input-line'>
      <input id='<%= rf.getCid() %>' type='text' />
    </div>
    <script>
      $(function() {
        $("#<%= rf.getCid() %>").datepicker();
      });
    </script>
  """

  edit: ""

  addButton: """
    <span class="symbol"><span class="icon-calendar"></span></span> Date
  """
