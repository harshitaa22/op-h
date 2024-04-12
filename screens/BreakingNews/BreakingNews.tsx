// Customizable Area Start
import React from 'react'
import { FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Text, View, Dimensions, ActivityIndicator, Image } from 'react-native'
import BreakingNewsController, { configJSON } from './BreakingNewsController'
//components
import HeaderComponent from '../../../../../components/src/HeaderComponent'
import { Fonts } from '../../../../../components/src/Utils/Fonts'
import { scaledSize } from '../../../../../framework/src/Utilities'
//colors
import colors from '../../../../postcreation/src/colors'
// Customizable Area End
const { width } = Dimensions.get('screen')

export default class BreakingNews extends BreakingNewsController {
  // Customizable Area Start
  renderForTopNews() {
    return (
      <FlatList
        data={this.state.categoryNewsData}
        ref={(ref) => this.newsList = ref}
        contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: scaledSize(20) }}
        ListEmptyComponent={() => {
          return <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: scaledSize(15) }}>
            <Text style={styles.fontFamilyBold}>No latest news available!</Text>
          </View>
        }}
        renderItem={({ item, index }: { item: any, index: any }) => {
          const { title, image_url, published_at_in_words, link } = item?.attributes
          return (
            <TouchableOpacity onPress={() => this.onMoveToPreview(link,)}>
              <View style={styles.newCardView}>
                <View style={{ flex: 1, paddingRight: scaledSize(10), paddingTop: scaledSize(5) }}>
                  <Text numberOfLines={3} style={styles.newsTitleText}>{title}</Text>
                  <View style={{ justifyContent: "flex-end", flex: 1, bottom: scaledSize(7) }}>
                    <Text style={styles.dateTimeText}>{published_at_in_words}</Text>
                  </View>
                </View>
                {image_url != null ?
                  <Image style={styles.newsPoster} source={{ uri: image_url }} />
                  : (
                    <Image style={styles.newsPoster} source={require('../../../../Polling/assets/breaking_news.png')} />
                  )}
              </View>
              <View style={styles.newsItemLightseprator} />
              <View>
              </View>
            </TouchableOpacity>
          )
        }}
        keyExtractor={(item, index) => index.toString()}
      />)
  }
  // Customizable Area End
  render() {
    return (
      <View style={{ flex: 1, }}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Customizable Area Start */}
          <HeaderComponent isBack={true} showIcon={true}
            //  title={configJSON.title} 
            title={"Daily News"}
            onClose={() => { this.goBack() }} />
          <FlatList
            horizontal
            ref={(ref: any) => this.tabRef = ref}
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0, alignSelf: 'center', height: scaledSize(60) }}
            contentContainerStyle={{ flexGrow: 0, alignItems: 'center', justifyContent: 'center', height: scaledSize(50) }}
            data={[
              {
                name: 'For you'
              },
              {
                name: 'Business'
              },
              {
                name: 'Entertainment'
              },
              {
                name: 'Politics'
              }, {
                name: 'World'
              }]}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity style={{ paddingVertical: scaledSize(14), flexDirection: "row" }} onPress={() => { this.mainRef.scrollToIndex({ index: index, animated: true }) }}>
                  <View>
                    <Text
                      style={this.state.selected_tab == item.name
                        ? styles.tabs_txt
                        : styles.unselected_tab_txt}>
                      {item.name}
                    </Text>
                    {this.state.selected_tab == item.name &&
                      <View style={styles.tabBottomLine} />
                    }
                  </View>
                  <View style={styles.tabDivider} />
                </TouchableOpacity>
              )
            }}
            keyExtractor={(item, index) => index.toString()}
          />
          <FlatList data={[{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]}
            viewabilityConfig={this.viewabilityConfig}
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={this.onViewableItemsChanged}
            pagingEnabled
            horizontal
            keyExtractor={(item, index) => index.toString()}
            ref={ref => this.mainRef = ref}
            renderItem={({ item, index }: { item: any, index: number }) => {
              // if (index == 0) {
              return (
                <View style={{ flex: 1, width: width, }}>
                  {this.state.isLoadingNews ?
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <ActivityIndicator color={colors.blue} size={'large'} />
                    </View>
                    : this.renderForTopNews()}
                </View>
              )
            }}
          />
        </SafeAreaView>
        {/* Customizable Area End */}
      </View>
    )
  }
}
// Customizable Area Start
const styles = StyleSheet.create({
  newCardView: {
    flex: 1,
    flexDirection: "row",
    marginVertical: scaledSize(10),
    justifyContent: "space-between"
  },
  newsTitleText: {
    fontSize: scaledSize(15),
    marginTop: scaledSize(3),
    color: colors.black,
    fontFamily: Fonts.REGULAR
  },
  dateTimeText: {
    fontSize: scaledSize(13),
    color: colors.gray,
    fontFamily: Fonts.REGULAR,
  },
  fontFamilyBold: {
    fontFamily: Fonts.LIGHT_BOLD
  },
  tabs_txt: {
    marginHorizontal: scaledSize(15),
    fontSize: scaledSize(16),
    fontFamily: Fonts.MEDIUM,
    color: colors.black,
    fontWeight: "bold",
  },
  unselected_tab_txt: {
    marginHorizontal: scaledSize(15),
    fontSize: scaledSize(15),
    color: colors.gray,
    fontFamily: Fonts.MEDIUM,
  },
  tabBottomLine: {
    top: scaledSize(13),
    borderBottomWidth: 2,
    color: colors.black,
  },
  tabDivider: {
    borderRightWidth: 1, borderColor: colors.lightGray
  },
  newsItemLightseprator: {
    borderBottomWidth: 0.8,
    borderBottomColor: colors.gray,
    width: width - scaledSize(40),
  },
  newsPoster: {
    height: scaledSize(80), width: scaledSize(130), backgroundColor: colors.lightGray, marginVertical: scaledSize(10)
  }
})
// Customizable Area End