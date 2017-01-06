/**
 * Created by jiangzhenhua on 2017/1/6.
 */
import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    PixelRatio
} from 'react-native';

export default class Button extends Component {
    render() {
        return(
            <TouchableHighlight
                style={{
                    backgroundColor: 'white',
                    padding: 15,
                    borderColor: '#eeeeee',
                    borderWidth:1,
                    borderBottomWidth: 1 / PixelRatio.get(),
                    borderBottomColor: '#aaaaaa',
                    marginRight:20,
                    marginLeft:20,
                    alignSelf: 'center',
                }}
                underlayColor="#B5B5B5"
                onPress={() => {
                    this.props.onPress();
                }}>
                <Text style={{
                    fontSize:14
                }}>{this.props.text}</Text>
            </TouchableHighlight>
        )
    }
}