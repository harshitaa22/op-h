# **React Native** | _**OpiGo1final**_ | _**78295**_

## **Catalog ProjectId: 69019** | **Catalog BuildId: 3099**

## NOTE FOR DEVELOPERS:
Clone the code-engine branch into your working branch. The contents of the branch may get overwritten.
## Author:
Code-Engine
## Keywords:
 - OpiGo1final
 - mobile
## Assembled Features To Block Status

| **Feature-Name**        | **Block-Name**        | **Path**  | **Status**  |
|:-------------|:-------------|:-------------|:-------------|
| FilterItems      | filteritems<br>core<br>catalogue<br>      | {+packages/blocks/filteritems+}<br>{+packages/blocks/core+}<br>{+packages/blocks/catalogue+}<br> | {+Non-Empty+} |
| PostCreation2      | postcreation<br>categoriessubcategories<br>      | {+packages/blocks/postcreation+}<br>{+packages/blocks/categoriessubcategories+}<br> | {+Non-Empty+} |
| ContactUs2      | contactus<br>      | {+packages/blocks/contactus+}<br> | {+Non-Empty+} |
| SplashScreen2      | splashscreen<br>      | {+packages/blocks/splashscreen+}<br> | {+Non-Empty+} |
| PhoneLogin      | mobile-account-registration<br>country-code-selector<br>otp-input-confirmation<br>social-media-account-login<br>social-media-account<br>mobile-account-login<br>forgot-password<br>      | {+packages/blocks/mobile-account-registration+}<br>{+packages/blocks/country-code-selector+}<br>{+packages/blocks/otp-input-confirmation+}<br>{+packages/blocks/social-media-account-login+}<br>{+packages/blocks/social-media-account+}<br>{+packages/blocks/mobile-account-login+}<br>{+packages/blocks/forgot-password+}<br> | {+Non-Empty+} |
| PhoneVerification      | PhoneVerification      | {-packages/blocks/PhoneVerification-} | {-Empty-} |
| OpenApi      | OpenApi      | {-packages/blocks/OpenApi-} | {-Empty-} |
| ProjecttaskTracking2      | ProjecttaskTracking2      | {-packages/blocks/ProjecttaskTracking2-} | {-Empty-} |
| GroupChat      | GroupChat      | {-packages/blocks/GroupChat-} | {-Empty-} |
| FriendList      | FriendList      | {-packages/blocks/FriendList-} | {-Empty-} |
| PushNotifications      | PushNotifications      | {-packages/blocks/PushNotifications-} | {-Empty-} |
| CfProfileScore      | CfProfileScore      | {-packages/blocks/CfProfileScore-} | {-Empty-} |
| Notifications      | Notifications      | {-packages/blocks/Notifications-} | {-Empty-} |
| DragDropInterface      | DragDropInterface      | {-packages/blocks/DragDropInterface-} | {-Empty-} |
| Polling      | Polling      | {-packages/blocks/Polling-} | {-Empty-} |
| AddFriends      | AddFriends      | {-packages/blocks/AddFriends-} | {-Empty-} |
| Analytics3      | Analytics3      | {-packages/blocks/Analytics3-} | {-Empty-} |
| CustomForm2      | CustomForm2      | {-packages/blocks/CustomForm2-} | {-Empty-} |
| CustomisableUserProfiles      | CustomisableUserProfiles      | {-packages/blocks/CustomisableUserProfiles-} | {-Empty-} |
| LandingPage2      | LandingPage2      | {-packages/blocks/LandingPage2-} | {-Empty-} |
| ProjectTemplates      | ProjectTemplates      | {-packages/blocks/ProjectTemplates-} | {-Empty-} |
| AdminConsole3      | AdminConsole3      | {-packages/blocks/AdminConsole3-} | {-Empty-} |
| ApiIntegration8      | ApiIntegration8      | {-packages/blocks/ApiIntegration8-} | {-Empty-} |
| ActivityFeed      | ActivityFeed      | {-packages/blocks/ActivityFeed-} | {-Empty-} |
| ElasticSearch      | ElasticSearch      | {-packages/blocks/ElasticSearch-} | {-Empty-} |
| Comments      | Comments      | {-packages/blocks/Comments-} | {-Empty-} |

## AWS BACKEND DEPLOYMENT URL
 - BaseURL exported as: "https://opigo1final-78295-ruby.b78295.dev.eastus.az.svc.builder.cafe"
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

See docs folder for additional information.

### Prerequisites

What things you need to install the software and how to install them

* React Native (last tested on react-native0.61.3)
  - https://facebook.github.io/react-native/docs/getting-started

* IFF brew is installed and user doesn't have permisions.
```
  $ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"
  $ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

* XCode 11 or greater

* XCode Command Line Tools
```
  $ xcode-select --install
```

* Android SDK
```
  $ brew cask install android-sdk
```

* JDK 11
```
  $ brew tap homebrew/cask-versions
  $ brew cask install java
  $ brew cask install java11
```

### Installing

A step by step series of examples that tell you how to get a development env running

Install yarn
```
  $ brew install yarn
```

Install node

```
  $ brew install node
```

Web
```
  $ yarn
  $ yarn workspace web start 
  (Note: After udpating depencies run again if no cocde erros. )
```

iOS
```
  $ yarn
  $ cd packages/mobile/ios && pod install && cd ../../../ && cp node-runners/RCTUIImageViewAnimated.m node_modules/react-native/Libraries/Image/RCTUIImageViewAnimated.m && npx react-native bundle --entry-file ./packages/mobile/index.js --platform ios --dev true --bundle-output ./packages/mobile/ios/main.jsbundle && yarn ios
```

Android - https://docs.expo.io/versions/latest/workflow/android-studio-emulator/
```
  $ yarn
  $ export JAVA_HOME=`/usr/libexec/java_home -v 11`; java -version; export ANDROID_HOME=${HOME}/Library/Android/sdk; export PATH=${PATH}:${ANDROID_HOME}/emulator && yarn android
```

## Running the tests

```
  $ yarn test
```


## CI/CD Details

We use GitlabCI for our deployment/Build pipelines

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).



