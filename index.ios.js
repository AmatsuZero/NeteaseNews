/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React from "react";
import {AppRegistry, Navigator, StyleSheet, View, Text, DeviceEventEmitter} from "react-native";
import App from "./App/Views/App";
import {CustomTabbar} from "./App/Views/CustomTabbar";
//iOS和安卓通用的ViewPager/Tabbar
import ScrollableTabView, {DefaultTabBar} from "react-native-scrollable-tab-view";

const icons = [
    [require('./App/Img/tabbar_icon_news_normal@2x.png'),
        require('./App/Img/tabbar_icon_news_highlight@2x.png')],
    [require('./App/Img/tabbar_icon_reader_normal@2x.png'),
        require('./App/Img/tabbar_icon_reader_highlight@2x.png')],
    [require('./App/Img/tabbar_icon_media_normal@2x.png'),
        require('./App/Img/tabbar_icon_media_highlight@2x.png')],
    [require('./App/Img/tabbar_icon_found_normal@2x.png'),
        require('./App/Img/tabbar_icon_found_highlight@2x.png')],
    [require('./App/Img/tabbar_icon_me_normal@2x.png'),
        require('./App/Img/tabbar_icon_me_highlight@2x.png')]
];

import ControlPanel from './App/Views/DrawerContent'
import Drawer from 'react-native-drawer'
import VideoPage from './App/Views/VideoPage'

class news extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //设置Tabbar的标题与图标
            tabNames: ['新闻', '阅读', '视听', '发现', '我'],
            //这个地方只能以模块的形式传递图片，主要是因为babel在做语法转换的时候需要知道路径，详情参见：https://segmentfault.com/q/1010000006104180
            tabIconNames: icons,
            isTabbarVisible: true
        }
    }

    componentDidMount() {
        DeviceEventEmitter.addListener('showTabbar', (flag) => {
            this.setState({
                isTabbarVisible: flag
            })
        });
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners('showTabbar');
    }

    //主页
    renderMainPage() {
        const mainPageName = '首页';
        const mainPageComponent = App;
        return (
            <Navigator
                tabLabel={'key1'}
                initialRoute={{name:mainPageName,component:mainPageComponent}}
                configureScene={(route) => {
                            return Navigator.SceneConfigs.PushFromRight;
                        }}
                renderScene={(route, navigator) => {
                            let Component = route.component;
                            return <Component {...route.params} navigator={navigator} drawerControl={()=>{this.drawer.open()}}/>
                }}
            />
        );
    }

    //视频页面
    renderVideoPage(){
        const videoPage = '视频';
        const videoPageComponent = VideoPage;
        return (
            <Navigator
                tabLabel={'key3'}
                initialRoute={{name:videoPage,component:videoPageComponent}}
                configureScene={(route) => {
                            return Navigator.SceneConfigs.PushFromRight;
                        }}
                renderScene={(route, navigator) => {
                            let Component = route.component;
                            return <Component {...route.params} navigator={navigator} drawerControl={()=>{this.drawer.open()}}/>
                }}
            />
        );
    }

    render() {
        return (
            <Drawer
                ref={c => this.drawer = c}
                type="overlay"
                content={<ControlPanel
                    closeDrawer={() => {
                      this.drawer.close();
                   }}
                />}
                tapToClose={true}
                openDrawerOffset={0.2} // 20% gap on the right side of drawer
                panCloseMask={0.2}
                closedDrawerOffset={-3}
                styles={{shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3}}
                tweenHandler={(ratio) => ({
                main: { opacity:(2-ratio)/2 }
            })}
            >
            <View style={styles.container}>
                <ScrollableTabView
                    locked={true}//禁止tabbar滚动
                    scrollWithoutAnimation={true}
                    tabBarPosition={'bottom'}
                    renderTabBar={() =>
                        <CustomTabbar visible={this.state.isTabbarVisible} tabNames={this.state.tabNames} tabIconNames={this.state.tabIconNames}/>
                    }>
                    {this.renderMainPage()}
                    <View style={styles.content} tabLabel='key2'>
                        <Text>#2</Text>
                    </View>
                    {this.renderVideoPage()}
                    <View style={styles.content} tabLabel='key4'>
                        <Text>#4</Text>
                    </View>
                    <View style={styles.content} tabLabel='key5'>
                        <Text>#5</Text>
                    </View>
                </ScrollableTabView>
            </View>
            </Drawer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EBEBEB',
        flex: 1
    }
});

AppRegistry.registerComponent('news', () => news);