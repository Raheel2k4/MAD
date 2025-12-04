import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCart } from '../../contexts/CartContext';
import CustomButton from '../../components/CustomButton';
import WavyHeader from '../../components/WavyHeader';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

// Enable LayoutAnimation on Android (safe way)
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function CartScreen() {
    const { items, total, loading, removeFromCart, updateQuantity } = useCart();
    const router = useRouter();

    const handleCheckout = () => {
        router.push('/checkout');
    };

    const handleRemove = (productId: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        removeFromCart(productId);
    };

    const handleUpdate = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            handleRemove(productId);
            return;
        }
        updateQuantity(productId, newQuantity);
    };

    const renderContent = () => {
        if (loading) {
            return <ActivityIndicator size="large" style={styles.loader} />;
        }

        if (!items || items.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={80} color={theme.colors.muted} />
                    <Text style={styles.emptyText}>Your Cart is Empty</Text>
                    <Text style={styles.emptySubText}>
                        Looks like you haven't added anything to your cart yet.
                    </Text>
                    <CustomButton title="Start Shopping" onPress={() => router.replace('/')} />
                </View>
            );
        }

        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={items}
                    keyExtractor={(item, index) => item.product?._id ?? `fallback-${index}`}
                    renderItem={({ item, index }) => {
                        // Safety guard: skip or show placeholder if product is missing
                        if (!item.product) {
                            console.warn('Invalid cart item (missing product):', item);
                            return null;
                        }

                        const product = item.product;

                        return (
                            <View style={styles.cartItem}>
                                <Image
                                    source={{
                                        uri: product.image_url || 'https://via.placeholder.com/80',
                                    }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                                <View style={styles.itemDetails}>
                                    <Text style={styles.itemName} numberOfLines={2}>
                                        {product.name || 'Unknown Product'}
                                    </Text>
                                    <Text style={styles.itemPrice}>
                                        ${Number(product.price || 0).toFixed(2)}
                                    </Text>
                                    <Text style={styles.itemSubtotal}>
                                        Subtotal: ${(Number(product.price || 0) * item.quantity).toFixed(2)}
                                    </Text>
                                </View>

                                <View style={styles.actionsContainer}>
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => handleRemove(product._id)}
                                    >
                                        <Ionicons name="trash-bin-outline" size={20} color={theme.colors.muted} />
                                    </TouchableOpacity>

                                    <View style={styles.quantityContainer}>
                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() => handleUpdate(product._id, item.quantity + 1)}
                                        >
                                            <Ionicons name="chevron-up-outline" size={22} color={theme.colors.primary} />
                                        </TouchableOpacity>

                                        <Text style={styles.quantityText}>{item.quantity}</Text>

                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() => handleUpdate(product._id, item.quantity - 1)}
                                        >
                                            <Ionicons name="chevron-down-outline" size={22} color={theme.colors.primary} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        );
                    }}
                    contentContainerStyle={{
                        paddingHorizontal: theme.spacing.m,
                        paddingTop: theme.spacing.m,
                        paddingBottom: 100, // extra space for footer
                    }}
                    showsVerticalScrollIndicator={false}
                />

                <View style={styles.footer}>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalText}>${total.toFixed(2)}</Text>
                    </View>
                    <CustomButton title="Proceed to Checkout" onPress={handleCheckout} />
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <WavyHeader>
                <View style={styles.headerContentContainer}>
                    <View style={styles.headerTitleContainer}>
                        <Ionicons name="cart" size={28} color="white" style={{ marginRight: 10 }} />
                        <Text style={styles.headerTitle}>Cart</Text>
                    </View>
                </View>
            </WavyHeader>

            {renderContent()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    headerContentContainer: {
        width: '100%',
        paddingHorizontal: theme.spacing.l,
        justifyContent: 'center',
        flex: 1,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'left',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.l,
    },
    emptyText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: theme.spacing.m,
    },
    emptySubText: {
        fontSize: 16,
        color: theme.colors.muted,
        textAlign: 'center',
        marginVertical: theme.spacing.m,
        marginBottom: theme.spacing.l,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginBottom: theme.spacing.m,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: theme.spacing.m,
        backgroundColor: '#f0f0f0',
    },
    itemDetails: {
        flex: 1,
        justifyContent: 'space-around',
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
    },
    itemPrice: {
        fontSize: 14,
        color: theme.colors.muted,
    },
    itemSubtotal: {
        fontSize: 15,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    actionsContainer: {
        justifyContent: 'space-between',
        marginLeft: theme.spacing.m,
    },
    removeButton: {
        padding: 4,
    },
    quantityContainer: {
        alignItems: 'center',
    },
    quantityButton: {
        paddingVertical: 2,
    },
    quantityText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 4,
        minWidth: 30,
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: theme.spacing.m,
        borderTopWidth: 1,
        borderColor: theme.colors.gray,
        paddingBottom: 30,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.m,
    },
    totalLabel: {
        fontSize: 16,
        color: theme.colors.muted,
        fontWeight: '600',
    },
    totalText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
});