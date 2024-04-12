import React from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { FlatList, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Dimensions, Platform, Keyboard, ActivityIndicator, } from 'react-native'
import OpiGoPollFinalController, { Props, configJSON } from './OpiGoPollFinalController'
//library
import Icon from 'react-native-vector-icons/MaterialIcons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import colors from '../../../../CustomisableUserProfiles/src/colors'
import { deviceHeight, scaledSize, widthFromPercentage } from '../../../../../framework/src/Utilities'
//components
import HeaderComponent from '../../../../../components/src/HeaderComponent'
import { Fonts } from '../../../../../components/src/Utils/Fonts'
import { listOfPollType } from '../../../../../components/src/Utils/service'
//assets
import { icons } from '../../assets'
import { searchIcon } from '../../../../postcreation/src/assets'

export default class OpiGoPollFinal extends OpiGoPollFinalController {
  constructor(props: Props) {
    super(props);
  }

  // Customizable Area Start
  _renderInstrument = (item: any, index: number) => {
    return (
      <View key={index} style={[{ backgroundColor: colors.white },
      this.state.searchedInstrument.length - 1 == index && { borderBottomLeftRadius: scaledSize(15), borderBottomRightRadius: scaledSize(15), paddingBottom: scaledSize(5) }]}>
        <TouchableOpacity
          style={[{ paddingHorizontal: scaledSize(20), paddingVertical: scaledSize(10), },
          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
          index == 0 && { paddingTop: scaledSize(25) },
          ]}
          onPress={() => {
            this.setState({ expandInstrument: false, selectedInstrument: item, searchedText: item?.name, searchedPrice: item?.market_cap })
            this.getLivePrice(item?.stock_company_id)
          }}>
          <Text numberOfLines={2} style={{ fontSize: scaledSize(12), flex: 1, marginRight: 10 }}>{`${item?.name} (${item?.symbol})`}</Text>
          {<Text style={{ alignSelf: 'center', fontSize: 12, fontFamily: Fonts.LIGHT_BOLD }}>{item.exchange}</Text>}
        </TouchableOpacity>
        {this.state.searchedInstrument.length - 1 != index && <View style={styles.bottomLine} />}
      </View>
    )
  }

  _renderForHorizon = (item: any, index: number, type: any) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.8}
        onPress={() => {
          this.setState({ selectedTimeHorizon: index })
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
        <Text style={[styles.fontFamilyRegular, { marginLeft: scaledSize(10) }]}>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  _renderType = (item: any, index: number) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={1}
        style={[styles.expanded_list,
        { backgroundColor: 'rgb(247,248,250)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        index == 0 && { paddingTop: scaledSize(25) },
        this.listOfInvestmentType.length - 1 == index && { borderBottomLeftRadius: scaledSize(15), borderBottomRightRadius: scaledSize(15) },
        this.state.heighLightedInvestment == index && { backgroundColor: colors.blue }
        ]}
        onLongPress={() => { this.setState({ heighLightedInvestment: index }) }}
        onPress={() => {
          this.setState({ selectedType: item, isExpandMore: false, heighLightedInvestment: -1, showErrorInAvg: false })
        }}>
        <Text style={[styles.fontFamilyRegular, { fontSize: scaledSize(12) }, this.state.heighLightedInvestment == index && { color: colors.white }]}>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  _renderPollType = (item: any, index: number) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.8}
        onPress={() => { this.setState({ typeForMultipleStock: item }) }}
        style={styles.viewContainer}>
        <View style={styles.radio_container}>
          <View
            style={
              this.state.typeForMultipleStock.key == item.key
                ? styles.selected_radio
                : styles.unselected_radio}
          />
        </View>
        <Text style={[styles.fontFamilyRegular, { marginLeft: scaledSize(10) }]}>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  _renderStock = (item: any, index: number) => {
    return (
      <View key={index} style={[{ backgroundColor: colors.white, zIndex: 111, },
      this.state.searchedInstrument.length - 1 == index && { paddingBottom: scaledSize(5) }]}>
        <TouchableOpacity
          style={[styles.expanded_list,
          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', },
          index == 0 && { paddingTop: scaledSize(25) },
          ]}
          onPress={() => {
            this.setState({ isExpandMore: false })
            this.setState({ selectedStockName: item.name, selectedInstrument: item })
            this.manageMultipleStock(item, this.state.selectedIndex)
            this.getLivePrice(item?.stock_company_id)

          }}>
          <Text numberOfLines={2} style={[styles.fontFamilyRegular, { fontSize: scaledSize(12), flex: 1, marginRight: 10 }]}>{`${item?.name} (${item?.symbol})`}</Text>
          {<Text style={{ alignSelf: 'center', fontSize: 12, fontFamily: Fonts.LIGHT_BOLD }}>{item.exchange}</Text>}
        </TouchableOpacity>
        {this.state.searchedInstrument.length - 1 != index && <View style={styles.bottomLine} />}
      </View>
    )
  }
  // Customizable Area End
  render() {
    return (
      <TouchableWithoutFeedback onPress={() => { this.setState({ isExpandMore: false }) }}>
        <View style={{ flex: 1, minHeight: deviceHeight }}>
          {/* Customizable Area Start */}
          <SafeAreaView />
          <HeaderComponent isBack={false} title={configJSON.header} onClose={() => {
            this.goBack()
          }} />
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            extraScrollHeight={scaledSize(100)}
            keyboardShouldPersistTaps='handled'
            nestedScrollEnabled>
            <View style={styles.container}>
              {this.state.pollType?.key == listOfPollType[0].key &&
                <>
                  {
                    this.state.isLoaderVisible ?
                      null :
                      <View>
                        <View style={[styles.textContainer, { borderColor: 'red', borderWidth: this.state.showError ? 1 : 0 }]}>
                          <TextInput
                            onFocus={() => {
                              if (Platform.OS === 'android') {
                                this.setState({ selection: null });
                              }
                              this.setState({ isExpandMore: false })
                            }}
                            onBlur={() => {
                              if (Platform.OS === 'android') {
                                this.setState({ selection: { start: 0, end: 0 } });
                              }
                            }}
                            ref={(ref: any) => this.refs = ref}
                            selection={this.state.selection}
                            value={this.state.searchedText}
                            onChangeText={(text: any) => {
                              this.onSearch(text)
                            }}
                            style={{ flex: 1, height: scaledSize(40) }}
                            placeholder={`Search ${this.props.route.params.data.category.name == 'stocks' ? 'stock' : this.props.route.params.data.category.name}`} />
                          <Text style={[{ alignSelf: 'center', marginHorizontal: scaledSize(4), fontSize: scaledSize(12) }, styles.fontFamilyMedium]}>{this.state.searchedPrice != null && Number(this.state.searchedPrice).toFixed(2)}</Text>
                          <Image
                            source={searchIcon}
                            resizeMode='contain'
                            style={{ height: scaledSize(20), width: scaledSize(20) }}
                          />
                        </View>

                        {(this.state.expandInstrument && this.state.searchedInstrument?.length > 0) &&
                          <View style={{ top: scaledSize(40), position: 'absolute', width: '100%', maxHeight: scaledSize(150), overflow: 'hidden', borderBottomLeftRadius: scaledSize(10), borderBottomRightRadius: scaledSize(10) }}>
                            <FlatList
                              showsVerticalScrollIndicator={false}
                              showsHorizontalScrollIndicator={false}
                              bounces={false}
                              ListEmptyComponent={() => {
                                return (
                                  this.state.isStockLoading ? <View style={{ paddingVertical: scaledSize(20), backgroundColor: colors.white }}>
                                    <ActivityIndicator color={colors.blue} />
                                  </View>
                                    : null
                                )
                              }}
                              keyboardShouldPersistTaps='always'
                              data={this.state.searchedInstrument} renderItem={({ item, index }) => this._renderInstrument(item, index)}
                              keyExtractor={(item, index) => index.toString()} />
                          </View>
                        }
                      </View>
                  }
                </>
              }

              <View style={[{ marginTop: scaledSize(20), }, Platform.OS == 'ios' && { zIndex: -1 }]}>
                <Text style={[{ zIndex: -1 }, styles.fontFamilyRegular]}>{`Select ${this.state.pollType.key == listOfPollType[0].key ? "Investment" : this.state.pollType.key == listOfPollType[1].key ? "Question" : "Rank"} Type`}</Text>
                {this.state.pollType.key == listOfPollType[0].key ?
                  <View>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[styles.catogary, { zIndex: -1 }]}
                      onPress={() => {
                        this.setState({ isExpandMore: !this.state.isExpandMore, heighLightedInvestment: -1, expandInstrument: false })
                      }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                        <Text style={[styles.fontFamilyRegular, { alignSelf: 'center' }]}>
                          {this.state.selectedType.name}
                        </Text>
                        <Icon
                          name={this.state.isExpandMore ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                          size={scaledSize(25)} style={{ opacity: 0.5 }} />
                      </View>
                    </TouchableOpacity>
                    {this.state.isExpandMore && <FlatList
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      style={{ position: 'absolute', top: scaledSize(50), zIndex: -2, elevation: 0 }}
                      data={this.listOfInvestmentType}
                      renderItem={({ item, index }) => this._renderType(item, index)}
                      keyExtractor={(item, index) => index.toString()}
                    />}
                  </View> :
                  this.state.pollType.key == listOfPollType[1].key ?
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      style={{ marginTop: scaledSize(10), }}
                      data={[
                        { name: `Which ${this.props.route.params.data.category.name == 'stocks' ? 'stock' : this.props.route.params.data.category.name} is more bullish?`, key: 'Bullish' },
                        { name: `Which ${this.props.route.params.data.category.name == 'stocks' ? 'stock' : this.props.route.params.data.category.name} is more bearish?`, key: 'Bearish' }]}
                      renderItem={({ item, index }: { item: any, index: any }) => this._renderPollType(item, index)}
                      keyExtractor={(item, index) => index.toString()}
                    /> :
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      style={{ marginTop: scaledSize(10) }}
                      data={this.compareMultipleStock}
                      renderItem={({ item, index }: { item: any, index: any }) => this._renderPollType(item, index)}
                      keyExtractor={(item, index) => index.toString()}
                    />
                }
              </View>
              {this.state.selectedType.name != "New Investment" && this.state.pollType.key == listOfPollType[0].key
                &&
                <TextInput
                  onChangeText={(text: any) => {

                    if (!isNaN(text)) {
                      let lastWord = text[text.length - 1]
                      if (lastWord == " ") {
                        let temp = text.replace(lastWord, "")
                        this.setState({ avgHoldingPrice: temp })
                      }
                      else {
                        this.setState({ avgHoldingPrice: text })
                      }
                    }
                  }}
                  value={this.state.avgHoldingPrice}
                  keyboardType='number-pad'
                  placeholder={configJSON.costPrice}
                  maxLength={12}
                  onFocus={() => { this.setState({ showErrorInAvg: false }) }}
                  style={[styles.textContainer, { marginBottom: 0, marginTop: scaledSize(10), zIndex: -100, elevation: 0, }, this.state.showErrorInAvg && { borderColor: 'red', borderWidth: 1 }]} />}
              {this.state.pollType.key == listOfPollType[0].key &&
                <View style={{ marginTop: scaledSize(15), zIndex: -3, elevation: -1 }}>
                  <Text style={[{ marginBottom: scaledSize(10) }, styles.fontFamilyRegular]}>{configJSON.typesTitle}</Text>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => { }}
                    style={[styles.viewContainer, { marginBottom: 0 }]}>
                    <View style={styles.radio_container}>
                      <View style={this.state.voteOption ? styles.selected_radio : styles.unselected_radio} />
                    </View>
                    <Text style={[styles.fontFamilyRegular, { marginLeft: scaledSize(10) }]}>{configJSON.types}</Text>
                  </TouchableOpacity>
                </View>}
              {this.state.pollType.key != listOfPollType[0].key &&
                <>
                  {this.state.compareStock.map((item: any, index: number) => {
                    let placeholder
                    let name = this.props.route.params.data.category.name
                    if (this.state.pollType.key == listOfPollType[1].key) {
                      if (index == 0) {
                        placeholder = `Select first ${name == 'stocks' ? 'stock' : name}`
                      } else if (index == 1) {
                        placeholder = `Select second ${name == 'stocks' ? 'stock' : name}`
                      }
                    }
                    else {
                      placeholder = `Select ${name == 'stocks' ? 'stock' : name}`
                    }
                    return (
                      <View key={index} style={[Platform.OS == 'ios' && { zIndex: this.state.compareStock.length - 1 == this.state.selectedIndex ? 10 : -2 * index }]}>

                        <View style={[styles.catogary, { zIndex: -1 * index, elevation: -1, }, this.state.errorIndexes.includes(index) && { borderWidth: 1, borderColor: 'red' }]}>
                          <TextInput
                            autoCapitalize={'none'}
                            ref={(ref: any) => this.refs = ref}
                            style={[styles.fontFamilyRegular, { flex: 1, width: '100%', height: scaledSize(50), zIndex: -1 * (index + 1) },]}
                            value={item?.input}
                            selection={this.state.selection}
                            onChangeText={text => {
                              if (item.input != text) {
                                if (this.state.companyDetails[index]?.index == index) {
                                  let temp = this.state.companyDetails

                                  temp.splice(index, 1, { index: index })
                                  this.setState({ companyDetails: temp })
                                }
                              }
                              this.setState({ errorIndexes: [] })
                              this.onChangeText(text, this.state.selectedIndex)
                            }}
                            placeholder={placeholder}
                            onFocus={() => {
                              if (Platform.OS === 'android') {
                                this.setState({ selection: null });
                              }
                              console.log('selectedIndex', index);

                              this.setState({ searchedInstrument: [], selectedIndex: index, isFocused: true })
                            }}
                            onBlur={() => {
                              if (Platform.OS === 'android') {
                                this.setState({ selection: { start: 0, end: 0 } });
                              }
                              this.setState({ isFocused: false, selectedIndex: -1 })
                            }}
                          />
                          <Text style={[{ alignSelf: 'center', fontSize: scaledSize(12), marginLeft: scaledSize(10) }, styles.fontFamilyMedium]}>{item?.price != null && Number(item?.price).toFixed(2)}</Text>
                          {index > 2 ?
                            <TouchableOpacity onPress={() => { this.removeFromList(index) }}>
                              <Icon name={"close"}
                                size={scaledSize(20)} style={{ opacity: 0.5, }} />
                            </TouchableOpacity>
                            : null}
                          {/* // <Icon name={"keyboard-arrow-down"}  size={scaledSize(25)} style={{ opacity: 0.5 }} />} */}

                        </View>
                        {(this.state.selectedIndex == index && this.state.isFocused) &&
                          <View style={{ top: scaledSize(50), position: 'absolute', zIndex: 2 * index, width: '100%', maxHeight: scaledSize(150), overflow: 'hidden', borderBottomLeftRadius: scaledSize(10), borderBottomRightRadius: scaledSize(10) }}>
                            <FlatList
                              showsVerticalScrollIndicator={false}
                              showsHorizontalScrollIndicator={false}
                              bounces={false}
                              nestedScrollEnabled
                              keyboardShouldPersistTaps='always'
                              data={this.state.searchedInstrument}
                              ListEmptyComponent={() => {
                                return (
                                  this.state.isStockLoading ? <View style={{ paddingVertical: scaledSize(20), backgroundColor: colors.white }}>
                                    <ActivityIndicator color={colors.blue} />
                                  </View>
                                    : null
                                )
                              }}
                              renderItem={({ item, index }: { item: any, index: number }) => this._renderStock(item, index)}
                              keyExtractor={(item, index) => index.toString()}
                            />
                          </View>
                        }
                      </View>
                    )
                  })}
                </>
              }
              {this.state.pollType.key == listOfPollType[2].key && this.state.compareStock.length < 5 &&
                <>
                  <TouchableOpacity
                    onPress={() => { this.addQuestions() }}
                    style={[styles.addmore_container, { zIndex: -100 }]}>
                    <Icon name={icons.add} size={scaledSize(30)} color={colors.white} />
                  </TouchableOpacity>
                </>}
              <View style={{ zIndex: -1, elevation: -1, marginTop: scaledSize(15) }}>
                <Text style={[styles.text, styles.fontFamilyRegular]}>{configJSON.durationText}</Text>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={item => item?.key?.toString()}
                  scrollEnabled={false}
                  data={this.listOfTimeHorizone}
                  renderItem={({ item, index }) =>
                    this._renderForHorizon(item, index, this.timeHorizon)}
                  keyExtractor={(item, index) => index.toString()} />
              </View>
            </View>
          </KeyboardAwareScrollView>
          <View style={{ flexDirection: 'row', }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => { this.goToPreView() }}
              style={[styles.button_container, { backgroundColor: colors.white }]}
            >
              <Text style={[styles.button_txt, styles.fontFamilyRegular, { color: colors.blue }]}>{configJSON.preview}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={this.state.isLoading}
              onPress={() => { this.postPoll('post') }}
              style={[styles.button_container, { marginLeft: scaledSize(10), marginRight: scaledSize(20) }]}
            >
              {this.state.isLoading ? <ActivityIndicator color={"#FFF"} /> :
                <Text style={[styles.button_txt, styles.fontFamilyBold]}>{configJSON.post}</Text>}
            </TouchableOpacity>
          </View>
          {/* Customizable Area End */}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scaledSize(20),
    marginTop: scaledSize(20),
    marginBottom: scaledSize(10)
  },
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
    backgroundColor: colors.white,
    height: scaledSize(50),
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: scaledSize(15),
    borderRadius: scaledSize(10),
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
  textContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    height: scaledSize(50),
    paddingHorizontal: scaledSize(15),
    borderRadius: scaledSize(10),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catogary: {
    backgroundColor: colors.white,
    height: scaledSize(55),
    marginTop: scaledSize(10),
    borderRadius: scaledSize(15),
    paddingHorizontal: scaledSize(20),
    shadowColor: colors.black,
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.1,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  expanded_list: {
    backgroundColor: colors.white,
    paddingHorizontal: scaledSize(20),
    paddingVertical: scaledSize(10),
    width: Dimensions.get("screen").width - scaledSize(40),
  },
  addmore_container: {
    backgroundColor: colors.light_blue,
    justifyContent: 'center',
    alignItems: 'center',
    width: scaledSize(50),
    height: scaledSize(50),
    borderRadius: scaledSize(25),
    marginLeft: Platform.OS == "ios" ? scaledSize(12) : scaledSize(10),
    marginTop: Platform.OS == "ios" ? scaledSize(5) : scaledSize(10),
  },
  bottomLine: {
    height: 0.5,
    marginHorizontal: scaledSize(20),
    backgroundColor: colors.black,
    opacity: 0.1
  }
})

// Customizable Area End