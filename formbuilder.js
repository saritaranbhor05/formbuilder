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
      PRINT_FIELDS_AS_SINGLE_ROW: ['document_center_hyperlink', 'file', 'take_pic_video_audio'],
      CKEDITOR_CONFIG: ' ',
      HIERARCHYSELECTORVIEW: ' ',
      COMPANY_HIERARCHY: [],
      PRINTVIEW: false,
      EDIT_FS_MODEL: false,
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
        EMPTY_OPTION_TEXT: 'field_options.empty_option_text'
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
      }
    });

    Formbuilder.registerField = function(name, opts) {
      var x, _i, _len, _ref;
      _ref = ['view', 'edit'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        opts[x] = _.template(opts[x]);
      }
      if (opts['print']) {
        opts['print'] = _.template(opts['print']);
      }
      Formbuilder.fields[name] = opts;
      if (opts.type === 'non_input') {
        return Formbuilder.nonInputFields[name] = opts;
      } else {
        return Formbuilder.inputFields[name] = opts;
      }
    };

    Formbuilder.views = {
      wizard_tab: Backbone.View.extend({
        className: "fb-tab",
        intialize: function() {
          return this.parentView = this.options.parentView;
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
          'click #gmap_button': 'openGMap',
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
          return this.listenTo(this.model, "destroy", this.remove);
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
          $('.easyWizardButtons').css('position', 'static');
          $('.easyWizardButtons').css('top', outerHeight);
          $('.easyWizardButtons').css('width', $('.easyPager').width() - 20);
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
        openGMap: function() {
          if ($('#gmapModal').length === 0) {
            if (this.field.addRequiredConditions) {
              this.field.addRequiredConditions();
            }
          }
          $('#gmap_ok').val(this.model.getCid());
          $('#gmapModal').modal({
            show: true
          });
          $("#gmapModal").on("shown", function(e) {
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
        },
        isValid: function() {
          if (!this.field.isValid) {
            return true;
          }
          return this.field.isValid(this.$el, this.model);
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
            return this.parentView.createAndShowEditView(this.model);
          }
        },
        clear: function() {
          return (function(index, that) {
            that.parentView.handleFormUpdate();
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
        initialize: function() {
          return this.listenTo(this.model, "destroy", this.remove);
        },
        render: function() {
          this.$el.html(Formbuilder.templates["edit/base" + (!this.model.is_input() ? '_non_input' : '')]({
            rf: this.model,
            opts: this.options
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
          'click .fb-add-field-types a': 'addField'
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
          this.$responseFields.sortable({
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
                _this.handleFormUpdate();
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
          return this.setDraggable();
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
        addSectionBreak: function(obj_view, cnt, back_visibility) {
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
        },
        applyEasyWizard: function() {
          (function(_this) {
            return (function(field_view, cnt, fieldViews, add_break_to_next, wizard_view, wiz_cnt, prev_btn_text, next_btn_text, showSubmit, sub_frag, _that) {
              var back_visibility, fd_views, _i, _len;
              for (_i = 0, _len = fieldViews.length; _i < _len; _i++) {
                field_view = fieldViews[_i];
                if (field_view.is_section_break && _this.options.view_type !== 'print') {
                  back_visibility = field_view.model.get(Formbuilder.options.mappings.BACK_VISIBLITY);
                  add_break_to_next = true;
                  prev_btn_text = field_view.model.get(Formbuilder.options.mappings.PREV_BUTTON_TEXT);
                  next_btn_text = field_view.model.get(Formbuilder.options.mappings.NEXT_BUTTON_TEXT);
                }
                if (cnt === 1) {
                  wizard_view = new Formbuilder.views.wizard_tab({
                    parentView: _this,
                    tagName: Formbuilder.baseConfig[_this.options.view_type] ? Formbuilder.baseConfig[_this.options.view_type].wizardTagName : 'div',
                    className: Formbuilder.baseConfig[_this.options.view_type] ? Formbuilder.baseConfig[_this.options.view_type].wizardClassName : 'fb-tab'
                  });
                  if (_this.options.view_type !== 'print') {
                    _this.addSectionBreak(wizard_view, wiz_cnt, back_visibility);
                  }
                  if (_this.options.view_type === 'print') {
                    wizard_view.$el.append('<colgroup><col style="width: 30%;"><col style="width: 70%;"></colgroup>');
                  }
                } else if (add_break_to_next && !field_view.is_section_break && _this.options.view_type !== 'print') {
                  wizard_view.$el.append(sub_frag);
                  sub_frag = document.createDocumentFragment();
                  _this.$responseFields.append(wizard_view.$el);
                  wizard_view = new Formbuilder.views.wizard_tab({
                    parentView: _this
                  });
                  wiz_cnt += 1;
                  if (add_break_to_next) {
                    add_break_to_next = false;
                  }
                  _this.addSectionBreak(wizard_view, wiz_cnt, back_visibility);
                }
                if (wizard_view && field_view && (!field_view.is_section_break || _this.options.view_type === 'print')) {
                  sub_frag.appendChild(field_view.render().el);
                }
                if (cnt === fieldViews.length && wizard_view) {
                  wizard_view.$el.append(sub_frag);
                  _this.$responseFields.append(wizard_view.$el);
                }
                cnt += 1;
                if (!field_view.is_section_break) {
                  field_view.$el.attr('data-step-id', wiz_cnt);
                }
              }
              fd_views = _this.fieldViews.filter(function(fd_view) {
                return fd_view.field_type === "ci-hierarchy";
              });
              if (fd_views.length > 0) {
                _this.bindHierarchyEvents(fd_views);
              }
              setTimeout((function() {
                _that.triggerEvent();
              }), 5);
              return $("#formbuilder_form").easyWizard({
                showSteps: false,
                submitButton: false,
                prevButton: prev_btn_text,
                nextButton: next_btn_text,
                after: function(wizardObj, prevStepObj, currentStepObj) {
                  var prev_clicked;
                  prev_clicked = false;
                  if (currentStepObj.children(':visible').length === 0) {
                    $activeStep.css({
                      height: '1px'
                    });
                    if (prev_clicked = wizardObj.direction === 'prev') {
                      $('.easyWizardButtons .prev').trigger('click');
                    } else {
                      $('.easyWizardButtons .next').trigger('click');
                    }
                  } else {
                    if ($nextStep.attr('show-back') === 'false') {
                      $('.prev').css("display", "none");
                    } else if (currentStepObj.attr('data-step') !== '1') {
                      $('.prev').css("display", "block");
                    }
                    $('#grid_div').scrollTop(0);
                  }
                  $('.easyPager').height($('.easyWizardWrapper .active').outerHeight() + $('.easyWizardButtons').outerHeight());
                  if (parseInt($nextStep.attr('data-step')) === thisSettings.steps && showSubmit) {
                    return wizardObj.parents('.form-panel').find('.update-button').show();
                  } else {
                    return wizardObj.parents('.form-panel').find('.update-button').hide();
                  }
                }
              });
            });
          })(this)(null, 1, this.fieldViews, false, null, 1, 'Back', 'Next', this.options.showSubmit, document.createDocumentFragment(), this);
          return this;
        },
        triggerEvent: function() {
          return (function(_this) {
            return function(field_view, fieldViews, model) {
              var _fn, _i, _len;
              _fn = function(x, count, should_incr, val_set, model, field_type_method_call, field_method_call, cid) {
                var _j, _k, _len1, _len2, _ref, _ref1, _results;
                if (field_view.model.get('field_type') === 'heading' || field_view.model.get('field_type') === 'free_text_html') {
                  _ref = field_view.$("label");
                  _results = [];
                  for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                    x = _ref[_j];
                    _results.push(count = (function(x, index, name, val, value) {
                      if ($(x).text() && !val_set) {
                        val_set = true;
                      }
                      return index;
                    })(x, count + (should_incr($(x).attr('type')) ? 1 : 0), null, null, 0));
                  }
                  return _results;
                } else if (field_view.model.get('field_type') === 'take_pic_video_audio') {
                  return _.each(model.get('field_values'), function(value, key) {
                    return (function(_this) {
                      return function(index) {
                        if (value) {
                          if ($('#capture_link_' + field_view.model.getCid())) {
                            if (_.isString(value)) {
                              if (value.indexOf("data:image") === -1) {
                                $('#capture_link_' + field_view.model.getCid()).append("<div class='capture_link_div' id=capture_link_div_" + key + "><a class='active_link_doc' target='_blank' type = 'pic_video_audio' name=" + key + " href=" + value + ">" + value.split("/").pop().split("?")[0] + "</a><span class='pull-right' id=capture_link_close_" + key + ">X</span></br></div>");
                              } else if (value.indexOf("data:image") === 0) {
                                $('#record_link_' + field_view.model.getCid()).attr('href', value);
                                $('#record_link_' + field_view.model.getCid()).text("View File");
                              }
                            } else if (_.isObject(value)) {
                              $('#capture_link_' + field_view.model.getCid()).append("<div class='capture_link_div' id=capture_link_div_" + key + "><a class='active_link_doc' target='_blank' type = 'pic_video_audio' name=" + key + " href=" + value.url + ">" + value.name + "</a><span class='pull-right' id=capture_link_close_" + key + ">X</span></br></div>");
                            }
                          }
                          if (_this.$('#capture_link_close_' + key)) {
                            return _this.$('#capture_link_close_' + key).click(function() {
                              return $('#capture_link_div_' + key).remove();
                            });
                          }
                        }
                      };
                    })(this)(0);
                  });
                } else if (field_view.model.get('field_type') === 'file') {
                  return _.each(model.get('field_values'), function(value, key) {
                    if (value !== "") {
                      return (function(_this) {
                        return function(a_href_val, a_text) {
                          if ($('#file_upload_link_' + field_view.model.getCid())) {
                            if (_.isString(value)) {
                              a_href_val = value;
                              a_text = value.split("/").pop().split("?")[0];
                            } else if (_.isObject(value)) {
                              a_href_val = value.url;
                              a_text = value.name;
                            }
                            _this.$('#file_upload_link_' + field_view.model.getCid()).html("<div class='file_upload_link_div' id=file_upload_link_div_" + key + "><a type = 'pic_video_audio' class='active_link_doc' target='_blank' name=" + key + " href=" + a_href_val + ">" + a_text + "</a></div>");
                          }
                          return _this.$('#file_' + field_view.model.getCid()).attr("required", false);
                        };
                      })(this)('', '');
                    }
                  });
                } else {
                  field_type_method_call = model.get(Formbuilder.options.mappings.FIELD_TYPE);
                  field_method_call = Formbuilder.fields[field_type_method_call];
                  cid = model.getCid();
                  if (field_method_call.setup) {
                    field_method_call.setup(field_view, model, Formbuilder.options.EDIT_FS_MODEL);
                    if (field_method_call.setValForPrint && _this.options.view_type === 'print') {
                      field_method_call.setValForPrint(field_view, model);
                    }
                  } else {
                    if (field_method_call.setValForPrint && _this.options.view_type === 'print') {
                      field_method_call.setValForPrint(field_view, model);
                    } else {
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
                  }
                  if (val_set && (Formbuilder.options.EDIT_FS_MODEL || field_type_method_call === 'checkboxes' || field_type_method_call === 'radio')) {
                    return field_view.trigger('change_state');
                  }
                }
              };
              for (_i = 0, _len = fieldViews.length; _i < _len; _i++) {
                field_view = fieldViews[_i];
                _fn(null, 0, function(attr) {
                  return attr !== 'radio';
                }, false, field_view.model, '', '', '');
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
                  if (Formbuilder.isAndroid() && $(elem).attr('ci_hierarchy_section')) {
                    if (val) {
                      return $(elem).data('id', val);
                    }
                  } else {
                    if (val) {
                      return $(elem).val(val);
                    }
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
            $('.easyWizardButtons .prev').addClass('hide btn-danger');
            $('.easyWizardButtons .next').addClass('btn-success');
            this.applyFileStyle();
            this.initializeEsings();
            return $('.readonly').find('input, textarea, select').attr('disabled', true);
          } else {
            return this.setSortable();
          }
        },
        bindHierarchyEvents: function(hierarchyViews) {
          return (function(_this) {
            return function(cid) {
              return _.each(hierarchyViews, function(hierarchyView) {
                return hierarchyView.field.setValue(hierarchyView);
              });
            };
          })(this)('');
        },
        hideShowNoResponseFields: function() {
          return this.$el.find(".fb-no-response-fields")[this.collection.length > 0 ? 'hide' : 'show']();
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
          this.collection.sort();
          this.collection.each(this.removeSourceConditions, this);
          this.collection.each(this.addConditions, this);
          payload = JSON.stringify({
            fields: this.collection.toJSON()
          });
          if (Formbuilder.options.HTTP_ENDPOINT) {
            this.doAjaxSave(payload);
          }
          return this.formBuilder.trigger('save', payload);
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
              return (function(field, i, invalid_field, err_field_types) {
                err_field_types = ['checkboxes', 'esignature', 'gmap', 'radio', 'scale_rating', 'take_pic_video_audio'];
                while (i < _this.fieldViews.length) {
                  field = _this.fieldViews[i];
                  if (_this.getCurrentView().indexOf(field.model.get('cid')) !== -1) {
                    if (field.isValid && !field.isValid()) {
                      field.$el.find('input').css('border-color', 'red');
                      field.$el.find('.hasDatepicker').css('border-color', 'red');
                      if (err_field_types.indexOf(field.field_type) !== -1) {
                        field.$el.find('label > span').css('color', 'red');
                      }
                      if (!invalid_field) {
                        invalid_field = true;
                      }
                    } else {
                      field.$el.find('input').css('border-color', '#CCCCCC');
                      field.$el.find('.hasDatepicker').css('border-color', '#CCCCCC');
                      field.$el.find('.bootstrap-filestyle label').css('border-color', 'rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25)');
                      field.$el.find('.bootstrap-filestyle label').css('border-bottom-color', '#b3b3b3');
                      field.$el.find('label > span').css('color', '#333');
                    }
                  }
                  i++;
                }
                if (invalid_field) {
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
        return function($str_add) {
          if (model.attributes.field_values) {
            field_view.$el.find("#address").val(model.attributes.field_values["" + (model.getCid()) + "_1"]);
            field_view.$el.find("#suburb").val(model.attributes.field_values["" + (model.getCid()) + "_2"]);
            field_view.$el.find("#state").val(model.attributes.field_values["" + (model.getCid()) + "_3"]);
            field_view.$el.find("#zipcode").val(model.attributes.field_values["" + (model.getCid()) + "_4"]);
            field_view.$el.find("select").val(model.attributes.field_values["" + (model.getCid()) + "_5"]);
          } else {
            _this.clearFields;
          }
          if ($str_add.val() !== '') {
            return field_view.trigger('change_state');
          }
        };
      })(this)(field_view.$el.find("#address"));
    },
    setValForPrint: function(field_view, model) {
      return (function(_this) {
        return function(fields, values, i) {
          var key, _results;
          _results = [];
          for (key in values) {
            _results.push($(fields[i++]).html(values[key]));
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
    print: "<% var field_options = rf.get(Formbuilder.options.mappings.OPTIONS) || [] %>\n<% var cnt = field_options.length %>\n<% var labelArr = [] %>\n<% _.each(field_options, function(option){ %>\n  <%   labelArr.push(option.label) %>\n<% }) %>\n<% var field_values =  rf.get('field_values') %>\n<% var cid =  rf.get('cid') %>\n<% if(field_values){ %>\n  <%var index=0%>\n  <% _.each(field_values, function(value){ %>\n  <%   if(value){ %>\n    <label>\n    <% if(labelArr[index]) %>\n      <%= labelArr[index] %>\n      <% else if(typeof value == 'string' && value.trim() != '') %>\n      <%= value %>\n    </label>\n    <%  } %>\n    <% index++ %>\n  <%  }); %>\n<% } %>",
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
      var elem, _i, _len, _ref, _results;
      _ref = $el.find('input:checked');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        _results.push(elem.checked = false);
      }
      return _results;
    },
    evalCondition: function(clicked_element, cid, condition, set_value) {
      return (function(_this) {
        return function(elem_val, check_result) {
          elem_val = clicked_element.find("input[value = '" + set_value + "']").is(':checked');
          check_result = condition(elem_val, true);
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
  Formbuilder.registerField('ci-hierarchy', {
    view: "<div class=\"row-fluid\">\n  <div class=\"control-group\">\n    <label class=\"control-label\">Organisation </label>\n    <div class=\"controls\">\n    <% if(Formbuilder.isAndroid()) { %>\n    <input id=\"company_id_<%= rf.getCid() %>\" name=\"company_id_<%= rf.getCid() %>\" readonly=\"true\" ci_hierarchy_section=\"org\" ></input>\n    <% }else { %>\n      <select id=\"company_id_<%= rf.getCid() %>\">\n        <% if (rf.get(Formbuilder.options.mappings.INCLUDE_BLANK)) { %>\n          <option value=''></option>\n        <% } %>\n      </select>\n    <% } %>\n    </div>\n  </div>\n  <div class=\"control-group\">\n    <label class=\"control-label\">Location </label>\n    <div class=\"controls\">\n    <% if(Formbuilder.isAndroid()) { %>\n    <input id=\"location_id_<%= rf.getCid() %>\" name=\"location_id_<%= rf.getCid() %>\" readonly=\"true\" ci_hierarchy_section=\"loc\" ></input>\n    <% }else { %>\n      <select id=\"location_id_<%= rf.getCid() %>\">\n        <% if (rf.get(Formbuilder.options.mappings.INCLUDE_BLANK)) { %>\n          <option value=''></option>\n        <% } %>\n      </select>\n    <% } %>\n    </div>\n  </div>\n  <div class=\"control-group\">\n    <label class=\"control-label\">Division </label>\n    <div class=\"controls\">\n    <% if(Formbuilder.isAndroid()) { %>\n    <input id=\"division_id_<%= rf.getCid() %>\" name=\"division_id_<%= rf.getCid() %>\" readonly=\"true\" ci_hierarchy_section=\"div\" ></input>\n    <% }else { %>\n      <select id=\"division_id_<%= rf.getCid() %>\">\n        <% if (rf.get(Formbuilder.options.mappings.INCLUDE_BLANK)) { %>\n          <option value=''></option>\n        <% } %>\n      </select>\n    <% } %>\n    </div>\n  </div>\n  <div class=\"control-group\">\n    <label class=\"control-label\">User </label>\n    <div class=\"controls\">\n    <% if(Formbuilder.isAndroid()) { %>\n    <input id=\"user_id_<%= rf.getCid() %>\" name=\"user_id_<%= rf.getCid() %>\" readonly=\"true\" ci_hierarchy_section=\"user\">\n    </input>\n    <% }else { %>\n      <select id=\"user_id_<%= rf.getCid() %>\">\n        <% if (rf.get(Formbuilder.options.mappings.INCLUDE_BLANK)) { %>\n          <option value=''></option>\n        <% } %>\n      </select>\n    <% } %>\n    </div>\n  </div>\n</div>",
    edit: "",
    print: "<table class=\"innerTbl\">\n  <tbody>\n    <tr>\n      <td><label>Organisation </label>\n      </td>\n      <td>\n        <label>Location </label>\n      </td>\n      <td>\n        <label>Division </label>\n      </td>\n      <td>\n        <label>User </label>\n      </td>\n    </tr>\n    <tr>\n      <td>\n        <label id=\"company_id_<%= rf.getCid() %>\"></label>\n      </td>\n      <td>\n        <label id=\"location_id_<%= rf.getCid() %>\"></label>\n      </td>\n      <td>\n        <label id=\"division_id_<%= rf.getCid() %>\"></label>\n      </td>\n      <td>\n        <label id=\"user_id_<%= rf.getCid() %>\"></label>\n      </td>\n    </tr>\n  </tbody>\n</table>",
    addButton: "<span class=\"symbol\">\n  <span class=\"icon-caret-down\"></span>\n</span> Hierarchy",
    selected_comp: null,
    checkAttributeHasValue: function(cid, $el) {
      return (function(_this) {
        return function(incomplete) {
          var call_back;
          call_back = function(k, v) {
            if (v.value === '') {
              return incomplete = true;
            }
          };
          $el.find('select').each(call_back);
          if (incomplete === true) {
            return false;
          }
          return cid;
        };
      })(this)(false);
    },
    defaultAttributes: function(attrs) {
      attrs.field_options.size = 'small';
      return attrs;
    },
    bindChangeEvents: function(fd_view) {
      return (function(_this) {
        return function(cid, $company_id, $location_id, $division_id, field_values, selected_compId, selected_locId, selected_divId, $user_id, selected_userId) {
          cid = fd_view.model.attributes.cid;
          field_values = fd_view.model.attributes.field_values;
          $company_id = fd_view.$("#company_id_" + cid);
          $location_id = fd_view.$("#location_id_" + cid);
          $division_id = fd_view.$("#division_id_" + cid);
          $user_id = fd_view.$("#user_id_" + cid);
          $company_id.bind('change', {
            that: _this,
            fd_view: fd_view
          }, _this.populateLocationsByCompanyId);
          $location_id.bind('change', {
            that: _this,
            fd_view: fd_view
          }, _this.populateDivisionsByLocId);
          $division_id.bind('change', {
            that: _this,
            fd_view: fd_view
          }, _this.populateUsersByDivisionId);
          if (field_values) {
            if ($company_id) {
              selected_compId = _this.getSelectedFieldVal($company_id, field_values);
            }
            if ($location_id) {
              selected_locId = _this.getSelectedFieldVal($location_id, field_values);
            }
            if ($division_id) {
              selected_divId = _this.getSelectedFieldVal($division_id, field_values);
            }
            if ($user_id) {
              selected_userId = _this.getSelectedFieldVal($user_id, field_values);
            }
          }
          return _this.populateCompanies(fd_view, selected_compId, selected_locId, selected_divId, selected_userId);
        };
      })(this)(null, null, null, null, null, '', '', '', null, '');
    },
    getSelectedFieldVal: function($ele, fieldValues) {
      return (function(_this) {
        return function(name, selectedId) {
          name = $ele.attr('name');
          selectedId = fieldValues[name];
          return selectedId;
        };
      })(this)('', '');
    },
    populateCompanies: function(fd_view, selected_compId, selected_locId, selected_divId, selected_userId) {
      if (selected_compId == null) {
        selected_compId = '';
      }
      if (selected_locId == null) {
        selected_locId = '';
      }
      if (selected_divId == null) {
        selected_divId = '';
      }
      if (selected_userId == null) {
        selected_userId = '';
      }
      return (function(_this) {
        return function(companies, $company_id, cid) {
          cid = fd_view.model.attributes.cid;
          $company_id = fd_view.$("#company_id_" + cid);
          if ($company_id && companies && companies.length > 0) {
            if (Formbuilder.isAndroid()) {
              _this.clearInputFiledForAndroid($company_id);
            } else {
              $company_id.empty();
            }
            fd_view.field.clearSelectFields(fd_view, cid);
            fd_view.field.addPlaceHolder($company_id, '--- Select ---');
            fd_view.field.appendData($company_id, companies);
            if (selected_compId && selected_compId !== '') {
              if (Formbuilder.isAndroid()) {
                $company_id.data('id', selected_compId);
              } else {
                $company_id.val(selected_compId);
              }
              return _this.setSelectedCompAndPopulateLocs(fd_view, selected_compId, selected_locId, selected_divId, selected_userId, $company_id);
            }
          }
        };
      })(this)(Formbuilder.options.COMPANY_HIERARCHY, null, null);
    },
    populateLocationsByCompanyId: function(e) {
      return (function(_this) {
        return function(selected_company_id, that, fd_view, e) {
          if (Formbuilder.isAndroid()) {
            selected_company_id = $(e.currentTarget).data('id');
            console.log('new company id = ', selected_company_id);
          }
          return that.setSelectedCompAndPopulateLocs(fd_view, selected_company_id);
        };
      })(this)($(e.currentTarget).val(), e.data.that, e.data.fd_view, e);
    },
    setSelectedCompAndPopulateLocs: function(fd_view, selected_compId, selected_locId, selected_divId, selected_userId, $company_div) {
      if (selected_locId == null) {
        selected_locId = '';
      }
      if (selected_divId == null) {
        selected_divId = '';
      }
      if (selected_userId == null) {
        selected_userId = '';
      }
      if ($company_div == null) {
        $company_div = null;
      }
      this.selected_comp = Formbuilder.options.COMPANY_HIERARCHY.getHashObject(selected_compId);
      if (Formbuilder.isAndroid() && $company_div) {
        $company_div.val(this.selected_comp.name);
      }
      this.clearSelectFields(fd_view, fd_view.model.attributes.cid);
      return this.populateLocations(fd_view, this.selected_comp, selected_locId, selected_divId, selected_userId);
    },
    populateLocations: function(fd_view, selected_comp, selected_locId, selected_divId, selected_userId) {
      if (selected_locId == null) {
        selected_locId = '';
      }
      if (selected_divId == null) {
        selected_divId = '';
      }
      if (selected_userId == null) {
        selected_userId = '';
      }
      return (function(_this) {
        return function(locations, $location_id) {
          $location_id = fd_view.$("#location_id_" + fd_view.model.attributes.cid);
          if (selected_comp) {
            locations = selected_comp.locations;
          }
          if ($location_id && locations.length > 0) {
            _this.addPlaceHolder($location_id, '--- Select ---');
            _this.appendData($location_id, locations);
            if (selected_locId && selected_locId !== '') {
              if (Formbuilder.isAndroid()) {
                $location_id.data('id', selected_locId);
              } else {
                $location_id.val(selected_locId);
              }
              return _this.setSelectedLocAndPopulateDivs(fd_view, selected_locId, selected_divId, selected_userId, $location_id);
            }
          }
        };
      })(this)([], null);
    },
    populateDivisionsByLocId: function(e) {
      return (function(_this) {
        return function(selected_location_id, that, fd_view) {
          if (Formbuilder.isAndroid()) {
            selected_location_id = $(e.currentTarget).data('id');
            console.log('new location id = ', selected_location_id);
          }
          return that.setSelectedLocAndPopulateDivs(fd_view, selected_location_id);
        };
      })(this)($(e.currentTarget).val(), e.data.that, e.data.fd_view);
    },
    setSelectedLocAndPopulateDivs: function(fd_view, selected_locId, selected_divId, selected_userId, $location_div) {
      if (selected_divId == null) {
        selected_divId = '';
      }
      if (selected_userId == null) {
        selected_userId = '';
      }
      if ($location_div == null) {
        $location_div = null;
      }
      return (function(_this) {
        return function(selected_loc) {
          _this.selected_loc = _this.selected_comp.locations.getHashObject(selected_locId);
          if (Formbuilder.isAndroid() && $location_div) {
            $location_div.val(_this.selected_loc.name);
          }
          return _this.populateDivisions(fd_view, _this.selected_loc, selected_divId, selected_userId);
        };
      })(this)(null);
    },
    populateDivisions: function(fd_view, selected_loc, selected_divId, selected_userId) {
      if (selected_divId == null) {
        selected_divId = '';
      }
      if (selected_userId == null) {
        selected_userId = '';
      }
      return (function(_this) {
        return function(divisions, $division_id, $user_id) {
          $division_id = fd_view.$("#division_id_" + fd_view.model.attributes.cid);
          $user_id = fd_view.$("#user_id_" + fd_view.model.attributes.cid);
          if (selected_loc) {
            divisions = selected_loc.divisions;
          }
          if (Formbuilder.isAndroid()) {
            _this.clearInputFiledForAndroid($division_id);
            _this.clearInputFiledForAndroid($user_id);
          } else {
            $division_id.empty();
            $user_id.empty();
          }
          _this.addPlaceHolder($division_id, '--- Select ---');
          if ($division_id && divisions.length > 0) {
            _this.appendData($division_id, divisions);
            if (selected_divId && selected_divId !== '') {
              if (Formbuilder.isAndroid()) {
                $division_id.data('id', selected_divId);
              } else {
                $division_id.val(selected_divId);
              }
              return _this.setSelectedDivAndPopulateUsers(fd_view, selected_divId, selected_userId, $division_id);
            }
          }
        };
      })(this)([], null, null);
    },
    populateUsersByDivisionId: function(e) {
      return (function(_this) {
        return function(selected_division_id, that, fd_view) {
          if (Formbuilder.isAndroid()) {
            selected_division_id = $(e.currentTarget).data('id');
            console.log('new division id = ', selected_division_id);
          }
          return that.setSelectedDivAndPopulateUsers(fd_view, selected_division_id);
        };
      })(this)($(e.currentTarget).val(), e.data.that, e.data.fd_view);
    },
    setSelectedDivAndPopulateUsers: function(fd_view, selected_divId, selected_userId, $division_div) {
      if (selected_userId == null) {
        selected_userId = '';
      }
      if ($division_div == null) {
        $division_div = null;
      }
      return (function(_this) {
        return function(selected_div) {
          selected_div = _this.selected_loc.divisions.getHashObject(selected_divId);
          if (Formbuilder.isAndroid() && $division_div) {
            $division_div.val(selected_div.name);
          }
          return _this.populateUsers(fd_view, selected_div, selected_userId);
        };
      })(this)(null);
    },
    populateUsers: function(fd_view, selected_div, selected_userId) {
      if (selected_userId == null) {
        selected_userId = '';
      }
      return (function(_this) {
        return function(users, $user_id) {
          var selected_user_obj;
          $user_id = fd_view.$("#user_id_" + fd_view.model.attributes.cid);
          if (selected_div) {
            users = selected_div.users;
          }
          if (Formbuilder.isAndroid()) {
            _this.clearInputFiledForAndroid($user_id);
          } else {
            $user_id.empty();
          }
          _this.addPlaceHolder($user_id, '--- Select ---');
          if ($user_id && users.length > 0) {
            _this.appendData($user_id, users);
            if (selected_userId && selected_userId !== '') {
              if (Formbuilder.isAndroid()) {
                $user_id.data('id', selected_userId);
                selected_user_obj = users.getHashObject(selected_userId);
                if (selected_user_obj) {
                  return $user_id.val(selected_user_obj.name);
                }
              } else {
                return $user_id.val(selected_userId);
              }
            }
          }
        };
      })(this)([], null);
    },
    clearSelectFields: function(fd_view, cid) {
      if (Formbuilder.isAndroid()) {
        this.clearInputFiledForAndroid(fd_view.$("#location_id_" + cid));
        this.clearInputFiledForAndroid(fd_view.$("#division_id_" + cid));
        return this.clearInputFiledForAndroid(fd_view.$("#user_id_" + cid));
      } else {
        fd_view.$("#location_id_" + cid).empty();
        fd_view.$("#division_id_" + cid).empty();
        return fd_view.$("#user_id_" + cid).empty();
      }
    },
    clearInputFiledForAndroid: function(elem) {
      elem.removeAttr('placeholder');
      elem.removeData('id');
      elem.removeData('options');
      return elem.val('');
    },
    appendData: function($element, data) {
      if (Formbuilder.isAndroid()) {
        return (function(formatted_arr, index) {
          _.each(data, function(obj_hash) {
            return (function(temp) {
              temp[obj_hash.id] = obj_hash.name;
              return formatted_arr[index++] = temp;
            })({});
          });
          return $element.data('options', formatted_arr);
        })({}, 0);
      } else {
        return (function(_this) {
          return function(appendString) {
            return _.each(data, function(obj_hash) {
              this.appendString = "<option value='" + obj_hash.id + "'>";
              this.appendString += obj_hash.name + "</option>";
              return $element.append(this.appendString);
            });
          };
        })(this)('');
      }
    },
    addPlaceHolder: function($element, name) {
      if (Formbuilder.isAndroid()) {
        $element.attr("placeholder", name);
        return $element.data('id', '');
      } else {
        return $element.html("<option value=''>" + name + "</option>");
      }
    },
    clearFields: function($el, model) {
      return (function(_this) {
        return function(cid) {
          cid = model.attributes.cid;
          $el.find("#company_id_" + cid).val("");
          $el.find("#location_id_" + cid).val("");
          $el.find("#division_id_" + cid).val("");
          return $el.find("#user_id_" + cid).val("");
        };
      })(this)('');
    },
    isValid: function($el, model) {
      return (function(_this) {
        return function(valid, cid) {
          cid = model.attributes.cid;
          valid = (function(required_attr, checked_chk_cnt) {
            if (!required_attr) {
              return true;
            }
            if (Formbuilder.isAndroid()) {
              return $el.find("#company_id_" + cid).data('id') !== '' && $el.find("#location_id_" + cid).data('id') !== '' && $el.find("#division_id_" + cid).data('id') !== '' && $el.find("#user_id_" + cid).data('id') !== '';
            } else {
              return $el.find("#company_id_" + cid).val() !== '' && $el.find("#location_id_" + cid).val() !== '' && $el.find("#division_id_" + cid).val() !== '' && $el.find("#user_id_" + cid).val() !== '';
            }
          })(model.get('required'), 0);
          return valid;
        };
      })(this)(false, '');
    },
    evalCondition: function(clicked_element, cid, condition, set_value) {
      return (function(_this) {
        return function(check_result, $comp, $loc, $div, $user, comp_name, comp_id, loc_id, div_id, user_id, loc_name, div_name, _toLowerCase_set_val, user_name) {
          $comp = clicked_element.find("#company_id_" + cid);
          $loc = clicked_element.find("#location_id_" + cid);
          $div = clicked_element.find("#division_id_" + cid);
          $user = clicked_element.find("#user_id_" + cid);
          if (Formbuilder.isAndroid()) {
            comp_id = $comp.data('id');
            loc_id = $loc.data('id');
            div_id = $div.data('id');
            user_id = $user.data('id');
            comp_name = $comp.val();
            loc_name = $loc.val();
            div_name = $div.val();
            user_name = $user.val();
          } else {
            comp_id = $comp.val();
            loc_id = $loc.val();
            div_id = $div.val();
            user_id = $user.val();
            comp_name = $comp.find('option:selected').text();
            loc_name = $loc.find('option:selected').text();
            div_name = $div.find('option:selected').text();
            user_name = $user.find('option:selected').text();
          }
          if (condition === '!=') {
            check_result = comp_id !== '' && loc_id !== '' && div_id !== '' && user_id !== '';
          } else if (condition === '==') {
            _toLowerCase_set_val = set_value.toLowerCase();
            check_result = comp_name.toLowerCase() === _toLowerCase_set_val || loc_name.toLowerCase() === _toLowerCase_set_val || div_name.toLowerCase() === _toLowerCase_set_val || user_name.toLowerCase() === _LowerCase_set_val;
          }
          return check_result;
        };
      })(this)(false, null, null, null, null, '', '', '', '', '', '', '', '', '');
    },
    add_remove_require: function(cid, required) {
      $("#company_id_" + cid).attr("required", required);
      $("#location_id_" + cid).attr("required", required);
      $("#division_id_" + cid).attr("required", required);
      return $("#user_id_" + cid).attr("required", required);
    },
    setValue: function(fd_view) {
      if (fd_view.options.view_type === 'print') {
        return this.setValForPrint(fd_view);
      } else {
        return this.bindChangeEvents(fd_view);
      }
    },
    setValForPrint: function(fd_view) {
      return (function(_this) {
        return function(cid, $company_id, $location_id, $division_id, $user_id, field_values, selected_compId, selected_locId, selected_divId, selected_userId, comp_obj, loc_obj, div_obj, user_obj, companies) {
          cid = fd_view.model.attributes.cid;
          field_values = fd_view.model.attributes.field_values;
          $company_id = fd_view.$("#company_id_" + cid);
          $location_id = fd_view.$("#location_id_" + cid);
          $division_id = fd_view.$("#division_id_" + cid);
          $user_id = fd_view.$("#user_id_" + cid);
          if (field_values) {
            if ($company_id) {
              selected_compId = field_values[cid + '_1'];
            }
            if ($location_id) {
              selected_locId = field_values[cid + '_2'];
            }
            if ($division_id) {
              selected_divId = field_values[cid + '_3'];
            }
            if ($user_id && field_values[cid + '_4']) {
              selected_userId = field_values[cid + '_4'];
            }
          }
          if (selected_compId) {
            comp_obj = _this.findObjFrmData(companies, selected_compId);
            $company_id.text(comp_obj && comp_obj.name || '');
            if (comp_obj && selected_locId) {
              loc_obj = _this.findObjFrmData(comp_obj.locations, selected_locId);
              $location_id.text(loc_obj && loc_obj.name || '');
              if (loc_obj && selected_divId) {
                div_obj = _this.findObjFrmData(loc_obj.divisions, selected_divId);
                $division_id.text(div_obj && div_obj.name || '');
                if (div_obj && selected_userId) {
                  user_obj = _this.findObjFrmData(div_obj.users, selected_userId);
                  return $user_id.text(user_obj && user_obj.name || '');
                }
              }
            } else {
              return _this.setEmptyForPrint(fd_view, cid);
            }
          } else {
            return _this.setEmptyForPrint(fd_view, cid);
          }
        };
      })(this)(null, null, null, null, null, null, '', '', '', '', null, null, null, null, Formbuilder.options.COMPANY_HIERARCHY);
    },
    findObjFrmData: function(data, selected_id) {
      return (function(_this) {
        return function(obj) {
          _.each(data, function(obj_hash) {
            if (obj_hash.id === parseInt(selected_id)) {
              obj = obj_hash;
              return false;
            }
          });
          return obj;
        };
      })(this)(null);
    },
    setEmptyForPrint: function(fd_view, cid) {
      fd_view.$("#company_id_" + cid).text('');
      fd_view.$("#location_id_" + cid).text('');
      fd_view.$("#division_id_" + cid).text('');
      return fd_view.$("#user_id_" + cid).text('');
    }
  });

}).call(this);

(function() {
  if (typeof CKEDITOR !== 'undefined') {
    Formbuilder.registerField('free_text_html', {
      type: 'non_input',
      view: "<%\n  if(rf.get(Formbuilder.options.mappings.OPTIONAL_FIELD)){\n      \n    if($(\"#title_\"+rf.getCid()).is(':disabled')){\n      $(\"#title_\"+rf.getCid()).attr(\"disabled\",false);\n    }\n\n    if(!$(\"#title_\"+rf.getCid()).is(':focus')){\n      $(\"#title_\"+rf.getCid()).val(rf.get(Formbuilder.options.mappings.LABEL));\n      $(\"#title_\"+rf.getCid()).focus();\n    }\n%>\n  <label class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'>\n    <%= rf.get(Formbuilder.options.mappings.LABEL) %>\n  </label>\n<% }else{\n    $(\"#title_\"+rf.getCid()).val(\"\");\n    $(\"#title_\"+rf.getCid()).attr(\"disabled\",true);\n} %>\n<div class=\"freeTextHTMLDiv\" id='<%= rf.getCid() %>'></div>\n<script>\n  $(function() {\n    var data = \"<%=rf.get(Formbuilder.options.mappings.HTML_DATA)%>\"\n    $(\"#<%= rf.getCid() %>\").html(data);\n  });\n</script>\n\n",
      edit: "<%= Formbuilder.templates['edit/optional_title']() %>\n</br>\n\n<input id=\"title_<%= rf.getCid() %>\" type='text' \n  <% \n  if(!rf.get(Formbuilder.options.mappings.OPTIONAL_FIELD)){\n    disabled=\"true\"\n  }\n  %>\ndata-rv-input='model.<%= Formbuilder.options.mappings.LABEL %>'/>\n\n\n<div class='inline'>\n  <span>Edit Here:</span>\n  <div class='fb-bottom-add'>\n    <a id='button_<%= rf.getCid() %>'\n      class=\"js-add-document <%= Formbuilder.options.BUTTON_CLASS %>\">\n        Edit\n    </a>\n  </div>\n</div>\n\n<div id=\"open_model_<%= rf.getCid() %>\"\n  class=\"modal hide fade modal_style\" tabindex=\"-1\"\n  role=\"dialog\" aria-labelledby=\"ModalLabel\" aria-hidden=\"true\">\n  <div class=\"modal-header\">\n    <button type=\"button\" class=\"close\" data-dismiss=\"modal\"\n      aria-hidden=\"true\">&times;</button>\n    <h3>Select Documents</h3>\n  </div>\n  <div class=\"modal-body\" id=\"modal_body_<%= rf.getCid() %>\">\n    <textarea id='ck_<%= rf.getCid() %>' contenteditable=\"true\" data-rv-value='model.<%= Formbuilder.options.mappings.HTML_DATA %>'>\n    </textarea>\n  </div>\n  <div class=\"modal-footer\">\n    <button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">\n      Done\n    </button>\n  </div>\n</div>\n\n<script>\n  $(function() {\n    $(document).ready( function() {\n      $(\"#button_<%= rf.getCid() %>\").click( function() {\n\n        $(\"#open_model_<%= rf.getCid() %>\").on('shown', function() {\n          var that = $(this).data('modal');\n          $(document).off('focusin.modal').on('focusin.modal', function (e) {\n            // Add this line \n            if( e.target.className && e.target.className.indexOf('cke_') == 0 ) return; \n            // Original \n            if (that.$element[0] !== e.target && !that.$element.has(e.target).length) { \n            that.$element.focus() } \n          });\n        });\n\n        $(\"#open_model_<%= rf.getCid() %>\").modal('show');\n\n        $(\"#open_model_<%= rf.getCid() %>\").on('hidden', function() {\n          $(\"#ck_<%= rf.getCid() %>\").val(editor_<%= rf.getCid() %>.getData().replace(/(\\r\\n|\\n|\\r)/gm, \"\").replace(/\"/g,\"'\"));\n          $(\"#ck_<%= rf.getCid() %>\").trigger(\"change\");\n          $(this).unbind('shown');\n          $(this).unbind('hidden');\n        });\n      });\n      CKEDITOR.disableAutoInline = true;\n      // this event fired when any popup is opened inside ckeditor\n      CKEDITOR.on('dialogDefinition', function(ev){\n          var dialogName = ev.data.name;\n          var dialogDef  = ev.data.definition;\n          // check if link popup is opened\n          if(dialogName === \"link\"){\n            // remove unwanted link types\n            dialogDef.getContents('info').get('linkType')['items'].splice(1,2);\n            // remove unwanted protocols\n            dialogDef.getContents('info').get('protocol')['items'].splice(2,5);\n            // select another tab called as target\n            var targetTab = dialogDef.getContents('target').elements[0];\n            if(typeof targetTab.children === \"object\" && typeof targetTab.children[0] === \"object\"){\n              if(typeof targetTab.children[0].items === \"object\"){\n                // validate and then remove unwanted options in target tab\n                if(targetTab.children[0].items.length > 1){\n                  targetTab.children[0].items.splice(4,3);\n                  targetTab.children[0].items.splice(0,3);\n                  targetTab.children[0].default = \"_blank\";\n                }                      \n              }\n            }\n          }\n        });\n      editor_<%= rf.getCid() %> = CKEDITOR.replace(document.getElementById(\"ck_<%= rf.getCid() %>\"),\n        Formbuilder.options.CKEDITOR_CONFIG\n      );\n    });\n  });\n</script>\n",
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
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('document_center_hyperlink', {
    view: "<div id='document_list_<%= rf.getCid() %>'\n  class='document_list_<%= rf.getCid() %>'>\n</div>\n<script>\n  $(function() {\n    var data = \"<%=rf.get(Formbuilder.options.mappings.HTML_DATA)%>\";\n    if($(\".document_list_<%= rf.getCid() %>\").length > 1){\n      $($(\".document_list_<%= rf.getCid() %>\")[1]).html(data);\n    }\n    $(\"#document_list_<%= rf.getCid() %>\").html(data);\n  });\n</script>\n<div id=\"open_model_<%= rf.getCid() %>\"\n  class=\"modal hide fade modal_style\" tabindex=\"-1\"\n  role=\"dialog\" aria-labelledby=\"ModalLabel\" aria-hidden=\"true\">\n  <div class=\"modal-header\">\n    <button type=\"button\" class=\"close\" data-dismiss=\"modal\"\n      aria-hidden=\"true\">&times;</button>\n    <h3>Select Documents</h3>\n  </div>\n  <div class=\"modal-body\" id=\"modal_body_<%= rf.getCid() %>\">\n    <div id=\"doc_hierarchy_tree_<%= rf.getCid() %>\" class=\"doc_hierarchy_selection_div modal_section\">\n    </div>\n  </div>\n  <div class=\"modal-footer\">\n    <button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">\n      Done\n    </button>\n  </div>\n</div>",
    edit: "<div class='fb-edit-section-header'>Options</div>\n<textarea\n  id='documents_<%= rf.getCid() %>'\n  data-rv-value='model.<%= Formbuilder.options.mappings.HTML_DATA %>'\n  style=\"\n    display:none;\n  \"\n>\n</textarea>\n<div class='fb-bottom-add'>\n  <a id='button_<%= rf.getCid() %>'\n    class=\"js-add-document <%= Formbuilder.options.BUTTON_CLASS %>\">\n      Add Documents\n  </a>\n</div>\n<script>\n  $(function() {\n    var geo_doc_hierarchy =\n      [\n        {companies:\"Company\"},\n        {locations:\"Location\"},\n        {divisions:\"Division\"},\n        {documents:\"Document\"}\n      ];\n    $(\"#button_<%= rf.getCid() %>\").click( function() {\n      $(\"#open_model_<%= rf.getCid() %>\").modal('show');\n      $(\"#open_model_<%= rf.getCid() %>\").on('shown', function() {\n        getHierarchy(getListOfPerviousDocuments(\n          'document_list_<%= rf.getCid() %>',\n          'a'\n        ));\n      });\n      $(\"#open_model_<%= rf.getCid() %>\").on('hidden', function() {\n        addSelectedDocuments(getListOfPerviousDocuments(\n          'doc_hierarchy_tree_<%= rf.getCid() %>',\n          'input'\n        ));\n        $(this).unbind('shown');\n        $(this).unbind('hidden');\n        hierarchy_selector_view.remove();\n        $(\"#modal_body_<%= rf.getCid() %>\").append('<div id=\"doc_hierarchy_tree_<%= rf.getCid() %>\" class=\"modal_section\"></div>'\n        );\n      });\n    });\n\n    function getListOfPerviousDocuments(el,el_type){\n      var checked_documents = {},\n          document_ids_hash = {documents:[]}, checked;\n      checked = el_type === 'a' ? '' : ':checked'\n      checked_documents =\n        $('#'+el).find(\n          el_type+'[level=document]'+checked\n        );\n      _.each(checked_documents, function(checked_document){\n        var document_id;\n        document_id = checked_document.id;\n        document_ids_hash['documents'].push(\n          document_id.slice(9,document_id.length)\n        );\n      });\n      return document_ids_hash;\n    }\n\n    function addSelectedDocuments(document_ids_hash) {\n      var final = '';\n      _.each(document_ids_hash['documents'], function(document_id){\n        var document_url = '/documents/'+document_id;\n        $.ajax({\n          async: \"false\",\n          url: document_url,\n          type: \"GET\",\n          data: {},\n          dataType: \"json\",\n          success: function (result) {\n            if(result){\n              final = final.concat(\n                \"<a class='active_link_doc document_link_form' level='document' id='document_\"+document_id+\"' target='_blank' href='\"+result.document.public_document_url+\"'>\"+result.document.name+\"</a></br>\"\n              );\n              $(\"#documents_<%= rf.getCid() %>\").val(final);\n              $(\"#documents_<%= rf.getCid() %>\").trigger(\"change\");\n            }\n          }\n        });\n      });\n    };\n\n    function getHierarchy(document_ids_hash) {\n      var that =  this,\n      source_url = '/companies?include_hierarchy=true&include_doc=true&'+\n                   'pagination=false';\n      $.ajax({\n        async: \"false\",\n        url: source_url,\n        type: \"GET\",\n        data: {},\n        dataType: \"json\",\n        success: function (result) {\n          if(result){\n            that.company_hierarchy = result;\n            that.gen_doc_hierarchy = generate_company_hierarchy_tree(\n              that.company_hierarchy, geo_doc_hierarchy);\n            that.hierarchy_selector_view =\n              new Formbuilder.options.HIERARCHYSELECTORVIEW({\n                el: $(\"#doc_hierarchy_tree_<%= rf.getCid() %>\"),\n                generated_hierarchy: that.gen_doc_hierarchy,\n                pre_selected_hierarchy: document_ids_hash,\n                hierarchy_mapping: geo_doc_hierarchy,\n                select_level:\"Document\"\n              });\n          }\n        }\n      });\n    };\n  });\n</script>",
    print: "<div id='document_list_<%= rf.getCid() %>'\n  class='document_url_list document_list_<%= rf.getCid() %>'>\n</div>\n<script>\n  $(function() {\n    var data = \"<%=rf.get(Formbuilder.options.mappings.HTML_DATA)%>\";\n    if($(\".document_list_<%= rf.getCid() %>\").length > 1){\n      $($(\".document_list_<%= rf.getCid() %>\")[1]).html(data);\n    }\n    $(\"#document_list_<%= rf.getCid() %>\").html(data);\n  });\n</script>",
    addButton: "<span class=\"symbol\"><span class=\"icon-list\"></span></span> Doc. Link",
    checkAttributeHasValue: function(cid, $el) {
      return (function(_this) {
        return function(incomplete) {
          var call_back;
          call_back = function(k, v) {
            if (v.href === "") {
              return incomplete = true;
            }
          };
          $el.find('a').each(call_back);
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
  Formbuilder.registerField('dropdown', {
    view: "<% if(Formbuilder.isAndroid()) { %>\n  <input id=\"<%= rf.getCid() %>\" dropdown=\"dropdown\" name=\"<%= rf.getCid() %>\" readonly=\"true\"></input>\n<% } else { %>\n<select id=\"dropdown\">\n  <% if (rf.get(Formbuilder.options.mappings.INCLUDE_BLANK)) { %>\n    <% var empty_opt_text = (rf.get(Formbuilder.options.mappings.EMPTY_OPTION_TEXT) || '') %>\n    <option value=''><%= empty_opt_text %></option>\n  <% } %>\n\n  <% var field_options = (rf.get(Formbuilder.options.mappings.OPTIONS) || []) %>\n  <% for ( var i = 0 ; i < field_options.length ; i++) { %>\n    <option <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'selected' %>>\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </option>\n  <% } %>\n</select>\n<% } %>",
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
    setup: function(field_view, model, edit_fs_model) {
      if (model.attributes.field_values) {
        if (Formbuilder.isAndroid()) {
          if (model.attributes.field_values["" + (model.getCid()) + "_1"] === '' && model.attributes.field_options.include_blank_option) {
            field_view.$el.find("input").val(model.attributes.field_options.empty_option_text);
            field_view.$el.find("input").data('id', '');
          } else {
            field_view.$el.find("input").val(model.attributes.field_values["" + (model.getCid()) + "_1"]);
            field_view.$el.find("input").data('id', model.attributes.field_values["" + (model.getCid()) + "_1"]);
          }
        } else {
          field_view.$el.find("select").val(model.attributes.field_values["" + (model.getCid()) + "_1"]);
        }
      } else if (model.attributes.field_options && Formbuilder.isAndroid()) {
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
        } else if (Formbuilder.isAndroid() && field_view.$el.find('input').val() !== "") {
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
    setup: function(field_view, model) {
      return (function(_this) {
        return function(model_cid, upload_url, $img) {
          if (model.get('field_values') && model.get('field_values')["" + model_cid + "_1"]) {
            upload_url = model.get('field_values')["" + model_cid + "_1"];
            $img.attr("upload_url", upload_url);
            $img.show();
          } else {
            $img.hide();
          }
          if (upload_url) {
            return makeRequest(upload_url, $img.attr("name"));
          }
        };
      })(this)(model.getCid(), '', field_view.$el.find('img'));
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('file', {
    view: "<span id='file_name_<%= rf.getCid() %>'></span>\n<a target=\"_blank\" class=\"active_link\"></a>\n<input\n  id='file_<%= rf.getCid() %>'\n  type='file'\n  class='icon-folder-open file_field'\n  cid=\"<%= rf.getCid() %>\"\n  accept=\"<%= rf.get(Formbuilder.options.mappings.ALLOWED_FILE_TYPES) %>\"\n  for-ios-file-size=\"<%= rf.get(Formbuilder.options.mappings.MAX) %>\"\n/>\n<div id=\"file_upload_link_<%= rf.getCid() %>\"></div>\n<script>\n  $(function() {\n    $(\"#file_<%= rf.getCid() %>\").filestyle({\n      input: false,\n      buttonText: \"<%= rf.get(Formbuilder.options.mappings.FILE_BUTTON_TEXT)%>\"\n    });\n\n    setTimeout(function(){\n      if ($('a[name=\"<%= rf.getCid() %>_1\"]').text() != \"\"){\n        $(\"#file_<%= rf.getCid() %>\").attr('required',false);\n        $(\"#file_name_<%= rf.getCid() %>\").text('');\n      }\n    },1000);\n\n    $('#file_<%= rf.getCid() %>').change(function(){\n      $('#file_name_<%= rf.getCid() %>').text(this.files[0].name);\n      var max_size = 1024*1024*'<%= rf.get(Formbuilder.options.mappings.MAX) || 10000%>'\n      if(this.files[0].size <= max_size){\n        return true;\n      }\n      else{\n        bri_alerts(\"Please select file size less that <%= rf.get(Formbuilder.options.mappings.MAX) %> MB\", 'error');\n        $(\"#file_<%= rf.getCid() %>\").filestyle(\"clear\");\n        $(\"#file_<%= rf.getCid() %>\").replaceWith($(\"#file_<%= rf.getCid() %>\").clone(true));\n        $('#file_name_<%= rf.getCid() %>').text('');\n      }\n    });\n  });\n</script>",
    edit: "\n<div class='fb-edit-section-header'>Options</div>\n\n<div class=\"span12\">\n  <span>Change Button Text:</span>\n  <input\n    type=\"text\"\n    class=\"span12\"\n    data-rv-input=\"model.<%= Formbuilder.options.mappings.FILE_BUTTON_TEXT %>\"\n  >\n  </input>\n</div>\n\n<div class=\"span12\">\n  <span>Allowed File Types:</span>\n  <textarea\n    class=\"span12\"\n    data-rv-input=\"model.<%= Formbuilder.options.mappings.ALLOWED_FILE_TYPES %>\"\n  >\n  </textarea>\n</div>\n\n<div class=\"span12\">\n  <span>Max File Size in MB:</span>\n  <input\n    class=\"span3\"\n    type=\"number\"\n    data-rv-input=\"model.<%= Formbuilder.options.mappings.MAX %>\"\n    style=\"width: 80px\"\n  />\n</div>",
    print: "<div id=\"file_upload_link_<%= rf.getCid() %>\"></div>",
    addButton: "<span class=\"symbol\"><span class=\"icon-cloud-upload\"></span></span> File",
    checkAttributeHasValue: function(cid, $el) {
      return (function(_this) {
        return function(incomplete) {
          var call_back;
          call_back = function(k, v) {
            if (v.href === "") {
              return incomplete = true;
            }
          };
          if ($el.find('.active_link_doc').length === 0) {
            return false;
          }
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
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('fullname', {
    perfix: ['Mr.', 'Mrs.', 'Miss.', 'Ms.', 'Mst.', 'Dr.'],
    view: "<div class='input-line'>\n  <span>\n    <select class='span12'>\n      <%for (i = 0; i < this.perfix.length; i++){%>\n        <option><%= this.perfix[i]%></option>\n      <%}%>\n    </select>\n    <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_PREFIX_TEXT) || 'Prefix' %></label>\n  </span>\n\n  <span>\n    <input id='first_name' type='text' pattern=\"[a-zA-Z]+\"/>\n    <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_FIRST_TEXT) || 'First' %></label>\n  </span>\n\n  <% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n    <span id='middle_name_span_<%= rf.getCid() %>'>\n      <input type='text' pattern=\"[a-zA-Z]+\"/>\n      <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_MIDDLE_TEXT) || 'Middle' %></label>\n    </span>\n  <% } %>\n\n  <span>\n    <input id='last_name' type='text' pattern=\"[a-zA-Z]+\"/>\n    <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_LAST_TEXT) || 'Last' %></label>\n  </span>\n\n  <% if (rf.get(Formbuilder.options.mappings.INCLUDE_SUFFIX)) { %>\n    <span>\n      <input id='suffix' type='text'/>\n      <label><%= rf.get(Formbuilder.options.mappings.FULLNAME_SUFFIX_TEXT) || 'Suffix' %></label>\n    </span>\n  <% } %>\n</div>",
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
      $el.find("#last_name").val("");
      return $el.find("#suffix").val("");
    },
    setValForPrint: function(field_view, model) {
      return (function(_this) {
        return function(fields, values, i) {
          var key, _results;
          _results = [];
          for (key in values) {
            _results.push($(fields[i++]).html(values[key]));
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
    print: "<div class=\"centered_td\">\n  <% if(rf.get('field_type') === 'gmap'){%>\n  <% var lat_long_arr = ['-25.363882','131.044922']%>\n  <% var mapAttr = rf.get('field_values');%>\n  <% if(mapAttr){%>\n    <% if(mapAttr[ rf.get('cid') +'_1']){ %>\n        <% var location = mapAttr[ rf.get('cid') +'_1']; %>\n        <% var lat_long_str = mapAttr[ rf.get('cid') +'_2']; %>\n        <% var lat_long_arr = (mapAttr[ rf.get('cid') +'_2']).split(','); %>\n        <% var lat = lat_long_arr[0]; %>\n        <% var long = lat_long_arr[1]; %>\n      <% } %>\n    <% } %>\n  <% } %>\n  <div class=\"lat_long_wrapper\">\n    <ul>\n      <li>\n        <label type=\"text\" id=\"print_lat_gmap\">Latitude : <%= (lat)? lat : '' %></label>\n      </li>\n      <li>\n        <label type=\"text\" id=\"print_long_gmap\" >Longitude : <%= (long)? long : '' %></label>\n      </li>\n      <li>\n        <%= (location)? location : '' %>\n      </li>\n    </ul>\n    <div id=\"map-canvas\">\n      <% if(lat_long_str){ %>\n      <img src=<%= \"http://maps.googleapis.com/maps/api/staticmap?center=\"+lat_long_str+\"&zoom=13&size=400x400&sensor=false&markers=color:red|\"+lat_long_str %> />\n      <% } %>\n    </div>\n  </div>\n</div>",
    addButton: "<span class=\"symbol\"><span class=\"icon-map-marker\"></span></span> Geo-Location",
    addRequiredConditions: function() {
      return $('<div class="modal fade" id="gmapModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <div class="geo-location-panel top-panel1"> <table> <tr><td> <input id="gmap_latlng" class="geo-location-panel1" type="textbox"/> <input type="button" value="Lat,Long" onclick="codeLatLngPopulateAddress()"/> </td></tr><tr><td> <input id="gmap_address" class="geo-location-panel1" type="textbox"/> <input type="button" value="Location" onclick="codeAddress()"/> </td></tr> </table> </div> <div class="modal-body"> <div id="map-canvas"/> </div> <div class="modal-footer"> <button type="button" class="btn btn-default btn-success" id="gmap_ok" data-dismiss="modal">Ok</button> </div> </div> </div> </div>').appendTo('body');
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
    setup: function(field_view, model) {
      return (function(_this) {
        return function($input) {
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
        };
      })(this)(field_view.$el.find($("[name = " + model.getCid() + "_2]")));
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
    edit: "<div class='fb-edit-section-header'>Upload File</div>\n<input id='<%= rf.getCid() %>' type='file' accept=\"image/jpeg, image/png\"/>\n<input\n  class='hide'\n  id='text_<%= rf.getCid() %>'\n  data-rv-value='model.<%= Formbuilder.options.mappings.IMAGE_DATA %>'\n/>\n<%= Formbuilder.templates['edit/image_options']() %>\n<script>\n  $(function() {\n    function readURL(input) {\n      if (input.files && input.files[0]) {\n        var reader = new FileReader();\n\n        reader.onloadend = function (e) {\n          $('#text_<%= rf.getCid() %>').val(e.target.result);\n          $('#text_<%= rf.getCid() %>').trigger(\"change\");\n        }\n        reader.readAsDataURL(input.files[0]);\n      }\n    }\n\n    $('#<%= rf.getCid() %>').change(function(){\n        if(this.files[0].size <= 204800){\n          readURL(this);\n        }\n        else{\n          alert(\"Please select file size less that 200 KB\")\n        }\n    });\n  });\n</script>",
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
        return el.val(model.get('field_values')["" + (model.getCid()) + "_1"]);
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
        el.text(model.get(Formbuilder.options.mappings.DEFAULT_VALUE));
      }
      el.focus((function(_this) {
        return function(event) {
          if (Formbuilder.isAndroid()) {
            el.css('width', '100%');
            return $('#grid_div').animate({
              scrollTop: el.offset().top + $('#grid_div').scrollTop() - 20
            }, 1000);
          }
        };
      })(this));
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
            $input.text(model.get(Formbuilder.options.mappings.DEFAULT_VALUE));
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
          valid = (function(required_attr, textarea_char_cnt) {
            if (!required_attr) {
              return true;
            }
            textarea_char_cnt = $el.find('textarea').val().length;
            if (model.get(Formbuilder.options.mappings.MINLENGTH)) {
              return textarea_char_cnt >= parseInt(model.get(Formbuilder.options.mappings.MINLENGTH));
            } else {
              return true;
            }
          })(model.get('required'), 0);
          return valid;
        };
      })(this)(false);
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('phone_number', {
    view: "<input id='<%= rf.getCid() %>phone' type='tel'/>",
    edit: "<%= Formbuilder.templates['edit/country_code']({rf:rf}) %>\n    <script>\n      $(function() {\n        $('#<%= rf.getCid() %>_country_code').intlTelInput({\n            autoHideDialCode: false,\n            preferredCountries: [\"au\", \"gb\", \"us\"]\n        });\n        $(\"#<%= rf.getCid() %>_country_code\").val();\n      });\n    </script>\n    <%= Formbuilder.templates['edit/area_code']() %>\n<%= Formbuilder.templates['edit/mask_value']() %>",
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
            return field_view.$el.find('input').val(model.get('field_values')["" + (model.getCid()) + "_1"]);
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
    print: "<div>\n <% var all_attr =  rf.get('field_values') %>\n <% var cid =  rf.get('cid') %>\n <% if(all_attr){ %>\n <label class='above-line'>$</label>\n <label><%= (all_attr[cid + '_1'] && all_attr[cid + '_1'] || '') %></label>\n <label class='above-line'>.</label>\n <label><%= (all_attr[cid + '_2'] && all_attr[cid + '_2'] || '') %></label>\n <% } %>\n</div>",
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
      return $el.find("[name = " + model.getCid() + "_1]").val("");
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
    print: "<div>\n <% var all_attr =  rf.get('field_values') %>\n <% var cid =  rf.get('cid') %>\n <% if(all_attr){ %>\n    <% for(var k in all_attr){ %>\n      <% if(all_attr[k]){ %>\n        <label>\n          <% if(k == '__other__') { %>\n            <%= all_attr[cid + '_1'] %>\n          <% } else { %>\n            <%=  k %>\n          <% } %>\n        </label>\n    <% break;} %>\n    <% } %>\n <% } %>\n</div>",
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
      var elem, _i, _len, _ref, _results;
      _ref = $el.find('input:checked');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        _results.push(elem.checked = false);
      }
      return _results;
    },
    evalCondition: function(clicked_element, cid, condition, set_value) {
      return (function(_this) {
        return function(elem_val, check_result) {
          elem_val = clicked_element.find("[value = '" + set_value + "']").is(':checked');
          check_result = condition(elem_val, true);
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
    edit: "<div class='fb-edit-section-header'>Next button</div>\n<input type=\"text\" pattern=\"[a-zA-Z0-9_\\s]+\" data-rv-input=\n  \"model.<%= Formbuilder.options.mappings.NEXT_BUTTON_TEXT %>\"\n  value='Next'/>\n\n<div class='fb-edit-section-header'>Back button</div>\n<input type=\"text\" pattern=\"[a-zA-Z0-9_\\s]+\" data-rv-input=\n  \"model.<%= Formbuilder.options.mappings.PREV_BUTTON_TEXT %>\"\n  value='Back'/>\n\n  <%= Formbuilder.templates['edit/back_visiblity']() %>\n",
    print: "<div class=\"section_break_div\">\n  <hr>\n</div>",
    addButton: "<span class='symbol'><span class='icon-minus'></span></span> Section Break",
    checkAttributeHasValue: function(cid, $el) {
      return true;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('take_pic_video_audio', {
    view: "<div class='input-line'>\n  <% if (rf.get(Formbuilder.options.mappings.INCLUDE_PHOTO)) { %>\n    <button type='button' class='file_field btn_capture_icon image btn_icon_photo' cid=\"<%= rf.getCid() %>\" id=\"btn_image_<%= rf.getCid() %>\"></button>\n  <% } %>\n\n  <% if (rf.get(Formbuilder.options.mappings.INCLUDE_VIDEO)) { %>\n    <button type='button' class='file_field btn_capture_icon video btn_icon_video' cid=\"<%= rf.getCid() %>\" id=\"btn_video_<%= rf.getCid() %>\"></button>\n  <% } %>\n\n  <% if (rf.get(Formbuilder.options.mappings.INCLUDE_AUDIO)) { %>\n    <button type='button' class='file_field btn_capture_icon audio btn_icon_audio' cid=\"<%= rf.getCid() %>\" id=\"btn_audio_<%= rf.getCid() %>\"></button>\n  <% } %>\n\n  <a\n    type='take_pic_video_audio'\n    target=\"_blank\" capture='capture' class=\"capture active_link\"\n    id=\"record_link_<%= rf.getCid() %>\" href=\"\"\n    style=\"margin-bottom:12px;\"\n  ></a>\n  <div id=\"capture_link_<%= rf.getCid() %>\"></div>\n</div>\n<div id=\"open_model_<%= rf.getCid() %>\"\n  class=\"modal hide fade modal_style\" tabindex=\"-1\"\n  role=\"dialog\" aria-labelledby=\"ModalLabel\" aria-hidden=\"true\">\n  <div class=\"modal-header\">\n    <button type=\"button\" class=\"close\" data-dismiss=\"modal\"\n      aria-hidden=\"true\">&times;</button>\n    <h3>Picture</h3>\n  </div>\n  <div class=\"modal-body\" id=\"modal_body_<%= rf.getCid() %>\">\n    <video id=\"video_<%= rf.getCid() %>\" autoplay></video>\n    <canvas id=\"canvas_<%= rf.getCid() %>\" style=\"display:none;\"></canvas>\n  </div>\n  <div class=\"modal-footer\">\n    <button id=\"take_picture_<%= rf.getCid() %>\" class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">\n      Take Picture\n    </button>\n    <button class=\"btn btn-default btn-success\" data-dismiss=\"modal\" aria-hidden=\"true\">\n      Ok\n    </button>\n  </div>\n</div>\n\n<textarea\n id='snapshot_<%= rf.getCid() %>'\n data-rv-value='model.<%= Formbuilder.options.mappings.HTML_DATA %>'\n style=\"display:none;\"\n>\n</textarea>\n\n<script>\n\n  $('#snapshot_<%= rf.getCid() %>').attr(\"required\", false);\n  $('#canvas_<%= rf.getCid() %>').attr(\"required\", false);\n\n  $(\"#btn_image_<%= rf.getCid() %>\").click( function() {\n    $(\"#open_model_<%= rf.getCid() %>\").modal('show');\n    $(\"#open_model_<%= rf.getCid() %>\").on('shown', function() {\n      startCamera();\n    });\n    $(\"#open_model_<%= rf.getCid() %>\").on('hidden', function() {\n      localMediaStream.stop();\n      localMediaStream = null;\n      $(\"#snapshot_<%= rf.getCid() %>\").text(\n        $('#record_link_<%= rf.getCid() %>').attr('href')\n      );\n      $(\"#snapshot_<%= rf.getCid() %>\").trigger(\"change\");\n      $(this).unbind('shown');\n      $(this).unbind('hidden');\n    });\n  });\n  var video = document.querySelector(\"#video_<%= rf.getCid() %>\"),\n      take_picture = document.querySelector(\"#take_picture_<%= rf.getCid() %>\")\n      canvas = document.querySelector(\"#canvas_<%= rf.getCid() %>\"),\n      ctx = canvas.getContext('2d'), localMediaStream = null;\n  navigator.getUserMedia = navigator.getUserMedia ||\n    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;\n\n  function snapshot() {\n    if (localMediaStream) {\n      ctx.drawImage(video, 0, 0);\n      // \"image/webp\" works in Chrome.\n      // Other browsers will fall back to image/png.\n      document.querySelector('#record_link_<%= rf.getCid() %>').href = canvas.toDataURL('image/webp');\n      $('#record_link_<%= rf.getCid() %>').text('View File');\n    }\n  }\n  function sizeCanvas() {\n    // video.onloadedmetadata not firing in Chrome so we have to hack.\n    // See crbug.com/110938.\n    setTimeout(function() {\n      canvas.width = 640;\n      canvas.height = 420;\n    }, 100);\n  }\n  function startCamera(){\n    navigator.getUserMedia(\n      {video: true},\n      function(stream){\n        video.src = window.URL.createObjectURL(stream);\n        localMediaStream = stream;\n        sizeCanvas();\n      },\n      function errorCallback(error){\n        console.log(\"navigator.getUserMedia error: \", error);\n      }\n    );\n  }\n\n  take_picture.addEventListener('click', snapshot, false);\n</script>",
    edit: "<%= Formbuilder.templates['edit/capture']({ rf:rf }) %>",
    print: "<div id=\"capture_link_<%= rf.getCid() %>\"></div>",
    addButton: "<span class=\"symbol\"><span class=\"icon-camera\"></span></span> Capture",
    clearFields: function($el, model) {
      return $el.find(".capture").text("");
    },
    add_remove_require: function(cid, required) {
      return $("." + cid).find("[name = " + cid + "_1]").attr("required", required);
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
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
((__t = ( Formbuilder.templates['edit/base_header']() )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.templates['edit/common']() )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf: rf, opts:opts}) )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.templates['edit/conditions']({ rf:rf, opts:opts }))) == null ? '' : __t) +
'\n';

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
 if(rf.get('field_type') == 'heading' || rf.get('field_type') == 'free_text_html') { ;
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
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Options</div>\n\n<label>\n  <input id=\'include_middle_name_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\' type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_PHOTO )) == null ? '' : __t) +
'\' />\n  Include "Photo"\n</label>\n\n<label>\n  <input id=\'include_middle_name_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\' type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_VIDEO )) == null ? '' : __t) +
'\' />\n  Include "Video"\n</label>\n\n<label>\n  <input id=\'include_middle_name_' +
((__t = ( rf.getCid() )) == null ? '' : __t) +
'\' type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_AUDIO )) == null ? '' : __t) +
'\' />\n  Include "Audio"\n</label>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/checkboxes"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<label>\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.REQUIRED )) == null ? '' : __t) +
'\' />\n  Required\n</label>\n<label>\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.ADMIN_ONLY )) == null ? '' : __t) +
'\' />\n  Admin only access\n</label>';

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
 opts.parentView.collection.sort();;
__p += '\n          ';
 for( var i=0 ; i < opts.parentView.collection.length ; i++){;
__p += '\n            ';
 if(opts.parentView.collection.toJSON()[i].cid == rf.getCid()){ ;
__p += '\n              ';
 break ;
__p += '\n            ';
 } ;
__p += '\n            <option value="' +
((__t = ( opts.parentView.collection.toJSON()[i].cid )) == null ? '' : __t) +
'">' +
((__t = ( opts.parentView.collection.toJSON()[i].label )) == null ? '' : __t) +
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