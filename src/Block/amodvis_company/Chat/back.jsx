import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.scss';
import HTTPUtil from '../../../utils/fetch'

import { Picker, Emoji, NimbleEmoji } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
let envJson = require("../../../.env.json");
let styleOfPicker = {
    default: { height: '50px', overflow: 'hidden', width: '100%', borderBottom: 'none', position: 'absolute', left: 0, top: 0 },
    show: { height: 'auto', overflow: 'auto', width: '100%', borderBottom: 'none', position: 'absolute', left: 0, top: 0 }
}
let webimBaseUrl = envJson.webimBaseUrl
let webimWebsocketUrl = envJson.webimWebsocketUrl
function useSocketOnMessage(callback, userInfo) {
    const savedCallback = useRef();

    // Remember the latest function.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        let retryInit = () => {
            window.socket = new WebSocket(webimWebsocketUrl + 'chat_room/upgrade?user_id=' + userInfo.user_id);
            window.socket.onmessage = function (event) {
                var data = JSON.parse(event.data);
                savedCallback.current(data)
            }
            window.socket.onclose = function (e) {
                console.log(e.code + ":" + e.reason);
                window.socket.close();
                if (e.code == 1006) {
                    setTimeout(() => {
                        retryInit();
                    }, 2000);
                }
            }
        }
        retryInit()
    }, []);
}
let initSocket = (userInfo, msgList, setMsgList, setRefresh, chatMsgListRef) => {
    useSocketOnMessage((data) => {
        if (data.ChatMstType == 0) {
            let content = data.Content
            console.log("----------ON MESSAGE LIST---------")
            let tem = msgList
            if (!tem[content.RoomID]) {
                tem[content.RoomID] = []
            }
            tem[content.RoomID].push({
                msg_id: content.MsgID, msg_content: content.MsgContent, create_at: content.CreateAt, room_id: content.RoomID,
                parent_msg_id: content.ParentMsgID, user_id: content.UserID, user_name: content.UserName
            })
            setMsgList(tem)
            setRefresh(true);
            chatMsgListRef.current.scrollTop = chatMsgListRef.current.scrollHeight;
        }
    }, userInfo);
}
export default function Chat(props) {
    // todo fix
    let userInfo = window.amodvis_user_info ? window.amodvis_user_info : { user_id: 1, head_pic: "http://106.54.93.177:9091/amodvis/static/image/fd/83/05/fd8305e6d8cad189dc342aa8ac8aa5a3.jpeg", user_name: "user_1" }
    console.log(userInfo)
    console.log(props)
    const chatMsgListRef = useRef()
    const RoomNameRef = useRef()
    const proxyBtnRef = useRef()
    const closeBtnRef = useRef()
    const [refresh, setRefresh] = useState(false);
    const [pickerStyle, setPickerStyle] = useState(styleOfPicker.default);
    const roomListDefault = [];
    const lastRoomIDDefault = 0
    const [lastRoomID, setlastRoomID] = useState(lastRoomIDDefault);
    const [roomList, setRoomList] = useState(roomListDefault);
    const [msgList, setMsgList] = useState({});
    const [createDisplayBlock, setCreateDisplayBlock] = useState("none");
    const textareaRef = useRef();
    (function (userInfo, msgList, setMsgList, setRefresh, chatMsgListRef) {
        initSocket(userInfo, msgList, setMsgList, setRefresh, chatMsgListRef)
    })(
        userInfo, msgList, setMsgList, setRefresh, chatMsgListRef
    )
    useEffect(() => {
        refresh && setTimeout(() => setRefresh(false));
    }, [refresh]);

    const handleClick = (roomID) => {
        return () => {
            window.socket.send(`{"ChatMstType":1,"Content":{"RoomID":` + roomID + `,"UserID":` + userInfo.user_id + `}}`)
            setRoomList(roomList.map((e, k) => {
                if (e.room_id == roomID) {
                    e.is_checked = true
                    setlastRoomID(roomID)
                } else {
                    e.is_checked = false
                }
                return e
            }))
            getRoomMsgDetail(roomID)
        }
    }

    const getRoomMsgDetail = (roomID) => {
        // 获取ROOM MESSGAE
        let params = { "room_id": roomID, "page": 1, "page_size": 100 }
        let headers = {}
        HTTPUtil.get(webimBaseUrl + "chat_room/room_msg_latest", params, headers)
            .then((res) => {
                if (res.State && res.Data) {
                    res.Dada = Object.keys(res.Data).map((key) => {
                        let val = res.Data[key]
                        return {
                            msg_id: val.MsgID, msg_content: val.MsgContent, create_at: val.CreateAt, room_id: val.RoomID,
                            parent_msg_id: val.ParentMsgID, user_id: val.UserID, user_name: val.UserName
                        }
                    })
                    var temListMsg = {}
                    temListMsg[roomID] = res.Dada
                    // 清空其他ROOM缓存
                    setRefresh(true);
                    setMsgList(temListMsg)
                    chatMsgListRef.current.scrollTop = chatMsgListRef.current.scrollHeight;
                } else {
                    setMsgList({})
                }
            })
    }
    const getRoomList = (roomList) => {
        return Object.keys(roomList).map((key) => {
            return (<div key={roomList[key].room_id} className={`${styles.room_item} ${roomList[key].is_checked == true ? styles.checked_room_item : styles.room_item}`} data_id={roomList[key].room_id} onClick={handleClick(roomList[key].room_id)}>
                <div className={styles.basic_user_left}>
                    <div className={styles.basic_user_left_i}></div>
                    <img className={styles.left_img} src={roomList[key].room_logo} />
                </div>
                <div className={styles.basic_user_right}>
                    {roomList[key].room_name}
                </div>
            </div>)
        })
    }

    const getFormatTime = (value) => {
        var date = new Date(parseInt(value) * 1000)
        var tt = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') + '  ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
        return tt;
    }

    const getEmojiHtml = (msg_content) => {
        let matchArr;
        let lastOffset = 0;
        const regex = new RegExp('(\:[a-zA-Z0-9-_+]+\:(\:skin-tone-[2-6]\:)?)', 'g');
        const partsOfTheMessageText = [];
        while ((matchArr = regex.exec(msg_content)) !== null) {
            const previousText = msg_content.substring(lastOffset, matchArr.index);
            if (previousText.length) partsOfTheMessageText.push(previousText);
            lastOffset = matchArr.index + matchArr[0].length;
            const emoji = (
                <Emoji
                    emoji={matchArr[0]}
                    set="emojione"
                    size={22}
                    fallback={(em, props) => {
                        return em ? `:${em.short_names[0]}:` : props.emoji;
                    }}
                />
            );
            if (emoji) {
                partsOfTheMessageText.push(emoji);
            } else {
                partsOfTheMessageText.push(matchArr[0]);
            }
        }
        const finalPartOfTheText = msg_content.substring(lastOffset, msg_content.length);
        if (finalPartOfTheText.length) {
            partsOfTheMessageText.push(finalPartOfTheText)
        }
        if (partsOfTheMessageText.length > 0) {
            let count = 1
            return partsOfTheMessageText.map(p => {
                count++
                return (<span key={count}>{p}</span>)
            })
        } else {
            return msg_content
        }
    }
    const getChatListItem = (msgItemList) => {
        if (!msgItemList) {
            return '';
        }
        return Object.keys(msgItemList).map((key) => {
            return (<div key={msgItemList[key].msg_id} className={styles.chat_list_item}>
                <div className={styles.item_detail}>
                    {getEmojiHtml(msgItemList[key].msg_content)}
                </div>
                <div className={styles.item_user}>
                    <div className={styles.item_user_user}>{msgItemList[key].user_name}</div>
                    <div className={styles.item_user_time}>创建时间 {getFormatTime(msgItemList[key].create_at)}</div>
                </div>
            </div>)
        })
    }

    const sendMsgHandle = () => {
        if (lastRoomID == 0) {
            return
        }
        window.socket.send('{"ChatMstType":0,"Content":{"MsgContent":"' + textareaRef.current.value + '","RoomID":' + lastRoomID + ',"UserID":' + userInfo.user_id + '}}')
        textareaRef.current.value = ""
    }

    const initChat = () => {
        let params = {}
        let headers = {}
        HTTPUtil.get(webimBaseUrl + "chat_room/get_all_room", params, headers)
            .then((res) => {
                if (res.State && res.Data) {
                    var isSetCheck = false;
                    var temLastRoomID = 0
                    res.Dada = Object.keys(res.Data).map((key) => {
                        let val = res.Data[key]
                        if (!temLastRoomID && !isSetCheck) {
                            val.is_checked = true
                            isSetCheck = true
                            temLastRoomID = val.RoomID
                        } else {
                            if (val.room_id == temLastRoomID) {
                                val.is_checked = true
                            } else {
                                val.is_checked = false
                            }
                        }
                        return { room_id: val.RoomID, room_name: val.RoomName, room_logo: val.RoomPic, last_msg: val.LastMsg, is_checked: val.is_checked }
                    })
                    setRoomList(res.Dada)
                    getRoomMsgDetail(temLastRoomID)
                    setlastRoomID(temLastRoomID)
                }
            })
    }

    useEffect(() => {
        initChat()
    }, []);

    const createRoomHandle = () => {
        if (createDisplayBlock == "block") {
            setCreateDisplayBlock("none")
        } else {
            setCreateDisplayBlock("block")
        }
    }

    const createRoomEnsureHandle = () => {
        let roomName = RoomNameRef.current.value
        if (!roomName) {
            return
        }
        let params = { "room_name": roomName, "user_id": userInfo.user_id }
        let headers = {}
        HTTPUtil.get(webimBaseUrl + "chat_room/create", params, headers)
            .then((res) => {
                if (res.State) {
                    initChat()
                }
                setCreateDisplayBlock("none")
            })

    }

    const createRoomCannelHandle = () => {
        setCreateDisplayBlock("none")
    }

    const emojiSelet = (data) => {
        setPickerStyle(styleOfPicker.default)
        proxyBtnRef.current.style.display = "block"
        closeBtnRef.current.style.display = "none"
        insertText(textareaRef.current, data.colons)
    }

    const insertText = (obj, str) => {
        if (document.selection) {
            var sel = document.selection.createRange();
            sel.text = str;
        } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
            var startPos = obj.selectionStart,
                endPos = obj.selectionEnd,
                cursorPos = startPos,
                tmpStr = obj.value;
            obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
            cursorPos += str.length;
            obj.selectionStart = obj.selectionEnd = cursorPos;
        } else {
            obj.value += str;
        }
    }

    const proxyItemHandle = (index) => {
        return function () {
            console.log(index)
            if (pickerStyle.overflow == 'hidden') {
                setPickerStyle(styleOfPicker.show)
                // ReactDom
                document.getElementsByClassName("emoji-mart-anchors")[0].children[index].click()
                proxyBtnRef.current.style.display = "none"
                closeBtnRef.current.style.display = "block"
            }
        }
    }

    const closeBtnHandle = () => {
        closeBtnRef.current.style.display = "none"
        proxyBtnRef.current.style.display = "block"
        setPickerStyle(styleOfPicker.default)
    }

    return (
        <div className={styles.content}>
            <div className={styles.left_part}>
                <div className={styles.create_room} onClick={createRoomHandle}>创建频道</div>
                <div className={styles.create_room_form}>
                    <div className={styles.md_addnavbox} style={{ display: createDisplayBlock }}>
                        <div className={styles.arrow_box}>
                            <b><i className={styles.top_arrow1}></i><i className={styles.top_arrow2}></i></b>
                        </div>
                        <div className={styles.md_ipt}><input className={styles.md_ipt_input} ref={RoomNameRef} type="text" placeholder="请输入channel名称" /></div>
                        <div className={styles.md_subbtn}>
                            <button type="button" className={styles.layui_md_btn} onClick={createRoomEnsureHandle}>确定
                    </button>
                            <button type="button" className={styles.layui_btn_normal} onClick={createRoomCannelHandle}>取消
                    </button>
                        </div>
                    </div>
                </div>
                <div className={styles.room_list}>
                    {getRoomList(roomList)}
                </div>
            </div>
            <div className={styles.right_part}>
                <div className={styles.chat_list} ref={chatMsgListRef}>
                    {getChatListItem(msgList[lastRoomID])}
                </div>
                <div className={styles.chat_content}>
                    <div className={styles.chat_main}>
                        <Picker set="emojione"
                            style={pickerStyle} EmojiSkin={2}
                            sheetSize={32} showPreview={false} showSkinTones={false} onSelect={emojiSelet} />
                        <div className={styles.picker_proxy} ref={proxyBtnRef}>
                            <div className={styles.picker_proxy_item} onClick={proxyItemHandle(0)}></div>
                            <div className={styles.picker_proxy_item} onClick={proxyItemHandle(1)}></div>
                            <div className={styles.picker_proxy_item} onClick={proxyItemHandle(2)}></div>
                            <div className={styles.picker_proxy_item} onClick={proxyItemHandle(3)}></div>
                            <div className={styles.picker_proxy_item} onClick={proxyItemHandle(4)}></div>
                            <div className={styles.picker_proxy_item} onClick={proxyItemHandle(5)}></div>
                            <div className={styles.picker_proxy_item} onClick={proxyItemHandle(6)}></div>
                            <div className={styles.picker_proxy_item} onClick={proxyItemHandle(7)}></div>
                            <div className={styles.picker_proxy_item} onClick={proxyItemHandle(8)}></div>
                        </div>
                        <div className={styles.close_pop_btn} ref={closeBtnRef} onClick={closeBtnHandle}>-</div>
                        <textarea ref={textareaRef} className={styles.textarea_content}></textarea>
                    </div>
                    <div className={styles.chat_btn}>
                        <div className={styles.submit_msg} onClick={sendMsgHandle}>回复</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
