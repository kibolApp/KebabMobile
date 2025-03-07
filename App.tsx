import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './contexts/AuthContext';
import WelcomePage from './screens/WelcomePage';
import SuggestionsManagement from './screens/SuggestionsManagement';
import AuthPage from './screens/AuthPage';
import HomePage from './screens/HomePage';
import KebabPage from './screens/KebabPage';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <AuthProvider>
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
          <Stack.Screen
            name="SuggestionsManagement"
            component={SuggestionsManagement}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="KebabPage"
            component={KebabPage}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
