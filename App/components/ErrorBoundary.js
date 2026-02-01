import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to an error reporting service
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        if (this.props.onRetry) {
            this.props.onRetry();
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>Something went wrong</Text>
                    <Text style={styles.errorSubtitle}>
                        We're sorry, but something unexpected happened.
                    </Text>
                    <TouchableOpacity 
                        style={styles.retryButton}
                        onPress={this.handleRetry}
                    >
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                    
                    {__DEV__ && this.state.error && (
                        <View style={styles.devError}>
                            <Text style={styles.devErrorTitle}>Debug Information:</Text>
                            <Text style={styles.devErrorText}>{this.state.error.toString()}</Text>
                        </View>
                    )}
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f6f6f8',
        padding: 24,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#EF4444',
        marginBottom: 8,
        textAlign: 'center',
    },
    errorSubtitle: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    retryButton: {
        backgroundColor: '#1152d4',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    devError: {
        marginTop: 24,
        padding: 16,
        backgroundColor: '#fee2e2',
        borderRadius: 8,
        maxWidth: '100%',
    },
    devErrorTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#dc2626',
        marginBottom: 8,
    },
    devErrorText: {
        fontSize: 12,
        color: '#dc2626',
        fontFamily: 'monospace',
    },
});

export default ErrorBoundary;