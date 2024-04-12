import React from 'react'
import { Text, View, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
//@ts-ignore
import Live from '../../../../../mobile/Navigation/Live'
import OpiGoPollPreviewController, { configJSON } from './OpiGoPollPreviewController'
//components
import HeaderComponent from '../../../../../components/src/HeaderComponent'
import PollsCardHeader from '../../../../../components/src/PollsCardHeader'
import { Fonts } from '../../../../../components/src/Utils/Fonts'
import { listOfPollType } from '../../../../../components/src/Utils/service'
//framework
import { scaledSize } from '../../../../../framework/src/Utilities'
//colors
import colors from '../../colors'

export default class OpiGoPollPreview extends OpiGoPollPreviewController {
  // Customizable Area Start

  _renderSingleInvestment = (item: any, index: number) => {
    return <View style={styles.listElement}>
      <Text numberOfLines={1} style={styles.fontFamilyBold}>{item}</Text>
    </View>
  }

  _renderMultiple = (item: any, index: number) => {
    return <View style={styles.listElement}>
      <Text numberOfLines={1}>{item.name}</Text>
    </View>
  }
  _render2Stock = (item: any, index: number) => {
    // let activeTradeTime = marketLiveTime(item?.category)
    return <View style={[styles.listElement, styles.twoStock, {}]}>
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={[styles.fontFamilyBold, { fontSize: 13 }]}>{item.name}</Text>
        <Text numberOfLines={1} style={[styles.fontFamilyRegular, { fontSize: 10, opacity: 0.6 }]}>{`${String(item.exchange).toLowerCase() == "no" ? '' : `${item.exchange}`}`}</Text>
      </View>
      <View style={{}}>
        <Text numberOfLines={1}
          // adjustsFontSizeToFit
          style={[styles.fontFamilyBold, { alignSelf: 'flex-end', }]}>{item?.market_cap != null ? Number(item.market_cap).toFixed(2) : "0.00"}</Text>
        {/* {item.active && <View style={[styles.liveContainer, { borderColor: activeTradeTime ? colors.red : colors.gray, marginVertical: scaledSize(2) }]}>
          <View style={[styles.reddot, { backgroundColor: activeTradeTime ? colors.red : colors.gray }]} />
          <Text style={[styles.fontFamilyRegular, { fontSize: scaledSize(6), color: activeTradeTime ? colors.red : colors.gray }]}>LIVE</Text>
        </View>} */}
        <Live
          type={this.state.companyDetail[0].category}
          extraStyle={{ marginTop: scaledSize(3) }}
        />
      </View>
    </View>
  }

  TimeFrame = () => {
    return (
      <Text style={[styles.fontFamilyRegular, { marginTop: scaledSize(5) }]}>
        {`For `}
        <Text style={styles.fontFamilyBold}>{this.state.timeHorizon?.name}</Text>
        {` Time Frame`}
      </Text>
    )
  }

  // Customizable Area End
  render() {
    // let activeTradeTime = false
    // if (this.state.pollType.key == listOfPollType[0].key) {
    //   // activeTradeTime = marketLiveTime(this.state.companyDetail[0].category)
    // }
    return (
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        {/* Customizable Area Start */}
        <View style={{ flex: 1 }}>
          <SafeAreaView />
          <HeaderComponent title={configJSON.title} isBack={true} showIcon={false} onClose={() => { this.props.navigation.goBack() }} />
          <View style={[styles.container, { overflow: 'hidden' }]}>
            <View style={{ minHeight: 50, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
              <PollsCardHeader
                opigo_score={this.state.userData?.attributes?.opigo_score}
                profile={this.state.userData?.attributes.profile}
                userName={this.state.userData?.attributes.first_name + " " + this.state.userData?.attributes.last_name}
                item={this.state.userData} self={true}
                onPressFriendPage={() => { }}
              />
            </View>
            <View style={[styles.viewContainer,]}>
              <View style={{ marginBottom: scaledSize(15), }} >
                {this.state.pollType.key == listOfPollType[1].key &&
                  <View style={{}}>
                    {/* which stock are you more ${String(this.state.investment_type.key).toLowerCase()}? */}
                    <Text>{`${this.state.investment_type.name}`}
                      {/* <Text style={styles.fontFamilyBold}>{` ${}`}</Text> */}
                    </Text>

                    <this.TimeFrame />
                  </View>
                }
                {this.state.pollType.key == listOfPollType[2].key &&
                  <View style={{}}>
                    <Text>Rank the below {this.state.companyDetail[0].category == "crypto" ? 'cryptos' : 'stocks'} from
                      <>
                        <Text style={{}}>{this.state.investment_type.key == this.compareMultipleStock[0].key ? ` ${configJSON.bullish} ` : ` ${configJSON.bearish} `}</Text>
                        <Text>to</Text>
                        <Text style={{}}>{this.state.investment_type.key == this.compareMultipleStock[0].key ? ` ${configJSON.bearish}` : ` ${configJSON.bullish}`} </Text>
                      </>
                    </Text>
                    <this.TimeFrame />
                  </View>
                }
                {this.state.pollType.key == listOfPollType[0].key &&
                  <Text style={styles.fontFamilyRegular}>{configJSON.viewOn}
                    <Text style={[styles.fontFamilyBold, { fontSize: scaledSize(13) }]}>{this.state.companyDetail[0].name + " ?"}</Text>
                  </Text>
                }
                {this.state.apiData?.poll.data?.avg_holding_value && <Text style={[styles.fontFamilyRegular, { marginBottom: scaledSize(3) }]}>
                  {configJSON.costPrice}
                  <Text style={styles.fontFamilyBold}>{` ${Number(this.state.apiData?.poll.data?.avg_holding_value).toFixed(2)} `}</Text>
                </Text>}
              </View>
              {this.state.pollType.key == listOfPollType[0].key &&
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1, marginRight: scaledSize(10) }}>
                    <Text style={[styles.boldText, styles.fontFamilyBold, { marginBottom: 0 }]}>{this.state.companyDetail[0].name}</Text>
                    <this.TimeFrame />
                  </View>
                  <View style={{ maxWidth: scaledSize(80), alignItems: 'flex-end' }}>
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      style={styles.fontFamilyBold}>{Number(this.state.companyDetail[0].market_cap).toFixed(2) == 'NaN' ? '0.00' : Number(this.state.companyDetail[0].market_cap).toFixed(2)}</Text>
                    {/* {<View style={[styles.liveContainer, { borderColor: activeTradeTime ? colors.red : colors.gray, marginVertical: scaledSize(2) }]}>
                      <View style={[styles.reddot, { backgroundColor: activeTradeTime ? colors.red : colors.gray }]} />
                      <Text style={[styles.fontFamilyRegular, { fontSize: scaledSize(6), color: activeTradeTime ? colors.red : colors.gray }]}>LIVE</Text>
                    </View>
                    } */}
                    <Live
                      type={this.state.companyDetail[0].category}
                      extraStyle={{ marginTop: scaledSize(3) }}
                    />
                  </View>
                </View>}
            </View>
            {this.state.pollType.key == listOfPollType[0].key &&
              <>
                <View style={styles.horizontalLine} />
                <FlatList
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  scrollEnabled={false}
                  data={[configJSON.bullish, configJSON.bearish, configJSON.neutral]}
                  renderItem={({ item, index }) => this._renderSingleInvestment(item, index)}
                  keyExtractor={(item, index) => index.toString()}
                />
              </>}
            {this.state.pollType.key == listOfPollType[1].key &&
              <FlatList data={this.state.companyDetail}
                renderItem={({ item, index }) => this._render2Stock(item, index)}
                keyExtractor={(item, index) => index.toString()} />}

            {this.state.pollType.key == listOfPollType[2].key &&
              <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={this.state.companyDetail}
                renderItem={({ item, index }) => this._render2Stock(item, index)}
                keyExtractor={(item, index) => index.toString()}
              />}
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: scaledSize(20), paddingBottom: scaledSize(20) }}>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={this.state.isLoading}
            onPress={() => { this.goBack() }}
            style={[styles.button_container, { marginRight: scaledSize(10), backgroundColor: colors.white }]}
          >
            {<Text style={[styles.button_txt, styles.fontFamilyRegular, { color: colors.blue }]}>{configJSON.back}</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={this.state.isLoading}
            onPress={() => { this.postData() }}
            style={[styles.button_container]}
          >
            {this.state.isLoading ? <ActivityIndicator color={colors.white} /> : <Text style={[styles.button_txt, styles.fontFamilyBold]}>{configJSON.post}</Text>}
          </TouchableOpacity>
        </View>
        {/* Customizable Area End */}
      </View>
    )
  }
}
// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    marginHorizontal: scaledSize(19),
    backgroundColor: colors.white,
    paddingVertical: scaledSize(10),
    borderRadius: scaledSize(15),
    marginTop: scaledSize(10),
    marginBottom: scaledSize(15),
  },
  fontFamilyRegular: {
    fontFamily: Fonts.REGULAR
  },
  fontFamilyBold: {
    fontFamily: Fonts.LIGHT_BOLD
  },
  viewContainer: {
    paddingHorizontal: scaledSize(20),
    paddingTop: scaledSize(10),
  },
  boldText: {
    fontSize: scaledSize(13),
    marginBottom: scaledSize(4)
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
  horizontalLine: {
    height: 0.3,
    backgroundColor: colors.black,
    opacity: 0.1,
    marginVertical: scaledSize(8),
    width: "110%",
    left: -15
  },
  listElement: {
    backgroundColor: "rgb(239,241,243)",
    minHeight: scaledSize(40),
    marginHorizontal: scaledSize(20),
    borderRadius: scaledSize(10),
    marginBottom: scaledSize(8),
    justifyContent: 'center',
    alignItems: 'center'
  },
  button_container: {
    padding: scaledSize(17),
    flex: 1,
    backgroundColor: colors.blue,
    borderRadius: scaledSize(10),
    justifyContent: "center",
    alignItems: "center",
  },
  button_txt: {
    color: colors.white,
    fontSize: scaledSize(15),
  },
  twoStock: {
    paddingVertical: scaledSize(5),
    paddingLeft: scaledSize(15),
    paddingRight: scaledSize(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: scaledSize(50)
  }
})
// Customizable Area End