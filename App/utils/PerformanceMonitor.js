// Performance monitoring utilities for React Native app
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.startTime = Date.now();
    }

    // Start timing an operation
    start(label) {
        this.metrics.set(label, {
            start: performance.now(),
            end: null,
            duration: null
        });
    }

    // End timing an operation
    end(label) {
        if (this.metrics.has(label)) {
            const metric = this.metrics.get(label);
            metric.end = performance.now();
            metric.duration = metric.end - metric.start;
            return metric.duration;
        }
        return null;
    }

    // Log a performance metric
    log(label, duration) {
        if (__DEV__) {
            console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
        }
        // In production, you could send to analytics service
    }

    // Measure async operations
    async measureAsync(label, asyncOperation) {
        this.start(label);
        try {
            const result = await asyncOperation();
            const duration = this.end(label);
            if (duration !== null) {
                this.log(label, duration);
            }
            return result;
        } catch (error) {
            this.end(label); // Still end timing even on error
            throw error;
        }
    }

    // Measure component render time (React hook integration)
    measureComponentRender(componentName) {
        return {
            beforeRender: () => {
                if (global.ReactComponentTimers && !global.ReactComponentTimers.has(componentName)) {
                    global.ReactComponentTimers = new Map();
                }
                if (global.ReactComponentTimers) {
                    global.ReactComponentTimers.set(componentName, performance.now());
                }
            },
            afterRender: () => {
                if (global.ReactComponentTimers && global.ReactComponentTimers.has(componentName)) {
                    const start = global.ReactComponentTimers.get(componentName);
                    const duration = performance.now() - start;
                    if (__DEV__ && duration > 16) { // More than 1 frame (16ms)
                        console.warn(`[Performance] ${componentName} render took ${duration.toFixed(2)}ms`);
                    }
                    global.ReactComponentTimers.delete(componentName);
                }
            }
        };
    }

    // Memory usage monitoring (simplified for React Native)
    getMemoryInfo() {
        // React Native doesn't have direct memory API access
        // This is a placeholder for potential native module integration
        return {
            timestamp: Date.now(),
            uptime: Date.now() - this.startTime
        };
    }

    // Network request monitoring
    monitorNetworkRequests() {
        // This would integrate with axios interceptors or fetch
        // Already partially implemented in the API service
    }

    // Report slow operations
    reportSlowOperation(label, threshold = 1000) {
        const metric = this.metrics.get(label);
        if (metric && metric.duration > threshold) {
            if (__DEV__) {
                console.warn(`[Performance] Slow operation detected: ${label} took ${metric.duration.toFixed(2)}ms`);
            }
            // In production, send to error reporting service
        }
    }

    // Clear old metrics to prevent memory leaks
    cleanup() {
        const now = performance.now();
        for (const [label, metric] of this.metrics.entries()) {
            // Remove metrics older than 5 minutes
            if (metric.end && (now - metric.end) > 300000) {
                this.metrics.delete(label);
            }
        }
    }

    // Get all current metrics
    getMetrics() {
        const result = {};
        for (const [label, metric] of this.metrics.entries()) {
            result[label] = {
                ...metric,
                duration: metric.duration?.toFixed(2) + 'ms' || 'In progress'
            };
        }
        return result;
    }
}

// Global performance monitor instance
const performanceMonitor = new PerformanceMonitor();

// Export for use throughout the app
export default performanceMonitor;

// Utility hook for React components (if using hooks)
export const usePerformanceMonitor = (componentName) => {
    const monitor = React.useRef(performanceMonitor.measureComponentRender(componentName));
    
    React.useEffect(() => {
        monitor.current.beforeRender();
        return () => monitor.current.afterRender();
    });
};