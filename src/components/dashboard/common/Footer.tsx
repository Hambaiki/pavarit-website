function Footer() {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row w-full mx-auto p-4 py-6 md:p-8 md:py-12 space-y-4 space-x-0 md:space-y-0 md:space-x-8">
        <div className="flex-1 space-y-2">
          <div className="flex flex-col space-y-1">
            {/* <Image
              src="/images/logo/pw/pw-light.svg"
              alt="PAVARIT W."
              width={100}
              height={100}
              className="w-24 h-24"
            /> */}
            <h2>PAVARIT W.</h2>
            <p className="text-sm text-gray-300">Developed by Pavarit W.</p>
            <p className="text-sm text-gray-500">
              This website is under development. If you have any questions,
              please contact me.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
