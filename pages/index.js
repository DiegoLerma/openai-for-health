import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setUserInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Triage GTO</title>
        <link rel="icon" href="/gto.png" />
      </Head>

      <main className={styles.main}>
        <img src="/gto.png" className={styles.icon} />
        <h3>Triage Guanajuato</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="user"
            placeholder="Indique sus sintomas"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <input type="submit" value="Enviar" />
        </form>
        <div className={styles.result}>
          <p className="result">
            {result}
            </p>
          </div>
      <footer>
        <div className="footerContainer">
          <p className="footer_text">Adaptado por Diego Lerma para el <b>Día de la Mentefactura</b>, Guanajuato</p>
        </div>
      </footer>
      </main>
    </div>
  );
}
