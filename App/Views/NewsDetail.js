/**
 * Created by 振华 on 2016/12/17.
 */
import React from "react";
import {View, Navigator, TouchableOpacity, Text, WebView, StyleSheet} from "react-native";

export default class NewsDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            url: "https://www.baidu.com"
        };
    }

    componentDidMount() {

        this.setState({
            url: this.props.url
        });
    }

    shouldComponentUpdate() {
        return true;
    }


    _pressButton() {
        const { navigator } = this.props;
        if(navigator) {
            //很熟悉吧，入栈出栈~ 把当前的页面pop掉，这里就返回到列表了
            navigator.pop();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <WebView
                    automaticallyAdjustContentInsets={false}
                    style={styles.webView}
                    source={{uri: this.state.url}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                    onNavigationStateChange={()=>{

                    }}
                    startInLoadingState={true}

                />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    webView: {
        height: 350,
    },
});