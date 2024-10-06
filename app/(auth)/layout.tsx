const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className=" flex justify-center min-h-[calc(100vh-250px)] w-full 
    flex-center bg-dotted-pattern bg-cover bg-fixed bg-center"
    >
      <div className=" max-w-screen-xl w-full h-full flex-1 px-[4%] flex-center">
        {children}
      </div>
    </div>
  );
};

export default Layout;
