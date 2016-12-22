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
    DeviceEventEmitter
} from "react-native";
import {Navibarheight} from "../Model/Constants";
import LoadingView from "../Component/LoadingView";

export default class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hotwords: null,
            searchTxt: '',
            isResultList: false
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                hotwords: this.props.hotwords["hotWordList"]
            });
        });
    }

    searchForNews(key) {
        console.log(key);
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
                    clearButtonMode="while-editing"
                    enablesReturnKeyAutomatically={true}
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

    _onHotkeyPressed(key) {
        this.setState({
            searchTxt: key,
            isResultList: true
        })
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
            <View style={{marginTop:60}}>
                <LoadingView/>
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
        borderWidth: 1,
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
        borderColor: 'gray',
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
        marginHorizontal: 10,
        marginVertical: 5,
        padding: 8
    }
});