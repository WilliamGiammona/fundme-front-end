import contractAddresses from "./contractAddresses.json";
import contractABIs from "./contractABIs.json";

type ContractAddresses = {
    [key: string]: string[];
};

type ContractABIs = {
    [key: string]: any;
};

const addresses: ContractAddresses = contractAddresses;

export { addresses };
