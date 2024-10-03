import Header from "@/components/shared/Header";
import WithAuth from "@/components/shared/WithAuth";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-center min-h-screen w-full bg-primary-50 bg-dotted-pattern bg-cover bg-fixed bg-center">
      <Header />
      <WithAuth>{children}</WithAuth>
    </div>
  );
};

export default Layout;
