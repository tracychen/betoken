"use client";

import { verifyProof } from "@/app/actions/verify-proof";
import { Button } from "@/components/ui/button";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";

export default function SettingsPage() {
  // TODO: Functionality after verifying
  const onSuccess = () => {
    console.log("Success");
  };

  return (
    <div className=" h-[900px]">
      Link World ID
      <div className="max-h-[60%]">
        <IDKitWidget
          app_id="app_staging_fb4ff0d388439e8e285f93350a40df78"
          action="validate-world-id"
          autoClose={true}
          verification_level={VerificationLevel.Device}
          handleVerify={verifyProof}
          onSuccess={onSuccess}
        >
          {({ open }) => <Button onClick={open}>Verify with World ID</Button>}
        </IDKitWidget>
        <Button className="absolute bottom-4 z-50"> X</Button>
      </div>
    </div>
  );
}
