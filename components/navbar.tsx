import { Button } from "./ui/button";

export const Navbar = () => {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">RaytonX Learn</h1>
      <div className="flex gap-4">
        <Button variant="link">Login</Button>
        <Button>Browse Newsletter</Button>
      </div>
    </header>
  );
};
