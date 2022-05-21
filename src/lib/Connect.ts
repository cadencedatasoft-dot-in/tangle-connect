import {
    SingleNodeClient
} from "@iota/iota.js";
import * as zmq from "zeromq"

export const API_ENDPOINT = 'https://api.lb-0.h.chrysalis-devnet.iota.cafe:443';
export const ZMQ_ENDPOINT = 'tcp://zmq.devnet.iota.org:5556';
export type WatcherFunctionType = (address: string, balance: number) => void;

export class Connect {
    private static instance: Connect;
    private client;
    private q;
    private watching: boolean;

    private constructor(api_endpoint: string) {
        this.client = new SingleNodeClient(api_endpoint);
        this.q = new zmq.Subscriber;
        this.watching = false;
    }

    public static getInstance(): Connect {
        if (!Connect.instance) {
            Connect.instance = new Connect(API_ENDPOINT);
        }

        return Connect.instance;
    }

    private validAddress(addr: string) {
        console.log(addr);
        return true;
    }

    getBalanceInfo(addr: string) {
        //Ideally should return error messages
        if (!this.validAddress(addr)) {
            return undefined;
        }
        return this.client.addressOutputs(addr)
            .then((r) => {
                const addr = r.address;
                if (addr) {
                    return this.client.addressEd25519(addr)
                        .then((r1) => {
                            return r1.balance
                        }).catch(() => {
                            return undefined
                        });
                } else {
                    return undefined;
                }
            }).catch(() => {
                return undefined
            });
    }

    watchAddress(addr: string) {
        //Ideally should return error messages
        if (this.validAddress(addr)) {
            if (this.q) {
                this.q.subscribe(addr);
            }
        }
        return false;
    }

    async startWatching(subscriber: WatcherFunctionType) {
        if (this.watching) {
            return
        } else {
            this.watching = true;
        }

        const watching = async () => {
            while (this.watching) {
                const data = await this.q.receive();
                const msg = (new String(data).split(" "));
                const balance = parseInt(msg[1]);
                switch (msg[0]) {
                    default:
                        subscriber(msg[0], balance);
                }
                //Throttle if required
            }
        }

        watching();
    }

    stopWatching() {
        if (this.watching) {
            this.watching = false;
        }
    }
}
