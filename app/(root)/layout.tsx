import WithAuth from "@/components/shared/WithAuth";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center min-h-screen w-full bg-dotted-pattern bg-cover bg-fixed bg-center">
      <div className=" max-w-screen-xl w-full h-full">
        <WithAuth>{children}</WithAuth>
      </div>
    </div>
  );
};

export default Layout;
