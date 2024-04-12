import React from 'react'
import { FlatList, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import ChannelFinalCardController, { Props, configJSON } from './ChannelFinalCardController'
//components
import HeaderComponent from '../../../../../components/src/HeaderComponent';
import { Fonts } from '../../../../../components/src/Utils/Fonts';
import ConformationModal from '../Components/ConformationModal';
//framework
import { scaledSize, widthFromPercentage } from '../../../../../framework/src/Utilities';
//colors
import colors from '../../../../CustomisableUserProfiles/src/colors';
//library
import Toast from 'react-native-toast-message'

export default class ChannelFinalCard extends ChannelFinalCardController {
  constructor(props: Props) {
    super(props);
  }

  // Customizable Area Start
  _renderForHorizon = (item: any, index: number, type: any) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (type == this.timeHorizon) {
            this.setState({ selectedTimeHorizon: index, time_period: item.name })
          }
          else {
            this.setState({ selectedUpside: index, sentiment: item.name })
          }
        }}
        style={styles.viewContainer}>
        <View style={styles.radio_container}>
          <View
            style={
              type == this.timeHorizon ?
                this.state.selectedTimeHorizon == index
                  ? styles.selected_radio
                  : styles.unselected_radio :
                this.state.selectedUpside == index
                  ? styles.selected_radio
                  : styles.unselected_radio}
          />
        </View>
        <Text style={{ marginLeft: scaledSize(10) }}>{item.name}</Text>
      </TouchableOpacity>
    )
  }
  // Customizable Area End
  render() {
    if (this.state.cardCreateError != '') {
      const erroMessage = this.state.cardCreateError;
      this.setState({ cardCreateError: "" }, () => {
        Toast.show({
          type: 'success',
          text1: erroMessage,
        });
      })
    }
    console.log("this.state.prevData", this.state.prevData?.price_movement);

    return (
      <View style={{ flex: 1, backgroundColor: colors.offWhite, }}>
        {/* Customizable Area Start */}
        <SafeAreaView />
        <HeaderComponent isBack={true} title={configJSON.header} onClose={() => { this.goBack() }} />
        {this.state.isLoadingData || this.state.isLoadingPotential ? <ActivityIndicator style={{ flex: 1 }} color={colors.blue} size='large' /> :
          <ScrollView showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <View style={styles.container}>
              <Text style={[styles.text, styles.fontFamilyMedium]}>{configJSON.durationText}</Text>
              <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
                data={this.state.timeHorizon}
                renderItem={({ item, index }) =>
                  this._renderForHorizon(item, index, this.timeHorizon)} />
              <Text style={[styles.text, styles.fontFamilyMedium, { marginTop: scaledSize(10) }]}>{`${configJSON.potential} ${this.state.prevData?.price_movement == "Bullish" ? configJSON.upSide : configJSON.downSide}`}</Text>
              <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                data={this.state.prevData?.price_movement == "Bullish" ? this.state.upSides : this.state.downSides}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) =>
                  this._renderForHorizon(item, index, this.PotentialUpside)} />
            </View>
          </ScrollView>}
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => { this.goToPreView() }}
            style={[styles.button_container, { backgroundColor: colors.white }]}
          >
            <Text style={[styles.button_txt, { color: colors.blue }, styles.fontFamilyRegular]}>{configJSON.preview}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={this.state.isLoading}
            onPress={() => { this.setState({ visiblePopUp: true }) }}
            style={[styles.button_container, { marginLeft: scaledSize(10), marginRight: scaledSize(20) }]}
          >
            {<Text style={[styles.button_txt, styles.fontFamilyBold]}>{configJSON.post}</Text>}
          </TouchableOpacity>
          {/* <Text>{this.state.cardCreateError}</Text> */}
          <ConformationModal
            visible={this.state.visiblePopUp}
            title={configJSON.modalTitle}
            onCancel={() => { this.setState({ visiblePopUp: false }) }}
            onPress={() => {
              this.postCard()
            }}
            isLoading={this.state.isLoading}
          />
        </View>
        {/* Customizable Area End */}
      </View>
    )
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  fontFamilyRegular: {
    fontFamily: Fonts.REGULAR,
  },
  fontFamilyBold: {
    fontFamily: Fonts.LIGHT_BOLD,
  },
  fontFamilyMedium: {
    fontFamily: Fonts.MEDIUM,
  },
  container: {
    paddingHorizontal: scaledSize(20),
    marginTop: scaledSize(20),
    marginBottom: scaledSize(10)
  },
  viewContainer: {
    backgroundColor: colors.white,
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: scaledSize(15),
    borderRadius: scaledSize(15),
    marginBottom: scaledSize(10)
  },
  text: {
    marginBottom: scaledSize(15),
  },
  selected_radio: {
    width: widthFromPercentage(3),
    height: widthFromPercentage(3),
    borderRadius: scaledSize(360),
    backgroundColor: colors.blue,
  },
  unselected_radio: {
    width: widthFromPercentage(3),
    height: widthFromPercentage(3),
    borderRadius: scaledSize(360),
    backgroundColor: colors.input_container,
  },
  radio_container: {
    width: widthFromPercentage(5),
    height: widthFromPercentage(5),
    backgroundColor: colors.input_container,
    borderRadius: scaledSize(360),
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: scaledSize(5)
  },
  button_container: {
    padding: scaledSize(17),
    flex: 1,
    marginLeft: scaledSize(20),
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
// Customizable Area End