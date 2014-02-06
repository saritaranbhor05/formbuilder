Formbuilder.registerField 'document_center_hyperlink',

  view: """
    <div id='document_list_<%= rf.getCid() %>'></div>
    <script>
      $(function() {
        var data = "<%=rf.get(Formbuilder.options.mappings.HTML_DATA)%>";
        $("#document_list_<%= rf.getCid() %>").html(data);
      });
    </script>
    <div id="open_model_<%= rf.getCid() %>" class="modal hide fade modal_style" tabindex="-1"
      role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"
          aria-hidden="true">&times;</button>
        <h3>Select Documents</h3>
      </div>
      <div class="modal-body" id="modal_body_<%= rf.getCid() %>">
        <div id="doc_hierarchy_tree_<%= rf.getCid() %>" class="modal_section"></div>
      </div>
      <div class="modal-footer">
        <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
      </div>
    </div>
  """

  edit: """
    <div class='fb-edit-section-header'>Options</div>
    <textarea
      id='documents_<%= rf.getCid() %>'
      data-rv-value='model.<%= Formbuilder.options.mappings.HTML_DATA %>'
      style="
        display:none;
      "
    >
    </textarea>
    <div class='fb-bottom-add'>
      <a id='button_<%= rf.getCid() %>' class="js-add-document <%= Formbuilder.options.BUTTON_CLASS %>">Add Documents</a>
    </div>
    <script>
      $(function() {
        var geo_doc_hierarchy =
          [
            {companies:"Company"},
            {locations:"Location"},
            {divisions:"Division"},
            {documents:"Document"}
          ];
        $("#button_<%= rf.getCid() %>").click( function() {
          $("#open_model_<%= rf.getCid() %>").modal('show');
          $("#open_model_<%= rf.getCid() %>").on('shown', function() {
            getHierarchy(getListOfPerviousDocuments(
              'document_list_<%= rf.getCid() %>',
              'a'
            ));
          });
          $("#open_model_<%= rf.getCid() %>").on('hidden', function() {
            addSelectedDocuments(getListOfPerviousDocuments(
              'doc_hierarchy_tree_<%= rf.getCid() %>',
              'input'
            ));
            $(this).unbind('shown');
            $(this).unbind('hidden');
            hierarchy_selector_view.remove();
            $("#modal_body_<%= rf.getCid() %>").append('<div id="doc_hierarchy_tree_<%= rf.getCid() %>" class="modal_section"></div>');
          });
        });

        function getListOfPerviousDocuments(el,el_type){
          var checked_documents = {},
              document_ids_hash = {documents:[]}, checked;
          checked = el_type === 'a' ? '' : ':checked'
          checked_documents =
            $('#'+el).find(
              el_type+'[level=document]'+checked
            );
          console.log(checked_documents);
          _.each(checked_documents, function(checked_document){
            var document_id;
            document_id = checked_document.id;
            document_ids_hash['documents'].push(document_id.slice(9,document_id.length));
          });
          return document_ids_hash;
        }

        function addSelectedDocuments(document_ids_hash) {
          var final = '';
          _.each(document_ids_hash['documents'], function(document_id){
            var document_url = '/documents/'+document_id;
            $.ajax({
              async: "false",
              url: document_url,
              type: "GET",
              data: {},
              dataType: "json",
              success: function (result) {
                if(result){
                  final = final.concat(
                    "<a level='document' id='document_"+document_id+"' target='_blank' href='"+result.document.public_document_url+"'>"+result.document.name+"</a></br>"
                  );
                  $("#documents_<%= rf.getCid() %>").val(final);
                  $("#documents_<%= rf.getCid() %>").trigger("change");
                }
              }
            });
          });
        };

        function getHierarchy(document_ids_hash) {
          var that =  this,
          source_url = '/companies?include_hierarchy=true&include_doc=true&'+
                       'pagination=false';
          $.ajax({
            async: "false",
            url: source_url,
            type: "GET",
            data: {},
            dataType: "json",
            success: function (result) {
              if(result){
                that.company_hierarchy = result;
                that.gen_doc_hierarchy = generate_company_hierarchy_tree(
                  that.company_hierarchy, geo_doc_hierarchy);
                that.hierarchy_selector_view = new Formbuilder.options.HIERARCHYSELECTORVIEW({el: $("#doc_hierarchy_tree_<%= rf.getCid() %>"),
                  generated_hierarchy: that.gen_doc_hierarchy,
                  pre_selected_hierarchy: document_ids_hash,
                  hierarchy_mapping: geo_doc_hierarchy
                });
              }
            }
          });
        };
      });
    </script>
  """

  addButton: """
    <span class="symbol"><span class="icon-list"></span></span> Doc. Link
  """
