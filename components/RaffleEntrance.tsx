import { useState, useEffect } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { contractAddresses, abi } from "../constants";
import { BigNumber, ethers, ContractTransaction } from "ethers";

function RaffleEntrance() {
    type contractAddressesInterface = {
        [key: string]: string[];
    };

    const addresses: contractAddressesInterface = contractAddresses;
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis(); //hex version
    const chainId = parseInt(chainIdHex!, 16); //decimal version
    const raffleAddress = chainId in addresses ? addresses[chainId][0] : "";
    const [entranceFee, setEntranceFee] = useState("0");

    const {
        data,
        error,
        runContractFunction: enterRaffle,
        isFetching,
        isLoading,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    });

    const { runContractFunction: getMinEntryFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getMinEntryFee",
        params: {},
    });

    useEffect(() => {
        if (isWeb3Enabled) {
            async function updateUI() {
                const entranceFeeFromContract = ((await getMinEntryFee()) as BigNumber).toString();
                setEntranceFee(entranceFeeFromContract);
                console.log(entranceFeeFromContract);
            }
            updateUI();
        }
    }, [isWeb3Enabled]);

    return <div>RaffleEntranceFee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>;
}

export default RaffleEntrance;
