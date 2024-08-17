interface FooterListProps {
    children: React.ReactNode;
  }
  
  const FooterList: React.FC<FooterListProps> = ({ children }) => {
    return (
      <div className="w-full md:w-1/4 sm:w-1/2 lg:w-1/6 mb-6 flex flex-col justify-around gap-2 items-center text-center w-full ">
        
        {children}
      </div>
    );
  }
  
  export default FooterList;