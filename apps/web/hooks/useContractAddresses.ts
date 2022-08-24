import HardhatGreeter from "../artifacts/hardhat/Greeter.json";
import MumbaiGreeter from "../artifacts/mumbai/Greeter.json";

export type ContractConf = {
  abi: any;
  address: string;
};

export type AppContractConf = {};

const useAppContractsConf = (): Record<number, AppContractConf> => {
  return {
    31337: {},
    80001: {},
    1: {},
    5: {},
  };
};

export default useAppContractsConf;
