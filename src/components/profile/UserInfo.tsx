import { FaUser } from "react-icons/fa";

import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";

interface UserInfoProps {
  name: string;
  picture: string;
  email: string;
  emailVerified: boolean;
}

function UserInfo({ name, picture, email, emailVerified }: UserInfoProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center space-y-4 space-x-0 sm:space-x-8 sm:space-y-0">
      {picture ? (
        <img
          src={picture}
          alt="profile"
          width={96}
          height={96}
          className="object-cover rounded-full"
        />
      ) : (
        <FaUser className="w-48 h-48" />
      )}

      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold">{name}</h1>

        <div className="flex flex-col space-y-1">
          <p className="text-neutral-300">{email}</p>
          <div className="text-neutral-300">
            {emailVerified ? (
              <div className="flex items-center space-x-2">
                <FaCircleCheck className="w-4 h-4 text-green-500" />
                <span className="text-green-500 text-sm">Verified</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <FaCircleXmark className="w-4 h-4 text-red-500" />
                <span className="text-red-500 text-sm">
                  This email is not verified
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
