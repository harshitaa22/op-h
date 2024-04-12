import { createRef } from "react";
// Customizable Area Start
import { Animated, AppState, BackHandler, DeviceEventEmitter, Keyboard, Linking, PermissionsAndroid, Platform } from "react-native";
//@ts-ignore
import { AuthContext } from "../../../mobile/Navigation/context";
//library
import Toast from "react-native-toast-message";
//@ts-ignore
import DeepLinking from 'react-native-deep-linking';
import { EventRegister } from "react-native-event-listeners";
import { AppEventsLogger, Settings } from "react-native-fbsdk-next";
import remoteConfig from '@react-native-firebase/remote-config';
import AsyncStorage from "@react-native-community/async-storage";
import { BranchEvent } from "react-native-branch";
import Contacts from 'react-native-contacts';
//components
import { getVisibleCards, listOfPollType, setEvent } from "../../../components/src/Utils/service";
import { FilterItem } from "../../../components/src/Modals/CardFilterModal";
import { filterEmptyValues, jsonToQueryString } from "../../../components/src/utilitisFunction";
//framework
import { BlockComponent } from "../../../framework/src/BlockComponent";
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
import {
  deviceWidth,
  getStorageData,
  scaledSize,
  setNavigator,
  setStorageData,
} from "../../../framework/src/Utilities";
import { logoutUser } from "../../../framework/src/Utilities";
//@ts-ignore
// Customizable Area End
export const configJSON = require("./config");
export interface Props {
  // Customizable Area Start
  navigation: any;
  route: any;
  buttonPress: any
  screenKey: any
  screenId: any
  id: string;
  // Customizable Area end
}

interface S {
  // Customizable Area Start
  topScoreList: Record<string, any>[];
  HomeItemList: Record<string, any>[];
  page: number;

  isFirstTimeLoad: boolean
  showInfoModal: boolean;
  showBannerModal: boolean;
  isRefreshing: boolean,
  visibleMenu: boolean;
  temp: boolean;
  visibleSocialPopUp: boolean;

  accountid: number;
  isPlay: number;
  notificationCount: number;

  recentCryptoDetails: any,
  shots: any;
  blogs: any;
  others: any;
  recentUserDetail: any;
  selectedPollItem: any;
  playid: any;
  volume: any;
  balanceDetail: any
  stockDetail: any,
  usersDetail: any
  ad1: any;
  ad2: any;
  news: any;
  suggestedProfiles: any;
  idFollowUnfollow: any;
  Animatedwidth: any;
  contactsList: any[],
  orgContactsList: any[],
  searchStock: any;
  token: any;
  recentstockDetail: any,
  currentVisibleItem: any,
  cryptoDetail: any,
  recentAllDetail: any;

  cardFilterItem?: FilterItem,
  best_performers: string,
  selectedTab: string;
  userToken: string;
  seletctedDeleteId: string;
  showMoreId: string;
  selectedPoll: string;
  deleteSocialId: string;
  dialog_button_positive: string
  dialog_message: string
  dialog_navigation_screen: string
  dialog_title: string
  dialog_image: string
  dialog_navigation_url: string

  isLoading: boolean;
  socialPost: boolean
  isRefreshLoading: boolean;
  isExpandMore: boolean
  dialog_force_show: boolean
  isLoadMore: boolean;
  show_dialog: boolean
  dialog_show: boolean
  isScrollEnded: boolean
  isVisibleFilter: boolean
  isLastpage: boolean
  visibleMenuReport: boolean;
  visiblePopupReports: boolean;
  visiblePopup: boolean;
  submitLoading: boolean;
  socialReport: boolean;
  socialDeletePost: boolean;
  pause: boolean;
  isMute: boolean;
  followUnfollowBtnDisabled: boolean;
  isSuggestedUserLoading: boolean
  isSearchLoading: boolean;
  isCntEmptyShow: boolean
  isCntLoading: boolean,
  isFocus: boolean,
  searchVisible: boolean,
  isRecentSearchLoading: boolean;
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}
//@ts-ignore
let _this = null;

export default class PollingController extends BlockComponent<Props, S, SS> {
  static contextType = AuthContext;
  // Customizable Area Start
  listener: any;
  handler: any;
  searchTimeOut: any
  ref: any;
  viewabilityConfig: any
  handleback: any
  scrollView: any
  interval: any
  refrense: any

  apiTopScorer: string = "";
  apiCard: string = '';
  createAns: string = '';
  apiDeletePostCallId: string = '';
  dashBoardList: string = '';
  apiCardFilter: string = ""
  apiDoGetUserBalanceId: string = '';
  apiRecentSearch: string = '';
  apiExplore: string = '';
  apiTrakDetails: string = '';
  apiRemoveBookMark: string = '';
  apiAddReacentSearch: string = '';
  getSuggestedProfileCallId: string = ''
  followUserApiCallId: string = "";
  apiSearchUserAndCompany: string = "";
  unfollowUserApiCallId: string = "";
  apiDoSyncContactsCallId: string = "";
  apiNotificationList: string = "";
  visibleItems: string = "";

  backPressSubscriptions: Set<unknown>;

  tabs = ["All", "Users", "Stocks"]
  exploreType = ["Shots", "Blogs", 'News', 'Others', 'Ad Section 1', 'Ad Section 2']

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);
    _this = this;
    this.refrense = createRef();
    this.subScribedMessages = [getName(MessageEnum.RestAPIResponceMessage)];
    //@ts-ignore
    this.state = {
      // Customizable Area Start
      showInfoModal: false,
      showBannerModal: false,
      isFirstTimeLoad: false,
      isSearchLoading: false,
      isExpandMore: false,
      temp: false,
      visibleSocialPopUp: false,
      isRefreshing: false,
      visibleMenu: false,
      visibleMenuReport: false,
      visiblePopupReports: false,
      visiblePopup: false,
      submitLoading: false,
      isFocus: false,
      searchVisible: false,
      isRecentSearchLoading: false,
      pause: true,
      isLoading: true,
      isMute: false,
      isRefreshLoading: false,
      isLoadMore: false,
      followUnfollowBtnDisabled: false,
      isSuggestedUserLoading: false,
      isCntEmptyShow: false,
      isCntLoading: false,
      isLastpage: false,
      isVisibleFilter: false,
      cardFilterItem: undefined,
      isScrollEnded: false,
      show_dialog: false,
      socialDeletePost: false,
      socialReport: false,
      dialog_show: false,
      dialog_force_show: false,

      recentAllDetail: [],
      recentstockDetail: [],
      recentUserDetail: [],
      shots: [],
      blogs: [],
      topScoreList: [],
      news: [],
      stockDetail: [],
      usersDetail: [],
      HomeItemList: [],
      recentCryptoDetails: [],
      cryptoDetail: [],
      contactsList: [],
      orgContactsList: [],
      suggestedProfiles: [],

      selectedPollItem: {},
      volume: {},
      balanceDetail: {},

      isPlay: 0,
      currentVisibleItem: -1,
      page: 1,
      accountid: 0,
      notificationCount: 0,

      Animatedwidth: new Animated.Value(deviceWidth - scaledSize(40)),

      searchStock: '',
      dialog_image: "",
      dialog_navigation_url: "",
      userToken: "",
      token: "",
      seletctedDeleteId: "",
      showMoreId: "",
      selectedPoll: "",
      playid: "",
      selectedTab: 'All',
      deleteSocialId: '',
      idFollowUnfollow: '',
      best_performers: "Weekly Leaders",
      dialog_button_positive: "",
      dialog_message: "",
      dialog_navigation_screen: "",
      dialog_title: "",
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
    this.viewabilityConfig = {
      waitForInteraction: true,
      viewAreaCoveragePercentThreshold: 95,
      itemVisiblePercentThreshold: 75,
    };
  }
  //@ts-ignore
  handleScroll(event) {
    let yOffset = event.nativeEvent.contentOffset.y
    let contentHeight = event.nativeEvent.contentSize.height
    let value = yOffset / contentHeight;
  }

  indexRange(arr: any, start: any, end: any) {
    return arr?.slice(start, end)
  }

  handleViewableItemsChanged({ viewableItems, changed }: any) {
    //@ts-ignore
    if (_this.state.HomeItemList) {
      //@ts-ignore
      const list = _this.indexRange(_this.state.HomeItemList, viewableItems[0]?.index - 5, viewableItems[0]?.index + 5);
      if (list.length > 0) {
        let companyNamesFromCard = list
        companyNamesFromCard.filter((value: any) => value?.data?.type === "card_detail" || value?.data?.type === "poll")
        companyNamesFromCard = companyNamesFromCard.map((value: any) => {
          return value.data
        })
        getVisibleCards(companyNamesFromCard)
      }
      else if (viewableItems[0]?.index == 0) {
        //@ts-ignore
        const nextItems = _this.indexRange(_this.state.HomeItemList, 0, 9);
        let companyNamesFromNextItems = nextItems
        companyNamesFromNextItems = companyNamesFromNextItems.map((value: any) => {
          return value.data
        })
        getVisibleCards(companyNamesFromNextItems)
      }
    }
  }

  getItemLayout = (data: any, index: any) =>
  ({
    length: 100,
    offset: 300 * index,
    index,
  })

  async componentDidMount() {
    //@ts-ignore
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.getExploreDetail(this.state.userToken)
    // if (this.state.searchVisible) {
    //   this.ref.current.focus();
    // }
    //@ts-ignore
    // const screen_name = this.context?.loginState?.screen_name_navigation ?? "";
    let token = await getStorageData('Token')
    // this.setState({ token: token }, () => {
    //   if (screen_name != undefined && screen_name === "TopBar") {
    //     this.ref.current.focus()
    //   }

    // })

    EventRegister.addEventListener("topToHome", (data) => {
      if (data) {
        if (this.refrense.current) {
          this.setState({ isFocus: false, searchStock: '', searchVisible: false })
          this.refrense.current.scrollToOffset({ animated: true, offset: 0 });
        }
      }
    })
    this.props.navigation.addListener('focus', async () => {
      //@ts-ignore
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
      this.setState({ isFocus: false, searchStock: '', searchVisible: false })
      //@ts-ignore
      this.context.authContext.setTabBar(true)
    }
    )
    this.props.navigation.addListener('blur', () => {
      //@ts-ignore
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
      this.increaseHeight()
      this.ref && this.ref.blur()
      this.setState({ isFocus: false, searchStock: '', })
      //@ts-ignore
      let tabDetails = this.context.loginState.tabsPress
      //@ts-ignore
      this.context.authContext.onTabPress({
        ...tabDetails,
        explore: 0,
      })
    })

    setNavigator(this.props.navigation);
    Linking.addEventListener('url', this.handleUrl);
    DeepLinking.addScheme('applinks://');
    const linkingData = await Linking.getInitialURL()
    if (linkingData && typeof linkingData === "string") {
      let isCardTypeLink = linkingData.includes("bx_block_share_card/card");
      let isShareAccount = linkingData.includes("share_account");
      let isPollTypeLink = linkingData.includes("bx_block_share_poll/poll");
      let isPostTypeLink = linkingData.includes("bx_block_posts/post_detail");
      if (isShareAccount) {
        let linkingDataArray = linkingData.split("/")
        const accountid = await getStorageData("AccountID");
        const userId = linkingDataArray[linkingDataArray.length - 2]
        let data = {
          account_id: userId,
          screen_name: accountid === userId ? "MyProfile" : "FriendProfile"
        }
        this.ManageNavigation(data)
      } else if (isCardTypeLink) {
        let data = {
          card_id: linkingData.substring(linkingData.lastIndexOf('/') + 1),
          screen_name: "card"
        }
        this.ManageNavigation(data)
      } else if (isPollTypeLink) {
        let data = {
          poll_id: linkingData.substring(linkingData.lastIndexOf('/') + 1),
          screen_name: "poll"
        }
        this.ManageNavigation(data)
      } else if (isPostTypeLink) {
        let data = {
          post_id: linkingData.substring(linkingData.lastIndexOf('/') + 1),
          screen_name: "post"
        }
        this.ManageNavigation(data)
      }
    }
    this.hasModalShow();
    // this.hasBannerModalShow()

    //@ts-ignore
    this.context.authContext.setTabBar(true)
    const accountid = await getStorageData("AccountID");
    this.setState({ accountid: accountid, userToken: token })
    if (token) {
      this.setState({ isLoading: true, isSuggestedUserLoading: true })
      // await this.getTopScorer(token)
      await this.getDashBoardList(token)
      await this.getSuggestedProfiles()
      await this.getUserBalance();
      // await this.getChannelData()
    }
    //@ts-ignore

    this.props.navigation.addListener("focus", async () => {
      this.setState({ visibleSocialPopUp: false, visibleMenu: false })
      //@ts-ignore
      this.context.authContext.setTabBar(true)
      this.hasModalShow()

      this.getExploreDetail(this.state.userToken)

      //@ts-ignore
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    });

    this.props.navigation.addListener(
      "blur",
      () => {
        //@ts-ignore
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        // this.handler?.remove()
        this.setState({ playid: "", pause: true, visibleMenu: false, searchVisible: false, isFocus: false, searchStock: "", selectedTab: 'All' })
        //@ts-ignore
        let tabDetails = this.context.loginState.tabsPress
        //@ts-ignore
        this.context.authContext.onTabPress({
          ...tabDetails,
          home: 0,
        })
      }
    );

    Settings.initializeSDK()
    Settings.setAdvertiserTrackingEnabled(true)
    Settings.setAutoLogAppEventsEnabled(true)
    Settings.setAdvertiserIDCollectionEnabled(true)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.AchievedLevel)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.AdClick)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.AdImpression)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.AddedPaymentInfo)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.AddedToCart)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.AddedToWishlist)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.CompletedTutorial)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.Contact)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.CustomizeProduct)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.Donate)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.FindLocation)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.InitiatedCheckout)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.Purchased)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.Rated)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.SpentCredits)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.Schedule)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.StartTrial)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.SubmitApplication)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.Subscribe)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.UnlockedAchievement)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.Searched)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.ViewedContent)
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.CompletedRegistration, {
      [AppEventsLogger.AppEventParams.RegistrationMethod]: "email",
      [AppEventsLogger.AppEventParams.Currency]: "INR",
    });
    AppEventsLogger.logEvent(
      'fb_mobile_complete_registration',
      {
        'fb_content_type': 'product',
        'fb_currency': 'USD',
        'value': 100.00,
      }
    );
    AppEventsLogger.logEvent(
      'fb_mobile_complete_registration',
      {
        'fb_content_type': 'product',
        'value': 100.00,
      }
    );
    AppEventsLogger.logEvent('search', {
      search_string: 'keyword',
      content_type: 'product'
    });
    AppEventsLogger.logEvent('viewed_content', {
      content_type: 'product',
      content_id: '12345'
    });
    AppEventsLogger.logEvent('completed_registration', {
      registration_method: 'email'
    });
    const remoteConfigData = remoteConfig();
    remoteConfigData.setConfigSettings({ minimumFetchIntervalMillis: 0, fetchTimeMillis: 0 })
    remoteConfigData.fetchAndActivate()
      .then(fetchedRemotely => {
        console.log('fetchedRemotely', fetchedRemotely)
        if (fetchedRemotely) {

          console.log('Configs were retrieved from the backend and activated.', fetchedRemotely);
        } else {
          console.log(
            'No configs were fetched from the backend, and the local configs were already activated',
          );
        }
      });
    const dialog_shown = await AsyncStorage.getItem("dialog_shown");
    const dialog_show = remoteConfigData.getValue('dialog_show').asBoolean();
    const dialog_force_show = remoteConfigData.getValue('dialog_force_show').asBoolean();
    const dialog_button_positive = remoteConfigData.getValue('dialog_button_positive').asString();
    const dialog_message = remoteConfigData.getValue('dialog_message').asString();
    const dialog_navigation_screen = remoteConfigData.getValue('dialog_navigation_screen').asString();
    const dialog_title = remoteConfigData.getValue('dialog_title').asString();
    const dialog_image = remoteConfigData.getValue('dialog_image').asString();
    const dialog_navigation_url = remoteConfigData.getValue('dialog_navigation_url').asString();
    console.log('dialog_show', dialog_show, dialog_image, dialog_force_show)
    if (dialog_shown) {
      if (dialog_shown === "no") {
        this.setState({ dialog_show: dialog_show, show_dialog: dialog_show, })
      } else if (dialog_shown == "yes") {
        this.setState({ dialog_show: dialog_show, })
      }
    } else {
      this.setState({ dialog_show: dialog_show, show_dialog: dialog_show })
    }
    this.setState({ dialog_button_positive: dialog_button_positive, dialog_message: dialog_message, dialog_navigation_screen: dialog_navigation_screen, dialog_title: dialog_title, dialog_force_show: dialog_force_show, dialog_image: dialog_image, dialog_navigation_url: dialog_navigation_url })

  }

  async componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    Linking.removeAllListeners("url")
    EventRegister.removeEventListener("topToHome")
    DeviceEventEmitter.removeAllListeners("topToHome")
  }

  doNavigateToContacts = () => {
    const storedDetails = this.context.loginState.userDetails
    if (Platform.OS === "android") {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          'title': 'Contacts',
          'message': 'This app would like to view your contacts.',
          'buttonPositive': 'Please accept bare mortal'
        }
      ).then(async value => {
        if (value === "granted") {
          try {
            const contacts = await Contacts.getAll();
            let userContacts: any[] = []
            contacts.forEach((contactItem, index) => {
              let displayName = contactItem.displayName || contactItem.givenName
              if (contactItem.phoneNumbers && Array.isArray(contactItem.phoneNumbers) && contactItem.phoneNumbers.length > 1) {
                contactItem.phoneNumbers.forEach(item => {
                  let userContact: any = {}
                  userContact.full_phone_number = item.number.replace(/\D/g, '')
                  if (displayName.trim() != "") {
                    userContact.first_name = Platform.select({ ios: contactItem.givenName, android: contactItem.displayName })
                    userContact.last_name = Platform.select({ ios: contactItem.familyName, android: contactItem.displayName })
                    userContact.middle_name = Platform.select({ ios: contactItem.middleName, android: contactItem.displayName })
                  }
                  userContacts.push(userContact)
                })

              } else if (contactItem.phoneNumbers && Array.isArray(contactItem.phoneNumbers) && contactItem.phoneNumbers.length > 0) {
                let userContact: any = {}
                userContact.full_phone_number = contactItem.phoneNumbers[0].number.replace(/\D/g, '')
                if (displayName.trim() != "") {
                  userContact.first_name = Platform.select({ ios: contactItem.givenName, android: contactItem.displayName })
                  userContact.last_name = Platform.select({ ios: contactItem.familyName, android: contactItem.displayName })
                  userContact.middle_name = Platform.select({ ios: contactItem.middleName, android: contactItem.displayName })
                }
                userContacts.push(userContact)
              }
            })
            this.setState({ isCntEmptyShow: userContacts.length <= 0 })
            this.doSyncContacts(userContacts)

          } catch (error) {
            this.setState({ isCntLoading: false, isCntEmptyShow: true })
          }
        } else {
          Toast.show({
            type: "error",
            text1: "Please allow to read contact, Settings > Apps > Opigo > Permissions > Allow Contacts then try again"
          })
        }
      })
    } else {
      this.props.navigation.navigate('ContactsList', { propsData: storedDetails, from: "SideMenu" })
    }
  }

  increaseHeight = () => {
    Animated.timing(this.state.Animatedwidth, {
      toValue: deviceWidth - scaledSize(40),
      duration: 250,
      useNativeDriver: false
    }).start(() => {
      this.setState({ usersDetail: [], stockDetail: [], cryptoDetail: [], selectedTab: 'All', searchStock: '' })
    })
  }

  decreaseHeight = () => {
    Animated.timing(this.state.Animatedwidth, {
      toValue: deviceWidth - scaledSize(120),
      duration: 250,
      useNativeDriver: false
    }).start()
  }

  hasModalShow = async () => {
    let showModal = await getStorageData("showModal");
    if (showModal == "true") {
      // this.setState({ showInfoModal: true });
      await setStorageData("showModal", "false");
    }
  };

  hasBannerModalShow = async () => {
    let showModal = await getStorageData("showBannerModal");
    if (showModal == "true") {
      // this.setState({ showBannerModal: true });
      await setStorageData("showBannerModal", "false");
    }
  };

  handleBackButton = async () => {
    const linkingData = await Linking.getInitialURL()
    if (linkingData && typeof linkingData === "string") {
      if (this.props.navigation.canGoBack()) {
        if (this.state.isFocus) {
          this.setState({ isFocus: false, searchStock: '', searchVisible: false })
        } else {
          this.props.navigation.goBack(null);
        }
        return true;
      }
      else {
        if (this.state.isFocus) {
          this.setState({ isFocus: false, searchStock: '', searchVisible: false })
        }
        else {
          BackHandler.exitApp()
        }
        return true
      }
    } else {
      if (this.state.isFocus) {
        this.setState({ isFocus: false, searchStock: '', searchVisible: false })
      }
      else {
        BackHandler.exitApp()
      }
      return true
    }
  }

  goToFriendProfilePage = async (id: any) => {
    const accountid = await getStorageData("AccountID");
    if (accountid == id) {
      this.props.navigation.navigate("MyTabs", { screen: "Profiles" });
      setEvent("my profile viewed", { "screen": "home" })
    } else {
      this.props.navigation.navigate("FriendProfiles", { id: id });
    }
  };

  addDataToOpigoScores = (oldScores: any, newScore: number, id: string) => {
    let index = oldScores?.length && oldScores.findIndex((oldData: any) => Object.keys(oldData)[0] == id)
    if (index == -1) {
      oldScores.push({ [id]: newScore })
    }
    else {
      oldScores[index] = { [id]: newScore }
    }
  }

  updateStockTrack = (index: any) => {
    if (this.state.selectedTab == 'All') {
      const data = [...this.state.usersDetail, ...this.state.stockDetail, ...this.state.cryptoDetail]
      let userDetailsData = [...this.state.usersDetail]
      let stockDetailsData = [...this.state.stockDetail]
      let cryptoDetailData = [...this.state.cryptoDetail]
      const item = data[index];
      item.attributes.stock_details.is_track = !item.attributes.stock_details.is_track;
      data[index] = item;
      this.setState({ usersDetail: userDetailsData, stockDetail: stockDetailsData, cryptoDetail: cryptoDetailData })
    }
    else if (this.state.selectedTab == 'Stocks') {
      const stocksData = [...this.state.stockDetail]
      const item = stocksData[index];
      item.attributes.stock_details.is_track = !item.attributes.stock_details.is_track;
      stocksData[index] = item;
      this.setState({ stockDetail: stocksData, })
    }
    else {
      const usersDetaildata = [...this.state.usersDetail]
      this.setState({ usersDetail: usersDetaildata })
    }
  }

  updateTrack = (index: any) => {
    if (this.state.selectedTab == 'All') {
      const data = [...this.state.recentAllDetail]
      const item = data[index];
      item.attributes.search_result_details.is_track = !item.attributes.search_result_details.is_track;
      data[index] = item;
      this.setState({ recentAllDetail: data, })
    }
    else if (this.state.selectedTab == 'Stocks') {
      const recentstockDetailData = [...this.state.recentstockDetail]
      const recentUserDetailItem = recentstockDetailData[index];
      recentUserDetailItem.attributes.search_result_details.is_track = !recentUserDetailItem.attributes.search_result_details.is_track;
      recentstockDetailData[index] = recentUserDetailItem;
      this.setState({ recentstockDetail: recentstockDetailData })
    } else {
      const recentUserDetaildata = [...this.state.recentUserDetail]
      this.setState({ recentUserDetail: recentUserDetaildata })
    }
  }

  navigateToDetail = (item: any, from: string) => {
    Keyboard.dismiss()
    this.setState({ isExpandMore: false, })
    let header
    if (from == 'recent') {
      let { symbol, name, exchange } = item.attributes.search_result_details
      header = {
        symbol: symbol,
        name: name,
        exchange: exchange,
        stock_company_id: item.attributes.searchable_id
      }
    } else {
      let { symbol, name, exchange, id } = item.attributes.stock_details
      header = {
        symbol: symbol,
        name: name,
        exchange: exchange,
        stock_company_id: id
      }
    }
    this.props.navigation.navigate("StockDetail", { header: header })
  }


  navigate = async (item: any, from: string) => {
    const accountid = await getStorageData("AccountID");
    this.setState({ isFocus: false, searchStock: '' })
    let recentSearchType
    if (from == 'recent') {
      if (item.attributes.searchable_type == "StockCompany") {
        recentSearchType = [
          {
            searchable_id: item.attributes.searchable_id,
            searchable_type: 'StockCompany'
          }
        ]
        this.navigateToDetail(item, from)
      } else {
        recentSearchType = [
          {
            searchable_id: item.attributes.searchable_id,
            searchable_type: 'AccountBlock::Account'
          }
        ]
        if (accountid == item.attributes.searchable_id) {
          this.props.navigation.navigate("MyTabs", { screen: "Profiles" })
          setEvent("my profile viewed", { "screen": "home" })
        } else {
          this.props.navigation.navigate("FriendProfiles", { 'id': item.attributes.searchable_id })
        }
      }
    }
    else {
      if (item.type == "stock_company") {
        recentSearchType = [
          {
            searchable_id: item.id,
            searchable_type: 'StockCompany'
          }
        ]
        this.navigateToDetail(item, from)
      } else {
        recentSearchType = [
          {
            searchable_id: item.id,
            searchable_type: 'AccountBlock::Account'
          }
        ]
        if (accountid == item.id) {
          this.props.navigation.navigate("MyTabs", { screen: "Profiles" })
          setEvent("my profile viewed", { "screen": "home" })
        } else {
          this.props.navigation.navigate("FriendProfiles", { 'id': item.id })
        }
      }
    }
    this.addReacentuser(recentSearchType)
  }



  removeFromList = (id: any, type: string) => {
    console.log('id,type', id, type)
    if (type == 'poll') {
      let temp = this.state.HomeItemList
      console.log('temp', temp)
      let index = temp.findIndex((data: any) => data.data.id == id)
      console.log('index', index)
      if (index != -1) {
        temp.splice(index, 1)
        this.setState({ HomeItemList: temp })
      }
    } else if (type == 'card') {
      let temp = this.state.HomeItemList
      let index = temp.findIndex((data: any) => data.data.id == id)
      if (index != -1) {
        temp.splice(index, 1)
        this.setState({ HomeItemList: temp })
      }
    }
    else if (type == "post") {
      let temp = this.state.HomeItemList
      let index = temp.findIndex((data: any) => data.data.id == id)
      if (index != -1) {
        temp.splice(index, 1)
        this.setState({ HomeItemList: temp })
      }
    }
  }
  removePostFromTrackList = (id: any) => { }

  submitPollAnswer = (type: string, selectedPoll: any, selectedPollItem: any) => {
    this.setState({ submitLoading: true })
    if (type == listOfPollType[0].key) {
      this.PollAns('single', selectedPoll, selectedPollItem)
    } else if (type == listOfPollType[1].key) {
      this.PollAns("compare2", selectedPoll, selectedPollItem)
    }
    else if (type == listOfPollType[3].key) {
      this.PollAns("custom", selectedPoll, selectedPollItem)
    }
    else {
      this.PollAns("multi", selectedPoll, selectedPollItem)
    }
  }

  markAsComplete = (data: any) => {
    console.log('markAsComplete data', data)
    if (data) {
      let temp = this.state.HomeItemList
      console.log('temp', temp)
      let index = temp.findIndex((detail: any) => detail.data.id == data.id)
      console.log('index', index)
      if (index != -1) {
        // temp.splice(index, 1, {data:data})
        temp.splice(index, 1)
        this.setState({ temp: !this.state.temp })
      }
    }
  }

  onClickVideo = (videourl: any) => {
    this.setState({ playid: videourl, pause: false });
    if (this.state.playid == videourl) {
      this.setState({ pause: true, playid: "" });
    }
  };

  onClickVideoVolume = (videourl: any) => {
    this.setState({ volume: !this.state.volume })
  };

  doSearchEvent = async (text: string) => {
    let params = {
      alias: "opigo_explore_text",
      description: "Product Search",
      searchQuery: "user search query terms for " + text,
      customData: {
        "search": text,
      }
    }
    let event = new BranchEvent(BranchEvent.Search, undefined, params)
    event.logEvent()
  }

  changeSearch = (text: any) => {
    this.setState({ searchStock: text })
    clearTimeout(this.searchTimeOut)
    if (text.length >= 2) {
      this.setState({ isExpandMore: true, isSearchLoading: true })
      this.searchTimeOut = setTimeout(() => {
        this.searchUserAndCompany(text)
        setEvent("search query", {
          "query": text,
          "filter": this.state.selectedTab
        })
      }, 600);
    } else {
      this.setState({ isExpandMore: false })
    }
    this.doSearchEvent(text);
  }

  handleUrl = ({ url }: any) => {
    Linking.canOpenURL(url).then(async (supported) => {
      if (supported) {
        DeepLinking.evaluateUrl(url);
        if ((Platform.OS === "ios" && AppState.currentState === "background") || (Platform.OS === "android" && AppState.currentState === "active")) {
          if (url && typeof url === "string") {
            let isCardTypeLink = url.includes("bx_block_share_card/card");
            let isShareAccount = url.includes("share_account");
            let isPollTypeLink = url.includes("bx_block_share_poll/poll");
            let isPostTypeLink = url.includes("bx_block_posts/post_detail");
            if (isShareAccount) {
              let linkingDataArray = url.split("/")
              const accountid = await getStorageData("AccountID");
              const userId = linkingDataArray[linkingDataArray.length - 2]
              let data = {
                account_id: userId,
                screen_name: accountid === userId ? "MyProfile" : "FriendProfile"
              }
              this.ManageNavigation(data)
            } else if (isCardTypeLink) {
              let data = {
                card_id: url.substring(url.lastIndexOf('/') + 1),
                screen_name: "card"
              }
              this.ManageNavigation(data)
            } else if (isPollTypeLink) {
              let data = {
                poll_id: url.substring(url.lastIndexOf('/') + 1),
                screen_name: "poll"
              }
              this.ManageNavigation(data)
            }
            else if (isPostTypeLink) {
              let data = {
                post_id: url.substring(url.lastIndexOf('/') + 1),
                screen_name: "post"
              }
              this.ManageNavigation(data)
            }
          }
        }
      }
    });
  };

  refresh = () => {
    this.setState({ isRefreshLoading: true, page: 1, cardFilterItem: undefined, isScrollEnded: true, HomeItemList: [], isLoading: true }, () => {
      this.getDashBoardList(this.state.userToken)
      this.getSuggestedProfiles()
      this.getExploreDetail(this.state.userToken)
      this.getUserBalance()
      this.notificationCount2(this.state.userToken)
    })
  }

  loadMoreData = () => {
    if (!this.state.isLoadMore && !this.state.isLastpage) {
      this.setState({ isLoadMore: true, page: this.state.page + 1 }, () => {
        this.getDashBoardList(this.state.userToken)
      })
    }
  }

  onPressFollowUnfollow = (is_follow: boolean, id: any, score: any) => {
    let data = {
      "unfollowed user": id,
      "followed user score": score,
      "screen": "home"
    }
    let followData = {
      "followed user": id,
      "followed user score": score,
      "screen": "home"
    }
    this.setState({ idFollowUnfollow: id, followUnfollowBtnDisabled: true })
    if (is_follow) {
      this.unFollowApiCall(id)
      setEvent("user unfollowed", data)
    } else {
      this.followApiCall(id)
      setEvent("user followed", followData)
    }
  }
  listOfTimeHorizone = {
    "next_1_month": "Next 1 Month",
    'next_1_to_6_month': "Next 1-6 Months",
    'next_6_to_12_month': "Next 6-12 Months",
    'more_than_1_year': "More than 1 Year"
  }

  listOfStockCatogary = [{ name: "Bullish", key: 'bullish' }, { name: "Bearish", key: 'bearish' }, { name: "Neutral", key: 'neautral' }]

  async receive(from: string, message: Message) {
    // Customizable Area Start
    // runEngine.debugLog("Message Recived in Post page:", message);
    if (getName(MessageEnum.RestAPIResponceMessage) == message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      var errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );
      if (apiRequestCallId !== null) {
        if (apiRequestCallId == this.apiExplore) {
          if (responseJson && responseJson.data) {
            let shots: any = []
            let blog: any = []
            let news: any = []
            let ad1: any = []
            let ad2: any = []
            let res = responseJson.data
            res.map((item: any, index: number) => {
              if (item.attributes.expl_type == this.exploreType[0]) {
                shots.push(item)
              } else if (item.attributes.expl_type == this.exploreType[1]) {
                blog.push(item)
              } else if (item.attributes.expl_type == this.exploreType[2]) {
                news.push(item)
              } else if (item.attributes.expl_type == this.exploreType[4]) {
                ad1.push(item)
              }
              else if (item.attributes.expl_type == this.exploreType[5]) {
                ad2.push(item)
              }
              else {
                ad2.push(item)
              }
            })


            this.setState({ shots: shots, blogs: blog, news: news, ad1: ad1, ad2: ad2, isLoading: false, isRefreshing: false })
            this.hasBannerModalShow()
          }
          else {
            this.setState({ isLoading: false, isRefreshing: false })
            const { errors } = responseJson
            if (errors && Array.isArray(errors) && errors.length > 0) {
              const { token } = errors[0]
              if (token) {
                logoutUser("force")
                //@ts-ignore
                this.context.authContext.signOut()
                return
              }
              return
            }
          }
        }

        if (apiRequestCallId == this.dashBoardList) {
          if (responseJson) {
            const { errors, data, meta } = responseJson
            if (errors && Array.isArray(errors) && errors.length > 0) {
              const { token } = errors[0]
              if (token) {
                logoutUser("force")
                //@ts-ignore
                this.context.authContext.signOut()
                return
              }
              this.setState({ HomeItemList: [], isLoadMore: false })
              return
            }
            if (data && Array.isArray(data)) {

              let companyNamesFromCard = JSON.parse(JSON.stringify(data))
              companyNamesFromCard.filter((value: any) => value?.data?.type === "card_detail" || value?.data?.type === "poll")
              companyNamesFromCard = companyNamesFromCard.map((value: any) => {
                return value.data
              })
              //for poll update 
              let companyFromPolls = JSON.parse(JSON.stringify(data))
              companyFromPolls.filter((value: any) => value?.data?.type === "poll")
              companyFromPolls = companyFromPolls.map((value: any) => {
                return value.data
              })
              const isLastpage = meta?.last_page === meta?.page;
              if (Array.isArray(data)) {
                this.setState((prevState) => ({
                  HomeItemList: [...prevState.HomeItemList, ...data],
                  isLastpage: isLastpage,
                }));
              }
            }
            this.setState({ isScrollEnded: false })
          }
          this.setState({ isLoading: false, isRefreshLoading: false, isSuggestedUserLoading: false, isLoadMore: false, })
        }
        if (apiRequestCallId == this.createAns) {
          this.setState({ isLoading: false, submitLoading: false, })
          if (responseJson?.data) {
            let arr = this.state.HomeItemList
            arr.map(element => {
              if (element.data.type === "poll") {
                if (element.data.id === this.state.selectedPoll) {
                  element.data.attributes.can_register_my_response = false
                  element.data.attributes.status = "approved"
                  element.data.attributes.new_response_by_percentage = responseJson.meta.new_final_response
                  element.data.attributes.current_user_answers = { data: responseJson.data }
                }
              }
              return element
            });
            this.setState({ HomeItemList: arr })
            Toast.show({
              type: 'success',
              text1: 'Your response has been submitted!',
            });
          } else {
            //error
          }
        }
        if (apiRequestCallId == this.getSuggestedProfileCallId) {
          if (responseJson && responseJson?.errors) {
            const { message } = responseJson?.errors[0];
            if (message === "Please login again.") {
              logoutUser("force")
              //@ts-ignore
              this.context.authContext.signOut()
              return
            }
          }
          if (responseJson?.data) {
            this.setState({
              suggestedProfiles: responseJson?.data,
            })
          }
          this.setState({ isLoading: false, isSuggestedUserLoading: false })
        }
        if (apiRequestCallId == this.apiNotificationList) {
          if (responseJson && responseJson.data) {
            return;
          } else {
            if (responseJson && responseJson.unread_notification) {
              let temp = responseJson.unread_notification;
              this.setState({ notificationCount: temp });
              this.context.authContext.setNotificationCount(temp);
            }
          }
        }
        if (apiRequestCallId == this.followUserApiCallId) {
          this.setState({ isLoading: false })
          if (responseJson.message == "Followed successfully") {
            let temp = this.state.suggestedProfiles
            temp.map((item: any) => {
              if (item.id == this.state.idFollowUnfollow) {
                return item.attributes.is_follow = true
              }
            })
            this.setState({ suggestedProfiles: temp, idFollowUnfollow: '', followUnfollowBtnDisabled: false })
          }
        }
        if (apiRequestCallId === this.unfollowUserApiCallId) {
          this.setState({ isLoading: false })
          if (responseJson.message == "unfollowed successfully") {
            let temp = this.state.suggestedProfiles
            temp.map((item: any) => {
              if (item.id == this.state.idFollowUnfollow) {
                return item.attributes.is_follow = false
              }
            })
            this.setState({ suggestedProfiles: temp, idFollowUnfollow: '', followUnfollowBtnDisabled: false })
          }
        }
        if (this.apiDoGetUserBalanceId == apiRequestCallId) {
          if (responseJson) {
            const { errors, data } = responseJson
            if (errors && Array.isArray(errors) && errors.length > 0) {
              const { token } = errors[0]
              if (token) {
                logoutUser("force")
                return
              }
              return
            }
            this.setState({ balanceDetail: responseJson })
          }
        }
        if (apiRequestCallId == this.apiDoSyncContactsCallId) {
          this.setState({ isLoading: false, })
          if (responseJson) {
            const { errors } = responseJson
            if (errors && Array.isArray(errors) && errors.length > 0) {
              const { token } = errors[0]
              if (token) {
                logoutUser("force")
                //@ts-ignore
                this.context.authContext.signOut()
                return
              }
              return
            }
            const { data } = responseJson
            if (data && Array.isArray(data)) {
              let filteredData = data.filter((item: any) => item?.attributes?.account && item?.attributes?.is_exist && !item?.attributes.is_follow)
              this.setState({ contactsList: filteredData, orgContactsList: filteredData }, () => {
                this.setState({ isCntEmptyShow: this.state.contactsList.length <= 0 })
              })
            }
          }
        }
        if (apiRequestCallId == this.apiRecentSearch) {
          if (responseJson && responseJson.error) {
            this.setState({ isRecentSearchLoading: false })
          }
          if (responseJson && responseJson.data && Array.isArray(responseJson.data)) {
            let user: any = []
            let stock: any = []
            let crypto: any = []
            responseJson.data.map((item: any, index: number) => {
              if (item.attributes.searchable_type == "StockCompany") {
                if (item.attributes.search_result_details.category == "stock") {
                  stock.push(item)
                } else {
                  crypto.push(item)
                }
              } else {
                user.push(item)
              }
            })
            this.setState({ recentUserDetail: user, recentstockDetail: stock, recentCryptoDetails: crypto, recentAllDetail: responseJson.data })
          }
          if (errorReponse) {
            this.setState({ recentUserDetail: [], recentstockDetail: [], recentAllDetail: [], recentCryptoDetails: [] })
          }
          this.setState({ isRecentSearchLoading: false })
        }
        if (apiRequestCallId == this.apiSearchUserAndCompany) {
          this.setState({ isSearchLoading: false })
          if (responseJson && responseJson.errors) {
            return this.setState({ usersDetail: [], stockDetail: [] })
          }
          if (responseJson) {
            let stock: any = []
            let crypto: any = []
            responseJson.stock_list.data.map((item: any) => {
              if (item.attributes.stock_details.category == "stock") {
                stock.push(item)
              }
              else {
                crypto.push(item)
              }
            });
            this.setState({ usersDetail: responseJson.account_list.data, stockDetail: stock, cryptoDetail: crypto })
          }
          else {
            this.setState({ usersDetail: [], stockDetail: [] })
          }
        }
        if (apiRequestCallId == this.apiTrakDetails) {
          if (responseJson && responseJson.error) {
            return
          } else {
            DeviceEventEmitter.emit("trackEvent", {});
          }
        }
        if (apiRequestCallId == this.apiRemoveBookMark) {
          if (responseJson && responseJson.error) {
            return
          } else {
            DeviceEventEmitter.emit("trackEvent", {});
          }
        }
      }
    }
  }

  doClickSubmitDialog = () => {
    AsyncStorage.setItem("dialog_shown", "yes")
    const remoteConfigData = remoteConfig();
    remoteConfigData.setDefaults({ dialog_show: false })

    if (this.state.dialog_navigation_screen == "notification") {
      Linking.openSettings();
    }
    if (this.state.dialog_navigation_screen === "update") {
      let URL = ""
      if (Platform.OS === "android") {
        URL = 'https://play.google.com/store/apps/details?id=com.OpiGo1final'
      } else if (Platform.OS == "ios") {
        URL = 'https://apps.apple.com/in/app/opigo/id1619955231'
      } else {
        URL = "https://www.opigo.in"
      }
      if (URL) {
        Linking.openURL(URL)
      }
    }
    if (this.state.dialog_navigation_screen === "url") {
      if (URL) {
        Linking.openURL(this.state.dialog_navigation_url);
      }
    }
  }

  removePollFromTrackList = (id: any) => { }

  //first api
  getRecentSearch = async () => {
    // apiRecentSearch
    const token = await getStorageData("Token");
    this.setState({ isRecentSearchLoading: true })
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiRecentSearch = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.recentSearch
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  //second api
  removeStockBookMark = async (id: any, index: any) => {
    this.updateStockTrack(index)
    const token = await getStorageData("Token");
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };
    let data = JSON.stringify({
      "id": id
    })
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiRemoveBookMark = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.removeTrackDetails
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      data
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpDeleteMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  removeBookMark = async (id: any, index: any) => {
    this.updateTrack(index)
    const token = await getStorageData("Token");
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };
    let data = JSON.stringify({
      "id": id
    })
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiRemoveBookMark = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.removeTrackDetails
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      data
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpDeleteMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  //third api
  addReacentuser = async (data: any) => {
    const token = await getStorageData("Token");
    // apiAddReacentSearch
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiAddReacentSearch = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.addReacentSearch
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(data)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  //fourth api
  handleAllUser = async (id: any, index: any) => {
    this.updateStockTrack(index)
    const token = await getStorageData("Token");
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };
    let data = JSON.stringify({
      "id": id
    })
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiTrakDetails = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.trackDetails
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      data
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  //fifth api
  getUserBalance = async () => {
    const token = await getStorageData('Token');
    const header = {
      'Content-Type': configJSON.getUserDataApiContentType,
      Authorization: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );
    this.apiDoGetUserBalanceId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getUserBalance,
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod,
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  };

  //sixth api
  handleRecentBookMark = async (id: any, index: any) => {
    this.updateTrack(index)
    const token = await getStorageData("Token");
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };
    let data = JSON.stringify({
      "id": id
    })
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiTrakDetails = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.trackDetails
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      data
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  handleBookMark = async (id: any, index: any) => {
    this.updateStockTrack(index)
    const token = await getStorageData("Token");
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };
    let data = JSON.stringify({
      "id": id
    })
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiTrakDetails = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.trackDetails
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      data
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  //seven api
  PollAns = (type: string, selectedPoll: any, selectedPollItem: any) => {
    let apiData
    if (type == "single") {
      if (!selectedPollItem) {
        Toast.show({
          type: "success",
          text1: "Please select any option"
        })
        this.setState({ submitLoading: false })
        return
      }
      apiData = {
        poll_id: selectedPoll,
        data: {
          vote_for: selectedPollItem
        }
      }
    } else if (type == 'compare2') {
      if (!selectedPollItem) {
        Toast.show({
          type: "success",
          text1: "Please select any option"
        })
        this.setState({ submitLoading: false })
        return
      }
      apiData = {
        poll_id: selectedPoll,
        data: {
          poll_stock_id: selectedPollItem
        }
      }
    } else if (type == 'custom') {
      if (!selectedPollItem) {
        Toast.show({
          type: "success",
          text1: "Please select any option"
        })
        this.setState({ submitLoading: false })
        return
      }
      apiData = {
        poll_id: selectedPoll,
        data: {
          vote_for: selectedPollItem
        }
      }
    }
    else {
      apiData = {
        poll_id: selectedPoll,
        data: {
          ids_in_sequence: selectedPollItem
        }
      }
    }
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: this.state.userToken,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.createAns = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.createAns
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(apiData)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  //eight api
  deletePost = async (id: any) => {
    this.setState({ deleteSocialId: id })
    const token = await getStorageData("Token");
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiDeletePostCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.deletePostApi + id
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpDeleteMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  //nine api
  getDashBoardList = (token: string) => {
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.dashBoardList = requestMessage.messageId;
    let httpParams = {
      page: this.state.page,
      per_page: "18"
    }
    let url = "";
    if (httpParams) {
      if (this.state.cardFilterItem) {
        url = `${configJSON.dashboardListApiEndPoint}?${jsonToQueryString(filterEmptyValues({ ...httpParams, ...this.state.cardFilterItem }))}`
      } else {
        url = `${configJSON.dashboardListApiEndPoint}?${jsonToQueryString(httpParams)}`
      }
    } else {
      url = configJSON.dashboardListApiEndPoint
    }
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      url
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  //ten api
  getSuggestedProfiles = async () => {
    const token = await getStorageData("Token");
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: this.state.userToken
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.getSuggestedProfileCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getSuggestedProfiles
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  //11 api
  searchUserAndCompany = async (text: string) => {
    const token = await getStorageData("Token");
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };
    let data = {
      "name": text.toLowerCase()
    }
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiSearchUserAndCompany = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getUserAndCompany
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(data)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  //12 api
  followApiCall = async (account_ids: any[]) => {
    let data = JSON.stringify(
      {
        account_id: account_ids
      },
    );
    const token = await getStorageData("Token");
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.followUserApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.followApiEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      data
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  };

  //13 api
  getExploreDetail = (token: string) => {
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiExplore = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.explore
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  //14 api
  unFollowApiCall = async (id: any) => {
    const token = await getStorageData('Token')
    let data = JSON.stringify({
      account_id: id,
    });
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.unfollowUserApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.unfollowApiEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      data
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpDeleteMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  };

  //15 api
  doSyncContacts = async (userContacts: any[]) => {
    let token = await getStorageData('Token')
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };
    let httpData = {
      data: userContacts
    }
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiDoSyncContactsCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.syncContactsApiEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpData)
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  //16 api
  notificationCount2 = async (token: string) => {
    let endPoint = configJSON.getUnreadNotificationCount;
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiNotificationList = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  };
  // Customizable Area End
}


//comment code
// getCardDetail = (token: string) => {
//   const header = {
//     "Content-Type": configJSON.httpApiContentType,
//     token: token,
//   };
//   const requestMessage = new Message(
//     getName(MessageEnum.RestAPIRequestMessage)
//   );
//   this.apiCard = requestMessage.messageId;
//   requestMessage.addData(
//     getName(MessageEnum.RestAPIResponceEndPointMessage),
//     configJSON.getCard + "page=" + this.state.page
//   );
//   requestMessage.addData(
//     getName(MessageEnum.RestAPIRequestHeaderMessage),
//     JSON.stringify(header)
//   );
//   requestMessage.addData(
//     getName(MessageEnum.RestAPIRequestMethodMessage),
//     configJSON.httpGetMethod
//   );
//   runEngine.sendMessage(requestMessage.id, requestMessage);
//   return true;
// }