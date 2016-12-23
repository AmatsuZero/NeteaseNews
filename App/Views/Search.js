/**
 * Created by jiangzhenhua on 2016/12/22.
 */
import React from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    InteractionManager,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Dimensions,
    Navigator,
    TextInput,
    Platform,
    DeviceEventEmitter,
    ListView,
    RecyclerViewBackedScrollView,
    WebView
} from "react-native";
import {Navibarheight, DefaultTimeout} from "../Model/Constants";
import LoadingView from "../Component/LoadingView";
import {toastShort} from "../Util/ToastUtil";
import {base64encode} from "../Util/Base64Tool";
import {parseJSON, cancellableFetch} from "../Util/NetworkUtil";
import NewsDetail from "./NewsDetail";

export default class Search extends React.Component {

    constructor(props) {

        super(props);

        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });

        this.state = {
            hotwords: null,
            searchTxt: '',
            isResultList: false,
            dataSource: ds
        };

        this.renderItem = this.renderItem.bind(this)
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                hotwords: this.props.hotwords["hotWordList"]
            });
        });
    }

    searchForNews(key) {
        InteractionManager.runAfterInteractions(() => {
            this.searcchForKeyWord(key).then((data) => {
                this.setState({
                    searchTxt: key,
                    isResultList: true,
                    dataSource: this.state.dataSource.cloneWithRows(data)
                })
            }).catch((e) => {
                toastShort(e.toString());
                this.setState({
                    searchTxt: key,
                    isResultList: true,
                    dataSource: this.state.dataSource.cloneWithRows([])
                })
            });
        })
    }

    //返回
    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            DeviceEventEmitter.emit('showTabbar', true);
            navigator.pop();
        }
    }

    renderNaivBar() {
        return (
            <View style={styles.navibar}>
                <TextInput
                    autoCapitalize="none"
                    style={styles.inputStyle}
                    onChangeText={(text)=>{this.setState({searchTxt:text})}}
                    onSubmitEditing={(event)=>this.searchForNews(event.nativeEvent.text)}
                    returnKeyType='search'
                    placeholder='搜索'
                    placeholderTextColor='gray'
                    clearButtonMode="unless-editing"
                    enablesReturnKeyAutomatically={true}
                    value={this.state.searchTxt}
                />
                <TouchableWithoutFeedback onPress={()=>this.goBack()}>
                    <View style={{marginHorizontal:10, marginTop:5}}>
                        <Text style={{fontSize:15, color:'#004BF6'}}>
                            取消
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>);
    }

    renderCenter() {
        return (
            <View style={{flexDirection:'column'}}>
                <View style={styles.header}>
                    <Text style={{fontSize:14, color:'gray'}}>
                        阅读历史
                    </Text>
                    <Text style={{fontSize:15, color:'#004BF6'}}>
                        更多
                    </Text>
                </View>
                <Text style={{fontSize:16, marginLeft:25, marginTop:10, marginBottom:5}}>
                    王健林唱摇滚受捧，思聪赶快签约
                </Text>
                <Text style={{fontSize:16, marginLeft:25}}>
                    没设置登录并不能看到阅读历史啊
                </Text>
            </View>
        );
    }

    searcchForKeyWord(keyword) {

        //关于Base64转换的问题: RN不支持浏览器都支持的atob、btoa函数，NodeJS的Buffer在这里也无法使用, 只好自己实现base64代码
        let URL = "http://c.3g.163.com/search/comp/MA==/20/" + base64encode(keyword) + ".html";

        return cancellableFetch(fetch(encodeURI(URL), {
            method: 'GET',
        }), DefaultTimeout)
            .then((response) => {
                if (response.ok) {
                    return parseJSON(response);
                } else {
                    throw "请求失败！"
                }
            })
            .then((responseData) => {
                if (Object.keys(responseData).length === 0) {//返回数据为空
                    throw "返回数据为空！";
                } else {
                    return responseData["doc"]["result"];
                }
            })
    }

    _onHotkeyPressed(key) {
        this.searchForNews(key);
    }

    renderHotWords() {
        let hotwords = [];
        for (let hotword of this.state.hotwords) {
            let view = (
                <TouchableWithoutFeedback key={hotword['hotWord']}
                                          onPress={()=>this._onHotkeyPressed(hotword['hotWord'])}>
                    <View style={styles.itemStyle}>
                        <Text style={{fontSize:15}}>
                            {hotword['hotWord']}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            );
            hotwords.push(view);
        }
        return hotwords;
    }

    renderText(title) {
        let result = [];
        let myRe = /<em>[\s\S]*?<\/em>/gi;
        let myArray = title.match(myRe);
        if (!(myArray instanceof Array)) return result;
        try {
            for (let i = 0; i < myArray.length; i++) {
                let text = myArray[i];
                let index = title.indexOf(text);
                let strLen = text.length;
                let unwrapped = text.replace('<em>', '');
                unwrapped = unwrapped.replace('</em>', '');
                if (i == 0) {//针对第一个元素，要检查前面有没有普通文本
                    if (index !== 0) {//说明前面有普通文本
                        let normal = title.substring(0, index);
                        if (normal.replace(/(^\s*)|(\s*$)/g, "").length !== 0) {//检查是不是空文本
                            result.push(<Text key={normal + i}>
                                {normal}
                            </Text>)
                        }
                    }
                    result.push(<Text key={text + i} style={{color:'red'}}>
                        {unwrapped}
                    </Text>)
                } else if (i == myArray.length - 1) {//最后一个元素，要跟整体长度相比较，看看后面有没有普通文本
                    result.push(<Text key={text + i} style={{color:'red'}}>
                        {unwrapped}
                    </Text>);
                    if (index + strLen < title.length) {//说明还有字符，而且是普通文本
                        let normal = title.substring(index + strLen);
                        if (normal.replace(/(^\s*)|(\s*$)/g, "").length !== 0) {//检查是不是空文本
                            result.push(<Text key={normal+i}>
                                {normal}
                            </Text>)
                        }
                    }
                } else {//中间的元素，都是前后两个元素的index相减，看看是否为0：如果为0，说明中间没有普通字符；如果不为零，说明有普通字符，需要先插入
                    let nextText = myArray[i + 1];
                    let nextIndex = title.indexOf(nextText);
                    if (nextText - index !== 0) {
                        let normal = title.substring(index + strLen, nextIndex);
                        if (normal.replace(/(^\s*)|(\s*$)/g, "").length !== 0) {//检查是不是空文本
                            result.push(<Text key={normal+i}>
                                {normal}
                            </Text>)
                        }
                    }
                    result.push(<Text key={text + i} style={{color:'red'}}>
                        {unwrapped}
                    </Text>)
                }
            }
        } catch (e) {
            console.log(e.toString());
        }

        return result;
    }

    onPressWord(key) {
        const {navigator} = this.props;
        //这里传递了navigator作为props
        if (key) {
            navigator.push({
                name: key.title,
                component: NewsDetail,
                params: {
                    docid: key.docid,
                }
            })
        }
    }

    renderItem(key) {
        return (
            <TouchableOpacity style={styles.cellStyle} onPress={()=>this.onPressWord(key)}>
                <View style={{marginLeft:15}}>
                    <Text style={{marginBottom:2}}>
                        {this.renderText(key.title)}
                    </Text>
                    <Text style={{fontSize:13, color:'gray'}}>
                        {key.ptime}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        let enterView = (
            <View>
                {this.renderCenter()}
                <View style={{flexDirection:'column'}}>
                    <View style={[styles.header,{marginBottom:5}]}>
                        <Text style={{fontSize:14, color:'gray'}}>
                            近期热点
                        </Text>
                    </View>
                    <View style={styles.hotWordsStyle}>
                        {this.state.hotwords ? this.renderHotWords() : <LoadingView/>}
                    </View>
                </View>
            </View>
        );

        let resultView = (
            <View>
                <ListView
                    style={{flex:0, flexGrow:1}}
                    initialListSize={1}
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderItem}
                    renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                />
            </View>
        );

        return (
            <View style={styles.container}>
                {this.renderNaivBar()}
                {this.state.isResultList ? resultView : enterView}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F6F6F6'
    },

    navibar: {
        height: Navibarheight,
        backgroundColor: '#EDEDED',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 10 : 0
    },

    inputStyle: {
        height: 28,
        borderWidth: 2,
        borderColor: 'gray',
        borderRadius: 15,
        flex: 1,
        fontSize: 13,
        padding: 4,
        marginTop: Platform.OS === 'ios' ? 10 : 0,
        marginLeft: 10
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderColor: 'gainsboro',
        alignItems: 'flex-end',
        paddingBottom: 5,
        marginHorizontal: 15,
        marginTop: 50
    },

    hotWordsStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
    },

    itemStyle: {
        flex: 0,
        borderRadius: 2,
        borderColor: "#DCDCDC",
        borderWidth: 0.5,
        marginHorizontal: 5,
        marginVertical: 5,
        padding: 8
    },

    cellStyle: {
        flexDirection: 'column',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: '#fcfcfc',
        padding: 8,
    }
});