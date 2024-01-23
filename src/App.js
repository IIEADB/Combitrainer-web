import logo from "./logo.svg";
import "./App.css";
import Login from "./Login";
function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://IIEADB.github.io/Combitrainer-web/?event=4205e91e-148f-4749-a56a-7bb37b5ae2d6"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Click
                </a>
                <div className="App">
                    <Login />
                </div>
            </header>
        </div>
    );
}

export default App;
