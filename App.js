import React from 'react'
import { Platform, StatusBar } from 'react-native'
import { Block, GalioProvider } from 'galio-framework'
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'react-redux'
import { configureStore } from './src/redux/store/store'
import SubApp from './src/sub.app'
// Before rendering any navigation stack
import { enableScreens } from 'react-native-screens'

import Screens from './src/navigation/Screens'
import { materialTheme } from './src/constants/'

enableScreens()

// cache product images
// products.map(product => assetImages.push(product.image));

// cache categories images
// Object.keys(categories).map(key => {
//   categories[key].map(category => assetImages.push(category.image));
// });

const store = configureStore()

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
export default App
