"use client";

import { useRef, useState } from "react";
import { Camera } from "lucide-react";

interface PhotoCaptureProps {
  onCapture: (file: File, lat?: number, lng?: number) => void;
  disabled?: boolean;
  label?: string;
}

export function PhotoCapture({
  onCapture,
  disabled,
  label = "Add photo",
}: PhotoCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  function getLocation(): Promise<{ lat: number; lng: number } | undefined> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(undefined);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => resolve(undefined),
        { timeout: 5000, maximumAge: 60000 }
      );
    });
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const loc = await getLocation();
      onCapture(file, loc?.lat, loc?.lng);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || uploading}
        className="flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-50 text-sm"
      >
        <Camera className="w-4 h-4" />
        {uploading ? "Adding…" : label}
      </button>
    </div>
  );
}
