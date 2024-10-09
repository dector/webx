import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";

import { parseClientIp } from "./ip.ts";

const URL = "https://github.com";

describe("parseClientIp", () => {
	it("from the Cloudflare header", () => {
		const request = new Request(URL, {
			headers: {
				"CF-Connecting-IP": "192.0.2.1, 192.0.2.2",
			},
		});

		const ip = parseClientIp(request);

		expect(ip).toBe("192.0.2.1");
	});

	it("from the standard header", () => {
		const request = new Request(URL, {
			headers: {
				"X-Forwarded-For": "192.0.2.1, 192.0.2.2",
			},
		});

		const ip = parseClientIp(request);
		expect(ip).toBe("192.0.2.1");
	});

	it("prefers Cloudflare header", () => {
		const request = new Request(URL, {
			headers: {
				"CF-Connecting-IP": "192.0.2.1, 192.0.2.2",
				"X-Forwarded-For": "192.0.2.3, 192.0.2.4",
			},
		});

		const ip = parseClientIp(request);
		expect(ip).toBe("192.0.2.1");
	});

	it("with disabled Cloudflare header", () => {
		const request = new Request(URL, {
			headers: {
				"CF-Connecting-IP": "192.0.2.1, 192.0.2.2",
				"X-Forwarded-For": "192.0.2.3, 192.0.2.4",
			},
		});

		const ip = parseClientIp(request, { cloudflare: false });
		expect(ip).toBe("192.0.2.3");
	});

	it("with disabled standard header", () => {
		const request = new Request(URL, {
			headers: {
				"CF-Connecting-IP": "192.0.2.1, 192.0.2.2",
				"X-Forwarded-For": "192.0.2.3, 192.0.2.4",
			},
		});

		const ip = parseClientIp(request, { standard: false });
		expect(ip).toBe("192.0.2.1");
	});

	it("disables all headers", () => {
		const request = new Request(URL, {
			headers: {
				"CF-Connecting-IP": "192.0.2.1, 192.0.2.2",
				"X-Forwarded-For": "192.0.2.3, 192.0.2.4",
			},
		});

		const ip = parseClientIp(request, { cloudflare: false, standard: false });
		expect(ip).toBe("");
	});

	it("empty string if no headers provided", () => {
		const request = new Request(URL);

		const ip = parseClientIp(request);

		expect(ip).toBe("");
	});
});
