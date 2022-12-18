import { useState, useEffect } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { contractAddresses, abi } from "../constants";
import { BigNumber, ethers, ContractTransaction } from "ethers";

function FunderAddress() {
    type contractAddressesInterface = {
        [key: string]: string[];
    };

    const addresses: contractAddressesInterface = contractAddresses;
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis(); //hex version
    const chainId = parseInt(chainIdHex!, 16); //decimal version
    const FundMeAddress = chainId in addresses ? addresses[chainId][0] : "";

    const [funderAddress, setFunderAddress]: any = useState("");
    const [lastestFundedAmount, setLastestFundedAmount] = useState("");

    const { error, runContractFunction, isFetching, isLoading } = useWeb3Contract({});

    const getAddressToAmountFundedParams = {
        abi: abi,
        contractAddress: FundMeAddress,
        functionName: "getAddressToAmountFunded",
        params: {
            funder: funderAddress,
        },
    };

    const handleFunderAddressChange = async (event: any) => {
        setFunderAddress(event.target.value);
    };

    const handleFunderAddressSubmit = async (event: any) => {
        event.preventDefault();
        const FunderAddress = (await runContractFunction({ params: getAddressToAmountFundedParams })) as BigNumber;
        const FunderAddressToString = await FunderAddress.toString();
        console.log(FunderAddressToString);
        setLastestFundedAmount(FunderAddressToString);

        setFunderAddress("");
    };

    return (
        <div>
            <form onSubmit={handleFunderAddressSubmit}>
                <label htmlFor="amount-funded">Get Amount Funded: </label>
                <input
                    className="px-5 border-2 border-black rounded-lg"
                    type="text"
                    id="amount-funded"
                    name="amount-funded"
                    placeholder="Enter funder address"
                    value={funderAddress}
                    onChange={(event) => {
                        handleFunderAddressChange(event);
                    }}
                />
                <div>
                    <button
                        className="px-4 py-2 ml-auto font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                        type="submit"
                    >
                        Submit Funder Address
                    </button>
                </div>
            </form>
            <div>Latest Funder Amount: {lastestFundedAmount} </div>
        </div>
    );
}

export default FunderAddress;
