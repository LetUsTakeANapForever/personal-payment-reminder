"use client";

import { useRouter } from "next/navigation";

function NotFoundPage() {
  const router = useRouter();

  const handleNavigation = () => {
    router.push("/");
  };

  return (
    <div>
      <h1>The page you're looking for does not exist.</h1>
      <button
        className="text-black bg-gray-300 hover: cursor-pointer underline"
        onClick={handleNavigation}
      >
        Back to HomePage
      </button>
    </div>
  );
}

export default NotFoundPage;
