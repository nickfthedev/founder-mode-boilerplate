import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center">
      <div className="flex flex-col items-center space-y-4 text-center">
        <Image src="/404_cat.png" alt="404" width={256} height={256} />
        <h2 className="mb-4 text-2xl font-bold">404 - Page not found</h2>
        <p className="mb-4">The page you are looking for does not exist.</p>
        <Button asChild>
          <Link href="/" className=" ">
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
}
