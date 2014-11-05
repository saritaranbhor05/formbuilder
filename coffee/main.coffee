class Formbuilder
  @helpers:
    defaultFieldAttrs: (field_type) ->
      attrs =
        label: "Untitled"
        field_type: field_type
        required: false
        field_options: {}
        conditions: []

      Formbuilder.fields[field_type].defaultAttributes?(attrs) || attrs

    simple_format: (x) ->
      x?.replace(/\n/g, '<br />')

  @baseConfig: {
    'print' : {
      'fieldTagName' : 'tr',
      'fieldClassName' : 'field_tr',
      'wizardTagName' : 'table',
      'wizardClassName' : 'fb-tab print_form'
    }
  }

  @options:
    BUTTON_CLASS: 'fb-button'
    HTTP_ENDPOINT: ''
    HTTP_METHOD: 'POST'
    FIELDSTYPES_CUSTOM_VALIDATION: ['checkboxes','fullname','radio', 'scale_rating']
    PRINT_FIELDS_AS_SINGLE_ROW: ['file', 'take_pic_video_audio']
    CKEDITOR_CONFIG: ' '
    HIERARCHYSELECTORVIEW: ' '
    COMPANY_HIERARCHY: []
    PRINTVIEW: false,
    EDIT_FS_MODEL: false,
    EXTERNAL_FIELDS: [],
    FIELD_CONFIGS: {},
    EXTERNAL_FIELDS_TYPES: [],
    FILE_UPLOAD_URL: '',
    ESIGNATURE_UPLOAD_URL: '',
    ESIGNATURE_UPLOAD_DATA: {},
    SHOW_ADMIN_ONLY: true,

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
      INCLUDE_PHOTO: 'field_options.include_photo_option'
      INCLUDE_VIDEO: 'field_options.include_video_option'
      INCLUDE_AUDIO: 'field_options.include_audio_option'
      INCLUDE_SUFFIX: 'field_options.include_suffix'
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
      DATE_FORMAT: 'field_options.date_format'
      MASK_VALUE: 'field_options.mask_value'
      COUNTRY_CODE: 'field_options.country_code'
      AREA_CODE: 'field_options.area_code'
      DEFAULT_ADDRESS: 'field_options.default_address'
      DEFAULT_CITY: 'field_options.default_city'
      DEFAULT_STATE: 'field_options.default_state'
      DEFAULT_ZIPCODE: 'field_options.default_zipcode'
      OPTIONAL_FIELD: 'field_options.optional_field'
      EMPTY_OPTION_TEXT: 'field_options.empty_option_text'
      RECURRING_SECTION: 'field_options.recurring_section'
      START_DATE_TIME_TEXT: 'field_options.start_date_time_text'
      END_DATE_TIME_TEXT: 'field_options.end_date_time_text'
      DATETIME_DIFFERENCE_TEXT: 'field_options.datetime_difference_text'

    dict:
      ALL_CHANGES_SAVED: 'All changes saved'
      SAVE_FORM: 'Save form'
      UNSAVED_CHANGES: 'You have unsaved changes. If you leave this page, you will lose those changes!'

  @fields: {}
  @inputFields: {}
  @nonInputFields: {}
  @latest_section_id: 100

  @isIos: ->
    typeof(BRIJavaScriptInterface) != 'undefined'

  @isAndroid: ->
    typeof(Android) != 'undefined'

  @isMobile: ->
    Formbuilder.isAndroid() || Formbuilder.isIos()

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
    for x in ['view', 'edit', 'print']
      opts[x] = _.template(opts[x]) if _.isString(opts[x])

    Formbuilder.fields[name] = opts

    if opts.type == 'non_input'
      Formbuilder.nonInputFields[name] = opts
    else
      Formbuilder.inputFields[name] = opts

  @make_wizard: (elem, opts) ->
    do(defaults = { showSteps: false, submitButton: false}) ->
      elem.easyWizard(_.extend(defaults,opts))

  @views:
    wizard_tab: Backbone.View.extend
      tagName: 'div'
      className: "fb-tab"
      initialize: ->
        @parentView = @options.parentView
        @frag = document.createDocumentFragment()
        @recurring = @options.recurring_section
        @first_field_index = @options.first_field_index
        @total_responses = @options.total_responses_for_this_section
        @field_views = @options.field_views
        @section_break_field_model = @options.section_break_field_model
        if @options.view_type != 'print'
          @setSectionProps(@options.index, @options.back_visibility)
        if @options.view_type == 'print'
          $el.append('<colgroup><col style="width: 30%;"><col style="width: 70%;"></colgroup>')
      make_live: (last_field_index)->
        @$el.append(if @recurring then @wrap_section(last_field_index) else @frag)
        @$el
      append_child: (child) ->
        @frag.appendChild(child)
      dummy_step: (cnt) ->
        elem = $('<div></div>')
        @setSectionProps(cnt, true, elem)
        elem
      wrap_section: (last_field_index) ->
        do( that = @,
            view_index = 0,
            inner_wiz = $('<div></div>'),
            wrap_inner_0 = $('<div class="mystep">Ohh Am I Fake PREV</div>'),
            wrap_inner_1 = $('<div class="mystep"></div>'),
            wrap_inner_2 = $('<div class="mystep">Ohh Am I Fake NEXT</div>'),
            inner1 = new Formbuilder.views.wizard_tab
              parentView: @
              view_type: @options.view_type
              index: 1
              back_visibility: true,
            inner2 = new Formbuilder.views.wizard_tab
              parentView: @
              view_type: @options.view_type
              index: 2
              back_visibility: false,
              next_btn_text = "Save and New entry") ->
          next_btn_text = 'Next Entry' unless Formbuilder.isMobile()
          inner1.append_child(that.frag)
          wrap_inner_1.append(inner1.frag)
          inner_wiz.append(wrap_inner_0)
          inner_wiz.append(wrap_inner_1)
          inner_wiz.append(wrap_inner_2)
          that.parentView.$el.append(inner_wiz)
          Formbuilder.make_wizard(inner_wiz,
            {
              stepClassName: "mystep",
              prevButton: "Save and Prev entry",
              nextButton: next_btn_text,
              showSteps: false,
              submitButton: false,
              before: (wiz, curobj, nextobj) ->
                do( cur_step = curobj.data('step'),
                    next_step = nextobj.data('step'),
                    temp_index = that.first_field_index,
                    arr_invalid_fields=[]
                    ) =>
                    if(next_step == 2)
                      if (that.total_responses <= 1) && !that.parentView.options.showSubmit
                        wiz.find(".easyWizardButtons.mystep .next").hide()
                        wiz.find(".easyWizardButtons.mystep .next").addClass('hide')
                      return true

                    arr_invalid_fields = that.parentView.save_field_values_at_index(that.first_field_index, last_field_index, view_index)
                    unless _.isEmpty(arr_invalid_fields)
                      if typeof that.parentView.options.validation_fail_cb == 'function'
                        that.parentView.options.validation_fail_cb()
                      return false
                    else
                      if typeof that.parentView.options.validation_success_cb == 'function'
                        that.parentView.options.validation_success_cb()
                    if(next_step > cur_step)
                      view_index++
                      if view_index < that.total_responses
                        that.parentView.load_values_for_index(that.first_field_index, last_field_index, view_index)
                      else
                        that.parentView.setup_new_page(that.first_field_index, last_field_index, view_index)
                      if view_index > that.total_responses
                        that.total_responses++
                    else
                      if view_index == that.total_responses
                        that.total_responses++
                      view_index--
                      that.parentView.load_values_for_index(that.first_field_index, last_field_index, view_index)
                    if view_index == (that.total_responses-1) && !that.parentView.options.showSubmit
                        wiz.find(".easyWizardButtons.mystep .next").hide()
                        wiz.find(".easyWizardButtons.mystep .next").addClass('hide')
                    else
                      wiz.find(".easyWizardButtons.mystep .next").show()
                      wiz.find(".easyWizardButtons.mystep .next").removeClass('hide')
                    that.section_break_field_model.set('response_cnt', that.total_responses)
                    if(next_step == 1 && view_index == 0)
                      wiz.find(".easyWizardButtons.mystep .prev").hide()
                      wiz.find(".easyWizardButtons.mystep .prev").addClass('hide')
                    else
                      wiz.find(".easyWizardButtons.mystep .prev").show()
                      wiz.find(".easyWizardButtons.mystep .prev").removeClass('hide')
                    return false
            })
          inner_wiz.easyWizard('goToStep', 2)
          inner_wiz.find(".easyWizardButtons.mystep .prev").addClass('hide btn-danger')
          inner_wiz.find(".easyWizardButtons.mystep .next").addClass('btn-success')
          inner_wiz
      setSectionProps:  (cnt, back_visibility, elem) ->
        elem = elem || @$el
        elem.attr({
          'data-step': cnt,
          'show-back': back_visibility,
          'data-step-title': "step#{cnt}"
        }).addClass('step')
        elem.addClass('active') if cnt == 1



    view_field: Backbone.View.extend
      className: "fb-field-wrapper"
      events:
        'click .subtemplate-wrapper': 'focusEditView'
        'click .js-duplicate': 'duplicate'
        'click .js-clear': 'clear'
        'keyup': 'changeStateSource',
        'change': 'changeStateSource'
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
        @clearFields() and @changeStateSource() unless required
        if required and
            @field_type is 'heading' || @field_type is 'free_text_html'
          @changeStateSource()
        if @model.get(Formbuilder.options.mappings.REQUIRED) &&
            $.inArray(@field_type,
            Formbuilder.options.FIELDSTYPES_CUSTOM_VALIDATION) == -1
          return true if !@field.add_remove_require
          @field.add_remove_require(@model.getCid(), required)

      show_hide_fields: (check_result, set_field) ->
        do( set_field = set_field) =>
          if @field.show_or_hide
            @field.show_or_hide(@, @model, check_result, set_field.action)
          else if check_result
            @$el.addClass(set_field.action)
          else
            @$el.removeClass(set_field.action)

          if @field_type is 'heading'
            $('#'+@model.getCid()).text(@model.get('label'))
          if @field_type is 'free_text_html'
            @$('#'+@model.getCid()).html('')
            @$('#'+@model.getCid()).html(@model.get('field_options').html_data)
          if check_result && set_field.action == 'show'
            @current_state = 'show'
          else if !check_result && set_field.action == 'hide'
            @current_state = 'show'
          else
            @current_state = 'hide'
          if (check_result && set_field.action == 'show') or
              (!check_result && set_field.action == 'hide')
            @add_remove_require(true)
          else
            @add_remove_require(false)

      changeState: ->
        do(
          set_field = {}
          , i =0,and_flag = false
          , check_match_condtions = new Array(),
          _this_model_cid = @model.getCid(),
          date_field_types = ['date', 'time', 'date_of_birth', 'date_time'],
          str_condition = false
        ) =>
          if @options.view_type != 'print'
            and_flag = true if @model.get('field_options')
            .match_conditions is 'and'
            for set_field in @model.get("conditions")
              do (
                source_model = {},clicked_element = []
                ,elem_val = {},condition = "equals",
                field_type = '', check_result = false
              ) =>
                if set_field.target is _this_model_cid
                  source_model = @model.collection.
                                where({cid: set_field.source})[0]
                  clicked_element = $("." + source_model.getCid())
                  field_type = source_model.get('field_type')
                  if date_field_types.indexOf(field_type) != -1
                    str_condition = true
                  if set_field.condition is "equals"
                    condition = @parentView.checkEquals
                    condition = '==' if str_condition
                  else if set_field.condition is "less than"
                    condition = @parentView.checkLessThan
                    condition = '<' if str_condition
                  else if set_field.condition is "greater than"
                    condition = @parentView.checkGreaterThan
                    condition = '>' if str_condition
                  else
                    condition = @parentView.checkNotEqual
                    condition = '!=' if str_condition
                  check_result = @evalCondition(clicked_element,
                      source_model, condition, set_field.value)
                  check_match_condtions.push(check_result)

            if (and_flag && check_match_condtions.indexOf(false) == -1) or
                (!and_flag && check_match_condtions.indexOf(true) != -1)
              @show_hide_fields(true, set_field)
            else
              @show_hide_fields(false, set_field)
# TODO: Move this inside the do?
        outerHeight = 0
        $(".fb-tab.step.active .fb-field-wrapper:visible").each ->
          outerHeight += $(this).height()

        $('.easyWizardButtons.step').css('position', 'static');
        $('.easyWizardButtons.step').css('top',outerHeight);
        $('.easyWizardButtons.step').css('width',$('.easyPager').width()-20);

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
            for x in that.$("input, textarea, select, .canvas_img")
              count = count + 1 if do(attr = $(x).attr('type')) -> attr != 'radio' && attr != 'checkbox'
              $(x).attr("name", cid.toString() + "_" + count.toString())
        return @

      live_render: ->
        base_templ_suff = if @options.view_type == 'print' then '_print' else ''
        do (
          set_field = {}, i =0,
          action = "show",
          cid = @model.getCid(),
          base_templ_suff =  base_templ_suff + (if @model.is_input() then '' else '_non_input'),
          set_field_class = false
        ) =>

          if @model.attributes.conditions
            for set_field in @model.get('conditions')
              if set_field
                  .action is 'show' and @model.getCid() is set_field.target
                    set_field_class = true

          @$el.addClass("hide") if set_field_class

          if !@is_section_break && @model.attributes.conditions
            for condition_hash in @model.get("conditions")
              do (condition_hash) =>
                if condition_hash.target is @model.getCid()
                  for views_name in @parentView.fieldViews
                    do (views_name, condition_hash) =>
                      if views_name.model.get('cid') is condition_hash.source
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
              for x in @$("input, textarea, select, .canvas_img, a")
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
          else if @is_section_break && @options.view_type == 'print'
            @$el.addClass('readonly') if @model.get("field_options")
                                          .state is "readonly"
            @$el.addClass('response-field-'+ @field_type + ' '+ @model.getCid())
              .data('cid', cid)
              .html(Formbuilder.templates["view/base#{base_templ_suff}"]({
                rf: @model,
                opts: @options}))
        return @

      focusEditView: ->
        if !@options.live
          @parentView.createAndShowEditView(@model)
          @parentView.setSortable()

      clear: ->
        do (index = 0, that = @) ->
          that.parentView.handleFormUpdate()
          index = that.parentView.fieldViews
            .indexOf(_.where(that.parentView.fieldViews, {cid: that.cid})[0])
          # should pass collection.models and not fieldviews
          that.updateFieldsInSectionBreak(index, that.parentView.collection.models) if that.model.get('field_type') == 'section_break'
          that.parentView.fieldViews.splice(index, 1) if (index > -1)
          that.clearConditions that.model.getCid(), that.parentView.fieldViews
          that.model.destroy()

      updateFieldsInSectionBreak: (index, models) ->
        do(section_id=undefined, is_recur=undefined) ->
          for i in [index-1...-1]
            if models[i]
              if models[i].get('field_type') == 'section_break'
                is_recur = models[i].get('field_options').recurring_section
                section_id = models[i].get('unique_id')
                break
          for i in [index+1...models.length]
            if models[i]
              break if models[i].get('field_type') == 'section_break'
              do( unique_section_id = models[index].get('unique_id') ) ->
                if models[i].get('section_id') == unique_section_id
                  if is_recur then models[i].set('i_am_in_recurring_section', is_recur) else models[i].unset('i_am_in_recurring_section')
                  if section_id then models[i].set('section_id', section_id) else models[i].unset('section_id')

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
        attrs = jQuery.extend(true, {}, @model.attributes)
        delete attrs['id']
        attrs['label'] += ' Copy'
        for condition in attrs['conditions']
          condition.target = '' if condition.target is @model.getCid()
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

      top_subset_collection: (cid, collection) ->
          do( json_collection = collection.toJSON(),
              arr_till_this_model = [] ) ->
            for field,index in json_collection
              if field.cid == cid
                return arr_till_this_model.reverse()
              else
                arr_till_this_model.push(field)

      initialize: ->
        if @model.get('field_type') == 'section_break'
          @model.off "change:field_options.recurring_section"
          @model.on "change:field_options.recurring_section", @recurring_status_modified, @
          if !@model.get('unique_id')
            do( latest_id = Formbuilder.latest_section_id++,
                current_model = @model,
                that = @) ->
              current_model.set("unique_id", latest_id)
        else
          do( current_model = @model,
              target_arr = @top_subset_collection(@model.getCid(), @options.parentView.collection.sort())) ->
              for field in target_arr
                if field.field_type == 'section_break'
                  current_model.set("section_id", field.unique_id)
                  do ( options = field.field_options ) ->
                    if options.recurring_section
                      current_model.set("i_am_in_recurring_section", true)
                  break
        @listenTo @model, "destroy", @remove

      recurring_status_modified: (model, value)->
        do ( target_arr = @options.parentView.collection.sort(), unique_section_id = model.get('unique_id') ) ->
          do(target_arr = target_arr.models) ->
            for field in target_arr
              if field.get('section_id') == unique_section_id
                field.set('i_am_in_recurring_section',value)
                field.set('conditions', [])

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
        'mousedown .fb-add-field-types a': 'enableSortable'

      get_appripriate_setup_method: (field_view) ->
        do( method = null ) ->
          if field_view.field && (field_view.field.android_setup || field_view.field.ios_setup || field_view.field.setup)
            if Formbuilder.isAndroid() && field_view.field.android_setup
              method = field_view.field.android_setup
            else if Formbuilder.isIos() && field_view.field.ios_setup
              method = field_view.field.ios_setup
            else
              method = field_view.field.setup
          method

      setup_new_page: (section_st_index, section_end_index, view_index) ->
        while section_st_index <= section_end_index
          do( that = this,
              method = null,
              fv = this.fieldViews[section_st_index], all_field_vals ={}) ->
            return if _.contains(_.keys(Formbuilder.nonInputFields), fv.model.get('field_type'))
            _.extend(all_field_vals, fv.model.get('field_values'))
            if fv.field.clearFields
              fv.field.clearFields(fv.$el, fv.model)
            else that.default_clear_fields(fv)
            method = that.get_appripriate_setup_method(fv)
            fv.model.set({'new_page': true, 'view_index': view_index}, {silent:true})
            if method
              fv.model.unset('field_values', {silent:true})
              method.call(fv.field, fv, fv.model)
              fv.model.unset('new_page', {silent:true})
              fv.model.set({'field_values': all_field_vals}, {silent:true})
          section_st_index++

      load_values_for_index: (section_st_index, section_end_index, load_index) ->
        while section_st_index <= section_end_index
          do( that = this,
            fv = this.fieldViews[section_st_index]
            )->
            return if _.contains(_.keys(Formbuilder.nonInputFields), fv.model.get('field_type'))
            do( all_field_vals = fv.model.attributes.field_values,
                req_field_vals = fv.model.attributes.field_values[load_index],
                method = that.get_appripriate_setup_method(fv)
              ) ->
              fv.model.set({'view_index': load_index}, {silent:true})
              if method
                fv.model.attributes.field_values = req_field_vals
                method.call(fv.field, fv, fv.model)
                fv.model.attributes.field_values = all_field_vals
              else
                that.default_setup(fv, fv.model.attributes.field_values[load_index])

          section_st_index++

      save_field_values_at_index: (section_st_index, section_end_index, save_at_index, invalid_fields=[]) ->
        while section_st_index <= section_end_index
          do( fv = this.fieldViews[section_st_index], is_field_valid = true )->
            return if _.contains(_.keys(Formbuilder.nonInputFields), fv.model.get('field_type'))
            if fv.field.isValid
              is_field_valid = false unless fv.field.isValid(fv.$el, fv.model)
            else
              if fv.$el.find('input, textarea, select').length > 0
                is_field_valid = false unless fv.$el.find('input, textarea, select')[0].validity.valid

            unless is_field_valid
              invalid_fields.push(fv)
              do(el = fv.$el, err_field_types = ['checkboxes', 'esignature', 'gmap', 'radio', 'scale_rating', 'take_pic_video_audio']) ->
                el.find('input').css('border-color','red')
                el.find('.hasDatepicker').css('border-color','red')
                if err_field_types.indexOf(fv.field_type) != -1
                  el.find('label > span').css('color','red')
            else
              do(el = fv.$el, err_field_types = ['checkboxes', 'esignature', 'gmap', 'radio', 'scale_rating', 'take_pic_video_audio']) ->
                el.find('input').css('border-color','#CCCCCC')
                el.find('.hasDatepicker').css('border-color','#CCCCCC')
                el.find('.bootstrap-filestyle label').css('border-color','rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25)')
                el.find('.bootstrap-filestyle label').css('border-bottom-color','#b3b3b3')
                el.find('label > span').css('color','#333')

            do( serialized_values = {},
                fl_val_hash = fv.model.attributes.field_values || {},
                computed_obj = {}
              ) ->
                fv.model.set({'view_index': save_at_index}, {silent:true})
                if fv.field.fieldToValue
                  computed_obj = fv.field.fieldToValue(fv.$el, fv.model)
                else
                  serialized_values = fv.$el.find('input, textarea, select, .canvas_img, a').serializeArray()
                  _.each serialized_values, (val) ->
                    computed_obj[val.name] = val.value
                fl_val_hash[save_at_index] = computed_obj
                fv.model.attributes.field_values = fl_val_hash
          section_st_index++
        return invalid_fields

      checkValidityOfDiv: (div) ->
        fv.$el.find('input, textarea, select').validity.valid

      default_clear_fields: (fieldView) ->
        fieldView.$el.find('input, textarea, select, .canvas_img, a').val("")

      default_setup: (fieldView, field_values) ->
        _.each field_values, (val, key)->
          fieldView.$el.find("[name=#{key}]").val(val)

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
        # Register external fields which are specific to the requirements.
        unless _.isUndefined @options.field_configs.fieldtype_custom_validation
          Formbuilder.options.FIELDSTYPES_CUSTOM_VALIDATION.concat(
            @options.field_configs.fieldtype_custom_validation)
        Formbuilder.options.FIELD_CONFIGS = @options.field_configs
        Formbuilder.options.EXTERNAL_FIELDS = $.extend({}, @options.external_fields)
        Formbuilder.options.EXTERNAL_FIELDS_TYPES = []
        do (reg_fields = Formbuilder.options.EXTERNAL_FIELDS) =>
          if(!_.isEmpty(Formbuilder.options.EXTERNAL_FIELDS))
            _.each reg_fields, (fl_opts, fl_name) ->
              Formbuilder.registerField(fl_name, fl_opts)
              Formbuilder.options.EXTERNAL_FIELDS_TYPES.push(fl_name)
            return

        # Send 'print_ext_fields_as_single_row' as a parameter to formbuilder
        # constructor if you want a single row of values for these fields
        # while printing in PDF format.
        # Merging this array in the PRINT_FIELDS_AS_SINGLE_ROW
        if(!_.isEmpty(@options.print_ext_fields_as_single_row))
          Array::push.apply Formbuilder.options.PRINT_FIELDS_AS_SINGLE_ROW,
            @options.print_ext_fields_as_single_row
          console.log(Formbuilder.options.PRINT_FIELDS_AS_SINGLE_ROW)

        # Set file upload url to upload files. If there is file field in the form,
        # then use this url to upload files.
        Formbuilder.options.FILE_UPLOAD_URL = @options.file_upload_url

        # Set esignature upload url to upload esignatures.
        # If there is esignature field in the form, then use this url to upload.
        Formbuilder.options.ESIGNATURE_UPLOAD_URL = @options.esignature_upload_url

        if(!_.isEmpty(@options.esignature_upload_data))
          Formbuilder.options.ESIGNATURE_UPLOAD_DATA = @options.esignature_upload_data

        # Set SHOW_ADMIN_ONLY flag to show/hide Admin Only Access checkbox
        # in edit template
        unless(_.isUndefined(@options.show_admin_only) && !@options.show_admin_only)
          Formbuilder.options.SHOW_ADMIN_ONLY = @options.show_admin_only

        Formbuilder.options.EDIT_FS_MODEL = @options.edit_fs_model
        if @options.print_view
          Formbuilder.options.PRINTVIEW = @options.print_view
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

      checkEquals: (val1, val2) ->
        (val1 == val2)

      checkLessThan: (val1, val2) ->
        (val1 < val2)

      checkGreaterThan: (val1, val2) ->
        (val1 > val2)

      checkNotEqual: (val1, val2) ->
        (val1 != val2)

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
          view_type: @options.view_type
          tagName: if Formbuilder.baseConfig[@options.view_type] then Formbuilder.baseConfig[@options.view_type].fieldTagName else 'div'
          className: if Formbuilder.baseConfig[@options.view_type] then Formbuilder.baseConfig[@options.view_type].fieldClassName else 'fb-field-wrapper'
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
            # If field is dragged from left panel then create a fresh model
            if ui.item.data('field-type')
              rf = @collection.create Formbuilder.helpers.defaultFieldAttrs(ui.item.data('field-type')), {$replaceEl: ui.item}
              @createAndShowEditView(rf)
            $('.form-builder-left-container ').css('overflow', 'auto')

            @collection.sort()
            do ( current_model = @collection.models[ui.item.index()],
                index = ui.item.index(),
                models = @collection.models,
                is_recur = undefined,
                section_id = undefined) ->
              if(current_model.get('field_type') == 'section_break')
                # get attr of moved section break
                is_recur = current_model.get('field_options').recurring_section
                section_id = current_model.get('unique_id')
                # modify following fields with current attr
                for i in [index+1...models.length]
                  if models[i]
                    break if models[i].get('field_type') == 'section_break'
                    if is_recur then models[i].set({'i_am_in_recurring_section', is_recur}, {silent:true})
                    if section_id then models[i].set({'section_id', section_id}, {silent:true})
                # select section break above the current index
                is_recur = undefined
                section_id = undefined
                for i in [index-1...-1]
                  if models[i]
                    if models[i].get('field_type') == 'section_break'
                      is_recur = models[i].get('field_options').recurring_section
                      section_id = models[i].get('unique_id')
                      break
                # modify abve fields according to above section break
                for i in [index-1...-1]
                  if models[i]
                    break if models[i].get('field_type') == 'section_break'
                    if is_recur then models[i].set({'i_am_in_recurring_section', is_recur}, {silent:true})
                    if section_id then models[i].set({'section_id', section_id}, {silent:true})
              else
                for i in [index-1...-1]
                  if models[i]
                    if models[i].get('field_type') == 'section_break'
                      is_recur = models[i].get('field_options').recurring_section
                      section_id = models[i].get('unique_id')
                      break
                if is_recur then current_model.set({'i_am_in_recurring_section', is_recur}, {silent:true}) else current_model.unset('i_am_in_recurring_section', {silent:true})
                if section_id then current_model.set({'section_id', section_id}, {silent:true}) else current_model.unset('section_id', {silent:true})

            @handleFormUpdate()
            @removeSortable()
            return true
          update: (e, ui) =>
            # ensureEditViewScrolled, unless we're updating from the draggable
            @ensureEditViewScrolled() unless ui.item.data('field-type')

      setDraggable: ->
        $addFieldButtons = @$el.find("[data-field-type]")

        $addFieldButtons.draggable
          connectToSortable: @$responseFields
          helper: =>
            $helper = $("<div class='response-field-draggable-helper' />")
            $helper.css
              width: @$responseFields.width() # hacky, won't get set without inline style
              height: '80px'
            $('.form-builder-left-container ').css('overflow', 'inherit')
            $helper

          stop: =>
            $('.form-builder-left-container ').css('overflow', 'auto')

      applyEasyWizard: ->
        setSectionProps = (obj_view, cnt, back_visibility) ->
          do($obj_view_el = obj_view.$el) =>
            $obj_view_el.attr({
              'data-step': cnt,
              'show-back': back_visibility,
              'data-step-title': "step#{cnt}"
            })
            $obj_view_el.addClass('step')
            $obj_view_el.addClass('active') if cnt == 1
        do (field_view = null, fieldViews = @fieldViews,
            add_break_to_next = false, recurring_section=false, total_responses_for_this_section = 0, wizard_step = null, sb_field = null,
            wiz_cnt = 1, prev_btn_text = 'Back', next_btn_text = 'Next',
            showSubmit = @options.showSubmit,
            sub_frag = document.createDocumentFragment(), _that = @) =>
          wizard_step = new Formbuilder.views.wizard_tab
            parentView: @
            tagName: if Formbuilder.baseConfig[@options.view_type] then Formbuilder.baseConfig[@options.view_type].wizardTagName else 'div'
            className: if Formbuilder.baseConfig[@options.view_type] then Formbuilder.baseConfig[@options.view_type].wizardClassName else 'fb-tab'
            view_type: @options.view_type
            index: wiz_cnt
            back_visibility: back_visibility
#          if @options.view_type != 'print'
#            setSectionProps(wizard_step, wiz_cnt, back_visibility)
#          if @options.view_type == 'print'
#            wizard_step.$el.append('<colgroup><col style="width: 30%;"><col style="width: 70%;"></colgroup>')

          for field_view, field_index in fieldViews
            field_view.$el.attr('data-step-id', wiz_cnt) unless field_view.is_section_break
            if (field_view.is_section_break && @options.view_type != 'print')
              back_visibility = field_view.model.get(
                Formbuilder.options.mappings.BACK_VISIBLITY)
              prev_btn_text = field_view.model.get(
                Formbuilder.options.mappings.PREV_BUTTON_TEXT)
              next_btn_text = field_view.model.get(
                Formbuilder.options.mappings.NEXT_BUTTON_TEXT)
              add_break_to_next = true
              recurring_section = field_view.model.get('field_options').recurring_section
              if field_view.model.get('field_values') && field_view.model.get('field_values')['response_count']
                total_responses_for_this_section = field_view.model.get('field_values')['response_count']
              field_view.model.set('response_cnt', total_responses_for_this_section)
              section_break_field_model = field_view.model
            # nothing should be rendered since it is an actionable section break
            if add_break_to_next && !field_view.is_section_break && @options.view_type != 'print'
              @$responseFields.append wizard_step.make_live(field_index-2)
              wiz_cnt += 1
              field_view.model.set('in_recursive', true)
              wizard_step = new Formbuilder.views.wizard_tab
                parentView: @
                view_type: @options.view_type
                index: wiz_cnt
                back_visibility: back_visibility
                recurring_section: recurring_section
                total_responses_for_this_section: total_responses_for_this_section || 0
                first_field_index: field_index
                section_break_field_model: section_break_field_model
              add_break_to_next = false
#              setSectionProps(wizard_step, wiz_cnt, back_visibility) # set easywizard properties for step
            if !add_break_to_next
              if(wizard_step.recurring)
                field_view.model.set('i_am_in_recurring_section', true)
              wizard_step.append_child(field_view.render().el)


          @$responseFields.append wizard_step.make_live(fieldViews.length-1)
          # TODO: Remove this call by calling this function from the setup
          # of individual fields
          fd_views = @fieldViews.filter (fd_view) ->
            Formbuilder.options.EXTERNAL_FIELDS_TYPES.indexOf(fd_view.field_type) != -1
          @bindExternalFieldsEvents(fd_views) if fd_views.length > 0

          # triggers event by setting values to respective fields
          # TODO: Try moving this to after easyWizard call with timeout of 0
          setTimeout (->
            _that.triggerEvent()
            return
          ), 5


          Formbuilder.make_wizard(
            $("#formbuilder_form"),
            {
              prevButton: prev_btn_text,
              nextButton: next_btn_text,
              after: (wizardObj, prevStepObj, currentStepObj) ->
                do( prev_clicked = false,
                    thisSettings = wizardObj.data('settings')
                  ) =>
                    if currentStepObj.children(':visible').length is 0
                      $activeStep.css({ height: '1px' })
                      if prev_clicked = wizardObj.direction == 'prev'
                        wizardObj.find('.easyWizardButtons.'+thisSettings.stepClassName+' .prev').trigger('click')
                      else
                        wizardObj.find('.easyWizardButtons.'+thisSettings.stepClassName+' .next').trigger('click')
                    else
                      if $nextStep.attr('show-back') == 'false'
                        wizardObj.find('.easyWizardButtons.'+thisSettings.stepClassName+' .prev').css("display", "none")
                        wizardObj.find('.easyWizardButtons.'+thisSettings.stepClassName+' .prev').addClass('hide')
                      else if currentStepObj.attr('data-step') != '1'
                        wizardObj.find('.easyWizardButtons.'+thisSettings.stepClassName+' .prev').css("display", "block")
                        wizardObj.find('.easyWizardButtons.'+thisSettings.stepClassName+' .prev').removeClass('hide')
                      $('#grid_div').scrollTop(0)

                    $("#formbuilder_form").height($('.easyWizardWrapper .active').outerHeight() +
                      $('.easyWizardButtons').outerHeight())
                    if parseInt($nextStep.attr('data-step')) == thisSettings.steps &&
                       showSubmit
                      wizardObj.parents('.form-panel').find('.update-button').show()
                    else
                      wizardObj.parents('.form-panel').find('.update-button').hide()
            })
        return @


      triggerEvent:->
        do (field_view = null,
            fieldViews = @fieldViews,
            model = ""
        ) =>
          for field_view in fieldViews
            do ( # compute values to fields
              x = null,
              count = 0,
              should_incr = (attr) -> attr != 'radio',
              val_set = false,
              model = field_view.model,
              field_type_method_call = '',
              field_method_call = '',
              method = null,
              cid = ''
            ) =>
              field_type_method_call = model.get(Formbuilder.options.mappings.FIELD_TYPE)
              field_method_call = Formbuilder.fields[field_type_method_call]

              if(field_view.model.get('field_type') is 'heading' || field_view.model.get('field_type') is 'free_text_html')
                for x in field_view.$("label")
                  count = do( # set element name, value and call setup
                    x,
                    index = count + (if should_incr($(x)
                            .attr('type')) then 1 else 0),
                    name = null,
                    val = null,
                    value = 0,
                  ) =>
                    val_set = true if $(x).text() && !val_set
                    index
              else if (field_view.model.get('field_type') is 'file')
                if model.get('field_values')
                  _.each(model.get('field_values')["0"], (value, key) ->
                    unless value is ""
                      do (a_href_val = '', a_text = '', mod_cid = field_view.model.getCid()) =>
                        if $('#file_upload_link_'+mod_cid)
                          if _.isString value
                            a_href_val = value
                            a_text = value.split("/").pop().split("?")[0]
                          else if _.isObject(value) && !_.isUndefined(value.url)
                            a_href_val = value.url
                            a_text = value.name
                          else if _.isObject(value) && _.isObject value[mod_cid+"_2"]
                            a_href_val = value[mod_cid+"_2"].url
                            a_text = value[mod_cid+"_2"].name
                          @$('#file_upload_link_'+field_view.model.getCid()).html(
                            "<div class='file_upload_link_div' id=file_upload_link_div_"+key+"><a type = 'pic_video_audio' class='active_link_doc' target='_blank' name="+key+" href="+a_href_val+">"+a_text+"</a></div>"
                          )
                        @$('#file_'+field_view.model.getCid()).attr("required", false);
                  )
              else
                #field_type_method_call = model.get(Formbuilder.options.mappings.FIELD_TYPE)
                #field_method_call = Formbuilder.fields[field_type_method_call]
                cid = model.getCid()
                method = field_method_call.setup if field_method_call.setup
                if field_method_call.android_setup && Formbuilder.isAndroid()
                  method = field_method_call.android_setup
                if field_method_call.ios_setup && Formbuilder.isIos()
                  method = field_method_call.ios_setup

                do(all_field_values = model.get('field_values')) ->
                  if all_field_values && all_field_values[0]
                    model.unset('field_values', {silent:true})
                    model.set({'field_values': all_field_values[0]}, {silent:true})
                    if method
                    	method.call(field_method_call, field_view, model, Formbuilder.options.EDIT_FS_MODEL)
                    else
                    	do( fv = model.get("field_values")) ->
                    		_.each fv, (val, key) ->
                    			field_view.$el.find("[name=#{key}]").val(val)
                    model.unset('field_values', {silent:true})
                    model.set({'field_values': all_field_values}, {silent:true})
                  else
                    method.call(field_method_call, field_view, model, Formbuilder.options.EDIT_FS_MODEL) if method
                if field_method_call.setValForPrint && @options.view_type == 'print'
                  field_method_call.setValForPrint(field_view, model)
                else if !method
                  for x in field_view.$("input, textarea, select, .canvas_img, a")
                    count = do( # set element name, value and call setup
                      x,
                      index = count + (if should_incr($(x)
                              .attr('type')) then 1 else 0),
                      name = null,
                      val = null,
                      value = 0,
                      has_heading_field = false,
                      has_ckeditor_field = false
                    ) =>
                      for model_in_collection in field_view.model.collection.where({'field_type':'heading'})
                        if field_view.model.get('conditions')
                          for model_in_conditions in field_view.model.get('conditions')
                            if(model_in_collection.getCid() is model_in_conditions.target)
                              has_heading_field = true
                      for model_in_collection in field_view.model.collection.where({'field_type':'free_text_html'})
                        if field_view.model.get('conditions')
                          for model_in_conditions in field_view.model.get('conditions')
                            if(model_in_collection.getCid() is model_in_conditions.target)
                              has_ckeditor_field = true

                      value = x.value if field_view.field_type == 'radio'||'scale_rating'
                      name = cid.toString() + "_" + index.toString()
                      if $(x).attr('type') == 'radio' and model.get('field_values')
                        val = model.get('field_values')[value]
                      else if model.get('field_values')
                        val = model.get('field_values')[name]
                      field_method_call.setup($(x), model, index) if field_method_call.setup
                      if !val_set
                        val_set = true if $(x).val()
                        val_set = true if val or has_heading_field or has_ckeditor_field
                      @setFieldVal($(x), val, model.getCid()) if val

                      index

                if val_set && (Formbuilder.options.EDIT_FS_MODEL || field_type_method_call == 'checkboxes' || field_type_method_call == 'radio')
                  field_view.trigger('change_state')

              if Formbuilder.isAndroid() && field_method_call.android_bindevents
                field_method_call.android_bindevents(field_view)
              else if Formbuilder.isIos() && field_method_call.ios_bindevents
                field_method_call.ios_bindevents(field_view)
              else if field_method_call.bindevents
                field_method_call.bindevents(field_view)

          @formBuilder.trigger('render_complete')

      initializeEsings:->
        do (esigns = @$el.find('.response-field-esignature')) =>
          _.each esigns, (el) ->
            $esig_el = $(el).find("img")
            cid = $esig_el.attr("name").split("_")[0]
            initializeCanvas cid
            return

      setFieldVal: (elem, val, cid) ->
        do(setters = null, type = $(elem).attr('type')) =>
          setters =
            file: ->
              if $('#file_upload_link_'+cid) and val
                $("#file_upload_link_"+cid).html(
                  "<div class='file_upload_link_div' id=file_upload_link_div_"+cid+"><a type = 'pic_video_audio' class='active_link_doc' target='_blank' name="+cid+" href="+val+">"+val.split("/").pop().split("?")[0]+"</a></div>"
                ) if _.isString val
                $("#file_upload_link_"+cid).html(
                  "<div class='file_upload_link_div' id=file_upload_link_div_"+cid+"><a type = 'pic_video_audio' class='active_link_doc' target='_blank' name="+cid+" href="+val.url+">"+val.name+"</a></div>"
                ) if _.isObject val
            take_pic_video_audio: ->
              $(elem).attr("href",val)
              $(elem).text(
                val.split("/").pop().split("?")[0]
              ) if val
            checkbox: ->
              $(elem).attr("checked", true) if val
            radio: ->
              $(elem).attr("checked", true) if val
            default: ->
              $(elem).val(val) if val

          (setters[type] || setters['default'])(elem, val)

      applyFileStyle: ->
        _.each @fieldViews, (field_view) ->
          if field_view.model.get('field_type') is 'file'
            if Formbuilder.isMobile()
              $('#file_'+field_view.model.getCid()).attr("type","button");
              $('#file_'+field_view.model.getCid()).attr("value",field_view.model.get(Formbuilder.options.mappings.FILE_BUTTON_TEXT) || '');
              $('#file_'+field_view.model.getCid()).addClass("file_upload btn_icon_file");
              $('#file_'+field_view.model.getCid()).removeAttr("name");
            else
              $('#file_'+field_view.model.getCid()).filestyle({
                input: false,
                buttonText: field_view.model.get(Formbuilder.options.mappings.FILE_BUTTON_TEXT) || ''
              });
          if field_view.model.get('field_type') is 'address'
            if typeof(BRIJavaScriptInterface) != 'undefined'
              $('#file_'+field_view.model.getCid()).bfhcountries();
            else
              $('#file_'+field_view.model.getCid()).bfhcount();

      addAll: ->
        @collection.each @addOne, @
        if @options.live
          @applyEasyWizard()
          $('.easyWizardButtons.step .prev').addClass('hide btn-danger')
          $('.easyWizardButtons.step .next').addClass('btn-success')
          @applyFileStyle()
          @initializeEsings()
          $('.readonly').find('input, textarea, select').attr('disabled', true);
        else
          @setDraggable()

      # Bind events for externally registered fields if there is a method
      # named as bindEventsNSetValues'
      # TODO: Move this call to the setup of the individual fields
      bindExternalFieldsEvents: (external_field_views) ->
        _.each external_field_views, (external_field_view) ->
          if external_field_view.field.bindEventsNSetValues
            external_field_view.field.bindEventsNSetValues(external_field_view)

      hideShowNoResponseFields: ->
        @$el.find(".fb-no-response-fields")[if (@collection.length > 0 || @options.live) then 'hide' else 'show']()

      enableSortable: ->
        @setSortable()

      addField: (e) ->
        field_type = $(e.currentTarget).data('field-type')
        @createField Formbuilder.helpers.defaultFieldAttrs(field_type)

      createField: (attrs, options) ->
        rf = @collection.create attrs, options
        @createAndShowEditView(rf)
        @handleFormUpdate()

      createAndShowEditView: (model) ->
        $responseFieldEl = @$el.find(".fb-field-wrapper").filter( -> $(@).data('cid') == model.get('cid'))
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
        #@unlockLeftWrapper()
        #$.scrollWindowTo ($responseFieldEl.offset().top - @$responseFields.offset().top), 200, =>
        #@lockLeftWrapper()

      lockLeftWrapper: ->
        @$fbLeft.data('locked', true)

      unlockLeftWrapper: ->
        @$fbLeft.data('locked', false)

      removeSortable: ->
        @$responseFields.sortable('destroy') if @$responseFields.hasClass('ui-sortable')

      handleFormUpdate: ->
        return if @updatingBatch
        @formSaved = false
        @saveFormButton.removeAttr('disabled').text(Formbuilder.options.dict.SAVE_FORM) if @saveFormButton

      saveForm: (e) ->
        return if @formSaved
        @formSaved = true
        @saveFormButton.attr('disabled', true).text(Formbuilder.options.dict.ALL_CHANGES_SAVED)
        @sortRemoveAddConditions()
        payload = JSON.stringify fields: @collection.toJSON()

        if Formbuilder.options.HTTP_ENDPOINT then @doAjaxSave(payload)
        @formBuilder.trigger 'save', payload

      # This method will check for file fields. If file field exists, then it will upload files.
      uploadFile: ->
        if Formbuilder.options.FILE_UPLOAD_URL != ''
          console.log(Formbuilder.options.FILE_UPLOAD_URL);
          do (_that = @, file_field_views = @fieldViews.filter (fd_view) ->
            fd_view.field_type is 'file') =>
            unless _.isEmpty(file_field_views)
              $.ajaxSetup headers:
                "X-CSRF-Token": $("meta[name=\"csrf-token\"]").attr("content")

              @$("#formbuilder_form").ajaxSubmit
                url: Formbuilder.options.FILE_UPLOAD_URL
                async: false
                success: (data) ->
                  if data.errors
                    # While uploading files, if there are any errors occurred,
                    # then formbuilder will trigger the event 'fileUploadError'
                    _that.formBuilder.trigger 'fileUploadError', data.errors
                  else
                    _.each data.files, (response) ->
                      $("input[name=" + response.field_name + "]").val ""
                      if response.upload_obj
                        $("input[name=" + response.field_name + "]").attr "file_url", response.upload_obj.url
                        $("input[name=" + response.field_name + "]").attr "file_name", response.upload_obj.name
                      return
                  return
              return

      isBase64Data: (str) ->
        regex4esign = /^data:image\/png;base64/
        regex4esign.test str

      uploadEsignatures: ->
        do (_that = @, esig_field_views = @fieldViews.filter (fd_view) =>
            fd_view.field_type is 'esignature') =>
          _.each esig_field_views, (fd_view) ->
            do($obj_elts = _that.$("[name^=" + fd_view.model.getCid() + "_]")) =>
              _.each $obj_elts, (el) ->
                if ($(el).attr('type') == 'esignature' && $(el).attr("src"))
                  do (base64_data = $("[name="+$(el).attr('name')+']').attr("src")) =>
                    if _that.isBase64Data(base64_data) && !$(el).attr("upload_url")
                      _that.uploadImage(base64_data, $(el).attr('name'));
                    else
                      $(el).attr('uploaded_url', $(el).attr("upload_url"))
                    return
                return
            return

      uploadImage: (base64_data, field_name) ->
        do(_that = @, esig_data = {}, base64_data = encodeURIComponent(base64_data.split(",")[1])) =>
          $.ajaxSetup headers:
            "X-CSRF-Token": $("meta[name=\"csrf-token\"]").attr("content")

          $.extend(esig_data, Formbuilder.options.ESIGNATURE_UPLOAD_DATA)
          $.extend(esig_data, {base64_data: base64_data, field_name: field_name})

          $.ajax
            url: Formbuilder.options.ESIGNATURE_UPLOAD_URL
            type: 'POST'
            data: esig_data
            dataType: 'json'
            async: false
            success: (data) ->
              if data.errors
                # While uploading esignatures, if there are any errors occurred,
                # then formbuilder will trigger the event 'fileUploadError'
                _that.formBuilder.trigger 'fileUploadError', data.errors
              else
                do(uploaded_url = data.image.uploaded_url.split("?")[0]) =>
                  $("[name=" + data.image.field_name + "]").attr "uploaded_url", uploaded_url
              return
            error: (jqXHR, textStatus, errorThrown) ->
              do( response = jqXHR.responseText; error = (if response isnt '' then JSON.parse(response).error else '')) =>
                # While uploading esignatures, if there are any errors occurred,
                # then formbuilder will trigger the event 'fileUploadError'
                _that.formBuilder.trigger 'fileUploadError', error
              return
          return

      saveTemplate: (e) ->
        @sortRemoveAddConditions()
        payload = JSON.stringify fields: @collection.toJSON()
        if Formbuilder.options.HTTP_ENDPOINT then @doAjaxSave(payload)
        @formBuilder.trigger 'saveTemplate', payload

      sortRemoveAddConditions: () ->
        @collection.sort()
        @collection.each @removeSourceConditions, @
        @collection.each @addConditions, @

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
            do(source = {}, source_condition = {}, target_condition = {}, is_equal = false,
               model_cid = model.getCid()) =>
              unless _.isEmpty(condition.source)
                source = model.collection.where({cid: condition.source})
                condition.target = model_cid if condition.target is ''
                target_condition = $.extend(true, {}, condition)
                target_condition.isSource = false
                if !source[0].attributes.conditions || source[0].attributes.conditions.length < 1
                  source_condition = target_condition
                _.each(source[0].attributes.conditions, (source_condition) ->
                  delete source[0].attributes.conditions[source_condition] if source_condition.target is model_cid
                  if _.isEqual(source_condition,target_condition)
                    is_equal = true
                )
                if !is_equal
                  _.extend( source_condition, target_condition)
                  source[0].attributes.conditions = [] unless source[0].attributes.conditions
                  source[0].attributes.conditions.push(source_condition)
                  source[0].save()
          )

      getVisibleNonEmptyFields: ()->
        res = []
        for f in @fieldViews
          if (f.current_state is 'show' && !f.$el.hasClass('hide')) || f.$el.hasClass('show')
            obj =
                field_type: f.model.get('field_type'),
                label: f.model.get('label'),
                cid: f.model.get('cid'),
                complete: false
            if 'checkAttributeHasValue' of f.field
              r = f.field.checkAttributeHasValue(f.model.get('cid'),f.$el)
              if r
                obj.complete = true
            res.push(obj)
        res

      formData: ->
        @$('#formbuilder_form').serializeArray()

      formValid: ->
        do(valid = false) =>
          valid = do(el =@$('#formbuilder_form')[0]) ->
            !el.checkValidity || el.checkValidity()
          if !valid
            @$('#formbuilder_form')[0].classList.add('submitted')
            return false
          do(field=null,i=0, is_invalid_field = false, err_field_types=[]) =>
            err_field_types = ['checkboxes', 'esignature', 'gmap', 'radio', 'scale_rating', 'take_pic_video_audio']
            while i< @fieldViews.length
              field = @fieldViews[i]
              if @getCurrentView().indexOf(field.model.get('cid')) != -1
                if field.isValid && !field.isValid()
                  field.$el.find('input').css('border-color','red')
                  field.$el.find('.hasDatepicker').css('border-color','red')
                  if err_field_types.indexOf(field.field_type) != -1
                    field.$el.find('label > span').css('color','red')
                  is_invalid_field = true if !is_invalid_field
                else
                  field.$el.find('input').css('border-color','#CCCCCC')
                  field.$el.find('.hasDatepicker').css('border-color','#CCCCCC')
                  field.$el.find('.bootstrap-filestyle label').css('border-color','rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25)')
                  field.$el.find('.bootstrap-filestyle label').css('border-bottom-color','#b3b3b3')
                  field.$el.find('label > span').css('color','#333')

              i++
            return false if is_invalid_field
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

  getVisibleNonEmptyFields: ->
    @mainView.getVisibleNonEmptyFields()


window.Formbuilder = Formbuilder

if module?
  module.exports = Formbuilder
else
  window.Formbuilder = Formbuilder
