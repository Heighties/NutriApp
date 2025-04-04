import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useProductContext } from '../context/ProductContext';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState(null);
  const [product, setProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToFridge, addToShoppingList } = useProductContext();

  if (!permission?.granted) {
    requestPermission();
    return <Text>Demande d'autorisation pour la caméra...</Text>;
  }

  const handleBarcode = async ({ data }) => {
    if (scannedData) return;

    setScannedData(data);
    setLoading(true);

    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
      const json = await res.json();

      if (json.status === 1) {
        setProduct({ ...json.product, code: data });
        setModalVisible(true);
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

  const closeModal = () => {
    setScannedData(null);
    setModalVisible(false);
    setProduct(null);
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

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={handleBarcode}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'code128', 'qr'],
        }}
        style={StyleSheet.absoluteFillObject}
      />

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
});