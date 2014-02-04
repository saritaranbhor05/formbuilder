Formbuilder.registerField 'document_center_hyperlink',

  view: """
    <div id='<%= rf.getCid() %>'></div>
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
    <div class='fb-edit-section-header'>Add Document</div>
    <button id='button_<%= rf.getCid() %>' class="pull-right flip-button  icon-plus-sign">
    </button>
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
            getHierarchy();
          });
          $("#open_model_<%= rf.getCid() %>").on('hidden', function() {
            var ckecked_documents = {}, document_ids = [];
            ckecked_documents =
              $('#doc_hierarchy_tree_<%= rf.getCid() %>').find(
                'input[level=document]:checked'
              );
            _.each(ckecked_documents, function(ckecked_document){
              var document_id;
              document_id = ckecked_document.id;
              document_ids.push(document_id.slice(9,document_id.length));
            });
            console.log(document_ids);
            $(this).unbind('shown');
            $(this).unbind('hidden');
            hierarchy_selector_view.remove();
            $("#modal_body_<%= rf.getCid() %>").append('<div id="doc_hierarchy_tree_<%= rf.getCid() %>" class="modal_section"></div>');
          });
        });
        function getHierarchy() {
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
                  pre_selected_hierarchy: undefined,
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
    <span class="symbol"><span class="icon-list"></span></span> Document Center Hyperlink
  """
