import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.scss';
var envJson = require("../../../.env.json");
export default class Header extends Component {
  static displayName = 'Header';
  static propTypes = {};
  static defaultProps = {};

  static publicIceDistUrl = envJson.publicIceDistUrl;
  constructor(props) {
    super(props);
  }
  render() {
    let module_data;
    if (!this.props.module_data || !this.props.module_data.logo_name) {
      module_data = {
        "logo_name": ''
      };
    } else {
      module_data = this.props.module_data;
    }
    return (
      <div className={window.isMobile ? styles.mobile_header : styles.header}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logoLink}>
            {module_data.logo_name}
          </Link>
        </div>
        <ul className={styles.nav}>
          <li className={styles.navItem}>
            <Link to="/" className={styles.activeNavItemLink}>
              首页
          </Link>
            <Link to="/" className={styles.navItemLink}>
              更多
          </Link>
          </li>
        </ul>
      </div>
    );
  }
}