/**
 * Parse the client IP address from a request headers.
 * Supported headers are:
 * - CF-Connecting-IP
 * - X-Forwarded-For
 *
 * @example
 * ```ts
 * import { parseClientIp } from "jsr:@dector/webx/ip";
 *
 * const request = new Request("", {
 *   headers: {
 *     "X-Forwarded-For": "192.0.2.1, 198.51.100.1",
 *   },
 * });
 *
 * // Will be: 192.0.2.1
 * const ip = parseClientIp(request);
 * ```
 *
 * @param request - The request object
 * @param _opts - Control which headers to use
 * @param _opts.cloudflare - Use the Cloudflare header (true by default)
 * @param _opts.standard - Use the standard header (true by default)
 * @returns The client IP address or empty string
 */
export const parseClientIp = (
	request: Request,
	_opts: ParseClientIpOpts = {},
): string => {
	const headers = request.headers;
	const opts = { cloudflare: true, standard: true, ..._opts };

	let ip = null;

	if (opts.cloudflare) {
		ip = headers.get("CF-Connecting-IP")?.split(",")[0]?.trim();
	}
	if (ip) return ip;

	if (opts.standard) {
		ip = headers.get("X-Forwarded-For")?.split(",")[0]?.trim();
	}
	if (ip) return ip;

	return "";
};

/**
 * Control which headers to use in the `parseClientIp` function.
 *
 * @see {@link parseClientIp}
 * @param cloudflare - Use the Cloudflare header
 * @param standard - Use the standard header
 */
export type ParseClientIpOpts = {
	cloudflare?: boolean;
	standard?: boolean;
};
