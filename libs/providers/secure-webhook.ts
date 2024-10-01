import { AIRALO_CLIENT_SECRET } from "./config";
import crypto from "crypto";

export const secureAiraloWebhook = (payload: any, signature: string) => {
	let payloadData = "{}";

	if (typeof payload === "object") {
		payloadData = JSON.stringify(payload);
	}

	const expectedSignature = crypto
		.createHmac("sha512", AIRALO_CLIENT_SECRET || "")
		.update(payloadData)
		.digest("hex");

	if (signature && expectedSignature === signature) {
		// Here you are guaranteed the payload came from Airalo's system, and it is not from any third party or attacker.
		// You can safely proceed with your flow.
		console.log("Yay!");
	} else {
		// We wouldn't trust this payload and the system that sent it... Better to reject it or proceed at your own risk.
		console.log("Hmm.... it is suspicious");
	}

	return false;
};
