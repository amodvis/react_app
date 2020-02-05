import React from 'react';
import { Grid } from '@alifd/next';
import styles from './index.module.scss';
import { Link } from 'react-router-dom';

const { Row, Col } = Grid;

export default function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Row>
          <Col l="8">
            <h3 className={styles.title}>关于我们</h3>
            <div className={styles.nav}>
              <a className={styles.link}>私权政策</a>
              <a className={styles.link}>加入我们</a>
            </div>
          </Col>
          <Col l="8">
            <h3 className={styles.title}>使用帮助</h3>
            <div className={styles.nav}>
              <a className={styles.link}>联系我们</a>
              <a className={styles.link} target="_blank" href="https://gitee.com/amodvis/amodvis">使用文档</a>
            </div>
          </Col>
          <Col l="8">
            <h3 className={styles.title}>使用答疑群</h3>
            <img
              src="https://static-upload.amodvis.com/amodvis/static/image/3f/6d/72/3f6d726e5aa3654ab9fa2d5f5af9baa8.png"
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
