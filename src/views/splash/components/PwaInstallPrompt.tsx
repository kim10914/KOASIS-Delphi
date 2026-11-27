"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { pwaInstallText } from "@/constants/pwaInstall";

type PwaInstallPromptProps = {
  open: boolean;
  isIosDevice: boolean;
  hasNativePrompt: boolean;
  onInstall: () => Promise<void>;
  onClose: () => void;
};

export default function PwaInstallPrompt({
  open,
  isIosDevice,
  hasNativePrompt,
  onInstall,
  onClose,
}: PwaInstallPromptProps) {
  const [showGuide, setShowGuide] = useState(false);
  const guideSteps = isIosDevice
    ? pwaInstallText.iosSteps
    : pwaInstallText.fallbackSteps;

  const handleInstall = async () => {
    if (hasNativePrompt) {
      await onInstall();
      onClose();
      return;
    }
    setShowGuide(true);
  };

  return (
    <Modal open={open} title={pwaInstallText.title} onClose={onClose}>
      {showGuide ? (
        <>
          <p className="text-text-muted mt-3 text-base">
            {pwaInstallText.guideTitle}
          </p>
          <ol className="mt-4 flex list-decimal flex-col gap-2 pl-5 text-base">
            {guideSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <Button className="mt-6" onClick={onClose}>
            {pwaInstallText.confirmLabel}
          </Button>
        </>
      ) : (
        <>
          <p className="text-text-muted mt-3 text-base">
            {pwaInstallText.description}
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button onClick={handleInstall}>
              {pwaInstallText.installLabel}
            </Button>
            <Button variant="secondary" onClick={onClose}>
              {pwaInstallText.dismissLabel}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
