import { Platform } from 'react-native';

const PORT = 8080;


const FORCE_LAN_IP = '172.22.240.1';

const isWeb = Platform.OS === 'web';
const isAndroid = Platform.OS === 'android';
const isIOS = Platform.OS === 'ios';

function resolveHost() {
  if (FORCE_LAN_IP) return FORCE_LAN_IP;    
  if (isWeb) return 'localhost';        
  if (isAndroid) return '10.0.2.2';         
  if (isIOS) return 'localhost';           
  return 'localhost';
}

export const API_URL = `http://${resolveHost()}:${PORT}`;
console.log('[API_URL]', API_URL);