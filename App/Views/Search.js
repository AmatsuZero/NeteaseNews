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
        };;;;;;;;;;;;;;;

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
        let input = title;
        let myRe = /<em>[\s\S]*?<\/em>/gi;
        let myArray = input.match(myRe);
        try {
            for (let wrappedTxt of myArray) {
                let unwrapped = wrappedTxt.replace('<em>', '');
                unwrapped = unwrapped.replace('</em>', '');
                unwrapped.fontcolor('green');
                input = input.replace(wrappedTxt, unwrapped)
            }
        } catch (e) {
            console.log(e.toString())
        } finally {
            return input;
        }
    }

    onPressWord(url) {

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