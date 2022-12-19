import { useState, useEffect } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { contractAddresses, abi } from "../constants";
import { BigNumber, ethers, ContractTransaction } from "ethers";

function EntranceFee() {
    type contractAddressesInterface = {
        [key: string]: string[];
    };

    const addresses: contractAddressesInterface = contractAddresses;
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis(); //hex version
    const chainId = parseInt(chainIdHex!, 16); //decimal version
    const FundMeAddress = chainId in addresses ? addresses[chainId][0] : "";
    const [entranceFee, setEntranceFee] = useState("");

    const { error, runContractFunction, isFetching, isLoading } = useWeb3Contract({});

    const getMinFundAmtParams = {
        abi: abi,
        contractAddress: FundMeAddress,
        functionName: "getMinFundAmt",
        params: {},
    };

    async function updateUI() {
        const entranceFeeFromContract = (await runContractFunction({ params: getMinFundAmtParams })) as BigNumber;
        const entranceFeeToString = ethers.utils.formatEther(entranceFeeFromContract);
        setEntranceFee(entranceFeeToString.toString());
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

    return <div>EntranceFee: {entranceFee} ETH</div>;
}

export default EntranceFee;
