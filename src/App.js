import React from 'react'
import { registerRootComponent } from 'expo'
import { GalioProvider } from 'galio-framework'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from './rootNavigation'
import { Provider } from 'react-redux'
import { configureStore } from './redux/store/store'
import SubApp from './sub.app'
// Before rendering any navigation stack
import { enableScreens } from 'react-native-screens'
import { initiateSocket } from './utility/socketio'

import { materialTheme } from './constants/'
import * as Sentry from 'sentry-expo'

enableScreens()
// cache product images
// products.map(product => assetImages.push(product.image));

// cache categories images
// Object.keys(categories).map(key => {
//   categories[key].map(category => assetImages.push(category.image));
// });

const store = configureStore()
initiateSocket(store)
Sentry.init({
  dsn: 'https://6c7958e0570f455381d6f17122fbd117@o132281.ingest.sentry.io/292307',
  enableInExpoDevelopment: true,
  debug: true,
  attachStacktrace: true
})
class App extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <NavigationContainer ref={navigationRef}>
          <GalioProvider theme={materialTheme}>
            <SubApp />
          </GalioProvider>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default registerRootComponent(App)
