import React from 'react'
import { SafeAreaView, Text, View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import HeaderComponent from '../../../../../components/src/HeaderComponent'
import PollsCardHeader from '../../../../../components/src/PollsCardHeader'
import CustomPollPreviewController, { configJSON } from './CustomPollPreviewController'
import { scaledSize } from '../../../../../framework/src/Utilities'
import { Fonts } from '../../../../../components/src/Utils/Fonts'
import colors from '../../colors'

export class CustomPollPreview extends CustomPollPreviewController {
  // Customizable Area Start
  _render2Stock = (item: any, index: number) => {
    return <View style={[styles.listElement, {}]}>
      <Text numberOfLines={1} style={[styles.fontFamilyBold,]}>{item.input}</Text>
    </View>
  }
  // Customizable Area End
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        {/* Customizable Area Start */}
        <View style={{ flex: 1 }}>
          <SafeAreaView />
          <HeaderComponent title={configJSON.previewHeader} isBack={true} onClose={() => { this.props.navigation.goBack() }} />
          <View style={[styles.container,]}>
            <View style={{ minHeight: 50, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
              <PollsCardHeader
                opigo_score={this.state.userData?.attributes?.opigo_score}
                profile={this.state.userData?.attributes.profile}
                userName={this.state.userData?.attributes.first_name + " " + this.state.userData?.attributes.last_name}
                item={this.state.userData} self={true} />
            </View>

            <View style={{ paddingLeft: scaledSize(25), paddingVertical: scaledSize(10) }}>
              <Text numberOfLines={3} style={styles.fontFamilyMedium}>{this.state.question}</Text>
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              bounces={false}
              data={this.state.options}
              renderItem={({ item, index }) => this._render2Stock(item, index)}
              keyExtractor={(item, index) => index.toString()}
            />

          </View>

        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: scaledSize(20) }}>
          <TouchableOpacity
            disabled={this.state.isPosting}
            onPress={() => { this.goBack() }}
            style={[styles.button_container, { marginRight: scaledSize(10), backgroundColor: colors.white }]}
          >
            {<Text style={[styles.button_txt, styles.fontFamilyRegular, { color: colors.blue }]}>{configJSON.back}</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            disabled={this.state.isPosting}
            onPress={() => { this.postPoll() }}
            style={[styles.button_container]}
          >
            {this.state.isPosting ? <ActivityIndicator color={colors.white} /> : <Text style={[styles.button_txt, styles.fontFamilyBold]}>{configJSON.post}</Text>}
          </TouchableOpacity>
        </View>
        {/* Customizable Area End */}
      </View>
    )
  }
}
// Customizable Area Start
const styles = StyleSheet.create({
  fontFamilyRegular: {
    fontFamily: Fonts.REGULAR
  },
  fontFamilyBold: {
    fontFamily: Fonts.LIGHT_BOLD
  },
  fontFamilyMedium: {
    fontFamily: Fonts.MEDIUM
  },
  viewContainer: {
    paddingHorizontal: scaledSize(20),
    paddingTop: scaledSize(10),
  },
  container: {
    marginHorizontal: scaledSize(19),
    backgroundColor: colors.white,
    paddingVertical: scaledSize(10),
    borderRadius: scaledSize(15),
    marginTop: scaledSize(10),
    marginBottom: scaledSize(15),

  },
  listElement: {
    backgroundColor: "rgb(239,241,243)",
    minHeight: scaledSize(40),
    borderRadius: scaledSize(10),
    marginBottom: scaledSize(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scaledSize(20),
    paddingHorizontal: scaledSize(10)
  },
  twoStock: {
    paddingVertical: scaledSize(5),
    paddingLeft: scaledSize(15),
    paddingRight: scaledSize(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: scaledSize(50)
  },
  liveContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 0.3,
    borderRadius: 100,
    marginTop: scaledSize(3),
    marginBottom: scaledSize(3),
    width: scaledSize(40),
    paddingVertical: scaledSize(1),
    alignSelf: 'flex-end'
  },
  reddot: {
    height: scaledSize(4),
    width: scaledSize(4),
    backgroundColor: 'red',
    borderRadius: 100,
    marginRight: scaledSize(5)
  },
  button_container: {
    padding: scaledSize(17),
    flex: 1,
    backgroundColor: colors.blue,
    borderRadius: scaledSize(10),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: 'center',
    marginBottom: scaledSize(20)
  },
  button_txt: {
    color: colors.white,
    fontSize: scaledSize(15),

  },

})

export default CustomPollPreview
// Customizable Area End
