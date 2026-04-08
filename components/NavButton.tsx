
interface ButtonProps {
    text:string;
}


export default function NavButton({ text }:ButtonProps) {
    
    return(
        <button>{text}</button>
    )
}