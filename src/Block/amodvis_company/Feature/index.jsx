import React, { Component } from 'react';
import { Grid } from '@alifd/next';
import styles from './index.module.scss';
var envJson = require("../../../.env.json");
const { Row, Col } = Grid;
export default class Feature extends Component {
  static displayName = 'Feature';
  static propTypes = {};
  static defaultProps = {};

  static publicIceDistUrl = envJson.publicIceDistUrl;
  constructor(props) {
    super(props);
  }
  render() {
    let module_data;
    if (!this.props.module_data || !this.props.module_data.list) {
      module_data = [];
    } else {
      module_data = this.props.module_data.list;
    }
    return (
      <div className={styles.container}>
        <Row wrap className={styles.content}>
          {module_data.map((item, index) => {
            return (
              <Col xxs="12" s="6" l="6" key={index} className={styles.item}>
                <img src={item.pic} className={styles.pic} alt="" />
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.desc}>{item.desc}</p>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }
}