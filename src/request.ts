import * as superagent from "superagent";
import {Response} from "express";

/**
 * Superagent wrapper for easily making AJAX requests. Provides a layer of
 * convenience by adding a base URL to each request. The base URL is derived
 * from the ```API_URL``` environment variable.
 */
class Request {
    private readonly baseUrl: string = process.env.API_URL || 'http://thexem.darksupremo.com/';
    private readonly headerHost: string = process.env.HEADER_HOST || 'thexem.de';
    private readonly userAgent: string = process.env.USER_AGENT || 'okhttp/3.12.1';

    constructor() {}

    /**
     * DELETE relative `path` with optional callback `fn(res)`.
     *
     * @method del
     * @return {Request}
     * @public
     */
    public del(path): superagent.SuperAgentRequest {
        return (
            superagent
                .del(this.baseUrl + path)
                .set('Host', this.headerHost)
                .set('user-agent', this.userAgent)
        );
    }

    /**
     * GET relative `path` with optional `data` and callback `fn(res)`.
     *
     * @method get
     * @param {String} path
     * @return {Request}
     * @public
     */
    public get(path): superagent.SuperAgentRequest {
        return (
            superagent
                .get(this.baseUrl + path)
                .set('Host', this.headerHost)
                .set('user-agent', this.userAgent)
        );
    }

    public redirectGet(path: string, res: Response) {
        this.get(path)
            .then(response => {
                res.send(response.body)
            })
            .catch(reason => {
                res.send(reason)
            })
    }

    /**
     * PATCH relative `path` with optional `data` and callback `fn(res)`.
     *
     * @method patch
     * @param {String} path
     * @return {Request}
     * @public
     */
    public patch(path): superagent.SuperAgentRequest {
        return (
            superagent
                .patch(this.baseUrl + path)
                .set('Host', this.headerHost)
                .set('user-agent', this.userAgent)
        );
    }

    /**
     * POST relative `path` with optional `data` and callback `fn(res)`.
     *
     * @method post
     * @param {String} path
     * @return {Request}
     * @public
     */
    public post(path): superagent.SuperAgentRequest {
        return (
            superagent
                .post(this.baseUrl + path)
                .set('Host', this.headerHost)
                .set('user-agent', this.userAgent)
        );
    }

    /**
     * PUT relative `path` with optional `data` and callback `fn(res)`.
     *
     * @method put
     * @param {String} path
     * @return {Request}
     * @public
     */
    public put(path): superagent.SuperAgentRequest {
        return (
            superagent
                .put(this.baseUrl + path)
                .set('Host', this.headerHost)
                .set('user-agent', this.userAgent)
        );
    }
}

export const request = new Request();
