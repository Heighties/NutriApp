import { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Alert, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';



export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, []);

  const handleScan = async () => {
    if (!cameraRef.current) return;

    const result = await cameraRef.current.takePictureAsync({ skipProcessing: true });
    const barcodes = await scanBarCodesAsync(result, [BarcodeType.EAN_13, BarcodeType.CODE_128, BarcodeType.QR]);

    if (barcodes.length > 0) {
      setScannedData(barcodes[0].data);
      Alert.alert('Code détecté', barcodes[0].data);
    } else {
      Alert.alert('Aucun code détecté');
    }
  };

  if (!permission?.granted) {
    return <Text>Demande d'autorisation pour la caméra...</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={false}
      />
      <View style={styles.buttonContainer}>
        <Button title="Scanner maintenant" onPress={handleScan} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
  },
});
