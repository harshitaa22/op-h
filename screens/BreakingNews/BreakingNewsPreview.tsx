import React from 'react'
import { SafeAreaView, View, } from 'react-native'
import BreakingNewsController from './BreakingNewsController'
//components
import HeaderComponent from '../../../../../components/src/HeaderComponent'
//library
import { WebView } from 'react-native-webview';

export default class BreakingNewsPreview extends BreakingNewsController {
  // Customizable Area Start
  render() {
    return (
      <View style={{ flex: 1, }}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Customizable Area Start */}
          <HeaderComponent isBack={true} showIcon={true} title={this?.props?.route?.params?.header} onClose={() => { this.goBack() }} />
          <WebView
            ref="webview"
            source={{ uri: this.props.route.params.url }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
          />
        </SafeAreaView>
        {/* Customizable Area End */}
      </View>
    )
  }
}
// Customizable Area End