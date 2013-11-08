Formbuilder.registerField 'fullname',
  perfix: ['Mr.', 'Mrs.', 'Miss.', 'Ms.', 'Mst.', 'Dr.']
  view: """
    <div class='input-line'>
      <span>
        <select class='span12'>
          <%for (i = 0; i < this.perfix.length; i++){%>
            <option><%= this.perfix[i]%></option>
          <%}%>
        </select>
        <label>Prefix</label>
      </span>

      <span>
        <input type='text' />
        <label>First</label>
      </span>

      <% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>
        <span>
          <input type='text' />
          <label>Middle</label>
        </span>
      <% } %>

      <span>
        <input type='text' />
        <label>Last</label>
      </span>

      <span>
        <input type='text' />
        <label>Suffix</label>
      </span>
    </div>
  """

  edit: """
    <%= Formbuilder.templates['edit/middle']({ includeOther: true }) %>
  """

  addButton: """
    <span class="symbol"><span class="icon-user"></span></span> Full Name
  """
