import Image from "next/image";

export default function Home() {
  return (
    <div className="m-10 h-screen flex items-center justify-center ">
      <Image
        alt="Freestyle Logo"
        src="/placeholder-freestyle-logo.svg"
        width={347}
        height={280}
        className="opacity-10 w-48"
      />
    </div>
  );
}
