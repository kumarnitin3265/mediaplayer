
import navStyle from "./Navbar.module.css";

function Navbar(){
    return (
        <>
            <div className={navStyle.home}>
                <div>
                    <a href="/">Home</a>
                </div>
                <div>
                    <a href="/videoPlayer">VideoPlayer</a>          
                </div>
                <div>
                    <a href="audioPlayer">AudioPlayer</a>
                </div>
            </div>
            {/* <OutletContext/> */}
        </>
    )
}

export default Navbar;