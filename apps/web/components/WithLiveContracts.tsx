import { useNetwork } from "wagmi";
import useAppContractsConf, {
  ContractConf,
} from "../hooks/useContractAddresses";

export type WithLiveContractsProps = {
  chainId: number;
  contracts: ContractConf;
};

function withLiveContracts<T extends WithLiveContractsProps>(
  WrappedComponent: React.ComponentType<T>
) {
  const displayName = WrappedComponent.displayName || "Component";

  const ComponentWithLiveContracts = (
    props: Omit<T, keyof WithLiveContractsProps>
  ) => {
    const contracts = useAppContractsConf();
    const { chain } = useNetwork();

    if (chain?.unsupported) {
      return <p>Chain unsupported</p>;
    }

    if (!chain?.id) {
      return <p>Not active network</p>;
    }

    return (
      <WrappedComponent
        {...(props as T)}
        chainId={chain.id}
        contracts={contracts[chain.id]}
      />
    );
  };

  ComponentWithLiveContracts.displayName = `withLiveContracts(${displayName})`;

  return ComponentWithLiveContracts;
}

export default withLiveContracts;
