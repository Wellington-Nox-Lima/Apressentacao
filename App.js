import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar} from 'react-native';
import Routes from './src/routes';
import 'react-native-reanimated';
import Splash from './src/pages/Splash/index';

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simula um carregamento
    setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 segundos
  }, []);

  if (isLoading) {
    return <Splash />;
  }
 
  return (
      <NavigationContainer>
        <StatusBar hidden={true}></StatusBar>
        <Routes/>
      </NavigationContainer>
  );
}