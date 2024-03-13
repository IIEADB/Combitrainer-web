import styles from "./companylogo.module.css"; // Importing CSS from external .css file

export const CompanyLogo = () => {
    return (
        <div className={styles.container}>
            <img style={{ width: "20vw", minWidth: "250px" }} alt="combitrainer" src={"/bluelogo.svg"} />
            <div className={styles.textContainer}>
                <span className={styles.text}>Powered by</span>
                <img src={"/Combitech_Logo_Blue@2x.png"} className={styles.logo} alt="combitech" />
            </div>
        </div>
    );
};
