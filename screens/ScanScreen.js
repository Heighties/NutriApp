import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useProductContext } from '../context/ProductContext';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState(null);
  const [product, setProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [readyToScan, setReadyToScan] = useState(false);
  const [highlightAnim] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const route = useRoute();
  const { addToFridge, addToShoppingList } = useProductContext();

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, []);

  const handleBarcode = async ({ data }) => {
    if (scannedData) return;

    setScannedData(data);
    setLoading(true);
    animateHighlight();

    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
      const json = await res.json();

      if (json.status === 1) {
        setProduct({ ...json.product, code: data });
        if (route.params?.autoAddToFridge) {
          addToFridge({ ...json.product, code: data });
          setScannedData(null);
          setReadyToScan(false);
          alert('Produit ajouté au frigo');
          navigation.goBack();
        } else {
          setModalVisible(true);
        }
      } else {
        setProduct({
          code: data,
          product_name: 'Produit inconnu',
          brands: '',
          image_front_small_url: null,
          nutriments: {},
        });
        setModalVisible(true);
      }
    } catch (err) {
      console.error(err);
      setProduct({
        code: data,
        product_name: 'Erreur lors du scan',
        brands: '',
        image_front_small_url: null,
        nutriments: {},
      });
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const animateHighlight = () => {
    highlightAnim.setValue(0);
    Animated.timing(highlightAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      highlightAnim.setValue(0);
    });
  };

  const closeModal = () => {
    setScannedData(null);
    setModalVisible(false);
    setProduct(null);
    setReadyToScan(false);
  };

  const handleAddToFridge = () => {
    if (product) addToFridge(product);
    closeModal();
  };

  const handleAddToShoppingList = () => {
    if (product) addToShoppingList(product);
    closeModal();
  };

  const nutriments = product?.nutriments || {};

  const animatedStyle = {
    backgroundColor: highlightAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', '#ffffff33'],
    }),
  };

  if (!permission?.granted) {
    return <Text>Demande d'autorisation pour la caméra...</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={readyToScan && !scannedData ? handleBarcode : undefined}
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'code128', 'qr'] }}
        style={StyleSheet.absoluteFillObject}
      />

      <Animated.View style={[styles.targetBox, animatedStyle]} />

      {!readyToScan && (
        <TouchableOpacity style={styles.scanButton} onPress={() => setReadyToScan(true)}>
          <View style={styles.innerCircle} />
        </TouchableOpacity>
      )}

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {product?.image_front_small_url && (
              <Image
                source={{ uri: product.image_front_small_url }}
                style={styles.image}
              />
            )}
            <Text style={styles.title}>{product?.product_name || 'Nom inconnu'}</Text>
            <Text style={styles.brand}>Marque : {product?.brands || 'N/A'}</Text>
            <View style={styles.nutrition}>
              <Text>🔋 {nutriments['energy-kcal'] || '–'} kcal</Text>
              <Text>💪 {nutriments.proteins || '–'} g protéines</Text>
              <Text>🍞 {nutriments.carbohydrates || '–'} g glucides</Text>
              <Text>🧈 {nutriments.fat || '–'} g lipides</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity onPress={handleAddToFridge} style={styles.actionButton}>
                <Text style={styles.actionText}>+ Frigo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddToShoppingList} style={styles.actionButton}>
                <Text style={styles.actionText}>+ Liste</Text>
              </TouchableOpacity>
            </View>

            <Pressable onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeText}>Fermer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000088',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 130,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  brand: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  nutrition: {
    gap: 4,
    marginTop: 10,
    marginBottom: 15,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  targetBox: {
    position: 'absolute',
    top: '40%',
    left: '15%',
    width: '70%',
    height: 200,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    zIndex: 10,
  },
  scanButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: 70,
    height: 70,
    backgroundColor: '#3b82f6',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  innerCircle: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 15,
  },
});