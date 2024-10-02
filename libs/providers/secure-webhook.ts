import crypto from "crypto";
import fs from "fs";
import path from "path";
import { AIRALO_CLIENT_SECRET } from "./config";

const LOG_FILE_PATH = path.join(__dirname, "airalo_webhook_log.json");

export const secureAiraloWebhook = (
	payload: any,
	signature: string,
): boolean => {
	// Validate input
	console.log(signature, payload);

	if (!signature || !payload) {
		console.warn("Missing payload or signature");
		return false;
	}

	const payloadData =
		typeof payload === "object" ? JSON.stringify(payload) : "{}";
	const expectedSignature = crypto
		.createHmac("sha512", AIRALO_CLIENT_SECRET || "")
		.update(payloadData)
		.digest("hex");

	const isValid = expectedSignature === signature;

	if (isValid) {
		console.log("Valid payload received from Airalo");
	} else {
		console.warn("Invalid signature detected for Airalo payload");
	}

	// Log payload to a JSON file
	logPayloadToFile(payload, isValid);

	return isValid;
};

// Utility function to log payload data into a JSON file
const logPayloadToFile = (payload: any, isValid: boolean) => {
	const logEntry = {
		timestamp: new Date().toISOString(),
		isValid,
		payload,
	};

	try {
		// Check if log file exists
		if (fs.existsSync(LOG_FILE_PATH)) {
			const existingLogs = JSON.parse(fs.readFileSync(LOG_FILE_PATH, "utf8"));
			existingLogs.push(logEntry);
			fs.writeFileSync(
				LOG_FILE_PATH,
				JSON.stringify(existingLogs, null, 2),
				"utf8",
			);
		} else {
			// Create the log file with the first entry
			fs.writeFileSync(
				LOG_FILE_PATH,
				JSON.stringify([logEntry], null, 2),
				"utf8",
			);
		}
	} catch (error) {
		console.error("Error writing to log file:", error);
	}
};
