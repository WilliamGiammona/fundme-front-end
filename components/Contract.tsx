import { useState, useEffect } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { contractAddresses, abi } from "../constants";
import { BigNumber, ethers, ContractTransaction } from "ethers";
import { Bell, useNotification } from "web3uikit";

function Component() {
    type contractAddressesInterface = {
        [key: string]: string[];
    };

    const addresses: contractAddressesInterface = contractAddresses;
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis(); //hex version
    const chainId = parseInt(chainIdHex!, 16); //decimal version
    const contractAddress = chainId in addresses ? addresses[chainId][0] : "";

    const dispatch = useNotification();
    const { error, runContractFunction, isFetching, isLoading } = useWeb3Contract({});

    // const contractFunctionParams = {
    //     abi: abi,
    //     contractAddress: raffleAddress,
    //     functionName: "enterRaffle",
    //     params: {},
    //     msgValue: entranceFee,
    // };

    async function updateUI() {
        const entranceFeeFromContract = (
            (await runContractFunction({ params: contractFunctionParams })) as BigNumber
        ).toString();
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

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
            <p className="py-5 font-serif italic border-b-2 ">Random Text</p>
            <div className="p-5">
                {ContractAddress ? (
                    <div>
                        {error && <div className="text-red-500">{error.message}</div>}
                        <div className="pt-5">
                            <div className="py-5">
                                <button
                                    className="px-4 py-2 ml-auto font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                                    onClick={async () => {
                                        await runContractFunction({
                                            params: enterRaffleParams,
                                            onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                                            onError: (error) => {
                                                handleError(error);
                                                console.log(error);
                                            },
                                        });
                                    }}
                                    disabled={isFetching || isLoading}
                                >
                                    {isFetching || isLoading || isWaiting ? (
                                        <div className="w-8 h-8 border-b-2 rounded-full animate-spin spinner-border"></div>
                                    ) : (
                                        <div>Function</div>
                                    )}
                                </button>
                                <div className="text-xs">
                                    (You may need to refresh after your MetaMask transaction goes through, this may take
                                    several miniutes)
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>Pleae Connect Your MetaMask Wallet to the Goerli Test Network</div>
                )}
            </div>
        </main>
    );
}

export default Component;
