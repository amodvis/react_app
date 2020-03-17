import React, { Component } from 'react';
import { Grid } from '@alifd/next';
import styles from './index.module.scss';
import { Link } from 'react-router-dom';

const { Row, Col } = Grid;

//a标签生成器
const GenerateLink = (props) => {
  let link, httpReg

  httpReg = new RegExp("^http");

  if (httpReg.test(props.link)) {
    link = (<Link {...props} to={props.href}>{props.children}</Link>)
  } else {
    link = (<a {...props}>{props.children}</a>)
  }

  return link
}

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  getBtnList = (btn_list) => {
    if (!btn_list) {
      return '';
    }

    return Object.keys(btn_list)
      .map((key) => {

        let item = btn_list[key];
        let text = item.text;
        let link = item.link;

        return (
          <GenerateLink className={styles.link} href={link} >{text}</GenerateLink>
        );
      })
  }
  getLines(line) {
    
    if (!line) {
      return "";
    }
    return Object.keys(line)
      .map((key) => {

        let item = line[key]

        return (
          <Col l="8">
            <h3 className={styles.title}>{item.text}</h3>
            <div className={styles.nav}>
              {item.pic ? (<img
                src={item.pic}
                alt={item.pic}
                className={styles.qrcode}
              />) : this.getBtnList(item.btn_list)}
            </div>
          </Col>
        );
      })
  }

  render() {

    let module_data;
    if (!this.props.module_data) {
      module_data = {
        text1: "",
        text2: "",
        text3: "",
        line: []
      };
    } else {
      module_data = this.props.module_data;
    }
    
    return (
      <div className={window.isMobile ? styles.mobile_container : styles.container}>
        <div className={window.isMobile ? styles.mobile_content : styles.content}>
          <Row>
            {this.getLines(module_data.line)}
          </Row>
          {module_data.text1 ? <p className={styles.copyRight}>{module_data.text1}</p> : null}
          {module_data.text2 ? <p className={styles.copyRight}>{module_data.text2}</p> : null}
          {module_data.text3 ? <p className={styles.copyRight}>{module_data.text3}</p> : null}
        </div>
      </div>
    );
  }
}

export default Footer;