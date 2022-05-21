import {
    SingleNodeClient
} from "@iota/iota.js";

export const API_ENDPOINT = 'https://api.lb-0.h.chrysalis-devnet.iota.cafe:443';
export const ZMQ_ENDPOINT = 'tcp://zmq.devnet.iota.org:5556';
export type WatcherFunctionType = (address: string, balance: number) => void;

export class Connect {
    private static instance: Connect;
    private client;

    private constructor(api_endpoint: string) {
        this.client = new SingleNodeClient(api_endpoint);
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
}
