import React, { useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Home, Users, Menu, X , Spade } from "lucide-react";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import AuthRoleRequire from "@/components/router/AuthRoleRequire";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  const NavItems = [
    {
      name: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      route: "/dashboard",
    },
    {
      name: "Interns",
      icon: <Users className="h-5 w-5" />,
      route: "/dashboard/interns",
    },
    {
      name: "Events",
      icon: <Spade className="h-5 w-5" />,
      route: "/dashboard/events",
    }
  ];

  const handleNavigate = useCallback(
    (route: string) => {
      navigate(route);
      setMobileOpen(false);
    },
    [navigate]
  );

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("You have successfully signed out");
      navigate("/admin/login");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <AuthRoleRequire role="admin">
      <div className="flex h-screen w-full overflow-hidden bg-gray-50">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden md:flex flex-col border-r  bg-muted/40 transition-all duration-300 ease-in-out bg-white",
            collapsed ? "w-20" : "w-64"
          )}
        >
          <div className="flex h-16 items-center  px-4 border-b bg-blue-950 text-white">
            <h1
              className={cn(
                "text-xl font-semibold text-primary whitespace-nowrap",
                collapsed ? "hidden" : "block"
              )}
            >
              CMS Admin
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto rounded-full"
              onClick={toggleSidebar}
            >
              {collapsed ? (
                <Menu className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {NavItems.map((item) => (
                <Button
                  key={item.route}
                  variant={pathname === item.route ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    collapsed ? "px-3" : "px-4",
                    pathname === item.route && "font-semibold"
                  )}
                  onClick={() => handleNavigate(item.route)}
                >
                  {item.icon}
                  {!collapsed && item.name}
                </Button>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 text-destructive hover:text-destructive",
                    collapsed ? "px-3" : "px-4"
                  )}
                >
                  <LogOut className="h-5 w-5" />
                  {!collapsed && "Sign Out"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to sign out?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be redirected to the sign in page. Make sure you've
                    saved your work before signing out.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSignOut}>
                    Sign Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative flex h-full w-72 flex-col bg-white border-r">
              <div className="flex h-16 items-center px-4 border-b">
                <h1 className="text-xl font-semibold text-primary">
                  CMS Admin
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto rounded-full"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-2">
                  {NavItems.map((item) => (
                    <Button
                      key={item.route}
                      variant={pathname === item.route ? "secondary" : "ghost"}
                      className="w-full justify-start gap-3 px-4"
                      onClick={() => handleNavigate(item.route)}
                    >
                      {item.icon}
                      {item.name}
                    </Button>
                  ))}
                </nav>
              </div>
              <div className="p-4 border-t">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 text-destructive hover:text-destructive px-4"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to sign out?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        You will be redirected to the sign in page. Make sure
                        you've saved your work before signing out.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSignOut}>
                        Sign Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="flex h-16 items-center gap-4 border-b bg-muted/40 px-4 md:px-6 bg-blue-950 text-white">
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>

            <div className="flex-1">
              <h1 className="text-lg font-semibold">
                {NavItems.find((item) => item.route === pathname)?.name ||
                  "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* User profile or other header items can go here */}
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </AuthRoleRequire>
  );
}

export default AdminLayout;
