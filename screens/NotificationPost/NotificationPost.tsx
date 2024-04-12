import React, { FC } from "react";
import {
  ActivityIndicator,
  Clipboard,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
//library
import { MentionInput, MentionSuggestionsProps, replaceMentionValues } from 'react-native-controlled-mentions'
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RenderHTML from "react-native-render-html";
import Toast from 'react-native-toast-message'
//controller
import NotificationPostController, { configJSON } from './NotificationPostController'
//components
import { deleteIcon, reply } from "../../../../../components/src/assets";
import { listOfPollType, nFormatter, setEvent } from "../../../../../components/src/Utils/service";
import DeletePollModal from "../Components/DeletePollModal";
import { Fonts } from "../../../../../components/src/Utils/Fonts";
import Forums from "../../../../../components/src/Forums";
import HeaderComponent from "../../../../../components/src/HeaderComponent";
import Polls from "../../../../../components/src/Polls/Polls";
import SocilaPost from "../../../../../components/src/SocialPost/socialPost";
import { timeSince } from "../../../../../components/src/utilitisFunction";
import ChannelStockDiscription from "../../../../../components/src/ChannelStockDiscription";
import StockDiscription from "../../../../../components/src/StockDiscription";
//framework
import {
  deviceHeight,
  deviceWidth,
  scaledSize,
  widthFromPercentage,
} from "../../../../../framework/src/Utilities";
//assets
import { icons, profile } from "../../assets";
import { verified } from "../../../../CustomisableUserProfiles/src/assets";
//colors
import colors from "../../colors";

const { width } = Dimensions.get('screen')


class NotificationPost extends NotificationPostController {
  // Customizable Area Start
  displayComments = () => {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={this.state.comments_List}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
        renderItem={({ item, index }: { item: any, index: any }) => {
          if (this.state.commentType == 'Forum') {
            const data = item.attributes
            data.comment = item?.attributes?.new_description;
            data.account.profile_url = item.attributes.profile_url
            if (item.attributes.opigo_score != null) {
              data.account.final_score = item.attributes?.opigo_score
            }
            item = data;
          }
          else {
            const data = item
            if (item.account.performance_score != null) {
              data.account.final_score = item.account.performance_score
            }
            item = data
          }
          let heighLight = this.props?.route?.params?.details?.commentId == item.id && this.state.heighLight
          let that = this
          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => { Keyboard.dismiss(), this.setState({ isShow: false }) }}
              style={[styles.comments_view_row,
              {
                backgroundColor: colors.white,
                marginBottom: this.state.comments_List?.length - 1 == index ? 30 : 10,
                borderWidth: 1,
                borderColor: heighLight ? colors.blue : this.state.replyId == item.id ? colors.blue : colors.white
              }]}>
              <TouchableOpacity
                onPress={() => { this.goToFriendProfilePage(item.account.id) }}
                style={{ flex: 1, alignItems: 'center' }}>
                <View style={styles.profileView}>
                  {item?.account?.profile_url ?
                    <Image source={{ uri: item?.account?.profile_url }} style={styles.profile} />
                    : <Image source={profile} style={styles.profile} />}
                  {item?.account?.opigo_verified == true &&
                    <View style={styles.verified_view}>
                      <Image source={verified} style={styles.veified} />
                    </View>}
                </View>
                <View style={styles.id_view}>
                  <Text
                    style={[styles.id_txt, styles.fontFamilyRegular]}>
                    {item?.account?.final_score ? nFormatter(item?.account?.final_score) : 0}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={{ flex: 5, justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => { this.goToFriendProfilePage(item.account.id) }}>
                  <Text numberOfLines={1} style={[styles.userName, styles.fontFamilyBold,]}>{item?.account?.first_name} {item?.account?.last_name}  {" "}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onLongPress={() => { Clipboard.setString(item.message), Toast.show({ text1: 'Message copied!', type: 'success' }) }}>
                  <RenderHTML
                    defaultTextProps={{ allowFontScaling: false }}
                    renderersProps={{
                      a: {
                        onPress(event, url, htmlAttribs, target) {
                          that.manageOnPress(url, htmlAttribs.href)
                        }
                      }
                    }}
                    tagsStyles={{
                      a: {
                        textDecorationLine: 'none'
                      }
                    }}
                    baseStyle={{
                      fontSize: scaledSize(12),
                      fontFamily: Fonts.REGULAR,
                      marginTop: scaledSize(2),
                      color: colors.black,
                    }} source={{ html: item.comment }} />
                </TouchableOpacity>
                <View style={styles.bottom_card_row}>
                  <Text style={[styles.time, styles.fontFamilyRegular,]}>{timeSince(item.created_at)}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', flex: 1 }}>
                    {this.props.route.params.type != "Forum" && <TouchableOpacity
                      onPress={() => {
                        this.replyofComment(item)
                        this.refss.focus()
                      }}
                      style={[styles.replayDelete_view,]}>
                      <Image source={reply} style={[{ height: 20, width: 20, tintColor: this.state.replyId == item.id ? colors.blue : colors.black },]} />
                    </TouchableOpacity>}
                    {(this.state.accountid == item?.account?.id || this.state.isCreator) &&
                      <TouchableOpacity
                        onPress={() => { this.showDelete(item.id, item.account_id) }}
                        style={styles.replayDelete_view}>
                        <Image source={deleteIcon} style={{ height: 20, width: 20 }} />
                      </TouchableOpacity>}
                  </View>
                </View>
                {((item.is_replies_present === true && this.state.openViewCommentID == item.id)) ?
                  this.displayViewReplyComments()
                  : null}
                {item.is_replies_present === true ?
                  <TouchableOpacity onPress={() => this.setViewCommentId(item.id)}>
                    {(this.state.isLoadingReplyComment && this.state.openViewCommentID == item.id) ? <Text style={[styles.viewReply_txt, styles.fontFamilyRegular]}>loading...</Text>
                      : <Text style={[styles.viewReply_txt, styles.fontFamilyRegular]}>{(this.state.isHideComments == false && this.state.openViewCommentID == item.id) ? configJSON.hideReply : configJSON.viewReply}</Text>}
                  </TouchableOpacity>
                  : null}
              </View>
            </TouchableOpacity>)
        }}
      />)
  }

  displaySuggestions = (item: any) => {
    if (item.tagged_type == this.stockCompany) {
      if (item.company_name == configJSON.tataMotor) {
        return `${item.company_name} (${item.company_symbol})`
      } else {
        return item.company_name
      }
    } else {
      return item.full_name
    }
  }

  displayViewReplyComments = () => {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={this.state.viewComment_List}
        renderItem={({ item }: { item: any }) => {
          let that = this
          let heighLight = this.props?.route?.params?.details?.commentId == item.id && this.state.heighLight
          return (
            <>
              <View style={[styles.reply_container, { borderRadius: heighLight ? 10 : 0, borderColor: heighLight ? colors.blue : colors.white, borderWidth: 1 }]}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <View style={styles.profileView}>
                    {item?.attributes?.profile_url ?
                      <Image source={{ uri: item?.attributes?.profile_url }} style={styles.profile} />
                      : <Image source={profile} style={styles.profile} />}
                    {item?.attributes?.account?.opigo_verified &&
                      <View style={styles.verified_view}>
                        <Image source={verified} style={styles.veified} />
                      </View>}
                  </View>
                  <View style={styles.id_view}>
                    <Text
                      style={[styles.id_txt, styles.fontFamilyRegular]}>
                      {nFormatter(item?.attributes?.opigo_score)}
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 5, justifyContent: 'center', marginLeft: 2 }}>
                  <Text style={[styles.userName, styles.fontFamilyBold, { color: colors.black }]}>{item?.attributes?.account?.first_name} {item?.attributes?.account?.last_name}  {" "}
                  </Text>
                  <RenderHTML
                    defaultTextProps={{ allowFontScaling: false }}
                    renderersProps={{
                      a: {
                        onPress(event, url, htmlAttribs, target) {
                          that.manageOnPress(url, htmlAttribs.href)
                        }
                      }
                    }}
                    defaultTextProps={{ selectable: true }}
                    tagsStyles={{
                      a: {
                        textDecorationLine: 'none'
                      }
                    }}
                    baseStyle={{ fontSize: scaledSize(12), fontFamily: Fonts.REGULAR, marginTop: scaledSize(-10), color: colors.black }} contentWidth={width} source={{ html: `<p>${item?.attributes?.comment}</p>` }} />
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginLeft: scaledSize(50), flex: 1, }}>
                <Text style={[styles.time, styles.fontFamilyRegular, { flex: 1 }]}>{timeSince(item.attributes.created_at)}</Text>
                {(this.state.accountid == item?.attributes?.account?.id || this.state.isCreator) &&
                  <TouchableOpacity
                    onPress={() => this.showDelete(item.id, item.attributes.account_id)}
                    style={[styles.replayDelete_view, { marginLeft: scaledSize(15), }]}>
                    <Image source={deleteIcon} style={{ height: 20, width: 20 }} />
                  </TouchableOpacity>}
              </View>
            </>)
        }}
        keyExtractor={(item, index) => index.toString()}
      />)
  }

  renderSuggestions: FC<MentionSuggestionsProps> = ({ keyword, onSuggestionPress }) => {
    if (keyword == null) {
      return null;
    }
    return (
      <>
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={this.state.suggestions}
          keyboardShouldPersistTaps='always'
          style={{ flexGrow: 0 }}
          renderItem={({ item, index }: { item: any, index: number }) => {
            return (
              <TouchableOpacity
                onPress={() => { this.handleClickItem(item, onSuggestionPress) }}
                style={{ padding: 12, }}>
                <Text numberOfLines={1} style={[styles.fontFamilyRegular, { fontSize: scaledSize(12) }]}>{this.displaySuggestions(item)}</Text>
              </TouchableOpacity>)
          }}
          keyExtractor={(item, index) => index.toString()} />
        {this.state.suggestions?.length >= 1 && <View style={{ height: 1, backgroundColor: 'rgb(246,246,246)', }} />}
      </>)
  };
  // Customizable Area End

  render() {
    let normalCaption = replaceMentionValues(this.state.comment, ({ id, name }) => {
      return `@${name}`
    })
    let item = this.state.detail
    console.log(this.state.type, "dsknfdklsbfndsbf", JSON.stringify(item));

    return (
      // Customizable Area Start
      <>
        <SafeAreaView />
        <HeaderComponent
          title={this.state.type == 'poll' ? "Poll" : this.state.type == 'card' ? "Card" : this.state.type == 'channel_card' ? "Deck Card" : this.state.type == 'post' ? configJSON.post : this.state.type == 'forum' ? this.props.route?.params?.item?.name : ''}
          isBack={true}
          onClose={() => this.goToBack()} />
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          extraScrollHeight={20}
          extraHeight={100}
          scrollEnabled={true}
          keyboardShouldPersistTaps='handled'
          style={{ flex: 1 }}
          contentContainerStyle={{ flex: 1, flexGrow: 1 }} >
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ref={(ref: any) => this.listRef = ref}
          >
            <View style={{ flex: 1, marginHorizontal: scaledSize(15) }}>
              {this.state.isLoading ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: deviceHeight - scaledSize(80) }}>
                  <ActivityIndicator color={colors.blue} size='large' />
                </View>
                :
                <>
                  {this.state.type == 'post' && (this.state.detail == null ?
                    //changes
                    // <View style={{ height: deviceHeight - scaledSize(80), justifyContent: 'center', alignItems: 'center' }}>
                    //   <ActivityIndicator color={colors.blue} size='large' />
                    // </View>
                    <View style={{ height: deviceHeight - scaledSize(200), justifyContent: 'center', alignItems: 'center' }}>
                      {!this.state.isPostLoad && <Text style={styles.fontFamilyBold}>{configJSON.postDeleted}</Text>}
                    </View>
                    : <SocilaPost
                      hideReportModal={() => {
                        this.setState({ visibleSocialPopUp: false })
                      }}
                      verified={item?.data?.attributes?.user_detail?.data?.attributes?.opigo_verified}
                      setCommentCount={(id: any, count: number) => {
                        if (item.data.id == id) {

                          item.data.attributes.cmments_count = count
                          this.setState({ temp: !this.state.temp })
                        }
                      }}
                      setVisiblePopup={() => {
                        this.setState({ seletctedDeleteId: item?.data.id })
                        if (this.state.seletctedDeleteId != item?.data.id) {
                          this.setState({ visibleSocialPopUp: true })
                        } else {
                          this.setState({ visibleSocialPopUp: !this.state.visibleSocialPopUp })
                        }
                      }}
                      visiblePopUp={this.state.visibleSocialPopUp}
                      seletctedDeleteId={this.state.seletctedDeleteId}
                      socialData={item.data}
                      index={0}
                      page={"Dashboard"}
                      profile={item?.data?.attributes?.user_detail?.data?.attributes?.profile}
                      fullName={item?.data?.attributes?.user_detail?.data?.attributes
                        ?.first_name +
                        " " +
                        item?.data?.attributes?.user_detail?.data?.attributes
                          ?.last_name}
                      opigo_score={item?.data?.attributes?.user_detail?.data?.attributes?.opigo_score}
                      accountId={this.state.accountId}
                      deletePost={(id: any) => { }}
                      goToFriendProfilePage={(id: any) => {
                        this.goToFriendProfilePage(id)
                      }}
                      navigation={this.props.navigation}
                      hidePopUp={() => { this.setState({ visibleSocialPopUp: false }) }}
                      removeFromList={(id: any) => { }}
                      showMoreClickId={(id: any) => this.setState({ showMoreId: id })}
                      showMoreId={this.state.showMoreId}
                      opigo_verified_type={item?.data?.attributes?.user_detail?.data?.attributes?.opigo_verified_type}
                    />
                  )
                  }
                  {this.state.type == 'poll' && (this.state.detail == null ?
                    <View style={{ height: deviceHeight - scaledSize(80), justifyContent: 'center', alignItems: 'center' }}>
                      {!this.state.isPollLoad && <Text style={styles.fontFamilyBold}>{configJSON.pollDeleted}</Text>}
                    </View>
                    :
                    <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({ seletctedDeleteId: '', visiblePopup: false }) }}>
                      <Polls
                        setCommentCount={(id: any, count: number) => {
                          if (item.id == id) {
                            item.attributes.cmments_count = count;
                            this.setState({ temp: !this.state.temp });
                          }
                        }}
                        index={0}
                        navigation={this.props.navigation}
                        removeFromList={(id: any) => { }}
                        opigo_score={item?.attributes?.user_detail?.data?.attributes?.opigo_score}
                        item={item}
                        profile={null}
                        self={false}
                        visiblePopUp={this.state.visiblePopup}
                        visiblePopUpForReport={this.state.visiblePopupReports}
                        visibleItem={this.state.seletctedDeleteId}
                        setVisiblePopup={() => {
                          if (this.state.seletctedDeleteId != item?.id) {
                            this.setState({ visiblePopup: true, visiblePopupReports: true });
                          } else {
                            this.setState({ visiblePopup: !this.state.visiblePopup, visiblePopupReports: !this.state.visiblePopupReports });
                          }
                          this.setState({ seletctedDeleteId: item?.id });
                        }}
                        loading={this.state.submitLoading}
                        onSubmitAns={(poll_type: any, poll_stocks_length: any, selectedPoll: any, selectedPollItem: any, ansForMultipleStock: any, ansForCustomPoll: any) => {
                          let customPollItem: any = []
                          let customPollData = item?.attributes?.poll_stocks?.data
                          customPollData.map((item: any) => {
                            customPollItem.push(item?.attributes?.stock?.name)
                          })
                          if (poll_type == listOfPollType[2].key) {
                            this.setState({ selectedPoll: selectedPollItem });
                            if (poll_stocks_length == ansForMultipleStock.length) {
                              setEvent("poll engagement", {
                                "option selected": selectedPollItem,
                                "total options": poll_stocks_length,
                                "poll creator": item?.attributes?.user_detail?.data?.attributes?.first_name +
                                  " " +
                                  item?.attributes?.user_detail?.data?.attributes?.last_name,
                                "stocks": customPollItem.toString(),
                                "poll type": poll_type,
                                "poll text": `Rank the below ${item?.attributes?.poll_stocks?.data[0]?.attributes?.market_detail_of_stock?.category == "crypto"
                                  ? "cryptos"
                                  : "stocks"
                                  } from Bullish to Bearish` + `For ` + this.listOfTimeHorizone[item?.attributes?.time_frame] + ` Time Frame`,
                                "option ranking": poll_stocks_length,
                              })
                              this.submitPollAnswer(poll_type, selectedPollItem, ansForMultipleStock);
                            } else {
                              Toast.show({
                                type: 'success',
                                text1: 'Please Select All The Stocks',
                              });
                            }
                          }
                          else if (poll_type == listOfPollType[3].key) {
                            setEvent("poll engagement", {
                              "option selected": selectedPoll,
                              "total options": poll_stocks_length,
                              "poll creator": item?.attributes?.user_detail?.data?.attributes?.first_name +
                                " " +
                                item?.attributes?.user_detail?.data?.attributes?.last_name,
                              "stocks": customPollItem.toString(),
                              "poll type": poll_type,
                              "poll text": item?.attributes?.question,
                              "option ranking": poll_stocks_length,
                            })
                            this.setState({ selectedPoll: selectedPoll });
                            this.submitPollAnswer(poll_type, selectedPoll, ansForCustomPoll);
                          }
                          else {
                            setEvent("poll engagement", {
                              "option selected": selectedPollItem,
                              "total options": poll_stocks_length,
                              "poll creator": item?.attributes?.user_detail?.data?.attributes?.first_name +
                                " " +
                                item?.attributes?.user_detail?.data?.attributes?.last_name,
                              "stocks": customPollItem.toString(),
                              "poll type": poll_type,
                              "poll text": `${item?.attributes?.data?.investment_type}` + `For ` + this.listOfTimeHorizone[item?.attributes?.time_frame] + ` Time Frame`,
                              "option ranking": poll_stocks_length,
                            })
                            this.setState({ selectedPoll: selectedPoll });
                            this.submitPollAnswer(poll_type, selectedPoll, selectedPollItem);
                          }
                        }}
                        markAsComplete={(data: any) => { this.markAsComplete(data); }}
                        closePopUp={() => { this.setState({ seletctedDeleteId: '', visiblePopup: false }); }}
                        accountid={this.state.accountId} removePollFromTrackList={undefined} />
                    </TouchableOpacity>)
                  }
                  {(this.state.type == 'card' || this.state.type == 'Comment') && (this.state.detail == null ?
                    <View style={{ height: deviceHeight - scaledSize(80), justifyContent: 'center', alignItems: 'center' }}>
                      {!this.state.isCardLoad && <Text style={styles.fontFamilyBold}>{configJSON.cardDeleted}</Text>}
                    </View>
                    :
                    <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({ seletctedDeleteId: '', visiblePopup: false }) }}>
                      <StockDiscription
                        hideCardReportModal={() => {
                          this.setState({ visibleSocialPopUp: false, visibleMenu: false })
                        }}
                        screenKey={10}
                        setCommentCount={(id: any, count: number) => {
                          if (item.id == id) {
                            item.attributes.cmments_count = count;
                            this.setState({ temp: !this.state.temp });
                          }
                        }}
                        removeFromList={(id: any) => { }}
                        navigation={this.props.navigation}
                        gotoFriendPage={(id: any) => this.goToFriendProfilePage(id)}
                        seletctedDeleteId={this.state.seletctedDeleteId}
                        opigo_score={item?.attributes?.opigo_score}
                        item={item}
                        index={0}
                        visiblePopup={this.state.visiblePopup}
                        visiblePopupReport={this.state.visibleMenuReport}
                        setVisiblePopup={() => {
                          if (this.state.seletctedDeleteId != item?.id) {
                            this.setState({ visiblePopup: true, visibleMenuReport: true });
                          } else {
                            this.setState({ visiblePopup: !this.state.visiblePopup, visibleMenuReport: !this.state.visibleMenuReport });
                          }
                          this.setState({ seletctedDeleteId: item?.id });
                        }}
                        hidePopUp={() => { this.setState({ visiblePopup: true, seletctedDeleteId: "" }); }}
                        removeFromTrackList={(id: any) => { }} accountid={undefined} name={""}
                      />
                    </TouchableOpacity>)}
                  {this.state.type == 'channel_card' &&
                    (this.state.detail == null ?
                      <View style={{ height: deviceHeight - scaledSize(80), justifyContent: 'center', alignItems: 'center' }}>
                        {!this.state.isChannelCardLoad && <Text style={styles.fontFamilyBold}>{configJSON.cardDeleted}</Text>}
                      </View>
                      :
                      <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({ seletctedDeleteId: '', visiblePopup: false }) }}>
                        <ChannelStockDiscription
                          hidePopUp={() => { this.setState({ visibleMenu: true, seletctedDeleteId: "" }) }}
                          setCommentCount={(id: any, count: number) => {
                            if (item?.attributes?.id == id) {
                              // if (item?.attributes.comments_count !== null) {
                              //   item?.attributes.comments_count = count;
                              // }
                              this.setState({ temp: !this.state.temp });
                            }
                          }}
                          removeFromList={(id: any) => {
                            this.removeFromList(id, "card");
                          }}
                          navigation={this.props.navigation}
                          item={{
                            id: item?.id,
                            attributes: {
                              description: item?.attributes?.description,
                              current_price: item?.attributes?.current_price,
                              is_like: item?.attributes?.is_like,
                              status: item?.attributes?.status,
                              user_is_tracking_added: item?.attributes?.user_is_tracking_added,
                              account: {
                                id: item?.attributes?.account?.id,
                                attributes: {
                                  opigo_score: item?.attributes?.account?.attributes?.opigo_score,
                                  user_name: item?.attributes?.account?.attributes?.user_name,
                                  first_name: item?.attributes?.account?.attributes?.first_name,
                                  last_name: item?.attributes?.account?.attributes?.last_name,
                                  share_profile_url: item?.attributes?.account?.attributes?.share_profile_url,
                                  opigo_verified: item?.attributes?.account?.attributes?.opigo_verified,
                                }
                              },
                              book_price: item?.attributes?.book_price,
                              price_movement: item?.attributes?.price_movement,
                              stock: {
                                attributes: {
                                  id: item?.attributes?.stock?.attributes?.id,
                                  name: item?.attributes?.stock?.attributes?.name,
                                  symbol: item?.attributes?.stock?.attributes?.symbol,
                                  exchange: item?.attributes?.stock?.attributes?.echange,
                                  stock_company_id: item?.attributes?.stock?.id,
                                  market_cap: item?.attributes?.stock?.attributes?.live_price,
                                }
                              },
                              card_closed_in_days: item?.attributes?.card_closed_in_days,
                              created_at: item?.attributes?.created_at,
                              account_id: item?.attributes?.account_id,
                              market_category: item?.attributes?.market_category,
                              company_name: item?.attributes?.company_name,
                              time_period: item?.attributes?.time_period,
                              overdue: item?.attributes?.overdue,
                              sentiment: item?.attributes?.sentiment,
                              target_price_achieved: item?.attributes?.target_price_achieved,
                              cmments_count: item?.attributes?.comments_count,
                              target_price_max: item?.attributes?.target_price_max,
                              like_count: item?.attributes?.like_count,
                              dislike_count: item?.attributes?.dislike_count,
                              is_dislike: item?.attributes?.is_dislike,
                            },
                          }}
                          showCommentDetail={false}
                          // opigo_score={item?.attributes?.user_detail.data.attributes.opigo_score}
                          seletctedDeleteId={this.state.seletctedDeleteId}
                          visiblePopup={this.state.visibleMenu}
                          visiblePopupReport={this.state.visibleMenuReport}
                          setVisiblePopup={() => {
                            if (this.state.seletctedDeleteId != item?.attributes?.id) {
                              this.setState({ visibleMenu: true, visibleMenuReport: true });
                            } else {
                              this.setState({
                                visibleMenu: !this.state.visibleMenu,
                                visibleMenuReport: !this.state.visibleMenuReport,
                              });
                            }
                            this.setState({ seletctedDeleteId: item?.attributes?.id });
                            // this.getPastCardsList(this.props.route.params.cardId)
                          }}
                          accountid={undefined}
                          name={""}
                        />
                      </TouchableOpacity>
                    )
                  }
                </>
              }
              {this.state.type == 'forum' && (this.state.detail == null ?
                <View style={{ height: deviceHeight - scaledSize(80), justifyContent: 'center', alignItems: 'center' }}>
                  {!this.state.isForamLoad && <Text style={styles.fontFamilyBold}>{configJSON.forumDeleted}</Text>}
                </View>
                :
                <Forums
                  //@ts-ignore
                  setCommentCount={(id: any, count: number) => {
                    if (item.id == id) {
                      item.attributes.answer_count = count
                      this.setState({ temp: !this.state.temp })
                    }
                  }}
                  from={'notification'}
                  index={0}
                  removeFromList={(id: any) => { this.setState({ detail: null }) }}
                  navigation={this.props.navigation}
                  item={item}
                  showCommentDetail={true}
                  opigo_score={item?.attributes?.opigo_score}
                  seletctedDeleteId={this.state.seletctedDeleteId}
                  visiblePopup={this.state.visibleForumMenu}
                  setVisiblePopup={() => {
                    if (this.state.seletctedDeleteId != item?.id) {
                      this.setState({ visibleForumMenu: true })
                    } else {
                      this.setState({ visibleForumMenu: !this.state.visibleForumMenu })
                    }
                    this.setState({ seletctedDeleteId: item?.id })
                  }}
                />
              )}
              <TouchableWithoutFeedback
                testID="Background"
                onPress={() => { Keyboard.dismiss(), this.hideKeyboard() }}
                style={{ backgroundColor: 'red', flex: 1 }}>
                <>
                  {this.state.isLoading ?
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <ActivityIndicator color={colors.blue} size='large' />
                    </View>
                    : <>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                          Keyboard.dismiss(),
                            this.setState({ replyId: '', replyItem: {}, isShow: false })
                        }}
                        style={[styles.comment_container]}>
                        {this.displayComments()}
                      </TouchableOpacity>
                    </>}
                </>
              </TouchableWithoutFeedback>
            </View>
          </ScrollView>
          <TouchableOpacity
            activeOpacity={1} style={[styles.bottom_textinput_container]}>
            <View style={styles.bottom_row}>
              {!this.state.isLoading &&
                <MentionInput
                  allowFontScaling={false}
                  inputRef={(ref: any) => this.refss = ref}
                  value={this.state.comment}
                  style={[styles.textInput, { width: this.state.width }]}
                  onChange={(caption: any) => { this.hendleTag(caption) }}
                  onFocus={() => { this.setState({ isShow: true }) }}
                  onBlur={() => { this.setState({ isShow: false }) }}
                  placeholderTextColor={colors.lightGray}
                  placeholder={configJSON.placeholderText}
                  maxLength={150}
                  multiline={true}
                  containerStyle={styles.mentionContainer}
                  partTypes={[
                    {
                      trigger: '@', // Should be a single character like '@' or '#'
                      renderSuggestions: this.renderSuggestions,
                      isInsertSpaceAfterMention: true,
                      textStyle: { color: 'rgb(0,114,211)' }, // The mention style in the input
                    },
                  ]}
                />}
            </View>
            <View style={[styles.bottom_row, { maxWidth: scaledSize(110) }]}>
              <View style={{ alignItems: 'flex-end', alignSelf: 'flex-end' }}>
                {this.state.isCommentLoading ? <ActivityIndicator color={colors.blue} style={{ padding: scaledSize(7), alignSelf: 'flex-end' }} /> :
                  <TouchableOpacity
                    onPress={() => { this.handleSendComment() }}
                    style={[styles.send_view, { alignSelf: 'flex-end' }]}>
                    <FontAwesome
                      name={icons.paper_plane}
                      size={15}
                      color={colors.white}
                    />
                  </TouchableOpacity>}
                {normalCaption?.length > 0 && <Text style={styles.count}>{`${normalCaption?.length >= 150 ? '150' : normalCaption?.length}/150`}</Text>}
              </View>
            </View>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
        <SafeAreaView />
        <DeletePollModal
          isLoading={this.state.deleteCommentLoading}
          onDelete={() => { this.state.type == 'Forum' ? this.deleteCommentForum(this.state.deleteId) : this.deleteComment(this.state.deleteId, this.state.deleteAccountId) }}
          visible={this.state.visibleModal}
          onCancel={() => this.setState({ visibleModal: false, deleteCommentLoading: false })}
          title={configJSON.deleteModalTitle}
        />
        <SafeAreaView />
      </>
      // Customizable Area End
    );
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
  comment_container: {
    flex: 1
  },
  comments_view_row: {
    flexDirection: 'row',
    padding: scaledSize(10),
    marginBottom: 10,
    backgroundColor: colors.white,
    borderRadius: scaledSize(10)
  },
  profileView: {
    width: widthFromPercentage(10),
    height: widthFromPercentage(10),
    borderRadius: scaledSize(360),
    borderColor: colors.blue,
    borderWidth: scaledSize(1),
    justifyContent: "center",
    alignItems: "center",
  },
  profile: {
    width: widthFromPercentage(8),
    height: widthFromPercentage(8),
    borderRadius: scaledSize(360),
    backgroundColor: colors.lightGray
  },
  id_view: {
    backgroundColor: "#1377DF",
    borderRadius: scaledSize(10),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: scaledSize(-14),
    paddingLeft: scaledSize(5),
    paddingRight: scaledSize(5),
    paddingTop: scaledSize(2),
    paddingBottom: scaledSize(2)
  },
  id_txt: {
    color: "#fff",
    fontSize: scaledSize(8),
  },
  veified: {
    width: widthFromPercentage(3),
    height: widthFromPercentage(3),
  },
  verified_view: {
    width: widthFromPercentage(5),
    height: widthFromPercentage(5),
    backgroundColor: colors.white,
    borderRadius: scaledSize(360),
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -8,
    right: -8,
    elevation: 5,
  },
  time: {
    color: colors.gray,
    fontSize: scaledSize(10),
    marginTop: scaledSize(10)
  },
  bottom_textinput_container: {
    marginBottom: 0,
    marginLeft: scaledSize(20),
    marginRight: scaledSize(20),
    padding: scaledSize(10),
    borderRadius: scaledSize(18),
    backgroundColor: colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    bottom: scaledSize(20),
    width: '90%',
    alignSelf: 'center',
  },
  bottom_row: {
    flexDirection: "row",
    alignItems: "center",
  },
  send_view: {
    width: widthFromPercentage(9),
    height: widthFromPercentage(9),
    borderRadius: scaledSize(8),
    backgroundColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: scaledSize(10),
  },
  textInput: {
    fontSize: scaledSize(12),
    marginLeft: scaledSize(10),
    padding: 0,
    width: widthFromPercentage(50),
  },
  userName: {
    fontSize: scaledSize(13),
    textTransform: 'none'
  },
  bottom_card_row: {
    flexDirection: 'row'
  },
  replayDelete_view: {
    marginLeft: scaledSize(20)
  },
  viewReply_txt: {
    marginLeft: scaledSize(25),
    fontSize: scaledSize(10),
    color: colors.blue,
    marginTop: scaledSize(10)
  },
  reply_container: {
    paddingTop: scaledSize(10),
    flexDirection: 'row'
  },
  mentionContainer: {
    minHeight: scaledSize(20),
    maxHeight: 200,
    backgroundColor: colors.white,
    borderRadius: scaledSize(10),
    maxWidth: deviceWidth - scaledSize(110),
    marginBottom: scaledSize(5)
  },
  count: {
    // color:colors.white,
    fontSize: scaledSize(11),
    marginTop: scaledSize(5),
  }
});
// Customizable Area End
export default NotificationPost
