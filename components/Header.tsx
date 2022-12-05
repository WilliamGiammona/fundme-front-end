import { ConnectButton } from "web3uikit";

function Header() {
    return (
        <div>
            <ConnectButton moralisAuth={false} />
        </div>
    );
}

export default Header;
