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

    const { runContractFunction: getNumParticipants } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumParticipants",
        params: {},
    });

    const { runContractFunction: getWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getWinner",
        params: {},
    });

    const { runContractFunction: requestRandomWords } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "requestRandomWords",
        params: {},
    });

    async function updateUI() {
        const entranceFeeFromContract = ((await getMinEntryFee()) as BigNumber).toString();
        setEntranceFee(entranceFeeFromContract);
        const numberOfParticipants = ((await getNumParticipants()) as BigNumber).toString();
        setNumParticipants(numberOfParticipants);
        const latestWinner = ((await getWinner()) as BigNumber).toString();
        setWinner(latestWinner);
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

    const handleSuccess = async (tx: ContractTransaction) => {
        await tx.wait(1);
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

    return (
        <div>
            {raffleAddress ? (
                <div>
                    <button
                        onClick={async () => {
                            await enterRaffle({
                                onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                                onError: (error) => console.log(error),
                            });
                        }}
                    >
                        Enter Raffle
                    </button>
                    <br />
                    RaffleEntranceFee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                    <br />
                    Number of Participants: {numParticipants}
                    <br />
                    Winner: {winner}
                    <br />
                    <button
                        onClick={async () => {
                            await requestRandomWords({
                                onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                                onError: (error) => console.log(error),
                            });
                        }}
                    >
                        Start Raffle
                    </button>
                </div>
            ) : (
                <div>No Raffle Address Detected</div>
            )}
        </div>
    );
}

export default RaffleEntrance;
