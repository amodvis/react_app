import React, { Component } from 'react';
var envJson = require("../../../.env.json");
export default class CardItems extends Component {
  static displayName = 'CardItems';

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
            "name": "",
            "sold_count": "",
            "des": ""
          },
          {
            "name": "",
            "sold_count": "",
            "des": ""
          },
          {
            "name": "",
            "sold_count": "",
            "des": ""
          },
          {
            "name": "",
            "sold_count": "",
            "des": ""
          }
        ]
      };
    } else {
      module_data = this.props.module_data;
    }
    const publicIceDistUrl = CardItems.publicIceDistUrl;
    return (
      <div style={styles.hyThirdPartyWrapper}>
        <div style={styles.hyThirdParty}>
          <h3 style={styles.hyThirdPartyTitle}>
            第三方服务推荐
            <a style={styles.thirdPartyMore} href="#">
              查看更多服务
            </a>
          </h3>

          <div style={styles.thirdPartyDetails}>
            <div style={styles.thirdPartyDetail}>
              <div
                style={{
                  ...styles.thirdPartyDetailItem,
                  ...styles.thirdPartyDetailItemFirst,
                }}
              >
                <img
                  style={styles.thirdPartyDetailImg}
                  src={publicIceDistUrl + "public/images/geocpIkIixaGovHECTdw.svg"}
                  alt=""
                />
                <h5 style={styles.thirdPartyName}>{module_data.list[0].name}</h5>
                <p style={styles.thirdPartySold}>
                  已售：
                  <span style={styles.thirdPartySoldNumber}>{module_data.list[0].sold_count}</span>
                </p>
                <p style={styles.thirdPartyDesc}>
                  {module_data.list[0].des}
                </p>
                <a style={styles.thirdPartyLink} href="#">
                  免费接入
                </a>
              </div>

              <div style={styles.thirdPartyDetailItem}>
                <img
                  style={styles.thirdPartyDetailImg}
                  src={publicIceDistUrl + "public/images/kMXuMYkLTCSkTnzoiRxs.png"}
                  alt=""
                />
                <h5 style={styles.thirdPartyName}>{module_data.list[1].name}</h5>
                <p style={styles.thirdPartySold}>
                  已售：
                  <span style={styles.thirdPartySoldNumber}>{module_data.list[1].sold_count}</span>
                </p>
                <p style={styles.thirdPartyDesc}>
                  {module_data.list[1].des}
                </p>
                <a style={styles.thirdPartyLink} href="#">
                  免费接入
                </a>
              </div>

              <div style={styles.thirdPartyDetailItem}>
                <img
                  style={styles.thirdPartyDetailImg}
                  src={publicIceDistUrl + "public/images/TpqeamkGvHuXSWKsLOth.png"}
                  alt=""
                />
                <h5 style={styles.thirdPartyName}>{module_data.list[2].name}</h5>
                <p style={styles.thirdPartySold}>
                  已售：
                  <span style={styles.thirdPartySoldNumber}>{module_data.list[2].sold_count}</span>
                </p>
                <p style={styles.thirdPartyDesc}>
                  {module_data.list[2].des}
                </p>
                <a style={styles.thirdPartyLink} href="#">
                  免费接入
                </a>
              </div>

              <div
                style={{
                  ...styles.thirdPartyDetailItem,
                  ...styles.thirdPartyDetailItemLast,
                }}
              >
                <img
                  style={styles.thirdPartyDetailImg}
                  src={publicIceDistUrl + "public/images/ykkPpNnSjuqpqBhxjTir.png"}
                  alt=""
                />
                <h5 style={styles.thirdPartyName}>{module_data.list[3].name}</h5>
                <p style={styles.thirdPartySold}>
                  已售：
                  <span style={styles.thirdPartySoldNumber}>{module_data.list[3].sold_count}</span>
                </p>
                <p style={styles.thirdPartyDesc}>
                  {module_data.list[3].des}
                </p>
                <a style={styles.thirdPartyLink} href="#">
                  免费接入
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  hyThirdPartyWrapper: {
    background: '#fff',
    minWidth: '1280px',
  },
  hyThirdParty: {
    paddingTop: '47px',
    paddingBottom: '40px',
    textAlign: 'center',
    width: '1200px',
    margin: '0 auto',
  },
  hyThirdPartyTitle: {
    position: 'relative',
    fontFamily: 'Microsoft YaHei',
    fontSize: '26px',
    lineHeight: '40px',
    color: '#999',
    fontWeight: '400',
    verticalAlign: 'middle',
    marginBottom: '40px',
  },
  thirdPartyMore: {
    position: 'absolute',
    right: '0',
    top: '12px',
    color: '#108ee9',
    fontSize: '14px',
    lineHeight: '18px',
    fontWeight: '400',
    textDecoration: 'none',
  },
  thirdPartyDetails: {
    position: 'relative',
    height: '400px',
    margin: '0',
    padding: '0',
  },
  thirdPartyDetail: {
    zIndex: '0',
    fontSize: '0',
    position: 'absolute',
    left: '0',
    top: '0',
    width: '100%',
    display: 'block',
    WebkitTransition: 'opacity .3s linear',
    transition: 'opacity .3s linear',
  },
  thirdPartyDetailItem: {
    display: 'inline-block',
    verticalAlign: 'top',
    width: '270px',
    height: '400px',
    borderRadius: '2px 2px 0 0',
    margin: '0 20px',
    border: '1px solid #eaeaea',
    boxSizing: 'border-box',
    WebkitTransition: '-webkit-transform .2s linear',
    transition: 'transform .2s linear,\n-webkit-transform .2s linear',
  },
  thirdPartyDetailItemFirst: {
    marginLeft: '0',
  },
  thirdPartyDetailItemLast: {
    marginRight: '0',
  },
  thirdPartyDetailImg: {
    width: '270px',
    height: '180px',
    borderRadius: '2px 2px 0 0',
    position: 'relative',
    left: '-1px',
    border: '0',
  },
  thirdPartyName: {
    marginTop: '20px',
    fontSize: '20px',
    lineHeight: '28px',
    color: '#333',
    fontWeight: '600',
  },
  thirdPartySold: {
    fontSize: '14px',
    color: '#333',
    lineHeight: '20px',
  },
  thirdPartySoldNumber: {
    color: '#108ee9',
    fontWeight: '500',
  },
  thirdPartyDesc: {
    margin: '14px 15px 0',
    color: '#333',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '20px',
    height: '60px',
  },
  thirdPartyLink: {
    marginTop: '15px',
    display: 'inline-block',
    padding: '5px 37px',
    fontSize: '14px',
    color: '#108ee9',
    border: '1px solid #108ee9',
    borderRadius: '4px',
    WebkitTransition: 'all .2s linear',
    transition: 'all .2s linear',
  },
};
