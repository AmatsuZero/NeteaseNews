/**
 * Created by jiangzhenhua on 2017/1/6.
 */
import React, { Component } from 'react';
import {
    SwitchIOS,
    View,
    Text,
    StyleSheet,
    PixelRatio,
    Platform,
    Alert,
    Linking
} from 'react-native';

//热更新部分
import {
    isFirstTime,
    isRolledBack,
    packageVersion,
    currentVersion,
    checkUpdate,
    downloadUpdate,
    switchVersion,
    switchVersionLater,
    markSuccess,
} from 'react-native-update';
import _updateConfig from '../../update.json';
const {appKey} = _updateConfig[Platform.OS];

import Button from '../Component/Button'

export default class ControlPanel extends Component {

    componentWillMount(){
        //HotUpdate setting
        if (isFirstTime) {
            Alert.alert('提示', '这是当前版本第一次启动,是否要模拟启动失败?失败将回滚到上一版本', [
                {text: '是', onPress: ()=>{throw new Error('模拟启动失败,请重启应用')}},
                {text: '否', onPress: ()=>{markSuccess()}},
            ]);
        } else if (isRolledBack) {
            Alert.alert('提示', '刚刚更新失败了,版本被回滚.');
        }
    }

    doUpdate(info){
        downloadUpdate(info).then(hash => {
            Alert.alert('提示', '下载完毕,是否重启应用?', [
                {text: '是', onPress: ()=>{switchVersion(hash);}},
                {text: '否',},
                {text: '下次启动时', onPress: ()=>{switchVersionLater(hash);}},
            ]);
        }).catch(err => {
            Alert.alert('提示', '更新失败.');
        });
    }

    checkUpdate(){
        checkUpdate(appKey).then(info => {
            if (info.expired) {
                Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
                    {text: '确定', onPress: ()=>{info.downloadUrl && Linking.openURL(info.downloadUrl)}},
                ]);
            } else if (info.upToDate) {
                Alert.alert('提示', '您的应用版本已是最新.');
            } else {
                Alert.alert('提示', '检查到新的版本'+info.name+',是否下载?\n'+ info.description, [
                    {text: '是', onPress: ()=>{this.doUpdate(info)}},
                    {text: '否',},
                ]);
            }
        }).catch(err => {
            Alert.alert('提示', '更新失败.');
        });
    }

    render() {
        return (
            <View style={styles.controlPanel}>
                <Text style={styles.controlPanelWelcome}>
                    检查更新
                </Text>
                <Text style={{
                    textAlign: 'left',
                    color: '#333333',
                    marginBottom: 5,
                }}>
                    这是版本一 {'\n'}
                    当前包版本号: {packageVersion}{'\n'}
                    当前版本Hash: {currentVersion||'(空)'}{'\n'}
                </Text>
                <Button
                    style={{marginBottom:10}}
                    onPress={() => {
                        this.checkUpdate();
                    }}
                    text="点击这里检查更新"
                />
                <Button
                    onPress={() => {
                        this.props.closeDrawer();
                    }}
                    text="  隐  藏  面  板  "
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#B99BC4',
    },
    container: {
        flex: 1,
        backgroundColor: '#C5B9C9',
    },
    controlPanel: {
        flex: 1,
        backgroundColor:'#F5FCFF',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    controlPanelText: {
        color:'white',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 25,
    },
    controlPanelWelcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color:'white',
        fontWeight:'bold',
    },
    categoryLabel: {
        fontSize: 15,
        textAlign: 'left',
        left: 10,
        padding:10,
        fontWeight:'bold',
    },
    row: {
        flexDirection: 'row',
        backgroundColor:'white',
        borderRadius: 0,
        borderWidth: 0,
        borderTopWidth: 1 / PixelRatio.get(),
        borderColor: '#d6d7da',
        padding:10,
        alignItems: 'center'
    },
    lastRow: {
        flexDirection: 'row',
        backgroundColor:'white',
        borderRadius: 0,
        borderWidth: 0,
        borderTopWidth: 1 / PixelRatio.get(),
        borderBottomWidth: 1 / PixelRatio.get(),
        borderColor: '#d6d7da',
        padding:10,
        alignItems: 'center'
    },
    rowLabel: {
        left:10,
        fontSize:15,
        flex:1,
    },
    rowInput: {
        right:10,
    },
    sliderMetric: {
        right:10,
        width:30,
    },
    slider: {
        width: 150,
        height: 30,
        margin: 10,
    },
    picker: {
        backgroundColor:'white',
        borderRadius: 0,
        borderWidth: 0,
        padding:0,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderTopWidth: 1 / PixelRatio.get(),
        borderColor: '#d6d7da',
    },
    label: {
        fontSize: 20,
        textAlign: 'left',
        margin: 0,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});