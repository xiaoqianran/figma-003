import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { DemoStateProvider } from './context/DemoStateContext'
import { ToastProvider } from './components/ui'

class RootErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Root error boundary caught:', error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 40, color: '#C53D3D', fontFamily: 'monospace' }}>Critical app error. Please refresh the page.</div>
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ToastProvider>
        <DemoStateProvider>
          <RootErrorBoundary>
            <App />
          </RootErrorBoundary>
        </DemoStateProvider>
      </ToastProvider>
    </HashRouter>
  </StrictMode>,
)
