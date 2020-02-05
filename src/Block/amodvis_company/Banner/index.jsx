import React, { Component } from 'react';
import styles from './index.module.scss';
var envJson = require("../../../.env.json");

export default class Banner extends Component {
  static displayName = 'Banner';
  static propTypes = {};
  static defaultProps = {};

  static publicIceDistUrl = envJson.publicIceDistUrl;
  constructor(props) {
    super(props);
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
          <a className={styles.link} href={module_data.btn_link} target="_blank">{module_data.btn_text}</a>
        </div>
      </div>
    );
  }
}