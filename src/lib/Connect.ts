import {
    SingleNodeClient
} from "@iota/iota.js";
export const API_ENDPOINT = 'https://api.lb-0.h.chrysalis-devnet.iota.cafe:443';

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

    getBalanceInfo(addr: string) {
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
