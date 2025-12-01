import React, { useState, useEffect } from 'react';

// Global debug logs storage
window.debugLogs = window.debugLogs || [];
window.addDebugLog = (message) => {
  const timestamp = new Date().toLocaleTimeString();
  window.debugLogs.push({ timestamp, message });
  if (window.debugLogs.length > 50) {
    window.debugLogs.shift();
  }
  // Trigger update event
  window.dispatchEvent(new Event('debugLogUpdate'));
};

const DebugOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const handleUpdate = () => {
      setLogs([...window.debugLogs]);
    };

    window.addEventListener('debugLogUpdate', handleUpdate);
    return () => window.removeEventListener('debugLogUpdate', handleUpdate);
  }, []);

  return (
    <>
      {/* Debug Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          zIndex: 99999,
          backgroundColor: '#ff0000',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '10px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace'
        }}
      >
        DEBUG
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '150px',
            right: '20px',
            zIndex: 99998,
            backgroundColor: 'white',
            border: '2px solid #000',
            borderRadius: '8px',
            width: '350px',
            maxWidth: '90vw',
            maxHeight: '400px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'monospace',
            fontSize: '11px'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '10px',
              backgroundColor: '#000',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '6px 6px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>REMINDER COUNTER DEBUG</span>
            <button
              onClick={() => {
                window.debugLogs = [];
                setLogs([]);
              }}
              style={{
                backgroundColor: '#ff0000',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              CLEAR
            </button>
          </div>

          {/* Logs */}
          <div
            style={{
              padding: '10px',
              overflowY: 'auto',
              flex: 1,
              backgroundColor: '#f5f5f5'
            }}
          >
            {logs.length === 0 ? (
              <div style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                No logs yet. Refresh page or trigger action.
              </div>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: '8px',
                    padding: '6px',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    wordBreak: 'break-word'
                  }}
                >
                  <div style={{ color: '#666', fontSize: '9px', marginBottom: '2px' }}>
                    {log.timestamp}
                  </div>
                  <div style={{ color: '#000' }}>
                    {log.message}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '8px',
              backgroundColor: '#f0f0f0',
              borderTop: '1px solid #ddd',
              fontSize: '10px',
              textAlign: 'center',
              color: '#666'
            }}
          >
            Total logs: {logs.length}/50
          </div>
        </div>
      )}
    </>
  );
};

export default DebugOverlay;
