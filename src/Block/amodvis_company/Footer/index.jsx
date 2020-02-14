import React from 'react';
import { Grid } from '@alifd/next';
import styles from './index.module.scss';
import { Link } from 'react-router-dom';

const { Row, Col } = Grid;

export default function Footer() {
  return (
    <div className={window.isMobile ? styles.mobile_container : styles.container}>
      <div className={window.isMobile ? styles.mobile_content : styles.content}>
        <Row>
          <Col l="8">
            <h3 className={styles.title}>关于我们</h3>
            <div className={styles.nav}>
              <Link className={styles.link} to="/index">首页</Link>
              <a className={styles.link}>私权政策</a>
              <a className={styles.link}>加入我们</a>
            </div>
          </Col>
          <Col l="8">
            <h3 className={styles.title}>使用帮助</h3>
            <div className={styles.nav}>
              <Link className={styles.link} to="/web_im">联系我们</Link>
              <Link className={styles.link} to="/document/index">使用文档</Link>
            </div>
          </Col>
          <Col l="8">
            <h3 className={styles.title}>使用答疑群</h3>
            <img
              src="http://106.54.93.177:9091/amodvis/static/image/1d/2e/08/1d2e08c466ab6016bd946fe4ff3d3ec4.png"
              alt="qr-code"
              className={styles.qrcode}
            />
          </Col>
        </Row>
        <p className={styles.copyRight}>AMODVIS © 2020 版权所有</p>
        <p className={styles.copyRight}>email 185441127@qq.com</p>
      </div>
    </div>
  );
}
