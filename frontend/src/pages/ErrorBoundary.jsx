import React from 'react';

class ErrorBoundary extends React.Component {
    state = { hasError: false };
    
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    
    componentDidCatch(error, info) {
        console.error('Error Boundary:', error, info);
    }
    
    render() {
        return this.state.hasError ? (
            <div className="alert alert-danger">
                Something went wrong. Please refresh the page.
            </div>
        ) : this.props.children;
    }
}

export default ErrorBoundary;