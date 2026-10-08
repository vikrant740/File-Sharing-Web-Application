import { useContext } from 'react';
import { WebRTCProvider, useWebRTC as useWebRTCContext } from '../context/WebRTCContext';

/**
 * useWebRTC Hook
 * Re-exports the WebRTCContext hook to make it easily accessible across all pages
 */
export function useWebRTC() {
  return useWebRTCContext();
}

export { WebRTCProvider };