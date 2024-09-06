import axios from "axios";
import { SERVICE, SERVICE_NAME } from "./service-urls";

class ServiceDiscovery {
	static async getServiceAddress(serviceName: SERVICE): Promise<string> {
		const splitName = SERVICE_NAME[serviceName].split("/");

		const name = splitName[0].replace("_", "-").toLowerCase();
		const path = splitName[1];

		const traefikHost = process.env.TRAEFIK_HOST || "localhost:8080";

		const response = await axios.get(
			`http://${traefikHost}/api/http/services/${name}@file`,
		);

		const server = Object.keys(response.data.serverStatus);

		if (server.length === 0) {
			throw new Error(`Service ${name} not found`);
		}

		return `${server[0]}/${path}`;
	}
}

export { ServiceDiscovery };
