import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/presentation/navigation/RootNavigator';
import { THEME } from './src/core/theme';
import { Toast } from './src/presentation/components/Toast';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor={THEME.colors.background} translucent={false} />
        <View style={styles.appContainer}>
          <RootNavigator />
        </View>
        <Toast />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
});
