import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export function NavBar() {
  const { ready, authenticated, login } = usePrivy();

  const showLoginButton = ready && !authenticated;
  const showUserMenu = ready && authenticated;

  const pathname = usePathname();

  return (
    <div className="sticky top-0 left-0 z-40 w-full">
      <nav className="w-full py-4 px-6 flex justify-between items-center border-b border-b-neutral-700">
        <Link href="/" className="flex h-8 gap-0.5">
          <h1 className="font-mono font-bold text-2xl">BETOKEN</h1>
          <span className="self-start">
            <div className="px-1 py-0.5 bg-foreground rounded-full items-center justify-center">
              <div className="text-center text-[5.5px] text-background">
                ALPHA
              </div>
            </div>
          </span>
        </Link>
        {showLoginButton && (
          <Button onClick={login} variant="secondary">
            LOG IN
          </Button>
        )}
      </nav>
    </div>
  );
}
