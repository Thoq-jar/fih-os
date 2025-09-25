interface NekoFetchInfo {
  browser: string;
  cpu: string;
  cat: string;
}

export const nekofetch = async (): Promise<NekoFetchInfo> => {
  const browser = navigator.userAgent;
  const cpu = `x${navigator.hardwareConcurrency}`;

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
    cat,
  };
};
