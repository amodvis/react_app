import React, { useState, useEffect } from 'react';
import { Collapse } from '@alifd/next';
import IceContainer from '@icedesign/container';
import styles from './index.module.scss';
export default function Solution(props) {
  const mockData = props.module_data;
  const [dataSource, setData] = useState(mockData);
  const [expandedKeys, setExpandedKeys] = useState([0]);

  const osnChange = (status) => {
    console.log(status)
    if(status){
      setExpandedKeys([status]) 
    }else{
      setExpandedKeys(expandedKeys) 
    }
    setData(dataSource.map((e, k) => {
      return {
        ...e,
        expanded: false,
      }
      // return Object.assign({}, e, { expanded: status });
    }));
  };
  useEffect(() => {
    document.title = `You clicked `+Math.random()+` times`;
  },[expandedKeys]);
  return (
    <IceContainer>
      <Collapse
        expandedKeys={expandedKeys}
        className={styles.accordion}
        accordion
        onExpand={(status) => {
          osnChange(status)
        }}
        dataSource={dataSource} />
    </IceContainer>
  );
}
