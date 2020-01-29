import React, { Component } from 'react';
import { Link } from 'react-router-dom';
var envJson = require("../../../.env.json");
export default class AblityItems extends Component {
  static displayName = 'AblityItems';

  static propTypes = {};

  static defaultProps = {};

  static publicIceDistUrl = envJson.publicIceDistUrl;
  constructor(props) {
    super(props);
  }
  render() {
    let module_data;
    if (!this.props.module_data || !this.props.module_data.list) {
      module_data = {
        "list": [
          {
            "value": "",
            "des": ""
          },
          {
            "value": "",
            "des": ""
          },
          {
            "value": "",
            "des": ""
          }
        ]
      };
    } else {
      module_data = this.props.module_data;
    }
    const publicIceDistUrl = AblityItems.publicIceDistUrl;
    return (
      <div className="hy-ability" style={style.hyAbilityStyles}>
        {JSON.stringify(this.props.module_data)}
        <div>
          <Link to="/item_search">/item_search</Link>
        </div>
        <div>
          <Link to="/index">/index</Link>
        </div>
        <div>
          <Link to="/item_search/1580311293">/item_search/:keyword</Link>
        </div>
        <div className="hy-ability-item" style={style.hyAbilityItemStyle}>
          <img
            alt=""
            src={publicIceDistUrl + "/public/images/aWimbMGxabytxrRqcnEU.svg"}
            style={style.hyAbilityItemImgStyle}
          />
          <h3 style={style.hyAbilityItemTitleStyle}>{module_data.list[0].value}</h3>
          <p style={style.hyAbilityItemSubtitleStyle}>
            {module_data.list[0].des}
          </p>
        </div>

        <div className="hy-ability-item" style={style.hyAbilityItemStyle}>
          <img
            alt=""
            src={publicIceDistUrl + "/public/images/neNAdNbBxUbWpbUQIsJA.svg"}
            style={style.hyAbilityItemImgStyle}
          />
          <h3 style={style.hyAbilityItemTitleStyle}>{module_data.list[1].value}</h3>
          <p style={style.hyAbilityItemSubtitleStyle}>
            {module_data.list[1].des}
          </p>
        </div>

        <div className="hy-ability-item" style={style.hyAbilityItemStyle}>
          <img
            alt=""
            src={publicIceDistUrl + "/public/images/SsStefBxcUWayMyktAwz.svg"}
            style={style.hyAbilityItemImgStyle}
          />
          <h3 style={style.hyAbilityItemTitleStyle}>{module_data.list[2].value}</h3>
          <p style={style.hyAbilityItemSubtitleStyle}>
            {module_data.list[2].des}
          </p>
        </div>
      </div>
    );
  }
}

const style = {
  hyAbilityStyles: {
    fontFamily: 'Microsoft YaHei',
    height: '223px',
    textAlign: 'center',
    background: '#fff',
  },
  hyAbilityItemStyle: {
    display: 'inline-block',
    width: '280px',
    margin: '38px 35px 0',
    verticalAlign: 'top',
  },
  hyAbilityItemImgStyle: {
    height: '62px',
  },
  hyAbilityItemTitleStyle: {
    fontSize: '20px',
    lineHeight: '26px',
    color: '#333',
    fontWeight: '400',
    margin: '18px 0 10px',
  },
  hyAbilityItemSubtitleStyle: {
    fontSize: '16px',
    color: '#999',
    lineHeight: '21px',
  },
};
