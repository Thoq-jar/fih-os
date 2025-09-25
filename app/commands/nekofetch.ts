interface NekoFetchInfo {
  browser: string;
  cpu: string;
  os: string;
  resolution: string;
  language: string;
  ram: string;
  gpu: string;
  cat: string;
}

export const nekofetch = async (): Promise<NekoFetchInfo> => {
  const browser = navigator.userAgent;
  const cpu = `x${navigator.hardwareConcurrency}`;
  const os = navigator.platform;
  const resolution = `${window.screen.width}x${window.screen.height}`;
  const language = navigator.language;
  const ram = `${(navigator as any).deviceMemory || 'N/A'} GB`;

  const getGpuInfo = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
        return debugInfo ? (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'N/A';
      }
    } catch (e) {
      return 'N/A';
    }
    return 'N/A';
  };

  const gpu = getGpuInfo();

  const response = await fetch('https://cataas.com/cat', {
    headers: {
        'Content-Type': 'image/jpeg',
    }
  });
  const blob = await response.blob();
  const cat = URL.createObjectURL(blob);

  return {
    browser,
    cpu,
    os,
    resolution,
    language,
    ram,
    gpu,
    cat,
  };
};
