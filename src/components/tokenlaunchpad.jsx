import AnimatedButton from "./AnimatedButton";

export function TokenLaunchpad() {
  const createToken = () => {
    console.log("Creating Token...");
    // Add your token creation logic here
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
      }}
    >
      <div className="card">
        <div className="card-content">
          <h1>Solana Token Launchpad</h1>

          <input className="inputText" type="text" placeholder="Name" />

          <input className="inputText" type="text" placeholder="Symbol" />

          <input className="inputText" type="text" placeholder="Image URL" />

          <input
            className="inputText"
            type="text"
            placeholder="Initial Supply"
          />

          <AnimatedButton
            text="Create Token"
            color="#34342e"
            onClick={createToken}
          />
        </div>
      </div>
    </div>
  );
}