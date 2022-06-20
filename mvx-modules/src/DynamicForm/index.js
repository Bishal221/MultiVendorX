import React from "react";
import Select from 'react-select';
import axios from 'axios';

import GoogleMapReact from 'google-map-react';
import styled from 'styled-components';
import AutoComplete from './autocomplete';
const Wrapper = styled.main`
  width: 100%;
  height: 100%;
`;
const AnyReactComponent = ({ text }) => <img src={text} width="38" height="50"/>;
export default class DynamicForm extends React.Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      from_loading: false,
      statedrop: [],
      errordisplay: '',


      mapApiLoaded: false,
      mapInstance: null,
      mapApi: null,
      geoCoder: null,
      places: [],
      zoom: 12,
      address: '',
      draggable: true,
      lat: null,
      lng: null,
      center: {
        lat: 22.5726,
        lng: 88.3639
      },
    };

    this.runUploader = this.runUploader.bind(this);
    this.handlenestedAddClick = this.handlenestedAddClick.bind(this);
    this.handlenestedchildAddClick = this.handlenestedchildAddClick.bind(this);
    this.removenestedchildOption = this.removenestedchildOption.bind(this);
    this.removenestedField = this.removenestedField.bind(this);
    this.onnestedChange = this.onnestedChange.bind(this);
    this.onSelectDeselectChange = this.onSelectDeselectChange.bind(this);
    this.onMultiChange = this.onMultiChange.bind(this);
    this.handle_Vendor_active_suspend = this.handle_Vendor_active_suspend.bind(this);
  }

  handle_Vendor_active_suspend(e, api, status, vendor_id) {
    axios({
      method: 'post',
      url: `${appLocalizer.apiUrl}/mvx_module/v1/active_suspend_vendor`,
      data: {
        status: status,
        vendor_id: vendor_id
      }
    })
      .then((res) => {
        location.reload();
      });
  }

  onSelectDeselectChange(e, m) {

    if (this.state[m.key].length > 0) {
      this.setState({
        [m.key]: []
      });
    } else {
      var complete_option_value = [];
      m.options.map((o, index) => {
        complete_option_value[index] = o.value;
      })

      this.setState({
        [m.key]: complete_option_value
      });
    }

    if (this.props.submitbutton && this.props.submitbutton == 'false') {
      setTimeout(() => {
        this.onSubmit('');
      }, 10)
    }
  }

  onnestedChange(e, target, index, filedsdetails, nestedchild, childindex, selectarray, m) {
    let itemsnested = m['database_value'];
    var country_list_array = new Array();
    if (nestedchild == 'childnested') {
      if (filedsdetails.type == 'checkbox') {
        itemsnested[index].nested_datas[childindex][filedsdetails.key] = e.target.checked;
      } else if (filedsdetails.type == 'select') {
        itemsnested[index].nested_datas[childindex][filedsdetails.key] = selectarray[e.index];
      } else if (filedsdetails.type == 'state') {
        itemsnested[index].nested_datas[childindex][filedsdetails.key] = selectarray[e.index];
      } else {
        itemsnested[index].nested_datas[childindex][filedsdetails.key] = e.target.value;
      }
    } else {
      if (filedsdetails.type == 'checkbox') {
        itemsnested[index][filedsdetails.key] = e.target.checked;
      } else if (filedsdetails.type == 'select') {
        itemsnested[index][filedsdetails.key] = selectarray[e.index];
      } else if (filedsdetails.type == 'select2nd') {
        itemsnested[index][filedsdetails.key] = selectarray[e.index];
      } else if (filedsdetails.type == 'country') {
        itemsnested[index][filedsdetails.key] = selectarray[e.index];
        var statefromcountrycode = JSON.parse(appLocalizer.countries.replace(/&quot;/g, '"'))[e.value];

        for (const keysssssss in statefromcountrycode) {
          country_list_array.push({ label: keysssssss, value: statefromcountrycode[keysssssss] });
        }
        m['child_options'][0]['options'] = country_list_array;

      } else {
        itemsnested[index][filedsdetails.key] = e.target.value;
      }
    }
    if (this.props.submitbutton && this.props.submitbutton == 'false') {
      setTimeout(() => {
        this.onSubmit('');
      }, 10)
    }
    this.setState(
      {
        [target]: itemsnested
      },
      () => { }
    );
  }

  onMultiChange(e, o, m, target, indexp) {
    var new_arraydata = this.state[target] ? this.state[target] : [];
    m.options.map((om, index) => {
      new_arraydata[index] = { key: om.key, value: o.key == om.key ? e.target.value : (this.state[target][index] && this.state[target][index]['value'] ? this.state[target][index]['value'] : '') }; //o.key == om.key ? e.target.value : ( this.state[target][indexp] ? this.state[target][indexp] : '');
    })

    this.setState({
      [target]: new_arraydata
    });

    if (this.props.submitbutton && this.props.submitbutton == 'false') {
      setTimeout(() => {
        this.onSubmit('');
      }, 10)
    }
  }

  removenestedchildOption(e, indexparent, index, m) {
    let itemsnested = m['database_value'];
    itemsnested[indexparent].nested_datas.splice(index, 1);
    this.state[m.key] = itemsnested;
    if (this.props.submitbutton && this.props.submitbutton == 'false') {
      setTimeout(() => {
        this.onSubmit('');
      }, 10)
    }
  }

  handlenestedchildAddClick(e, m, indexop) {
    var child_nested_array = {};
    if (m['type'] == 'nested') {
      m['child_options'].map((keyn, indexn) => {
        if (keyn['type'] == 'checkbox') {
          child_nested_array[keyn['key']] = false;
        } else {
          child_nested_array[keyn['key']] = '';
        }
      });
    }

    var count = m['database_value'][indexop].nested_datas.length + 1;
    m['database_value'][indexop].nested_datas.push(child_nested_array);

    this.setState({
      [m['database_value']]: m['database_value']
    });

    if (this.props.submitbutton && this.props.submitbutton == 'false') {
      setTimeout(() => {
        this.onSubmit('');
      }, 10)
    }
  }

  removenestedField(e, index, m) {
    let itemsnested = m['database_value'];
    itemsnested.splice(index, 1);
    this.state[m.key] = itemsnested;
    if (this.props.submitbutton && this.props.submitbutton == 'false') {
      setTimeout(() => {
        this.onSubmit('');
      }, 10)
    }
  }

  handlenestedAddClick(event, m) {
    //parent_options
    var parent_nested_array = {};
    var child_nested_array = new Array({});
    if (m['type'] == 'nested') {
      m['parent_options'].map((keyn, indexn) => {
        if (keyn['type'] == 'checkbox') {
          parent_nested_array[keyn['key']] = false;
        } else {
          parent_nested_array[keyn['key']] = '';
        }
        parent_nested_array['nested_datas'] = child_nested_array;
      });
    }
    m['database_value'].push(parent_nested_array);
    this.setState({
      [m['database_value']]: m['database_value']
    });
    if (this.props.submitbutton && this.props.submitbutton == 'false') {
      setTimeout(() => {
        this.onSubmit('');
      }, 10)
    }
  }

  runUploader(event, target, index) {
    let frame = '';
    var attachment = '';
    frame = frame + target;
    // Create a new media frame
    frame = wp.media({
      title: 'Select or Upload Media Of Your Chosen Persuasion',
      button: {
        text: 'Use this media',
      },
      multiple: false, // Set to true to allow multiple files to be selected
    })
    var self = this; // copy the reference
    frame.on('select', function () {
      // Get media attachment details from the frame state
      attachment = frame.state().get('selection').first().toJSON();
      self.setState({
        [target]: attachment.url
      });

      if (self.props.submitbutton && self.props.submitbutton == 'false') {
        setTimeout(() => {
          self.onSubmit('');
        }, 10)
      }
    });
    // Finally, open the modal on click
    frame.open()
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let derivedState = {};
    if (
      nextProps.defaultValues &&
      nextProps.defaultValues.id !== prevState.id
    ) {
      return {
        ...nextProps.defaultValues
      };
    }
    return null;
  }

  onSubmit = e => {
    // block to refresh pages
    let prop_submitbutton = this.props.submitbutton && this.props.submitbutton == 'false' ? '' : 'true';
    if (prop_submitbutton) {
      e.preventDefault();
    }

    this.setState({ from_loading: true });
    axios({
      method: this.props.method,
      url: appLocalizer.apiUrl + '/' + this.props.url,
      data: {
        model: this.state,
        modulename: this.props.modulename,
        vendor_id: this.props.vendor_id ? this.props.vendor_id : '',
        announcement_id: this.props.announcement_id ? this.props.announcement_id : '',
        knowladgebase_id: this.props.knowladgebase_id ? this.props.knowladgebase_id : ''
      }
    })
      .then((res) => {
        this.setState({ from_loading: false, errordisplay: res.data.error });
        setTimeout(() => {
          this.setState({ errordisplay: '' });
        }, 2000)
        if (res.data.redirect_link) {
          window.location.href = res.data.redirect_link;
        }
      });
  };

  componentDidMount() {
    this.props.model.map(m => {
      this.setState({
        [m['key']]: m['database_value']
      });
    });
  }

  onChange = (e, key, type = "single", from_type = '', array_values = []) => {
    if (type === "single") {
      if (from_type === "select") {
        this.setState(
          {
            [key]: array_values[e.index]
          },
          () => { }
        );
      } else if (from_type && from_type === "country" || from_type === "state") {
        this.setState(
          {
            [key]: array_values[e.index]
          },
          () => { }
        );
        var country_list_array = [];
        var statefromcountrycode = JSON.parse(appLocalizer.countries.replace(/&quot;/g, '"'))[e.value];
        for (const key_country in statefromcountrycode) {
          country_list_array.push({ label: key_country, value: statefromcountrycode[key_country] });
        }
        this.setState(
          {
            statedrop: country_list_array
          }
        );
      } else if (from_type === "multi-select") {
        this.setState(
          {
            [key]: e
          },
          () => { }
        );
      } else {
        this.setState(
          {
            [key]: e.target.value
          },
          () => { }
        );
      }
    } else {
      // Array of values (e.g. checkbox): TODO: Optimization needed.
      let found = this.state[key]
        ? this.state[key].find(d => d === e.target.value)
        : false;

      if (found) {
        let data = this.state[key].filter(d => {
          return d !== found;
        });
        this.setState({
          [key]: data
        });
      } else {
        let others = this.state[key] ? [...this.state[key]] : [];
        this.setState({
          [key]: [e.target.value, ...others]
        });
      }
    }
    if (this.props.submitbutton && this.props.submitbutton == 'false') {
      setTimeout(() => {
        this.onSubmit('');
      }, 10)
    }
  };

  renderForm = () => {
    let model = this.props.model;
    let defaultValues = this.props.defaultValues;
    let formUI = model.map((m, index) => {
      let key = m.key;
      let type = m.type || "text";
      let props = m.props || {};
      let name = m.name;
      let value = m.value;
      let placeholder = m.placeholder;
      let limit = m.limit;
      let selected = m.selected;
      let input = '';

      let target = key;
      value = this.state[target] || "";

      if (m.restricted_page && m.restricted_page == this.props.location) {
        return false;
      }

      // If no array key found
      if (!m.key) { return false; }
      //console.log(this.state['chat_provider']);

      // for select selection
      if (m.depend && this.state[m.depend] && this.state[m.depend].value && this.state[m.depend].value != m.dependvalue) {
        return false;
      }

      // for radio button selection
      if (m.depend && this.state[m.depend] && !this.state[m.depend].value && this.state[m.depend] != m.dependvalue) {
        return false;
      }

      // for checkbox selection
      if (m.depend_checkbox && this.state[m.depend_checkbox] && this.state[m.depend_checkbox].length == 0) {
        return false;
      }

      // for checkbox selection
      if (m.not_depend_checkbox && this.state[m.not_depend_checkbox] && this.state[m.not_depend_checkbox].length > 0) {
        return false;
      }

      if (m.depend && !this.state[m.depend]) { return false; }

      if (type == "text" || "url" || "password" || "email" || "number") {
        input = (
          <div className="mvx-settings-basic-input-class">
            <input
              {...props}
              className="mvx-setting-form-input"
              type={type}
              key={key}
              id={m.id}
              placeholder={placeholder}
              name={name}
              value={value}
              onChange={e => {
                this.onChange(e, target);
              }}
            />
            {m.desc ? <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: m.desc }}></p> : ''}
          </div>
        );
      }

      if (type == "color") {
        input = (
          <div className="mvx-settings-color-picker-parent-class">
            <label for="favcolor">{appLocalizer.global_string.favorite_color}:</label>
            <input
              {...props}
              className="mvx-setting-color-picker"
              type={type}
              key={key}
              id={m.id}
              name={name}
              value={value}
              onChange={e => {
                this.onChange(e, target);
              }}
            />
            {m.desc ? <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: m.desc }}></p> : ''}
          </div>
        );
      }

      if (type == "map") {
        input = (
          <div className="mvx-settings-basic-input-class">
            <input type="text" id="searchStoreAddress" className="regular-text" placeholder="Enter store location" />
            <div id="store-maps" className="store-maps" className="mvx-gmap" style={{ width: '100%', height: '300px' }}></div>
            {m.desc ? <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: m.desc }}></p> : ''}
          </div>
        );
      }

      if (type == "button") {
        input = (
          <div className="mvx-form-button-group">
            <label className="mvx-settings-form-label"></label>
            <div className="mvx-settings-input-content">
              <div className="mvx-settings-basic-input-class">
                <input className="btn default-btn" type="button" value={m.vendor_status_label} onClick={(e) => this.handle_Vendor_active_suspend(e, m.api_link, m.vendor_status, m.vendor_id)} />
                {m.desc ? <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: m.desc }}></p> : ''}
              </div>
            </div>
          </div>
        );
      }

      if (type == "multi_number") {
        input = (
          <div className="mvx-settings-basic-input-class">
            <div className="mvx-settings-basic-child-wrap">
              {
                m.options.map((o, index) => {
                  return (
                    <div className="mvx-settings-basic-input-child-class">
                      <React.Fragment key={"cfr" + o.key}>
                        <div className="mvx-setting-form-input">
                          <div className="mvx-setting-form-input-label">{o.label}</div>
                          <input
                            {...props}
                            className={m.class}
                            type={o.type}
                            id={`mvx-setting-integer-input-${o.key}`}
                            key={o.key}
                            name={o.name}
                            value={value[index] && value[index]['key'] == o.key ? value[index]['value'] : ''}
                            onChange={e => {
                              this.onMultiChange(e, o, m, target, index);
                            }}
                          />
                        </div>
                      </React.Fragment>
                    </div>
                  );
                })
              }
            </div>
            {m.desc ? <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: m.desc }}></p> : ''}
          </div>
        )
      }

      if (type == "label") {
        input = (
          <div className="mvx-form-group-only-label">
            <label dangerouslySetInnerHTML={{ __html: m.valuename }}></label>
            <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: m.desc }}></p>
          </div>
        );
      }

      if (type == "section") {
        input = (
          <div className="mvx-setting-section-divider">&nbsp;</div>
        );
      }

      if (type == "blocktext") {
        input = (
          <div className="mvx-blocktext-class">
            {m.blocktext ? <p className="mvx-settings-metabox-description-code" dangerouslySetInnerHTML={{ __html: m.blocktext }}></p> : ''}
          </div>
        );
      }

      if (type == "table") {
        var inputlabels = m.label_options.map(ol => {
          return (
            <th className="mvx-settings-th-wrap">{ol}</th>
          );
        });

        input = m.options.map(o => {
          return (
            <tr className="mvx-settings-tr-wrap">
              <td className="mvx-settings-td-wrap"><p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: o.variable }}></p></td>
              <td className="mvx-settings-td-wrap">{o.description}</td>
            </tr>

          );
        });
        input = <div className="mvx-settings-mvx-form-table">
          <table className="mvx-settings-table-wrap">
            <tr className="mvx-settings-tr-wrap">
              {inputlabels}
            </tr>
            {input}
          </table>
        </div>;
      }

      if (type == "normalfile") {
        input = (
          <input
            {...props}
            className="mvx-setting-form-input"
            type="file"
            key={key}
            name={name}
            value={value}
            onChange={e => {
              this.onChange(e, target);
            }}
          />
        );
      }

      if (type == "recaptcha") {
        var recaptcha_type = m.recaptchatype;
        var sitekey = m.sitekey;
        var secretkey = m.secretkey;
        var script_url = (recaptcha_type == 'v3') ? 'https://www.google.com/recaptcha/api.js?render=' + sitekey : 'https://www.google.com/recaptcha/api.js';

        if (recaptcha_type == 'v3') {
          grecaptcha.ready(function () {
            grecaptcha.execute(sitekey, { action: 'mvx_vendor_registration' }).then(function (token) {
              var recaptchaResponse = document.getElementById('recaptchav3Response');
              recaptchaResponse.value = token;
            });
          });
        }

        input = (
          <div className="mvx-regi-form-row">
            {m.script}
            <input type="hidden" name={`${m.key}-value`} value="Verified" />
            <input type="hidden" name={`${m.key}-label`} value={m.label} />
            <input type="hidden" name={`${m.key}-type`} value="recaptcha" />

            {recaptcha_type == 'v3' ?
              <div>
                <input type="hidden" name="recaptchav3Response" id="recaptchav3Response" />
                <input type="hidden" name="recaptchav3_sitekey" value={sitekey} />
                <input type="hidden" name="recaptchav3_secretkey" value={secretkey} />
              </div>
              : ''}
            <input type="hidden" name="g-recaptchatype" value={recaptcha_type} />
          </div>
        );
      }

      if (type == "radio") {
        input = m.options.map(o => {
          let checked = o.value == value;
          return (
            <React.Fragment key={"fr" + o.key}>
              <input
                {...props}
                className="mvx-setting-form-input"
                type={type}
                key={o.key}
                name={o.name}
                checked={checked}
                value={o.value}
                onChange={e => {
                  this.onChange(e, o.name);
                }}
              />
              <label key={"ll" + o.key}>{o.label}</label>
            </React.Fragment>
          );
        });
        input = <div className="mvx-settings-mvx-form-group-radio">
          {input}
          {m.desc ? <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: m.desc }}></p> : ''}
        </div>;
      }

      if (type == "toggle_rectangle") {
        input = m.options.map(o => {
          let checked = o.value == value;
          return (
            <React.Fragment key={"fr" + o.key}>
              <li>
                <input
                  {...props}
                  className="mvx-setting-form-input"
                  id={`mvx-toggle-rectangle-${o.key}`}
                  type="radio"
                  key={o.key}
                  name={o.name}
                  checked={checked}
                  value={o.value}
                  onChange={e => {
                    this.onChange(e, o.name);
                  }}
                />
                <label for={`mvx-toggle-rectangle-${o.key}`} key={"ll" + o.key}>{o.label}</label>
              </li>
            </React.Fragment>
          );
        });
        input = <div className="mvx-settings-mvx-form-group-radio">
          <div className="mvx-toggle-rectangle-merge">
            <ul>
              {input}
            </ul>
          </div>
          {m.desc ? <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: m.desc }}></p> : ''}
        </div>;
      }

      if (type == "radio_select") {
        input = m.options.map(o => {
          let checked = o.value == value;
          return (
            <React.Fragment key={"fr" + o.key}>
              <div className={`mvx-radioselect-class ${checked ? 'radio-select-active' : ''}`}>
                <input
                  {...props}
                  className="mvx-setting-form-input"
                  type="radio"
                  id={`mvx-radio-select-under-${o.key}`}
                  key={o.key}
                  name={o.name}
                  checked={checked}
                  value={o.value}
                  onChange={e => {
                    this.onChange(e, o.name);
                  }}
                />
                <label className="mvx-radio-select-under-label-class" for={`mvx-radio-select-under-${o.key}`}>{o.label}<img src={o.color} alt={o.label} className="mvx-section-img-fluid" /><div className="mvx-radioselect-overlay-text">Select your Store</div></label>
              </div>
            </React.Fragment>
          );
        });
        input = <div className="mvx-form-group-radio-select">
          {input}
          {m.desc ? <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: m.desc }}></p> : ''}
        </div>;
      }

      if (type == "radio_color") {
        input = m.options.map(o => {
          let checked = o.value == value;
          return (
            <React.Fragment key={"fr" + o.key}>
              <div className={`mvx-settings-radio-color ${checked ? 'radio-color-active' : ''}`}>
                <div className="mvx-merge-radio-color-input-label">
                  <input
                    {...props}
                    className="mvx-setting-form-input"
                    type="radio"
                    key={o.key}
                    name={o.name}
                    checked={checked}
                    value={o.value}
                    id={`mvx-radio-color-under-${o.key}`}
                    onChange={e => {
                      this.onChange(e, o.name);
                    }}
                  />
                  <label key={"ll" + o.key} for={`mvx-radio-color-under-${o.key}`}>{o.label}
                    <p className="color-palette">
                      {
                        o.color.map((color1, indexc) => (
                          <div style={{ backgroundColor: color1 }}>&nbsp;</div>
                      ))}
                    </p>
                  </label>
                </div>
              </div>
            </React.Fragment>
          );
        });
        input = <div className="mvx-form-group-radio-color">
          {input}
          {m.desc ? <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: m.desc }}></p> : ''}
        </div>;
      }

      if (type == "select") {
        let options_data = [];
        let defaultselect = [];
        input = m.options.map((o, index) => {
          if (o.selected) {
            defaultselect[index] = { value: o.value, label: o.label, index: index };
          }
          options_data[index] = { value: o.value, label: o.label, index: index };
        });
        input = (
          <div className="mvx-form-select-field-wrapper">
            <Select className={key}
              value={value ? value : ''}
              options={options_data}
              onChange={e => {
                this.onChange(e, m.key, 'single', type, options_data);
              }}
            >
            </Select>
            {m.desc ? <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: m.desc }}></p> : ''}
          </div>
        );
      }

      if (type == "multi-select") {
        let multiarray = [];
        input = m.options.map((o, index) => {
          multiarray[index] = { value: o.value, label: o.label, index: index };
        });
        input = (
          <div className="mvx-settings-from-multi-select">
            <Select className={key}
              value={value}
              isMulti
              options={multiarray}
              onChange={e => {
                this.onChange(e, m.key, 'single', type, multiarray);
              }}
            >
            </Select>
            {m.desc ? <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: m.desc }}></p> : ''}
          </div>
        );
      }

      if (type == "textarea") {
        input = (
          <div className="mvx-setting-from-textarea">
            <textarea
              {...props}
              className={m.class ? m.class : 'mvx-form-input'}
              key={key}
              maxlength={limit}
              placeholder={placeholder}
              name={name}
              value={value}
              rows="4"
              cols="50"
              onChange={e => {
                this.onChange(e, target);
              }}
            />
            {m.desc ? <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: m.desc }}></p> : ''}
          </div>
        );
      }

      if (type == "separator") {
        input = (
          <div class="mvx_regi_form_box">
            <div class="clearboth"></div>
            <h3 class="reg_header2"></h3>
          </div>
        );
      }

      if (type == "file") {
        input = (
          <div className="mvx-setting-file-uploader-class">
            <input
              {...props}
              className={`${key} mvx-form-input`}
              type="hidden"
              key={key}
              name={name}
              value={value}
              onChange={e => {
                this.onChange(e, target);
              }}
            />
            <img src={value ? value : appLocalizer.default_logo} width={m.width} height={m.height} />
            <button {...props} className="mvx-upload-button-class" type='button' onClick={e => {
              this.runUploader(e, target, index);
            }} >
              {appLocalizer.global_string.open_uploader}
            </button>
            {m.desc ? <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: m.desc }}></p> : ''}
          </div>
        );
      }

      if (type == "wpeditor") {
        input = (
          <div className={m.class}>
            <textarea
              {...props}
              id={key}
              className="mvx-setting-form-input"
              key={key}
              name={name}
              value={value}
              rows="3"
              cols="50"
              onChange={e => {
                this.onChange(e, target);
              }}
            >
            </textarea>
            {m.desc ? <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: m.desc }}></p> : ''}
          </div>
        );
      }

      if (type == "google_map") {

        const {
            places, mapApiLoaded, mapInstance, mapApi,
        } = this.state;
        console.log(this.state.center);
        input = (
          <Wrapper>
                {mapApiLoaded && (
                    <div>
                        <AutoComplete map={mapInstance} mapApi={mapApi} addplace={this.addPlace} />
                    </div>
                )}
                <div style={{ height: '50vh', width: '50%' }}>
                    <GoogleMapReact
                        center={this.state.center}
                        zoom={this.state.zoom}
                        draggable={this.state.draggable}
                        onChange={this._onChange}
                        onChildMouseDown={this.onMarkerInteraction}
                        onChildMouseUp={this.onMarkerInteractionMouseUp}
                        onChildMouseMove={this.onMarkerInteraction}
                        onChildClick={() => console.log('child click')}
                        onClick={this._onClick}
                        bootstrapURLKeys={{
                            key: appLocalizer.google_api,
                            libraries: ['places', 'geometry'],
                        }}
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
                    >
                    <AnyReactComponent
                      lat={m.store_lat}
                      lng={m.store_lng}
                      text={appLocalizer.marker_icon}
                    />
                    </GoogleMapReact>
                </div>
                <div className="info-wrapper">
                    <div className="map-details">Latitude: <span>{this.state.lat}</span>, Longitude: <span>{this.state.lng}</span></div>
                    <div className="map-details">Zoom: <span>{this.state.zoom}</span></div>
                    <div className="map-details">Address: <span>{this.state.address}</span></div>
                </div>
            </Wrapper >
        );
      }

      if (type == "country") {
        let countryselectdrop = [];
        input = m.options.map((selectdata, index) => {
          countryselectdrop[index] = { value: selectdata.value, label: selectdata.label, index: index, key: selectdata.lebel };
        });

        input = (
          <div className="mvx-country-choice-class">
            <Select className={key}
              value={value}
              options={countryselectdrop}
              onChange={e => {
                this.onChange(e, m.key, 'single', type, countryselectdrop);
              }}
            >
            </Select>
            {m.desc ? <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: m.desc }}></p> : ''}
          </div>
        );
      }

      if (type == "state") {
        let stateselectdrop = [];
        input = this.state.statedrop.length > 0 ? this.state.statedrop.map((selectdata, index) => {
          stateselectdrop[index] = { value: selectdata.value, label: selectdata.value, index: index, key: selectdata.label };
        }) : '';

        input = (
          <div className="mvx-state-choice-class">
            <Select className={key}
              value={value}
              options={stateselectdrop}
              onChange={e => {
                this.onChange(e, m.key, 'single', type, stateselectdrop);
              }}
            >
            </Select>
            {m.desc ? <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: m.desc }}></p> : ''}
          </div>
        );
      }


      if (type == "nested") {
        var carsnew = [];
        var parentseectoption = [];
        var parentseectoption2 = [];
        var statedata = [];
        let ggg;
        input = (
          <div className="mvx-multi-nested-class">
            {m.database_value ? m.database_value.map((o, indexop) =>
              <div className="mvx-boarder-parent">
                {m.parent_options.map(op =>
                  <div className="mvx-boarder-parent-loop">

                    <label className="mvx-setting-form-label">
                      <p dangerouslySetInnerHTML={{ __html: op.label }}></p>
                    </label>

                    {op.type == 'text' ?
                      <input
                        {...props}
                        className="mvx-setting-form-input"
                        type={op.type}
                        value={o[op.key]}
                        onChange={e => {
                          this.onnestedChange(e, target, indexop, op, '', '', '', m);
                        }}
                      />
                      : ''}

                    {op.type == 'number' ?
                      <input
                        {...props}
                        className="mvx-setting-form-input"
                        type={op.type}
                        value={o[op.key]}
                        onChange={e => {
                          this.onnestedChange(e, target, indexop, op, '', '', '', m);
                        }}
                      />
                      : ''}

                    {op.type == 'checkbox' ?
                      <input
                        {...props}
                        className="mvx-setting-form-input"
                        type={op.type}
                        value="true"
                        checked={o[op.key]}
                        onChange={e => {
                          this.onnestedChange(e, target, indexop, op, '', '', '', m);
                        }}
                      />
                      : ''}

                    {
                      op.type == 'select' ?
                        op.options.map((selectdata, index) => {
                          parentseectoption[index] = { value: selectdata.value, label: selectdata.label, index: index };
                        }) : ''
                      ,
                      op.type == 'select' ?
                        <Select className="mvx-setting-form-input"
                          value={o[op.key]}
                          options={parentseectoption}
                          onChange={e => {
                            this.onnestedChange(e, target, indexop, op, '', '', parentseectoption, m);
                          }}
                        >
                        </Select>
                        : ''
                    }

                    {
                      op.type == 'select2nd' ?
                        op.options.map((selectdata, index) => {
                          parentseectoption2[index] = { value: selectdata.value, label: selectdata.label, index: index };
                        }) : ''
                      ,
                      op.type == 'select2nd' ?
                        <Select className="mvx-setting-form-input"
                          value={o[op.key]}
                          options={parentseectoption2}
                          onChange={e => {
                            this.onnestedChange(e, target, indexop, op, '', '', parentseectoption2, m);
                          }}
                        >
                        </Select>
                        : ''
                    }

                    {
                      op.type == 'country' ?
                        op.options.map((selectdata, index) => {
                          parentseectoption[index] = { value: selectdata.value, label: selectdata.label, index: index, key: selectdata.value };
                        }) : ''
                      ,
                      op.type == 'country' ?
                        <Select className="mvx-setting-form-input"
                          value={o[op.key]}
                          options={parentseectoption}
                          onChange={e => {
                            this.onnestedChange(e, target, indexop, op, '', '', parentseectoption, m);
                          }}
                        >
                        </Select>
                        : ''
                    }

                  </div>
                )}
                <div className="mvx-boarder-nested-child-start">

                  {
                    o.nested_datas ? o.nested_datas.map((opn, indexchildop) =>
                      <div>
                        {m.child_options.map((opnjj, indexcop) =>
                          <div className="mvx-boarder-nested-child">
                            <div className="mvx-boarder-nested-child-loop">

                              <label className="mvx-setting-form-label">
                                {opnjj.label} :
                              </label>

                              {opnjj.type == 'text' ?
                                <input
                                  {...props}
                                  className="mvx-setting-form-input"
                                  type={opnjj.type}
                                  value={opn[opnjj.key]}
                                  onChange={e => {
                                    this.onnestedChange(e, target, indexop, opnjj, 'childnested', indexchildop, '', m);
                                  }}
                                />
                                : ''}


                              {opnjj.type == 'checkbox' ?
                                <input
                                  {...props}
                                  className="mvx-setting-form-input"
                                  type={opnjj.type}
                                  value="true"
                                  checked={opn[opnjj.key]}
                                  onChange={e => {
                                    this.onnestedChange(e, target, indexop, opnjj, 'childnested', indexchildop, '', m);
                                  }}
                                />
                                : ''
                              }

                              {
                                opnjj.type == 'select' ?
                                  opnjj.options.map((okkkk, index) => {
                                    carsnew[index] = { value: okkkk.value, label: okkkk.value, index: index };
                                  }) : ''
                              }

                              {
                                opnjj.type == 'select' ?
                                  <Select className="mvx-setting-form-input"
                                    value={opn[opnjj.key]}
                                    options={carsnew}
                                    onChange={e => {
                                      this.onnestedChange(e, target, indexop, opnjj, 'childnested', indexchildop, carsnew, m);
                                    }}
                                  >
                                  </Select>
                                  : ''
                              }

                              {
                                opnjj.type == 'state' ?
                                  opnjj.options.map((okkkk, index) => {
                                    statedata[index] = { value: okkkk.label, label: okkkk.value, index: index };
                                  }) : ''
                                ,
                                opnjj.type == 'state' ?
                                  <Select className="mvx-setting-form-input"
                                    value={opn[opnjj.key]}
                                    options={statedata}
                                    onChange={e => {
                                      this.onnestedChange(e, target, indexop, opnjj, 'childnested', indexchildop, statedata, m);
                                    }}
                                  >
                                  </Select>
                                  : ''
                              }
                            </div>
                          </div>
                        )}

                        {m.child_options.length > 0 ?
                          <div className="horizontal-class">
                            <p className="button-controls"><a onClick={(e) => this.removenestedchildOption(e, indexop, indexchildop, m)} className="button-secondary">-</a></p>
                            {o.nested_datas.length - 1 == indexchildop ? <p className="button-controls"><a onClick={(e) => this.handlenestedchildAddClick(e, m, indexop)} className="button-primary">+</a></p> : ''}
                          </div>
                          : ''
                        }

                      </div>
                    ) : ''
                  }

                  {/* add nested */}

                </div>

                <div className="horizontal-class">
                  {m.database_value.length > 1 ? <p onClick={(e) => this.removenestedField(e, indexop, m)} className="button-controls button-secondary">-</p> : ''}
                  {m.database_value.length - 1 == indexop ? <p className="button-controls"><a onClick={(e) => this.handlenestedAddClick(e, m)} className="button-primary">+</a></p> : ''}
                </div>

              </div>
            ) : ''}
            {m.desc ? <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: m.desc }}></p> : ''}
          </div>
        );

      }

      if (type == "checkbox") {
        input = (
          <div className={m.right_content ? 'mvx-checkbox-list-side-by-side' : m.parent_class ? "mvx-checkbox-list-side-by-side" : ''}>

            {m.select_deselect ? <div className="mvx-select-deselect-trigger" onClick={e => { this.onSelectDeselectChange(e, m); }}>Select / Deselect All</div> : ''}
            {
              m.options.map(o => {
                //let checked = o.value == value;
                let checked = false;
                if (value && value.length > 0) {
                  checked = value.indexOf(o.value) > -1 ? true : false;
                }
                return (
                  <div className={m.right_content ? 'mvx-toggle-checkbox-header' : m.parent_class ? m.parent_class : ''}>
                    <React.Fragment key={"cfr" + o.key}>
                      {m.right_content ? <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: o.label }}></p> : ''}
                      <div className="mvx-toggle-checkbox-content">
                        <input
                          {...props}
                          className={m.class}
                          type={type}
                          id={`mvx-toggle-switch-${o.key}`}
                          key={o.key}
                          name={o.name}
                          checked={checked}
                          value={o.value}
                          onChange={e => {
                            this.onChange(e, m.key, "multiple");
                          }}
                        />
                        <label for={`mvx-toggle-switch-${o.key}`}></label>
                      </div>
                      {m.right_content ? '' : <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: o.label }}></p>}
                      {o.hints ? <span class="dashicons dashicons-info"><div className="mvx-hover-tooltip">{o.hints}</div></span> : ''}

                    </React.Fragment>

                  </div>
                );
              })
            }
            {m.desc ? <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: m.desc }}></p> : ''}
          </div>
        )
      }

      if (type == "checkbox_select") {
        input = (
          <div className="mvx-select-deselect-checkbox-content">

            <div className="mvx-select-de-box-and-checkbox">
              <div className="mvx-select-deselect-checkbox-content-trigger ">{m.select_deselect ? <div className="mvx-select-deselect-trigger" onClick={e => { this.onSelectDeselectChange(e, m); }}>Select / Deselect All</div> : ''}</div>

              <div className="mvx-select-deselect-checkbox-label-marge">
                {

                  m.options.map(o => {
                    //let checked = o.value == value;
                    let checked = false;
                    if (value && value.length > 0) {
                      checked = value.indexOf(o.value) > -1 ? true : false;
                    }
                    return (
                      <div className="mvx-col-50">
                        <React.Fragment key={"cfr" + o.key}>

                          <div className="mvx-wrap-checkbox-and-label d-flex">
                            <div className="mvx-normal-checkbox-content">
                              <input
                                {...props}
                                className={m.class}
                                type="checkbox"
                                id={`mvx-normal-switch-${o.key}`}
                                key={o.key}
                                name={o.name}
                                checked={checked}
                                value={o.value}
                                onChange={e => {
                                  this.onChange(e, m.key, "multiple");
                                }}
                              />
                            </div>
                            <div className="mvx-normal-checkbox-label"><p className="mvx-settings-metabox-description pt-0" dangerouslySetInnerHTML={{ __html: o.label }}></p></div>
                          </div>
                        </React.Fragment>
                      </div>
                    );
                  })
                }
              </div>
            </div>

            {m.desc ? <p className="mvx-settings-metabox-description" dangerouslySetInnerHTML={{ __html: m.desc }}></p> : ''}
          </div>
        )
      }

      return (
          m.type == 'section' || m.label == 'no_label' ? input :
          <div key={"g" + key} className="mvx-form-group">
            <label className="mvx-settings-form-label" key={"l" + key} htmlFor={key}>
              <p dangerouslySetInnerHTML={{ __html: m.label }}></p>
            </label>
            <div className="mvx-settings-input-content">
              {input}
            </div>
          </div>
      );
    });
    return formUI;
  };


      componentWillMount() {
        this.setCurrentLocation();
    }


    onMarkerInteraction = (childKey, childProps, mouse) => {
        this.setState({
            draggable: false,
            lat: mouse.lat,
            lng: mouse.lng
        });
    }
    onMarkerInteractionMouseUp = (childKey, childProps, mouse) => {
        this.setState({ draggable: true });
        this._generateAddress();
    }

    _onChange = ({ center, zoom }) => {
        this.setState({
            center: center,
            zoom: zoom,
        });

    }

    _onClick = (value) => {
        this.setState({
            lat: value.lat,
            lng: value.lng
        });
    }

    apiHasLoaded = (map, maps) => {
        this.setState({
            mapApiLoaded: true,
            mapInstance: map,
            mapApi: maps,
        });

        this._generateAddress();
    };

    addPlace = (place) => {
        this.setState({
            places: [place],
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        });
        this._generateAddress()
    };

    _generateAddress() {
        const {
            mapApi
        } = this.state;

        const geocoder = new mapApi.Geocoder;

        geocoder.geocode({ 'location': { lat: this.state.lat, lng: this.state.lng } }, (results, status) => {
            console.log(results);
            console.log(status);
            if (status === 'OK') {
                if (results[0]) {
                    this.zoom = 12;
                    this.setState({ address: results[0].formatted_address });
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }

        });
    }

    // Get Current Location Coordinates
    setCurrentLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.setState({
                    center: [position.coords.latitude, position.coords.longitude],
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            });
        }
    }


  render() {
    let prop_submitbutton = this.props.submitbutton && this.props.submitbutton == 'false' ? '' : 'true';
    return (
      <div className="mvx-dynamic-fields-wrapper">
        {this.state.errordisplay ? <div className="mvx-notic-display-title"><i className="mvx-font icon-yes mr-6"></i>{this.state.errordisplay}</div> : ''}
        <form
          className="mvx-dynamic-form"
          onSubmit={e => {
            this.onSubmit(e);
          }}
        >
          {this.renderForm()}
          {prop_submitbutton ?
            <div className="mvx-form-actions">
              <button className="button-secondary" disabled={this.state.from_loading} type="submit">{this.state.from_loading && (
                <i
                  className="mvx-font icon-approve"
                  style={{ marginRight: "5px" }}
                />
              )}
                {this.state.from_loading && <span>{appLocalizer.global_string.saving}</span>}
                {!this.state.from_loading && <span>{this.props.submit_title ? this.props.submit_title : appLocalizer.global_string.save}</span>}</button>
            </div>
            : ''}
        </form>
      </div>
    );
  }
}
