import { useState, useEffect } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { contractAddresses, abi } from "../constants";
import { BigNumber, ethers, ContractTransaction } from "ethers";
import { Bell, useNotification } from "web3uikit";

function FundMe() {
    type contractAddressesInterface = {
        [key: string]: string[];
    };

    const addresses: contractAddressesInterface = contractAddresses;
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis(); //hex version
    const chainId = parseInt(chainIdHex!, 16); //decimal version
    const FundMeAddress = chainId in addresses ? addresses[chainId][0] : "";
    const [entranceFee, setEntranceFee] = useState("");
    const [funderIndex, setFunderIndex]: any = useState("");
    const [latestFunder, setLatestFunder] = useState("");
    const [funderAddress, setFunderAddress]: any = useState("");
    const [lastestFundedAmount, setLastestFundedAmount] = useState("");

    const dispatch = useNotification();
    const { error, runContractFunction, isFetching, isLoading } = useWeb3Contract({});

    const getMinFundAmtParams = {
        abi: abi,
        contractAddress: FundMeAddress,
        functionName: "getMinFundAmt",
        params: {},
    };

    const fundParams = {
        abi: abi,
        contractAddress: FundMeAddress,
        functionName: "fund",
        params: {},
        msgValue: 500,
    };

    const getFundersParams = {
        abi: abi,
        contractAddress: FundMeAddress,
        functionName: "getFunders",
        params: {
            index: funderIndex,
        },
    };

    const getAddressToAmountFundedParams = {
        abi: abi,
        contractAddress: FundMeAddress,
        functionName: "getAddressToAmountFunded",
        params: {
            funder: funderAddress,
        },
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

    const handleFund = async () => {
        await runContractFunction({
            params: fundParams,
            onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
            onError: (error) => {
                handleError(error);
                console.log(error);
            },
        });
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

    const handleSuccess = async (tx: ContractTransaction) => {
        await tx.wait();
        handleNewNotification(tx);
        updateUI();
    };

    const handleNewNotification = (tx: ContractTransaction) => {
        dispatch({
            type: "info",
            title: "Transaction Notification",
            message: `Transaction Complete`,
            icon: <Bell />,
            position: "topR",
        });
    };

    const handleError = (error: Error) => {
        dispatch({
            type: "info",
            title: "Transaction Notification",
            message: `Transaction Failed, ${error.message}`,
            icon: <Bell />,
            position: "topR",
        });
        updateUI();
    };

    return (
        <main>
            <p className="py-5 font-serif italic border-b-2 ">
                On the Goerli test network at address: 0xb54B26c0c0641339563aCC75910c6052F57F2B07
            </p>
            <div className="p-5">
                {FundMeAddress ? (
                    <div>
                        {error && <div className="text-red-500">{error.message}</div>} You are Connected!
                        <div>
                            <button
                                className="px-4 py-2 ml-auto font-bold text-white bg-red-500 rounded hover:bg-red-700"
                                onClick={handleFund}
                            >
                                Fund
                            </button>
                        </div>
                        <div className="py -5"> Minimum Funding Amount: {entranceFee} ETH</div>
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
                        </div>
                        <div>
                            <button className="px-4 py-2 ml-auto font-bold text-white bg-red-500 rounded hover:bg-red-700">
                                Withdraw
                            </button>
                        </div>
                        <div>Latest Funder Address: {latestFunder}</div>
                        <div>Latest Funder Amount: {lastestFundedAmount} </div>
                    </div>
                ) : (
                    <div>
                        Pleae Connect Your MetaMask Wallet to the Goerli Test Network {FundMeAddress} {chainId} -
                    </div>
                )}
            </div>
        </main>
    );
}

export default FundMe;
