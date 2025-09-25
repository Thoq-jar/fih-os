import { useEffect, useState } from "react";
import "./BootScreen.css";

export function BootScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) {
    return null;
  }

  return (
    <div className="boot-screen">
      <div className="shimmer">FihOS</div>
    </div>
  );
}
