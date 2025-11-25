import Image from "next/image";
import CyberCanvas from "./CyberCanvas";

export default function Home() {
  return (
    <>
      <CyberCanvas />
      <main>
        <div className="flex flex-center">
          <h1>Timer</h1>
        </div>
      </main>
    </>
  );
}
