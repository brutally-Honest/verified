import { Link } from "react-router-dom";
import verified from "../../assets/verified.png";
import { useTypewriter, Cursor } from "react-simple-typewriter";
export const Home = () => {
  const [text] = useTypewriter({
    words: [
      "Track and monitor individuals entering a facility",
      "Ensure secure environment for streamlined check-ins",
      "Maintain robust security protocols to enhance safety",
    ],
    loop: {},
    typeSpeed: 50,
    deleteSpeed: 20,
  });
  return (
    <div className="h-screen">
      <div className=" bg-gradient-to-r from-cyan-500 to-blue-500  h-full flex flex-col items-center">
        <header className="glitch  uppercase ">verified</header>
        <p className="font-light md:text-3xl sm:text-lg z-10">
          A <span className="font-medium  underline">Visitor Management System</span> designed to efficiently{" "}
        </p>
        <div
          className={`mb-2 mt-[-60px] md:w-[600px] sm:w-[320px] md:h-[350px] flex flex-col items-center justify-center vLogo`}
        >
          <p className=" roboto-slab md:font-semibold sm:font-medium md:text-xl/6 sm:text-lg">
            {text} <Cursor />
          </p>
          <div className="underline font-medium  p-1 px-2 m-2 cursor-pointer">
            <Link to={"/register"}>Join Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
