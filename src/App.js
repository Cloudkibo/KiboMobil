import React from 'react'
import { registerRootComponent } from 'expo'
import { GalioProvider } from 'galio-framework'
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'react-redux'
import { configureStore } from './redux/store/store'
import SubApp from './sub.app'
// Before rendering any navigation stack
import { enableScreens } from 'react-native-screens'
import { initiateSocket } from './utility/socketio'

import { materialTheme } from './constants/'

enableScreens()
// cache product images
// products.map(product => assetImages.push(product.image));

// cache categories images
// Object.keys(categories).map(key => {
//   categories[key].map(category => assetImages.push(category.image));
// });

const store = configureStore()
initiateSocket(store)

class App extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <GalioProvider theme={materialTheme}>
            <SubApp />
          </GalioProvider>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default registerRootComponent(App)
