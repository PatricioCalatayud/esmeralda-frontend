interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

const Container: React.FC<ContainerProps>= ({children, className}) => {
    return ( <div className={`max-w-[1920px] mx-auto x1:px-20 md:px-2 px-4 justify-around ${className}`}>
        {children}
    </div> );
}
 
export default Container ;