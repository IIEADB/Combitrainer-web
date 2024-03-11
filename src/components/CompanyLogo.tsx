import "./CompanyLogo.css"; // Importing CSS from external .css file

export const CompanyLogo = () => {
    return (
        <div className="container">
            <img style={{ width: "20vw", minWidth: "250px" }} alt="combitrainer" src={"/bluelogo.svg"} />
            <div className="textContainer">
                <span className="text">Powered by</span>
                <img src={"/Combitech_Logo_Blue@2x.png"} className="logo" alt="combitech" />
            </div>
        </div>
    );
};
