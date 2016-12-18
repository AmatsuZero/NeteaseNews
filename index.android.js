import React from "react";
import {
    AppRegistry,
    Navigator
} from 'react-native';
import App from "./App/Views/App"

class news extends React.Component {

    render(){
        let mainPageName = '首页';
        let mainPageComponent = App;
        return(
            <Navigator
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
}

AppRegistry.registerComponent('news', () => news);