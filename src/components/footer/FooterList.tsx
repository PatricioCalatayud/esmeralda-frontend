interface FooterListProps {
    children: React.ReactNode;
    className?: string;
  }
  
  const FooterList: React.FC<FooterListProps> = ({ children, className }) => {
    return (
      <div className={`${className}`}>
        {children}
      </div>
    );
  }
  
  export default FooterList;