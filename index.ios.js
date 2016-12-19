/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React from "react";
import {AppRegistry, Navigator, StyleSheet, View, Text} from "react-native";
import App from "./App/Views/App";
import {CustomTabbar} from "./App/Views/CustomTabbar";
//iOS和安卓通用的ViewPager/Tabbar
import ScrollableTabView, {DefaultTabBar} from "react-native-scrollable-tab-view";

class news extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //设置Tabbar的标题与图标
            tabNames: ['新闻', '阅读', '视听', '发现', '我'],
            //这个地方只能以模块的形式传递图片，主要是因为babel在做语法转换的时候需要知道路径，详情参见：https://segmentfault.com/q/1010000006104180
            tabIconNames: [
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
            ],
        }
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
                            return <Component {...route.params} navigator={navigator} />
                        }}
            />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollableTabView
                    onChangeTab={(lb)=>{
                      }
                    }
                    scrollWithoutAnimation={true}
                    tabBarPosition={'bottom'}
                    renderTabBar={() =>
                        <CustomTabbar tabNames={this.state.tabNames} tabIconNames={this.state.tabIconNames}/>
                    }>
                    {this.renderMainPage()}
                    <View style={styles.content} tabLabel='key2'>
                        <Text>#2</Text>
                    </View>
                    <View style={styles.content} tabLabel='key3'>
                        <Text>#3</Text>
                    </View>
                    <View style={styles.content} tabLabel='key4'>
                        <Text>#4</Text>
                    </View>
                    <View style={styles.content} tabLabel='key5'>
                        <Text>#5</Text>
                    </View>
                </ScrollableTabView>
            </View>
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