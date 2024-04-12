// Customizable Area Start
import React from 'react'
import { FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Text, View } from 'react-native'
import Live from '../../../../../mobile/Navigation/Live'
import colors from '../../../../postcreation/src/colors'
import PreViewController, { configJSON } from './PreViewController'
//components
import HeaderComponent from '../../../../../components/src/HeaderComponent'
import PollsCardHeader from '../../../../../components/src/PollsCardHeader'
import { Fonts } from '../../../../../components/src/Utils/Fonts'
import ConformationModal from '../Components/ConformationModal'
//framework
import { deviceWidth, scaledSize } from '../../../../../framework/src/Utilities'
//library
import Entypo from 'react-native-vector-icons/Entypo';
// Customizable Area end

export default class PreView extends PreViewController {
  // Customizable Area Start
  StockView = ({
    title,
    subTitle,
    extraHeight,
    isLive
  }: {
    title: string;
    subTitle: string;
    extraHeight: any;
    isLive: boolean;
  }) => {
    let { stockDetail, stock } = this.state.data[0]
    return (
      <>
        <View
          style={[
            styles.stockViewContainer,
            { paddingHorizontal: scaledSize(10) },
            extraHeight && { marginTop: scaledSize(15) },
          ]}
        >
          <View style={{ maxWidth: deviceWidth - scaledSize(150), }}>
            {/* <Text style={[styles.stockText, styles.fontFamilyBold]}>{title}</Text> */}
            {
              title == "Bullish" || title == "Bearish" ? (
                <Text numberOfLines={2} style={[styles.stockText, styles.fontFamilyBold,]}>{title}
                  <Entypo
                    name={title == "Bullish" ? 'arrow-long-up' : 'arrow-long-down'} size={scaledSize(12)} color={title == "Bullish" ? colors.lightGreen : colors.red}
                  />
                </Text>
              ) : (
                <Text numberOfLines={2} style={[styles.stockText, styles.fontFamilyBold]}>{title}</Text>
              )
            }
            <Text style={[styles.stockSubText, styles.fontFamilyMedium]}>{subTitle}</Text>
          </View>
          {isLive && <View style={{ maxWidth: scaledSize(80), alignItems: 'flex-end', }}>
            <Text
              adjustsFontSizeToFit numberOfLines={1}
              style={[styles.stockPrize, styles.fontFamilyBold]}>{Number(stockDetail?.market_cap).toFixed(2)}</Text>
            {stockDetail.active &&
              <Live
                type={stock.category}
                extraStyle={{ marginTop: scaledSize(3) }}
              />
            }
            <Text style={[styles.upSideText, styles.fontFamilyRegular, { color: colors.green }]}>{configJSON.value}</Text>
          </View>}
        </View>
      </>
    );
  };

  _renderItem = ({ item, index }: { item: any, index: number }) => {
    return (
      <View style={styles.boxContainer}>
        <View style={{}}>
          <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
            <PollsCardHeader
              self={true}
              opigo_score={this.state.userDetail?.attributes?.opigo_score}
              isCity={false} item={this.state.userDetail}
              fullName={`${this.state.userDetail?.attributes?.first_name} ${this.state.userDetail?.attributes?.last_name}`}
              dot={false} onPressDot={() => { }}
              onPressFriendPage={() => { }}
            />
          </View>
          <View style={styles.detailContainer}>
            {/* <Text style={[styles.discriptionText, styles.fontFamilyMedium]}>
              {configJSON.addedAt}
              <Text style={styles.fontFamilyBold}>
                {Number(item.stockDetail.market_cap).toFixed(2)}
              </Text>
              <Text>
               {configJSON.portfolio}
              </Text>
            </Text> */}
            {this.StockView({
              title: item.stockDetail.name,
              subTitle: item.stockDetail.market_cap != null ? "Added at " + Number(item.stockDetail.market_cap).toFixed(2) : "",//String(item?.stockDetail.exchange).toLowerCase()  == 'no'? '':item?.stockDetail.exchange,
              isLive: true,
              extraHeight: true,
            })}
          </View>
          <View style={styles.horizontalLine} />
          <View style={{ paddingHorizontal: scaledSize(10) }}>
            {this.StockView({
              title: item?.bulish_barish.name,
              subTitle: item?.Horizon?.name,
              isLive: false,
              extraHeight: false,
            })}
          </View>
          <View style={styles.horizontalLine} />
          <View style={{ paddingHorizontal: scaledSize(10) }}>
            {this.StockView({
              title: item.bulish_barish.key == "bullish" ? configJSON.upSide : configJSON.downSide,
              subTitle: item?.PotentialUpside?.name,
              isLive: false,
              extraHeight: false,
            })}
          </View>
          <View />
        </View>
      </View>
    )
  }
  // Customizable Area End
  render() {
    return (
      <View style={{ flex: 1, }}>
        <SafeAreaView />
        {/* Customizable Area Start */}
        <HeaderComponent isBack={true} showIcon={false} title={configJSON.title} onClose={() => { this.goBack() }} />
        <FlatList
          data={this.state.data}
          style={{ paddingHorizontal: scaledSize(20), paddingTop: scaledSize(20) }}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: scaledSize(20) }}>
          <TouchableOpacity
            disabled={this.state.isLoading}
            onPress={() => { this.goBack() }}
            style={[styles.button_container, { marginRight: scaledSize(10), backgroundColor: colors.white }]}
          >
            {<Text style={[styles.button_txt, styles.fontFamilyRegular, { color: colors.blue }]}>{configJSON.back}</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            disabled={this.state.isLoading}
            onPress={() => {
              this.setState({ visiblePopUp: true })
            }}
            style={[styles.button_container]}
          >
            <Text style={[styles.button_txt, styles.fontFamilyBold]}>{configJSON.post}</Text>
          </TouchableOpacity>
        </View>
        <ConformationModal
          visible={this.state.visiblePopUp}
          title={configJSON.modalTitle}
          onCancel={() => { this.setState({ visiblePopUp: false }) }}
          onPress={() => { this.PostData() }}
          isLoading={this.state.isLoading}
        />
        {/* Customizable Area End */}
      </View>
    )
  }
}
// Customizable Area Start
const styles = StyleSheet.create({
  boxContainer: {
    backgroundColor: colors.white,
    paddingTop: scaledSize(10),
    borderRadius: scaledSize(20),
    justifyContent: "space-between",
    paddingBottom: 20,
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
  detailContainer: {
    paddingHorizontal: scaledSize(10),
  },
  discriptionText: {
    fontSize: scaledSize(14),
    paddingHorizontal: scaledSize(10),
    marginTop: scaledSize(5)
  },
  horizontalLine: {
    borderWidth: 0.5,
    backgroundColor: colors.gray,
    marginTop: scaledSize(8),
    opacity: 0.1,
  },
  stockViewContainer: {
    marginTop: scaledSize(8),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stockText: {
    fontSize: scaledSize(14),
    marginBottom: scaledSize(3),
  },
  stockSubText: {
    fontSize: scaledSize(11),
  },
  stockPrize: {
    alignSelf: "flex-end",
    fontSize: scaledSize(13),
  },
  liveContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.red,
    borderWidth: 0.3,
    borderRadius: 100,
    width: scaledSize(40),
    paddingVertical: scaledSize(1),
    alignSelf: "flex-end",
  },
  reddot: {
    height: scaledSize(4),
    width: scaledSize(4),
    backgroundColor: "red",
    borderRadius: 100,
    marginRight: scaledSize(5),
  },
  upSideText: {
    fontSize: scaledSize(10),
    color: colors.green,
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
  }
})
// Customizable Area End