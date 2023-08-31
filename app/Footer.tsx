import Link from "next/link";

const Footer = () => {
  return (
    <div className="absolute bottom-0 w-full py-4 flex gap-2 items-center justify-center text-sm">
      Made with 💩 by{" "}
      <Link
        href="https://theindiehacker.tech"
        target="_blank"
        className="text-gray-400 hover:underline"
      >
        the indie hacker
      </Link>
    </div>
  );
};

export default Footer;
