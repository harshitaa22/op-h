// // Customizable Area Start
// import React, { useState, useEffect, useRef } from 'react';
// import {
//   deviceWidth,
//   getStorageData,
//   removeStorageData,
//   scaledSize,
//   setStorageData,
// } from '../framework/src/Utilities';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   AppState,
//   Linking,
//   StatusBar,
//   Platform,
//   Alert,
//   Modal,
//   TouchableWithoutFeedback,
//   ActivityIndicator,
// } from 'react-native';
// import MyDrawer from './Navigation/drawer';
// import AuthStack from './Navigation/authStack';
// import { AuthContext } from './Navigation/context';
// import Splashscreen from '../blocks/splashscreen/src/Splashscreen';
// import Tutorial from './Navigation/Tutorial';
// import messaging from '@react-native-firebase/messaging';
// import Toast from 'react-native-toast-message';
// import colors from '../blocks/FriendList/src/colors';
// import { navigate } from './Navigation/RootNavigation';
// import { Fonts } from '../components/src/Utils/Fonts';
// import {
//   getLivepriceFormSocket,
//   setEvent,
//   stopScoket,
// } from '../components/src/Utils/service';
// import { Provider } from 'react-redux';
// import configureStore from './Navigation/store';
// import * as Sentry from '@sentry/react-native';
// import codePush, { CodePushOptions, DownloadProgress } from 'react-native-code-push';
// import { PermissionsAndroid } from 'react-native';
// import { notificationData, setNotificationData } from '.';
// import { removeAllListeners } from 'process';
// import CodePush from 'react-native-code-push';
// // Customizable Area End

// Sentry.init({
//   dsn:
//     'https://eb097bf1da4c426f99f17233d75163cd@o421213.ingest.sentry.io/4504547713024000',
//   // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
//   // We recommend adjusting this value in production.
//   tracesSampleRate: 1.0,
//   environment: 'production',
//   release: '3145778(1.1.0)',
//   attachStacktrace: true,
// });
// let firstTime;
// const store = configureStore();
// let codePushOptions = { installMode: codePush.InstallMode.IMMEDIATE, checkFrequency: codePush.CheckFrequency.ON_APP_RESUME, };

// const App = () => {
//   const [showTutorial, setShowTutorial] = useState(false);
//   const [screnName, setScrenName] = useState(null);
//   const [isDownloaded, setDwonloaded] = useState(false);
//   const appState = useRef(AppState.currentState);
//   const [progress, setProgress] = useState(false)
//   const [loader, setLoader] = useState(false)

//   const downloadCodepushBundle = () => {
//     try {
//       CodePush.sync(
//         {
//           installMode: CodePush.InstallMode.ON_NEXT_RESTART,
//           mandatoryInstallMode: CodePush.InstallMode.ON_NEXT_RESTART,

//         },
//         syncStatus => {
//           switch (syncStatus) {

//             case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
//               console.log("CHECKING_FOR_UPDATE");

//               break;
//             case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
//               console.log("DOWNLOADING_PACKAGE");

//               break;
//             case CodePush.SyncStatus.INSTALLING_UPDATE:
//               console.log("INSTALLING_UPDATE");
//               setDwonloaded(true)
//               setLoader(false)

//               break;
//             case CodePush.SyncStatus.UPDATE_INSTALLED:

//               console.log("UPDATE_INSTALLED");

//               break;
//           }
//         },
//         (progress) => {


//           setProgress(true);
//           console.log("progressprogress", progress);


//         },
//       );
//     } catch (error) {
//       console.log("downloadCodepushBundle error", error);

//     }
//   }

//   const checkForUpdates = async () => {
//     console.log("progressprogress", progress);


//     // try {
//     // const updateCheckResult = await CodePush.checkForUpdate();


//     try {
//       const update = await CodePush.checkForUpdate();
//       console.log("updateupdateupdateupdate", update);

//       if (update != null) {
//         setProgress(true);
//         console.log("progressprogress1", progress);
//       }

//     } catch (error) {
//       console.log('CodePush update error:', error);

//     } finally {
//       console.log("progressprogress2", progress);
//     }
//     // }
//     //   if (updateCheckResult) {
//     //     console.log("updateCheckResultupdateCheckResult");
//     //     Alert.alert(
//     //       'Update Available',
//     //       'A new version of the app is available. Do you want to update now?',
//     //       [
//     //         {
//     //           text: 'Cancel',
//     //           style: 'cancel',
//     //         },
//     //         {
//     //           text: 'Update Now',
//     //           onPress: () => {
//     //             CodePush.restartApp(true);
//     //           },
//     //         },
//     //       ],
//     //     );
//     //   }
//     // } catch (error) {
//     //   console.error('CodePush check for update failed', error);
//     // }
//   };


//   // async function checkCodePushAndSync() {
//   //   codePush.sync(
//   //     {
//   //       installMode: CodePush.InstallMode.ON_NEXT_RESTART,
//   //       mandatoryInstallMode: CodePush.InstallMode.ON_NEXT_RESTART
//   //     },
//   //     async (status) => {
//   //       switch (status) {

//   //         case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
//   //           checkForUpdates();
//   //           console.log("DOWNLOADING_PACKAGE");

//   //           break;
//   //         case CodePush.SyncStatus.UPDATE_INSTALLED:
//   //           console.log("UPDATE_INSTALLED");
//   //           break;
//   //         case CodePush.SyncStatus.INSTALLING_UPDATE:
//   //           console.log("INSTALLING_UPDATE");
//   //           checkForUpdates();
//   //           break;
//   //         case CodePush.SyncStatus.SYNC_IN_PROGRESS:
//   //           console.log("SYNC_IN_PROGRESS");
//   //           break;
//   //       }
//   //     },
//   //     (progress) => {
//   //       console.log("setSyncProgresssetSyncProgress", progress);
//   //     },
//   //   );
//   // }


//   const initialLoginState = {
//     // Customizable Area Start
//     isLoading: true,
//     userName: null,
//     userToken: null,
//     commentCount: 0,
//     tabsPress: {
//       home: 1,
//       explore: 0,
//       track: 0,
//       profile: 0,
//     },
//     isSocialtrackChange: false,
//     isPolltrackChange: false,
//     isCardtrackChange: false,
//     isShowDot: false,
//     notificationCount: 0,
//     livePrices: {},
//     socialTrackCount: [],
//     cardTrackCount: [],
//     pollTrackCount: [],
//     userDetail: {},
//     userDetails: {},
//     isSignOut: false,
//     isCompletedProcess: false,
//     showTabBar: true,
//     isPollRefreshed: false,
//     opigoScores: [],
//     likeDislikeCount: [],
//     likeDislikeCountPost: [],
//     invite_code: undefined,
//     screen_name_navigation: '',
//     // Customizable Area End
//   };

//   const loginReducer = (prevState: any, action: any) => {
//     switch (action.type) {
//       case 'RETRIEVE_TOKEN':
//         return {
//           ...prevState,
//           userToken: action.token,
//           isLoading: false,
//         };
//       case 'LOGIN':
//         return {
//           ...prevState,
//           userToken: action.token,
//           isLoading: false,
//         };
//       case 'LOGOUT':
//         return {
//           ...prevState,
//           userToken: null,
//           isLoading: false,
//           isSignOut: true,
//         };
//       case 'REGISTER':
//         return {
//           ...prevState,
//           userToken: action.token,
//           isLoading: false,
//         };
//       case 'COMMENT': {
//         return {
//           ...prevState,
//           commentCount: action.commentCount,
//         };
//       }
//       case 'TABPRESS': {
//         return {
//           ...prevState,
//           tabsPress: action.tabsPress,
//         };
//       }
//       case 'ISSHOWDOT': {
//         return {
//           ...prevState,
//           isShowDot: action.isShowDot,
//         };
//       }
//       case 'ISSOCIAL': {
//         return {
//           ...prevState,
//           isSocialtrackChange: action.data,
//         };
//       }
//       case 'ISCARD': {
//         return {
//           ...prevState,
//           isCardtrackChange: action.data,
//         };
//       }
//       case 'ISPOLL': {
//         return {
//           ...prevState,
//           isPolltrackChange: action.data,
//         };
//       }
//       case 'NOTIFICATION': {
//         return {
//           ...prevState,
//           notificationCount: action.data,
//         };
//       }
//       case 'LIVEPRICES': {
//         return {
//           ...prevState,
//           livePrices: action.data,
//         };
//       }
//       case 'UPDATECARD': {
//         return {
//           ...prevState,
//           cardTrackCount: action.data,
//         };
//       }
//       case 'UPDATESOCIAL': {
//         return {
//           ...prevState,
//           socialTrackCount: action.data,
//         };
//       }
//       case 'UPDATEPOLL': {
//         return {
//           ...prevState,
//           pollTrackCount: action.data,
//         };
//       }
//       case 'UPDATEUSER': {
//         return {
//           ...prevState,
//           userDetail: action.data,
//         };
//       }
//       case 'UPDATEUSERS': {
//         return {
//           ...prevState,
//           userDetails: action.data,
//         };
//       }
//       case 'PROCESSCOMPLETED': {
//         return {
//           ...prevState,
//           isCompletedProcess: action.data,
//         };
//       }
//       case 'SHOWTABBAR': {
//         return {
//           ...prevState,
//           showTabBar: action.data,
//         };
//       }
//       case 'POLLREFRESH': {
//         return {
//           ...prevState,
//           isPollRefreshed: action.data,
//         };
//       }
//       case 'OPIGOSCORE': {
//         return {
//           ...prevState,
//           opigoScores: action.data,
//         };
//       }
//       case 'UPDATELIKE': {
//         return {
//           ...prevState,
//           likeDislikeCount: action.data,
//         };
//       }
//       case 'UPDATELIKEPOST': {
//         return {
//           ...prevState,
//           likeDislikeCountPost: action.data,
//         };
//       }
//       case 'INVITE_CODE': {
//         return {
//           ...prevState,
//           invite_code: action.data,
//         };
//       }
//       case 'SCREEN_NAME': {
//         return {
//           ...prevState,
//           screen_name_navigation: action.data,
//         };
//       }
//     }
//   };

//   const [loginState, dispatch] = React.useReducer(
//     loginReducer,
//     initialLoginState,
//   );

//   const authContext = React.useMemo(
//     () => ({
//       signIn: async (foundUser: any, from: string) => {
//         const userToken = foundUser.token;
//         try {
//           await setStorageData('Token', userToken);
//           await setStorageData('isCompletedProcess', 'true');
//         } catch (e) {
//           console.log(e);
//         }
//         dispatch({ type: 'LOGIN', token: userToken });
//         dispatch({ type: 'PROCESSCOMPLETED', data: true });
//       },
//       signOut: async () => {
//         try {
//           removeStorageData('Token');
//           removeStorageData('firstTime');
//           removeStorageData('AccountID');
//           removeStorageData('fcmToken');
//           removeStorageData('ProfileToken');
//           removeStorageData('isCompletedProcess');
//           removeStorageData('AccountName');
//           removeStorageData('AccountProfilePic');
//           dispatch({ type: 'NOTIFICATION', data: 0 });
//           dispatch({ type: 'UPDATEUSER', data: {} });
//           dispatch({ type: 'UPDATEUSERS', data: {} });
//           dispatch({ type: 'UPDATECARD', data: [] });
//           dispatch({ type: 'UPDATESOCIAL', data: [] });
//           dispatch({ type: 'UPDATEPOLL', data: [] });
//           dispatch({ type: 'UPDATELIKE', data: [] });
//           dispatch({ type: 'UPDATELIKEPOST', data: [] });
//           dispatch({ type: 'PROCESSCOMPLETED', data: false });
//           dispatch({ type: 'INVITE_CODE', data: undefined });
//           dispatch({ type: 'SCREEN_NAME', data: "" });
//           messaging().deleteToken();
//         } catch (e) {
//           console.log(e);
//         }
//         dispatch({ type: 'LOGOUT' });
//       },
//       setComment: (count: any) => {
//         dispatch({ type: 'COMMENT', commentCount: count });
//       },
//       onTabPress: (data: any) => {
//         dispatch({ type: 'TABPRESS', tabsPress: data });
//       },
//       setShowDot: (data: any) => {
//         dispatch({ type: 'ISSHOWDOT', isShowDot: data });
//       },
//       setCard: (data: any) => {
//         dispatch({ type: 'ISCARD', data: data });
//       },
//       setPoll: (data: any) => {
//         dispatch({ type: 'ISPOLL', data: data });
//       },
//       setSocial: (data: any) => {
//         dispatch({ type: 'ISSOCIAL', data: data });
//       },
//       setNotificationCount: (data: any) => {
//         dispatch({ type: 'NOTIFICATION', data: data });
//       },
//       setLivePrices: (data: any) => {
//         dispatch({ type: 'LIVEPRICES', data: data });
//       },
//       setTrackCard: (data: any) => {
//         dispatch({ type: 'UPDATECARD', data: data });
//       },
//       setTrackPoll: (data: any) => {
//         dispatch({ type: 'UPDATEPOLL', data: data });
//       },
//       setTrackSocial: (data: any) => {
//         dispatch({ type: 'UPDATESOCIAL', data: data });
//       },
//       setUser: (data: any) => {
//         dispatch({ type: 'UPDATEUSER', data: data });
//       },
//       setUsers: (data: any) => {
//         dispatch({ type: 'UPDATEUSERS', data: data });
//       },
//       setTabBar: (data: any) => {
//         dispatch({ type: 'SHOWTABBAR', data: data });
//       },
//       setPollRefreshed: (data: any) => {
//         dispatch({ type: 'POLLREFRESH', data: data });
//       },
//       setOpiGoScores: (data: any) => {
//         dispatch({ type: 'OPIGOSCORE', data: data });
//       },
//       setLikeDislikeBtnCard: (data: any) => {
//         dispatch({ type: 'UPDATELIKE', data: data });
//       },
//       setLikeDislikeBtnPost: (data: any) => {
//         dispatch({ type: 'UPDATELIKEPOST', data: data });
//       },
//       setInviteCode: (data: any) => {
//         dispatch({ type: 'INVITE_CODE', data: data });
//       },
//       setScreenNameNavigation: (data: any) => {
//         console.log('data', data)
//         dispatch({ type: 'SCREEN_NAME', data: data });
//       },
//     }),
//     [],
//   );





//   useEffect(() => {
//     const initialCall = async () => {
//       let userToken;
//       userToken = null;
//       let isCompletedProcess;
//       try {
//         userToken = await getStorageData('Token');
//         firstTime = await getStorageData('fristTime');
//         isCompletedProcess = await getStorageData('isCompletedProcess');
//         if (firstTime == null) {
//           await setStorageData('fristTime', 'true');
//           setShowTutorial(true);
//           console.log("fristTimefristTimefristTime");
//           setEvent("app first open", null)
//         } else {
//           setShowTutorial(false);
//         }
//       } catch (e) {
//         console.log(e);
//       }
//       dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
//       dispatch({ type: 'PROCESSCOMPLETED', data: isCompletedProcess });
//     };
//     initialCall();
//     checkPermission();
//     messageListener();
//   }, []);


//   useEffect(() => {
//     Linking.getInitialURL().then(value => {
//       console.log('getInitialURL value', value);
//       if (value && typeof value === 'string') {
//         let isCardTypeLink = value.includes('bx_block_share_card/card');
//         let isShareAccount = value.includes('share_account');
//         if (isCardTypeLink) {
//           let data = {
//             card_id: value.substring(value.lastIndexOf('/') + 1),
//             screen_name: 'card',
//           };
//           ManageNavigation(data);
//         } else if (isShareAccount) {
//           let data = {
//             account_id: value.substring(value.lastIndexOf('/') + 1),
//             screen_name: 'FriendProfile',
//           };
//           ManageNavigation(data);
//         }
//       }
//     });
//     let subscription = AppState.addEventListener(
//       'change',
//       async nextAppState => {
//         if (
//           appState.current.match(/inactive|background/) &&
//           nextAppState === 'active'
//         ) {
//           console.log("dsfdklsfhdshfls");
//           // const CleverTap = require('clevertap-react-native');
//           // CleverTap.addListener(CleverTap.CleverTapPushNotificationClicked, (event) => {
//           //   setNotificationData(event)
//           // });


//           getLivepriceFormSocket();
//           // checkCodePushAndSync();
//           checkForUpdates()
//         } else {
//           stopScoket();
//         }
//         appState.current = nextAppState;
//       },
//     );
//     return () => {
//       if (subscription != undefined) {
//         subscription = undefined;
//       }
//     };
//   }, []);

//   const checkPermission = async () => {
//     const enabled = await messaging().hasPermission();
//     const registerDevice = await messaging().registerDeviceForRemoteMessages();

//     console.log(enabled, 'registerDevice', registerDevice);
//     if (
//       enabled == messaging.AuthorizationStatus.AUTHORIZED ||
//       enabled == messaging.AuthorizationStatus.PROVISIONAL
//     ) {
//       getToken();
//     } else {
//       requestPermission();
//     }
//   };


//   // get Token for push notification
//   const getToken = async () => {
//     let fcmToken = await getStorageData('fcmToken');
//     fcmToken = await messaging().getToken();
//     if (fcmToken) {
//       console.log("djsdajksdgagsdak", fcmToken);
//       const CleverTap = require('clevertap-react-native');
//       CleverTap.setPushToken(fcmToken, CleverTap.FCM);
//       CleverTap.addListener(CleverTap.CleverTapPushNotificationClicked, (event: any) => {
//         // Handle the push notification click event here
//         console.log('Push notification clicked:', event);
//         ManageNavigation(event)
//       });

//       const handlePromiseRejections = () => {
//         // Set up a global error handler for unhandled promise rejections
//         // process.on('unhandledRejection', (reason, promise) => {
//         //   console.warn('Unhandled Promise Rejection:', reason);
//         // });
//       };
//       handlePromiseRejections();
//       await setStorageData('fcmToken', fcmToken);
//     }
//   };

//   // Request permission for push notification
//   const requestPermission = async () => {
//     try {
//       const deviceAPiLevel = Platform.Version;
//       console.log('deviceAPiLevel', deviceAPiLevel);
//       if (Platform.OS === 'android' && deviceAPiLevel >= 33) {
//         PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//         );
//       }
//       await messaging().requestPermission();

//       // User has authorised
//       getToken();
//     } catch (error) {
//       // User has rejected permissions
//     }
//   };
//   const ManageNavigation = async (data: any) => {
//     console.log(data, "ManageNavigationManageNavigation2", JSON.stringify(data));

//     let accountId = await getStorageData('AccountID');
//     if (data.screen_name == 'wallettransaction') {
//       navigate('YourWallate', { isFromNotification: true });
//     }
//     else if (data.screen_name == 'FriendProfile') {
//       navigate('FriendProfiles', { id: data.account_id });
//     } else if (data.screen_name == 'contact') {
//       if (data.subject) {
//         let details = {
//           id: data.comment_id,
//           subject: data.subject,
//         };
//         navigate('Contactus', { data: details });
//         return;
//       }
//       navigate('Contactus', {});
//     } else if (data.screen_name == 'postCreateScreen') {
//       navigate('CreatePosts', {});
//     } else if (data.screen_name == 'chat_user_notification') {
//       navigate("LiveFeeds", {})
//     }
//     else if (data.screen_name == 'MyProfile') {
//       navigate('MyTabs', { screen: 'Profiles' });
//     } else if (data.screen_name == 'PersonalChat') {
//       let dataa = {
//         full_name: data.full_name,
//         id: data.userid,
//         profile: data.profile,
//         userKey: data.userKey,
//         device_id: data.device_id,
//       };
//       navigate('PersonalChat', { item: dataa });
//     } else if (data && data.screen_name == 'GroupChatPage') {
//       let dataa = {
//         profilepic: data.profilepic,
//         type: data.type,
//         userKey: data.userKey,
//         user_fcm: data.user_fcm,
//         userid: data.userid,
//         username: data.username,
//         groupMembers: data.groupMembers,
//       };
//       navigate('GroupChatPage', { item: dataa });
//     } else if (
//       data.screen_name == 'Hompage' ||
//       data.screen_name == 'poll' ||
//       data.screen_name == 'post' ||
//       data.screen_name == 'card'
//     ) {
//       let detail: any;
//       if (data.screen_name == 'poll') {
//         detail = {
//           type: 'Poll',
//           data: `polling/polls/${data.poll_id ? data.poll_id : data.post_id}`,
//           commentId: data.comment_id,
//           setCommentCount: () => { },
//           parentId: data.parent_id,
//           showMenu: accountId == data.creator_id,
//         };
//       } else if (data.screen_name == 'qaboard') {
//       } else if (data.screen_name == 'post') {
//         detail = {
//           type: 'Post',
//           data: `posts/posts/${data.post_id}`,
//           commentId: data.comment_id,
//           setCommentCount: () => { },
//           parentId: data.parent_id,
//           showMenu: accountId == data.creator_id,
//         };
//       } else if (data.screen_name == 'card') {
//         detail = {
//           type: 'Card',
//           data: `bx_block_cards/cards/${data.post_id ? data.post_id : data.card_id
//             }`,
//           commentId: data.comment_id,
//           setCommentCount: () => { },
//           parentId: data.parent_id,
//           showMenu: accountId == data.creator_id,
//         };
//       } else {
//         detail = {
//           type: 'homePage',
//         };
//       }
//       navigate('NotificationPost', { item: data, details: detail });
//     } else if (data.screen_name === 'link') {
//       const { redirection_screen, redirection_url } = data;
//       if (redirection_screen && redirection_screen === 'link') {
//         if (redirection_url) {
//           let isCardTypeLink = redirection_url.includes(
//             'bx_block_share_card/card',
//           );
//           let isShareAccount = redirection_url.includes('share_account');
//           let isPollTypeLink = redirection_url.includes(
//             'bx_block_share_poll/poll',
//           );
//           let isInviteTypeLink = redirection_url.includes('invite');
//           console.log(
//             `isCardTypeLink :${isCardTypeLink}, isShareAccount:${isShareAccount}, isInviteTypeLink : ${isInviteTypeLink}`,
//           );
//           if (isShareAccount) {
//             let linkingDataArray = redirection_url.split('/');
//             const accountid = await getStorageData('AccountID');
//             const userId = linkingDataArray[linkingDataArray.length - 2];
//             if (accountid === userId) {
//               navigate('MyTabs', { screen: 'Profiles' });
//             } else {
//               navigate('FriendProfiles', { id: userId });
//             }
//           } else if (isCardTypeLink) {
//             let detail = {
//               type: 'Card',
//               data: `bx_block_cards/cards/${data.post_id ? data.post_id : data.card_id
//                 }`,
//               commentId: data.comment_id,
//               setCommentCount: () => { },
//               parentId: data.parent_id,
//               showMenu: accountId == data.creator_id,
//             };
//             navigate('NotificationPost', { item: data, details: detail });
//           } else if (isPollTypeLink) {
//             let detail = {
//               type: 'Poll',
//               data: `polling/polls/${data.poll_id ? data.poll_id : data.post_id
//                 }`,
//               commentId: data.comment_id,
//               setCommentCount: () => { },
//               parentId: data.parent_id,
//               showMenu: accountId == data.creator_id,
//             };
//             navigate('NotificationPost', { item: data, details: detail });
//           } else if (isInviteTypeLink) {
//             if (Platform.OS === 'ios') {
//               Linking.openURL(redirection_url);
//             } else {
//               Linking.openURL(redirection_url);
//             }
//           } else {
//             if (Platform.OS === 'ios') {
//               Linking.openURL(redirection_url);
//             } else {
//               Linking.openURL(redirection_url);
//             }
//           }
//         }
//       }
//     }
//   };

//   const messageListener = async () => {
//     console.log("messageListenermessageListener");

//     messaging().onNotificationOpenedApp(message => {
//       console.log('onNotificationOpenedApp message0', message);
//       ManageNavigation(message.data);
//     });

//     // messaging().setBackgroundMessageHandler(async remoteMessage => {
//     //   console.log('Message handled in the background!', JSON.stringify(remoteMessage, null, 2));
//     // })

//     messaging().onMessage(message => {
//       console.log('Notification Data:', message);
//       if (message.data.screen_name != undefined) {
//         if (
//           message.data.screen_name.toString() != '{}' &&
//           message.data.screen_name.toString() !== 'PersonalChat' &&
//           message.data.screen_name.toString() !== 'GroupChatPage'
//         ) {
//           Toast.show({
//             type: 'success',
//             text1: message.notification.title
//               ? message.notification.title
//               : message.notification.body,
//             onPress: () => {
//               ManageNavigation(message.data), Toast.hide();
//             },
//             autoHide: true,
//           });
//         }
//       }
//     });
//     // use when notification open
//     let notificationOpen = await messaging().getInitialNotification();
//     if (notificationOpen == null) {
//       console.log("notificationOpen", notificationOpen);
//       setTimeout(() => {
//         notificationOpen = notificationData;
//         if (notificationOpen) {
//           if (notificationOpen.screen_name) {
//             setScrenName(notificationOpen)
//           } else {
//             setScrenName(notificationOpen.data);
//           }
//         }
//       }, 500);

//       return;
//     }
//     console.log("notificationOpen", notificationOpen);
//     if (notificationOpen) {
//       if (notificationOpen.screen_name) {
//         setScrenName(notificationOpen)
//       } else {
//         setScrenName(notificationOpen.data);
//       }
//     }
//   };

//   Text.defaultProps = Text.defaultProps || {};
//   Text.defaultProps.allowFontScaling = false;
//   if (loginState.isLoading) {
//     return <Splashscreen />;
//   }

//   return (
//     <>
//       <Provider store={store}>
//         <StatusBar barStyle={"dark-content"} backgroundColor={colors.bgColor} />
//         <AuthContext.Provider value={{ loginState, dispatch, authContext }}>
//           {
//             progress ? (
//               <Modal
//                 visible={true} transparent>
//                 <View style={{
//                   flex: 1,
//                   justifyContent: 'center',
//                   alignItems: 'center'
//                 }}>
//                   <TouchableWithoutFeedback onPress={() => {
//                   }}>
//                     <View style={styles.background} />
//                   </TouchableWithoutFeedback>
//                   <View style={styles.contentContainer}>
//                     <Text style={[{ textAlign: 'center', marginBottom: scaledSize(20), fontFamily: Fonts.REGULAR, fontSize: scaledSize(13) }]}>
//                       A new version of the app is available. Do you want to update now?
//                     </Text>
//                     <View style={{ flexDirection: 'row' }}>
//                       <TouchableOpacity
//                         disabled={loader}
//                         onPress={() => {
//                           if (isDownloaded) {
//                             setProgress(false);
//                             codePush.restartApp();
//                             return;
//                           }
//                           setLoader(true)
//                           downloadCodepushBundle();

//                         }}
//                         style={[{
//                           backgroundColor: colors.blue, width: "48%",
//                           height: scaledSize(35),
//                           borderRadius: scaledSize(10),
//                           // borderWidth: 1,
//                           // borderColor: colors.blue,
//                           justifyContent: 'center',
//                           alignItems: 'center'
//                         }]}>
//                         {
//                           loader ? <ActivityIndicator size={'small'}
//                             style={{ marginVertical: 8, position: "absolute" }}
//                             color={colors.white} />
//                             :
//                             <Text style={[{ color: colors.white, fontSize: scaledSize(13) }]}>{isDownloaded ? "Restart Now" : "Update Now"}</Text>
//                         }
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </View>
//               </Modal>
//             ) : null
//           }

//           {showTutorial ? (
//             <Tutorial
//               onSkip={() => {
//                 setShowTutorial(false);
//                 setStorageData('fristTime', 'false');
//               }}
//               onDone={() => {
//                 setEvent("tutorial finished", null)
//                 setShowTutorial(false);
//                 setStorageData('fristTime', 'false');
//               }}
//             />
//           ) : loginState.userToken !== null && loginState.isCompletedProcess ? (
//             <MyDrawer
//               screenName={screnName}
//               resetScreenName={() => {
//                 setScrenName(null);
//               }}
//             />
//           ) : (
//             <AuthStack />
//           )}

//         </AuthContext.Provider>
//       </Provider >
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   contentContainer: {
//     backgroundColor: colors.white,
//     width: deviceWidth - scaledSize(40),
//     borderRadius: scaledSize(10),
//     // justifyContent:'center',
//     paddingHorizontal: scaledSize(20),
//     paddingVertical: scaledSize(20),
//     alignItems: 'center'
//   },
//   background: {
//     backgroundColor: colors.black,
//     position: 'absolute',
//     height: "100%",
//     width: deviceWidth,
//     opacity: 0.5
//   },
//   container: {
//     backgroundColor: colors.white,
//     height: scaledSize(65),
//     borderRadius: scaledSize(8),
//     marginHorizontal: scaledSize(40),
//     paddingHorizontal: scaledSize(20),
//     paddingVertical: scaledSize(5),
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderLeftColor: colors.blue,
//     borderLeftWidth: scaledSize(5),
//     width: deviceWidth - scaledSize(38),
//   },
//   message: {
//     color: colors.black,
//     fontSize: scaledSize(14),
//     fontFamily: Fonts.LIGHT_BOLD,
//   },
// });


// export default codePush({
//   checkFrequency: codePush.CheckFrequency.MANUAL,
//   // installMode: codePush.InstallMode.IMMEDIATE,
// })(App)


// // comment code
// // const screen_name = notificationOpen.data;
// // let data = {
// //   full_name: screen_name.full_name,
// //   id: screen_name.userid,
// //   profile: screen_name.profile,
// //   userKey: screen_name.userKey,
// //   device_id: screen_name.device_id,
// // };

// // const initCometChat = () => {
// //   let appSetting = new CometChat.AppSettingsBuilder()
// //     .subscribePresenceForAllUsers()
// //     .setRegion(cometChatRegion)
// //     .autoEstablishSocketConnection(true)
// //     .build();
// //   CometChat.init(cometChatAppID, appSetting).then(
// //     () => {
// //       console.log('Initialization completed successfully');
// //     },
// //     error => {
// //       console.log('Initialization failed with error:', error);
// //     },
// //   );
// // };

// // const [isCompletedProcess, setIsCompletedProcess] = useState(false)
// // const toastConfig = {
// //   success: ({ text1, props }) => (
// //     <View style={[styles.container]}>
// //       <Text numberOfLines={1} style={[styles.message]}>
// //         {text1}
// //       </Text>
// //     </View>
// //   ),
// //   RedirectionSuccess: ({ text1, props }) => (
// //     <TouchableOpacity
// //       onPress={() => { }}
// //       style={[styles.container, { zIndex: 100 }]}>
// //       <Text style={[styles.message]}>{text1}</Text>
// //     </TouchableOpacity>
// //   ),
// // };

// // import React, { Component } from 'react'
// // import { Text, View } from 'react-native'
// // import { WebView } from 'react-native-webview';

// // export class App extends Component {
// //   render() {
// //     return (
// //       <WebView
// //         style={{ flex: 1 }}
// //         useWebKit={false}
// //         hideKeyboardAccessoryView={true}
// //         originWhitelist={['*']}
// //         source={{ uri: "https://merchant-simulator.phonepe.com/bank/loginPage?transactToken=4tCFFvklkeAlBEK7BurVH3&amount=1.00" }}
// //         javaScriptEnabled={true}
// //         domStorageEnabled={true}
// //         startInLoadingState={true}
// //         scalesPageToFit={true}
// //       />
// //     )
// //   }
// // }

// // export default App



// Customizable Area Start
import React, { useState, useEffect, useRef } from 'react';
import {
  deviceWidth,
  getStorageData,
  removeStorageData,
  scaledSize,
  setStorageData,
} from '../framework/src/Utilities';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AppState,
  Linking,
  StatusBar,
  Platform,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import MyDrawer from './Navigation/drawer';
import AuthStack from './Navigation/authStack';
import { AuthContext } from './Navigation/context';
import Splashscreen from '../blocks/splashscreen/src/Splashscreen';
import Tutorial from './Navigation/Tutorial';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import colors from '../blocks/FriendList/src/colors';
import { navigate, goBack } from './Navigation/RootNavigation';
import { Fonts } from '../components/src/Utils/Fonts';
import {
  getLivepriceFormSocket,
  setEvent,
  stopScoket,
} from '../components/src/Utils/service';
import { Provider } from 'react-redux';
import configureStore from './Navigation/store';
import * as Sentry from '@sentry/react-native';
import codePush, { CodePushOptions, DownloadProgress } from 'react-native-code-push';
import { PermissionsAndroid } from 'react-native';
import { notificationData, setNotificationData } from '.';
import { removeAllListeners } from 'process';
import CodePush from 'react-native-code-push';
import Branch from 'react-native-branch';
// Customizable Area End

Sentry.init({
  dsn:
    'https://eb097bf1da4c426f99f17233d75163cd@o421213.ingest.sentry.io/4504547713024000',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  environment: 'production',
  release: '3145778(1.1.0)',
  attachStacktrace: true,
});
let firstTime;
const store = configureStore();

const App = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [screnName, setScrenName] = useState(null);
  const [isDownloaded, setDwonloaded] = useState(false);
  const appState = useRef(AppState.currentState);
  const [progress, setProgress] = useState(false)
  const [loader, setLoader] = useState(false)
  const [restart, setRestart] = useState(false)

  const downloadCodepushBundle = async () => {
    try {
      // const update = await CodePush.checkForUpdate();
      // console.log("updateupdateupdateupdate", update);

      // if (update != null) {
      // setProgress(true);
      // console.log("progressprogress1", progress);
      CodePush.sync(
        {
          installMode: CodePush.InstallMode.ON_NEXT_RESTART,
          mandatoryInstallMode: CodePush.InstallMode.ON_NEXT_RESTART,
        },
        syncStatus => {
          switch (syncStatus) {

            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
              console.log("CHECKING_FOR_UPDATE1");

              break;
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
              console.log("DOWNLOADING_PACKAGE");

              break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
              console.log("INSTALLING_UPDATE");


              break;
            case CodePush.SyncStatus.UPDATE_INSTALLED:

              console.log("UPDATE_INSTALLED");
              setRestart(true)
              break;
          }
        },
        (progress) => {


          setProgress(true);
          console.log("progressprogress", progress);


        },
      );
      // }

    } catch (error) {
      console.log("downloadCodepushBundle error", error);

    }
  }

  const checkForUpdates = async () => {
    console.log("progressprogress", progress);


    // try {
    // const updateCheckResult = await CodePush.checkForUpdate();


    try {
      const update = await CodePush.checkForUpdate();
      console.log("updateupdateupdateupdate", update);

      if (update != null) {
        setProgress(true);
        console.log("progressprogress1", progress);
      }

    } catch (error) {
      console.log('CodePush update error:', error);

    } finally {
      console.log("progressprogress2", progress);
    }
  };



  const initialLoginState = {
    // Customizable Area Start
    isLoading: true,
    userName: null,
    userToken: null,
    commentCount: 0,
    tabsPress: {
      home: 1,
      explore: 0,
      track: 0,
      profile: 0,
    },
    isSocialtrackChange: false,
    isPolltrackChange: false,
    isCardtrackChange: false,
    isShowDot: false,
    notificationCount: 0,
    livePrices: {},
    socialTrackCount: [],
    cardTrackCount: [],
    pollTrackCount: [],
    userDetail: {},
    userDetails: {},
    isSignOut: false,
    isCompletedProcess: false,
    showTabBar: true,
    isPollRefreshed: false,
    opigoScores: [],
    likeDislikeCount: [],
    likeDislikeCountPost: [],
    invite_code: undefined,
    screen_name_navigation: '',
    // Customizable Area End
  };

  const loginReducer = (prevState: any, action: any) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userToken: null,
          isLoading: false,
          isSignOut: true,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'COMMENT': {
        return {
          ...prevState,
          commentCount: action.commentCount,
        };
      }
      case 'TABPRESS': {
        return {
          ...prevState,
          tabsPress: action.tabsPress,
        };
      }
      case 'ISSHOWDOT': {
        return {
          ...prevState,
          isShowDot: action.isShowDot,
        };
      }
      case 'ISSOCIAL': {
        return {
          ...prevState,
          isSocialtrackChange: action.data,
        };
      }
      case 'ISCARD': {
        return {
          ...prevState,
          isCardtrackChange: action.data,
        };
      }
      case 'ISPOLL': {
        return {
          ...prevState,
          isPolltrackChange: action.data,
        };
      }
      case 'NOTIFICATION': {
        return {
          ...prevState,
          notificationCount: action.data,
        };
      }
      case 'LIVEPRICES': {
        return {
          ...prevState,
          livePrices: action.data,
        };
      }
      case 'UPDATECARD': {
        return {
          ...prevState,
          cardTrackCount: action.data,
        };
      }
      case 'UPDATESOCIAL': {
        return {
          ...prevState,
          socialTrackCount: action.data,
        };
      }
      case 'UPDATEPOLL': {
        return {
          ...prevState,
          pollTrackCount: action.data,
        };
      }
      case 'UPDATEUSER': {
        return {
          ...prevState,
          userDetail: action.data,
        };
      }
      case 'UPDATEUSERS': {
        return {
          ...prevState,
          userDetails: action.data,
        };
      }
      case 'PROCESSCOMPLETED': {
        return {
          ...prevState,
          isCompletedProcess: action.data,
        };
      }
      case 'SHOWTABBAR': {
        return {
          ...prevState,
          showTabBar: action.data,
        };
      }
      case 'POLLREFRESH': {
        return {
          ...prevState,
          isPollRefreshed: action.data,
        };
      }
      case 'OPIGOSCORE': {
        return {
          ...prevState,
          opigoScores: action.data,
        };
      }
      case 'UPDATELIKE': {
        return {
          ...prevState,
          likeDislikeCount: action.data,
        };
      }
      case 'UPDATELIKEPOST': {
        return {
          ...prevState,
          likeDislikeCountPost: action.data,
        };
      }
      case 'INVITE_CODE': {
        return {
          ...prevState,
          invite_code: action.data,
        };
      }
      case 'SCREEN_NAME': {
        return {
          ...prevState,
          screen_name_navigation: action.data,
        };
      }
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState,
  );





  const authContext = React.useMemo(
    () => ({
      signIn: async (foundUser: any, from: string) => {
        const userToken = foundUser.token;
        try {
          await setStorageData('Token', userToken);
          await setStorageData('isCompletedProcess', 'true');
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: 'LOGIN', token: userToken });
        dispatch({ type: 'PROCESSCOMPLETED', data: true });
      },
      signOut: async () => {
        try {
          removeStorageData('Token');
          removeStorageData('firstTime');
          removeStorageData('AccountID');
          removeStorageData('fcmToken');
          removeStorageData('ProfileToken');
          removeStorageData('isCompletedProcess');
          removeStorageData('AccountName');
          removeStorageData('AccountProfilePic');
          dispatch({ type: 'NOTIFICATION', data: 0 });
          dispatch({ type: 'UPDATEUSER', data: {} });
          dispatch({ type: 'UPDATEUSERS', data: {} });
          dispatch({ type: 'UPDATECARD', data: [] });
          dispatch({ type: 'UPDATESOCIAL', data: [] });
          dispatch({ type: 'UPDATEPOLL', data: [] });
          dispatch({ type: 'UPDATELIKE', data: [] });
          dispatch({ type: 'UPDATELIKEPOST', data: [] });
          dispatch({ type: 'PROCESSCOMPLETED', data: false });
          dispatch({ type: 'INVITE_CODE', data: undefined });
          dispatch({ type: 'SCREEN_NAME', data: "" });
          messaging().deleteToken();
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: 'LOGOUT' });
      },
      setComment: (count: any) => {
        dispatch({ type: 'COMMENT', commentCount: count });
      },
      onTabPress: (data: any) => {
        dispatch({ type: 'TABPRESS', tabsPress: data });
      },
      setShowDot: (data: any) => {
        dispatch({ type: 'ISSHOWDOT', isShowDot: data });
      },
      setCard: (data: any) => {
        dispatch({ type: 'ISCARD', data: data });
      },
      setPoll: (data: any) => {
        dispatch({ type: 'ISPOLL', data: data });
      },
      setSocial: (data: any) => {
        dispatch({ type: 'ISSOCIAL', data: data });
      },
      setNotificationCount: (data: any) => {
        dispatch({ type: 'NOTIFICATION', data: data });
      },
      setLivePrices: (data: any) => {
        dispatch({ type: 'LIVEPRICES', data: data });
      },
      setTrackCard: (data: any) => {
        dispatch({ type: 'UPDATECARD', data: data });
      },
      setTrackPoll: (data: any) => {
        dispatch({ type: 'UPDATEPOLL', data: data });
      },
      setTrackSocial: (data: any) => {
        dispatch({ type: 'UPDATESOCIAL', data: data });
      },
      setUser: (data: any) => {
        dispatch({ type: 'UPDATEUSER', data: data });
      },
      setUsers: (data: any) => {
        dispatch({ type: 'UPDATEUSERS', data: data });
      },
      setTabBar: (data: any) => {
        dispatch({ type: 'SHOWTABBAR', data: data });
      },
      setPollRefreshed: (data: any) => {
        dispatch({ type: 'POLLREFRESH', data: data });
      },
      setOpiGoScores: (data: any) => {
        dispatch({ type: 'OPIGOSCORE', data: data });
      },
      setLikeDislikeBtnCard: (data: any) => {
        dispatch({ type: 'UPDATELIKE', data: data });
      },
      setLikeDislikeBtnPost: (data: any) => {
        dispatch({ type: 'UPDATELIKEPOST', data: data });
      },
      setInviteCode: (data: any) => {
        dispatch({ type: 'INVITE_CODE', data: data });
      },
      setScreenNameNavigation: (data: any) => {
        console.log('data', data)
        dispatch({ type: 'SCREEN_NAME', data: data });
      },
    }),
    [],
  );

  useEffect(() => {
    const initialCall = async () => {
      let userToken;
      userToken = null;
      let isCompletedProcess;
      try {
        userToken = await getStorageData('Token');
        firstTime = await getStorageData('fristTime');
        isCompletedProcess = await getStorageData('isCompletedProcess');
        if (firstTime == null) {
          await setStorageData('fristTime', 'true');
          setShowTutorial(true);
          await setStorageData("showBannerModal", "true");
          console.log("fristTimefristTimefristTime");
          setEvent("app first open", null)
        } else {
          setShowTutorial(false);
        }
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
      dispatch({ type: 'PROCESSCOMPLETED', data: isCompletedProcess });
    };
    initialCall();
    checkPermission();
    messageListener();
  }, []);

  useEffect(() => {
    // checkForUpdates()
    downloadCodepushBundle()
    // const CleverTap = require('clevertap-react-native');
    // branch.setRequestMetadata("$clevertap_attribution_id", CleverTap.getCleverTapAttributionIdentifier());


  }, [])

  const _handleOpenURL = (event: any) => {
    let eventData = event.url
    console.log(event, "_handleOpenURL_handleOpenURL_handleOpenURL", eventData);

    if (eventData && typeof eventData === 'string') {
      let isCardTypeLink = eventData.includes('bx_block_share_card/card');
      let isPostTypeLink = eventData.includes("bx_block_posts/post_detail");
      let isShareAccount = eventData.includes('share_account');
      let isPollTypeLink = eventData.includes("bx_block_share_poll/poll");
      if (isCardTypeLink) {
        let data = {
          card_id: eventData.substring(eventData.lastIndexOf('/') + 1),
          screen_name: 'card',
        };
        // goBack();
        ManageNavigation(data);
      } else if (isPostTypeLink) {
        console.log("postdfngdfkgndfkngklndfkgdfl");

        let data = {
          post_id: eventData.substring(eventData.lastIndexOf('/') + 1),
          screen_name: 'post',
        };
        // goBack();
        ManageNavigation(data);
      }
      else if (isPollTypeLink) {
        console.log("postdfngdfkgndfkngklndfkgdfl");

        let data = {
          poll_id: eventData.substring(eventData.lastIndexOf('/') + 1),
          screen_name: 'poll',
        };
        // goBack();
        ManageNavigation(data);
      }

      else if (isShareAccount) {
        let data = {
          account_id: eventData.substring(eventData.lastIndexOf('/') + 1),
          screen_name: 'FriendProfile',
        };
        ManageNavigation(data);
      }
    }
  }
  useEffect(() => {

    Linking.addEventListener('url', _handleOpenURL);

    Linking.getInitialURL().then(value => {
      console.log('getInitialURL value', value);
      if (value && typeof value === 'string') {
        let isCardTypeLink = value.includes('bx_block_share_card/card');
        let isPostTypeLink = value.includes("bx_block_posts/post_detail");
        let isPollTypeLink = value.includes("bx_block_share_poll/poll");
        let isShareAccount = value.includes('share_account');

        if (isCardTypeLink) {
          let data = {
            card_id: value.substring(value.lastIndexOf('/') + 1),
            screen_name: 'card',
          };
          ManageNavigation(data);
        } else if (isPostTypeLink) {
          console.log("postdfngdfkgndfkngklndfkgdfl");

          let data = {
            post_id: value.substring(value.lastIndexOf('/') + 1),
            screen_name: 'post',
          };
          // goBack();
          ManageNavigation(data);
        }
        else if (isPollTypeLink) {
          console.log("postdfngdfkgndfkngklndfkgdfl");

          let data = {
            poll_id: value.substring(value.lastIndexOf('/') + 1),
            screen_name: 'poll',
          };
          // goBack();
          ManageNavigation(data);
        }

        else if (isShareAccount) {
          let data = {
            account_id: value.substring(value.lastIndexOf('/') + 1),
            screen_name: 'FriendProfile',
          };
          ManageNavigation(data);
        }
      }
    });
    let subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          getLivepriceFormSocket();
          // checkForUpdates()
          downloadCodepushBundle()
        } else {
          stopScoket();
        }
        appState.current = nextAppState;
      },
    );
    return () => {
      if (subscription != undefined) {
        subscription = undefined;
      }
    };
  }, []);


  useEffect(() => {
    // Subscribe to AppState change events
    const handleAppStateChange = (nextAppState) => {
      console.log("nextAppStatenextAppState", nextAppState);

      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      } else {
        console.log('App state', nextAppState);
      }
    };

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // Unsubscribe from AppState change events
      console.log("App Shut Down");
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);




  const checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    const registerDevice = await messaging().registerDeviceForRemoteMessages();

    console.log(enabled, 'registerDevice', registerDevice);
    if (
      enabled == messaging.AuthorizationStatus.AUTHORIZED ||
      enabled == messaging.AuthorizationStatus.PROVISIONAL
    ) {
      getToken();
    } else {
      requestPermission();
    }
  };

  const create_NotificationChannel = () => {

    //Creating Notification Channel
    const CleverTap = require('clevertap-react-native');
    // CleverTap.createNotificationChannel(
    //   'CtRNS',
    //   'Clever Tap React Native Testing',
    //   'CT React Native Testing',
    //   1,
    //   true,
    // );
    CleverTap.createNotificationChannelGroup("opiGoChannel", "opiGoGroup");

  }
  // useEffect(() => {
  //   console.log('Initializing CleverTap...');
  //   create_NotificationChannel()

  // }, [])

  // get Token for push notification
  const getToken = async () => {
    let fcmToken = await getStorageData('fcmToken');
    fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log("fcmtoken", fcmToken);
      const CleverTap = require('clevertap-react-native');
      CleverTap.setDebugLevel(3);
      CleverTap.registerForPush();


      // CleverTap.setPushToken(fcmToken, CleverTap.FCM);
      // CleverTap.createNotificationChannelGroup("a", 'heloo')
      //   .then(() => {
      //     console.log('Notification channel group created successfully!');
      //     // You can perform additional actions here if needed
      //   })
      //   .catch(error => {
      //     console.log('Error creating notification channel group:', error);
      //     // Handle the error accordingly
      //   });

      CleverTap.addListener(CleverTap.CleverTapPushNotificationClicked, (event: any) => {
        // Handle the push notification click event here
        console.log('Push notification clicked:', event);
        ManageNavigation(event)

      });

      create_NotificationChannel()



      const handlePromiseRejections = () => {
        // Set up a global error handler for unhandled promise rejections
        // process.on('unhandledRejection', (reason, promise) => {
        //   console.warn('Unhandled Promise Rejection:', reason);
        // });
      };
      handlePromiseRejections();
      await setStorageData('fcmToken', fcmToken);
    }
  };

  // Request permission for push notification
  const requestPermission = async () => {
    try {
      const deviceAPiLevel = Platform.Version;
      console.log('deviceAPiLevel', deviceAPiLevel);
      if (Platform.OS === 'android' && deviceAPiLevel >= 33) {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      }
      await messaging().requestPermission();

      // User has authorised
      getToken();
    } catch (error) {
      // User has rejected permissions
    }
  };
  const ManageNavigation = async (data: any) => {
    console.log(data, "ManageNavigationManageNavigation2", JSON.stringify(data));

    let accountId = await getStorageData('AccountID');
    if (data.screen_name == 'wallettransaction') {
      navigate('YourWallate', { isFromNotification: true });
    }
    else if (data.screen_name == 'FriendProfile') {
      navigate('FriendProfiles', { id: data.account_id });
    } else if (data.screen_name == 'contact') {
      if (data.subject) {
        let details = {
          id: data.comment_id,
          subject: data.subject,
        };
        navigate('Contactus', { data: details });
        return;
      }
      navigate('Contactus', {});
    } else if (data.screen_name == 'postCreateScreen') {
      navigate('CreatePosts', {});
    } else if (data.screen_name == 'chat_user_notification') {
      navigate("LiveFeeds", {})
    }
    else if (data.screen_name == 'MyProfile') {
      navigate('MyTabs', { screen: 'Profiles' });
    } else if (data.screen_name == 'PersonalChat') {
      let dataa = {
        full_name: data.full_name,
        id: data.userid,
        profile: data.profile,
        userKey: data.userKey,
        device_id: data.device_id,
      };
      navigate('PersonalChat', { item: dataa });
    } else if (data && data.screen_name == 'GroupChatPage') {
      let dataa = {
        profilepic: data.profilepic,
        type: data.type,
        userKey: data.userKey,
        user_fcm: data.user_fcm,
        userid: data.userid,
        username: data.username,
        groupMembers: data.groupMembers,
      };
      navigate('GroupChatPage', { item: dataa });
    } else if (
      data.screen_name == 'Hompage' ||
      data.screen_name == 'poll' ||
      data.screen_name == 'post' ||
      data.screen_name == 'card'
    ) {
      let detail: any;
      if (data.screen_name == 'poll') {
        detail = {
          type: 'Poll',
          data: `polling/polls/${data.poll_id ? data.poll_id : data.poll}`,
          commentId: data.comment_id,
          setCommentCount: () => { },
          parentId: data.parent_id,
          showMenu: accountId == data.creator_id,
        };
      } else if (data.screen_name == 'qaboard') {
      } else if (data.screen_name == 'post') {
        detail = {
          type: 'Post',
          data: `posts/posts/${data.post_id ? data.post_id : data.post}`,
          commentId: data.comment_id,
          setCommentCount: () => { },
          parentId: data.parent_id,
          showMenu: accountId == data.creator_id,
        };
      } else if (data.screen_name == 'card') {
        detail = {
          type: 'Card',
          data: `bx_block_cards/cards/${data.card_id ? data.card_id : data.card}`,
          commentId: data.comment_id,
          setCommentCount: () => { },
          parentId: data.parent_id,
          showMenu: accountId == data.creator_id,
        };
      } else {
        detail = {
          type: 'homePage',
        };
      }
      console.log("dsfjkdsbfsdbjfsdjfhelllooooooo");

      navigate('NotificationPost', { item: data, details: detail });
    } else if (data.screen_name === 'link') {
      const { redirection_screen, redirection_url } = data;
      if (redirection_screen && redirection_screen === 'link') {
        if (redirection_url) {
          console.log("bbdsjfbdjskbfkdsfbdkskbfkredirection_urlredirection_url");

          let isCardTypeLink = redirection_url.includes(
            'bx_block_share_card/card',
          );
          let isPostTypeLink = redirection_url.includes("bx_block_posts/post_detail");
          let isShareAccount = redirection_url.includes('share_account');
          let isPollTypeLink = redirection_url.includes(
            'bx_block_share_poll/poll',
          );
          let isInviteTypeLink = redirection_url.includes('invite');
          console.log(
            `isCardTypeLink :${isCardTypeLink}, isShareAccount:${isShareAccount}, isInviteTypeLink : ${isInviteTypeLink}`,
          );
          if (isShareAccount) {
            let linkingDataArray = redirection_url.split('/');
            const accountid = await getStorageData('AccountID');
            const userId = linkingDataArray[linkingDataArray.length - 2];
            if (accountid === userId) {
              navigate('MyTabs', { screen: 'Profiles' });
            } else {
              navigate('FriendProfiles', { id: userId });
            }
          } else if (isCardTypeLink) {
            let detail = {
              type: 'Card',
              data: `bx_block_cards/cards/${data.post_id ? data.post_id : data.card_id
                }`,
              commentId: data.comment_id,
              setCommentCount: () => { },
              parentId: data.parent_id,
              showMenu: accountId == data.creator_id,
            };
            navigate('NotificationPost', { item: data, details: detail });
          } else if (isPostTypeLink) {
            let detail = {
              type: 'Post',
              data: `posts/posts/${data.post_id}`,
              commentId: data.comment_id,
              setCommentCount: () => { },
              parentId: data.parent_id,
              showMenu: accountId == data.creator_id,
            };
            navigate('NotificationPost', { item: data, details: detail });
          }

          else if (isPollTypeLink) {
            let detail = {
              type: 'Poll',
              data: `polling/polls/${data.poll_id ? data.poll_id : data.post_id
                }`,
              commentId: data.comment_id,
              setCommentCount: () => { },
              parentId: data.parent_id,
              showMenu: accountId == data.creator_id,
            };
            navigate('NotificationPost', { item: data, details: detail });
          } else if (isInviteTypeLink) {
            if (Platform.OS === 'ios') {
              Linking.openURL(redirection_url);
            } else {
              Linking.openURL(redirection_url);
            }
          } else {
            if (Platform.OS === 'ios') {
              Linking.openURL(redirection_url);
            } else {
              Linking.openURL(redirection_url);
            }
          }
        }
      }
    }
  };

  const messageListener = async () => {
    console.log("messageListenermessageListener");

    messaging().onNotificationOpenedApp(message => {
      console.log('onNotificationOpenedApp message0', message);
      ManageNavigation(message.data);
    });

    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //   console.log('Message handled in the background!', JSON.stringify(remoteMessage, null, 2));
    // })

    messaging().onMessage(message => {
      console.log('Notification Data:', message);
      if (message.data.screen_name != undefined) {
        if (
          message.data.screen_name.toString() != '{}' &&
          message.data.screen_name.toString() !== 'PersonalChat' &&
          message.data.screen_name.toString() !== 'GroupChatPage'
        ) {
          Toast.show({
            type: 'success',
            text1: message.notification.title
              ? message.notification.title
              : message.notification.body,
            onPress: () => {
              ManageNavigation(message.data), Toast.hide();
            },
            autoHide: true,
          });
        }
      }
    });
    // use when notification open
    let notificationOpen = await messaging().getInitialNotification();
    if (notificationOpen == null) {
      console.log("notificationOpen", notificationOpen);
      setTimeout(() => {
        notificationOpen = notificationData;
        if (notificationOpen) {
          if (notificationOpen.screen_name) {
            setScrenName(notificationOpen)
          } else {
            setScrenName(notificationOpen.data);
          }
        }
      }, 500);

      return;
    }
    console.log("notificationOpen", notificationOpen);
    if (notificationOpen) {
      if (notificationOpen.screen_name) {
        setScrenName(notificationOpen)
      } else {
        setScrenName(notificationOpen.data);
      }
    }
  };

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;
  if (loginState.isLoading) {
    return <Splashscreen />;
  }

  return (
    <>
      <Provider store={store}>
        <StatusBar barStyle={"dark-content"} backgroundColor={colors.bgColor} />
        <AuthContext.Provider value={{ loginState, dispatch, authContext }}>
          {/* {
            progress ? (
              <Modal
                visible={true} transparent>
                <View style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <TouchableWithoutFeedback onPress={() => {
                  }}>
                    <View style={styles.background} />
                  </TouchableWithoutFeedback>
                  <View style={styles.contentContainer}>
                    <Text style={[{ textAlign: 'center', marginBottom: scaledSize(20), fontFamily: Fonts.REGULAR, fontSize: scaledSize(13) }]}>
                      A new version of the app is available. Do you want to update now?
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity
                        disabled={loader}
                        onPress={() => {
                          if (isDownloaded) {
                            setProgress(false);
                            codePush.restartApp();
                            return;
                          }
                          setLoader(true)
                          downloadCodepushBundle();

                        }}
                        style={[{
                          backgroundColor: colors.blue, width: "48%",
                          height: scaledSize(35),
                          borderRadius: scaledSize(10),
                          // borderWidth: 1,
                          // borderColor: colors.blue,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }]}>
                        {
                          loader ? <ActivityIndicator size={'small'}
                            style={{ marginVertical: 8, position: "absolute" }}
                            color={colors.white} />
                            :
                            <Text style={[{ color: colors.white, fontSize: scaledSize(13) }]}>{isDownloaded ? "Restart Now" : "Update Now"}</Text>
                        }
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            ) : null
          } */}
          {
            restart ? (
              <Modal
                visible={true} transparent>
                <View style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <TouchableWithoutFeedback onPress={() => {
                  }}>
                    <View style={styles.background} />
                  </TouchableWithoutFeedback>
                  <View style={styles.contentContainer}>
                    <Text style={[{ textAlign: 'center', marginBottom: scaledSize(20), fontFamily: Fonts.REGULAR, fontSize: scaledSize(13) }]}>
                      {/* A new version of the app is available. Do you want to update now? */}
                      New update downloaded!
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity
                        disabled={loader}
                        onPress={() => {
                          if (restart) {

                            codePush.restartApp();
                            setRestart(false);
                            return;
                          }
                          downloadCodepushBundle();
                          // if (isDownloaded) {
                          //   setRestart(false);
                          //   codePush.restartApp();
                          //   return;
                          // }
                          // setLoader(true)
                          // downloadCodepushBundle();

                        }}
                        style={[{
                          backgroundColor: colors.blue, width: "48%",
                          height: scaledSize(35),
                          borderRadius: scaledSize(10),
                          // borderWidth: 1,
                          // borderColor: colors.blue,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }]}>
                        <Text style={[{ color: colors.white, fontSize: scaledSize(13) }]}>Restart now!</Text>
                        {/* {
                          loader ? <ActivityIndicator size={'small'}
                            style={{ marginVertical: 8, position: "absolute" }}
                            color={colors.white} />
                            :
                            <Text style={[{ color: colors.white, fontSize: scaledSize(13) }]}>{isDownloaded ? "Restart Now" : "Update Now"}</Text>
                        } */}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            ) : null
          }

          {showTutorial ? (
            <Tutorial
              onSkip={() => {
                setShowTutorial(false);
                setStorageData('fristTime', 'false');
              }}
              onDone={() => {
                setEvent("tutorial finished", null)
                setShowTutorial(false);
                setStorageData('fristTime', 'false');
              }}
            />
          ) : loginState.userToken !== null && loginState.isCompletedProcess ? (
            <MyDrawer
              screenName={screnName}
              resetScreenName={() => {
                setScrenName(null);
              }}
            />
          ) : (
            <AuthStack />
          )}

        </AuthContext.Provider>
      </Provider >
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: colors.white,
    width: deviceWidth - scaledSize(40),
    borderRadius: scaledSize(10),
    // justifyContent:'center',
    paddingHorizontal: scaledSize(20),
    paddingVertical: scaledSize(20),
    alignItems: 'center'
  },
  background: {
    backgroundColor: colors.black,
    position: 'absolute',
    height: "100%",
    width: deviceWidth,
    opacity: 0.5
  },
  container: {
    backgroundColor: colors.white,
    height: scaledSize(65),
    borderRadius: scaledSize(8),
    marginHorizontal: scaledSize(40),
    paddingHorizontal: scaledSize(20),
    paddingVertical: scaledSize(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftColor: colors.blue,
    borderLeftWidth: scaledSize(5),
    width: deviceWidth - scaledSize(38),
  },
  message: {
    color: colors.black,
    fontSize: scaledSize(14),
    fontFamily: Fonts.LIGHT_BOLD,
  },
});


export default codePush({
  checkFrequency: codePush.CheckFrequency.MANUAL,
  // installMode: codePush.InstallMode.IMMEDIATE,
})(App)


// comment code
// const screen_name = notificationOpen.data;
// let data = {
//   full_name: screen_name.full_name,
//   id: screen_name.userid,
//   profile: screen_name.profile,
//   userKey: screen_name.userKey,
//   device_id: screen_name.device_id,
// };

// const initCometChat = () => {
//   let appSetting = new CometChat.AppSettingsBuilder()
//     .subscribePresenceForAllUsers()
//     .setRegion(cometChatRegion)
//     .autoEstablishSocketConnection(true)
//     .build();
//   CometChat.init(cometChatAppID, appSetting).then(
//     () => {
//       console.log('Initialization completed successfully');
//     },
//     error => {
//       console.log('Initialization failed with error:', error);
//     },
//   );
// };

// const [isCompletedProcess, setIsCompletedProcess] = useState(false)
// const toastConfig = {
//   success: ({ text1, props }) => (
//     <View style={[styles.container]}>
//       <Text numberOfLines={1} style={[styles.message]}>
//         {text1}
//       </Text>
//     </View>
//   ),
//   RedirectionSuccess: ({ text1, props }) => (
//     <TouchableOpacity
//       onPress={() => { }}
//       style={[styles.container, { zIndex: 100 }]}>
//       <Text style={[styles.message]}>{text1}</Text>
//     </TouchableOpacity>
//   ),
// };







