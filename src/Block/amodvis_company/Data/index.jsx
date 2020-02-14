import React from 'react';
import { Grid } from '@alifd/next';
import BarChart from './BarChart';
import PieChart from './PieChart';
import LineChart from './LineChart';
import styles from './index.module.scss';

const { Row, Col } = Grid;

let listChart = () => {
  if (window.isMobile) {
    return (
      <div>
        <div>
          <BarChart />
        </div>
        <div>
          <PieChart />
        </div>
        <div>
          <LineChart />
        </div>
      </div>
    )
  } else {
    return (
      <Row gutter="20">
        <Col l="8">
          <BarChart />
        </Col>
        <Col l="8">
          <PieChart />
        </Col>
        <Col l="8">
          <LineChart />
        </Col>
      </Row>
    )
  }
}

export default function Data() {
  return (
    <div className={window.isMobile ? styles.mobile_container : styles.container}>
      <h3 className={styles.title}>提效数据</h3>
      <div className={window.isMobile ? styles.mobile_content : styles.content}>
        {listChart()}
      </div>
    </div>
  );
}
