import { useState, useEffect, useCallback } from 'react';

export interface MediaDevice {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'audiooutput' | 'videoinput';
}

export interface UseMediaDevicesResult {
  /** Available audio input devices */
  audioInputs: MediaDevice[];
  /** Available audio output devices */
  audioOutputs: MediaDevice[];
  /** Available video input devices */
  videoInputs: MediaDevice[];
  /** Whether we have permission to access devices */
  hasPermission: boolean;
  /** Error if any */
  error: Error | null;
  /** Request permission and get devices */
  requestAccess: () => Promise<boolean>;
  /** Refresh device list */
  refreshDevices: () => Promise<void>;
}

/**
 * Hook to access media devices
 */
export function useMediaDevices(): UseMediaDevicesResult {
  const [devices, setDevices] = useState<MediaDevice[]>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const parseDevices = useCallback((deviceList: MediaDeviceInfo[]): MediaDevice[] => {
    return deviceList.map((device) => ({
      deviceId: device.deviceId,
      label: device.label || `${device.kind} (${device.deviceId.slice(0, 5)}...)`,
      kind: device.kind as 'audioinput' | 'audiooutput' | 'videoinput',
    }));
  }, []);

  const getDevices = useCallback(async () => {
    try {
      // Request permission first
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setHasPermission(true);

      // Get all devices
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      setDevices(parseDevices(deviceList));
      setError(null);
    } catch (err) {
      // Even without permission, we might get device info
      try {
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        setDevices(parseDevices(deviceList));
      } catch {
        setDevices([]);
      }
      setHasPermission(false);
      setError(err instanceof Error ? err : new Error('Failed to access media devices'));
    }
  }, [parseDevices]);

  const requestAccess = useCallback(async (): Promise<boolean> => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setHasPermission(true);
      await getDevices();
      return true;
    } catch {
      setHasPermission(false);
      return false;
    }
  }, [getDevices]);

  const refreshDevices = useCallback(async () => {
    await getDevices();
  }, [getDevices]);

  useEffect(() => {
    getDevices();

    // Listen for device changes
    const handleDeviceChange = () => {
      getDevices();
    };

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [getDevices]);

  const audioInputs = devices.filter((d) => d.kind === 'audioinput');
  const audioOutputs = devices.filter((d) => d.kind === 'audiooutput');
  const videoInputs = devices.filter((d) => d.kind === 'videoinput');

  return {
    audioInputs,
    audioOutputs,
    videoInputs,
    hasPermission,
    error,
    requestAccess,
    refreshDevices,
  };
}

export default useMediaDevices;
