(function() {
  rivets.binders.input = {
    publishes: true,
    routine: rivets.binders.value.routine,
    bind: function(el) {
      return el.addEventListener('input', this.publish);
    },
    unbind: function(el) {
      return el.removeEventListener('input', this.publish);
    }
  };

  rivets.configure({
    prefix: "rv",
    adapter: {
      subscribe: function(obj, keypath, callback) {
        callback.wrapped = function(m, v) {
          return callback(v);
        };
        return obj.on('change:' + keypath, callback.wrapped);
      },
      unsubscribe: function(obj, keypath, callback) {
        return obj.off('change:' + keypath, callback.wrapped);
      },
      read: function(obj, keypath) {
        if (keypath === "cid") {
          return obj.cid;
        }
        return obj.get(keypath);
      },
      publish: function(obj, keypath, value) {
        if (obj.cid) {
          return obj.set(keypath, value);
        } else {
          return obj[keypath] = value;
        }
      }
    }
  });

}).call(this);

(function() {
  var Formbuilder;

  Formbuilder = (function() {
    Formbuilder.helpers = {
      defaultFieldAttrs: function(field_type) {
        var attrs, _base;
        attrs = {
          label: "Untitled",
          field_type: field_type,
          required: false,
          field_options: {},
          conditions: []
        };
        return (typeof (_base = Formbuilder.fields[field_type]).defaultAttributes === "function" ? _base.defaultAttributes(attrs) : void 0) || attrs;
      },
      simple_format: function(x) {
        return x != null ? x.replace(/\n/g, '<br />') : void 0;
      }
    };

    Formbuilder.baseConfig = {
      'print': {
        'fieldTagName': 'tr',
        'fieldClassName': 'field_tr',
        'wizardTagName': 'table',
        'wizardClassName': 'fb-tab print_form'
      }
    };

    Formbuilder.options = {
      BUTTON_CLASS: 'fb-button',
      HTTP_ENDPOINT: '',
      HTTP_METHOD: 'POST',
      FIELDSTYPES_CUSTOM_VALIDATION: ['checkboxes', 'fullname', 'radio', 'scale_rating'],
      PRINT_FIELDS_AS_SINGLE_ROW: ['file', 'take_pic_video_audio'],
      CKEDITOR_CONFIG: ' ',
      HIERARCHYSELECTORVIEW: ' ',
      COMPANY_HIERARCHY: [],
      PRINTVIEW: false,
      EDIT_FS_MODEL: false,
      EXTERNAL_FIELDS: [],
      FIELD_CONFIGS: {},
      EXTERNAL_FIELDS_TYPES: [],
      FILE_UPLOAD_URL: '',
      ESIGNATURE_UPLOAD_URL: '',
      ESIGNATURE_UPLOAD_DATA: {},
      SHOW_ADMIN_ONLY: true,
      mappings: {
        SIZE: 'field_options.size',
        UNITS: 'field_options.units',
        LABEL: 'label',
        FIELD_TYPE: 'field_type',
        REQUIRED: 'required',
        ADMIN_ONLY: 'admin_only',
        OPTIONS: 'field_options.options',
        DESCRIPTION: 'field_options.description',
        INCLUDE_OTHER: 'field_options.include_other_option',
        INCLUDE_PHOTO: 'field_options.include_photo_option',
        INCLUDE_VIDEO: 'field_options.include_video_option',
        INCLUDE_AUDIO: 'field_options.include_audio_option',
        INCLUDE_SUFFIX: 'field_options.include_suffix',
        INCLUDE_BLANK: 'field_options.include_blank_option',
        INTEGER_ONLY: 'field_options.integer_only',
        MIN: 'field_options.min',
        MAX: 'field_options.max',
        DEFAULT_NUM_VALUE: 'field_options.default_num_value',
        STEP: 'field_options.step',
        MINLENGTH: 'field_options.minlength',
        MAXLENGTH: 'field_options.maxlength',
        IMAGELINK: 'field_options.image_link',
        IMAGEWIDTH: 'field_options.image_width',
        IMAGEHEIGHT: 'field_options.image_height',
        CANVAS_WIDTH: 'field_options.canvas_width',
        CANVAS_HEIGHT: 'field_options.canvas_height',
        IMAGEALIGN: 'field_options.image_align',
        LENGTH_UNITS: 'field_options.min_max_length_units',
        MINAGE: 'field_options.minage',
        DEFAULT_VALUE: 'field_options.default_value',
        HINT: 'field_options.hint',
        PREV_BUTTON_TEXT: 'field_options.prev_button_text',
        NEXT_BUTTON_TEXT: 'field_options.next_button_text',
        HTML_DATA: 'field_options.html_data',
        IMAGE_DATA: 'field_options.image_data',
        STARTING_POINT_TEXT: 'field_options.start_point_text',
        ENDING_POINT_TEXT: 'field_options.ending_point_text',
        MATCH_CONDITIONS: 'field_options.match_conditions',
        ALLOWED_FILE_TYPES: 'field_options.allow_file_type',
        FILE_BUTTON_TEXT: 'field_options.file_button_text',
        FULLNAME_PREFIX_TEXT: 'field_options.prefix_text',
        FULLNAME_FIRST_TEXT: 'field_options.first_name_text',
        FULLNAME_MIDDLE_TEXT: 'field_options.middle_name_text',
        FULLNAME_LAST_TEXT: 'field_options.last_name_text',
        FULLNAME_SUFFIX_TEXT: 'field_options.suffix_text',
        BACK_VISIBLITY: 'field_options.back_visiblity',
        DEFAULT_COUNTRY: 'field_options.default_country',
        DATE_ONLY: 'field_options.date_only',
        TIME_ONLY: 'field_options.time_only',
        DATE_FORMAT: 'field_options.date_format',
        MASK_VALUE: 'field_options.mask_value',
        COUNTRY_CODE: 'field_options.country_code',
        AREA_CODE: 'field_options.area_code',
        DEFAULT_ADDRESS: 'field_options.default_address',
        DEFAULT_CITY: 'field_options.default_city',
        DEFAULT_STATE: 'field_options.default_state',
        DEFAULT_ZIPCODE: 'field_options.default_zipcode',
        OPTIONAL_FIELD: 'field_options.optional_field',
        EMPTY_OPTION_TEXT: 'field_options.empty_option_text',
        RECURRING_SECTION: 'field_options.recurring_section',
        START_DATE_TIME_TEXT: 'field_options.start_date_time_text',
        END_DATE_TIME_TEXT: 'field_options.end_date_time_text',
        DATETIME_DIFFERENCE_TEXT: 'field_options.datetime_difference_text'
      },
      dict: {
        ALL_CHANGES_SAVED: 'All changes saved',
        SAVE_FORM: 'Save form',
        UNSAVED_CHANGES: 'You have unsaved changes. If you leave this page, you will lose those changes!'
      }
    };

    Formbuilder.fields = {};

    Formbuilder.inputFields = {};

    Formbuilder.nonInputFields = {};

    Formbuilder.latest_section_id = 100;

    Formbuilder.isIos = function() {
      return typeof BRIJavaScriptInterface !== 'undefined';
    };

    Formbuilder.isAndroid = function() {
      return typeof Android !== 'undefined';
    };

    Formbuilder.isMobile = function() {
      return Formbuilder.isAndroid() || Formbuilder.isIos();
    };

    Formbuilder.model = Backbone.DeepModel.extend({
      sync: function() {},
      indexInDOM: function() {
        var $wrapper;
        $wrapper = $(".fb-field-wrapper").filter(((function(_this) {
          return function(_, el) {
            return $(el).data('cid') === _this.getCid();
          };
        })(this)));
        return $(".fb-field-wrapper").index($wrapper);
      },
      is_input: function() {
        return Formbuilder.inputFields[this.get(Formbuilder.options.mappings.FIELD_TYPE)] != null;
      },
      getCid: function() {
        return this.get('cid') || this.cid;
      }
    });

    Formbuilder.collection = Backbone.Collection.extend({
      initialize: function() {
        return this.on('add', this.copyCidToModel);
      },
      model: Formbuilder.model,
      comparator: function(model) {
        return model.indexInDOM();
      },
      copyCidToModel: function(model) {
        return model.attributes.cid = model.cid;
      },
      recurFieldsBySectionId: function(section_id) {
        var filtered;
        filtered = this.filter(function(model) {
          return model.get('i_am_in_recurring_section') && model.get('section_id') === section_id;
        });
        return new Formbuilder.collection(filtered);
      },
      exceptRecurAndNonInputFields: function() {
        var filtered;
        filtered = this.filter(function(model) {
          return !model.get('i_am_in_recurring_section') && Formbuilder.fields[model.get('field_type')].type !== 'non_input';
        });
        return new Formbuilder.collection(filtered);
      }
    });

    Formbuilder.registerField = function(name, opts) {
      var x, _i, _len, _ref;
      _ref = ['view', 'edit', 'print'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        if (_.isString(opts[x])) {
          opts[x] = _.template(opts[x]);
        }
      }
      Formbuilder.fields[name] = opts;
      if (opts.type === 'non_input') {
        return Formbuilder.nonInputFields[name] = opts;
      } else {
        return Formbuilder.inputFields[name] = opts;
      }
    };

    Formbuilder.make_wizard = function(elem, opts) {
      return (function(defaults) {
        return elem.easyWizard(_.extend(defaults, opts));
      })({
        showSteps: false,
        submitButton: false
      });
    };

    Formbuilder.views = {
      wizard_tab: Backbone.View.extend({
        tagName: 'div',
        className: "fb-tab",
        initialize: function() {
          this.parentView = this.options.parentView;
          this.frag = document.createDocumentFragment();
          this.recurring = this.options.recurring_section;
          this.first_field_index = this.options.first_field_index;
          this.last_field_index = this.options.first_field_index;
          this.view_index = 0;
          this.total_responses = this.options.total_responses_for_this_section;
          this.field_views = this.options.field_views;
          this.section_break_field_model = this.options.section_break_field_model;
          if (this.options.view_type !== 'print') {
            this.setSectionProps(this.options.index, this.options.back_visibility);
          }
          if (this.options.view_type === 'print') {
            return $el.append('<colgroup><col style="width: 30%;"><col style="width: 70%;"></colgroup>');
          }
        },
        make_live: function(last_field_index) {
          this.last_field_index = last_field_index;
          this.$el.append(this.recurring ? this.wrap_section(last_field_index) : this.frag);
          return this.$el;
        },
        append_child: function(child) {
          return this.frag.appendChild(child);
        },
        dummy_step: function(cnt) {
          var elem;
          elem = $('<div></div>');
          this.setSectionProps(cnt, true, elem);
          return elem;
        },
        show_hide_next_button: function(_wiz) {
          if ((this.total_responses <= 1 || this.view_index === (this.total_responses - 1)) && !this.parentView.options.showSubmit) {
            _wiz.find(".easyWizardButtons.mystep .next").hide();
            return _wiz.find(".easyWizardButtons.mystep .next").addClass('hide');
          } else {
            _wiz.find(".easyWizardButtons.mystep .next").show();
            return _wiz.find(".easyWizardButtons.mystep .next").removeClass('hide');
          }
        },
        show_hide_previous_buttons: function(that, btn_class) {
          return (function(_this) {
            return function(wiz) {
              if (that.view_index === 0) {
                wiz.find(".easyWizardButtons.mystep .prev, .easyWizardButtons.mystep ." + btn_class).hide();
                return wiz.find(".easyWizardButtons.mystep .prev, .easyWizardButtons.mystep ." + btn_class).addClass('hide');
              } else {
                wiz.find(".easyWizardButtons.mystep .prev, .easyWizardButtons.mystep ." + btn_class).show();
                return wiz.find(".easyWizardButtons.mystep .prev, .easyWizardButtons.mystep ." + btn_class).removeClass('hide');
              }
            };
          })(this)(that.$el.find('.easyWizardElement.mystep'));
        },
        save_current_section: function() {
          this.parentView.save_field_values_at_index(this.first_field_index, this.last_field_index, this.view_index);
          if (this.view_index === this.total_responses) {
            this.total_responses++;
          }
          return this.section_break_field_model.set('response_cnt', this.total_responses);
        },
        previous_section: function(btn_class) {
          this.view_index--;
          this.parentView.load_values_for_index(this.first_field_index, this.last_field_index, this.view_index);
          return this.show_hide_previous_buttons(this, btn_class);
        },
        wrap_section: function(last_field_index) {
          var extrabuttons, next_btn_text, prev_btn_text;
          return (function(that, inner_wiz, wrap_inner_0, wrap_inner_1, wrap_inner_2, inner1, inner2) {
            if (!Formbuilder.isMobile()) {
              next_btn_text = 'Next Entry';
            }
            if (!Formbuilder.isMobile()) {
              prev_btn_text = 'Previous Entry';
            }
            if (Formbuilder.isMobile()) {
              extrabuttons = {
                'Previous': {
                  'buttonClass': 'previous_btn',
                  'show': false,
                  'callback': that.previous_section.bind(that, 'previous_btn')
                },
                'Save': {
                  'buttonClass': 'save_btn',
                  'show': true,
                  'callback': that.save_current_section.bind(that)
                }
              };
            }
            inner1.append_child(that.frag);
            wrap_inner_1.append(inner1.frag);
            inner_wiz.append(wrap_inner_0);
            inner_wiz.append(wrap_inner_1);
            inner_wiz.append(wrap_inner_2);
            that.parentView.$el.append(inner_wiz);
            Formbuilder.make_wizard(inner_wiz, {
              extrabuttons: extrabuttons,
              stepClassName: "mystep",
              prevButton: prev_btn_text,
              nextButton: next_btn_text,
              showSteps: false,
              submitButton: false,
              before: function(wiz, curobj, nextobj) {
                return (function(_this) {
                  return function(cur_step, next_step, temp_index, arr_invalid_fields) {
                    if (next_step === 2) {
                      that.show_hide_next_button(wiz);
                      return true;
                    }
                    arr_invalid_fields = that.parentView.save_field_values_at_index(that.first_field_index, that.last_field_index, that.view_index);
                    if (!_.isEmpty(arr_invalid_fields)) {
                      if (typeof that.parentView.options.validation_fail_cb === 'function') {
                        that.parentView.options.validation_fail_cb();
                      }
                      return false;
                    } else {
                      if (typeof that.parentView.options.validation_success_cb === 'function') {
                        that.parentView.options.validation_success_cb();
                      }
                    }
                    if (next_step > cur_step) {
                      that.view_index++;
                      if (that.view_index < that.total_responses) {
                        that.parentView.load_values_for_index(that.first_field_index, last_field_index, that.view_index);
                      } else {
                        that.parentView.setup_new_page(that.first_field_index, last_field_index, that.view_index);
                      }
                      if (that.view_index > that.total_responses) {
                        that.total_responses++;
                      }
                    } else {
                      if (that.view_index === that.total_responses) {
                        that.total_responses++;
                      }
                      that.view_index--;
                      that.parentView.load_values_for_index(that.first_field_index, last_field_index, that.view_index);
                    }
                    that.show_hide_next_button(wiz);
                    that.section_break_field_model.set('response_cnt', that.total_responses);
                    that.show_hide_previous_buttons(that, 'previous_btn');
                    return false;
                  };
                })(this)(curobj.data('step'), nextobj.data('step'), that.first_field_index, []);
              }
            });
            inner_wiz.easyWizard('goToStep', 2);
            inner_wiz.find(".easyWizardButtons.mystep .prev").addClass('hide btn-danger');
            inner_wiz.find(".easyWizardButtons.mystep .next").addClass('btn-success');
            return inner_wiz;
          })(this, $('<div></div>'), $('<div class="mystep">Ohh Am I Fake PREV</div>'), $('<div class="mystep"></div>'), $('<div class="mystep">Ohh Am I Fake NEXT</div>'), new Formbuilder.views.wizard_tab({
            parentView: this,
            view_type: this.options.view_type,
            index: 1,
            back_visibility: true
          }), new Formbuilder.views.wizard_tab({
            parentView: this,
            view_type: this.options.view_type,
            index: 2,
            back_visibility: false
          }, next_btn_text = "Save & Next", prev_btn_text = "Save & Prev", extrabuttons = {}));
        },
        setSectionProps: function(cnt, back_visibility, elem) {
          elem = elem || this.$el;
          elem.attr({
            'data-step': cnt,
            'show-back': back_visibility,
            'data-step-title': "step" + cnt
          }).addClass('step');
          if (cnt === 1) {
            return elem.addClass('active');
          }
        }
      }),
      view_field: Backbone.View.extend({
        className: "fb-field-wrapper",
        events: {
          'click .subtemplate-wrapper': 'focusEditView',
          'click .js-duplicate': 'duplicate',
          'click .js-clear': 'clear',
          'keyup': 'changeStateSource',
          'change': 'changeStateSource',
          'mouseover #can': 'onCanvas'
        },
        onCanvas: function() {
          return reinitializeCanvas(this.model.getCid());
        },
        initialize: function() {
          this.current_state = 'show';
          this.parentView = this.options.parentView;
          this.field_type = this.model.get(Formbuilder.options.mappings.FIELD_TYPE);
          this.field = Formbuilder.fields[this.field_type];
          this.is_section_break = this.field_type === 'section_break';
          this.listenTo(this.model, "change", this.render);
          this.listenTo(this.model, "destroy", this.remove);
          return this.listenTo(this.model, "clearAllConditions", this.clearAllConditions);
        },
        add_remove_require: function(required) {
          if (!required) {
            this.clearFields() && this.changeStateSource();
          }
          if (required && this.field_type === 'heading' || this.field_type === 'free_text_html') {
            this.changeStateSource();
          }
          if (this.model.get(Formbuilder.options.mappings.REQUIRED) && $.inArray(this.field_type, Formbuilder.options.FIELDSTYPES_CUSTOM_VALIDATION) === -1) {
            if (!this.field.add_remove_require) {
              return true;
            }
            return this.field.add_remove_require(this.model.getCid(), required);
          }
        },
        show_hide_fields: function(check_result, set_field) {
          return (function(_this) {
            return function(set_field) {
              if (_this.field.show_or_hide) {
                _this.field.show_or_hide(_this, _this.model, check_result, set_field.action);
              } else if (check_result) {
                _this.$el.addClass(set_field.action);
              } else {
                _this.$el.removeClass(set_field.action);
              }
              if (_this.field_type === 'heading') {
                $('#' + _this.model.getCid()).text(_this.model.get('label'));
              }
              if (_this.field_type === 'free_text_html') {
                _this.$('#' + _this.model.getCid()).html('');
                _this.$('#' + _this.model.getCid()).html(_this.model.get('field_options').html_data);
              }
              if (check_result && set_field.action === 'show') {
                _this.current_state = 'show';
              } else if (!check_result && set_field.action === 'hide') {
                _this.current_state = 'show';
              } else {
                _this.current_state = 'hide';
              }
              if ((check_result && set_field.action === 'show') || (!check_result && set_field.action === 'hide')) {
                return _this.add_remove_require(true);
              } else {
                return _this.add_remove_require(false);
              }
            };
          })(this)(set_field);
        },
        changeState: function() {
          var outerHeight;
          (function(_this) {
            return (function(set_field, i, and_flag, check_match_condtions, _this_model_cid, date_field_types, str_condition) {
              var _fn, _i, _len, _ref;
              if (_this.options.view_type !== 'print') {
                if (_this.model.get('field_options').match_conditions === 'and') {
                  and_flag = true;
                }
                _ref = _this.model.get("conditions");
                _fn = function(source_model, clicked_element, elem_val, condition, field_type, check_result) {
                  if (set_field.target === _this_model_cid) {
                    source_model = _this.model.collection.where({
                      cid: set_field.source
                    })[0];
                    clicked_element = $("." + source_model.getCid());
                    field_type = source_model.get('field_type');
                    if (date_field_types.indexOf(field_type) !== -1) {
                      str_condition = true;
                    }
                    if (set_field.condition === "equals") {
                      condition = _this.parentView.checkEquals;
                      if (str_condition) {
                        condition = '==';
                      }
                    } else if (set_field.condition === "less than") {
                      condition = _this.parentView.checkLessThan;
                      if (str_condition) {
                        condition = '<';
                      }
                    } else if (set_field.condition === "greater than") {
                      condition = _this.parentView.checkGreaterThan;
                      if (str_condition) {
                        condition = '>';
                      }
                    } else {
                      condition = _this.parentView.checkNotEqual;
                      if (str_condition) {
                        condition = '!=';
                      }
                    }
                    check_result = _this.evalCondition(clicked_element, source_model, condition, set_field.value);
                    return check_match_condtions.push(check_result);
                  }
                };
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  set_field = _ref[_i];
                  _fn({}, [], {}, "equals", '', false);
                }
                if ((and_flag && check_match_condtions.indexOf(false) === -1) || (!and_flag && check_match_condtions.indexOf(true) !== -1)) {
                  return _this.show_hide_fields(true, set_field);
                } else {
                  return _this.show_hide_fields(false, set_field);
                }
              }
            });
          })(this)({}, 0, false, new Array(), this.model.getCid(), ['date', 'time', 'date_of_birth', 'date_time'], false);
          outerHeight = 0;
          $(".fb-tab.step.active .fb-field-wrapper:visible").each(function() {
            return outerHeight += $(this).height();
          });
          $('.easyWizardButtons.step').css('position', 'static');
          $('.easyWizardButtons.step').css('top', outerHeight);
          $('.easyWizardButtons.step').css('width', $('.easyPager').width() - 20);
          return this;
        },
        evalCondition: function(clicked_element, source_model, condition, value) {
          return (function(_this) {
            return function(field_type, field, check_result) {
              field = Formbuilder.fields[field_type];
              if (!field.evalCondition) {
                return true;
              }
              check_result = field.evalCondition(clicked_element, source_model.getCid(), condition, value, field);
              return check_result;
            };
          })(this)(source_model.get(Formbuilder.options.mappings.FIELD_TYPE), '', 'false');
        },
        clearFields: function() {
          if (!this.field.clearFields) {
            return true;
          }
          return this.field.clearFields(this.$el, this.model);
        },
        changeStateSource: function(ev) {
          return this.trigger('change_state');
        },
        isValid: function() {
          return (function(_this) {
            return function(input_els) {
              if (!_this.field.isValid && input_els.length > 0) {
                return input_els[0].validity.valid;
              } else if (!_this.field.isValid) {
                return true;
              }
              return _this.field.isValid(_this.$el, _this.model);
            };
          })(this)(this.$el.find('input, textarea, select'));
        },
        render: function() {
          if (this.options.live) {
            return this.live_render();
          } else {
            return this.builder_render();
          }
        },
        builder_render: function() {
          (function(cid, that) {
            that.$el.addClass('response-field-' + that.model.get(Formbuilder.options.mappings.FIELD_TYPE)).data('cid', cid).html(Formbuilder.templates["view/base" + (!that.model.is_input() ? '_non_input' : '')]({
              rf: that.model,
              opts: that.options
            }));
            return (function(x, count) {
              var _i, _len, _ref, _results;
              _ref = that.$("input, textarea, select, .canvas_img");
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                x = _ref[_i];
                if ((function(attr) {
                  return attr !== 'radio' && attr !== 'checkbox';
                })($(x).attr('type'))) {
                  count = count + 1;
                }
                _results.push($(x).attr("name", cid.toString() + "_" + count.toString()));
              }
              return _results;
            })(null, 0);
          })(this.model.getCid(), this);
          return this;
        },
        live_render: function() {
          var base_templ_suff;
          base_templ_suff = this.options.view_type === 'print' ? '_print' : '';
          (function(_this) {
            return (function(set_field, i, action, cid, base_templ_suff, set_field_class) {
              var condition_hash, _fn, _i, _j, _len, _len1, _ref, _ref1;
              if (_this.model.attributes.conditions) {
                _ref = _this.model.get('conditions');
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  set_field = _ref[_i];
                  if (set_field.action === 'show' && _this.model.getCid() === set_field.target) {
                    set_field_class = true;
                  }
                }
              }
              if (set_field_class) {
                _this.$el.addClass("hide");
              }
              if (!_this.is_section_break && _this.model.attributes.conditions) {
                _ref1 = _this.model.get("conditions");
                _fn = function(condition_hash) {
                  var views_name, _k, _len2, _ref2, _results;
                  if (condition_hash.target === _this.model.getCid()) {
                    _ref2 = _this.parentView.fieldViews;
                    _results = [];
                    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                      views_name = _ref2[_k];
                      _results.push((function(views_name, condition_hash) {
                        if (views_name.model.get('cid') === condition_hash.source) {
                          return _this.listenTo(views_name, 'change_state', _this.changeState);
                        }
                      })(views_name, condition_hash));
                    }
                    return _results;
                  }
                };
                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                  condition_hash = _ref1[_j];
                  _fn(condition_hash);
                }
              }
              if (!_this.is_section_break) {
                if (_this.model.get("field_options").state === "readonly") {
                  _this.$el.addClass('readonly');
                }
                _this.$el.addClass('response-field-' + _this.field_type + ' ' + _this.model.getCid()).data('cid', cid).html(Formbuilder.templates["view/base" + base_templ_suff]({
                  rf: _this.model,
                  opts: _this.options
                }));
                return (function(x, count, should_incr) {
                  var _k, _len2, _ref2, _results;
                  _ref2 = _this.$("input, textarea, select, .canvas_img, a");
                  _results = [];
                  for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                    x = _ref2[_k];
                    _results.push(count = (function(x, index, name, val) {
                      name = cid.toString() + "_" + index.toString();
                      $(x).attr("name", name);
                      if (_this.model.get(Formbuilder.options.mappings.REQUIRED) && $.inArray(_this.field_type, Formbuilder.options.FIELDSTYPES_CUSTOM_VALIDATION) === -1) {
                        $(x).attr("required", true);
                      }
                      return index;
                    })(x, count + (should_incr($(x).attr('type')) ? 1 : 0), null, null));
                  }
                  return _results;
                })(null, 0, function(attr) {
                  return attr !== 'radio';
                });
              } else if (_this.is_section_break && _this.options.view_type === 'print') {
                if (_this.model.get("field_options").state === "readonly") {
                  _this.$el.addClass('readonly');
                }
                return _this.$el.addClass('response-field-' + _this.field_type + ' ' + _this.model.getCid()).data('cid', cid).html(Formbuilder.templates["view/base" + base_templ_suff]({
                  rf: _this.model,
                  opts: _this.options
                }));
              }
            });
          })(this)({}, 0, "show", this.model.getCid(), base_templ_suff + (this.model.is_input() ? '' : '_non_input'), false);
          return this;
        },
        focusEditView: function() {
          if (!this.options.live) {
            this.parentView.createAndShowEditView(this.model);
            return this.parentView.setSortable();
          }
        },
        clear: function() {
          return (function(index, that) {
            that.parentView.handleFormUpdate();
            index = that.parentView.collection.models.indexOf(that.model);
            if (that.model.get('field_type') === 'section_break') {
              that.updateFieldsInSectionBreak(index, that.parentView.collection.models);
            }
            index = that.parentView.fieldViews.indexOf(_.where(that.parentView.fieldViews, {
              cid: that.cid
            })[0]);
            if (index > -1) {
              that.parentView.fieldViews.splice(index, 1);
            }
            that.clearConditions(that.model.getCid(), that.parentView.fieldViews);
            return that.model.destroy();
          })(0, this);
        },
        updateFieldsInSectionBreak: function(index, models) {
          return (function(section_id, is_recur) {
            var i, _i, _j, _ref, _ref1, _ref2, _results;
            for (i = _i = _ref = index - 1; _ref <= -1 ? _i < -1 : _i > -1; i = _ref <= -1 ? ++_i : --_i) {
              if (models[i]) {
                if (models[i].get('field_type') === 'section_break') {
                  is_recur = models[i].get('field_options').recurring_section;
                  section_id = models[i].get('unique_id');
                  break;
                }
              }
            }
            _results = [];
            for (i = _j = _ref1 = index + 1, _ref2 = models.length; _ref1 <= _ref2 ? _j < _ref2 : _j > _ref2; i = _ref1 <= _ref2 ? ++_j : --_j) {
              if (models[i]) {
                if (models[i].get('field_type') === 'section_break') {
                  break;
                }
                _results.push((function(unique_section_id) {
                  if (models[i].get('section_id') === unique_section_id) {
                    if (is_recur) {
                      models[i].set('i_am_in_recurring_section', is_recur);
                    } else {
                      models[i].unset('i_am_in_recurring_section');
                    }
                    if (section_id) {
                      return models[i].set('section_id', section_id);
                    } else {
                      return models[i].unset('section_id');
                    }
                  }
                })(models[index].get('unique_id')));
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          })(void 0, void 0);
        },
        clearAllConditions: function() {
          return (function(index, that) {
            return that.clearConditions(that.model.getCid(), that.parentView.fieldViews);
          })(0, this);
        },
        clearConditions: function(cid, fieldViews) {
          return _.each(fieldViews, function(fieldView) {
            return (function(_this) {
              return function(updated_conditions) {
                if (!_.isEmpty(fieldView.model.attributes.conditions)) {
                  updated_conditions = _.reject(fieldView.model.attributes.conditions, function(condition) {
                    return _.isEqual(condition.source, cid);
                  });
                  fieldView.model.attributes.conditions = [];
                  return fieldView.model.attributes.conditions = updated_conditions;
                }
              };
            })(this)({});
          });
        },
        duplicate: function() {
          var attrs, condition, _i, _len, _ref;
          attrs = jQuery.extend(true, {}, this.model.attributes);
          delete attrs['id'];
          attrs['label'] += ' Copy';
          _ref = attrs['conditions'];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            condition = _ref[_i];
            if (condition.target === this.model.getCid()) {
              condition.target = '';
            }
          }
          return this.parentView.createField(attrs, {
            position: this.model.indexInDOM() + 1
          });
        }
      }),
      edit_field: Backbone.View.extend({
        className: "edit-response-field",
        events: {
          'click .js-add-option': 'addOption',
          'click .js-add-condition': 'addCondition',
          'click .js-remove-condition': 'removeCondition',
          'click .js-remove-option': 'removeOption',
          'click .js-default-updated': 'defaultUpdated',
          'input .option-label-input': 'forceRender'
        },
        top_subset_collection: function(cid, collection) {
          return (function(json_collection, arr_till_this_model) {
            var field, index, _i, _len;
            for (index = _i = 0, _len = json_collection.length; _i < _len; index = ++_i) {
              field = json_collection[index];
              if (field.cid === cid) {
                return arr_till_this_model.reverse();
              } else {
                arr_till_this_model.push(field);
              }
            }
          })(collection.toJSON(), []);
        },
        initialize: function() {
          this.field_type = this.model.get(Formbuilder.options.mappings.FIELD_TYPE);
          this.field = Formbuilder.fields[this.field_type];
          if (this.field_type === 'section_break') {
            this.model.off("change:field_options.recurring_section");
            this.model.on("change:field_options.recurring_section", this.recurring_status_modified, this);
            if (!this.model.get('unique_id')) {
              (function(latest_id, current_model, that) {
                return current_model.set("unique_id", latest_id);
              })(Formbuilder.latest_section_id++, this.model, this);
            }
          } else {
            (function(current_model, target_arr) {
              var field, _i, _len, _results;
              _results = [];
              for (_i = 0, _len = target_arr.length; _i < _len; _i++) {
                field = target_arr[_i];
                if (field.field_type === 'section_break') {
                  current_model.set("section_id", field.unique_id);
                  (function(options) {
                    if (options.recurring_section) {
                      return current_model.set("i_am_in_recurring_section", true);
                    }
                  })(field.field_options);
                  break;
                } else {
                  _results.push(void 0);
                }
              }
              return _results;
            })(this.model, this.top_subset_collection(this.model.getCid(), this.options.parentView.collection.sort()));
          }
          return this.listenTo(this.model, "destroy", this.remove);
        },
        recurring_status_modified: function(model, value) {
          return (function(target_arr, unique_section_id) {
            return (function(target_arr) {
              var field, _i, _len, _results;
              _results = [];
              for (_i = 0, _len = target_arr.length; _i < _len; _i++) {
                field = target_arr[_i];
                if (field.get('section_id') === unique_section_id) {
                  field.set('i_am_in_recurring_section', value);
                  _results.push(field.set('conditions', []));
                } else {
                  _results.push(void 0);
                }
              }
              return _results;
            })(target_arr.models);
          })(this.options.parentView.collection.sort(), model.get('unique_id'));
        },
        render: function() {
          this.$el.html(Formbuilder.templates["edit/base" + (!this.model.is_input() ? '_non_input' : '')]({
            rf: this.model,
            opts: this.options,
            custom_conditions: _.isUndefined(this.field.custom_conditions) ? false : this.field.custom_conditions
          }));
          rivets.bind(this.$el, {
            model: this.model
          });
          return this;
        },
        remove: function() {
          this.options.parentView.editView = void 0;
          this.options.parentView.$el.find("[href=\"#addField\"]").click();
          return Backbone.View.prototype.remove.call(this);
        },
        addOption: function(e) {
          var $el, i, newOption, options;
          $el = $(e.currentTarget);
          i = this.$el.find('.option').index($el.closest('.option'));
          options = this.model.get(Formbuilder.options.mappings.OPTIONS) || [];
          newOption = {
            label: "",
            checked: false
          };
          if (i > -1) {
            options.splice(i + 1, 0, newOption);
          } else {
            options.push(newOption);
          }
          this.model.set(Formbuilder.options.mappings.OPTIONS, options);
          this.model.trigger("change:" + Formbuilder.options.mappings.OPTIONS);
          return this.forceRender();
        },
        addCondition: function(e) {
          var $el, conditions, i, newCondition;
          $el = $(e.currentTarget);
          i = this.$el.find('.condition').index($el.closest('.condition'));
          conditions = this.model.get('conditions') || [];
          newCondition = {
            source: "",
            condition: "",
            value: "",
            action: "",
            target: "",
            isSource: true
          };
          if (i > -1) {
            conditions.splice(i + 1, 0, newCondition);
          } else {
            conditions.push(newCondition);
          }
          this.model.set('conditions', conditions);
          return this.model.trigger('change:conditions');
        },
        removeOption: function(e) {
          var $el, index, options;
          $el = $(e.currentTarget);
          index = this.$el.find(".js-remove-option").index($el);
          options = this.model.get(Formbuilder.options.mappings.OPTIONS);
          options.splice(index, 1);
          this.model.set(Formbuilder.options.mappings.OPTIONS, options);
          this.model.trigger("change:" + Formbuilder.options.mappings.OPTIONS);
          return this.forceRender();
        },
        removeCondition: function(e) {
          var $el, conditions, index;
          $el = $(e.currentTarget);
          index = this.$el.find(".js-remove-option").index($el);
          conditions = this.model.get('conditions');
          conditions.splice(index, 1);
          this.model.set('conditions', conditions);
          this.model.trigger("change:conditions");
          return this.forceRender();
        },
        defaultUpdated: function(e) {
          var $el;
          $el = $(e.currentTarget);
          if (this.model.get(Formbuilder.options.mappings.FIELD_TYPE) !== 'checkboxes') {
            this.$el.find(".js-default-updated").not($el).attr('checked', false).trigger('change');
          }
          return this.forceRender();
        },
        forceRender: function() {
          return this.model.trigger('change');
        }
      }),
      main: Backbone.View.extend({
        SUBVIEWS: [],
        events: {
          'click .js-save-form': 'saveForm',
          'click .fb-tabs a': 'showTab',
          'click .fb-add-field-types a': 'addField',
          'mousedown .fb-add-field-types a': 'enableSortable'
        },
        get_appripriate_setup_method: function(field_view) {
          return (function(method) {
            if (field_view.field && (field_view.field.android_setup || field_view.field.ios_setup || field_view.field.setup)) {
              if (Formbuilder.isAndroid() && field_view.field.android_setup) {
                method = field_view.field.android_setup;
              } else if (Formbuilder.isIos() && field_view.field.ios_setup) {
                method = field_view.field.ios_setup;
              } else {
                method = field_view.field.setup;
              }
            }
            return method;
          })(null);
        },
        setup_new_page: function(section_st_index, section_end_index, view_index) {
          var _results;
          _results = [];
          while (section_st_index <= section_end_index) {
            (function(that, method, fv, all_field_vals) {
              if (_.contains(_.keys(Formbuilder.nonInputFields), fv.model.get('field_type'))) {
                return;
              }
              _.extend(all_field_vals, fv.model.get('field_values'));
              if (fv.field.clearFields) {
                fv.field.clearFields(fv.$el, fv.model);
              } else {
                that.default_clear_fields(fv);
              }
              method = that.get_appripriate_setup_method(fv);
              fv.model.set({
                'new_page': true,
                'view_index': view_index
              }, {
                silent: true
              });
              if (method) {
                fv.model.unset('field_values', {
                  silent: true
                });
                method.call(fv.field, fv, fv.model);
                fv.model.unset('new_page', {
                  silent: true
                });
                fv.trigger('change_state');
                return fv.model.set({
                  'field_values': all_field_vals
                }, {
                  silent: true
                });
              } else {
                return fv.trigger('change_state');
              }
            })(this, null, this.fieldViews[section_st_index], {});
            _results.push(section_st_index++);
          }
          return _results;
        },
        load_values_for_index: function(section_st_index, section_end_index, load_index) {
          var _results;
          _results = [];
          while (section_st_index <= section_end_index) {
            (function(that, fv) {
              if (_.contains(_.keys(Formbuilder.nonInputFields), fv.model.get('field_type'))) {
                return;
              }
              return (function(all_field_vals, req_field_vals, method) {
                fv.model.set({
                  'view_index': load_index
                }, {
                  silent: true
                });
                if (method) {
                  fv.model.attributes.field_values = req_field_vals;
                  method.call(fv.field, fv, fv.model);
                  return fv.model.attributes.field_values = all_field_vals;
                } else {
                  return that.default_setup(fv, fv.model.attributes.field_values[load_index]);
                }
              })(fv.model.attributes.field_values, fv.model.attributes.field_values[load_index], that.get_appripriate_setup_method(fv));
            })(this, this.fieldViews[section_st_index]);
            _results.push(section_st_index++);
          }
          return _results;
        },
        save_field_values_at_index: function(section_st_index, section_end_index, save_at_index, invalid_fields) {
          if (invalid_fields == null) {
            invalid_fields = [];
          }
          while (section_st_index <= section_end_index) {
            (function(fv, is_field_valid) {
              if (_.contains(_.keys(Formbuilder.nonInputFields), fv.model.get('field_type'))) {
                return;
              }
              if (fv.field.isValid && fv.current_state === 'show') {
                if (!fv.field.isValid(fv.$el, fv.model)) {
                  is_field_valid = false;
                }
              } else {
                if (fv.$el.find('input, textarea, select').length > 0) {
                  if (!fv.$el.find('input, textarea, select')[0].validity.valid) {
                    is_field_valid = false;
                  }
                }
              }
              if (!is_field_valid) {
                invalid_fields.push(fv);
                (function(el, err_field_types) {
                  el.find('input').css('border-color', 'red');
                  el.find('textarea').css('border-color', 'red');
                  el.find('.hasDatepicker').css('border-color', 'red');
                  if (err_field_types.indexOf(fv.field_type) !== -1) {
                    return el.find('label > span').css('color', 'red');
                  }
                })(fv.$el, ['checkboxes', 'esignature', 'gmap', 'radio', 'scale_rating', 'take_pic_video_audio']);
              } else {
                (function(el, err_field_types) {
                  el.find('input').css('border-color', '#CCCCCC');
                  el.find('textarea').css('border-color', '#CCCCCC');
                  el.find('.hasDatepicker').css('border-color', '#CCCCCC');
                  el.find('.bootstrap-filestyle label').css('border-color', 'rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25)');
                  el.find('.bootstrap-filestyle label').css('border-bottom-color', '#b3b3b3');
                  return el.find('label > span').css('color', '#333');
                })(fv.$el, ['checkboxes', 'esignature', 'gmap', 'radio', 'scale_rating', 'take_pic_video_audio']);
              }
              return (function(serialized_values, fl_val_hash, computed_obj) {
                fv.model.set({
                  'view_index': save_at_index
                }, {
                  silent: true
                });
                if (fv.field.fieldToValue) {
                  computed_obj = fv.field.fieldToValue(fv.$el, fv.model);
                } else {
                  serialized_values = fv.$el.find('input, textarea, select, .canvas_img, a').serializeArray();
                  _.each(serialized_values, function(val) {
                    return computed_obj[val.name] = val.value;
                  });
                }
                fl_val_hash[save_at_index] = computed_obj;
                return fv.model.attributes.field_values = fl_val_hash;
              })({}, fv.model.attributes.field_values || {}, {});
            })(this.fieldViews[section_st_index], true);
            section_st_index++;
          }
          return invalid_fields;
        },
        checkValidityOfDiv: function(div) {
          return fv.$el.find('input, textarea, select').validity.valid;
        },
        default_clear_fields: function(fieldView) {
          return fieldView.$el.find('input, textarea, select, .canvas_img, a').val("");
        },
        default_setup: function(fieldView, field_values) {
          return _.each(field_values, function(val, key) {
            return fieldView.$el.find("[name=" + key + "]").val(val);
          });
        },
        initialize: function() {
          var _base;
          this.$el = $(this.options.selector);
          this.formBuilder = this.options.formBuilder;
          this.fieldViews = [];
          this.formConditionsSaved = false;
          this.collection = new Formbuilder.collection;
          this.collection.bind('add', this.addOne, this);
          this.collection.bind('reset', this.reset, this);
          this.collection.bind('change', this.handleFormUpdate, this);
          this.collection.bind('destroy add reset', this.hideShowNoResponseFields, this);
          this.collection.bind('destroy', this.ensureEditViewScrolled, this);
          if (!this.options.live) {
            this.options.readonly = true;
          }
          (_base = this.options).showSubmit || (_base.showSubmit = false);
          Formbuilder.options.COMPANY_HIERARCHY = this.options.company_hierarchy;
          if (!_.isUndefined(this.options.field_configs.fieldtype_custom_validation)) {
            Formbuilder.options.FIELDSTYPES_CUSTOM_VALIDATION = Formbuilder.options.FIELDSTYPES_CUSTOM_VALIDATION.concat(this.options.field_configs.fieldtype_custom_validation);
          }
          Formbuilder.options.FIELD_CONFIGS = this.options.field_configs;
          Formbuilder.options.EXTERNAL_FIELDS = $.extend({}, this.options.external_fields);
          Formbuilder.options.EXTERNAL_FIELDS_TYPES = [];
          (function(_this) {
            return (function(reg_fields) {
              if (!_.isEmpty(Formbuilder.options.EXTERNAL_FIELDS)) {
                _.each(reg_fields, function(fl_opts, fl_name) {
                  Formbuilder.registerField(fl_name, fl_opts);
                  return Formbuilder.options.EXTERNAL_FIELDS_TYPES.push(fl_name);
                });
              }
            });
          })(this)(Formbuilder.options.EXTERNAL_FIELDS);
          if (!_.isEmpty(this.options.print_ext_fields_as_single_row)) {
            Array.prototype.push.apply(Formbuilder.options.PRINT_FIELDS_AS_SINGLE_ROW, this.options.print_ext_fields_as_single_row);
            console.log(Formbuilder.options.PRINT_FIELDS_AS_SINGLE_ROW);
          }
          Formbuilder.options.FILE_UPLOAD_URL = this.options.file_upload_url;
          Formbuilder.options.ESIGNATURE_UPLOAD_URL = this.options.esignature_upload_url;
          if (!_.isEmpty(this.options.esignature_upload_data)) {
            Formbuilder.options.ESIGNATURE_UPLOAD_DATA = this.options.esignature_upload_data;
          }
          if (!(_.isUndefined(this.options.show_admin_only) && !this.options.show_admin_only)) {
            Formbuilder.options.SHOW_ADMIN_ONLY = this.options.show_admin_only;
          }
          Formbuilder.options.EDIT_FS_MODEL = this.options.edit_fs_model;
          if (this.options.print_view) {
            Formbuilder.options.PRINTVIEW = this.options.print_view;
          }
          this.render();
          this.collection.reset(this.options.bootstrapData);
          this.saveFormButton = this.$el.find(".js-save-form");
          this.saveFormButton.attr('disabled', true).text(Formbuilder.options.dict.ALL_CHANGES_SAVED);
          if (this.options.autoSave) {
            this.initAutosave();
          }
          Formbuilder.options.CKEDITOR_CONFIG = this.options.ckeditor_config;
          if (!_.isUndefined(this.options.hierarchy_selector_view)) {
            return Formbuilder.options.HIERARCHYSELECTORVIEW = this.options.hierarchy_selector_view;
          }
        },
        getCurrentView: function() {
          var current_view_state, fieldView;
          current_view_state = (function() {
            var _i, _len, _ref, _results;
            _ref = this.fieldViews;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              fieldView = _ref[_i];
              if (fieldView.current_state === 'show') {
                _results.push(fieldView.model.get('cid'));
              }
            }
            return _results;
          }).call(this);
          return current_view_state;
        },
        initAutosave: function() {
          this.formSaved = true;
          setInterval((function(_this) {
            return function() {
              return _this.saveForm.call(_this);
            };
          })(this), 5000);
          return $(window).bind('beforeunload', (function(_this) {
            return function() {
              if (_this.formSaved) {
                return void 0;
              } else {
                return Formbuilder.options.dict.UNSAVED_CHANGES;
              }
            };
          })(this));
        },
        reset: function() {
          this.$responseFields.html('');
          return this.addAll();
        },
        checkEquals: function(val1, val2) {
          return val1 === val2;
        },
        checkLessThan: function(val1, val2) {
          return val1 < val2;
        },
        checkGreaterThan: function(val1, val2) {
          return val1 > val2;
        },
        checkNotEqual: function(val1, val2) {
          return val1 !== val2;
        },
        render: function() {
          var subview, _i, _len, _ref;
          if (!this.options.alt_parents) {
            this.$el.html(Formbuilder.templates['page']({
              opts: this.options
            }));
            this.$fbLeft = this.$el.find('.fb-left');
            this.$responseFields = this.$el.find('.fb-response-fields');
          } else {
            if (!this.options.live) {
              $(this.options.alt_parents['fb_save']).html(Formbuilder.templates['partials/save_button']());
              $(this.options.alt_parents['fb_left']).html(Formbuilder.templates['partials/left_side']());
              this.$fbLeft = this.options.alt_parents['fb_left'].find('.fb-left');
            }
            $(this.options.alt_parents['fb_right']).html(Formbuilder.templates['partials/right_side']({
              opts: this.options
            }));
            this.$responseFields = this.options.alt_parents['fb_right'].find('.fb-response-fields');
          }
          this.bindWindowScrollEvent();
          this.hideShowNoResponseFields();
          _ref = this.SUBVIEWS;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            subview = _ref[_i];
            new subview({
              parentView: this
            }).render();
          }
          return this;
        },
        bindWindowScrollEvent: function() {
          return $(window).on('scroll', (function(_this) {
            return function() {
              var maxMargin, newMargin;
              if (_this.$fbLeft.data('locked') === true) {
                return;
              }
              newMargin = Math.max(0, $(window).scrollTop());
              maxMargin = _this.$responseFields.height();
              return _this.$fbLeft.css({
                'margin-top': Math.min(maxMargin, newMargin)
              });
            };
          })(this));
        },
        showTab: function(e) {
          var $el, first_model, target;
          $el = $(e.currentTarget);
          target = $el.data('target');
          $el.closest('li').addClass('active').siblings('li').removeClass('active');
          $(target).addClass('active').siblings('.fb-tab-pane').removeClass('active');
          if (target !== '#editField') {
            this.unlockLeftWrapper();
          }
          if (target === '#editField' && !this.editView && (first_model = this.collection.models[0])) {
            return this.createAndShowEditView(first_model);
          }
        },
        addOne: function(responseField, _, options) {
          var $replacePosition, view;
          view = new Formbuilder.views.view_field({
            model: responseField,
            parentView: this,
            live: this.options.live,
            readonly: this.options.readonly,
            view_type: this.options.view_type,
            tagName: Formbuilder.baseConfig[this.options.view_type] ? Formbuilder.baseConfig[this.options.view_type].fieldTagName : 'div',
            className: Formbuilder.baseConfig[this.options.view_type] ? Formbuilder.baseConfig[this.options.view_type].fieldClassName : 'fb-field-wrapper',
            seedData: responseField.seedData
          });
          this.fieldViews.push(view);
          if (!this.options.live) {
            if (options.$replaceEl != null) {
              return options.$replaceEl.replaceWith(view.render().el);
            } else if ((options.position == null) || options.position === -1) {
              return this.$responseFields.append(view.render().el);
            } else if (options.position === 0) {
              return this.$responseFields.prepend(view.render().el);
            } else if (($replacePosition = this.$responseFields.find(".fb-field-wrapper").eq(options.position))[0]) {
              return $replacePosition.before(view.render().el);
            } else {
              return this.$responseFields.append(view.render().el);
            }
          }
        },
        setSortable: function() {
          if (this.$responseFields.hasClass('ui-sortable')) {
            this.$responseFields.sortable('destroy');
          }
          return this.$responseFields.sortable({
            forcePlaceholderSize: true,
            placeholder: 'sortable-placeholder',
            stop: (function(_this) {
              return function(e, ui) {
                var rf;
                if (ui.item.data('field-type')) {
                  rf = _this.collection.create(Formbuilder.helpers.defaultFieldAttrs(ui.item.data('field-type')), {
                    $replaceEl: ui.item
                  });
                  _this.createAndShowEditView(rf);
                }
                $('.form-builder-left-container ').css('overflow', 'auto');
                _this.collection.sort();
                (function(that, current_model, index, models, is_recur, section_id, clear_conditions_for_models) {
                  var i, _i, _j, _k, _l, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
                  if (current_model.get('field_type') === 'section_break') {
                    is_recur = current_model.get('field_options').recurring_section;
                    section_id = current_model.get('unique_id');
                    for (i = _i = _ref = index + 1, _ref1 = models.length; _ref <= _ref1 ? _i < _ref1 : _i > _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
                      if (models[i]) {
                        if (models[i].get('field_type') === 'section_break') {
                          break;
                        }
                        if (is_recur) {
                          models[i].set({
                            'i_am_in_recurring_section': 'i_am_in_recurring_section',
                            is_recur: is_recur
                          }, {
                            silent: true
                          });
                        }
                        if (section_id) {
                          models[i].set({
                            'section_id': 'section_id',
                            section_id: section_id
                          }, {
                            silent: true
                          });
                        }
                        if (is_recur || section_id) {
                          clear_conditions_for_models.push(models[i]);
                        }
                      }
                    }
                    is_recur = void 0;
                    section_id = void 0;
                    for (i = _j = _ref2 = index - 1; _ref2 <= -1 ? _j < -1 : _j > -1; i = _ref2 <= -1 ? ++_j : --_j) {
                      if (models[i]) {
                        if (models[i].get('field_type') === 'section_break') {
                          is_recur = models[i].get('field_options').recurring_section;
                          section_id = models[i].get('unique_id');
                          break;
                        }
                      }
                    }
                    for (i = _k = _ref3 = index - 1; _ref3 <= -1 ? _k < -1 : _k > -1; i = _ref3 <= -1 ? ++_k : --_k) {
                      if (models[i]) {
                        if (models[i].get('field_type') === 'section_break') {
                          break;
                        }
                        if (is_recur) {
                          models[i].set({
                            'i_am_in_recurring_section': 'i_am_in_recurring_section',
                            is_recur: is_recur
                          }, {
                            silent: true
                          });
                        } else {
                          models[i].unset('i_am_in_recurring_section', {
                            silent: true
                          });
                        }
                        if (section_id) {
                          models[i].set({
                            'section_id': 'section_id',
                            section_id: section_id
                          }, {
                            silent: true
                          });
                        } else {
                          models[i].unset('section_id', {
                            silent: true
                          });
                        }
                        if (is_recur || section_id) {
                          clear_conditions_for_models.push(models[i]);
                        }
                      }
                    }
                  } else {
                    for (i = _l = _ref4 = index - 1; _ref4 <= -1 ? _l < -1 : _l > -1; i = _ref4 <= -1 ? ++_l : --_l) {
                      if (models[i]) {
                        if (models[i].get('field_type') === 'section_break') {
                          is_recur = models[i].get('field_options').recurring_section;
                          section_id = models[i].get('unique_id');
                          break;
                        }
                      }
                    }
                    if (is_recur) {
                      current_model.set({
                        'i_am_in_recurring_section': 'i_am_in_recurring_section',
                        is_recur: is_recur
                      }, {
                        silent: true
                      });
                    } else {
                      current_model.unset('i_am_in_recurring_section', {
                        silent: true
                      });
                    }
                    if (section_id) {
                      current_model.set({
                        'section_id': 'section_id',
                        section_id: section_id
                      }, {
                        silent: true
                      });
                    } else {
                      current_model.unset('section_id', {
                        silent: true
                      });
                    }
                  }
                  for (i = _m = 0, _ref5 = clear_conditions_for_models.length; 0 <= _ref5 ? _m < _ref5 : _m > _ref5; i = 0 <= _ref5 ? ++_m : --_m) {
                    clear_conditions_for_models[i].trigger("clearAllConditions");
                    clear_conditions_for_models[i].attributes.conditions = [];
                  }
                  current_model.trigger("clearAllConditions");
                  current_model.attributes.conditions = [];
                  that.editView.remove();
                  return that.createAndShowEditView(current_model);
                })(_this, _this.collection.models[ui.item.index()], ui.item.index(), _this.collection.models, void 0, void 0, []);
                _this.handleFormUpdate();
                _this.removeSortable();
                return true;
              };
            })(this),
            update: (function(_this) {
              return function(e, ui) {
                if (!ui.item.data('field-type')) {
                  return _this.ensureEditViewScrolled();
                }
              };
            })(this)
          });
        },
        setDraggable: function() {
          var $addFieldButtons;
          $addFieldButtons = this.$el.find("[data-field-type]");
          return $addFieldButtons.draggable({
            connectToSortable: this.$responseFields,
            helper: (function(_this) {
              return function() {
                var $helper;
                $helper = $("<div class='response-field-draggable-helper' />");
                $helper.css({
                  width: _this.$responseFields.width(),
                  height: '80px'
                });
                $('.form-builder-left-container ').css('overflow', 'inherit');
                return $helper;
              };
            })(this),
            stop: (function(_this) {
              return function() {
                return $('.form-builder-left-container ').css('overflow', 'auto');
              };
            })(this)
          });
        },
        applyEasyWizard: function() {
          var setSectionProps;
          setSectionProps = function(obj_view, cnt, back_visibility) {
            return (function(_this) {
              return function($obj_view_el) {
                $obj_view_el.attr({
                  'data-step': cnt,
                  'show-back': back_visibility,
                  'data-step-title': "step" + cnt
                });
                $obj_view_el.addClass('step');
                if (cnt === 1) {
                  return $obj_view_el.addClass('active');
                }
              };
            })(this)(obj_view.$el);
          };
          (function(_this) {
            return (function(field_view, fieldViews, add_break_to_next, recurring_section, total_responses_for_this_section, wizard_step, sb_field, wiz_cnt, prev_btn_text, next_btn_text, showSubmit, sub_frag, _that) {
              var back_visibility, fd_views, field_index, section_break_field_model, _i, _len;
              wizard_step = new Formbuilder.views.wizard_tab({
                parentView: _this,
                tagName: Formbuilder.baseConfig[_this.options.view_type] ? Formbuilder.baseConfig[_this.options.view_type].wizardTagName : 'div',
                className: Formbuilder.baseConfig[_this.options.view_type] ? Formbuilder.baseConfig[_this.options.view_type].wizardClassName : 'fb-tab',
                view_type: _this.options.view_type,
                index: wiz_cnt,
                back_visibility: back_visibility
              });
              for (field_index = _i = 0, _len = fieldViews.length; _i < _len; field_index = ++_i) {
                field_view = fieldViews[field_index];
                if (!field_view.is_section_break) {
                  field_view.$el.attr('data-step-id', wiz_cnt);
                }
                if (field_view.is_section_break && _this.options.view_type !== 'print') {
                  back_visibility = field_view.model.get(Formbuilder.options.mappings.BACK_VISIBLITY);
                  prev_btn_text = field_view.model.get(Formbuilder.options.mappings.PREV_BUTTON_TEXT);
                  next_btn_text = field_view.model.get(Formbuilder.options.mappings.NEXT_BUTTON_TEXT);
                  add_break_to_next = true;
                  recurring_section = field_view.model.get('field_options').recurring_section;
                  if (field_view.model.get('field_values') && field_view.model.get('field_values')['response_count']) {
                    total_responses_for_this_section = field_view.model.get('field_values')['response_count'];
                  }
                  field_view.model.set('response_cnt', total_responses_for_this_section);
                  section_break_field_model = field_view.model;
                }
                if (add_break_to_next && !field_view.is_section_break && _this.options.view_type !== 'print') {
                  _this.$responseFields.append(wizard_step.make_live(field_index - 2));
                  wiz_cnt += 1;
                  field_view.model.set('in_recursive', true);
                  wizard_step = new Formbuilder.views.wizard_tab({
                    parentView: _this,
                    view_type: _this.options.view_type,
                    index: wiz_cnt,
                    back_visibility: back_visibility,
                    recurring_section: recurring_section,
                    total_responses_for_this_section: total_responses_for_this_section || 0,
                    first_field_index: field_index,
                    section_break_field_model: section_break_field_model
                  });
                  add_break_to_next = false;
                }
                if (!add_break_to_next) {
                  if (wizard_step.recurring) {
                    field_view.model.set('i_am_in_recurring_section', true);
                  }
                  wizard_step.append_child(field_view.render().el);
                }
              }
              _this.$responseFields.append(wizard_step.make_live(fieldViews.length - 1));
              fd_views = _this.fieldViews.filter(function(fd_view) {
                return Formbuilder.options.EXTERNAL_FIELDS_TYPES.indexOf(fd_view.field_type) !== -1;
              });
              if (fd_views.length > 0) {
                _this.bindExternalFieldsEvents(fd_views);
              }
              setTimeout((function() {
                _that.triggerEvent();
              }), 5);
              return Formbuilder.make_wizard($("#formbuilder_form"), {
                prevButton: prev_btn_text,
                nextButton: next_btn_text,
                after: function(wizardObj, prevStepObj, currentStepObj) {
                  return (function(_this) {
                    return function(prev_clicked, thisSettings) {
                      if (currentStepObj.children(':visible').length === 0) {
                        $activeStep.css({
                          height: '1px'
                        });
                        if (prev_clicked = wizardObj.direction === 'prev') {
                          wizardObj.find('.easyWizardButtons.' + thisSettings.stepClassName + ' .prev').trigger('click');
                        } else {
                          wizardObj.find('.easyWizardButtons.' + thisSettings.stepClassName + ' .next').trigger('click');
                        }
                      } else {
                        if ($nextStep.attr('show-back') === 'false') {
                          wizardObj.find('.easyWizardButtons.' + thisSettings.stepClassName + ' .prev').css("display", "none");
                          wizardObj.find('.easyWizardButtons.' + thisSettings.stepClassName + ' .prev').addClass('hide');
                        } else if (currentStepObj.attr('data-step') !== '1') {
                          wizardObj.find('.easyWizardButtons.' + thisSettings.stepClassName + ' .prev').css("display", "block");
                          wizardObj.find('.easyWizardButtons.' + thisSettings.stepClassName + ' .prev').removeClass('hide');
                        }
                        $('#grid_div').scrollTop(0);
                      }
                      $("#formbuilder_form").height($('.easyWizardWrapper .active').outerHeight() + $('.easyWizardButtons').outerHeight());
                      if (parseInt($nextStep.attr('data-step')) === thisSettings.steps && showSubmit) {
                        return wizardObj.parents('.form-panel').find('.update-button').show();
                      } else {
                        return wizardObj.parents('.form-panel').find('.update-button').hide();
                      }
                    };
                  })(this)(false, wizardObj.data('settings'));
                }
              });
            });
          })(this)(null, this.fieldViews, false, false, 0, null, null, 1, 'Back', 'Next', this.options.showSubmit, document.createDocumentFragment(), this);
          return this;
        },
        triggerEvent: function() {
          return (function(_this) {
            return function(field_view, fieldViews, model) {
              var _fn, _i, _len;
              _fn = function(x, count, should_incr, val_set, model, field_type_method_call, field_method_call, method, cid) {
                var _j, _k, _len1, _len2, _ref, _ref1;
                field_type_method_call = model.get(Formbuilder.options.mappings.FIELD_TYPE);
                field_method_call = Formbuilder.fields[field_type_method_call];
                if (field_view.model.get('field_type') === 'heading' || field_view.model.get('field_type') === 'free_text_html') {
                  _ref = field_view.$("label");
                  for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                    x = _ref[_j];
                    count = (function(x, index, name, val, value) {
                      if ($(x).text() && !val_set) {
                        val_set = true;
                      }
                      return index;
                    })(x, count + (should_incr($(x).attr('type')) ? 1 : 0), null, null, 0);
                  }
                } else if (field_view.model.get('field_type') === 'file') {
                  if (model.get('field_values')) {
                    _.each(model.get('field_values')["0"], function(value, key) {
                      if (value !== "") {
                        return (function(_this) {
                          return function(a_href_val, a_text, mod_cid) {
                            if ($('#file_upload_link_' + mod_cid)) {
                              if (_.isString(value)) {
                                a_href_val = value;
                                a_text = value.split("/").pop().split("?")[0];
                              } else if (_.isObject(value) && !_.isUndefined(value.url)) {
                                a_href_val = value.url;
                                a_text = value.name;
                              } else if (_.isObject(value) && _.isObject(value[mod_cid + "_2"])) {
                                a_href_val = value[mod_cid + "_2"].url;
                                a_text = value[mod_cid + "_2"].name;
                              }
                              _this.$('#file_upload_link_' + field_view.model.getCid()).html("<div class='file_upload_link_div' id=file_upload_link_div_" + key + "><a type = 'pic_video_audio' class='active_link_doc' target='_blank' name=" + key + " href=" + a_href_val + ">" + a_text + "</a></div>");
                            }
                            return _this.$('#file_' + field_view.model.getCid()).attr("required", false);
                          };
                        })(this)('', '', field_view.model.getCid());
                      }
                    });
                  }
                } else {
                  cid = model.getCid();
                  if (field_method_call.setup) {
                    method = field_method_call.setup;
                  }
                  if (field_method_call.android_setup && Formbuilder.isAndroid()) {
                    method = field_method_call.android_setup;
                  }
                  if (field_method_call.ios_setup && Formbuilder.isIos()) {
                    method = field_method_call.ios_setup;
                  }
                  (function(all_field_values) {
                    if (all_field_values && all_field_values[0]) {
                      model.unset('field_values', {
                        silent: true
                      });
                      model.set({
                        'field_values': all_field_values[0]
                      }, {
                        silent: true
                      });
                      if (method) {
                        method.call(field_method_call, field_view, model, Formbuilder.options.EDIT_FS_MODEL);
                      } else {
                        (function(fv) {
                          return _.each(fv, function(val, key) {
                            return field_view.$el.find("[name=" + key + "]").val(val);
                          });
                        })(model.get("field_values"));
                      }
                      model.unset('field_values', {
                        silent: true
                      });
                      return model.set({
                        'field_values': all_field_values
                      }, {
                        silent: true
                      });
                    } else {
                      if (method) {
                        return method.call(field_method_call, field_view, model, Formbuilder.options.EDIT_FS_MODEL);
                      }
                    }
                  })(model.get('field_values'));
                  if (field_method_call.setValForPrint && _this.options.view_type === 'print') {
                    field_method_call.setValForPrint(field_view, model);
                  } else if (!method) {
                    _ref1 = field_view.$("input, textarea, select, .canvas_img, a");
                    for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
                      x = _ref1[_k];
                      count = (function(x, index, name, val, value, has_heading_field, has_ckeditor_field) {
                        var model_in_collection, model_in_conditions, _l, _len3, _len4, _len5, _len6, _m, _n, _o, _ref2, _ref3, _ref4, _ref5;
                        _ref2 = field_view.model.collection.where({
                          'field_type': 'heading'
                        });
                        for (_l = 0, _len3 = _ref2.length; _l < _len3; _l++) {
                          model_in_collection = _ref2[_l];
                          if (field_view.model.get('conditions')) {
                            _ref3 = field_view.model.get('conditions');
                            for (_m = 0, _len4 = _ref3.length; _m < _len4; _m++) {
                              model_in_conditions = _ref3[_m];
                              if (model_in_collection.getCid() === model_in_conditions.target) {
                                has_heading_field = true;
                              }
                            }
                          }
                        }
                        _ref4 = field_view.model.collection.where({
                          'field_type': 'free_text_html'
                        });
                        for (_n = 0, _len5 = _ref4.length; _n < _len5; _n++) {
                          model_in_collection = _ref4[_n];
                          if (field_view.model.get('conditions')) {
                            _ref5 = field_view.model.get('conditions');
                            for (_o = 0, _len6 = _ref5.length; _o < _len6; _o++) {
                              model_in_conditions = _ref5[_o];
                              if (model_in_collection.getCid() === model_in_conditions.target) {
                                has_ckeditor_field = true;
                              }
                            }
                          }
                        }
                        if (field_view.field_type === 'radio' || 'scale_rating') {
                          value = x.value;
                        }
                        name = cid.toString() + "_" + index.toString();
                        if ($(x).attr('type') === 'radio' && model.get('field_values')) {
                          val = model.get('field_values')[value];
                        } else if (model.get('field_values')) {
                          val = model.get('field_values')[name];
                        }
                        if (field_method_call.setup) {
                          field_method_call.setup($(x), model, index);
                        }
                        if (!val_set) {
                          if ($(x).val()) {
                            val_set = true;
                          }
                          if (val || has_heading_field || has_ckeditor_field) {
                            val_set = true;
                          }
                        }
                        if (val) {
                          _this.setFieldVal($(x), val, model.getCid());
                        }
                        return index;
                      })(x, count + (should_incr($(x).attr('type')) ? 1 : 0), null, null, 0, false, false);
                    }
                  }
                  if (val_set && (Formbuilder.options.EDIT_FS_MODEL || field_type_method_call === 'checkboxes' || field_type_method_call === 'radio')) {
                    field_view.trigger('change_state');
                  }
                }
                if (Formbuilder.isAndroid() && field_method_call.android_bindevents) {
                  return field_method_call.android_bindevents(field_view);
                } else if (Formbuilder.isIos() && field_method_call.ios_bindevents) {
                  return field_method_call.ios_bindevents(field_view);
                } else if (field_method_call.bindevents) {
                  return field_method_call.bindevents(field_view);
                }
              };
              for (_i = 0, _len = fieldViews.length; _i < _len; _i++) {
                field_view = fieldViews[_i];
                _fn(null, 0, function(attr) {
                  return attr !== 'radio';
                }, false, field_view.model, '', '', null, '');
              }
              return _this.formBuilder.trigger('render_complete');
            };
          })(this)(null, this.fieldViews, "");
        },
        initializeEsings: function() {
          return (function(_this) {
            return function(esigns) {
              return _.each(esigns, function(el) {
                var $esig_el, cid;
                $esig_el = $(el).find("img");
                cid = $esig_el.attr("name").split("_")[0];
                initializeCanvas(cid);
              });
            };
          })(this)(this.$el.find('.response-field-esignature'));
        },
        setFieldVal: function(elem, val, cid) {
          return (function(_this) {
            return function(setters, type) {
              setters = {
                file: function() {
                  if ($('#file_upload_link_' + cid) && val) {
                    if (_.isString(val)) {
                      $("#file_upload_link_" + cid).html("<div class='file_upload_link_div' id=file_upload_link_div_" + cid + "><a type = 'pic_video_audio' class='active_link_doc' target='_blank' name=" + cid + " href=" + val + ">" + val.split("/").pop().split("?")[0] + "</a></div>");
                    }
                    if (_.isObject(val)) {
                      return $("#file_upload_link_" + cid).html("<div class='file_upload_link_div' id=file_upload_link_div_" + cid + "><a type = 'pic_video_audio' class='active_link_doc' target='_blank' name=" + cid + " href=" + val.url + ">" + val.name + "</a></div>");
                    }
                  }
                },
                take_pic_video_audio: function() {
                  $(elem).attr("href", val);
                  if (val) {
                    return $(elem).text(val.split("/").pop().split("?")[0]);
                  }
                },
                checkbox: function() {
                  if (val) {
                    return $(elem).attr("checked", true);
                  }
                },
                radio: function() {
                  if (val) {
                    return $(elem).attr("checked", true);
                  }
                },
                "default": function() {
                  if (val) {
                    return $(elem).val(val);
                  }
                }
              };
              return (setters[type] || setters['default'])(elem, val);
            };
          })(this)(null, $(elem).attr('type'));
        },
        applyFileStyle: function() {
          return _.each(this.fieldViews, function(field_view) {
            if (field_view.model.get('field_type') === 'file') {
              if (Formbuilder.isMobile()) {
                $('#file_' + field_view.model.getCid()).attr("type", "button");
                $('#file_' + field_view.model.getCid()).attr("value", field_view.model.get(Formbuilder.options.mappings.FILE_BUTTON_TEXT) || '');
                $('#file_' + field_view.model.getCid()).addClass("file_upload btn_icon_file");
                $('#file_' + field_view.model.getCid()).removeAttr("name");
              } else {
                $('#file_' + field_view.model.getCid()).filestyle({
                  input: false,
                  buttonText: field_view.model.get(Formbuilder.options.mappings.FILE_BUTTON_TEXT) || ''
                });
              }
            }
            if (field_view.model.get('field_type') === 'address') {
              if (typeof BRIJavaScriptInterface !== 'undefined') {
                return $('#file_' + field_view.model.getCid()).bfhcountries();
              } else {
                return $('#file_' + field_view.model.getCid()).bfhcount();
              }
            }
          });
        },
        addAll: function() {
          this.collection.each(this.addOne, this);
          if (this.options.live) {
            this.applyEasyWizard();
            $('.easyWizardButtons.step .prev').addClass('hide btn-danger');
            $('.easyWizardButtons.step .next').addClass('btn-success');
            this.applyFileStyle();
            this.initializeEsings();
            return $('.readonly').find('input, textarea, select').attr('disabled', true);
          } else {
            return this.setDraggable();
          }
        },
        bindExternalFieldsEvents: function(external_field_views) {
          return _.each(external_field_views, function(external_field_view) {
            if (external_field_view.field.bindEventsNSetValues) {
              return external_field_view.field.bindEventsNSetValues(external_field_view);
            }
          });
        },
        hideShowNoResponseFields: function() {
          return this.$el.find(".fb-no-response-fields")[this.collection.length > 0 || this.options.live ? 'hide' : 'show']();
        },
        enableSortable: function() {
          return this.setSortable();
        },
        addField: function(e) {
          var field_type;
          field_type = $(e.currentTarget).data('field-type');
          return this.createField(Formbuilder.helpers.defaultFieldAttrs(field_type));
        },
        createField: function(attrs, options) {
          var rf;
          rf = this.collection.create(attrs, options);
          this.createAndShowEditView(rf);
          return this.handleFormUpdate();
        },
        createAndShowEditView: function(model) {
          var $newEditEl, $responseFieldEl, oldPadding;
          $responseFieldEl = this.$el.find(".fb-field-wrapper").filter(function() {
            return $(this).data('cid') === model.get('cid');
          });
          $responseFieldEl.addClass('editing').siblings('.fb-field-wrapper').removeClass('editing');
          if (this.editView) {
            if (this.editView.model.cid === model.cid) {
              this.$el.find(".fb-tabs a[data-target=\"#editField\"]").click();
              this.scrollLeftWrapper($responseFieldEl, (typeof oldPadding !== "undefined" && oldPadding !== null) && oldPadding);
              return;
            }
            oldPadding = this.$fbLeft.css('padding-top');
            this.editView.remove();
          }
          this.editView = new Formbuilder.views.edit_field({
            model: model,
            parentView: this
          });
          $newEditEl = this.editView.render().$el;
          this.$el.find(".fb-edit-field-wrapper").html($newEditEl);
          this.$el.find(".fb-tabs a[data-target=\"#editField\"]").click();
          this.scrollLeftWrapper($responseFieldEl);
          return this;
        },
        ensureEditViewScrolled: function() {
          if (!this.editView) {
            return;
          }
          return this.scrollLeftWrapper($(".fb-field-wrapper.editing"));
        },
        scrollLeftWrapper: function($responseFieldEl) {},
        lockLeftWrapper: function() {
          return this.$fbLeft.data('locked', true);
        },
        unlockLeftWrapper: function() {
          return this.$fbLeft.data('locked', false);
        },
        removeSortable: function() {
          if (this.$responseFields.hasClass('ui-sortable')) {
            return this.$responseFields.sortable('destroy');
          }
        },
        handleFormUpdate: function() {
          if (this.updatingBatch) {
            return;
          }
          this.formSaved = false;
          if (this.saveFormButton) {
            return this.saveFormButton.removeAttr('disabled').text(Formbuilder.options.dict.SAVE_FORM);
          }
        },
        saveForm: function(e) {
          var payload;
          if (this.formSaved) {
            return;
          }
          this.formSaved = true;
          this.saveFormButton.attr('disabled', true).text(Formbuilder.options.dict.ALL_CHANGES_SAVED);
          this.sortRemoveAddConditions();
          payload = JSON.stringify({
            fields: this.collection.toJSON()
          });
          if (Formbuilder.options.HTTP_ENDPOINT) {
            this.doAjaxSave(payload);
          }
          return this.formBuilder.trigger('save', payload);
        },
        uploadFile: function() {
          if (Formbuilder.options.FILE_UPLOAD_URL !== '') {
            console.log(Formbuilder.options.FILE_UPLOAD_URL);
            return (function(_this) {
              return function(_that, file_field_views) {
                if (!_.isEmpty(file_field_views)) {
                  $.ajaxSetup({
                    headers: {
                      "X-CSRF-Token": $("meta[name=\"csrf-token\"]").attr("content")
                    }
                  });
                  _this.$("#formbuilder_form").ajaxSubmit({
                    url: Formbuilder.options.FILE_UPLOAD_URL,
                    async: false,
                    success: function(data) {
                      if (data.errors) {
                        _that.formBuilder.trigger('fileUploadError', data.errors);
                      } else {
                        _.each(data.files, function(response) {
                          $("input[name=" + response.field_name + "]").val("");
                          if (response.upload_obj) {
                            $("input[name=" + response.field_name + "]").attr("file_url", response.upload_obj.url);
                            $("input[name=" + response.field_name + "]").attr("file_name", response.upload_obj.name);
                          }
                        });
                      }
                    }
                  });
                }
              };
            })(this)(this, this.fieldViews.filter(function(fd_view) {
              return fd_view.field_type === 'file';
            }));
          }
        },
        isBase64Data: function(str) {
          var regex4esign;
          regex4esign = /^data:image\/png;base64/;
          return regex4esign.test(str);
        },
        uploadEsignatures: function() {
          return (function(_this) {
            return function(_that, esig_field_views) {
              return _.each(esig_field_views, function(fd_view) {
                (function(_this) {
                  return (function($obj_elts) {
                    return _.each($obj_elts, function(el) {
                      if ($(el).attr('type') === 'esignature' && $(el).attr("src")) {
                        (function(_this) {
                          return (function(base64_data) {
                            if (_that.isBase64Data(base64_data) && !$(el).attr("upload_url")) {
                              _that.uploadImage(base64_data, $(el).attr('name'));
                            } else {
                              $(el).attr('uploaded_url', $(el).attr("upload_url"));
                            }
                          });
                        })(this)($("[name=" + $(el).attr('name') + ']').attr("src"));
                      }
                    });
                  });
                })(this)(_that.$("[name^=" + fd_view.model.getCid() + "_]"));
              });
            };
          })(this)(this, this.fieldViews.filter((function(_this) {
            return function(fd_view) {
              return fd_view.field_type === 'esignature';
            };
          })(this)));
        },
        uploadImage: function(base64_data, field_name) {
          return (function(_this) {
            return function(_that, esig_data, base64_data) {
              $.ajaxSetup({
                headers: {
                  "X-CSRF-Token": $("meta[name=\"csrf-token\"]").attr("content")
                }
              });
              $.extend(esig_data, Formbuilder.options.ESIGNATURE_UPLOAD_DATA);
              $.extend(esig_data, {
                base64_data: base64_data,
                field_name: field_name
              });
              $.ajax({
                url: Formbuilder.options.ESIGNATURE_UPLOAD_URL,
                type: 'POST',
                data: esig_data,
                dataType: 'json',
                async: false,
                success: function(data) {
                  if (data.errors) {
                    _that.formBuilder.trigger('fileUploadError', data.errors);
                  } else {
                    (function(_this) {
                      return (function(uploaded_url) {
                        return $("[name=" + data.image.field_name + "]").attr("uploaded_url", uploaded_url);
                      });
                    })(this)(data.image.uploaded_url.split("?")[0]);
                  }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                  (function(_this) {
                    return (function(response, error) {
                      return _that.formBuilder.trigger('fileUploadError', error);
                    });
                  })(this)(jqXHR.responseText, (response !== '' ? JSON.parse(response).error : ''));
                }
              });
            };
          })(this)(this, {}, encodeURIComponent(base64_data.split(",")[1]));
        },
        saveTemplate: function(e) {
          var payload;
          this.sortRemoveAddConditions();
          payload = JSON.stringify({
            fields: this.collection.toJSON()
          });
          if (Formbuilder.options.HTTP_ENDPOINT) {
            this.doAjaxSave(payload);
          }
          return this.formBuilder.trigger('saveTemplate', payload);
        },
        sortRemoveAddConditions: function() {
          this.collection.sort();
          this.collection.each(this.removeSourceConditions, this);
          return this.collection.each(this.addConditions, this);
        },
        removeSourceConditions: function(model) {
          if (!_.isEmpty(model.attributes.conditions)) {
            return _.each(model.attributes.conditions, function(condition) {
              return (function(_this) {
                return function(index) {
                  if (!_.isEmpty(condition.source)) {
                    if (condition.source === model.getCid()) {
                      index = model.attributes.conditions.indexOf(condition);
                      if (index > -1) {
                        model.attributes.conditions.splice(index, 1);
                      }
                      return model.save();
                    }
                  }
                };
              })(this)(0);
            });
          }
        },
        addConditions: function(model) {
          if (!_.isEmpty(model.attributes.conditions)) {
            return _.each(model.attributes.conditions, function(condition) {
              return (function(_this) {
                return function(source, source_condition, target_condition, is_equal, model_cid) {
                  if (!_.isEmpty(condition.source)) {
                    source = model.collection.where({
                      cid: condition.source
                    });
                    if (condition.target === '') {
                      condition.target = model_cid;
                    }
                    target_condition = $.extend(true, {}, condition);
                    target_condition.isSource = false;
                    if (!source[0].attributes.conditions || source[0].attributes.conditions.length < 1) {
                      source_condition = target_condition;
                    }
                    _.each(source[0].attributes.conditions, function(source_condition) {
                      if (source_condition.target === model_cid) {
                        delete source[0].attributes.conditions[source_condition];
                      }
                      if (_.isEqual(source_condition, target_condition)) {
                        return is_equal = true;
                      }
                    });
                    if (!is_equal) {
                      _.extend(source_condition, target_condition);
                      if (!source[0].attributes.conditions) {
                        source[0].attributes.conditions = [];
                      }
                      source[0].attributes.conditions.push(source_condition);
                      return source[0].save();
                    }
                  }
                };
              })(this)({}, {}, {}, false, model.getCid());
            });
          }
        },
        getVisibleNonEmptyFields: function() {
          var f, obj, r, res, _i, _len, _ref;
          res = [];
          _ref = this.fieldViews;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            f = _ref[_i];
            if ((f.current_state === 'show' && !f.$el.hasClass('hide')) || f.$el.hasClass('show')) {
              obj = {
                field_type: f.model.get('field_type'),
                label: f.model.get('label'),
                cid: f.model.get('cid'),
                complete: false
              };
              if ('checkAttributeHasValue' in f.field) {
                r = f.field.checkAttributeHasValue(f.model.get('cid'), f.$el);
                if (r) {
                  obj.complete = true;
                }
              }
              res.push(obj);
            }
          }
          return res;
        },
        formData: function() {
          return this.$('#formbuilder_form').serializeArray();
        },
        formValid: function() {
          return (function(_this) {
            return function(valid) {
              valid = (function(el) {
                return !el.checkValidity || el.checkValidity();
              })(_this.$('#formbuilder_form')[0]);
              if (!valid) {
                _this.$('#formbuilder_form')[0].classList.add('submitted');
                return false;
              }
              return (function(field, i, is_invalid_field, err_field_types) {
                err_field_types = ['checkboxes', 'esignature', 'gmap', 'radio', 'scale_rating', 'take_pic_video_audio'];
                while (i < _this.fieldViews.length) {
                  field = _this.fieldViews[i];
                  if (_this.getCurrentView().indexOf(field.model.get('cid')) !== -1) {
                    if (field.isValid && !field.isValid()) {
                      field.$el.find('input').css('border-color', 'red');
                      field.$el.find('textarea').css('border-color', 'red');
                      field.$el.find('.hasDatepicker').css('border-color', 'red');
                      if (err_field_types.indexOf(field.field_type) !== -1) {
                        field.$el.find('label > span').css('color', 'red');
                      }
                      if (!is_invalid_field) {
                        is_invalid_field = true;
                      }
                    } else {
                      field.$el.find('input').css('border-color', '#CCCCCC');
                      field.$el.find('textarea').css('border-color', '#CCCCCC');
                      field.$el.find('.hasDatepicker').css('border-color', '#CCCCCC');
                      field.$el.find('.bootstrap-filestyle label').css('border-color', 'rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25)');
                      field.$el.find('.bootstrap-filestyle label').css('border-bottom-color', '#b3b3b3');
                      field.$el.find('label > span').css('color', '#333');
                    }
                  }
                  i++;
                }
                if (is_invalid_field) {
                  return false;
                }
                return true;
              })(null, 0, false, []);
            };
          })(this)(false);
        },
        doAjaxSave: function(payload) {
          return $.ajax({
            url: Formbuilder.options.HTTP_ENDPOINT,
            type: Formbuilder.options.HTTP_METHOD,
            data: payload,
            contentType: "application/json",
            success: (function(_this) {
              return function(data) {
                var datum, _i, _len, _ref;
                _this.updatingBatch = true;
                for (_i = 0, _len = data.length; _i < _len; _i++) {
                  datum = data[_i];
                  if ((_ref = _this.collection.get(datum.cid)) != null) {
                    _ref.set({
                      id: datum.id
                    });
                  }
                  _this.collection.trigger('sync');
                }
                return _this.updatingBatch = void 0;
              };
            })(this)
          });
        }
      })
    };

    function Formbuilder(selector, opts) {
      if (opts == null) {
        opts = {};
      }
      _.extend(this, Backbone.Events);
      this.mainView = new Formbuilder.views.main(_.extend({
        selector: selector
      }, opts, {
        formBuilder: this
      }));
    }

    Formbuilder.prototype.formData = function() {
      return this.mainView.formData();
    };

    Formbuilder.prototype.formValid = function() {
      return this.mainView.formValid();
    };

    Formbuilder.prototype.getVisibleNonEmptyFields = function() {
      return this.mainView.getVisibleNonEmptyFields();
    };

    return Formbuilder;

  })();

  window.Formbuilder = Formbuilder;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Formbuilder;
  } else {
    window.Formbuilder = Formbuilder;
  }

}).call(this);

(function() {
  Formbuilder.registerField('address', {
    view: "<div class='input-line'>\n  <span class=\"span6\">\n    <input type='text' id='address' class='span12' value=\"<%= rf.get(Formbuilder.options.mappings.DEFAULT_ADDRESS)%>\"/>\n    <label>Street Address</label>\n  </span>\n</div>\n\n<div class='input-line'>\n  <span class=\"span3\">\n    <input class=\"span12\" type='text' id='suburb' value=\"<%= rf.get(Formbuilder.options.mappings.DEFAULT_CITY)%>\"/>\n    <label>Suburb/City</label>\n  </span>\n\n  <span class=\"span3\">\n    <input class=\"span12\" type='text' id='state' value=\"<%= rf.get(Formbuilder.options.mappings.DEFAULT_STATE)%>\"/>\n    <label>State / Province / Region</label>\n  </span>\n</div>\n\n<div class='input-line' >\n  <span class=\"span3\">\n    <input class=\"span12\" id='zipcode' type='text' pattern=\"[a-zA-Z0-9]+\"\n     value=\"<%= rf.get(Formbuilder.options.mappings.DEFAULT_ZIPCODE)%>\"/>\n    <label>Postal/Zip Code</label>\n  </span>\n  <span class=\"span3\">\n  <% if(Formbuilder.isAndroid()) { %>\n    <input id=\"file_<%= rf.getCid() %>\" addr_section=\"country\" name=\"file_<%= rf.getCid() %>\" data-country=\"<%= rf.get(Formbuilder.options.mappings.DEFAULT_COUNTRY)%>\" readonly=\"true\"></input>\n  <% }else { %>\n    <select id=\"file_<%= rf.getCid() %>\"\n      data-country=\"<%= rf.get(Formbuilder.options.mappings.DEFAULT_COUNTRY)%>\"\n      class='span7 dropdown_country bfh-selectbox bfh-countries'\n    ></select>\n  <% } %>\n    <label>Country</label>\n  </span>\n</div>\n\n<script>\n  $(function() {\n    $(\"#file_<%= rf.getCid() %>\").bfhcount();\n  });\n</script>",
    edit: "<%= Formbuilder.templates['edit/default_address']({rf: rf}) %>",
    print: "<table class=\"innerTbl\">\n  <tbody>\n    <tr>\n      <td>\n        <label>Street Address</label>\n      </td>\n      <td>\n        <label>Suburb/City</label>\n      </td>\n      <td>\n        <label>State / Province / Region</label>\n      </td>\n      <td>\n        <label>Postal/Zip Code</label>\n      </td>\n      <td>\n        <label>Country</label>\n      </td>\n    </tr>\n    <tr id=\"values\">\n      <td>\n        <label id=\"address\"></label>\n      </td>\n      <td>\n        <label id=\"suburb\"></label>\n      </td>\n      <td>\n        <label id=\"state\"></label>\n      </td>\n      <td>\n        <label id=\"zipcode\"></label>\n      </td>\n      <td>\n        <select id=\"file_<%= rf.getCid() %>\"\n          data-country=\"<%= rf.get(Formbuilder.options.mappings.DEFAULT_COUNTRY)%>\"\n          class='span7 dropdown_country bfh-selectbox bfh-countries'\n        ></select>\n      </td>\n    </tr>\n  </tbody>\n</table>\n<script>\n  $(function() {\n    $(\"#file_<%= rf.getCid() %>\").bfhcount();\n  });\n</script>",
    addButton: "<span class=\"symbol\"><span class=\"icon-home\"></span></span> Address",
    checkAttributeHasValue: function(cid, $el) {
      return (function(_this) {
        return function(incomplete) {
          var call_back;
          call_back = function() {
            if ($(this).val() === "") {
              return incomplete = true;
            }
          };
          $el.find("input[type=text]").each(call_back);
          if ($el.find('select').val() === "") {
            incomplete = true;
          }
          if (incomplete === true) {
            return false;
          }
          return cid;
        };
      })(this)(false);
    },
    clearFields: function($el, model) {
      return (function(_this) {
        return function(_that) {
          $el.find("#address").val(_that.check_and_return_val(model, Formbuilder.options.mappings.DEFAULT_ADDRESS));
          $el.find("#suburb").val(_that.check_and_return_val(model, Formbuilder.options.mappings.DEFAULT_CITY));
          $el.find("#state").val(_that.check_and_return_val(model, Formbuilder.options.mappings.DEFAULT_STATE));
          return $el.find("#zipcode").val(_that.check_and_return_val(model, Formbuilder.options.mappings.DEFAULT_ZIPCODE));
        };
      })(this)(this);
    },
    check_and_return_val: function(model, val) {
      return model.get(val) || '';
    },
    evalCondition: function(clicked_element, cid, condition, set_value) {
      return (function(_this) {
        return function(check_result, check_match_condtions, elem_val) {
          if (condition === '!=') {
            check_result = clicked_element.find("#address").val() !== '' && clicked_element.find("#suburb").val() !== '' && clicked_element.find("#state").val() !== '' && clicked_element.find("[name=" + cid + "_4]") !== '';
          } else {
            elem_val = clicked_element.find("#address").val();
            check_result = condition("'" + elem_val + "'", "'" + set_value + "'");
          }
          return check_result;
        };
      })(this)(false, [], '');
    },
    add_remove_require: function(cid, required) {
      $("." + cid).find("[name = " + cid + "_1]").attr("required", required);
      $("." + cid).find("[name = " + cid + "_2]").attr("required", required);
      $("." + cid).find("[name = " + cid + "_3]").attr("required", required);
      $("." + cid).find("[name = " + cid + "_4]").attr("required", required);
      return $("." + cid).find("[name = " + cid + "_5]").attr("required", required);
    },
    setup: function(field_view, model) {
      return (function(_this) {
        return function(that, $str_add) {
          if (model.attributes.field_values) {
            field_view.$el.find("#address").val(model.attributes.field_values["" + (model.getCid()) + "_1"]);
            field_view.$el.find("#suburb").val(model.attributes.field_values["" + (model.getCid()) + "_2"]);
            field_view.$el.find("#state").val(model.attributes.field_values["" + (model.getCid()) + "_3"]);
            field_view.$el.find("#zipcode").val(model.attributes.field_values["" + (model.getCid()) + "_4"]);
            field_view.$el.find("select").val(model.attributes.field_values["" + (model.getCid()) + "_5"]);
          } else {
            that.clearFields(field_view.$el, model);
          }
          if ($str_add.val() !== '') {
            return field_view.trigger('change_state');
          }
        };
      })(this)(this, field_view.$el.find("#address"));
    },
    setValForPrint: function(field_view, model) {
      return (function(_this) {
        return function(fields, values, i) {
          var key, _results;
          _results = [];
          for (key in values) {
            _results.push($(fields[i]).html(values["" + (model.getCid()) + "_" + (++i)]));
          }
          return _results;
        };
      })(this)(field_view.$el.find('#values').find('label'), model.get('field_values'), 0);
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('checkboxes', {
    view: "<% var field_options = (rf.get(Formbuilder.options.mappings.OPTIONS) || []) %>\n<% for ( var i = 0 ; i < field_options.length ; i++) { %>\n  <div>\n    <label class='fb-option'>\n      <input type='checkbox' value='<%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label%>' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> />\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </div>\n<% } %>\n\n<% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n  <div class='other-option'>\n    <label class='fb-option'>\n      <input class='other-option' type='checkbox' value=\"__other__\"/>\n      Other\n    </label>\n\n    <input type='text' />\n  </div>\n<% } %>",
    edit: "<%= Formbuilder.templates['edit/options']({ includeOther: true }) %>",
    print: "<% var field_options = rf.get(Formbuilder.options.mappings.OPTIONS) || [],\n   cnt = field_options.length,\n   labelArr = [],\n   field_values =  rf.get('field_values'),\n   cid =  rf.get('cid');\n%>\n<% _.each(field_options, function(option){ %>\n  <% labelArr.push(option.label) %>\n<% }) %>\n<% if(field_values){ %>\n  <% for(var index = 0, values_length = Object.keys(field_values).length; index < values_length; index++) { %>\n    <% var input_val = field_values[cid + '_'+ (index+1)]; %>\n    <% if(input_val){ %>\n      <label>\n      <% if(labelArr[index]) %>\n        <%= labelArr[index] %>\n      <% else if(typeof(input_val) == 'string' && input_val.trim() != '') %>\n        <%= input_val %>\n      </label>\n    <% } %>\n  <% } %>\n<% } %>",
    addButton: "<span class=\"symbol\"><span class=\"icon-check-empty\"></span></span> Checkboxes",
    checkAttributeHasValue: function(cid, $el) {
      if ($el.find('input:checked').length <= 0) {
        return false;
      }
      if ($el.find('input:checked').last().val() === '__other__') {
        if ($el.find('input:text').val() === '') {
          return false;
        }
      }
      return cid;
    },
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "",
          checked: false
        }, {
          label: "",
          checked: false
        }
      ];
      return attrs;
    },
    isValid: function($el, model) {
      return (function(_this) {
        return function(valid) {
          valid = (function(required_attr, checked_chk_cnt) {
            if (!required_attr) {
              return true;
            }
            checked_chk_cnt = $el.find('input:checked').length;
            if ($($el.find('input:checked').last()).val() === '__other__') {
              return $el.find('input:text').val() !== '';
            }
            return checked_chk_cnt > 0;
          })(model.get('required'), 0);
          return valid;
        };
      })(this)(false);
    },
    clearFields: function($el, model) {
      var elem, _i, _len, _ref;
      _ref = $el.find('input:checked');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        elem.checked = false;
      }
      return $el.find('input:text').val('');
    },
    fieldToValue: function($el, model) {
      return (function(all_elem, res) {
        _.each(all_elem, function(elem) {
          return (function($elem) {
            if ($elem.is(":checkbox")) {
              return res[$elem.attr('name')] = $elem.is(":checked");
            } else {
              return res[$elem.attr('name')] = $elem.val();
            }
          })($(elem));
        });
        return res;
      })($el.find('[name^=' + model.getCid() + ']'), {});
    },
    setup: function(field_view, model) {
      if (model.get('field_values')) {
        (function(val_hash) {
          return _.each(val_hash, function(val, key) {
            return (function(target_elemnt) {
              if (target_elemnt.is(":checkbox")) {
                return target_elemnt.prop('checked', val);
              } else {
                return target_elemnt.val(val);
              }
            })(field_view.$el.find("[name=" + key + "]"));
          });
        })(model.get('field_values'));
      } else if (model.get('field_options')) {
        (function(options, cid) {
          return _.each(options, function(val, index) {
            if (val.checked) {
              return field_view.$el.find("[name=" + cid + "_" + (index + 1) + "]").prop("checked", true);
            }
          });
        })(model.get('field_options').options, model.getCid());
      }
      if (field_view.$el.find('input[type=checkbox]:checked')) {
        return field_view.trigger('change_state');
      }
    },
    evalCondition: function(clicked_element, cid, condition, set_value) {
      return (function(_this) {
        return function(elem_val, check_result) {
          elem_val = clicked_element.find("input[value = '" + set_value + "']").is(':checked');
          if (elem_val) {
            check_result = condition(elem_val, true);
          } else if (clicked_element.find("[value = '__other__']").is(':checked')) {
            elem_val = clicked_element.find('input[type=text]').val();
            check_result = condition(elem_val, set_value);
          }
          return check_result;
        };
      })(this)('', false);
    },
    add_remove_require: function(cid, required) {
      return (function(_this) {
        return function(checked_chk_cnt) {
          var i, input_elem, _i, _len, _ref, _results;
          _ref = $el.find('input:checked').length;
          _results = [];
          for (input_elem = _i = 0, _len = _ref.length; _i < _len; input_elem = ++_i) {
            i = _ref[input_elem];
            _results.push($("." + cid).find("[name = " + cid + "_1]").attr("required", required));
          }
          return _results;
        };
      })(this)(0);
    }
  });

}).call(this);

(function() {
  if (typeof CKEDITOR !== 'undefined') {
    Formbuilder.registerField('free_text_html', {
      type: 'non_input',
      view: "<%\n  if(rf.get(Formbuilder.options.mappings.OPTIONAL_FIELD)){\n\n    if($(\"#title_\"+rf.getCid()).is(':disabled')){\n      $(\"#title_\"+rf.getCid()).attr(\"disabled\",false);\n    }\n\n    if(!$(\"#title_\"+rf.getCid()).is(':focus')){\n      $(\"#title_\"+rf.getCid()).val(rf.get(Formbuilder.options.mappings.LABEL));\n      $(\"#title_\"+rf.getCid()).focus();\n    }\n%>\n  <label class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'>\n    <%= rf.get(Formbuilder.options.mappings.LABEL) %>\n  </label>\n<% }else{\n    $(\"#title_\"+rf.getCid()).val(\"\");\n    $(\"#title_\"+rf.getCid()).attr(\"disabled\",true);\n} %>\n<div class=\"freeTextHTMLDiv\" id='<%= rf.getCid() %>'></div>\n<script>\n  $(function() {\n    var data = \"<%=rf.get(Formbuilder.options.mappings.HTML_DATA)%>\"\n    $(\"#<%= rf.getCid() %>\").html(data);\n  });\n</script>\n\n",
      edit: "<%= Formbuilder.templates['edit/optional_title']() %>\n</br>\n\n<input id=\"title_<%= rf.getCid() %>\" type='text'\n  <%\n  if(!rf.get(Formbuilder.options.mappings.OPTIONAL_FIELD)){\n    disabled=\"true\"\n  }\n  %>\ndata-rv-input='model.<%= Formbuilder.options.mappings.LABEL %>'/>\n\n\n<div class='inline'>\n  <span>Edit Here:</span>\n  <div class='fb-bottom-add'>\n    <a id='button_<%= rf.getCid() %>'\n      class=\"js-add-document <%= Formbuilder.options.BUTTON_CLASS %>\">\n        Edit\n    </a>\n  </div>\n</div>\n\n<div id=\"open_model_<%= rf.getCid() %>\"\n  class=\"modal fade modal_style free_text_html_modal\" tabindex=\"-1\"\n  role=\"dialog\" aria-labelledby=\"ModalLabel\" aria-hidden=\"true\">\n  <div class=\"modal-header\">\n    <button type=\"button\" class=\"close\" data-dismiss=\"modal\"\n      aria-hidden=\"true\">&times;</button>\n    <h3>Select Documents</h3>\n  </div>\n  <div class=\"modal-body\" id=\"modal_body_<%= rf.getCid() %>\">\n    <textarea id='ck_<%= rf.getCid() %>' contenteditable=\"true\" data-rv-value='model.<%= Formbuilder.options.mappings.HTML_DATA %>'>\n    </textarea>\n  </div>\n  <div class=\"modal-footer\">\n    <button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">\n      Done\n    </button>\n  </div>\n</div>\n\n<script>\n  $(function() {\n    $(document).ready( function() {\n      $(\"#button_<%= rf.getCid() %>\").click( function() {\n\n        $(\"#open_model_<%= rf.getCid() %>\").on('shown.bs.modal', function() {\n          var that = $(this).data('modal');\n          $(document).off('focusin.modal').on('focusin.modal', function (e) {\n            // Add this line\n            if( e.target.className && e.target.className.indexOf('cke_') == 0 ) return;\n            // Original\n            if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {\n            that.$element.focus() }\n          });\n        });\n\n        $(\"#open_model_<%= rf.getCid() %>\").modal('show');\n\n        $(\"#open_model_<%= rf.getCid() %>\").on('hidden.bs.modal', function() {\n          $(\"#ck_<%= rf.getCid() %>\").val(editor_<%= rf.getCid() %>.getData().replace(/(\\r\\n|\\n|\\r)/gm, \"\").replace(/\"/g,\"'\"));\n          $(\"#ck_<%= rf.getCid() %>\").trigger(\"change\");\n          $(this).unbind('shown');\n          $(this).unbind('hidden');\n        });\n      });\n      CKEDITOR.disableAutoInline = true;\n      // this event fired when any popup is opened inside ckeditor\n      CKEDITOR.on('dialogDefinition', function(ev){\n          var dialogName = ev.data.name;\n          var dialogDef  = ev.data.definition;\n          // check if link popup is opened\n          if(dialogName === \"link\"){\n            // remove unwanted link types\n            dialogDef.getContents('info').get('linkType')['items'].splice(1,2);\n            // remove unwanted protocols\n            dialogDef.getContents('info').get('protocol')['items'].splice(2,5);\n            // select another tab called as target\n            var targetTab = dialogDef.getContents('target').elements[0];\n            if(typeof targetTab.children === \"object\" && typeof targetTab.children[0] === \"object\"){\n              if(typeof targetTab.children[0].items === \"object\"){\n                // validate and then remove unwanted options in target tab\n                if(targetTab.children[0].items.length > 1){\n                  targetTab.children[0].items.splice(4,3);\n                  targetTab.children[0].items.splice(0,3);\n                  targetTab.children[0].default = \"_blank\";\n                }\n              }\n            }\n          }\n        });\n      editor_<%= rf.getCid() %> = CKEDITOR.replace(document.getElementById(\"ck_<%= rf.getCid() %>\"),\n        Formbuilder.options.CKEDITOR_CONFIG\n      );\n      // This will take care of CKEditor instance and automatically copy its contents\n      // into the container with an id like the editor instance with an ending \"_preview\"\n      CKEDITOR.on('instanceCreated', function (e) {\n        e.editor.on('change', function (ev) {\n          document.getElementById( ev.editor.name + '_preview').innerHTML = ev.editor.getData();\n        });\n      });\n    });\n  });\n</script>\n",
      addButton: "<span class='symbol'><span class='icon-font'></span></span> Free Text HTML",
      checkAttributeHasValue: function(cid, $el) {
        if ($el.find('.freeTextHTMLDiv').is(':empty')) {
          return false;
        }
        return cid;
      },
      clearFields: function($el, model) {
        return $el.find('#' + model.getCid()).find('p').text('');
      },
      evalCondition: function(clicked_element, cid, condition, set_value) {
        return (function(_this) {
          return function(check_result) {
            var elem_val;
            elem_val = clicked_element.find("#" + cid).find('p').text();
            check_result = condition("'" + elem_val + "'", "'" + set_value + "'");
            return check_result;
          };
        })(this)(false);
      },
      add_remove_require: function(cid, required) {
        return $("." + cid).find("#" + cid).attr("required", required);
      }
    });
  }

}).call(this);

(function() {
  Formbuilder.registerField('date', {
    view: "<label>\n  Unsupported field. Please replace this with the new DateTime field.\n</label>",
    edit: "",
    getFieldType: function() {
      return 'date';
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('date_of_birth', {
    view: "<div class='input-line'>\n  <input id='<%= rf.getCid() %>' type='text' readonly date_format='<%= rf.get(Formbuilder.options.mappings.DATE_FORMAT)%>'/>\n</div>",
    edit: "<%= Formbuilder.templates['edit/age_restriction']({ includeOther: true }) %>\n<%= Formbuilder.templates['edit/date_format']() %>",
    addButton: "<span class=\"symbol\"><span class=\"icon-gift\"></span></span> Birth Date",
    print: "<label id=\"dob_print\"></label>",
    setValForPrint: function(field_view, model) {
      return field_view.$el.find('#dob_print').html(model.get('field_values')["" + (model.getCid()) + "_1"]);
    },
    setup: function(field_view, model) {
      var el;
      el = field_view.$el.find('input');
      return (function(_this) {
        return function(today, restricted_date) {
          if (model.get(Formbuilder.options.mappings.MINAGE)) {
            restricted_date.setFullYear(today.getFullYear() - model.get(Formbuilder.options.mappings.MINAGE));
            el.datepicker({
              dateFormat: model.get(Formbuilder.options.mappings.DATE_FORMAT) || 'dd/mm/yy',
              changeMonth: true,
              changeYear: true,
              yearRange: '-100y:c+nn',
              maxDate: restricted_date
            });
          } else {
            el.datepicker({
              dateFormat: model.get(Formbuilder.options.mappings.DATE_FORMAT) || 'dd/mm/yy',
              changeMonth: true,
              changeYear: true,
              yearRange: '-100y:c+nn',
              maxDate: today
            });
          }
          if (model.get('field_values')) {
            el.val(model.get('field_values')["" + (model.getCid()) + "_1"]);
          }
          return $(el).click(function() {
            return $("#ui-datepicker-div").css("z-index", 3);
          });
        };
      })(this)(new Date, new Date);
    },
    isValid: function($el, model) {
      return (function(_this) {
        return function(valid) {
          valid = (function(required_attr) {
            if (!required_attr) {
              return true;
            }
            return $el.find(".hasDatepicker").val() !== '';
          })($el.find("[name = " + model.getCid() + "_1]").attr("required"));
          return valid;
        };
      })(this)(false);
    },
    clearFields: function($el, model) {
      return $el.find("[name = " + model.getCid() + "_1]").val("");
    },
    check_date_result: function(condition, firstValue, secondValue) {
      firstValue[0] = parseInt(firstValue[0]);
      firstValue[1] = parseInt(firstValue[1]);
      firstValue[2] = parseInt(firstValue[2]);
      secondValue[0] = parseInt(secondValue[0]);
      secondValue[1] = parseInt(secondValue[1]);
      secondValue[2] = parseInt(secondValue[2]);
      if (condition === "<") {
        if (firstValue[2] <= secondValue[2] && firstValue[1] <= secondValue[1] && firstValue[0] < secondValue[0]) {
          return true;
        } else {
          return false;
        }
      } else if (condition === ">") {
        if (firstValue[2] >= secondValue[2] && firstValue[1] >= secondValue[1] && firstValue[0] > secondValue[0]) {
          return true;
        } else {
          return false;
        }
      } else {
        if (firstValue[2] === secondValue[2] && firstValue[1] === secondValue[1] && firstValue[0] === secondValue[0]) {
          return true;
        } else {
          return false;
        }
      }
    },
    checkAttributeHasValue: function(cid, $el) {
      if ($el.find("input[type=text]").val() === "") {
        return false;
      }
      return cid;
    },
    evalCondition: function(clicked_element, cid, condition, set_value, field) {
      return (function(_this) {
        return function(firstValue, check_result, secondValue, is_true, check_field_date_format) {
          var hold_date;
          check_field_date_format = clicked_element.find("[name = " + cid + "_1]").attr('date_format');
          firstValue = clicked_element.find("[name = " + cid + "_1]").val();
          firstValue = firstValue.split('/');
          if (check_field_date_format === 'mm/dd/yy') {
            hold_date = firstValue[0];
            firstValue[0] = firstValue[1];
            firstValue[1] = hold_date;
          }
          secondValue = set_value.split('/');
          return is_true = field.check_date_result(condition, firstValue, secondValue);
        };
      })(this)('', false, '', false, '');
    },
    add_remove_require: function(cid, required) {
      return $("." + cid).find("[name = " + cid + "_1]").attr("required", required);
    },
    fieldToValue: function($el, model) {
      return (function(elem, res) {
        res[$(elem).attr('name')] = $(elem).val();
        return res;
      })($el.find('[name^=' + model.getCid() + ']'), {});
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('date_time', {
    view: "<% if(!rf.get(Formbuilder.options.mappings.TIME_ONLY) && !rf.get(Formbuilder.options.mappings.DATE_ONLY)) { %>\n  <div class='input-line'>\n    <input id='<%= rf.getCid()%>_datetime' type='text' readonly date_format='<%= rf.get(Formbuilder.options.mappings.DATE_FORMAT)%>'/>\n  </div>\n  <script>\n    $(function() {\n      $(\"#<%= rf.getCid() %>_datetime\")\n          .datetimepicker({\n              dateFormat: '<%= rf.get(Formbuilder.options.mappings.DATE_FORMAT) || 'dd/mm/yy' %>',\n              stepMinute: parseInt('<%= rf.get(Formbuilder.options.mappings.STEP) || '1' %>'),\n              addSliderAccess: true,\n              sliderAccessArgs: { touchonly: false },\n              changeMonth : true,\n              changeYear : true,\n              yearRange: '-100y:+100y'\n           });\n    })\n  </script>\n<% } else if(rf.get(Formbuilder.options.mappings.TIME_ONLY)) { %>\n  <div class='input-line'>\n    <input id='<%= rf.getCid() %>_time' type='text' readonly />\n  </div>\n  <script>\n    $(function() {\n      $(\"#<%= rf.getCid() %>_time\")\n            .timepicker({\n                stepMinute: parseInt('<%= rf.get(Formbuilder.options.mappings.STEP) || '1' %>'),\n                addSliderAccess: true,\n                sliderAccessArgs: { touchonly: false }\n              });\n    })\n  </script>\n<% } else if(rf.get(Formbuilder.options.mappings.DATE_ONLY)) { %>\n  <div class='input-line'>\n    <input id='<%= rf.getCid() %>_date' type='text' readonly date_format='<%= rf.get(Formbuilder.options.mappings.DATE_FORMAT)%>' />\n  </div>\n  <script>\n    $(function() {\n      $(\"#<%= rf.getCid() %>_date\")\n          .datepicker({\n              dateFormat: '<%= rf.get(Formbuilder.options.mappings.DATE_FORMAT) || 'dd/mm/yy' %>',\n              changeMonth : true,\n              changeYear : true,\n              yearRange: '-100y:+100y'\n            });\n    })\n  </script>\n<% } %>",
    edit: "<%= Formbuilder.templates['edit/date_only']() %>\n<%= Formbuilder.templates['edit/time_only']() %>\n<%= Formbuilder.templates['edit/step']() %>\n<%= Formbuilder.templates['edit/date_format']() %>",
    addButton: "<span class=\"symbol\"><span class=\"icon-calendar\"></span></span> Date and Time",
    print: "<label id=\"dt_print\"></label>",
    setValForPrint: function(field_view, model) {
      return field_view.$el.find('#dt_print').html(model.get('field_values')["" + (model.getCid()) + "_1"]);
    },
    checkAttributeHasValue: function(cid, $el) {
      if ($el.find("input[type=text]").val() === "") {
        return false;
      }
      return cid;
    },
    setup: function(field_view, model) {
      return (function(_this) {
        return function(today, el) {
          if (!model.get('field_values')) {
            if (el.attr('id') === model.getCid() + '_datetime') {
              if (Formbuilder.isMobile()) {
                setTimeout((function() {
                  el.datetimepicker('setDate', new Date());
                }), 500);
              } else {
                el.datetimepicker('setDate', new Date());
              }
            } else if (el.attr('id') === model.getCid() + '_date') {
              if (Formbuilder.isMobile()) {
                setTimeout((function() {
                  el.datepicker('setDate', new Date());
                }), 500);
              } else {
                el.datepicker('setDate', new Date());
              }
            } else {
              if (Formbuilder.isMobile()) {
                setTimeout((function() {
                  el.timepicker('setTime', new Date());
                }), 500);
              } else {
                el.timepicker('setTime', new Date());
              }
            }
          } else {
            el.val(model.get('field_values')["" + (model.getCid()) + "_1"]);
          }
          $(el).click(function() {
            return $("#ui-datepicker-div").css("z-index", 3);
          });
          $('#ui-datepicker-div').css('display', 'none');
          return el.blur();
        };
      })(this)(new Date, field_view.$el.find('input'));
    },
    isValid: function($el, model) {
      return (function(_this) {
        return function(valid) {
          valid = (function(required_attr) {
            if (!required_attr) {
              return true;
            }
            return $el.find(".hasDatepicker").val() !== '';
          })($el.find("[name = " + model.getCid() + "_1]").attr("required"));
          return valid;
        };
      })(this)(false);
    },
    clearFields: function($el, model) {
      return $el.find("[name = " + model.getCid() + "_1]").val("");
    },
    check_date_result: function(condition, firstValue, secondValue) {
      firstValue[0] = parseInt(firstValue[0]);
      firstValue[1] = parseInt(firstValue[1]);
      firstValue[2] = parseInt(firstValue[2]);
      secondValue[0] = parseInt(secondValue[0]);
      secondValue[1] = parseInt(secondValue[1]);
      secondValue[2] = parseInt(secondValue[2]);
      if (condition === "<") {
        if (firstValue[2] <= secondValue[2] && firstValue[1] <= secondValue[1] && firstValue[0] < secondValue[0]) {
          return true;
        } else {
          return false;
        }
      } else if (condition === ">") {
        if (firstValue[2] >= secondValue[2] && firstValue[1] >= secondValue[1] && firstValue[0] > secondValue[0]) {
          return true;
        } else {
          return false;
        }
      } else {
        if (firstValue[2] === secondValue[2] && firstValue[1] === secondValue[1] && firstValue[0] === secondValue[0]) {
          return true;
        } else {
          return false;
        }
      }
    },
    check_time_retult: function(clicked_element, cid, condition, set_value, split_string) {
      return (function(_this) {
        return function(firstDate, secondDate, firstValue, secondValue, combinedValue) {
          var _base, _base1;
          if (split_string) {
            combinedValue = clicked_element.find("[name = " + cid + "_1]").val();
            combinedValue = combinedValue.split(' ');
            firstValue = combinedValue[1];
          } else {
            firstValue = clicked_element.find("[name = " + cid + "_1]").val();
          }
          if (firstValue) {
            firstValue = firstValue.split(':');
            secondValue = set_value.split(':');
            firstDate.setHours(firstValue[0]);
            firstDate.setMinutes(firstValue[1]);
            secondDate.setHours(secondValue[0]);
            secondDate.setMinutes(secondValue[1]);
            if (condition === "<") {
              return typeof (_base = firstDate < secondDate) === "function" ? _base({
                "true": false
              }) : void 0;
            } else if (condition === ">") {
              return typeof (_base1 = firstDate > secondDate) === "function" ? _base1({
                "true": false
              }) : void 0;
            } else if (condition === "==") {
              if (parseInt(firstValue[0]) === parseInt(secondValue[0]) && parseInt(firstValue[1]) === parseInt(secondValue[1])) {
                return true;
              }
            }
          }
        };
      })(this)(new Date(), new Date(), "", "", '');
    },
    evalCondition: function(clicked_element, cid, condition, set_value, field) {
      return (function(_this) {
        return function(combinedValue, firstValue, check_result, secondValue, is_date_true, is_time_true, split_string, hold_date, check_field_date_format) {
          var check_field_id;
          check_field_id = clicked_element.find("[name = " + cid + "_1]").attr('id');
          check_field_date_format = clicked_element.find("[name = " + cid + "_1]").attr('date_format');
          if (check_field_id === cid + '_datetime') {
            combinedValue = clicked_element.find("[name = " + cid + "_1]").val();
            combinedValue = combinedValue.split(' ');
            firstValue = combinedValue[0];
            if (firstValue) {
              firstValue = firstValue.split('/');
              if (check_field_date_format === 'mm/dd/yy') {
                hold_date = firstValue[0];
                firstValue[0] = firstValue[1];
                firstValue[1] = hold_date;
              }
              set_value = set_value.split(' ');
              secondValue = set_value[0].split('/');
              is_date_true = field.check_date_result(condition, firstValue, secondValue);
              split_string = true;
              is_time_true = field.check_time_retult(clicked_element, cid, condition, set_value[1], split_string);
              if (is_date_true && is_time_true) {
                return true;
              }
            }
          } else if (check_field_id === cid + '_date') {
            firstValue = clicked_element.find("[name = " + cid + "_1]").val();
            if (firstValue) {
              firstValue = firstValue.split('/');
              if (check_field_date_format === 'mm/dd/yy') {
                hold_date = firstValue[0];
                firstValue[0] = firstValue[1];
                firstValue[1] = hold_date;
              }
              secondValue = set_value.split('/');
              return is_date_true = field.check_date_result(condition, firstValue, secondValue);
            }
          } else {
            return is_time_true = field.check_time_retult(clicked_element, cid, condition, set_value, split_string);
          }
        };
      })(this)('', '', false, '', false, false, false, '', '');
    },
    add_remove_require: function(cid, required) {
      return $("." + cid).find("[name = " + cid + "_1]").attr("required", required);
    },
    show_or_hide: function(field_view, model, check_result, action) {
      return (function(_this) {
        return function($input_el) {
          if (check_result) {
            if (action === 'show') {
              field_view.$el.removeClass('hide').addClass('show');
            } else {
              field_view.$el.removeClass('show').addClass('hide');
            }
            if ($input_el.val() === '') {
              return $input_el.datetimepicker('setDate', new Date());
            }
          } else {
            if (action === 'show') {
              return field_view.$el.removeClass('show').addClass('hide');
            } else {
              return field_view.$el.removeClass('hide').addClass('show');
            }
          }
        };
      })(this)(field_view.$el.find('input'));
    },
    fieldToValue: function($el, model) {
      return (function(elem, res) {
        res[$(elem).attr('name')] = $(elem).val();
        return res;
      })($el.find('[name^=' + model.getCid() + ']'), {});
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('date_time_difference', {
    view: "<div class='input-line'>\n  <span>\n    <input class=\"hasDateTimepicker\" id='<%= rf.getCid()%>_startDateTimeDifference' type='text' readonly date_format='<%= rf.get(Formbuilder.options.mappings.DATE_FORMAT)%>'/>\n\n    <label><%= rf.get(Formbuilder.options.mappings.START_DATE_TIME_TEXT) || 'Start Date Time' %></label>\n  </span>\n  <span>\n    <input class=\"hasDateTimepicker\" id='<%= rf.getCid()%>_endDateTimeDifference' type='text' readonly date_format='<%= rf.get(Formbuilder.options.mappings.DATE_FORMAT)%>'/>\n    <label><%= rf.get(Formbuilder.options.mappings.END_DATE_TIME_TEXT) || 'End Date Time' %></label>\n  </span>\n  <span>\n    <input id='<%= rf.getCid()%>_differenceDateTimeDifference' type='text' readonly data-text=\"qwerty\"/>\n    <label><%= rf.get(Formbuilder.options.mappings.DATETIME_DIFFERENCE_TEXT) || 'Difference' %></label>\n  </span>\n  <script>\n    $(function() {\n      $(\"#<%= rf.getCid() %>_startDateTimeDifference\")\n          .datetimepicker({\n              dateFormat: '<%= rf.get(Formbuilder.options.mappings.DATE_FORMAT) || 'dd/mm/yy' %>',\n              stepMinute: parseInt('<%= rf.get(Formbuilder.options.mappings.STEP) || '1' %>'),\n              addSliderAccess: true,\n              sliderAccessArgs: { touchonly: false },\n              changeMonth : true,\n              changeYear : true,\n              yearRange: '-100y:+100y'\n           });\n      $(\"#<%= rf.getCid() %>_endDateTimeDifference\")\n            .datetimepicker({\n                dateFormat: '<%= rf.get(Formbuilder.options.mappings.DATE_FORMAT) || 'dd/mm/yy' %>',\n                stepMinute: parseInt('<%= rf.get(Formbuilder.options.mappings.STEP) || '1' %>'),\n                addSliderAccess: true,\n                sliderAccessArgs: { touchonly: false },\n                changeMonth : true,\n                changeYear : true,\n                yearRange: '-100y:+100y'\n             });\n    })\n  </script>\n</div>",
    setup: function(field_view, model) {
      return (function(_this) {
        return function(dateTimeFields) {
          _.each(dateTimeFields, function(el) {
            if (Formbuilder.isMobile() && !model.get('field_values')) {
              setTimeout((function() {
                el.datetimepicker('setDate', new Date());
              }), 500);
            } else {
              el.datetimepicker('setDate', new Date());
            }
            $(el).click(function() {
              return $("#ui-datepicker-div").css("z-index", 3);
            });
            $('#ui-datepicker-div').css('display', 'none');
            return el.blur();
          });
          if (model.get('field_values')) {
            _.each(dateTimeFields, function(el, index) {
              return el.val(model.attributes.field_values["" + (model.getCid()) + "_" + (index + 1)]);
            });
            field_view.$el.find('#' + model.getCid() + '_differenceDateTimeDifference').val(model.attributes.field_values["" + (model.getCid()) + "_3"]);
          }
          return _.each(dateTimeFields, function(el) {
            return el.change({
              ele: field_view.$el,
              fmt: model.get('field_options').date_format || 'dd/mm/yy',
              cid: model.getCid()
            }, _this.changeEventHandler);
          });
        };
      })(this)([field_view.$el.find('#' + model.getCid() + '_startDateTimeDifference'), field_view.$el.find('#' + model.getCid() + '_endDateTimeDifference')]);
    },
    changeEventHandler: (function(_this) {
      return function(event, data) {
        if (typeof data === "undefined") {
          data = event.data;
        }
        return (function(cid, st_date_str, end_date_str, diff_str, fmt, days, hrs, mins, st_date_obj, end_date_obj, st_date_mili, end_date_mili, one_day_mili, one_hour_mili, diff_field) {
          var diff_time;
          if (st_date_str && end_date_str) {
            st_date_str = (fmt === "dd/mm/yy" ? st_date_str.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3") : st_date_str);
            end_date_str = (fmt === "dd/mm/yy" ? end_date_str.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3") : end_date_str);
            st_date_obj = new Date(st_date_str);
            end_date_obj = new Date(end_date_str);
            st_date_mili = st_date_obj.getTime();
            end_date_mili = end_date_obj.getTime();
            diff_time = end_date_mili - st_date_mili;
            diff_time = (diff_time < 0 ? diff_time * (-1) : diff_time);
            days = Math.floor(diff_time / one_day_mili);
            hrs = Math.floor((diff_time - days * one_day_mili) / one_hour_mili);
            mins = Math.round((diff_time - days * one_day_mili - hrs * one_hour_mili) / 60000);
            diff_str = days + "d " + hrs + "h " + mins + "m";
          }
          return diff_field.val(diff_str);
        })(data.cid, data.ele.find("#" + data.cid + "_startDateTimeDifference").val(), data.ele.find("#" + data.cid + "_endDateTimeDifference").val(), "", data.fmt, 0, 0, 0, "", "", "", "", 24 * 60 * 60 * 1000, 60 * 60 * 1000, data.ele.find("#" + data.cid + "_differenceDateTimeDifference"));
      };
    })(this),
    edit: "<%= Formbuilder.templates['edit/datetime_difference_labels']() %>\n<%= Formbuilder.templates['edit/date_format']() %>",
    addButton: "<span class=\"symbol\"><span class=\"icon-calendar\"></span></span> Date Time Difference",
    print: "<label id=\"st_dt_print\"></label>\n<label id=\"end_dt_print\"></label>\n<label id=\"diff_dt_print\"></label>",
    setValForPrint: function(field_view, model) {
      field_view.$el.find('#st_dt_print').html(model.get('field_values')["" + (model.getCid()) + "_1"]);
      field_view.$el.find('#end_dt_print').html(model.get('field_values')["" + (model.getCid()) + "_2"]);
      return field_view.$el.find('#diff_dt_print').html(model.get('field_values')["" + (model.getCid()) + "_3"]);
    },
    checkAttributeHasValue: function(cid, $el) {
      return (function(_this) {
        return function(incomplete) {
          var call_back;
          call_back = function() {
            if ($(this).val() === "") {
              return incomplete = true;
            }
          };
          $el.find("input[type=text]").each(call_back);
          if ($el.find('select').val() === "") {
            incomplete = true;
          }
          if (incomplete === true) {
            return false;
          }
          return cid;
        };
      })(this)(false);
    },
    isValid: function($el, model) {
      return (function(_this) {
        return function(valid) {
          valid = (function(required_attr, cid) {
            if (!required_attr) {
              return true;
            }
            return $el.find("#" + cid + "_startDateTimeDifference").val() !== '' && $el.find("#" + cid + "_endDateTimeDifference").val() !== '' && $el.find("#" + cid + "_differenceDateTimeDifference").val() !== '';
          })(model.get('required'), model.getCid());
          return valid;
        };
      })(this)(false);
    },
    clearFields: function($el, model) {
      return (function(_this) {
        return function(targetFields) {
          return _.each(targetFields, function(el) {
            return el.val("");
          });
        };
      })(this)([$el.find("[name = " + model.getCid() + "_1]"), $el.find("[name = " + model.getCid() + "_2]"), $el.find("[name = " + model.getCid() + "_3]")]);
    },
    fieldToValue: function($el, model) {
      return (function(all_elem, res) {
        _.each(all_elem, function(elem) {
          return (function($elem) {
            return res[$elem.attr('name')] = $elem.val();
          })($(elem));
        });
        return res;
      })($el.find('[name^=' + model.getCid() + ']'), {});
    },
    convertToMili: function(dhmStr) {
      return (function(_this) {
        return function(d, h, m, res, parts) {
          var val, _fn, _i, _len;
          _fn = function(val) {
            switch (val.substring(val.length, val.length - 1)) {
              case 'd':
                return d = val.substring(0, val.length - 1);
              case 'h':
                return h = val.substring(0, val.length - 1);
              case 'm':
                return m = val.substring(0, val.length - 1);
            }
          };
          for (_i = 0, _len = parts.length; _i < _len; _i++) {
            val = parts[_i];
            _fn(val);
          }
          if (isNaN(d) || isNaN(d) || isNaN(d)) {
            res = 0;
          } else {
            res = d * 86400000 + h * 3600000 + m * 60000;
          }
          return res;
        };
      })(this)(0, 0, 0, 0, dhmStr.split(" "));
    },
    evalCondition: function(clicked_element, cid, condition, set_value) {
      var check_result, elem_val;
      (function(_this) {
        return (function(elem_val, check_result) {});
      })(this)('', false);
      elem_val = clicked_element.find("#" + cid + "_differenceDateTimeDifference").val();
      elem_val = this.convertToMili(elem_val);
      set_value = this.convertToMili(set_value);
      check_result = condition("'" + elem_val + "'", "'" + set_value + "'");
      return check_result;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('dropdown', {
    view: "<% if(Formbuilder.isAndroid()) { %>\n  <input id=\"<%= rf.getCid() %>\" dropdown=\"dropdown\" name=\"<%= rf.getCid() %>\" readonly=\"true\"></input>\n<% } else { %>\n<select id=\"dropdown\">\n  <% if (rf.get(Formbuilder.options.mappings.INCLUDE_BLANK)) { %>\n    <% var empty_opt_text = (rf.get(Formbuilder.options.mappings.EMPTY_OPTION_TEXT) || '') %>\n    <option value=''><%= empty_opt_text %></option>\n  <% } %>\n\n  <% var field_options = (rf.get(Formbuilder.options.mappings.OPTIONS) || []) %>\n  <% for ( var i = 0 ; i < field_options.length ; i++) { %>\n    <option value=\"<%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\" <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'selected' %>>\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </option>\n  <% } %>\n</select>\n<% } %>",
    android_view: "<input id=\"<%= rf.getCid() %>\" dropdown=\"dropdown\" name=\"<%= rf.getCid() %>\" readonly=\"true\"></input>",
    edit: "<%= Formbuilder.templates['edit/options']({ includeBlank: true, rf:rf }) %>\n<script >\n  $(function() {\n    $('#include_empty_option_<%= rf.getCid() %>').click(function(e) {\n      var $target = $(e.currentTarget),\n      $empty_option_div = $('#empty_option_div_<%= rf.getCid() %>');\n      if ($target.is(':checked')) {\n        $empty_option_div.show();\n      } else {\n        $empty_option_div.hide();\n      }\n    });\n  });\n</script>",
    addButton: "<span class=\"symbol\"><span class=\"icon-caret-down\"></span></span> Dropdown",
    print: "<label id=\"dropdown_print\"></label>",
    setValForPrint: function(field_view, model) {
      return field_view.$el.find('#dropdown_print').html(model.get('field_values')["" + (model.getCid()) + "_1"]);
    },
    checkAttributeHasValue: function(cid, $el) {
      if ($el.find('select').val() === '') {
        return false;
      }
      return cid;
    },
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "",
          checked: false
        }, {
          label: "",
          checked: false
        }
      ];
      attrs.field_options.include_blank_option = false;
      attrs.field_options.size = 'small';
      return attrs;
    },
    evalCondition: function(clicked_element, cid, condition, set_value) {
      var check_result, elem_val;
      (function(_this) {
        return (function(check_result) {});
      })(this)(false);
      elem_val = clicked_element.find("[name = " + cid + "_1]").val();
      if (typeof elem_val === 'number') {
        elem_val = parseInt(elem_val);
        set_value = parseInt(set_value);
      }
      check_result = condition(elem_val, set_value);
      return check_result;
    },
    add_remove_require: function(cid, required) {
      return $("." + cid).find("[name = " + cid + "_1]").attr("required", required);
    },
    android_setup: function(field_view, model, edit_fs_model) {
      if (model.attributes.field_values) {
        if (model.attributes.field_values["" + (model.getCid()) + "_1"] === '' && model.attributes.field_options.include_blank_option) {
          field_view.$el.find("input").val(model.attributes.field_options.empty_option_text);
          field_view.$el.find("input").data('id', '');
        } else {
          field_view.$el.find("input").val(model.attributes.field_values["" + (model.getCid()) + "_1"]);
          field_view.$el.find("input").data('id', model.attributes.field_values["" + (model.getCid()) + "_1"]);
        }
      } else if (model.attributes.field_options) {
        (function(opt) {
          var e, _i, _len, _results;
          if (opt[0]) {
            field_view.$el.find("input").val(opt[0].label);
            field_view.$el.find("input").data('id', opt[0].label);
          }
          if (model.attributes.field_options.include_blank_option) {
            field_view.$el.find("input").val(model.attributes.field_options.empty_option_text);
            field_view.$el.find("input").data('id', '');
          }
          _results = [];
          for (_i = 0, _len = opt.length; _i < _len; _i++) {
            e = opt[_i];
            _results.push((function(e) {
              if (e.checked) {
                field_view.$el.find("input").val(e.label);
                return field_view.$el.find("input").data('id', e.label);
              }
            })(e));
          }
          return _results;
        })(model.attributes.field_options.options);
      }
      return (function(field_dom) {
        if (field_dom.length > 0 && field_dom.val() !== '') {
          return field_view.trigger('change_state');
        }
      })(field_view.$el.find('input'));
    },
    setup: function(field_view, model, edit_fs_model) {
      if (model.attributes.field_values) {
        field_view.$el.find("select").val(model.attributes.field_values["" + (model.getCid()) + "_1"]);
      } else {
        (function(available_options) {
          return _.each(available_options, function(opt) {
            if (opt.checked) {
              return field_view.$el.find("select").val(opt.label);
            }
          });
        })(model.get(Formbuilder.options.mappings.OPTIONS));
      }
      return (function(field_dom) {
        if (field_dom.length > 0 && field_dom.val() !== '') {
          return field_view.trigger('change_state');
        }
      })(field_view.$el.find('select'));
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('email', {
    view: "<input type='email' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' />",
    edit: "",
    addButton: "<span class=\"symbol\"><span class=\"icon-envelope-alt\"></span></span> Email",
    print: "<label id=\"email_print\"></label>",
    setValForPrint: function(field_view, model) {
      return field_view.$el.find('#email_print').html(model.get('field_values')["" + (model.getCid()) + "_1"]);
    },
    checkAttributeHasValue: function(cid, $el) {
      if ($el.find('input[type=email]').val() === '') {
        return false;
      }
      return cid;
    },
    defaultAttributes: function(attrs) {
      attrs.field_options.size = 'medium';
      return attrs;
    },
    clearFields: function($el, model) {
      return $el.find("[name = " + model.getCid() + "_1]").val("");
    },
    evalCondition: function(clicked_element, cid, condition, set_value) {
      return (function(_this) {
        return function(check_result) {
          var elem_val;
          elem_val = clicked_element.find("[name = " + cid + "_1]").val();
          check_result = condition("'" + elem_val + "'", "'" + set_value + "'");
          return check_result;
        };
      })(this)(false);
    },
    add_remove_require: function(cid, required) {
      return $("." + cid).find("[name = " + cid + "_1]").attr("required", required);
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('esignature', {
    view: "<div class='esign-panel' style=\"display: inline-block;\" >\n<% if(rf.get(Formbuilder.options.mappings.CANVAS_WIDTH) || rf.get(Formbuilder.options.mappings.CANVAS_HEIGHT)) { %>\n  <img title=\"click here to change\" type='esignature' id='esign' class='canvas_img' style='width:<%= rf.get(Formbuilder.options.mappings.CANVAS_WIDTH) %>px;\n                  height:<%= rf.get(Formbuilder.options.mappings.CANVAS_HEIGHT) %>px;display:none;'></img>\n  <canvas\n      id=\"can\"\n      width='<%= rf.get(Formbuilder.options.mappings.CANVAS_WIDTH) %>px'\n      height='<%= rf.get(Formbuilder.options.mappings.CANVAS_HEIGHT) %>px'\n      style=\"display:none;\" class=\"esign_canvas\"\n  />\n<% } else\n  if(!rf.get(Formbuilder.options.mappings.CANVAS_WIDTH) && !rf.get(Formbuilder.options.mappings.CANVAS_HEIGHT)) { %>\n    <img title=\"click here to change\" type='esignature' id='esign' class='canvas_img' style='width:250px;height:150px;float:left;display:none;'></img>\n    <canvas\n        id=\"can\"\n        width='250px'\n        height='150px'\n        style=\"display:none;\" class=\"esign_canvas\"\n    />\n<% } %>\n<% if (typeof(Android) == 'undefined' && typeof(BRIJavaScriptInterface) == 'undefined') { %>\n<div class=\"esign_actions\" style=\"display:none;\">\n  <i class=\"esign_icons icon-refresh\" id=\"clr\" type=\"\" value=\"Clear\" title=\"clear\" style=\"max-width:70px;\"></i>\n  <i class=\"esign_icons icon-ok\" id=\"done\" type=\"\" value=\"Done\" title=\"done\" style=\"max-width:70px;\"></i>\n  <i class=\"esign_icons icon-remove\" id=\"cancel\" type=\"\" value=\"Cancel\" title=\"cancel\"  style=\"max-width:70px;\"></i>\n</div>\n<% } %>\n</div>",
    print: "<div class='esign-panel' style=\"display: inline-block;\" >\n<% if(rf.get(Formbuilder.options.mappings.CANVAS_WIDTH) || rf.get(Formbuilder.options.mappings.CANVAS_HEIGHT)) { %>\n  <img type='esignature' id='esign' class='canvas_img' style='width:<%= rf.get(Formbuilder.options.mappings.CANVAS_WIDTH) %>px;\n                  height:<%= rf.get(Formbuilder.options.mappings.CANVAS_HEIGHT) %>px;display:none;'></img>\n  <canvas\n      id=\"can\"\n      width='<%= rf.get(Formbuilder.options.mappings.CANVAS_WIDTH) %>px'\n      height='<%= rf.get(Formbuilder.options.mappings.CANVAS_HEIGHT) %>px'\n      style=\"display:none;\" class=\"esign_canvas\"\n  />\n<% } else\n  if(!rf.get(Formbuilder.options.mappings.CANVAS_WIDTH) && !rf.get(Formbuilder.options.mappings.CANVAS_HEIGHT)) { %>\n    <img type='esignature' id='esign' class='canvas_img' style='width:150px;height:100px;float:left;display:none;'></img>\n    <canvas\n        id=\"can\"\n        width='150px'\n        height='100px'\n        style=\"display:none;\" class=\"esign_canvas\"\n    />\n<% } %>\n</div>",
    edit: "<%= Formbuilder.templates['edit/canvas_options']() %>",
    addButton: "<span class=\"symbol\"><span class=\"icon-pen\"></span></span> E-Signature",
    checkAttributeHasValue: function(cid, $el) {
      return (function(_this) {
        return function(incomplete) {
          var call_back;
          call_back = function(k, v) {
            if (v.src === "") {
              return incomplete = true;
            }
          };
          $el.find("img").each(call_back);
          if (incomplete === true) {
            return false;
          }
          return cid;
        };
      })(this)(false);
    },
    add_remove_require: function(cid, required) {
      return $("." + cid).find("[name = " + cid + "_1]").attr("required", required);
    },
    isValid: function($el, model) {
      return (function(_this) {
        return function(valid, src) {
          valid = (function(required_attr, checked_chk_cnt, is_empty) {
            if (!required_attr) {
              return true;
            }
            src = $el.find("[name = " + model.getCid() + "_1]").attr('src');
            if (src) {
              is_empty = true;
            }
            return is_empty;
          })(model.get('required'), 0, false);
          return valid;
        };
      })(this)(false, null);
    },
    clearFields: function($el, model) {
      $el.find('.canvas_img').attr('src', '');
      return $el.find('.canvas_img').attr('upload_url', '');
    },
    fieldToValue: function($el, model) {
      return (function(_this) {
        return function(esig_can, comp_obj) {
          (function(key) {
            return comp_obj[key] = esig_can.attr('src');
          })(esig_can.attr('name'));
          return comp_obj;
        };
      })(this)($el.find('.canvas_img'), {});
    },
    assignSrcAndShowImg: function(base64_data_or_url, $img) {
      var regex4esign;
      regex4esign = /^data:image\/png;base64/;
      if (regex4esign.test(base64_data_or_url)) {
        $img.attr("src", base64_data_or_url);
      } else {
        $img.attr("upload_url", base64_data_or_url);
        makeRequest(base64_data_or_url, $img.attr("name"));
      }
      return $img.show();
    },
    android_setup: function(field_view, model) {
      return (function(_this) {
        return function(model_cid, upload_url, $img, esig_fl_vals, _that) {
          if (model.get('new_page')) {
            return $img.hide();
          }
          if (!model.get('field_values') || _.isEmpty(model.get('field_values')) || model.get('field_values')["" + model_cid + "_1"] === '') {
            esig_fl_vals = JSON.parse(Android.getEsigImageData(model_cid + '_' + 1));
            model.set({
              'field_values': esig_fl_vals
            }, {
              silent: true
            });
          }
          if (model.get('field_values') && model.get('field_values')["" + model_cid + "_1"]) {
            return _that.assignSrcAndShowImg(model.get('field_values')["" + model_cid + "_1"], $img);
          } else if (model.get('field_values') && model.get('field_values')["0"]) {
            return _that.assignSrcAndShowImg(model.get('field_values')["0"]["" + model_cid + "_1"], $img);
          } else if ($img.attr('src') && $img.attr('src') !== '') {
            return $img.show();
          } else {
            return $img.hide();
          }
        };
      })(this)(model.getCid(), '', field_view.$el.find('img'), {}, this);
    },
    setup: function(field_view, model) {
      return (function(_this) {
        return function(model_cid, upload_url, $img, _that) {
          var regex4esign;
          if (model.get('field_values') && model.get('field_values')["" + model_cid + "_1"]) {
            _that.assignSrcAndShowImg(model.get('field_values')["" + model_cid + "_1"], $img);
            return regex4esign = /^data:image\/png;base64/;
          } else if ($img.attr('src') && $img.attr('src') !== '') {
            return $img.show();
          } else {
            return $img.hide();
          }
        };
      })(this)(model.getCid(), '', field_view.$el.find('img'), this);
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('file', {
    view: "<span id='file_name_<%= rf.getCid() %>'></span>\n<a target=\"_blank\" class=\"active_link\"></a>\n<input\n  id='file_<%= rf.getCid() %>'\n  type='file'\n  class='icon-folder-open file_field'\n  cid=\"<%= rf.getCid() %>\"\n  accept=\"<%= rf.get(Formbuilder.options.mappings.ALLOWED_FILE_TYPES) %>\"\n  for-ios-file-size=\"<%= rf.get(Formbuilder.options.mappings.MAX) %>\"\n/>\n<div id=\"file_upload_link_<%= rf.getCid() %>\"></div>\n<script>\n  $(function() {\n    $(\"#file_<%= rf.getCid() %>\").filestyle({\n      input: false,\n      buttonText: \"<%= rf.get(Formbuilder.options.mappings.FILE_BUTTON_TEXT)%>\"\n    });\n\n    setTimeout(function(){\n      if ($('a[name=\"<%= rf.getCid() %>_1\"]').text() != \"\"){\n        $(\"#file_<%= rf.getCid() %>\").attr('required',false);\n        $(\"#file_name_<%= rf.getCid() %>\").text('');\n      }\n    },1000);\n\n    $('#file_<%= rf.getCid() %>').change(function(){\n      $('#file_name_<%= rf.getCid() %>').text(this.files[0].name);\n      var max_size = 1024*1024*'<%= rf.get(Formbuilder.options.mappings.MAX) || 10000%>'\n      if(this.files[0].size <= max_size){\n        return true;\n      }\n      else{\n        bri_alerts(\"Please select file size less that <%= rf.get(Formbuilder.options.mappings.MAX) %> MB\", 'error');\n        $(\"#file_<%= rf.getCid() %>\").filestyle(\"clear\");\n        $(\"#file_<%= rf.getCid() %>\").replaceWith($(\"#file_<%= rf.getCid() %>\").clone(true));\n        $('#file_name_<%= rf.getCid() %>').text('');\n      }\n    });\n  });\n</script>",
    edit: "\n<div class='fb-edit-section-header'>Options</div>\n\n<div class=\"span12\">\n  <span>Change Button Text:</span>\n  <input\n    type=\"text\"\n    class=\"span12\"\n    data-rv-input=\"model.<%= Formbuilder.options.mappings.FILE_BUTTON_TEXT %>\"\n  >\n  </input>\n</div>\n\n<div class=\"span12\">\n  <span>Allowed File Types:</span>\n  <textarea\n    class=\"span12\"\n    data-rv-input=\"model.<%= Formbuilder.options.mappings.ALLOWED_FILE_TYPES %>\"\n  >\n  </textarea>\n</div>\n\n<div class=\"span12\">\n  <span>Max File Size in MB:</span>\n  <input\n    class=\"span3\"\n    type=\"number\"\n    data-rv-input=\"model.<%= Formbuilder.options.mappings.MAX %>\"\n    style=\"width: 80px\"\n  />\n</div>",
    print: "<div id=\"file_upload_link_<%= rf.getCid() %>\"></div>",
    addButton: "<span class=\"symbol\"><span class=\"icon-cloud-upload\"></span></span> File",
    clearFields: function($el, model) {
      return $el.find('a[type=pic_video_audio]').text('');
    },
    fieldToValue: function($el, model) {
      return (function(_this) {
        return function(link_ele, comp_obj) {
          (function(key, link_href) {
            if (_.isEmpty(link_href)) {
              return comp_obj[key] = {
                'name': link_ele.text(),
                'url': link_ele.text()
              };
            } else {
              return comp_obj[key] = {
                'name': link_ele.text(),
                'url': link_href
              };
            }
          })(link_ele.attr('name'), link_ele.attr('href'));
          return comp_obj;
        };
      })(this)($el.find('a[type=pic_video_audio]'), {});
    },
    checkAttributeHasValue: function(cid, $el) {
      return (function(_this) {
        return function(incomplete) {
          var call_back, call_back_create_mode;
          call_back = function(k, v) {
            if (v.href === "") {
              return incomplete = true;
            }
          };
          call_back_create_mode = function(k, v) {
            if (v.innerHTML === "") {
              return incomplete = true;
            }
          };
          if ($el.find('.active_link_doc').length === 0 && $el.find('#file_name_' + cid).length === 0) {
            return false;
          }
          $el.find('#file_name_' + cid).each(call_back_create_mode);
          $el.find('.active_link_doc').each(call_back);
          if (incomplete === true) {
            return false;
          }
          return cid;
        };
      })(this)(false);
    },
    add_remove_require: function(cid, required) {
      $("." + cid).find("[name = " + cid + "_1]").attr("required", required);
      return $("." + cid).find("[name = " + cid + "_2]").attr("required", required);
    },
    android_bindevents: function(field_view) {
      return (function(_this) {
        return function(btn_input_file, _that, view_index) {
          return $(btn_input_file).on("click", function() {
            view_index = field_view.model.get('view_index');
            if (!view_index) {
              view_index = 0;
            }
            Android.f2dSelectFile(field_view.model.getCid(), "file_upload", $(btn_input_file).attr("for-ios-file-size").toString(), view_index);
          });
        };
      })(this)(field_view.$el.find('input[type=button]'), this, 0);
    },
    android_setup: function(field_view, model) {
      return (function(_this) {
        return function(model_cid, file_url, $link_ele, _that) {
          if (model.get('field_values') && model.get('field_values')["" + model_cid + "_2"]) {
            $link_ele.text(model.get('field_values')["" + model_cid + "_2"]['name']);
            return $link_ele.attr('href', model.get('field_values')["" + model_cid + "_2"]['url']);
          }
        };
      })(this)(model.getCid(), '', field_view.$el.find('a[type=pic_video_audio]'), this);
    },
    setup: function(field_view, model) {
      return (function(_this) {
        return function(model_cid, file_url, $link_ele, _that) {
          if (model.get('field_values') && model.get('field_values')["" + model_cid + "_2"]) {
            $link_ele.text(model.get('field_values')["" + model_cid + "_2"]['name']);
            return $link_ele.attr('href', model.get('field_values')["" + model_cid + "_2"]['url']);
          }
        };
      })(this)(model.getCid(), '', field_view.$el.find('a[type=pic_video_audio]'), this);
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('fullname', {
    prefix: ['Mr.', 'Mrs.', 'Miss.', 'Ms.', 'Mst.', 'Dr.'],
    view: "<div class='input-line'>\n<% if(Formbuilder.isAndroid()) { %>\n  <span class=\"rf-size-mini\">\n<%}else {%>\n  <span>\n<% } %>\n  <% if(Formbuilder.isAndroid()) { %>\n    <% var opt={};%>\n    <% _.each(this.prefix, function(val,index){ %>\n    <% var temp = {}; temp[val] = val ; opt[index] = temp; %>\n    <% }); %>\n    <input id=\"prefix_option_<%= rf.getCid()%>\" value=\"<%= this.prefix[0] %>\" readonly=\"readonly\" data-prefixlist='<%= JSON.stringify(opt) %>'></input>\n  <%} else { %>\n    <select class='span12'>\n      <% _.each(this.prefix, function(val){ %>\n        <option><%= val %></option>\n      <% }); %>\n    </select>\n  <% } %>\n    <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_PREFIX_TEXT) || 'Prefix' %></label>\n  </span>\n\n  <span>\n    <input id='first_name' type='text' pattern=\"[a-zA-Z]+\"/>\n    <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_FIRST_TEXT) || 'First' %></label>\n  </span>\n\n  <% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n    <span id='middle_name_span_<%= rf.getCid() %>'>\n      <input id='middle_name' type='text' pattern=\"[a-zA-Z]+\"/>\n      <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_MIDDLE_TEXT) || 'Middle' %></label>\n    </span>\n  <% } %>\n\n  <span>\n    <input id='last_name' type='text' pattern=\"[a-zA-Z]+\"/>\n    <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_LAST_TEXT) || 'Last' %></label>\n  </span>\n\n  <% if (rf.get(Formbuilder.options.mappings.INCLUDE_SUFFIX)) { %>\n    <span>\n      <input id='suffix' type='text'/>\n      <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_SUFFIX_TEXT) || 'Suffix' %></label>\n    </span>\n  <% } %>\n</div>",
    edit: "<%= Formbuilder.templates['edit/middle']({ includeOther: true, rf:rf }) %>\n<%= Formbuilder.templates['edit/suffix']({ includeSuffix: false, rf:rf }) %>\n<%= Formbuilder.templates['edit/full_name_label_values']({ rf:rf }) %>\n<script >\n  $(function() {\n    $('#include_middle_name_<%= rf.getCid() %>').click(function(e) {\n      var $target = $(e.currentTarget),\n      $parent_middle_div = $('#middle_name_div_<%= rf.getCid() %>'),\n      $middle_name_ip = $parent_middle_div.find('input'),\n      $view_middle_name_lbl = $('#middle_name_span_<%= rf.getCid() %> label'),\n      middle_text = '<%= rf.get(Formbuilder.options.mappings.FULLNAME_MIDDLE_TEXT) %>';\n      if ($target.is(':checked')) {\n        $parent_middle_div.show();\n        $middle_name_ip.val(middle_text);\n        $view_middle_name_lbl.text(middle_text || 'Middle');\n      } else {\n        $parent_middle_div.hide();\n        $middle_name_ip.val('');\n      }\n    });\n  });\n</script>",
    print: "<table class=\"innerTbl\">\n  <tbody>\n    <tr>\n      <td>\n        <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_PREFIX_TEXT) || 'Prefix' %></label>\n      </td>\n      <td>\n        <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_FIRST_TEXT) || 'First' %></label>\n      </th>\n      <% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n        <td>\n          <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_MIDDLE_TEXT) || 'Middle' %></label>\n        </td>\n      <% } %>\n      <td>\n        <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_LAST_TEXT) || 'Last' %></label>\n      </td>\n      <% if (rf.get(Formbuilder.options.mappings.INCLUDE_SUFFIX)) { %>\n      <td>\n        <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_SUFFIX_TEXT) || 'Suffix' %></label>\n      </td>\n      <% } %>\n    </tr>\n    <tr id=\"values\">\n      <td>\n        <label id=\"prefix_print\"></label>\n      </td>\n      <td>\n        <label id=\"first_name_print\"></label>\n      </td>\n      <% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n      <td>\n        <label id=\"middle_name_print\"></label>\n      </td>\n      <% } %>\n      <td>\n        <label id=\"last_name_print\"></label>\n      </td>\n      <% if (rf.get(Formbuilder.options.mappings.INCLUDE_SUFFIX)) { %>\n      <td>\n        <label id=\"suffix_print\"></label>\n      </td>\n      <% } %>\n    </tr>\n  </tbody>\n</table>",
    addButton: "<span class=\"symbol\"><span class=\"icon-user\"></span></span> Full Name",
    checkAttributeHasValue: function(cid, $el) {
      return (function(_this) {
        return function(incomplete) {
          var call_back;
          call_back = function() {
            if ($(this).val() === "") {
              return incomplete = true;
            }
          };
          $el.find("input[type=text]").each(call_back);
          if ($el.find('select').val() === "") {
            incomplete = true;
          }
          if (incomplete === true) {
            return false;
          }
          return cid;
        };
      })(this)(false);
    },
    isValid: function($el, model) {
      return (function(_this) {
        return function(valid) {
          valid = (function(required_attr, checked_chk_cnt) {
            if (!required_attr) {
              return true;
            }
            return $el.find("#first_name").val() !== '' && $el.find("#last_name").val() !== '';
          })(model.get('required'), 0);
          return valid;
        };
      })(this)(false);
    },
    clearFields: function($el, model) {
      $el.find("#first_name").val("");
      if ($el.find("#middle_name")) {
        $el.find("#middle_name").val("");
      }
      $el.find("#last_name").val("");
      return $el.find("#suffix").val("");
    },
    setValForPrint: function(field_view, model) {
      return (function(_this) {
        return function(fields, values, i) {
          var key, _results;
          _results = [];
          for (key in values) {
            _results.push($(fields[i]).html(values["" + (model.getCid()) + "_" + (++i)]));
          }
          return _results;
        };
      })(this)(field_view.$el.find('#values').find('label'), model.get('field_values'), 0);
    },
    evalCondition: function(clicked_element, cid, condition, set_value) {
      var check_result, elem_val;
      (function(_this) {
        return (function(elem_val, check_result) {});
      })(this)('', false);
      elem_val = clicked_element.find("#first_name").val();
      check_result = condition("'" + elem_val + "'", "'" + set_value + "'");
      return check_result;
    },
    add_remove_require: function(cid, required) {
      $("." + cid).find("[name = " + cid + "_1]").attr("required", required);
      $("." + cid).find("[name = " + cid + "_2]").attr("required", required);
      return $("." + cid).find("[name = " + cid + "_3]").attr("required", required);
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('gmap', {
    view: "<a style=\"min-width: 100px ;height: 35px;padding-top: 5px;padding-bottom: 5px;text-decoration: underline;\" id=\"gmap_button\" type='gmap'>Select Your Address</a>\n<input id='current_user_latlng_points' type='text' class='hidden' value=''>",
    edit: "",
    print: "<div class=\"centered_td\">\n  <% if(rf.get('field_type') === 'gmap') { %>\n    <% var lat_long_arr = ['-25.363882','131.044922'],\n       mapAttr = rf.get('field_values');\n    %>\n    <% if(mapAttr){ %>\n      <% if(mapAttr[ rf.get('cid') +'_1']){ %>\n        <% var location = mapAttr[ rf.get('cid') +'_1'],\n           lat_long_str = mapAttr[ rf.get('cid') +'_2'],\n           lat_long_arr = (mapAttr[ rf.get('cid') +'_2']).split(','),\n           lat = lat_long_arr[0],\n           long = lat_long_arr[1];\n        %>\n      <% } %>\n    <% } %>\n  <% } %>\n  <div class=\"lat_long_wrapper\">\n    <ul>\n      <li>\n        <label type=\"text\" id=\"print_lat_gmap\">Latitude : <%= (lat)? lat : '' %></label>\n      </li>\n      <li>\n        <label type=\"text\" id=\"print_long_gmap\" >Longitude : <%= (long)? long : '' %></label>\n      </li>\n      <li>\n        <%= (location)? location : '' %>\n      </li>\n    </ul>\n    <div id=\"map-canvas\">\n      <% if(lat_long_str){ %>\n      <img src=<%= \"http://maps.googleapis.com/maps/api/staticmap?center=\"+lat_long_str+\"&zoom=13&size=400x400&sensor=false&markers=color:red|\"+lat_long_str %> />\n      <% } %>\n    </div>\n  </div>\n</div>",
    addButton: "<span class=\"symbol\"><span class=\"icon-map-marker\"></span></span> Geo-Location",
    addRequiredConditions: function(model) {
      var close_button, disabled, hide_class, read_only;
      read_only = (Formbuilder.options.FIELD_CONFIGS ? Formbuilder.options.FIELD_CONFIGS[model.get('field_type')]['read_only'] : false);
      disabled = (read_only ? "disabled" : "");
      hide_class = (read_only ? "hide" : "");
      close_button = (read_only ? "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>" : "");
      return $('<div class="modal fade" id="gmapModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <div class="geo-location-panel top-panel1"> <table> <tr><td> <input id="gmap_latlng" class="geo-location-panel1" type="textbox" ' + disabled + '/> <input type="button" value="Lat,Long" onclick="codeLatLngPopulateAddress()" class="' + hide_class + '"/> </td></tr><tr><td> <input id="gmap_address" class="geo-location-panel1" type="textbox" ' + disabled + ' /> <input type="button" value="Location" onclick="codeAddress()" class="' + hide_class + '"/> </td></tr> </table> </div> </div> <div class="modal-body"> <div id="map-canvas"/> </div> <div class="modal-footer"> <button type="button" class="btn btn-default btn-success ' + hide_class + '" id="gmap_ok" data-dismiss="modal">Ok</button>' + close_button + '</div> </div> </div> </div>').appendTo('body');
    },
    isValid: function($el, model) {
      return (function(_this) {
        return function(valid) {
          valid = (function(required_attr) {
            if (!required_attr) {
              return true;
            }
            return $el.find("[name = " + model.getCid() + "_1]").text() !== '';
          })($el.find("[name = " + model.getCid() + "_1]").attr("required"));
          return valid;
        };
      })(this)(false);
    },
    clearFields: function($el, model) {
      $el.find('a').text('Select Your Address');
      return $el.find('input').val('');
    },
    fieldToValue: function($el, model) {
      return (function(all_elem, res) {
        _.each(all_elem, function(elem) {
          return (function($elem) {
            if ($elem.is("a")) {
              return res[$elem.attr('name')] = $elem.text();
            } else if ($elem.is("input")) {
              return res[$elem.attr('name')] = $elem.val();
            }
          })($(elem));
        });
        return res;
      })($el.find('[name^=' + model.getCid() + ']'), {});
    },
    clickGmapButton: function(model) {
      return $("[name = " + model.getCid() + "_1]").bind('click', (function(_this) {
        return function(ev) {
          if ($('#gmapModal').length === 0) {
            if (_this.addRequiredConditions) {
              _this.addRequiredConditions(model);
            }
          }
          $('#gmap_ok').val(model.getCid());
          $('#gmapModal').modal({
            show: true
          });
          $("#gmapModal").on("shown.bs.modal", function(e) {
            var gmap_button_value;
            gmap_button_value = $("[name = " + getCid() + "_2]").val();
            initialize();
            $("#gmap_address").keypress(function(event) {
              set_prev_lat_lng($('#gmap_latlng').val());
              if (event.keyCode === 13) {
                return codeAddress();
              }
            });
            $("#gmap_latlng").keypress(function(event) {
              set_prev_address($("#gmap_address").val());
              if (event.keyCode === 13) {
                return codeLatLng();
              }
            });
            if (gmap_button_value !== '') {
              set_prev_lat_lng(gmap_button_value);
              return codeLatLng(gmap_button_value);
            }
          });
          return $('#gmapModal').on('hidden.bs.modal', function(e) {
            $('#gmapModal').off('shown').on('shown');
            $(this).removeData("modal");
            $("#gmap_address").unbind('keypress');
            return $("#gmap_latlng").unbind('keypress');
          });
        };
      })(this));
    },
    setup: function(field_view, model) {
      (function(_this) {
        return (function($input) {
          var get_user_location;
          if (model.attributes.field_values) {
            field_view.$el.find($("[name = " + model.getCid() + "_1]")).text(model.attributes.field_values["" + (model.getCid()) + "_1"]);
            $input.val(model.attributes.field_values["" + (model.getCid()) + "_2"]);
          } else {
            if (!(model.get('field_values') && model.get('field_values')[name])) {
              get_user_location = getCurrentLocation(model.getCid());
              if (get_user_location !== 'false') {
                $("[name = " + model.getCid() + "_1]").text(get_user_location);
              } else {
                $("[name = " + model.getCid() + "_1]").text('Select Your Address');
              }
            }
          }
          if ($input.val() !== '') {
            return field_view.trigger('change_state');
          }
        });
      })(this)(field_view.$el.find($("[name = " + model.getCid() + "_2]")));
      return this.clickGmapButton(model);
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('heading', {
    type: 'non_input',
    view: "<label id='<%= rf.getCid() %>' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'>\n  <%= rf.get(Formbuilder.options.mappings.LABEL) %>\n</label>\n<p class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'>\n  <%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %>\n</p>",
    edit: "<div class=''>Heading Title</div>\n<input type='text'\n  data-rv-input='model.<%= Formbuilder.options.mappings.LABEL %>' />\n<textarea\n  data-rv-input='model.<%= Formbuilder.options.mappings.DESCRIPTION %>'\n  placeholder='Add a longer description to this field'>\n</textarea>\n<%= Formbuilder.templates['edit/size']() %>",
    print: "<label id='<%= rf.getCid() %>' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %> print-heading'>\n  <%= rf.get(Formbuilder.options.mappings.LABEL) %>\n</label>\n<p class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'>\n  <%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %>\n</p>",
    addButton: "<span class='symbol'><span class='icon-font'></span></span> Heading",
    clearFields: function($el, model) {
      return $el.find('#' + model.getCid()).text('');
    },
    evalCondition: function(clicked_element, cid, condition, set_value) {
      return (function(_this) {
        return function(check_result) {
          var elem_val;
          elem_val = clicked_element.find("#" + cid).text();
          elem_val = elem_val.replace(/(\r\n|\n|\r)/gm, '');
          elem_val = elem_val.trimLeft();
          check_result = condition("'" + elem_val + "'", "'" + set_value + "'");
          return check_result;
        };
      })(this)(false);
    },
    add_remove_require: function(cid, required) {
      return $("." + cid).find("#" + cid).attr("required", required);
    },
    defaultAttributes: function(attrs) {
      attrs.field_options.size = 'medium';
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('image', {
    view: "<div\n  style=\"\n    text-align: <%= rf.get(Formbuilder.options.mappings.IMAGEALIGN) %>;\n  \"\n>\n<% var image_link;%>\n<% if(typeof rf.get(Formbuilder.options.mappings.IMAGELINK) != \"undefined\"){ %>\n  <% if(rf.get(Formbuilder.options.mappings.IMAGELINK) != \"\"){ %>\n    <% image_link = rf.get(Formbuilder.options.mappings.IMAGELINK)%>\n  <% } %>\n<% } %>\n  <a\n    class='image_link_form'\n    target='_blank'\n    <%= image_link ? 'href='+image_link : '' %>\n  >\n    <img\n      id='img_<%= rf.getCid() %>'\n      src='<%= rf.get(Formbuilder.options.mappings.IMAGE_DATA) %>'\n      style=\"\n        width:<%= rf.get(Formbuilder.options.mappings.IMAGEWIDTH) %>px;\n        height:<%= rf.get(Formbuilder.options.mappings.IMAGEHEIGHT) %>px\n      \"\n    />\n  </a>\n</div>",
    edit: "<div class='fb-edit-section-header'>Upload File</div>\n<input id='<%= rf.getCid() %>' type='file' accept=\"image/jpeg, image/png\"/>\n<input\n  class='hide'\n  id='text_<%= rf.getCid() %>'\n  data-rv-value='model.<%= Formbuilder.options.mappings.IMAGE_DATA %>'\n/>\n<%= Formbuilder.templates['edit/image_options']() %>\n<script>\n  $(function() {\n    function readURL(input) {\n      if (input.files && input.files[0]) {\n        var reader = new FileReader();\n\n        reader.onloadend = function (e) {\n          $('#text_<%= rf.getCid() %>').val(e.target.result);\n          $('#text_<%= rf.getCid() %>').trigger(\"change\");\n        }\n        reader.readAsDataURL(input.files[0]);\n      }\n    }\n\n    $('#<%= rf.getCid() %>').change(function(){\n        if(this.files[0].size <= 1048576){\n          readURL(this);\n        }\n        else{\n          alert(\"Please select file size less that 1 MB\")\n        }\n    });\n  });\n</script>",
    addButton: "<span class=\"symbol\"><span class=\"icon-picture\"></span></span> Image",
    checkAttributeHasValue: function(cid, $el) {
      return (function(_this) {
        return function(incomplete) {
          var call_back;
          call_back = function(k, v) {
            if (v.src === "") {
              return incomplete = true;
            }
          };
          $el.find("img").each(call_back);
          if (incomplete === true) {
            return false;
          }
          return cid;
        };
      })(this)(false);
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('number', {
    view: "<input type='number'/>\n<% if (units = rf.get(Formbuilder.options.mappings.UNITS)) { %>\n  <%= units %>\n<% } %>",
    edit: "<%= Formbuilder.templates['edit/min_max_step']() %>\n<%= Formbuilder.templates['edit/units']() %>\n<%= Formbuilder.templates['edit/default_number_value']() %>\n<%= Formbuilder.templates['edit/integer_only']() %>",
    addButton: "<span class=\"symbol\"><span class=\"icon-number\">123</span></span> Number",
    print: "<label id=\"number_print\"></label>",
    setValForPrint: function(field_view, model) {
      return field_view.$el.find('#number_print').html(model.get('field_values')["" + (model.getCid()) + "_1"]);
    },
    checkAttributeHasValue: function(cid, $el) {
      if ($el.find('input[type=number]').val() === "") {
        return false;
      }
      return cid;
    },
    defaultAttributes: function(attrs) {
      attrs.field_options.size = 'small';
      return attrs;
    },
    setup: function(field_view, model) {
      var el, rounded_value;
      el = field_view.$el.find('input');
      if (model.get(Formbuilder.options.mappings.MIN)) {
        el.attr("min", model.get(Formbuilder.options.mappings.MIN));
      }
      if (model.get(Formbuilder.options.mappings.MAX)) {
        el.attr("max", model.get(Formbuilder.options.mappings.MAX));
      }
      if (!model.get(Formbuilder.options.mappings.INTEGER_ONLY) && model.get(Formbuilder.options.mappings.STEP)) {
        if (model.get(Formbuilder.options.mappings.STEP)) {
          el.attr("step", model.get(Formbuilder.options.mappings.STEP));
        } else {
          el.attr("step", 'any');
        }
      } else if (!model.get(Formbuilder.options.mappings.INTEGER_ONLY)) {
        el.attr("step", 'any');
      } else {
        if (model.get(Formbuilder.options.mappings.STEP)) {
          rounded_value = Math.round(model.get(Formbuilder.options.mappings.STEP));
          el.attr("step", rounded_value);
        }
      }
      if (model.get(Formbuilder.options.mappings.DEFAULT_NUM_VALUE)) {
        el.val(model.get(Formbuilder.options.mappings.DEFAULT_NUM_VALUE));
      }
      if (model.get('field_values')) {
        el.val(model.get('field_values')["" + (model.getCid()) + "_1"]);
      }
      if (el.val() !== '') {
        return field_view.trigger('change_state');
      }
    },
    clearFields: function($el, model) {
      return (function(_this) {
        return function($input) {
          $input.val("");
          if (model.get(Formbuilder.options.mappings.DEFAULT_NUM_VALUE)) {
            return $input.val(model.get(Formbuilder.options.mappings.DEFAULT_NUM_VALUE));
          }
        };
      })(this)($el.find("[name = " + model.getCid() + "_1]"));
    },
    evalCondition: function(clicked_element, cid, condition, set_value) {
      return (function(_this) {
        return function(check_result) {
          var elem_val;
          elem_val = clicked_element.find("[name = " + cid + "_1]").val();
          if (isNaN(parseInt(elem_val)) || isNaN(parseInt(set_value))) {
            check_result = false;
          } else {
            check_result = condition("'" + elem_val + "'", "'" + set_value + "'");
          }
          return check_result;
        };
      })(this)(false);
    },
    add_remove_require: function(cid, required) {
      return $("." + cid).find("[name = " + cid + "_1]").attr("required", required);
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('paragraph', {
    view: "<textarea class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'></textarea>",
    print: "<label id=\"paragraph_print\"></label>",
    edit: "<%= Formbuilder.templates['edit/size']() %>\n<%= Formbuilder.templates['edit/min_max_length']({rf:rf}) %>\n<%= Formbuilder.templates['edit/default_paragraph_value']() %>",
    addButton: "<span class=\"symbol\">&#182;</span> Paragraph",
    checkAttributeHasValue: function(cid, $el) {
      if ($el.find('textarea').val() === "") {
        return false;
      }
      return cid;
    },
    defaultAttributes: function(attrs) {
      attrs.field_options.size = 'medium';
      return attrs;
    },
    android_bindevents: function(field_view) {
      return (function(_this) {
        return function(el) {
          return el.focus(function(event) {
            console.log("in paragraphs android_bindevents");
            el.css('width', '100%');
            return $('#grid_div').animate({
              scrollTop: el.offset().top + $('#grid_div').scrollTop() - 20
            }, 1000);
          });
        };
      })(this)(field_view.$el.find('textarea'));
    },
    setup: function(field_view, model) {
      var el;
      el = field_view.$el.find('textarea');
      if (model.get(Formbuilder.options.mappings.MINLENGTH)) {
        (function(min_length) {
          return el.attr("pattern", "[a-zA-Z0-9_\\s]{" + min_length + ",}");
        })(model.get(Formbuilder.options.mappings.MINLENGTH));
      }
      if (model.get(Formbuilder.options.mappings.MAXLENGTH)) {
        el.attr("maxlength", model.get(Formbuilder.options.mappings.MAXLENGTH));
      }
      if (model.get(Formbuilder.options.mappings.DEFAULT_VALUE)) {
        el.val(model.get(Formbuilder.options.mappings.DEFAULT_VALUE));
      }
      if (model.get('field_values')) {
        el.val(model.get('field_values')["" + (model.getCid()) + "_1"]);
      }
      if (field_view.$el.find('textarea').val() !== '') {
        return field_view.trigger('change_state');
      }
    },
    clearFields: function($el, model) {
      return (function(_this) {
        return function($input) {
          $input.val("");
          if (model.get(Formbuilder.options.mappings.DEFAULT_VALUE)) {
            $input.val(model.get(Formbuilder.options.mappings.DEFAULT_VALUE));
            return $input.val(model.get(Formbuilder.options.mappings.DEFAULT_VALUE));
          }
        };
      })(this)($el.find("[name = " + model.getCid() + "_1]"));
    },
    setValForPrint: function(field_view, model) {
      return field_view.$el.find('#paragraph_print').html(model.get('field_values')["" + (model.getCid()) + "_1"]);
    },
    evalCondition: function(clicked_element, cid, condition, set_value) {
      return (function(_this) {
        return function(check_result) {
          var elem_val;
          elem_val = clicked_element.find("[name = " + cid + "_1]").val();
          check_result = condition("'" + elem_val + "'", "'" + set_value + "'");
          return check_result;
        };
      })(this)(false);
    },
    add_remove_require: function(cid, required) {
      return $("." + cid).find("[name = " + cid + "_1]").attr("required", required);
    },
    isValid: function($el, model) {
      return (function(_this) {
        return function(valid) {
          valid = (function(required_attr, textarea_char_cnt, min_length, max_length) {
            if (!required_attr) {
              return true;
            }
            textarea_char_cnt = $el.find('textarea').val().length;
            if (!min_length && !max_length) {
              if (textarea_char_cnt === 0) {
                return false;
              }
              return true;
            } else if (min_length && max_length) {
              return textarea_char_cnt >= parseInt(min_length) && textarea_char_cnt <= parseInt(max_length);
            } else if (min_length) {
              return textarea_char_cnt >= parseInt(min_length);
            } else if (max_length) {
              return textarea_char_cnt <= parseInt(max_length);
            }
            return true;
          })(model.get('required'), 0, model.get(Formbuilder.options.mappings.MINLENGTH), model.get(Formbuilder.options.mappings.MAXLENGTH));
          return valid;
        };
      })(this)(false);
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('phone_number', {
    view: "<input id='<%= rf.getCid() %>phone' type='tel'/>",
    edit: "<%= Formbuilder.templates['edit/country_code']({rf:rf}) %>\n    <script>\n      $(function() {\n        var pref_countries = [\"au\", \"gb\", \"us\"];\n        var ph_no_conf = Formbuilder.options.FIELD_CONFIGS['phone_number'];\n        if(!_.isUndefined(ph_no_conf) && ph_no_conf['preferredCountries']) {\n          pref_countries = ph_no_conf['preferredCountries'];\n        }\n        $('#<%= rf.getCid() %>_country_code').intlTelInput({\n            autoHideDialCode: false,\n            preferredCountries: pref_countries\n        });\n        $(\"#<%= rf.getCid() %>_country_code\").val();\n        $(\"#<%= rf.getCid() %>_country_code\").trigger('change');\n      });\n    </script>\n    <%= Formbuilder.templates['edit/area_code']() %>\n<%= Formbuilder.templates['edit/mask_value']() %>",
    addButton: "<span class=\"symbol\"><span class=\"icon-phone\"></span></span> Phone Number",
    print: "<label id=\"phone_print\"></label>",
    setValForPrint: function(field_view, model) {
      return field_view.$el.find('#phone_print').html(model.get('field_values')["" + (model.getCid()) + "_1"]);
    },
    checkAttributeHasValue: function(cid, $el) {
      if ($el.find('input[type=tel]').val() === "") {
        return false;
      }
      return cid;
    },
    setup: function(field_view, model) {
      return (function(_this) {
        return function(mask_value, country_code, country_code_set) {
          var area_code;
          country_code = model.get(Formbuilder.options.mappings.COUNTRY_CODE);
          mask_value = model.get(Formbuilder.options.mappings.MASK_VALUE);
          if (country_code && mask_value) {
            $('#' + model.getCid() + 'phone').val(country_code + ')');
          } else if (country_code) {
            $('#' + model.getCid() + 'phone').val(country_code);
          }
          country_code_set = $('#' + model.getCid() + 'phone').val();
          area_code = model.get(Formbuilder.options.mappings.AREA_CODE);
          if (area_code && mask_value) {
            $('#' + model.getCid() + 'phone').val(country_code_set + area_code + ')');
          } else if (area_code) {
            $('#' + model.getCid() + 'phone').val(country_code_set + area_code);
          }
          if (mask_value) {
            $('#' + model.getCid() + 'phone').mask(mask_value);
          }
          if (model.get('field_values')) {
            field_view.$el.find('input').val(model.get('field_values')["" + (model.getCid()) + "_1"]);
          }
          if (field_view.$el.find('input').val() !== '') {
            return field_view.trigger('change_state');
          }
        };
      })(this)(false, false, '');
    },
    clearFields: function($el, model) {
      return $el.find("[name = " + model.getCid() + "_1]").val("");
    },
    evalCondition: function(clicked_element, cid, condition, set_value) {
      return (function(_this) {
        return function(check_result) {
          var elem_val;
          elem_val = clicked_element.find("[name = " + cid + "_1]").val();
          check_result = condition("'" + elem_val + "'", "'" + set_value + "'");
          return check_result;
        };
      })(this)(false);
    },
    add_remove_require: function(cid, required) {
      return $("." + cid).find("[name = " + cid + "_1]").attr("required", required);
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('price', {
    view: "<div class='input-line'>\n  <span class='above-line'>$</span>\n  <span class='dolars'>\n    <input type='text' pattern=\"[0-9]+\" />\n    <label>Dollars</label>\n  </span>\n  <span class='above-line'>.</span>\n  <span class='cents'>\n    <input type='text' pattern=\"[0-9]+\" />\n    <label>Cents</label>\n  </span>\n</div>",
    edit: "",
    print: "<div>\n <% var all_attr =  rf.get('field_values'),\n    cid =  rf.get('cid');\n %>\n <% if(all_attr){ %>\n <label class='above-line'>$</label>\n <label><%= (all_attr[cid + '_1'] && all_attr[cid + '_1'] || '') %></label>\n <label class='above-line'>.</label>\n <label><%= (all_attr[cid + '_2'] && all_attr[cid + '_2'] || '') %></label>\n <% } %>\n</div>",
    addButton: "<span class=\"symbol\"><span class=\"icon-dollar\"></span></span> Price",
    checkAttributeHasValue: function(cid, $el) {
      return (function(_this) {
        return function(incomplete) {
          var call_back;
          call_back = function(k, v) {
            if (v.value === "") {
              return incomplete = true;
            }
          };
          $el.find("input[type=text]").each(call_back);
          if (incomplete === true) {
            return false;
          }
          return cid;
        };
      })(this)(false);
    },
    clearFields: function($el, model) {
      return $el.find("[name^=" + model.getCid() + "_]").val("");
    },
    evalCondition: function(clicked_element, cid, condition, set_value) {
      return (function(_this) {
        return function(firstValue, check_result, secondValue, is_true) {
          var elem_val;
          elem_val = clicked_element.find("[name = " + cid + "_1]").val();
          firstValue = parseInt(elem_val);
          secondValue = parseInt(set_value);
          check_result = condition(firstValue, secondValue);
          return check_result;
        };
      })(this)('', false, '', false);
    },
    add_remove_require: function(cid, required) {
      $("." + cid).find("[name = " + cid + "_1]").attr("required", required);
      return $("." + cid).find("[name = " + cid + "_2]").attr("required", required);
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('radio', {
    view: "<% var field_options = (rf.get(Formbuilder.options.mappings.OPTIONS) || []) %>\n<% for ( var i = 0 ; i < field_options.length ; i++) { %>\n  <div>\n    <label class='fb-option'>\n      <input type='radio' value='<%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %>/>\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </div>\n<% } %>\n\n<% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n  <div class='other-option'>\n    <label class='fb-option'>\n      <input class='other-option' type='radio' value=\"__other__\"/>\n      Other\n    </label>\n\n    <input type='text' />\n  </div>\n<% } %>",
    edit: "<%= Formbuilder.templates['edit/options']({ includeOther: true }) %>",
    print: "<div>\n  <% var field_options = rf.get(Formbuilder.options.mappings.OPTIONS) || [],\n      all_attr =  rf.get('field_values'),\n      labelArr = [], opt1, opt2, cid =  rf.get('cid');\n    _.each(field_options, function(option){\n      labelArr.push(option.label)\n    });\n    opt1 = _.pick(all_attr, labelArr);\n    opt2 = _.pick(all_attr, ['__other__', cid + '_1']);\n    _.extend(opt1, opt2);\n  %>\n  <% if(opt1){ %>\n    <% for(var k in opt1){ %>\n      <% if(all_attr[k]){ %>\n        <label>\n          <% if(k == '__other__') { %>\n            <%= all_attr[cid + '_1'] %>\n          <% } else { %>\n            <%=  k %>\n          <% } %>\n        </label>\n      <% break;} %>\n    <% } %>\n  <% } %>\n</div>",
    addButton: "<span class=\"symbol\"><span class=\"icon-circle-blank\"></span></span> Radio Button",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "",
          checked: false
        }, {
          label: "",
          checked: false
        }
      ];
      return attrs;
    },
    checkAttributeHasValue: function(cid, $el) {
      if ($el.find('input:checked').length <= 0) {
        return false;
      }
      if ($el.find('input:checked').val() === '__other__') {
        if ($el.find('input:text').val() === '') {
          return false;
        }
      }
      return cid;
    },
    fieldToValue: function($el, model) {
      return (function(all_elem, res) {
        _.each(all_elem, function(elem) {
          return (function($elem) {
            if ($elem.is(":radio")) {
              return res[$elem.val()] = $elem.is(":checked");
            } else {
              return res[$elem.attr('name')] = $elem.val();
            }
          })($(elem));
        });
        return res;
      })($el.find('[name^=' + model.getCid() + ']'), {});
    },
    setup: function(field_view, model) {
      if (model.get('field_values')) {
        (function(val_hash) {
          return _.each(val_hash, function(val, key) {
            return (function(target_elemnt) {
              if (target_elemnt.is(":radio")) {
                return target_elemnt.prop('checked', val);
              } else {
                return field_view.$el.find("input[name=" + key + "]").val(val);
              }
            })(field_view.$el.find(":radio[value='" + key + "']"));
          });
        })(model.get('field_values'));
      } else if (model.get('field_options')) {
        (function(options, cid) {
          return _.each(options, function(val, index) {
            if (val.checked) {
              return field_view.$el.find(":radio[value=" + val.label + "]").prop("checked", true);
            }
          });
        })(model.get('field_options').options, model.getCid());
      }
      if (field_view.$el.find('input[type=radio]:checked')) {
        return field_view.trigger('change_state');
      }
    },
    isValid: function($el, model) {
      return (function(_this) {
        return function(valid) {
          valid = (function(required_attr, checked_chk_cnt) {
            if (!required_attr) {
              return true;
            }
            checked_chk_cnt = $el.find('input:checked').length;
            if ($el.find('input:checked').val() === '__other__') {
              return $el.find('input:text').val() !== '';
            }
            return checked_chk_cnt > 0;
          })(model.get('required'), 0);
          return valid;
        };
      })(this)(false);
    },
    clearFields: function($el, model) {
      var elem, _i, _len, _ref;
      _ref = $el.find('input:checked');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        elem.checked = false;
      }
      return $el.find('input:text').val('');
    },
    evalCondition: function(clicked_element, cid, condition, set_value) {
      return (function(_this) {
        return function(elem_val, check_result) {
          elem_val = clicked_element.find("[value = '" + set_value + "']").is(':checked');
          if (elem_val) {
            check_result = condition(elem_val, true);
          } else if (clicked_element.find("[value = '__other__']").is(':checked')) {
            elem_val = clicked_element.find('input[type=text]').val();
            check_result = condition(elem_val, set_value);
          }
          return check_result;
        };
      })(this)('', false);
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('scale_rating', {
    view: "<%var field_options = (rf.get(Formbuilder.options.mappings.OPTIONS) || [])%>\n<div class='row-fluid mobile-device'>\n  <div class=\"scale_rating_min\">\n    <label>\n      <%= rf.get(Formbuilder.options.mappings.STARTING_POINT_TEXT) %>\n    </label>\n  </div>\n  <div>\n    <% for ( var i = 0 ; i < field_options.length ; i++) { %>\n      <div class=\"span1 scale_rating\">\n        <%= i+1 %>\n        <label class='fb-option'>\n          <input type='radio' value='<%= i+1 %>'\n            <%=\n              rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked &&\n              'checked'\n            %>\n          />\n        </label>\n      </div>\n    <% } %>\n  </div>\n  <div class=\"scale_rating_max\">\n    <label>\n      <%= rf.get(Formbuilder.options.mappings.ENDING_POINT_TEXT) %>\n    </label>\n  </div>\n</div>",
    edit: "<%= Formbuilder.templates['edit/scale_rating_options']() %>",
    addButton: "<span class=\"symbol\">\n  <span class=\"icon-circle-blank\"></span>\n</span> Scale Rating",
    checkAttributeHasValue: function(cid, $el) {
      if ($el.find('input:checked').length <= 0) {
        return false;
      }
      return cid;
    },
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "",
          checked: false
        }, {
          label: "",
          checked: false
        }
      ];
      return attrs;
    },
    isValid: function($el, model) {
      return (function(_this) {
        return function(valid) {
          valid = (function(required_attr) {
            if (!required_attr) {
              return true;
            }
            return $el.find('input:checked').length > 0;
          })(model.get('required'));
          return valid;
        };
      })(this)(false);
    },
    fieldToValue: function($el, model) {
      return (function(all_elem, res) {
        _.each(all_elem, function(elem) {
          return (function($elem) {
            if ($elem.is(":radio")) {
              return res[$elem.val()] = $elem.is(":checked");
            }
          })($(elem));
        });
        return res;
      })($el.find('[name=' + model.getCid() + '_0]'), {});
    },
    setup: function(field_view, model) {
      if (model.get('field_values')) {
        (function(val_hash) {
          return _.each(val_hash, function(val, key) {
            return (function(target_elemnt) {
              if (target_elemnt.is(":radio")) {
                return target_elemnt.prop('checked', val);
              }
            })(field_view.$el.find(":radio[value=" + key + "]"));
          });
        })(model.get('field_values'));
      } else if (model.get('field_options')) {
        (function(options, cid) {
          return _.each(options, function(val, index) {
            if (val.checked) {
              return field_view.$el.find(":radio[value=" + (index + 1) + "]").prop("checked", true);
            }
          });
        })(model.get('field_options').options, model.getCid());
      }
      if (field_view.$el.find('input[type=radio]:checked')) {
        return field_view.trigger('change_state');
      }
    },
    clearFields: function($el, model) {
      return (function(_this) {
        return function(elem) {
          var _i, _len, _ref, _results;
          _ref = $el.find('input:checked');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            elem = _ref[_i];
            _results.push(elem.checked = false);
          }
          return _results;
        };
      })(this)('');
    },
    evalCondition: function(clicked_element, cid, condition, set_value) {
      return (function(_this) {
        return function(elem_val, check_result) {
          elem_val = clicked_element.find("[value = " + set_value + "]").is(':checked');
          check_result = condition("'" + elem_val + "'", "'true'");
          return check_result;
        };
      })(this)('', false);
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('section_break', {
    type: 'non_input',
    view: "<div class=\"easyWizardButtons\" style=\"clear: both;\">\n  <button class=\"next btn-success\">\n    <%= rf.get(Formbuilder.options.mappings.NEXT_BUTTON_TEXT) || 'Next' %>\n  </button>\n  <% if(rf.get(Formbuilder.options.mappings.BACK_VISIBLITY) != 'false') {\n      rf.set(Formbuilder.options.mappings.BACK_VISIBLITY,'true')\n    }\n  %>\n  <% if(rf.get(Formbuilder.options.mappings.BACK_VISIBLITY) == 'true'){%>\n    <button class=\"prev btn-danger\">\n      <%= rf.get(Formbuilder.options.mappings.PREV_BUTTON_TEXT) || 'Back' %>\n    </button>\n  <% } %>\n</div>",
    edit: "  <div class='fb-edit-section-header'>Next button</div>\n  <input type=\"text\" pattern=\"[a-zA-Z0-9_\\s]+\" data-rv-input=\n    \"model.<%= Formbuilder.options.mappings.NEXT_BUTTON_TEXT %>\"\n    value='Next'/>\n\n  <div class='fb-edit-section-header'>Back button</div>\n  <input type=\"text\" pattern=\"[a-zA-Z0-9_\\s]+\" data-rv-input=\n    \"model.<%= Formbuilder.options.mappings.PREV_BUTTON_TEXT %>\"\n    value='Back'/>\n\n  <%= Formbuilder.templates['edit/back_visiblity']() %>\n  <div class='fb-edit-section-header'>Recurring section</div>\n\n  <label>\n    <input type='checkbox' data-rv-checked='model.<%= Formbuilder.options.mappings.RECURRING_SECTION %>' />\nAllow multiple entries for following section\n  </label>",
    print: "<div class=\"section_break_div\">\n  <hr>\n</div>",
    addButton: "<span class='symbol'><span class='icon-minus'></span></span> Section Break",
    checkAttributeHasValue: function(cid, $el) {
      return true;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('take_pic_video_audio', {
    view: "<div class='input-line'>\n  <% if(_.contains(Formbuilder.options.FIELD_CONFIGS['take_pic_video_audio'], 'all')){ %>\n    <% if (rf.get(Formbuilder.options.mappings.INCLUDE_PHOTO)) { %>\n      <button type='button' class='file_field btn_capture_icon image btn_icon_photo' cid=\"<%= rf.getCid() %>\" id=\"btn_image_<%= rf.getCid() %>\"></button>\n    <% } %>\n\n    <% if (rf.get(Formbuilder.options.mappings.INCLUDE_VIDEO)) { %>\n      <button type='button' class='file_field btn_capture_icon video btn_icon_video' cid=\"<%= rf.getCid() %>\" id=\"btn_video_<%= rf.getCid() %>\"></button>\n    <% } %>\n\n    <% if (rf.get(Formbuilder.options.mappings.INCLUDE_AUDIO)) { %>\n      <button type='button' class='file_field btn_capture_icon audio btn_icon_audio' cid=\"<%= rf.getCid() %>\" id=\"btn_audio_<%= rf.getCid() %>\"></button>\n    <% } %>\n  <% } %>\n  <% if(_.contains(Formbuilder.options.FIELD_CONFIGS['take_pic_video_audio'], 'photo')){ %>\n    <button type='button' class='file_field btn_capture_icon image btn_icon_photo' cid=\"<%= rf.getCid() %>\" id=\"btn_image_<%= rf.getCid() %>\"></button>\n  <% } %>\n  <% if(_.contains(Formbuilder.options.FIELD_CONFIGS['take_pic_video_audio'], 'video')){ %>\n    <button type='button' class='file_field btn_capture_icon video btn_icon_video' cid=\"<%= rf.getCid() %>\" id=\"btn_video_<%= rf.getCid() %>\"></button>\n  <% } %>\n  <% if(_.contains(Formbuilder.options.FIELD_CONFIGS['take_pic_video_audio'], 'audio')){ %>\n    <button type='button' class='file_field btn_capture_icon audio btn_icon_audio' cid=\"<%= rf.getCid() %>\" id=\"btn_audio_<%= rf.getCid() %>\"></button>\n  <% } %>\n\n  <a\n    type='take_pic_video_audio'\n    target=\"_blank\" capture='capture' class=\"capture active_link\"\n    id=\"record_link_<%= rf.getCid() %>\" href=\"\"\n    style=\"margin-bottom:12px;\"\n  ></a>\n  <div id=\"capture_link_<%= rf.getCid() %>\"></div>\n</div>\n<div id=\"open_model_<%= rf.getCid() %>\"\n  class=\"modal hide fade modal_style\" tabindex=\"-1\"\n  role=\"dialog\" aria-labelledby=\"ModalLabel\" aria-hidden=\"true\">\n  <div class=\"modal-header\">\n    <button type=\"button\" class=\"close\" data-dismiss=\"modal\"\n      aria-hidden=\"true\">&times;</button>\n    <h3>Picture</h3>\n  </div>\n  <div class=\"modal-body\" id=\"modal_body_<%= rf.getCid() %>\">\n    <video id=\"video_<%= rf.getCid() %>\" autoplay></video>\n    <canvas id=\"canvas_<%= rf.getCid() %>\" style=\"display:none;\"></canvas>\n  </div>\n  <div class=\"modal-footer\">\n    <button id=\"take_picture_<%= rf.getCid() %>\" class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">\n      Take Picture\n    </button>\n    <button class=\"btn btn-default btn-success\" data-dismiss=\"modal\" aria-hidden=\"true\">\n      Ok\n    </button>\n  </div>\n</div>\n\n<textarea\n id='snapshot_<%= rf.getCid() %>'\n data-rv-value='model.<%= Formbuilder.options.mappings.HTML_DATA %>'\n style=\"display:none;\"\n>\n</textarea>\n\n<script>\n\n  $('#snapshot_<%= rf.getCid() %>').attr(\"required\", false);\n  $('#canvas_<%= rf.getCid() %>').attr(\"required\", false);\n\n  $(\"#btn_image_<%= rf.getCid() %>\").click( function() {\n    $(\"#open_model_<%= rf.getCid() %>\").modal('show');\n    $(\"#open_model_<%= rf.getCid() %>\").on('shown', function() {\n      startCamera();\n    });\n    $(\"#open_model_<%= rf.getCid() %>\").on('hidden', function() {\n      localMediaStream.stop();\n      localMediaStream = null;\n      $(\"#snapshot_<%= rf.getCid() %>\").text(\n        $('#record_link_<%= rf.getCid() %>').attr('href')\n      );\n      $(\"#snapshot_<%= rf.getCid() %>\").trigger(\"change\");\n      $(this).unbind('shown');\n      $(this).unbind('hidden');\n    });\n  });\n  var video = document.querySelector(\"#video_<%= rf.getCid() %>\"),\n      take_picture = document.querySelector(\"#take_picture_<%= rf.getCid() %>\")\n      canvas = document.querySelector(\"#canvas_<%= rf.getCid() %>\"),\n      ctx = canvas.getContext('2d'), localMediaStream = null;\n  navigator.getUserMedia = navigator.getUserMedia ||\n    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;\n\n  function snapshot() {\n    if (localMediaStream) {\n      ctx.drawImage(video, 0, 0);\n      // \"image/webp\" works in Chrome.\n      // Other browsers will fall back to image/png.\n      document.querySelector('#record_link_<%= rf.getCid() %>').href = canvas.toDataURL('image/webp');\n      $('#record_link_<%= rf.getCid() %>').text('View File');\n    }\n  }\n  function sizeCanvas() {\n    // video.onloadedmetadata not firing in Chrome so we have to hack.\n    // See crbug.com/110938.\n    setTimeout(function() {\n      canvas.width = 640;\n      canvas.height = 420;\n    }, 100);\n  }\n  function startCamera(){\n    navigator.getUserMedia(\n      {video: true},\n      function(stream){\n        video.src = window.URL.createObjectURL(stream);\n        localMediaStream = stream;\n        sizeCanvas();\n      },\n      function errorCallback(error){\n        console.log(\"navigator.getUserMedia error: \", error);\n      }\n    );\n  }\n\n  take_picture.addEventListener('click', snapshot, false);\n</script>",
    edit: "<%= Formbuilder.templates['edit/capture']({ rf:rf }) %>",
    print: "<div id=\"capture_link_<%= rf.getCid() %>\"></div>",
    addButton: "<span class=\"symbol\"><span class=\"icon-camera\"></span></span> Capture",
    clearFields: function($el, model) {
      return (function(_this) {
        return function(attr_name) {
          $el.find(".capture").text("");
          return $el.find("#capture_link_" + attr_name).html('');
        };
      })(this)(model.getCid());
    },
    add_remove_require: function(cid, required) {
      return $("." + cid).find("[name = " + cid + "_1]").attr("required", required);
    },
    fieldToValue: function($el, model) {
      return (function(_this) {
        return function(link_eles, comp_obj) {
          (function(key, link_href) {
            return _.each(link_eles, function(link_ele) {
              key = $(link_ele).attr('name');
              link_href = $(link_ele).attr('href');
              if (_.isEmpty(link_href)) {
                return comp_obj[key] = {
                  'name': $(link_ele).text(),
                  'url': $(link_ele).text()
                };
              } else {
                return comp_obj[key] = {
                  'name': $(link_ele).text(),
                  'url': link_href
                };
              }
            });
          })('', '');
          return comp_obj;
        };
      })(this)($el.find('a[type=pic_video_audio]'), {});
    },
    android_bindevents: function(field_view) {
      return (function(_this) {
        return function(btn_photo_inputs, btn_video_inputs, btn_audio_inputs, _that) {
          _that.bind_event_for_type(btn_photo_inputs, "image", field_view);
          _that.bind_event_for_type(btn_video_inputs, "video", field_view);
          return _that.bind_event_for_type(btn_audio_inputs, "audio", field_view);
        };
      })(this)(field_view.$el.find(".image"), field_view.$el.find(".video"), field_view.$el.find(".audio"), this);
    },
    bind_event_for_type: function(btn_inputs, input_type, field_view) {
      return (function(_this) {
        return function(view_index) {
          return _.each(btn_inputs, function(btn_input) {
            $(btn_input).unbind();
            return $(btn_input).on("click", function() {
              view_index = field_view.model.get('view_index');
              if (!view_index) {
                view_index = 0;
              }
              Android.f2dBeginCapture(field_view.model.getCid(), input_type, view_index);
            });
          });
        };
      })(this)(0);
    },
    setup: function(field_view, model) {
      return (function(_this) {
        return function(model_cid, file_url, $cap_link_ele, _that) {
          if (model.get('field_values')) {
            $cap_link_ele.html('');
            return _.each(model.get('field_values'), function(value, key) {
              if (value) {
                if ($cap_link_ele) {
                  if (_.isString(value)) {
                    if (value.indexOf("data:image") === -1) {
                      $cap_link_ele.append("<div class='capture_link_div' id=capture_link_div_" + key + "><a class='active_link_doc' target='_blank' type = 'pic_video_audio' name=" + key + " href=" + value + ">" + value.split("/").pop().split("?")[0] + "</a><span class='pull-right' id=capture_link_close_" + key + ">X</span></br></div>");
                    } else if (value.indexOf("data:image") === 0) {
                      $('#record_link_' + model_cid).attr('href', value);
                      $('#record_link_' + model_cid).text("View File");
                    }
                  } else if (_.isObject(value)) {
                    $('#capture_link_' + model_cid).append("<div class='capture_link_div' id=capture_link_div_" + key + "><a class='active_link_doc' target='_blank' type = 'pic_video_audio' name=" + key + " href=" + value.url + ">" + value.name + "</a><span class='pull-right' id=capture_link_close_" + key + ">X</span></br></div>");
                  }
                }
                if (this.$('#capture_link_close_' + key)) {
                  return this.$('#capture_link_close_' + key).click(function() {
                    return $('#capture_link_div_' + key).remove();
                  });
                }
              }
            });
          }
        };
      })(this)(model.getCid(), '', field_view.$el.find('#capture_link_' + model.getCid()), this);
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('text', {
    view: "<input\n  type='text'\n  class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'\n/>",
    edit: "<%= Formbuilder.templates['edit/size']() %>\n<%= Formbuilder.templates['edit/min_max_length']({rf:rf}) %>\n<%= Formbuilder.templates['edit/default_value_hint']() %>",
    addButton: "<span class='symbol'><span class='icon-font'></span></span> Text Box",
    checkAttributeHasValue: function(cid, $el) {
      if ($el.find("input[type=text]").val() === "") {
        return false;
      }
      return cid;
    },
    defaultAttributes: function(attrs) {
      attrs.field_options.size = 'medium';
      return attrs;
    },
    print: "<label id=\"text_print\"></label>",
    setValForPrint: function(field_view, model) {
      return field_view.$el.find('#text_print').html(model.get('field_values')["" + (model.getCid()) + "_1"]);
    },
    setup: function(field_view, model) {
      var el;
      el = field_view.$el.find('input');
      if (model.get(Formbuilder.options.mappings.MINLENGTH)) {
        (function(min_length) {
          return el.attr("pattern", "[a-zA-Z0-9_\\s]{" + min_length + ",}");
        })(model.get(Formbuilder.options.mappings.MINLENGTH));
      }
      if (model.get(Formbuilder.options.mappings.MAXLENGTH)) {
        el.attr("maxlength", model.get(Formbuilder.options.mappings.MAXLENGTH));
      }
      if (model.get(Formbuilder.options.mappings.DEFAULT_VALUE)) {
        el.val(model.get(Formbuilder.options.mappings.DEFAULT_VALUE));
      }
      if (model.get(Formbuilder.options.mappings.HINT)) {
        el.attr("placeholder", model.get(Formbuilder.options.mappings.HINT));
      }
      if (model.get('field_values')) {
        el.val(model.get('field_values')["" + (model.getCid()) + "_1"]);
      }
      if (field_view.$el.find('input').val() !== '') {
        return field_view.trigger('change_state');
      }
    },
    clearFields: function($el, model) {
      return (function(_this) {
        return function($input) {
          $input.val("");
          if (model.get(Formbuilder.options.mappings.DEFAULT_VALUE)) {
            return $input.val(model.get(Formbuilder.options.mappings.DEFAULT_VALUE));
          }
        };
      })(this)($el.find("[name = " + model.getCid() + "_1]"));
    },
    evalCondition: function(clicked_element, cid, condition, set_value) {
      return (function(_this) {
        return function(check_result, elem_val) {
          elem_val = clicked_element.find("[name = " + cid + "_1]").val();
          check_result = condition("'" + elem_val + "'", "'" + set_value + "'");
          return check_result;
        };
      })(this)(false, '');
    },
    add_remove_require: function(cid, required) {
      return $("." + cid).find("[name = " + cid + "_1]").attr("required", required);
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('time', {
    view: "<label>\n  Unsupported field. Please replace this with the new DateTime field.\n</label>",
    edit: "",
    getFieldType: function() {
      return 'time';
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('url', {
    view: "<input type='url' pattern=\"https?://.+\" class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' placeholder='http://' />",
    edit: "<%= Formbuilder.templates['edit/size']() %>",
    addButton: "<span class=\"symbol\"><span class=\"icon-link\"></span></span> URL",
    print: "<label id=\"url_print\"></label>",
    setValForPrint: function(field_view, model) {
      return field_view.$el.find('#url_print').html(model.get('field_values')["" + (model.getCid()) + "_1"]);
    },
    checkAttributeHasValue: function(cid, $el) {
      if ($el.find("input[type=url]").val() === "") {
        return false;
      }
      return cid;
    },
    defaultAttributes: function(attrs) {
      attrs.field_options.size = 'medium';
      return attrs;
    },
    clearFields: function($el, model) {
      return $el.find("[name = " + model.getCid() + "_1]").val("");
    },
    evalCondition: function(clicked_element, cid, condition, set_value) {
      return (function(_this) {
        return function(check_result) {
          var elem_val;
          elem_val = clicked_element.find("input[name = " + cid + "_1]").val();
          check_result = condition("'" + elem_val + "'", "'set_value'");
          return check_result;
        };
      })(this)(false);
    },
    add_remove_require: function(cid, required) {
      return $("." + cid).find("[name = " + cid + "_1]").attr("required", required);
    }
  });

}).call(this);

this["Formbuilder"] = this["Formbuilder"] || {};
this["Formbuilder"]["templates"] = this["Formbuilder"]["templates"] || {};

this["Formbuilder"]["templates"]["edit/age_restriction"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Minimum Age Restriction</div>\n\n  <input type="number" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MINAGE )) == null ? '' : __t) +
'" min=\'0\' style="width: 30px" />\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/area_code"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Area Code</div>\n\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.AREA_CODE )) == null ? '' : __t) +
'" style="width: 30px" />';

}
return __p
};

this["Formbuilder"]["templates"]["edit/back_visiblity"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Back Visiblity</div>\n<select data-rv-value=\'model.' +
((__t = ( Formbuilder.options.mappings.BACK_VISIBLITY )) == null ? '' : __t) +
'\'>\n    <option value=\'true\'>true</option>\n    <option value=\'false\'>false</option>\n</select>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p +=
((__t = ( Formbuilder.templates['edit/base_header']() )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.templates['edit/common']() )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf: rf, opts:opts}) )) == null ? '' : __t) +
'\n';

  if(!(rf.get('i_am_in_recurring_section') || custom_conditions)){
;
__p += '\n' +
((__t = ( Formbuilder.templates['edit/conditions']({ rf:rf, opts:opts }))) == null ? '' : __t) +
'\n';

  }
;


}
return __p
};

this["Formbuilder"]["templates"]["edit/base_header"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-field-label\'>\n  <span data-rv-text="model.' +
((__t = ( Formbuilder.options.mappings.LABEL )) == null ? '' : __t) +
'"></span>\n  <code class=\'field-type\' data-rv-text=\'model.' +
((__t = ( Formbuilder.options.mappings.FIELD_TYPE )) == null ? '' : __t) +
'\'></code>\n  <span class=\'icon-arrow-right pull-right\'></span>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p +=
((__t = ( Formbuilder.templates['edit/base_header']() )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf: rf}) )) == null ? '' : __t) +
'\n';
 if((!(rf.get('i_am_in_recurring_section'))) && (rf.get('field_type') == 'heading' || rf.get('field_type') == 'free_text_html')) { ;
__p += '\n' +
((__t = ( Formbuilder.templates['edit/conditions']({ rf:rf, opts:opts }))) == null ? '' : __t) +
'\n';
 } ;


}
return __p
};

this["Formbuilder"]["templates"]["edit/canvas_options"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Set Attributes</div>\n\nWidth\n<input type="number" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.CANVAS_WIDTH )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\nHeight\n<input type="number" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.CANVAS_HEIGHT )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;';

}
return __p
};

this["Formbuilder"]["templates"]["edit/capture"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if(_.contains(Formbuilder.options.FIELD_CONFIGS['take_pic_video_audio'], 'all')){ ;
__p += '\n  <div class=\'fb-edit-section-header\'>Options</div>\n\n  <label>\n    <input id=\'include_middle_name_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\' type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_PHOTO )) == null ? '' : __t) +
'\' />\n    Include "Photo"\n  </label>\n\n  <label>\n    <input id=\'include_middle_name_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\' type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_VIDEO )) == null ? '' : __t) +
'\' />\n    Include "Video"\n  </label>\n\n  <label>\n    <input id=\'include_middle_name_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\' type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_AUDIO )) == null ? '' : __t) +
'\' />\n    Include "Audio"\n  </label>\n';
 } ;
__p += '\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/checkboxes"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<label>\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.REQUIRED )) == null ? '' : __t) +
'\' />\n  Required\n</label>\n';
 if(Formbuilder.options.SHOW_ADMIN_ONLY) { ;
__p += '\n  <label>\n    <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.ADMIN_ONLY )) == null ? '' : __t) +
'\' />\n    Admin only access\n  </label>\n';
 } ;


}
return __p
};

this["Formbuilder"]["templates"]["edit/common"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Label</div>\n\n<div class=\'fb-common-wrapper\'>\n  <div class=\'fb-label-description span11\'>\n    ' +
((__t = ( Formbuilder.templates['edit/label_description']() )) == null ? '' : __t) +
'\n  </div>\n  <div class=\'fb-common-checkboxes span12\'>\n    ' +
((__t = ( Formbuilder.templates['edit/checkboxes']() )) == null ? '' : __t) +
'\n  </div>\n  <div class=\'fb-clear\'></div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/conditions"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Conditions</div>\n\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.MATCH_CONDITIONS )) == null ? '' : __t) +
'">\n  <option value="or">Select Matching</option>\n  <option value="and">Match All Conditions</option>\n  <option value="or">Match Any Conditions</option>\n</select>\n\n<div class=\'subtemplate-wrapper\' >\n  <div class=\'condition\' data-rv-each-condition=\'model.conditions\'>\n    <div class=\'row-fluid\' data-rv-show="condition:isSource">\n      <span class=\'fb-field-label fb-field-condition-label span1 fb-min-width-10\'> If </span>\n      <div class="span8">\n        <select data-rv-value=\'condition:source\'>\n          <option value="">Select Field</option>\n          ';
 var con_source_fields = opts.parentView.collection.exceptRecurAndNonInputFields().sort();;
__p += '\n          ';
 for( var i=0 ; i < con_source_fields.length ; i++){;
__p += '\n            ';
 if(con_source_fields.toJSON()[i].cid == rf.getCid()){ ;
__p += '\n              ';
 break ;
__p += '\n            ';
 } ;
__p += '\n            <option value="' +
((__t = ( con_source_fields.toJSON()[i].cid )) == null ? '' : __t) +
'">' +
((__t = ( con_source_fields.toJSON()[i].label )) == null ? '' : __t) +
'</option>\n          ';
};
__p += '\n        </select>\n      </div>\n      <span class=\'fb-field-label fb-field-condition-label span2\'> field </span>\n      <div class="span6">\n        <select data-rv-value=\'condition:condition\'>\n            <option value="">Select Comparator</option>\n            <option>equals</option>\n            <option>greater than</option>\n            <option>less than</option>\n            <option>is not empty</option>\n        </select>\n      </div>\n      <input class=\'span5 pull-right\' data-rv-input=\'condition:value\' type=\'text\'/>\n      <span class=\'fb-field-label fb-field-condition-label span2 fb-min-width-40\'> then </span>\n      <div class="span8">\n        <select data-rv-value=\'condition:action\'>\n            <option value="">Select Action</option>\n            <option>show</option>\n            <option>hide</option>\n        </select>\n      </div>\n      <div class="span8 fb-this-field-div">\n        <input type=\'text\' class=\'fb-this-field-input\' disabled value=\'This Field\'>\n      </div>\n      <a class="pull-right js-remove-condition ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Remove Condition"><i class=\'icon-minus-sign\'></i></a>\n    </div>\n  </div>\n</div>\n\n<div class=\'fb-bottom-add\'>\n  <a class="js-add-condition ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">Add Condition</a>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/country_code"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Country Code</div>\n\n<input id=\'' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'_country_code\' type="text" data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.COUNTRY_CODE )) == null ? '' : __t) +
'"/>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/date_format"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Date Format</div>\n\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.DATE_FORMAT )) == null ? '' : __t) +
'">\n  <option value="dd/mm/yy">dd/mm/yy</option>\n  <option value="mm/dd/yy">mm/dd/yy</option>\n</select>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/date_only"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Date Only</div>\n\n<label>\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.DATE_ONLY )) == null ? '' : __t) +
'\' />\n  only date field\n</label>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/datetime_difference_labels"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Labels</div>\n<div class="control-group">\n  <label class="control-label">First Value</label>\n  <div class="controls">\n    <input type="text" pattern="^[\\w]+[\\w\\s ]*" data-rv-input=\n      "model.' +
((__t = ( Formbuilder.options.mappings.START_DATE_TIME_TEXT )) == null ? '' : __t) +
'"\n      value=\'Start Date Time\' placeholder="Start Date Time"/>\n  </div>\n</div>\n<div class="control-group">\n  <label class="control-label">Second Value</label>\n  <div class="controls">\n    <input type="text" pattern="^[\\w]+[\\w\\s ]*" data-rv-input=\n      "model.' +
((__t = ( Formbuilder.options.mappings.END_DATE_TIME_TEXT )) == null ? '' : __t) +
'"\n      value=\'End Date Time\' placeholder="End Date Time"/>\n  </div>\n</div>\n<div class="control-group">\n  <label class="control-label">Difference</label>\n  <div class="controls">\n    <input type="text" pattern="^[\\w]+[\\w\\s ]*" data-rv-input=\n      "model.' +
((__t = ( Formbuilder.options.mappings.DATETIME_DIFFERENCE_TEXT )) == null ? '' : __t) +
'"\n      value=\'Difference\' placeholder="Difference"/>\n  </div>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/default_address"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Default Address</div>\n\n<div class=\'input-line span12\' >\n  <span class="span11">\n    <label>Street Address</label>\n    <input type="text" id="address_edit_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'"\n      class=\'span12\'\n      data-address="' +
((__t = ( rf.get(Formbuilder.options.mappings.DEFAULT_ADDRESS))) == null ? '' : __t) +
'"\n      data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.DEFAULT_ADDRESS )) == null ? '' : __t) +
'"\n    />\n  </span>\n</div>\n<div class=\'input-line span12\' >\n  <span class="span11">\n    <label>Suburb/City</label>\n    <input type="text" id="city_edit_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'"\n      class=\'span12\'\n      data-city="' +
((__t = ( rf.get(Formbuilder.options.mappings.DEFAULT_CITY))) == null ? '' : __t) +
'"\n      data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.DEFAULT_CITY )) == null ? '' : __t) +
'"\n    />\n  </span>\n</div>\n<div class=\'input-line span12\' >\n  <span class="span11">\n    <label>State / Provience / Region</label>\n    <input type="text" id="dropdown_country_edit_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'"\n      class=\'span12\'\n      data-state="' +
((__t = ( rf.get(Formbuilder.options.mappings.DEFAULT_STATE))) == null ? '' : __t) +
'"\n      data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.DEFAULT_STATE )) == null ? '' : __t) +
'"\n    />\n  </span>\n</div>\n<div class=\'input-line span12\' >\n  <span class="span11">\n    <label>Postal/Zip Code</label>\n    <input type="text" id="dropdown_country_edit_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'"\n      class=\'span12\' pattern="[a-zA-Z0-9]+"\n      data-zipcode="' +
((__t = ( rf.get(Formbuilder.options.mappings.DEFAULT_ZIPCODE))) == null ? '' : __t) +
'"\n      data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.DEFAULT_ZIPCODE )) == null ? '' : __t) +
'"\n    />\n  </span>\n</div>\n<div class=\'input-line span12\' >\n  <span class="span11">\n    <label>Select Default Country</label>\n    <select id="dropdown_country_edit_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'"\n      class=\'dropdown_country span12 bfh-selectbox bfh-countries\'\n      data-country="' +
((__t = ( rf.get(Formbuilder.options.mappings.DEFAULT_COUNTRY))) == null ? '' : __t) +
'"\n      data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.DEFAULT_COUNTRY )) == null ? '' : __t) +
'"\n    ></select>\n  </span>\n</div>\n<script>\n  $(function() {\n    $("#dropdown_country_edit_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'").bfhcount();\n  });\n</script>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/default_number_value"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Default Value</div>\n\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.DEFAULT_NUM_VALUE )) == null ? '' : __t) +
'" style="width: 30px" />';

}
return __p
};

this["Formbuilder"]["templates"]["edit/default_paragraph_value"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Default value</div>\n\n<textarea data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.DEFAULT_VALUE )) == null ? '' : __t) +
'"></textarea>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/default_value_hint"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Default value</div>\n\n<input type="text" pattern="[a-zA-Z0-9_\\\\s]+" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.DEFAULT_VALUE )) == null ? '' : __t) +
'"/>\n\n<div class=\'fb-edit-section-header\'>Hint/Placeholder</div>\n\n<input type="text" pattern="[a-zA-Z0-9_\\\\s]+" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.HINT )) == null ? '' : __t) +
'"/>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/first_label_value"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="control-group">\n  <label class="control-label">First </label>\n  <div class="controls">\n    <input type="text" pattern="^[\\w]+[\\w\\s ]*" data-rv-input=\n      "model.' +
((__t = ( Formbuilder.options.mappings.FULLNAME_FIRST_TEXT )) == null ? '' : __t) +
'"\n      value=\'First\' placeholder="First"/>\n  </div>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/full_name_label_values"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-common-wrapper\'>\n  <div class=\'fb-label-description span11\'>\n    ' +
((__t = ( Formbuilder.templates['edit/prefix_label_value']() )) == null ? '' : __t) +
'\n    ' +
((__t = ( Formbuilder.templates['edit/first_label_value']() )) == null ? '' : __t) +
'\n    ' +
((__t = ( Formbuilder.templates['edit/middle_label_value']({ rf: rf }) )) == null ? '' : __t) +
'\n    ' +
((__t = ( Formbuilder.templates['edit/last_label_value']() )) == null ? '' : __t) +
'\n    ' +
((__t = ( Formbuilder.templates['edit/suffix_label_value']({ rf: rf }) )) == null ? '' : __t) +
'\n  </div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/image_options"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Options</div>\n\nWidth\n<input type="number" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.IMAGEWIDTH )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\nHeight\n<input type="number" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.IMAGEHEIGHT )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\n<div class=\'fb-edit-section-header\'>Align</div>\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.IMAGEALIGN )) == null ? '' : __t) +
'">\n  <option value="left">left</option>\n  <option value="center">center</option>\n  <option value="right">right</option>\n</select>\n\n\n<div class=\'fb-edit-section-header\'>Image Link</div>\n<input type=\'url\' pattern="https?://.+" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.IMAGELINK )) == null ? '' : __t) +
'" placeholder=\'http://\'/>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/integer_only"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Integer only</div>\n<label>\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INTEGER_ONLY )) == null ? '' : __t) +
'\' />\n  Only accept integers\n</label>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/label_description"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<input type=\'text\' data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.LABEL )) == null ? '' : __t) +
'\' />\n<textarea data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.DESCRIPTION )) == null ? '' : __t) +
'\'\n  placeholder=\'Add a longer description to this field\'></textarea>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/last_label_value"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="control-group">\n  <label class="control-label">Last </label>\n  <div class="controls">\n    <input type="text" pattern="^[\\w]+[\\w\\s ]*"\n    data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.FULLNAME_LAST_TEXT )) == null ? '' : __t) +
'"\n    value=\'Last\' placeholder="Last"/>\n  </div>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/mask_value"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Mask Value</div>\n\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MASK_VALUE )) == null ? '' : __t) +
'" placeholder="(00) 0000-0000"/>\n<label>0: numbers only</label>\n<label>A: alphanumeric</label>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/middle"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Options</div>\n\n';
 if (typeof includeOther !== 'undefined'){ ;
__p += '\n  <label>\n    <input id=\'include_middle_name_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\' type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_OTHER )) == null ? '' : __t) +
'\' />\n    Include "Middle Name"\n  </label>\n';
 } ;
__p += '\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/middle_label_value"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="control-group" id=\'middle_name_div_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\'\n  style= \'' +
((__t = ( rf.get(Formbuilder.options.mappings.INCLUDE_OTHER) ? 'display:block' : 'display:none' )) == null ? '' : __t) +
'\' >\n  <label class="control-label">Middle </label>\n  <div class="controls">\n    <input type="text" pattern="^[\\w]+[\\w\\s ]*"\n     data-rv-input=\n     "model.' +
((__t = ( Formbuilder.options.mappings.FULLNAME_MIDDLE_TEXT )) == null ? '' : __t) +
'"\n     value=\'Middle\' placeholder="Middle"/>\n  </div>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/min_max_length"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<form>\n  <div class=\'fb-edit-section-header\'>Characters Limit</div>\n\n  Min\n  <input id="min_' +
((__t = (rf.getCid())) == null ? '' : __t) +
'" type="number" min="0" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MINLENGTH )) == null ? '' : __t) +
'" style="width: 30px" />\n\n  &nbsp;&nbsp;\n\n  Max\n  <input id="max_' +
((__t = (rf.getCid())) == null ? '' : __t) +
'" type="number" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MAXLENGTH )) == null ? '' : __t) +
'" style="width: 30px" />\n\n  &nbsp;&nbsp;\n\n  <input class="fb-clear-min-max" type="reset" value="clear">\n</form>\n\n<script>\n  $(function() {\n    $("#min_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'").change(function(){\n      $("#max_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'").attr(\'min\',$(this).val())\n      if (parseInt($(this).val()) < 0){\n        $(this).val(0)\n      }\n    });\n    $("#max_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'").change(function(){\n      if (parseInt($(this).val()) < parseInt($(\'#min_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\').val()) || parseInt($(this).val()) < 0){\n        $(this).val(\'\')\n      }\n    });\n  });\n</script>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/min_max_step"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Minimum / Maximum</div>\n\nAbove\n<input type="number" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MIN )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\nBelow\n<input type="number" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MAX )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\nStep\n<input type="number" step=\'any\' data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.STEP )) == null ? '' : __t) +
'" style="width: 30px" />\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/optional_title"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Options</div>\n\n<label>\n\t<input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.OPTIONAL_FIELD )) == null ? '' : __t) +
'\' />\n    Show Label\n</label>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/options"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Options</div>\n\n';
 if (typeof includeBlank !== 'undefined'){ ;
__p += '\n  <label>\n    <input type=\'checkbox\' id=\'include_empty_option_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_BLANK )) == null ? '' : __t) +
'\' />\n    Include blank\n  </label>\n  ';
 if (typeof rf !== 'undefined'){ ;
__p += '\n    <div class="control-group" id=\'empty_option_div_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\'\n      style= \'' +
((__t = ( rf.get(Formbuilder.options.mappings.INCLUDE_BLANK) ? 'display:block' : 'display:none' )) == null ? '' : __t) +
'\' >\n      <div class="controls">\n        <input class="empty-option-text" type="text" pattern="^[\\w]+[\\w\\s ]*"\n         data-rv-input=\n         "model.' +
((__t = ( Formbuilder.options.mappings.EMPTY_OPTION_TEXT )) == null ? '' : __t) +
'"\n         value=\'Select Option\' placeholder="Empty option text"/>\n      </div>\n    </div>\n  ';
 } ;
__p += '\n';
 } ;
__p += '\n\n<div class=\'option\' data-rv-each-option=\'model.' +
((__t = ( Formbuilder.options.mappings.OPTIONS )) == null ? '' : __t) +
'\'>\n  <input type="checkbox" class=\'js-default-updated\' data-rv-checked="option:checked" />\n  <input type="text" data-rv-input="option:label" class=\'option-label-input\' />\n  <a class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Add Option"><i class=\'icon-plus-sign\'></i></a>\n  <a class="js-remove-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Remove Option"><i class=\'icon-minus-sign\'></i></a>\n</div>\n\n';
 if (typeof includeOther !== 'undefined'){ ;
__p += '\n  <label>\n    <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_OTHER )) == null ? '' : __t) +
'\' />\n    Include "other"\n  </label>\n';
 } ;
__p += '\n\n<div class=\'fb-bottom-add\'>\n  <a class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">Add option</a>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/prefix_label_value"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="control-group">\n  <label class="control-label">Prefix </label>\n  <div class="controls">\n    <input type="text" pattern="^[\\w]+[\\w\\s ]*" data-rv-input=\n      "model.' +
((__t = ( Formbuilder.options.mappings.FULLNAME_PREFIX_TEXT )) == null ? '' : __t) +
'"\n       value=\'Prefix\' placeholder="Prefix"/>\n  </div>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/scale_rating_options"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Options</div>\n\n<div class=\'row-fluid\'>\n  <span class="fb-field-label">Starting Point:</span>\n  <input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.STARTING_POINT_TEXT )) == null ? '' : __t) +
'" class=\'option-label-input span3\' />\n</div>\n\n<div class=\'row-fluid\'>\n  <span class="fb-field-label scale_rating_label">Ending Point:</span>\n  <input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.ENDING_POINT_TEXT )) == null ? '' : __t) +
'" class=\'option-label-input span3\' />\n</div>\n\n<div class=\'option\' data-rv-each-option=\'model.' +
((__t = ( Formbuilder.options.mappings.OPTIONS )) == null ? '' : __t) +
'\'>\n  <input type="checkbox" class=\'js-default-updated\' data-rv-checked="option:checked" />\n  <a class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Add Option"><i class=\'icon-plus-sign\'></i></a>\n  <a class="js-remove-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Remove Option"><i class=\'icon-minus-sign\'></i></a>\n</div>\n\n<div class=\'fb-bottom-add\'>\n  <a class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">Add option</a>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/size"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Size</div>\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.SIZE )) == null ? '' : __t) +
'">\n  <option value="small">Small</option>\n  <option value="medium">Medium</option>\n  <option value="large">Large</option>\n</select>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/step"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Step</div>\n\n<input type="number" min=\'1\' placeholder="1" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.STEP )) == null ? '' : __t) +
'" style="width: 40px" /> Stepping for minute\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/suffix"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (typeof includeSuffix !== 'undefined'){ ;
__p += '\n  <label>\n    <input id=\'include_suffix_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\' type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_SUFFIX )) == null ? '' : __t) +
'\' />\n    Include "Suffix"\n  </label>\n';
 } ;
__p += '\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/suffix_label_value"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="control-group" id=\'suffix_div_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\'\n  style= \'' +
((__t = ( rf.get(Formbuilder.options.mappings.INCLUDE_SUFFIX) ? 'display:block' : 'display:none' )) == null ? '' : __t) +
'\' >\n  <label class="control-label">Suffix </label>\n  <div class="controls">\n    <input type="text" pattern="^[\\w]+[\\w\\s ]*"\n    data-rv-input=\n     "model.' +
((__t = ( Formbuilder.options.mappings.FULLNAME_SUFFIX_TEXT )) == null ? '' : __t) +
'"\n    value=\'Suffix\' placeholder="Suffix"/>\n  </div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/time_format"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Time Format</div>\n\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.TIME_FORMAT )) == null ? '' : __t) +
'">\n  <option value="HH:mm">HH:mm</option>\n  <option value="HH:mm:ss">HH:mm:ss</option>\n</select>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/time_only"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Time Only</div>\n\n<label>\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.TIME_ONLY )) == null ? '' : __t) +
'\' />\n  only time field\n</label>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/units"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Units</div>\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.UNITS )) == null ? '' : __t) +
'" />\n';

}
return __p
};

this["Formbuilder"]["templates"]["page"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (!opts.live) { ;
__p += '\n' +
((__t = ( Formbuilder.templates['partials/save_button']() )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.templates['partials/left_side']() )) == null ? '' : __t) +
'\n';
 } ;
__p += '\n' +
((__t = ( Formbuilder.templates['partials/right_side']({opts: opts}) )) == null ? '' : __t) +
'\n';
 if (!opts.live) { ;
__p += '\n<div class=\'fb-clear\'></div>\n';
 } ;
__p += '\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/add_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'fb-tab-pane active\' id=\'addField\'>\n  <div class=\'fb-add-field-types\'>\n    <div class=\'section\'>\n      ';
 for (i in Formbuilder.inputFields) { 
         if(Formbuilder.inputFields[i].getFieldType) { } else { ;
__p += '\n              <a data-field-type="' +
((__t = ( i )) == null ? '' : __t) +
'" class="' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">\n                ' +
((__t = ( Formbuilder.inputFields[i].addButton )) == null ? '' : __t) +
'\n              </a>\n            \n      ';
 } };
__p += '\n    </div>\n\n    <div class=\'section\'>\n      ';
 for (i in Formbuilder.nonInputFields) { ;
__p += '\n        <a data-field-type="' +
((__t = ( i )) == null ? '' : __t) +
'" class="' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">\n          ' +
((__t = ( Formbuilder.nonInputFields[i].addButton )) == null ? '' : __t) +
'\n        </a>\n      ';
 } ;
__p += '\n    </div>\n  </div>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/edit_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-tab-pane\' id=\'editField\'>\n  <div class=\'fb-edit-field-wrapper\'></div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/left_side"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-left\'>\n  <ul class=\'fb-tabs\'>\n    <li class=\'active\'><a data-target=\'#addField\'>Add new field</a></li>\n    <li><a data-target=\'#editField\'>Edit field</a></li>\n  </ul>\n\n  <div class=\'fb-tab-content\'>\n    ' +
((__t = ( Formbuilder.templates['partials/add_field']() )) == null ? '' : __t) +
'\n    ' +
((__t = ( Formbuilder.templates['partials/edit_field']() )) == null ? '' : __t) +
'\n  </div>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/right_side"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if(opts && opts.live) { ;
__p += '\n<form enctype="multipart/form-data"\n  id=\'formbuilder_form\'\n  class=\'fb-right-live\'\n  ';
 if(opts.submitUrl) { ;
__p += '\n  action="' +
((__t = ( opts.submitUrl )) == null ? '' : __t) +
'"\n  ';
 } ;
__p += '\n  method="post">\n';
 } else { ;
__p += '\n<div class=\'fb-right\'>\n';
 } ;
__p += '\n  <div class=\'fb-no-response-fields\'>\n    <div class=\'input-line nav_help_user\'>\n      <div class=\'nav_help_user_new_form\'></div>\n      <label>Select or drag and drop to add</label>\n    </div>\n  </div>\n  <div class=\'fb-response-fields\'></div>\n  ';
 if(opts && opts.submitUrl) { ;
__p += '\n  <input type="submit" value="Submit">\n  ';
 } ;
__p += '\n\n  ';
 for (l in (opts.hidden || {})) { ;
__p += '\n  <input type="hidden" name=' +
((__t = ( l)) == null ? '' : __t) +
' value=' +
((__t = ( opts.hidden[l])) == null ? '' : __t) +
'>\n  ';
 } ;
__p += '\n';
 if(opts && opts.live) { ;
__p += '\n</form>\n';
 } else { ;
__p += '\n</div>\n';
 } ;
__p += '\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/save_button"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-save-wrapper\'>\n  <button class=\'js-save-form ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'\'></button>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["view/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'subtemplate-wrapper\'>\n  ';
 if(opts.readonly){ ;
__p += '\n  <div class=\'cover\'></div>\n  ';
 } ;
__p += '\n  ' +
((__t = ( Formbuilder.templates['view/label']({rf: rf, opts: opts}) )) == null ? '' : __t) +
'\n\n  ';
 if (rf.get(Formbuilder.options.mappings.FIELD_TYPE) == 'checkboxes' ||
      rf.get(Formbuilder.options.mappings.FIELD_TYPE) == 'radio'){ ;
__p += '\n    ' +
((__t = ( Formbuilder.templates['view/description']({rf: rf}) )) == null ? '' : __t) +
'\n    ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf, opts: opts}) )) == null ? '' : __t) +
'\n  ';
 } else { ;
__p += '\n    ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf, opts: opts}) )) == null ? '' : __t) +
'\n    ' +
((__t = ( Formbuilder.templates['view/description']({rf: rf}) )) == null ? '' : __t) +
'\n  ';
 } ;
__p += '\n\n  ';
 if(!opts.live){ ;
__p += '\n  ' +
((__t = ( Formbuilder.templates['view/duplicate_remove']({rf: rf}) )) == null ? '' : __t) +
'\n  ';
 } ;
__p += '\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'subtemplate-wrapper\'>\n  <div class=\'cover\'></div>\n  ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf}) )) == null ? '' : __t) +
'\n  ';
 if(!opts.live){ ;
__p += '\n  ' +
((__t = ( Formbuilder.templates['view/duplicate_remove']({rf: rf}) )) == null ? '' : __t) +
'\n  ';
 } ;
__p += '\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/base_print"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if(opts.readonly && opts.view_type != 'print'){ ;
__p += '\n<div class=\'cover\'></div>\n';
 } ;
__p += '\n';
 if($.inArray(rf.get(Formbuilder.options.mappings.FIELD_TYPE), Formbuilder.options.PRINT_FIELDS_AS_SINGLE_ROW) != -1){ ;
__p += '\n  <td colspan=2 class="first_cell">\n    <span class="print-label">\n      ' +
((__t = ( Formbuilder.templates['view/label']({rf: rf, opts: opts}) )) == null ? '' : __t) +
'\n    </span>\n    <span class="print-description">\n      ' +
((__t = ( Formbuilder.templates['view/description']({rf: rf}) )) == null ? '' : __t) +
'\n    </span>\n    ';
 if (typeof Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].print === 'function'){ ;
__p += '\n      ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].print({rf: rf, opts: opts}) )) == null ? '' : __t) +
'\n    ';
 } else { ;
__p += '\n      ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf, opts: opts}) )) == null ? '' : __t) +
'\n    ';
 } ;
__p += '\n  </td>\n';
 } else { ;
__p += '\n  <td class="first_cell">\n    <span class="print-label">\n    ' +
((__t = ( Formbuilder.templates['view/label']({rf: rf, opts: opts}) )) == null ? '' : __t) +
'\n    </span>\n    <span class="print-description">\n    ' +
((__t = ( Formbuilder.templates['view/description']({rf: rf}) )) == null ? '' : __t) +
'\n    </span>\n  </td>\n  <td class=\'_' +
((__t = ( rf.get(Formbuilder.options.mappings.FIELD_TYPE) )) == null ? '' : __t) +
'\'>\n  ';
 if (typeof Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].print === 'function'){ ;
__p += '\n    ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].print({rf: rf, opts: opts}) )) == null ? '' : __t) +
'\n  ';
 } else { ;
__p += '\n    ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf, opts: opts}) )) == null ? '' : __t) +
'\n  ';
 } ;
__p += '\n  </td>\n';
 } ;
__p += '\n\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/base_print_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n<td colspan=2>\n  ';
 if (typeof Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].print === 'function'){ ;
__p += '\n\t' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].print({rf: rf}) )) == null ? '' : __t) +
'\n  ';
 } else { ;
__p += '\n\t' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf}) )) == null ? '' : __t) +
'\n  ';
 } ;
__p += '\n  ';
 if(!opts.live){ ;
__p += '\n  ' +
((__t = ( Formbuilder.templates['view/duplicate_remove']({rf: rf}) )) == null ? '' : __t) +
'\n  ';
 } ;
__p += '\n</td>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/description"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<span class=\'help-block\'>\n  ' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.DESCRIPTION)) )) == null ? '' : __t) +
'\n</span>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/duplicate_remove"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'actions-wrapper\'>\n  <a class="js-duplicate ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Duplicate Field"><i class=\'icon-plus-sign\'></i></a>\n  <a class="js-clear ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Remove Field"><i class=\'icon-minus-sign\'></i></a>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["view/label"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<label>\n  <span>' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.LABEL)) )) == null ? '' : __t) +
'\n  ';
 if (rf.get(Formbuilder.options.mappings.REQUIRED)) { ;
__p += '\n    <abbr title=\'required\'>*</abbr>\n  ';
 } ;
__p += '\n  ';
 if(rf.get('field_type') == 'esignature' || (rf.get('field_type') == 'esignature' && (typeof(Android) != 'undefined' || typeof(BRIJavaScriptInterface) != 'undefined')) ) {
      if(opts.view_type != 'print'){
   ;
__p += '\n    ';
 var lbl_info_to_show = 'click here to sign',
        esign_cid = rf.get('cid');
      if (rf.get('field_values') && rf.get('field_values')[rf.get('cid')+'_1']){
        lbl_info_to_show = 'click here to change';
      }
    ;
__p += '\n    <span class=\'label_info\'>' +
((__t = ( lbl_info_to_show )) == null ? '' : __t) +
'</span>\n  ';
 }
  } ;
__p += '\n</label>\n\n';

}
return __p
};