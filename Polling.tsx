// Customizable Area Start
import {
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  Animated,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  ToastAndroid,
  Dimensions,
  TouchableHighlight,
  Linking,
  KeyboardAvoidingView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import PollingController, { Props, configJSON } from "./PollingController";
import React from "react";
import InfoModal from "./screens/Components/InfoModal";
import ExploreCard from "../../GroupChat/src/Explore/exploreCard";
import { righticon } from "../../GroupChat/src/assets";
//Components
import TopBar from "../../../components/src/Topbar/TopBar";
import { Fonts } from "../../../components/src/Utils/Fonts";
import TopScorer from "../component/TopScorer";
import SocilaPost from "../../../components/src/SocialPost/socialPost";
import Polls from "../../../components/src/Polls/Polls";
import StockDiscription from "../../../components/src/StockDiscription";
import ProfilePic from "../../../components/src/ProfilePic";
import CardFilterModal, { FilterItem } from "../../../components/src/Modals/CardFilterModal";
import { filter } from "../../../components/src/assets";
import TopHomeBar from "../../../components/src/TopHomeBar";
import CustomModal from "../../../components/src/CustomModal";
import ImageSlider from "../../../components/src/ImageSlider";
import { listOfPollType, nFormatter, setEvent } from "../../../components/src/Utils/service";
//framework
import { deviceHeight, scaledSize } from "../../../framework/src/Utilities";
//library
import Toast from "react-native-simple-toast";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialIcons'
import AsyncStorage from "@react-native-community/async-storage";
//colors
import colors from "../../../blocks/GroupChat/src/colors"
//assets
import { profile, rankingImage, walletImage } from "./assets";
import { BlurView } from "@react-native-community/blur";
// Customizable Area End
const { height } = Dimensions.get('screen');
class Polling extends PollingController {
  constructor(props: Props) {
    super(props);
    //@ts-ignore
    Text.defaultProps.allowFontScaling = false;
  }

  // Customizable Area Start
  renderFooter = () => (
    <View >
      {this.state.isLoadMore && <ActivityIndicator color={colors.blue} />}
    </View>
  )

  displaystory = () => {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={this.state.topScoreList}
        horizontal={true}
        renderItem={({ item, index }: { item: any, index: number }) => {
          return (
            //@ts-ignore
            <TopScorer
              goToFriendProfilePage={() => this.goToFriendProfilePage(item.id)}
              item={item}
              isThisMyProfile={item.isMyProfile}
              index={index + 1}
            />
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  renderSuggestedProfiles = () => {
    return (
      <View>
        {
          this.state.suggestedProfiles?.length > 0 &&
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: scaledSize(5) }}>
            <Text style={{ alignSelf: 'center', fontSize: scaledSize(15) }}>Suggested for you</Text>
          </View>
        }
        <FlatList
          data={this.state.suggestedProfiles}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const { data } = item
            return <View style={{ height: scaledSize(160), width: scaledSize(140), backgroundColor: colors.white, marginLeft: scaledSize(5), marginTop: scaledSize(10), marginBottom: scaledSize(15), borderRadius: scaledSize(15), marginRight: scaledSize(5), flex: 1 }}>
              <TouchableOpacity onPress={() => this.goToFriendProfilePage(item.id)} style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
                <ProfilePic
                  onPress={() => this.goToFriendProfilePage(item.id)}
                  opigo_verified={item.attributes.opigo_verified}
                  opigo_verifiedFromContext={false}
                  disabled={false}
                  profilePic={item.attributes.profile}
                  score={nFormatter(item.attributes.opigo_score)}
                  scoreStyle={undefined}
                  verifiedStyle={undefined}
                />
              </TouchableOpacity>
              <View style={{ flex: 2, marginBottom: scaledSize(5) }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text numberOfLines={1} style={{ fontSize: scaledSize(15), textAlign: 'center', fontWeight: '600' }}>{item.attributes.first_name} {item.attributes.last_name}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <TouchableOpacity disabled={this.state.followUnfollowBtnDisabled} onPress={() =>
                    this.onPressFollowUnfollow(item.attributes.is_follow, item.id, item?.attributes?.opigo_score)
                  } style={{ width: scaledSize(80), backgroundColor: item.attributes.is_follow ? colors.lightGray : colors.blue, borderRadius: scaledSize(4) }}>
                    <Text style={{ textAlign: 'center', color: item.attributes.is_follow ? colors.black : colors.white, paddingBottom: scaledSize(1), paddingTop: scaledSize(1) }}>{item.attributes.is_follow ? 'Unfollow' : 'Follow'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }
          }
        />
      </View >
    )
  }

  renderSyncContact = () => {
    return (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: scaledSize(5) }}>
          <Text style={{ alignSelf: 'center', fontSize: scaledSize(15) }}>People you know</Text>
          <Text onPress={() => this.doNavigateToContacts()} style={{ color: colors.blue, alignSelf: 'center', fontSize: scaledSize(15) }}>Sync Contacts</Text>
        </View>
        <View style={{ backgroundColor: colors.white, marginLeft: scaledSize(5), marginTop: scaledSize(10), marginBottom: scaledSize(15), borderRadius: scaledSize(15), marginRight: scaledSize(5), flex: 1 }}>
          {this.state.contactsList.length === 0 ?
            <View style={{ flex: 3, marginBottom: scaledSize(5) }}>
              <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
                <Text style={{ fontWeight: 'bold', fontSize: scaledSize(15), textAlign: 'center' }}>Find People to follow</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center', paddingRight: "12%", paddingLeft: '12%', marginTop: 20, marginBottom: 20 }}>
                <Text style={{ fontSize: scaledSize(15), textAlign: 'center', fontWeight: '600' }}>To help users connect on OpiGo, you can sync your contacts and follow your circle</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <TouchableOpacity onPress={() => { this.doNavigateToContacts() }} style={{ backgroundColor: colors.blue, borderRadius: scaledSize(4) }}>
                  <Text style={{ fontSize: scaledSize(15), fontWeight: '800', textAlign: 'center', paddingBottom: scaledSize(5), paddingTop: scaledSize(5), paddingLeft: scaledSize(20), paddingRight: scaledSize(20), color: colors.white }}>{'Sync Contacts'}</Text>
                </TouchableOpacity>
              </View>
            </View> : <FlatList
              data={this.state.contactsList}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => {
                const { id, attributes } = item;
                const {
                  first_name,
                  middle_name,
                  last_name,
                  is_exist,
                  account,
                  is_follow,
                } = attributes;
                let displayName =
                  is_exist && account
                    ? `${account.data.attributes.first_name} ${account.data.attributes.last_name
                    }`
                    : `${first_name} ${last_name}`;
                let isFollowing = is_follow;
                let account_ids: any = [];
                if (is_exist && account) {
                  account_ids.push(parseInt(account.data.id));
                }
                return <View style={{ height: scaledSize(160), width: scaledSize(140), backgroundColor: colors.white, marginLeft: scaledSize(5), marginTop: scaledSize(10), marginBottom: scaledSize(15), borderRadius: scaledSize(15), marginRight: scaledSize(5), flex: 1 }}>
                  <TouchableOpacity onPress={() => this.goToFriendProfilePage(id)} style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
                    <ProfilePic
                      onPress={() => this.goToFriendProfilePage(id)}
                      opigo_verified={item.attributes.opigo_verified}
                      opigo_verifiedFromContext={false}
                      disabled={false}
                      profilePic={item.attributes.profile}
                      score={nFormatter(item.attributes.opigo_score)}
                      scoreStyle={undefined}
                      verifiedStyle={undefined}
                    />
                  </TouchableOpacity>
                  <View style={{ flex: 2, marginBottom: scaledSize(5) }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <Text numberOfLines={1} style={{ fontSize: scaledSize(15), textAlign: 'center', fontWeight: '600' }}>{first_name} {last_name}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                      <TouchableOpacity disabled={this.state.followUnfollowBtnDisabled} onPress={() => { this.onPressFollowUnfollow(is_follow, id) }} style={{ width: scaledSize(80), backgroundColor: is_follow ? colors.lightGray : colors.blue, borderRadius: scaledSize(4) }}>
                        <Text style={{ textAlign: 'center', color: is_follow ? colors.black : colors.white, paddingBottom: scaledSize(1), paddingTop: scaledSize(1) }}>{is_follow ? 'Unfollow' : 'Follow'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              }}
            />}
        </View>
      </View >
    )
  }

  header = (title: string, data: any) => {
    return (<View style={[styles.header]}>
      <Text style={[styles.headerTitle, styles.fontFamilyMedium]}>{title}</Text>
      <TouchableOpacity onPress={() => {
        setEvent(title == "Blogs" ? "blogs view all" : "shot view all", {
          "screen": "home"
        }), this.props.navigation.navigate("ExploreDetail", { detail: data, type: title })
      }}>
        <Image source={righticon} style={{ height: 20, width: 20 }} />
      </TouchableOpacity>
    </View>)
  }

  //Cart Item
  _cardItem = ({ data, index }: any) => {
    return (<View
      key={index}>
      <StockDiscription
        hideCardReportModal={() => {
          this.setState({ visibleSocialPopUp: false, visibleMenu: false })
        }}
        key={index}
        screenKey={1}
        setCommentCount={(id: any, count: number) => {
          if (data.id == id) {
            data.attributes.cmments_count = count;
            this.setState({ temp: !this.state.temp });
          }
        }}
        removeFromList={(id: any) => { this.removeFromList(id, "card"); }}
        navigation={this.props.navigation}
        gotoFriendPage={(id: any) => this.goToFriendProfilePage(id)
        }
        seletctedDeleteId={this.state.seletctedDeleteId}
        opigo_score={data.attributes.user_detail.data.attributes.opigo_score}
        item={data}
        index={index}
        visiblePopup={this.state.visibleMenu}
        setVisiblePopup={() => {
          if (this.state.seletctedDeleteId != data.id) {
            this.setState({ visibleMenu: true, visibleMenuReport: true });
          } else {
            this.setState({ visibleMenu: !this.state.visibleMenu, visibleMenuReport: !this.state.visibleMenuReport });
          }
          this.setState({ seletctedDeleteId: data.id });
        }}
        visiblePopupReport={this.state.visibleMenuReport}
        hidePopUp={() => { this.setState({ visibleMenu: true, seletctedDeleteId: "" }); }}
        removeFromTrackList={(id: any) => this.removePostFromTrackList(id)}
      />
      {(index != 0 && index % 7 == 0 && index % 7 == 0 && this.state.suggestedProfiles.length != 0) || (index == 2 && this.state.suggestedProfiles.length != 0) || (this.state.HomeItemList.length < 7 && index == this.state.HomeItemList.length - 1 && this.state.suggestedProfiles.length != 0) ?
        this.renderSuggestedProfiles()
        : null}
    </View>
    )
  }
  //Cart Item
  _pollItem = ({ data, index }: any) => {
    return (
      <View>
        <Polls
          hidePollReportModal={() => {
            this.setState({ visibleSocialPopUp: false, visibleMenu: false })
          }}
          key={index}
          setCommentCount={(id: any, count: number) => {
            if (data.id == id) {
              data.attributes.cmments_count = count;
              this.setState({ temp: !this.state.temp });
            }
          }}
          index={index}
          navigation={this.props.navigation}
          removeFromList={(id: string) => {
            this.removeFromList(id, "poll");
          }}
          opigo_score={data.attributes.user_detail.data.attributes.opigo_score}
          item={data}
          profile={null}
          self={false}
          visiblePopUp={this.state.visiblePopup}
          visiblePopUpForReport={this.state.visiblePopupReports}
          visibleItem={this.state.seletctedDeleteId}
          setVisiblePopup={() => {
            this.setState({ seletctedDeleteId: data.id });
            if (this.state.seletctedDeleteId != data.id) {
              this.setState({ visiblePopup: true, visiblePopupReports: true });
            } else {
              this.setState({ visiblePopup: !this.state.visiblePopup, visiblePopupReports: !this.state.visiblePopupReports });
            }
          }}
          loading={this.state.submitLoading}
          onSubmitAns={(poll_type: any, poll_stocks_length: any, selectedPoll: any,
            selectedPollItem: any, ansForMultipleStock: any, ansForCustomPoll: any) => {
            console.log(poll_type, poll_stocks_length, selectedPoll,
              selectedPollItem, ansForMultipleStock, ansForCustomPoll);
            let customPollItem: any = []
            let customPollData = data?.attributes?.poll_stocks?.data
            customPollData.map((item: any) => {
              customPollItem.push(item?.attributes?.stock?.name)
            })
            if (poll_type == listOfPollType[2].key) {
              this.setState({ selectedPoll: selectedPollItem });
              if (poll_stocks_length == ansForMultipleStock.length) {
                this.submitPollAnswer(poll_type, selectedPollItem, ansForMultipleStock);
                console.log("poll_type, selectedPollItem, ansForMultipleStock", poll_type, selectedPollItem, ansForMultipleStock);
                setEvent("poll engagement", {
                  "option selected": selectedPollItem,
                  "total options": poll_stocks_length,
                  "poll creator": data?.attributes?.user_detail?.data?.attributes?.first_name +
                    " " +
                    data?.attributes?.user_detail?.data?.attributes?.last_name,
                  "stocks": customPollItem.toString(),
                  "poll type": poll_type,
                  "poll text": `Rank the below ${data?.attributes?.poll_stocks?.data[0]?.attributes?.market_detail_of_stock?.category == "crypto"
                    ? "cryptos"
                    : "stocks"
                    } from Bullish to Bearish` + `For ` + this.listOfTimeHorizone[data?.attributes?.time_frame] + ` Time Frame`,
                  "option ranking": data?.attributes?.new_response_by_percentage,
                })
              } else {
                Toast.show(
                  'Please Select All The Stocks',
                  Toast.SHORT,
                  ["UIAlertController"]
                );
              }
            }
            else if (poll_type == listOfPollType[3].key) {
              this.setState({ selectedPoll: selectedPoll });
              this.submitPollAnswer(poll_type, selectedPoll, ansForCustomPoll);
              console.log("poll_type, selectedPoll, ansForCustomPoll", poll_type, selectedPoll, ansForCustomPoll);

              setEvent("poll engagement", {
                "option selected": selectedPoll,
                "total options": poll_stocks_length,
                "poll creator": data?.attributes?.user_detail?.data?.attributes?.first_name +
                  " " +
                  data?.attributes?.user_detail?.data?.attributes?.last_name,
                "stocks": customPollItem.toString(),
                "poll type": poll_type,
                "poll text": data?.attributes?.question,
                "option ranking": data?.attributes?.new_response_by_percentage,
              })
            }
            else {
              this.setState({ selectedPoll: selectedPoll });
              this.submitPollAnswer(poll_type, selectedPoll, selectedPollItem);
              console.log("poll_type, selectedPoll, selectedPollItem", poll_type, selectedPoll, selectedPollItem);
              setEvent("poll engagement", {
                "option selected": selectedPollItem,
                "total options": poll_stocks_length,
                "poll creator": data?.attributes?.user_detail?.data?.attributes?.first_name +
                  " " +
                  data?.attributes?.user_detail?.data?.attributes?.last_name,
                "stocks": customPollItem.toString(),
                "poll type": poll_type,
                "poll text": `${data?.attributes?.data?.investment_type}` + `For ` + this.listOfTimeHorizone[data?.attributes?.time_frame] + ` Time Frame`,
                "option ranking": data?.attributes?.new_response_by_percentage,
              })
            }
          }}
          markAsComplete={(data: any) => { this.markAsComplete(data); }}
          closePopUp={() => { this.setState({ seletctedDeleteId: '', visiblePopup: false }); }}
          accountid={this.state.accountid}
          removePollFromTrackList={(id: any) => this.removePollFromTrackList(id)}
        />
        {(index != 0 && index % 7 == 0 && this.state.suggestedProfiles.length != 0) || (index == 2 && this.state.suggestedProfiles.length != 0) || (this.state.HomeItemList.length < 7 && index == this.state.HomeItemList.length - 1 && this.state.suggestedProfiles.length != 0) ?
          this.renderSuggestedProfiles()
          : null}
      </View>)
  }
  //Cart Item
  _socialItem = ({ data, index }: any) => {
    const { user_detail } = data.attributes
    let { first_name, last_name, opigo_verified, profile, opigo_score, opigo_verified_type } = user_detail.data.attributes
    return (
      <View>
        <SocilaPost
          key={index}
          verified={opigo_verified}
          setCommentCount={(id: any, count: number) => {
            if (data.id == id) {
              data.attributes.cmments_count = count
              this.setState({ temp: !this.state.temp })
            }
          }}
          setVisiblePopup={() => {
            if (this.state.seletctedDeleteId != data.id) {
              this.setState({ visibleSocialPopUp: true })
            } else {
              this.setState({ visibleSocialPopUp: !this.state.visibleSocialPopUp })
            }
            this.setState({ seletctedDeleteId: data.id })
          }}
          hideReportModal={() => {
            this.setState({ visibleSocialPopUp: false, visibleMenu: false })

          }}
          visiblePopUp={this.state.visibleSocialPopUp}
          socialData={data}
          index={index}
          profile={profile}
          fullName={`${first_name} ${last_name}`}
          opigo_score={opigo_score}
          accountId={this.state.accountid}
          deletePost={(id: any) => this.deletePost(id)}
          goToFriendProfilePage={(id: any) => {
            if (this.state.seletctedDeleteId != data.id) {
              this.goToFriendProfilePage(id)
            } else {
              this.setState({ visiblePopup: false })
            }
          }}
          navigation={this.props.navigation}
          isShowMenu={this.state.accountid == data.attributes.user_detail.data.id ? true : false}
          hidePopUp={() => { this.setState({ visibleSocialPopUp: false }) }}
          playid={this.state.playid}
          pause={this.state.pause}
          onClickVideo={(url: any) => this.onClickVideo(url)}
          userId={data.data?.attributes?.user_detail?.data.id}
          volume={this.state.volume}
          onClickVolume={(url: any) => this.onClickVideoVolume(url)}
          page={"Dashboard"}
          removeFromList={(id: any) => this.removeFromList(id, "post")}
          setDeleteId={(id: any) => this.setState({ seletctedDeleteId: id })}
          seletctedDeleteId={this.state.seletctedDeleteId}
          showMoreClickId={(id: any) => this.setState({ showMoreId: id })}
          showMoreId={this.state.showMoreId}
          opigo_verified_type={opigo_verified_type}
        />
        {(index != 0 && index % 7 == 0 && this.state.suggestedProfiles.length != 0) || (index == 2 && this.state.suggestedProfiles.length != 0) || (this.state.HomeItemList.length < 7 && index == this.state.HomeItemList.length - 1 && this.state.suggestedProfiles.length != 0) ?
          this.renderSuggestedProfiles()
          : null}
      </View>
    )
  }
  // Customizable Area End

  renderBlog = () => {
    return (<>
      {this.header("Blogs", this.state.blogs)}
      <FlatList
        horizontal
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={this.state.blogs}
        contentContainerStyle={{ paddingHorizontal: scaledSize(20) }}
        renderItem={this._renderBlogItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </>)
  }
  _renderBlogItem = ({ item, index }: { item: any, index: number }) => {
    return (
      //@ts-ignore
      <ExploreCard item={item} from={'explore'} index={index} showAuthor={true} navigation={this.props.navigation} screenId={1} />
    )
  }
  _renderRecentSearch = ({ item, index }: { item: any, index: number }) => {
    let items = item.attributes
    return (
      <View key={index}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.expanded_list,
          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
          onPress={() => {
            this.hideKeyboard();
            this.navigate(item, 'recent')
          }}>
          {items.searchable_type == "StockCompany" ?
            <View style={{ flexDirection: 'row', paddingVertical: scaledSize(3), alignItems: "center", flex: 2.1, }}>
              <MaterialCommunityIcons style={{ marginRight: scaledSize(10) }} name="history" size={25} />
              <Text style={{ fontFamily: Fonts.REGULAR, paddingVertical: scaledSize(12), fontSize: scaledSize(13), }}>{`${items?.search_result_details.name} (${items?.search_result_details.symbol})`}</Text>
            </View>
            : <View style={{ flexDirection: 'row', paddingVertical: scaledSize(7), alignItems: "center", flex: 1, marginRight: 25 }}>
              <Image style={[styles.avtar, { marginRight: scaledSize(10) }, items?.search_result_details?.profile && { backgroundColor: colors.blue }]}
                source={items?.search_result_details?.profile ? { uri: items?.search_result_details?.profile } : profile}
              />
              <Text
                style={styles.recentUser}>
                {items?.search_result_details?.first_name + " " + items?.search_result_details?.last_name}
              </Text>
            </View>}
          {items.searchable_type == "StockCompany" && <View style={{ marginLeft: 25, paddingLeft: scaledSize(10), flex: 1 }}>
            <TouchableOpacity
              style={{ alignSelf: 'flex-end' }}
              onPress={() => {
                if (items.search_result_details.is_track == false) {
                  if (Platform.OS === 'android') {
                    ToastAndroid.show("Stock added to your watchlist", ToastAndroid.SHORT)
                  }
                  else {
                    Toast.show("Stock added to your watchlist", Toast.SHORT)
                  }
                  setEvent("stock added to watchlist", {
                    "screen": "home"
                  })
                  this.handleRecentBookMark(items?.searchable_id, index)
                } else {
                  this.removeBookMark(items?.searchable_id, index)
                  if (Platform.OS === 'android') {
                    ToastAndroid.show("Stock removed from your track watchlist", ToastAndroid.SHORT)
                  }
                  else {
                    Toast.show("Stock removed from your track watchlist", Toast.SHORT)
                  }
                }
              }}>
              {
                items.search_result_details.is_track ? <Image source={require('./bookmark_48.png')} style={{ height: 16, width: 16, tintColor: colors.blue }} /> : <Image source={require('./bookmark.png')} style={{ height: 16, width: 16, tintColor: colors.black }} />
              }
            </TouchableOpacity>
            <Text numberOfLines={1} style={{ fontFamily: Fonts.MEDIUM, fontSize: scaledSize(13), paddingTop: scaledSize(8), alignSelf: 'flex-end' }}>{items.search_result_details.exchange}</Text>
          </View>
          }
        </TouchableOpacity>
        {this.state.selectedTab == 'All' ?
          this.state.recentAllDetail.length - 1 != index && <View style={{ height: 0.5, backgroundColor: colors.lightGray, width: '100%' }} />
          : this.state.selectedTab == 'Users' ?
            this.state.recentUserDetail.length - 1 != index && <View style={{ height: 0.5, backgroundColor: colors.lightGray, width: '100%' }} />
            : this.state.recentstockDetail.length - 1 != index && <View style={{ height: 0.5, backgroundColor: colors.lightGray, width: '100%' }} />}
      </View>)
  }

  _searchStock = ({ item, index }: { item: any, index: number }) => {
    let items = item.attributes
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.expanded_list,
          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
          ]}
          onPress={() => {
            this.hideKeyboard()
            this.navigate(item, 'stock')
          }}>
          {item.type == "stock_company" ?
            <View style={{ flexDirection: 'row', paddingVertical: scaledSize(5), alignItems: "center", flex: 2.1 }}>
              <View style={{ width: 25 }} />
              <Text style={{ fontFamily: Fonts.REGULAR, paddingVertical: scaledSize(12), fontSize: scaledSize(12), marginLeft: scaledSize(10) }}>{`${items?.stock_details.name} (${items?.stock_details.symbol})`}</Text>
            </View> :
            <View style={{ flexDirection: 'row', paddingVertical: scaledSize(7), alignItems: "center", flex: 1, marginRight: 25 }}>
              <Image style={[styles.avtar, { marginRight: scaledSize(10) }, items?.profile && { backgroundColor: colors.blue }]}
                source={items?.profile ? { uri: items?.profile } : profile}
              />
              <Text style={{ fontFamily: Fonts.REGULAR, fontSize: scaledSize(12), textTransform: 'none' }}>{items.first_name + " " + items.last_name}</Text>
            </View>
          }
          {items?.stock_details?.category == "stock" && <View style={{ marginLeft: 25, paddingLeft: scaledSize(10), flex: 1 }}>
            <TouchableOpacity
              // disabled={this.state.isTrackAdding}
              style={{ alignSelf: 'flex-end' }}
              onPress={() => {
                if (items.stock_details.is_track) {
                  if (Platform.OS === 'android') {
                    ToastAndroid.show("Stock removed from your track watchlist", ToastAndroid.SHORT)
                  }
                  else {
                    Toast.show("Stock removed from your track watchlist", Toast.SHORT)
                  }
                  this.removeStockBookMark(item?.id, index)
                } else {
                  if (Platform.OS === 'android') {
                    ToastAndroid.show("Stock added to your watchlist", ToastAndroid.SHORT)
                  }
                  else {
                    Toast.show("Stock added to your watchlist", Toast.SHORT)
                  }
                  this.handleBookMark(item?.id, index)
                }
              }}>
              {
                items.stock_details?.is_track ? <Image source={require('./bookmark_48.png')} style={{ height: 16, width: 16, tintColor: colors.blue }} /> : <Image source={require('./bookmark.png')} style={{ height: 16, width: 16, tintColor: colors.black }} />
              }
            </TouchableOpacity>
            <Text numberOfLines={1} style={{ fontFamily: Fonts.MEDIUM, marginTop: scaledSize(5), fontSize: scaledSize(12), alignSelf: 'flex-end' }}>{items?.stock_details?.exchange}</Text>
          </View>}
        </TouchableOpacity>
        {this?.state?.selectedTab == 'All' ?
          this?.state?.usersDetail?.length + this?.state?.stockDetail?.length - 1 != index && <View style={{ height: 0.5, backgroundColor: colors.lightGray, width: '100%' }} />
          : this?.state?.selectedTab == 'Users' ?
            this?.state?.usersDetail?.length - 1 != index && <View style={{ height: 0.5, backgroundColor: colors.lightGray, width: '100%' }} />
            : this?.state?.stockDetail?.length - 1 != index && <View style={{ height: 0.5, backgroundColor: colors.lightGray, width: '100%' }} />}
      </>)
  }

  renderDiscount = (ads: any) => {
    let images = ads.map((item: any) => { return item.attributes.img })
    return (<>
      <View style={{ marginTop: scaledSize(6), flexGrow: 0, backgroundColor: colors.offWhite, borderRadius: scaledSize(15), marginHorizontal: scaledSize(17) }}>
        <ImageSlider
          //@ts-ignore
          autoPlayFlag={true}
          autoPlayWithInterval={3000}
          style={{ backgroundColor: colors.bgColor, borderRadius: scaledSize(15) }}
          images={ads}
          imagesWidth={Dimensions.get('screen').width - scaledSize(34)}
          customSlide={({ index, item, style, width }: any) => {
            return <View key={index} style={[style, styles.discount, { marginRight: images.length - 1 === index ? scaledSize(0) : scaledSize(0) }]}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setEvent("promo clicked", {
                    "promo name": item.attributes?.expl_type
                  })
                  this.openLink(item.attributes?.ref_link)
                }}>
                <Image source={{ uri: item.attributes.img }} style={styles.discount} />
              </TouchableOpacity>
            </View>
          }}
          customButtons={(position, move) => (
            <View style={{
              zIndex: 1,
              height: 15,
              marginTop: scaledSize(10),
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
              {ads.map((image: any, index: number) => {
                return (
                  <TouchableHighlight
                    key={index}
                    underlayColor="#ccc"
                    onPress={() => move(index)}

                  >
                    <View style={index === position ? styles.buttonSelected : styles.button} />
                  </TouchableHighlight>
                );
              })}
            </View>
          )}
        />
      </View>
    </>)
  }

  renderDiscountBanner = (ads: any) => {
    let images = ads.map((item: any) => { return item.attributes.img })
    return (<>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: 'rgba(0, 0, 0, -0.2)', marginHorizontal: scaledSize(17) }}>
        <ImageSlider
          autoPlayFlag={true}
          autoPlayWithInterval={3000}
          style={{
            backgroundColor: 'rgba(0, 0, 0, -0.2)',

          }}

          images={ads}
          imagesWidth={Dimensions.get('screen').width - scaledSize(34)}
          customSlide={({ index, item, style, width }: any) => {
            return (
              <View key={index} style={[{
                alignItems: "flex-end", justifyContent: "flex-end"
              }]}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setEvent("promo clicked", {
                      "promo name": item.attributes?.expl_type
                    })
                    this.openLink(item.attributes?.ref_link)
                  }}>
                  <Image source={{ uri: item.attributes.img }} style={{
                    width: Dimensions.get('screen').width - scaledSize(34),
                    height: scaledSize(150),
                    backgroundColor: "rgba(0, 0, 0, -0.2)",
                    borderRadius: scaledSize(15),
                  }} />
                </TouchableOpacity>
              </View>)
          }}
          customButtons={(position, move) => (
            <View style={{
              flex: 1,
              marginTop: scaledSize(10),
              justifyContent: 'center',
              alignItems: 'flex-start',
              flexDirection: 'row',
            }}>
              {ads.map((image: any, index: number) => {
                return (
                  <TouchableHighlight
                    key={index}
                    underlayColor="#ccc"
                    onPress={() => move(index)}
                  >
                    <View style={index === position ? styles.buttonSelected : styles.button} />
                  </TouchableHighlight>
                );
              })}
            </View>
          )}
        />
      </View >

    </>)
  }

  _renderDiscount = ({ item, index, }: { item: any, index: number, }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          this.openLink(item.attributes?.ref_link)
        }}
        style={{}}>
        <Image source={{ uri: item.attributes.img }} style={styles.discount} />
      </TouchableOpacity>
    )
  }

  _renderCard = (item: any, index: number, showAuthor: boolean) => {
    let numOfLines = 0
    return (
      //@ts-ignore
      <ExploreCard item={item} from={'explore'} index={index} showAuthor={showAuthor} navigation={this.props.navigation} screenId={1} />
    )
  }

  openLink = async (url: any) => {
    Linking.canOpenURL(url).then(value => {
      Linking.openURL(url)
    }).catch(error => {
      Toast.showWithGravity(error.message, Toast.SHORT, Toast.TOP)
    })
  }

  slider = (title: string, data: any, type?: string) => {
    return (
      <>
        {this.header(title, data)}
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{ paddingHorizontal: scaledSize(20) }}
          data={data}
          renderItem={({ item, index }: { item: any, index: number }) => {
            if (type == 'odd') {
              if (index % 2 != 0)
                return (
                  this._renderCard(item, index, true)
                )
            }
            else {
              return (
                this._renderCard(item, index, true)
              )
            }
          }}
          keyExtractor={(item, index) => index.toString()}
        /></>
    )
  }

  render() {
    return (
      // Customizable Area Start
      <SafeAreaView style={{ flex: 1 }}>
        {/* <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        > */}

        <TouchableOpacity activeOpacity={1}
          style={{ flex: 1 }}
          onPress={() => { this.setState({ visibleSocialPopUp: false, visibleMenu: false }) }}
        >
          <TopBar topBarKey={2} notificationCount={this.state.notificationCount} navigation={this.props.navigation} onPress={() => {
            setEvent("search clicked", {
              "screen": "home"
            })
            this.setState({ searchVisible: true })
            this.getRecentSearch()
            this.decreaseHeight()
            this.setState({ isFocus: true })
            setTimeout(() => {
              this.ref.focus()
            }, 100);
          }}
          />

          {/* Customizable Area Start */}
          <>
            {this.state.isLoading ?
              (
                <>
                  {/* <TopBar navigation={this.props.navigation} topBarKey={2} />
                  <View style={{ marginVertical: 25, marginBottom: 20 }}>
                    <TopHomeBar navigation={this.props.navigation} />
                  </View> */}
                  <View style={styles.activityIndicator}>
                    <ActivityIndicator size={"large"} color={colors.blue} />
                  </View>
                </>
              )
              : (
                <>
                  {
                    this.state.HomeItemList?.length > 0 ?
                      <>
                        {this.state.searchVisible &&
                          <View style={{ flexDirection: 'row', alignItems: "center", paddingHorizontal: 20, marginBottom: 10 }}>
                            <Animated.View style={[styles.inputContainer, { width: this.state.Animatedwidth }]}>
                              <TextInput
                                allowFontScaling={false}
                                ref={(ref) => this.ref = ref}

                                style={{ flex: 1, }}
                                onChangeText={(text: any) => { this.changeSearch(text) }}
                                placeholder="Discover stocks, friends & experts..."
                                value={this.state.searchStock}
                              />
                            </Animated.View>
                            <TouchableOpacity
                              onPress={() => {
                                this.hideKeyboard();
                                this.increaseHeight()
                                this.ref && this.ref.blur()
                                setEvent("search canceled", {
                                  "query": this.state.searchStock
                                })
                                this.setState({ isFocus: false, searchStock: '', searchVisible: false, })
                                //@ts-ignore
                                this.context.authContext.setScreenNameNavigation('')
                              }}
                              style={[styles.cancleContainer,]}>
                              <Text style={[{ alignSelf: 'center', }, styles.fontFamilyMedium]}>Cancel</Text>
                            </TouchableOpacity>
                          </View>
                        }
                        <FlatList
                          ref={this.refrense}
                          showsVerticalScrollIndicator={false}
                          showsHorizontalScrollIndicator={false}
                          refreshControl={
                            <RefreshControl refreshing={this.state.isRefreshLoading} onRefresh={() => this.refresh()} />
                          }
                          data={!this.state.searchVisible ? this.state.HomeItemList : []}
                          extraData={this.state.HomeItemList}
                          keyExtractor={(item, index) => index.toString()}
                          onViewableItemsChanged={this.handleViewableItemsChanged}
                          // getItemLayout={this.getItemLayout}
                          onScroll={(event) => {
                            const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
                            const isScrolledToEnd = contentOffset.y + layoutMeasurement.height >= (contentSize.height - 20);
                            if (isScrolledToEnd && !this.state.isScrollEnded) {
                              this.loadMoreData();
                            }
                          }}
                          ListHeaderComponent={
                            <>
                              {
                                this.state.searchVisible &&
                                <View>

                                  {(this.state.isFocus) &&
                                    <Animated.FlatList
                                      style={styles.tabContainer}
                                      keyboardShouldPersistTaps='always'
                                      horizontal
                                      data={this.tabs}
                                      renderItem={({ item, index }) => {
                                        return (<TouchableOpacity
                                          onPress={() => { this.setState({ selectedTab: item }) }}
                                          style={[styles.tab, { marginRight: this.tabs.length - 1 == index ? 0 : scaledSize(10) },
                                          this.state.selectedTab == item && { backgroundColor: colors.blue, }]}>
                                          <Text style={[styles.tabText, styles.fontFamilyRegular,
                                          this.state.selectedTab == item && { color: colors.white }
                                          ]}>{item}</Text>
                                        </TouchableOpacity>)
                                      }}
                                    />
                                  }
                                  {this.state.isFocus ? this.state.searchStock.length > 0 ?
                                    <FlatList
                                      showsVerticalScrollIndicator={false}
                                      showsHorizontalScrollIndicator={false}
                                      keyboardShouldPersistTaps='always'
                                      style={styles.suggestions}
                                      data={this.state.selectedTab == 'All'
                                        ? [...this.state.usersDetail, ...this.state.stockDetail, ...this.state.cryptoDetail]
                                        : this.state.selectedTab == 'Users'
                                          ? this.state.usersDetail : this.state.selectedTab == 'Stocks'
                                            ? this.state.stockDetail : this.state.cryptoDetail}
                                      renderItem={this._searchStock}
                                      ListEmptyComponent={() => {
                                        return (<View style={{ flex: 1, paddingVertical: scaledSize(20) }}>
                                          {this.state.isSearchLoading ? <ActivityIndicator color={colors.blue} /> : <Text style={[styles.fontFamilyBold, { paddingHorizontal: scaledSize(20) }]}>No result found!</Text>}
                                        </View>
                                        )
                                      }}
                                      keyExtractor={(item, index) => index.toString()}
                                    />
                                    :
                                    <>
                                      {
                                        this.state.isFocus &&

                                        <FlatList
                                          showsVerticalScrollIndicator={false}
                                          scrollEnabled={false}
                                          showsHorizontalScrollIndicator={false}
                                          keyboardShouldPersistTaps='always'
                                          style={styles.suggestions}
                                          data={this.state.selectedTab == 'All' ? this.state.recentAllDetail : this.state.selectedTab == 'Users' ? this.state.recentUserDetail : this.state.selectedTab == 'Stocks' ? this.state.recentstockDetail : this.state.recentCryptoDetails}
                                          renderItem={this._renderRecentSearch}
                                          ListEmptyComponent={() => {
                                            return (
                                              this.state.isRecentSearchLoading ? <View style={{ flex: 1, paddingVertical: scaledSize(20) }}><ActivityIndicator color={colors.blue} /></View> : <View style={{ height: scaledSize(20) }} />
                                            )
                                          }}
                                          ListHeaderComponent={() => {
                                            return (
                                              <>
                                                {
                                                  this.state.selectedTab == 'All' && this.state.recentAllDetail?.length > 0 || this.state.selectedTab == 'Users' && this.state.recentUserDetail?.length > 0 || this.state.selectedTab == 'Stocks' && this.state.recentstockDetail?.length > 0 || this.state.recentCryptoDetails?.length > 0 ? <Text style={[styles.fontFamilyBold, { marginLeft: scaledSize(15), paddingTop: scaledSize(10) }]}>Your Recent Searches</Text>
                                                    : <Text style={[styles.fontFamilyBold, { marginLeft: scaledSize(15), paddingTop: scaledSize(10) }]}>No Recent Searches</Text>
                                                }
                                              </>
                                            )
                                          }} keyExtractor={(item, index) => index.toString()} />

                                      }
                                      {/* {this.state.isFocus &&
                                      (this.state.isLoading ?
                                        <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                          <ActivityIndicator color={colors.blue} size='large' />
                                        </View> :
                                        this.state.shots.length == 0 && this.state.blogs.length == 0 && this.state.others.length == 0 && this.state.news.length == 0 ?
                                          <>
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                              <Text style={styles.fontFamilyBold}>No content available</Text>
                                            </View>
                                          </>
                                          :
                                          <>
                                            {this.state.shots.length != 0 && this.slider("Shots", this.state.shots)}
                                            {this.state.ad1.length != 0 && this.renderDiscount(this.state.ad1)}
                                            {this.state.blogs.length != 0 && this.renderBlog()}
                                            {this.state.ad2.length != 0 && this.renderDiscount(this.state.ad2)}
                                            {this.state.news.length != 0 && this.slider("News", this.state.news)}
                                          </>)
                                    } */}
                                    </>
                                    : null
                                  }
                                </View>
                              }
                              <>
                                {
                                  !this.state.isFocus &&
                                  <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 20 }}>
                                    <TouchableOpacity style={[styles.container]} onPress={() => {
                                      this.props.navigation.navigate("YourWallate"), setEvent("wallet clicked", {
                                        "screen": "home"
                                      })
                                    }}>
                                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <View style={{ flex: 1 }}>
                                          <Text style={[styles.textArea, { paddingBottom: scaledSize(5) }]}>Your Balance</Text>

                                          <Text style={[styles.textName, styles.fontFamilyBold]}>{this.state.balanceDetail?.currency_name ? this.state.balanceDetail?.currency_name : "₹"} {this.state.balanceDetail?.balance ? this.state.balanceDetail?.balance : 0}</Text>
                                        </View>
                                        <Image source={walletImage} style={{ height: 30, width: 30, tintColor: colors.blue }} />
                                      </View>
                                    </TouchableOpacity>
                                    <View style={{ width: 20 }} />
                                    <TouchableOpacity style={[styles.container]} onPress={() => {
                                      this.props.navigation.navigate("TopRankers"), setEvent("leaderboard clicked", {
                                        "screen": "home"
                                      })
                                    }} >
                                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <View style={{ flex: 1 }} >
                                          <Text style={[styles.textArea, { paddingBottom: scaledSize(5) }]}>Leaderboard</Text>
                                          <Text style={[styles.textName, styles.fontFamilyBold]}>Top Ranks</Text>
                                        </View>
                                        <Image source={rankingImage} style={{ height: 30, width: 30, tintColor: colors.blue }} />
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                }
                              </>
                              {
                                !this.state.searchVisible && <View style={{ marginVertical: 25, marginBottom: 20 }}>
                                  <TopHomeBar navigation={this.props.navigation} />

                                </View>
                              }
                            </>
                          }
                          renderItem={({ item, index }) => {
                            const { data } = item
                            return <View style={[styles.marginContent]}>
                              {
                                !this.state.searchVisible &&
                                <>
                                  {data && data.type === "card_detail" && this._cardItem({ data, index })}
                                  {data && data.type === "poll" && this._pollItem({ data, index })}
                                  {data && data.type === "post" && this._socialItem({ data, index })}
                                </>
                              }
                            </View>
                          }}
                          onEndReachedThreshold={0.1}
                          onEndReached={this.loadMoreData}
                          ListFooterComponent={
                            <>
                              {
                                !this.state.searchVisible &&
                                <>
                                  {this.state.isLoadMore ? (
                                    <View
                                      style={{
                                        start: 0,
                                        end: 0,
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <ActivityIndicator color={colors.blue} />
                                    </View>
                                  ) : (
                                    <>
                                      {this.state.HomeItemList.length > 9 && !this.state.isLoadMore && !this.state.isLastpage &&
                                        <View
                                          style={{
                                            start: 0,
                                            end: 0,
                                            marginBottom: 10,
                                            justifyContent: "center",
                                            alignItems: "center",
                                          }}
                                        >
                                          <TouchableOpacity
                                            onPress={() => { this.loadMoreData() }}
                                          >
                                            <View
                                              style={{
                                                justifyContent: "center",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                borderWidth: 1,
                                                borderColor: colors.blue,
                                                borderRadius: 6,
                                                alignSelf: "baseline",
                                              }}
                                            >
                                              <Text
                                                style={[
                                                  styles.fontFamilyMedium,
                                                  {
                                                    paddingHorizontal: scaledSize(20),
                                                    paddingVertical: scaledSize(5),
                                                    fontSize: 12,
                                                    color: colors.blue,
                                                  },
                                                ]}
                                              >
                                                LOAD MORE
                                              </Text>
                                            </View>
                                          </TouchableOpacity>
                                        </View>
                                      }
                                    </>
                                  )}
                                </>
                              }
                            </>
                          }
                        />
                      </>
                      :
                      <>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} refreshControl={
                          <RefreshControl refreshing={this.state.isRefreshLoading} onRefresh={() => this.refresh()} />
                        }>
                          {/* <TopBar topBarKey={2} navigation={this.props.navigation} onPress={() => {
                            setEvent("search clicked", {
                              "screen": "home"
                            })
                            this.setState({ searchVisible: true })
                            this.getRecentSearch()
                            this.decreaseHeight()
                            this.setState({ isFocus: true })
                            setTimeout(() => {
                              this.ref.focus()
                            }, 1000);
                          }}
                          /> */}
                          {
                            this.state.searchVisible &&
                            <View>
                              <View style={{ flexDirection: 'row', alignItems: "center", paddingHorizontal: 20, marginBottom: 10 }}>
                                <Animated.View style={[styles.inputContainer, { width: this.state.Animatedwidth }]}>
                                  <TextInput
                                    allowFontScaling={false}
                                    ref={(ref) => this.ref = ref}

                                    style={{ flex: 1, }}
                                    onChangeText={(text: any) => { this.changeSearch(text) }}
                                    placeholder="Discover stocks, friends & experts..."
                                    value={this.state.searchStock}
                                  // onFocus={() => {
                                  //   this.getRecentSearch()
                                  //   this.decreaseHeight()
                                  //   this.setState({ isFocus: true })
                                  // }}
                                  />
                                </Animated.View>
                                <TouchableOpacity
                                  onPress={() => {
                                    this.hideKeyboard();
                                    this.increaseHeight()
                                    this.ref && this.ref.blur()
                                    setEvent("search canceled", {
                                      "query": this.state.searchStock
                                    })
                                    this.setState({ isFocus: false, searchStock: '', searchVisible: false })
                                    this.context.authContext.setScreenNameNavigation('')
                                  }}
                                  style={[styles.cancleContainer,]}>
                                  <Text style={[{ alignSelf: 'center', }, styles.fontFamilyMedium]}>Cancel</Text>
                                </TouchableOpacity>
                              </View>
                              {(this.state.isFocus) &&
                                <Animated.FlatList
                                  style={styles.tabContainer}
                                  keyboardShouldPersistTaps='always'
                                  horizontal
                                  data={this.tabs}
                                  renderItem={({ item, index }) => {
                                    return (<TouchableOpacity
                                      onPress={() => { this.setState({ selectedTab: item }) }}
                                      style={[styles.tab, { marginRight: this.tabs.length - 1 == index ? 0 : scaledSize(10) },
                                      this.state.selectedTab == item && { backgroundColor: colors.blue, }]}>
                                      <Text style={[styles.tabText, styles.fontFamilyRegular,
                                      this.state.selectedTab == item && { color: colors.white }
                                      ]}>{item}</Text>
                                    </TouchableOpacity>)
                                  }}
                                />
                              }
                              {this.state.isFocus ? this.state.searchStock.length > 0 ?
                                <FlatList
                                  showsVerticalScrollIndicator={false}
                                  showsHorizontalScrollIndicator={false}
                                  keyboardShouldPersistTaps='always'
                                  style={styles.suggestions}
                                  data={this.state.selectedTab == 'All'
                                    ? [...this.state.usersDetail, ...this.state.stockDetail, ...this.state.cryptoDetail]
                                    : this.state.selectedTab == 'Users'
                                      ? this.state.usersDetail : this.state.selectedTab == 'Stocks'
                                        ? this.state.stockDetail : this.state.cryptoDetail}
                                  renderItem={this._searchStock}
                                  ListEmptyComponent={() => {
                                    return (<View style={{ flex: 1, paddingVertical: scaledSize(20) }}>
                                      {this.state.isSearchLoading ? <ActivityIndicator color={colors.blue} /> : <Text style={[styles.fontFamilyBold, { paddingHorizontal: scaledSize(20) }]}>No result found!</Text>}
                                    </View>
                                    )
                                  }}
                                  keyExtractor={(item, index) => index.toString()}
                                />
                                :
                                <>
                                  {
                                    this.state.isFocus &&

                                    <FlatList
                                      scrollEnabled={false}
                                      showsVerticalScrollIndicator={false}
                                      showsHorizontalScrollIndicator={false}
                                      keyboardShouldPersistTaps='always'
                                      style={styles.suggestions}
                                      data={this.state.selectedTab == 'All' ? this.state.recentAllDetail : this.state.selectedTab == 'Users' ? this.state.recentUserDetail : this.state.selectedTab == 'Stocks' ? this.state.recentstockDetail : this.state.recentCryptoDetails}
                                      renderItem={this._renderRecentSearch}
                                      ListEmptyComponent={() => {
                                        return (
                                          this.state.isRecentSearchLoading ? <View style={{ flex: 1, paddingVertical: scaledSize(20) }}><ActivityIndicator color={colors.blue} /></View> : <View style={{ height: scaledSize(20) }} />
                                        )
                                      }}
                                      ListHeaderComponent={() => {
                                        return (
                                          <>
                                            {
                                              this.state.selectedTab == 'All' && this.state.recentAllDetail?.length > 0 || this.state.selectedTab == 'Users' && this.state.recentUserDetail?.length > 0 || this.state.selectedTab == 'Stocks' && this.state.recentstockDetail?.length > 0 || this.state.recentCryptoDetails?.length > 0 ? <Text style={[styles.fontFamilyBold, { marginLeft: scaledSize(15), paddingTop: scaledSize(10) }]}>Your Recent Searches</Text>
                                                : <Text style={[styles.fontFamilyBold, { marginLeft: scaledSize(15), paddingTop: scaledSize(10) }]}>No Recent Searches</Text>
                                            }
                                          </>
                                        )
                                      }} keyExtractor={(item, index) => index.toString()} />

                                  }
                                  {/* {this.state.isFocus &&
                                    (this.state.isLoading ?
                                      <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <ActivityIndicator color={colors.blue} size='large' />
                                      </View> :
                                      this.state.shots.length == 0 && this.state.blogs.length == 0 && this.state.others.length == 0 && this.state.news.length == 0 ?
                                        <>
                                          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={styles.fontFamilyBold}>No content available</Text>
                                          </View>
                                        </>
                                        :
                                        <>
                                          {this.state.shots.length != 0 && this.slider("Shots", this.state.shots)}
                                          {this.state.ad1.length != 0 && this.renderDiscount(this.state.ad1)}
                                          {this.state.blogs.length != 0 && this.renderBlog()}
                                          {this.state.ad2.length != 0 && this.renderDiscount(this.state.ad2)}
                                          {this.state.news.length != 0 && this.slider("News", this.state.news)}
                                        </>)
                                  } */}
                                </>
                                : null
                              }
                            </View>
                          }
                          <>
                            {
                              !this.state.searchVisible &&
                              <>
                                <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 20 }}>
                                  <TouchableOpacity style={[styles.container]} onPress={() => {
                                    this.props.navigation.navigate("YourWallate"), setEvent("wallet clicked", {
                                      "screen": "home"
                                    })
                                  }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                      <View style={{ flex: 1 }}>
                                        <Text style={[styles.textArea, { paddingBottom: scaledSize(5) }]}>Your Balance</Text>
                                        <Text style={[styles.textName, styles.fontFamilyBold]}>{this.state.balanceDetail?.currency_name ? this.state.balanceDetail?.currency_name : "₹"} {this.state.balanceDetail?.balance ? this.state.balanceDetail?.balance : 0}</Text>
                                      </View>
                                      <Image source={walletImage} style={{ height: 30, width: 30, tintColor: colors.blue }} />
                                    </View>
                                  </TouchableOpacity>
                                  <View style={{ width: 20 }} />
                                  <TouchableOpacity style={[styles.container]} onPress={() => {
                                    this.props.navigation.navigate("TopRankers"), setEvent("leaderboard clicked", {
                                      "screen": "home"
                                    })
                                  }} >
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                      <View style={{ flex: 1 }} >
                                        <Text style={[styles.textArea, { paddingBottom: scaledSize(5) }]}>Leaderboard</Text>
                                        <Text style={[styles.textName, styles.fontFamilyBold]}>Top Ranks</Text>
                                      </View>
                                      <Image source={rankingImage} style={{ height: 30, width: 30, tintColor: colors.blue }} />
                                    </View>
                                  </TouchableOpacity>
                                </View>
                                <View style={{ marginVertical: 25, marginBottom: 20 }}>
                                  <TopHomeBar navigation={this.props.navigation} />
                                </View>
                                <View style={{ paddingHorizontal: scaledSize(15) }}>
                                  {this.renderSuggestedProfiles()}
                                </View>
                              </>
                            }
                          </>

                        </ScrollView>
                      </>
                  }
                </>
              )
            }
          </>
          {/* Customizable Area End */}
        </TouchableOpacity>
        {/* </KeyboardAvoidingView> */}
        <Modal
          // animationType="slide"
          transparent={true}
          visible={this.state.showBannerModal}

          onRequestClose={() => {
            this.setState({ showBannerModal: !this.state.showBannerModal })

          }}>
          <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => {
            this.setState({ showBannerModal: false })
          }}>
            <View style={{ flex: 1 }}>
              <BlurView
                style={{
                  position: 'absolute',
                  height: height,
                  // Platform.OS == 'android'
                  //   ? height - deviceHeight == 0
                  //     ? height - 90
                  //     : height - 70
                  //   : height - 90,
                  width: '100%',
                }}
                blurAmount={3}
                downsampleFactor={5}
                overlayColor={'rgba(0, 0, 0, .25)'}
                blurType="dark"
              >
              </BlurView>
              <View style={{ flex: 1, position: 'absolute', top: 0, start: 0, end: 0, bottom: 0 }}>
                <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => {


                  this.setState({ showBannerModal: false })
                }}><View style={{ flex: 1 }}></View></TouchableWithoutFeedback>
              </View>
              <>
                {this.state.ad2 ? this.renderDiscountBanner(this.state.ad2) :
                  <View style={{
                    marginHorizontal: scaledSize(17),
                    width: Dimensions.get('screen').width - scaledSize(34),
                    height: scaledSize(180),
                    // backgroundColor: colors.offWhite,
                    backgroundColor: "rgba(0, 0, 0, -0.2)",
                    borderRadius: scaledSize(15),
                  }}></View>
                }
              </>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <InfoModal
          title={configJSON.hooray}
          isLoading={false}
          visible={this.state.showInfoModal}
          onPress={() => { }}
          onCancel={() => this.setState({ showInfoModal: false })}
        />
        {this.state.isVisibleFilter && <CardFilterModal
          from="home"
          defaultData={this.state.cardFilterItem}
          onModalClose={isVisible => {
            this.setState({ isVisibleFilter: isVisible })
          }}
          isVisible={this.state.isVisibleFilter} onApplyValues={(value: FilterItem) => {
            setEvent("filter applied", {
              "screen": "Home",
            })
            this.setState({ isVisibleFilter: false, cardFilterItem: value, page: 1, isLoading: true, HomeItemList: [] }, () => {
              this.getDashBoardList(this.state.userToken)
            })
          }}
          onClearAll={() => {
            this.setState({ isVisibleFilter: false, cardFilterItem: undefined, page: 1, isLoading: true, HomeItemList: [] }, () => {
              this.getDashBoardList(this.state.userToken)
            })
          }}
        />
        }
        {this.state.show_dialog && <View >
          <CustomModal
            dialog_title={this.state.dialog_title}
            dialog_show={this.state.show_dialog && this.state.dialog_show}
            dialog_button_positive={this.state.dialog_button_positive}
            dialog_message={this.state.dialog_message}
            dialog_force_show={this.state.dialog_force_show}
            dialog_image={this.state.dialog_image}
            onClose={() => {
              this.setState({ show_dialog: false }, () => {
                AsyncStorage.setItem("dialog_shown", "yes")
              })
            }}
            onSubmit={() => {
              this.setState({ show_dialog: false }, () => {
                this.doClickSubmitDialog()
              })
            }}
          />
        </View>}
        {/* </ScrollView> */}
        <View style={{ position: "absolute", end: scaledSize(15), bottom: scaledSize(15) }}>
          <TouchableOpacity activeOpacity={0.5} onPress={() => { this.setState({ isVisibleFilter: true }), setEvent('filter clicked', { screen: "Home" }) }}>
            <View style={styles.containerFilter}>
              <Image source={filter} style={[styles.imgFilter, { tintColor: this.state.cardFilterItem != undefined ? colors.blue : colors.black }]} />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      // Customizable Area End
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: scaledSize(15),
    marginTop: scaledSize(10),
    borderRadius: scaledSize(10),
    paddingVertical: scaledSize(10),
    shadowColor: colors.black,
    shadowOpacity: 0,
    shadowOffset: { height: 10, width: 0.5 },
    shadowRadius: 10,
  },
  fontFamilyBold: {
    fontFamily: Fonts.LIGHT_BOLD,
  },
  marginContent: {
    marginLeft: scaledSize(15),
    marginRight: scaledSize(15),
    marginTop: scaledSize(3),
  },
  activityIndicator: {
    flex: 1,
    height: deviceHeight,
    justifyContent: "center",
    alignItems: "center",
    top: -scaledSize(50),
  },
  fontFamilyMedium: {
    fontFamily: Fonts.MEDIUM,
  },
  containerFilter: {
    backgroundColor: colors.white, width: scaledSize(50), height: scaledSize(50), borderRadius: scaledSize(25), justifyContent: 'center', alignItems: 'center', shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  imgFilter: { width: scaledSize(25), height: scaledSize(25) },
  inputContainer: {
    backgroundColor: colors.white,
    height: scaledSize(45),
    marginTop: scaledSize(15),
    borderRadius: scaledSize(10),
    paddingHorizontal: scaledSize(15),
    justifyContent: 'space-between',
    flexDirection: "row",
    zIndex: 2,
    flex: 1,
    elevation: 1,
  },
  cancleContainer: {
    backgroundColor: colors.white,
    height: scaledSize(45),
    marginTop: scaledSize(15),
    borderRadius: scaledSize(10),
    paddingHorizontal: scaledSize(15),
    flexDirection: "row",
    elevation: 1,
    marginLeft: 5
  },
  suggestions: {
    marginTop: 10,
    borderRadius: scaledSize(15),
    backgroundColor: 'white',
    elevation: 1,
    flexGrow: 0,
    marginHorizontal: scaledSize(20),
    marginBottom: scaledSize(10)

  },
  expanded_list: {
    backgroundColor: colors.white,
    paddingHorizontal: scaledSize(10),
    borderBottomColor: colors.gray,
    borderBottomWidth: 0,
    borderRadius: scaledSize(15)
  },
  avtar: {
    height: scaledSize(25),
    width: scaledSize(25),
    borderRadius: scaledSize(15),
  },
  tabContainer: {
    marginTop: scaledSize(10),
    flexGrow: 0,
    marginLeft: scaledSize(20)
  },
  tab: {
    height: scaledSize(40),
    marginRight: scaledSize(10),
    alignSelf: 'center',
    paddingHorizontal: scaledSize(20),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaledSize(15)
  },
  tabText: {
    color: colors.gray
  },
  fontFamilyRegular: {
    fontFamily: Fonts.REGULAR,
  },
  recentUser: {
    fontFamily: Fonts.REGULAR,
    paddingVertical: scaledSize(10),
    fontSize: scaledSize(13),
    textTransform: 'none',
  },
  textArea: {
    color: 'gray',
    fontFamily: Fonts.REGULAR
  },
  discount: {
    width: Dimensions.get('screen').width - scaledSize(34),
    height: scaledSize(150),
    backgroundColor: colors.offWhite,
    borderRadius: scaledSize(15),
  },
  textName: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: scaledSize(15)
  },
  header: {
    marginTop: scaledSize(20),
    paddingHorizontal: scaledSize(20),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaledSize(15)
  },
  headerTitle: {
    fontSize: scaledSize(16),
  },
  buttons: {
    zIndex: 1,
    height: 15,
    marginTop: -25,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonSelected: {
    opacity: 1,
    backgroundColor: colors.blue,
    margin: 3,
    width: scaledSize(8),
    height: scaledSize(8),
    borderRadius: scaledSize(4)
  },
  button: {
    margin: 3,
    width: scaledSize(8),
    height: scaledSize(8),
    borderRadius: scaledSize(4),
    opacity: 0.4,
    backgroundColor: colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Polling;
// Customizable Area End

//comment code
// onFocus={() => {
//   this.getRecentSearch()
//   this.decreaseHeight()
//   this.setState({ isFocus: true })
// }}