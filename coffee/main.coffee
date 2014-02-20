class Formbuilder
  @helpers:
    defaultFieldAttrs: (field_type) ->
      attrs =
        label: "Untitled"
        field_type: field_type
        required: true
        field_options: {}
        conditions: []

      Formbuilder.fields[field_type].defaultAttributes?(attrs) || attrs

    simple_format: (x) ->
      x?.replace(/\n/g, '<br />')

  @options:
    BUTTON_CLASS: 'fb-button'
    HTTP_ENDPOINT: ''
    HTTP_METHOD: 'POST'
    FIELDSTYPES_CUSTOM_VALIDATION: ['checkboxes','fullname','radio', 'scale_rating']
    CKEDITOR_CONFIG: ' '
    HIERARCHYSELECTORVIEW: ' '
    COMPANY_HIERARCHY: []

    mappings:
      SIZE: 'field_options.size'
      UNITS: 'field_options.units'
      LABEL: 'label'
      FIELD_TYPE: 'field_type'
      REQUIRED: 'required'
      ADMIN_ONLY: 'admin_only'
      OPTIONS: 'field_options.options'
      DESCRIPTION: 'field_options.description'
      INCLUDE_OTHER: 'field_options.include_other_option'
      INCLUDE_BLANK: 'field_options.include_blank_option'
      INTEGER_ONLY: 'field_options.integer_only'
      MIN: 'field_options.min'
      MAX: 'field_options.max'
      DEFAULT_NUM_VALUE: 'field_options.default_num_value'
      STEP: 'field_options.step'
      MINLENGTH: 'field_options.minlength'
      MAXLENGTH: 'field_options.maxlength'
      IMAGELINK: 'field_options.image_link'
      IMAGEWIDTH: 'field_options.image_width'
      IMAGEHEIGHT: 'field_options.image_height'
      CANVAS_WIDTH: 'field_options.canvas_width'
      CANVAS_HEIGHT: 'field_options.canvas_height'
      IMAGEALIGN: 'field_options.image_align'
      LENGTH_UNITS: 'field_options.min_max_length_units'
      MINAGE: 'field_options.minage'
      DEFAULT_VALUE: 'field_options.default_value'
      HINT: 'field_options.hint'
      PREV_BUTTON_TEXT: 'field_options.prev_button_text'
      NEXT_BUTTON_TEXT: 'field_options.next_button_text'
      HTML_DATA: 'field_options.html_data'
      IMAGE_DATA: 'field_options.image_data'
      STARTING_POINT_TEXT: 'field_options.start_point_text'
      ENDING_POINT_TEXT: 'field_options.ending_point_text'
      MATCH_CONDITIONS: 'field_options.match_conditions'
      ALLOWED_FILE_TYPES: 'field_options.allow_file_type'
      FILE_BUTTON_TEXT: 'field_options.file_button_text'
      FULLNAME_PREFIX_TEXT: 'field_options.prefix_text'
      FULLNAME_FIRST_TEXT: 'field_options.first_name_text'
      FULLNAME_MIDDLE_TEXT: 'field_options.middle_name_text'
      FULLNAME_LAST_TEXT: 'field_options.last_name_text'
      FULLNAME_SUFFIX_TEXT: 'field_options.suffix_text'
      BACK_VISIBLITY: 'field_options.back_visiblity'
      DEFAULT_COUNTRY: 'field_options.default_country'
      DATE_ONLY: 'field_options.date_only'
      TIME_ONLY: 'field_options.time_only'

    dict:
      ALL_CHANGES_SAVED: 'All changes saved'
      SAVE_FORM: 'Save form'
      UNSAVED_CHANGES: 'You have unsaved changes. If you leave this page, you will lose those changes!'

  @fields: {}
  @inputFields: {}
  @nonInputFields: {}

  @model: Backbone.DeepModel.extend
    sync: -> # noop
    indexInDOM: ->
      $wrapper = $(".fb-field-wrapper").filter ( (_, el) => $(el).data('cid') == @getCid()  )
      $(".fb-field-wrapper").index $wrapper
    is_input: ->
      Formbuilder.inputFields[@get(Formbuilder.options.mappings.FIELD_TYPE)]?
    getCid: ->
      @get('cid') || @cid

  @collection: Backbone.Collection.extend
    initialize: ->
      @on 'add', @copyCidToModel

    model: Formbuilder.model

    comparator: (model) ->
      model.indexInDOM()

    copyCidToModel: (model) ->
      model.attributes.cid = model.cid

  @registerField: (name, opts) ->
    for x in ['view', 'edit']
      opts[x] = _.template(opts[x])

    Formbuilder.fields[name] = opts

    if opts.type == 'non_input'
      Formbuilder.nonInputFields[name] = opts
    else
      Formbuilder.inputFields[name] = opts

  @views:
    wizard_tab: Backbone.View.extend
      className: "fb-tab"

      intialize: ->
        @parentView = @options.parentView

    view_field: Backbone.View.extend
      className: "fb-field-wrapper"

      events:
        'click .subtemplate-wrapper': 'focusEditView'
        'click .js-duplicate': 'duplicate'
        'click .js-clear': 'clear'
        'keyup': 'changeStateSource',
        'change': 'changeStateSource'
        'click #gmap_button': 'openGMap'
        'mouseover #can': 'onCanvas'

      onCanvas: ->
          reinitializeCanvas(@model.getCid())

      initialize: ->
        @current_state = 'show'
        @parentView = @options.parentView
        @field_type = @model.get(Formbuilder.options.mappings.FIELD_TYPE)
        @field = Formbuilder.fields[@field_type]
        @is_section_break = @field_type == 'section_break'
        @listenTo @model, "change", @render
        @listenTo @model, "destroy", @remove

      add_remove_require:(required) ->
        if @model.get(Formbuilder.options.mappings.REQUIRED) &&
            $.inArray(@field_type,
            Formbuilder.options.FIELDSTYPES_CUSTOM_VALIDATION) == -1
          return true if !@field.add_remove_require
          @field.add_remove_require(@model.getCid(), required)

      show_hide_fields: (check_result, set_field) ->
        do( set_field = set_field) =>
            if(check_result is true )
              @$el.addClass(set_field.action)
              if(set_field.action == 'show')
                @current_state = set_field.action
                @add_remove_require(true)
              else
                @$el.removeClass('show')
                @current_state = "hide"
                @add_remove_require(false)
            else
              @$el.removeClass(set_field.action)
              if(set_field.action == 'hide')
                @$el.addClass("show")
                @current_state = set_field.action
                @add_remove_require(true)
              else
                @$el.addClass("hide")
                @add_remove_require(false)
                @current_state = "hide"

      changeState: ->
        do(
          set_field = {}
          , i =0,and_flag = false
          , check_match_condtions = new Array()
        ) =>
          and_flag = true if @model.get('field_options')
          .match_conditions is 'and'
          for set_field in @model.get("conditions")
            do (
              source_model = {},clicked_element = []
              ,elem_val = {},condition = "equals",
              field_type = '', check_result = false
            ) =>
              if set_field.target is @model.getCid()
                source_model = @model.collection.
                              where({cid: set_field.source})[0]
                clicked_element = $("." + source_model.getCid())
                field_type = source_model.get('field_type')
                if set_field.condition is "equals"
                  condition = '=='
                else if set_field.condition is "less than"
                  condition = '<'
                else if set_field.condition is "greater than"
                  condition = '>'
                else
                  condition = "!="

                check_result = @evalCondition(clicked_element,
                    source_model, condition, set_field.value)
                check_match_condtions.push(check_result)
                @clearFields()
                @changeStateSource()

                if and_flag is true
                  if check_match_condtions.indexOf(false) == -1
                    @show_hide_fields(true, set_field)
                  else
                    @show_hide_fields('false', set_field)
                else
                  if check_match_condtions.indexOf(true) != -1
                    @show_hide_fields(true, set_field)
                  else
                    @show_hide_fields('false', set_field)

        return @

      evalCondition: (clicked_element, source_model, condition, value)->
        do(
        field_type = source_model.get(Formbuilder.options.mappings.FIELD_TYPE)
        field = '',check_result = 'false'
        ) =>
          field = Formbuilder.fields[field_type]
          return true if !field.evalCondition
          check_result = field
            .evalCondition(clicked_element
              , source_model.getCid(), condition, value,field)
          check_result

      clearFields: ->
        return true if !@field.clearFields
        @field.clearFields(@$el, @model)

      changeStateSource: (ev) ->
        @trigger('change_state')

      openGMap: ->
        if $('#gmapModal').length is 0
          @field.addRequiredConditions() if @field.addRequiredConditions
        $('#gmap_ok').val(this.model.getCid())
        $('#gmapModal').modal({
          show: true
        })

        $("#gmapModal").on "shown", (e) ->
            gmap_button_value = $("[name = " + getCid() + "_2]").val()
            initialize();
            $( "#gmap_address" ).keypress (event) ->
              set_prev_lat_lng($('#gmap_latlng').val())
              if(event.keyCode == 13)
                codeAddress();

            $( "#gmap_latlng" ).keypress (event) ->
              set_prev_address($("#gmap_address").val())
              if(event.keyCode == 13)
                codeLatLng()

            if( gmap_button_value != '')
              set_prev_lat_lng(gmap_button_value)
              codeLatLng(gmap_button_value)

        $('#gmapModal').on 'hidden.bs.modal', (e) ->
          $('#gmapModal').off('shown').on('shown')
          $(this).removeData "modal"
          $( "#gmap_address" ).unbind('keypress')
          $( "#gmap_latlng" ).unbind('keypress')

      isValid: ->
        return true if !@field.isValid
        @field.isValid(@$el, @model)

      render: ->
        if @options.live
          @live_render()
        else
          @builder_render()

      builder_render: ->
        do (cid = @model.getCid(), that = @) ->
          that.$el.addClass('response-field-'+that.model.get(Formbuilder.options.mappings.FIELD_TYPE))
            .data('cid', cid)
            .html(Formbuilder.templates["view/base#{if !that.model.is_input() then '_non_input' else ''}"]({rf: that.model, opts: that.options}))
          do (x = null, count = 0) ->
            for x in that.$("input, textarea, select, canvas")
              count = count + 1 if do(attr = $(x).attr('type')) -> attr != 'radio' && attr != 'checkbox'
              $(x).attr("name", cid.toString() + "_" + count.toString())
        return @

      live_render: ->
        do (
          set_field = {}, i =0,
          action = "show",
          cid = @model.getCid(),
          base_templ_suff = if @model.is_input() then '' else '_non_input',
          set_field_class = false
        ) =>

          if @model.attributes.conditions
            for set_field in @model.get('conditions')
              if set_field
                  .action is 'show' and @model.getCid() is set_field.target
                    set_field_class = true

          @$el.addClass("hide") if set_field_class

          if @model.attributes.conditions
            if !@is_section_break
              if @model.get("conditions").length
                for set_field in @model.get("conditions")
                  do (set_field) =>
                    if set_field.target is @model.getCid()
                      for views_name in @parentView.fieldViews
                        do (views_name,set_field) =>
                          if views_name.model.get('cid') is set_field.source
                            @listenTo(views_name, 'change_state', @changeState)


          if !@is_section_break
            @$el.addClass('readonly') if @model.get("field_options")
                                          .state is "readonly"
            @$el.addClass('response-field-'+ @field_type + ' '+ @model.getCid())
              .data('cid', cid)
              .html(Formbuilder.templates["view/base#{base_templ_suff}"]({
                rf: @model,
                opts: @options}))
            do ( # compute and add names and values to fields
              x = null,
              count = 0,
              should_incr = (attr) -> attr != 'radio'
            ) =>
              for x in @$("input, textarea, select, canvas, a")
                count = do( # set element name, value and call setup
                  x,
                  index = count + (if should_incr($(x)
                          .attr('type')) then 1 else 0),
                  name = null,
                  val = null,
                ) =>
                  name = cid.toString() + "_" + index.toString()
                  $(x).attr("name", name)
                  if @model.get(Formbuilder.options.mappings.REQUIRED) &&
                  $.inArray(@field_type,
                  Formbuilder.options.FIELDSTYPES_CUSTOM_VALIDATION) == -1
                    $(x).attr("required", true)

                  index
        return @

      focusEditView: ->
        @parentView.createAndShowEditView(@model) if !@options.live

      clear: ->
        do (index = 0, that = @) ->
          that.parentView.handleFormUpdate()
          index = that.parentView.fieldViews
            .indexOf(_.where(that.parentView.fieldViews, {cid: that.cid})[0])
          that.parentView.fieldViews.splice(index, 1) if (index > -1)
          that.clearConditions that.model.getCid(), that.parentView.fieldViews
          that.model.destroy()

      clearConditions: (cid, fieldViews) ->
        _.each(fieldViews, (fieldView) ->
          do(updated_conditions = {}) =>
            unless _.isEmpty(fieldView.model.attributes.conditions)
              updated_conditions = _.reject(fieldView.model.attributes.conditions, (condition) ->
                return _.isEqual(condition.source, cid)
              )
              fieldView.model.attributes.conditions = []
              fieldView.model.attributes.conditions = updated_conditions
              #index = fieldView.attributes.conditions.indexOf(_.where(fieldView.attributes.conditions, {source: cid})[0]);
              #fieldView.attributes.conditions.splice(index, 1) if (index > -1)
        )

      duplicate: ->
        attrs = _.clone(@model.attributes)
        delete attrs['id']
        attrs['label'] += ' Copy'
        @parentView.createField attrs, { position: @model.indexInDOM() + 1 }

    edit_field: Backbone.View.extend
      className: "edit-response-field"

      events:
        'click .js-add-option': 'addOption'
        'click .js-add-condition': 'addCondition'
        'click .js-remove-condition': 'removeCondition'
        'click .js-remove-option': 'removeOption'
        'click .js-default-updated': 'defaultUpdated'
        'input .option-label-input': 'forceRender'

      initialize: ->
        @listenTo @model, "destroy", @remove

      render: ->
        @$el.html(Formbuilder.templates["edit/base#{if !@model.is_input() then '_non_input' else ''}"]({rf: @model, opts: @options}))
        rivets.bind @$el, { model: @model }
        return @

      remove: ->
        @options.parentView.editView = undefined
        @options.parentView.$el.find("[href=\"#addField\"]").click()
        Backbone.View.prototype.remove.call(@)

      # @todo this should really be on the model, not the view
      addOption: (e) ->
        $el = $(e.currentTarget)
        i = @$el.find('.option').index($el.closest('.option'))
        options = @model.get(Formbuilder.options.mappings.OPTIONS) || []
        newOption = {label: "", checked: false}

        if i > -1
          options.splice(i + 1, 0, newOption)
        else
          options.push newOption

        @model.set Formbuilder.options.mappings.OPTIONS, options
        @model.trigger "change:#{Formbuilder.options.mappings.OPTIONS}"
        @forceRender()

      addCondition: (e) ->
        $el = $(e.currentTarget)
        i = @$el.find('.condition').index($el.closest('.condition'))
        conditions = @model.get('conditions') || []
        newCondition = { source: "", condition: "", value: "", action: "", target: "", isSource: true }

        if i > -1
          conditions.splice(i + 1, 0, newCondition)
        else
          conditions.push newCondition

        @model.set 'conditions', conditions
        @model.trigger 'change:conditions'

      removeOption: (e) ->
        $el = $(e.currentTarget)
        index = @$el.find(".js-remove-option").index($el)
        options = @model.get Formbuilder.options.mappings.OPTIONS
        options.splice index, 1
        @model.set Formbuilder.options.mappings.OPTIONS, options
        @model.trigger "change:#{Formbuilder.options.mappings.OPTIONS}"
        @forceRender()

      removeCondition: (e) ->
        $el = $(e.currentTarget)
        index = @$el.find(".js-remove-option").index($el)
        conditions = @model.get 'conditions'
        conditions.splice index, 1
        @model.set 'conditions', conditions
        @model.trigger "change:conditions"
        @forceRender()

      defaultUpdated: (e) ->
        $el = $(e.currentTarget)

        unless @model.get(Formbuilder.options.mappings.FIELD_TYPE) == 'checkboxes' # checkboxes can have multiple options selected
          @$el.find(".js-default-updated").not($el).attr('checked', false).trigger('change')

        @forceRender()

      forceRender: ->
        @model.trigger('change')

    main: Backbone.View.extend
      SUBVIEWS: []

      events:
        'click .js-save-form': 'saveForm'
        'click .fb-tabs a': 'showTab'
        'click .fb-add-field-types a': 'addField'

      initialize: ->
        @$el = $(@options.selector)
        @formBuilder = @options.formBuilder
        @fieldViews = []
        @formConditionsSaved = false

        # Create the collection, and bind the appropriate events
        @collection = new Formbuilder.collection
        @collection.bind 'add', @addOne, @
        @collection.bind 'reset', @reset, @
        @collection.bind 'change', @handleFormUpdate, @
        @collection.bind 'destroy add reset', @hideShowNoResponseFields, @
        @collection.bind 'destroy', @ensureEditViewScrolled, @

        @options.readonly = true if !@options.live
        @options.showSubmit ||= false
        Formbuilder.options.COMPANY_HIERARCHY = @options.company_hierarchy
        @render()
        @collection.reset(@options.bootstrapData)
        @saveFormButton = @$el.find(".js-save-form")
        @saveFormButton.attr('disabled', true).text(Formbuilder.options.dict.ALL_CHANGES_SAVED)
        @initAutosave() if @options.autoSave
        Formbuilder.options.CKEDITOR_CONFIG = @options.ckeditor_config
        Formbuilder.options.HIERARCHYSELECTORVIEW = @options.hierarchy_selector_view unless _.isUndefined(@options.hierarchy_selector_view)

      getCurrentView: ->
        current_view_state = (fieldView.model.get('cid') for fieldView in @fieldViews when fieldView.current_state is 'show')
        current_view_state

      initAutosave: ->
        @formSaved = true

        setInterval =>
          @saveForm.call(@)
        , 5000

        $(window).bind 'beforeunload', =>
          if @formSaved then undefined else Formbuilder.options.dict.UNSAVED_CHANGES

      reset: ->
        @$responseFields.html('')
        @addAll()

      render: ->
        if !@options.alt_parents
          @$el.html Formbuilder.templates['page']({opts: @options})
          @$fbLeft = @$el.find('.fb-left')
          @$responseFields = @$el.find('.fb-response-fields')
        else
          if !@options.live
            $(@options.alt_parents['fb_save']).html Formbuilder.templates['partials/save_button']()
            $(@options.alt_parents['fb_left']).html Formbuilder.templates['partials/left_side']()
            @$fbLeft = @options.alt_parents['fb_left'].find('.fb-left')
          $(@options.alt_parents['fb_right']).html Formbuilder.templates['partials/right_side']({opts: @options})
          @$responseFields = @options.alt_parents['fb_right'].find('.fb-response-fields')

        # Save jQuery objects for easy use

        @bindWindowScrollEvent()
        @hideShowNoResponseFields()

        # Render any subviews (this is an easy way of extending the Formbuilder)
        new subview({parentView: @}).render() for subview in @SUBVIEWS

        return @

      bindWindowScrollEvent: ->
        $(window).on 'scroll', =>
          return if @$fbLeft.data('locked') == true
          newMargin = Math.max(0, $(window).scrollTop())
          maxMargin = @$responseFields.height()

          @$fbLeft.css
            'margin-top': Math.min(maxMargin, newMargin)

      showTab: (e) ->
        $el = $(e.currentTarget)
        target = $el.data('target')
        $el.closest('li').addClass('active').siblings('li').removeClass('active')
        $(target).addClass('active').siblings('.fb-tab-pane').removeClass('active')

        @unlockLeftWrapper() unless target == '#editField'

        if target == '#editField' && !@editView && (first_model = @collection.models[0])
          @createAndShowEditView(first_model)

      addOne: (responseField, _, options) ->
        view = new Formbuilder.views.view_field
          model: responseField
          parentView: @
          live: @options.live
          readonly: @options.readonly
          seedData: responseField.seedData

        # Append view to @fieldViews
        @fieldViews.push(view)

        if !@options.live
          #####
          # Calculates where to place this new field.
          #
          # Are we replacing a temporarily drag placeholder?
          if options.$replaceEl?
            options.$replaceEl.replaceWith(view.render().el)

          # Are we adding to the bottom?
          else if !options.position? || options.position == -1
            @$responseFields.append view.render().el

          # Are we adding to the top?
          else if options.position == 0
            @$responseFields.prepend view.render().el

          # Are we adding below an existing field?
          else if ($replacePosition = @$responseFields.find(".fb-field-wrapper").eq(options.position))[0]
            $replacePosition.before view.render().el

          # Catch-all: add to bottom
          else
            @$responseFields.append view.render().el

      setSortable: ->
        @$responseFields.sortable('destroy') if @$responseFields.hasClass('ui-sortable')
        @$responseFields.sortable
          forcePlaceholderSize: true
          placeholder: 'sortable-placeholder'
          stop: (e, ui) =>
            if ui.item.data('field-type')
              rf = @collection.create Formbuilder.helpers.defaultFieldAttrs(ui.item.data('field-type')), {$replaceEl: ui.item}
              @createAndShowEditView(rf)

            @handleFormUpdate()
            return true
          update: (e, ui) =>
            # ensureEditViewScrolled, unless we're updating from the draggable
            @ensureEditViewScrolled() unless ui.item.data('field-type')

        @setDraggable()

      setDraggable: ->
        $addFieldButtons = @$el.find("[data-field-type]")

        $addFieldButtons.draggable
          connectToSortable: @$responseFields
          helper: =>
            $helper = $("<div class='response-field-draggable-helper' />")
            $helper.css
              width: @$responseFields.width() # hacky, won't get set without inline style
              height: '80px'

            $helper

      addSectionBreak: (obj_view, cnt) ->
        obj_view.$el.attr('data-step', cnt)
        obj_view.$el.attr('data-step-title', "step#{cnt}")
        obj_view.$el.addClass('step')
        obj_view.$el.addClass('active') if cnt == 1

      applyEasyWizard: ->
        do (field_view = null, cnt = 1, fieldViews = @fieldViews,
            add_break_to_next = false, wizard_view = null,
            wiz_cnt = 1, prev_btn_text = 'Back', next_btn_text = 'Next',
            showSubmit = @options.showSubmit) =>
          for field_view in fieldViews
            if (field_view.is_section_break)
              add_break_to_next = true
              prev_btn_text = field_view.model.get(
                Formbuilder.options.mappings.PREV_BUTTON_TEXT)
              next_btn_text = field_view.model.get(
                Formbuilder.options.mappings.NEXT_BUTTON_TEXT)

            if cnt == 1
              wizard_view = new Formbuilder.views.wizard_tab
                parentView: @
              @addSectionBreak(wizard_view, wiz_cnt)
            else if add_break_to_next && !field_view.is_section_break
              @$responseFields.append wizard_view.$el
              wizard_view = new Formbuilder.views.wizard_tab
                parentView: @
              wiz_cnt += 1
              add_break_to_next = false if add_break_to_next
              @addSectionBreak(wizard_view, wiz_cnt)

            if wizard_view && field_view && !field_view.is_section_break
              wizard_view.$el.append field_view.render().el
            if cnt == fieldViews.length && wizard_view
              @$responseFields.append wizard_view.$el
            cnt += 1

          $("#formbuilder_form").easyWizard({
            showSteps: false,
            submitButton: false,
            prevButton: prev_btn_text,
            nextButton: next_btn_text,
            after: (wizardObj) ->
              if parseInt($nextStep.attr('data-step')) == thisSettings.steps &&
                 showSubmit
                wizardObj.parents('.form-panel').find('.update-button').show()
              else
                wizardObj.parents('.form-panel').find('.update-button').hide()
          })

        return @


      triggerEvent:->
        do (field_view = null,
            fieldViews = @fieldViews
            model = ""
        ) =>
          for field_view in fieldViews
            do ( # compute values to fields
              x = null,
              count = 0,
              should_incr = (attr) -> attr != 'radio',
              val_set = false,
              model = field_view.model
              field_type_method_call = '' 
              field_method_call = ''
            ) =>
              initializeCanvas(field_view.model.getCid()) if field_view.field_type is 'esignature'
              for x in field_view.$("input, textarea, select, canvas, a")
                count = do( # set element name, value and call setup
                  x,
                  index = count + (if should_incr($(x)
                          .attr('type')) then 1 else 0),
                  name = null,
                  val = null,
                  value = 0,
                  cid = ''
                ) =>
                  field_type_method_call = model.get(Formbuilder.options.mappings.FIELD_TYPE)
                  field_method_call = Formbuilder.fields[field_type_method_call]
                  field_method_call.setup($(x), model, index) if field_method_call.setup
                  cid = model.getCid()
                  value = x.value if field_view.field_type == 'radio'||'scale_rating'
                  name = cid.toString() + "_" + index.toString()
                  if $(x).attr('type') == 'radio' and model.get('field_values')
                    val = model.get('field_values')[value]
                  else if model.get('field_values')
                    val = model.get('field_values')[name]
                  if val
                    val_set = true
                    @setFieldVal($(x), val)
                  if !val
                    if(field_view.field_type == 'gmap')
                      get_user_location = getCurrentLocation(model.getCid());
                      if get_user_location != 'false'
                        $("[name = " + model.getCid() + "_1]").text(get_user_location)
                      else
                        $("[name = " + model.getCid() + "_1]").text('Select Your Address')
                  index
              if val_set
                field_view.trigger('change_state')

      setFieldVal: (elem, val) ->
        do(setters = null, type = $(elem).attr('type')) =>
          setters =
            gmap: ->
              $(elem).text(val)
            esignature: ->
              $(elem).attr("upload_url", val) if val
              makeRequest(val,$(elem).attr("name"))
            file: ->
              $(elem).siblings(".active_link").attr("href",val)
              $(elem).siblings(".active_link").text(
                val.split("/").pop().split("?")[0]
              ) if val
            checkbox: ->
              $(elem).attr("checked", true) if val
            radio: ->
              $(elem).attr("checked", true) if val
            default: ->
              $(elem).val(val) if val
          (setters[type] || setters['default'])(elem, val)


      addAll: ->
        @collection.each @addOne, @
        if @options.live
          @applyEasyWizard()
          # check for ci-hierarchy type
          fd_views = @fieldViews.filter (fd_view) ->
            fd_view.field_type is "ci-hierarchy"
          @bindHierarchyEvents(fd_views) if fd_views.length > 0
          @triggerEvent() # triggers event by setting values to respective fields
          for field_view in @fieldViews
            if (field_view.field_type == 'section_break')
              $('.prev').addClass('hide btn-danger')
              $('.next').addClass('btn-success')
              back_visiblity = field_view.model.get(
                Formbuilder.options.mappings.BACK_VISIBLITY)
              if back_visiblity is 'false'
                $('.next').click( ->
                  $('.prev').css("display", "none")
                )

          $('.readonly').find('input, textarea, select').attr('disabled', true);
        else
          @setSortable()

      bindHierarchyEvents: (hierarchyViews) ->
        do(cid='') =>
          _.each hierarchyViews, (hierarchyView) ->
            hierarchyView.field.bindChangeEvents(hierarchyView)

      hideShowNoResponseFields: ->
        @$el.find(".fb-no-response-fields")[if @collection.length > 0 then 'hide' else 'show']()

      addField: (e) ->
        field_type = $(e.currentTarget).data('field-type')
        @createField Formbuilder.helpers.defaultFieldAttrs(field_type)

      createField: (attrs, options) ->
        rf = @collection.create attrs, options
        @createAndShowEditView(rf)
        @handleFormUpdate()

      createAndShowEditView: (model) ->
        $responseFieldEl = @$el.find(".fb-field-wrapper").filter( -> $(@).data('cid') == model.cid )
        $responseFieldEl.addClass('editing').siblings('.fb-field-wrapper').removeClass('editing')

        if @editView
          if @editView.model.cid is model.cid
            @$el.find(".fb-tabs a[data-target=\"#editField\"]").click()
            @scrollLeftWrapper $responseFieldEl, (oldPadding? && oldPadding)
            return

          oldPadding = @$fbLeft.css('padding-top')
          @editView.remove()

        @editView = new Formbuilder.views.edit_field
          model: model
          parentView: @

        $newEditEl = @editView.render().$el
        @$el.find(".fb-edit-field-wrapper").html $newEditEl
        @$el.find(".fb-tabs a[data-target=\"#editField\"]").click()
        @scrollLeftWrapper($responseFieldEl)
        return @

      ensureEditViewScrolled: ->
        return unless @editView
        @scrollLeftWrapper $(".fb-field-wrapper.editing")

      scrollLeftWrapper: ($responseFieldEl) ->
        @unlockLeftWrapper()
        $.scrollWindowTo ($responseFieldEl.offset().top - @$responseFields.offset().top), 200, =>
          @lockLeftWrapper()

      lockLeftWrapper: ->
        @$fbLeft.data('locked', true)

      unlockLeftWrapper: ->
        @$fbLeft.data('locked', false)

      handleFormUpdate: ->
        return if @updatingBatch
        @formSaved = false
        @saveFormButton.removeAttr('disabled').text(Formbuilder.options.dict.SAVE_FORM) if @saveFormButton

      saveForm: (e) ->
        return if @formSaved
        @formSaved = true
        @saveFormButton.attr('disabled', true).text(Formbuilder.options.dict.ALL_CHANGES_SAVED)
        @collection.sort()
        @collection.each @removeSourceConditions, @
        @collection.each @addConditions, @

        payload = JSON.stringify fields: @collection.toJSON()

        if Formbuilder.options.HTTP_ENDPOINT then @doAjaxSave(payload)
        @formBuilder.trigger 'save', payload

      removeSourceConditions: (model) ->
        unless _.isEmpty(model.attributes.conditions)
          _.each(model.attributes.conditions, (condition) ->
            do(index=0) =>
              unless _.isEmpty(condition.source)
                if condition.source == model.getCid()
                  index = model.attributes.conditions.indexOf(condition);
                  model.attributes.conditions.splice(index, 1) if (index > -1)
                  model.save()
          )

      addConditions: (model) ->
        unless _.isEmpty(model.attributes.conditions)
          _.each(model.attributes.conditions, (condition) ->
            do(source = {}, source_condition = {}, target_condition = {}) =>
              unless _.isEmpty(condition.source)
                source = model.collection.where({cid: condition.source})
                condition.target = model.getCid() if condition.target is ''
                target_condition = _.clone(condition)
                target_condition.isSource = false
                unless _.has(source[0].attributes.conditions, target_condition)
                  _.extend( source_condition, target_condition)
                  source[0].attributes.conditions.push(source_condition)
                  source[0].save()
          )

      formData: ->
        @$('#formbuilder_form').serializeArray()

      formValid: ->
        do(valid = false) =>
          valid = do(el = @$('#formbuilder_form')[0]) ->
            !el.checkValidity || el.checkValidity()
          return false if !valid
          do(field=null,i=0) =>
            while i< @fieldViews.length
              field = @fieldViews[i]
              if @getCurrentView().indexOf(field.model.get('cid')) != -1
                return false if field.isValid && !field.isValid()
              i++
            return true

      doAjaxSave: (payload) ->
        $.ajax
          url: Formbuilder.options.HTTP_ENDPOINT
          type: Formbuilder.options.HTTP_METHOD
          data: payload
          contentType: "application/json"
          success: (data) =>
            @updatingBatch = true

            for datum in data
              # set the IDs of new response fields, returned from the server
              @collection.get(datum.cid)?.set({id: datum.id})
              @collection.trigger 'sync'

            @updatingBatch = undefined

  constructor: (selector, opts = {}) ->
    _.extend @, Backbone.Events
    @mainView = new Formbuilder.views.main _.extend({ selector: selector }, opts, { formBuilder: @ })

  formData: ->
    @mainView.formData()

  formValid: ->
    @mainView.formValid()

window.Formbuilder = Formbuilder

if module?
  module.exports = Formbuilder
else
  window.Formbuilder = Formbuilder
