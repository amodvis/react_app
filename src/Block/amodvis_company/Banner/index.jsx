import React, { Component } from 'react';
import styles from './index.module.scss';
import { Link } from 'react-router-dom';
var envJson = require("../../../.env.json");

export default class Banner extends Component {
  static displayName = 'Banner';
  static propTypes = {};
  static defaultProps = {};

  static publicIceDistUrl = envJson.publicIceDistUrl;
  constructor(props) {
    super(props);
  }

  getLink(link, text) {
    let renderLink
    let patt1 = new RegExp("^http");
    if (patt1.test(link)) {
      console.log(link)
      renderLink = (<a className={styles.link} href={link} target="_blank">{text}</a>)
    } else {
      console.log(222222)
      renderLink = (<Link className={styles.link} to={link}>{text}</Link>)
    }
    return renderLink
  }

  render() {
    let module_data;
    if (!this.props.module_data || !this.props.module_data.text1) {
      module_data = {
        text1: "",
        text2: "",
        btn_text: "",
        btn_link: "",
      };
    } else {
      module_data = this.props.module_data;
    }

    return (
      <div className={styles.container} >
        <div className={styles.content}>
          <div className={styles.title}>{module_data.text1}</div>
          <div className={styles.desc}>{module_data.text2}</div>
          {this.getLink(module_data.btn_link, module_data.btn_text)}
        </div>
      </div>
    );
  }
}
