import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomePage from './screens/WelcomePage';
import AuthPage from './screens/AuthPage';
import HomePage from './screens/HomePage';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomePage">
        <Stack.Screen
          name="WelcomePage"
          component={WelcomePage}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AuthPage"
          component={AuthPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
           name="HomePage"
           component={HomePage}
           options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
