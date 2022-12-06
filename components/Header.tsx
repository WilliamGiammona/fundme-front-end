import { ConnectButton } from "web3uikit";

function Header() {
    return (
        <div>
            Decentralized Raffle
            <ConnectButton moralisAuth={false} />
        </div>
    );
}

export default Header;
