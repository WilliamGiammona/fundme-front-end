import { useState, useEffect } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { contractAddresses, abi } from "../constants";
import { BigNumber, ethers, ContractTransaction } from "ethers";
import { Bell, useNotification } from "web3uikit";

function RaffleEntrance() {
    type contractAddressesInterface = {
        [key: string]: string[];
    };

    const addresses: contractAddressesInterface = contractAddresses;
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis(); //hex version
    const chainId = parseInt(chainIdHex!, 16); //decimal version
    const raffleAddress = chainId in addresses ? addresses[chainId][0] : "";
    const [entranceFee, setEntranceFee] = useState("0");
    const [numParticipants, setNumParticipants] = useState("0");
    const [winner, setWinner] = useState("0x0000000000000000000000000000000000000000");

    const dispatch = useNotification();
    const { data, error, runContractFunction, isFetching, isLoading } = useWeb3Contract({});

    const enterRaffleParams = {
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    };

    const getMinEntryFeeParams = {
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getMinEntryFee",
        params: {},
    };

    const getNumParticipantsParams = {
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumParticipants",
        params: {},
    };

    const getWinnerParams = {
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getWinner",
        params: {},
    };

    const requestRandomWordsParams = {
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "requestRandomWords",
        params: {},
    };

    async function updateUI() {
        const entranceFeeFromContract = (
            (await runContractFunction({ params: getMinEntryFeeParams })) as BigNumber
        ).toString();
        setEntranceFee(entranceFeeFromContract);
        const numberOfParticipants = (
            (await runContractFunction({ params: getNumParticipantsParams })) as BigNumber
        ).toString();
        setNumParticipants(numberOfParticipants);
        const latestWinner = ((await runContractFunction({ params: getWinnerParams })) as BigNumber).toString();
        setWinner(latestWinner);
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

    const handleSuccess = async (tx: ContractTransaction) => {
        await tx.wait(6);
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
    };

    return (
        <main>
            <p className="italic font-serif py-5 border-b-2 ">
                This raffle is a smart contract on the Goerli test network at address
                0x45b65cec5d2d590cb90276a04b59a9f0726a1b48. The raffle is programmed to select a random winner from a
                list of particpants who must pay the posted ticket price. Once the raffle finishes (only the owner can
                do this), a random number from the chainlink decentralized oracle network is generated and then used to
                randomly select a winner, who automatically receives all ETh in the contract.
            </p>
            <div className="p-5">
                {raffleAddress ? (
                    <div>
                        <div className="border-b-2">
                            <div className="py-2">
                                Ticket Price: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                            </div>
                            <div className="py-2">Number of Participants: {numParticipants}</div>
                            <div className="py-2 font-bold">
                                Recent Winner: <div className="font-normal">{winner}</div>
                            </div>
                        </div>
                        <div className="pt-5">
                            <div className="py-5">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
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
                                    {isFetching || isLoading ? (
                                        <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                                    ) : (
                                        <div>Enter Raffle</div>
                                    )}
                                </button>
                                <div className="text-xs">
                                    (You may need to refresh after your MetaMask transaction goes through)
                                </div>
                            </div>

                            <div className="py-2">
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-auto"
                                    onClick={async () => {
                                        await runContractFunction({
                                            params: requestRandomWordsParams,
                                            onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                                            onError: (error) => {
                                                handleError(error);
                                                console.log(error);
                                            },
                                        });
                                    }}
                                    disabled={isFetching || isLoading}
                                >
                                    {isFetching || isLoading ? (
                                        <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                                    ) : (
                                        <div>Finish Raffle</div>
                                    )}
                                </button>
                                <div className="text-xs">(Only the contract owner can start this raffle)</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>Pleae Connect Your Wallet</div>
                )}
            </div>
        </main>
    );
}

export default RaffleEntrance;
