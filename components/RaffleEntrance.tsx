import { useWeb3Contract, useMoralis } from "react-moralis";
import { contractAddresses, abi } from "../constants";

function RaffleEntrance() {
    type contractAddressesInterface = {
        [key: string]: string[];
    };

    const addresses: contractAddressesInterface = contractAddresses;
    const { chainId: chainIdHex } = useMoralis(); //hex version
    const chainId = parseInt(chainIdHex!, 16); //decimal version
    const raffleAddress = chainId in addresses ? addresses[chainId][0] : null;

    // const { data, error, runContractFunction: enterRaffle, isFetching, isLoading } =
    // useWeb3Contract({
    //   abi: usdcEthPoolAbi,
    //   contractAddress: usdcEthPoolAddress,
    //   functionName: "enterRaffle",
    //   params: {},
    //   msg.Value:
    // });
    return <div>RaffleEntrance</div>;
}

export default RaffleEntrance;
