import { useState, useEffect } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { contractAddresses, abi } from "../constants";
import { BigNumber, ethers, ContractTransaction } from "ethers";

function FunderIndex() {
    type contractAddressesInterface = {
        [key: string]: string[];
    };

    const addresses: contractAddressesInterface = contractAddresses;
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis(); //hex version
    const chainId = parseInt(chainIdHex!, 16); //decimal version
    const FundMeAddress = chainId in addresses ? addresses[chainId][0] : "";

    const [funderIndex, setFunderIndex]: any = useState("");
    const [latestFunder, setLatestFunder] = useState("");

    const { error, runContractFunction, isFetching, isLoading } = useWeb3Contract({});

    const getFundersParams = {
        abi: abi,
        contractAddress: FundMeAddress,
        functionName: "getFunders",
        params: {
            index: funderIndex,
        },
    };

    const handleFunderIndexChange = async (event: any) => {
        setFunderIndex(event.target.value);
    };

    const handleFunderIndexSubmit = async (event: any) => {
        event.preventDefault();
        const Funder = (await runContractFunction({ params: getFundersParams })) as BigNumber;
        const FunderToString = await Funder.toString();
        setLatestFunder(FunderToString);
        setFunderIndex("");
    };
    return (
        <div>
            <form onSubmit={handleFunderIndexSubmit}>
                <label htmlFor="funders">Get Funders: </label>
                <input
                    className="px-5 border-2 border-black rounded-lg"
                    type="number"
                    id="funders"
                    name="funders"
                    placeholder="Enter index position"
                    value={funderIndex}
                    onChange={(event) => {
                        handleFunderIndexChange(event);
                    }}
                />
                <div>
                    <button
                        className="px-4 py-2 ml-auto font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                        type="submit"
                    >
                        Submit position
                    </button>
                </div>
            </form>
            <div>Latest Funder Address: {latestFunder}</div>
        </div>
    );
}

export default FunderIndex;
