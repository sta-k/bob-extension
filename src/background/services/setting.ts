import {GenericService} from "@src/util/svc";
const bdb = require('bdb');
const DB = require('bdb/lib/db');
import {get, put} from '@src/util/db';

const RPC_HOST_DB_KEY = 'rpc_host';
const RPC_API_KEY_DB_KEY = 'rpc_api_key';
const ANALYTICS_OPT_IN_KEY = 'analytics_opt_in_key';

const DEFAULT_HOST = process.env.DEFAULT_HOST || 'http://dualstack.hapi-prod-lb-365851530.us-west-2.elb.amazonaws.com/hsd';
const DEFAULT_API_KEY = process.env.DEFAULT_API_KEY || '775f8ca39e1748a7b47ff16ad4b1b9ad';

export default class SettingService extends GenericService {
  store: typeof DB;

  getAPI = async () => {
    const apiHost = await get(this.store, RPC_HOST_DB_KEY);
    const apiKey = await get(this.store, RPC_API_KEY_DB_KEY);

    return {
      apiHost: apiHost || DEFAULT_HOST,
      apiKey: apiKey || DEFAULT_API_KEY,
    };
  };

  setRPCHost = async (apiHost: string) => {
    await put(this.store, RPC_HOST_DB_KEY, apiHost);
    return true;
  };

  setRPCKey = async (apiKey: string) => {
    await put(this.store, RPC_API_KEY_DB_KEY, apiKey);
    return true;
  };

  setAnalytics = async (optIn = false) => {
    await put(this.store, ANALYTICS_OPT_IN_KEY, optIn);
    return true;
  };

  getAnalytics = async () => {
    const optIn = await get(this.store, ANALYTICS_OPT_IN_KEY);
    return !!optIn;
  };

  async start() {
    this.store = bdb.create('/setting-store');
    await this.store.open();
  }

  async stop() {

  }
}
