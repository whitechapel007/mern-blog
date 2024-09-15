import { Button } from "flowbite-react";

const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-6 border border-teal-500 justify-between items-center rounded-tl-3xl">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">want to learn more about javascript</h2>
        <p className="text-gray-500 my-2 ">
          Checkout these resources with 100 javascript projects{" "}
        </p>

        <Button gradientDuoTone="purpleToPink" className="w-3/4">
          Learn more
        </Button>
      </div>
      <div className="p-7 flex-1  flex justify-center">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaERathZl4oiIQfs70fGsf-GWMH0bZe2x2eQ&s"
          alt=""
          className="w-3/4"
        />
      </div>
    </div>
  );
};

export default CallToAction;
